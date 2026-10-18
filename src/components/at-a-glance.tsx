import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
