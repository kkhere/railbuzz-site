import { MapPin } from "lucide-react";
import { type ReactNode, useEffect, useId, useMemo, useState } from "react";
import { loadStations } from "@/lib/rail-api";

// A station, chosen by its code or name from every station in the app's
// catalogue (public/data/stations.json, ~65 KB over the wire, fetched the
// first time a picker is used). A combobox: type, then arrow keys and Enter,
// or tap a suggestion.

export type Station = { code: string; name: string };

const MAX = 8;

function suggest(all: Record<string, string>, raw: string): Station[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const upper = q.toUpperCase();
  const scored: { s: Station; score: number }[] = [];
  for (const [code, name] of Object.entries(all)) {
    const n = name.toLowerCase();
    let score: number;
    if (code === upper) score = 0;
    else if (n.startsWith(q)) score = 1;
    else if (code.startsWith(upper)) score = 2;
    else if (n.split(/[\s.-]+/).some((w) => w.startsWith(q))) score = 3;
    else if (n.includes(q)) score = 4;
    else continue;
    scored.push({ s: { code, name }, score });
  }
  scored.sort((a, b) => a.score - b.score || a.s.name.length - b.s.name.length || a.s.name.localeCompare(b.s.name));
  return scored.slice(0, MAX).map((x) => x.s);
}

export function StationPicker({
  id,
  label,
  value,
  onChange,
  placeholder = "Station name or code, e.g. Vijayawada or BZA",
  aside,
}: {
  id: string;
  label: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  placeholder?: string;
  /** Shown at the right end of the label's line (Between stations' "Nearby stations" box). */
  aside?: ReactNode;
}) {
  const [all, setAll] = useState<Record<string, string> | null>(null);
  const [text, setText] = useState(value ? `${value.name} (${value.code})` : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  // A station set from outside (a shared link, the swap button) shows as chosen.
  useEffect(() => {
    setText(value ? `${value.name} (${value.code})` : "");
  }, [value?.code]); // eslint-disable-line react-hooks/exhaustive-deps

  const warm = () => {
    if (!all) loadStations().then(setAll).catch(() => undefined);
  };
  const options = useMemo(() => (all && open ? suggest(all, text) : []), [all, open, text]);

  const choose = (s: Station) => {
    onChange(s);
    setText(`${s.name} (${s.code})`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="mb-2 flex min-h-6 items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <MapPin aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={options.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={options.length ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          placeholder={placeholder}
          value={text}
          onFocus={(e) => {
            warm();
            e.currentTarget.select();
          }}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(0);
            if (value) onChange(null);
            warm();
          }}
          onKeyDown={(e) => {
            if (!options.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % options.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a - 1 + options.length) % options.length);
            } else if (e.key === "Enter") {
              const s = options[active];
              if (s) {
                e.preventDefault();
                choose(s);
              }
            } else if (e.key === "Escape") setOpen(false);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </div>
      {options.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/15 dark:shadow-black/40">
          {options.map((s, i) => (
            <li
              key={s.code}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={"flex cursor-pointer items-center justify-between gap-3 px-4 py-3 " + (i === active ? "bg-primary/10" : "")}
            >
              <span className="truncate">{s.name}</span>
              <span className="shrink-0 font-mono text-xs font-semibold text-primary">{s.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
