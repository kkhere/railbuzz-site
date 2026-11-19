import { describe, expect, it } from "vitest";
import {
  autoDark,
  BAR_DARK,
  BAR_LIGHT,
  msToNextSwitch,
  THEME_SCRIPT,
} from "@/components/theme-toggle";

// The rule (the owner, 19 November 2026): a phone in dark mode is dark all
// day; a phone in light mode is dark from 6 pm to 6 am; a pick wins.
const expected = (deviceDark: boolean, hour: number) => deviceDark || hour >= 18 || hour < 6;

/** Runs the <head> script with a stand-in browser; returns the class it set and the bar colours. */
function runScript(opts: { stored: string | null | "throws"; deviceDark: boolean; hour: number }) {
  const classes = new Set<string>(["light"]);
  const metas: { name?: string; content?: string }[] = [];
  const localStorage = {
    getItem: () => {
      if (opts.stored === "throws") throw new Error("blocked");
      return opts.stored;
    },
  };
  const window = { matchMedia: () => ({ matches: opts.deviceDark }) };
  const document = {
    documentElement: {
      classList: {
        remove: (...c: string[]) => c.forEach((x) => classes.delete(x)),
        add: (c: string) => classes.add(c),
      },
    },
    createElement: () => ({}),
    head: { appendChild: (m: { name?: string; content?: string }) => metas.push(m) },
  };
  const FakeDate = function () {
    return { getHours: () => opts.hour };
  };
  new Function("localStorage", "window", "document", "Date", THEME_SCRIPT)(
    localStorage,
    window,
    document,
    FakeDate,
  );
  return { classes: [...classes], bars: metas.map((m) => `${m.name} ${m.content}`) };
}

describe("theme by phone setting and time", () => {
  it("follows the rule at every hour", () => {
    for (let hour = 0; hour < 24; hour++) {
      for (const deviceDark of [true, false]) {
        expect(autoDark(deviceDark, hour), `${hour}h, phone dark ${deviceDark}`).toBe(
          expected(deviceDark, hour),
        );
      }
    }
    expect(autoDark(false, 5)).toBe(true);
    expect(autoDark(false, 6)).toBe(false);
    expect(autoDark(false, 17)).toBe(false);
    expect(autoDark(false, 18)).toBe(true);
    expect(autoDark(true, 12)).toBe(true);
  });

  it("the head script sets the same theme before the page paints", () => {
    for (let hour = 0; hour < 24; hour++) {
      for (const deviceDark of [true, false]) {
        const want = expected(deviceDark, hour) ? "dark" : "light";
        const run = runScript({ stored: null, deviceDark, hour });
        expect(run.classes, `${hour}h, phone dark ${deviceDark}`).toEqual([want]);
        expect(run.bars).toEqual([`theme-color ${want === "dark" ? BAR_DARK : BAR_LIGHT}`]);
        // Storage blocked: still the rule, not the CSS default.
        expect(runScript({ stored: "throws", deviceDark, hour }).classes).toEqual([want]);
      }
    }
  });

  it("a theme picked with the toggle wins, at any hour and phone setting", () => {
    for (const hour of [3, 12, 20]) {
      for (const deviceDark of [true, false]) {
        expect(runScript({ stored: "light", deviceDark, hour }).classes).toEqual(["light"]);
        expect(runScript({ stored: "dark", deviceDark, hour }).classes).toEqual(["dark"]);
      }
    }
  });

  it("the open page looks again at 6 am and 6 pm", () => {
    const at = (h: number, m = 0) => new Date(2026, 10, 19, h, m, 0, 0);
    const min = 60_000;
    expect(msToNextSwitch(at(17, 30))).toBe(30 * min);
    expect(msToNextSwitch(at(18, 0))).toBe(12 * 60 * min);
    expect(msToNextSwitch(at(23, 0))).toBe(7 * 60 * min);
    expect(msToNextSwitch(at(0, 15))).toBe((5 * 60 + 45) * min);
    expect(msToNextSwitch(at(5, 59))).toBe(1 * min);
    expect(msToNextSwitch(at(6, 0))).toBe(12 * 60 * min);
    expect(msToNextSwitch(at(12, 0))).toBe(6 * 60 * min);
  });
});
