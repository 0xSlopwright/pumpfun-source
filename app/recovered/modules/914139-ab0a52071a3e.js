// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(745018),
    s = e.i(352386),
    i = e.i(506486),
    a = e.i(237687);
  function o() {}
  e.s([
    "f",
    0,
    function (e) {
      let l,
        u,
        c,
        d,
        f,
        m = (0, n.c)(12),
        { mint: h, existingCalloutPromise: g, screen: p, onActed: _ } = e,
        [b, y] = (0, s.useState)(!1);
      (m[0] !== g
        ? ((l = () => {
            if (!g) return;
            let e = !0;
            return (
              g
                .then((t) => {
                  e && t && y(!0);
                })
                .catch(o),
              () => {
                e = !1;
              }
            );
          }),
          (u = [g]),
          (m[0] = g),
          (m[1] = l),
          (m[2] = u))
        : ((l = m[1]), (u = m[2])),
        (0, s.useEffect)(l, u),
        m[3] !== b || m[4] !== h || m[5] !== _ || m[6] !== p
          ? ((c = (e) => {
              (e.stopPropagation(),
                b
                  ? (0, a.R)({ mint: h, entryPoint: "trade_success_toast" })
                  : (0, a._)({ mint: h }, p ? { screen: p } : void 0),
                _?.());
            }),
            (m[3] = b),
            (m[4] = h),
            (m[5] = _),
            (m[6] = p),
            (m[7] = c))
          : (c = m[7]));
      let v = c;
      m[8] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = (0, t.jsx)(r.EX, { size: 12 })), (m[8] = d))
        : (d = m[8]);
      let w = b ? "Update callout" : "Create callout";
      return (
        m[9] !== v || m[10] !== w
          ? ((f = (0, t.jsxs)("button", {
              type: "button",
              onClick: v,
              "data-testid": "trade-callout-toast-action",
              className: i.u,
              children: [d, w],
            })),
            (m[9] = v),
            (m[10] = w),
            (m[11] = f))
          : (f = m[11]),
        f
      );
    },
  ]);
};
