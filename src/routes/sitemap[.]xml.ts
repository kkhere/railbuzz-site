import { createFileRoute } from "@tanstack/react-router";
import communityGuidelines from "@/content/community-guidelines.html?raw";
import deleteAccount from "@/content/delete-account.html?raw";
import grievance from "@/content/grievance.html?raw";
import privacy from "@/content/privacy.html?raw";
import terms from "@/content/terms.html?raw";
import { pageUrl } from "@/lib/legal-page";

// Every train and station page (scripts/build_site_trains.py): [number, name, from, to, fetchedOn] and [code, name, trains].
const first = <T>(files: Record<string, T[]>): T[] => Object.values(files)[0] ?? [];
const trainPages = first(import.meta.glob<[string, string, string, string, string][]>("../data/train-pages.json", { eager: true, import: "default" }));
const stationPages = first(import.meta.glob<[string, string, number][]>("../data/station-pages.json", { eager: true, import: "default" }));

// Every page search engines should know, with the day it last changed: a
// policy's own "Last updated" line, a train page's timetable fetch, and the
// build for the rest (the site is rebuilt whenever they change).

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** "Last updated 15 November 2026" in a policy's text, as 2026-11-15; null if it has none. */
function updated(html: string): string | null {
  const m = /Last updated (\d{1,2}) ([A-Za-z]+) (\d{4})/.exec(html);
  const month = m ? MONTHS.indexOf((m[2] ?? "").toLowerCase()) : -1;
  return m && month >= 0 ? `${m[3]}-${String(month + 1).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}` : null;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const built = new Date().toISOString().slice(0, 10);
        const pages: [string, string][] = [
          ["/", built],
          ["/trains", built],
          ["/trains-between-stations", built],
          ["/station-departures", built],
          ["/pnr-status", built],
          ["/train-chat", built],
          ["/about", built],
          ["/guides/running-status", built],
          ["/guides/coach-position", built],
          ["/punctuality", built],
          ...trainPages.map(([n, , , , day]): [string, string] => [`/train/${n}`, day || built]),
          ...stationPages.map(([c]): [string, string] => [`/station/${c}`, built]),
          ["/terms", updated(terms) ?? built],
          ["/privacy", updated(privacy) ?? built],
          ["/community-guidelines", updated(communityGuidelines) ?? built],
          ["/grievance", updated(grievance) ?? built],
          ["/delete-account", updated(deleteAccount) ?? built],
        ];
        const urls = pages.map(([p, day]) => `<url><loc>${pageUrl(p)}</loc><lastmod>${day}</lastmod></url>`).join("");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          { headers: { "Content-Type": "application/xml" } },
        );
      },
    },
  },
});
