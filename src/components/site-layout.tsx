import { Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/railbuzz-logo.webp";
import logoLight from "@/assets/railbuzz-logo-light.webp";
import { playLink } from "@/lib/legal-page";
import { ThemeToggle } from "@/components/theme-toggle";

/** "Get it on Google Play"; [medium] names the button in Play Console's install reports. */
export function PlayButton({ medium, className = "" }: { medium: string; className?: string }) {
  return (
    <a
      href={playLink(medium)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 " +
        className
      }
    >
      <Smartphone className="size-5" /> Get it on Google Play
    </a>
  );
}

/** The header's links: what RailBuzz is for, not its policies (those are in the footer). */
const menu = [
  { to: "/trains/", label: "Search Trains" },
  { to: "/train-chat/", label: "Train Chat" },
  { to: "/about/", label: "About" },
] as const;

const policies = [
  { to: "/terms/", label: "Terms of Service" },
  { to: "/privacy/", label: "Privacy Policy" },
  { to: "/community-guidelines/", label: "Community Guidelines" },
  { to: "/grievance/", label: "Grievance Redressal" },
  { to: "/delete-account/", label: "Delete your account" },
] as const;

/**
 * RailBuzz, linking home. On the home page itself it takes the visitor back to
 * the top instead (the owner, 15 November 2026).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="RailBuzz home"
      onClick={(e) => {
        if (window.location.pathname !== "/") return;
        e.preventDefault();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
        if (window.location.hash) window.history.replaceState(window.history.state, "", "/");
      }}
      className={"flex shrink-0 items-center gap-2 font-display text-lg font-bold min-[400px]:gap-2.5 min-[400px]:text-xl " + className}
    >
      {/* The app's own emblem, the train in a speech bubble: the neon one (ic_logo_emblem)
          in dark, the app's light one (ic_logo_emblem_light) in light (the owner's pick, 15 November 2026). */}
      <img src={logo} alt="" width={40} height={40} className="size-9 min-[400px]:size-10 light:hidden" />
      <img src={logoLight} alt="" width={40} height={40} className="hidden size-9 min-[400px]:size-10 light:block" />
      <span>
        Rail<span className="text-primary">Buzz</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 min-[400px]:px-5 md:gap-6">
        <Logo />
        {/* The links on the right, beside the theme switch and Get the app (the owner, 16 November 2026). */}
        <nav aria-label="Main" className="hidden flex-1 items-center justify-end gap-7 pr-1 text-sm font-medium text-muted-foreground md:flex lg:gap-8">
          {menu.slice(0, 2).map((n) => (
            <Link key={n.to} to={n.to} className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
          <a href="/#features" className="transition hover:text-foreground">Features</a>
          {menu.slice(2).map((n) => (
            <Link key={n.to} to={n.to} className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 min-[400px]:gap-2.5">
          <ThemeToggle />
          {/* Small phones: "Get app" without the icon, so the row fits at 320 px. */}
          <a
            href={playLink("header")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold whitespace-nowrap text-primary-foreground shadow-glow transition hover:brightness-110 min-[400px]:px-4"
          >
            <Smartphone aria-hidden className="hidden size-4 min-[360px]:block" />
            <span className="min-[400px]:hidden">Get app</span>
            <span className="hidden min-[400px]:inline">Get the app</span>
          </a>
        </div>
      </div>
      {/* Phones: the same links, in one short row under the logo. */}
      <nav aria-label="Main" className="flex justify-center gap-2 border-t border-border/40 px-4 text-sm font-medium text-muted-foreground md:hidden">
        {menu.map((n) => (
          <Link key={n.to} to={n.to} className="px-2.5 py-2.5 hover:text-foreground" activeProps={{ className: "text-primary" }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 text-sm text-muted-foreground lg:grid-cols-[1.4fr_1fr_1fr_1fr] [&_li>a]:inline-block [&_li>a]:py-1">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Logo />
          <p className="max-w-xs">Live train status, alerts until your stop, and a chat room for every train on Indian Railways.</p>
          <a
            href={playLink("footer")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 font-semibold text-foreground transition hover:border-primary"
          >
            <Smartphone aria-hidden className="size-4" /> Get it on Google Play
          </a>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-foreground">Search</h3>
          <ul className="space-y-1.5">
            <li><Link to="/trains/" className="hover:text-primary">Search trains</Link></li>
            <li><Link to="/trains-between-stations/" className="hover:text-primary">Trains between stations</Link></li>
            <li><Link to="/station-departures/" className="hover:text-primary">Live station departures</Link></li>
            <li><Link to="/pnr-status/" className="hover:text-primary">PNR status</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-foreground">RailBuzz</h3>
          <ul className="space-y-1.5">
            <li><Link to="/train-chat/" className="hover:text-primary">Train chat</Link></li>
            <li><Link to="/guides/" className="hover:text-primary">Guides</Link></li>
            <li><Link to="/punctuality/" className="hover:text-primary">Train punctuality</Link></li>
            <li><a href="/#features" className="hover:text-primary">Features</a></li>
            <li><a href="/#faq" className="hover:text-primary">Questions</a></li>
            <li><Link to="/about/" className="hover:text-primary">About RailBuzz</Link></li>
            <li><a href="mailto:support@railbuzz.in" className="hover:text-primary">support@railbuzz.in</a></li>
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h3 className="mb-4 font-semibold text-foreground">Policies</h3>
          <ul className="space-y-1.5">
            {policies.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} RailBuzz · Made in India · Grievance Officer: Kiran Kumar, <a className="hover:text-primary" href="mailto:grievance@railbuzz.in">grievance@railbuzz.in</a></p>
          <p>An independent app, not affiliated with Indian Railways or IRCTC.</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * A policy page. `glance` is an optional visual summary, shown just below the
 * "Last updated" line (each page's first paragraph) and above the text itself.
 */
export function LegalPage({ title, html, glance }: { title: string; html: string; glance?: ReactNode }) {
  const end = html.indexOf("</p>") + "</p>".length;
  const split = Boolean(glance) && html.trimStart().startsWith('<p class="updated">') && end > 4;
  return (
    <main className="mx-auto max-w-3xl px-5 pt-14">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← RailBuzz</Link>
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">{title}</h1>
      {/* Static, trusted policy text bundled with the site. */}
      {split ? (
        <>
          <div className="legal mt-4" dangerouslySetInnerHTML={{ __html: html.slice(0, end) }} />
          <div className="mt-6">{glance}</div>
          <article className="legal" dangerouslySetInnerHTML={{ __html: html.slice(end) }} />
        </>
      ) : (
        <>
          <article className="legal mt-4" dangerouslySetInnerHTML={{ __html: html }} />
          {glance && <div className="mt-10">{glance}</div>}
        </>
      )}
    </main>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
