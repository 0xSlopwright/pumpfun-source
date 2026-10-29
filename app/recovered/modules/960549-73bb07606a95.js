// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(80925),
    n = t.r(44253),
    i = t.r(63366),
    a = t.r(795081),
    u = t.r(83585),
    p = t.r(211915),
    c = a("Object.prototype.toString"),
    y = t.r(948163)(),
    f = "u" < typeof globalThis ? t.g : globalThis,
    l = n(),
    s = a("String.prototype.slice"),
    g =
      a("Array.prototype.indexOf", !0) ||
      function (t, r) {
        for (var e = 0; e < t.length; e += 1) if (t[e] === r) return e;
        return -1;
      },
    b = { __proto__: null };
  y && u && p
    ? o(l, function (t) {
        var r = new f[t]();
        if (Symbol.toStringTag in r && p) {
          var e = p(r),
            o = u(e, Symbol.toStringTag);
          (!o && e && (o = u(p(e), Symbol.toStringTag)),
            (b["$" + t] = i(o.get)));
        }
      })
    : o(l, function (t) {
        var r = new f[t](),
          e = r.slice || r.set;
        e && (b["$" + t] = i(e));
      });
  var v = function (t) {
      var r = !1;
      return (
        o(b, function (e, o) {
          if (!r)
            try {
              "$" + e(t) === o && (r = s(o, 1));
            } catch (t) {}
        }),
        r
      );
    },
    h = function (t) {
      var r = !1;
      return (
        o(b, function (e, o) {
          if (!r)
            try {
              (e(t), (r = s(o, 1)));
            } catch (t) {}
        }),
        r
      );
    };
  r.exports = function (t) {
    if (!t || "object" != typeof t) return !1;
    if (!y) {
      var r = s(c(t), 8, -1);
      return g(l, r) > -1 ? r : "Object" === r && h(t);
    }
    return u ? v(t) : null;
  };
};
