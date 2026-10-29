// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    a = e.i(690877),
    s = e.i(38279);
  class l extends Error {
    status;
    retryAfterMs;
    constructor(e, t, a) {
      (super(e),
        (this.name = "BalanceSummaryHttpError"),
        (this.status = t),
        (this.retryAfterMs = a?.retryAfterMs));
    }
  }
  let n = (e, t) => {
      if ("object" != typeof e || null === e) return;
      let a = e[t];
      return "number" == typeof a && Number.isFinite(a) ? a : void 0;
    },
    i = (e) => n(e, "status"),
    r = (e) => n(e, "retryAfterMs");
  async function o(e) {
    let { fetchOptions: t, userAddress: a, multiChain: n } = e,
      i = new URL(`${s.t.BALANCE_SUMMARY}/${a}`);
    n && i.searchParams.set("multi_chain", "true");
    let r = await fetch(i.toString(), t);
    if (401 === r.status) throw new l("Unauthorized", 401);
    if (!r.ok)
      throw new l(`Failed to fetch wallet summary (${r.status})`, r.status, {
        retryAfterMs:
          429 === r.status
            ? ((e, t = Date.now()) => {
                if (!e) return;
                let a = e.trim();
                if (/^-?\d+$/.test(a)) {
                  let e = Number(a);
                  return e >= 0 ? 1e3 * e : void 0;
                }
                let s = Date.parse(a);
                return Number.isNaN(s) ? void 0 : Math.max(0, s - t);
              })(r.headers.get("retry-after"))
            : void 0,
      });
    return r.json();
  }
  e.s(["P", 0, r, "W", 0, i, "K", 0, o], 349572);
  let u = (e, t) => 401 !== i(t) && e < 2,
    c = (e, t) => {
      if (429 !== i(t)) return Math.min(1e3 * 2 ** e, 3e4);
      let a = r(t);
      return void 0 !== a ? Math.min(a, 6e4) : 5e3 * (e + 1);
    },
    d = (e) => {
      let { userAddress: t, fetchOptions: a } = e;
      return {
        queryFn: () => o({ userAddress: t, multiChain: !0, fetchOptions: a }),
        queryKey: s.Q.BALANCE_SUMMARY(t),
        retry: u,
        retryDelay: c,
      };
    };
  function m(e) {
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
      d,
      "_",
      0,
      function (e) {
        let s,
          l,
          n = (0, t.c)(7),
          { userAddress: i, fetchOptions: r, queryOptions: o } = e,
          u = !!i;
        return (
          n[0] !== r || n[1] !== i
            ? ((s = d({ userAddress: i, fetchOptions: r })),
              (n[0] = r),
              (n[1] = i),
              (n[2] = s))
            : (s = n[2]),
          n[3] !== u || n[4] !== o || n[5] !== s
            ? ((l = {
                enabled: u,
                ...s,
                staleTime: 1 / 0,
                refetchOnMount: !0,
                refetchOnWindowFocus: !0,
                refetchOnReconnect: !0,
                refetchInterval: m,
                ...o,
              }),
              (n[3] = u),
              (n[4] = o),
              (n[5] = s),
              (n[6] = l))
            : (l = n[6]),
          (0, a.useQuery)(l)
        );
      },
    ],
    524711,
  );
};
