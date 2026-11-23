import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { appIntent, OpenInApp } from "@/components/open-in-app";
import { isCrawler } from "@/lib/crawler";
import { pageHead, playLink } from "@/lib/legal-page";
import { hasPage } from "@/lib/trains";

// railbuzz.in/open/?train=12727 or ?station=SC: the link "Open in RailBuzz"
// hands to the app (components/open-in-app.tsx). RailBuzz opens it itself
// from build 15 (its manifest claims /open); this page is what shows when it
// cannot: no app, an older one, a desktop. On Android it hands the link to
// RailBuzz once a visit, as /room does. Not for search engines (noindex).

export const Route = createFileRoute("/open")({
  validateSearch: (s: Record<string, unknown>) => ({
    train:
      String(s["train"] ?? "")
        .replace(/[^0-9]/g, "")
        .slice(0, 6) || undefined,
    station:
      String(s["station"] ?? "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8) || undefined,
  }),
  head: () =>
    pageHead("Open in RailBuzz", "Open this train or station in the RailBuzz app.", "/open", true),
  component: OpenPage,
});

function OpenPage() {
  const { train, station } = Route.useSearch();
  const target = train && train.length >= 4 ? { train } : station ? { station } : null;

  useEffect(() => {
    if (!target || isCrawler() || !/Android/i.test(navigator.userAgent)) return;
    try {
      const key = `railbuzz-open-${train ?? ""}-${station ?? ""}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage refused: the button below still works.
    }
    window.location.href = appIntent(target, playLink("open_link", train ?? station));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [train, station]);

  const name = train ? `train ${train}` : station ? `station ${station}` : "RailBuzz";
  return (
    <main className="mx-auto max-w-3xl px-5 pt-14">
      <h1 className="text-4xl font-bold md:text-5xl">Open {name} in RailBuzz</h1>
      <p className="mt-3 text-muted-foreground">
        {train
          ? `Where ${train} is right now, how late it is and its platform. Subscribe to it for travel updates.`
          : station
            ? `The trains due at ${station}, how late they are and their platforms.`
            : "Live train status, travel updates for the trains you subscribe to, and a chat room for every train."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {target ? (
          <OpenInApp {...target} medium="open_link" />
        ) : (
          <OpenInApp station="SC" medium="open_link" label="Get RailBuzz" />
        )}
        {train && hasPage(train) && (
          <Link
            to="/train/$number/"
            params={{ number: train }}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 font-semibold transition hover:border-primary"
          >
            {train} timetable
          </Link>
        )}
        {train && !hasPage(train) && (
          <Link
            to="/train/"
            search={{ n: train }}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 font-semibold transition hover:border-primary"
          >
            {train} timetable
          </Link>
        )}
        {station && (
          <Link
            to="/station-departures/"
            search={{ code: station }}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 font-semibold transition hover:border-primary"
          >
            {station} live board
          </Link>
        )}
      </div>
    </main>
  );
}
