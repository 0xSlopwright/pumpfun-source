// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370),
    i = e.i(90832),
    r = e.i(655397),
    n = e.i(642357);
  let o = {
    isSupported: !1,
    isUsdcQuote: !1,
    quoteAmount: 0,
    quoteDecimals: 0,
    buyLabel: "",
    compactBuyLabel: "",
    addFundsLabel: "",
    iconSrc: "",
  };
  e.s([
    "Q",
    0,
    function ({
      isUsdcQuote: e,
      quoteAmount: i,
      quoteDecimals: r,
      solBalanceLamports: n,
      usdcBalanceRaw: o,
    }) {
      return (
        !!Number.isFinite(i) &&
        !(i <= 0) &&
        (e
          ? null != o && Number(o) < i * 10 ** r
          : null != n && n < i * t.LAMPORTS_PER_SOL)
      );
    },
    "d",
    0,
    function (e) {
      return !Number.isFinite(e) || e <= 0
        ? 0
        : Math.min(Math.floor(e * t.LAMPORTS_PER_SOL), Number.MAX_SAFE_INTEGER);
    },
    "o",
    0,
    function ({
      quoteMintAddress: e,
      solAmount: a,
      usdcAmount: s,
      paymentOverride: u = null,
    }) {
      if (!(0, n.r)({ quoteMintAddress: e, hasRoutedSpend: null != u }))
        return o;
      let l = (0, r.k)(e ? new t.PublicKey(e) : void 0),
        c = null != u ? "usdc" === u : (0, r.w)(l),
        d = c ? 6 : 9;
      return c
        ? {
            isSupported: !0,
            isUsdcQuote: c,
            quoteAmount: s,
            quoteDecimals: d,
            buyLabel: s > 0 ? `Buy ${(0, i.c)(s)}` : "Buy",
            compactBuyLabel: s > 0 ? (0, i.c)(s) : "Buy",
            addFundsLabel: "Add USDC",
            iconSrc: n.H.usdc,
          }
        : {
            isSupported: !0,
            isUsdcQuote: c,
            quoteAmount: a,
            quoteDecimals: d,
            buyLabel: `Buy ${a} SOL`,
            compactBuyLabel: `${a}`,
            addFundsLabel: "Add SOL",
            iconSrc: n.H.sol,
          };
    },
  ]);
};
