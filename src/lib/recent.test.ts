import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { forget, forgetAll, MAX_RECENT, pnrStillUseful, remember, useRecent } from "@/lib/recent";

const DAY = 24 * 3600_000;
const read = (key: string) => JSON.parse(localStorage.getItem(key) ?? "[]");
const day = (offset: number) => {
  const d = new Date(Date.now() + offset * DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

afterEach(() => localStorage.clear());

describe("recent searches, kept in this browser", () => {
  it("newest first, the same one moved to the front, five at most", () => {
    for (const n of ["12727", "12723", "17256", "12728", "20708", "12775"])
      remember("trains", { number: n, name: `Train ${n}` });
    remember("trains", { number: "17256", name: "Narsapur Express" });
    const list = read("recent_trains") as { number: string; name: string }[];
    expect(list.map((t) => t.number)).toEqual(["17256", "12775", "20708", "12728", "12723"]);
    expect(list).toHaveLength(MAX_RECENT);
    expect(list[0]?.name).toBe("Narsapur Express");
  });

  it("keeps nothing odd, and reads past junk in storage", () => {
    remember("trains", { number: "12727; drop", name: "x" });
    remember("trains", { number: "12727", name: "" });
    remember("pnrs", { pnr: "123", train: "12727", date: null, at: Date.now() });
    remember("routes", {
      from: { code: "SC", name: "Secunderabad" },
      to: { code: "SC", name: "Secunderabad" },
    });
    remember("stations", { code: "sc<script>", name: "x" });
    expect(localStorage.length).toBe(0);

    localStorage.setItem(
      "recent_stations",
      '[{"code":"SC","name":"Secunderabad"},{"code":1},"x",null]',
    );
    remember("stations", { code: "BZA", name: "Vijayawada" });
    expect(read("recent_stations")).toEqual([
      { code: "BZA", name: "Vijayawada" },
      { code: "SC", name: "Secunderabad" },
    ]);
    localStorage.setItem("recent_routes", "not json");
    remember("routes", {
      from: { code: "VSKP", name: "Visakhapatnam" },
      to: { code: "SC", name: "Secunderabad" },
    });
    expect(read("recent_routes")).toHaveLength(1);
  });

  it("a PNR goes 2 days after its journey; one with no date, 7 days after it was checked", () => {
    const now = Date.now();
    const pnr = (date: string | null, at = now) => ({
      pnr: "4521637890",
      train: "12727",
      date,
      at,
    });
    expect(pnrStillUseful(pnr(day(10)), now)).toBe(true);
    expect(pnrStillUseful(pnr(day(0)), now)).toBe(true);
    expect(pnrStillUseful(pnr(day(-2)), now)).toBe(true);
    expect(pnrStillUseful(pnr(day(-3)), now)).toBe(false);
    expect(pnrStillUseful(pnr(null, now - 6 * DAY), now)).toBe(true);
    expect(pnrStillUseful(pnr(null, now - 8 * DAY), now)).toBe(false);

    localStorage.setItem(
      "recent_pnrs",
      JSON.stringify([
        { pnr: "1111111111", train: "12727", date: day(-5), at: now - 6 * DAY },
        { pnr: "2222222222", train: "12723", date: day(1), at: now },
      ]),
    );
    remember("pnrs", { pnr: "3333333333", train: "", date: null, at: now });
    expect((read("recent_pnrs") as { pnr: string }[]).map((p) => p.pnr)).toEqual([
      "3333333333",
      "2222222222",
    ]);
  });

  it("✕ drops one, Clear drops them all", () => {
    remember("stations", { code: "SC", name: "Secunderabad" });
    remember("stations", { code: "BZA", name: "Vijayawada" });
    forget("stations", { code: "SC", name: "Secunderabad" });
    expect(read("recent_stations")).toEqual([{ code: "BZA", name: "Vijayawada" }]);
    forgetAll("stations");
    expect(localStorage.getItem("recent_stations")).toBeNull();
  });

  it("every box on the page follows a change", () => {
    const a = renderHook(() => useRecent("trains"));
    const b = renderHook(() => useRecent("trains"));
    const other = renderHook(() => useRecent("stations"));
    expect(a.result.current.list).toEqual([]);
    act(() => remember("trains", { number: "12727", name: "Godavari Express" }));
    expect(a.result.current.list).toEqual([{ number: "12727", name: "Godavari Express" }]);
    expect(b.result.current.list).toHaveLength(1);
    expect(other.result.current.list).toEqual([]);
    act(() => a.result.current.clear());
    expect(b.result.current.list).toEqual([]);
  });

  it("storage refused: nothing remembered, nothing breaks", () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    try {
      expect(() => remember("trains", { number: "12727", name: "Godavari Express" })).not.toThrow();
    } finally {
      Storage.prototype.setItem = original;
    }
    expect(localStorage.getItem("recent_trains")).toBeNull();
  });
});
