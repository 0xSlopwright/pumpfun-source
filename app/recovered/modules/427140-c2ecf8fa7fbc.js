// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(973374);
  let n = (e) => "number" == typeof e && Number.isFinite(e) && e > 0;
  e.s([
    "f",
    0,
    function (e, r) {
      let a = r?.priceUsd,
        i = r?.lastTradeTimestamp;
      return n(a) && n(i)
        ? { tokenUsdPrice: a, observedAtMs: i, source: "live_trade" }
        : {
            tokenUsdPrice: (0, t.J)(e),
            observedAtMs: e.last_trade_timestamp ?? e.updated_at ?? null,
            source: "coin_record",
          };
    },
  ]);
};
