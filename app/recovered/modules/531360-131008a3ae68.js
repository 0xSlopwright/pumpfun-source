// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(322315),
    n = e.i(254010),
    i = e.i(574472),
    a = e.i(352386),
    s = e.i(781311),
    o = e.i(266300),
    l = e.i(248208);
  let c = (0, a.lazy)(() =>
      e.A(528678).then((e) => ({ default: e.PerpPayoutResumeLeaf })),
    ),
    u = () => !1;
  e.s([
    "PerpPayoutResume",
    0,
    function () {
      let e = (0, n.k)(r.D.WEB_PERPS, !1),
        d = (0, n.k)(r.D.WEB_PERPS_CLOSE_ON_FILL, !1),
        { address: m } = (0, i.F)(),
        f = (0, a.useSyncExternalStore)(
          s.E,
          () => {
            try {
              return null !== (0, s.Y)(m ?? void 0);
            } catch {
              return !1;
            }
          },
          u,
        ),
        p = (0, a.useSyncExternalStore)(o.$, o.c, u);
      return e && d && m && f && p
        ? (0, t.jsx)(l.R, {
            children: (0, t.jsx)(a.Suspense, {
              fallback: null,
              children: (0, t.jsx)(c, {}),
            }),
          })
        : null;
    },
  ]);
};
