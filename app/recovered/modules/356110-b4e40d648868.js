// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(7284),
    n = t.i(33082),
    o = t.i(661642),
    i = t.i(180793),
    a = t.i(748213),
    u = t.i(575691),
    c = t.i(609612),
    l = t.i(467255),
    s = t.i(756438),
    f = t.i(871791),
    p = t.i(861468),
    d = t.i(223025),
    h = t.i(49647),
    y = t.i(453259),
    v = t.i(462931),
    m = t.i(502844),
    b = t.i(802690),
    g = t.i(898644);
  function x(t) {
    return (x =
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
  function O() {
    return (O = Object.assign.bind()).apply(this, arguments);
  }
  function w(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function j(t, e) {
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
  function S(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? j(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != x(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != x(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == x(e) ? e : e + "";
              })(o)) in n
                ? Object.defineProperty(n, o, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (n[o] = i));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : j(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var P = function (t, e, r, n, o) {
      var i = r - n;
      return (
        "M ".concat(t, ",").concat(e) +
        "L ".concat(t + r, ",").concat(e) +
        "L ".concat(t + r - i / 2, ",").concat(e + o) +
        "L ".concat(t + r - i / 2 - n, ",").concat(e + o) +
        "L ".concat(t, ",").concat(e, " Z")
      );
    },
    A = {
      x: 0,
      y: 0,
      upperWidth: 0,
      lowerWidth: 0,
      height: 0,
      isUpdateAnimationActive: !1,
      animationBegin: 0,
      animationDuration: 1500,
      animationEasing: "ease",
    },
    E = function (t) {
      var o,
        i = S(S({}, A), t),
        a = (0, e.useRef)(),
        u =
          (function (t) {
            if (Array.isArray(t)) return t;
          })((o = (0, e.useState)(-1))) ||
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
          })(o) ||
          (function (t) {
            if (t) {
              if ("string" == typeof t) return w(t, 2);
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
                return w(t, 2);
            }
          })(o) ||
          (function () {
            throw TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
        c = u[0],
        l = u[1];
      (0, e.useEffect)(function () {
        if (a.current && a.current.getTotalLength)
          try {
            var t = a.current.getTotalLength();
            t && l(t);
          } catch (t) {}
      }, []);
      var s = i.x,
        p = i.y,
        d = i.upperWidth,
        h = i.lowerWidth,
        y = i.height,
        v = i.className,
        m = i.animationEasing,
        b = i.animationDuration,
        g = i.animationBegin,
        x = i.isUpdateAnimationActive;
      if (
        s !== +s ||
        p !== +p ||
        d !== +d ||
        h !== +h ||
        y !== +y ||
        (0 === d && 0 === h) ||
        0 === y
      )
        return null;
      var j = (0, r.U)("recharts-trapezoid", v);
      return x
        ? e.default.createElement(
            n.f,
            {
              canBegin: c > 0,
              from: { upperWidth: 0, lowerWidth: 0, height: y, x: s, y: p },
              to: { upperWidth: d, lowerWidth: h, height: y, x: s, y: p },
              duration: b,
              animationEasing: m,
              isActive: x,
            },
            function (t) {
              var r = t.upperWidth,
                o = t.lowerWidth,
                u = t.height,
                l = t.x,
                s = t.y;
              return e.default.createElement(
                n.f,
                {
                  canBegin: c > 0,
                  from: "0px ".concat(-1 === c ? 1 : c, "px"),
                  to: "".concat(c, "px 0px"),
                  attributeName: "strokeDasharray",
                  begin: g,
                  duration: b,
                  easing: m,
                },
                e.default.createElement(
                  "path",
                  O({}, (0, f.T)(i, !0), {
                    className: j,
                    d: P(l, s, r, o, u),
                    ref: a,
                  }),
                ),
              );
            },
          )
        : e.default.createElement(
            "g",
            null,
            e.default.createElement(
              "path",
              O({}, (0, f.T)(i, !0), { className: j, d: P(s, p, d, h, y) }),
            ),
          );
    },
    M = t.i(460242);
  function k(t) {
    return (k =
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
  function T() {
    return (T = Object.assign.bind()).apply(this, arguments);
  }
  function _(t, e) {
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
  function C(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? _(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != k(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != k(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == k(e) ? e : e + "";
              })(o)) in n
                ? Object.defineProperty(n, o, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (n[o] = i));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : _(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var I = function (t) {
      var e = t.cx,
        r = t.cy,
        n = t.radius,
        o = t.angle,
        i = t.sign,
        a = t.isExternal,
        u = t.cornerRadius,
        c = t.cornerIsExternal,
        l = u * (a ? 1 : -1) + n,
        s = Math.asin(u / l) / M.T,
        f = c ? o : o + i * s;
      return {
        center: (0, M.v)(e, r, l, f),
        circleTangency: (0, M.v)(e, r, n, f),
        lineTangency: (0, M.v)(e, r, l * Math.cos(s * M.T), c ? o - i * s : o),
        theta: s,
      };
    },
    D = function (t) {
      var e = t.cx,
        r = t.cy,
        n = t.innerRadius,
        o = t.outerRadius,
        i = t.startAngle,
        a = t.endAngle,
        u = (0, s.n)(a - i) * Math.min(Math.abs(a - i), 359.999),
        c = i + u,
        l = (0, M.v)(e, r, o, i),
        f = (0, M.v)(e, r, o, c),
        p = "M "
          .concat(l.x, ",")
          .concat(l.y, "\n    A ")
          .concat(o, ",")
          .concat(o, ",0,\n    ")
          .concat(+(Math.abs(u) > 180), ",")
          .concat(+(i > c), ",\n    ")
          .concat(f.x, ",")
          .concat(f.y, "\n  ");
      if (n > 0) {
        var d = (0, M.v)(e, r, n, i),
          h = (0, M.v)(e, r, n, c);
        p += "L "
          .concat(h.x, ",")
          .concat(h.y, "\n            A ")
          .concat(n, ",")
          .concat(n, ",0,\n            ")
          .concat(+(Math.abs(u) > 180), ",")
          .concat(+(i <= c), ",\n            ")
          .concat(d.x, ",")
          .concat(d.y, " Z");
      } else p += "L ".concat(e, ",").concat(r, " Z");
      return p;
    },
    N = function (t) {
      var e = t.cx,
        r = t.cy,
        n = t.innerRadius,
        o = t.outerRadius,
        i = t.cornerRadius,
        a = t.forceCornerRadius,
        u = t.cornerIsExternal,
        c = t.startAngle,
        l = t.endAngle,
        f = (0, s.n)(l - c),
        p = I({
          cx: e,
          cy: r,
          radius: o,
          angle: c,
          sign: f,
          cornerRadius: i,
          cornerIsExternal: u,
        }),
        d = p.circleTangency,
        h = p.lineTangency,
        y = p.theta,
        v = I({
          cx: e,
          cy: r,
          radius: o,
          angle: l,
          sign: -f,
          cornerRadius: i,
          cornerIsExternal: u,
        }),
        m = v.circleTangency,
        b = v.lineTangency,
        g = v.theta,
        x = u ? Math.abs(c - l) : Math.abs(c - l) - y - g;
      if (x < 0)
        return a
          ? "M "
              .concat(h.x, ",")
              .concat(h.y, "\n        a")
              .concat(i, ",")
              .concat(i, ",0,0,1,")
              .concat(2 * i, ",0\n        a")
              .concat(i, ",")
              .concat(i, ",0,0,1,")
              .concat(-(2 * i), ",0\n      ")
          : D({
              cx: e,
              cy: r,
              innerRadius: n,
              outerRadius: o,
              startAngle: c,
              endAngle: l,
            });
      var O = "M "
        .concat(h.x, ",")
        .concat(h.y, "\n    A")
        .concat(i, ",")
        .concat(i, ",0,0,")
        .concat(+(f < 0), ",")
        .concat(d.x, ",")
        .concat(d.y, "\n    A")
        .concat(o, ",")
        .concat(o, ",0,")
        .concat(+(x > 180), ",")
        .concat(+(f < 0), ",")
        .concat(m.x, ",")
        .concat(m.y, "\n    A")
        .concat(i, ",")
        .concat(i, ",0,0,")
        .concat(+(f < 0), ",")
        .concat(b.x, ",")
        .concat(b.y, "\n  ");
      if (n > 0) {
        var w = I({
            cx: e,
            cy: r,
            radius: n,
            angle: c,
            sign: f,
            isExternal: !0,
            cornerRadius: i,
            cornerIsExternal: u,
          }),
          j = w.circleTangency,
          S = w.lineTangency,
          P = w.theta,
          A = I({
            cx: e,
            cy: r,
            radius: n,
            angle: l,
            sign: -f,
            isExternal: !0,
            cornerRadius: i,
            cornerIsExternal: u,
          }),
          E = A.circleTangency,
          M = A.lineTangency,
          k = A.theta,
          T = u ? Math.abs(c - l) : Math.abs(c - l) - P - k;
        if (T < 0 && 0 === i)
          return "".concat(O, "L").concat(e, ",").concat(r, "Z");
        O += "L"
          .concat(M.x, ",")
          .concat(M.y, "\n      A")
          .concat(i, ",")
          .concat(i, ",0,0,")
          .concat(+(f < 0), ",")
          .concat(E.x, ",")
          .concat(E.y, "\n      A")
          .concat(n, ",")
          .concat(n, ",0,")
          .concat(+(T > 180), ",")
          .concat(+(f > 0), ",")
          .concat(j.x, ",")
          .concat(j.y, "\n      A")
          .concat(i, ",")
          .concat(i, ",0,0,")
          .concat(+(f < 0), ",")
          .concat(S.x, ",")
          .concat(S.y, "Z");
      } else O += "L".concat(e, ",").concat(r, "Z");
      return O;
    },
    B = {
      cx: 0,
      cy: 0,
      innerRadius: 0,
      outerRadius: 0,
      startAngle: 0,
      endAngle: 0,
      cornerRadius: 0,
      forceCornerRadius: !1,
      cornerIsExternal: !1,
    },
    R = function (t) {
      var n,
        o = C(C({}, B), t),
        i = o.cx,
        a = o.cy,
        u = o.innerRadius,
        c = o.outerRadius,
        l = o.cornerRadius,
        p = o.forceCornerRadius,
        d = o.cornerIsExternal,
        h = o.startAngle,
        y = o.endAngle,
        v = o.className;
      if (c < u || h === y) return null;
      var m = (0, r.U)("recharts-sector", v),
        b = c - u,
        g = (0, s.M)(l, b, 0, !0);
      return (
        (n =
          g > 0 && 360 > Math.abs(h - y)
            ? N({
                cx: i,
                cy: a,
                innerRadius: u,
                outerRadius: c,
                cornerRadius: Math.min(g, b / 2),
                forceCornerRadius: p,
                cornerIsExternal: d,
                startAngle: h,
                endAngle: y,
              })
            : D({
                cx: i,
                cy: a,
                innerRadius: u,
                outerRadius: c,
                startAngle: h,
                endAngle: y,
              })),
        e.default.createElement(
          "path",
          T({}, (0, f.T)(o, !0), { className: m, d: n, role: "img" }),
        )
      );
    };
  t.s(["f", 0, R], 167538);
  var L = t.i(270540),
    U = [
      "option",
      "shapeType",
      "propTransformer",
      "activeClassName",
      "isActive",
    ];
  function z(t) {
    return (z =
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
  function $(t, e) {
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
  function H(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? $(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != z(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != z(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == z(e) ? e : e + "";
              })(o)) in n
                ? Object.defineProperty(n, o, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (n[o] = i));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : $(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function F(t) {
    var r = t.shapeType,
      n = t.elementProps;
    switch (r) {
      case "rectangle":
        return e.default.createElement(g.G, n);
      case "trapezoid":
        return e.default.createElement(E, n);
      case "sector":
        return e.default.createElement(R, n);
      case "symbols":
        if ("symbols" === r) return e.default.createElement(L.f, n);
        break;
      default:
        return null;
    }
  }
  function W(t) {
    var r,
      n = t.option,
      o = t.shapeType,
      i = t.propTransformer,
      u = t.activeClassName,
      c = t.isActive,
      l = (function (t, e) {
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
      })(t, U);
    if ((0, e.isValidElement)(n))
      r = (0, e.cloneElement)(
        n,
        H(H({}, l), (0, e.isValidElement)(n) ? n.props : n),
      );
    else if ((0, v.default)(n)) r = n(l);
    else if ((0, m.default)(n) && !(0, b.default)(n)) {
      var s = (
        void 0 === i
          ? function (t, e) {
              return H(H({}, e), t);
            }
          : i
      )(n, l);
      r = e.default.createElement(F, { shapeType: o, elementProps: s });
    } else r = e.default.createElement(F, { shapeType: o, elementProps: l });
    return c
      ? e.default.createElement(
          a.f,
          { className: void 0 === u ? "recharts-active-shape" : u },
          r,
        )
      : r;
  }
  function X(t, e) {
    return null != e && "trapezoids" in t.props;
  }
  function q(t, e) {
    return null != e && "sectors" in t.props;
  }
  function V(t, e) {
    return null != e && "points" in t.props;
  }
  function G(t, e) {
    var r,
      n,
      o =
        t.x === (null == e || null == (r = e.labelViewBox) ? void 0 : r.x) ||
        t.x === e.x,
      i =
        t.y === (null == e || null == (n = e.labelViewBox) ? void 0 : n.y) ||
        t.y === e.y;
    return o && i;
  }
  function Y(t, e) {
    var r = t.endAngle === e.endAngle,
      n = t.startAngle === e.startAngle;
    return r && n;
  }
  function K(t, e) {
    var r = t.x === e.x,
      n = t.y === e.y,
      o = t.z === e.z;
    return r && n && o;
  }
  t.s(
    [
      "C",
      0,
      W,
      "y",
      0,
      function (t) {
        var e,
          r,
          n,
          i = t.activeTooltipItem,
          a = t.graphicalItem,
          u = t.itemData,
          c =
            (X(a, i)
              ? (e = "trapezoids")
              : q(a, i)
                ? (e = "sectors")
                : V(a, i) && (e = "points"),
            e),
          l = X(a, i)
            ? null == (r = i.tooltipPayload) ||
              null == (r = r[0]) ||
              null == (r = r.payload)
              ? void 0
              : r.payload
            : q(a, i)
              ? null == (n = i.tooltipPayload) ||
                null == (n = n[0]) ||
                null == (n = n.payload)
                ? void 0
                : n.payload
              : V(a, i)
                ? i.payload
                : {},
          s = u.filter(function (t, e) {
            var r = (0, o.default)(l, t),
              n = a.props[c].filter(function (t) {
                var e;
                return (X(a, i)
                  ? (e = G)
                  : q(a, i)
                    ? (e = Y)
                    : V(a, i) && (e = K),
                e)(t, i);
              }),
              u = a.props[c].indexOf(n[n.length - 1]);
            return r && e === u;
          });
        return u.indexOf(s[s.length - 1]);
      },
      "z",
      0,
      X,
      "s",
      0,
      q,
      "_",
      0,
      V,
    ],
    224029,
  );
  var Z = ["x", "y"];
  function J(t) {
    return (J =
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
  function Q() {
    return (Q = Object.assign.bind()).apply(this, arguments);
  }
  function tt(t, e) {
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
  function te(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tt(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != J(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != J(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == J(e) ? e : e + "";
              })(o)) in n
                ? Object.defineProperty(n, o, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (n[o] = i));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tt(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tr(t, e) {
    var r = t.x,
      n = t.y,
      o = (function (t, e) {
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
      })(t, Z),
      i = parseInt("".concat(r), 10),
      a = parseInt("".concat(n), 10),
      u = parseInt("".concat(e.height || o.height), 10),
      c = parseInt("".concat(e.width || o.width), 10);
    return te(
      te(te(te(te({}, e), o), i ? { x: i } : {}), a ? { y: a } : {}),
      {},
      { height: u, width: c, name: e.name, radius: e.radius },
    );
  }
  function tn(t) {
    return e.default.createElement(
      W,
      Q(
        {
          shapeType: "rectangle",
          propTransformer: tr,
          activeClassName: "recharts-active-bar",
        },
        t,
      ),
    );
  }
  var to = function (t) {
      var e =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
      return function (r, n) {
        if ("number" == typeof t) return t;
        var o = "number" == typeof r;
        return o ? t(r, n) : (o || (0, y.f)(!1), e);
      };
    },
    ti = ["value", "background"];
  function ta(t) {
    return (ta =
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
  function tu() {
    return (tu = Object.assign.bind()).apply(this, arguments);
  }
  function tc(t, e) {
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
  function tl(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tc(Object(r), !0).forEach(function (e) {
            th(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tc(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function ts(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, ty(n.key), n));
    }
  }
  function tf() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tf = function () {
      return !!t;
    })();
  }
  function tp(t) {
    return (tp = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function td(t, e) {
    return (td = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function th(t, e, r) {
    return (
      (e = ty(e)) in t
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
  function ty(t) {
    var e = (function (t, e) {
      if ("object" != ta(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != ta(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == ta(e) ? e : e + "";
  }
  var tv = (function (t) {
    var c, p;
    function y() {
      var t, e, r;
      if (!(this instanceof y))
        throw TypeError("Cannot call a class as a function");
      for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
        o[i] = arguments[i];
      return (
        (e = y),
        (r = [].concat(o)),
        (e = tp(e)),
        th(
          (t = (function (t, e) {
            if (e && ("object" === ta(e) || "function" == typeof e)) return e;
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
            tf()
              ? Reflect.construct(e, r || [], tp(this).constructor)
              : e.apply(this, r),
          )),
          "state",
          { isAnimationFinished: !1 },
        ),
        th(t, "id", (0, s.C)("recharts-bar-")),
        th(t, "handleAnimationEnd", function () {
          var e = t.props.onAnimationEnd;
          (t.setState({ isAnimationFinished: !0 }), e && e());
        }),
        th(t, "handleAnimationStart", function () {
          var e = t.props.onAnimationStart;
          (t.setState({ isAnimationFinished: !1 }), e && e());
        }),
        t
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (y.prototype = Object.create(t && t.prototype, {
        constructor: { value: y, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(y, "prototype", { writable: !1 }),
      t && td(y, t),
      (c = [
        {
          key: "renderRectanglesStatically",
          value: function (t) {
            var r = this,
              n = this.props,
              o = n.shape,
              i = n.dataKey,
              u = n.activeIndex,
              c = n.activeBar,
              l = (0, f.T)(this.props, !1);
            return (
              t &&
              t.map(function (t, n) {
                var s = n === u,
                  f = tl(
                    tl(tl({}, l), t),
                    {},
                    {
                      isActive: s,
                      option: s ? c : o,
                      index: n,
                      dataKey: i,
                      onAnimationStart: r.handleAnimationStart,
                      onAnimationEnd: r.handleAnimationEnd,
                    },
                  );
                return e.default.createElement(
                  a.f,
                  tu(
                    { className: "recharts-bar-rectangle" },
                    (0, h.T)(r.props, t, n),
                    {
                      key: "rectangle-"
                        .concat(null == t ? void 0 : t.x, "-")
                        .concat(null == t ? void 0 : t.y, "-")
                        .concat(null == t ? void 0 : t.value, "-")
                        .concat(n),
                    },
                  ),
                  e.default.createElement(tn, f),
                );
              })
            );
          },
        },
        {
          key: "renderRectanglesWithAnimation",
          value: function () {
            var t = this,
              r = this.props,
              o = r.data,
              i = r.layout,
              u = r.isAnimationActive,
              c = r.animationBegin,
              l = r.animationDuration,
              f = r.animationEasing,
              p = r.animationId,
              d = this.state.prevData;
            return e.default.createElement(
              n.f,
              {
                begin: c,
                duration: l,
                isActive: u,
                easing: f,
                from: { t: 0 },
                to: { t: 1 },
                key: "bar-".concat(p),
                onAnimationEnd: this.handleAnimationEnd,
                onAnimationStart: this.handleAnimationStart,
              },
              function (r) {
                var n = r.t,
                  u = o.map(function (t, e) {
                    var r = d && d[e];
                    if (r) {
                      var o = (0, s.P)(r.x, t.x),
                        a = (0, s.P)(r.y, t.y),
                        u = (0, s.P)(r.width, t.width),
                        c = (0, s.P)(r.height, t.height);
                      return tl(
                        tl({}, t),
                        {},
                        { x: o(n), y: a(n), width: u(n), height: c(n) },
                      );
                    }
                    if ("horizontal" === i) {
                      var l = (0, s.P)(0, t.height)(n);
                      return tl(
                        tl({}, t),
                        {},
                        { y: t.y + t.height - l, height: l },
                      );
                    }
                    var f = (0, s.P)(0, t.width)(n);
                    return tl(tl({}, t), {}, { width: f });
                  });
                return e.default.createElement(
                  a.f,
                  null,
                  t.renderRectanglesStatically(u),
                );
              },
            );
          },
        },
        {
          key: "renderRectangles",
          value: function () {
            var t = this.props,
              e = t.data,
              r = t.isAnimationActive,
              n = this.state.prevData;
            return r && e && e.length && (!n || !(0, o.default)(n, e))
              ? this.renderRectanglesWithAnimation()
              : this.renderRectanglesStatically(e);
          },
        },
        {
          key: "renderBackground",
          value: function () {
            var t = this,
              r = this.props,
              n = r.data,
              o = r.dataKey,
              i = r.activeIndex,
              a = (0, f.T)(this.props.background, !1);
            return n.map(function (r, n) {
              r.value;
              var u = r.background,
                c = (function (t, e) {
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
                })(r, ti);
              if (!u) return null;
              var l = tl(
                tl(
                  tl(tl(tl({}, c), {}, { fill: "#eee" }, u), a),
                  (0, h.T)(t.props, r, n),
                ),
                {},
                {
                  onAnimationStart: t.handleAnimationStart,
                  onAnimationEnd: t.handleAnimationEnd,
                  dataKey: o,
                  index: n,
                  className: "recharts-bar-background-rectangle",
                },
              );
              return e.default.createElement(
                tn,
                tu(
                  {
                    key: "background-bar-".concat(n),
                    option: t.props.background,
                    isActive: n === i,
                  },
                  l,
                ),
              );
            });
          },
        },
        {
          key: "renderErrorBar",
          value: function (t, r) {
            if (this.props.isAnimationActive && !this.state.isAnimationFinished)
              return null;
            var n = this.props,
              o = n.data,
              i = n.xAxis,
              c = n.yAxis,
              l = n.layout,
              s = n.children,
              p = (0, f.M)(s, u.f);
            if (!p) return null;
            var h = "vertical" === l ? o[0].height / 2 : o[0].width / 2,
              y = function (t, e) {
                var r = Array.isArray(t.value) ? t.value[1] : t.value;
                return { x: t.x, y: t.y, value: r, errorVal: (0, d.K)(t, e) };
              };
            return e.default.createElement(
              a.f,
              { clipPath: t ? "url(#clipPath-".concat(r, ")") : null },
              p.map(function (t) {
                return e.default.cloneElement(t, {
                  key: "error-bar-".concat(r, "-").concat(t.props.dataKey),
                  data: o,
                  xAxis: i,
                  yAxis: c,
                  layout: l,
                  offset: h,
                  dataPointFormatter: y,
                });
              }),
            );
          },
        },
        {
          key: "render",
          value: function () {
            var t = this.props,
              n = t.hide,
              o = t.data,
              u = t.className,
              c = t.xAxis,
              s = t.yAxis,
              f = t.left,
              p = t.top,
              d = t.width,
              h = t.height,
              y = t.isAnimationActive,
              v = t.background,
              m = t.id;
            if (n || !o || !o.length) return null;
            var b = this.state.isAnimationFinished,
              g = (0, r.U)("recharts-bar", u),
              x = c && c.allowDataOverflow,
              O = s && s.allowDataOverflow,
              w = x || O,
              j = (0, i.default)(m) ? this.id : m;
            return e.default.createElement(
              a.f,
              { className: g },
              x || O
                ? e.default.createElement(
                    "defs",
                    null,
                    e.default.createElement(
                      "clipPath",
                      { id: "clipPath-".concat(j) },
                      e.default.createElement("rect", {
                        x: x ? f : f - d / 2,
                        y: O ? p : p - h / 2,
                        width: x ? d : 2 * d,
                        height: O ? h : 2 * h,
                      }),
                    ),
                  )
                : null,
              e.default.createElement(
                a.f,
                {
                  className: "recharts-bar-rectangles",
                  clipPath: w ? "url(#clipPath-".concat(j, ")") : null,
                },
                v ? this.renderBackground() : null,
                this.renderRectangles(),
              ),
              this.renderErrorBar(w, j),
              (!y || b) && l.f.renderCallByParent(this.props, o),
            );
          },
        },
      ]),
      (p = [
        {
          key: "getDerivedStateFromProps",
          value: function (t, e) {
            return t.animationId !== e.prevAnimationId
              ? {
                  prevAnimationId: t.animationId,
                  curData: t.data,
                  prevData: e.curData,
                }
              : t.data !== e.curData
                ? { curData: t.data }
                : null;
          },
        },
      ]),
      c && ts(y.prototype, c),
      p && ts(y, p),
      Object.defineProperty(y, "prototype", { writable: !1 }),
      y
    );
  })(e.PureComponent);
  (th(tv, "displayName", "Bar"),
    th(tv, "defaultProps", {
      xAxisId: 0,
      yAxisId: 0,
      legendType: "rect",
      minPointSize: 0,
      hide: !1,
      data: [],
      layout: "vertical",
      activeBar: !1,
      isAnimationActive: !p.f.isSsr,
      animationBegin: 0,
      animationDuration: 400,
      animationEasing: "ease",
    }),
    th(tv, "getComposedData", function (t) {
      var e = t.props,
        r = t.item,
        n = t.barPosition,
        o = t.bandSize,
        i = t.xAxis,
        a = t.yAxis,
        u = t.xAxisTicks,
        l = t.yAxisTicks,
        p = t.stackedData,
        h = t.dataStartIndex,
        y = t.displayedData,
        v = t.offset,
        m = (0, d.y)(n, r);
      if (!m) return null;
      var b = e.layout,
        g = r.type.defaultProps,
        x = void 0 !== g ? tl(tl({}, g), r.props) : r.props,
        O = x.dataKey,
        w = x.children,
        j = x.minPointSize,
        S = "horizontal" === b ? a : i,
        P = p ? S.scale.domain() : null,
        A = (0, d.i)({ numericAxis: S }),
        E = (0, f.M)(w, c.f),
        M = y.map(function (t, e) {
          p
            ? (c = (0, d.v)(p[h + e], P))
            : Array.isArray((c = (0, d.K)(t, O))) || (c = [A, c]);
          var n = to(j, tv.defaultProps.minPointSize)(c[1], e);
          if ("horizontal" === b) {
            var c,
              f,
              y,
              v,
              g,
              x,
              w,
              S = [a.scale(c[0]), a.scale(c[1])],
              M = S[0],
              k = S[1];
            ((f = (0, d.W)({
              axis: i,
              ticks: u,
              bandSize: o,
              offset: m.offset,
              entry: t,
              index: e,
            })),
              (y = null != (w = null != k ? k : M) ? w : void 0),
              (v = m.size));
            var T = M - k;
            if (
              ((g = Number.isNaN(T) ? 0 : T),
              (x = { x: f, y: a.y, width: v, height: a.height }),
              Math.abs(n) > 0 && Math.abs(g) < Math.abs(n))
            ) {
              var _ = (0, s.n)(g || n) * (Math.abs(n) - Math.abs(g));
              ((y -= _), (g += _));
            }
          } else {
            var C = [i.scale(c[0]), i.scale(c[1])],
              I = C[0],
              D = C[1];
            if (
              ((f = I),
              (y = (0, d.W)({
                axis: a,
                ticks: l,
                bandSize: o,
                offset: m.offset,
                entry: t,
                index: e,
              })),
              (v = D - I),
              (g = m.size),
              (x = { x: i.x, y: y, width: i.width, height: g }),
              Math.abs(n) > 0 && Math.abs(v) < Math.abs(n))
            ) {
              var N = (0, s.n)(v || n) * (Math.abs(n) - Math.abs(v));
              v += N;
            }
          }
          return tl(
            tl(
              tl({}, t),
              {},
              {
                x: f,
                y: y,
                width: v,
                height: g,
                value: p ? c : c[1],
                payload: t,
                background: x,
              },
              E && E[e] && E[e].props,
            ),
            {},
            {
              tooltipPayload: [(0, d.r)(r, t)],
              tooltipPosition: { x: f + v / 2, y: y + g / 2 },
            },
          );
        });
      return tl({ data: M, layout: b }, v);
    }),
    t.s(["f", 0, tv], 356110));
};
