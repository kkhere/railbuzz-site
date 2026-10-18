// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// railbuzz.in is served by GitHub Pages, which serves files and runs no server.
// So there is no server build: every page is rendered to HTML at build time
// (dist/client/<page>/index.html), the shape Pages serves at /<page>/.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoSubfolderIndex: true,
      failOnError: true,
    },
    // Not linked from any page, so the crawler would miss them. 404.html is
    // what GitHub Pages serves for an address it has no file for.
    pages: [
      { path: "/room/" },
      { path: "/sitemap.xml" },
      { path: "/not-found/", prerender: { outputPath: "/404.html" } },
    ],
  },
});
