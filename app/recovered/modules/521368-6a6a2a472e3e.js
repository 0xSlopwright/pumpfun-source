// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(690877),
    r = e.i(38279),
    i = e.i(636882),
    o = e.i(997627),
    s = e.i(693908);
  e.s([
    "f",
    0,
    (e, a, l, c) => {
      let u,
        d,
        m,
        E,
        f,
        I,
        T,
        p,
        g,
        _,
        S = (0, t.c)(35);
      S[0] !== a
        ? ((u = null != a && Number.isFinite(a) && a > 0 && (0, s.a)(a)),
          (S[0] = a),
          (S[1] = u))
        : (u = S[1]);
      let y = u;
      if (
        S[2] !== a ||
        S[3] !== e ||
        S[4] !== c?.chainId ||
        S[5] !== c?.timeframe ||
        S[6] !== y ||
        S[7] !== l
      ) {
        let t,
          o =
            null != a && Number.isFinite(a) && a > 0
              ? (0, s.Y)(a)
              : {
                  timeframe: r.v.COIN_LINE_CHART.TIMEFRAME,
                  width: r.v.COIN_LINE_CHART.WIDTH,
                },
          u = y ? (0, s.S)(a) : null;
        ((I = c?.timeframe ?? o.timeframe), (m = l ?? o.width));
        let T = c?.chainId;
        (S[13] !== a || S[14] !== e || S[15] !== T
          ? ((t = (0, i.f)({
              coinAddress: e,
              coinCreatedTimestamp: a,
              chainId: T,
            })),
            (S[13] = a),
            (S[14] = e),
            (S[15] = T),
            (S[16] = t))
          : (t = S[16]),
          (d = t),
          (f = n.useQuery),
          (E = y
            ? [
                ...r.Q.COIN_CANDLES({
                  coinAddress: e,
                  coinCreatedTimestamp: a ?? 0,
                  interval: u.interval,
                  limit: u.limit,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]
            : [
                ...r.Q.COIN_LINE_CHART({
                  coinAddress: e,
                  coinCreatedTimestamp: a ?? 0,
                  timeframe: I,
                  width: m,
                }),
                "sparklineCandlesticks",
                c?.chainId ?? null,
              ]),
          (S[2] = a),
          (S[3] = e),
          (S[4] = c?.chainId),
          (S[5] = c?.timeframe),
          (S[6] = y),
          (S[7] = l),
          (S[8] = d),
          (S[9] = m),
          (S[10] = E),
          (S[11] = f),
          (S[12] = I));
      } else ((d = S[8]), (m = S[9]), (E = S[10]), (f = S[11]), (I = S[12]));
      S[17] !== a ||
      S[18] !== e ||
      S[19] !== c?.chainId ||
      S[20] !== m ||
      S[21] !== I
        ? ((T = () =>
            (0, o.u)({
              coinAddress: e,
              coinCreatedTimestamp: a ?? 0,
              chainId: c?.chainId,
              timeframe: I,
              width: m,
            })),
          (S[17] = a),
          (S[18] = e),
          (S[19] = c?.chainId),
          (S[20] = m),
          (S[21] = I),
          (S[22] = T))
        : (T = S[22]);
      let h = c?.staleTime ?? (y ? 15e3 : 3e5),
        A = c?.refetchInterval;
      S[23] !== d || S[24] !== E || S[25] !== T || S[26] !== h || S[27] !== A
        ? ((p = {
            queryKey: E,
            queryFn: T,
            enabled: d,
            staleTime: h,
            gcTime: 6e5,
            retry: 1,
            retryDelay: 2e3,
            refetchInterval: A,
          }),
          (S[23] = d),
          (S[24] = E),
          (S[25] = T),
          (S[26] = h),
          (S[27] = A),
          (S[28] = p))
        : (p = S[28]);
      let { data: O, isLoading: v, error: L } = f(p);
      return (
        S[29] !== O ? ((g = O || []), (S[29] = O), (S[30] = g)) : (g = S[30]),
        S[31] !== v || S[32] !== g || S[33] !== L
          ? ((_ = { candlesticks: g, isLoading: v, error: L }),
            (S[31] = v),
            (S[32] = g),
            (S[33] = L),
            (S[34] = _))
          : (_ = S[34]),
        _
      );
    },
  ]);
};
