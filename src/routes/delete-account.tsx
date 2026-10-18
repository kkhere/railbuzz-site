import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/delete-account.html?raw";
import { LegalPage } from "@/components/site-layout";
import { pageHead } from "@/lib/legal-page";

export const Route = createFileRoute("/delete-account")({
  head: () => pageHead("Delete your RailBuzz account", "How to delete your RailBuzz account from the app or by email, what is deleted, what is kept and why.", "/delete-account"),
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  return <LegalPage title="Deleting your RailBuzz account" html={html} />;
}
