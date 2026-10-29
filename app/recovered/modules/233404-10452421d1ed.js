// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    n = e.i(30775),
    r = e.i(306780);
  let i = { flagEnabled: !1, shouldUsePrivy: !1, isPrivyEmbeddedSigner: !1 },
    a = "true" === t.default.env.NEXT_PUBLIC_FORCE_CLIENT_SUPPORTS_V1,
    o = () =>
      a ||
      (i.flagEnabled &&
        (i.shouldUsePrivy
          ? i.isPrivyEmbeddedSigner
          : (0, r.u)((0, n.Z)().wallet?.adapter)));
  e.s([
    "b",
    0,
    o,
    "W",
    0,
    (e) => {
      i = e;
    },
    "Y",
    0,
    (e) => ({ ...e, client_supports_v1: o() }),
  ]);
};
