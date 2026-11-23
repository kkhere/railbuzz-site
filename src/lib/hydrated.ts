import { useState, useSyncExternalStore } from "react";

// The pages are built ahead with no query in their address (prerendered), and
// opened with one: /open/?train=12727, /station-departures/?code=SC,
// /trains/?tab=pnr, /train/?n=17255, /room/?t=12727. React's first render on
// the phone has to give the page it was handed; one that already reads the
// query gives another, and React throws error #418 and redraws the whole page.
// So a page reads its query only once React has taken it over, one render
// later (the owner, 23 November 2026).

const noChange = () => () => undefined;

/**
 * False in the page built ahead and in React's first render on the phone;
 * true from the next render on, and from the start on a page opened from
 * another (nothing is handed over then).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noChange,
    () => true,
    () => false,
  );
}

/**
 * A key that changes once, right after React's first render, on a page opened
 * with a query; otherwise it never changes. For parts that read the query only
 * as they start (the search panel's tab, a shared link's stations): given this
 * as their key, they start again with it.
 */
export function useQueryKey(): string {
  const hydrated = useHydrated();
  // Read as the page opens, not rendered: the first render stays the built one.
  const [opened] = useState(() => (typeof window === "undefined" ? "" : window.location.search));
  return hydrated && opened.length > 1 ? "query" : "page";
}
