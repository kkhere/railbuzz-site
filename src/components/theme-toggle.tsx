import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

// Light or dark. The page starts in the visitor's device theme; tapping the
// toggle picks one and remembers it on this browser ("theme" in localStorage).
// THEME_SCRIPT runs in <head> before the page paints, so there is no flash.

const KEY = "theme";

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${KEY}");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var c=document.documentElement.classList;c.remove("light","dark");c.add(d?"dark":"light");}catch(e){}})();`;

function apply(dark: boolean) {
  const c = document.documentElement.classList;
  c.remove("light", "dark");
  c.add(dark ? "dark" : "light");
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Until the visitor picks, follow the device if it switches (e.g. at sunset).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(KEY)) apply(e.matches);
      } catch {
        apply(e.matches);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
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
