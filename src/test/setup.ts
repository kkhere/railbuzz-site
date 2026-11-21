import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Node 25 and later have a localStorage of their own, undefined unless Node is
// started with --localstorage-file, and it hides jsdom's: give the tests jsdom's.
{
  const g = globalThis as typeof globalThis & { jsdom?: { window: Window } };
  if (typeof g.localStorage?.getItem !== "function" && g.jsdom) {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: g.jsdom.window.localStorage,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: g.jsdom.window.sessionStorage,
    });
  }
}
