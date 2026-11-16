import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Article, articleData } from "@/components/article";
import { pageHead } from "@/lib/legal-page";

const TITLE = "Indian Railways Guides: Running Status, Coaches, PNR";
const DESCRIPTION = "Plain-English guides to Indian train travel: running status and delays, coach position, PNR status codes, trains between stations and train chat.";

const GUIDES = [
  { to: "/guides/running-status/", title: "Train running status, explained", text: "What Departed, Expected and delay mean, why expected times change, and how to know when to leave for the station." },
  { to: "/guides/coach-position/", title: "Coach position: find your coach", text: "What ENG, SLRD, GEN, S1, B1, A1 and H1 mean, and where to stand on the platform." },
  { to: "/pnr-status/", title: "PNR status codes", text: "CNF, RAC, WL, GNWL, RLWL, PQWL, TQWL: what each booking status means, and check a PNR." },
  { to: "/punctuality/", title: "How late do trains run?", text: "Arrival delays at the last station for 45 trains RailBuzz followed, from 773 journeys." },
  { to: "/trains-between-stations/", title: "Trains between two stations", text: "Every train from one station to another, with times and days, including nearby stations." },
  { to: "/train-chat/", title: "Train chat", text: "A chat room for the passengers on one train, on one day: delays, platforms, coaches." },
] as const;

export const Route = createFileRoute("/guides/")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/guides"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(articleData({ path: "/guides", title: TITLE, description: DESCRIPTION, section: "Guides", faqs: [] })) }],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <Article
      section="Guides"
      title="Guides to Indian train travel"
      intro="Short, plain answers to what passengers ask most: where the train is, where your coach stops, and what your ticket's status means."
      medium="guides"
    >
      <ul className="!ml-0 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.to} className="!ml-0 !list-none !pl-0">
            <Link to={g.to} className="group block h-full rounded-2xl border border-border bg-card p-5 !text-foreground transition hover:border-primary hover:!no-underline">
              <span className="flex items-center justify-between gap-3 font-semibold">
                {g.title} <ArrowRight className="size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">{g.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Article>
  );
}
