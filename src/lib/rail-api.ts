// railbuzz.in's live lookups, through the admin app's public route
// (admin/src/app/api/public/rail/route.ts), which holds the RailRadar key and
// the daily limits (migration 080). Nothing the visitor types is kept there.

import type { Train } from "@/lib/trains";

/** The route; a local preview build can point elsewhere with VITE_RAIL_API. */
export const RAIL_API: string = import.meta.env["VITE_RAIL_API"] ?? "https://admin.railbuzz.in/api/public/rail";

export type PnrResult = {
  pnr: string;
  train: { number: string; name: string };
  from: { code: string; name: string };
  to: { code: string; name: string };
  date: string;
  travelClass: string;
  quota: string;
  chartPrepared: boolean;
  passengers: { number: number; booking: string; current: string; coach: string; berth: string }[];
};

export type BetweenResult = {
  from: { code: string; name: string };
  to: { code: string; name: string };
  /** Asked with nearby: true, and answered with the stations in each one's city. */
  nearby?: boolean;
  /** A nearby list given before every part came back (about 3.5 s); asked again a little later, it is whole. */
  partial?: boolean;
  trains: {
    number: string;
    name: string;
    type: string;
    runDays: string[];
    dep: string;
    arr: string;
    arrLater: number;
    durationMin: number;
    distanceKm: number;
    /**
     * Where this train is caught and left: the stations typed, or, with
     * nearby stations, another in the same city (Kacheguda for Secunderabad).
     */
    fromCode?: string;
    fromName?: string;
    toCode?: string;
    toName?: string;
  }[];
};

export type StationResult = {
  code: string;
  trains: {
    number: string;
    name: string;
    type: string;
    from: string;
    to: string;
    arr: string;
    dep: string;
    expArr: string;
    expDep: string;
    delay: number;
    pf: string;
    state: string;
  }[];
};

type Request =
  | { kind: "pnr"; pnr: string }
  | { kind: "train"; number: string }
  | { kind: "between"; from: string; to: string; nearby?: true }
  | { kind: "station"; code: string };

type ResultOf<R extends Request> = R["kind"] extends "pnr"
  ? PnrResult
  : R["kind"] extends "train"
    ? Train
    : R["kind"] extends "between"
      ? BetweenResult
      : StationResult;

/** What went wrong, as a word the page turns into a sentence. */
export type LookupError =
  | "bad_request"
  | "not_found"
  | "visitor_limit"
  | "site_limit"
  | "busy"
  | "unavailable"
  | "forbidden"
  | "network";

export async function lookup<R extends Request>(
  request: R,
  honeypot = "",
): Promise<{ result: ResultOf<R> } | { error: LookupError }> {
  try {
    const res = await fetch(RAIL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, website: honeypot }),
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    const body = (await res.json().catch(() => ({}))) as { result?: ResultOf<R>; error?: LookupError };
    if (res.ok && body.result) return { result: body.result };
    return { error: body.error ?? "unavailable" };
  } catch {
    return { error: "network" };
  }
}

/** The sentence for an error; [what] names the thing looked up ("PNR checks", "station boards"). */
export function errorText(error: LookupError, what: string): string {
  switch (error) {
    case "visitor_limit":
      return `You have used today's ${what} on the website. The RailBuzz app has more.`;
    case "site_limit":
      return `The website's ${what} for today are used up. The RailBuzz app still has them.`;
    case "busy":
      return "Train information is busy right now. Please try again in a few minutes.";
    case "network":
      return "We couldn't reach RailBuzz. Check your connection and try again.";
    case "forbidden":
      return "This only works on railbuzz.in.";
    case "bad_request":
      return "That doesn't look right. Check what you entered and try again.";
    case "not_found":
      return "Nothing was found for that.";
    default:
      return "This isn't available right now. Please try again later, or use the RailBuzz app.";
  }
}

/** Station names, code -> name, fetched once when a picker is first used (public/data/stations.json). */
let stations: Promise<Record<string, string>> | null = null;
export function loadStations(): Promise<Record<string, string>> {
  stations ??= fetch("/data/stations.json").then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<Record<string, string>>;
  });
  stations.catch(() => {
    stations = null;
  });
  return stations;
}
