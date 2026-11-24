import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, TrainFront } from "lucide-react";
import { SearchHub } from "@/components/search-hub";
import { PlayButton } from "@/components/site-layout";
import { statusTone } from "@/components/tools/pnr-tool";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// PNR status: the page search engines land on for "PNR status". The check
// itself is the Search Trains panel's PNR tab (components/tools/pnr-tool.tsx);
// this page adds what the codes mean and the questions people ask.

const TITLE = "PNR Status Check: Indian Railways Booking Status | RailBuzz";
const DESCRIPTION =
  "Check your Indian Railways PNR status: each passenger's booking and current status, coach, berth and chart. What CNF, RAC and WL mean.";

const codes: { code: string; meaning: string }[] = [
  { code: "CNF", meaning: "Confirmed. A seat or berth is yours; the coach and berth number are shown with it." },
  { code: "RAC", meaning: "Reservation Against Cancellation. You can board, and share a side lower berth until one frees up." },
  { code: "WL / GNWL", meaning: "General waiting list, for journeys from the train's starting station or near it. It confirms most often." },
  { code: "PQWL", meaning: "Pooled quota waiting list, for journeys between stations along the route. It confirms less often." },
  { code: "RLWL", meaning: "Remote location waiting list, for journeys from a major station along the route." },
  { code: "TQWL", meaning: "Tatkal waiting list, for tickets booked in the Tatkal quota." },
  { code: "RSWL", meaning: "Roadside station waiting list, for short journeys from stations near the start." },
  { code: "CAN", meaning: "Cancelled. The ticket for this passenger has been cancelled." },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Where do I find my PNR number?",
    a: "The PNR (Passenger Name Record) is the 10-digit number at the top of your ticket. It is also in the SMS and email IRCTC sends when you book, and in your IRCTC booking history.",
  },
  {
    q: "What is the difference between booking status and current status?",
    a: "Booking status is what you got when you booked, for example WL 14. Current status is where the ticket stands now, after other passengers' cancellations, for example CNF B4 58 once it has confirmed.",
  },
  {
    q: "What does 'chart prepared' mean?",
    a: "Before the train leaves its first station, Indian Railways prepares the reservation chart: the final list of who sits where. Once it is prepared, confirmed tickets show their coach and berth, and fully waitlisted e-tickets are cancelled and refunded automatically.",
  },
  {
    q: "Can I travel on a waitlisted ticket?",
    a: "With RAC, yes: you board and share a berth. A fully waitlisted e-ticket is cancelled automatically when the chart is prepared, so you cannot board with it. Check the current rules with IRCTC before you travel.",
  },
  {
    q: "Is it safe to check my PNR here?",
    a: "Yes. A PNR status shows the journey and each passenger's status, not names or contact details. RailBuzz does not store the PNR you enter or its answer. To keep the service fair, the website counts checks per internet address, kept only as a one-way code for two days.",
  },
  {
    q: "How many PNRs can I check?",
    a: "Up to 5 a day on the website. The RailBuzz app checks more, keeps your journey's running status in view and lets you subscribe to the train for travel updates.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "PNR status", item: pageUrl("/pnr-status") },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export const Route = createFileRoute("/pnr-status")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/pnr-status"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: PnrPage,
});

function PnrPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">Search trains</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">PNR status</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">PNR status</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Check the booking status of your Indian Railways ticket: each passenger&rsquo;s status, coach and berth, and
        whether the chart is prepared.
      </p>

      <div className="mt-8">
        <SearchHub initialTab="pnr" />
      </div>

      <section id="status-codes" className="scroll-mt-20 pt-16">
        <h2 className="text-2xl font-bold md:text-3xl">How to read your PNR status</h2>
        <p className="mt-3 text-muted-foreground">
          Each passenger has a booking status (when you booked) and a current status (now). These are the codes you will see.
        </p>
        <dl className="mt-6 overflow-hidden rounded-2xl border border-border">
          {codes.map((c) => (
            <div key={c.code} className="grid gap-1 border-b border-border p-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt>
                <span className={"inline-block rounded-lg border px-2.5 py-1 font-mono text-sm font-semibold " + statusTone(c.code)}>{c.code}</span>
              </dt>
              <dd className="text-muted-foreground">{c.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <TrainFront aria-hidden className="size-6 text-primary" /> After the PNR: your train, live
            </h2>
            <p className="mt-2 text-muted-foreground">
              RailBuzz shows where your train is, lets you subscribe to it for travel updates, and puts you in a chat room with the
              passengers on the same train.
            </p>
          </div>
          <PlayButton medium="pnr_page" />
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 pt-16">
        <h2 className="text-2xl font-bold md:text-3xl">PNR questions</h2>
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

      <p className="mt-12 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        PNR status as Indian Railways&rsquo; reservation system gives it.
      </p>
    </main>
  );
}
