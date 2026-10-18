import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/grievance.html?raw";
import { LegalPage } from "@/components/site-layout";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/grievance")({
  head: () => pageHead("RailBuzz Grievance Redressal", "How to complain to RailBuzz, who our Grievance Officer is, and how quickly we acknowledge and resolve complaints.", "/grievance"),
  component: GrievancePage,
});

function GrievancePage() {
  return <LegalPage title="Grievance Redressal" html={html} />;
}
