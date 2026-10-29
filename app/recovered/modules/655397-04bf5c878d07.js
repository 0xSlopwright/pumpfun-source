// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(959719),
    n = e.i(971370),
    r = e.i(541710),
    a = e.i(646908),
    s = e.i(605587),
    i = e.i(449597);
  let o = new n.PublicKey(i.r),
    l = new n.PublicKey(i.j),
    c = (e) => e.toNumber() / n.LAMPORTS_PER_SOL,
    u = (e) => !!e && !!(e.equals(o) || e.equals(l)),
    d = (e) => (0, i.Q)(e?.toBase58()),
    f = (e) => !d(e) && !u(e),
    m = (e, t) => (0, i.x)(e?.toBase58(), t),
    p = (e) => (0, i.q)(e?.toBase58()),
    g = (e, t, n) => {
      if (void 0 === e || "" === e) return;
      let r = m(t, n);
      if (void 0 !== r) return (Number(String(e)) / 10 ** r).toFixed(r);
    };
  e.s([
    "a",
    0,
    g,
    "V",
    0,
    (e, t, n) => {
      let r = e.toString();
      if (u(t)) return `${r} (${(e.toNumber() / 1e6).toFixed(6)} USDC)`;
      if (f(t)) {
        let e = p(t);
        return null == n
          ? `${r} ${e} base units`
          : `${r} (${(Number(r) / 10 ** n).toFixed(n)} ${e})`;
      }
      return `${r} lamports (${c(e).toFixed(9)} SOL)`;
    },
    "n",
    0,
    (e, t, n) => {
      let r = String(e),
        a = g(r, t, n),
        s = p(t);
      return void 0 === a ? `${r} ${s} base units` : `${r} (${a} ${s})`;
    },
    "H",
    0,
    (e) => {
      if (
        !(
          !e?.quote_mint ||
          (0, s.N)({ mint: e.mint, chainId: e.chain_id }) ||
          (0, a.L)(e.chain_id)
        ) &&
        null == (0, r.T)(e.chain_id)
      )
        return new n.PublicKey(e.quote_mint);
    },
    "N",
    0,
    m,
    "k",
    0,
    (e) => (!e || e.equals(n.PublicKey.default) || e.equals(t.w) ? t.w : e),
    "W",
    0,
    p,
    "p",
    0,
    () => l,
    "Z",
    0,
    f,
    "i",
    0,
    d,
    "w",
    0,
    u,
    "h",
    0,
    c,
    "U",
    0,
    (e, t, n) => {
      let r = m(t, n);
      return void 0 === r ? void 0 : e.toNumber() / 10 ** r;
    },
  ]);
};
