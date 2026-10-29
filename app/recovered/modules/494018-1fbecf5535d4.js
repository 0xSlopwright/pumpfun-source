// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(690877),
    i = e.i(38279),
    n = e.i(402992),
    a = e.i(605587);
  e.s([
    "f",
    0,
    (e) => {
      let l,
        o,
        u,
        s,
        m,
        c,
        d = (0, t.c)(16),
        { mint: f, chainId: b, enabled: g } = e;
      (d[0] !== b || d[1] !== f
        ? ((l = ((e, t) => {
            if (!(0, a.N)({ mint: e, chainId: t })) return;
            let r = Number((0, a.w)(t));
            return Number.isInteger(r) && r > 0 ? r : void 0;
          })(f, b)),
          (u = r.useQuery),
          (o = i.Q.TOP_TRADER_TRADES(f, l)),
          (d[0] = b),
          (d[1] = f),
          (d[2] = l),
          (d[3] = o),
          (d[4] = u))
        : ((l = d[2]), (o = d[3]), (u = d[4])),
        d[5] !== l || d[6] !== f
          ? ((s = (e) => {
              let { signal: t } = e;
              return (0, n.Z)({ mint: f, chainId: l, signal: t });
            }),
            (d[5] = l),
            (d[6] = f),
            (d[7] = s))
          : (s = d[7]));
      let v = g && f.length > 0;
      d[8] !== o || d[9] !== s || d[10] !== v
        ? ((m = { queryKey: o, queryFn: s, enabled: v, staleTime: 3e4 }),
          (d[8] = o),
          (d[9] = s),
          (d[10] = v),
          (d[11] = m))
        : (m = d[11]);
      let h = u(m);
      if (!g) {
        let e;
        return (
          d[12] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = { data: n.c, loading: !1 }), (d[12] = e))
            : (e = d[12]),
          e
        );
      }
      let p = h.data ?? n.c;
      return (
        d[13] !== h.isPending || d[14] !== p
          ? ((c = { data: p, loading: h.isPending }),
            (d[13] = h.isPending),
            (d[14] = p),
            (d[15] = c))
          : (c = d[15]),
        c
      );
    },
  ]);
};
