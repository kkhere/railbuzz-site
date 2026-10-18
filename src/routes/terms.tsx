import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/terms.html?raw";
import { LegalPage } from "@/components/site-layout";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("RailBuzz Terms of Service", "The user agreement for the RailBuzz app and railbuzz.in: who can use it, what you must not post, and how moderation works.", "/terms"),
  component: TermsPage,
});

function TermsPage() {
  return <LegalPage title="Terms of Service" html={html} />;
}
