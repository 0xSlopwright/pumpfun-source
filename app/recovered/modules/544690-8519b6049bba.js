// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(322315),
    i = e.i(254010),
    a = e.i(453706),
    s = e.i(352386),
    o = e.i(641947),
    l = e.i(852938);
  let c = (0, a.default)(() => e.A(870649), {
    loadableGenerated: { modules: [250578] },
    ssr: !1,
  });
  function u() {
    return (0, l.e)(!1);
  }
  e.s([
    "AnalyticsEventDevToolsGate",
    0,
    function () {
      let e,
        a,
        d,
        m = (0, r.c)(4),
        f = (0, i.k)(n.D.WEB_EVENT_DEBUGGER),
        p = o.g || f;
      return (m[0] !== p
        ? ((e = () => ((0, l.e)(p), u)),
          (a = [p]),
          (m[0] = p),
          (m[1] = e),
          (m[2] = a))
        : ((e = m[1]), (a = m[2])),
      (0, s.useEffect)(e, a),
      p)
        ? (m[3] === Symbol.for("react.memo_cache_sentinel")
            ? ((d = (0, t.jsx)(c, {})), (m[3] = d))
            : (d = m[3]),
          d)
        : null;
    },
  ]);
};
