import { Smartphone } from "lucide-react";
import type { MouseEvent } from "react";
import { playLink } from "@/lib/legal-page";

// "Open in RailBuzz" for one train or station (the owner, 18 November 2026:
// prominent buttons on train and station pages; the site brings passengers
// to the app). On Android it hands railbuzz.in/open/?train=… to RailBuzz,
// which opens on that train's running status or that station's board
// (build 15 on; an older build, or no app, goes to Google Play instead).
// Elsewhere, and without JavaScript, it is the Play link. Either way the
// Play link carries the page and the train or station (utm_medium,
// utm_content), so an install can be traced to the page that brought it.

export type AppTarget =
  { train: string; station?: undefined } | { station: string; train?: undefined };

function openPath(target: AppTarget): string {
  return target.train ? `open/?train=${target.train}` : `open/?station=${target.station}`;
}

/** The intent that opens RailBuzz on [target], with Google Play ([fallback]) when it cannot. */
export function appIntent(target: AppTarget, fallback: string): string {
  return (
    `intent://railbuzz.in/${openPath(target)}#Intent;scheme=https;package=com.railbuzz.app;` +
    `S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  );
}

export function OpenInApp({
  medium,
  label = "Open in RailBuzz",
  className = "",
  ...target
}: AppTarget & { medium: string; label?: string; className?: string }) {
  const play = playLink(medium, target.train ?? target.station);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!/Android/i.test(navigator.userAgent)) return;
    e.preventDefault();
    window.location.href = appIntent(target as AppTarget, play);
  };
  return (
    <a
      href={play}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-primary px-6 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 " +
        className
      }
    >
      <Smartphone aria-hidden className="size-5" /> {label}
    </a>
  );
}
