// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370),
    i = e.i(90832),
    o = e.i(655397),
    n = e.i(642357);
  let r = {
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
      quoteDecimals: o,
      solBalanceLamports: n,
      usdcBalanceRaw: r,
    }) {
      return (
        !!Number.isFinite(i) &&
        !(i <= 0) &&
        (e
          ? null != r && Number(r) < i * 10 ** o
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
      solAmount: u,
      usdcAmount: a,
      paymentOverride: l = null,
    }) {
      if (!(0, n.r)({ quoteMintAddress: e, hasRoutedSpend: null != l }))
        return r;
      let s = (0, o.k)(e ? new t.PublicKey(e) : void 0),
        c = null != l ? "usdc" === l : (0, o.w)(s),
        d = c ? 6 : 9;
      return c
        ? {
            isSupported: !0,
            isUsdcQuote: c,
            quoteAmount: a,
            quoteDecimals: d,
            buyLabel: a > 0 ? `Buy ${(0, i.c)(a)}` : "Buy",
            compactBuyLabel: a > 0 ? (0, i.c)(a) : "Buy",
            addFundsLabel: "Add USDC",
            iconSrc: n.H.usdc,
          }
        : {
            isSupported: !0,
            isUsdcQuote: c,
            quoteAmount: u,
            quoteDecimals: d,
            buyLabel: `Buy ${u} SOL`,
            compactBuyLabel: `${u}`,
            addFundsLabel: "Add SOL",
            iconSrc: n.H.sol,
          };
    },
  ]);
};
