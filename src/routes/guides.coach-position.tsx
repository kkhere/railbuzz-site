import { Link, createFileRoute } from "@tanstack/react-router";
import { Article, articleData, type Faq } from "@/components/article";
import { pageHead } from "@/lib/legal-page";

const TITLE = "Train Coach Position: What ENG, S1, B1, A1 & H1 Mean";
const DESCRIPTION = "How to read a train's coach position and find your coach on the platform: ENG, SLRD, GEN, S, B, M, A, H, C, E and pantry car codes explained.";

const CODES: [string, string][] = [
  ["ENG", "The engine (locomotive)."],
  ["SLR / SLRD", "Guard and luggage van; SLRD also has a coach for passengers with disabilities (divyangjan)."],
  ["GEN / GS / UR", "General, unreserved coaches: any ticket for the train, no reserved seat."],
  ["D1, D2 …", "Second sitting (2S): reserved seats, no berths."],
  ["S1, S2 …", "Sleeper class (SL): non-AC berths."],
  ["M1, M2 …", "AC 3 Economy (3E)."],
  ["B1, B2 …", "AC 3 Tier (3A)."],
  ["A1, A2 …", "AC 2 Tier (2A)."],
  ["H1 / HA1", "First AC (1A); HA is a coach with both First AC and AC 2 Tier."],
  ["C1, C2 …", "AC Chair Car (CC), as on Shatabdi and Vande Bharat trains."],
  ["E1 / EA1", "Executive Chair Car (EC), and Executive Anubhuti (EA)."],
  ["PC", "Pantry car, where the train's food is cooked."],
  ["EOG / LPR", "Power car, and luggage or parcel van."],
];

const FAQS: Faq[] = [
  {
    q: "Is the coach position counted from the engine?",
    a: "Yes. A coach position lists the coaches in order from the engine. Where the engine is when the train reaches your platform depends on the direction it comes from, so the station's coach display boards are the surest guide.",
  },
  {
    q: "Why is my coach at the other end of the train?",
    a: "Some trains reverse at a station on the way: the engine moves to the other end and the train leaves in the direction it came from. After such a station, the coach order seen from the front is reversed.",
  },
  {
    q: "Can the coach order change?",
    a: "Yes. Railways sometimes add, remove or replace coaches, so the order on the day can differ from the timetable's. The coach number on your ticket does not change.",
  },
  {
    q: "Where can I see a train's coach position?",
    a: "Each train's page on RailBuzz shows its coach order from the engine. Search for your train on Search Trains and open its page.",
  },
];

export const Route = createFileRoute("/guides/coach-position")({
  head: () => ({
    ...pageHead(TITLE, DESCRIPTION, "/guides/coach-position"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(articleData({ path: "/guides/coach-position", title: TITLE, description: DESCRIPTION, section: "Guides", faqs: FAQS })) }],
  }),
  component: CoachGuide,
});

function CoachGuide() {
  return (
    <Article
      section="Guides"
      title="Coach position: find your coach on the platform"
      intro="Your ticket says your coach, such as S4 or B2. The coach position says where that coach is in the train, so you can wait in the right place before it arrives."
      faqs={FAQS}
      medium="guide_coach_position"
    >
      <h2>How a coach position reads</h2>
      <p>
        A coach position is the order of a train's coaches from the engine, such as <code>ENG-SLRD-GEN-GEN-S1-S2-S3-B1-B2-A1-H1-SLRD</code>.
        Each code is one coach. Count from the engine to find yours: in this example S2 is the fifth coach behind the engine.
      </p>

      <h2>What the codes mean</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3">Code</th>
              <th scope="col" className="px-4 py-3">Coach</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CODES.map(([code, words]) => (
              <tr key={code}>
                <th scope="row" className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-foreground">{code}</th>
                <td className="px-4 py-3 text-muted-foreground">{words}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Finding your place on the platform</h2>
      <ul>
        <li>Find which end the engine will be as the train comes in. Large stations show it on coach guidance boards above the platform.</li>
        <li>Count along the coach position to your coach, and walk to about that point before the train arrives.</li>
        <li>At smaller stations a train stands for a minute or two, so being near your coach matters most there.</li>
        <li>If the train reverses on the way, the order from the front flips after that station.</li>
      </ul>

      <h2>Coach positions on RailBuzz</h2>
      <p>
        Every long-distance train's page on RailBuzz shows its coach order, with its timetable, platforms and running days. Find yours on{" "}
        <Link to="/trains/">Search Trains</Link>. Passengers on board also share which end a coach is in the train's chat room in the
        RailBuzz app.
      </p>
    </Article>
  );
}
