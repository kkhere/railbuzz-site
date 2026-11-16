import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronDown, Clock, Flag, MapPinned, Radio, TrainFront } from "lucide-react";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/site-layout";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";
import { dateText, hasPage, loadStation, stationDays, type Station, type StationTrain } from "@/lib/trains";

// One page per station where 15 or more long-distance trains call (1,351;
// the owner, 16 November 2026): what people search for ("trains from
// Vijayawada", "BZA train timetable", "first train from Kazipet"), from
// RailBuzz's timetable store. Every train links to its own page. Nothing on it
// is live: the live board is one tap away, and live status is in the app.

const DAY_SHORT: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

function daysText(packed: string): string {
  const days = stationDays(packed);
  if (days.length === 7) return "Daily";
  return days.length === 0 ? "—" : days.map((d) => DAY_SHORT[d] ?? d).join(", ");
}

/** The time a train is at the station: its departure, or its arrival where it ends here. */
const when = (t: StationTrain) => t[6] || t[5];

function facts(s: Station) {
  const leaving = s.trains.filter((t) => t[10] !== 2 && t[6]);
  const starting = s.trains.filter((t) => t[10] === 0);
  const ending = s.trains.filter((t) => t[10] === 2);
  const daily = s.trains.filter((t) => stationDays(t[9]).length === 7);
  return { leaving, starting, ending, daily, first: leaving[0], last: leaving[leaving.length - 1] };
}

export function stationFaqs(s: Station): { q: string; a: string }[] {
  const f = facts(s);
  const list: { q: string; a: string }[] = [
    {
      q: `How many trains stop at ${s.name}?`,
      a: `${s.trains.length} long-distance trains call at ${s.name} (${s.code}) in the timetable, ` +
        `${f.daily.length} of them every day. ${f.starting.length} start here and ${f.ending.length} end here. ` +
        `Local, passenger and special trains are not counted.`,
    },
  ];
  if (f.first) {
    list.push({
      q: `Which is the first train from ${s.name}?`,
      a: `By the timetable, the first train to leave ${s.name} after midnight is ${f.first[0]} ${f.first[1]} at ${f.first[6]}, ` +
        `towards ${f.first[4]} (${daysText(f.first[9]).toLowerCase() === "daily" ? "daily" : daysText(f.first[9])}).`,
    });
  }
  if (f.last && f.last !== f.first) {
    list.push({
      q: `Which is the last train from ${s.name}?`,
      a: `The last train of the day by the timetable is ${f.last[0]} ${f.last[1]} at ${f.last[6]}, towards ${f.last[4]} ` +
        `(${daysText(f.last[9]).toLowerCase() === "daily" ? "daily" : daysText(f.last[9])}).`,
    });
  }
  if (f.starting.length > 0) {
    const names = f.starting.slice(0, 8).map((t) => `${t[0]} ${t[1]}`).join(", ");
    list.push({
      q: `Which trains start from ${s.name}?`,
      a: `${f.starting.length} train${f.starting.length === 1 ? "" : "s"} start${f.starting.length === 1 ? "s" : ""} at ${s.name}` +
        `${f.starting.length > 8 ? ", among them" : ":"} ${names}.`,
    });
  }
  list.push({
    q: `How do I see live arrivals and departures at ${s.name}?`,
    a: `Open the live board for ${s.code} on RailBuzz: the trains due at ${s.name} in the next hours with their expected times and delays. ` +
      `For one train, its live running status and alerts before your station are in the RailBuzz app.`,
  });
  return list;
}

export const Route = createFileRoute("/station/$code")({
  loader: async ({ params }) => {
    const station = await loadStation(params.code);
    if (!station) throw notFound();
    return station;
  },
  head: ({ loaderData: s }) => {
    if (!s) return {};
    const title = `${s.name} (${s.code}) Trains: Timetable & Live Board`;
    const f = facts(s);
    const core = `${s.trains.length} trains at ${s.name} (${s.code})${f.first ? `, first at ${f.first[6]}` : ""}${f.last ? `, last at ${f.last[6]}` : ""}.`;
    const description =
      [" Timetables, platforms, running days and the live station board.", " Timetables, platforms and the live board.", " Timetables and the live board.", ""]
        .map((tail) => core + tail)
        .find((d) => d.length <= 155) ?? core;
    return {
      ...pageHead(title, description, `/station/${s.code}`),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData(s)) }],
    };
  },
  component: StationPage,
});

function structuredData(s: Station) {
  const url = pageUrl(`/station/${s.code}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TrainStation", name: `${s.name} (${s.code})`, url, containedInPlace: { "@type": "Country", name: "India" } },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Stations", item: pageUrl("/station-departures") },
          { "@type": "ListItem", position: 3, name: `${s.name} (${s.code})`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: stationFaqs(s).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

function Fact({ icon: Icon, label, value, sub }: { icon: typeof Clock; label: string; value: string; sub?: string | undefined }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5 text-primary" /> {label}
      </div>
      <div className="mt-2 font-display text-xl font-bold md:text-2xl">{value}</div>
      {sub && <div className="mt-0.5 text-sm text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 pt-14">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function TrainName({ t }: { t: StationTrain }) {
  const label = (
    <>
      <span className="text-primary">{t[0]}</span> {t[1]}
    </>
  );
  return hasPage(t[0]) ? (
    <Link to="/train/$number/" params={{ number: t[0] }} className="font-medium hover:text-primary hover:underline">
      {label}
    </Link>
  ) : (
    <span className="font-medium">{label}</span>
  );
}

function StationPage() {
  const s = Route.useLoaderData();
  const f = facts(s);

  return (
    <main className="mx-auto max-w-5xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <Link to="/station-departures/" className="hover:text-primary">Stations</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{s.code}</span>
      </nav>

      <header className="mt-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <MapPinned className="size-3.5" /> Station · {s.code}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
          {s.name} <span className="text-primary">({s.code})</span> trains
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">
          {s.trains.length} long-distance trains call at {s.name}, {f.daily.length} of them every day.
          {f.first ? ` The first leaves at ${f.first[6]} and the last at ${f.last?.[6]}.` : ""} Below is each one with its times,
          platform and running days, from the timetable. For the trains due in the next hours, with their delays, open the live board.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/station-departures/"
            search={{ code: s.code }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            <Radio className="size-5" /> Live board for {s.code}
          </Link>
          <PlayButton medium="station_page" />
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Fact icon={TrainFront} label="Trains" value={String(s.trains.length)} sub={`${f.daily.length} daily`} />
        <Fact icon={Flag} label="Start here" value={String(f.starting.length)} sub={`${f.ending.length} end here`} />
        <Fact icon={Clock} label="First train" value={f.first?.[6] ?? "—"} sub={f.first ? `${f.first[0]} ${f.first[1]}` : undefined} />
        <Fact icon={Clock} label="Last train" value={f.last?.[6] ?? "—"} sub={f.last ? `${f.last[0]} ${f.last[1]}` : undefined} />
      </div>

      <Section id="trains" title={`Trains at ${s.name}`}>
        <p className="mt-3 text-muted-foreground">
          In order of departure. Days are the days the train is at {s.name}, which for a train on the second day of its journey are a day
          after it starts. Local, passenger and special trains are not listed.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-[11px] uppercase tracking-normal text-muted-foreground sm:text-xs sm:tracking-wider">
              <tr>
                <th scope="col" className="px-3 py-3 md:px-4">Train</th>
                <th scope="col" className="hidden px-2 py-3 md:table-cell">From → To</th>
                <th scope="col" className="px-2 py-3">Arrives</th>
                <th scope="col" className="px-2 py-3">Departs</th>
                <th scope="col" className="hidden px-2 py-3 sm:table-cell">Days</th>
                <th scope="col" className="hidden px-3 py-3 sm:table-cell md:px-4">PF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {s.trains.map((t) => (
                <tr key={`${t[0]}-${when(t)}`}>
                  <th scope="row" className="px-3 py-3 font-normal md:px-4">
                    <TrainName t={t} />
                    <span className="mt-0.5 block text-xs text-muted-foreground md:hidden">
                      {t[3]} → {t[4]}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground sm:hidden">{daysText(t[9])}</span>
                  </th>
                  <td className="hidden px-2 py-3 text-muted-foreground md:table-cell">
                    {t[3]} → {t[4]}
                  </td>
                  <td className="px-2 py-3 tabular-nums">{t[5] || "Starts"}</td>
                  <td className="px-2 py-3 tabular-nums">{t[6] || "Ends"}</td>
                  <td className="hidden px-2 py-3 text-muted-foreground sm:table-cell">{daysText(t[9])}</td>
                  <td className="hidden px-3 py-3 tabular-nums text-muted-foreground sm:table-cell md:px-4">{t[8]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="faq" title={`${s.name} questions`}>
        <div className="mt-6 space-y-3">
          {stationFaqs(s).map((q) => (
            <details key={q.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{q.q}</h3>
                <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{q.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <p className="mt-12 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Timetable as of {dateText(s.fetchedOn)}. Times are the timetable&rsquo;s, not live: trains can run late, and platforms can change on
        the day. Check the live board or the RailBuzz app before you travel.
      </p>
    </main>
  );
}
