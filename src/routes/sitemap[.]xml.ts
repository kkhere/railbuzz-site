import { createFileRoute } from "@tanstack/react-router";
import { pageUrl } from "@/lib/legal-page";

const paths = ["/", "/terms", "/privacy", "/community-guidelines", "/grievance", "/delete-account"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = paths.map((p) => `<url><loc>${pageUrl(p)}</loc></url>`).join("");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          { headers: { "Content-Type": "application/xml" } },
        );
      },
    },
  },
});
