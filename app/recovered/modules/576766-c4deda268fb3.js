// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(448341),
    r = e.i(528600),
    n = e.i(690877),
    a = e.i(606933),
    l = e.i(352386),
    s = e.i(38279),
    o = e.i(544930),
    c = e.i(466931);
  let m = (e, t) => !(0, r.r)(t) && e < 1,
    u = (e, t) => "error" === e.status && t - e.errorUpdatedAt >= 3e4,
    d = 0,
    f = 0;
  function h(e) {
    return u(e.state, Date.now());
  }
  function p(e) {
    return u(e.state, Date.now());
  }
  function x(e, t) {
    return e.localeCompare(t);
  }
  e.s([
    "f",
    0,
    function (e) {
      let r,
        u,
        b,
        v,
        y,
        g,
        w = (0, t.c)(21),
        { userAddresses: N, queryOptions: _ } = e,
        E = [...N].sort(x),
        j = E.join(","),
        C = !!N.length,
        I = (0, a.useQueryClient)(),
        k = () => (0, o.u)({ userAddresses: E }),
        S = s.Q.USERS(E);
      w[0] !== C || w[1] !== _ || w[2] !== k || w[3] !== S
        ? ((r = {
            enabled: C,
            queryFn: k,
            queryKey: S,
            retryOnMount: !1,
            refetchOnMount: p,
            refetchOnWindowFocus: h,
            retry: m,
            ..._,
          }),
          (w[0] = C),
          (w[1] = _),
          (w[2] = k),
          (w[3] = S),
          (w[4] = r))
        : (r = w[4]);
      let T = (0, n.useQuery)(r),
        { error: A, errorUpdatedAt: R } = T;
      w[5] !== j
        ? ((u = "" === j ? [] : j.split(",")), (w[5] = j), (w[6] = u))
        : (u = w[6]);
      let F = u;
      if (
        (w[7] !== F || w[8] !== A
          ? ((b = () => {
              if (!A) return;
              let e = ((e) => {
                if (e - d < 3e4) return ((f += 1), null);
                let t = f;
                return ((d = e), (f = 0), t);
              })(Date.now());
              null !== e &&
                (0, c.l)({
                  error: A,
                  feature: "profile",
                  operation: "users-batch",
                  context: {
                    addressCount: F.length,
                    ...(e > 0 ? { suppressedReports: e } : {}),
                  },
                });
            }),
            (w[7] = F),
            (w[8] = A),
            (w[9] = b))
          : (b = w[9]),
        w[10] !== F || w[11] !== A || w[12] !== R
          ? ((v = [A, R, F]),
            (w[10] = F),
            (w[11] = A),
            (w[12] = R),
            (w[13] = v))
          : (v = w[13]),
        (0, l.useEffect)(b, v),
        w[14] !== F || w[15] !== A || w[16] !== I)
      )
        ((y = A
          ? F.map((e) => I.getQueryData((0, i.B)(e))).filter(
              (e) => void 0 !== e,
            )
          : []),
          (w[14] = F),
          (w[15] = A),
          (w[16] = I),
          (w[17] = y));
      else y = w[17];
      let O = y;
      if (!A) return T;
      let L = T.data ?? O;
      return (
        w[18] !== T || w[19] !== L
          ? ((g = { ...T, data: L }), (w[18] = T), (w[19] = L), (w[20] = g))
          : (g = w[20]),
        g
      );
    },
  ]);
};
