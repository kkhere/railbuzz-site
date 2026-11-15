import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronDown,
  Clock,
  Flag,
  HandHelping,
  Languages,
  MessageCircle,
  Share2,
  ShieldCheck,
  TrainFront,
  UserRound,
  Users,
} from "lucide-react";
import { ChatVisual } from "@/components/home-visuals";
import { PlayButton } from "@/components/site-layout";
import { PLAY_URL, SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";
import { TrainSearch } from "@/components/train-search";

// The page for people searching for a train chat: "train chat", "chat with
// passengers on my train", "railway chat app", "12727 chat group". Every
// claim is something the app does today, as on the home page; change them
// together.

const TITLE = "Train Chat: Chat With the Passengers on Your Train | RailBuzz";
const DESCRIPTION =
  "Every Indian Railways train gets a chat room for each day it runs. Talk to your co-passengers about delays, platforms and coaches. Free.";

const faqs: { q: string; a: string }[] = [
  {
    q: "What is train chat?",
    a: "Train chat is a chat room for one train on one day. In RailBuzz every Indian Railways train gets a room for each day it runs, so the people in it are the passengers on your journey: you can ask about the delay, a platform change, which coach stops where, or whether the pantry has come round.",
  },
  {
    q: "How do I join the chat room for my train?",
    a: "Install RailBuzz from Google Play, find your train by its number or name, and tap Join Chat. The first time, you choose a display name and language and verify your mobile number with an SMS code. After that, joining a room is one tap.",
  },
  {
    q: "Can other passengers see my phone number?",
    a: "No. In a train chat you appear under an alias such as Traveller-392. Other passengers never see your name or your mobile number. Anything you type is visible to everyone in the room, so don't share your number in a message.",
  },
  {
    q: "Is train chat free?",
    a: "Yes. RailBuzz is free to download and every feature, chat included, is free to use.",
  },
  {
    q: "Is it safe to chat with strangers on a train?",
    a: "Only passengers with a mobile number verified on their phone can post, everyone follows seven short community rules shown when they join, and you can report a message or block a passenger. A content complaint is acknowledged within 24 hours. You must be 18 or older to use RailBuzz.",
  },
  {
    q: "How long does a train chat room last?",
    a: "A room is for one journey: it closes 15 minutes after the train completes its run, and most of the chat is deleted within days.",
  },
  {
    q: "Is there a chat group for my train?",
    a: "Yes, for every train that runs. You do not need to create or find a group: RailBuzz opens the room for your train and day when you tap Join Chat.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Train chat", item: pageUrl("/train-chat") },
      ],
    },
    {
      "@type": "MobileApplication",
      name: "RailBuzz",
      operatingSystem: "Android",
      applicationCategory: "TravelApplication",
      description: DESCRIPTION,
      installUrl: PLAY_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export const Route = createFileRoute("/train-chat")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/train-chat"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: TrainChatPage,
});

const uses = [
  { icon: Clock, title: "Is it running late?", text: "Hear from passengers already on board how the train is doing, before the next announcement." },
  { icon: TrainFront, title: "Which platform, which coach?", text: "Platform changes, where your coach stops and which end of the train to walk to." },
  { icon: HandHelping, title: "Ask for help", text: "Post a help card with your coach number: a charger, a missing item, a seat swap for a family." },
  { icon: Users, title: "Company for the journey", text: "Food on board, the next big station, the view from the window: talk to people going your way." },
];

const steps = [
  { title: "Find your train", text: "Search by train number or name in RailBuzz, or pick one of the popular trains for your state." },
  { title: "Tap Join Chat", text: "The first time, choose a display name and language, and verify your mobile number with an SMS code." },
  { title: "Talk to your co-passengers", text: "Post, reply, use the quick Delay Update, Platform Info and Coach Help buttons, or share the room with someone travelling with you." },
];

const safety = [
  { icon: BadgeCheck, title: "Verified passengers", text: "Posting needs a mobile number verified on your phone, so everyone in a room is accountable." },
  { icon: UserRound, title: "Aliases, never numbers", text: "You appear as an alias like Traveller-392; nobody sees your name or phone number." },
  { icon: Languages, title: "Rules in seven languages", text: "Seven short rules, in English and in Hindi, Telugu, Tamil, Kannada, Bengali or Malayalam." },
  { icon: Flag, title: "Report and block", text: "Report a message or block a passenger from the chat; complaints are acknowledged within 24 hours." },
  { icon: Clock, title: "Only for the journey", text: "Each room closes 15 minutes after the train completes its run." },
  { icon: ShieldCheck, title: "18 and over", text: "RailBuzz is for adults: you must be 18 or older to create an account." },
];

function TrainChatPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-10">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">RailBuzz</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">Train chat</span>
        </nav>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <MessageCircle className="size-3.5" /> Train chat for Indian Railways
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Chat with the passengers <span className="text-primary">on your train.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Every train gets a chat room for each day it runs. Join the room for your train and you are talking to the people
              on your journey: about the delay, the platform, the coaches, or just the long hours ahead.
            </p>
            <p lang="hi" className="mt-3 text-muted-foreground">
              अपनी ट्रेन के सहयात्रियों से चैट करें: हर ट्रेन का अपना चैट रूम।
            </p>
            <p lang="te" className="mt-1 text-muted-foreground">
              మీ రైలులోని సహ ప్రయాణికులతో చాట్ చేయండి: ప్రతి రైలుకు సొంత చాట్ రూమ్.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PlayButton medium="train_chat_hero" />
              <Link
                to="/trains/"
                hash="search"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 font-semibold transition hover:border-primary"
              >
                Find your train
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Free on Android · Your number is never shown to other passengers</p>
          </div>
          <ChatVisual />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Why passengers use it</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">News from people who are actually on board</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map((u) => (
            <div key={u.title} className="rounded-2xl border border-border bg-card p-6">
              <u.icon aria-hidden className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{u.title}</h3>
              <p className="mt-1.5 text-muted-foreground">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How to join</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Your train&rsquo;s chat room in three steps</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Share2 aria-hidden className="size-4 text-primary" /> A shared room link opens straight in the app for anyone who has it.
        </p>
      </section>

      <section className="mt-24 border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Safe by design</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">A chat with strangers, built to stay civil</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safety.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-background p-6">
                <s.icon aria-hidden className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Read the <Link to="/community-guidelines/" className="text-primary hover:underline">Community Guidelines</Link> and how
            chat is kept in the <Link to="/privacy/" hash="chat-retention" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your train&rsquo;s chat room</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Find your train&rsquo;s chat</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every train that runs has a room. Search for yours to see its timetable and join its chat in the app.
        </p>
        <div className="mt-8 max-w-3xl rounded-3xl border border-border bg-card p-5 md:p-7">
          <TrainSearch id="chat-search" hash="chat" />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pt-24">
        <h2 className="text-3xl font-bold md:text-4xl">Train chat questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg">{f.q}</h3>
                <ChevronDown aria-hidden className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
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
              <p className="mt-3 text-muted-foreground">Free on Android. Live status, alerts and a chat room for every train.</p>
            </div>
            <PlayButton medium="train_chat_closing" />
          </div>
        </div>
      </section>
    </main>
  );
}
