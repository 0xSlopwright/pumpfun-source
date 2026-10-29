// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(254667),
    r = e.i(975982),
    n = e.i(132838),
    a = e.i(935258),
    l = e.i(606933),
    s = e.i(796654),
    o = e.i(503630),
    c = e.i(605587),
    m = e.i(26077),
    u = e.i(680930);
  let d = (e) => (0, r.k)(e) || (0, c.h)(e);
  async function f(e, t) {
    let r = (e ?? []).filter(d);
    if (0 === r.length) return {};
    let n = t?.intervals || u.t.INTERVALS,
      a = t?.metrics || u.t.METRICS;
    try {
      let e = await (0, s.f)(`${(0, o.V)()}/coins/market-activity/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: r, intervals: n, metrics: a }),
        signal: t?.signal,
      });
      if (!e.ok)
        throw Error(`Failed to fetch batch market activity: ${e.status}`);
      return (0, m.f)(await e.json());
    } catch (e) {
      return (
        i.y.warn("Error fetching market activity", {
          error: e,
          mintCount: r.length,
        }),
        {}
      );
    }
  }
  function h(e) {
    return e.data;
  }
  function p(e) {
    return e.isPending;
  }
  function x(e) {
    return e.error;
  }
  function b(e) {
    return { data: e.map(h), pending: e.some(p), error: e.find(x)?.error };
  }
  e.s([
    "g",
    0,
    f,
    "l",
    0,
    d,
    "b",
    0,
    (e, i) => {
      let r,
        s,
        o,
        c,
        m,
        h,
        p,
        x,
        v,
        y = (0, t.c)(31);
      y[0] !== i
        ? ((r = void 0 === i ? {} : i), (y[0] = i), (y[1] = r))
        : (r = y[1]);
      let { shouldFetch: g, enablePolling: w, pollingInterval: N } = r,
        _ = void 0 === g || g,
        E = void 0 !== w && w,
        j = void 0 === N ? u.t.POLLING_INTERVAL : N,
        C = (0, l.useQueryClient)();
      y[2] !== e
        ? ((s = (0, u.$)(e.filter(d), u.t.BATCH_SIZE)), (y[2] = e), (y[3] = s))
        : (s = y[3]);
      let I = s;
      if (y[4] !== E || y[5] !== I || y[6] !== j || y[7] !== _) {
        let e;
        (y[9] !== E || y[10] !== j || y[11] !== _
          ? ((e = (e) => ({
              queryKey: [u.t.QUERY_KEY, e.join(",")],
              queryFn: () =>
                f(e, { intervals: u.t.INTERVALS, metrics: u.t.METRICS }),
              enabled: _ && e.length > 0,
              staleTime: u.t.STALE_TIME,
              gcTime: u.t.CACHE_TIME,
              refetchOnMount: !1,
              refetchOnWindowFocus: !1,
              refetchOnReconnect: !1,
              retry: !1,
              refetchInterval: !!E && j,
            })),
            (y[9] = E),
            (y[10] = j),
            (y[11] = _),
            (y[12] = e))
          : (e = y[12]),
          (o = I.map(e)),
          (y[4] = E),
          (y[5] = I),
          (y[6] = j),
          (y[7] = _),
          (y[8] = o));
      } else o = y[8];
      let k = o;
      y[13] !== k
        ? ((c = { queries: k, combine: b }), (y[13] = k), (y[14] = c))
        : (c = y[14]);
      let S = (0, a.f)(c);
      y[15] !== C
        ? ((m = {
            mutationFn: async (e) => {
              let t = await f(e, {
                intervals: u.t.INTERVALS,
                metrics: u.t.METRICS,
              });
              return (C.setQueryData([u.t.QUERY_KEY, e.join(",")], t), t);
            },
          }),
          (y[15] = C),
          (y[16] = m))
        : (m = y[16]);
      let { mutate: T } = (0, n.f)(m);
      y[17] !== I || y[18] !== T
        ? ((h = (e) => {
            if (!e.length) return;
            let t = Array.from(new Set(e));
            I.filter((e) => e.some((e) => t.includes(e))).forEach((e) => T(e));
          }),
          (y[17] = I),
          (y[18] = T),
          (y[19] = h))
        : (h = y[19]);
      let A = h;
      y[20] !== S.data
        ? ((p = (0, u.d)(S.data)), (y[20] = S.data), (y[21] = p))
        : (p = y[21]);
      let R = p,
        F = S.pending,
        O = S.error;
      y[22] !== I || y[23] !== C
        ? ((x = () => {
            I.length &&
              I.forEach((e) => {
                C.invalidateQueries({ queryKey: [u.t.QUERY_KEY, e.join(",")] });
              });
          }),
          (y[22] = I),
          (y[23] = C),
          (y[24] = x))
        : (x = y[24]);
      let L = x;
      return (
        y[25] !== O || y[26] !== L || y[27] !== F || y[28] !== R || y[29] !== A
          ? ((v = {
              marketActivity: R,
              loading: F,
              error: O,
              refetchMints: A,
              invalidateCache: L,
            }),
            (y[25] = O),
            (y[26] = L),
            (y[27] = F),
            (y[28] = R),
            (y[29] = A),
            (y[30] = v))
          : (v = y[30]),
        v
      );
    },
  ]);
};
