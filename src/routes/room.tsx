import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/legal-page";

const PLAY = "https://play.google.com/store/apps/details?id=com.railbuzz.app";

// The same link as an Android intent for RailBuzz itself: the app opens on the
// room when it is installed, whether or not Android has verified railbuzz.in
// for it, and Google Play opens when it is not.
function appIntent(t?: string, d?: string): string {
  const q = new URLSearchParams();
  if (t) q.set("t", t);
  if (d) q.set("d", d);
  const query = q.toString();
  return `intent://railbuzz.in/room/${query ? `?${query}` : ""}#Intent;scheme=https;package=com.railbuzz.app;` +
    `S.browser_fallback_url=${encodeURIComponent(PLAY)};end`;
}

// Landing page for a shared chat-room link: /room?t=<train>&d=<date>.
// Values come from a URL a stranger may have written, so they are sanitised
// and only ever rendered as text.
//
// RailBuzz opens these links itself from 1.0 (12). The page is what shows when
// it cannot: the app not installed, an older version, or the link opened in
// another app's own browser. On Android it then hands the link to RailBuzz,
// once a visit, and offers the button besides (the owner, 29 October 2026:
// shared links "navigated to the Railbuzz.in website instead of the app").
export const Route = createFileRoute("/room")({
  validateSearch: (s: Record<string, unknown>) => ({
    t: String(s["t"] ?? "").replace(/[^0-9A-Za-z-]/g, "").slice(0, 12) || undefined,
    d: String(s["d"] ?? "").replace(/[^0-9-]/g, "").slice(0, 10) || undefined,
  }),
  head: () => pageHead("Join a RailBuzz chat room", "Someone shared a RailBuzz chat room with you.", "/room", true),
  component: RoomPage,
});

function RoomPage() {
  const { t, d } = Route.useSearch();
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    setAndroid(isAndroid);
    if (!isAndroid || !t) return;
    // Once a visit: Back from Google Play does not send them there again.
    try {
      const key = `railbuzz-room-${t}-${d ?? ""}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage refused (private browsing): the button below still works.
    }
    window.location.href = appIntent(t, d);
  }, [t, d]);

  return (
    <main className="mx-auto max-w-3xl px-5 pt-14">
      <h1 className="text-4xl font-bold md:text-5xl">{t ? `Join the chat for train ${t}` : "Join this chat room"}</h1>
      <p className="mt-3 text-muted-foreground">
        {t && d ? `Someone shared the RailBuzz chat room for train ${t} on ${d}.` : "Someone shared a RailBuzz chat room with you."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <a href={android ? appIntent(t, d) : PLAY}>Open in RailBuzz app</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={PLAY} target="_blank" rel="noopener noreferrer">Get RailBuzz on Google Play</a>
        </Button>
      </div>
      <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">What this is</h2>
        <p>A chat room for the passengers on one train, on one day. Delays, platform changes, which coach is where, and whether the pantry has come round yet — from the people actually on board.</p>
        <p>Rooms close shortly after the train completes its run. Everyone is verified by mobile number and appears under a generated alias, never their real name.</p>
      </div>
      <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Opening it</h2>
        <p>
          With RailBuzz on your Android phone, tap <strong className="text-foreground">Open in RailBuzz app</strong>.
          Without it, install it from Google Play, then open this link again.
        </p>
        <p className="opacity-75">
          Or open RailBuzz, find <strong className="text-foreground">{t ? `train ${t}` : "this train"}</strong>, and tap{" "}
          <strong className="text-foreground">Join Chat</strong>.
        </p>
      </div>
    </main>
  );
}
