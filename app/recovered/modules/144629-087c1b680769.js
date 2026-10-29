// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(572420),
    i = e.i(1807),
    r = e.i(907953),
    n = e.i(826085),
    l = e.i(459705);
  function a(e, t) {
    let i = (0, l.f)(t()),
      a = () => i.set(t());
    return (
      a(),
      (0, n.f)(() => {
        let t = () => r.y.preRender(a, !1, !0),
          i = e.map((e) => e.on("change", t));
        return () => {
          (i.forEach((e) => e()), (0, r.Y)(a));
        };
      }),
      i
    );
  }
  var s = e.i(964355);
  function c(e, t) {
    let r = (0, i.f)(() => []);
    return a(e, () => {
      r.length = 0;
      let i = e.length;
      for (let t = 0; t < i; t++) r[t] = e[t].get();
      return t(r);
    });
  }
  e.s(
    [
      "f",
      0,
      function e(r, n, l, u) {
        if ("function" == typeof r) {
          let e;
          return (
            (s.I.current = []),
            r(),
            (e = a(s.I.current, r)),
            (s.I.current = void 0),
            e
          );
        }
        if (void 0 !== l && !Array.isArray(l) && "function" != typeof n) {
          var o = r,
            m = n,
            h = l,
            f = u;
          let t = (0, i.f)(() => Object.keys(h)),
            a = (0, i.f)(() => ({}));
          for (let i of t) a[i] = e(o, m, h[i], f);
          return a;
        }
        let d = "function" == typeof n ? n : (0, t.f)(n, l, u),
          p = Array.isArray(r) ? c(r, d) : c([r], ([e]) => d(e)),
          g = Array.isArray(r) ? void 0 : r.accelerate;
        return (
          g &&
            !g.isTransformed &&
            "function" != typeof n &&
            Array.isArray(l) &&
            u?.clamp !== !1 &&
            (p.accelerate = {
              ...g,
              times: n,
              keyframes: l,
              isTransformed: !0,
              ...(u?.ease ? { ease: u.ease } : {}),
            }),
          p
        );
      },
    ],
    144629,
  );
};
