import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/legal-page";

// Landing page for a shared chat-room link: /room?t=<train>&d=<date>.
// Values come from a URL a stranger may have written, so they are sanitised
// and only ever rendered as text.
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
  return (
    <main className="mx-auto max-w-3xl px-5 pt-14">
      <h1 className="text-4xl font-bold md:text-5xl">{t ? `Join the chat for train ${t}` : "Join this chat room"}</h1>
      <p className="mt-3 text-muted-foreground">
        {t && d ? `Someone shared the RailBuzz chat room for train ${t} on ${d}.` : "Someone shared a RailBuzz chat room with you."}
      </p>
      <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">What this is</h2>
        <p>A chat room for the passengers on one train, on one day. Delays, platform changes, which coach is where, and whether the pantry has come round yet — from the people actually on board.</p>
        <p>Rooms close shortly after the train completes its run. Everyone is verified by mobile number and appears under a generated alias, never their real name.</p>
      </div>
      <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Opening it</h2>
        <p>Open RailBuzz, find <strong className="text-foreground">{t ? `train ${t}` : "this train"}</strong>, and tap <strong className="text-foreground">Join Chat</strong>.</p>
        <p className="opacity-75">Tapping this link will open the room directly in a future release.</p>
      </div>
    </main>
  );
}
