// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(690877),
    r = e.i(38279);
  class n extends Error {
    status;
    retryAfterMs;
    constructor(e, t, i) {
      (super(e),
        (this.name = "BalanceSummaryHttpError"),
        (this.status = t),
        (this.retryAfterMs = i?.retryAfterMs));
    }
  }
  let a = (e, t) => {
      if ("object" != typeof e || null === e) return;
      let i = e[t];
      return "number" == typeof i && Number.isFinite(i) ? i : void 0;
    },
    o = (e) => a(e, "status"),
    s = (e) => a(e, "retryAfterMs");
  async function l(e) {
    let { fetchOptions: t, userAddress: i, multiChain: a } = e,
      o = new URL(`${r.t.BALANCE_SUMMARY}/${i}`);
    a && o.searchParams.set("multi_chain", "true");
    let s = await fetch(o.toString(), t);
    if (401 === s.status) throw new n("Unauthorized", 401);
    if (!s.ok)
      throw new n(`Failed to fetch wallet summary (${s.status})`, s.status, {
        retryAfterMs:
          429 === s.status
            ? ((e, t = Date.now()) => {
                if (!e) return;
                let i = e.trim();
                if (/^-?\d+$/.test(i)) {
                  let e = Number(i);
                  return e >= 0 ? 1e3 * e : void 0;
                }
                let r = Date.parse(i);
                return Number.isNaN(r) ? void 0 : Math.max(0, r - t);
              })(s.headers.get("retry-after"))
            : void 0,
      });
    return s.json();
  }
  e.s(["P", 0, s, "W", 0, o, "K", 0, l], 349572);
  let d = (e, t) => 401 !== o(t) && e < 2,
    c = (e, t) => {
      if (429 !== o(t)) return Math.min(1e3 * 2 ** e, 3e4);
      let i = s(t);
      return void 0 !== i ? Math.min(i, 6e4) : 5e3 * (e + 1);
    },
    u = (e) => {
      let { userAddress: t, fetchOptions: i } = e;
      return {
        queryFn: () => l({ userAddress: t, multiChain: !0, fetchOptions: i }),
        queryKey: r.Q.BALANCE_SUMMARY(t),
        retry: d,
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
      u,
      "_",
      0,
      function (e) {
        let r,
          n,
          a = (0, t.c)(7),
          { userAddress: o, fetchOptions: s, queryOptions: l } = e,
          d = !!o;
        return (
          a[0] !== s || a[1] !== o
            ? ((r = u({ userAddress: o, fetchOptions: s })),
              (a[0] = s),
              (a[1] = o),
              (a[2] = r))
            : (r = a[2]),
          a[3] !== d || a[4] !== l || a[5] !== r
            ? ((n = {
                enabled: d,
                ...r,
                staleTime: 1 / 0,
                refetchOnMount: !0,
                refetchOnWindowFocus: !0,
                refetchOnReconnect: !0,
                refetchInterval: m,
                ...l,
              }),
              (a[3] = d),
              (a[4] = l),
              (a[5] = r),
              (a[6] = n))
            : (n = a[6]),
          (0, i.useQuery)(n)
        );
      },
    ],
    524711,
  );
};
