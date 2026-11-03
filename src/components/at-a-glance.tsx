import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Every figure below is taken from the published Privacy Policy and Grievance pages.
const retention = [
  { label: "Visible in room", hours: 0.25, text: "15 min after the run" },
  { label: "Safety review", hours: 72, text: "3 days" },
  { label: "Reacted-to context", hours: 336, text: "14 days" },
  { label: "Reported messages", hours: 2160, text: "Up to 90 days" },
];

const grievance = [
  { type: "Content & conduct", Acknowledge: 1, Respond: 3, Resolve: 15 },
  { type: "Personal data", Acknowledge: 3, Respond: 3, Resolve: 30 },
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
};

export function RetentionChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={retention} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            scale="log"
            domain={[0.2, 3000]}
            ticks={[1, 24, 168, 720, 2160]}
            tickFormatter={(h: number) => (h < 24 ? `${h}h` : `${Math.round(h / 24)}d`)}
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <YAxis type="category" dataKey="label" width={130} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip
            cursor={{ fill: "var(--accent)" }}
            contentStyle={tooltipStyle}
            formatter={(_v, _n, p) => [p.payload.text, "Kept"]}
          />
          <Bar dataKey="hours" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrievanceChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={grievance} margin={{ right: 8 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis unit="d" stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={tooltipStyle} formatter={(v) => [`${v} day${v === 1 ? "" : "s"}`]} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Acknowledge" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Respond" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Resolve" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** The card each policy page's "at a glance" summary sits in. */
function GlanceCard({ icon: Icon, title, note, children }: { icon: LucideIcon; title: string; note: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">At a glance</p>
      <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold"><Icon className="size-4 text-primary" /> {title}</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">{note}</p>
      {children}
    </section>
  );
}

/** /privacy: how long chat is kept. */
export function RetentionGlance() {
  return (
    <GlanceCard icon={Clock} title="How long chat messages are kept" note="Log scale — most chat is gone within days.">
      <RetentionChart />
      <a href="#chat-retention" className="text-sm text-primary">Read the details →</a>
    </GlanceCard>
  );
}

/** /grievance: the complaint timelines. */
export function GrievanceGlance() {
  return (
    <GlanceCard icon={ShieldCheck} title="Complaint timelines (days)" note="The longest we take to acknowledge, respond and resolve.">
      <GrievanceChart />
    </GlanceCard>
  );
}

// From the Community Guidelines, Privacy Policy, Grievance and Terms pages.
const roomFacts = [
  { value: "15 min", label: "after the run, a room closes" },
  { value: "7", label: "community rules, in seven languages" },
  { value: "24 h", label: "to acknowledge a content complaint" },
  { value: "18+", label: "minimum age to use RailBuzz" },
];

/** /community-guidelines: four numbers about chat rooms. */
export function RoomFactsGlance() {
  return (
    <GlanceCard icon={Users} title="Chat rooms in four numbers" note="Taken from our published policies.">
      <div className="grid grid-cols-2 gap-3">
        {roomFacts.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background p-4">
            <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </GlanceCard>
  );
}
