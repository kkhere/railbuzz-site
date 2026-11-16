import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  ChevronDown,
  Clock,
  Flag,
  HandHelping,
  IndianRupee,
  MapPin,
  MessageCircle,
  Newspaper,
  PhoneCall,
  Pin,
  Route as RouteIcon,
  Share2,
  Signpost,
  Sparkles,
  ScrollText,
  Search,
  Ticket,
  TrainFront,
  UserRound,
  Utensils,
  Zap,
  Globe,
  TriangleAlert,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import hero from "@/assets/hero-train.webp";
import heroSmall from "@/assets/hero-train-828.webp";
import { AiVisual, ChatVisual, NewsVisual, StatusVisual, SubscribeVisual } from "@/components/home-visuals";
import { PlayButton } from "@/components/site-layout";
import { PLAY_URL, SITE_URL, pageHead } from "@/lib/legal-page";
import { SearchHub, openSearch } from "@/components/search-hub";

// Every claim on this page is something the app does today (1.0 (13)), and
// every number is one already published in /privacy, /grievance or
// /community-guidelines. Change them together.

const TITLE = "RailBuzz: Live Train Status, PNR & Train Chat for Indian Railways";
const DESCRIPTION =
  "Live train running status, alerts until your stop, PNR status and a chat room with the passengers on your train. Free Android app for Indian Railways.";

type Faq = { q: string; a: ReactNode; text: string };

// The five questions a first-time visitor asks most, shown; five more behind
// "More questions?". Fuller answers live on /train-chat/, /privacy/ and
// /delete-account/.
const faqs: Faq[] = [
  {
    q: "Is RailBuzz free?",
    text: "Yes. RailBuzz is free to download from Google Play, and every feature is free to use. It runs on Android phones.",
    a: "Yes. RailBuzz is free to download from Google Play, and every feature is free to use. It runs on Android phones.",
  },
  {
    q: "Is RailBuzz an official Indian Railways or IRCTC app?",
    text:
      "No. RailBuzz is an independent app, not run by Indian Railways, IRCTC or any government body. Train times, running status and PNR status come from RailRadar (railradar.in).",
    a: (
      <>
        No. RailBuzz is an independent app, not run by Indian Railways, IRCTC or any government body. Train times, running
        status and PNR status come from{" "}
        <a href="https://railradar.in" rel="noopener" className="text-primary underline underline-offset-2">RailRadar</a>.
      </>
    ),
  },
  {
    q: "How do I get alerts before my station?",
    text:
      "In the app, tap Subscribe to a Train and choose your train, the day and the stations where you get on and get down. RailBuzz then updates you about every hour, alerts you about 30 minutes before your boarding station, and again about 20 minutes before your stop. You are also told if the train is delayed or cancelled.",
    a: (
      <>
        In the app, tap <strong className="text-foreground">Subscribe to a Train</strong> and choose your train, the day and
        the stations where you get on and get down. RailBuzz then updates you about every hour, alerts you about 30 minutes
        before your boarding station, and again about 20 minutes before your stop. You are also told if the train is delayed
        or cancelled.
      </>
    ),
  },
  {
    q: "How do I join the chat for my train?",
    text:
      "Find your train in the app and tap Join Chat. Every train has a chat room for each day it runs, with the passengers on that train. The first time, you verify your mobile number with an SMS code.",
    a: (
      <>
        Find your train in the app and tap <strong className="text-foreground">Join Chat</strong>. Every train has a chat room
        for each day it runs, with the passengers on that train. The first time, you verify your mobile number with an SMS
        code. <Link to="/train-chat/" className="text-primary underline underline-offset-2">How train chat works</Link>
      </>
    ),
  },
  {
    q: "Can other passengers see my name or phone number?",
    text:
      "No. In a chat room you appear under an alias such as Traveller-392. Other passengers never see your name or your mobile number.",
    a: (
      <>
        No. In a chat room you appear under an alias such as <strong className="text-foreground">Traveller-392</strong>.
        Other passengers never see your name or your mobile number.
      </>
    ),
  },
];

const moreFaqs: Faq[] = [
  {
    q: "Do I need an account?",
    text:
      "Searching trains on this website needs no account. In the app, you sign in with your mobile number or your Google account. You must be 18 or older to create an account.",
    a: "Searching trains on this website needs no account. In the app, you sign in with your mobile number or your Google account. You must be 18 or older to create an account.",
  },
  {
    q: "Why do I need to verify my mobile number to chat?",
    text:
      "It keeps the rooms accountable: every message comes from a real passenger with a verified number. You verify once on your phone with an SMS code. RailBuzz may ask again if you change your SIM, your number or your phone.",
    a: "It keeps the rooms accountable: every message comes from a real passenger with a verified number. You verify once on your phone with an SMS code. RailBuzz may ask again if you change your SIM, your number or your phone.",
  },
  {
    q: "How long are chat messages kept?",
    text:
      "A train's room closes 15 minutes after the train completes its run, and most chat is deleted within days. Messages someone reported are kept longer, for safety review. The Privacy Policy sets out every period.",
    a: (
      <>
        A train&rsquo;s room closes 15 minutes after the train completes its run, and most chat is deleted within days.
        Messages someone reported are kept longer, for safety review. The{" "}
        <Link to="/privacy/" hash="chat-retention" className="text-primary underline underline-offset-2">Privacy Policy</Link>{" "}
        sets out every period.
      </>
    ),
  },
  {
    q: "Can RailBuzz send help in an emergency?",
    text:
      "No. A help card reaches the passengers in your train's chat room, not railway staff or emergency services. For anything urgent, call 139 (Railway helpline), 112 (police and emergency) or 182 (railway security). RailBuzz keeps these numbers one tap away on the home screen.",
    a: (
      <>
        No. A help card reaches the passengers in your train&rsquo;s chat room, not railway staff or emergency services. For
        anything urgent, call <strong className="text-foreground">139</strong> (Railway helpline),{" "}
        <strong className="text-foreground">112</strong> (police and emergency) or{" "}
        <strong className="text-foreground">182</strong> (railway security). RailBuzz keeps these numbers one tap away on the
        home screen.
      </>
    ),
  },
  {
    q: "How do I delete my account?",
    text:
      "In the app, open the menu, then Settings, then Delete account. You can also ask by email to support@railbuzz.in. The Delete your account page explains what is erased and when.",
    a: (
      <>
        In the app, open the menu, then <strong className="text-foreground">Settings</strong>, then{" "}
        <strong className="text-foreground">Delete account</strong>. You can also ask by email to{" "}
        <a href="mailto:support@railbuzz.in" className="text-primary underline underline-offset-2">support@railbuzz.in</a>. The{" "}
        <Link to="/delete-account/" className="text-primary underline underline-offset-2">Delete your account</Link> page
        explains what is erased and when.
      </>
    ),
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Who RailBuzz is, for search engines' brand panel and logo in results.
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "RailBuzz",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
      description: "RailBuzz makes a free Android app for Indian Railways passengers: live train status, alerts, PNR status and a chat room for every train.",
      foundingDate: "2026-11",
      areaServed: { "@type": "Country", name: "India" },
      email: "support@railbuzz.in",
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer support", email: "support@railbuzz.in", areaServed: "IN", availableLanguage: "en" },
        { "@type": "ContactPoint", contactType: "grievance officer", name: "Kiran Kumar", email: "grievance@railbuzz.in", areaServed: "IN" },
      ],
      sameAs: [PLAY_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "RailBuzz",
      url: `${SITE_URL}/`,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "MobileApplication",
      name: "RailBuzz",
      operatingSystem: "Android",
      applicationCategory: "TravelApplication",
      description: DESCRIPTION,
      url: `${SITE_URL}/`,
      installUrl: PLAY_URL,
      countriesSupported: "IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [...faqs, ...moreFaqs].map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.text },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/"),
    // Search engines read this to show the app and the FAQ in results.
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: Index,
});

// The four things RailBuzz does, under the hero; each opens its section below.
// Taglines chosen by the owner, 15 November 2026. Latest Railway News is in
// the features below, not here (the owner, 16 November 2026).
// Subscribe and Train chat carry a green Live label, as the app's chat does
// (the owner, 16 November 2026); no card is highlighted over the others.
const highlights: { icon: LucideIcon; title: string; text: string; href: string; live?: { short: string; long: string } }[] = [
  { icon: MapPin, title: "Live train status", text: "Where your train is, how late it is, and when it reaches your station.", href: "#running-status" },
  { icon: BellRing, title: "Subscribe to any train", text: "Sit back. Your train updates you every hour, right in your notifications.", href: "#subscribe", live: { short: "Live", long: "Live updates" } },
  { icon: MessageCircle, title: "Train chat", text: "Your train's own group chat: delays, platforms, help and a little fun.", href: "#train-chat", live: { short: "Live", long: "Live" } },
  { icon: Sparkles, title: "RailBuzz AI", text: "Ask anything about your journey. Food, fares, refunds, rules.", href: "#railbuzz-ai" },
];

/** The hero's Find your train and Check PNR status: alike, and side by side even on a phone. */
const HERO_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-3.5 text-sm font-semibold backdrop-blur transition hover:border-primary sm:px-6 sm:text-base";

/** "01", "02"…: the features' numbers. */
const numbered = (i: number) => String(i + 1).padStart(2, "0");

type Point = { icon: LucideIcon; title: string; text: string };

const pillars: {
  id: string;
  /** The feature's name: the big heading. */
  name: string;
  /** One short line under the name: what it does for the passenger. */
  tagline: string;
  text: string;
  points: Point[];
  visual: ReactNode;
  more?: { to: "/train-chat/"; label: string };
}[] = [
  {
    id: "running-status",
    name: "Live Running Status",
    tagline: "Where's my train? One tap tells you.",
    text: "See the station your train last crossed, how late it is running, and when it will reach every station ahead. It keeps updating while you watch.",
    points: [
      { icon: Pin, title: "A shortcut to your train", text: "Keep a train's live status on the edge of every screen and check it with one tap." },
      { icon: Signpost, title: "Station Departures", text: "The live board for any station: the trains arriving and leaving next." },
      { icon: RouteIcon, title: "Trains Between Stations", text: "Every train that runs between two stations, to plan the next journey." },
      { icon: Ticket, title: "PNR Status", text: "Check your booking and each passenger's current status in one place." },
    ],
    visual: <StatusVisual />,
  },
  {
    // Worded as the app's own card ("Hourly updates till your stop"): the
    // updates come about every hour, the two alerts are timed to the passenger's
    // stations from the train's live position (train-watch).
    id: "subscribe",
    name: "Subscribe to a Train",
    tagline: "Sit back. Your train keeps you posted.",
    text: "Tell RailBuzz your train, the day and your stations, just once. Your phone then keeps you posted till your stop, even with the app closed.",
    points: [
      { icon: Clock, title: "Updates about every hour", text: "Where the train is and whether it is on time, sent as it leaves its halts." },
      { icon: BellRing, title: "Boarding alerts", text: "About 30 minutes before the train reaches your station, and again just before, with the platform when it is known." },
      { icon: MapPin, title: "Destination alert", text: "About 20 minutes before your stop, so you are ready to get down." },
      { icon: Newspaper, title: "Delays and cancellations", text: "Told when departure is delayed, when the train is cancelled, or when the news reports a change to it." },
    ],
    visual: <SubscribeVisual />,
  },
  {
    id: "train-chat",
    name: "Train Chat",
    tagline: "Everyone on your train, in one chat.",
    text: "Every train gets its own chat room for each day it runs. Ask about the delay, a platform change or where your coach stops, and hear from people on the same train.",
    points: [
      { icon: MessageCircle, title: "Quick posts", text: "One tap for a Delay Update, Platform Info or Coach Help." },
      { icon: HandHelping, title: "Ask for help", text: "Post a help card with your coach number. Everyone in the room sees it and can reply." },
      { icon: Share2, title: "Share the room", text: "Send a train's room to someone travelling with you. The link opens straight in the app." },
      { icon: Clock, title: "Only for the journey", text: "A room closes 15 minutes after the train completes its run." },
    ],
    visual: <ChatVisual />,
    more: { to: "/train-chat/", label: "How train chat works" },
  },
  {
    id: "railbuzz-ai",
    name: "RailBuzz AI",
    tagline: "Ask anything. Get a straight answer.",
    text: "Ask in your own words: food on the train, fares, refund rules, your PNR. When the answer depends on your train, it is worked out from its live running status.",
    points: [
      { icon: Utensils, title: "Order Food", text: "The next halts where food can reach your seat, with IRCTC's official ways to order." },
      { icon: IndianRupee, title: "Fare Enquiry", text: "Fares for a train, class by class." },
      { icon: ScrollText, title: "IRCTC Rules & Refund", text: "Cancellation and refund rules, explained simply." },
      { icon: Ticket, title: "PNR Status", text: "Your booking and each passenger's status, explained in plain words." },
    ],
    visual: <AiVisual />,
  },
  {
    // The app's Latest News: its pages are Near You (where it opens), Disruptions
    // and National (ui/news/LatestNewsViewModel.kt); news is looked for every
    // three hours, breaking news up to four times a day more (migration 068), and
    // a disruption naming a train shows on that train's screens.
    id: "latest-news",
    name: "Latest Railway News",
    tagline: "Fresh railway news, before you set off.",
    text: "Picked for passengers and updated through the day: what is happening near you, what could affect your train, and the big stories from across India.",
    points: [
      { icon: MapPin, title: "News around you", text: "Railway news from your own state first: new trains, new halts, station works." },
      { icon: TriangleAlert, title: "Disruptions", text: "Cancellations, diversions and delays in the news, also shown on the trains they affect." },
      { icon: Globe, title: "Nationwide news", text: "The big railway stories from across India, short and simple." },
      { icon: Zap, title: "Breaking news", text: "Checked through the day, so you hear the big news early." },
    ],
    visual: <NewsVisual />,
  },
];

const steps = [
  { title: "Install and sign in", text: "Get RailBuzz from Google Play and sign in with your mobile number or your Google account." },
  { title: "Find your train", text: "Search by train number or name, or pick from the popular trains for your state." },
  { title: "Follow it, or join the chat", text: "Open Running Status, subscribe for alerts until your stop, or tap Join Chat." },
];

const safety: Point[] = [
  { icon: BadgeCheck, title: "Verified passengers", text: "Chat needs a mobile number verified on your phone, so everyone in a room is accountable." },
  { icon: UserRound, title: "Aliases, never names", text: "Others see an alias like Traveller-392, never your name or number." },
  { icon: Flag, title: "Report and block", text: "Report a message or block a passenger. Complaints are acknowledged within 24 hours." },
  { icon: PhoneCall, title: "Helplines one tap away", text: "139 Railway, 112 Police and 182 Security, on the app's home screen." },
];


function SectionHead({ eyebrow, title, text, id }: { eyebrow: string; title: string; text?: string; id?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}

/** One question: closed until tapped; opening it closes any other ("common-questions"). */
function Question({ faq }: { faq: Faq }) {
  return (
    <details name="common-questions" className="group rounded-2xl border border-border bg-card open:border-primary/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
        <h3 className="text-base md:text-lg">{faq.q}</h3>
        <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
      </summary>
      <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{faq.a}</p>
    </details>
  );
}

function Index() {
  const [more, setMore] = useState(false);
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img src={hero} srcSet={`${heroSmall} 828w, ${hero} 1600w`} sizes="100vw" alt="An Indian Railways train curving through fields at sunset" width={1600} height={912} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        {/* Phones: the text runs over the whole photo, so the photo is dimmed evenly. */}
        <div className="absolute inset-0 -z-10 bg-background/75 md:hidden" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:pb-32 md:pt-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrainFront className="size-3.5" /> For Indian Railways passengers
          </p>
          <h1 className="max-w-3xl text-[2.6rem] font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Live train status, and a <span className="text-primary">chat room for your train.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            See where your train is, get alerts on your phone until your stop, and chat with the passengers on the same train.
          </p>
          {/* Play first; then a train and a PNR, each one tap from its box (the owner, 16 November 2026). */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <PlayButton medium="home_hero" className="col-span-2" />
            <a
              href="#search"
              onClick={(e) => {
                if (openSearch("train")) e.preventDefault();
              }}
              className={HERO_SECONDARY}
            >
              <Search aria-hidden className="size-5 shrink-0" /> Find your train
            </a>
            <a
              href="/pnr-status/"
              onClick={(e) => {
                if (openSearch("pnr")) e.preventDefault();
              }}
              className={HERO_SECONDARY}
            >
              <Ticket aria-hidden className="size-5 shrink-0" />
              <span className="sm:hidden">PNR status</span>
              <span className="hidden sm:inline">Check PNR status</span>
            </a>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Free on Android · Sign in with your mobile number or Google</p>
        </div>
      </section>

      {/* The four things RailBuzz does; each card opens its section below. */}
      <section aria-label="What RailBuzz does" className="relative z-10 mx-auto -mt-12 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
        {highlights.map((h) => (
          <a
            key={h.title}
            href={h.href}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <h.icon className="size-5" />
              </span>
              {h.live && (
                <span className="flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-live">
                  <span className="size-1.5 animate-pulse rounded-full bg-live" />
                  <span className="sm:hidden">{h.live.short}</span>
                  <span className="hidden sm:inline">{h.live.long}</span>
                </span>
              )}
            </div>
            <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-primary md:text-xl">{h.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{h.text}</p>
          </a>
        ))}
      </section>

      {/* Every way to look a train up, in one panel (components/search-hub.tsx). */}
      <section aria-labelledby="search-heading" className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
        <SectionHead
          eyebrow="Search trains"
          title="Find your train"
          text="A train's timetable, trains between two stations, a station's live board or your PNR status, all in one place."
          id="search-heading"
        />
        <div className="mt-8">
          <SearchHub />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-16 md:pt-24">
        <SectionHead eyebrow="What RailBuzz does" title="5 ways RailBuzz makes every journey easier" />
      </section>

      {pillars.map((p, i) => (
        <section key={p.id} id={p.id} className={"mx-auto max-w-6xl scroll-mt-20 px-5 " + (i === 0 ? "pt-10 md:pt-14" : "pt-16 md:pt-24")}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? "lg:order-last" : ""}>
              <div className="flex items-end gap-4">
                <span aria-hidden className="bg-gradient-primary bg-clip-text font-display text-6xl font-extrabold leading-[0.8] text-transparent md:text-8xl">
                  {numbered(i)}
                </span>
                <h3 className="text-3xl font-extrabold leading-tight md:text-5xl">{p.name}</h3>
              </div>
              <p className="mt-5 text-xl font-semibold text-primary md:text-2xl">{p.tagline}</p>
              <p className="mt-3 text-lg text-muted-foreground">{p.text}</p>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt.title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <pt.icon className="size-4.5" />
                    </span>
                    <div>
                      <h4 className="font-semibold">{pt.title}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">{pt.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {p.more && (
                <Link to={p.more.to} className="mt-8 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                  {p.more.label} <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            {p.visual}
          </div>
        </section>
      ))}

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-20 md:pt-32">
        <SectionHead eyebrow="How it works" title="Ready before your train leaves" />
        <div className="relative mt-10">
          <div aria-hidden className="absolute left-[2.6rem] right-[2.6rem] top-[2.6rem] hidden border-t-2 border-dashed border-border md:block" />
          <ol className="relative grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              // Phones: the number beside the words, so three steps fit a screen.
              <li key={s.title} className="relative flex gap-4 rounded-2xl border border-border bg-card p-5 md:block md:p-6">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold md:mt-5">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground md:mt-1.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="safety" className="mt-20 border-y border-border bg-card/40 md:mt-32">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHead
            eyebrow="Safe by design"
            title="A chat with strangers, built to stay civil"
            text="Every passenger on a train can join its room, so RailBuzz is built around accountability and privacy."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {safety.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-2xl border border-border bg-background p-5 sm:block sm:p-6">
                <s.icon className="size-6 shrink-0 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold sm:mt-4">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground sm:mt-1.5">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common questions: closed until tapped, one open at a time; five more behind "More questions?". */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pt-20 md:pt-24">
        <SectionHead eyebrow="Questions" title="Common questions" />
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <Question key={f.q} faq={f} />
          ))}
        </div>
        <div id="more-questions" hidden={!more} className="mt-3 space-y-3">
          {moreFaqs.map((f) => (
            <Question key={f.q} faq={f} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMore((m) => !m)}
            aria-expanded={more}
            aria-controls="more-questions"
            className="-my-2 inline-flex items-center gap-1.5 py-2 font-semibold text-primary hover:underline"
          >
            {more ? "Fewer questions" : "More questions?"}
            <ChevronDown aria-hidden className={"size-4 transition " + (more ? "rotate-180" : "")} />
          </button>
          <p className="text-sm text-muted-foreground">
            Still stuck? Write to{" "}
            <a href="mailto:support@railbuzz.in" className="text-primary underline underline-offset-2">support@railbuzz.in</a>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 md:p-12">
          <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Your next journey, with company.</h2>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                Live status, alerts until your stop and a chat room for your train. Free on Android.
              </p>
            </div>
            <PlayButton medium="home_closing" className="shrink-0" />
          </div>
          <p className="relative mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
            RailBuzz is an independent app, not affiliated with Indian Railways, IRCTC or any government body. Train data comes
            from RailRadar.
          </p>
        </div>
      </section>
    </main>
  );
}
