// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(572420),
    r = e.i(1807),
    i = e.i(907953),
    a = e.i(826085),
    n = e.i(459705);
  function l(e, t) {
    let r = (0, n.f)(t()),
      l = () => r.set(t());
    return (
      l(),
      (0, a.f)(() => {
        let t = () => i.y.preRender(l, !1, !0),
          r = e.map((e) => e.on("change", t));
        return () => {
          (r.forEach((e) => e()), (0, i.Y)(l));
        };
      }),
      r
    );
  }
  var s = e.i(964355);
  function o(e, t) {
    let i = (0, r.f)(() => []);
    return l(e, () => {
      i.length = 0;
      let r = e.length;
      for (let t = 0; t < r; t++) i[t] = e[t].get();
      return t(i);
    });
  }
  e.s(
    [
      "f",
      0,
      function e(i, a, n, c) {
        if ("function" == typeof i) {
          let e;
          return (
            (s.I.current = []),
            i(),
            (e = l(s.I.current, i)),
            (s.I.current = void 0),
            e
          );
        }
        if (void 0 !== n && !Array.isArray(n) && "function" != typeof a) {
          var m = i,
            d = a,
            u = n,
            h = c;
          let t = (0, r.f)(() => Object.keys(u)),
            l = (0, r.f)(() => ({}));
          for (let r of t) l[r] = e(m, d, u[r], h);
          return l;
        }
        let f = "function" == typeof a ? a : (0, t.f)(a, n, c),
          x = Array.isArray(i) ? o(i, f) : o([i], ([e]) => f(e)),
          p = Array.isArray(i) ? void 0 : i.accelerate;
        return (
          p &&
            !p.isTransformed &&
            "function" != typeof a &&
            Array.isArray(n) &&
            c?.clamp !== !1 &&
            (x.accelerate = {
              ...p,
              times: a,
              keyframes: n,
              isTransformed: !0,
              ...(c?.ease ? { ease: c.ease } : {}),
            }),
          x
        );
      },
    ],
    144629,
  );
};
