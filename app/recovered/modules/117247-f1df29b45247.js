// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var o;
  if (!Object.keys) {
    var n = Object.prototype.hasOwnProperty,
      c = Object.prototype.toString,
      l = t.r(662831),
      i = Object.prototype.propertyIsEnumerable,
      p = !i.call({ toString: null }, "toString"),
      u = i.call(function () {}, "prototype"),
      a = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ],
      f = function (t) {
        var e = t.constructor;
        return e && e.prototype === t;
      },
      s = {
        $applicationCache: !0,
        $console: !0,
        $external: !0,
        $frame: !0,
        $frameElement: !0,
        $frames: !0,
        $innerHeight: !0,
        $innerWidth: !0,
        $onmozfullscreenchange: !0,
        $onmozfullscreenerror: !0,
        $outerHeight: !0,
        $outerWidth: !0,
        $pageXOffset: !0,
        $pageYOffset: !0,
        $parent: !0,
        $scrollLeft: !0,
        $scrollTop: !0,
        $scrollX: !0,
        $scrollY: !0,
        $self: !0,
        $webkitIndexedDB: !0,
        $webkitStorageInfo: !0,
        $window: !0,
      },
      y = (function () {
        if ("u" < typeof window) return !1;
        for (var t in window)
          try {
            if (
              !s["$" + t] &&
              n.call(window, t) &&
              null !== window[t] &&
              "object" == typeof window[t]
            )
              try {
                f(window[t]);
              } catch (t) {
                return !0;
              }
          } catch (t) {
            return !0;
          }
        return !1;
      })(),
      b = function (t) {
        if ("u" < typeof window || !y) return f(t);
        try {
          return f(t);
        } catch (t) {
          return !1;
        }
      };
    o = function (t) {
      var e = null !== t && "object" == typeof t,
        r = "[object Function]" === c.call(t),
        o = l(t),
        i = e && "[object String]" === c.call(t),
        f = [];
      if (!e && !r && !o) throw TypeError("Object.keys called on a non-object");
      var s = u && r;
      if (i && t.length > 0 && !n.call(t, 0))
        for (var y = 0; y < t.length; ++y) f.push(String(y));
      if (o && t.length > 0)
        for (var g = 0; g < t.length; ++g) f.push(String(g));
      else
        for (var h in t)
          !(s && "prototype" === h) && n.call(t, h) && f.push(String(h));
      if (p)
        for (var j = b(t), $ = 0; $ < a.length; ++$)
          !(j && "constructor" === a[$]) && n.call(t, a[$]) && f.push(a[$]);
      return f;
    };
  }
  e.exports = o;
};
