import { Link, createFileRoute } from "@tanstack/react-router";
import { Article, articleData, type Faq } from "@/components/article";
import { pageHead } from "@/lib/legal-page";

const TITLE = "Train Running Status Explained: Delays & Expected Times";
const DESCRIPTION = "What Departed, Arrived, Expected and delay mean in train running status, why expected times change, and when to leave for the station.";

const FAQS: Faq[] = [
  {
    q: "Why does my train's expected time keep changing?",
    a: "An expected time is an estimate from where the train is now and how it has been running. It changes when the train is held at a signal, waits for a crossing on a single line, slows for work on the track, or makes up time. The nearer the train is to your station, the steadier the estimate.",
  },
  {
    q: "Why do trains often reach the last station early even when they ran late?",
    a: "Timetables give trains extra minutes near the end of the journey, so a train running a little late can still arrive on time or early at its last station. In RailBuzz's own data from 773 journeys, the median arrival at the last station was 7 minutes late, and nearly a third of journeys arrived on time or early.",
  },
  {
    q: "What does RT mean in running status?",
    a: "RT means right time: the train left or reached that station at its timetable time, or close enough that no delay is shown.",
  },
  {
    q: "How accurate is RailBuzz's arrival estimate?",
    a: "In RailBuzz's tests on 150 journeys from 15 October to 13 November 2026, the arrival time RailBuzz gave in the last 30 minutes before a train arrived was off by a median of 4 minutes, against 5.9 minutes for the estimate it was compared with.",
  },
  {
    q: "Can I get running status without checking again and again?",
    a: "Yes. In the RailBuzz app, Subscribe to a Train sends an alert before the train reaches your boarding station, an update about every hour on the way, and an alert about 20 minutes before your destination.",
  },
];

export const Route = createFileRoute("/guides/running-status")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/guides/running-status"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(articleData({ path: "/guides/running-status", title: TITLE, description: DESCRIPTION, section: "Guides", faqs: FAQS })) }],
  }),
  component: RunningStatusGuide,
});

function RunningStatusGuide() {
  return (
    <Article
      section="Guides"
      title="Train running status, explained"
      intro="Running status says where a train is now and when it should reach each station ahead. Here is what each part means, and how to read it so you leave for the station at the right time."
      faqs={FAQS}
      medium="guide_running_status"
    >
      <h2>Where the information comes from</h2>
      <p>
        Indian Railways records when each train passes its stations. Running status shows those times for the stations the train has
        passed, and an estimate for the stations ahead. RailBuzz gets each train's live position from a railway data service that follows
        Indian Railways' own tracking, and works out its own arrival estimates from it.
      </p>

      <h2>The words you will see</h2>
      <ul>
        <li><strong>Departed</strong>: the train has left that station, with the time it left and how late it was.</li>
        <li><strong>Arrived</strong> or <strong>at the station</strong>: the train is standing there now.</li>
        <li><strong>Expected</strong>: the time the train should reach a station ahead, from where it is now. It is an estimate.</li>
        <li><strong>Delay</strong>, such as &ldquo;12 min late&rdquo;: how far behind the timetable the train is. RT (right time) means no delay.</li>
        <li><strong>Not started</strong>: the train has not left its first station yet. Its stations then show the timetable.</li>
        <li><strong>Between two stations</strong>: the train is on the line, past one station and before the next.</li>
      </ul>

      <h2>Why expected times move</h2>
      <p>
        An estimate is only as good as the track ahead. A train held at a signal, waiting to cross another on a single line, or slowing
        for track work loses minutes that no estimate saw coming; a clear run lets it gain some back. Estimates are steadiest in the last
        half hour before your station. RailBuzz moves its estimate on while a train stands still, so a train held outside a station does
        not look as if it is still on time.
      </p>
      <p>
        Near the end of a journey, timetables include extra minutes. A train running a little late can still reach its last station on
        time or early. Across the 773 journeys in <Link to="/punctuality/">RailBuzz's punctuality data</Link>, the median arrival at the
        last station was 7 minutes late, and 68% were within 15 minutes of the timetable.
      </p>

      <h2>When to leave for the station</h2>
      <ul>
        <li>Check the running status before you leave home, and again on the way.</li>
        <li>Go by the expected time, not the delay alone: a train 40 minutes late at one station may make up time before yours.</li>
        <li>Platforms can change on the day. The station's announcements and boards have the final word.</li>
        <li>For a train that has not started, its timetable is the best guide until it leaves its first station.</li>
      </ul>

      <h2>Running status in RailBuzz</h2>
      <p>
        The RailBuzz app shows each halt as departed, at the station or ahead, with expected times, and refreshes while you look. Without a
        signal it keeps the last live update and estimates where the train is. Subscribe to a Train sends the alerts for you, and the
        train's chat room has passengers on board saying what is happening. Search for your train on{" "}
        <Link to="/trains/">Search Trains</Link> to see its timetable first.
      </p>
    </Article>
  );
}
