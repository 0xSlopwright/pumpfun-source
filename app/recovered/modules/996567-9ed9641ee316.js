// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(402732),
    r = e.i(778593);
  e.i(550675);
  var n = e.i(547562),
    o = e.i(53479);
  e.s([
    "f",
    0,
    function () {
      let e,
        a,
        s,
        u,
        l,
        c,
        d,
        m,
        f,
        p = (0, t.c)(32),
        b = (0, i.f)(),
        [g, _] = (0, n.l)("trading.quickBuy.useActivePreset"),
        [v, y] = (0, n.l)("trading.quickBuy.execution"),
        h = b && g,
        {
          activePreset: w,
          updateActivePreset: S,
          resetActivePreset: A,
        } = (0, r.f)();
      p[0] !== w || p[1] !== v || p[2] !== h
        ? ((e = h ? (0, o.$)(w) : v),
          (p[0] = w),
          (p[1] = v),
          (p[2] = h),
          (p[3] = e))
        : (e = p[3]);
      let x = e;
      p[4] !== y || p[5] !== S || p[6] !== h
        ? ((a = (e) => {
            h ? S(e) : y((t) => (0, o.W)({ ...t, ...e }));
          }),
          (p[4] = y),
          (p[5] = S),
          (p[6] = h),
          (p[7] = a))
        : (a = p[7]);
      let q = a;
      p[8] !== q
        ? ((s = (e) => q({ slippage: e ?? 0 })), (p[8] = q), (p[9] = s))
        : (s = p[9]);
      let B = s;
      p[10] !== q
        ? ((u = (e) => q({ priorityFee: Math.max(e ?? 0, 0) })),
          (p[10] = q),
          (p[11] = u))
        : (u = p[11]);
      let M = u;
      p[12] !== q
        ? ((l = (e) => q({ tipAmount: Math.max(e ?? 0, 0) })),
          (p[12] = q),
          (p[13] = l))
        : (l = p[13]);
      let N = l;
      p[14] !== q
        ? ((c = (e) => q({ frontRunningProtection: e })),
          (p[14] = q),
          (p[15] = c))
        : (c = p[15]);
      let k = c;
      p[16] !== q
        ? ((d = (e) => q({ holdToConfirm: e })), (p[16] = q), (p[17] = d))
        : (d = p[17]);
      let T = d;
      p[18] !== A || p[19] !== y || p[20] !== h
        ? ((m = () => {
            h ? A() : y(o.d);
          }),
          (p[18] = A),
          (p[19] = y),
          (p[20] = h),
          (p[21] = m))
        : (m = p[21]);
      let L = m;
      return (
        p[22] !== L ||
        p[23] !== k ||
        p[24] !== T ||
        p[25] !== M ||
        p[26] !== B ||
        p[27] !== N ||
        p[28] !== _ ||
        p[29] !== x ||
        p[30] !== h
          ? ((f = {
              ...x,
              setSlippage: B,
              setPriorityFee: M,
              setTipAmount: N,
              setFrontRunningProtection: k,
              setHoldToConfirm: T,
              reset: L,
              usesActivePreset: h,
              setUsesActivePreset: _,
            }),
            (p[22] = L),
            (p[23] = k),
            (p[24] = T),
            (p[25] = M),
            (p[26] = B),
            (p[27] = N),
            (p[28] = _),
            (p[29] = x),
            (p[30] = h),
            (p[31] = f))
          : (f = p[31]),
        f
      );
    },
  ]);
};
