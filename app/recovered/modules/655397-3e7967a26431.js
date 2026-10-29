// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(959719),
    n = e.i(971370),
    r = e.i(541710),
    a = e.i(646908),
    i = e.i(605587),
    o = e.i(449597);
  let s = new n.PublicKey(o.r),
    l = new n.PublicKey(o.j),
    c = (e) => e.toNumber() / n.LAMPORTS_PER_SOL,
    u = (e) => !!e && !!(e.equals(s) || e.equals(l)),
    f = (e) => (0, o.Q)(e?.toBase58()),
    d = (e) => !f(e) && !u(e),
    h = (e, t) => (0, o.x)(e?.toBase58(), t),
    g = (e) => (0, o.q)(e?.toBase58()),
    m = (e, t, n) => {
      if (void 0 === e || "" === e) return;
      let r = h(t, n);
      if (void 0 !== r) return (Number(String(e)) / 10 ** r).toFixed(r);
    };
  e.s([
    "a",
    0,
    m,
    "V",
    0,
    (e, t, n) => {
      let r = e.toString();
      if (u(t)) return `${r} (${(e.toNumber() / 1e6).toFixed(6)} USDC)`;
      if (d(t)) {
        let e = g(t);
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
        a = m(r, t, n),
        i = g(t);
      return void 0 === a ? `${r} ${i} base units` : `${r} (${a} ${i})`;
    },
    "H",
    0,
    (e) => {
      if (
        !(
          !e?.quote_mint ||
          (0, i.N)({ mint: e.mint, chainId: e.chain_id }) ||
          (0, a.L)(e.chain_id)
        ) &&
        null == (0, r.T)(e.chain_id)
      )
        return new n.PublicKey(e.quote_mint);
    },
    "N",
    0,
    h,
    "k",
    0,
    (e) => (!e || e.equals(n.PublicKey.default) || e.equals(t.w) ? t.w : e),
    "W",
    0,
    g,
    "p",
    0,
    () => l,
    "Z",
    0,
    d,
    "i",
    0,
    f,
    "w",
    0,
    u,
    "h",
    0,
    c,
    "U",
    0,
    (e, t, n) => {
      let r = h(t, n);
      return void 0 === r ? void 0 : e.toNumber() / 10 ** r;
    },
  ]);
};
