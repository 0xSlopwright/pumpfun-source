// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386);
  let n = !1,
    r = !1,
    a = new Set(),
    i = 0,
    l = null,
    o = null,
    s = (e) => {
      for (let t of e) i = Math.max(i, t.startTime + t.duration);
    },
    u = () => {
      if (!n)
        for (let e of ((n = !0),
        l?.disconnect(),
        (l = null),
        null !== o && (clearTimeout(o), (o = null)),
        a))
          e();
    },
    c = () => {
      if ("function" != typeof window.requestIdleCallback)
        return void window.setTimeout(u, 200);
      o = setTimeout(u, 8e3);
      let e = (() => {
          if (
            "u" < typeof PerformanceObserver ||
            !PerformanceObserver.supportedEntryTypes?.includes("longtask")
          )
            return !1;
          try {
            return (
              (l = new PerformanceObserver((e) => {
                s(e.getEntries());
              })).observe({ type: "longtask", buffered: !0 }),
              (i = performance.now()),
              !0
            );
          } catch {
            return ((l = null), !1);
          }
        })(),
        t = () => {
          window.requestIdleCallback(() => {
            if (!e) return void u();
            l && s(l.takeRecords());
            let n = performance.now() - i;
            n >= 500 ? u() : window.setTimeout(t, 500 - n);
          });
        };
      t();
    },
    f = (e) => (
      a.add(e),
      r ||
        ((r = !0),
        "complete" === document.readyState
          ? c()
          : window.addEventListener("load", c, { once: !0 })),
      () => {
        a.delete(e);
      }
    ),
    d = () => n,
    h = () => !1;
  e.s(["f", 0, () => (0, t.useSyncExternalStore)(f, d, h)]);
};
