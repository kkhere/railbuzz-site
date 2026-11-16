// The train and station pages' data, written by scripts/build_site_trains.py
// (in the app's repo) from RailBuzz's timetable store: one JSON file per
// long-distance train (3,994 on 16 November 2026) and per station where 15 or
// more of them call (1,351). Each file is its own chunk, loaded only by its
// own page.

export type Halt = {
  code: string;
  name: string;
  /** "06:15"; empty at the first station. */
  arr: string;
  /** "17:20"; empty at the last station. */
  dep: string;
  /** The journey day it leaves (or, at the last station, reaches) this halt: 1, 2... */
  day: number;
  km: number;
  /** The platform the timetable gives; may be empty. */
  pf: string;
};

export type Train = {
  number: string;
  name: string;
  type: string;
  from: { code: string; name: string };
  to: { code: string; name: string };
  /** "mon".."sun", in week order. */
  runDays: string[];
  distanceKm: number;
  durationMin: number;
  avgSpeed: number | null;
  /** Every station on the route, halts or not. */
  stations: number;
  classes: string[];
  /** Coach order from the engine: "ENG", "GEN", "S1", "B1"... */
  coaches: string[];
  returnTrain: string;
  halts: Halt[];
  /** "2026-11-15": the day the timetable was fetched. */
  fetchedOn: string;
};

export type PopularState = {
  state: string;
  trains: { number: string; name: string; from: string; to: string; fetchedOn: string }[];
};

const files = import.meta.glob<Train>("../data/trains/*.json", { import: "default" });

export const popularStates: PopularState[] =
  Object.values(import.meta.glob<PopularState[]>("../data/popular-trains.json", { eager: true, import: "default" }))[0] ?? [];

// What has a page: train numbers and station codes, space separated (about 9 KB gzipped).
const pages = Object.values(
  import.meta.glob<{ t: string; s: string }>("../data/page-numbers.json", { eager: true, import: "default" }),
)[0] ?? { t: "", s: "" };
const pageNumbers = new Set(pages.t.split(" ").filter(Boolean));
const stationCodes = new Set(pages.s.split(" ").filter(Boolean));

/** True when [number] has a page on the site. */
export const hasPage = (number: string) => pageNumbers.has(number);

/** True when station [code] has a page on the site. */
export const hasStationPage = (code: string) => stationCodes.has(code);

export async function loadTrain(number: string): Promise<Train | null> {
  const load = files[`../data/trains/${number}.json`];
  return load ? load() : null;
}

/**
 * A train at a station: number, name, type, from, to, arrives, leaves, the
 * journey day it is here, platform, the days it is here ("motuwe…", two
 * letters a day, already moved on for later days), and where on its route:
 * 0 it starts here, 1 it passes through, 2 it ends here.
 */
export type StationTrain = [string, string, string, string, string, string, string, number, string, string, 0 | 1 | 2];

export type Station = {
  code: string;
  name: string;
  /** In order of departure (arrival, where the train ends here). */
  trains: StationTrain[];
  fetchedOn: string;
};

const stationFiles = import.meta.glob<Station>("../data/stations/*.json", { import: "default" });

export async function loadStation(code: string): Promise<Station | null> {
  const load = stationFiles[`../data/stations/${code}.json`];
  return load ? load() : null;
}

/** "motuwe" as ["mon", "tue", "wed"]. */
export function stationDays(packed: string): string[] {
  const all = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return all.filter((d) => packed.includes(d.slice(0, 2)));
}

export const stateSlug = (state: string) => state.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const DAY_NAMES: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** "Daily", or "Monday, Wednesday and Friday". */
export function runDaysText(days: string[]): string {
  if (days.length === 7) return "Daily";
  const names = days.map((d) => DAY_NAMES[d] ?? d);
  if (names.length <= 1) return names[0] ?? "Not known";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** "12 h 55 min". */
export function durationText(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m} min`;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-15" as "15 November 2026", the same on the server and in the browser. */
export function dateText(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

/** "the same day", "the next day", "on day 3". */
export function dayText(day: number): string {
  return day <= 1 ? "the same day" : day === 2 ? "the next day" : `on day ${day}`;
}

/** Minutes between arriving and leaving a halt, when both are given. */
export function haltMinutes(h: Halt): number | null {
  if (!h.arr || !h.dep) return null;
  const toMin = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return (hh ?? 0) * 60 + (mm ?? 0);
  };
  const diff = toMin(h.dep) - toMin(h.arr);
  return diff < 0 ? diff + 24 * 60 : diff;
}

const CLASS_NAMES: Record<string, string> = {
  "1A": "First AC",
  "2A": "AC 2 Tier",
  "3A": "AC 3 Tier",
  "3E": "AC 3 Economy",
  EC: "Executive Chair Car",
  EA: "Executive Anubhuti",
  CC: "AC Chair Car",
  FC: "First Class",
  SL: "Sleeper",
  "2S": "Second Sitting",
  GN: "General",
};

export const className = (code: string) => CLASS_NAMES[code] ?? code;

/** How a coach label reads: its kind, for the coach strip's colours and legend. */
export function coachKind(label: string): "ac" | "sleeper" | "general" | "other" {
  if (/^(ENG|SLR|SLRD|LPR|FLRD|EOG|PC|RMS|LDS|SLR\d*)$/.test(label)) return "other";
  if (/^(GEN|GS|UR|D\d*|2S)$/.test(label) || /^D\d+$/.test(label)) return "general";
  if (/^S\d+$/.test(label)) return "sleeper";
  if (/^(H|HA|A|B|M|C|E|EA|EC|G|CE)\d*$/.test(label)) return "ac";
  return "other";
}

/** The coach label in words, for screen readers and the legend. */
export function coachWords(label: string): string {
  const named: Record<string, string> = {
    ENG: "Engine",
    GEN: "General",
    GS: "General",
    UR: "Unreserved",
    PC: "Pantry car",
    SLR: "Guard and luggage van",
    SLRD: "Guard, luggage and divyangjan coach",
    LPR: "Luggage and parcel van",
    FLRD: "Luggage van",
    EOG: "Power car",
  };
  return named[label] ?? label;
}
