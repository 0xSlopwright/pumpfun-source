// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(833499),
    n = e.i(985526);
  let r = {},
    a = new Map(),
    i = new Map(),
    l = new Map(),
    o = new Map(),
    s = new Map(),
    u = new Map(),
    c = new Map(),
    f = null,
    d = !1,
    h = null,
    p = 0,
    g = !1,
    m = null;
  function b() {
    m &&
      (clearTimeout(m.timer),
      null !== m.frame && cancelAnimationFrame(m.frame),
      (m = null));
  }
  let y = (e, t) => `${e}:${t}`;
  function v(e) {
    e.persisted || (b(), f?.terminate(), (f = null));
  }
  function w(e, t) {
    (u.set(e, t),
      c.forEach((n) => {
        try {
          n(e, t);
        } catch {}
      }));
  }
  function C(e) {
    l.forEach((t) => {
      try {
        t(e);
      } catch {}
    });
  }
  function S(t) {
    let l = (function t() {
      if (f) return f;
      if (d) return null;
      if ("u" < typeof Worker) return ((d = !0), null);
      try {
        let l = e.r(774101)(Worker, { type: "module", name: "nats-decoder" });
        return (
          (l.onmessage = (e) => {
            !(function (e) {
              if (((p = 0), "status" === e.type))
                return w(e.instance, e.status);
              if ("auth" === e.type)
                return i.forEach((t) => {
                  try {
                    t(e.event);
                  } catch {}
                });
              if ("lifecycle" === e.type) return C(e.event);
              try {
                for (let t of e.batches) {
                  t.dropped &&
                    C({
                      type: "dropped",
                      instance: t.instance,
                      channel: t.channel,
                      count: t.dropped,
                    });
                  let e = o.get(y(t.instance, t.channel));
                  if (e)
                    for (let n of t.messages)
                      e.handlers.forEach((e) => {
                        try {
                          e(n);
                        } catch {}
                      });
                }
              } finally {
                !(function () {
                  if (m) return;
                  let e = () => {
                    m && (b(), f?.postMessage({ type: "ack" }));
                  };
                  m = {
                    timer: setTimeout(e, 250),
                    frame:
                      "function" == typeof requestAnimationFrame
                        ? requestAnimationFrame(e)
                        : null,
                  };
                })();
              }
            })(e.data);
          }),
          (l.onerror = () =>
            (function (e) {
              if (f === e) {
                b();
                try {
                  e.terminate();
                } catch {}
                ((f = null),
                  u.forEach((e, t) => {
                    e !== n.m.DISCONNECTED && w(t, n.m.DISCONNECTED);
                  }),
                  (function () {
                    if (null !== h || f || d || (0 === o.size && 0 === c.size))
                      return;
                    if (p >= 5) {
                      ((d = !0),
                        C({
                          type: "gave_up",
                          instance: null,
                          reason: "worker_unavailable",
                        }));
                      return;
                    }
                    let e = Math.min(1e3 * 2 ** p, 16e3);
                    ((p += 1),
                      (h = setTimeout(() => {
                        ((h = null), t());
                      }, e)));
                  })());
              }
            })(l)),
          (f = l),
          null !== h && (clearTimeout(h), (h = null)),
          l.postMessage({ type: "configs", configs: r }),
          l.postMessage(L()),
          a.forEach((e, t) => {
            l.postMessage({ type: "auth", instance: t, auth: e });
          }),
          o.forEach((e) => {
            l.postMessage({
              type: "subscribe",
              instance: e.instance,
              channel: e.channel,
              coalesce: e.mergedMode,
            });
          }),
          g ||
            (window.addEventListener("pagehide", v),
            document.addEventListener("visibilitychange", E),
            (g = !0)),
          f
        );
      } catch {
        return ((d = !0), null);
      }
    })();
    l?.postMessage(t);
  }
  function P(e) {
    let t = "latest";
    for (let n of e.handlerModes.values())
      t = "none" === t || "none" === n ? "none" : "latest";
    return 0 === e.handlerModes.size ? "none" : t;
  }
  let L = () => ({
    type: "visibility",
    hidden: "hidden" === document.visibilityState,
  });
  function E() {
    f?.postMessage(L());
  }
  e.s(
    [
      "L",
      0,
      function (e) {
        S({ type: "reconnect", instance: e });
      },
      "B",
      0,
      function (e) {
        return u.get(e) ?? n.m.DISCONNECTED;
      },
      "k",
      0,
      function (e) {
        let n = (0, t.f)();
        return (c.set(n, e), n);
      },
      "R",
      0,
      function (e) {
        let n = (0, t.f)();
        return (i.set(n, e), n);
      },
      "l",
      0,
      function (e) {
        let n = (0, t.f)();
        return (l.set(n, e), n);
      },
      "t",
      0,
      function (e) {
        c.delete(e);
      },
      "u",
      0,
      function (e) {
        i.delete(e);
      },
      "M",
      0,
      function (e) {
        ((r = { ...r, ...e }), f && S({ type: "configs", configs: e }));
      },
      "Q",
      0,
      function (e, t) {
        (t ? a.set(e, t) : a.delete(e),
          f?.postMessage({ type: "auth", instance: e, auth: t }));
      },
      "i",
      0,
      function (e, n, r, a = (0, t.f)(), i) {
        try {
          var l;
          let t = y(e, n),
            u =
              ((l = i?.coalesce),
              !0 === l ? "latest" : !1 === l || void 0 === l ? "none" : l),
            c = o.get(t);
          if (c) {
            if (c.handlers.has(a)) return a;
            (c.handlers.set(a, r), c.handlerModes.set(a, u));
            let t = P(c);
            t !== c.mergedMode &&
              ((c.mergedMode = t),
              S({ type: "subscribe", instance: e, channel: n, coalesce: t }));
          } else
            ((c = {
              instance: e,
              channel: n,
              handlers: new Map([[a, r]]),
              handlerModes: new Map([[a, u]]),
              mergedMode: u,
            }),
              o.set(t, c),
              S({ type: "subscribe", instance: e, channel: n, coalesce: u }));
          s.set(a, { subjectKey: t, instance: e });
        } catch {}
        return a;
      },
      "V",
      0,
      function (e, t) {
        try {
          let e = s.get(t);
          if (!e) return;
          let n = o.get(e.subjectKey);
          if ((s.delete(t), !n)) return;
          if (
            (n.handlers.delete(t),
            n.handlerModes.delete(t),
            0 === n.handlers.size)
          ) {
            (o.delete(e.subjectKey),
              S({
                type: "unsubscribe",
                instance: n.instance,
                channel: n.channel,
              }));
            return;
          }
          let r = P(n);
          r !== n.mergedMode &&
            ((n.mergedMode = r),
            S({
              type: "subscribe",
              instance: n.instance,
              channel: n.channel,
              coalesce: r,
            }));
        } catch {}
      },
    ],
    755793,
  );
};
