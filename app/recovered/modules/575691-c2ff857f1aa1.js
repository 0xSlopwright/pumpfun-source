// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386);
  function r(t, e) {
    if (!t) throw Error("Invariant failed");
  }
  t.s(["f", 0, r], 453259);
  var n = t.i(748213),
    o = t.i(871791),
    i = [
      "offset",
      "layout",
      "width",
      "dataKey",
      "data",
      "dataPointFormatter",
      "xAxis",
      "yAxis",
    ];
  function a(t) {
    return (a =
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
  function u() {
    return (u = Object.assign.bind()).apply(this, arguments);
  }
  function c(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function l() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (l = function () {
      return !!t;
    })();
  }
  function s(t) {
    return (s = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function f(t, e) {
    return (f = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function p(t, e, r) {
    return (
      (e = d(e)) in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  function d(t) {
    var e = (function (t, e) {
      if ("object" != a(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != a(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == a(e) ? e : e + "";
  }
  var h = (function (t) {
    var p;
    function h() {
      var t, e;
      if (!(this instanceof h))
        throw TypeError("Cannot call a class as a function");
      return (
        (t = h),
        (e = arguments),
        (t = s(t)),
        (function (t, e) {
          if (e && ("object" === a(e) || "function" == typeof e)) return e;
          if (void 0 !== e)
            throw TypeError(
              "Derived constructors may only return object or undefined",
            );
          var r = t;
          if (void 0 === r)
            throw ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            );
          return r;
        })(
          this,
          l()
            ? Reflect.construct(t, e || [], s(this).constructor)
            : t.apply(this, e),
        )
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (h.prototype = Object.create(t && t.prototype, {
        constructor: { value: h, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(h, "prototype", { writable: !1 }),
      t && f(h, t),
      (p = [
        {
          key: "render",
          value: function () {
            var t = this.props,
              a = t.offset,
              l = t.layout,
              s = t.width,
              f = t.dataKey,
              p = t.data,
              d = t.dataPointFormatter,
              h = t.xAxis,
              y = t.yAxis,
              v = (function (t, e) {
                if (null == t) return {};
                var r,
                  n,
                  o = (function (t, e) {
                    if (null == t) return {};
                    var r = {};
                    for (var n in t)
                      if (Object.prototype.hasOwnProperty.call(t, n)) {
                        if (e.indexOf(n) >= 0) continue;
                        r[n] = t[n];
                      }
                    return r;
                  })(t, e);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(t);
                  for (n = 0; n < i.length; n++)
                    ((r = i[n]),
                      !(e.indexOf(r) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(t, r) &&
                        (o[r] = t[r]));
                }
                return o;
              })(t, i),
              m = (0, o.T)(v, !1);
            "x" === this.props.direction && "number" !== h.type && r(!1);
            var b = p.map(function (t) {
              var r,
                o,
                i = d(t, f),
                p = i.x,
                v = i.y,
                b = i.value,
                g = i.errorVal;
              if (!g) return null;
              var x = [];
              if (Array.isArray(g)) {
                var O =
                  (function (t) {
                    if (Array.isArray(t)) return t;
                  })(g) ||
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
                  })(g) ||
                  (function (t) {
                    if (t) {
                      if ("string" == typeof t) return c(t, 2);
                      var e = Object.prototype.toString.call(t).slice(8, -1);
                      if (
                        ("Object" === e &&
                          t.constructor &&
                          (e = t.constructor.name),
                        "Map" === e || "Set" === e)
                      )
                        return Array.from(t);
                      if (
                        "Arguments" === e ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)
                      )
                        return c(t, 2);
                    }
                  })(g) ||
                  (function () {
                    throw TypeError(
                      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                    );
                  })();
                ((r = O[0]), (o = O[1]));
              } else r = o = g;
              if ("vertical" === l) {
                var w = h.scale,
                  j = v + a,
                  S = j + s,
                  P = j - s,
                  A = w(b - r),
                  E = w(b + o);
                (x.push({ x1: E, y1: S, x2: E, y2: P }),
                  x.push({ x1: A, y1: j, x2: E, y2: j }),
                  x.push({ x1: A, y1: S, x2: A, y2: P }));
              } else if ("horizontal" === l) {
                var M = y.scale,
                  k = p + a,
                  T = k - s,
                  _ = k + s,
                  C = M(b - r),
                  I = M(b + o);
                (x.push({ x1: T, y1: I, x2: _, y2: I }),
                  x.push({ x1: k, y1: C, x2: k, y2: I }),
                  x.push({ x1: T, y1: C, x2: _, y2: C }));
              }
              return e.default.createElement(
                n.f,
                u(
                  {
                    className: "recharts-errorBar",
                    key: "bar-".concat(
                      x.map(function (t) {
                        return ""
                          .concat(t.x1, "-")
                          .concat(t.x2, "-")
                          .concat(t.y1, "-")
                          .concat(t.y2);
                      }),
                    ),
                  },
                  m,
                ),
                x.map(function (t) {
                  return e.default.createElement(
                    "line",
                    u({}, t, {
                      key: "line-"
                        .concat(t.x1, "-")
                        .concat(t.x2, "-")
                        .concat(t.y1, "-")
                        .concat(t.y2),
                    }),
                  );
                }),
              );
            });
            return e.default.createElement(
              n.f,
              { className: "recharts-errorBars" },
              b,
            );
          },
        },
      ]),
      (function (t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          ((n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(t, d(n.key), n));
        }
      })(h.prototype, p),
      Object.defineProperty(h, "prototype", { writable: !1 }),
      h
    );
  })(e.default.Component);
  (p(h, "defaultProps", {
    stroke: "black",
    strokeWidth: 1.5,
    width: 5,
    offset: 0,
    layout: "horizontal",
  }),
    p(h, "displayName", "ErrorBar"),
    t.s(["f", 0, h], 575691));
};
