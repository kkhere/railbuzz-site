import { History, X } from "lucide-react";
import type { ReactNode } from "react";

// The "Recent" row just above a search box (lib/recent.ts): a tap searches
// again, ✕ drops one, Clear drops them all. Nothing shows until there is one.
// On a phone the chips are one line, swiped sideways: five stacked pushed
// the box below the fold.

export type RecentChip = {
  key: string;
  /** What the chip shows. */
  label: ReactNode;
  /** The same in words, for screen readers and the tooltip: "12727 Godavari Express". */
  words: string;
  /** A tap: a link of its own (a train's page), or a search run here. */
  link?: (className: string, content: ReactNode) => ReactNode;
  onPick?: () => void;
  onRemove: () => void;
};

const PICK =
  "min-w-0 truncate rounded-l-xl py-1.5 pl-3 pr-1 text-left font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function RecentSearches({
  what,
  chips,
  onClear,
  className = "mb-3",
}: {
  /** "trains", "PNRs", "routes", "stations": for "Recent trains". */
  what: string;
  chips: RecentChip[];
  onClear: () => void;
  className?: string;
}) {
  if (chips.length === 0) return null;
  return (
    <div role="group" aria-label={`Recent ${what}`} className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <History aria-hidden className="size-3.5" /> Recent
        </span>
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear recent ${what}`}
          className="-my-1 px-1 py-1 text-xs font-semibold text-muted-foreground underline-offset-2 transition hover:text-primary hover:underline"
        >
          Clear
        </button>
      </div>
      {/* Phones: one line, swiped sideways, so the box stays near the top. Wider: wrapped. */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const content = (
            <>
              <span className="sr-only">Search again: </span>
              {c.label}
            </>
          );
          return (
            <span
              key={c.key}
              title={c.words}
              className="inline-flex h-9 max-w-[15rem] shrink-0 sm:max-w-[22rem] items-center rounded-xl border border-border bg-card text-sm transition hover:border-primary"
            >
              {c.link ? (
                c.link(PICK, content)
              ) : (
                <button type="button" onClick={c.onPick} className={PICK}>
                  {content}
                </button>
              )}
              <button
                type="button"
                onClick={c.onRemove}
                aria-label={`Remove ${c.words} from recent ${what}`}
                className="mr-1 grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
