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
        { mint: g, existingCalloutPromise: p, screen: h, onActed: b } = e,
        [_, y] = (0, a.useState)(!1);
      (m[0] !== p
        ? ((l = () => {
            if (!p) return;
            let e = !0;
            return (
              p
                .then((t) => {
                  e && t && y(!0);
                })
                .catch(o),
              () => {
                e = !1;
              }
            );
          }),
          (c = [p]),
          (m[0] = p),
          (m[1] = l),
          (m[2] = c))
        : ((l = m[1]), (c = m[2])),
        (0, a.useEffect)(l, c),
        m[3] !== _ || m[4] !== g || m[5] !== b || m[6] !== h
          ? ((u = (e) => {
              (e.stopPropagation(),
                _
                  ? (0, i.R)({ mint: g, entryPoint: "trade_success_toast" })
                  : (0, i._)({ mint: g }, h ? { screen: h } : void 0),
                b?.());
            }),
            (m[3] = _),
            (m[4] = g),
            (m[5] = b),
            (m[6] = h),
            (m[7] = u))
          : (u = m[7]));
      let w = u;
      m[8] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = (0, t.jsx)(r.EX, { size: 12 })), (m[8] = d))
        : (d = m[8]);
      let v = _ ? "Update callout" : "Create callout";
      return (
        m[9] !== w || m[10] !== v
          ? ((f = (0, t.jsxs)("button", {
              type: "button",
              onClick: w,
              "data-testid": "trade-callout-toast-action",
              className: s.u,
              children: [d, v],
            })),
            (m[9] = w),
            (m[10] = v),
            (m[11] = f))
          : (f = m[11]),
        f
      );
    },
  ]);
};
