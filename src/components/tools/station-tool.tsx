import { Link } from "@tanstack/react-router";
import { Loader2, RefreshCw, Search, TrainFront } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { RecentSearches } from "@/components/recent-searches";
import { StationPicker, type Station } from "@/components/station-picker";
import {
  errorText,
  loadStations,
  lookup,
  type LookupError,
  type StationResult,
} from "@/lib/rail-api";
import { hasPage } from "@/lib/trains";
import { isCrawler } from "@/lib/crawler";
import { remember, useRecent } from "@/lib/recent";

// A station's live board: the trains due in the next hours, how late they are
// and on which platform, from RailRadar through the admin route (kind
// "station"). Shared with the app for two minutes, so a busy station costs
// one request every two minutes at most, however many look. Above the
// picker, the stations this browser looked at lately (lib/recent.ts).

type Row = StationResult["trains"][number];

function status(r: Row): { text: string; tone: string } {
  if (r.state === "departed") return { text: "Departed", tone: "text-muted-foreground" };
  if (r.state === "at-station") return { text: "At the station", tone: "text-chart-5" };
  if (r.state === "cancelled") return { text: "Cancelled", tone: "text-destructive" };
  if (r.state === "not-started") return { text: "Not started yet", tone: "text-muted-foreground" };
  if (r.state === "scheduled") return { text: "", tone: "" };
  // A live row that does not say how late: not known, never "On time" (18 November 2026).
  if (r.state && (r.delay === null || r.delay === undefined))
    return { text: "Delay not known", tone: "text-muted-foreground" };
  if (r.delay !== null && r.delay >= 5)
    return { text: `${r.delay} min late`, tone: "text-destructive" };
  if (r.state) return { text: "On time", tone: "text-chart-5" };
  return { text: "", tone: "" };
}

export function StationTool({
  initialCode,
  onSearch,
}: {
  initialCode?: string | undefined;
  /** Told the station's code each time a search starts: a page puts it in its address. */
  onSearch?: ((code: string) => void) | undefined;
}) {
  const [station, setStation] = useState<Station | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [board, setBoard] = useState<StationResult | null>(null);
  const [shown, setShown] = useState<{ station: Station; at: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const recent = useRecent("stations");

  async function run(s: Station) {
    setState("loading");
    setError(null);
    // Station names for the trains' ends: the list the picker already loads.
    void loadStations()
      .then(setNames)
      .catch(() => undefined);
    const r = await lookup({ kind: "station", code: s.code }, honeypot.current?.value ?? "");
    setState("idle");
    if ("result" in r) {
      setBoard(r.result);
      remember("stations", { code: s.code, name: s.name });
      setShown({
        station: s,
        at: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
      });
    } else {
      setBoard(null);
      setError(
        r.error === "not_found"
          ? "No live board was found for this station."
          : errorText(r.error as LookupError, "station boards"),
      );
    }
  }

  // A shared link (?code=BZA): fill the picker and look once. Not for a
  // crawler (lib/crawler.ts): the picker is filled, nothing is asked.
  useEffect(() => {
    if (!initialCode) return;
    const crawler = isCrawler();
    let live = true;
    void loadStations()
      .then((all) => {
        if (!live) return;
        const s = { code: initialCode, name: all[initialCode] ?? initialCode };
        setStation(s);
        if (!crawler) void run(s);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!station) {
      setError("Choose a station from the suggestions.");
      return;
    }
    onSearch?.(station.code);
    void run(station);
  }

  const name = (code: string) => names[code] ?? code;

  return (
    <div>
      <form onSubmit={submit} noValidate className="relative">
        <RecentSearches
          what="stations"
          onClear={recent.clear}
          chips={recent.list.map((s) => ({
            key: s.code,
            words: `${s.name} (${s.code})`,
            label: (
              <>
                <span className="font-mono font-semibold text-primary">{s.code}</span> {s.name}
              </>
            ),
            onPick: () => {
              setStation(s);
              setError(null);
              onSearch?.(s.code);
              void run(s);
            },
            onRemove: () => recent.remove(s),
          }))}
        />
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto]">
          <StationPicker id="board-station" label="Station" value={station} onChange={setStation} />
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-7 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-70"
          >
            {state === "loading" ? (
              <Loader2 aria-hidden className="size-5 animate-spin" />
            ) : (
              <Search aria-hidden className="size-5" />
            )}
            {state === "loading" ? "Loading…" : "Show trains"}
          </button>
        </div>
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
        <div aria-live="polite">
          {error && (
            <p className="mt-4 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm">
              {error}
            </p>
          )}
        </div>
      </form>

      {board && shown && (
        <section aria-label={`Trains at ${shown.station.name}`} className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold">
                {shown.station.name}{" "}
                <span className="font-mono text-base text-primary">{shown.station.code}</span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {board.trains.length} {board.trains.length === 1 ? "train" : "trains"} · updated{" "}
                {shown.at}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void run(shown.station)}
              disabled={state === "loading"}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-60"
            >
              <RefreshCw
                aria-hidden
                className={"size-4 " + (state === "loading" ? "animate-spin" : "")}
              />{" "}
              Refresh
            </button>
          </div>
          {board.trains.length > 0 ? (
            <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
              {board.trains.map((r) => {
                const st = status(r);
                const time = r.dep || r.arr;
                const expected = r.dep ? r.expDep : r.expArr;
                const late = expected && expected !== time;
                const startsHere = r.from === board.code;
                const endsHere = r.to === board.code || !r.dep;
                return (
                  <li
                    key={`${r.number}-${time}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <Link
                      {...(hasPage(r.number)
                        ? { to: "/train/$number/" as const, params: { number: r.number } }
                        : { to: "/train/" as const, search: { n: r.number } })}
                      className="group grid grid-cols-[4.5rem_1fr] gap-3 p-4 transition hover:bg-primary/5 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                    >
                      <span className="tabular-nums">
                        <span
                          className={
                            "block text-lg font-bold " +
                            (late ? "text-muted-foreground line-through decoration-1" : "")
                          }
                        >
                          {time}
                        </span>
                        {late && (
                          <span className="block text-lg font-bold text-destructive">
                            {expected}
                          </span>
                        )}
                        <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                          {endsHere ? "Arrives" : "Leaves"}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 font-semibold group-hover:text-primary">
                          <TrainFront aria-hidden className="size-4 shrink-0 text-primary" />
                          <span className="text-primary">{r.number}</span>{" "}
                          <span className="truncate">{r.name}</span>
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {startsHere ? "Starts here" : `From ${name(r.from)}`} →{" "}
                          {endsHere && r.to === board.code ? "ends here" : name(r.to)}
                        </span>
                      </span>
                      <span className="col-span-2 flex items-center gap-3 text-sm sm:col-span-1 sm:flex-col sm:items-end sm:gap-1">
                        {st.text && <span className={"font-semibold " + st.tone}>{st.text}</span>}
                        {r.pf && (
                          <span className="rounded-md border border-border px-2 py-0.5 text-xs">
                            PF {r.pf}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-border bg-background p-5 text-muted-foreground">
              No trains are due at this station in the next hours.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            As Indian Railways reports it. Platforms can change: check the station&rsquo;s displays
            and announcements.
          </p>
        </section>
      )}
    </div>
  );
}
