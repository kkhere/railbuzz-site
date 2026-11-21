import { useCallback, useEffect, useState } from "react";

// Recent searches, so a visitor who checks the same train or PNR again and
// again can tap it instead of recalling it (the owner, 19 November 2026).
// Kept in this browser only (localStorage), never sent to our server: the
// last 5 of each kind, newest first, the same one moved to the front. A PNR
// goes 2 days after its journey (no use by then; less left on a shared
// computer); one with no journey date, 7 days after it was checked.
//
// Trains are remembered when their page is opened (TrainView), from the
// search box or from Google alike; a PNR, a From–To and a station board when
// their answer comes back.

export const MAX_RECENT = 5;
const PNR_KEEP_AFTER_JOURNEY_DAYS = 2;
const PNR_KEEP_UNDATED_DAYS = 7;
const DAY = 24 * 3600_000;

export type RecentTrain = { number: string; name: string };
export type RecentPnr = { pnr: string; train: string; date: string | null; at: number };
export type RecentStation = { code: string; name: string };
export type RecentRoute = { from: RecentStation; to: RecentStation };

type Kinds = {
  trains: RecentTrain;
  pnrs: RecentPnr;
  routes: RecentRoute;
  stations: RecentStation;
};
export type RecentKind = keyof Kinds;

const KEYS: Record<RecentKind, string> = {
  trains: "recent_trains",
  pnrs: "recent_pnrs",
  routes: "recent_routes",
  stations: "recent_stations",
};

const str = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= max;
const isStation = (v: unknown): v is RecentStation => {
  const s = v as RecentStation;
  return !!s && str(s.code, 8) && /^[A-Z0-9]+$/.test(s.code) && str(s.name, 80);
};

/** What a stored item must look like (storage can hold anything); and the one key that makes two the same. */
const SHAPES: {
  [K in RecentKind]: { valid: (v: unknown) => v is Kinds[K]; id: (v: Kinds[K]) => string };
} = {
  trains: {
    valid: (v): v is RecentTrain => {
      const t = v as RecentTrain;
      return !!t && str(t.number, 6) && /^\d+$/.test(t.number) && str(t.name, 80);
    },
    id: (t) => t.number,
  },
  pnrs: {
    valid: (v): v is RecentPnr => {
      const p = v as RecentPnr;
      return (
        !!p &&
        str(p.pnr, 10) &&
        /^\d{10}$/.test(p.pnr) &&
        typeof p.train === "string" &&
        /^\d{0,6}$/.test(p.train) &&
        (p.date === null || (typeof p.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.date))) &&
        typeof p.at === "number"
      );
    },
    id: (p) => p.pnr,
  },
  routes: {
    valid: (v): v is RecentRoute => {
      const r = v as RecentRoute;
      return !!r && isStation(r.from) && isStation(r.to) && r.from.code !== r.to.code;
    },
    id: (r) => `${r.from.code}>${r.to.code}`,
  },
  stations: { valid: isStation, id: (s) => s.code },
};

/** "YYYY-MM-DD" of this device's day, `days` from `now`. */
function localDay(now: number, days = 0): string {
  const d = new Date(now + days * DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** A PNR still worth offering: its journey not more than 2 days ago. */
export function pnrStillUseful(p: RecentPnr, now: number): boolean {
  if (p.date) return p.date >= localDay(now, -PNR_KEEP_AFTER_JOURNEY_DAYS);
  return now - p.at < PNR_KEEP_UNDATED_DAYS * DAY;
}

function load<K extends RecentKind>(kind: K, now = Date.now()): Kinds[K][] {
  let raw: unknown;
  try {
    raw = JSON.parse(localStorage.getItem(KEYS[kind]) ?? "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  const shape = SHAPES[kind];
  let list = raw.filter(shape.valid) as Kinds[K][];
  if (kind === "pnrs") list = list.filter((p) => pnrStillUseful(p as RecentPnr, now));
  return list.slice(0, MAX_RECENT);
}

const CHANGED = "railbuzz:recent";

function save<K extends RecentKind>(kind: K, list: Kinds[K][]) {
  try {
    if (list.length) localStorage.setItem(KEYS[kind], JSON.stringify(list));
    else localStorage.removeItem(KEYS[kind]);
  } catch {
    // Storage refused (private browsing, full): nothing is remembered.
  }
  // Every box on the page showing this kind, at once.
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: kind }));
}

/** Puts one at the front: the same one moves up, the oldest beyond 5 goes. */
export function remember<K extends RecentKind>(kind: K, item: Kinds[K]) {
  if (typeof window === "undefined") return;
  const shape = SHAPES[kind];
  if (!shape.valid(item)) return;
  const id = shape.id(item);
  save(kind, [item, ...load(kind).filter((x) => shape.id(x) !== id)].slice(0, MAX_RECENT));
}

export function forget<K extends RecentKind>(kind: K, item: Kinds[K]) {
  const id = SHAPES[kind].id(item);
  save(
    kind,
    load(kind).filter((x) => SHAPES[kind].id(x) !== id),
  );
}

export function forgetAll(kind: RecentKind) {
  save(kind, []);
}

/**
 * The recent ones of a kind, read after the page is up (the server's HTML has
 * none, so the first paint matches it), and kept in step with every change:
 * on this page, and in the site's other tabs.
 */
export function useRecent<K extends RecentKind>(kind: K) {
  const [list, setList] = useState<Kinds[K][]>([]);
  useEffect(() => {
    const read = () => setList(load(kind));
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === kind) read();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === KEYS[kind]) read();
    };
    read();
    window.addEventListener(CHANGED, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGED, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [kind]);
  const remove = useCallback((item: Kinds[K]) => forget(kind, item), [kind]);
  const clear = useCallback(() => forgetAll(kind), [kind]);
  return { list, remove, clear };
}
