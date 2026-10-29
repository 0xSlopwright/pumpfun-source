// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(959719),
    r = e.i(971370),
    n = e.i(541710),
    a = e.i(646908),
    l = e.i(605587),
    i = e.i(449597);
  let s = new r.PublicKey(i.r),
    o = new r.PublicKey(i.j),
    c = (e) => e.toNumber() / r.LAMPORTS_PER_SOL,
    d = (e) => !!e && !!(e.equals(s) || e.equals(o)),
    u = (e) => (0, i.Q)(e?.toBase58()),
    f = (e) => !u(e) && !d(e),
    h = (e, t) => (0, i.x)(e?.toBase58(), t),
    m = (e) => (0, i.q)(e?.toBase58()),
    b = (e, t, r) => {
      if (void 0 === e || "" === e) return;
      let n = h(t, r);
      if (void 0 !== n) return (Number(String(e)) / 10 ** n).toFixed(n);
    };
  e.s([
    "a",
    0,
    b,
    "V",
    0,
    (e, t, r) => {
      let n = e.toString();
      if (d(t)) return `${n} (${(e.toNumber() / 1e6).toFixed(6)} USDC)`;
      if (f(t)) {
        let e = m(t);
        return null == r
          ? `${n} ${e} base units`
          : `${n} (${(Number(n) / 10 ** r).toFixed(r)} ${e})`;
      }
      return `${n} lamports (${c(e).toFixed(9)} SOL)`;
    },
    "n",
    0,
    (e, t, r) => {
      let n = String(e),
        a = b(n, t, r),
        l = m(t);
      return void 0 === a ? `${n} ${l} base units` : `${n} (${a} ${l})`;
    },
    "H",
    0,
    (e) => {
      if (
        !(
          !e?.quote_mint ||
          (0, l.N)({ mint: e.mint, chainId: e.chain_id }) ||
          (0, a.L)(e.chain_id)
        ) &&
        null == (0, n.T)(e.chain_id)
      )
        return new r.PublicKey(e.quote_mint);
    },
    "N",
    0,
    h,
    "k",
    0,
    (e) => (!e || e.equals(r.PublicKey.default) || e.equals(t.w) ? t.w : e),
    "W",
    0,
    m,
    "p",
    0,
    () => o,
    "Z",
    0,
    f,
    "i",
    0,
    u,
    "w",
    0,
    d,
    "h",
    0,
    c,
    "U",
    0,
    (e, t, r) => {
      let n = h(t, r);
      return void 0 === n ? void 0 : e.toNumber() / 10 ** n;
    },
  ]);
};
