// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(779642);
  let a = (e = Date.now()) => null !== (0, t.h)(e);
  e.s([
    "p",
    0,
    {
      has: () => a(),
      consume: () => {
        (t.Z.getState().endExplicitSignIn(), t.Z.getState().clearRefused());
      },
    },
    "$",
    0,
    () => {
      t.Z.getState().clearRefused();
    },
    "a",
    0,
    a,
    "h",
    0,
    ({ privyUserId: e }) => {
      t.Z.getState().beginExplicitSignIn(e);
    },
  ]);
};
