// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(989089),
    r = t.i(972947),
    n = t.i(375194),
    o = t.i(94331),
    i = function (t) {
      return (0, e.default)(t) && t.indexOf("%") === t.length - 1;
    },
    a = function (t) {
      return (0, o.default)(t) && !(0, r.default)(t);
    },
    u = 0;
  (t.s(
    [
      "c",
      0,
      function (t, r) {
        return a(t) && a(r)
          ? t - r
          : (0, e.default)(t) && (0, e.default)(r)
            ? t.localeCompare(r)
            : t instanceof Date && r instanceof Date
              ? t.getTime() - r.getTime()
              : String(t).localeCompare(String(r));
      },
      "I",
      0,
      function (t, e, r) {
        return t && t.length
          ? t.find(function (t) {
              return (
                t &&
                ("function" == typeof e ? e(t) : (0, n.default)(t, e)) === r
              );
            })
          : null;
      },
      "f",
      0,
      function (t) {
        if (!t) return null;
        var e = Object.keys(t);
        return e && e.length ? t[e[0]] : null;
      },
      "O",
      0,
      function (t) {
        if (!t || !t.length) return null;
        for (
          var e = t.length,
            r = 0,
            n = 0,
            o = 0,
            i = 0,
            a = 1 / 0,
            u = -1 / 0,
            c = 0,
            l = 0,
            s = 0;
          s < e;
          s++
        )
          ((c = t[s].cx || 0),
            (l = t[s].cy || 0),
            (r += c),
            (n += l),
            (o += c * l),
            (i += c * c),
            (a = Math.min(a, c)),
            (u = Math.max(u, c)));
        var f = e * i != r * r ? (e * o - r * n) / (e * i - r * r) : 0;
        return { xmin: a, xmax: u, a: f, b: (n - f * r) / e };
      },
      "M",
      0,
      function (t, n) {
        var o,
          u =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
          c = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        if (!a(t) && !(0, e.default)(t)) return u;
        if (i(t)) {
          var l = t.indexOf("%");
          o = (n * parseFloat(t.slice(0, l))) / 100;
        } else o = +t;
        return ((0, r.default)(o) && (o = u), c && o > n && (o = n), o);
      },
      "R",
      0,
      function (t) {
        if (!Array.isArray(t)) return !1;
        for (var e = t.length, r = {}, n = 0; n < e; n++)
          if (r[t[n]]) return !0;
          else r[t[n]] = !0;
        return !1;
      },
      "P",
      0,
      function (t, e) {
        return a(t) && a(e)
          ? function (r) {
              return t + r * (e - t);
            }
          : function () {
              return e;
            };
      },
      "m",
      0,
      function (t) {
        return a(t) || (0, e.default)(t);
      },
      "H",
      0,
      a,
      "e",
      0,
      i,
      "n",
      0,
      function (t) {
        return 0 === t ? 0 : t > 0 ? 1 : -1;
      },
      "C",
      0,
      function (t) {
        var e = ++u;
        return "".concat(t || "").concat(e);
      },
    ],
    756438,
  ),
    t.s(
      [
        "f",
        0,
        function (t, e) {
          for (var r in t)
            if (
              {}.hasOwnProperty.call(t, r) &&
              (!{}.hasOwnProperty.call(e, r) || t[r] !== e[r])
            )
              return !1;
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n) && !{}.hasOwnProperty.call(t, n))
              return !1;
          return !0;
        },
      ],
      923763,
    ));
};
