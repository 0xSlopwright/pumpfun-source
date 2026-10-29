// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386),
    i = e.i(96224),
    o = e.i(886813),
    s = e.i(429914),
    a = e.i(683023);
  let c = "auth_token",
    l = () => {
      if ("u" < typeof document) return null;
      for (let e of document.cookie.split(";")) {
        let [t, r] = e.trim().split("=");
        if (t === c && r) return r;
      }
      return null;
    },
    u = () => {
      let e,
        t = l();
      return (
        !!t &&
        ((e = (0, a.e)(t)), !(!e?.exp || e.exp < Math.floor(Date.now() / 1e3)))
      );
    };
  e.s(
    [
      "f",
      0,
      l,
      "e",
      0,
      u,
      "u",
      0,
      () => {
        "u" > typeof document &&
          (document.cookie = `${c}=; Path=/; Max-Age=0; SameSite=Lax${"https:" === window.location.protocol ? "; Secure" : ""}`);
      },
    ],
    596904,
  );
  var d = e.i(54567),
    m = e.i(622493);
  let f = (0, n.createContext)(void 0),
    g = () => {
      let e = (0, n.useContext)(f);
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
          c,
          g = (0, r.c)(5),
          { children: p, isEnabled: h } = e,
          v = void 0 === h || h;
        g[0] !== v
          ? ((a = { isEnabled: v }), (g[0] = v), (g[1] = a))
          : (a = g[1]);
        let y = ((e) => {
          let t,
            a,
            c,
            f = (0, r.c)(17),
            { isEnabled: g } = e,
            p = void 0 === g || g,
            { livechatUrl: h } = (0, i.useApiClientsConfig)(),
            {
              socket: v,
              isConnected: y,
              isConnecting: x,
              connectionError: b,
              retryCount: S,
              connect: w,
              disconnect: I,
            } = (() => {
              let e,
                t,
                i,
                a,
                c,
                f = (0, r.c)(12),
                [g, p] = (0, n.useState)(null),
                [h, v] = (0, n.useState)(!1),
                [y, x] = (0, n.useState)(!1),
                [b, S] = (0, n.useState)(null),
                [w, I] = (0, n.useState)(0),
                _ = (0, n.useRef)(null),
                j = (0, n.useRef)(""),
                k = (0, n.useRef)("");
              f[0] === Symbol.for("react.memo_cache_sentinel")
                ? ((e = (e, t) => {
                    if (((j.current = e), (k.current = t), _.current))
                      return void d.logger.warn(
                        "[useSocketConnection] Connect skipped (already have socket)",
                        { url: e, socketId: _.current.id },
                      );
                    (m.f.increment("socket.connect_attempt", 1, {
                      hasAuthToken: u(),
                      authTokenInPayload: !!l(),
                    }),
                      x(!0),
                      S(null),
                      v(!1));
                    try {
                      let r = (0, s.f)(e, {
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
                            token: l(),
                            deviceId: (0, o.$)(),
                          });
                        },
                        withCredentials: !0,
                      });
                      ((_.current = r),
                        p(r),
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
                        S(e),
                        x(!1),
                        (_.current = null),
                        p(null));
                    }
                  }),
                  (f[0] = e))
                : (e = f[0]);
              let E = e;
              f[1] === Symbol.for("react.memo_cache_sentinel")
                ? ((t = () => {
                    (I(0),
                      _.current && _.current.disconnect(),
                      (_.current = null),
                      p(null),
                      v(!1),
                      x(!1),
                      S(null));
                  }),
                  (f[1] = t))
                : (t = f[1]);
              let C = t;
              return (
                f[2] !== w || f[3] !== g
                  ? ((i = () => {
                      if (!g) return;
                      let e = () => {
                          _.current === g &&
                            (m.f.increment("socket.connected", 1, {
                              retryCount: w,
                            }),
                            d.logger.info(
                              "[useSocketConnection] Socket connected",
                              { socketId: g.id },
                            ),
                            v(!0),
                            x(!1),
                            S(null),
                            I(0));
                        },
                        t = (e) => {
                          if (
                            _.current === g &&
                            (m.f.increment("socket.disconnected", 1, {
                              reason: e,
                            }),
                            d.logger.warn(
                              "[useSocketConnection] Socket disconnected",
                              { socketId: g.id, reason: e },
                            ),
                            v(!1),
                            x(!1),
                            "io client disconnect" !== e)
                          )
                            switch (e) {
                              case "transport close":
                              case "transport error":
                                S("Connection lost. Reconnecting...");
                                break;
                              case "io server disconnect":
                                (S(
                                  "Disconnected by server. This may be due to authentication issues.",
                                ),
                                  g.connect());
                                break;
                              default:
                                S(`Disconnected: ${e}`);
                            }
                        },
                        r = (e) => {
                          if (_.current === g) {
                            let t = e.message || "Connection failed";
                            (m.f.increment("socket.connection_error", 1),
                              d.logger.warn(
                                "[useSocketConnection] Connection error (will retry)",
                                { socketId: g.id, error: t },
                              ),
                              v(!1),
                              x(!1),
                              S(
                                t.includes("401") || t.includes("403")
                                  ? "Authentication failed. Please log in again."
                                  : t.includes("timeout")
                                    ? "Connection timeout. Retrying..."
                                    : "Connection failed. Retrying...",
                              ));
                          }
                        },
                        n = (e) => {
                          _.current === g &&
                            (d.logger.info(
                              "[useSocketConnection] Reconnection attempt",
                              { attemptNumber: e },
                            ),
                            I(e),
                            x(!0));
                        },
                        i = () => {
                          _.current === g &&
                            (d.logger.error(
                              "[useSocketConnection] Reconnection failed",
                              { maxAttempts: 5 },
                            ),
                            S("Reconnection failed. Please refresh the page."),
                            x(!1),
                            g.disconnect(),
                            (_.current = null),
                            p(null));
                        };
                      return (
                        g.on("connect", e),
                        g.on("disconnect", t),
                        g.on("connect_error", r),
                        g.io.on("reconnect_attempt", n),
                        g.io.on("reconnect_failed", i),
                        () => {
                          (g.off("connect", e),
                            g.off("disconnect", t),
                            g.off("connect_error", r),
                            g.io.off("reconnect_attempt", n),
                            g.io.off("reconnect_failed", i));
                        }
                      );
                    }),
                    (a = [g, w]),
                    (f[2] = w),
                    (f[3] = g),
                    (f[4] = i),
                    (f[5] = a))
                  : ((i = f[4]), (a = f[5])),
                (0, n.useEffect)(i, a),
                f[6] !== b ||
                f[7] !== h ||
                f[8] !== y ||
                f[9] !== w ||
                f[10] !== g
                  ? ((c = {
                      socket: g,
                      isConnected: h,
                      isConnecting: y,
                      connectionError: b,
                      retryCount: w,
                      connect: E,
                      disconnect: C,
                    }),
                    (f[6] = b),
                    (f[7] = h),
                    (f[8] = y),
                    (f[9] = w),
                    (f[10] = g),
                    (f[11] = c))
                  : (c = f[11]),
                c
              );
            })();
          f[0] !== w || f[1] !== p || f[2] !== h
            ? ((t = () => {
                p && h && w(h, window.location.origin);
              }),
              (f[0] = w),
              (f[1] = p),
              (f[2] = h),
              (f[3] = t))
            : (t = f[3]);
          let _ = t;
          f[4] !== I || f[5] !== _ || f[6] !== p
            ? ((a = () => {
                p &&
                  (I(),
                  setTimeout(() => {
                    _();
                  }, 1e3));
              }),
              (f[4] = I),
              (f[5] = _),
              (f[6] = p),
              (f[7] = a))
            : (a = f[7]);
          let j = a;
          return (
            f[8] !== I ||
            f[9] !== _ ||
            f[10] !== b ||
            f[11] !== j ||
            f[12] !== y ||
            f[13] !== x ||
            f[14] !== S ||
            f[15] !== v
              ? ((c = {
                  socket: v,
                  isConnected: y,
                  isConnecting: x,
                  connectionError: b,
                  retryCount: S,
                  connect: _,
                  disconnect: I,
                  forceReconnect: j,
                }),
                (f[8] = I),
                (f[9] = _),
                (f[10] = b),
                (f[11] = j),
                (f[12] = y),
                (f[13] = x),
                (f[14] = S),
                (f[15] = v),
                (f[16] = c))
              : (c = f[16]),
            c
          );
        })(a);
        return (
          g[2] !== p || g[3] !== y
            ? ((c = (0, t.jsx)(f.Provider, { value: y, children: p })),
              (g[2] = p),
              (g[3] = y),
              (g[4] = c))
            : (c = g[4]),
          c
        );
      },
      "I",
      0,
      g,
      "Y",
      0,
      () => {
        let { socket: e } = g();
        return e;
      },
    ],
    985436,
  );
};
