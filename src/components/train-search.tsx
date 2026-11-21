import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, Search, TrainFront } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { RecentSearches } from "@/components/recent-searches";
import { normalise, nowCalled, variants } from "@/lib/city-names";
import { cityWordsOf } from "@/lib/city-stations";
import { useRecent } from "@/lib/recent";
import { hasPage } from "@/lib/trains";

// Search every train in the app's catalogue (13,925 of them) by number or
// name, in the browser. The list (public/data/trains.json, ~130 KB over the
// wire) is fetched the first time someone uses the box, not with the page.
// Every result opens the train's timetable: its page when the site has one
// built (the Popular Trains), else /train/?n=, loaded when opened. Above
// the box, the trains this browser opened lately (lib/recent.ts).
//
// A place's other names are searched too, as in the app (lib/city-names.ts):
// "bangalore rajdhani" finds trains named Bengaluru as well as Bangalore. A
// big city's main stations answer to the city's name: "kolkata" finds the
// trains to and from Howrah, "hyderabad" Secunderabad's (lib/city-stations.ts).

export type Catalogue = { s: Record<string, string>; t: [string, string, string, string][] };
type Hit = { number: string; name: string; from: string; to: string; page: boolean };

let catalogue: Promise<Catalogue> | null = null;
function loadCatalogue(): Promise<Catalogue> {
  catalogue ??= fetch("/data/trains.json").then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<Catalogue>;
  });
  catalogue.catch(() => {
    catalogue = null; // try again next time
  });
  return catalogue;
}

const MAX_HITS = 12;

/** One query's hits, each with its score (lower is better). */
function searchOne(data: Catalogue, q: string, into: Map<string, { hit: Hit; score: number }>) {
  const digits = /^\d+$/.test(q);
  const words = q.split(/\s+/).filter(Boolean);
  for (const [number, name, src, dst] of data.t) {
    const from = data.s[src] ?? src;
    const to = data.s[dst] ?? dst;
    let score: number;
    if (digits) {
      if (!number.startsWith(q)) continue;
      score = number === q ? 0 : 1;
    } else {
      const hay =
        `${name} ${from} ${to} ${src} ${dst} ${cityWordsOf(src)} ${cityWordsOf(dst)}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) continue;
      score = name.toLowerCase().startsWith(words[0] ?? "") ? 1 : 2;
    }
    const page = hasPage(number);
    if (page) score -= 0.5; // a train with its full page first
    const had = into.get(number);
    if (!had || score < had.score)
      into.set(number, { hit: { number, name, from, to, page }, score });
  }
}

/** Exported for its tests (train-search.test.ts). */
export function searchTrains(data: Catalogue, raw: string): Hit[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const found = new Map<string, { hit: Hit; score: number }>();
  searchOne(data, q, found);
  // The same with each other name of a place in it ("bangalore" -> "bengaluru").
  if (!/^\d+$/.test(q)) for (const v of variants(q)) searchOne(data, v, found);
  return [...found.values()]
    .sort((a, b) => a.score - b.score || a.hit.number.localeCompare(b.hit.number))
    .slice(0, MAX_HITS)
    .map((s) => s.hit);
}

export function TrainSearch({
  id = "search",
  autoFocusOnHash = false,
  hash,
  hint = true,
}: {
  id?: string;
  autoFocusOnHash?: boolean;
  /** A part of the train's page to open on, e.g. "chat". */
  hash?: string;
  /** The line under the box; off where the box already has one above it. */
  hint?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Catalogue | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "failed">("idle");
  const input = useRef<HTMLInputElement>(null);
  const hintId = useId();

  const warm = () => {
    if (data || state === "loading") return;
    setState("loading");
    loadCatalogue()
      .then((d) => {
        setData(d);
        setState("idle");
      })
      .catch(() => setState("failed"));
  };

  // Arriving from "Search trains" (…/trains/#search): straight into the box.
  useEffect(() => {
    if (autoFocusOnHash && (window.location.hash === "#search" || window.location.hash === `#${id}`)) {
      input.current?.focus();
      warm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hits = useMemo(() => (data ? searchTrains(data, query) : []), [data, query]);
  const typed = query.trim().length > 0;
  const recent = useRecent("trains");

  return (
    <div id={id}>
      <label htmlFor={`${id}-input`} className="mb-2 block text-sm font-semibold">
        Train number or name
      </label>
      <RecentSearches
        what="trains"
        onClear={recent.clear}
        chips={recent.list.map((t) => ({
          key: t.number,
          words: `${t.number} ${t.name}`,
          label: (
            <>
              <span className="font-semibold text-primary">{t.number}</span> {t.name}
            </>
          ),
          link: (className, content) => (
            <Link
              {...(hasPage(t.number)
                ? { to: "/train/$number/" as const, params: { number: t.number } }
                : { to: "/train/" as const, search: { n: t.number } })}
              {...(hash ? { hash } : {})}
              className={className}
            >
              {content}
            </Link>
          ),
          onRemove: () => recent.remove(t),
        }))}
      />
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={input}
          id={`${id}-input`}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          placeholder="e.g. 12727 or Godavari"
          aria-describedby={hintId}
          value={query}
          onFocus={warm}
          onPointerEnter={warm}
          onChange={(e) => {
            setQuery(e.target.value);
            warm();
          }}
          className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-12 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
        {state === "loading" && typed && (
          <Loader2 aria-hidden className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      <p id={hintId} className={hint ? "mt-2 text-sm text-muted-foreground" : "sr-only"}>
        Every Indian Railways train: try a number like 12727, or a name like Godavari or Rajdhani.
      </p>

      <div aria-live="polite" className="sr-only">
        {typed && data ? (hits.length ? `${hits.length} trains found` : "No train found") : ""}
      </div>

      {state === "failed" && typed && (
        <p className="mt-4 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
          The train list didn&rsquo;t load. Check your connection and type again.
        </p>
      )}

      {typed && data && hits.length === 0 && (
        <p className="mt-4 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
          No train matches &ldquo;{query.trim()}&rdquo;. Try the 5-digit train number, or one word of its name.
        </p>
      )}

      {hits.length > 0 && nowCalled(query) && (
        <p className="mt-3 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{nowCalled(query)}</span> for
          &ldquo;{normalise(query)}&rdquo;
        </p>
      )}

      {hits.length > 0 && (
        <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
          {hits.map((h) => (
            <li key={h.number} className="border-b border-border last:border-b-0">
              <Link
                {...(h.page
                  ? { to: "/train/$number/" as const, params: { number: h.number } }
                  : { to: "/train/" as const, search: { n: h.number } })}
                {...(hash ? { hash } : {})}
                className="group flex items-center gap-3 p-4 transition hover:bg-primary/5"
              >
                <TrainFront aria-hidden className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:text-primary">
                    <span className="text-primary">{h.number}</span> {h.name}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {h.from} → {h.to}
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm font-semibold text-primary sm:inline">Timetable</span>
                <ArrowRight aria-hidden className="size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
