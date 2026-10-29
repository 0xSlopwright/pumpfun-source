// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    i = e.i(662093),
    r = e.i(605587);
  let a = (e) => {
      if (void 0 === e || "" === e) return;
      let t = Number(e);
      return Number.isFinite(t) ? t : void 0;
    },
    n = (e) => e === t.FrameKind.LIVE || e === t.FrameKind.CORRECTION;
  e.s([
    "K",
    0,
    (e) => a(e.liquidityUsd?.value),
    "X",
    0,
    (e, { mint: n, traded: s, now: l = Date.now() }) => {
      let o = a(e.marketCapUsd?.value),
        d = a(e.priceUsd?.value),
        c = e.quote?.symbol === "SOL" ? a(e.priceQuote) : void 0,
        u = a(e.athMarketCapUsd?.value),
        m = e.asOf?.blockTime,
        p = a(
          e.windows.find((e) => e.kind === t.WindowKind.WINDOW_KIND_24H)
            ?.volumeUsd?.value,
        ),
        f = e.circulatingSupply,
        g = a(f?.raw),
        v = f?.decimals || e.decimals,
        h = void 0 === g || (0, r.N)({ mint: n }) ? void 0 : g / 10 ** v;
      return (
        void 0 !== d &&
          void 0 !== o &&
          (0, i.H)({ mint: n, priceUsd: d, marketCapUsd: o }),
        {
          ...(void 0 !== o ? { usdMarketCap: o } : {}),
          ...(void 0 !== d ? { priceUsd: d } : {}),
          ...(void 0 !== c ? { priceSol: c } : {}),
          ...(void 0 !== u ? { usdAthMarketCap: u } : {}),
          ...(void 0 !== p ? { volume24h: p } : {}),
          ...(void 0 !== h && Number.isFinite(h) && h > 0
            ? { wireSupply: h }
            : {}),
          ...(s ? { lastTradeTimestamp: m ? 1e3 * Number(m.seconds) : l } : {}),
          lastTradeIsBuy: e.lastSide === t.Side.BUY,
          isLiveData: !0,
          lastUpdated: l,
        }
      );
    },
    "q",
    0,
    (e) =>
      "frame" === e.kind &&
      "coin" === e.frame.payload.case &&
      !!e.frame.payload.value.market &&
      n(e.frame.payload.value.kind),
    "s",
    0,
    n,
  ]);
};
