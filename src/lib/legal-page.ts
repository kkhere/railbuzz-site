export const SITE_URL = "https://railbuzz.in";

/** A page's address as GitHub Pages serves it: /privacy/, not /privacy. */
export const pageUrl = (path: string) => SITE_URL + (path.endsWith("/") ? path : path + "/");

/** Shared head() for a policy page. */
export function pageHead(title: string, description: string, path: string, noindex = false) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl(path) },
      { name: "twitter:card", content: "summary_large_image" },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: pageUrl(path) }],
  };
}
