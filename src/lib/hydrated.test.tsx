import { act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { useHydrated, useQueryKey } from "@/lib/hydrated";

// A page built ahead, then opened with a query: React's first render must give
// the page it was handed (no error #418), and the query comes one render later.

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Probe() {
  const hydrated = useHydrated();
  const key = useQueryKey();
  return <p>{`${hydrated ? "query read" : "as built"} ${key}`}</p>;
}

afterEach(() => {
  history.replaceState(null, "", "/");
});

async function open(address: string) {
  history.replaceState(null, "", "/");
  const built = renderToString(<Probe />);
  const box = document.createElement("div");
  box.innerHTML = built;
  history.replaceState(null, "", address);
  const errors: unknown[] = [];
  await act(async () => {
    hydrateRoot(box, <Probe />, { onRecoverableError: (e) => errors.push(e) });
  });
  return { built: built.replace(/<[^>]+>/g, ""), now: box.textContent, errors };
}

describe("a page built ahead, opened with a query", () => {
  it("first as built, then with the query; no error", async () => {
    const r = await open("/trains/?tab=pnr");
    expect(r.built).toBe("as built page");
    expect(r.errors).toEqual([]);
    expect(r.now).toBe("query read query");
  });

  it("without a query the key never changes", async () => {
    const r = await open("/trains/");
    expect(r.errors).toEqual([]);
    expect(r.now).toBe("query read page");
  });

  it("the error this avoids: a page reading the query in React's first render", async () => {
    const Eager = () => <p>{window.location.search || "none"}</p>;
    history.replaceState(null, "", "/");
    const box = document.createElement("div");
    box.innerHTML = renderToString(<Eager />);
    history.replaceState(null, "", "/open/?train=12727");
    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(box, <Eager />, { onRecoverableError: (e) => errors.push(e) });
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("a page opened from another reads the query at once", async () => {
    history.replaceState(null, "", "/trains/?code=SC");
    const box = document.createElement("div");
    await act(async () => {
      createRoot(box).render(<Probe />);
    });
    expect(box.textContent).toBe("query read query");
  });
});
