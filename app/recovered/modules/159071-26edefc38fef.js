// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(445242),
    s = t.i(322315),
    i = t.i(254010),
    n = t.i(517182);
  t.i(550675);
  var a = t.i(547562),
    l = t.i(605587);
  let u = (t, s) => {
      let n,
        a,
        u = (0, e.c)(7),
        r = (0, i.D)(t);
      if (!s || 0 === r.length) return !1;
      u[0] !== s ? ((n = (0, l.c)(s)), (u[0] = s), (u[1] = n)) : (n = u[1]);
      let m = n;
      if (u[2] !== m || u[3] !== r) {
        let t;
        (u[5] !== m
          ? ((t = (t) => (0, l.c)(t) === m), (u[5] = m), (u[6] = t))
          : (t = u[6]),
          (a = r.some(t)),
          (u[2] = m),
          (u[3] = r),
          (u[4] = a));
      } else a = u[4];
      return a;
    },
    r = (t) => u(s.K.BLOCKCHAIN_COIN_SCAM_BLACKLIST_MINTS, t),
    m = (t) => u(s.K.BLOCKCHAIN_COIN_WARNING_BYPASS_MINTS, t),
    o = { isBlocked: !1, tier: null },
    c = { isBlocked: !0, tier: "scam_blacklist" },
    d = { isBlocked: !0, tier: "safe_mode" };
  t.s([
    "M",
    0,
    (t, l) => {
      let u,
        h = (0, e.c)(4),
        p = m(t),
        b = r(t),
        f = (0, i.k)(s.D.WEB_SAFE_MODE),
        g = (0, a.o)("trading.safeModeDisabled"),
        v = f && !g,
        k = t ?? void 0,
        _ = v && !p && !b;
      h[0] !== l || h[1] !== k || h[2] !== _
        ? ((u = { address: k, chainId: l, enabled: _ }),
          (h[0] = l),
          (h[1] = k),
          (h[2] = _),
          (h[3] = u))
        : (u = h[3]);
      let j = (0, n.S)(u);
      return p ? o : b ? c : v && j.data?.hardBlocked === !0 ? d : o;
    },
    "R",
    0,
    r,
    "w",
    0,
    m,
  ]);
};
