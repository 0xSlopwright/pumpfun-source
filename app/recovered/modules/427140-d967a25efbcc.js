// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(973374);
  let i = (e) => "number" == typeof e && Number.isFinite(e) && e > 0;
  e.s([
    "f",
    0,
    function (e, r) {
      let n = r?.priceUsd,
        o = r?.lastTradeTimestamp;
      return i(n) && i(o)
        ? { tokenUsdPrice: n, observedAtMs: o, source: "live_trade" }
        : {
            tokenUsdPrice: (0, t.J)(e),
            observedAtMs: e.last_trade_timestamp ?? e.updated_at ?? null,
            source: "coin_record",
          };
    },
  ]);
};
