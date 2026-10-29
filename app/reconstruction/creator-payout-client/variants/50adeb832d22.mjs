// Maintained source adaptation: one explicit original module instance; no original runtime execution.
export function createModule({
  useMemoCache,
  useInfiniteQuery,
  useQuery,
  createClient,
}) {
  var t = { c: useMemoCache },
    i = { useInfiniteQuery: useInfiniteQuery },
    l = { useQuery: useQuery },
    r = { j: createClient };
  function a(e) {
    let { lastPage: t, lastPageParam: i, loadedEntries: l } = e;
    return t.entries.length < 50 || l >= Math.min(500, t.totalEarners)
      ? null
      : i + 1;
  }
  class n extends Error {
    status;
    constructor(e) {
      (super(`Payout leaderboard failed (${e})`),
        (this.name = "PayoutLeaderboardFetchError"),
        (this.status = e));
    }
  }
  let o = (e) => ("string" == typeof e ? e : null),
    s = (e) => ("number" == typeof e && Number.isFinite(e) ? e : 0);
  function d(e) {
    var t;
    let i;
    if ("object" != typeof e || null === e) return null;
    let l = Array.isArray(e.wallets)
        ? e.wallets.filter((e) => "string" == typeof e)
        : [],
      r = s(e.rank);
    return r <= 0 || 0 === l.length
      ? null
      : {
          rank: r,
          userId: o(e.userId),
          username: o(e.username),
          profileImageUrl: o(e.profileImageUrl),
          isVerified: !0 === e.isVerified,
          verifiedBadgeVisible: !1 !== e.verifiedBadgeVisible,
          wallets: l,
          walletAddress: o(e.walletAddress),
          isViewer: "boolean" == typeof (i = e.isViewer) ? i : void 0,
          viewerFollows:
            "boolean" == typeof (t = e.viewerFollows)
              ? t
              : null === t
                ? null
                : void 0,
          totalPaidUsdc: s(e.totalPaidUsdc),
          payoutCount: s(e.payoutCount),
        };
  }
  async function u(e) {
    let { page: t, period: i = "all", signal: l } = e,
      a = await (0, r.j)()("GET /payouts/leaderboard", {
        query: { page: t, pageSize: 50, period: "all" === i ? void 0 : i },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: l,
        hooks: {
          afterResponse: [
            (e, t, i) => {
              if (!i.ok) throw new n(i.status);
            },
          ],
        },
      });
    return {
      entries: Array.isArray(a.entries)
        ? a.entries.map(d).filter((e) => null !== e)
        : [],
      totalEarners: s(a.totalEarners),
    };
  }
  async function c(e) {
    return s(
      (
        await (0, r.j)()("GET /payouts", {
          query: { page: 0, pageSize: 1 },
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: e.signal,
          hooks: {
            afterResponse: [
              (e, t, i) => {
                if (!i.ok) throw Error(`Payouts failed (${i.status})`);
              },
            ],
          },
        })
      ).totalPaidUsdc,
    );
  }
  let m = (e) => e instanceof n && 401 === e.status;
  function p(e, t) {
    return !m(t) && e < 1;
  }
  function f(e) {
    return !m(e.state.error);
  }
  function I(e) {
    return {
      entries: e.pages.flatMap(h),
      totalEarners: e.pages[0]?.totalEarners ?? 0,
    };
  }
  function h(e) {
    return e.entries;
  }
  function y(e, t, i) {
    return a({ lastPage: e, lastPageParam: i, loadedEntries: t.reduce(g, 0) });
  }
  function g(e, t) {
    return e + t.entries.length;
  }
  function x(e) {
    let { signal: t } = e;
    return c({ signal: t });
  }
  return {
    FetchError: n,
    requestLeaderboard: u,
    requestOwnTotal: c,
    nextPage: a,
    rowKey: function (e) {
      return e.userId ?? e.wallets[0] ?? `rank-${e.rank}`;
    },
    useLeaderboard: function (e) {
      let l,
        r,
        a,
        n,
        o = (0, t.c)(12),
        { period: s, isLoggedIn: d, enabled: c, refetchIntervalMs: h } = e,
        g = void 0 === s ? "all" : s,
        x = void 0 !== d && d;
      return (
        o[0] !== x || o[1] !== g
          ? ((l = ["payout-leaderboard", g, x]),
            (o[0] = x),
            (o[1] = g),
            (o[2] = l))
          : (l = o[2]),
        o[3] !== g
          ? ((r = (e) => {
              let { pageParam: t, signal: i } = e;
              return u({ page: t, period: g, signal: i });
            }),
            (o[3] = g),
            (o[4] = r))
          : (r = o[4]),
        o[5] !== h
          ? ((a = (e) =>
              (({ intervalMs: e, pageCount: t, error: i }) =>
                !(void 0 === e || t > 1 || m(i)) && e)({
                intervalMs: h,
                pageCount: e.state.data?.pages.length ?? 0,
                error: e.state.error,
              })),
            (o[5] = h),
            (o[6] = a))
          : (a = o[6]),
        o[7] !== c || o[8] !== l || o[9] !== r || o[10] !== a
          ? ((n = {
              queryKey: l,
              queryFn: r,
              initialPageParam: 0,
              getNextPageParam: y,
              select: I,
              enabled: c,
              staleTime: 6e4,
              refetchInterval: a,
              refetchIntervalInBackground: !1,
              refetchOnWindowFocus: f,
              retry: p,
            }),
            (o[7] = c),
            (o[8] = l),
            (o[9] = r),
            (o[10] = a),
            (o[11] = n))
          : (n = o[11]),
        (0, i.useInfiniteQuery)(n)
      );
    },
    useOwnTotal: function (e) {
      let i,
        r,
        a = (0, t.c)(5),
        { walletAddress: n, enabled: o } = e;
      a[0] !== n
        ? ((i = ["rewards-payouts-total", n]), (a[0] = n), (a[1] = i))
        : (i = a[1]);
      let s = o && !!n;
      return (
        a[2] !== i || a[3] !== s
          ? ((r = {
              queryKey: i,
              queryFn: x,
              enabled: s,
              staleTime: 36e5,
              retry: 1,
            }),
            (a[2] = i),
            (a[3] = s),
            (a[4] = r))
          : (r = a[4]),
        (0, l.useQuery)(r)
      );
    },
  };
}
