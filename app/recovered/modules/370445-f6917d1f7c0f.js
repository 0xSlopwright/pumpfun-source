// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = new Uint8Array(16);
  e.s([
    "f",
    0,
    function () {
      return crypto.getRandomValues(t);
    },
  ]);
};
