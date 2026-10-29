// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(412427),
    n = e.i(845785),
    i = e.i(827935),
    o = e.i(886813),
    s = e.i(77962),
    a = e.i(520),
    c = e.i(352386),
    l = e.i(992034),
    u = e.i(54567);
  let d = e.i(113939).f.init({ appName: n.v.PUMP_WEB });
  function m() {
    try {
      let e = localStorage.getItem("pump_session_data");
      if (e) {
        let t = JSON.parse(e);
        if ("string" == typeof t?.pump_session_id) return t.pump_session_id;
      }
    } catch {}
    return `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
  }
  (e.s(["f", 0, d], 832139), e.s(["f", 0, m], 676648));
  let f = () => {
      let e = localStorage.getItem("decoded-jwt");
      if (e)
        try {
          return JSON.parse(e).address || void 0;
        } catch {
          return;
        }
    },
    g = () => {
      try {
        let e = localStorage.getItem("decoded-jwt");
        if (!e) return;
        let t = JSON.parse(e);
        return "string" == typeof t.userId && "" !== t.userId
          ? t.userId
          : void 0;
      } catch {
        return;
      }
    };
  e.s(["Q", 0, g, "e", 0, f], 370245);
  let p = (e) => {
    try {
      a.f.destroyMonitor(e);
    } catch {}
  };
  e.s(
    [
      "f",
      0,
      (e) => {
        let a,
          h,
          v,
          y = (0, t.c)(15),
          {
            videoType: x,
            videoId: b,
            videoTitle: S,
            roomId: w,
            creatorId: I,
            creatorCcUserId: _,
            participantRole: j,
            page: k,
            playerName: E,
            property: C,
          } = e,
          N = void 0 === j ? r.E.PARTICIPANT : j,
          { muxDataEnvKey: P, getSessionId: R } = (0, l.a)(),
          M = (0, c.useRef)(null);
        y[0] !== _ ||
        y[1] !== I ||
        y[2] !== R ||
        y[3] !== P ||
        y[4] !== k ||
        y[5] !== N ||
        y[6] !== E ||
        y[7] !== C ||
        y[8] !== w ||
        y[9] !== b ||
        y[10] !== S ||
        y[11] !== x
          ? ((a = (e, t) => {
              if (
                (M.current && (p(M.current), (M.current = null)),
                (0, s.UF)(e) || (0, s.G4)(e))
              ) {
                P && !d.hasEnvKey() && d.setEnvKey(P);
                let t = e.video;
                M.current = t;
                let s = f() ?? r.J.ANONYMOUS,
                  c = R?.() ?? m();
                var a = {
                  debug: !1,
                  data: d.build(x, n.J.VIDSTACK, {
                    deviceId: (0, o.$)() ?? "",
                    envKey: P,
                    videoId: b,
                    videoTitle: S,
                    mintId: w,
                    creatorId: I,
                    creatorCcUserId: _,
                    viewerId: s,
                    viewerCcUserId: g(),
                    sessionId: c,
                    participantRole: N,
                    page: k,
                    playerName: E,
                    experimentName: null,
                    property: C,
                  }),
                };
                try {
                  i.F.monitor(t, a);
                } catch (e) {
                  u.logger.warn(
                    "[MuxAnalytics] Mux monitor failed (analytics blocked?)",
                    { error: e instanceof Error ? e.message : String(e) },
                  );
                }
              }
            }),
            (y[0] = _),
            (y[1] = I),
            (y[2] = R),
            (y[3] = P),
            (y[4] = k),
            (y[5] = N),
            (y[6] = E),
            (y[7] = C),
            (y[8] = w),
            (y[9] = b),
            (y[10] = S),
            (y[11] = x),
            (y[12] = a))
          : (a = y[12]);
        let T = a;
        return (
          y[13] === Symbol.for("react.memo_cache_sentinel")
            ? ((h = () => () => {
                M.current &&
                  (u.logger.debug("[VodPlayer] Cleaning up Mux tracking"),
                  p(M.current),
                  (M.current = null));
              }),
              (v = []),
              (y[13] = h),
              (y[14] = v))
            : ((h = y[13]), (v = y[14])),
          (0, c.useEffect)(h, v),
          T
        );
      },
    ],
    997466,
  );
};
