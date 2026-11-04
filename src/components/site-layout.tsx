import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/railbuzz-logo.webp";

const nav = [
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/community-guidelines", label: "Guidelines" },
  { to: "/grievance", label: "Grievance" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
      {/* The app's own emblem: the train in a speech bubble (ic_logo_emblem). */}
      <img src={logo} alt="" width={40} height={40} className="size-10" />
      <span>
        Rail<span className="text-primary">Buzz</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-foreground" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/delete-account" className="text-sm text-muted-foreground hover:text-foreground">
          Delete account
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-muted-foreground md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p>Live train information and chat with fellow passengers on Indian Railways.</p>
          <p>RailBuzz · India · On · Track</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Policies</h3>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label === "Guidelines" ? "Community Guidelines" : n.label}</Link></li>
            ))}
            <li><Link to="/delete-account" className="hover:text-primary">Delete your account</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="mb-3 font-semibold text-foreground">Contact</h3>
          <p>Grievance Officer: Kiran Kumar</p>
          <p><a className="text-primary" href="mailto:grievance@railbuzz.in">grievance@railbuzz.in</a></p>
          <p><a className="text-primary" href="mailto:support@railbuzz.in">support@railbuzz.in</a></p>
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
