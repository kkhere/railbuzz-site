import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, Flag, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { IndiaFlag, PlayButton } from "@/components/site-layout";
import { PLAY_URL, SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// About RailBuzz: who and what it is, in plain sentences that a person, a
// search engine or an AI assistant can quote as they are. Every fact here is
// one the site already states elsewhere; change them together.
//
// RailBuzz is the subject of its own story (the owner, 16 November 2026): the
// railway data services behind the train information are not named here, only
// described. The Privacy Policy still names who receives what.

const TITLE = "About RailBuzz: Live Train Status and Train Chat";
const DESCRIPTION =
  "RailBuzz is a free Android app for Indian Railways passengers: live train status, travel updates for the trains you subscribe to, PNR status, railway news and train chat. Made in India.";

const features: { name: string; text: ReactNode }[] = [
  {
    name: "Live Running Status",
    text: "The station a train last passed, how late it is running and when it will reach every halt ahead, with RailBuzz's own arrival estimates.",
  },
  {
    name: "Subscribe to a Train",
    text: "An update on your phone about every hour, an alert before your boarding station and another before your destination, even with the app closed.",
  },
  {
    name: "Train Chat",
    text: (
      <>
        A chat room for every train on each day it runs, for the passengers on board: delays, platforms, which coach is where, and help
        when someone needs it. <Link to="/train-chat/" className="text-primary hover:underline">How train chat works</Link>.
      </>
    ),
  },
  {
    name: "RailBuzz AI",
    text: "Answers travel questions in plain words: food on the train, fares, refund rules and PNR status.",
  },
  {
    name: "Latest Railway News",
    text: "Railway news near you first, disruptions that could affect your train, and the big stories from across India, through the day.",
  },
];

const built: { title: string; text: ReactNode }[] = [
  {
    title: "Arrival estimates",
    text: (
      <>
        Worked out from where each train actually is, and kept moving while a train is held. In tests on 150 journeys: off by a median of
        4 minutes in the last half hour.{" "}
        <Link to="/guides/running-status/" className="text-primary hover:underline">How running status works</Link>.
      </>
    ),
  },
  {
    title: "Timetables for every train",
    text: (
      <>
        Its own timetables for more than 14,000 trains, with a page for each long-distance train and for 1,350 stations.{" "}
        <Link to="/trains/" className="text-primary hover:underline">Search trains</Link>.
      </>
    ),
  },
  {
    title: "Punctuality data",
    text: (
      <>
        How late the trains RailBuzz follows really arrive: 45 trains, 773 journeys so far.{" "}
        <Link to="/punctuality/" className="text-primary hover:underline">How late do trains run?</Link>
      </>
    ),
  },
];

const safety: { icon: typeof ShieldCheck; title: string; text: ReactNode }[] = [
  { icon: BadgeCheck, title: "Verified numbers", text: "Posting in a train's live chat needs a mobile number verified on your own phone." },
  { icon: UserRound, title: "Aliases, not names", text: "Passengers appear under an alias, never their real name or phone number." },
  {
    icon: ShieldCheck,
    title: "Seven simple rules",
    text: (
      <>
        Everyone follows seven short{" "}
        <Link to="/community-guidelines/" className="text-primary hover:underline">community rules</Link>, and automated checks watch for
        rooms that turn hostile.
      </>
    ),
  },
  { icon: Flag, title: "Report and block", text: "Any message can be reported and any passenger blocked; a complaint is acknowledged within 24 hours." },
  { icon: Clock, title: "Only for the journey", text: "A room closes 15 minutes after the train completes its run." },
];

const facts: [string, ReactNode][] = [
  ["What it is", "An app for Indian Railways passengers, and this website"],
  ["Available on", <a key="play" href={PLAY_URL} className="text-primary hover:underline">Google Play (Android)</a>],
  ["Price", "Free: every feature is free to use"],
  ["Launched", "November 2026"],
  ["Made in", <span key="in" className="inline-flex items-center gap-2">India <IndiaFlag /></span>],
  ["Train information", "Third-party railway data services, as Indian Railways reports it"],
  ["Contact", <a key="mail" href="mailto:support@railbuzz.in" className="text-primary hover:underline">support@railbuzz.in</a>],
  ["Grievance Officer", <span key="go">Kiran Kumar, <a href="mailto:grievance@railbuzz.in" className="text-primary hover:underline">grievance@railbuzz.in</a></span>],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: TITLE,
      url: pageUrl("/about"),
      description: DESCRIPTION,
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "About", item: pageUrl("/about") },
      ],
    },
  ],
};

export const Route = createFileRoute("/about")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/about"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: AboutPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">About</span>
      </nav>
      <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">About RailBuzz</h1>
      <p className="mt-6 text-xl leading-relaxed">
        RailBuzz is a free Android app that keeps Indian Railways passengers informed and connected: where your train is, when it
        reaches you, and a chat room with everyone on board.
      </p>

      <Section title="Our mission">
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Train journeys come with unknowns: a late train, a changed platform, a coach you can&rsquo;t find. RailBuzz exists so no
          passenger travels uninformed, or alone.
        </p>
      </Section>

      <Section title="What RailBuzz does">
        <ol className="mt-6 space-y-5">
          {features.map((f, i) => (
            <li key={f.name} className="flex gap-4">
              <span aria-hidden className="w-10 shrink-0 bg-gradient-primary bg-clip-text font-display text-3xl font-extrabold leading-none text-transparent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold">{f.name}</h3>
                <p className="mt-1 text-muted-foreground">{f.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-muted-foreground">
          On this website: any train&rsquo;s timetable, trains between two stations, a station&rsquo;s live departures and PNR status,
          on <Link to="/trains/" className="text-primary hover:underline">Search Trains</Link>.
        </p>
      </Section>

      <Section title="Built by RailBuzz">
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {built.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Safe train chat">
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {safety.map((s) => (
            <li key={s.title} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <s.icon aria-hidden className="size-4.5" />
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-muted-foreground">
          RailBuzz does not sell your data or use it for advertising. The{" "}
          <Link to="/privacy/" className="text-primary hover:underline">Privacy Policy</Link> sets out what is kept and for how long.
        </p>
      </Section>

      <Section title="Where train information comes from">
        <p className="mt-4 text-muted-foreground">
          RailBuzz uses third-party railway data services for train schedules, running status, station boards and PNR status, as Indian
          Railways reports them.
        </p>
      </Section>

      <Section title="RailBuzz at a glance">
        <dl className="mt-5 overflow-hidden rounded-2xl border border-border">
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="relative mt-14 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">Your next journey, with company.</h2>
            <p className="mt-2 text-muted-foreground">Free on Android.</p>
          </div>
          <PlayButton medium="about_page" />
        </div>
      </section>
    </main>
  );
}
