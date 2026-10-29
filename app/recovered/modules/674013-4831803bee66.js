// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(78436),
    r = e.i(605587);
  let n = (0, i.$)()((e, t) => ({
    prefill: null,
    setTradePrefill: (t) => e({ prefill: { ...t, mint: (0, r.c)(t.mint) } }),
    consumeTradePrefill: (i) => {
      let n = t().prefill;
      return n && n.mint === (0, r.c)(i) ? (e({ prefill: null }), n) : null;
    },
  }));
  e.s([
    "p",
    0,
    (e) => n.getState().consumeTradePrefill(e),
    "w",
    0,
    (e) => n.getState().setTradePrefill(e),
    "g",
    0,
    (e) => {
      let i,
        a,
        o = (0, t.c)(4);
      o[0] !== e ? ((i = (0, r.c)(e)), (o[0] = e), (o[1] = i)) : (i = o[1]);
      let s = i;
      return (
        o[2] !== s
          ? ((a = (e) => (e.prefill?.mint === s ? e.prefill : null)),
            (o[2] = s),
            (o[3] = a))
          : (a = o[3]),
        n(a)
      );
    },
  ]);
};
