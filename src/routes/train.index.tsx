import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TrainSearch } from "@/components/train-search";
import { TrainView } from "@/components/train-view";
import { pageHead } from "@/lib/legal-page";
import { errorText, lookup, type LookupError } from "@/lib/rail-api";
import { hasPage, type Train } from "@/lib/trains";
import { isCrawler } from "@/lib/crawler";

// /train/?n=17255: the timetable of any train, loaded when someone opens it
// from the site's search, Trains between stations or a station's board. The
// 180 Popular Trains have their own pages built ahead (/train/12727/) and are
// sent there. This one is not for search engines: its address depends on a
// query, and the same page with no train in it would be indexed otherwise.

export const Route = createFileRoute("/train/")({
  validateSearch: (s: Record<string, unknown>): { n?: string } => {
    const n = String(s["n"] ?? "");
    return /^\d{4,6}$/.test(n) ? { n } : {};
  },
  head: () =>
    pageHead(
      "Train timetable | RailBuzz",
      "The timetable of an Indian Railways train: halts, times, platforms and coach position.",
      "/train",
      true,
    ),
  component: AnyTrainPage,
});

function AnyTrainPage() {
  const { n } = Route.useSearch();
  const navigate = useNavigate();
  const [train, setTrain] = useState<Train | null>(null);
  const [error, setError] = useState<LookupError | null>(null);

  useEffect(() => {
    setTrain(null);
    setError(null);
    if (!n) return;
    if (hasPage(n)) {
      void navigate({ to: "/train/$number/", params: { number: n }, replace: true });
      return;
    }
    // Not looked up for a crawler (lib/crawler.ts): this page is not for search engines.
    if (isCrawler()) return;
    let live = true;
    void lookup({ kind: "train", number: n }).then((r) => {
      if (!live) return;
      if ("result" in r) {
        setTrain(r.result);
        document.title = `${r.result.number} ${r.result.name}: Timetable & Live Status | RailBuzz`;
        // Opened on a part of the page (#chat): it exists only now, so go there now.
        const part = window.location.hash.slice(1);
        if (part) requestAnimationFrame(() => document.getElementById(part)?.scrollIntoView());
      } else setError(r.error);
    });
    return () => {
      live = false;
    };
  }, [n, navigate]);

  if (train) return <TrainView t={train} />;

  return (
    <main className="mx-auto max-w-4xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          RailBuzz
        </Link>
        <span className="mx-2">›</span>
        <Link to="/trains/" className="hover:text-primary">
          Trains
        </Link>
        {n && (
          <>
            <span className="mx-2">›</span>
            <span className="text-foreground">{n}</span>
          </>
        )}
      </nav>
      {n && !error && (
        <p
          className="mt-10 flex items-center gap-3 text-lg text-muted-foreground"
          aria-live="polite"
        >
          <Loader2 aria-hidden className="size-5 animate-spin text-primary" /> Loading the timetable
          of {n}…
        </p>
      )}
      {n && error && (
        <div
          className="mt-10 rounded-2xl border border-destructive/50 bg-destructive/10 p-5"
          role="alert"
        >
          <p className="font-semibold">Couldn&rsquo;t load train {n}.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error === "not_found"
              ? "No train with this number was found."
              : errorText(error, "train timetables")}
          </p>
        </div>
      )}
      <div className="mt-10 max-w-3xl">
        {!n && <h1 className="mb-6 text-4xl font-extrabold">Find a train</h1>}
        <TrainSearch id="train-search" />
      </div>
    </main>
  );
}
