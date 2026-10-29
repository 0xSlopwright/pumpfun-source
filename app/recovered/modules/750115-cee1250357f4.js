// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386),
    i = e.i(254667),
    o = e.i(690877),
    s = e.i(66866),
    a = e.i(985436);
  let c = (0, n.createContext)({ sessionId: void 0 });
  e.s(
    [
      "j",
      0,
      (e) => {
        let l,
          u,
          d,
          m,
          f,
          g,
          p,
          h,
          v,
          y,
          x = (0, r.c)(19);
        x[0] !== e
          ? (({ children: l, roomId: d, enabled: m, ...u } = e),
            (x[0] = e),
            (x[1] = l),
            (x[2] = u),
            (x[3] = d),
            (x[4] = m))
          : ((l = x[1]), (u = x[2]), (d = x[3]), (m = x[4]));
        let b = void 0 === m || m,
          S = (0, a.Y)(),
          [w, I] = (0, n.useState)(void 0),
          _ = b && !!d;
        (x[5] !== _
          ? ((f = () => {
              _ || I(void 0);
            }),
            (g = [_]),
            (x[5] = _),
            (x[6] = f),
            (x[7] = g))
          : ((f = x[6]), (g = x[7])),
          (0, n.useEffect)(f, g),
          x[8] === Symbol.for("react.memo_cache_sentinel")
            ? ((p = (e) => {
                I(e?.sessionId);
              }),
              (x[8] = p))
            : (p = x[8]),
          x[9] !== _ || x[10] !== u || x[11] !== d || x[12] !== S
            ? ((h = { enabled: _, roomId: d, socket: S, onSuccess: p, ...u }),
              (x[9] = _),
              (x[10] = u),
              (x[11] = d),
              (x[12] = S),
              (x[13] = h))
            : (h = x[13]),
          ((e) => {
            let t,
              a,
              c,
              l,
              u,
              d,
              m,
              f,
              g,
              p,
              h = (0, r.c)(20);
            (h[0] !== e
              ? (({ roomId: c, socket: l, onSuccess: t, ...a } = e),
                (h[0] = e),
                (h[1] = t),
                (h[2] = a),
                (h[3] = c),
                (h[4] = l))
              : ((t = h[1]), (a = h[2]), (c = h[3]), (l = h[4])),
              h[5] !== l
                ? ((u = { socket: l }), (h[5] = l), (h[6] = u))
                : (u = h[6]));
            let { emitViewerHeartbeat: v } = (0, s.f)(u);
            (h[7] !== c
              ? ((d = ["livestream-viewer-heartbeat", c]),
                (h[7] = c),
                (h[8] = d))
              : (d = h[8]),
              h[9] !== v || h[10] !== t || h[11] !== c
                ? ((m = async () => {
                    let e = await v(c);
                    return (t(e), e);
                  }),
                  (h[9] = v),
                  (h[10] = t),
                  (h[11] = c),
                  (h[12] = m))
                : (m = h[12]),
              h[13] !== a || h[14] !== d || h[15] !== m
                ? ((f = {
                    queryKey: d,
                    queryFn: m,
                    refetchInterval: 6e4,
                    refetchOnWindowFocus: !0,
                    refetchIntervalInBackground: !0,
                    ...a,
                  }),
                  (h[13] = a),
                  (h[14] = d),
                  (h[15] = m),
                  (h[16] = f))
                : (f = h[16]));
            let y = (0, o.useQuery)(f);
            return (
              h[17] !== y.error
                ? ((g = () => {
                    y.error &&
                      i.y.error("Failed to send heartbeat", { error: y.error });
                  }),
                  (p = [y.error]),
                  (h[17] = y.error),
                  (h[18] = g),
                  (h[19] = p))
                : ((g = h[18]), (p = h[19])),
              (0, n.useEffect)(g, p)
            );
          })(h),
          x[14] !== w
            ? ((v = { sessionId: w }), (x[14] = w), (x[15] = v))
            : (v = x[15]));
        let j = v;
        return (
          x[16] !== l || x[17] !== j
            ? ((y = (0, t.jsx)(c.Provider, { value: j, children: l })),
              (x[16] = l),
              (x[17] = j),
              (x[18] = y))
            : (y = x[18]),
          y
        );
      },
      "O",
      0,
      () => (0, n.useContext)(c),
    ],
    750115,
  );
};
