import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/site-layout";
import { SITE_URL, pageUrl } from "@/lib/legal-page";

// The guides' and the punctuality page's layout: a breadcrumb, the heading,
// the text, questions and a closing card for the app. Their structured data
// (Article, BreadcrumbList, FAQPage) comes from articleData().

export type Faq = { q: string; a: string };

export function articleData(opts: { path: string; title: string; description: string; section: string; faqs: Faq[]; extra?: object[] }) {
  const url = pageUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: opts.title,
        description: opts.description,
        url,
        inLanguage: "en-IN",
        datePublished: "2026-11-16",
        dateModified: "2026-11-16",
        author: { "@type": "Organization", name: "RailBuzz", url: `${SITE_URL}/` },
        publisher: { "@type": "Organization", name: "RailBuzz", url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RailBuzz", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: opts.title, item: url },
        ],
      },
      ...(opts.faqs.length
        ? [{ "@type": "FAQPage", mainEntity: opts.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
      ...(opts.extra ?? []),
    ],
  };
}

export function Article({
  section,
  title,
  intro,
  faqs = [],
  medium,
  children,
}: {
  section: "Guides" | "Data";
  title: string;
  intro: ReactNode;
  faqs?: Faq[];
  /** The Play button's name in the site's visit counts. */
  medium: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">RailBuzz</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{section === "Guides" ? "Guide" : "Data"}</span>
      </nav>
      <header className="mt-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="size-3.5" /> {section === "Guides" ? "Guide" : "RailBuzz data"}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
        <div className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</div>
      </header>
      <div className="prose-railbuzz mt-8 space-y-5 leading-relaxed [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a:hover]:underline">
        {children}
      </div>
      {faqs.length > 0 && (
        <section id="faq" className="scroll-mt-20 pt-14">
          <h2 className="text-2xl font-bold md:text-3xl">Questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-card open:border-primary/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base">{f.q}</h3>
                  <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <section className="mt-14 flex flex-col gap-4 rounded-3xl border border-primary/50 bg-card p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <p className="text-muted-foreground">
          Follow your train live, subscribe to it for travel updates and chat with the passengers on board: all in the RailBuzz app.
        </p>
        <PlayButton medium={medium} className="shrink-0" />
      </section>
    </main>
  );
}
