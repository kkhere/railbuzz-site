import { createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "@/components/not-found";

// Rendered once at build time into 404.html, which GitHub Pages serves for
// any address it has no file for. The router then shows the same screen.
export const Route = createFileRoute("/not-found")({
  head: () => ({
    meta: [{ title: "Page not found · RailBuzz" }, { name: "robots", content: "noindex" }],
  }),
  component: NotFoundComponent,
});
