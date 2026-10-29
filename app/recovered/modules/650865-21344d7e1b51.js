// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o,
    n = t.r(795081),
    i = t.r(948163)(),
    a = t.r(701054),
    u = t.r(83585);
  if (i) {
    var p = n("RegExp.prototype.exec"),
      c = {},
      y = function () {
        throw c;
      },
      f = { toString: y, valueOf: y };
    ("symbol" == typeof Symbol.toPrimitive && (f[Symbol.toPrimitive] = y),
      (o = function (t) {
        if (!t || "object" != typeof t) return !1;
        var r = u(t, "lastIndex");
        if (!(r && a(r, "value"))) return !1;
        try {
          p(t, f);
        } catch (t) {
          return t === c;
        }
      }));
  } else {
    var l = n("Object.prototype.toString");
    o = function (t) {
      return (
        !!t &&
        ("object" == typeof t || "function" == typeof t) &&
        "[object RegExp]" === l(t)
      );
    };
  }
  r.exports = o;
};
