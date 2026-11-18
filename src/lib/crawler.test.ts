import { describe, expect, it } from "vitest";
import { appIntent } from "@/components/open-in-app";
import { CRAWLER } from "@/lib/crawler";
import { playLink } from "@/lib/legal-page";

describe("crawlers", () => {
  it("names the crawlers that render pages", () => {
    for (const ua of [
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.69 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    ]) {
      expect(CRAWLER.test(ua), ua).toBe(true);
    }
  });

  it("never names a person's browser, even a Cubot phone", () => {
    for (const ua of [
      "Mozilla/5.0 (Linux; Android 14; CPH2745) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
    ]) {
      expect(CRAWLER.test(ua), ua).toBe(false);
    }
  });
});

describe("Open in RailBuzz", () => {
  it("tags the Play link with the page and the train or station", () => {
    const url = new URL(playLink("train_page", "12727"));
    expect(url.searchParams.get("referrer")).toBe("utm_source=railbuzz.in&utm_medium=train_page&utm_content=12727");
    expect(new URL(playLink("home_hero")).searchParams.get("referrer")).toBe("utm_source=railbuzz.in&utm_medium=home_hero");
  });

  it("hands railbuzz.in/open to RailBuzz, with Google Play when it cannot", () => {
    const play = playLink("station_page", "SC");
    const intent = appIntent({ station: "SC" }, play);
    expect(intent.startsWith("intent://railbuzz.in/open/?station=SC#Intent;scheme=https;package=com.railbuzz.app;")).toBe(true);
    expect(decodeURIComponent(intent.split("S.browser_fallback_url=")[1]!.replace(/;end$/, ""))).toBe(play);
    expect(appIntent({ train: "12727" }, play)).toContain("intent://railbuzz.in/open/?train=12727#");
  });
});
