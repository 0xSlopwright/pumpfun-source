// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(448341),
    r = e.i(528600),
    a = e.i(690877),
    l = e.i(606933),
    o = e.i(352386),
    i = e.i(38279),
    s = e.i(544930),
    c = e.i(466931);
  let u = (e, t) => !(0, r.r)(t) && e < 1,
    f = (e, t) => "error" === e.status && t - e.errorUpdatedAt >= 3e4,
    h = 0,
    d = 0;
  function m(e) {
    return f(e.state, Date.now());
  }
  function p(e) {
    return f(e.state, Date.now());
  }
  function v(e, t) {
    return e.localeCompare(t);
  }
  e.s([
    "f",
    0,
    function (e) {
      let r,
        f,
        g,
        y,
        b,
        x,
        w = (0, t.c)(21),
        { userAddresses: k, queryOptions: B } = e,
        _ = [...k].sort(v),
        C = _.join(","),
        I = !!k.length,
        A = (0, l.useQueryClient)(),
        L = () => (0, s.u)({ userAddresses: _ }),
        S = i.Q.USERS(_);
      w[0] !== I || w[1] !== B || w[2] !== L || w[3] !== S
        ? ((r = {
            enabled: I,
            queryFn: L,
            queryKey: S,
            retryOnMount: !1,
            refetchOnMount: p,
            refetchOnWindowFocus: m,
            retry: u,
            ...B,
          }),
          (w[0] = I),
          (w[1] = B),
          (w[2] = L),
          (w[3] = S),
          (w[4] = r))
        : (r = w[4]);
      let E = (0, a.useQuery)(r),
        { error: N, errorUpdatedAt: F } = E;
      w[5] !== C
        ? ((f = "" === C ? [] : C.split(",")), (w[5] = C), (w[6] = f))
        : (f = w[6]);
      let $ = f;
      if (
        (w[7] !== $ || w[8] !== N
          ? ((g = () => {
              if (!N) return;
              let e = ((e) => {
                if (e - h < 3e4) return ((d += 1), null);
                let t = d;
                return ((h = e), (d = 0), t);
              })(Date.now());
              null !== e &&
                (0, c.l)({
                  error: N,
                  feature: "profile",
                  operation: "users-batch",
                  context: {
                    addressCount: $.length,
                    ...(e > 0 ? { suppressedReports: e } : {}),
                  },
                });
            }),
            (w[7] = $),
            (w[8] = N),
            (w[9] = g))
          : (g = w[9]),
        w[10] !== $ || w[11] !== N || w[12] !== F
          ? ((y = [N, F, $]),
            (w[10] = $),
            (w[11] = N),
            (w[12] = F),
            (w[13] = y))
          : (y = w[13]),
        (0, o.useEffect)(g, y),
        w[14] !== $ || w[15] !== N || w[16] !== A)
      )
        ((b = N
          ? $.map((e) => A.getQueryData((0, n.B)(e))).filter(
              (e) => void 0 !== e,
            )
          : []),
          (w[14] = $),
          (w[15] = N),
          (w[16] = A),
          (w[17] = b));
      else b = w[17];
      let T = b;
      if (!N) return E;
      let O = E.data ?? T;
      return (
        w[18] !== E || w[19] !== O
          ? ((x = { ...E, data: O }), (w[18] = E), (w[19] = O), (w[20] = x))
          : (x = w[20]),
        x
      );
    },
  ]);
};
