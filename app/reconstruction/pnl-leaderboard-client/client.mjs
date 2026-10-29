// Source-derived maintained adapter. Captured runtime imports/exports are replaced by explicit capabilities.
export function createPnlLeaderboardClient({
  useMemoCache,
  useWallet,
  useQuery,
  createClient,
}) {
  var t = { c: useMemoCache },
    r = { F: useWallet },
    i = { useQuery: useQuery },
    n = { j: createClient };
  async function s(e) {
    let { period: t, sort: r, limit: i, signal: s } = e;
    return await (0, n.j)()("GET /pnl-leaderboard", {
      query: { period: t, sort: r, limit: i },
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: s,
      hooks: {
        afterResponse: [
          (e, t, r) => {
            if (!r.ok)
              throw Error(`Failed to fetch pnl leaderboard: ${r.status}`);
          },
        ],
      },
    });
  }
  return {
    request: s,
    score: (e, t) =>
      "realized" === t
        ? e.realizedPnlUsd
        : "unrealized" === t
          ? e.unrealizedPnlUsd
          : e.pnlUsd,
    useLeaderboard: (e) => {
      let n,
        l,
        a,
        o,
        u,
        c = (0, t.c)(19),
        { period: d, sort: f, limit: h, enabled: m, refetchIntervalMs: p } = e,
        b = void 0 === m || m,
        { address: g } = (0, r.F)();
      c[0] !== g
        ? ((n = g?.toLowerCase() ?? null), (c[0] = g), (c[1] = n))
        : (n = c[1]);
      let y = n;
      c[2] !== h || c[3] !== d || c[4] !== f || c[5] !== y
        ? ((l = ["pnl-leaderboard", "board", d, f, h, y]),
          (c[2] = h),
          (c[3] = d),
          (c[4] = f),
          (c[5] = y),
          (c[6] = l))
        : (l = c[6]);
      let v = l;
      c[7] !== h || c[8] !== d || c[9] !== f
        ? ((a = (e) => {
            let { signal: t } = e;
            return s({ period: d, sort: f, limit: h, signal: t });
          }),
          (c[7] = h),
          (c[8] = d),
          (c[9] = f),
          (c[10] = a))
        : (a = c[10]);
      let w = p ?? !1;
      return (
        c[11] !== y
          ? ((o = (e, t) => {
              if (e)
                return t?.queryKey.at(-1) === y
                  ? e
                  : {
                      ...e,
                      viewer: void 0,
                      entries: e.entries.map((e) => {
                        let t = { ...e };
                        return (delete t.isViewer, delete t.viewerFollows, t);
                      }),
                    };
            }),
            (c[11] = y),
            (c[12] = o))
          : (o = c[12]),
        c[13] !== b || c[14] !== v || c[15] !== a || c[16] !== w || c[17] !== o
          ? ((u = {
              queryKey: v,
              queryFn: a,
              enabled: b,
              staleTime: 6e4,
              refetchInterval: w,
              placeholderData: o,
            }),
            (c[13] = b),
            (c[14] = v),
            (c[15] = a),
            (c[16] = w),
            (c[17] = o),
            (c[18] = u))
          : (u = c[18]),
        (0, i.useQuery)(u)
      );
    },
  };
}
