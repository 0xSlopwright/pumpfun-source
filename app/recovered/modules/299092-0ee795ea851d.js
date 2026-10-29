// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(913719),
    s = t.i(84976);
  let i = ({
      paymentAsset: t,
      usdcBalanceUi: e,
      solBalanceLamports: s,
      buyInputUnit: i,
      solUsdPrice: n,
      skimReserveUi: a,
      sharePercent: l,
    }) => {
      let u = Math.min(Math.max(l, 0), 100) / 100;
      if ("usdc" === t)
        return null === e
          ? null
          : (Math.floor(Math.max(e - a, 0) * u * 100) / 100).toFixed(2);
      let r = Math.max(s / 1e9 - 0.005 - a, 0) * u;
      return "usd" === i ? (r * n).toFixed(2) : r.toFixed(4);
    },
    n = (t) => i({ ...t, sharePercent: 100 }),
    a = ({ value: t, paymentAsset: i, buyInputUnit: n, solUsdPrice: a }) => {
      if ("usdc" === i) return (0, e.v)(t, (0, s.q)(i));
      if ("usd" === n) {
        let i = Number(t);
        return !Number.isFinite(i) || i <= 0 || a <= 0
          ? null
          : (0, e.v)((i / a).toFixed(9), s.f);
      }
      return (0, e.v)(t, s.f);
    };
  t.s([
    "Z",
    0,
    1e9,
    "D",
    0,
    0.005,
    "W",
    0,
    a,
    "I",
    0,
    ({ paymentAsset: t, atomicAmount: e }) => {
      if (null === e || e <= BigInt(0)) return null;
      let s = e.toString();
      return "usdc" === t
        ? { kind: "usdc", amountIn: s }
        : { kind: "sol", lamports: s };
    },
    "m",
    0,
    i,
    "j",
    0,
    (t) => {
      let e = n(t);
      return null === e
        ? null
        : (a({
            value: e,
            paymentAsset: t.paymentAsset,
            buyInputUnit: t.buyInputUnit,
            solUsdPrice: t.solUsdPrice,
          }) ?? BigInt(0));
    },
    "q",
    0,
    n,
  ]);
};
