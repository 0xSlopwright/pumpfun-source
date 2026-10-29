// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(238153),
    n = e.i(492421),
    a = e.i(632713),
    i = e.i(539392),
    r = e.i(504244),
    o = e.i(511518),
    s = e.i(324292),
    l = e.i(737038),
    u = e.i(667062);
  e.s(
    [
      "f",
      0,
      function (e, d, c) {
        let m,
          f,
          h = (0, n.f)(),
          g = c?.locale ?? h.locale ?? t.f,
          b = (0, r.f)(e, d);
        if (isNaN(b)) throw RangeError("Invalid time value");
        let p = Object.assign({}, c, {
            addSuffix: c?.addSuffix,
            comparison: b,
          }),
          [v, y] = (0, i.f)(c?.in, ...(b > 0 ? [d, e] : [e, d])),
          x = ((f = (0, u.f)(y, v) / 1e3), (0, l.f)(void 0)(f)),
          w = Math.round((x - ((0, a.f)(y) - (0, a.f)(v)) / 1e3) / 60);
        if (w < 2)
          if (c?.includeSeconds)
            if (x < 5) return g.formatDistance("lessThanXSeconds", 5, p);
            else if (x < 10) return g.formatDistance("lessThanXSeconds", 10, p);
            else if (x < 20) return g.formatDistance("lessThanXSeconds", 20, p);
            else if (x < 40) return g.formatDistance("halfAMinute", 0, p);
            else if (x < 60) return g.formatDistance("lessThanXMinutes", 1, p);
            else return g.formatDistance("xMinutes", 1, p);
          else if (0 === w) return g.formatDistance("lessThanXMinutes", 1, p);
          else return g.formatDistance("xMinutes", w, p);
        if (w < 45) return g.formatDistance("xMinutes", w, p);
        if (w < 90) return g.formatDistance("aboutXHours", 1, p);
        if (w < o.k) {
          let e = Math.round(w / 60);
          return g.formatDistance("aboutXHours", e, p);
        }
        if (w < 2520) return g.formatDistance("xDays", 1, p);
        else if (w < o.d) {
          let e = Math.round(w / o.k);
          return g.formatDistance("xDays", e, p);
        } else if (w < 2 * o.d)
          return (
            (m = Math.round(w / o.d)),
            g.formatDistance("aboutXMonths", m, p)
          );
        if ((m = (0, s.f)(y, v)) < 12) {
          let e = Math.round(w / o.d);
          return g.formatDistance("xMonths", e, p);
        }
        {
          let e = m % 12,
            t = Math.trunc(m / 12);
          return e < 3
            ? g.formatDistance("aboutXYears", t, p)
            : e < 9
              ? g.formatDistance("overXYears", t, p)
              : g.formatDistance("almostXYears", t + 1, p);
        }
      },
    ],
    114450,
  );
};
