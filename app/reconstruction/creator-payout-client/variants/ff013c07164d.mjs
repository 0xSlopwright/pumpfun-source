// Maintained source adaptation: one explicit original module instance; no original runtime execution.
export function createModule({
  useMemoCache,
  useInfiniteQuery,
  useQuery,
  createClient,
}) {
  var a = { c: useMemoCache },
    t = { useInfiniteQuery: useInfiniteQuery },
    r = { useQuery: useQuery },
    s = { j: createClient };
  function l(e) {
    let { lastPage: a, lastPageParam: t, loadedEntries: r } = e;
    return a.entries.length < 50 || r >= Math.min(500, a.totalEarners)
      ? null
      : t + 1;
  }
  class i extends Error {
    status;
    constructor(e) {
      (super(`Payout leaderboard failed (${e})`),
        (this.name = "PayoutLeaderboardFetchError"),
        (this.status = e));
    }
  }
  let n = (e) => ("string" == typeof e ? e : null),
    o = (e) => ("number" == typeof e && Number.isFinite(e) ? e : 0);
  function d(e) {
    var a;
    let t;
    if ("object" != typeof e || null === e) return null;
    let r = Array.isArray(e.wallets)
        ? e.wallets.filter((e) => "string" == typeof e)
        : [],
      s = o(e.rank);
    return s <= 0 || 0 === r.length
      ? null
      : {
          rank: s,
          userId: n(e.userId),
          username: n(e.username),
          profileImageUrl: n(e.profileImageUrl),
          isVerified: !0 === e.isVerified,
          verifiedBadgeVisible: !1 !== e.verifiedBadgeVisible,
          wallets: r,
          walletAddress: n(e.walletAddress),
          isViewer: "boolean" == typeof (t = e.isViewer) ? t : void 0,
          viewerFollows:
            "boolean" == typeof (a = e.viewerFollows)
              ? a
              : null === a
                ? null
                : void 0,
          totalPaidUsdc: o(e.totalPaidUsdc),
          payoutCount: o(e.payoutCount),
        };
  }
  async function u(e) {
    let { page: a, period: t = "all", signal: r } = e,
      l = await (0, s.j)()("GET /payouts/leaderboard", {
        query: { page: a, pageSize: 50, period: "all" === t ? void 0 : t },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: r,
        hooks: {
          afterResponse: [
            (e, a, t) => {
              if (!t.ok) throw new i(t.status);
            },
          ],
        },
      });
    return {
      entries: Array.isArray(l.entries)
        ? l.entries.map(d).filter((e) => null !== e)
        : [],
      totalEarners: o(l.totalEarners),
    };
  }
  async function c(e) {
    return o(
      (
        await (0, s.j)()("GET /payouts", {
          query: { page: 0, pageSize: 1 },
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: e.signal,
          hooks: {
            afterResponse: [
              (e, a, t) => {
                if (!t.ok) throw Error(`Payouts failed (${t.status})`);
              },
            ],
          },
        })
      ).totalPaidUsdc,
    );
  }
  let m = (e) => e instanceof i && 401 === e.status;
  function f(e, a) {
    return !m(a) && e < 1;
  }
  function p(e) {
    return !m(e.state.error);
  }
  function h(e) {
    return {
      entries: e.pages.flatMap(g),
      totalEarners: e.pages[0]?.totalEarners ?? 0,
    };
  }
  function g(e) {
    return e.entries;
  }
  function x(e, a, t) {
    return l({ lastPage: e, lastPageParam: t, loadedEntries: a.reduce(v, 0) });
  }
  function v(e, a) {
    return e + a.entries.length;
  }
  function w(e) {
    let { signal: a } = e;
    return c({ signal: a });
  }
  return {
    FetchError: i,
    requestLeaderboard: u,
    requestOwnTotal: c,
    nextPage: l,
    rowKey: function (e) {
      return e.userId ?? e.wallets[0] ?? `rank-${e.rank}`;
    },
    useLeaderboard: function (e) {
      let r,
        s,
        l,
        i,
        n = (0, a.c)(12),
        { period: o, isLoggedIn: d, enabled: c, refetchIntervalMs: g } = e,
        v = void 0 === o ? "all" : o,
        w = void 0 !== d && d;
      return (
        n[0] !== w || n[1] !== v
          ? ((r = ["payout-leaderboard", v, w]),
            (n[0] = w),
            (n[1] = v),
            (n[2] = r))
          : (r = n[2]),
        n[3] !== v
          ? ((s = (e) => {
              let { pageParam: a, signal: t } = e;
              return u({ page: a, period: v, signal: t });
            }),
            (n[3] = v),
            (n[4] = s))
          : (s = n[4]),
        n[5] !== g
          ? ((l = (e) =>
              (({ intervalMs: e, pageCount: a, error: t }) =>
                !(void 0 === e || a > 1 || m(t)) && e)({
                intervalMs: g,
                pageCount: e.state.data?.pages.length ?? 0,
                error: e.state.error,
              })),
            (n[5] = g),
            (n[6] = l))
          : (l = n[6]),
        n[7] !== c || n[8] !== r || n[9] !== s || n[10] !== l
          ? ((i = {
              queryKey: r,
              queryFn: s,
              initialPageParam: 0,
              getNextPageParam: x,
              select: h,
              enabled: c,
              staleTime: 6e4,
              refetchInterval: l,
              refetchIntervalInBackground: !1,
              refetchOnWindowFocus: p,
              retry: f,
            }),
            (n[7] = c),
            (n[8] = r),
            (n[9] = s),
            (n[10] = l),
            (n[11] = i))
          : (i = n[11]),
        (0, t.useInfiniteQuery)(i)
      );
    },
    useOwnTotal: function (e) {
      let t,
        s,
        l = (0, a.c)(5),
        { walletAddress: i, enabled: n } = e;
      l[0] !== i
        ? ((t = ["rewards-payouts-total", i]), (l[0] = i), (l[1] = t))
        : (t = l[1]);
      let o = n && !!i;
      return (
        l[2] !== t || l[3] !== o
          ? ((s = {
              queryKey: t,
              queryFn: w,
              enabled: o,
              staleTime: 36e5,
              retry: 1,
            }),
            (l[2] = t),
            (l[3] = o),
            (l[4] = s))
          : (s = l[4]),
        (0, r.useQuery)(s)
      );
    },
  };
}
