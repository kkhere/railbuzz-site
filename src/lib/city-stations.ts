import { normalise } from "@/lib/city-names";

// The big cities' main stations, so that typing a city puts them first
// (the owner, 21 November 2026): "hyd" gives Secunderabad, Hyderabad,
// Kacheguda, Lingampalli and Charlapalli before anything else.
//
// The stations long-distance passengers board at in each city, as Nearby
// stations uses them: MAIN_STATIONS in admin/src/lib/railradar/nearby.ts
// (9 November 2026). city-names.test.ts checks this copy matches wherever
// the admin's source is beside the site.

export const MAIN_STATIONS: Readonly<Record<string, readonly string[]>> = {
  Secunderabad: ["SC", "HYB", "KCG", "LPI", "CHZ"],
  Delhi: ["NDLS", "DLI", "NZM", "ANVT", "DEE", "DEC", "GZB", "GGN", "FDB"],
  Howrah: ["HWH", "SDAH", "KOAA", "SRC", "SHM"],
  Mumbai: ["CSMT", "MMCT", "DR", "DDR", "LTT", "BDTS", "BVI", "TNA", "KYN", "PNVL", "BSR"],
  Chennai: ["MAS", "MS", "TBM"],
  Bengaluru: ["SBC", "YPR", "SMVB", "BNC", "KJM", "YNK"],
  Pune: ["PUNE", "HDP"],
  Patna: ["PNBE", "PPTA", "RJPB", "DNR"],
  Bhubaneshwar: ["BBS", "BBSN", "CTC"],
  Visakhapatnam: ["VSKP", "DVD"],
  Vijayawada: ["BZA", "RYP"],
  Chandigarh: ["CDG", "SASN"],
  Hubli: ["UBL", "DWR"],
  Ahmedabad: ["ADI", "SBIB", "SBT", "MAN", "ASV", "GNC"],
  Varanasi: ["BSB", "BSBS", "BNRS", "BCY", "DDU"],
  Agra: ["AGC", "AF", "IDH", "TDL"],
};

/**
 * Each city's names as typed, to its key above: the key itself, and the city
 * a key's station is better known by (Hyderabad's stations are listed under
 * Secunderabad, Kolkata's under Howrah). Other names come through CityNames:
 * Calcutta, Bombay, Madras, Vizag, Bangalore, Banaras, Hubballi.
 */
const CITIES: ReadonlyArray<readonly [string, string]> = [
  ...Object.keys(MAIN_STATIONS).map((k) => [k.toLowerCase(), k] as const),
  ["hyderabad", "Secunderabad"],
  ["kolkata", "Howrah"],
  ["new delhi", "Delhi"],
];

/** Letters of a city's name that already count as it: "hyd", "del", "che". */
export const MIN_CITY_PREFIX = 3;

/**
 * The city [query] names (normalised), by its whole name or its start (3
 * letters or more; past the first word for a two-word name, so "new" alone
 * is not New Delhi). Null when none.
 */
export function cityOf(query: string): string | null {
  const q = normalise(query);
  if (q.length < MIN_CITY_PREFIX) return null;
  for (const [name, key] of CITIES) {
    const firstWord = name.split(" ")[0] ?? name;
    if (name === q || (name.startsWith(q) && (!name.includes(" ") || q.length > firstWord.length)))
      return key;
  }
  return null;
}

/** The city names a station serves, for train search: "SC" -> "secunderabad hyderabad". */
const WORDS_OF: ReadonlyMap<string, string> = (() => {
  const byKey = new Map<string, string[]>();
  for (const [name, key] of CITIES) byKey.set(key, [...(byKey.get(key) ?? []), name]);
  const out = new Map<string, string>();
  for (const [key, codes] of Object.entries(MAIN_STATIONS)) {
    for (const code of codes) out.set(code, (byKey.get(key) ?? []).join(" "));
  }
  return out;
})();

export function cityWordsOf(code: string): string {
  return WORDS_OF.get(code) ?? "";
}
