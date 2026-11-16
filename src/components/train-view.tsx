import { Link } from "@tanstack/react-router";
import { BellRing, CalendarDays, ChevronDown, Clock, MapPin, MessageCircle, Route as RouteIcon, Signpost, TrainFront } from "lucide-react";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/site-layout";
import {
  className as classWords,
  dateText,
  coachKind,
  coachWords,
  dayText,
  durationText,
  hasPage,
  hasStationPage,
  haltMinutes,
  runDaysText,
  type Train,
} from "@/lib/trains";

// A train's page, shared by the ~4,000 built ahead (routes/train.$number.tsx,
// RailBuzz's timetable store as built for the site) and the ones loaded when
// asked for (routes/train.index.tsx, /train/?n=12345, through the admin
// route). Nothing on it is live: the live part is in the app.

export function faqs(t: Train): { q: string; a: string }[] {
  const first = t.halts[0];
  const last = t.halts[t.halts.length - 1];
  const list: { q: string; a: string }[] = [];
  if (first?.dep) {
    list.push({
      q: `What time does ${t.number} leave ${t.from.name}?`,
      a: `${t.number} ${t.name} leaves ${t.from.name} (${t.from.code}) at ${first.dep}` +
        (first.pf ? `, from platform ${first.pf} by the timetable.` : "."),
    });
  }
  if (last?.arr) {
    list.push({
      q: `What time does ${t.number} reach ${t.to.name}?`,
      a: `It is due at ${t.to.name} (${t.to.code}) at ${last.arr}, ${dayText(last.day)}` +
        (last.pf ? `, on platform ${last.pf} by the timetable.` : "."),
    });
  }
  list.push({
    q: `On which days does ${t.number} run?`,
    a: t.runDays.length === 7
      ? `${t.number} runs every day.`
      : `${t.number} runs on ${runDaysText(t.runDays)}, from ${t.from.name}.`,
  });
  if (t.durationMin > 0) {
    list.push({
      q: `How long does ${t.number} take from ${t.from.name} to ${t.to.name}?`,
      a: `About ${durationText(t.durationMin)} for ${t.distanceKm} km, with ${t.halts.length - 2} halts on the way` +
        (t.avgSpeed ? ` and an average speed of ${t.avgSpeed} km/h.` : "."),
    });
  }
  list.push({
    q: `Is there a chat group for ${t.number} ${t.name}?`,
    a: `Yes. RailBuzz has a chat room for every day ${t.number} runs. Join it in the RailBuzz app to talk to the passengers on the same train about delays, platforms, coaches and food on board. Everyone appears under an alias, never a name or phone number, and the room closes 15 minutes after the run ends.`,
  });
  list.push({
    q: `Where is ${t.number} right now?`,
    a: `Open ${t.number} in the RailBuzz app for its live running status: the station it last passed, how late it is running and the expected time at every halt ahead. You can also subscribe to the train for updates on your phone until your stop, and chat with the passengers on board.`,
  });
  return list;
}

const coachStyle = {
  ac: "border-primary/60 bg-primary/15 text-primary",
  sleeper: "border-chart-2/60 bg-chart-2/15 text-chart-2",
  general: "border-border bg-secondary text-foreground",
  other: "border-border bg-background text-muted-foreground",
} as const;

function Fact({ icon: Icon, label, value, sub }: { icon: typeof Clock; label: string; value: string; sub?: string }) {
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

/** A train's page: its timetable, coach position, running days and questions, from [t]. */
export function TrainView({ t }: { t: Train }) {
  const first = t.halts[0];
  const last = t.halts[t.halts.length - 1];
  const kinds = new Set(t.coaches.map(coachKind));

  return (
    <main className="mx-auto max-w-4xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">Trains</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{t.number}</span>
      </nav>

      <header className="mt-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <TrainFront className="size-3.5" /> {t.type || "Train"} · {runDaysText(t.runDays)}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
          <span className="text-primary">{t.number}</span> {t.name}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t.from.name} ({t.from.code}) → {t.to.name} ({t.to.code})
        </p>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">
          {t.number} {t.name} leaves {t.from.name} at {first?.dep} and reaches {t.to.name} at {last?.arr},{" "}
          {dayText(last?.day ?? 1)}. It covers {t.distanceKm} km in about {durationText(t.durationMin)}, with{" "}
          {t.halts.length - 2} halts on the way, and runs{" "}
          {t.runDays.length === 7 ? "every day" : `on ${runDaysText(t.runDays)}`}.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Fact icon={Clock} label="Departs" value={first?.dep ?? "—"} sub={t.from.name} />
        <Fact icon={MapPin} label="Arrives" value={last?.arr ?? "—"} sub={`${t.to.name}${(last?.day ?? 1) > 1 ? ` · day ${last?.day}` : ""}`} />
        <Fact icon={RouteIcon} label="Journey" value={durationText(t.durationMin)} sub={`${t.distanceKm} km`} />
        <Fact icon={Signpost} label="Halts on the way" value={String(Math.max(t.halts.length - 2, 0))} sub={`${t.stations} stations on the route`} />
      </div>

      {/* The live part is in the app: this card says what it gives for this train. */}
      <section aria-label={`Follow ${t.number} live`} className="relative mt-8 overflow-hidden rounded-3xl border border-primary/50 bg-card p-6 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Where is {t.number} right now?</h2>
          <p className="mt-2 text-muted-foreground">The timetable is below. For today&rsquo;s run, open {t.number} in RailBuzz:</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: MapPin, title: "Live running status", text: "Where it is, how late, and the expected time at every halt ahead." },
              { icon: BellRing, title: "Alerts until your stop", text: "Subscribe for updates every hour and alerts before your stations." },
              { icon: MessageCircle, title: `The ${t.number} chat room`, text: "Talk to the passengers on board about delays, platforms and coaches." },
            ].map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <p.icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PlayButton medium="train_page" />
            <a
              href={`/room/?t=${t.number}`}
              rel="nofollow"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-6 py-3.5 font-semibold transition hover:border-primary"
            >
              <MessageCircle className="size-5" /> Open the {t.number} chat room
            </a>
          </div>
        </div>
      </section>

      <Section id="timetable" title={`${t.number} timetable and halts`}>
        <p className="mt-3 text-muted-foreground">
          Every halt from {t.from.name} to {t.to.name}, with the times and platforms the timetable gives.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-[11px] uppercase tracking-normal text-muted-foreground sm:text-xs sm:tracking-wider">
              <tr>
                <th scope="col" className="px-3 py-3 md:px-4">Station</th>
                <th scope="col" className="px-2 py-3">Arrives</th>
                <th scope="col" className="px-2 py-3">Departs</th>
                <th scope="col" className="hidden px-2 py-3 sm:table-cell">Halt</th>
                <th scope="col" className="px-2 py-3">Day</th>
                <th scope="col" className="hidden px-2 py-3 sm:table-cell">Km</th>
                <th scope="col" className="hidden px-3 py-3 sm:table-cell md:px-4">PF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {t.halts.map((h, i) => {
                const halt = haltMinutes(h);
                const end = i === 0 || i === t.halts.length - 1;
                return (
                  <tr key={`${h.code}-${i}`} className={end ? "bg-primary/5" : ""}>
                    <th scope="row" className="px-3 py-3 font-medium md:px-4">
                      {hasStationPage(h.code) ? (
                        <Link to="/station/$code/" params={{ code: h.code }} className="hover:text-primary hover:underline">
                          {h.name}
                        </Link>
                      ) : (
                        h.name
                      )}{" "}
                      <span className="text-xs text-muted-foreground">{h.code}</span>
                    </th>
                    <td className="px-2 py-3 tabular-nums">{h.arr || (i === 0 ? "Starts" : "—")}</td>
                    <td className="px-2 py-3 tabular-nums">{h.dep || (i === t.halts.length - 1 ? "Ends" : "—")}</td>
                    <td className="hidden px-2 py-3 tabular-nums text-muted-foreground sm:table-cell">{halt === null ? "" : `${halt} min`}</td>
                    <td className="px-2 py-3 tabular-nums text-muted-foreground">{h.day}</td>
                    <td className="hidden px-2 py-3 tabular-nums text-muted-foreground sm:table-cell">{h.km}</td>
                    <td className="hidden px-3 py-3 tabular-nums text-muted-foreground sm:table-cell md:px-4">{h.pf}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {t.coaches.length > 0 && (
        <Section id="coach-position" title={`${t.number} coach position`}>
          <p className="mt-3 text-muted-foreground">
            The order of the coaches from the engine, as the timetable lists it. It can change on the day: check the coach
            display board on the platform.
          </p>
          <ol aria-label={`Coach order of ${t.number}, from the engine`} className="mt-6 flex flex-wrap gap-1.5">
            {t.coaches.map((c, i) => (
              <li
                key={`${c}-${i}`}
                title={coachWords(c)}
                className={"min-w-12 rounded-lg border px-2 py-2 text-center font-mono text-xs font-semibold " + coachStyle[coachKind(c)]}
              >
                <span className="block text-[10px] font-normal opacity-70">{i + 1}</span>
                {c}
              </li>
            ))}
          </ol>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {kinds.has("ac") && <li className="flex items-center gap-2"><span className={"size-3 rounded border " + coachStyle.ac} /> AC</li>}
            {kinds.has("sleeper") && <li className="flex items-center gap-2"><span className={"size-3 rounded border " + coachStyle.sleeper} /> Sleeper</li>}
            {kinds.has("general") && <li className="flex items-center gap-2"><span className={"size-3 rounded border " + coachStyle.general} /> General</li>}
            {kinds.has("other") && <li className="flex items-center gap-2"><span className={"size-3 rounded border " + coachStyle.other} /> Engine, luggage and others</li>}
          </ul>
        </Section>
      )}

      <Section id="chat" title={`${t.number} ${t.name} chat room`}>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Travelling on {t.number}? RailBuzz gives every run of the train its own chat room, open to the passengers on board
          that day. Ask about the delay, a platform change or where your coach stops, and hear from people who are actually on
          the train.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            "Delay updates from passengers on board",
            "Platform changes and which coach is where",
            "Ask for help with your coach number",
            "An alias like Traveller-392, never your name or number",
          ].map((point) => (
            <li key={point} className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {point}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href={`/room/?t=${t.number}`}
            rel="nofollow"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold transition hover:border-primary hover:text-primary"
          >
            <MessageCircle aria-hidden className="size-5" /> Join the {t.number} chat room
          </a>
          <Link to="/train-chat/" className="text-sm text-primary hover:underline">How train chat works</Link>
        </div>
      </Section>

      <Section id="details" title={t.classes.length > 0 ? "Classes and running days" : "Running days"}>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {t.classes.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">Classes</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.classes.map((c) => (
                  <li key={c} className="rounded-full border border-border px-3 py-1 text-sm">
                    <span className="font-semibold">{c}</span> <span className="text-muted-foreground">{classWords(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-primary" /> Runs from {t.from.name}</h3>
            {/* Phones: the seven days share the card's width, so they fit at 320 px. */}
            <ul className="mt-3 grid max-w-xs grid-cols-7 gap-1 sm:flex sm:max-w-none sm:gap-1.5">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => (
                <li
                  key={d}
                  className={
                    "grid aspect-square w-full place-items-center rounded-full text-xs font-semibold capitalize sm:size-9 " +
                    (t.runDays.includes(d) ? "bg-gradient-primary text-primary-foreground" : "border border-border text-muted-foreground line-through")
                  }
                >
                  {d.slice(0, 2)}
                </li>
              ))}
            </ul>
            {t.returnTrain && (
              <p className="mt-4 text-sm text-muted-foreground">
                Return journey:{" "}
                {hasPage(t.returnTrain) ? (
                  <Link to="/train/$number/" params={{ number: t.returnTrain }} className="font-semibold text-primary hover:underline">
                    {t.returnTrain}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground">{t.returnTrain}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section id="faq" title={`${t.number} questions`}>
        <div className="mt-6 space-y-3">
          {faqs(t).map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{f.q}</h3>
                <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <p className="mt-12 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Timetable from RailRadar{t.fetchedOn ? `, as of ${dateText(t.fetchedOn)}` : ""}.
        Times, platforms and coach order can change: confirm with Indian Railways&rsquo; National Train Enquiry System
        (enquiry.indianrail.gov.in) or 139 before you travel. RailBuzz is an independent app, not affiliated with Indian
        Railways or IRCTC.
      </p>
    </main>
  );
}
