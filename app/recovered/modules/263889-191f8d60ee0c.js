// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(689943),
    r = e.i(389270),
    a = e.i(605587),
    l = e.i(26077);
  e.s([
    "f",
    0,
    (e) => {
      let o,
        i,
        s,
        c,
        u = (0, t.c)(19),
        { mint: f, program: h, chain_id: d } = e,
        { data: m, isLoading: p, error: v, refetch: g } = (0, n.n)(f, h, d);
      if (
        u[0] !== m?.athMarketCap ||
        u[1] !== d ||
        u[2] !== e ||
        u[3] !== f ||
        u[4] !== h
      ) {
        let t,
          s,
          c = (0, l.a)(m?.athMarketCap) ?? 0;
        (u[7] !== d || u[8] !== f
          ? ((t = (0, a.N)({ mint: f, chainId: d })),
            (u[7] = d),
            (u[8] = f),
            (u[9] = t))
          : (t = u[9]),
          (o = t),
          (i =
            f && (0, n.P)(f, h, d)
              ? o
                ? ((s = (0, l.a)(e.ath_market_cap) ?? 0),
                  e.protocol === r.G ? Math.max(c, s) : c > 0 ? c : s)
                : c
              : ((0, l.a)(e.ath_market_cap) ?? 0)),
          (u[0] = m?.athMarketCap),
          (u[1] = d),
          (u[2] = e),
          (u[3] = f),
          (u[4] = h),
          (u[5] = o),
          (u[6] = i));
      } else ((o = u[5]), (i = u[6]));
      let y = i;
      u[10] !== e.ath_market_cap || u[11] !== e.protocol || u[12] !== o
        ? ((s =
            o && e.protocol === r.G && ((0, l.a)(e.ath_market_cap) ?? 0) > 0),
          (u[10] = e.ath_market_cap),
          (u[11] = e.protocol),
          (u[12] = o),
          (u[13] = s))
        : (s = u[13]);
      let b = s,
        x = p && !b,
        w = v?.message || null;
      return (
        u[14] !== y || u[15] !== g || u[16] !== x || u[17] !== w
          ? ((c = { athMarketCap: y, isLoading: x, error: w, refetch: g }),
            (u[14] = y),
            (u[15] = g),
            (u[16] = x),
            (u[17] = w),
            (u[18] = c))
          : (c = u[18]),
        c
      );
    },
  ]);
};
