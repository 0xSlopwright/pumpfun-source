// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t, r;
  var i = e.i(149502),
    a = e.i(445242),
    n = e.i(207816),
    l = e.i(352386),
    s = e.i(369773),
    o = e.i(163401);
  let d = (e) => {
    t = e;
  };
  function c(e) {
    let r = e ?? ("function" == typeof t ? t() : t);
    if (!r) throw Error("uapi-stream: no StreamClient (setDefaultClient)");
    return r;
  }
  let u = () => {},
    p = () => u,
    f = (e, t, r, i, a) => {
      let n = (0, l.useRef)(r);
      n.current = r;
      let s = r
        ? JSON.stringify([r.parts, r.commitment, r.candles, r.list], (e, t) =>
            "bigint" == typeof t ? String(t) : t,
          )
        : "";
      (0, l.useEffect)(() => {
        if (t) return e.subscribe(t, { ...n.current, delivery: i }, a);
      }, [e, t, s, i, a]);
    };
  function m(e, t, r) {
    let i,
      n,
      o,
      d,
      m,
      g,
      v = (0, a.c)(2),
      h = c(r);
    f(h, e, t, "latest", u);
    let b =
      ((d = (0, a.c)(6))[0] !== h || d[1] !== e
        ? ((n = (t) => (e ? h.onTopic(e, t) : u)),
          (d[0] = h),
          (d[1] = e),
          (d[2] = n))
        : (n = d[2]),
      (m = n),
      d[3] !== h || d[4] !== e
        ? ((o = () => (e ? h.getState(e) : void 0)),
          (d[3] = h),
          (d[4] = e),
          (d[5] = o))
        : (o = d[5]),
      (g = o),
      (0, l.useSyncExternalStore)(e ? m : p, g, g));
    return (
      v[0] !== b
        ? ((i = (0, s.isCoinState)(b) || (0, s.isListState)(b) ? b : void 0),
          (v[0] = b),
          (v[1] = i))
        : (i = v[1]),
      i
    );
  }
  function g(e) {
    let t,
      r,
      i = (0, a.c)(4),
      n = c(e);
    i[0] !== n
      ? ((t = (e) => n.onStatus(e)), (i[0] = n), (i[1] = t))
      : (t = i[1]);
    let s = t;
    i[2] !== n ? ((r = () => n.status()), (i[2] = n), (i[3] = r)) : (r = i[3]);
    let o = r;
    return (0, l.useSyncExternalStore)(s, o, o);
  }
  e.s(
    [
      "h",
      0,
      d,
      "M",
      0,
      function (e, t, r) {
        let i,
          n,
          l,
          d = (0, a.c)(6);
        d[0] !== t
          ? ((i = t ? { list: t } : void 0), (d[0] = t), (d[1] = i))
          : (i = d[1]);
        let c = i;
        d[2] !== e
          ? ((n = (0, o.listTopic)(e)), (d[2] = e), (d[3] = n))
          : (n = d[3]);
        let u = m(n, c, r);
        return (
          d[4] !== u
            ? ((l = (0, s.isListState)(u) ? u : void 0), (d[4] = u), (d[5] = l))
            : (l = d[5]),
          l
        );
      },
      "f",
      0,
      function (e, t) {
        let r,
          i,
          n = (0, a.c)(5),
          s = void 0 === e ? 2e4 : e,
          o = c(t),
          d = g(o),
          u = "idle" === d ? "idle" : "open" === d ? "open" : "down",
          p = (0, l.useRef)(u),
          [f, m] = (0, l.useState)(!1);
        return (
          n[0] !== o || n[1] !== s || n[2] !== u
            ? ((r = () => {
                let e,
                  t = p.current;
                if (((p.current = u), "idle" === u)) return;
                let r =
                  "function" == typeof o.lastFrameAt &&
                  ("open" === u || "open" === t);
                if ("open" === u && !r) return;
                let i = Date.now(),
                  a = () => {
                    let t = (r ? (o.lastFrameAt?.() ?? i) : i) + s - Date.now();
                    (m(t <= 0),
                      t > 0
                        ? (e = setTimeout(a, t))
                        : "open" === u && (e = setTimeout(a, 1e3)));
                  };
                return (
                  a(),
                  () => {
                    (e && clearTimeout(e), m(!1));
                  }
                );
              }),
              (i = [o, u, s]),
              (n[0] = o),
              (n[1] = s),
              (n[2] = u),
              (n[3] = r),
              (n[4] = i))
            : ((r = n[3]), (i = n[4])),
          (0, l.useEffect)(r, i),
          "idle" !== u && f
        );
      },
      "_",
      0,
      g,
      "A",
      0,
      function (e, t, r, i, a) {
        let n = c(i),
          s = (0, l.useRef)(r);
        s.current = r;
        let o = (0, l.useCallback)((e, t) => s.current(e, t), []);
        f(n, e, t, a?.delivery ?? "all", o);
      },
      "b",
      0,
      m,
    ],
    254967,
  );
  let v = "wss://frontend-api-v3.pump.fun/stream",
    h = new Set([
      "connect",
      "open",
      "close",
      "seq_skip",
      "gap",
      "resume",
      "topics_capped",
      "client_bug",
      "stale_close",
    ]),
    b = () => "u" < typeof document || "hidden" !== document.visibilityState,
    S = () => "u" < typeof navigator || !1 !== navigator.onLine,
    k = () => ({
      isVisible: () => b() && S(),
      subscribe(e) {
        let t = () => e(b() && S());
        return (
          document.addEventListener("visibilitychange", t),
          window.addEventListener("online", t),
          window.addEventListener("offline", t),
          () => {
            (document.removeEventListener("visibilitychange", t),
              window.removeEventListener("online", t),
              window.removeEventListener("offline", t));
          }
        );
      },
    }),
    T = (e) => {
      h.has(e.name) && window.DD_RUM?.addAction?.("uapi_stream", e);
    },
    y = (e, t, r) => {},
    w = () => {
      if (r) return r;
      let e = (0, n.createStreamClient)({
        url: i.default.env.NEXT_PUBLIC_UAPI_STREAM_URL ?? v,
        getToken: () => null,
        visibility: k(),
        onMetric: T,
        log: y,
      });
      return (
        window.addEventListener("pagehide", () => e.pause()),
        window.addEventListener("pageshow", () => {
          b() && e.resume();
        }),
        (r = e),
        e
      );
    };
  (d(w),
    e.s(
      [
        "h",
        0,
        v,
        "H",
        0,
        1e4,
        "A",
        0,
        k,
        "X",
        0,
        w,
        "Y",
        0,
        () => {
          (r?.close(), (r = void 0));
        },
        "q",
        0,
        (e) => {
          let t,
            r,
            i = (0, a.c)(3),
            n = g(),
            s = e && "open" !== n && "paused" !== n,
            [o, d] = (0, l.useState)(!1);
          return (
            i[0] !== s
              ? ((t = () => {
                  if (!s) return;
                  let e = setTimeout(() => d(!0), 1e4);
                  return () => {
                    (clearTimeout(e), d(!1));
                  };
                }),
                (r = [s]),
                (i[0] = s),
                (i[1] = t),
                (i[2] = r))
              : ((t = i[1]), (r = i[2])),
            (0, l.useEffect)(t, r),
            s && o
          );
        },
      ],
      11315,
    ));
};
