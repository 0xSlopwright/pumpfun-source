// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(557392),
    r = e.i(527260),
    n = e.i(662093);
  e.s([
    "f",
    0,
    (e) => {
      let a,
        o = (0, t.c)(4),
        { coin: s } = e,
        l = (0, i.n)(s.mint),
        d = (0, n.m)(s);
      return (
        o[0] !== d || o[1] !== s || o[2] !== l
          ? ((a = (0, r.f)({ coin: s, row: l, basis: d })),
            (o[0] = d),
            (o[1] = s),
            (o[2] = l),
            (o[3] = a))
          : (a = o[3]),
        a
      );
    },
  ]);
};
