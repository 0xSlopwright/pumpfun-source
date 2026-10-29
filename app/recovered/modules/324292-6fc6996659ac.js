// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(539392),
    n = e.i(516467);
  function a(e, t) {
    let a = (0, n.f)(e) - (0, n.f)(t);
    return a < 0 ? -1 : a > 0 ? 1 : a;
  }
  (e.s(["f", 0, a], 504244),
    e.s(
      [
        "f",
        0,
        function (e, i, r) {
          var o, s;
          let l,
            u,
            d,
            c,
            [m, f, h] = (0, t.f)(r?.in, e, e, i),
            g = a(f, h),
            b = Math.abs(
              (function (e, n) {
                let [a, i] = (0, t.f)(void 0, e, n);
                return (
                  12 * (a.getFullYear() - i.getFullYear()) +
                  (a.getMonth() - i.getMonth())
                );
              })(f, h),
            );
          if (b < 1) return 0;
          (1 === f.getMonth() && f.getDate() > 27 && f.setDate(30),
            f.setMonth(f.getMonth() - g * b));
          let p = a(f, h) === -g;
          +((l = (0, n.f)(m, void 0)),
          (o = void 0),
          (u = (0, n.f)(l, o?.in)).setHours(23, 59, 59, 999),
          u) ==
            +((s = void 0),
            (c = (d = (0, n.f)(l, s?.in)).getMonth()),
            d.setFullYear(d.getFullYear(), c + 1, 0),
            d.setHours(23, 59, 59, 999),
            d) &&
            1 === b &&
            1 === a(m, h) &&
            (p = !1);
          let v = g * (b - p);
          return 0 === v ? 0 : v;
        },
      ],
      324292,
    ));
};
