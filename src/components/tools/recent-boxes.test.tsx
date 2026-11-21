import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Links need a router; a plain <a> is enough to see where a chip goes.
vi.mock("@tanstack/react-router", async (orig) => ({
  ...(await orig<typeof import("@tanstack/react-router")>()),
  Link: ({
    children,
    className,
    to,
    params,
    search,
    hash,
  }: {
    children: ReactNode;
    className?: string;
    to: string;
    params?: { number?: string };
    search?: { n?: string };
    hash?: string;
  }) => (
    <a
      className={className}
      href={
        to.replace("$number", params?.number ?? "") +
        (search?.n ? `?n=${search.n}` : "") +
        (hash ? `#${hash}` : "")
      }
    >
      {children}
    </a>
  ),
}));

const lookup = vi.fn();
vi.mock("@/lib/rail-api", async (orig) => ({
  ...(await orig<typeof import("@/lib/rail-api")>()),
  lookup: (...args: unknown[]) => lookup(...args),
  loadStations: () => Promise.resolve({ SC: "Secunderabad", BZA: "Vijayawada" }),
}));

const { PnrTool } = await import("@/components/tools/pnr-tool");
const { StationTool } = await import("@/components/tools/station-tool");
const { TrainSearch } = await import("@/components/train-search");
const { remember } = await import("@/lib/recent");

const tomorrow = (() => {
  const d = new Date(Date.now() + 24 * 3600_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();

const answer = (pnr: string) => ({
  result: {
    pnr,
    train: { number: "12727", name: "Godavari Express" },
    from: { code: "VSKP", name: "Visakhapatnam" },
    to: { code: "SC", name: "Secunderabad" },
    date: tomorrow,
    travelClass: "SL",
    quota: "GN",
    chartPrepared: false,
    trainCancelled: false,
    passengers: [],
  },
});

// Braces: a function returned from beforeEach is run as a clean-up.
beforeEach(() => {
  lookup.mockReset();
});
afterEach(() => localStorage.clear());

describe("Recent row above the boxes", () => {
  it("PNR: shows nothing at first; an answered PNR comes back as a tap that checks it again", async () => {
    lookup.mockImplementation((req: { pnr: string }) => Promise.resolve(answer(req.pnr)));
    render(<PnrTool />);
    expect(screen.queryByRole("group", { name: "Recent PNRs" })).toBeNull();

    fireEvent.change(screen.getByLabelText("PNR number"), { target: { value: "4521637890" } });
    fireEvent.click(screen.getByRole("button", { name: /Check PNR status/ }));
    const row = await screen.findByRole("group", { name: "Recent PNRs" });
    const chip = within(row).getByRole("button", { name: /Search again: 4521637890 · 12727 ·/ });
    expect(lookup).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByLabelText("PNR number"), { target: { value: "" } });
    fireEvent.click(chip);
    await waitFor(() => expect(lookup).toHaveBeenCalledTimes(2));
    expect(lookup.mock.calls[1]?.[0]).toEqual({ kind: "pnr", pnr: "4521637890" });
    expect(screen.getByLabelText("PNR number")).toHaveValue("4521637890");

    fireEvent.click(within(row).getByRole("button", { name: /Remove PNR 4521637890/ }));
    await waitFor(() => expect(screen.queryByRole("group", { name: "Recent PNRs" })).toBeNull());
  });

  it("PNR: one that found no booking is not kept", async () => {
    lookup.mockResolvedValue({ error: "not_found" });
    render(<PnrTool />);
    fireEvent.change(screen.getByLabelText("PNR number"), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByRole("button", { name: /Check PNR status/ }));
    await screen.findByText(/No booking was found/);
    expect(screen.queryByRole("group", { name: "Recent PNRs" })).toBeNull();
    expect(localStorage.getItem("recent_pnrs")).toBeNull();
  });

  it("Train: the trains opened lately, each a link to its page (to its chat on Train Chat)", async () => {
    act(() => {
      remember("trains", { number: "12723", name: "Telangana Express" });
      remember("trains", { number: "12727", name: "Godavari Express" });
    });
    render(<TrainSearch id="chat-search" hash="chat" />);
    const row = await screen.findByRole("group", { name: "Recent trains" });
    const links = within(row).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      "Search again: 12727 Godavari Express",
      "Search again: 12723 Telangana Express",
    ]);
    expect(links[0]?.getAttribute("href")).toMatch(/12727.*#chat$/);
    fireEvent.click(within(row).getByRole("button", { name: "Clear recent trains" }));
    await waitFor(() => expect(screen.queryByRole("group", { name: "Recent trains" })).toBeNull());
  });

  it("Station board: a tap shows that station's board", async () => {
    remember("stations", { code: "BZA", name: "Vijayawada" });
    lookup.mockResolvedValue({ result: { trains: [] } });
    const onSearch = vi.fn();
    render(<StationTool onSearch={onSearch} />);
    const row = await screen.findByRole("group", { name: "Recent stations" });
    fireEvent.click(within(row).getByRole("button", { name: /Search again: BZA Vijayawada/ }));
    await waitFor(() => expect(lookup).toHaveBeenCalledWith({ kind: "station", code: "BZA" }, ""));
    expect(onSearch).toHaveBeenCalledWith("BZA");
  });
});
