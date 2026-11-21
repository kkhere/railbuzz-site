import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GROUPS, nowCalled, variants } from "@/lib/city-names";
import { cityOf, cityWordsOf, MAIN_STATIONS } from "@/lib/city-stations";

// The same cases as the app's CityNamesTest.kt.
describe("places by their other names", () => {
  it("an old or short name is also searched as the name in use", () => {
    expect(variants("bangalore")).toContain("bengaluru");
    expect(variants("vizag")).toContain("visakhapatnam");
    expect(variants("Vishakhapatnam")).toContain("visakhapatnam");
    expect(variants("Madras")).toContain("chennai");
    expect(variants("allahabad")).toContain("prayagraj");
  });

  it("works both ways for the names RailRadar still uses", () => {
    expect(variants("mysuru")).toContain("mysore");
    expect(variants("thoothukudi")).toContain("tuticorin");
  });

  it("the start of a name counts as it is typed", () => {
    expect(variants("bang")).toContain("bengaluru");
    expect(variants("viza")).toContain("visakhapatnam");
    expect(variants("ban"), "three letters are too few").toEqual([]);
  });

  it("the other words are kept", () => {
    expect(variants("Bangalore Rajdhani")).toContain("bengaluru rajdhani");
    expect(variants("bombay central")).toContain("mumbai central");
  });

  it("a name inside another word is not one", () => {
    expect(variants("falaknuma")).toEqual([]);
    expect(variants("12704")).toEqual([]);
    expect(variants("Secunderabad Jn (SC)")).toEqual([]);
    expect(variants("   ")).toEqual([]);
  });

  it("the results say the name in use when another was typed", () => {
    expect(nowCalled("bangalore")).toBe("Bengaluru");
    expect(nowCalled("bang")).toBe("Bengaluru");
    expect(nowCalled("Vizag")).toBe("Visakhapatnam");
    expect(nowCalled("kochi")).toBe("Ernakulam");
    expect(nowCalled("bengaluru"), "already the name in use").toBeNull();
    expect(nowCalled("beng"), "on its way to the name in use").toBeNull();
    expect(nowCalled("falaknuma")).toBeNull();
  });

  it("no name belongs to two places", () => {
    const all = GROUPS.flat().map((n) => n.toLowerCase());
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("a city's main stations", () => {
  it("a city by its name or its first letters", () => {
    expect(cityOf("hyd")).toBe("Secunderabad");
    expect(cityOf("Hyderabad")).toBe("Secunderabad");
    expect(cityOf("kolkata")).toBe("Howrah");
    expect(cityOf("del")).toBe("Delhi");
    expect(cityOf("new d")).toBe("Delhi");
    expect(cityOf("new"), "not New Delhi before its second word").toBeNull();
    expect(cityOf("hy"), "two letters are too few").toBeNull();
    expect(cityOf("falaknuma")).toBeNull();
  });

  it("the cities a station serves, for train search", () => {
    expect(cityWordsOf("SC")).toContain("hyderabad");
    expect(cityWordsOf("HWH")).toContain("kolkata");
    expect(cityWordsOf("BZA")).toBe("vijayawada");
    expect(cityWordsOf("TEN")).toBe("");
  });
});

// The copies match their sources, where the app and the admin are beside the
// site (the Railbuzz checkout; not the site's own repository on GitHub).
const ROOT = path.resolve(__dirname, "../../..");
const KOTLIN = path.join(ROOT, "app/src/main/java/com/example/railbuzz/data/CityNames.kt");
const NEARBY = path.join(ROOT, "admin/src/lib/railradar/nearby.ts");

describe("the same lists as the app and the admin", () => {
  it.skipIf(!existsSync(KOTLIN))("CityNames.kt's groups", () => {
    const source = readFileSync(KOTLIN, "utf8");
    const block = source.slice(source.indexOf("GROUPS"), source.indexOf("MIN_PREFIX"));
    const groups = [...block.matchAll(/listOf\(((?:\s*"[^"]*",?)+)\s*\)/g)].map((m) =>
      [...(m[1] ?? "").matchAll(/"([^"]*)"/g)].map((n) => n[1]),
    );
    expect(groups.length).toBeGreaterThan(40);
    expect(GROUPS.map((g) => [...g])).toEqual(groups);
  });

  it.skipIf(!existsSync(NEARBY))("nearby.ts's MAIN_STATIONS", () => {
    const source = readFileSync(NEARBY, "utf8");
    const block = source.slice(source.indexOf("export const MAIN_STATIONS"));
    const body = block.slice(block.indexOf("{") + 1, block.indexOf("};"));
    const theirs = Object.fromEntries(
      [...body.matchAll(/"([^"]+)":\s*\[([^\]]*)\]/g)].map((m) => [
        m[1],
        [...(m[2] ?? "").matchAll(/"([^"]+)"/g)].map((c) => c[1]),
      ]),
    );
    expect(Object.keys(theirs).length).toBeGreaterThan(10);
    expect(MAIN_STATIONS).toEqual(theirs);
  });
});
