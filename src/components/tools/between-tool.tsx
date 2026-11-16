import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ArrowRight, Loader2, Search, TrainFront } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { StationPicker, type Station } from "@/components/station-picker";
import { type BetweenResult, errorText, loadStations, lookup, type LookupError } from "@/lib/rail-api";
import { durationText, hasPage } from "@/lib/trains";

// Every train between two stations, from RailRadar through the admin route
// (kind "between"). An answer is kept six hours and shared with the app, so a
// route someone asked about recently costs nothing.
//
// "Nearby stations", as in the app (ui/search/NearbyStations.kt): the trains
// from the other main stations in each one's city too, so Secunderabad to
// Bengaluru takes in Kacheguda's. On unless the visitor turns it off, and
// remembered on this browser. The admin route makes the list, as the app's
// railradar function does (nearby.ts); this page says where each train is
// caught when it is not at the stations typed, and filters by that station.

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Row = BetweenResult["trains"][number];

/** The box remembered on this browser, as the app keeps it on the phone ("nearby_stations"). */
const NEARBY_KEY = "nearby_stations";

/** Stations shown as filters before "+N more" (the app's NearbyStations.SHOWN). */
const SHOWN = 3;

function station(name: string | undefined, code: string): string {
  return !name || name.toUpperCase() === code.toUpperCase() ? code : `${name} (${code})`;
}

/**
 * The line on a train's card when it is caught or left at a station other
 * than the ones typed: "From Kacheguda (KCG)", "To Yesvantpur (YPR)", or
 * both, "Kacheguda (KCG) → Yesvantpur (YPR)". Null when it calls at both.
 */
function note(t: Row, askedFrom: string, askedTo: string): string | null {
  const fromCode = t.fromCode || askedFrom;
  const toCode = t.toCode || askedTo;
  const otherFrom = fromCode.toUpperCase() !== askedFrom.toUpperCase();
  const otherTo = toCode.toUpperCase() !== askedTo.toUpperCase();
  const from = station(t.fromName, fromCode);
  const to = station(t.toName, toCode);
  if (otherFrom && otherTo) return `${from} → ${to}`;
  if (otherFrom) return `From ${from}`;
  if (otherTo) return `To ${to}`;
  return null;
}

type FromStation = { code: string; name: string; count: number };

/**
 * Each station the trains leave from and how many do, the typed station first
 * and then the most (Secunderabad Jn 34, Charlapalli 22, ...). Empty when
 * every train leaves from the typed one.
 */
function fromStations(trains: Row[], askedFrom: string): FromStation[] {
  const asked = askedFrom.toUpperCase();
  const by = new Map<string, FromStation>();
  for (const t of trains) {
    const code = (t.fromCode || asked).toUpperCase();
    const s = by.get(code) ?? { code, name: t.fromName || code, count: 0 };
    s.count++;
    by.set(code, s);
  }
  if (by.size === 0 || (by.size === 1 && by.has(asked))) return [];
  return [...by.values()].sort((a, b) => Number(a.code !== asked) - Number(b.code !== asked) || b.count - a.count);
}

/** The "Nearby stations" box; the whole label takes the tap. */
function NearbyBox({ id, checked, onChange, className }: { id: string; checked: boolean; onChange: (on: boolean) => void; className: string }) {
  return (
    <label
      htmlFor={id}
      title="Also show trains from the other main stations in the same city, such as Kacheguda for Secunderabad"
      className={"-my-2 cursor-pointer select-none items-center gap-2 py-2 text-sm font-medium text-foreground " + className}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 cursor-pointer accent-primary"
      />
      Nearby stations
    </label>
  );
}

export function BetweenTool({
  initialFrom,
  initialTo,
  onSearch,
}: {
  initialFrom?: string | undefined;
  initialTo?: string | undefined;
  /** Told the two codes each time a search starts: a page puts them in its address. */
  onSearch?: ((from: string, to: string) => void) | undefined;
}) {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [nearby, setNearby] = useState(true);
  const [state, setState] = useState<"idle" | "loading">("idle");
  /** A nearby list shown in part while the rest is asked once more. */
  const [more, setMore] = useState(false);
  const [result, setResult] = useState<BetweenResult | null>(null);
  /** The two codes the shown list was asked for: a train's note compares with these. */
  const [asked, setAsked] = useState<{ from: string; to: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<string>("all");
  const [fromSel, setFromSel] = useState<string | null>(null);
  const [allStations, setAllStations] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  /** The latest search, so an older answer arriving late is not shown over it. */
  const latest = useRef(0);

  // The box as this browser last left it (on until turned off).
  useEffect(() => {
    try {
      if (localStorage.getItem(NEARBY_KEY) === "0") setNearby(false);
    } catch {
      // Storage refused: the box starts ticked.
    }
  }, []);

  async function run(a: Station, b: Station, near: boolean = nearby) {
    const n = ++latest.current;
    setState("loading");
    setMore(false);
    setError(null);
    setResult(null);
    setDay("all");
    setFromSel(null);
    setAllStations(false);
    setAsked({ from: a.code, to: b.code });
    const r = await lookup(
      near ? { kind: "between", from: a.code, to: b.code, nearby: true } : { kind: "between", from: a.code, to: b.code },
      honeypot.current?.value ?? "",
    );
    if (n !== latest.current) return;
    setState("idle");
    if ("result" in r) {
      setResult(r.result);
      // Given in part (the server answers within about 3.5 s): the rest is
      // still coming from RailRadar and is kept as it comes. Asked once more
      // a few seconds later, the list is whole; it replaces this one.
      if (near && r.result.partial) {
        setMore(true);
        await new Promise((resolve) => setTimeout(resolve, 5_000));
        if (n !== latest.current) return;
        const again = await lookup({ kind: "between", from: a.code, to: b.code, nearby: true }, honeypot.current?.value ?? "");
        if (n !== latest.current) return;
        setMore(false);
        if ("result" in again && again.result.trains.length >= r.result.trains.length) setResult(again.result);
      }
    } else setError(r.error === "not_found" ? "No trains were found between these stations." : errorText(r.error as LookupError, "train searches"));
  }

  // Turned on or off after a search: the list is asked again, as the app does.
  function changeNearby(on: boolean) {
    setNearby(on);
    try {
      localStorage.setItem(NEARBY_KEY, on ? "1" : "0");
    } catch {
      // Storage refused: the choice lasts for this page.
    }
    if (asked && from && to && from.code === asked.from && to.code === asked.to) void run(from, to, on);
  }

  // A shared link (?from=SC&to=BZA): fill both pickers and search once.
  useEffect(() => {
    if (!initialFrom || !initialTo || initialFrom === initialTo) return;
    let live = true;
    void loadStations()
      .then((all) => {
        if (!live) return;
        const a = { code: initialFrom, name: all[initialFrom] ?? initialFrom };
        const b = { code: initialTo, name: all[initialTo] ?? initialTo };
        setFrom(a);
        setTo(b);
        let near = true;
        try {
          near = localStorage.getItem(NEARBY_KEY) !== "0";
        } catch {
          near = true;
        }
        void run(a, b, near);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!from || !to) {
      setError("Choose both stations from the suggestions.");
      return;
    }
    if (from.code === to.code) {
      setError("Choose two different stations.");
      return;
    }
    onSearch?.(from.code, to.code);
    void run(from, to);
  }

  const askedFrom = asked?.from ?? result?.from.code ?? "";
  const askedTo = asked?.to ?? result?.to.code ?? "";
  const stations = result ? fromStations(result.trains, askedFrom) : [];
  const shownStations = allStations ? stations : stations.slice(0, SHOWN);
  const hiddenStations = stations.length - shownStations.length;
  const byDay = result?.trains.filter((t) => day === "all" || t.runDays.includes(day)) ?? [];
  const trains = byDay.filter((t) => fromSel === null || (t.fromCode || askedFrom).toUpperCase() === fromSel);

  const chip = (chosen: boolean) =>
    "inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition " +
    (chosen ? "border-primary/60 bg-primary/15 font-semibold text-primary" : "border-border bg-card hover:border-primary");

  return (
    <div>
      <form onSubmit={submit} noValidate className="relative">
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto]">
          <StationPicker
            id="from-station"
            label="From"
            value={from}
            onChange={setFrom}
            placeholder="Station name or code"
            // Phones: the box at the top, beside "From". Wider: beside "To", at the row's right end.
            aside={<NearbyBox id="nearby-stations-sm" checked={nearby} onChange={changeNearby} className="inline-flex md:hidden" />}
          />
          <button
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap the two stations"
            className="mx-auto grid size-12 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary md:mb-1"
          >
            <ArrowLeftRight className="size-5" />
          </button>
          <StationPicker
            id="to-station"
            label="To"
            value={to}
            onChange={setTo}
            placeholder="Station name or code"
            aside={<NearbyBox id="nearby-stations" checked={nearby} onChange={changeNearby} className="hidden md:inline-flex" />}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-7 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-70"
          >
            {state === "loading" ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <Search aria-hidden className="size-5" />}
            {state === "loading" ? "Finding…" : "Find trains"}
          </button>
        </div>
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
        <div aria-live="polite">
          {error && <p className="mt-4 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm">{error}</p>}
        </div>
      </form>

      {result && (
        <section aria-label="Trains found" className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-xl font-bold">
              {trains.length} {trains.length === 1 ? "train" : "trains"} from {result.from.name || from?.name} to {result.to.name || to?.name}
              {stations.length > 0 && <span className="ml-2 text-sm font-medium text-muted-foreground">with nearby stations</span>}
            </h3>
            {more && (
              <p role="status" className="flex w-full items-center gap-2 text-sm text-muted-foreground">
                <Loader2 aria-hidden className="size-4 animate-spin text-primary" /> Looking for more trains from nearby stations…
              </p>
            )}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Runs on">
              {["all", ...DAYS].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  aria-pressed={day === d}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition " +
                    (day === d ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")
                  }
                >
                  {d === "all" ? "All days" : d}
                </button>
              ))}
            </div>
          </div>

          {/* The stations the trains leave from, as filters (the app's FromStationChips). */}
          {stations.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Leaves from">
              <button type="button" onClick={() => setFromSel(null)} aria-pressed={fromSel === null} className={chip(fromSel === null)}>
                All <span className="font-bold">{byDay.length}</span>
              </button>
              {shownStations.map((s) => {
                const count = byDay.filter((t) => (t.fromCode || askedFrom).toUpperCase() === s.code).length;
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setFromSel(fromSel === s.code ? null : s.code)}
                    aria-pressed={fromSel === s.code}
                    className={chip(fromSel === s.code)}
                  >
                    <span className="max-w-[12rem] truncate">{s.name}</span>
                    <span className={fromSel === s.code ? "font-bold" : "font-bold text-muted-foreground"}>{count}</span>
                  </button>
                );
              })}
              {hiddenStations > 0 && (
                <button type="button" onClick={() => setAllStations(true)} className={chip(false)}>
                  +{hiddenStations} more
                </button>
              )}
            </div>
          )}

          <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
            {trains.map((t) => {
              const where = note(t, askedFrom, askedTo);
              return (
                <li key={t.number} className="border-b border-border last:border-b-0">
                  <Link
                    {...(hasPage(t.number)
                      ? { to: "/train/$number/" as const, params: { number: t.number } }
                      : { to: "/train/" as const, search: { n: t.number } })}
                    className="group grid gap-3 p-4 transition hover:bg-primary/5 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-semibold group-hover:text-primary">
                        <TrainFront aria-hidden className="size-4 shrink-0 text-primary" />
                        <span className="text-primary">{t.number}</span> <span className="truncate">{t.name}</span>
                      </span>
                      {where && <span className="mt-1 block text-xs font-semibold text-primary">{where}</span>}
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {DAYS.map((d) => (
                          <span
                            key={d}
                            className={
                              "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase " +
                              (t.runDays.includes(d) ? "bg-primary/15 text-primary" : "text-muted-foreground/50 line-through")
                            }
                          >
                            {d.slice(0, 2)}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="flex items-center gap-4 tabular-nums">
                      <span className="text-right">
                        <span className="block text-lg font-bold">{t.dep || "—"}</span>
                        <span className="block text-xs text-muted-foreground">{t.fromCode || result.from.code}</span>
                      </span>
                      <span className="flex flex-col items-center text-xs text-muted-foreground">
                        {t.durationMin > 0 ? durationText(t.durationMin) : ""}
                        <ArrowRight aria-hidden className="size-4" />
                      </span>
                      <span>
                        <span className="block text-lg font-bold">
                          {t.arr || "—"}
                          {t.arrLater > 0 && <sup className="ml-0.5 text-xs text-primary">+{t.arrLater}</sup>}
                        </span>
                        <span className="block text-xs text-muted-foreground">{t.toCode || result.to.code}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {trains.length === 0 && <p className="mt-4 text-muted-foreground">No train between these stations runs on that day.</p>}
          <p className="mt-3 text-xs text-muted-foreground">
            Times from RailRadar&rsquo;s timetable; +1 means it arrives the next day. Confirm with NTES or 139 before you travel.
          </p>
        </section>
      )}
    </div>
  );
}
