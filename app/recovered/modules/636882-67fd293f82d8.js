// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(646908);
  e.s(
    [
      "f",
      0,
      ({ coinAddress: e, coinCreatedTimestamp: i, chainId: r }) =>
        !!e &&
        (!!(0, t.L)(r) ||
          ("number" == typeof i && Number.isFinite(i) && i > 0)),
    ],
    636882,
  );
  var i = e.i(349942),
    r = e.i(38279),
    n = e.i(505835),
    a = e.i(628731);
  async function l(e) {
    let {
        coinAddress: t,
        coinCreatedTimestamp: i,
        chainId: l,
        fetchOptions: s,
        timeframe: o = r.v.COIN_LINE_CHART.TIMEFRAME,
        width: c = r.v.COIN_LINE_CHART.WIDTH,
      } = e,
      m = (0, n.U)({ mint: t, chainId: l }),
      u = (0, a.b)({ createdTs: i, timeframe: o, width: c });
    if (!m || !u) throw Error(`Failed to fetch coin line chart: ${o}`);
    return (
      await (0, n.x)({
        chainId: m,
        address: t,
        ...u,
        measure: "price_usd",
        init: s,
      })
    ).points;
  }
  function s(e, t = Date.now()) {
    return !!Number.isFinite(e) && !(e <= 0) && 36e5 >= Math.max(0, t - e);
  }
  function o(e, t = Date.now()) {
    let i = Math.max(0, t - e);
    return i < 3e5
      ? { interval: "1s", limit: 300 }
      : i < 9e5
        ? { interval: "15s", limit: 65 }
        : i < 18e5
          ? { interval: "30s", limit: 65 }
          : { interval: "1m", limit: 65 };
  }
  function c(e, t = Date.now()) {
    return {
      timeframe: (function (e, t = Date.now()) {
        if (!Number.isFinite(e) || e <= 0) return r.v.COIN_LINE_CHART.TIMEFRAME;
        let i = Math.max(0, t - e);
        return i < 3e5
          ? "1m"
          : i < 9e5
            ? "5m"
            : i < 36e5
              ? "15m"
              : i < 216e5
                ? "30m"
                : i < 864e5
                  ? "6h"
                  : i < 1728e5
                    ? "24h"
                    : "1w";
      })(e, t),
      width: (function (e, t = Date.now()) {
        var i;
        return !Number.isFinite(e) || e <= 0
          ? r.v.COIN_LINE_CHART.WIDTH
          : (i = Math.max(0, t - e)) < 3e5
            ? 24
            : i < 9e5
              ? 28
              : i < 18e5
                ? 32
                : i < 36e5
                  ? 52
                  : i < 216e5
                    ? 64
                    : i < 864e5
                      ? 68
                      : i < 1728e5
                        ? 72
                        : r.v.COIN_LINE_CHART.WIDTH;
      })(e, t),
    };
  }
  async function m(e) {
    let {
      coinAddress: t,
      coinCreatedTimestamp: r,
      chainId: n,
      fetchOptions: a,
      timeframe: m,
      width: u,
      youngCoinSource: d = "candles",
    } = e;
    if ("candles" === d && s(r)) {
      let { interval: e, limit: l } = o(r),
        s = (0, i.f)({
          coinAddress: t,
          coinCreatedTimestamp: r,
          chainId: n,
          interval: e,
          limit: l,
          fetchOptions: a,
        });
      return (await s)
        .map((e) => ({ time: e.timestamp, price: Number(e.close) }))
        .filter(
          (e) =>
            Number.isFinite(e.time) && Number.isFinite(e.price) && e.price >= 0,
        );
    }
    let { timeframe: f, width: h } = c(r);
    return l({
      coinAddress: t,
      coinCreatedTimestamp: r,
      chainId: n,
      fetchOptions: a,
      timeframe: m ?? f,
      width: u ?? h,
    });
  }
  async function u(e) {
    let {
      coinAddress: t,
      coinCreatedTimestamp: r,
      chainId: n,
      fetchOptions: a,
      timeframe: m,
      width: u,
    } = e;
    if (s(r)) {
      var d;
      let { interval: e, limit: l } = o(r),
        s = (0, i.f)({
          coinAddress: t,
          coinCreatedTimestamp: r,
          chainId: n,
          interval: e,
          limit: l,
          fetchOptions: a,
        });
      return (
        (d = await s),
        d
          .map((e) => ({
            close: Number(e.close),
            high: Number(e.high),
            low: Number(e.low),
            mint: t,
            open: Number(e.open),
            time: e.timestamp,
            timestamp: e.timestamp,
            volume: Number(e.volume),
          }))
          .filter(
            (e) =>
              Number.isFinite(e.timestamp) &&
              Number.isFinite(e.close) &&
              Number.isFinite(e.open),
          )
      );
    }
    let { timeframe: f, width: h } = c(r),
      p = l({
        coinAddress: t,
        coinCreatedTimestamp: r,
        chainId: n,
        fetchOptions: a,
        timeframe: m ?? f,
        width: u ?? h,
      });
    return (await p).map((e) => ({
      close: e.price,
      high: e.price,
      low: e.price,
      mint: t,
      open: e.price,
      time: e.time,
      timestamp: e.time,
      volume: 0,
    }));
  }
  (e.s(["S", 0, o, "Y", 0, c, "a", 0, s], 693908),
    e.s(["u", 0, u, "B", 0, m], 997627));
};
