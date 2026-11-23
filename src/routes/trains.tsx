import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { SearchHub, type Tab } from "@/components/search-hub";
import { PlayButton } from "@/components/site-layout";
import { useHydrated, useQueryKey } from "@/lib/hydrated";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// Search Trains: every way to look a train up, on one page (the owner, 15
// November 2026): a train by number or name, the trains between two stations,
// a station's live board, a PNR. ?tab=between&from=SC&to=BZA, ?tab=station&code=BZA
// and ?tab=pnr open on that search; a PNR never goes in the address.

const TITLE = "Search Trains: Timetables, Live Stations & PNR | RailBuzz";
const DESCRIPTION =
  "Search any Indian Railways train by number or name, find trains between stations, see live station departures or check PNR status. Free.";

const faqs: { q: string; a: string }[] = [
  {
    q: "How do I find a train's timetable?",
    a: "Type the train's number (for example 12727) or a word of its name (for example Godavari) in the Train tab, and open it. You get every halt with its arrival and departure times, platform, day of the journey and distance, plus the coach position.",
  },
  {
    q: "How do I find trains between two stations?",
    a: "Open the Between stations tab, choose the station you leave from and the one you are going to, by name or code, and search. Every train that stops at both is listed with its times, journey time and running days.",
  },
  {
    q: "Can I see which trains are at a station right now?",
    a: "Yes. The Station board tab shows the trains due at any station in the next few hours, with the expected times, delays and platforms Indian Railways reports.",
  },
  {
    q: "Can I check my PNR status here?",
    a: "Yes. The PNR tab checks your booking: each passenger's booking and current status, coach and berth, and whether the chart is prepared. RailBuzz does not store the PNR.",
  },
  {
    q: "Where is my train right now?",
    a: "Open the train in the RailBuzz app for its live running status: where it is, how late it is running and the expected time at every halt ahead. You can also subscribe to the train for travel updates.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Search trains", item: pageUrl("/trains") },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const TAB_IDS: Tab[] = ["train", "between", "station", "pnr"];
const station = (v: unknown) => {
  const s = String(v ?? "").toUpperCase();
  return /^[A-Z0-9]{1,8}$/.test(s) ? s : undefined;
};

type Search = { tab?: Tab; from?: string; to?: string; code?: string };

export const Route = createFileRoute("/trains")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    const tab = String(s["tab"] ?? "");
    if ((TAB_IDS as string[]).includes(tab)) out.tab = tab as Tab;
    const from = station(s["from"]);
    const to = station(s["to"]);
    if (from && to) {
      out.from = from;
      out.to = to;
    }
    const code = station(s["code"]);
    if (code) out.code = code;
    return out;
  },
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/trains"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: TrainsPage,
});

function TrainsPage() {
  // The query once React has the page (lib/hydrated.ts): built with none. The
  // panel then starts again on the query's tab and stations, once.
  const query = Route.useSearch();
  const search: Search = useHydrated() ? query : {};
  const panel = useQueryKey();
  const navigate = useNavigate({ from: Route.fullPath });
  const tab: Tab = search.tab ?? (search.from ? "between" : search.code ? "station" : "train");

  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Search trains</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Search trains</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        A train&rsquo;s timetable, the trains between two stations, a station&rsquo;s live board or your PNR status: all of
        Indian Railways, in one place.
      </p>

      <div className="mt-8">
        <SearchHub
          key={panel}
          initialTab={tab}
          from={search.from}
          to={search.to}
          code={search.code}
          onTab={(t) => void navigate({ search: { tab: t }, replace: true })}
          onBetween={(from, to) => void navigate({ search: { tab: "between", from, to }, replace: true })}
          onStation={(code) => void navigate({ search: { tab: "station", code }, replace: true })}
        />
      </div>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">Found your train? Follow it live.</h2>
            <p className="mt-2 text-muted-foreground">
              RailBuzz shows where it is right now, lets you subscribe to it for travel updates and puts you in a chat room with the
              passengers on board.
            </p>
          </div>
          <PlayButton medium="search_page" />
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

    </main>
  );
}
