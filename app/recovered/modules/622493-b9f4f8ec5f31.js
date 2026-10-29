// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(154793);
  let r = void 0 !== window.document,
    n = "livestream.",
    i = (e) => {
      if (!e) return {};
      let t = {};
      for (let [r, n] of Object.entries(e))
        null != n &&
          (t[r] =
            "string" == typeof n ||
            "number" == typeof n ||
            "boolean" == typeof n
              ? n
              : String(n));
      return t;
    },
    o = (e, o, s) => {
      if (r)
        try {
          t.f.addAction(`${n}${e}`, { kind: "metric.timing", ms: o, ...i(s) });
        } catch {}
    },
    s = async (e, t, r) => {
      let n = Date.now();
      try {
        let i = await Promise.resolve(t());
        return (o(e, Math.round(Date.now() - n), { ...r, success: !0 }), i);
      } catch (t) {
        throw (o(e, Math.round(Date.now() - n), { ...r, success: !1 }), t);
      }
    };
  e.s([
    "f",
    0,
    {
      increment: (e, o = 1, s) => {
        if (r)
          try {
            t.f.addAction(`${n}${e}`, {
              kind: "metric.increment",
              value: o,
              ...i(s),
            });
          } catch {}
      },
      timing: o,
      gauge: (e, o, s) => {
        if (r)
          try {
            t.f.addAction(`${n}${e}`, {
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
