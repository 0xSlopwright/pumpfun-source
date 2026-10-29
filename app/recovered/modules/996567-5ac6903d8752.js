// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(402732),
    o = e.i(778593);
  e.i(550675);
  var n = e.i(547562),
    r = e.i(53479);
  e.s([
    "f",
    0,
    function () {
      let e,
        u,
        a,
        l,
        s,
        c,
        d,
        m,
        p,
        f = (0, t.c)(32),
        b = (0, i.f)(),
        [g, v] = (0, n.l)("trading.quickBuy.useActivePreset"),
        [y, h] = (0, n.l)("trading.quickBuy.execution"),
        _ = b && g,
        {
          activePreset: x,
          updateActivePreset: A,
          resetActivePreset: q,
        } = (0, o.f)();
      f[0] !== x || f[1] !== y || f[2] !== _
        ? ((e = _ ? (0, r.$)(x) : y),
          (f[0] = x),
          (f[1] = y),
          (f[2] = _),
          (f[3] = e))
        : (e = f[3]);
      let S = e;
      f[4] !== h || f[5] !== A || f[6] !== _
        ? ((u = (e) => {
            _ ? A(e) : h((t) => (0, r.W)({ ...t, ...e }));
          }),
          (f[4] = h),
          (f[5] = A),
          (f[6] = _),
          (f[7] = u))
        : (u = f[7]);
      let M = u;
      f[8] !== M
        ? ((a = (e) => M({ slippage: e ?? 0 })), (f[8] = M), (f[9] = a))
        : (a = f[9]);
      let k = a;
      f[10] !== M
        ? ((l = (e) => M({ priorityFee: Math.max(e ?? 0, 0) })),
          (f[10] = M),
          (f[11] = l))
        : (l = f[11]);
      let w = l;
      f[12] !== M
        ? ((s = (e) => M({ tipAmount: Math.max(e ?? 0, 0) })),
          (f[12] = M),
          (f[13] = s))
        : (s = f[13]);
      let L = s;
      f[14] !== M
        ? ((c = (e) => M({ frontRunningProtection: e })),
          (f[14] = M),
          (f[15] = c))
        : (c = f[15]);
      let B = c;
      f[16] !== M
        ? ((d = (e) => M({ holdToConfirm: e })), (f[16] = M), (f[17] = d))
        : (d = f[17]);
      let F = d;
      f[18] !== q || f[19] !== h || f[20] !== _
        ? ((m = () => {
            _ ? q() : h(r.d);
          }),
          (f[18] = q),
          (f[19] = h),
          (f[20] = _),
          (f[21] = m))
        : (m = f[21]);
      let R = m;
      return (
        f[22] !== R ||
        f[23] !== B ||
        f[24] !== F ||
        f[25] !== w ||
        f[26] !== k ||
        f[27] !== L ||
        f[28] !== v ||
        f[29] !== S ||
        f[30] !== _
          ? ((p = {
              ...S,
              setSlippage: k,
              setPriorityFee: w,
              setTipAmount: L,
              setFrontRunningProtection: B,
              setHoldToConfirm: F,
              reset: R,
              usesActivePreset: _,
              setUsesActivePreset: v,
            }),
            (f[22] = R),
            (f[23] = B),
            (f[24] = F),
            (f[25] = w),
            (f[26] = k),
            (f[27] = L),
            (f[28] = v),
            (f[29] = S),
            (f[30] = _),
            (f[31] = p))
          : (p = f[31]),
        p
      );
    },
  ]);
};
