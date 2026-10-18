import { QueryClient } from "@tanstack/react-query";
import { createRouter, parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // GitHub Pages serves each page as a folder (/privacy/), which is how the app
    // links to it; links between pages stay /privacy and Pages redirects them.
    trailingSlash: "preserve",
    defaultPreloadStaleTime: 0,
    // Plain query values, as the app writes them: /room/?t=12728 must stay that,
    // not be rewritten to ?t=%2212728%22 the way the default JSON encoding does.
    parseSearch: parseSearchWith((value) => value),
    stringifySearch: stringifySearchWith(JSON.stringify),
  });

  return router;
};
