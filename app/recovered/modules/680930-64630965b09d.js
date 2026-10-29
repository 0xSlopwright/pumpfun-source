// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(965690);
  let i = {
    INTERVALS: ["5m", "1h", "6h", "24h"],
    METRICS: ["numTxs", "volumeUSD", "numUsers", "priceChangePercent"],
    STALE_TIME: 3e5,
    CACHE_TIME: 6e5,
    POLLING_INTERVAL: 3e4,
    QUERY_KEY: "marketActivity",
    BATCH_SIZE: 50,
  };
  function r(e, t) {
    return !!e && !!t && !!e[t]?.["24h"];
  }
  e.s([
    "t",
    0,
    i,
    "$",
    0,
    function (e, t = i.BATCH_SIZE) {
      if (!e || 0 === e.length) return [];
      let r = Array.from(new Set(e)).filter(Boolean).sort(),
        n = [];
      for (let e = 0; e < r.length; e += t) n.push(r.slice(e, e + t));
      return n;
    },
    "P",
    0,
    function (e, t) {
      return t && 0 !== t.length ? t.filter((t) => !r(e, t)) : [];
    },
    "F",
    0,
    function (e, i) {
      return e && i
        ? ((0, t.r)({ activity: e[i], window: "24h", metric: "volumeUSD" }) ??
            0)
        : 0;
    },
    "G",
    0,
    r,
    "c",
    0,
    function (e, t) {
      if (e === t) return !0;
      if (!e || !t) return !1;
      let i = Object.keys(e),
        r = Object.keys(t);
      return (
        i.length === r.length &&
        i.every((i) => {
          let r = e[i],
            n = t[i];
          return (
            r === n ||
            (!!r &&
              !!n &&
              r["24h"]?.volumeUSD === n["24h"]?.volumeUSD &&
              r["24h"]?.priceChangePercent === n["24h"]?.priceChangePercent)
          );
        })
      );
    },
    "d",
    0,
    function (e) {
      if (!e || 0 === e.length) return {};
      let t = {};
      return (
        e.forEach((e) => {
          e && "object" == typeof e && Object.assign(t, e);
        }),
        t
      );
    },
  ]);
};
