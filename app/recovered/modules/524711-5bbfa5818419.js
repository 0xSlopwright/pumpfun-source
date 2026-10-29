// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(690877),
    n = e.i(38279);
  class a extends Error {
    status;
    retryAfterMs;
    constructor(e, t, r) {
      (super(e),
        (this.name = "BalanceSummaryHttpError"),
        (this.status = t),
        (this.retryAfterMs = r?.retryAfterMs));
    }
  }
  let l = (e, t) => {
      if ("object" != typeof e || null === e) return;
      let r = e[t];
      return "number" == typeof r && Number.isFinite(r) ? r : void 0;
    },
    i = (e) => l(e, "status"),
    s = (e) => l(e, "retryAfterMs");
  async function o(e) {
    let { fetchOptions: t, userAddress: r, multiChain: l } = e,
      i = new URL(`${n.t.BALANCE_SUMMARY}/${r}`);
    l && i.searchParams.set("multi_chain", "true");
    let s = await fetch(i.toString(), t);
    if (401 === s.status) throw new a("Unauthorized", 401);
    if (!s.ok)
      throw new a(`Failed to fetch wallet summary (${s.status})`, s.status, {
        retryAfterMs:
          429 === s.status
            ? ((e, t = Date.now()) => {
                if (!e) return;
                let r = e.trim();
                if (/^-?\d+$/.test(r)) {
                  let e = Number(r);
                  return e >= 0 ? 1e3 * e : void 0;
                }
                let n = Date.parse(r);
                return Number.isNaN(n) ? void 0 : Math.max(0, n - t);
              })(s.headers.get("retry-after"))
            : void 0,
      });
    return s.json();
  }
  e.s(["P", 0, s, "W", 0, i, "K", 0, o], 349572);
  let c = (e, t) => 401 !== i(t) && e < 2,
    d = (e, t) => {
      if (429 !== i(t)) return Math.min(1e3 * 2 ** e, 3e4);
      let r = s(t);
      return void 0 !== r ? Math.min(r, 6e4) : 5e3 * (e + 1);
    },
    u = (e) => {
      let { userAddress: t, fetchOptions: r } = e;
      return {
        queryFn: () => o({ userAddress: t, multiChain: !0, fetchOptions: r }),
        queryKey: n.Q.BALANCE_SUMMARY(t),
        retry: c,
        retryDelay: d,
      };
    };
  function f(e) {
    let t;
    return (
      (t = e.state.data),
      "success" === e.state.status && t?.success === !0 ? 6e4 : 15e3
    );
  }
  e.s(
    [
      "g",
      0,
      u,
      "_",
      0,
      function (e) {
        let n,
          a,
          l = (0, t.c)(7),
          { userAddress: i, fetchOptions: s, queryOptions: o } = e,
          c = !!i;
        return (
          l[0] !== s || l[1] !== i
            ? ((n = u({ userAddress: i, fetchOptions: s })),
              (l[0] = s),
              (l[1] = i),
              (l[2] = n))
            : (n = l[2]),
          l[3] !== c || l[4] !== o || l[5] !== n
            ? ((a = {
                enabled: c,
                ...n,
                staleTime: 1 / 0,
                refetchOnMount: !0,
                refetchOnWindowFocus: !0,
                refetchOnReconnect: !0,
                refetchInterval: f,
                ...o,
              }),
              (l[3] = c),
              (l[4] = o),
              (l[5] = n),
              (l[6] = a))
            : (a = l[6]),
          (0, r.useQuery)(a)
        );
      },
    ],
    524711,
  );
};
