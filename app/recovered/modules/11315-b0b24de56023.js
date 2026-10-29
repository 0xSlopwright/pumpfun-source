// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t, i;
  var r = e.i(149502),
    a = e.i(445242),
    n = e.i(207816),
    s = e.i(352386),
    l = e.i(369773),
    o = e.i(163401);
  let d = (e) => {
    t = e;
  };
  function c(e) {
    let i = e ?? ("function" == typeof t ? t() : t);
    if (!i) throw Error("uapi-stream: no StreamClient (setDefaultClient)");
    return i;
  }
  let u = () => {},
    m = () => u,
    p = (e, t, i, r, a) => {
      let n = (0, s.useRef)(i);
      n.current = i;
      let l = i
        ? JSON.stringify([i.parts, i.commitment, i.candles, i.list], (e, t) =>
            "bigint" == typeof t ? String(t) : t,
          )
        : "";
      (0, s.useEffect)(() => {
        if (t) return e.subscribe(t, { ...n.current, delivery: r }, a);
      }, [e, t, l, r, a]);
    };
  function f(e, t, i) {
    let r,
      n,
      o,
      d,
      f,
      g,
      v = (0, a.c)(2),
      h = c(i);
    p(h, e, t, "latest", u);
    let b =
      ((d = (0, a.c)(6))[0] !== h || d[1] !== e
        ? ((n = (t) => (e ? h.onTopic(e, t) : u)),
          (d[0] = h),
          (d[1] = e),
          (d[2] = n))
        : (n = d[2]),
      (f = n),
      d[3] !== h || d[4] !== e
        ? ((o = () => (e ? h.getState(e) : void 0)),
          (d[3] = h),
          (d[4] = e),
          (d[5] = o))
        : (o = d[5]),
      (g = o),
      (0, s.useSyncExternalStore)(e ? f : m, g, g));
    return (
      v[0] !== b
        ? ((r = (0, l.isCoinState)(b) || (0, l.isListState)(b) ? b : void 0),
          (v[0] = b),
          (v[1] = r))
        : (r = v[1]),
      r
    );
  }
  function g(e) {
    let t,
      i,
      r = (0, a.c)(4),
      n = c(e);
    r[0] !== n
      ? ((t = (e) => n.onStatus(e)), (r[0] = n), (r[1] = t))
      : (t = r[1]);
    let l = t;
    r[2] !== n ? ((i = () => n.status()), (r[2] = n), (r[3] = i)) : (i = r[3]);
    let o = i;
    return (0, s.useSyncExternalStore)(l, o, o);
  }
  e.s(
    [
      "h",
      0,
      d,
      "M",
      0,
      function (e, t, i) {
        let r,
          n,
          s,
          d = (0, a.c)(6);
        d[0] !== t
          ? ((r = t ? { list: t } : void 0), (d[0] = t), (d[1] = r))
          : (r = d[1]);
        let c = r;
        d[2] !== e
          ? ((n = (0, o.listTopic)(e)), (d[2] = e), (d[3] = n))
          : (n = d[3]);
        let u = f(n, c, i);
        return (
          d[4] !== u
            ? ((s = (0, l.isListState)(u) ? u : void 0), (d[4] = u), (d[5] = s))
            : (s = d[5]),
          s
        );
      },
      "f",
      0,
      function (e, t) {
        let i,
          r,
          n = (0, a.c)(5),
          l = void 0 === e ? 2e4 : e,
          o = c(t),
          d = g(o),
          u = "idle" === d ? "idle" : "open" === d ? "open" : "down",
          m = (0, s.useRef)(u),
          [p, f] = (0, s.useState)(!1);
        return (
          n[0] !== o || n[1] !== l || n[2] !== u
            ? ((i = () => {
                let e,
                  t = m.current;
                if (((m.current = u), "idle" === u)) return;
                let i =
                  "function" == typeof o.lastFrameAt &&
                  ("open" === u || "open" === t);
                if ("open" === u && !i) return;
                let r = Date.now(),
                  a = () => {
                    let t = (i ? (o.lastFrameAt?.() ?? r) : r) + l - Date.now();
                    (f(t <= 0),
                      t > 0
                        ? (e = setTimeout(a, t))
                        : "open" === u && (e = setTimeout(a, 1e3)));
                  };
                return (
                  a(),
                  () => {
                    (e && clearTimeout(e), f(!1));
                  }
                );
              }),
              (r = [o, u, l]),
              (n[0] = o),
              (n[1] = l),
              (n[2] = u),
              (n[3] = i),
              (n[4] = r))
            : ((i = n[3]), (r = n[4])),
          (0, s.useEffect)(i, r),
          "idle" !== u && p
        );
      },
      "_",
      0,
      g,
      "A",
      0,
      function (e, t, i, r, a) {
        let n = c(r),
          l = (0, s.useRef)(i);
        l.current = i;
        let o = (0, s.useCallback)((e, t) => l.current(e, t), []);
        p(n, e, t, a?.delivery ?? "all", o);
      },
      "b",
      0,
      f,
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
    y = (e) => {
      h.has(e.name) && window.DD_RUM?.addAction?.("uapi_stream", e);
    },
    w = (e, t, i) => {},
    T = () => {
      if (i) return i;
      let e = (0, n.createStreamClient)({
        url: r.default.env.NEXT_PUBLIC_UAPI_STREAM_URL ?? v,
        getToken: () => null,
        visibility: k(),
        onMetric: y,
        log: w,
      });
      return (
        window.addEventListener("pagehide", () => e.pause()),
        window.addEventListener("pageshow", () => {
          b() && e.resume();
        }),
        (i = e),
        e
      );
    };
  (d(T),
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
        T,
        "Y",
        0,
        () => {
          (i?.close(), (i = void 0));
        },
        "q",
        0,
        (e) => {
          let t,
            i,
            r = (0, a.c)(3),
            n = g(),
            l = e && "open" !== n && "paused" !== n,
            [o, d] = (0, s.useState)(!1);
          return (
            r[0] !== l
              ? ((t = () => {
                  if (!l) return;
                  let e = setTimeout(() => d(!0), 1e4);
                  return () => {
                    (clearTimeout(e), d(!1));
                  };
                }),
                (i = [l]),
                (r[0] = l),
                (r[1] = t),
                (r[2] = i))
              : ((t = r[1]), (i = r[2])),
            (0, s.useEffect)(t, i),
            l && o
          );
        },
      ],
      11315,
    ));
};
