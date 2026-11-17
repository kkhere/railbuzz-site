import boardDark from "@/assets/app/station-board-dark.webp";
import boardLight from "@/assets/app/station-board-light.webp";
import chatDark from "@/assets/app/join-chat-dark.webp";
import chatLight from "@/assets/app/join-chat-light.webp";
import newsDark from "@/assets/app/latest-news-dark.webp";
import newsLight from "@/assets/app/latest-news-light.webp";
import statusDark from "@/assets/app/running-status-dark.webp";
import statusLight from "@/assets/app/running-status-light.webp";

// The app itself: four screens from RailBuzz 2.0 (14), taken on a phone on
// 16-17 November 2026 (status bar cropped), each in the site's dark and light
// themes. Framed as the home page's drawings are (home-visuals.tsx), so the
// two sit together. Real trains and real news of those days; no names.

const screens = [
  {
    title: "Live Running Status",
    text: "Where the train is, and the delay at every halt.",
    dark: statusDark,
    light: statusLight,
    alt: "RailBuzz Running Status: a train between two stations, with arrival and departure times, delays and platforms at each halt",
  },
  {
    title: "Station Departures",
    text: "A station's live board: what's due, and how late.",
    dark: boardDark,
    light: boardLight,
    alt: "RailBuzz Station Departures for Secunderabad Jn: the next trains with their times, platforms and on-time or late status",
  },
  {
    title: "Latest Railway News",
    text: "News near you first, and disruptions on your route.",
    dark: newsDark,
    light: newsLight,
    alt: "RailBuzz Latest News, Near You: railway news stories with their region, source and a short summary",
  },
  {
    title: "Train Chat",
    text: "Join the chat of a train near you, in one tap.",
    dark: chatDark,
    light: chatLight,
    alt: "RailBuzz Join Live Chat: suggested chat rooms for trains due at Secunderabad Jn, each with a Join button",
  },
] as const;

export function AppScreens() {
  return (
    // Phones: a row to swipe through; wider screens: all four side by side.
    <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
      {screens.map((s) => (
        <figure key={s.title} className="w-[72%] shrink-0 snap-center sm:w-[45%] md:w-auto">
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-primary/15 blur-2xl" />
            <div className="rounded-[2rem] border border-border bg-card p-2 shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="overflow-hidden rounded-[1.6rem] bg-background">
                <img src={s.dark} alt={s.alt} width={600} height={1242} loading="lazy" decoding="async" className="block h-auto w-full light:hidden" />
                <img src={s.light} alt={s.alt} width={600} height={1242} loading="lazy" decoding="async" className="hidden h-auto w-full light:block" />
              </div>
            </div>
          </div>
          <figcaption className="mt-4 px-1">
            <span className="block font-semibold text-foreground">{s.title}</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">{s.text}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
