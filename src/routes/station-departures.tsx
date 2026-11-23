import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SearchHub } from "@/components/search-hub";
import { PlayButton } from "@/components/site-layout";
import { useHydrated } from "@/lib/hydrated";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";
import { OpenInApp } from "@/components/open-in-app";

// Station departures: the page search engines land on for it. The search itself is the
// Search Trains panel, opened on its tab (components/search-hub.tsx).

const TITLE = "Live Station Departures: Trains Due Now | RailBuzz";
const DESCRIPTION =
  "The live board for any Indian Railways station: trains arriving and leaving in the next hours, expected times, delays and platforms.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Station departures",
          item: pageUrl("/station-departures"),
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/station-departures")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => {
    const c = String(s["code"] ?? "").toUpperCase();
    return /^[A-Z0-9]{1,8}$/.test(c) ? { code: c } : {};
  },
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/station-departures"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: StationPage,
});

function StationPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  // The station's button once React has the page (lib/hydrated.ts): built with
  // none. The search panel reads the code only as it starts, after that.
  const code = useHydrated() ? search.code : undefined;
  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          RailBuzz
        </Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">
          Search trains
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Station departures</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Station departures</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        The live board for any station: the trains due in the next hours, when they are expected,
        how late they are and the platform.
      </p>

      <div className="mt-8">
        <SearchHub
          initialTab="station"
          code={search.code}
          onStation={(code) => void navigate({ search: { code }, replace: true })}
        />
      </div>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">Waiting for a train? Keep it in your pocket.</h2>
            <p className="mt-2 text-muted-foreground">
              Subscribe to it in RailBuzz for travel updates, or join its chat room to hear from the
              passengers on board.
            </p>
          </div>
          {code ? (
            <OpenInApp
              station={code}
              medium="station_departures"
              label={`Open ${code} in RailBuzz`}
            />
          ) : (
            <PlayButton medium="station_departures" />
          )}
        </div>
      </section>
    </main>
  );
}
