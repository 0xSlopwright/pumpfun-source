// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(292686),
    n = e.i(26101),
    i = e.i(37116),
    a = e.i(352386),
    s = e.i(806846),
    o = e.i(322315);
  let l = (e, t) =>
      t?.inExperiment === !0 || (t?.kind === "FALLTHROUGH" && (0, o.C)(e)),
    c = {
      sourceScreen: r.Ae.EXPLICIT_NO_SCREEN,
      sourceElement: r.k9.EXPLICIT_NO_ELEMENT,
      sourceElementType: r.eD.EXPLICIT_NO_ELEMENT_TYPE,
      ownershipGroup: "FOUNDATION",
    };
  function u() {
    let e = setInterval(d, 3e5);
    return () => clearInterval(e);
  }
  function d() {
    (0, s.j)((0, n.SE)({ triggerReason: r.wv.INTERVAL }), c);
  }
  function m() {
    (0, s.j)((0, n.SE)({ triggerReason: r.wv.CALLBACK }), c);
  }
  e.s(
    [
      "FlagChangeTracker",
      0,
      function () {
        let e,
          d,
          f,
          p,
          h,
          y,
          b,
          g = (0, t.c)(12),
          v = (0, i.useLDClient)(),
          w = (0, i.useLaunchDarklyFlags)(),
          x = (0, a.useRef)(!1);
        return (
          g[0] !== v || g[1] !== w
            ? ((e = () => {
                v &&
                  (0, s.K)(
                    (function (e, t) {
                      let r = {};
                      for (let n of Object.values(o.D)) {
                        if (void 0 === e[n]) continue;
                        let i = t.variationDetail(n, !1);
                        r[n] = {
                          served: i.value,
                          inExperiment: l(n, i.reason),
                        };
                      }
                      return r;
                    })(w, v),
                  );
              }),
              (d = [v, w]),
              (g[0] = v),
              (g[1] = w),
              (g[2] = e),
              (g[3] = d))
            : ((e = g[2]), (d = g[3])),
          (0, a.useEffect)(e, d),
          g[4] !== v || g[5] !== w
            ? ((f = () => {
                x.current ||
                  !v ||
                  (0 !== Object.keys(w).length &&
                    ((x.current = !0),
                    (0, s.j)(
                      (0, n.SE)({ triggerReason: r.wv.SESSION_START }),
                      c,
                    )));
              }),
              (p = [v, w]),
              (g[4] = v),
              (g[5] = w),
              (g[6] = f),
              (g[7] = p))
            : ((f = g[6]), (p = g[7])),
          (0, a.useEffect)(f, p),
          g[8] !== v
            ? ((h = () => {
                if (v)
                  return (
                    v.on("change", m),
                    () => {
                      v.off("change", m);
                    }
                  );
              }),
              (y = [v]),
              (g[8] = v),
              (g[9] = h),
              (g[10] = y))
            : ((h = g[9]), (y = g[10])),
          (0, a.useEffect)(h, y),
          g[11] === Symbol.for("react.memo_cache_sentinel")
            ? ((b = []), (g[11] = b))
            : (b = g[11]),
          (0, a.useEffect)(u, b),
          null
        );
      },
    ],
    501517,
  );
};
