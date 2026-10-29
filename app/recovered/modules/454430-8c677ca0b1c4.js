// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(352386),
    l = e.i(521368),
    n = e.i(386017),
    i = e.i(170450),
    s = e.i(338319),
    o = e.i(679553);
  let c = (e) => {
      let a,
        n,
        i,
        s,
        c = (0, r.c)(10);
      (c[0] !== e
        ? (({ coin: a, ...n } = e), (c[0] = e), (c[1] = a), (c[2] = n))
        : ((a = c[1]), (n = c[2])),
        c[3] !== a.chain_id
          ? ((i = { chainId: a.chain_id }), (c[3] = a.chain_id), (c[4] = i))
          : (i = c[4]));
      let {
        candlesticks: d,
        isLoading: u,
        error: m,
      } = (0, l.f)(a.mint, a.created_timestamp ?? null, void 0, i);
      return (
        c[5] !== d || c[6] !== m || c[7] !== u || c[8] !== n
          ? ((s = (0, t.jsx)(o.f, { data: d, isLoading: u, error: m, ...n })),
            (c[5] = d),
            (c[6] = m),
            (c[7] = u),
            (c[8] = n),
            (c[9] = s))
          : (s = c[9]),
        s
      );
    },
    d = (e) => {
      let l,
        o,
        d = (0, r.c)(7),
        u = (0, a.useRef)(null);
      d[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((l = { rootMargin: "320px 0px" }), (d[0] = l))
        : (l = d[0]);
      let m = (0, n.f)(u, l);
      if (!(0, i.f)() || !m) {
        let r, a;
        return (
          d[1] !== e.className
            ? ((r = (0, s.c)("flex h-8 w-16", e.className)),
              (d[1] = e.className),
              (d[2] = r))
            : (r = d[2]),
          d[3] !== r
            ? ((a = (0, t.jsx)("div", {
                ref: u,
                "aria-hidden": !0,
                className: r,
                "data-testid": "chart-cell-pending",
              })),
              (d[3] = r),
              (d[4] = a))
            : (a = d[4]),
          a
        );
      }
      return (
        d[5] !== e
          ? ((o = (0, t.jsx)(c, { ...e })), (d[5] = e), (d[6] = o))
          : (o = d[6]),
        o
      );
    };
  d.displayName = "ChartCell";
  let u = a.default.memo(d);
  e.s(["f", 0, u]);
};
