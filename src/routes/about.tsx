import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/site-layout";
import { PLAY_URL, SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";

// About RailBuzz: who and what it is, in plain sentences that a person, a
// search engine or an AI assistant can quote as they are. Every fact here is
// one the site already states elsewhere; change them together.

const TITLE = "About RailBuzz: Live Train Status and Train Chat";
const DESCRIPTION =
  "RailBuzz is a free Android app for Indian Railways passengers: live train status, alerts, PNR status and a chat room for every train. Made in India.";

const facts: [string, ReactNode][] = [
  ["What it is", "An app for Indian Railways passengers, and this website"],
  ["Available on", <a key="play" href={PLAY_URL} className="text-primary hover:underline">Google Play (Android)</a>],
  ["Price", "Free: every feature is free to use"],
  ["Launched", "November 2026"],
  ["Made in", "India"],
  ["Train information from", <a key="rr" href="https://railradar.in" rel="noopener" className="text-primary hover:underline">RailRadar</a>],
  ["Affiliation", "Independent: not run by or affiliated with Indian Railways, IRCTC or any government body"],
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
        RailBuzz is a free Android app for Indian Railways passengers. It shows where a train is right now and when it
        should reach your station, sends updates and alerts to your phone until your stop, checks PNR status, and gives
        every train a chat room for each day it runs, where the passengers on that train can talk to each other.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">What RailBuzz does</h2>
        <ul className="mt-4 space-y-3 text-muted-foreground">
          <li>
            <strong className="text-foreground">Live running status.</strong> The station a train last passed, how late it is
            running and the expected time at every halt ahead.
          </li>
          <li>
            <strong className="text-foreground">Subscribe to a Train.</strong> An update on your phone about every hour, and
            alerts before your boarding station and your destination.
          </li>
          <li>
            <strong className="text-foreground">Train chat.</strong> A chat room for every train on each day it runs. Passengers
            appear under an alias, never their name or phone number.{" "}
            <Link to="/train-chat/" className="text-primary hover:underline">How train chat works</Link>.
          </li>
          <li>
            <strong className="text-foreground">Search.</strong> Any train&rsquo;s timetable, trains between two stations, a
            station&rsquo;s live departures and PNR status, in the app and on{" "}
            <Link to="/trains/" className="text-primary hover:underline">this website</Link>.
          </li>
          <li>
            <strong className="text-foreground">RailBuzz AI.</strong> Answers travel questions in plain words: food on the
            train, fares, refund rules and railway news.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Where the information comes from</h2>
        <p className="mt-4 text-muted-foreground">
          Timetables, running status, station boards and PNR status come from{" "}
          <a href="https://railradar.in" rel="noopener" className="text-primary hover:underline">RailRadar</a>, as Indian
          Railways reports them. RailBuzz is independent: it is not run by, endorsed by or affiliated with Indian Railways,
          IRCTC or any government body. For anything official, check Indian Railways&rsquo; National Train Enquiry System
          (enquiry.indianrail.gov.in) or call 139.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Privacy and safety</h2>
        <p className="mt-4 text-muted-foreground">
          RailBuzz does not sell your data or use it for advertising. Posting in a chat room needs a mobile number verified on
          your phone, everyone follows seven short{" "}
          <Link to="/community-guidelines/" className="text-primary hover:underline">community rules</Link>, and a content
          complaint is acknowledged within 24 hours. The{" "}
          <Link to="/privacy/" className="text-primary hover:underline">Privacy Policy</Link> sets out what is kept and for how
          long.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">RailBuzz at a glance</h2>
        <dl className="mt-5 overflow-hidden rounded-2xl border border-border">
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

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
