// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(7284),
    n = t.i(33082),
    o = t.i(871791);
  function i(t) {
    return (i =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(t);
  }
  function a() {
    return (a = Object.assign.bind()).apply(this, arguments);
  }
  function u(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function c(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(t);
      (e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        r.push.apply(r, n));
    }
    return r;
  }
  function l(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? c(Object(r), !0).forEach(function (e) {
            var n, o, a;
            ((n = t),
              (o = e),
              (a = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != i(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != i(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == i(e) ? e : e + "";
              })(o)) in n
                ? Object.defineProperty(n, o, {
                    value: a,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (n[o] = a));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : c(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var s = function (t, e, r, n, o) {
      var i,
        a = Math.min(Math.abs(r) / 2, Math.abs(n) / 2),
        u = n >= 0 ? 1 : -1,
        c = r >= 0 ? 1 : -1,
        l = +((n >= 0 && r >= 0) || (n < 0 && r < 0));
      if (a > 0 && o instanceof Array) {
        for (var s = [0, 0, 0, 0], f = 0; f < 4; f++)
          s[f] = o[f] > a ? a : o[f];
        ((i = "M".concat(t, ",").concat(e + u * s[0])),
          s[0] > 0 &&
            (i += "A "
              .concat(s[0], ",")
              .concat(s[0], ",0,0,")
              .concat(l, ",")
              .concat(t + c * s[0], ",")
              .concat(e)),
          (i += "L ".concat(t + r - c * s[1], ",").concat(e)),
          s[1] > 0 &&
            (i += "A "
              .concat(s[1], ",")
              .concat(s[1], ",0,0,")
              .concat(l, ",\n        ")
              .concat(t + r, ",")
              .concat(e + u * s[1])),
          (i += "L ".concat(t + r, ",").concat(e + n - u * s[2])),
          s[2] > 0 &&
            (i += "A "
              .concat(s[2], ",")
              .concat(s[2], ",0,0,")
              .concat(l, ",\n        ")
              .concat(t + r - c * s[2], ",")
              .concat(e + n)),
          (i += "L ".concat(t + c * s[3], ",").concat(e + n)),
          s[3] > 0 &&
            (i += "A "
              .concat(s[3], ",")
              .concat(s[3], ",0,0,")
              .concat(l, ",\n        ")
              .concat(t, ",")
              .concat(e + n - u * s[3])),
          (i += "Z"));
      } else if (a > 0 && o === +o && o > 0) {
        var p = Math.min(a, o);
        i = "M "
          .concat(t, ",")
          .concat(e + u * p, "\n            A ")
          .concat(p, ",")
          .concat(p, ",0,0,")
          .concat(l, ",")
          .concat(t + c * p, ",")
          .concat(e, "\n            L ")
          .concat(t + r - c * p, ",")
          .concat(e, "\n            A ")
          .concat(p, ",")
          .concat(p, ",0,0,")
          .concat(l, ",")
          .concat(t + r, ",")
          .concat(e + u * p, "\n            L ")
          .concat(t + r, ",")
          .concat(e + n - u * p, "\n            A ")
          .concat(p, ",")
          .concat(p, ",0,0,")
          .concat(l, ",")
          .concat(t + r - c * p, ",")
          .concat(e + n, "\n            L ")
          .concat(t + c * p, ",")
          .concat(e + n, "\n            A ")
          .concat(p, ",")
          .concat(p, ",0,0,")
          .concat(l, ",")
          .concat(t, ",")
          .concat(e + n - u * p, " Z");
      } else
        i = "M "
          .concat(t, ",")
          .concat(e, " h ")
          .concat(r, " v ")
          .concat(n, " h ")
          .concat(-r, " Z");
      return i;
    },
    f = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      radius: 0,
      isAnimationActive: !1,
      isUpdateAnimationActive: !1,
      animationBegin: 0,
      animationDuration: 1500,
      animationEasing: "ease",
    };
  t.s([
    "G",
    0,
    function (t) {
      var i,
        c = l(l({}, f), t),
        p = (0, e.useRef)(),
        d =
          (function (t) {
            if (Array.isArray(t)) return t;
          })((i = (0, e.useState)(-1))) ||
          (function (t) {
            var e =
              null == t
                ? null
                : ("u" > typeof Symbol && t[Symbol.iterator]) ||
                  t["@@iterator"];
            if (null != e) {
              var r,
                n,
                o,
                i,
                a = [],
                u = !0,
                c = !1;
              try {
                ((o = (e = e.call(t)).next), !1);
                for (
                  ;
                  !(u = (r = o.call(e)).done) &&
                  (a.push(r.value), 2 !== a.length);
                  u = !0
                );
              } catch (t) {
                ((c = !0), (n = t));
              } finally {
                try {
                  if (
                    !u &&
                    null != e.return &&
                    ((i = e.return()), Object(i) !== i)
                  )
                    return;
                } finally {
                  if (c) throw n;
                }
              }
              return a;
            }
          })(i) ||
          (function (t) {
            if (t) {
              if ("string" == typeof t) return u(t, 2);
              var e = Object.prototype.toString.call(t).slice(8, -1);
              if (
                ("Object" === e && t.constructor && (e = t.constructor.name),
                "Map" === e || "Set" === e)
              )
                return Array.from(t);
              if (
                "Arguments" === e ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)
              )
                return u(t, 2);
            }
          })(i) ||
          (function () {
            throw TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
        h = d[0],
        y = d[1];
      (0, e.useEffect)(function () {
        if (p.current && p.current.getTotalLength)
          try {
            var t = p.current.getTotalLength();
            t && y(t);
          } catch (t) {}
      }, []);
      var v = c.x,
        m = c.y,
        b = c.width,
        g = c.height,
        x = c.radius,
        O = c.className,
        w = c.animationEasing,
        j = c.animationDuration,
        S = c.animationBegin,
        P = c.isAnimationActive,
        A = c.isUpdateAnimationActive;
      if (v !== +v || m !== +m || b !== +b || g !== +g || 0 === b || 0 === g)
        return null;
      var E = (0, r.U)("recharts-rectangle", O);
      return A
        ? e.default.createElement(
            n.f,
            {
              canBegin: h > 0,
              from: { width: b, height: g, x: v, y: m },
              to: { width: b, height: g, x: v, y: m },
              duration: j,
              animationEasing: w,
              isActive: A,
            },
            function (t) {
              var r = t.width,
                i = t.height,
                u = t.x,
                l = t.y;
              return e.default.createElement(
                n.f,
                {
                  canBegin: h > 0,
                  from: "0px ".concat(-1 === h ? 1 : h, "px"),
                  to: "".concat(h, "px 0px"),
                  attributeName: "strokeDasharray",
                  begin: S,
                  duration: j,
                  isActive: P,
                  easing: w,
                },
                e.default.createElement(
                  "path",
                  a({}, (0, o.T)(c, !0), {
                    className: E,
                    d: s(u, l, r, i, x),
                    ref: p,
                  }),
                ),
              );
            },
          )
        : e.default.createElement(
            "path",
            a({}, (0, o.T)(c, !0), { className: E, d: s(v, m, b, g, x) }),
          );
    },
    "f",
    0,
    function (t, e) {
      if (!t || !e) return !1;
      var r = t.x,
        n = t.y,
        o = e.x,
        i = e.y,
        a = e.width,
        u = e.height;
      if (Math.abs(a) > 0 && Math.abs(u) > 0) {
        var c = Math.min(o, o + a),
          l = Math.max(o, o + a),
          s = Math.min(i, i + u),
          f = Math.max(i, i + u);
        return r >= c && r <= l && n >= s && n <= f;
      }
      return !1;
    },
  ]);
};
