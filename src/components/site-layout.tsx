import { Link } from "@tanstack/react-router";
import { TrainFront } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/community-guidelines", label: "Guidelines" },
  { to: "/grievance", label: "Grievance" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
      <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow" aria-hidden>
        <TrainFront className="size-5" />
      </span>
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

export function LegalPage({ title, html }: { title: string; html: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-14">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← RailBuzz</Link>
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">{title}</h1>
      {/* Static, trusted policy text bundled with the site. */}
      <article className="legal mt-4" dangerouslySetInnerHTML={{ __html: html }} />
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
