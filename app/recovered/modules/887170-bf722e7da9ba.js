// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(985526),
    r = e.i(573525),
    n = e.i(237237),
    a = e.i(639374);
  e.s([
    "f",
    0,
    function (e) {
      let l,
        s,
        o,
        c = (0, t.c)(8),
        { mint: m, enabled: u, onTradeEvent: d } = e,
        f = "string" == typeof m && m.length > 0 && (0, a.f)(m) ? m : void 0;
      if (c[0] !== f)
        ((l = null != f ? `${n.J}.${f}` : ""), (c[0] = f), (c[1] = l));
      else l = c[1];
      let h = l;
      c[2] !== d
        ? ((s = (e) => {
            d?.(e);
          }),
          (c[2] = d),
          (c[3] = s))
        : (s = c[3]);
      let p = s,
        x = !!((void 0 === u || u) && f && h.length > 0);
      (c[4] !== p || c[5] !== h || c[6] !== x
        ? ((o = { type: i.N.Unified, subject: h, enabled: x, onEvent: p }),
          (c[4] = p),
          (c[5] = h),
          (c[6] = x),
          (c[7] = o))
        : (o = c[7]),
        (0, r.f)(o));
    },
  ]);
};
