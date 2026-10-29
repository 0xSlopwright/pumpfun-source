// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o,
    n,
    i = Function.prototype.toString,
    a = "object" == typeof Reflect && null !== Reflect && Reflect.apply;
  if ("function" == typeof a && "function" == typeof Object.defineProperty)
    try {
      ((o = Object.defineProperty({}, "length", {
        get: function () {
          throw n;
        },
      })),
        (n = {}),
        a(
          function () {
            throw 42;
          },
          null,
          o,
        ));
    } catch (t) {
      t !== n && (a = null);
    }
  else a = null;
  var u = /^\s*class\b/,
    p = function (t) {
      try {
        var r = i.call(t);
        return u.test(r);
      } catch (t) {
        return !1;
      }
    },
    y = function (t) {
      try {
        if (p(t)) return !1;
        return (i.call(t), !0);
      } catch (t) {
        return !1;
      }
    },
    c = Object.prototype.toString,
    f = "function" == typeof Symbol && !!Symbol.toStringTag,
    l = !(0 in [,]),
    s = function () {
      return !1;
    };
  if ("object" == typeof document) {
    var g = document.all;
    c.call(g) === c.call(document.all) &&
      (s = function (t) {
        if ((l || !t) && (void 0 === t || "object" == typeof t))
          try {
            var r = c.call(t);
            return (
              ("[object HTMLAllCollection]" === r ||
                "[object HTML document.all class]" === r ||
                "[object HTMLCollection]" === r ||
                "[object Object]" === r) &&
              null == t("")
            );
          } catch (t) {}
        return !1;
      });
  }
  r.exports = a
    ? function (t) {
        if (s(t)) return !0;
        if (!t || ("function" != typeof t && "object" != typeof t)) return !1;
        try {
          a(t, null, o);
        } catch (t) {
          if (t !== n) return !1;
        }
        return !p(t) && y(t);
      }
    : function (t) {
        if (s(t)) return !0;
        if (!t || ("function" != typeof t && "object" != typeof t)) return !1;
        if (f) return y(t);
        if (p(t)) return !1;
        var r = c.call(t);
        return (
          ("[object Function]" === r ||
            "[object GeneratorFunction]" === r ||
            !!/^\[object HTML/.test(r)) &&
          y(t)
        );
      };
};
