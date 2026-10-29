// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(959719),
    n = e.i(971370),
    r = e.i(541710),
    s = e.i(646908),
    i = e.i(605587),
    a = e.i(449597);
  let o = new n.PublicKey(a.r),
    l = new n.PublicKey(a.j),
    u = (e) => e.toNumber() / n.LAMPORTS_PER_SOL,
    c = (e) => !!e && !!(e.equals(o) || e.equals(l)),
    d = (e) => (0, a.Q)(e?.toBase58()),
    f = (e) => !d(e) && !c(e),
    m = (e, t) => (0, a.x)(e?.toBase58(), t),
    h = (e) => (0, a.q)(e?.toBase58()),
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
      if (c(t)) return `${r} (${(e.toNumber() / 1e6).toFixed(6)} USDC)`;
      if (f(t)) {
        let e = h(t);
        return null == n
          ? `${r} ${e} base units`
          : `${r} (${(Number(r) / 10 ** n).toFixed(n)} ${e})`;
      }
      return `${r} lamports (${u(e).toFixed(9)} SOL)`;
    },
    "n",
    0,
    (e, t, n) => {
      let r = String(e),
        s = g(r, t, n),
        i = h(t);
      return void 0 === s ? `${r} ${i} base units` : `${r} (${s} ${i})`;
    },
    "H",
    0,
    (e) => {
      if (
        !(
          !e?.quote_mint ||
          (0, i.N)({ mint: e.mint, chainId: e.chain_id }) ||
          (0, s.L)(e.chain_id)
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
    h,
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
    c,
    "h",
    0,
    u,
    "U",
    0,
    (e, t, n) => {
      let r = m(t, n);
      return void 0 === r ? void 0 : e.toNumber() / 10 ** r;
    },
  ]);
};
