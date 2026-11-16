import { Link, createFileRoute } from "@tanstack/react-router";
import { Article, articleData, type Faq } from "@/components/article";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";
import { dateText, hasPage } from "@/lib/trains";

// How late the trains RailBuzz followed reached their last station, from the
// live answers it kept (scripts/build_site_punctuality.py writes the data).
// Only journeys whose arrival at the last station was observed are counted,
// and a train is listed with 6 or more of them.

type Row = { number: string; name: string; from: string; to: string; toCode: string; runs: number; median: number; within15: number; early: number; worst: number };
type Data = { from: string; to: string; runs: number; median: number; within15: number; trains: Row[] };

const data: Data = Object.values(
  import.meta.glob<Data>("../data/punctuality.json", { eager: true, import: "default" }),
)[0] ?? { from: "", to: "", runs: 0, median: 0, within15: 0, trains: [] };

const TITLE = "How Late Do Trains Run? Punctuality of 45 Indian Trains";
const DESCRIPTION = `Arrival delays at the last station for ${data.trains.length} trains, from ${data.runs} journeys RailBuzz followed: median ${data.median} min late, ${data.within15}% within 15 minutes.`;

const lateText = (min: number) => (min === 0 ? "on time" : min < 0 ? `${-min} min early` : `${min} min late`);

const FAQS: Faq[] = [
  {
    q: "How late do Indian trains usually arrive?",
    a: `Across the ${data.runs} journeys in this data (${dateText(data.from)} to ${dateText(data.to)}), the median arrival at the last station was ${lateText(data.median)}, and ${data.within15}% of journeys arrived within 15 minutes of the timetable.`,
  },
  {
    q: "Which trains were the most punctual?",
    a: data.trains.slice(0, 3).map((t) => `${t.number} ${t.name} (${t.within15}% within 15 minutes)`).join(", ") + ".",
  },
  {
    q: "How is this measured?",
    a: "RailBuzz kept the live running status of the trains it followed. A journey counts when its arrival at the last station was observed, not estimated. Delay is the observed arrival against the timetable; an early arrival counts as negative.",
  },
];

export const Route = createFileRoute("/punctuality")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION.slice(0, 155), "/punctuality"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          articleData({
            path: "/punctuality",
            title: TITLE,
            description: DESCRIPTION,
            section: "Data",
            faqs: FAQS,
            extra: [
              {
                "@type": "Dataset",
                name: "Arrival delays of Indian trains followed by RailBuzz",
                description: DESCRIPTION,
                url: pageUrl("/punctuality"),
                temporalCoverage: `${data.from}/${data.to}`,
                spatialCoverage: { "@type": "Country", name: "India" },
                creator: { "@type": "Organization", name: "RailBuzz", url: `${SITE_URL}/` },
                variableMeasured: ["Median arrival delay at the last station (minutes)", "Share of journeys within 15 minutes of the timetable"],
                isAccessibleForFree: true,
              },
            ],
          }),
        ),
      },
    ],
  }),
  component: PunctualityPage,
});

function PunctualityPage() {
  return (
    <Article
      section="Data"
      title="How late do trains run?"
      intro={`${data.trains.length} trains, ${data.runs} journeys, ${dateText(data.from)} to ${dateText(data.to)}: when each reached its last station, against its timetable.`}
      faqs={FAQS}
      medium="punctuality"
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Journeys", String(data.runs)],
          ["Median arrival", lateText(data.median)],
          ["Within 15 min", `${data.within15}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 font-display text-xl font-bold md:text-2xl">{value}</div>
          </div>
        ))}
      </div>

      <h2>Train by train</h2>
      <p>
        Most punctual first: by the share of journeys that reached the last station within 15 minutes of the timetable, then by the median
        delay. A negative delay is an early arrival.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-[11px] uppercase tracking-normal text-muted-foreground sm:text-xs sm:tracking-wider">
            <tr>
              <th scope="col" className="px-3 py-3">Train</th>
              <th scope="col" className="px-2 py-3 text-right">Journeys</th>
              <th scope="col" className="px-2 py-3 text-right">Median</th>
              <th scope="col" className="px-3 py-3 text-right">Within 15 min</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.trains.map((t) => (
              <tr key={t.number}>
                <th scope="row" className="px-3 py-3 font-normal">
                  {hasPage(t.number) ? (
                    <Link to="/train/$number/" params={{ number: t.number }} className="font-medium !text-foreground hover:!text-primary">
                      <span className="text-primary">{t.number}</span> {t.name}
                    </Link>
                  ) : (
                    <span className="font-medium"><span className="text-primary">{t.number}</span> {t.name}</span>
                  )}
                  <span className="mt-0.5 block text-xs text-muted-foreground">{t.from} → {t.to}</span>
                </th>
                <td className="px-2 py-3 text-right tabular-nums text-muted-foreground">{t.runs}</td>
                <td className="whitespace-nowrap px-2 py-3 text-right tabular-nums">{lateText(t.median)}</td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold">{t.within15}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What this counts, and what it does not</h2>
      <ul>
        <li>The trains RailBuzz followed live: mostly in Andhra Pradesh and Telangana, with some on the Mumbai, Delhi and Gujarat routes. Not every train in India.</li>
        <li>Only journeys whose arrival at the last station was observed. A journey still on its way, or estimated, is not counted.</li>
        <li>Arrival at the last station only. Timetables give trains extra minutes near the end, so a train can be later on the way and still arrive on time.</li>
        <li>A train is listed with 6 or more journeys. With few journeys, one bad day moves the figures a lot.</li>
      </ul>
      <p>
        Read more on <Link to="/guides/running-status/">how running status and delays work</Link>, or find any train's timetable on{" "}
        <Link to="/trains/">Search Trains</Link>.
      </p>
    </Article>
  );
}
