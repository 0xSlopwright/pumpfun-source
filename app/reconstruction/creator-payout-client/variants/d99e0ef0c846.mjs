// Maintained source adaptation: one explicit original module instance; no original runtime execution.
export function createModule({
  useMemoCache,
  useInfiniteQuery,
  useQuery,
  createClient,
}) {
  var t = { c: useMemoCache },
    r = { useInfiniteQuery: useInfiniteQuery },
    a = { useQuery: useQuery },
    l = { j: createClient };
  function s(e) {
    let { lastPage: t, lastPageParam: r, loadedEntries: a } = e;
    return t.entries.length < 50 || a >= Math.min(500, t.totalEarners)
      ? null
      : r + 1;
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
    var t;
    let r;
    if ("object" != typeof e || null === e) return null;
    let a = Array.isArray(e.wallets)
        ? e.wallets.filter((e) => "string" == typeof e)
        : [],
      l = o(e.rank);
    return l <= 0 || 0 === a.length
      ? null
      : {
          rank: l,
          userId: n(e.userId),
          username: n(e.username),
          profileImageUrl: n(e.profileImageUrl),
          isVerified: !0 === e.isVerified,
          verifiedBadgeVisible: !1 !== e.verifiedBadgeVisible,
          wallets: a,
          walletAddress: n(e.walletAddress),
          isViewer: "boolean" == typeof (r = e.isViewer) ? r : void 0,
          viewerFollows:
            "boolean" == typeof (t = e.viewerFollows)
              ? t
              : null === t
                ? null
                : void 0,
          totalPaidUsdc: o(e.totalPaidUsdc),
          payoutCount: o(e.payoutCount),
        };
  }
  async function u(e) {
    let { page: t, period: r = "all", signal: a } = e,
      s = await (0, l.j)()("GET /payouts/leaderboard", {
        query: { page: t, pageSize: 50, period: "all" === r ? void 0 : r },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: a,
        hooks: {
          afterResponse: [
            (e, t, r) => {
              if (!r.ok) throw new i(r.status);
            },
          ],
        },
      });
    return {
      entries: Array.isArray(s.entries)
        ? s.entries.map(d).filter((e) => null !== e)
        : [],
      totalEarners: o(s.totalEarners),
    };
  }
  async function c(e) {
    return o(
      (
        await (0, l.j)()("GET /payouts", {
          query: { page: 0, pageSize: 1 },
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: e.signal,
          hooks: {
            afterResponse: [
              (e, t, r) => {
                if (!r.ok) throw Error(`Payouts failed (${r.status})`);
              },
            ],
          },
        })
      ).totalPaidUsdc,
    );
  }
  let f = (e) => e instanceof i && 401 === e.status;
  function m(e, t) {
    return !f(t) && e < 1;
  }
  function p(e) {
    return !f(e.state.error);
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
  function b(e, t, r) {
    return s({ lastPage: e, lastPageParam: r, loadedEntries: t.reduce(w, 0) });
  }
  function w(e, t) {
    return e + t.entries.length;
  }
  function y(e) {
    let { signal: t } = e;
    return c({ signal: t });
  }
  return {
    FetchError: i,
    requestLeaderboard: u,
    requestOwnTotal: c,
    nextPage: s,
    rowKey: function (e) {
      return e.userId ?? e.wallets[0] ?? `rank-${e.rank}`;
    },
    useLeaderboard: function (e) {
      let a,
        l,
        s,
        i,
        n = (0, t.c)(12),
        { period: o, isLoggedIn: d, enabled: c, refetchIntervalMs: g } = e,
        w = void 0 === o ? "all" : o,
        y = void 0 !== d && d;
      return (
        n[0] !== y || n[1] !== w
          ? ((a = ["payout-leaderboard", w, y]),
            (n[0] = y),
            (n[1] = w),
            (n[2] = a))
          : (a = n[2]),
        n[3] !== w
          ? ((l = (e) => {
              let { pageParam: t, signal: r } = e;
              return u({ page: t, period: w, signal: r });
            }),
            (n[3] = w),
            (n[4] = l))
          : (l = n[4]),
        n[5] !== g
          ? ((s = (e) =>
              (({ intervalMs: e, pageCount: t, error: r }) =>
                !(void 0 === e || t > 1 || f(r)) && e)({
                intervalMs: g,
                pageCount: e.state.data?.pages.length ?? 0,
                error: e.state.error,
              })),
            (n[5] = g),
            (n[6] = s))
          : (s = n[6]),
        n[7] !== c || n[8] !== a || n[9] !== l || n[10] !== s
          ? ((i = {
              queryKey: a,
              queryFn: l,
              initialPageParam: 0,
              getNextPageParam: b,
              select: h,
              enabled: c,
              staleTime: 6e4,
              refetchInterval: s,
              refetchIntervalInBackground: !1,
              refetchOnWindowFocus: p,
              retry: m,
            }),
            (n[7] = c),
            (n[8] = a),
            (n[9] = l),
            (n[10] = s),
            (n[11] = i))
          : (i = n[11]),
        (0, r.useInfiniteQuery)(i)
      );
    },
    useOwnTotal: function (e) {
      let r,
        l,
        s = (0, t.c)(5),
        { walletAddress: i, enabled: n } = e;
      s[0] !== i
        ? ((r = ["rewards-payouts-total", i]), (s[0] = i), (s[1] = r))
        : (r = s[1]);
      let o = n && !!i;
      return (
        s[2] !== r || s[3] !== o
          ? ((l = {
              queryKey: r,
              queryFn: y,
              enabled: o,
              staleTime: 36e5,
              retry: 1,
            }),
            (s[2] = r),
            (s[3] = o),
            (s[4] = l))
          : (l = s[4]),
        (0, a.useQuery)(l)
      );
    },
  };
}
