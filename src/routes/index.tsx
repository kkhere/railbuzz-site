import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, MessageCircle, ShieldCheck, Train, UserRound } from "lucide-react";
import hero from "@/assets/hero-train.jpg";
import { GrievanceChart, RetentionChart } from "@/components/at-a-glance";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "RailBuzz — Live train info & passenger chat for Indian Railways",
      "Live train information and chat rooms with the fellow passengers on your train. Verified by mobile number, shown only by alias.",
      "/",
    ),
  component: Index,
});

const features = [
  { icon: Train, title: "Live train information", text: "Running status and journey updates for the trains you follow." },
  { icon: MessageCircle, title: "One room per train, per day", text: "Delays, platform changes, which coach is where — from the people actually on board." },
  { icon: BadgeCheck, title: "Verified passengers", text: "Live chat needs a verified mobile number, which keeps people accountable." },
  { icon: UserRound, title: "Aliases, never names", text: "Other passengers only see a generated alias like Traveller-392." },
];

const stats = [
  { value: "15 min", label: "after the run, a room closes" },
  { value: "7", label: "community rules, in seven languages" },
  { value: "24 h", label: "to acknowledge a content complaint" },
  { value: "18+", label: "minimum age to use RailBuzz" },
];

const policies = [
  { to: "/terms", title: "Terms of Service", text: "The agreement for using the app and site." },
  { to: "/privacy", title: "Privacy Policy", text: "What we collect, why, and for how long." },
  { to: "/community-guidelines", title: "Community Guidelines", text: "The seven rules for chat rooms." },
  { to: "/grievance", title: "Grievance Redressal", text: "How to complain, and how long we take." },
  { to: "/delete-account", title: "Delete your account", text: "In the app or by email." },
] as const;

function Index() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="An Indian Railways train curving through fields at sunset" width={1600} height={912} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="mx-auto max-w-6xl px-5 py-28 md:py-40">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="size-3.5" /> Made for Indian Railways passengers
          </p>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] md:text-7xl">
            Your train has a <span className="text-primary">chat room.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Live train information and chat with fellow passengers on your train, on your day.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="text-3xl font-bold md:text-4xl">What RailBuzz does</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="text-3xl font-bold md:text-4xl">Your data and complaints, at a glance</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">A visual summary of commitments from our published policies.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold"><Clock className="size-4 text-primary" /> How long chat messages are kept</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Log scale — most chat is gone within days.</p>
            <RetentionChart />
            <Link to="/privacy" hash="chat-retention" className="text-sm text-primary">Read the details →</Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" /> Complaint timelines (days)</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">The longest we take to acknowledge, respond and resolve.</p>
            <GrievanceChart />
            <Link to="/grievance" className="text-sm text-primary">How to complain →</Link>
          </div>
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
