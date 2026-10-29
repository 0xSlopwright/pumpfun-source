// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(574472),
    r = e.i(690877),
    s = e.i(4911),
    i = e.i(896342),
    a = e.i(460261);
  let o = [a.M],
    l = (e, t) => ["bridgeTokenTradability", e, t.toLowerCase()];
  e.s([
    "c",
    0,
    l,
    "Q",
    0,
    (e) => {
      let u,
        c,
        d,
        f,
        m,
        h,
        g,
        p = (0, t.c)(20),
        { mint: _, chainId: b, enabled: y } = e,
        v = void 0 === y || y,
        { address: w, userId: z } = (0, n.F)();
      (p[0] !== w || p[1] !== v || p[2] !== b || p[3] !== _ || p[4] !== z
        ? ((c = (0, a.b)(b)),
          (u =
            v &&
            (0, i._)() &&
            null !== c &&
            o.includes(c) &&
            !!w &&
            !!z &&
            (0, s.f)(_)),
          (f = r.useQuery),
          (d = l(c, _)),
          (p[0] = w),
          (p[1] = v),
          (p[2] = b),
          (p[3] = _),
          (p[4] = z),
          (p[5] = u),
          (p[6] = c),
          (p[7] = d),
          (p[8] = f))
        : ((u = p[5]), (c = p[6]), (d = p[7]), (f = p[8])),
        p[9] !== _ || p[10] !== c
          ? ((m = (e) => {
              let { signal: t } = e;
              return (0, i.l)({ evmChainId: c, evmToken: _ }, { signal: t });
            }),
            (p[9] = _),
            (p[10] = c),
            (p[11] = m))
          : (m = p[11]),
        p[12] !== u || p[13] !== d || p[14] !== m
          ? ((h = {
              queryKey: d,
              queryFn: m,
              enabled: u,
              staleTime: 3e5,
              retry: !1,
            }),
            (p[12] = u),
            (p[13] = d),
            (p[14] = m),
            (p[15] = h))
          : (h = p[15]));
      let x = f(h),
        k = x.data?.tradable,
        S = x.data?.tokenized_stock,
        $ = u && x.isPending;
      return (
        p[16] !== k || p[17] !== S || p[18] !== $
          ? ((g = { tradable: k, tokenizedStock: S, isLoading: $ }),
            (p[16] = k),
            (p[17] = S),
            (p[18] = $),
            (p[19] = g))
          : (g = p[19]),
        g
      );
    },
  ]);
};
