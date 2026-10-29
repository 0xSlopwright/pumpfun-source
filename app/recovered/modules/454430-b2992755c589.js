// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(352386),
    a = e.i(521368),
    n = e.i(386017),
    l = e.i(170450),
    s = e.i(338319),
    o = e.i(679553);
  let c = (e) => {
      let i,
        n,
        l,
        s,
        c = (0, r.c)(10);
      (c[0] !== e
        ? (({ coin: i, ...n } = e), (c[0] = e), (c[1] = i), (c[2] = n))
        : ((i = c[1]), (n = c[2])),
        c[3] !== i.chain_id
          ? ((l = { chainId: i.chain_id }), (c[3] = i.chain_id), (c[4] = l))
          : (l = c[4]));
      let {
        candlesticks: m,
        isLoading: d,
        error: u,
      } = (0, a.f)(i.mint, i.created_timestamp ?? null, void 0, l);
      return (
        c[5] !== m || c[6] !== u || c[7] !== d || c[8] !== n
          ? ((s = (0, t.jsx)(o.f, { data: m, isLoading: d, error: u, ...n })),
            (c[5] = m),
            (c[6] = u),
            (c[7] = d),
            (c[8] = n),
            (c[9] = s))
          : (s = c[9]),
        s
      );
    },
    m = (e) => {
      let a,
        o,
        m = (0, r.c)(7),
        d = (0, i.useRef)(null);
      m[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((a = { rootMargin: "320px 0px" }), (m[0] = a))
        : (a = m[0]);
      let u = (0, n.f)(d, a);
      if (!(0, l.f)() || !u) {
        let r, i;
        return (
          m[1] !== e.className
            ? ((r = (0, s.c)("flex h-8 w-16", e.className)),
              (m[1] = e.className),
              (m[2] = r))
            : (r = m[2]),
          m[3] !== r
            ? ((i = (0, t.jsx)("div", {
                ref: d,
                "aria-hidden": !0,
                className: r,
                "data-testid": "chart-cell-pending",
              })),
              (m[3] = r),
              (m[4] = i))
            : (i = m[4]),
          i
        );
      }
      return (
        m[5] !== e
          ? ((o = (0, t.jsx)(c, { ...e })), (m[5] = e), (m[6] = o))
          : (o = m[6]),
        o
      );
    };
  m.displayName = "ChartCell";
  let d = i.default.memo(m);
  e.s(["f", 0, d]);
};
