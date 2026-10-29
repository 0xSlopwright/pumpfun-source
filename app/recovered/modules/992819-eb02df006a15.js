// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = Object.prototype.toString,
    n = Math.max,
    i = function (t, r) {
      for (var e = [], o = 0; o < t.length; o += 1) e[o] = t[o];
      for (var n = 0; n < r.length; n += 1) e[n + t.length] = r[n];
      return e;
    },
    a = function (t, r) {
      for (var e = [], o = r || 0, n = 0; o < t.length; o += 1, n += 1)
        e[n] = t[o];
      return e;
    },
    u = function (t, r) {
      for (var e = "", o = 0; o < t.length; o += 1)
        ((e += t[o]), o + 1 < t.length && (e += r));
      return e;
    };
  r.exports = function (t) {
    var r,
      e = this;
    if ("function" != typeof e || "[object Function]" !== o.apply(e))
      throw TypeError("Function.prototype.bind called on incompatible " + e);
    for (
      var p = a(arguments, 1), y = n(0, e.length - p.length), c = [], f = 0;
      f < y;
      f++
    )
      c[f] = "$" + f;
    if (
      ((r = Function(
        "binder",
        "return function (" +
          u(c, ",") +
          "){ return binder.apply(this,arguments); }",
      )(function () {
        if (this instanceof r) {
          var o = e.apply(this, i(p, arguments));
          return Object(o) === o ? o : this;
        }
        return e.apply(t, i(p, arguments));
      })),
      e.prototype)
    ) {
      var l = function () {};
      ((l.prototype = e.prototype),
        (r.prototype = new l()),
        (l.prototype = null));
    }
    return r;
  };
};
