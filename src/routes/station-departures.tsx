import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { SearchHub } from "@/components/search-hub";
import { PlayButton } from "@/components/site-layout";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// Station departures: the page search engines land on for it. The search itself is the
// Search Trains panel, opened on its tab (components/search-hub.tsx).

const TITLE = "Live Station Departures: Trains Due Now | RailBuzz";
const DESCRIPTION =
  "The live board for any Indian Railways station: trains arriving and leaving in the next hours, expected times, delays and platforms.";

const faqs: { q: string; a: string }[] = [
  {
    q: "What does the station board show?",
    a: "The trains due at the station in the next few hours: when each is due by the timetable, when it is expected now, how late it is running and the platform, as Indian Railways reports them.",
  },
  {
    q: "How up to date is it?",
    a: "Each board is at most two minutes old when you open it. Tap Refresh for the latest, or follow a train in the RailBuzz app to have its position kept up to date for you.",
  },
  {
    q: "Can I find my train's platform here?",
    a: "Yes, when Indian Railways has announced it. Platforms can change at short notice, so check the station's displays and announcements too.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Station departures", item: pageUrl("/station-departures") },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">Search trains</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Station departures</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Station departures</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        The live board for any station: the trains due in the next hours, when they are expected, how late they are and the platform.
      </p>

      <div className="mt-8">
        <SearchHub initialTab="station" code={search.code} onStation={(code) => void navigate({ search: { code }, replace: true })} />
      </div>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">Waiting for a train? Keep it in your pocket.</h2>
            <p className="mt-2 text-muted-foreground">
              Subscribe to it in RailBuzz for updates until it reaches you, or join its chat room to hear from the passengers on board.
            </p>
          </div>
          <PlayButton medium="station_page" />
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 pt-14">
        <h2 className="text-2xl font-bold md:text-3xl">Questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{f.q}</h3>
                <ChevronDown aria-hidden className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-12 border-t border-border pt-5 text-xs text-muted-foreground">
        As Indian Railways reports it. RailBuzz is an independent app, not affiliated with Indian Railways or IRCTC.
      </p>
    </main>
  );
}
