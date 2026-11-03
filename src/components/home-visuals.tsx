import type { ReactNode } from "react";

// Illustrations for the home page, drawn in HTML so they stay sharp and light.
// They show what each screen is for, not real trains, times or passengers, and
// are hidden from screen readers: the text beside each one says the same thing.

function Screen({ title, sub, live = true, children }: { title: string; sub: string; live?: boolean; children: ReactNode }) {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[22rem]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/15 blur-3xl" />
      <div className="rounded-[2.25rem] border border-border bg-card p-2.5 shadow-2xl shadow-black/40">
        <div className="overflow-hidden rounded-[1.75rem] bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="font-display text-sm font-bold">{title}</div>
              <div className="text-[11px] text-muted-foreground">{sub}</div>
            </div>
            {live && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" /> Live
              </span>
            )}
          </div>
          <div className="space-y-3 p-4 text-[13px] leading-snug">{children}</div>
        </div>
      </div>
    </div>
  );
}

const stops = [
  { name: "Vijayawada Jn", time: "Departed 10:12", state: "done" },
  { name: "Khammam", time: "Departed 11:58", state: "done" },
  { name: "Between Khammam and Warangal", time: "Running 12 min late", state: "now" },
  { name: "Warangal", time: "Expected 13:21", state: "next" },
  { name: "Kazipet Jn", time: "Expected 13:44", state: "next" },
  { name: "Secunderabad Jn", time: "Expected 16:05", state: "next" },
] as const;

export function StatusVisual() {
  return (
    <Screen title="Running Status" sub="Today's run">
      <ol className="relative ml-1.5 border-l-2 border-dashed border-border">
        {stops.map((s) => (
          <li key={s.name} className="relative pb-4 pl-5 last:pb-0">
            <span
              className={
                "absolute top-1 rounded-full border-2 " +
                (s.state === "done"
                  ? "-left-[7px] size-3 border-primary bg-primary"
                  : s.state === "now"
                    ? "-left-[9px] size-4 border-primary bg-background ring-4 ring-primary/25"
                    : "-left-[7px] size-3 border-border bg-background")
              }
            />
            <div className={s.state === "now" ? "font-semibold text-primary" : "font-medium"}>{s.name}</div>
            <div className="text-[11px] text-muted-foreground">{s.time}</div>
          </li>
        ))}
      </ol>
    </Screen>
  );
}

function Bubble({ who, text, mine = false }: { who: string; text: string; mine?: boolean }) {
  return (
    <div className={mine ? "ml-10 text-right" : "mr-10"}>
      {!mine && <div className="mb-0.5 text-[11px] font-semibold text-chart-2">{who}</div>}
      <div
        className={
          "inline-block rounded-2xl px-3 py-2 text-left " +
          (mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-secondary")
        }
      >
        {text}
      </div>
    </div>
  );
}

export function ChatVisual() {
  return (
    <Screen title="Train chat room" sub="Today's run · passengers on board">
      <Bubble who="Traveller-392" text="Platform changed to 4 at Vijayawada 👀" />
      <Bubble who="Traveller-118" text="Thanks! Which end is coach S6?" />
      <Bubble who="You" text="Middle of the train, just after B2" mine />
      <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Ask for help · Coach S4</div>
        <div className="mt-1">Does anyone have a Type-C charger?</div>
        <div className="mt-1 text-[11px] text-muted-foreground">2 replies</div>
      </div>
      <div className="flex gap-1.5 overflow-hidden pt-1">
        {["Delay Update", "Platform Info", "Coach Help"].map((c) => (
          <span key={c} className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
    </Screen>
  );
}

export function AiVisual() {
  return (
    <Screen title="RailBuzz AI" sub="Ask anything about your journey" live={false}>
      <div className="flex flex-wrap gap-1.5">
        {["Order Food", "Fare Enquiry", "PNR Status", "IRCTC Rules & Refund"].map((c) => (
          <span key={c} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
      <Bubble who="You" text="Order food on my train" mine />
      <div className="mr-4 rounded-2xl rounded-bl-md bg-secondary p-3">
        <div className="font-semibold">🍱 Next halts where food can reach your seat</div>
        <ul className="mt-2 space-y-1.5">
          <li className="flex justify-between gap-3"><span>Warangal</span><span className="text-muted-foreground">in 1 h 20 min</span></li>
          <li className="flex justify-between gap-3"><span>Kazipet Jn</span><span className="text-muted-foreground">in 1 h 43 min</span></li>
        </ul>
        <div className="mt-2 text-[11px] text-muted-foreground">Order through IRCTC eCatering or the Food on Track app.</div>
      </div>
    </Screen>
  );
}
