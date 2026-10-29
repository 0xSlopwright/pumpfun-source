// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(779642);
  let s = (t = Date.now()) => null !== (0, e.h)(t);
  t.s([
    "p",
    0,
    {
      has: () => s(),
      consume: () => {
        (e.Z.getState().endExplicitSignIn(), e.Z.getState().clearRefused());
      },
    },
    "$",
    0,
    () => {
      e.Z.getState().clearRefused();
    },
    "a",
    0,
    s,
    "h",
    0,
    ({ privyUserId: t }) => {
      e.Z.getState().beginExplicitSignIn(t);
    },
  ]);
};
