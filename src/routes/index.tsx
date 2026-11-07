import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Bot,
  ChevronDown,
  CircleCheck,
  Clock,
  Flag,
  HandHelping,
  IndianRupee,
  Languages,
  MapPin,
  MessageCircle,
  Newspaper,
  PhoneCall,
  Pin,
  Route as RouteIcon,
  Share2,
  ShieldCheck,
  Signpost,
  Smartphone,
  Sparkles,
  ScrollText,
  Ticket,
  TrainFront,
  UserRound,
  Utensils,
} from "lucide-react";
import type { ReactNode } from "react";
import hero from "@/assets/hero-train.jpg";
import { AiVisual, ChatVisual, PushCard, StatusVisual, SubscribeVisual, destinationPush } from "@/components/home-visuals";
import { PLAY_URL, SITE_URL, pageHead } from "@/lib/legal-page";

// Every claim on this page is something the app does today (1.0 (13)), and
// every number is one already published in /privacy, /grievance or
// /community-guidelines. Change them together.

const TITLE = "RailBuzz: Live Train Status, PNR & Chat for Indian Railways";
const DESCRIPTION =
  "Live train running status, updates and alerts on your phone until your stop, PNR status and a chat room with the passengers on your train. The Android app for Indian Railways journeys.";

const faqs: { q: string; a: ReactNode; text: string }[] = [
  {
    q: "Is RailBuzz an official Indian Railways or IRCTC app?",
    text:
      "No. RailBuzz is an independent app. It is not affiliated with, endorsed by or run by Indian Railways, IRCTC or any government body. Train timetables, running status, station boards and PNR status come from RailRadar (railradar.in). You can check them against Indian Railways' own National Train Enquiry System at enquiry.indianrail.gov.in.",
    a: (
      <>
        No. RailBuzz is an independent app. It is not affiliated with, endorsed by or run by Indian Railways, IRCTC or any
        government body. Train timetables, running status, station boards and PNR status come from{" "}
        <a href="https://railradar.in" rel="noopener" className="text-primary underline underline-offset-2">RailRadar</a>.
        You can check them against Indian Railways&rsquo; own National Train Enquiry System at{" "}
        <a href="https://enquiry.indianrail.gov.in" rel="noopener" className="text-primary underline underline-offset-2">
          enquiry.indianrail.gov.in
        </a>
        .
      </>
    ),
  },
  {
    q: "Is RailBuzz free?",
    text: "Yes. RailBuzz is free to download from Google Play, and every feature is free to use.",
    a: "Yes. RailBuzz is free to download from Google Play, and every feature is free to use.",
  },
  {
    q: "How do train updates and alerts on my phone work?",
    text:
      "Tap Subscribe to a Train on the home screen, then choose your train, the day you travel and the stations where you get on and get down. RailBuzz then sends a notification about every hour with where the train is and how late it is running, an alert about 30 minutes before it reaches your boarding station and again just before, and an alert about 20 minutes before your destination. You are also told if departure is delayed or the train is cancelled. Hourly updates arrive silently between 23:00 and 06:00; the alerts always ring. Tap any update to open the train's Running Status. You need to be signed in and to allow notifications from RailBuzz.",
    a: (
      <>
        Tap <strong className="text-foreground">Subscribe to a Train</strong> on the home screen, then choose your train, the
        day you travel and the stations where you get on and get down. RailBuzz then sends a notification about every hour
        with where the train is and how late it is running, an alert about 30 minutes before it reaches your boarding station
        and again just before, and an alert about 20 minutes before your destination. You are also told if departure is
        delayed or the train is cancelled. Hourly updates arrive silently between 23:00 and 06:00; the alerts always ring. Tap
        any update to open the train&rsquo;s Running Status. You need to be signed in and to allow notifications from RailBuzz.
      </>
    ),
  },
  {
    q: "Can other passengers see my name or phone number?",
    text:
      "No. In a chat room you appear under an alias such as Traveller-392, which you can reshuffle from your profile. Other passengers never see your name or your mobile number. Anything you type in a message or a help card is visible to everyone in the room, so don't share your number there.",
    a: (
      <>
        No. In a chat room you appear under an alias such as <strong className="text-foreground">Traveller-392</strong>, which
        you can reshuffle from your profile. Other passengers never see your name or your mobile number. Anything you type in
        a message or a help card is visible to everyone in the room, so don&rsquo;t share your number there.
      </>
    ),
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
        <Link to="/privacy" hash="chat-retention" className="text-primary underline underline-offset-2">Privacy Policy</Link>{" "}
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
        <strong className="text-foreground">182</strong> (railway security). RailBuzz keeps these numbers one tap away on the home screen.
      </>
    ),
  },
  {
    q: "Which phones can I use RailBuzz on?",
    text: "RailBuzz is an Android app, available from Google Play. You must be 18 or older to create an account.",
    a: "RailBuzz is an Android app, available from Google Play. You must be 18 or older to create an account.",
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
        <Link to="/delete-account" className="text-primary underline underline-offset-2">Delete your account</Link> page
        explains what is erased and when.
      </>
    ),
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "RailBuzz",
      url: `${SITE_URL}/`,
      inLanguage: "en-IN",
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
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
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

// The four things RailBuzz is for, under the hero; each opens its section.
const highlights = [
  { icon: MapPin, title: "Accurate Train Tracking", text: "Live position, delay and the expected time at every halt ahead.", href: "#running-status" },
  { icon: MessageCircle, title: "Live Passenger Chat", text: "A chat room for your train and day, with the people on board.", href: "#train-chat" },
  { icon: Sparkles, title: "RailBuzz AI Chat", text: "Ask about food, fares, refunds and rules in plain words.", href: "#railbuzz-ai" },
  { icon: Ticket, title: "PNR Status", text: "Your booking and every passenger's current status, in one place.", href: "#running-status" },
];

type Point = { icon: LucideIcon; title: string; text: string };

const pillars: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  points: Point[];
  visual: ReactNode;
}[] = [
  {
    id: "running-status",
    eyebrow: "Live train running status",
    title: "Know where your train is, and when it will reach you",
    text: "Search any train by its number or name and open Running Status: the station it last passed, how late it is running, and the expected time at every halt still ahead. The screen keeps itself up to date while it is open, so you can leave it on the platform and glance at it.",
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
    eyebrow: "Subscribe to a Train",
    title: "Live updates on your phone, all the way to your stop",
    text: "Tell RailBuzz which train you are on, the day, and where you get on and get down. From then on your phone tells you where the train is and how late it is running, without you opening the app. Your alerts are timed from where the train actually is, not only from the timetable, so a late train does not catch you out.",
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
    eyebrow: "A chat room for your train",
    title: "Talk to the passengers on the same train, on the same day",
    text: "Every train gets a chat room for each day it runs. Join the room for your train and you are talking to the people on your journey: about the delay, a platform change, which coach is where, or whether the pantry has come round. It is news from people who are actually on board.",
    points: [
      { icon: MessageCircle, title: "Quick posts", text: "One tap for a Delay Update, Platform Info or Coach Help." },
      { icon: HandHelping, title: "Ask for help", text: "Post a help card with your coach number. Everyone in the room sees it and can reply." },
      { icon: Share2, title: "Share the room", text: "Send a train's room to someone travelling with you. The link opens straight in the app." },
      { icon: Clock, title: "Only for the journey", text: "A room closes 15 minutes after the train completes its run." },
    ],
    visual: <ChatVisual />,
  },
  {
    id: "railbuzz-ai",
    eyebrow: "RailBuzz AI",
    title: "Ask your travel questions in plain words",
    text: "RailBuzz AI answers the questions that come up on a journey. Tap a suggestion or type your own. When an answer depends on your train, such as where food can be delivered, it is worked out from the train's live running status, not guessed.",
    points: [
      { icon: Utensils, title: "Order Food", text: "The next halts where food can reach your seat, with IRCTC's official ways to order." },
      { icon: IndianRupee, title: "Fare Enquiry", text: "Fares for a train, class by class." },
      { icon: ScrollText, title: "IRCTC Rules & Refund", text: "Cancellation and refund rules, explained simply." },
      { icon: Newspaper, title: "Railway news", text: "Latest railway news, nearby first, with Interesting Train Facts and Railway Developments for the long hours." },
    ],
    visual: <AiVisual />,
  },
];

const steps = [
  { title: "Install and sign in", text: "Get RailBuzz from Google Play and sign in with your mobile number or your Google account." },
  { title: "Find your train", text: "Search by train number or name, or pick from the popular trains for your state." },
  { title: "Follow it, or join the chat", text: "Open Running Status, subscribe for updates on your phone until your stop, or tap Join Chat. The first time you chat, you verify your number with an SMS code." },
];

const safety: Point[] = [
  { icon: BadgeCheck, title: "Verified passengers", text: "Live chat needs a mobile number verified on your phone, so everyone in a room is accountable." },
  { icon: UserRound, title: "Aliases, never names", text: "Other passengers see a generated alias like Traveller-392, never your name or number." },
  { icon: Languages, title: "Rules in seven languages", text: "Seven short community rules, shown in English and in Hindi, Telugu, Tamil, Kannada, Bengali or Malayalam when you join a room." },
  { icon: Flag, title: "Report and block", text: "Report a message or block a passenger from the chat. A content complaint is acknowledged within 24 hours." },
  { icon: PhoneCall, title: "Helplines one tap away", text: "139 Railway, 112 Police and 182 Security, on the home screen for when it matters." },
  { icon: ShieldCheck, title: "Your account, guarded", text: "Your other phones are told when your account signs in somewhere new, and you can log out of all of them." },
];

const policies = [
  { to: "/terms", title: "Terms of Service", text: "The agreement for using the app and site." },
  { to: "/privacy", title: "Privacy Policy", text: "What we collect, why, and for how long." },
  { to: "/community-guidelines", title: "Community Guidelines", text: "The seven rules for chat rooms." },
  { to: "/grievance", title: "Grievance Redressal", text: "How to complain, and how long we take." },
  { to: "/delete-account", title: "Delete your account", text: "In the app or by email." },
] as const;

function PlayButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 " +
        className
      }
    >
      <Smartphone className="size-5" /> Get it on Google Play
    </a>
  );
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}

function Index() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="An Indian Railways train curving through fields at sunset" width={1600} height={912} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-36">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrainFront className="size-3.5" /> For Indian Railways passengers
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-7xl">
            Live train status, and a <span className="text-primary">chat room for your train.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            RailBuzz shows where your train is right now and when it should reach your station, and keeps you posted on your
            phone until your stop. It also puts you in a chat room with the passengers on the same train, on the same day.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PlayButton />
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-6 py-3.5 font-semibold transition hover:border-primary">
              See what it does <ChevronDown className="size-4" />
            </a>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Free on Android · Sign in with your mobile number or Google</p>
        </div>
      </section>

      <section aria-label="What RailBuzz is for" className="relative z-10 mx-auto -mt-12 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
        {highlights.map((h) => (
          <a key={h.title} href={h.href} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <h.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-primary md:text-xl">{h.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{h.text}</p>
          </a>
        ))}
        {/* The spotlight: the one feature that works with the phone in a pocket. */}
        <a
          href="#subscribe"
          className="group relative col-span-2 overflow-hidden rounded-2xl border border-primary/50 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary md:col-span-4 md:p-7"
        >
          <div aria-hidden className="absolute -left-16 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-x-8 lg:grid-cols-[auto_1fr_minmax(0,22rem)]">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <BellRing className="size-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold leading-tight group-hover:text-primary md:text-2xl">Subscribe to a Train</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" /> Live updates
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Choose your train and your two stations. Your phone then tells you where the train is about every hour, and
                alerts you before it reaches your boarding station and your stop.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                See how it works <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
            <PushCard push={destinationPush} className="bg-background md:col-span-2 lg:col-span-1" />
          </div>
        </a>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24">
        <SectionHead
          eyebrow="What RailBuzz does"
          title="Everything you check on a train journey, in one app"
          text="Running status, updates on your phone, PNR and station boards, the people on your train, and quick answers to travel questions. Here is what each part does."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {pillars.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">
              {p.eyebrow}
            </a>
          ))}
        </div>
      </section>

      {pillars.map((p, i) => (
        <section key={p.id} id={p.id} className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-20 md:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? "lg:order-last" : ""}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{p.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-bold md:text-4xl">{p.title}</h3>
              <p className="mt-4 text-lg text-muted-foreground">{p.text}</p>
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
            </div>
            {p.visual}
          </div>
        </section>
      ))}

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24 md:pt-32">
        <SectionHead eyebrow="How it works" title="Ready before your train leaves" />
        <div className="relative mt-10">
          <div aria-hidden className="absolute left-[2.6rem] right-[2.6rem] top-[2.6rem] hidden border-t-2 border-dashed border-border md:block" />
          <ol className="relative grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="relative grid size-10 place-items-center rounded-full bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-muted-foreground">{s.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </section>

      <section id="safety" className="mt-24 border-y border-border bg-card/40 md:mt-32">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHead
            eyebrow="Safe by design"
            title="A chat with strangers, built to stay civil"
            text="RailBuzz is open to every passenger on a train, so it is built around accountability and privacy from the start."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safety.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-background p-6">
                <s.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pt-24">
        <SectionHead eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg">{f.q}</h3>
                <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-8 md:p-12">
          <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Your next journey, with company.</h2>
              <ul className="mt-5 grid gap-2 text-muted-foreground sm:grid-cols-2">
                {[
                  "Live running status",
                  "Alerts before your station",
                  "A chat room for every train",
                  "PNR and station boards",
                  "RailBuzz AI for questions",
                  "Free to use",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2"><CircleCheck className="size-4 text-primary" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <PlayButton />
              <a href="#faq" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <Bot className="size-4" /> Questions first? Read the FAQ <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
          <p className="relative mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
            RailBuzz is an independent app, not affiliated with Indian Railways, IRCTC or any government body. Train data comes
            from RailRadar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="text-3xl font-bold md:text-4xl">Policies and support</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {policies.map((p) => (
            <Link key={p.to} to={p.to} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <h3 className="font-semibold group-hover:text-primary">{p.title} →</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
