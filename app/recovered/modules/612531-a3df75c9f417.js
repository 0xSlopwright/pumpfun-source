// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(180793),
    n = t.i(462931),
    o = t.i(920404),
    i = t.i(375194),
    a = t.i(904703),
    u = t.i(648250),
    c = t.i(7284),
    l = t.i(453259),
    s = t.i(236475),
    f = t.i(748213),
    p = t.i(306657),
    d = t.i(65742),
    h = t.i(509406),
    y = t.i(898644),
    v = t.i(871791),
    m = t.i(785743),
    b = t.i(302334),
    g = t.i(756438),
    x = t.i(223025),
    O = t.i(175160),
    w = t.i(756984),
    j = t.i(460242),
    S = t.i(923763),
    P = t.i(122257),
    A = t.i(49647),
    E = t.i(141001),
    M = t.i(701240),
    k = t.i(224029),
    T = t.i(783615);
  function _(t) {
    return (_ =
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
  var C = ["x", "y", "top", "left", "width", "height", "className"];
  function I() {
    return (I = Object.assign.bind()).apply(this, arguments);
  }
  function D(t, e) {
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
  var N = function (t) {
    var r = t.x,
      n = void 0 === r ? 0 : r,
      o = t.y,
      i = void 0 === o ? 0 : o,
      a = t.top,
      u = void 0 === a ? 0 : a,
      l = t.left,
      s = void 0 === l ? 0 : l,
      f = t.width,
      p = void 0 === f ? 0 : f,
      d = t.height,
      h = void 0 === d ? 0 : d,
      y = t.className,
      m = (function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? D(Object(r), !0).forEach(function (e) {
                var n, o, i;
                ((n = t),
                  (o = e),
                  (i = r[e]),
                  (o = (function (t) {
                    var e = (function (t, e) {
                      if ("object" != _(t) || !t) return t;
                      var r = t[Symbol.toPrimitive];
                      if (void 0 !== r) {
                        var n = r.call(t, e || "default");
                        if ("object" != _(n)) return n;
                        throw TypeError(
                          "@@toPrimitive must return a primitive value.",
                        );
                      }
                      return ("string" === e ? String : Number)(t);
                    })(t, "string");
                    return "symbol" == _(e) ? e : e + "";
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
              : D(Object(r)).forEach(function (e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(r, e),
                  );
                });
        }
        return t;
      })(
        { x: n, y: i, top: u, left: s, width: p, height: h },
        (function (t, e) {
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
        })(t, C),
      );
    return (0, g.H)(n) &&
      (0, g.H)(i) &&
      (0, g.H)(p) &&
      (0, g.H)(h) &&
      (0, g.H)(u) &&
      (0, g.H)(s)
      ? e.default.createElement(
          "path",
          I({}, (0, v.T)(m, !0), {
            className: (0, c.U)("recharts-cross", y),
            d: "M"
              .concat(n, ",")
              .concat(u, "v")
              .concat(h, "M")
              .concat(s, ",")
              .concat(i, "h")
              .concat(p),
          }),
        )
      : null;
  };
  function B(t) {
    var e = t.cx,
      r = t.cy,
      n = t.radius,
      o = t.startAngle,
      i = t.endAngle;
    return {
      points: [(0, j.v)(e, r, n, o), (0, j.v)(e, r, n, i)],
      cx: e,
      cy: r,
      radius: n,
      startAngle: o,
      endAngle: i,
    };
  }
  var R = t.i(167538);
  function L(t) {
    return (L =
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
  function U(t, e) {
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
  function z(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? U(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != L(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != L(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == L(e) ? e : e + "";
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
          : U(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function $(t) {
    var r,
      n,
      o,
      i,
      a = t.element,
      u = t.tooltipEventType,
      l = t.isActive,
      s = t.activeCoordinate,
      f = t.activePayload,
      p = t.offset,
      d = t.activeTooltipIndex,
      h = t.tooltipAxisBandSize,
      m = t.layout,
      b = t.chartName,
      g =
        null != (n = a.props.cursor)
          ? n
          : null == (o = a.type.defaultProps)
            ? void 0
            : o.cursor;
    if (!a || !g || !l || !s || ("ScatterChart" !== b && "axis" !== u))
      return null;
    var x = T.f;
    if ("ScatterChart" === b) ((i = s), (x = N));
    else if ("BarChart" === b)
      ((r = h / 2),
        (i = {
          stroke: "none",
          fill: "#ccc",
          x: "horizontal" === m ? s.x - r : p.left + 0.5,
          y: "horizontal" === m ? p.top + 0.5 : s.y - r,
          width: "horizontal" === m ? h : p.width - 1,
          height: "horizontal" === m ? p.height - 1 : h,
        }),
        (x = y.G));
    else if ("radial" === m) {
      var O = B(s),
        w = O.cx,
        S = O.cy,
        P = O.radius;
      ((i = {
        cx: w,
        cy: S,
        startAngle: O.startAngle,
        endAngle: O.endAngle,
        innerRadius: P,
        outerRadius: P,
      }),
        (x = R.f));
    } else
      ((i = {
        points: (function (t, e, r) {
          var n, o, i, a;
          if ("horizontal" === t)
            ((i = n = e.x), (o = r.top), (a = r.top + r.height));
          else if ("vertical" === t)
            ((a = o = e.y), (n = r.left), (i = r.left + r.width));
          else if (null != e.cx && null != e.cy)
            if ("centric" !== t) return B(e);
            else {
              var u = e.cx,
                c = e.cy,
                l = e.innerRadius,
                s = e.outerRadius,
                f = e.angle,
                p = (0, j.v)(u, c, l, f),
                d = (0, j.v)(u, c, s, f);
              ((n = p.x), (o = p.y), (i = d.x), (a = d.y));
            }
          return [
            { x: n, y: o },
            { x: i, y: a },
          ];
        })(m, s, p),
      }),
        (x = T.f));
    var A = z(
      z(z(z({ stroke: "#ccc", pointerEvents: "none" }, p), i), (0, v.T)(g, !1)),
      {},
      {
        payload: f,
        payloadIndex: d,
        className: (0, c.U)("recharts-tooltip-cursor", g.className),
      },
    );
    return (0, e.isValidElement)(g)
      ? (0, e.cloneElement)(g, A)
      : (0, e.createElement)(x, A);
  }
  var H = t.i(814929),
    F = ["item"],
    W = [
      "children",
      "className",
      "width",
      "height",
      "style",
      "compact",
      "title",
      "desc",
    ];
  function X(t) {
    return (X =
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
  function q() {
    return (q = Object.assign.bind()).apply(this, arguments);
  }
  function V(t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function (t, e) {
        var r =
          null == t
            ? null
            : ("u" > typeof Symbol && t[Symbol.iterator]) || t["@@iterator"];
        if (null != r) {
          var n,
            o,
            i,
            a,
            u = [],
            c = !0,
            l = !1;
          try {
            if (((i = (r = r.call(t)).next), 0 === e)) {
              if (Object(r) !== r) return;
              c = !1;
            } else
              for (
                ;
                !(c = (n = i.call(r)).done) &&
                (u.push(n.value), u.length !== e);
                c = !0
              );
          } catch (t) {
            ((l = !0), (o = t));
          } finally {
            try {
              if (!c && null != r.return && ((a = r.return()), Object(a) !== a))
                return;
            } finally {
              if (l) throw o;
            }
          }
          return u;
        }
      })(t, e) ||
      Q(t, e) ||
      (function () {
        throw TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function G(t, e) {
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
  }
  function Y() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (Y = function () {
      return !!t;
    })();
  }
  function K(t) {
    return (K = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function Z(t, e) {
    return (Z = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function J(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return tt(t);
      })(t) ||
      (function (t) {
        if (
          ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
          null != t["@@iterator"]
        )
          return Array.from(t);
      })(t) ||
      Q(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function Q(t, e) {
    if (t) {
      if ("string" == typeof t) return tt(t, e);
      var r = Object.prototype.toString.call(t).slice(8, -1);
      if (
        ("Object" === r && t.constructor && (r = t.constructor.name),
        "Map" === r || "Set" === r)
      )
        return Array.from(t);
      if (
        "Arguments" === r ||
        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
      )
        return tt(t, e);
    }
  }
  function tt(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function te(t, e) {
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
  function tr(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? te(Object(r), !0).forEach(function (e) {
            tn(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : te(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tn(t, e, r) {
    return (
      (e = to(e)) in t
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
  function to(t) {
    var e = (function (t, e) {
      if ("object" != X(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != X(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == X(e) ? e : e + "";
  }
  var ti = { xAxis: ["bottom", "top"], yAxis: ["left", "right"] },
    ta = { width: "100%", height: "100%" },
    tu = { x: 0, y: 0 };
  function tc(t) {
    return t;
  }
  var tl = function (t, e, r, n) {
      var o = e.find(function (t) {
        return t && t.index === r;
      });
      if (o) {
        if ("horizontal" === t) return { x: o.coordinate, y: n.y };
        if ("vertical" === t) return { x: n.x, y: o.coordinate };
        if ("centric" === t) {
          var i = o.coordinate,
            a = n.radius;
          return tr(
            tr(tr({}, n), (0, j.v)(n.cx, n.cy, a, i)),
            {},
            { angle: i, radius: a },
          );
        }
        var u = o.coordinate,
          c = n.angle;
        return tr(
          tr(tr({}, n), (0, j.v)(n.cx, n.cy, u, c)),
          {},
          { angle: c, radius: u },
        );
      }
      return tu;
    },
    ts = function (t, e) {
      var r = e.graphicalItems,
        n = e.dataStartIndex,
        o = e.dataEndIndex,
        i = (null != r ? r : []).reduce(function (t, e) {
          var r = e.props.data;
          return r && r.length ? [].concat(J(t), J(r)) : t;
        }, []);
      return i.length > 0
        ? i
        : t && t.length && (0, g.H)(n) && (0, g.H)(o)
          ? t.slice(n, o + 1)
          : [];
    };
  function tf(t) {
    return "number" === t ? [0, "auto"] : void 0;
  }
  var tp = function (t, e, r, n) {
      var o = t.graphicalItems,
        i = t.tooltipAxis,
        a = ts(e, t);
      return r < 0 || !o || !o.length || r >= a.length
        ? null
        : o.reduce(function (o, u) {
            var c,
              l,
              s = null != (c = u.props.data) ? c : e;
            if (
              (s &&
                t.dataStartIndex + t.dataEndIndex !== 0 &&
                t.dataEndIndex - t.dataStartIndex >= r &&
                (s = s.slice(t.dataStartIndex, t.dataEndIndex + 1)),
              i.dataKey && !i.allowDuplicatedCategory)
            ) {
              var f = void 0 === s ? a : s;
              l = (0, g.I)(f, i.dataKey, n);
            } else l = (s && s[r]) || a[r];
            return l ? [].concat(J(o), [(0, x.r)(u, l)]) : o;
          }, []);
    },
    td = function (t, e, r, n) {
      var o = n || { x: t.chartX, y: t.chartY },
        i =
          "horizontal" === r
            ? o.x
            : "vertical" === r
              ? o.y
              : "centric" === r
                ? o.angle
                : o.radius,
        a = t.orderedTooltipTicks,
        u = t.tooltipAxis,
        c = t.tooltipTicks,
        l = (0, x.b)(i, a, c, u);
      if (l >= 0 && c) {
        var s = c[l] && c[l].value,
          f = tp(t, e, l, s),
          p = tl(r, a, l, o);
        return {
          activeTooltipIndex: l,
          activeLabel: s,
          activePayload: f,
          activeCoordinate: p,
        };
      }
      return null;
    },
    th = function (t, e) {
      var n = e.axes,
        i = e.graphicalItems,
        a = e.axisType,
        u = e.axisIdKey,
        c = e.stackGroups,
        l = e.dataStartIndex,
        s = e.dataEndIndex,
        f = t.layout,
        p = t.children,
        d = t.stackOffset,
        h = (0, x.N)(f, a);
      return n.reduce(function (e, n) {
        var y =
            void 0 !== n.type.defaultProps
              ? tr(tr({}, n.type.defaultProps), n.props)
              : n.props,
          v = y.type,
          m = y.dataKey,
          b = y.allowDataOverflow,
          O = y.allowDuplicatedCategory,
          j = y.scale,
          S = y.ticks,
          P = y.includeHidden,
          A = y[u];
        if (e[A]) return e;
        var E = ts(t.data, {
            graphicalItems: i.filter(function (t) {
              var e;
              return (
                (u in t.props
                  ? t.props[u]
                  : null == (e = t.type.defaultProps)
                    ? void 0
                    : e[u]) === A
              );
            }),
            dataStartIndex: l,
            dataEndIndex: s,
          }),
          k = E.length;
        (0, M.f)(y.domain, b, v) &&
          ((C = (0, x.n)(y.domain, null, b)),
          h &&
            ("number" === v || "auto" !== j) &&
            (D = (0, x.M)(E, m, "category")));
        var T = tf(v);
        if (!C || 0 === C.length) {
          var _,
            C,
            I,
            D,
            N,
            B = null != (N = y.domain) ? N : T;
          if (m) {
            if (((C = (0, x.M)(E, m, v)), "category" === v && h)) {
              var R = (0, g.R)(C);
              O && R
                ? ((I = C), (C = (0, o.default)(0, k)))
                : O ||
                  (C = (0, x.e)(B, C, n).reduce(function (t, e) {
                    return t.indexOf(e) >= 0 ? t : [].concat(J(t), [e]);
                  }, []));
            } else if ("category" === v)
              C = O
                ? C.filter(function (t) {
                    return "" !== t && !(0, r.default)(t);
                  })
                : (0, x.e)(B, C, n).reduce(function (t, e) {
                    return t.indexOf(e) >= 0 || "" === e || (0, r.default)(e)
                      ? t
                      : [].concat(J(t), [e]);
                  }, []);
            else if ("number" === v) {
              var L = (0, x.w)(
                E,
                i.filter(function (t) {
                  var e,
                    r,
                    n =
                      u in t.props
                        ? t.props[u]
                        : null == (e = t.type.defaultProps)
                          ? void 0
                          : e[u],
                    o =
                      "hide" in t.props
                        ? t.props.hide
                        : null == (r = t.type.defaultProps)
                          ? void 0
                          : r.hide;
                  return n === A && (P || !o);
                }),
                m,
                a,
                f,
              );
              L && (C = L);
            }
            h &&
              ("number" === v || "auto" !== j) &&
              (D = (0, x.M)(E, m, "category"));
          } else
            C = h
              ? (0, o.default)(0, k)
              : c && c[A] && c[A].hasStack && "number" === v
                ? "expand" === d
                  ? [0, 1]
                  : (0, x.s)(c[A].stackGroups, l, s)
                : (0, x.L)(
                    E,
                    i.filter(function (t) {
                      var e =
                          u in t.props ? t.props[u] : t.type.defaultProps[u],
                        r =
                          "hide" in t.props
                            ? t.props.hide
                            : t.type.defaultProps.hide;
                      return e === A && (P || !r);
                    }),
                    v,
                    f,
                    !0,
                  );
          "number" === v
            ? ((C = (0, w.f)(p, C, A, a, S)), B && (C = (0, x.n)(B, C, b)))
            : "category" === v &&
              B &&
              C.every(function (t) {
                return B.indexOf(t) >= 0;
              }) &&
              (C = B);
        }
        return tr(
          tr({}, e),
          {},
          tn(
            {},
            A,
            tr(
              tr({}, y),
              {},
              {
                axisType: a,
                domain: C,
                categoricalDomain: D,
                duplicateDomain: I,
                originalDomain: null != (_ = y.domain) ? _ : T,
                isCategorical: h,
                layout: f,
              },
            ),
          ),
        );
      }, {});
    },
    ty = function (t, e) {
      var r = e.graphicalItems,
        n = e.Axis,
        a = e.axisType,
        u = e.axisIdKey,
        c = e.stackGroups,
        l = e.dataStartIndex,
        s = e.dataEndIndex,
        f = t.layout,
        p = t.children,
        d = ts(t.data, {
          graphicalItems: r,
          dataStartIndex: l,
          dataEndIndex: s,
        }),
        h = d.length,
        y = (0, x.N)(f, a),
        v = -1;
      return r.reduce(function (t, e) {
        var m,
          b = (
            void 0 !== e.type.defaultProps
              ? tr(tr({}, e.type.defaultProps), e.props)
              : e.props
          )[u],
          g = tf("number");
        return t[b]
          ? t
          : (v++,
            y
              ? (m = (0, o.default)(0, h))
              : ((m =
                  c && c[b] && c[b].hasStack
                    ? (0, x.s)(c[b].stackGroups, l, s)
                    : (0, x.n)(
                        g,
                        (0, x.L)(
                          d,
                          r.filter(function (t) {
                            var e,
                              r,
                              n =
                                u in t.props
                                  ? t.props[u]
                                  : null == (e = t.type.defaultProps)
                                    ? void 0
                                    : e[u],
                              o =
                                "hide" in t.props
                                  ? t.props.hide
                                  : null == (r = t.type.defaultProps)
                                    ? void 0
                                    : r.hide;
                            return n === b && !o;
                          }),
                          "number",
                          f,
                        ),
                        n.defaultProps.allowDataOverflow,
                      )),
                (m = (0, w.f)(p, m, b, a))),
            tr(
              tr({}, t),
              {},
              tn(
                {},
                b,
                tr(
                  tr({ axisType: a }, n.defaultProps),
                  {},
                  {
                    hide: !0,
                    orientation: (0, i.default)(
                      ti,
                      "".concat(a, ".").concat(v % 2),
                      null,
                    ),
                    domain: m,
                    originalDomain: g,
                    isCategorical: y,
                    layout: f,
                  },
                ),
              ),
            ));
      }, {});
    },
    tv = function (t, e) {
      var r = e.axisType,
        n = void 0 === r ? "xAxis" : r,
        o = e.AxisComp,
        i = e.graphicalItems,
        a = e.stackGroups,
        u = e.dataStartIndex,
        c = e.dataEndIndex,
        l = t.children,
        s = "".concat(n, "Id"),
        f = (0, v.M)(l, o),
        p = {};
      return (
        f && f.length
          ? (p = th(t, {
              axes: f,
              graphicalItems: i,
              axisType: n,
              axisIdKey: s,
              stackGroups: a,
              dataStartIndex: u,
              dataEndIndex: c,
            }))
          : i &&
            i.length &&
            (p = ty(t, {
              Axis: o,
              graphicalItems: i,
              axisType: n,
              axisIdKey: s,
              stackGroups: a,
              dataStartIndex: u,
              dataEndIndex: c,
            })),
        p
      );
    },
    tm = function (t) {
      var e = (0, g.f)(t),
        r = (0, x.A)(e, !1, !0);
      return {
        tooltipTicks: r,
        orderedTooltipTicks: (0, a.default)(r, function (t) {
          return t.coordinate;
        }),
        tooltipAxis: e,
        tooltipAxisBandSize: (0, x.O)(e, r),
      };
    },
    tb = function (t) {
      var e = t.children,
        r = t.defaultShowTooltip,
        n = (0, v.m)(e, m.f),
        o = 0,
        i = 0;
      return (
        t.data && 0 !== t.data.length && (i = t.data.length - 1),
        n &&
          n.props &&
          (n.props.startIndex >= 0 && (o = n.props.startIndex),
          n.props.endIndex >= 0 && (i = n.props.endIndex)),
        {
          chartX: 0,
          chartY: 0,
          dataStartIndex: o,
          dataEndIndex: i,
          activeTooltipIndex: -1,
          isTooltipActive: !!r,
        }
      );
    },
    tg = function (t) {
      return "horizontal" === t
        ? { numericAxisName: "yAxis", cateAxisName: "xAxis" }
        : "vertical" === t
          ? { numericAxisName: "xAxis", cateAxisName: "yAxis" }
          : "centric" === t
            ? { numericAxisName: "radiusAxis", cateAxisName: "angleAxis" }
            : { numericAxisName: "angleAxis", cateAxisName: "radiusAxis" };
    },
    tx = function (t, e) {
      var r = t.props,
        n = t.graphicalItems,
        o = t.xAxisMap,
        a = void 0 === o ? {} : o,
        u = t.yAxisMap,
        c = void 0 === u ? {} : u,
        l = r.width,
        s = r.height,
        f = r.children,
        p = r.margin || {},
        h = (0, v.m)(f, m.f),
        y = (0, v.m)(f, d.f),
        b = Object.keys(c).reduce(
          function (t, e) {
            var r = c[e],
              n = r.orientation;
            return r.mirror || r.hide
              ? t
              : tr(tr({}, t), {}, tn({}, n, t[n] + r.width));
          },
          { left: p.left || 0, right: p.right || 0 },
        ),
        g = Object.keys(a).reduce(
          function (t, e) {
            var r = a[e],
              n = r.orientation;
            return r.mirror || r.hide
              ? t
              : tr(
                  tr({}, t),
                  {},
                  tn({}, n, (0, i.default)(t, "".concat(n)) + r.height),
                );
          },
          { top: p.top || 0, bottom: p.bottom || 0 },
        ),
        O = tr(tr({}, g), b),
        w = O.bottom;
      (h && (O.bottom += h.props.height || m.f.defaultProps.height),
        y && e && (O = (0, x.c)(O, n, r, e)));
      var j = l - O.left - O.right,
        S = s - O.top - O.bottom;
      return tr(
        tr({ brushBottom: w }, O),
        {},
        { width: Math.max(j, 0), height: Math.max(S, 0) },
      );
    };
  t.s(
    [
      "f",
      0,
      function (t) {
        var o = t.chartName,
          a = t.GraphicalChild,
          d = t.defaultTooltipEventType,
          w = void 0 === d ? "axis" : d,
          M = t.validateTooltipEventTypes,
          T = void 0 === M ? ["axis"] : M,
          _ = t.axisComponents,
          C = t.legendContent,
          I = t.formatAxisMap,
          D = t.defaultProps,
          N = function (t, e) {
            var n = e.graphicalItems,
              o = e.stackGroups,
              i = e.offset,
              a = e.updateId,
              u = e.dataStartIndex,
              c = e.dataEndIndex,
              s = t.barSize,
              f = t.layout,
              p = t.barGap,
              d = t.barCategoryGap,
              h = t.maxBarSize,
              y = tg(f),
              m = y.numericAxisName,
              b = y.cateAxisName,
              g =
                !!n &&
                !!n.length &&
                n.some(function (t) {
                  var e = (0, v.d)(t && t.type);
                  return e && e.indexOf("Bar") >= 0;
                }),
              O = [];
            return (
              n.forEach(function (n, y) {
                var w = ts(t.data, {
                    graphicalItems: [n],
                    dataStartIndex: u,
                    dataEndIndex: c,
                  }),
                  j =
                    void 0 !== n.type.defaultProps
                      ? tr(tr({}, n.type.defaultProps), n.props)
                      : n.props,
                  S = j.dataKey,
                  P = j.maxBarSize,
                  A = j["".concat(m, "Id")],
                  E = j["".concat(b, "Id")],
                  M = _.reduce(function (t, r) {
                    var n = e["".concat(r.axisType, "Map")],
                      o = j["".concat(r.axisType, "Id")];
                    (n && n[o]) || "zAxis" === r.axisType || (0, l.f)(!1);
                    var i = n[o];
                    return tr(
                      tr({}, t),
                      {},
                      tn(
                        tn({}, r.axisType, i),
                        "".concat(r.axisType, "Ticks"),
                        (0, x.A)(i),
                      ),
                    );
                  }, {}),
                  k = M[b],
                  T = M["".concat(b, "Ticks")],
                  C =
                    o && o[A] && o[A].hasStack && (0, x.x)(n, o[A].stackGroups),
                  I = (0, v.d)(n.type).indexOf("Bar") >= 0,
                  D = (0, x.O)(k, T),
                  N = [],
                  B =
                    g &&
                    (0, x.d)({
                      barSize: s,
                      stackGroups: o,
                      totalSize:
                        "xAxis" === b
                          ? M[b].width
                          : "yAxis" === b
                            ? M[b].height
                            : void 0,
                    });
                if (I) {
                  var R,
                    L,
                    U = (0, r.default)(P) ? h : P,
                    z =
                      null != (R = null != (L = (0, x.O)(k, T, !0)) ? L : U)
                        ? R
                        : 0;
                  ((N = (0, x.T)({
                    barGap: p,
                    barCategoryGap: d,
                    bandSize: z !== D ? z : D,
                    sizeList: B[E],
                    maxBarSize: U,
                  })),
                    z !== D &&
                      (N = N.map(function (t) {
                        return tr(
                          tr({}, t),
                          {},
                          {
                            position: tr(
                              tr({}, t.position),
                              {},
                              { offset: t.position.offset - z / 2 },
                            ),
                          },
                        );
                      })));
                }
                var $ = n && n.type && n.type.getComposedData;
                $ &&
                  O.push({
                    props: tr(
                      tr(
                        {},
                        $(
                          tr(
                            tr({}, M),
                            {},
                            {
                              displayedData: w,
                              props: t,
                              dataKey: S,
                              item: n,
                              bandSize: D,
                              barPosition: N,
                              offset: i,
                              stackedData: C,
                              layout: f,
                              dataStartIndex: u,
                              dataEndIndex: c,
                            },
                          ),
                        ),
                      ),
                      {},
                      tn(
                        tn(
                          tn({ key: n.key || "item-".concat(y) }, m, M[m]),
                          b,
                          M[b],
                        ),
                        "animationId",
                        a,
                      ),
                    ),
                    childIndex: (0, v.X)(n, t.children),
                    item: n,
                  });
              }),
              O
            );
          },
          B = function (t, e) {
            var r = t.props,
              n = t.dataStartIndex,
              i = t.dataEndIndex,
              u = t.updateId;
            if (!(0, v.J)({ props: r })) return null;
            var c = r.children,
              l = r.layout,
              s = r.stackOffset,
              f = r.data,
              p = r.reverseStackOrder,
              d = tg(l),
              h = d.numericAxisName,
              y = d.cateAxisName,
              m = (0, v.M)(c, a),
              b = (0, x.$)(f, m, "".concat(h, "Id"), "".concat(y, "Id"), s, p),
              g = _.reduce(function (t, e) {
                var o = "".concat(e.axisType, "Map");
                return tr(
                  tr({}, t),
                  {},
                  tn(
                    {},
                    o,
                    tv(
                      r,
                      tr(
                        tr({}, e),
                        {},
                        {
                          graphicalItems: m,
                          stackGroups: e.axisType === h && b,
                          dataStartIndex: n,
                          dataEndIndex: i,
                        },
                      ),
                    ),
                  ),
                );
              }, {}),
              O = tx(
                tr(tr({}, g), {}, { props: r, graphicalItems: m }),
                null == e ? void 0 : e.legendBBox,
              );
            Object.keys(g).forEach(function (t) {
              g[t] = I(r, g[t], O, t.replace("Map", ""), o);
            });
            var w = tm(g["".concat(y, "Map")]),
              j = N(
                r,
                tr(
                  tr({}, g),
                  {},
                  {
                    dataStartIndex: n,
                    dataEndIndex: i,
                    updateId: u,
                    graphicalItems: m,
                    stackGroups: b,
                    offset: O,
                  },
                ),
              );
            return tr(
              tr(
                {
                  formattedGraphicalItems: j,
                  graphicalItems: m,
                  offset: O,
                  stackGroups: b,
                },
                w,
              ),
              g,
            );
          },
          R = (function (t) {
            var a;
            function l(t) {
              var a, s, f, d, h;
              if (!(this instanceof l))
                throw TypeError("Cannot call a class as a function");
              return (
                (d = l),
                (h = [t]),
                (d = K(d)),
                tn(
                  (f = (function (t, e) {
                    if (e && ("object" === X(e) || "function" == typeof e))
                      return e;
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
                    Y()
                      ? Reflect.construct(d, h || [], K(this).constructor)
                      : d.apply(this, h),
                  )),
                  "eventEmitterSymbol",
                  Symbol("rechartsEventEmitter"),
                ),
                tn(f, "accessibilityManager", new E.f()),
                tn(f, "handleLegendBBoxUpdate", function (t) {
                  if (t) {
                    var e = f.state,
                      r = e.dataStartIndex,
                      n = e.dataEndIndex,
                      o = e.updateId;
                    f.setState(
                      tr(
                        { legendBBox: t },
                        B(
                          {
                            props: f.props,
                            dataStartIndex: r,
                            dataEndIndex: n,
                            updateId: o,
                          },
                          tr(tr({}, f.state), {}, { legendBBox: t }),
                        ),
                      ),
                    );
                  }
                }),
                tn(f, "handleReceiveSyncEvent", function (t, e, r) {
                  f.props.syncId === t &&
                    (r !== f.eventEmitterSymbol ||
                      "function" == typeof f.props.syncMethod) &&
                    f.applySyncEvent(e);
                }),
                tn(f, "handleBrushChange", function (t) {
                  var e = t.startIndex,
                    r = t.endIndex;
                  if (
                    e !== f.state.dataStartIndex ||
                    r !== f.state.dataEndIndex
                  ) {
                    var n = f.state.updateId;
                    (f.setState(function () {
                      return tr(
                        { dataStartIndex: e, dataEndIndex: r },
                        B(
                          {
                            props: f.props,
                            dataStartIndex: e,
                            dataEndIndex: r,
                            updateId: n,
                          },
                          f.state,
                        ),
                      );
                    }),
                      f.triggerSyncEvent({
                        dataStartIndex: e,
                        dataEndIndex: r,
                      }));
                  }
                }),
                tn(f, "handleMouseEnter", function (t) {
                  var e = f.getMouseInfo(t);
                  if (e) {
                    var r = tr(tr({}, e), {}, { isTooltipActive: !0 });
                    (f.setState(r), f.triggerSyncEvent(r));
                    var o = f.props.onMouseEnter;
                    (0, n.default)(o) && o(r, t);
                  }
                }),
                tn(f, "triggeredAfterMouseMove", function (t) {
                  var e = f.getMouseInfo(t),
                    r = e
                      ? tr(tr({}, e), {}, { isTooltipActive: !0 })
                      : { isTooltipActive: !1 };
                  (f.setState(r), f.triggerSyncEvent(r));
                  var o = f.props.onMouseMove;
                  (0, n.default)(o) && o(r, t);
                }),
                tn(f, "handleItemMouseEnter", function (t) {
                  f.setState(function () {
                    return {
                      isTooltipActive: !0,
                      activeItem: t,
                      activePayload: t.tooltipPayload,
                      activeCoordinate: t.tooltipPosition || {
                        x: t.cx,
                        y: t.cy,
                      },
                    };
                  });
                }),
                tn(f, "handleItemMouseLeave", function () {
                  f.setState(function () {
                    return { isTooltipActive: !1 };
                  });
                }),
                tn(f, "handleMouseMove", function (t) {
                  (t.persist(), f.throttleTriggeredAfterMouseMove(t));
                }),
                tn(f, "handleMouseLeave", function (t) {
                  f.throttleTriggeredAfterMouseMove.cancel();
                  var e = { isTooltipActive: !1 };
                  (f.setState(e), f.triggerSyncEvent(e));
                  var r = f.props.onMouseLeave;
                  (0, n.default)(r) && r(e, t);
                }),
                tn(f, "handleOuterEvent", function (t) {
                  var e,
                    r = (0, v.g)(t),
                    o = (0, i.default)(f.props, "".concat(r));
                  r &&
                    (0, n.default)(o) &&
                    o(
                      null !=
                        (e = /.*touch.*/i.test(r)
                          ? f.getMouseInfo(t.changedTouches[0])
                          : f.getMouseInfo(t))
                        ? e
                        : {},
                      t,
                    );
                }),
                tn(f, "handleClick", function (t) {
                  var e = f.getMouseInfo(t);
                  if (e) {
                    var r = tr(tr({}, e), {}, { isTooltipActive: !0 });
                    (f.setState(r), f.triggerSyncEvent(r));
                    var o = f.props.onClick;
                    (0, n.default)(o) && o(r, t);
                  }
                }),
                tn(f, "handleMouseDown", function (t) {
                  var e = f.props.onMouseDown;
                  (0, n.default)(e) && e(f.getMouseInfo(t), t);
                }),
                tn(f, "handleMouseUp", function (t) {
                  var e = f.props.onMouseUp;
                  (0, n.default)(e) && e(f.getMouseInfo(t), t);
                }),
                tn(f, "handleTouchMove", function (t) {
                  null != t.changedTouches &&
                    t.changedTouches.length > 0 &&
                    f.throttleTriggeredAfterMouseMove(t.changedTouches[0]);
                }),
                tn(f, "handleTouchStart", function (t) {
                  null != t.changedTouches &&
                    t.changedTouches.length > 0 &&
                    f.handleMouseDown(t.changedTouches[0]);
                }),
                tn(f, "handleTouchEnd", function (t) {
                  null != t.changedTouches &&
                    t.changedTouches.length > 0 &&
                    f.handleMouseUp(t.changedTouches[0]);
                }),
                tn(f, "handleDoubleClick", function (t) {
                  var e = f.props.onDoubleClick;
                  (0, n.default)(e) && e(f.getMouseInfo(t), t);
                }),
                tn(f, "handleContextMenu", function (t) {
                  var e = f.props.onContextMenu;
                  (0, n.default)(e) && e(f.getMouseInfo(t), t);
                }),
                tn(f, "triggerSyncEvent", function (t) {
                  void 0 !== f.props.syncId &&
                    P.Z.emit(P.t, f.props.syncId, t, f.eventEmitterSymbol);
                }),
                tn(f, "applySyncEvent", function (t) {
                  var e = f.props,
                    r = e.layout,
                    n = e.syncMethod,
                    o = f.state.updateId,
                    i = t.dataStartIndex,
                    a = t.dataEndIndex;
                  if (void 0 !== t.dataStartIndex || void 0 !== t.dataEndIndex)
                    f.setState(
                      tr(
                        { dataStartIndex: i, dataEndIndex: a },
                        B(
                          {
                            props: f.props,
                            dataStartIndex: i,
                            dataEndIndex: a,
                            updateId: o,
                          },
                          f.state,
                        ),
                      ),
                    );
                  else if (void 0 !== t.activeTooltipIndex) {
                    var u = t.chartX,
                      c = t.chartY,
                      l = t.activeTooltipIndex,
                      s = f.state,
                      p = s.offset,
                      d = s.tooltipTicks;
                    if (!p) return;
                    if ("function" == typeof n) l = n(d, t);
                    else if ("value" === n) {
                      l = -1;
                      for (var h = 0; h < d.length; h++)
                        if (d[h].value === t.activeLabel) {
                          l = h;
                          break;
                        }
                    }
                    var y = tr(tr({}, p), {}, { x: p.left, y: p.top }),
                      v = Math.min(u, y.x + y.width),
                      m = Math.min(c, y.y + y.height),
                      b = d[l] && d[l].value,
                      g = tp(f.state, f.props.data, l),
                      x = d[l]
                        ? {
                            x: "horizontal" === r ? d[l].coordinate : v,
                            y: "horizontal" === r ? m : d[l].coordinate,
                          }
                        : tu;
                    f.setState(
                      tr(
                        tr({}, t),
                        {},
                        {
                          activeLabel: b,
                          activeCoordinate: x,
                          activePayload: g,
                          activeTooltipIndex: l,
                        },
                      ),
                    );
                  } else f.setState(t);
                }),
                tn(f, "renderCursor", function (t) {
                  var r,
                    n = f.state,
                    i = n.isTooltipActive,
                    a = n.activeCoordinate,
                    u = n.activePayload,
                    c = n.offset,
                    l = n.activeTooltipIndex,
                    s = n.tooltipAxisBandSize,
                    p = f.getTooltipEventType(),
                    d = null != (r = t.props.active) ? r : i,
                    h = f.props.layout,
                    y = t.key || "_recharts-cursor";
                  return e.default.createElement($, {
                    key: y,
                    activeCoordinate: a,
                    activePayload: u,
                    activeTooltipIndex: l,
                    chartName: o,
                    element: t,
                    isActive: d,
                    layout: h,
                    offset: c,
                    tooltipAxisBandSize: s,
                    tooltipEventType: p,
                  });
                }),
                tn(f, "renderPolarAxis", function (t, r, n) {
                  var o = (0, i.default)(t, "type.axisType"),
                    a = (0, i.default)(f.state, "".concat(o, "Map")),
                    u = t.type.defaultProps,
                    l = void 0 !== u ? tr(tr({}, u), t.props) : t.props,
                    s = a && a[l["".concat(o, "Id")]];
                  return (0, e.cloneElement)(
                    t,
                    tr(
                      tr({}, s),
                      {},
                      {
                        className: (0, c.U)(o, s.className),
                        key: t.key || "".concat(r, "-").concat(n),
                        ticks: (0, x.A)(s, !0),
                      },
                    ),
                  );
                }),
                tn(f, "renderPolarGrid", function (t) {
                  var r = t.props,
                    n = r.radialLines,
                    o = r.polarAngles,
                    i = r.polarRadius,
                    a = f.state,
                    u = a.radiusAxisMap,
                    c = a.angleAxisMap,
                    l = (0, g.f)(u),
                    s = (0, g.f)(c),
                    p = s.cx,
                    d = s.cy,
                    h = s.innerRadius,
                    y = s.outerRadius;
                  return (0, e.cloneElement)(t, {
                    polarAngles: Array.isArray(o)
                      ? o
                      : (0, x.A)(s, !0).map(function (t) {
                          return t.coordinate;
                        }),
                    polarRadius: Array.isArray(i)
                      ? i
                      : (0, x.A)(l, !0).map(function (t) {
                          return t.coordinate;
                        }),
                    cx: p,
                    cy: d,
                    innerRadius: h,
                    outerRadius: y,
                    key: t.key || "polar-grid",
                    radialLines: n,
                  });
                }),
                tn(f, "renderLegend", function () {
                  var t = f.state.formattedGraphicalItems,
                    r = f.props,
                    n = r.children,
                    o = r.width,
                    i = r.height,
                    a = f.props.margin || {},
                    u = o - (a.left || 0) - (a.right || 0),
                    c = (0, O.f)({
                      children: n,
                      formattedGraphicalItems: t,
                      legendWidth: u,
                      legendContent: C,
                    });
                  if (!c) return null;
                  var l = c.item,
                    s = G(c, F);
                  return (0, e.cloneElement)(
                    l,
                    tr(
                      tr({}, s),
                      {},
                      {
                        chartWidth: o,
                        chartHeight: i,
                        margin: a,
                        onBBoxUpdate: f.handleLegendBBoxUpdate,
                      },
                    ),
                  );
                }),
                tn(f, "renderTooltip", function () {
                  var t,
                    r = f.props,
                    n = r.children,
                    o = r.accessibilityLayer,
                    i = (0, v.m)(n, p.f);
                  if (!i) return null;
                  var a = f.state,
                    u = a.isTooltipActive,
                    c = a.activeCoordinate,
                    l = a.activePayload,
                    s = a.activeLabel,
                    d = a.offset,
                    h = null != (t = i.props.active) ? t : u;
                  return (0, e.cloneElement)(i, {
                    viewBox: tr(tr({}, d), {}, { x: d.left, y: d.top }),
                    active: h,
                    label: s,
                    payload: h ? l : [],
                    coordinate: c,
                    accessibilityLayer: o,
                  });
                }),
                tn(f, "renderBrush", function (t) {
                  var r = f.props,
                    n = r.margin,
                    o = r.data,
                    i = f.state,
                    a = i.offset,
                    u = i.dataStartIndex,
                    c = i.dataEndIndex,
                    l = i.updateId;
                  return (0, e.cloneElement)(t, {
                    key: t.key || "_recharts-brush",
                    onChange: (0, x.t)(f.handleBrushChange, t.props.onChange),
                    data: o,
                    x: (0, g.H)(t.props.x) ? t.props.x : a.left,
                    y: (0, g.H)(t.props.y)
                      ? t.props.y
                      : a.top + a.height + a.brushBottom - (n.bottom || 0),
                    width: (0, g.H)(t.props.width) ? t.props.width : a.width,
                    startIndex: u,
                    endIndex: c,
                    updateId: "brush-".concat(l),
                  });
                }),
                tn(f, "renderReferenceElement", function (t, r, n) {
                  if (!t) return null;
                  var o = f.clipPathId,
                    i = f.state,
                    a = i.xAxisMap,
                    u = i.yAxisMap,
                    c = i.offset,
                    l = t.type.defaultProps || {},
                    s = t.props,
                    p = s.xAxisId,
                    d = void 0 === p ? l.xAxisId : p,
                    h = s.yAxisId,
                    y = void 0 === h ? l.yAxisId : h;
                  return (0, e.cloneElement)(t, {
                    key: t.key || "".concat(r, "-").concat(n),
                    xAxis: a[d],
                    yAxis: u[y],
                    viewBox: {
                      x: c.left,
                      y: c.top,
                      width: c.width,
                      height: c.height,
                    },
                    clipPathId: o,
                  });
                }),
                tn(f, "renderActivePoints", function (t) {
                  var e = t.item,
                    r = t.activePoint,
                    n = t.basePoint,
                    o = t.childIndex,
                    i = t.isRange,
                    a = [],
                    u = e.props.key,
                    c =
                      void 0 !== e.item.type.defaultProps
                        ? tr(tr({}, e.item.type.defaultProps), e.item.props)
                        : e.item.props,
                    s = c.activeDot,
                    f = tr(
                      tr(
                        {
                          index: o,
                          dataKey: c.dataKey,
                          cx: r.x,
                          cy: r.y,
                          r: 4,
                          fill: (0, x.J)(e.item),
                          strokeWidth: 2,
                          stroke: "#fff",
                          payload: r.payload,
                          value: r.value,
                        },
                        (0, v.T)(s, !1),
                      ),
                      (0, A.e)(s),
                    );
                  return (
                    a.push(
                      l.renderActiveDot(
                        s,
                        f,
                        "".concat(u, "-activePoint-").concat(o),
                      ),
                    ),
                    n
                      ? a.push(
                          l.renderActiveDot(
                            s,
                            tr(tr({}, f), {}, { cx: n.x, cy: n.y }),
                            "".concat(u, "-basePoint-").concat(o),
                          ),
                        )
                      : i && a.push(null),
                    a
                  );
                }),
                tn(f, "renderGraphicChild", function (t, n, o) {
                  var i = f.filterFormatItem(t, n, o);
                  if (!i) return null;
                  var a = f.getTooltipEventType(),
                    u = f.state,
                    c = u.isTooltipActive,
                    l = u.tooltipAxis,
                    s = u.activeTooltipIndex,
                    d = u.activeLabel,
                    h = f.props.children,
                    y = (0, v.m)(h, p.f),
                    m = i.props,
                    b = m.points,
                    O = m.isRange,
                    w = m.baseLine,
                    j =
                      void 0 !== i.item.type.defaultProps
                        ? tr(tr({}, i.item.type.defaultProps), i.item.props)
                        : i.item.props,
                    S = j.activeDot,
                    P = j.hide,
                    A = j.activeBar,
                    E = j.activeShape,
                    M = !!(!P && c && y && (S || A || E)),
                    k = {};
                  "axis" !== a && y && "click" === y.props.trigger
                    ? (k = {
                        onClick: (0, x.t)(
                          f.handleItemMouseEnter,
                          t.props.onClick,
                        ),
                      })
                    : "axis" !== a &&
                      (k = {
                        onMouseLeave: (0, x.t)(
                          f.handleItemMouseLeave,
                          t.props.onMouseLeave,
                        ),
                        onMouseEnter: (0, x.t)(
                          f.handleItemMouseEnter,
                          t.props.onMouseEnter,
                        ),
                      });
                  var T = (0, e.cloneElement)(t, tr(tr({}, i.props), k));
                  if (M)
                    if (s >= 0) {
                      if (l.dataKey && !l.allowDuplicatedCategory) {
                        var _ =
                          "function" == typeof l.dataKey
                            ? function (t) {
                                return "function" == typeof l.dataKey
                                  ? l.dataKey(t.payload)
                                  : null;
                              }
                            : "payload.".concat(l.dataKey.toString());
                        ((I = (0, g.I)(b, _, d)),
                          (D = O && w && (0, g.I)(w, _, d)));
                      } else
                        ((I = null == b ? void 0 : b[s]), (D = O && w && w[s]));
                      if (E || A) {
                        var C =
                          void 0 !== t.props.activeIndex
                            ? t.props.activeIndex
                            : s;
                        return [
                          (0, e.cloneElement)(
                            t,
                            tr(tr(tr({}, i.props), k), {}, { activeIndex: C }),
                          ),
                          null,
                          null,
                        ];
                      }
                      if (!(0, r.default)(I))
                        return [T].concat(
                          J(
                            f.renderActivePoints({
                              item: i,
                              activePoint: I,
                              basePoint: D,
                              childIndex: s,
                              isRange: O,
                            }),
                          ),
                        );
                    } else {
                      var I,
                        D,
                        N,
                        B = (
                          null != (N = f.getItemByXY(f.state.activeCoordinate))
                            ? N
                            : { graphicalItem: T }
                        ).graphicalItem,
                        R = B.item,
                        L = void 0 === R ? t : R,
                        U = B.childIndex,
                        z = tr(tr(tr({}, i.props), k), {}, { activeIndex: U });
                      return [(0, e.cloneElement)(L, z), null, null];
                    }
                  return O ? [T, null, null] : [T, null];
                }),
                tn(f, "renderCustomized", function (t, r, n) {
                  return (0, e.cloneElement)(
                    t,
                    tr(
                      tr({ key: "recharts-customized-".concat(n) }, f.props),
                      f.state,
                    ),
                  );
                }),
                tn(f, "renderMap", {
                  CartesianGrid: { handler: tc, once: !0 },
                  ReferenceArea: { handler: f.renderReferenceElement },
                  ReferenceLine: { handler: tc },
                  ReferenceDot: { handler: f.renderReferenceElement },
                  XAxis: { handler: tc },
                  YAxis: { handler: tc },
                  Brush: { handler: f.renderBrush, once: !0 },
                  Bar: { handler: f.renderGraphicChild },
                  Line: { handler: f.renderGraphicChild },
                  Area: { handler: f.renderGraphicChild },
                  Radar: { handler: f.renderGraphicChild },
                  RadialBar: { handler: f.renderGraphicChild },
                  Scatter: { handler: f.renderGraphicChild },
                  Pie: { handler: f.renderGraphicChild },
                  Funnel: { handler: f.renderGraphicChild },
                  Tooltip: { handler: f.renderCursor, once: !0 },
                  PolarGrid: { handler: f.renderPolarGrid, once: !0 },
                  PolarAngleAxis: { handler: f.renderPolarAxis },
                  PolarRadiusAxis: { handler: f.renderPolarAxis },
                  Customized: { handler: f.renderCustomized },
                }),
                (f.clipPathId = "".concat(
                  null != (a = t.id) ? a : (0, g.C)("recharts"),
                  "-clip",
                )),
                (f.throttleTriggeredAfterMouseMove = (0, u.default)(
                  f.triggeredAfterMouseMove,
                  null != (s = t.throttleDelay) ? s : 1e3 / 60,
                )),
                (f.state = {}),
                f
              );
            }
            if ("function" != typeof t && null !== t)
              throw TypeError(
                "Super expression must either be null or a function",
              );
            return (
              (l.prototype = Object.create(t && t.prototype, {
                constructor: { value: l, writable: !0, configurable: !0 },
              })),
              Object.defineProperty(l, "prototype", { writable: !1 }),
              t && Z(l, t),
              (a = [
                {
                  key: "componentDidMount",
                  value: function () {
                    var t, e;
                    (this.addListener(),
                      this.accessibilityManager.setDetails({
                        container: this.container,
                        offset: {
                          left: null != (t = this.props.margin.left) ? t : 0,
                          top: null != (e = this.props.margin.top) ? e : 0,
                        },
                        coordinateList: this.state.tooltipTicks,
                        mouseHandlerCallback: this.triggeredAfterMouseMove,
                        layout: this.props.layout,
                      }),
                      this.displayDefaultTooltip());
                  },
                },
                {
                  key: "displayDefaultTooltip",
                  value: function () {
                    var t = this.props,
                      e = t.children,
                      r = t.data,
                      n = t.height,
                      o = t.layout,
                      i = (0, v.m)(e, p.f);
                    if (i) {
                      var a = i.props.defaultIndex;
                      if (
                        "number" == typeof a &&
                        !(a < 0) &&
                        !(a > this.state.tooltipTicks.length - 1)
                      ) {
                        var u =
                            this.state.tooltipTicks[a] &&
                            this.state.tooltipTicks[a].value,
                          c = tp(this.state, r, a, u),
                          l = this.state.tooltipTicks[a].coordinate,
                          s = (this.state.offset.top + n) / 2,
                          f =
                            "horizontal" === o
                              ? { x: l, y: s }
                              : { y: l, x: s },
                          d = this.state.formattedGraphicalItems.find(
                            function (t) {
                              return "Scatter" === t.item.type.name;
                            },
                          );
                        d &&
                          ((f = tr(
                            tr({}, f),
                            d.props.points[a].tooltipPosition,
                          )),
                          (c = d.props.points[a].tooltipPayload));
                        var h = {
                          activeTooltipIndex: a,
                          isTooltipActive: !0,
                          activeLabel: u,
                          activePayload: c,
                          activeCoordinate: f,
                        };
                        (this.setState(h),
                          this.renderCursor(i),
                          this.accessibilityManager.setIndex(a));
                      }
                    }
                  },
                },
                {
                  key: "getSnapshotBeforeUpdate",
                  value: function (t, e) {
                    if (!this.props.accessibilityLayer) return null;
                    if (
                      (this.state.tooltipTicks !== e.tooltipTicks &&
                        this.accessibilityManager.setDetails({
                          coordinateList: this.state.tooltipTicks,
                        }),
                      this.props.layout !== t.layout &&
                        this.accessibilityManager.setDetails({
                          layout: this.props.layout,
                        }),
                      this.props.margin !== t.margin)
                    ) {
                      var r, n;
                      this.accessibilityManager.setDetails({
                        offset: {
                          left: null != (r = this.props.margin.left) ? r : 0,
                          top: null != (n = this.props.margin.top) ? n : 0,
                        },
                      });
                    }
                    return null;
                  },
                },
                {
                  key: "componentDidUpdate",
                  value: function (t) {
                    (0, v.N)(
                      [(0, v.m)(t.children, p.f)],
                      [(0, v.m)(this.props.children, p.f)],
                    ) || this.displayDefaultTooltip();
                  },
                },
                {
                  key: "componentWillUnmount",
                  value: function () {
                    (this.removeListener(),
                      this.throttleTriggeredAfterMouseMove.cancel());
                  },
                },
                {
                  key: "getTooltipEventType",
                  value: function () {
                    var t = (0, v.m)(this.props.children, p.f);
                    if (t && "boolean" == typeof t.props.shared) {
                      var e = t.props.shared ? "axis" : "item";
                      return T.indexOf(e) >= 0 ? e : w;
                    }
                    return w;
                  },
                },
                {
                  key: "getMouseInfo",
                  value: function (t) {
                    if (!this.container) return null;
                    var e = this.container,
                      r = e.getBoundingClientRect(),
                      n = (0, b.h)(r),
                      o = {
                        chartX: Math.round(t.pageX - n.left),
                        chartY: Math.round(t.pageY - n.top),
                      },
                      i = r.width / e.offsetWidth || 1,
                      a = this.inRange(o.chartX, o.chartY, i);
                    if (!a) return null;
                    var u = this.state,
                      c = u.xAxisMap,
                      l = u.yAxisMap,
                      s = this.getTooltipEventType(),
                      f = td(this.state, this.props.data, this.props.layout, a);
                    if ("axis" !== s && c && l) {
                      var p = (0, g.f)(c).scale,
                        d = (0, g.f)(l).scale,
                        h = p && p.invert ? p.invert(o.chartX) : null,
                        y = d && d.invert ? d.invert(o.chartY) : null;
                      return tr(tr({}, o), {}, { xValue: h, yValue: y }, f);
                    }
                    return f ? tr(tr({}, o), f) : null;
                  },
                },
                {
                  key: "inRange",
                  value: function (t, e) {
                    var r =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : 1,
                      n = this.props.layout,
                      o = t / r,
                      i = e / r;
                    if ("horizontal" === n || "vertical" === n) {
                      var a = this.state.offset;
                      return o >= a.left &&
                        o <= a.left + a.width &&
                        i >= a.top &&
                        i <= a.top + a.height
                        ? { x: o, y: i }
                        : null;
                    }
                    var u = this.state,
                      c = u.angleAxisMap,
                      l = u.radiusAxisMap;
                    if (c && l) {
                      var s = (0, g.f)(c);
                      return (0, j.$)({ x: o, y: i }, s);
                    }
                    return null;
                  },
                },
                {
                  key: "parseEventsOfWrapper",
                  value: function () {
                    var t = this.props.children,
                      e = this.getTooltipEventType(),
                      r = (0, v.m)(t, p.f),
                      n = {};
                    return (
                      r &&
                        "axis" === e &&
                        (n =
                          "click" === r.props.trigger
                            ? { onClick: this.handleClick }
                            : {
                                onMouseEnter: this.handleMouseEnter,
                                onDoubleClick: this.handleDoubleClick,
                                onMouseMove: this.handleMouseMove,
                                onMouseLeave: this.handleMouseLeave,
                                onTouchMove: this.handleTouchMove,
                                onTouchStart: this.handleTouchStart,
                                onTouchEnd: this.handleTouchEnd,
                                onContextMenu: this.handleContextMenu,
                              }),
                      tr(tr({}, (0, A.e)(this.props, this.handleOuterEvent)), n)
                    );
                  },
                },
                {
                  key: "addListener",
                  value: function () {
                    P.Z.on(P.t, this.handleReceiveSyncEvent);
                  },
                },
                {
                  key: "removeListener",
                  value: function () {
                    P.Z.removeListener(P.t, this.handleReceiveSyncEvent);
                  },
                },
                {
                  key: "filterFormatItem",
                  value: function (t, e, r) {
                    for (
                      var n = this.state.formattedGraphicalItems,
                        o = 0,
                        i = n.length;
                      o < i;
                      o++
                    ) {
                      var a = n[o];
                      if (
                        a.item === t ||
                        a.props.key === t.key ||
                        (e === (0, v.d)(a.item.type) && r === a.childIndex)
                      )
                        return a;
                    }
                    return null;
                  },
                },
                {
                  key: "renderClipPath",
                  value: function () {
                    var t = this.clipPathId,
                      r = this.state.offset,
                      n = r.left,
                      o = r.top,
                      i = r.height,
                      a = r.width;
                    return e.default.createElement(
                      "defs",
                      null,
                      e.default.createElement(
                        "clipPath",
                        { id: t },
                        e.default.createElement("rect", {
                          x: n,
                          y: o,
                          height: i,
                          width: a,
                        }),
                      ),
                    );
                  },
                },
                {
                  key: "getXScales",
                  value: function () {
                    var t = this.state.xAxisMap;
                    return t
                      ? Object.entries(t).reduce(function (t, e) {
                          var r = V(e, 2),
                            n = r[0],
                            o = r[1];
                          return tr(tr({}, t), {}, tn({}, n, o.scale));
                        }, {})
                      : null;
                  },
                },
                {
                  key: "getYScales",
                  value: function () {
                    var t = this.state.yAxisMap;
                    return t
                      ? Object.entries(t).reduce(function (t, e) {
                          var r = V(e, 2),
                            n = r[0],
                            o = r[1];
                          return tr(tr({}, t), {}, tn({}, n, o.scale));
                        }, {})
                      : null;
                  },
                },
                {
                  key: "getXScaleByAxisId",
                  value: function (t) {
                    var e;
                    return null == (e = this.state.xAxisMap) ||
                      null == (e = e[t])
                      ? void 0
                      : e.scale;
                  },
                },
                {
                  key: "getYScaleByAxisId",
                  value: function (t) {
                    var e;
                    return null == (e = this.state.yAxisMap) ||
                      null == (e = e[t])
                      ? void 0
                      : e.scale;
                  },
                },
                {
                  key: "getItemByXY",
                  value: function (t) {
                    var e = this.state,
                      r = e.formattedGraphicalItems,
                      n = e.activeItem;
                    if (r && r.length)
                      for (var o = 0, i = r.length; o < i; o++) {
                        var a = r[o],
                          u = a.props,
                          c = a.item,
                          l =
                            void 0 !== c.type.defaultProps
                              ? tr(tr({}, c.type.defaultProps), c.props)
                              : c.props,
                          s = (0, v.d)(c.type);
                        if ("Bar" === s) {
                          var f = (u.data || []).find(function (e) {
                            return (0, y.f)(t, e);
                          });
                          if (f) return { graphicalItem: a, payload: f };
                        } else if ("RadialBar" === s) {
                          var p = (u.data || []).find(function (e) {
                            return (0, j.$)(t, e);
                          });
                          if (p) return { graphicalItem: a, payload: p };
                        } else if (
                          (0, k.z)(a, n) ||
                          (0, k.s)(a, n) ||
                          (0, k._)(a, n)
                        ) {
                          var d = (0, k.y)({
                              graphicalItem: a,
                              activeTooltipItem: n,
                              itemData: l.data,
                            }),
                            h = void 0 === l.activeIndex ? d : l.activeIndex;
                          return {
                            graphicalItem: tr(tr({}, a), {}, { childIndex: h }),
                            payload: (0, k._)(a, n)
                              ? l.data[d]
                              : a.props.data[d],
                          };
                        }
                      }
                    return null;
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var t,
                      r,
                      n = this;
                    if (!(0, v.J)(this)) return null;
                    var o = this.props,
                      i = o.children,
                      a = o.className,
                      u = o.width,
                      l = o.height,
                      f = o.style,
                      p = o.compact,
                      d = o.title,
                      h = o.desc,
                      y = G(o, W),
                      m = (0, v.T)(y, !1);
                    if (p)
                      return e.default.createElement(
                        H.X,
                        {
                          state: this.state,
                          width: this.props.width,
                          height: this.props.height,
                          clipPathId: this.clipPathId,
                        },
                        e.default.createElement(
                          s.f,
                          q({}, m, { width: u, height: l, title: d, desc: h }),
                          this.renderClipPath(),
                          (0, v.W)(i, this.renderMap),
                        ),
                      );
                    this.props.accessibilityLayer &&
                      ((m.tabIndex = null != (t = this.props.tabIndex) ? t : 0),
                      (m.role =
                        null != (r = this.props.role) ? r : "application"),
                      (m.onKeyDown = function (t) {
                        n.accessibilityManager.keyboardEvent(t);
                      }),
                      (m.onFocus = function () {
                        n.accessibilityManager.focus();
                      }));
                    var b = this.parseEventsOfWrapper();
                    return e.default.createElement(
                      H.X,
                      {
                        state: this.state,
                        width: this.props.width,
                        height: this.props.height,
                        clipPathId: this.clipPathId,
                      },
                      e.default.createElement(
                        "div",
                        q(
                          {
                            className: (0, c.U)("recharts-wrapper", a),
                            style: tr(
                              {
                                position: "relative",
                                cursor: "default",
                                width: u,
                                height: l,
                              },
                              f,
                            ),
                          },
                          b,
                          {
                            ref: function (t) {
                              n.container = t;
                            },
                          },
                        ),
                        e.default.createElement(
                          s.f,
                          q({}, m, {
                            width: u,
                            height: l,
                            title: d,
                            desc: h,
                            style: ta,
                          }),
                          this.renderClipPath(),
                          (0, v.W)(i, this.renderMap),
                        ),
                        this.renderLegend(),
                        this.renderTooltip(),
                      ),
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
                    Object.defineProperty(t, to(n.key), n));
                }
              })(l.prototype, a),
              Object.defineProperty(l, "prototype", { writable: !1 }),
              l
            );
          })(e.Component);
        (tn(R, "displayName", o),
          tn(
            R,
            "defaultProps",
            tr(
              {
                layout: "horizontal",
                stackOffset: "none",
                barCategoryGap: "10%",
                barGap: 4,
                margin: { top: 5, right: 5, bottom: 5, left: 5 },
                reverseStackOrder: !1,
                syncMethod: "index",
              },
              D,
            ),
          ),
          tn(R, "getDerivedStateFromProps", function (t, e) {
            var n = t.dataKey,
              o = t.data,
              i = t.children,
              a = t.width,
              u = t.height,
              c = t.layout,
              l = t.stackOffset,
              s = t.margin,
              f = e.dataStartIndex,
              p = e.dataEndIndex;
            if (void 0 === e.updateId) {
              var d = tb(t);
              return tr(
                tr(
                  tr({}, d),
                  {},
                  { updateId: 0 },
                  B(tr(tr({ props: t }, d), {}, { updateId: 0 }), e),
                ),
                {},
                {
                  prevDataKey: n,
                  prevData: o,
                  prevWidth: a,
                  prevHeight: u,
                  prevLayout: c,
                  prevStackOffset: l,
                  prevMargin: s,
                  prevChildren: i,
                },
              );
            }
            if (
              n !== e.prevDataKey ||
              o !== e.prevData ||
              a !== e.prevWidth ||
              u !== e.prevHeight ||
              c !== e.prevLayout ||
              l !== e.prevStackOffset ||
              !(0, S.f)(s, e.prevMargin)
            ) {
              var h = tb(t),
                y = {
                  chartX: e.chartX,
                  chartY: e.chartY,
                  isTooltipActive: e.isTooltipActive,
                },
                b = tr(tr({}, td(e, o, c)), {}, { updateId: e.updateId + 1 }),
                g = tr(tr(tr({}, h), y), b);
              return tr(
                tr(tr({}, g), B(tr({ props: t }, g), e)),
                {},
                {
                  prevDataKey: n,
                  prevData: o,
                  prevWidth: a,
                  prevHeight: u,
                  prevLayout: c,
                  prevStackOffset: l,
                  prevMargin: s,
                  prevChildren: i,
                },
              );
            }
            if (!(0, v.N)(i, e.prevChildren)) {
              var x,
                O,
                w,
                j,
                P = (0, v.m)(i, m.f),
                A =
                  P &&
                  null != (x = null == (O = P.props) ? void 0 : O.startIndex)
                    ? x
                    : f,
                E =
                  P && null != (w = null == (j = P.props) ? void 0 : j.endIndex)
                    ? w
                    : p,
                M =
                  (0, r.default)(o) || A !== f || E !== p
                    ? e.updateId + 1
                    : e.updateId;
              return tr(
                tr(
                  { updateId: M },
                  B(
                    tr(
                      tr({ props: t }, e),
                      {},
                      { updateId: M, dataStartIndex: A, dataEndIndex: E },
                    ),
                    e,
                  ),
                ),
                {},
                { prevChildren: i, dataStartIndex: A, dataEndIndex: E },
              );
            }
            return null;
          }),
          tn(R, "renderActiveDot", function (t, r, o) {
            var i;
            return (
              (i = (0, e.isValidElement)(t)
                ? (0, e.cloneElement)(t, r)
                : (0, n.default)(t)
                  ? t(r)
                  : e.default.createElement(h.f, r)),
              e.default.createElement(
                f.f,
                { className: "recharts-active-dot", key: o },
                i,
              )
            );
          }));
        var L = (0, e.forwardRef)(function (t, r) {
          return e.default.createElement(R, q({}, t, { ref: r }));
        });
        return ((L.displayName = R.displayName), L);
      },
    ],
    612531,
  );
  var tO = t.i(926614),
    tw = t.i(998189),
    tj = t.i(861468),
    tS = t.i(998188);
  function tP(t, e, r) {
    if (e < 1) return [];
    if (1 === e && void 0 === r) return t;
    for (var n = [], o = 0; o < t.length; o += e)
      if (void 0 !== r && !0 !== r(t[o])) return;
      else n.push(t[o]);
    return n;
  }
  function tA(t, e, r, n, o) {
    if (t * e < t * n || t * e > t * o) return !1;
    var i = r();
    return t * (e - (t * i) / 2 - n) >= 0 && t * (e + (t * i) / 2 - o) <= 0;
  }
  function tE(t) {
    return (tE =
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
  function tM(t, e) {
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
  function tk(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tM(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != tE(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != tE(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == tE(e) ? e : e + "";
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
          : tM(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tT(t, e, r) {
    var o,
      i,
      a,
      u,
      c,
      l = t.tick,
      s = t.ticks,
      f = t.viewBox,
      p = t.minTickGap,
      d = t.orientation,
      h = t.interval,
      y = t.tickFormatter,
      v = t.unit,
      m = t.angle;
    if (!s || !s.length || !l) return [];
    if ((0, g.H)(h) || tj.f.isSsr)
      return tP(s, ("number" == typeof h && (0, g.H)(h) ? h : 0) + 1);
    var x = "top" === d || "bottom" === d ? "width" : "height",
      O =
        v && "width" === x
          ? (0, b.I)(v, { fontSize: e, letterSpacing: r })
          : { width: 0, height: 0 },
      w = function (t, o) {
        var i,
          a,
          u = (0, n.default)(y) ? y(t.value, o) : t.value;
        return "width" === x
          ? ((i = (0, b.I)(u, { fontSize: e, letterSpacing: r })),
            (a = { width: i.width + O.width, height: i.height + O.height }),
            (0, tS.U)(a, m))
          : (0, b.I)(u, { fontSize: e, letterSpacing: r })[x];
      },
      j = s.length >= 2 ? (0, g.n)(s[1].coordinate - s[0].coordinate) : 1,
      S =
        ((o = "width" === x),
        (i = f.x),
        (a = f.y),
        (u = f.width),
        (c = f.height),
        1 === j
          ? { start: o ? i : a, end: o ? i + u : a + c }
          : { start: o ? i + u : a + c, end: o ? i : a });
    return "equidistantPreserveStart" === h
      ? (function (t, e, r, n, o) {
          for (
            var i,
              a = (n || []).slice(),
              u = e.start,
              c = e.end,
              l = 0,
              s = 1,
              f = u;
            s <= a.length;

          )
            if (
              (i = (function () {
                var e,
                  i = null == n ? void 0 : n[l];
                if (void 0 === i) return { v: tP(n, s) };
                var a = l,
                  p = function () {
                    return (void 0 === e && (e = r(i, a)), e);
                  },
                  d = i.coordinate,
                  h = 0 === l || tA(t, d, p, f, c);
                (h || ((l = 0), (f = u), (s += 1)),
                  h && ((f = d + t * (p() / 2 + o)), (l += s)));
              })())
            )
              return i.v;
          return [];
        })(j, S, w, s, p)
      : ("preserveStart" === h || "preserveStartEnd" === h
          ? (function (t, e, r, n, o, i) {
              var a = (n || []).slice(),
                u = a.length,
                c = e.start,
                l = e.end;
              if (i) {
                var s = n[u - 1],
                  f = r(s, u - 1),
                  p = t * (s.coordinate + (t * f) / 2 - l);
                ((a[u - 1] = s =
                  tk(
                    tk({}, s),
                    {},
                    { tickCoord: p > 0 ? s.coordinate - p * t : s.coordinate },
                  )),
                  tA(
                    t,
                    s.tickCoord,
                    function () {
                      return f;
                    },
                    c,
                    l,
                  ) &&
                    ((l = s.tickCoord - t * (f / 2 + o)),
                    (a[u - 1] = tk(tk({}, s), {}, { isShow: !0 }))));
              }
              for (
                var d = i ? u - 1 : u,
                  h = function (e) {
                    var n,
                      i = a[e],
                      u = function () {
                        return (void 0 === n && (n = r(i, e)), n);
                      };
                    if (0 === e) {
                      var s = t * (i.coordinate - (t * u()) / 2 - c);
                      a[e] = i = tk(
                        tk({}, i),
                        {},
                        {
                          tickCoord:
                            s < 0 ? i.coordinate - s * t : i.coordinate,
                        },
                      );
                    } else
                      a[e] = i = tk(tk({}, i), {}, { tickCoord: i.coordinate });
                    tA(t, i.tickCoord, u, c, l) &&
                      ((c = i.tickCoord + t * (u() / 2 + o)),
                      (a[e] = tk(tk({}, i), {}, { isShow: !0 })));
                  },
                  y = 0;
                y < d;
                y++
              )
                h(y);
              return a;
            })(j, S, w, s, p, "preserveStartEnd" === h)
          : (function (t, e, r, n, o) {
              for (
                var i = (n || []).slice(),
                  a = i.length,
                  u = e.start,
                  c = e.end,
                  l = function (e) {
                    var n,
                      l = i[e],
                      s = function () {
                        return (void 0 === n && (n = r(l, e)), n);
                      };
                    if (e === a - 1) {
                      var f = t * (l.coordinate + (t * s()) / 2 - c);
                      i[e] = l = tk(
                        tk({}, l),
                        {},
                        {
                          tickCoord:
                            f > 0 ? l.coordinate - f * t : l.coordinate,
                        },
                      );
                    } else
                      i[e] = l = tk(tk({}, l), {}, { tickCoord: l.coordinate });
                    tA(t, l.tickCoord, s, u, c) &&
                      ((c = l.tickCoord - t * (s() / 2 + o)),
                      (i[e] = tk(tk({}, l), {}, { isShow: !0 })));
                  },
                  s = a - 1;
                s >= 0;
                s--
              )
                l(s);
              return i;
            })(j, S, w, s, p)
        ).filter(function (t) {
          return t.isShow;
        });
  }
  t.s(["f", 0, tT], 377136);
  var t_ = ["viewBox"],
    tC = ["viewBox"],
    tI = ["ticks"];
  function tD(t) {
    return (tD =
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
  function tN() {
    return (tN = Object.assign.bind()).apply(this, arguments);
  }
  function tB(t, e) {
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
  function tR(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tB(Object(r), !0).forEach(function (e) {
            tF(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tB(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tL(t, e) {
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
  }
  function tU(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, tW(n.key), n));
    }
  }
  function tz() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tz = function () {
      return !!t;
    })();
  }
  function t$(t) {
    return (t$ = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tH(t, e) {
    return (tH = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tF(t, e, r) {
    return (
      (e = tW(e)) in t
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
  function tW(t) {
    var e = (function (t, e) {
      if ("object" != tD(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != tD(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == tD(e) ? e : e + "";
  }
  var tX = (function (t) {
    var r, o;
    function a(t) {
      var e, r, n;
      if (!(this instanceof a))
        throw TypeError("Cannot call a class as a function");
      return (
        (r = a),
        (n = [t]),
        (r = t$(r)),
        ((e = (function (t, e) {
          if (e && ("object" === tD(e) || "function" == typeof e)) return e;
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
          tz()
            ? Reflect.construct(r, n || [], t$(this).constructor)
            : r.apply(this, n),
        )).state = { fontSize: "", letterSpacing: "" }),
        e
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (a.prototype = Object.create(t && t.prototype, {
        constructor: { value: a, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(a, "prototype", { writable: !1 }),
      t && tH(a, t),
      (r = [
        {
          key: "shouldComponentUpdate",
          value: function (t, e) {
            var r = t.viewBox,
              n = tL(t, t_),
              o = this.props,
              i = o.viewBox,
              a = tL(o, tC);
            return (
              !(0, S.f)(r, i) || !(0, S.f)(n, a) || !(0, S.f)(e, this.state)
            );
          },
        },
        {
          key: "componentDidMount",
          value: function () {
            var t = this.layerReference;
            if (t) {
              var e = t.getElementsByClassName(
                "recharts-cartesian-axis-tick-value",
              )[0];
              e &&
                this.setState({
                  fontSize: window.getComputedStyle(e).fontSize,
                  letterSpacing: window.getComputedStyle(e).letterSpacing,
                });
            }
          },
        },
        {
          key: "getTickLineCoord",
          value: function (t) {
            var e,
              r,
              n,
              o,
              i,
              a,
              u = this.props,
              c = u.x,
              l = u.y,
              s = u.width,
              f = u.height,
              p = u.orientation,
              d = u.tickSize,
              h = u.mirror,
              y = u.tickMargin,
              v = h ? -1 : 1,
              m = t.tickSize || d,
              b = (0, g.H)(t.tickCoord) ? t.tickCoord : t.coordinate;
            switch (p) {
              case "top":
                ((e = r = t.coordinate),
                  (a = (n = (o = l + !h * f) - v * m) - v * y),
                  (i = b));
                break;
              case "left":
                ((n = o = t.coordinate),
                  (i = (e = (r = c + !h * s) - v * m) - v * y),
                  (a = b));
                break;
              case "right":
                ((n = o = t.coordinate),
                  (i = (e = (r = c + h * s) + v * m) + v * y),
                  (a = b));
                break;
              default:
                ((e = r = t.coordinate),
                  (a = (n = (o = l + h * f) + v * m) + v * y),
                  (i = b));
            }
            return {
              line: { x1: e, y1: n, x2: r, y2: o },
              tick: { x: i, y: a },
            };
          },
        },
        {
          key: "getTickTextAnchor",
          value: function () {
            var t,
              e = this.props,
              r = e.orientation,
              n = e.mirror;
            switch (r) {
              case "left":
                t = n ? "start" : "end";
                break;
              case "right":
                t = n ? "end" : "start";
                break;
              default:
                t = "middle";
            }
            return t;
          },
        },
        {
          key: "getTickVerticalAnchor",
          value: function () {
            var t = this.props,
              e = t.orientation,
              r = t.mirror,
              n = "end";
            switch (e) {
              case "left":
              case "right":
                n = "middle";
                break;
              case "top":
                n = r ? "start" : "end";
                break;
              default:
                n = r ? "end" : "start";
            }
            return n;
          },
        },
        {
          key: "renderAxisLine",
          value: function () {
            var t = this.props,
              r = t.x,
              n = t.y,
              o = t.width,
              a = t.height,
              u = t.orientation,
              l = t.mirror,
              s = t.axisLine,
              f = tR(
                tR(tR({}, (0, v.T)(this.props, !1)), (0, v.T)(s, !1)),
                {},
                { fill: "none" },
              );
            if ("top" === u || "bottom" === u) {
              var p = +(("top" === u && !l) || ("bottom" === u && l));
              f = tR(
                tR({}, f),
                {},
                { x1: r, y1: n + p * a, x2: r + o, y2: n + p * a },
              );
            } else {
              var d = +(("left" === u && !l) || ("right" === u && l));
              f = tR(
                tR({}, f),
                {},
                { x1: r + d * o, y1: n, x2: r + d * o, y2: n + a },
              );
            }
            return e.default.createElement(
              "line",
              tN({}, f, {
                className: (0, c.U)(
                  "recharts-cartesian-axis-line",
                  (0, i.default)(s, "className"),
                ),
              }),
            );
          },
        },
        {
          key: "renderTicks",
          value: function (t, r, o) {
            var u = this,
              l = this.props,
              s = l.tickLine,
              p = l.stroke,
              d = l.tick,
              h = l.tickFormatter,
              y = l.unit,
              m = tT(tR(tR({}, this.props), {}, { ticks: t }), r, o),
              b = this.getTickTextAnchor(),
              g = this.getTickVerticalAnchor(),
              x = (0, v.T)(this.props, !1),
              O = (0, v.T)(d, !1),
              w = tR(tR({}, x), {}, { fill: "none" }, (0, v.T)(s, !1)),
              j = m.map(function (t, r) {
                var o = u.getTickLineCoord(t),
                  l = o.line,
                  v = o.tick,
                  j = tR(
                    tR(
                      tR(
                        tR({ textAnchor: b, verticalAnchor: g }, x),
                        {},
                        { stroke: "none", fill: p },
                        O,
                      ),
                      v,
                    ),
                    {},
                    {
                      index: r,
                      payload: t,
                      visibleTicksCount: m.length,
                      tickFormatter: h,
                    },
                  );
                return e.default.createElement(
                  f.f,
                  tN(
                    {
                      className: "recharts-cartesian-axis-tick",
                      key: "tick-"
                        .concat(t.value, "-")
                        .concat(t.coordinate, "-")
                        .concat(t.tickCoord),
                    },
                    (0, A.T)(u.props, t, r),
                  ),
                  s &&
                    e.default.createElement(
                      "line",
                      tN({}, w, l, {
                        className: (0, c.U)(
                          "recharts-cartesian-axis-tick-line",
                          (0, i.default)(s, "className"),
                        ),
                      }),
                    ),
                  d &&
                    a.renderTickItem(
                      d,
                      j,
                      ""
                        .concat((0, n.default)(h) ? h(t.value, r) : t.value)
                        .concat(y || ""),
                    ),
                );
              });
            return e.default.createElement(
              "g",
              { className: "recharts-cartesian-axis-ticks" },
              j,
            );
          },
        },
        {
          key: "render",
          value: function () {
            var t = this,
              r = this.props,
              o = r.axisLine,
              i = r.width,
              a = r.height,
              u = r.ticksGenerator,
              l = r.className;
            if (r.hide) return null;
            var s = this.props,
              p = s.ticks,
              d = tL(s, tI),
              h = p;
            return ((0, n.default)(u) &&
              (h = u(p && p.length > 0 ? this.props : d)),
            i <= 0 || a <= 0 || !h || !h.length)
              ? null
              : e.default.createElement(
                  f.f,
                  {
                    className: (0, c.U)("recharts-cartesian-axis", l),
                    ref: function (e) {
                      t.layerReference = e;
                    },
                  },
                  o && this.renderAxisLine(),
                  this.renderTicks(
                    h,
                    this.state.fontSize,
                    this.state.letterSpacing,
                  ),
                  tw.f.renderCallByParent(this.props),
                );
          },
        },
      ]),
      (o = [
        {
          key: "renderTickItem",
          value: function (t, r, o) {
            return e.default.isValidElement(t)
              ? e.default.cloneElement(t, r)
              : (0, n.default)(t)
                ? t(r)
                : e.default.createElement(
                    tO.f,
                    tN({}, r, {
                      className: "recharts-cartesian-axis-tick-value",
                    }),
                    o,
                  );
          },
        },
      ]),
      r && tU(a.prototype, r),
      o && tU(a, o),
      Object.defineProperty(a, "prototype", { writable: !1 }),
      a
    );
  })(e.Component);
  function tq(t) {
    return (tq =
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
  (tF(tX, "displayName", "CartesianAxis"),
    tF(tX, "defaultProps", {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      viewBox: { x: 0, y: 0, width: 0, height: 0 },
      orientation: "bottom",
      ticks: [],
      stroke: "#666",
      tickLine: !0,
      axisLine: !0,
      tick: !0,
      mirror: !1,
      minTickGap: 5,
      tickSize: 6,
      tickMargin: 2,
      interval: "preserveEnd",
    }),
    t.s(["f", 0, tX], 964170));
  function tV() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tV = function () {
      return !!t;
    })();
  }
  function tG(t) {
    return (tG = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tY(t, e) {
    return (tY = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tK(t, e, r) {
    return (
      (e = tZ(e)) in t
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
  function tZ(t) {
    var e = (function (t, e) {
      if ("object" != tq(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != tq(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == tq(e) ? e : e + "";
  }
  function tJ() {
    return (tJ = Object.assign.bind()).apply(this, arguments);
  }
  function tQ(t) {
    var r = t.xAxisId,
      n = (0, H.J)(),
      o = (0, H.Z)(),
      i = (0, H.U)(r);
    return null == i
      ? null
      : e.default.createElement(
          tX,
          tJ({}, i, {
            className: (0, c.U)(
              "recharts-".concat(i.axisType, " ").concat(i.axisType),
              i.className,
            ),
            viewBox: { x: 0, y: 0, width: n, height: o },
            ticksGenerator: function (t) {
              return (0, x.A)(t, !0);
            },
          }),
        );
  }
  var t0 = (function (t) {
    var r;
    function n() {
      var t, e;
      if (!(this instanceof n))
        throw TypeError("Cannot call a class as a function");
      return (
        (t = n),
        (e = arguments),
        (t = tG(t)),
        (function (t, e) {
          if (e && ("object" === tq(e) || "function" == typeof e)) return e;
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
          tV()
            ? Reflect.construct(t, e || [], tG(this).constructor)
            : t.apply(this, e),
        )
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (n.prototype = Object.create(t && t.prototype, {
        constructor: { value: n, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(n, "prototype", { writable: !1 }),
      t && tY(n, t),
      (r = [
        {
          key: "render",
          value: function () {
            return e.default.createElement(tQ, this.props);
          },
        },
      ]),
      (function (t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          ((n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(t, tZ(n.key), n));
        }
      })(n.prototype, r),
      Object.defineProperty(n, "prototype", { writable: !1 }),
      n
    );
  })(e.default.Component);
  function t1(t) {
    return (t1 =
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
  (tK(t0, "displayName", "XAxis"),
    tK(t0, "defaultProps", {
      allowDecimals: !0,
      hide: !1,
      orientation: "bottom",
      width: 0,
      height: 30,
      mirror: !1,
      xAxisId: 0,
      tickCount: 5,
      type: "category",
      padding: { left: 0, right: 0 },
      allowDataOverflow: !1,
      scale: "auto",
      reversed: !1,
      allowDuplicatedCategory: !0,
    }),
    t.s(["f", 0, t0], 671603));
  function t2() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (t2 = function () {
      return !!t;
    })();
  }
  function t3(t) {
    return (t3 = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function t4(t, e) {
    return (t4 = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function t8(t, e, r) {
    return (
      (e = t6(e)) in t
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
  function t6(t) {
    var e = (function (t, e) {
      if ("object" != t1(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != t1(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == t1(e) ? e : e + "";
  }
  function t5() {
    return (t5 = Object.assign.bind()).apply(this, arguments);
  }
  var t9 = function (t) {
      var r = t.yAxisId,
        n = (0, H.J)(),
        o = (0, H.Z)(),
        i = (0, H.W)(r);
      return null == i
        ? null
        : e.default.createElement(
            tX,
            t5({}, i, {
              className: (0, c.U)(
                "recharts-".concat(i.axisType, " ").concat(i.axisType),
                i.className,
              ),
              viewBox: { x: 0, y: 0, width: n, height: o },
              ticksGenerator: function (t) {
                return (0, x.A)(t, !0);
              },
            }),
          );
    },
    t7 = (function (t) {
      var r;
      function n() {
        var t, e;
        if (!(this instanceof n))
          throw TypeError("Cannot call a class as a function");
        return (
          (t = n),
          (e = arguments),
          (t = t3(t)),
          (function (t, e) {
            if (e && ("object" === t1(e) || "function" == typeof e)) return e;
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
            t2()
              ? Reflect.construct(t, e || [], t3(this).constructor)
              : t.apply(this, e),
          )
        );
      }
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      return (
        (n.prototype = Object.create(t && t.prototype, {
          constructor: { value: n, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(n, "prototype", { writable: !1 }),
        t && t4(n, t),
        (r = [
          {
            key: "render",
            value: function () {
              return e.default.createElement(t9, this.props);
            },
          },
        ]),
        (function (t, e) {
          for (var r = 0; r < e.length; r++) {
            var n = e[r];
            ((n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(t, t6(n.key), n));
          }
        })(n.prototype, r),
        Object.defineProperty(n, "prototype", { writable: !1 }),
        n
      );
    })(e.default.Component);
  (t8(t7, "displayName", "YAxis"),
    t8(t7, "defaultProps", {
      allowDuplicatedCategory: !0,
      allowDecimals: !0,
      hide: !1,
      orientation: "left",
      width: 60,
      height: 0,
      mirror: !1,
      yAxisId: 0,
      tickCount: 5,
      type: "number",
      padding: { top: 0, bottom: 0 },
      allowDataOverflow: !1,
      scale: "auto",
      reversed: !1,
    }),
    t.s(["f", 0, t7], 25264));
  var et = t.i(609094);
  function ee(t) {
    return (ee =
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
  function er(t, e) {
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
  function en(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? er(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != ee(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != ee(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == ee(e) ? e : e + "";
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
          : er(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function eo(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  var ei = (0, e.forwardRef)(function (t, r) {
    var n,
      o = t.aspect,
      i = t.initialDimension,
      a = void 0 === i ? { width: -1, height: -1 } : i,
      l = t.width,
      s = void 0 === l ? "100%" : l,
      f = t.height,
      p = void 0 === f ? "100%" : f,
      d = t.minWidth,
      h = void 0 === d ? 0 : d,
      y = t.minHeight,
      m = t.maxHeight,
      b = t.children,
      x = t.debounce,
      O = void 0 === x ? 0 : x,
      w = t.id,
      j = t.className,
      S = t.onResize,
      P = t.style,
      A = (0, e.useRef)(null),
      E = (0, e.useRef)();
    ((E.current = S),
      (0, e.useImperativeHandle)(r, function () {
        return Object.defineProperty(A.current, "current", {
          get: function () {
            return (
              console.warn(
                "The usage of ref.current.current is deprecated and will no longer be supported.",
              ),
              A.current
            );
          },
          configurable: !0,
        });
      }));
    var M =
        (function (t) {
          if (Array.isArray(t)) return t;
        })(
          (n = (0, e.useState)({
            containerWidth: a.width,
            containerHeight: a.height,
          })),
        ) ||
        (function (t) {
          var e =
            null == t
              ? null
              : ("u" > typeof Symbol && t[Symbol.iterator]) || t["@@iterator"];
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
        })(n) ||
        (function (t) {
          if (t) {
            if ("string" == typeof t) return eo(t, 2);
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
              return eo(t, 2);
          }
        })(n) ||
        (function () {
          throw TypeError(
            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(),
      k = M[0],
      T = M[1],
      _ = (0, e.useCallback)(function (t, e) {
        T(function (r) {
          var n = Math.round(t),
            o = Math.round(e);
          return r.containerWidth === n && r.containerHeight === o
            ? r
            : { containerWidth: n, containerHeight: o };
        });
      }, []);
    (0, e.useEffect)(
      function () {
        var t = function (t) {
          var e,
            r = t[0].contentRect,
            n = r.width,
            o = r.height;
          (_(n, o), null == (e = E.current) || e.call(E, n, o));
        };
        O > 0 && (t = (0, u.default)(t, O, { trailing: !0, leading: !1 }));
        var e = new ResizeObserver(t),
          r = A.current.getBoundingClientRect();
        return (
          _(r.width, r.height),
          e.observe(A.current),
          function () {
            e.disconnect();
          }
        );
      },
      [_, O],
    );
    var C = (0, e.useMemo)(
      function () {
        var t = k.containerWidth,
          r = k.containerHeight;
        if (t < 0 || r < 0) return null;
        ((0, et.f)(
          (0, g.e)(s) || (0, g.e)(p),
          "The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.",
          s,
          p,
        ),
          (0, et.f)(
            !o || o > 0,
            "The aspect(%s) must be greater than zero.",
            o,
          ));
        var n = (0, g.e)(s) ? t : s,
          i = (0, g.e)(p) ? r : p;
        (o &&
          o > 0 &&
          (n ? (i = n / o) : i && (n = i * o), m && i > m && (i = m)),
          (0, et.f)(
            n > 0 || i > 0,
            "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.",
            n,
            i,
            s,
            p,
            h,
            y,
            o,
          ));
        var a = !Array.isArray(b) && (0, v.d)(b.type).endsWith("Chart");
        return e.default.Children.map(b, function (t) {
          return e.default.isValidElement(t)
            ? (0, e.cloneElement)(
                t,
                en(
                  { width: n, height: i },
                  a
                    ? {
                        style: en(
                          {
                            height: "100%",
                            width: "100%",
                            maxHeight: i,
                            maxWidth: n,
                          },
                          t.props.style,
                        ),
                      }
                    : {},
                ),
              )
            : t;
        });
      },
      [o, b, p, m, y, h, k, s],
    );
    return e.default.createElement(
      "div",
      {
        id: w ? "".concat(w) : void 0,
        className: (0, c.U)("recharts-responsive-container", j),
        style: en(
          en({}, void 0 === P ? {} : P),
          {},
          { width: s, height: p, minWidth: h, minHeight: y, maxHeight: m },
        ),
        ref: A,
      },
      C,
    );
  });
  t.s(["f", 0, ei], 45143);
};
