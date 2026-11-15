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
    const description =
      `${t.number} ${t.name}: ${t.from.name} ${first?.dep ?? ""} to ${t.to.name} ${last?.arr ?? ""}, ` +
      `${Math.max(t.halts.length - 2, 0)} halts on the way, runs ${runDaysText(t.runDays).toLowerCase()}. Timetable, coach position, live status and a chat room for the train.`;
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
