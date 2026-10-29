// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(959719),
    n = e.i(971370),
    r = e.i(541710),
    a = e.i(646908),
    o = e.i(605587),
    l = e.i(449597);
  let i = new n.PublicKey(l.r),
    c = new n.PublicKey(l.j),
    s = (e) => e.toNumber() / n.LAMPORTS_PER_SOL,
    u = (e) => !!e && !!(e.equals(i) || e.equals(c)),
    f = (e) => (0, l.Q)(e?.toBase58()),
    h = (e) => !f(e) && !u(e),
    d = (e, t) => (0, l.x)(e?.toBase58(), t),
    p = (e) => (0, l.q)(e?.toBase58()),
    v = (e, t, n) => {
      if (void 0 === e || "" === e) return;
      let r = d(t, n);
      if (void 0 !== r) return (Number(String(e)) / 10 ** r).toFixed(r);
    };
  e.s([
    "a",
    0,
    v,
    "V",
    0,
    (e, t, n) => {
      let r = e.toString();
      if (u(t)) return `${r} (${(e.toNumber() / 1e6).toFixed(6)} USDC)`;
      if (h(t)) {
        let e = p(t);
        return null == n
          ? `${r} ${e} base units`
          : `${r} (${(Number(r) / 10 ** n).toFixed(n)} ${e})`;
      }
      return `${r} lamports (${s(e).toFixed(9)} SOL)`;
    },
    "n",
    0,
    (e, t, n) => {
      let r = String(e),
        a = v(r, t, n),
        o = p(t);
      return void 0 === a ? `${r} ${o} base units` : `${r} (${a} ${o})`;
    },
    "H",
    0,
    (e) => {
      if (
        !(
          !e?.quote_mint ||
          (0, o.N)({ mint: e.mint, chainId: e.chain_id }) ||
          (0, a.L)(e.chain_id)
        ) &&
        null == (0, r.T)(e.chain_id)
      )
        return new n.PublicKey(e.quote_mint);
    },
    "N",
    0,
    d,
    "k",
    0,
    (e) => (!e || e.equals(n.PublicKey.default) || e.equals(t.w) ? t.w : e),
    "W",
    0,
    p,
    "p",
    0,
    () => c,
    "Z",
    0,
    h,
    "i",
    0,
    f,
    "w",
    0,
    u,
    "h",
    0,
    s,
    "U",
    0,
    (e, t, n) => {
      let r = d(t, n);
      return void 0 === r ? void 0 : e.toNumber() / 10 ** r;
    },
  ]);
};
