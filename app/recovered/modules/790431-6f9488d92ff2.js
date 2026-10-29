// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(449597);
  let i = (e, t) => (e === t ? ("sol" === e ? "usdc" : "sol") : e);
  e.s([
    "c",
    0,
    ({ isPaymentRouted: e, isUsdcPayment: t, isUsdcQuote: i }) => e && t !== i,
    "T",
    0,
    (e) => (e === t.X ? "sol" : (0, t.Y)(e) ? "usdc" : null),
    "b",
    0,
    (e) => !0,
    "e",
    0,
    ({
      isPaymentRouted: e,
      venueHint: t,
      isExoticQuote: i,
      isUsdcPayment: o,
      isUsdcQuote: n,
    }) => e && ("external" === t || i || o !== n),
    "r",
    0,
    ({
      prefersUsdc: e,
      isUsdcQuote: t,
      isPumpVenue: o,
      isEstablished: n,
      isMigration: r,
      paymentRoutingDisabled: u,
      walletFailsSponsoredSigning: a = !1,
      selfAsset: l,
    }) => {
      let s = t ? "usdc" : "sol";
      return a && !u
        ? i("sol", l)
        : !n || r
          ? i(s, l)
          : u
            ? i(o ? s : "sol", l)
            : (({
                prefersUsdc: e,
                isUsdcQuote: t,
                isEstablished: o,
                isMigration: n,
                selfAsset: r,
              }) =>
                !o || n ? i(t ? "usdc" : "sol", r) : i(e ? "usdc" : "sol", r))({
                prefersUsdc: e,
                isUsdcQuote: t,
                isEstablished: n,
                isMigration: r,
                selfAsset: l,
              });
    },
    "d",
    0,
    (e) =>
      (e?.program != null && "pump" !== e.program) || e?.raydium_pool
        ? "external"
        : "pump",
  ]);
};
