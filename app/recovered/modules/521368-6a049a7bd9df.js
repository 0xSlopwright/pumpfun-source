// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(690877),
    a = e.i(38279),
    l = e.i(636882),
    n = e.i(997627),
    i = e.i(693908);
  e.s([
    "f",
    0,
    (e, s, o, c) => {
      let d,
        u,
        m,
        h,
        f,
        x,
        p,
        v,
        b,
        g,
        y = (0, t.c)(35);
      y[0] !== s
        ? ((d = null != s && Number.isFinite(s) && s > 0 && (0, i.a)(s)),
          (y[0] = s),
          (y[1] = d))
        : (d = y[1]);
      let j = d;
      if (
        y[2] !== s ||
        y[3] !== e ||
        y[4] !== c?.chainId ||
        y[5] !== c?.timeframe ||
        y[6] !== j ||
        y[7] !== o
      ) {
        let t,
          n =
            null != s && Number.isFinite(s) && s > 0
              ? (0, i.Y)(s)
              : {
                  timeframe: a.v.COIN_LINE_CHART.TIMEFRAME,
                  width: a.v.COIN_LINE_CHART.WIDTH,
                },
          d = j ? (0, i.S)(s) : null;
        ((x = c?.timeframe ?? n.timeframe), (m = o ?? n.width));
        let p = c?.chainId;
        (y[13] !== s || y[14] !== e || y[15] !== p
          ? ((t = (0, l.f)({
              coinAddress: e,
              coinCreatedTimestamp: s,
              chainId: p,
            })),
            (y[13] = s),
            (y[14] = e),
            (y[15] = p),
            (y[16] = t))
          : (t = y[16]),
          (u = t),
          (f = r.useQuery),
          (h = j
            ? [
                ...a.Q.COIN_CANDLES({
                  coinAddress: e,
                  coinCreatedTimestamp: s ?? 0,
                  interval: d.interval,
                  limit: d.limit,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]
            : [
                ...a.Q.COIN_LINE_CHART({
                  coinAddress: e,
                  coinCreatedTimestamp: s ?? 0,
                  timeframe: x,
                  width: m,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]),
          (y[2] = s),
          (y[3] = e),
          (y[4] = c?.chainId),
          (y[5] = c?.timeframe),
          (y[6] = j),
          (y[7] = o),
          (y[8] = u),
          (y[9] = m),
          (y[10] = h),
          (y[11] = f),
          (y[12] = x));
      } else ((u = y[8]), (m = y[9]), (h = y[10]), (f = y[11]), (x = y[12]));
      y[17] !== s ||
      y[18] !== e ||
      y[19] !== c?.chainId ||
      y[20] !== m ||
      y[21] !== x
        ? ((p = () =>
            (0, n.u)({
              coinAddress: e,
              coinCreatedTimestamp: s ?? 0,
              chainId: c?.chainId,
              timeframe: x,
              width: m,
            })),
          (y[17] = s),
          (y[18] = e),
          (y[19] = c?.chainId),
          (y[20] = m),
          (y[21] = x),
          (y[22] = p))
        : (p = y[22]);
      let N = c?.staleTime ?? (j ? 15e3 : 3e5),
        w = c?.refetchInterval;
      y[23] !== u || y[24] !== h || y[25] !== p || y[26] !== N || y[27] !== w
        ? ((v = {
            queryKey: h,
            queryFn: p,
            enabled: u,
            staleTime: N,
            gcTime: 6e5,
            retry: 1,
            retryDelay: 2e3,
            refetchInterval: w,
          }),
          (y[23] = u),
          (y[24] = h),
          (y[25] = p),
          (y[26] = N),
          (y[27] = w),
          (y[28] = v))
        : (v = y[28]);
      let { data: k, isLoading: _, error: C } = f(v);
      return (
        y[29] !== k ? ((b = k || []), (y[29] = k), (y[30] = b)) : (b = y[30]),
        y[31] !== _ || y[32] !== b || y[33] !== C
          ? ((g = { candlesticks: b, isLoading: _, error: C }),
            (y[31] = _),
            (y[32] = b),
            (y[33] = C),
            (y[34] = g))
          : (g = y[34]),
        g
      );
    },
  ]);
};
