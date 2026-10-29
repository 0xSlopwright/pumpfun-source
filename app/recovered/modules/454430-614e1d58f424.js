// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    i = e.i(521368),
    o = e.i(386017),
    s = e.i(170450),
    a = e.i(338319),
    l = e.i(679553);
  let c = (e) => {
      let r,
        o,
        s,
        a,
        c = (0, n.c)(10);
      (c[0] !== e
        ? (({ coin: r, ...o } = e), (c[0] = e), (c[1] = r), (c[2] = o))
        : ((r = c[1]), (o = c[2])),
        c[3] !== r.chain_id
          ? ((s = { chainId: r.chain_id }), (c[3] = r.chain_id), (c[4] = s))
          : (s = c[4]));
      let {
        candlesticks: u,
        isLoading: d,
        error: m,
      } = (0, i.f)(r.mint, r.created_timestamp ?? null, void 0, s);
      return (
        c[5] !== u || c[6] !== m || c[7] !== d || c[8] !== o
          ? ((a = (0, t.jsx)(l.f, { data: u, isLoading: d, error: m, ...o })),
            (c[5] = u),
            (c[6] = m),
            (c[7] = d),
            (c[8] = o),
            (c[9] = a))
          : (a = c[9]),
        a
      );
    },
    u = (e) => {
      let i,
        l,
        u = (0, n.c)(7),
        d = (0, r.useRef)(null);
      u[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = { rootMargin: "320px 0px" }), (u[0] = i))
        : (i = u[0]);
      let m = (0, o.f)(d, i);
      if (!(0, s.f)() || !m) {
        let n, r;
        return (
          u[1] !== e.className
            ? ((n = (0, a.c)("flex h-8 w-16", e.className)),
              (u[1] = e.className),
              (u[2] = n))
            : (n = u[2]),
          u[3] !== n
            ? ((r = (0, t.jsx)("div", {
                ref: d,
                "aria-hidden": !0,
                className: n,
                "data-testid": "chart-cell-pending",
              })),
              (u[3] = n),
              (u[4] = r))
            : (r = u[4]),
          r
        );
      }
      return (
        u[5] !== e
          ? ((l = (0, t.jsx)(c, { ...e })), (u[5] = e), (u[6] = l))
          : (l = u[6]),
        l
      );
    };
  u.displayName = "ChartCell";
  let d = r.default.memo(u);
  e.s(["f", 0, d]);
};
