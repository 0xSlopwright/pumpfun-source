// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(690877),
    i = e.i(38279),
    a = e.i(636882),
    n = e.i(997627),
    l = e.i(693908);
  e.s([
    "f",
    0,
    (e, s, o, c) => {
      let m,
        d,
        u,
        h,
        f,
        x,
        p,
        g,
        v,
        b,
        y = (0, t.c)(35);
      y[0] !== s
        ? ((m = null != s && Number.isFinite(s) && s > 0 && (0, l.a)(s)),
          (y[0] = s),
          (y[1] = m))
        : (m = y[1]);
      let w = m;
      if (
        y[2] !== s ||
        y[3] !== e ||
        y[4] !== c?.chainId ||
        y[5] !== c?.timeframe ||
        y[6] !== w ||
        y[7] !== o
      ) {
        let t,
          n =
            null != s && Number.isFinite(s) && s > 0
              ? (0, l.Y)(s)
              : {
                  timeframe: i.v.COIN_LINE_CHART.TIMEFRAME,
                  width: i.v.COIN_LINE_CHART.WIDTH,
                },
          m = w ? (0, l.S)(s) : null;
        ((x = c?.timeframe ?? n.timeframe), (u = o ?? n.width));
        let p = c?.chainId;
        (y[13] !== s || y[14] !== e || y[15] !== p
          ? ((t = (0, a.f)({
              coinAddress: e,
              coinCreatedTimestamp: s,
              chainId: p,
            })),
            (y[13] = s),
            (y[14] = e),
            (y[15] = p),
            (y[16] = t))
          : (t = y[16]),
          (d = t),
          (f = r.useQuery),
          (h = w
            ? [
                ...i.Q.COIN_CANDLES({
                  coinAddress: e,
                  coinCreatedTimestamp: s ?? 0,
                  interval: m.interval,
                  limit: m.limit,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]
            : [
                ...i.Q.COIN_LINE_CHART({
                  coinAddress: e,
                  coinCreatedTimestamp: s ?? 0,
                  timeframe: x,
                  width: u,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]),
          (y[2] = s),
          (y[3] = e),
          (y[4] = c?.chainId),
          (y[5] = c?.timeframe),
          (y[6] = w),
          (y[7] = o),
          (y[8] = d),
          (y[9] = u),
          (y[10] = h),
          (y[11] = f),
          (y[12] = x));
      } else ((d = y[8]), (u = y[9]), (h = y[10]), (f = y[11]), (x = y[12]));
      y[17] !== s ||
      y[18] !== e ||
      y[19] !== c?.chainId ||
      y[20] !== u ||
      y[21] !== x
        ? ((p = () =>
            (0, n.u)({
              coinAddress: e,
              coinCreatedTimestamp: s ?? 0,
              chainId: c?.chainId,
              timeframe: x,
              width: u,
            })),
          (y[17] = s),
          (y[18] = e),
          (y[19] = c?.chainId),
          (y[20] = u),
          (y[21] = x),
          (y[22] = p))
        : (p = y[22]);
      let j = c?.staleTime ?? (w ? 15e3 : 3e5),
        N = c?.refetchInterval;
      y[23] !== d || y[24] !== h || y[25] !== p || y[26] !== j || y[27] !== N
        ? ((g = {
            queryKey: h,
            queryFn: p,
            enabled: d,
            staleTime: j,
            gcTime: 6e5,
            retry: 1,
            retryDelay: 2e3,
            refetchInterval: N,
          }),
          (y[23] = d),
          (y[24] = h),
          (y[25] = p),
          (y[26] = j),
          (y[27] = N),
          (y[28] = g))
        : (g = y[28]);
      let { data: _, isLoading: k, error: S } = f(g);
      return (
        y[29] !== _ ? ((v = _ || []), (y[29] = _), (y[30] = v)) : (v = y[30]),
        y[31] !== k || y[32] !== v || y[33] !== S
          ? ((b = { candlesticks: v, isLoading: k, error: S }),
            (y[31] = k),
            (y[32] = v),
            (y[33] = S),
            (y[34] = b))
          : (b = y[34]),
        b
      );
    },
  ]);
};
