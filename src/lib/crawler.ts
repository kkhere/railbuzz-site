// Search engines, link previews and page-speed tools read railbuzz.in's
// pages, and should: every train and station page stays open to them (the
// owner, 18 November 2026: "Google brings passengers to RailBuzz's website;
// RailBuzz's website brings passengers to the app"). What they must not do is
// set off live lookups: on 17 and 18 November crawlers following each station
// page's "Live board" link used up the website's 60 station boards a day by
// mid-morning, and passengers were told the limit was reached.
//
// So a page that would look something up as it opens (a shared link's
// ?code=, ?from=&to=, ?n=) does not for these; the admin route refuses them
// too (its own copy of this list). People are never in it: only crawlers
// name themselves this way.

export const CRAWLER =
  /googlebot|google-inspectiontool|googleother|adsbot-google|mediapartners-google|storebot-google|google-extended|bingbot|bingpreview|adidxbot|slurp|duckduckbot|duckassistbot|baiduspider|yandex(bot|images|renderer)|applebot|petalbot|bytespider|facebookexternalhit|meta-externalagent|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|ahrefsbot|semrushbot|mj12bot|dotbot|amazonbot|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|claude-searchbot|perplexitybot|ccbot|chrome-lighthouse|headlesschrome|pagespeed|ia_archiver/i;

/** True for a crawler or an automated browser; true before there is a browser (prerendering). */
export function isCrawler(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.webdriver === true || CRAWLER.test(navigator.userAgent);
}
