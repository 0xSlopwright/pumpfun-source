// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(689943),
    r = e.i(389270),
    a = e.i(605587),
    n = e.i(26077);
  e.s([
    "f",
    0,
    (e) => {
      let l,
        s,
        o,
        d,
        u = (0, t.c)(19),
        { mint: c, program: m, chain_id: h } = e,
        { data: f, isLoading: g, error: p, refetch: y } = (0, i.n)(c, m, h);
      if (
        u[0] !== f?.athMarketCap ||
        u[1] !== h ||
        u[2] !== e ||
        u[3] !== c ||
        u[4] !== m
      ) {
        let t,
          o,
          d = (0, n.a)(f?.athMarketCap) ?? 0;
        (u[7] !== h || u[8] !== c
          ? ((t = (0, a.N)({ mint: c, chainId: h })),
            (u[7] = h),
            (u[8] = c),
            (u[9] = t))
          : (t = u[9]),
          (l = t),
          (s =
            c && (0, i.P)(c, m, h)
              ? l
                ? ((o = (0, n.a)(e.ath_market_cap) ?? 0),
                  e.protocol === r.G ? Math.max(d, o) : d > 0 ? d : o)
                : d
              : ((0, n.a)(e.ath_market_cap) ?? 0)),
          (u[0] = f?.athMarketCap),
          (u[1] = h),
          (u[2] = e),
          (u[3] = c),
          (u[4] = m),
          (u[5] = l),
          (u[6] = s));
      } else ((l = u[5]), (s = u[6]));
      let w = s;
      u[10] !== e.ath_market_cap || u[11] !== e.protocol || u[12] !== l
        ? ((o =
            l && e.protocol === r.G && ((0, n.a)(e.ath_market_cap) ?? 0) > 0),
          (u[10] = e.ath_market_cap),
          (u[11] = e.protocol),
          (u[12] = l),
          (u[13] = o))
        : (o = u[13]);
      let x = o,
        v = g && !x,
        E = p?.message || null;
      return (
        u[14] !== w || u[15] !== y || u[16] !== v || u[17] !== E
          ? ((d = { athMarketCap: w, isLoading: v, error: E, refetch: y }),
            (u[14] = w),
            (u[15] = y),
            (u[16] = v),
            (u[17] = E),
            (u[18] = d))
          : (d = u[18]),
        d
      );
    },
  ]);
};
