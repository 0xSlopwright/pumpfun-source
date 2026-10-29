// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(154793);
  let n = void 0 !== window.document,
    r = "livestream.",
    i = (e) => {
      if (!e) return {};
      let t = {};
      for (let [n, r] of Object.entries(e))
        null != r &&
          (t[n] =
            "string" == typeof r ||
            "number" == typeof r ||
            "boolean" == typeof r
              ? r
              : String(r));
      return t;
    },
    o = (e, o, s) => {
      if (n)
        try {
          t.f.addAction(`${r}${e}`, { kind: "metric.timing", ms: o, ...i(s) });
        } catch {}
    },
    s = async (e, t, n) => {
      let r = Date.now();
      try {
        let i = await Promise.resolve(t());
        return (o(e, Math.round(Date.now() - r), { ...n, success: !0 }), i);
      } catch (t) {
        throw (o(e, Math.round(Date.now() - r), { ...n, success: !1 }), t);
      }
    };
  e.s([
    "f",
    0,
    {
      increment: (e, o = 1, s) => {
        if (n)
          try {
            t.f.addAction(`${r}${e}`, {
              kind: "metric.increment",
              value: o,
              ...i(s),
            });
          } catch {}
      },
      timing: o,
      gauge: (e, o, s) => {
        if (n)
          try {
            t.f.addAction(`${r}${e}`, {
              kind: "metric.gauge",
              value: o,
              ...i(s),
            });
          } catch {}
      },
      timed: s,
    },
  ]);
};
