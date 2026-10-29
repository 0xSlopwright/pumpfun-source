// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    i = e.i(96224),
    o = e.i(886813),
    s = e.i(429914),
    a = e.i(683023);
  let l = "auth_token",
    c = () => {
      if ("u" < typeof document) return null;
      for (let e of document.cookie.split(";")) {
        let [t, n] = e.trim().split("=");
        if (t === l && n) return n;
      }
      return null;
    },
    u = () => {
      let e,
        t = c();
      return (
        !!t &&
        ((e = (0, a.e)(t)), !(!e?.exp || e.exp < Math.floor(Date.now() / 1e3)))
      );
    };
  e.s(
    [
      "f",
      0,
      c,
      "e",
      0,
      u,
      "u",
      0,
      () => {
        "u" > typeof document &&
          (document.cookie = `${l}=; Path=/; Max-Age=0; SameSite=Lax${"https:" === window.location.protocol ? "; Secure" : ""}`);
      },
    ],
    596904,
  );
  var d = e.i(54567),
    m = e.i(622493);
  let E = (0, r.createContext)(void 0),
    f = () => {
      let e = (0, r.useContext)(E);
      if (void 0 === e)
        throw Error(
          "useLivechatConnection must be used within a LivechatConnectionProvider",
        );
      return e;
    };
  e.s(
    [
      "y",
      0,
      (e) => {
        let a,
          l,
          f = (0, n.c)(5),
          { children: I, isEnabled: T } = e,
          p = void 0 === T || T;
        f[0] !== p
          ? ((a = { isEnabled: p }), (f[0] = p), (f[1] = a))
          : (a = f[1]);
        let g = ((e) => {
          let t,
            a,
            l,
            E = (0, n.c)(17),
            { isEnabled: f } = e,
            I = void 0 === f || f,
            { livechatUrl: T } = (0, i.useApiClientsConfig)(),
            {
              socket: p,
              isConnected: g,
              isConnecting: _,
              connectionError: S,
              retryCount: y,
              connect: h,
              disconnect: A,
            } = (() => {
              let e,
                t,
                i,
                a,
                l,
                E = (0, n.c)(12),
                [f, I] = (0, r.useState)(null),
                [T, p] = (0, r.useState)(!1),
                [g, _] = (0, r.useState)(!1),
                [S, y] = (0, r.useState)(null),
                [h, A] = (0, r.useState)(0),
                O = (0, r.useRef)(null),
                v = (0, r.useRef)(""),
                L = (0, r.useRef)("");
              E[0] === Symbol.for("react.memo_cache_sentinel")
                ? ((e = (e, t) => {
                    if (((v.current = e), (L.current = t), O.current))
                      return void d.logger.warn(
                        "[useSocketConnection] Connect skipped (already have socket)",
                        { url: e, socketId: O.current.id },
                      );
                    (m.f.increment("socket.connect_attempt", 1, {
                      hasAuthToken: u(),
                      authTokenInPayload: !!c(),
                    }),
                      _(!0),
                      y(null),
                      p(!1));
                    try {
                      let n = (0, s.f)(e, {
                        path: "/socket.io/",
                        reconnection: !0,
                        reconnectionAttempts: 5,
                        reconnectionDelay: 1e3,
                        reconnectionDelayMax: 3e4,
                        randomizationFactor: 0.5,
                        timeout: 3e4,
                        transports: ["websocket"],
                        upgrade: !0,
                        forceNew: !1,
                        auth: (e) => {
                          e({
                            origin: t,
                            timestamp: Date.now(),
                            token: c(),
                            deviceId: (0, o.$)(),
                          });
                        },
                        withCredentials: !0,
                      });
                      ((O.current = n),
                        I(n),
                        m.f.increment("socket.instance_created", 1));
                    } catch (t) {
                      let e =
                        t instanceof Error
                          ? t.message
                          : "Socket initialization failed";
                      (m.f.increment("socket.connect_error", 1),
                        d.logger.error(
                          "[useSocketConnection] Socket initialization error",
                          { error: e },
                        ),
                        y(e),
                        _(!1),
                        (O.current = null),
                        I(null));
                    }
                  }),
                  (E[0] = e))
                : (e = E[0]);
              let R = e;
              E[1] === Symbol.for("react.memo_cache_sentinel")
                ? ((t = () => {
                    (A(0),
                      O.current && O.current.disconnect(),
                      (O.current = null),
                      I(null),
                      p(!1),
                      _(!1),
                      y(null));
                  }),
                  (E[1] = t))
                : (t = E[1]);
              let D = t;
              return (
                E[2] !== h || E[3] !== f
                  ? ((i = () => {
                      if (!f) return;
                      let e = () => {
                          O.current === f &&
                            (m.f.increment("socket.connected", 1, {
                              retryCount: h,
                            }),
                            d.logger.info(
                              "[useSocketConnection] Socket connected",
                              { socketId: f.id },
                            ),
                            p(!0),
                            _(!1),
                            y(null),
                            A(0));
                        },
                        t = (e) => {
                          if (
                            O.current === f &&
                            (m.f.increment("socket.disconnected", 1, {
                              reason: e,
                            }),
                            d.logger.warn(
                              "[useSocketConnection] Socket disconnected",
                              { socketId: f.id, reason: e },
                            ),
                            p(!1),
                            _(!1),
                            "io client disconnect" !== e)
                          )
                            switch (e) {
                              case "transport close":
                              case "transport error":
                                y("Connection lost. Reconnecting...");
                                break;
                              case "io server disconnect":
                                (y(
                                  "Disconnected by server. This may be due to authentication issues.",
                                ),
                                  f.connect());
                                break;
                              default:
                                y(`Disconnected: ${e}`);
                            }
                        },
                        n = (e) => {
                          if (O.current === f) {
                            let t = e.message || "Connection failed";
                            (m.f.increment("socket.connection_error", 1),
                              d.logger.warn(
                                "[useSocketConnection] Connection error (will retry)",
                                { socketId: f.id, error: t },
                              ),
                              p(!1),
                              _(!1),
                              y(
                                t.includes("401") || t.includes("403")
                                  ? "Authentication failed. Please log in again."
                                  : t.includes("timeout")
                                    ? "Connection timeout. Retrying..."
                                    : "Connection failed. Retrying...",
                              ));
                          }
                        },
                        r = (e) => {
                          O.current === f &&
                            (d.logger.info(
                              "[useSocketConnection] Reconnection attempt",
                              { attemptNumber: e },
                            ),
                            A(e),
                            _(!0));
                        },
                        i = () => {
                          O.current === f &&
                            (d.logger.error(
                              "[useSocketConnection] Reconnection failed",
                              { maxAttempts: 5 },
                            ),
                            y("Reconnection failed. Please refresh the page."),
                            _(!1),
                            f.disconnect(),
                            (O.current = null),
                            I(null));
                        };
                      return (
                        f.on("connect", e),
                        f.on("disconnect", t),
                        f.on("connect_error", n),
                        f.io.on("reconnect_attempt", r),
                        f.io.on("reconnect_failed", i),
                        () => {
                          (f.off("connect", e),
                            f.off("disconnect", t),
                            f.off("connect_error", n),
                            f.io.off("reconnect_attempt", r),
                            f.io.off("reconnect_failed", i));
                        }
                      );
                    }),
                    (a = [f, h]),
                    (E[2] = h),
                    (E[3] = f),
                    (E[4] = i),
                    (E[5] = a))
                  : ((i = E[4]), (a = E[5])),
                (0, r.useEffect)(i, a),
                E[6] !== S ||
                E[7] !== T ||
                E[8] !== g ||
                E[9] !== h ||
                E[10] !== f
                  ? ((l = {
                      socket: f,
                      isConnected: T,
                      isConnecting: g,
                      connectionError: S,
                      retryCount: h,
                      connect: R,
                      disconnect: D,
                    }),
                    (E[6] = S),
                    (E[7] = T),
                    (E[8] = g),
                    (E[9] = h),
                    (E[10] = f),
                    (E[11] = l))
                  : (l = E[11]),
                l
              );
            })();
          E[0] !== h || E[1] !== I || E[2] !== T
            ? ((t = () => {
                I && T && h(T, window.location.origin);
              }),
              (E[0] = h),
              (E[1] = I),
              (E[2] = T),
              (E[3] = t))
            : (t = E[3]);
          let O = t;
          E[4] !== A || E[5] !== O || E[6] !== I
            ? ((a = () => {
                I &&
                  (A(),
                  setTimeout(() => {
                    O();
                  }, 1e3));
              }),
              (E[4] = A),
              (E[5] = O),
              (E[6] = I),
              (E[7] = a))
            : (a = E[7]);
          let v = a;
          return (
            E[8] !== A ||
            E[9] !== O ||
            E[10] !== S ||
            E[11] !== v ||
            E[12] !== g ||
            E[13] !== _ ||
            E[14] !== y ||
            E[15] !== p
              ? ((l = {
                  socket: p,
                  isConnected: g,
                  isConnecting: _,
                  connectionError: S,
                  retryCount: y,
                  connect: O,
                  disconnect: A,
                  forceReconnect: v,
                }),
                (E[8] = A),
                (E[9] = O),
                (E[10] = S),
                (E[11] = v),
                (E[12] = g),
                (E[13] = _),
                (E[14] = y),
                (E[15] = p),
                (E[16] = l))
              : (l = E[16]),
            l
          );
        })(a);
        return (
          f[2] !== I || f[3] !== g
            ? ((l = (0, t.jsx)(E.Provider, { value: g, children: I })),
              (f[2] = I),
              (f[3] = g),
              (f[4] = l))
            : (l = f[4]),
          l
        );
      },
      "I",
      0,
      f,
      "Y",
      0,
      () => {
        let { socket: e } = f();
        return e;
      },
    ],
    985436,
  );
};
