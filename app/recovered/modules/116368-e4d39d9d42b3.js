// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    n = t.i(7284),
    r = t.i(33082),
    i = t.i(462931),
    o = t.i(757158),
    s = t.i(180793),
    a = t.i(972947),
    u = t.i(661642),
    c = t.i(783615),
    l = t.i(509406),
    f = t.i(748213),
    h = t.i(467255),
    p = t.i(861468),
    d = t.i(756438),
    v = t.i(223025),
    y = t.i(871791),
    m = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"],
    g = ["key"];
  function b(t) {
    return (b =
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
  function w(t, e) {
    if (null == t) return {};
    var n,
      r,
      i = (function (t, e) {
        if (null == t) return {};
        var n = {};
        for (var r in t)
          if (Object.prototype.hasOwnProperty.call(t, r)) {
            if (e.indexOf(r) >= 0) continue;
            n[r] = t[r];
          }
        return n;
      })(t, e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(t);
      for (r = 0; r < o.length; r++)
        ((n = o[r]),
          !(e.indexOf(n) >= 0) &&
            Object.prototype.propertyIsEnumerable.call(t, n) &&
            (i[n] = t[n]));
    }
    return i;
  }
  function x() {
    return (x = Object.assign.bind()).apply(this, arguments);
  }
  function O(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      (e &&
        (r = r.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function E(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? O(Object(n), !0).forEach(function (e) {
            j(t, e, n[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
          : O(Object(n)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(n, e),
              );
            });
    }
    return t;
  }
  function A(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      ((r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, L(r.key), r));
    }
  }
  function P() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (P = function () {
      return !!t;
    })();
  }
  function N(t) {
    return (N = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function _(t, e) {
    return (_ = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function j(t, e, n) {
    return (
      (e = L(e)) in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = n),
      t
    );
  }
  function L(t) {
    var e = (function (t, e) {
      if ("object" != b(t) || !t) return t;
      var n = t[Symbol.toPrimitive];
      if (void 0 !== n) {
        var r = n.call(t, e || "default");
        if ("object" != b(r)) return r;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == b(e) ? e : e + "";
  }
  var k = (function (t) {
    var l, p;
    function v() {
      var t, e, n;
      if (!(this instanceof v))
        throw TypeError("Cannot call a class as a function");
      for (var r = arguments.length, o = Array(r), s = 0; s < r; s++)
        o[s] = arguments[s];
      return (
        (e = v),
        (n = [].concat(o)),
        (e = N(e)),
        j(
          (t = (function (t, e) {
            if (e && ("object" === b(e) || "function" == typeof e)) return e;
            if (void 0 !== e)
              throw TypeError(
                "Derived constructors may only return object or undefined",
              );
            var n = t;
            if (void 0 === n)
              throw ReferenceError(
                "this hasn't been initialised - super() hasn't been called",
              );
            return n;
          })(
            this,
            P()
              ? Reflect.construct(e, n || [], N(this).constructor)
              : e.apply(this, n),
          )),
          "state",
          { isAnimationFinished: !0 },
        ),
        j(t, "id", (0, d.C)("recharts-area-")),
        j(t, "handleAnimationEnd", function () {
          var e = t.props.onAnimationEnd;
          (t.setState({ isAnimationFinished: !0 }), (0, i.default)(e) && e());
        }),
        j(t, "handleAnimationStart", function () {
          var e = t.props.onAnimationStart;
          (t.setState({ isAnimationFinished: !1 }), (0, i.default)(e) && e());
        }),
        t
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (v.prototype = Object.create(t && t.prototype, {
        constructor: { value: v, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(v, "prototype", { writable: !1 }),
      t && _(v, t),
      (l = [
        {
          key: "renderDots",
          value: function (t, n, r) {
            var i = this.props.isAnimationActive,
              o = this.state.isAnimationFinished;
            if (i && !o) return null;
            var s = this.props,
              a = s.dot,
              u = s.points,
              c = s.dataKey,
              l = (0, y.T)(this.props, !1),
              h = (0, y.T)(a, !0),
              p = u.map(function (t, e) {
                var n = E(
                  E(E({ key: "dot-".concat(e), r: 3 }, l), h),
                  {},
                  {
                    index: e,
                    cx: t.x,
                    cy: t.y,
                    dataKey: c,
                    value: t.value,
                    payload: t.payload,
                    points: u,
                  },
                );
                return v.renderDotItem(a, n);
              }),
              d = {
                clipPath: t
                  ? "url(#clipPath-".concat(n ? "" : "dots-").concat(r, ")")
                  : null,
              };
            return e.default.createElement(
              f.f,
              x({ className: "recharts-area-dots" }, d),
              p,
            );
          },
        },
        {
          key: "renderHorizontalRect",
          value: function (t) {
            var n = this.props,
              r = n.baseLine,
              i = n.points,
              s = n.strokeWidth,
              a = i[0].x,
              u = i[i.length - 1].x,
              c = t * Math.abs(a - u),
              l = (0, o.default)(
                i.map(function (t) {
                  return t.y || 0;
                }),
              );
            return ((0, d.H)(r) && "number" == typeof r
              ? (l = Math.max(r, l))
              : r &&
                Array.isArray(r) &&
                r.length &&
                (l = Math.max(
                  (0, o.default)(
                    r.map(function (t) {
                      return t.y || 0;
                    }),
                  ),
                  l,
                )),
            (0, d.H)(l))
              ? e.default.createElement("rect", {
                  x: a < u ? a : a - c,
                  y: 0,
                  width: c,
                  height: Math.floor(l + (s ? parseInt("".concat(s), 10) : 1)),
                })
              : null;
          },
        },
        {
          key: "renderVerticalRect",
          value: function (t) {
            var n = this.props,
              r = n.baseLine,
              i = n.points,
              s = n.strokeWidth,
              a = i[0].y,
              u = i[i.length - 1].y,
              c = t * Math.abs(a - u),
              l = (0, o.default)(
                i.map(function (t) {
                  return t.x || 0;
                }),
              );
            return ((0, d.H)(r) && "number" == typeof r
              ? (l = Math.max(r, l))
              : r &&
                Array.isArray(r) &&
                r.length &&
                (l = Math.max(
                  (0, o.default)(
                    r.map(function (t) {
                      return t.x || 0;
                    }),
                  ),
                  l,
                )),
            (0, d.H)(l))
              ? e.default.createElement("rect", {
                  x: 0,
                  y: a < u ? a : a - c,
                  width: l + (s ? parseInt("".concat(s), 10) : 1),
                  height: Math.floor(c),
                })
              : null;
          },
        },
        {
          key: "renderClipRect",
          value: function (t) {
            return "vertical" === this.props.layout
              ? this.renderVerticalRect(t)
              : this.renderHorizontalRect(t);
          },
        },
        {
          key: "renderAreaStatically",
          value: function (t, n, r, i) {
            var o = this.props,
              s = o.layout,
              a = o.type,
              u = o.stroke,
              l = o.connectNulls,
              h = o.isRange,
              p = (o.ref, w(o, m));
            return e.default.createElement(
              f.f,
              { clipPath: r ? "url(#clipPath-".concat(i, ")") : null },
              e.default.createElement(
                c.f,
                x({}, (0, y.T)(p, !0), {
                  points: t,
                  connectNulls: l,
                  type: a,
                  baseLine: n,
                  layout: s,
                  stroke: "none",
                  className: "recharts-area-area",
                }),
              ),
              "none" !== u &&
                e.default.createElement(
                  c.f,
                  x({}, (0, y.T)(this.props, !1), {
                    className: "recharts-area-curve",
                    layout: s,
                    type: a,
                    connectNulls: l,
                    fill: "none",
                    points: t,
                  }),
                ),
              "none" !== u &&
                h &&
                e.default.createElement(
                  c.f,
                  x({}, (0, y.T)(this.props, !1), {
                    className: "recharts-area-curve",
                    layout: s,
                    type: a,
                    connectNulls: l,
                    fill: "none",
                    points: n,
                  }),
                ),
            );
          },
        },
        {
          key: "renderAreaWithAnimation",
          value: function (t, n) {
            var i = this,
              o = this.props,
              u = o.points,
              c = o.baseLine,
              l = o.isAnimationActive,
              h = o.animationBegin,
              p = o.animationDuration,
              v = o.animationEasing,
              y = o.animationId,
              m = this.state,
              g = m.prevPoints,
              b = m.prevBaseLine;
            return e.default.createElement(
              r.f,
              {
                begin: h,
                duration: p,
                isActive: l,
                easing: v,
                from: { t: 0 },
                to: { t: 1 },
                key: "area-".concat(y),
                onAnimationEnd: this.handleAnimationEnd,
                onAnimationStart: this.handleAnimationStart,
              },
              function (r) {
                var o = r.t;
                if (g) {
                  var l,
                    h = g.length / u.length,
                    p = u.map(function (t, e) {
                      var n = Math.floor(e * h);
                      if (g[n]) {
                        var r = g[n],
                          i = (0, d.P)(r.x, t.x),
                          s = (0, d.P)(r.y, t.y);
                        return E(E({}, t), {}, { x: i(o), y: s(o) });
                      }
                      return t;
                    });
                  return (
                    (l =
                      (0, d.H)(c) && "number" == typeof c
                        ? (0, d.P)(b, c)(o)
                        : (0, s.default)(c) || (0, a.default)(c)
                          ? (0, d.P)(b, 0)(o)
                          : c.map(function (t, e) {
                              var n = Math.floor(e * h);
                              if (b[n]) {
                                var r = b[n],
                                  i = (0, d.P)(r.x, t.x),
                                  s = (0, d.P)(r.y, t.y);
                                return E(E({}, t), {}, { x: i(o), y: s(o) });
                              }
                              return t;
                            })),
                    i.renderAreaStatically(p, l, t, n)
                  );
                }
                return e.default.createElement(
                  f.f,
                  null,
                  e.default.createElement(
                    "defs",
                    null,
                    e.default.createElement(
                      "clipPath",
                      { id: "animationClipPath-".concat(n) },
                      i.renderClipRect(o),
                    ),
                  ),
                  e.default.createElement(
                    f.f,
                    { clipPath: "url(#animationClipPath-".concat(n, ")") },
                    i.renderAreaStatically(u, c, t, n),
                  ),
                );
              },
            );
          },
        },
        {
          key: "renderArea",
          value: function (t, e) {
            var n = this.props,
              r = n.points,
              i = n.baseLine,
              o = n.isAnimationActive,
              s = this.state,
              a = s.prevPoints,
              c = s.prevBaseLine,
              l = s.totalLength;
            return o &&
              r &&
              r.length &&
              ((!a && l > 0) || !(0, u.default)(a, r) || !(0, u.default)(c, i))
              ? this.renderAreaWithAnimation(t, e)
              : this.renderAreaStatically(r, i, t, e);
          },
        },
        {
          key: "render",
          value: function () {
            var t,
              r = this.props,
              i = r.hide,
              o = r.dot,
              a = r.points,
              u = r.className,
              c = r.top,
              l = r.left,
              p = r.xAxis,
              d = r.yAxis,
              v = r.width,
              m = r.height,
              g = r.isAnimationActive,
              b = r.id;
            if (i || !a || !a.length) return null;
            var w = this.state.isAnimationFinished,
              x = 1 === a.length,
              O = (0, n.U)("recharts-area", u),
              E = p && p.allowDataOverflow,
              A = d && d.allowDataOverflow,
              P = E || A,
              N = (0, s.default)(b) ? this.id : b,
              _ = null != (t = (0, y.T)(o, !1)) ? t : { r: 3, strokeWidth: 2 },
              j = _.r,
              L = _.strokeWidth,
              k = ((0, y.b)(o) ? o : {}).clipDot,
              D = void 0 === k || k,
              S = 2 * (void 0 === j ? 3 : j) + (void 0 === L ? 2 : L);
            return e.default.createElement(
              f.f,
              { className: O },
              E || A
                ? e.default.createElement(
                    "defs",
                    null,
                    e.default.createElement(
                      "clipPath",
                      { id: "clipPath-".concat(N) },
                      e.default.createElement("rect", {
                        x: E ? l : l - v / 2,
                        y: A ? c : c - m / 2,
                        width: E ? v : 2 * v,
                        height: A ? m : 2 * m,
                      }),
                    ),
                    !D &&
                      e.default.createElement(
                        "clipPath",
                        { id: "clipPath-dots-".concat(N) },
                        e.default.createElement("rect", {
                          x: l - S / 2,
                          y: c - S / 2,
                          width: v + S,
                          height: m + S,
                        }),
                      ),
                  )
                : null,
              x ? null : this.renderArea(P, N),
              (o || x) && this.renderDots(P, D, N),
              (!g || w) && h.f.renderCallByParent(this.props, a),
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
                  curPoints: t.points,
                  curBaseLine: t.baseLine,
                  prevPoints: e.curPoints,
                  prevBaseLine: e.curBaseLine,
                }
              : t.points !== e.curPoints || t.baseLine !== e.curBaseLine
                ? { curPoints: t.points, curBaseLine: t.baseLine }
                : null;
          },
        },
      ]),
      l && A(v.prototype, l),
      p && A(v, p),
      Object.defineProperty(v, "prototype", { writable: !1 }),
      v
    );
  })(e.PureComponent);
  (j(k, "displayName", "Area"),
    j(k, "defaultProps", {
      stroke: "#3182bd",
      fill: "#3182bd",
      fillOpacity: 0.6,
      xAxisId: 0,
      yAxisId: 0,
      legendType: "line",
      connectNulls: !1,
      points: [],
      dot: !1,
      activeDot: !0,
      hide: !1,
      isAnimationActive: !p.f.isSsr,
      animationBegin: 0,
      animationDuration: 1500,
      animationEasing: "ease",
    }),
    j(k, "getBaseValue", function (t, e, n, r) {
      var i = t.layout,
        o = t.baseValue,
        s = e.props.baseValue,
        a = null != s ? s : o;
      if ((0, d.H)(a) && "number" == typeof a) return a;
      var u = "horizontal" === i ? r : n,
        c = u.scale.domain();
      if ("number" === u.type) {
        var l = Math.max(c[0], c[1]),
          f = Math.min(c[0], c[1]);
        return "dataMin" === a
          ? f
          : "dataMax" === a || l < 0
            ? l
            : Math.max(Math.min(c[0], c[1]), 0);
      }
      return "dataMin" === a ? c[0] : "dataMax" === a ? c[1] : c[0];
    }),
    j(k, "getComposedData", function (t) {
      var e,
        n = t.props,
        r = t.item,
        i = t.xAxis,
        o = t.yAxis,
        s = t.xAxisTicks,
        a = t.yAxisTicks,
        u = t.bandSize,
        c = t.dataKey,
        l = t.stackedData,
        f = t.dataStartIndex,
        h = t.displayedData,
        p = t.offset,
        d = n.layout,
        y = l && l.length,
        m = k.getBaseValue(n, r, i, o),
        g = "horizontal" === d,
        b = !1,
        w = h.map(function (t, e) {
          y
            ? (n = l[f + e])
            : Array.isArray((n = (0, v.K)(t, c)))
              ? (b = !0)
              : (n = [m, n]);
          var n,
            r = null == n[1] || (y && null == (0, v.K)(t, c));
          return g
            ? {
                x: (0, v.q)({
                  axis: i,
                  ticks: s,
                  bandSize: u,
                  entry: t,
                  index: e,
                }),
                y: r ? null : o.scale(n[1]),
                value: n,
                payload: t,
              }
            : {
                x: r ? null : i.scale(n[1]),
                y: (0, v.q)({
                  axis: o,
                  ticks: a,
                  bandSize: u,
                  entry: t,
                  index: e,
                }),
                value: n,
                payload: t,
              };
        });
      return (
        (e =
          y || b
            ? w.map(function (t) {
                var e = Array.isArray(t.value) ? t.value[0] : null;
                return g
                  ? { x: t.x, y: null != e && null != t.y ? o.scale(e) : null }
                  : { x: null != e ? i.scale(e) : null, y: t.y };
              })
            : g
              ? o.scale(m)
              : i.scale(m)),
        E({ points: w, baseLine: e, layout: d, isRange: b }, p)
      );
    }),
    j(k, "renderDotItem", function (t, r) {
      var o;
      if (e.default.isValidElement(t)) o = e.default.cloneElement(t, r);
      else if ((0, i.default)(t)) o = t(r);
      else {
        var s = (0, n.U)(
            "recharts-area-dot",
            "boolean" != typeof t ? t.className : "",
          ),
          a = r.key,
          u = w(r, g);
        o = e.default.createElement(l.f, x({}, u, { key: a, className: s }));
      }
      return o;
    }),
    t.s(["f", 0, k]));
};
