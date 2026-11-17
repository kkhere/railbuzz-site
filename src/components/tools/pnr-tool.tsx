import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Loader2, ShieldCheck, Ticket, TriangleAlert } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { PlayButton } from "@/components/site-layout";
import { lookup, type PnrResult, type PnrState } from "@/lib/rail-api";
import { dateText, hasPage } from "@/lib/trains";

// PNR status: one 10-digit number in, the booking out. Checked through the
// admin app's public route (kind "pnr"): 5 a day per visitor, 200 for the
// site (migration 080). Nothing is stored there: not the PNR, not the answer.

const ERRORS: Record<string, string> = {
  bad_request: "Enter the 10-digit PNR number from your ticket.",
  not_found: "No booking was found for this PNR. It may be wrong, or the journey is over and Indian Railways has removed it.",
  visitor_limit: "You have used today's 5 PNR checks on the website. Check more PNR numbers in the RailBuzz app.",
  site_limit: "The website's PNR checks for today are used up. You can still check your PNR in the RailBuzz app.",
  busy: "PNR checks are busy right now. Please try again in a few minutes.",
  unavailable: "PNR checks are not available right now. Please try again later, or use the RailBuzz app.",
  forbidden: "This check only works on railbuzz.in.",
  network: "We couldn't reach the PNR service. Check your connection and try again.",
};

/** How a booking status reads: confirmed, RAC, waiting, or something else. */
export function statusTone(status: string): string {
  const s = status.toUpperCase();
  if (s.startsWith("CNF") || s.startsWith("CONFIRM")) return "border-chart-5/50 bg-chart-5/15 text-chart-5";
  if (s.startsWith("RAC")) return "border-chart-3/50 bg-chart-3/15 text-chart-3";
  if (/^(WL|GNWL|PQWL|RLWL|TQWL|RSWL|RQWL|CKWL)/.test(s)) return "border-destructive/50 bg-destructive/15 text-destructive";
  return "border-border bg-secondary text-foreground";
}

type Passenger = PnrResult["passengers"][number];

/** A passenger's state: from the route (17 November 2026 on), else from the status words. */
function stateOf(p: Passenger): PnrState {
  if (p.state) return p.state;
  const s = p.current.trim().toUpperCase();
  if (s.startsWith("CAN")) return "cancelled";
  if (s.startsWith("CNF") || s.startsWith("CONFIRM")) return "confirmed";
  if (s.startsWith("RAC")) return "rac";
  if (/^(WL|GNWL|PQWL|RLWL|TQWL|RSWL|RQWL|CKWL|NOSB)/.test(s)) return "waiting";
  return "unknown";
}

/** Each state's word on a passenger's badge, its word in the summary ("2 confirmed"), and its colours. */
const STATE: Record<Exclude<PnrState, "unknown">, { word: string; count: string; tone: string }> = {
  confirmed: { word: "Confirmed", count: "confirmed", tone: "border-chart-5/50 bg-chart-5/15 text-chart-5" },
  rac: { word: "RAC", count: "RAC", tone: "border-chart-3/50 bg-chart-3/15 text-chart-3" },
  waiting: { word: "Waiting list", count: "waiting", tone: "border-destructive/50 bg-destructive/15 text-destructive" },
  cancelled: { word: "Cancelled", count: "cancelled", tone: "border-destructive/50 bg-destructive/15 text-destructive" },
};

/** IRCTC's berth codes, in words. */
const BERTHS: Record<string, string> = {
  LB: "Lower berth",
  MB: "Middle berth",
  UB: "Upper berth",
  SL: "Side lower",
  SM: "Side middle",
  SU: "Side upper",
  WS: "Window seat",
  MS: "Middle seat",
  AS: "Aisle seat",
};

/** "Coach S1 · Berth 60 · Lower berth"; empty when no seat is held. */
function seatText(p: Passenger, state: PnrState): string {
  if (!p.coach && !p.berth) return "";
  const kind = p.berthType ? BERTHS[p.berthType] ?? p.berthType : "";
  return [
    p.coach && `Coach ${p.coach}`,
    p.berth && `${state === "rac" ? "Shared berth" : "Berth"} ${p.berth}`,
    kind,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** "2 confirmed, 1 cancelled", in the passengers' order of states. */
function summary(passengers: Passenger[]): { state: PnrState; count: number }[] {
  const order: PnrState[] = ["confirmed", "rac", "waiting", "cancelled", "unknown"];
  return order
    .map((state) => ({ state, count: passengers.filter((p) => stateOf(p) === state).length }))
    .filter((s) => s.count > 0 && s.state !== "unknown");
}

function ResultCard({ r }: { r: PnrResult }) {
  return (
    <section aria-label={`PNR ${r.pnr}`} className="mt-6 overflow-hidden rounded-2xl border border-primary/50 bg-background">
      <div className="border-b border-border p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PNR {r.pnr}</p>
        <h3 className="mt-2 text-xl font-bold md:text-2xl">
          {hasPage(r.train.number) ? (
            <Link to="/train/$number/" params={{ number: r.train.number }} className="hover:text-primary">
              <span className="text-primary">{r.train.number}</span> {r.train.name}
            </Link>
          ) : (
            <Link to="/train/" search={{ n: r.train.number }} className="hover:text-primary">
              <span className="text-primary">{r.train.number}</span> {r.train.name}
            </Link>
          )}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {r.from.name} ({r.from.code}) → {r.to.name} ({r.to.code})
        </p>
        {r.trainCancelled && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 font-semibold text-destructive">
            <TriangleAlert aria-hidden className="size-5 shrink-0" /> Indian Railways has cancelled this train.
          </p>
        )}
        {summary(r.passengers).length > 0 && (
          <ul aria-label="Tickets" className="mt-4 flex flex-wrap gap-2">
            {summary(r.passengers).map((s) => (
              <li key={s.state} className={"rounded-lg border px-3 py-1 text-sm font-bold " + STATE[s.state as Exclude<PnrState, "unknown">].tone}>
                {s.count} {STATE[s.state as Exclude<PnrState, "unknown">].count}
              </li>
            ))}
          </ul>
        )}
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {r.date && (
            <li className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
              <CalendarDays aria-hidden className="size-4 text-primary" /> {dateText(r.date)}
            </li>
          )}
          {r.travelClass && <li className="rounded-full border border-border px-3 py-1">Class {r.travelClass}</li>}
          <li className="rounded-full border border-border px-3 py-1">Quota {r.quota}</li>
          <li
            className={
              "rounded-full border px-3 py-1 font-semibold " +
              (r.chartPrepared ? "border-chart-5/50 bg-chart-5/15 text-chart-5" : "border-border text-muted-foreground")
            }
          >
            {r.chartPrepared ? "Chart prepared" : "Chart not prepared"}
          </li>
        </ul>
      </div>
      {r.passengers.length > 0 ? (
        // Phones: two columns, the booking status under the current one, so the table fits a 320 px screen.
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-normal text-muted-foreground sm:text-xs sm:tracking-wider">
            <tr>
              <th scope="col" className="px-3 py-3 sm:px-5 md:px-6">Passenger</th>
              <th scope="col" className="hidden px-2 py-3 sm:table-cell">Booking status</th>
              <th scope="col" className="px-3 py-3 sm:px-5 md:px-6">Current status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {r.passengers.map((p) => {
              const state = stateOf(p);
              const known = state === "unknown" ? null : STATE[state];
              const seat = seatText(p, state);
              // The status words beside the plain word, when they add something ("WL/3", "RAC/S5/12").
              const words = known && p.current && !/^(CNF|CAN)/i.test(p.current) && !seat ? p.current : "";
              return (
                <tr key={p.number} className="align-top">
                  <th scope="row" className="px-3 py-4 font-medium sm:px-5 md:px-6">{p.number}</th>
                  <td className="hidden px-2 py-4 font-mono text-sm text-muted-foreground [overflow-wrap:anywhere] sm:table-cell">{p.booking || "—"}</td>
                  <td className="px-3 py-4 sm:px-5 md:px-6">
                    <span className={"inline-block whitespace-nowrap rounded-lg border px-2.5 py-1 font-semibold " + (known ? known.tone : statusTone(p.current))}>
                      {known ? known.word : p.current || "Not known"}
                    </span>
                    {words && <span className="ml-2 font-mono text-muted-foreground">{words}</span>}
                    {seat && <span className="mt-1.5 block font-semibold text-foreground">{seat}</span>}
                    {p.booking && (
                      <span className="mt-1 block font-mono text-xs text-muted-foreground [overflow-wrap:anywhere] sm:hidden">Booked {p.booking}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="p-6 text-muted-foreground">No passenger details came with this booking.</p>
      )}
      <div className="flex flex-col gap-4 border-t border-border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p className="text-sm text-muted-foreground">
          Follow {r.train.number} live, get alerts before your station and chat with your co-passengers in RailBuzz.
        </p>
        <PlayButton medium="pnr_result" className="shrink-0" />
      </div>
    </section>
  );
}

export function PnrTool() {
  const [pnr, setPnr] = useState("");
  const [state, setState] = useState<"idle" | "checking">("idle");
  const [result, setResult] = useState<PnrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  async function check(e: FormEvent) {
    e.preventDefault();
    if (state === "checking") return;
    if (!/^\d{10}$/.test(pnr)) {
      setError(ERRORS["bad_request"] ?? null);
      return;
    }
    setState("checking");
    setError(null);
    setResult(null);
    try {
      const r = await lookup({ kind: "pnr", pnr }, honeypot.current?.value ?? "");
      if ("result" in r) setResult(r.result);
      else setError(ERRORS[r.error] ?? ERRORS["unavailable"] ?? null);
    } finally {
      setState("idle");
    }
  }

  return (
    <div>
      <form onSubmit={check} noValidate className="relative">
        <label htmlFor="pnr-input" className="mb-2 block text-sm font-semibold">
          PNR number
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Ticket aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="pnr-input"
              name="pnr"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit PNR from your ticket"
              aria-describedby="pnr-hint"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 font-mono text-lg tracking-[0.2em] outline-none transition placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
            />
          </div>
          {/* For bots that fill every field. People never see it. */}
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
          <button
            type="submit"
            disabled={state === "checking"}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-7 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-70"
          >
            {state === "checking" ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <ArrowRight aria-hidden className="size-5" />}
            {state === "checking" ? "Checking…" : "Check PNR status"}
          </button>
        </div>
        <p id="pnr-hint" className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          RailBuzz doesn&rsquo;t store your PNR or its status. Up to 5 checks a day on the website.
        </p>
        <div aria-live="polite">
          {error && <p className="mt-4 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm">{error}</p>}
        </div>
      </form>
      {result && <ResultCard r={result} />}
    </div>
  );
}
