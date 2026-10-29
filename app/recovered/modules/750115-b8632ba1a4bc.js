// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    i = e.i(254667),
    o = e.i(690877),
    s = e.i(66866),
    a = e.i(985436);
  let l = (0, r.createContext)({ sessionId: void 0 });
  e.s(
    [
      "j",
      0,
      (e) => {
        let c,
          u,
          d,
          m,
          E,
          f,
          I,
          T,
          p,
          g,
          _ = (0, n.c)(19);
        _[0] !== e
          ? (({ children: c, roomId: d, enabled: m, ...u } = e),
            (_[0] = e),
            (_[1] = c),
            (_[2] = u),
            (_[3] = d),
            (_[4] = m))
          : ((c = _[1]), (u = _[2]), (d = _[3]), (m = _[4]));
        let S = void 0 === m || m,
          y = (0, a.Y)(),
          [h, A] = (0, r.useState)(void 0),
          O = S && !!d;
        (_[5] !== O
          ? ((E = () => {
              O || A(void 0);
            }),
            (f = [O]),
            (_[5] = O),
            (_[6] = E),
            (_[7] = f))
          : ((E = _[6]), (f = _[7])),
          (0, r.useEffect)(E, f),
          _[8] === Symbol.for("react.memo_cache_sentinel")
            ? ((I = (e) => {
                A(e?.sessionId);
              }),
              (_[8] = I))
            : (I = _[8]),
          _[9] !== O || _[10] !== u || _[11] !== d || _[12] !== y
            ? ((T = { enabled: O, roomId: d, socket: y, onSuccess: I, ...u }),
              (_[9] = O),
              (_[10] = u),
              (_[11] = d),
              (_[12] = y),
              (_[13] = T))
            : (T = _[13]),
          ((e) => {
            let t,
              a,
              l,
              c,
              u,
              d,
              m,
              E,
              f,
              I,
              T = (0, n.c)(20);
            (T[0] !== e
              ? (({ roomId: l, socket: c, onSuccess: t, ...a } = e),
                (T[0] = e),
                (T[1] = t),
                (T[2] = a),
                (T[3] = l),
                (T[4] = c))
              : ((t = T[1]), (a = T[2]), (l = T[3]), (c = T[4])),
              T[5] !== c
                ? ((u = { socket: c }), (T[5] = c), (T[6] = u))
                : (u = T[6]));
            let { emitViewerHeartbeat: p } = (0, s.f)(u);
            (T[7] !== l
              ? ((d = ["livestream-viewer-heartbeat", l]),
                (T[7] = l),
                (T[8] = d))
              : (d = T[8]),
              T[9] !== p || T[10] !== t || T[11] !== l
                ? ((m = async () => {
                    let e = await p(l);
                    return (t(e), e);
                  }),
                  (T[9] = p),
                  (T[10] = t),
                  (T[11] = l),
                  (T[12] = m))
                : (m = T[12]),
              T[13] !== a || T[14] !== d || T[15] !== m
                ? ((E = {
                    queryKey: d,
                    queryFn: m,
                    refetchInterval: 6e4,
                    refetchOnWindowFocus: !0,
                    refetchIntervalInBackground: !0,
                    ...a,
                  }),
                  (T[13] = a),
                  (T[14] = d),
                  (T[15] = m),
                  (T[16] = E))
                : (E = T[16]));
            let g = (0, o.useQuery)(E);
            return (
              T[17] !== g.error
                ? ((f = () => {
                    g.error &&
                      i.y.error("Failed to send heartbeat", { error: g.error });
                  }),
                  (I = [g.error]),
                  (T[17] = g.error),
                  (T[18] = f),
                  (T[19] = I))
                : ((f = T[18]), (I = T[19])),
              (0, r.useEffect)(f, I)
            );
          })(T),
          _[14] !== h
            ? ((p = { sessionId: h }), (_[14] = h), (_[15] = p))
            : (p = _[15]));
        let v = p;
        return (
          _[16] !== c || _[17] !== v
            ? ((g = (0, t.jsx)(l.Provider, { value: v, children: c })),
              (_[16] = c),
              (_[17] = v),
              (_[18] = g))
            : (g = _[18]),
          g
        );
      },
      "O",
      0,
      () => (0, r.useContext)(l),
    ],
    750115,
  );
};
