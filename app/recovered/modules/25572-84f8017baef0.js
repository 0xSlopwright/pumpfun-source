// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(675500),
    n = e.i(605587);
  let r = { protocol: 45, referrer: 40 },
    i = null,
    a = new Set(),
    o = (e) =>
      "number" == typeof e && Number.isInteger(e) && e >= 0 && e <= 1e4,
    l = (e, t) => (t && e?.owner === t && o(e.feeBypassBps) ? e : null),
    s = (e) => {
      let t = l(i, e);
      if (!t) return {};
      let { referrerWallet: n, feeBypassBps: r, referrerFeeSplitBps: a } = t;
      return {
        has_referral_info: !0,
        ...(r > 0 ? { fee_bypass_bps: r } : {}),
        ...(n ? { referrer_wallet: n } : {}),
        ...(n && o(a) ? { referrer_fee_split_bps: a } : {}),
      };
    };
  e.s([
    "c",
    0,
    () => s((0, t.b)()),
    "U",
    0,
    (e) => `${(e / 100).toFixed(2)}%`,
    "A",
    0,
    () => i,
    "I",
    0,
    (e) => {
      for (let t of ((i = e), a)) t();
    },
    "d",
    0,
    ({ info: e, user: t, reportedKind: i, rates: a, mint: o }) => {
      let s = l(e, t),
        u = i ?? (s ? (s.referrerWallet ? "referrer" : "protocol") : null);
      if (!u) return null;
      let c = s?.feeBypassBps ?? 0;
      return {
        kind: u,
        bps:
          (((e, t, i) => {
            if (!e) return r[i];
            let a = t ? (0, n.c)(t) : null,
              o =
                a && e.reduced.mints.some((e) => (0, n.c)(e) === a)
                  ? e.reduced
                  : e;
            return "protocol" === i ? o.protocol_bps : o.referrer_bps;
          })(a, o, u) *
            (1e4 - c)) /
          1e4,
      };
    },
    "n",
    0,
    s,
    "_",
    0,
    (e) => (
      a.add(e),
      () => {
        a.delete(e);
      }
    ),
  ]);
};
