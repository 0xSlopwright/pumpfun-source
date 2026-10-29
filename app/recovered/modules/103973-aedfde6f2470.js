// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.s([
    "f",
    0,
    (t) =>
      t.shouldUsePrivy &&
      void 0 !== t.address &&
      t.decodedJwt?.address === t.address,
  ]);
};
