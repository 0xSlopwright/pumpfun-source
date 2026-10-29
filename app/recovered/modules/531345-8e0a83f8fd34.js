// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "L",
    0,
    ({ candleTimestamp: e, now: t }) => Number.isFinite(e) && t - e <= 3e5,
    "E",
    0,
    ({ row: e, candleTimestamp: t }) =>
      !e ||
      (!e.isLiveData &&
        ("number" != typeof e.lastTradeTimestamp || t > e.lastTradeTimestamp)),
  ]);
};
