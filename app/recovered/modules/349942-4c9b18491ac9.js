// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(38279),
    i = e.i(505835);
  async function r(e) {
    let {
        coinAddress: r,
        chainId: a,
        fetchOptions: n,
        interval: l = t.v.COIN_CANDLES.INTERVAL,
        limit: s = t.v.COIN_CANDLES.LIMIT,
        to: o,
      } = e,
      d = (0, i.U)({ mint: r, chainId: a });
    if (!d) throw Error("Failed to fetch coin candles");
    return (
      await (0, i.Z)({
        chainId: d,
        address: r,
        interval: l,
        measure: "price_usd",
        count: s,
        beforeTs: void 0 !== o ? Math.floor(o) + 1 : void 0,
        init: n,
      })
    ).candles.map((e) => ({
      timestamp: e.timestamp,
      open: String(e.open),
      high: String(e.high),
      low: String(e.low),
      close: String(e.close),
      volume: String(e.volume),
    }));
  }
  e.s(["f", 0, r]);
};
