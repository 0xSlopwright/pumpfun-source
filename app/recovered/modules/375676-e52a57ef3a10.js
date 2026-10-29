// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(690877),
    r = e.i(38279),
    n = e.i(636882),
    a = e.i(997627),
    l = e.i(693908);
  e.s([
    "f",
    0,
    function (e) {
      let s,
        o,
        c,
        m,
        u,
        d,
        f,
        h,
        p = (0, t.c)(31),
        {
          coinAddress: x,
          coinCreatedTimestamp: b,
          chainId: v,
          timeframe: y,
          width: g,
          queryOptions: w,
          youngCoinSource: N,
        } = e,
        _ = void 0 === N ? "candles" : N;
      p[0] !== b || p[1] !== _
        ? ((s = "candles" === _ && (0, l.a)(b)),
          (p[0] = b),
          (p[1] = _),
          (p[2] = s))
        : (s = p[2]);
      let E = s;
      if (
        p[3] !== v ||
        p[4] !== x ||
        p[5] !== b ||
        p[6] !== w ||
        p[7] !== y ||
        p[8] !== E ||
        p[9] !== g ||
        p[10] !== _
      ) {
        let e,
          t,
          s = (0, l.Y)(b),
          h = E ? (0, l.S)(b) : null,
          N = y ?? s.timeframe,
          j = g ?? s.width;
        (p[17] !== v || p[18] !== x || p[19] !== b
          ? ((e = (0, n.f)({
              coinAddress: x,
              coinCreatedTimestamp: b,
              chainId: v,
            })),
            (p[17] = v),
            (p[18] = x),
            (p[19] = b),
            (p[20] = e))
          : (e = p[20]),
          (c = e),
          p[21] !== w ? ((t = w ?? {}), (p[21] = w), (p[22] = t)) : (t = p[22]),
          p[23] !== t
            ? (({ enabled: o, ...m } = t),
              (p[23] = t),
              (p[24] = o),
              (p[25] = m))
            : ((o = p[24]), (m = p[25])),
          (f = i.useQuery),
          (u = () =>
            (0, a.B)({
              coinAddress: x,
              coinCreatedTimestamp: b,
              chainId: v,
              timeframe: N,
              width: j,
              youngCoinSource: _,
            })),
          (d = E
            ? [
                ...r.Q.COIN_CANDLES({
                  coinAddress: x,
                  coinCreatedTimestamp: b,
                  interval: h.interval,
                  limit: h.limit,
                }),
                "sparklineLineChartPoints",
                v ?? null,
              ]
            : [
                ...r.Q.COIN_LINE_CHART({
                  coinAddress: x,
                  coinCreatedTimestamp: b,
                  timeframe: N,
                  width: j,
                }),
                "sparklineLineChartPoints",
                v ?? null,
              ]),
          (p[3] = v),
          (p[4] = x),
          (p[5] = b),
          (p[6] = w),
          (p[7] = y),
          (p[8] = E),
          (p[9] = g),
          (p[10] = _),
          (p[11] = o),
          (p[12] = c),
          (p[13] = m),
          (p[14] = u),
          (p[15] = d),
          (p[16] = f));
      } else
        ((o = p[11]),
          (c = p[12]),
          (m = p[13]),
          (u = p[14]),
          (d = p[15]),
          (f = p[16]));
      let j = c && (o ?? !0);
      return (
        p[26] !== m || p[27] !== u || p[28] !== d || p[29] !== j
          ? ((h = { queryFn: u, queryKey: d, ...m, enabled: j }),
            (p[26] = m),
            (p[27] = u),
            (p[28] = d),
            (p[29] = j),
            (p[30] = h))
          : (h = p[30]),
        f(h)
      );
    },
  ]);
};
