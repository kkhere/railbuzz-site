import { ArrowLeftRight, Signpost, Ticket, TrainFront } from "lucide-react";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { BetweenTool } from "@/components/tools/between-tool";
import { PnrTool } from "@/components/tools/pnr-tool";
import { StationTool } from "@/components/tools/station-tool";
import { TrainSearch } from "@/components/train-search";

// Every way to look a train up, in one panel: a train by number or name, the
// trains between two stations, a station's live board, a PNR. Used on Search
// Trains (/trains/), the home page and the pages search engines land on for
// each (/trains-between-stations/, /station-departures/, /pnr-status/).
//
// Every panel stays mounted once opened, so switching tabs keeps what was
// typed and found.

export type Tab = "train" | "between" | "station" | "pnr";

export const TABS: { id: Tab; label: string; short: string; icon: typeof TrainFront; hint: string }[] = [
  { id: "train", label: "Train", short: "Train", icon: TrainFront, hint: "Any Indian Railways train: a number like 12727, or a name like Godavari or Rajdhani." },
  { id: "between", label: "Between stations", short: "From – To", icon: ArrowLeftRight, hint: "Every train from one station to another." },
  { id: "station", label: "Station board", short: "Station", icon: Signpost, hint: "Trains due at a station now: times, delays, platforms." },
  { id: "pnr", label: "PNR status", short: "PNR", icon: Ticket, hint: "Your booking and each passenger's current status." },
];

export function SearchHub({
  initialTab = "train",
  from,
  to,
  code,
  onTab,
  onBetween,
  onStation,
}: {
  initialTab?: Tab;
  /** A shared From–To or station link's codes, searched once. */
  from?: string | undefined;
  to?: string | undefined;
  code?: string | undefined;
  onTab?: ((tab: Tab) => void) | undefined;
  onBetween?: ((from: string, to: string) => void) | undefined;
  onStation?: ((code: string) => void) | undefined;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [opened, setOpened] = useState<Set<Tab>>(() => new Set([initialTab]));
  const id = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const choose = (t: Tab, focus = false) => {
    setTab(t);
    setOpened((o) => new Set(o).add(t));
    onTab?.(t);
    if (focus) tabRefs.current[t]?.focus();
  };

  // Arrow keys move between tabs, as a tab list should.
  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const t = TABS[(next + TABS.length) % TABS.length];
    if (t) choose(t.id, true);
  };

  const active = TABS.find((t) => t.id === tab);

  return (
    <div id="search" className="scroll-mt-24 rounded-3xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/30">
      <div role="tablist" aria-label="Search by" onKeyDown={onKey} className="grid grid-cols-4 gap-1 border-b border-border p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`${id}-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => choose(t.id)}
            className={
              "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-semibold transition sm:flex-row sm:gap-2 sm:text-sm " +
              (tab === t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-background/60 hover:text-foreground")
            }
          >
            <t.icon aria-hidden className="size-4.5 shrink-0" />
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="p-5 md:p-7">
        {active && <p className="mb-5 text-sm text-muted-foreground">{active.hint}</p>}
        {TABS.map((t) =>
          opened.has(t.id) ? (
            <div key={t.id} role="tabpanel" id={`${id}-panel-${t.id}`} aria-labelledby={`${id}-tab-${t.id}`} hidden={tab !== t.id}>
              {t.id === "train" && <TrainSearch id="search-train" autoFocusOnHash hint={false} />}
              {t.id === "between" && <BetweenTool initialFrom={from} initialTo={to} onSearch={onBetween} />}
              {t.id === "station" && <StationTool initialCode={code} onSearch={onStation} />}
              {t.id === "pnr" && <PnrTool />}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
