import { QueryClient } from "@tanstack/react-query";
import { createRouter, parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // A new page opens at its top at once. The site's smooth scrolling
    // (styles.css) is for jumps within a page; from the foot of a long page it
    // would otherwise slide all the way up through the next one.
    scrollRestorationBehavior: "instant",
    // GitHub Pages serves each page as a folder (/privacy/), which is how the app
    // links to it. Links between pages say /privacy/ too, so a visitor or a
    // search engine following one is not redirected first.
    trailingSlash: "always",
    defaultPreloadStaleTime: 0,
    // Plain query values, as the app writes them: /room/?t=12728 must stay that,
    // not be rewritten to ?t=%2212728%22 the way the default JSON encoding does.
    parseSearch: parseSearchWith((value) => value),
    stringifySearch: stringifySearchWith(JSON.stringify),
  });

  return router;
};
