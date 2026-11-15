import { createFileRoute } from "@tanstack/react-router";
import communityGuidelines from "@/content/community-guidelines.html?raw";
import deleteAccount from "@/content/delete-account.html?raw";
import grievance from "@/content/grievance.html?raw";
import privacy from "@/content/privacy.html?raw";
import terms from "@/content/terms.html?raw";
import { pageUrl } from "@/lib/legal-page";
import { popularStates } from "@/lib/trains";

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
          ...popularStates.flatMap((s) => s.trains.map((t): [string, string] => [`/train/${t.number}`, t.fetchedOn || built])),
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
