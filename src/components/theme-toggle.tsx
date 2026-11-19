import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

// Light or dark. Until the visitor picks one with the toggle (remembered on
// this browser, "theme" in localStorage), the page follows the owner's rule
// (19 November 2026):
//   - a device set to dark mode: dark, all day;
//   - a device in light mode: by its clock, dark from 6 pm to 6 am and light
//     from 6 am to 6 pm (the app's Auto theme, AutoTheme in ThemeManager.kt).
// THEME_SCRIPT runs in <head> before the page paints, so there is no flash.
// ThemeToggle keeps it right while the page stays open: dark mode switched on
// or off, 6 am or 6 pm passing, the tab coming back after a while.

const KEY = "theme";
export const DARK_FROM_HOUR = 18;
export const LIGHT_FROM_HOUR = 6;
// The browser bar's colour for each theme (the page's background).
export const BAR_LIGHT = "#f4f7fb";
export const BAR_DARK = "#051532";

/** The theme when the visitor has not picked one: the rule above. */
export function autoDark(deviceDark: boolean, hour: number): boolean {
  return deviceDark || hour >= DARK_FROM_HOUR || hour < LIGHT_FROM_HOUR;
}

// The same rule, as a script for <head>. It also adds the page's only
// <meta name="theme-color"> (the browser bar's colour): one in the server's
// HTML, once changed here, was added again by React beside it.
export const THEME_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem("${KEY}");}catch(e){}try{var h=new Date().getHours();var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches||h>=${DARK_FROM_HOUR}||h<${LIGHT_FROM_HOUR};var c=document.documentElement.classList;c.remove("light","dark");c.add(d?"dark":"light");var m=document.createElement("meta");m.name="theme-color";m.content=d?"${BAR_DARK}":"${BAR_LIGHT}";document.head.appendChild(m);}catch(e){}})();`;

/** Milliseconds from now until the clock next reaches 6 am or 6 pm. */
export function msToNextSwitch(now: Date): number {
  const h = now.getHours();
  const next = new Date(now);
  next.setHours(
    h >= DARK_FROM_HOUR
      ? 24 + LIGHT_FROM_HOUR
      : h >= LIGHT_FROM_HOUR
        ? DARK_FROM_HOUR
        : LIGHT_FROM_HOUR,
    0,
    0,
    0,
  );
  return next.getTime() - now.getTime();
}

// Picked on this page, for when the browser keeps nothing (private browsing).
let picked: boolean | null = null;

function storedChoice(): boolean | null {
  if (picked !== null) return picked;
  try {
    const t = localStorage.getItem(KEY);
    return t ? t === "dark" : null;
  } catch {
    return null;
  }
}

function apply(dark: boolean) {
  const c = document.documentElement.classList;
  c.remove("light", "dark");
  c.add(dark ? "dark" : "light");
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", dark ? BAR_DARK : BAR_LIGHT));
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const follow = () => {
      apply(storedChoice() ?? autoDark(mq.matches, new Date().getHours()));
      clearTimeout(timer);
      // A second after 6 am or 6 pm, so the hour has turned.
      timer = setTimeout(follow, msToNextSwitch(new Date()) + 1000);
    };
    // A phone asleep holds timers back: look again when the tab is back.
    const onVisible = () => {
      if (document.visibilityState === "visible") follow();
    };
    follow();
    mq.addEventListener("change", follow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", follow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    picked = dark;
    apply(dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // Private browsing: the choice lasts for this page only.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Light or dark theme"
      className={
        "grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition hover:border-primary hover:text-foreground " +
        className
      }
    >
      {/* Shows the theme it switches to. */}
      <Sun aria-hidden className="hidden size-[18px] dark:block" />
      <Moon aria-hidden className="size-[18px] dark:hidden" />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only light:hidden">Switch to light theme</span>
    </button>
  );
}
