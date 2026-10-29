// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "t",
    0,
    () =>
      !("u" < typeof navigator) &&
      navigator.userAgent.toLowerCase().includes("phantom"),
    "X",
    0,
    () => {
      let e = window;
      return !!(e.phantom?.solana?.isPhantom ?? e.solana?.isPhantom);
    },
  ]);
};
