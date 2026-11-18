import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { RAIL_API } from "@/lib/rail-api";
import { isCrawler } from "@/lib/crawler";

// Visit counts for the RailBuzz dashboard (admin app's /api/public/visit,
// migration 084): one beacon per page shown, and one per tap on a Google
// Play button with the button's name (the utm_medium playLink() gives it).
// Sent with sendBeacon as text/plain: no cookie, nothing stored in the
// browser, nothing read back. What is sent: the page, the referring site,
// a utm_source, the screen's width. The privacy page says so
// ("Website visit counts").

const VISIT_API = RAIL_API.replace(/\/rail$/, "/visit");

function send(body: Record<string, unknown>) {
  try {
    const data = JSON.stringify(body);
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(VISIT_API, data)) return;
    void fetch(VISIT_API, { method: "POST", body: data, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  } catch {
    // Counting is never worth an error on the page.
  }
}

/** The Play button's name from its link, "home_hero"; "other" when it has none. */
export function playButtonOf(href: string): string {
  try {
    const referrer = new URL(href).searchParams.get("referrer") ?? "";
    const medium = new URLSearchParams(referrer).get("utm_medium") ?? "";
    return medium.replace(/[^a-z0-9_]/g, "").slice(0, 60) || "other";
  } catch {
    return "other";
  }
}

export function VisitBeacon() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // Test browsers, page-speed tools and crawlers are not visitors (lib/crawler.ts).
    if (isCrawler()) return;
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    send({ k: "view", p: path, r: document.referrer, ...(utm ? { s: utm } : {}), w: window.screen.width });
  }, [path]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || !link.href.startsWith("https://play.google.com/") || isCrawler()) return;
      send({ k: "play", p: window.location.pathname, l: playButtonOf(link.href), w: window.screen.width });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
