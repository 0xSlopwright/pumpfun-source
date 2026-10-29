// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(526080),
    n = e.i(605587);
  let r = (e) => "number" == typeof e && Number.isFinite(e) && e > 0;
  function a(e, a) {
    return !(0, n.N)({ mint: e.mint, chainId: e.chain_id }) || (0, t.u)(e)
      ? (0, t.B)(e)
      : r(a)
        ? a
        : 0;
  }
  function s(e, t = {}) {
    let n = a(e, t.codexSupply);
    if (!Number.isFinite(n) || n <= 0) return 0;
    let r = e.usd_market_cap ?? 0;
    return !Number.isFinite(r) || r <= 0 ? 0 : r / n;
  }
  e.s([
    "J",
    0,
    s,
    "s",
    0,
    function ({ coin: e, livePriceUsd: t, codexSupply: n }) {
      return r(t) ? t : s(e, { codexSupply: n });
    },
    "t",
    0,
    a,
  ]);
};
