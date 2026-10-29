// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(745018),
    a = e.i(352386),
    s = e.i(506486),
    i = e.i(237687);
  function o() {}
  e.s([
    "f",
    0,
    function (e) {
      let l,
        c,
        u,
        d,
        f,
        m = (0, n.c)(12),
        { mint: p, existingCalloutPromise: g, screen: h, onActed: b } = e,
        [y, w] = (0, a.useState)(!1);
      (m[0] !== g
        ? ((l = () => {
            if (!g) return;
            let e = !0;
            return (
              g
                .then((t) => {
                  e && t && w(!0);
                })
                .catch(o),
              () => {
                e = !1;
              }
            );
          }),
          (c = [g]),
          (m[0] = g),
          (m[1] = l),
          (m[2] = c))
        : ((l = m[1]), (c = m[2])),
        (0, a.useEffect)(l, c),
        m[3] !== y || m[4] !== p || m[5] !== b || m[6] !== h
          ? ((u = (e) => {
              (e.stopPropagation(),
                y
                  ? (0, i.R)({ mint: p, entryPoint: "trade_success_toast" })
                  : (0, i._)({ mint: p }, h ? { screen: h } : void 0),
                b?.());
            }),
            (m[3] = y),
            (m[4] = p),
            (m[5] = b),
            (m[6] = h),
            (m[7] = u))
          : (u = m[7]));
      let _ = u;
      m[8] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = (0, t.jsx)(r.EX, { size: 12 })), (m[8] = d))
        : (d = m[8]);
      let v = y ? "Update callout" : "Create callout";
      return (
        m[9] !== _ || m[10] !== v
          ? ((f = (0, t.jsxs)("button", {
              type: "button",
              onClick: _,
              "data-testid": "trade-callout-toast-action",
              className: s.u,
              children: [d, v],
            })),
            (m[9] = _),
            (m[10] = v),
            (m[11] = f))
          : (f = m[11]),
        f
      );
    },
  ]);
};
