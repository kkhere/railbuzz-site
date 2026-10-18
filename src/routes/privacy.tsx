import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/privacy.html?raw";
import { LegalPage } from "@/components/site-layout";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("RailBuzz Privacy Policy", "What RailBuzz collects, why, how long each item is kept, who it is shared with, and your choices.", "/privacy"),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <LegalPage title="Privacy Policy" html={html} />;
}
