import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/community-guidelines.html?raw";
import { LegalPage } from "@/components/site-layout";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/community-guidelines")({
  head: () => pageHead("RailBuzz Community Guidelines", "The seven rules for RailBuzz train chat rooms, what happens when one is broken, and how to appeal.", "/community-guidelines"),
  component: CommunityGuidelinesPage,
});

function CommunityGuidelinesPage() {
  return <LegalPage title="Community Guidelines" html={html} />;
}
