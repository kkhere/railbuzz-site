import { normalise, nowCalled, variants } from "@/lib/city-names";
import { cityOf, MAIN_STATIONS } from "@/lib/city-stations";

// The station pickers' suggestions (the owner, 21 November 2026: "show only
// trains halting stations… people doesn't know all small stations").
//
// From public/data/station-index.json (scripts/build_site_trains.py): every
// station with how many trains stop there, long-distance and all, from our
// timetables of every train. Stations no train stops at are never offered
// (999 of 9,641). The rest, busiest first:
//   0. a city's main stations, when a city was typed ("hyd", "Kolkata",
//      "Vizag"): those whose name has what was typed, then the others ("che":
//      Chennai Central and Egmore, then Tambaram, before the station CHE);
//   1. the station whose code was typed, when CODE_FIRST_MIN long-distance
//      trains or more stop there ("sc", "bza"; not Villianur's "vi", nor
//      Nivari's "new", ahead of Vijayawada and New Delhi);
//   2. a name or a word in it starting with what was typed, or a code starting so;
//   3. a name with it inside (3 letters or more).
// Within each, by long-distance trains stopping, then all. Each other name of
// a place is searched too (lib/city-names.ts): "bangalore" finds Bengaluru.

export type IndexedStation = {
  code: string;
  name: string;
  /** Long-distance trains stopping (not suburban, MEMU, passenger or specials). */
  long: number;
  /** Every train stopping. */
  all: number;
  /** The name, lower case, words only: matched against what was typed. */
  words: string;
};

export type Station = { code: string; name: string };

export const MAX_SUGGESTIONS = 8;
export const CODE_FIRST_MIN = 10;

export function indexStations(rows: [string, string, number, number][]): IndexedStation[] {
  return rows.map(([code, name, long, all]) => ({ code, name, long, all, words: normalise(name) }));
}

function tier(s: IndexedStation, q: string, upper: string): number | null {
  if (s.code === upper && s.long >= CODE_FIRST_MIN) return 1;
  if (` ${s.words}`.includes(` ${q}`) || (upper.length > 0 && s.code.startsWith(upper))) return 2;
  if (q.length >= 3 && s.words.includes(q)) return 3;
  return null;
}

export function suggestStations(
  list: readonly IndexedStation[],
  raw: string,
  max = MAX_SUGGESTIONS,
): { stations: Station[]; nowCalled: string | null } {
  const q = normalise(raw);
  if (!q) return { stations: [], nowCalled: null };
  const queries = [q, ...variants(q)];
  const city = queries.map(cityOf).find((c) => c !== null) ?? null;
  const cityCodes = new Set(city ? MAIN_STATIONS[city] : []);
  // A code is typed as one word: "sc", "bza".
  const uppers = queries.map((x) => (/^[a-z0-9]+$/.test(x) ? x.toUpperCase() : ""));

  const ranked: { s: IndexedStation; t: number }[] = [];
  for (const s of list) {
    if (s.all === 0) continue;
    let best: number | null = null;
    for (let i = 0; i < queries.length; i++) {
      const t = tier(s, queries[i] ?? "", uppers[i] ?? "");
      if (t !== null && (best === null || t < best)) best = t;
    }
    if (cityCodes.has(s.code)) best = best !== null ? 0 : 0.5;
    if (best !== null) ranked.push({ s, t: best });
  }
  ranked.sort(
    (a, b) =>
      a.t - b.t || b.s.long - a.s.long || b.s.all - a.s.all || a.s.name.length - b.s.name.length,
  );
  return {
    stations: ranked.slice(0, max).map(({ s }) => ({ code: s.code, name: s.name })),
    nowCalled: nowCalled(q),
  };
}
