import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { SearchHub } from "@/components/search-hub";
import { PlayButton } from "@/components/site-layout";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// Trains between stations: the page search engines land on for it. The search itself is the
// Search Trains panel, opened on its tab (components/search-hub.tsx).

const TITLE = "Trains Between Stations: Times and Running Days | RailBuzz";
const DESCRIPTION =
  "Find every train between two Indian Railways stations, with departure and arrival times, journey time and the days each train runs. Free.";


const faqs: { q: string; a: string }[] = [
  {
    q: "How do I find trains between two stations?",
    a: "Type the station you leave from and the one you are going to, by name or code (for example Secunderabad or SC), and search. You get every train that stops at both, in that order, with its times at your two stations.",
  },
  {
    q: "Why does a train run on different days at my station?",
    a: "A train's running days are the days it leaves its first station. A long-distance train may reach your station the next day, so the days shown here are the days it leaves the station you board at.",
  },
  {
    q: "Can I see where the train is right now?",
    a: "Open the train in the RailBuzz app for its live running status, alerts before your station and a chat room with the passengers on board.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Trains between stations", item: pageUrl("/trains-between-stations") },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const code = (v: unknown) => {
  const s = String(v ?? "").toUpperCase();
  return /^[A-Z0-9]{1,8}$/.test(s) ? s : undefined;
};

export const Route = createFileRoute("/trains-between-stations")({
  validateSearch: (s: Record<string, unknown>): { from?: string; to?: string } => {
    const from = code(s["from"]);
    const to = code(s["to"]);
    return from && to ? { from, to } : {};
  },
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/trains-between-stations"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: BetweenPage,
});

function BetweenPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">Search trains</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Trains between stations</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Trains between stations</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Every train from one station to another, with its times at both, the journey time and the days it runs.
      </p>

      <div className="mt-8">
        <SearchHub initialTab="between" from={search.from} to={search.to} onBetween={(from, to) => void navigate({ search: { from, to }, replace: true })} />
      </div>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">Picked your train? Follow it live.</h2>
            <p className="mt-2 text-muted-foreground">
              RailBuzz shows where it is, alerts you before your station and puts you in a chat room with the passengers on board.
            </p>
          </div>
          <PlayButton medium="between_page" />
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
        Times from RailRadar&rsquo;s timetable. RailBuzz is an independent app, not affiliated with Indian Railways or IRCTC.
      </p>
    </main>
  );
}
