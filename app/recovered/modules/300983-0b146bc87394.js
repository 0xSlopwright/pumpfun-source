// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(96224),
    r = e.i(782067),
    o = e.i(690877),
    i = e.i(653706);
  let s = "xProfilesBatch",
    a = (e) => [...new Set(e.filter(Boolean))].sort(),
    l = async (e, t) => {
      let n = await (0, r.H)(e, t),
        o = (0, r.V)(n),
        s = {};
      for (let e of t) s[e] = (0, i.p)(o.get(e));
      return s;
    };
  e.s([
    "W",
    0,
    (e) => e.invalidateQueries({ queryKey: [s] }),
    "U",
    0,
    (e) => {
      let r,
        i,
        u,
        c,
        f = (0, t.c)(12),
        { addresses: h, enabled: p, queryOptions: d } = e,
        { clientServerUrl: v } = (0, n.useApiClientsConfig)();
      f[0] !== h ? ((r = a(h)), (f[0] = h), (f[1] = r)) : (r = f[1]);
      let y = r,
        m = (p ?? !0) && y.length > 0;
      return (
        (f[2] !== v || f[3] !== y
          ? ((i = () => l(v, y)), (f[2] = v), (f[3] = y), (f[4] = i))
          : (i = f[4]),
        f[5] !== y)
          ? ((u = [s, a(y)]), (f[5] = y), (f[6] = u))
          : (u = f[6]),
        f[7] !== m || f[8] !== d || f[9] !== i || f[10] !== u
          ? ((c = {
              enabled: m,
              queryFn: i,
              queryKey: u,
              staleTime: 6e4,
              ...d,
            }),
            (f[7] = m),
            (f[8] = d),
            (f[9] = i),
            (f[10] = u),
            (f[11] = c))
          : (c = f[11]),
        (0, o.useQuery)(c)
      );
    },
  ]);
};
