import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { type Catalogue, searchTrains } from "@/components/train-search";
import { indexStations, suggestStations } from "@/lib/station-search";

// Against the real lists the site serves (public/data), built from our
// timetables of every train (scripts/build_site_trains.py).
const DATA = path.resolve(__dirname, "../../public/data");
const index = indexStations(
  (
    JSON.parse(readFileSync(path.join(DATA, "station-index.json"), "utf8")) as {
      s: [string, string, number, number][];
    }
  ).s,
);
const trains = JSON.parse(readFileSync(path.join(DATA, "trains.json"), "utf8")) as Catalogue;

const codes = (q: string, max?: number) =>
  suggestStations(index, q, max).stations.map((s) => s.code);
const byCode = new Map(index.map((s) => [s.code, s]));

describe("station suggestions: stations trains stop at, busiest first", () => {
  it("one letter gives the big stations, not the shortest names", () => {
    const v = codes("v");
    expect(v[0]).toBe("BZA");
    expect(v).toEqual(expect.arrayContaining(["BRC", "BSB", "VSKP"]));
    expect(v).not.toContain("VEER");
    expect(codes("ban")[0]).not.toBe("BANI");
  });

  it("never a station no train stops at", () => {
    for (const q of ["a", "b", "d", "k", "m", "s", "goods", "del"])
      for (const c of codes(q, 50)) expect(byCode.get(c)?.all, `${q}: ${c}`).toBeGreaterThan(0);
    expect(codes("del")).not.toContain("DEL");
    expect(codes("del")[0]).toBe("NDLS");
  });

  it("a code typed is first, when 10 or more long-distance trains stop there", () => {
    expect(codes("sc")[0]).toBe("SC");
    expect(codes("bza")[0]).toBe("BZA");
    expect(codes("MS")[0]).toBe("MS");
    expect(codes("vi")[0], "not Villianur (VI)").toBe("BZA");
    // Nivari (NEW) has 10 or more, so it is first; New Delhi next, and alone by "new d".
    expect(codes("new").slice(0, 2)).toEqual(["NEW", "NDLS"]);
    expect(codes("new d")[0]).toBe("NDLS");
    expect(codes("nivari")).toContain("NEW");
  });

  it("a city typed gives its main stations first", () => {
    expect(codes("hyd").slice(0, 5).sort()).toEqual(["CHZ", "HYB", "KCG", "LPI", "SC"]);
    expect(codes("Hyderabad").slice(0, 2)).toEqual(["HYB", "SC"]);
    expect(codes("kolkata")[0]).toBe("HWH");
    expect(codes("che").slice(0, 3)).toEqual(["MAS", "MS", "TBM"]);
    expect(codes("hyd")[0], "the one named so first").toBe("HYB");
  });

  it("a place's other names", () => {
    expect(codes("bangalore")[0]).toBe("SBC");
    expect(codes("bang")).toContain("SBC");
    expect(codes("vizag")[0]).toBe("VSKP");
    expect(codes("madras")[0]).toBe("MAS");
    expect(codes("calcutta")[0]).toBe("HWH");
    expect(codes("trivandrum")[0]).toBe("TVC");
    expect(codes("mysuru")).toContain("MYS");
    expect(codes("bombay")).toContain("CSMT");
    expect(suggestStations(index, "vizag").nowCalled).toBe("Visakhapatnam");
    expect(suggestStations(index, "secunderabad").nowCalled).toBeNull();
  });

  it("small stations are still found by their name", () => {
    expect(codes("villianur")).toContain("VI");
    expect(codes("abhanpur")).toContain("AVP");
  });

  it("eight at most; nothing for nothing", () => {
    expect(codes("a")).toHaveLength(8);
    expect(codes("   ")).toEqual([]);
    expect(codes("zzzzqq")).toEqual([]);
  });
});

describe("train search by a place's other names", () => {
  const numbers = (q: string) => searchTrains(trains, q).map((h) => h.number);
  const names = (q: string) =>
    searchTrains(trains, q).map((h) => `${h.name} ${h.from} ${h.to}`.toLowerCase());

  it("bangalore finds the Bengaluru trains", () => {
    expect(names("bangalore").length).toBeGreaterThan(5);
    expect(names("bangalore").some((n) => n.includes("bengaluru"))).toBe(true);
  });

  it("vizag finds Visakhapatnam's; a city its main stations' trains", () => {
    expect(names("vizag").length).toBeGreaterThan(5);
    expect(names("vizag").every((n) => n.includes("visakhapatnam") || n.includes("duvvada"))).toBe(
      true,
    );
    // Howrah's Rajdhanis by the city's name.
    const rajdhanis = searchTrains(trains, "kolkata rajdhani");
    expect(rajdhanis.some((h) => h.from.startsWith("Howrah") || h.to.startsWith("Howrah"))).toBe(
      true,
    );
  });

  it("a number is as before", () => {
    expect(numbers("12727")[0]).toBe("12727");
  });
});
