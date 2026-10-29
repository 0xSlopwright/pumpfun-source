// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(557392),
    r = e.i(662093);
  e.s([
    "f",
    0,
    (e) => {
      let n,
        a = (0, t.c)(3),
        { coin: o } = e,
        s = (0, i.F)(o.mint);
      return (
        a[0] !== o || a[1] !== s
          ? ((n = {
              mint: o.mint,
              chainId: o.chain_id,
              coin: o,
              row: s,
              fallbackMarketCap: o.usd_market_cap,
            }),
            (a[0] = o),
            (a[1] = s),
            (a[2] = n))
          : (n = a[2]),
        (0, r.P)(n) ?? null
      );
    },
  ]);
};
