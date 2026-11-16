import { createFileRoute, notFound } from "@tanstack/react-router";
import { TrainView, faqs } from "@/components/train-view";
import { SITE_URL, pageHead, pageUrl } from "@/lib/legal-page";
import { loadTrain, runDaysText, type Train } from "@/lib/trains";

// One page per Popular Train: what people search for ("12727 timetable",
// "12727 coach position", "12727 chat", "where is 12727"), answered from
// RailRadar's timetable as fetched for the site, and pointing to the app for
// the live part. Nothing on it is live: a static page costs RailRadar nothing.

export const Route = createFileRoute("/train/$number")({
  loader: async ({ params }) => {
    const train = await loadTrain(params.number);
    if (!train) throw notFound();
    return train;
  },
  head: ({ loaderData: t }) => {
    if (!t) return {};
    const first = t.halts[0];
    const last = t.halts[t.halts.length - 1];
    const title = `${t.number} ${t.name}: Timetable, Live Status & Train Chat`;
    // Within the ~155 characters a search result shows: the facts first, then
    // as much of what the page offers as fits.
    const days = t.runDays.length === 7 ? "daily" : t.runDays.map((d) => d[0]!.toUpperCase() + d.slice(1)).join(", ");
    const core =
      `${t.number} ${t.name}: ${t.from.name} ${first?.dep ?? ""} to ${t.to.name} ${last?.arr ?? ""}, ` +
      `${Math.max(t.halts.length - 2, 0)} halts, runs ${days}.`;
    const description =
      [" Timetable, coach position, live status and train chat.", " Timetable, live status and train chat.", " Timetable and train chat.", ""]
        .map((tail) => core + tail)
        .find((d) => d.length <= 155) ?? core;
    return {
      ...pageHead(title, description, `/train/${t.number}`),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData(t)) }],
    };
  },
  component: TrainPage,
});

function structuredData(t: Train) {
  const url = pageUrl(`/train/${t.number}`);
  const first = t.halts[0];
  const last = t.halts[t.halts.length - 1];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TrainTrip",
        name: `${t.number} ${t.name}`,
        trainNumber: t.number,
        trainName: t.name,
        url,
        departureStation: { "@type": "TrainStation", name: `${t.from.name} (${t.from.code})` },
        arrivalStation: { "@type": "TrainStation", name: `${t.to.name} (${t.to.code})` },
        ...(first?.dep ? { departureTime: `${first.dep}:00+05:30` } : {}),
        ...(last?.arr ? { arrivalTime: `${last.arr}:00+05:30` } : {}),
        provider: { "@type": "Organization", name: "Indian Railways" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Trains", item: pageUrl("/trains") },
          { "@type": "ListItem", position: 3, name: `${t.number} ${t.name}`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs(t).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

function TrainPage() {
  return <TrainView t={Route.useLoaderData()} />;
}
