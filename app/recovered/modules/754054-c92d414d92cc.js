// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(445242),
    t = e.i(292686),
    r = e.i(322315),
    i = e.i(254010),
    o = e.i(985526),
    E = e.i(390065),
    s = e.i(573525),
    u = e.i(574472),
    _ = e.i(528600),
    c = e.i(606933),
    O = e.i(352386),
    T = e.i(613677),
    I = e.i(342463),
    N = e.i(283087),
    l = e.i(440326),
    R = e.i(126965),
    a = e.i(779106);
  let A = (e) => `dm.user.${e}`,
    C = T.z.object({
      type: I.z.string(),
      messageId: I.z.string(),
      conversationId: I.z.string(),
      senderId: I.z.string().optional(),
      createdAt: I.z.string().optional(),
    }),
    M = (e) => {
      let r,
        i,
        T,
        I,
        M,
        S,
        d,
        D,
        m,
        f,
        p,
        v,
        B,
        U = (0, n.c)(29),
        { enabled: h } = e,
        H = (0, c.useQueryClient)(),
        { address: y, userId: P } = (0, u.F)(),
        L = (0, a.f)("dm-inbox"),
        W = y ?? "",
        G = h && !P && !!y;
      U[0] !== W || U[1] !== G
        ? ((r = { userIdentifier: W, enabled: G }),
          (U[0] = W),
          (U[1] = G),
          (U[2] = r))
        : (r = U[2]);
      let { data: g } = (0, _.U)(r),
        F = P ?? g?.userId ?? null;
      U[3] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = new Set()), (U[3] = i))
        : (i = U[3]);
      let j = (0, O.useRef)(i),
        w = (0, O.useRef)(null);
      U[4] !== H || U[5] !== L
        ? ((T = () => {
            (H.invalidateQueries({ queryKey: (0, R.u)(L) }),
              H.invalidateQueries({ queryKey: (0, R.I)(L) }));
          }),
          (U[4] = H),
          (U[5] = L),
          (U[6] = T))
        : (T = U[6]);
      let k = T;
      U[7] !== k
        ? ((I = () => {
            let e = w.current;
            if (e) {
              e.pending = !0;
              return;
            }
            k();
            let n = setTimeout(() => {
              let e = w.current;
              ((w.current = null), e?.pending && k());
            }, 1e3);
            w.current = { timer: n, pending: !1 };
          }),
          (U[7] = k),
          (U[8] = I))
        : (I = U[8]);
      let b = I;
      (U[9] === Symbol.for("react.memo_cache_sentinel")
        ? ((M = () => () => {
            w.current && clearTimeout(w.current.timer);
          }),
          (S = []),
          (U[9] = M),
          (U[10] = S))
        : ((M = U[9]), (S = U[10])),
        (0, O.useEffect)(M, S),
        U[11] !== F || U[12] !== b
          ? ((d = (e) => {
              let n = C.safeParse(e);
              if (!n.success || "dm_message" !== n.data.type) return;
              let r = j.current;
              if (r.has(n.data.messageId)) return;
              if (r.size >= 500) {
                let e = r.values().next().value;
                void 0 !== e && r.delete(e);
              }
              r.add(n.data.messageId);
              let {
                messageId: i,
                conversationId: o,
                senderId: E,
                createdAt: s,
              } = n.data;
              (void 0 !== E &&
                E !== F &&
                (0, l.S)({
                  messageId: i,
                  conversationId: o,
                  peerId: E,
                  deliveryChannel: t.jC.REALTIME_NATS,
                  createdAt: s,
                }),
                b());
            }),
            (U[11] = F),
            (U[12] = b),
            (U[13] = d))
          : (d = U[13]));
      let X = d,
        K = h && null !== F,
        z = (0, N.f)(),
        V = K && z,
        { connectionStates: x } = (0, E.N)(),
        J = x[o.N.Core] ?? !1,
        Q = (0, O.useRef)(!1),
        Y = (0, O.useRef)(!1);
      (U[14] !== J || U[15] !== V || U[16] !== k
        ? ((D = () => {
            if (!V) return;
            if (!J) {
              Y.current && (Q.current = !0);
              return;
            }
            if (((Y.current = !0), !Q.current)) return;
            let e = setTimeout(() => {
              ((Q.current = !1), k());
            }, 5e3 * Math.random());
            return () => clearTimeout(e);
          }),
          (m = [V, J, k]),
          (U[14] = J),
          (U[15] = V),
          (U[16] = k),
          (U[17] = D),
          (U[18] = m))
        : ((D = U[17]), (m = U[18])),
        (0, O.useEffect)(D, m),
        U[19] !== F
          ? ((f = null === F ? "" : A(F)), (U[19] = F), (U[20] = f))
          : (f = U[20]),
        U[21] !== V || U[22] !== X || U[23] !== f
          ? ((p = { type: o.N.Core, subject: f, enabled: V, onEvent: X }),
            (U[21] = V),
            (U[22] = X),
            (U[23] = f),
            (U[24] = p))
          : (p = U[24]),
        (0, s.f)(p),
        U[25] !== K || U[26] !== k
          ? ((v = () => {
              if (!K) return;
              let e = () => {
                "visible" === document.visibilityState && k();
              };
              return (
                document.addEventListener("visibilitychange", e),
                () => document.removeEventListener("visibilitychange", e)
              );
            }),
            (B = [K, k]),
            (U[25] = K),
            (U[26] = k),
            (U[27] = v),
            (U[28] = B))
          : ((v = U[27]), (B = U[28])),
        (0, O.useEffect)(v, B));
    };
  e.s([
    "DmRealtimeSignalSubscriber",
    0,
    function () {
      let e,
        t = (0, n.c)(2),
        { address: o } = (0, u.F)(),
        E = (0, i.k)(r.D.WEB_DIRECT_MESSAGES) && !!o;
      return (
        t[0] !== E
          ? ((e = { enabled: E }), (t[0] = E), (t[1] = e))
          : (e = t[1]),
        M(e),
        null
      );
    },
    "RECONNECT_REFETCH_JITTER_MS",
    0,
    5e3,
    "TRAILING_REFETCH_MS",
    0,
    1e3,
    "dmRealtimeSubject",
    0,
    A,
    "useDmRealtimeSignals",
    0,
    M,
  ]);
};
