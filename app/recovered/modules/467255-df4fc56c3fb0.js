// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  (t.s(
    [
      "c",
      () => tH,
      "b",
      () => tL,
      "u",
      () => tJ,
      "t",
      () => tK,
      "y",
      () => tQ,
      "O",
      () => en,
      "T",
      () => t$,
      "d",
      () => tz,
      "i",
      () => t5,
      "W",
      () => t6,
      "q",
      () => t8,
      "_",
      () => tV,
      "M",
      () => tR,
      "L",
      () => tX,
      "s",
      () => t7,
      "J",
      () => tU,
      "$",
      () => t3,
      "x",
      () => t9,
      "A",
      () => tG,
      "S",
      () => t4,
      "r",
      () => ei,
      "K",
      () => tB,
      "N",
      () => tq,
      "e",
      () => eo,
      "w",
      () => tW,
      "z",
      () => tZ,
      "n",
      () => er,
      "v",
      () => t0,
    ],
    223025,
  ),
    t.s(["f", () => tk], 175160));
  var e = t.i(352386),
    r = t.i(180793),
    n = t.i(878524),
    o = t.i(462931),
    i = t.i(92234),
    a = t.i(7284),
    u = t.i(926614),
    c = t.i(871791),
    l = t.i(756438),
    s = t.i(629419),
    f = t.i(150500),
    p = t.i(593829),
    d = t.i(287118),
    h = t.i(948086),
    y = t.i(379975),
    v = t.i(416172),
    m = t.i(757158),
    b = t.i(913002),
    g = t.i(989089),
    x = t.i(375194),
    O = t.i(945734),
    w = t.i(972947),
    j = t.i(454133),
    S = t.i(661642),
    P = t.i(904703);
  t.i(183998);
  var A = t.i(884617),
    E = t.i(575691),
    M = t.i(609094),
    k = t.i(236475),
    T = t.i(459683),
    _ = t.i(199518);
  let C = Math.cos,
    I = Math.sin,
    D = Math.sqrt,
    N = Math.PI,
    B = 2 * N;
  D(3);
  let R = {
      draw(t, e) {
        let r = D(e / N);
        (t.moveTo(r, 0), t.arc(0, 0, r, 0, B));
      },
    },
    L = D(1 / 3),
    U = 2 * L,
    z = I(N / 10) / I((7 * N) / 10),
    $ = I(B / 10) * z,
    H = -C(B / 10) * z,
    F = D(3);
  D(3);
  let W = D(3) / 2,
    X = 1 / D(12),
    q = (X / 2 + 1) * 3;
  function V(t) {
    return (V =
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
  var G = ["type", "size", "sizeType"];
  function Y() {
    return (Y = Object.assign.bind()).apply(this, arguments);
  }
  function K(t, e) {
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
  function Z(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? K(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != V(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != V(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == V(e) ? e : e + "";
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
          : K(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var J = {
      symbolCircle: R,
      symbolCross: {
        draw(t, e) {
          let r = D(e / 5) / 2;
          (t.moveTo(-3 * r, -r),
            t.lineTo(-r, -r),
            t.lineTo(-r, -3 * r),
            t.lineTo(r, -3 * r),
            t.lineTo(r, -r),
            t.lineTo(3 * r, -r),
            t.lineTo(3 * r, r),
            t.lineTo(r, r),
            t.lineTo(r, 3 * r),
            t.lineTo(-r, 3 * r),
            t.lineTo(-r, r),
            t.lineTo(-3 * r, r),
            t.closePath());
        },
      },
      symbolDiamond: {
        draw(t, e) {
          let r = D(e / U),
            n = r * L;
          (t.moveTo(0, -r),
            t.lineTo(n, 0),
            t.lineTo(0, r),
            t.lineTo(-n, 0),
            t.closePath());
        },
      },
      symbolSquare: {
        draw(t, e) {
          let r = D(e),
            n = -r / 2;
          t.rect(n, n, r, r);
        },
      },
      symbolStar: {
        draw(t, e) {
          let r = D(0.8908130915292852 * e),
            n = $ * r,
            o = H * r;
          (t.moveTo(0, -r), t.lineTo(n, o));
          for (let e = 1; e < 5; ++e) {
            let i = (B * e) / 5,
              a = C(i),
              u = I(i);
            (t.lineTo(u * r, -a * r), t.lineTo(a * n - u * o, u * n + a * o));
          }
          t.closePath();
        },
      },
      symbolTriangle: {
        draw(t, e) {
          let r = -D(e / (3 * F));
          (t.moveTo(0, 2 * r),
            t.lineTo(-F * r, -r),
            t.lineTo(F * r, -r),
            t.closePath());
        },
      },
      symbolWye: {
        draw(t, e) {
          let r = D(e / q),
            n = r / 2,
            o = r * X,
            i = r * X + r,
            a = -n;
          (t.moveTo(n, o),
            t.lineTo(n, i),
            t.lineTo(a, i),
            t.lineTo(-0.5 * n - W * o, W * n + -0.5 * o),
            t.lineTo(-0.5 * n - W * i, W * n + -0.5 * i),
            t.lineTo(-0.5 * a - W * i, W * a + -0.5 * i),
            t.lineTo(-0.5 * n + W * o, -0.5 * o - W * n),
            t.lineTo(-0.5 * n + W * i, -0.5 * i - W * n),
            t.lineTo(-0.5 * a + W * i, -0.5 * i - W * a),
            t.closePath());
        },
      },
    },
    Q = Math.PI / 180,
    tt = function (t, e, r) {
      if ("area" === e) return t;
      switch (r) {
        case "cross":
          return (5 * t * t) / 9;
        case "diamond":
          return (0.5 * t * t) / Math.sqrt(3);
        case "square":
          return t * t;
        case "star":
          var n = 18 * Q;
          return (
            1.25 *
            t *
            t *
            (Math.tan(n) - Math.tan(2 * n) * Math.pow(Math.tan(n), 2))
          );
        case "triangle":
          return (Math.sqrt(3) * t * t) / 4;
        case "wye":
          return ((21 - 10 * Math.sqrt(3)) * t * t) / 8;
        default:
          return (Math.PI * t * t) / 4;
      }
    },
    te = function (t) {
      var r,
        n = t.type,
        o = void 0 === n ? "circle" : n,
        i = t.size,
        u = void 0 === i ? 64 : i,
        l = t.sizeType,
        s = void 0 === l ? "area" : l,
        f = Z(
          Z(
            {},
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
            })(t, G),
          ),
          {},
          { type: o, size: u, sizeType: s },
        ),
        p = f.className,
        d = f.cx,
        h = f.cy,
        y = (0, c.T)(f, !0);
      return d === +d && h === +h && u === +u
        ? e.default.createElement(
            "path",
            Y({}, y, {
              className: (0, a.U)("recharts-symbols", p),
              transform: "translate(".concat(d, ", ").concat(h, ")"),
              d:
                ((r = J["symbol".concat((0, j.default)(o))] || R),
                (function (t, e) {
                  let r = null,
                    n = (0, _.f)(o);
                  function o() {
                    let o;
                    if (
                      (r || (r = o = n()),
                      t
                        .apply(this, arguments)
                        .draw(r, +e.apply(this, arguments)),
                      o)
                    )
                      return ((r = null), o + "" || null);
                  }
                  return (
                    (t = "function" == typeof t ? t : (0, T.f)(t || R)),
                    (e =
                      "function" == typeof e
                        ? e
                        : (0, T.f)(void 0 === e ? 64 : +e)),
                    (o.type = function (e) {
                      return arguments.length
                        ? ((t = "function" == typeof e ? e : (0, T.f)(e)), o)
                        : t;
                    }),
                    (o.size = function (t) {
                      return arguments.length
                        ? ((e = "function" == typeof t ? t : (0, T.f)(+t)), o)
                        : e;
                    }),
                    (o.context = function (t) {
                      return arguments.length
                        ? ((r = null == t ? null : t), o)
                        : r;
                    }),
                    o
                  );
                })()
                  .type(r)
                  .size(tt(u, s, o))()),
            }),
          )
        : null;
    };
  ((te.registerSymbol = function (t, e) {
    J["symbol".concat((0, j.default)(t))] = e;
  }),
    t.s(["f", 0, te], 270540));
  var tr = t.i(49647);
  function tn(t) {
    return (tn =
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
  function to() {
    return (to = Object.assign.bind()).apply(this, arguments);
  }
  function ti(t, e) {
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
  function ta() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (ta = function () {
      return !!t;
    })();
  }
  function tu(t) {
    return (tu = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tc(t, e) {
    return (tc = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tl(t, e, r) {
    return (
      (e = ts(e)) in t
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
  function ts(t) {
    var e = (function (t, e) {
      if ("object" != tn(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != tn(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == tn(e) ? e : e + "";
  }
  var tf = (function (t) {
    var r;
    function n() {
      var t, e;
      if (!(this instanceof n))
        throw TypeError("Cannot call a class as a function");
      return (
        (t = n),
        (e = arguments),
        (t = tu(t)),
        (function (t, e) {
          if (e && ("object" === tn(e) || "function" == typeof e)) return e;
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
          ta()
            ? Reflect.construct(t, e || [], tu(this).constructor)
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
      t && tc(n, t),
      (r = [
        {
          key: "renderIcon",
          value: function (t) {
            var r = this.props.inactiveColor,
              n = 32 / 6,
              o = 32 / 3,
              i = t.inactive ? r : t.color;
            if ("plainline" === t.type)
              return e.default.createElement("line", {
                strokeWidth: 4,
                fill: "none",
                stroke: i,
                strokeDasharray: t.payload.strokeDasharray,
                x1: 0,
                y1: 16,
                x2: 32,
                y2: 16,
                className: "recharts-legend-icon",
              });
            if ("line" === t.type)
              return e.default.createElement("path", {
                strokeWidth: 4,
                fill: "none",
                stroke: i,
                d: "M0,"
                  .concat(16, "h")
                  .concat(o, "\n            A")
                  .concat(n, ",")
                  .concat(n, ",0,1,1,")
                  .concat(2 * o, ",")
                  .concat(16, "\n            H")
                  .concat(32, "M")
                  .concat(2 * o, ",")
                  .concat(16, "\n            A")
                  .concat(n, ",")
                  .concat(n, ",0,1,1,")
                  .concat(o, ",")
                  .concat(16),
                className: "recharts-legend-icon",
              });
            if ("rect" === t.type)
              return e.default.createElement("path", {
                stroke: "none",
                fill: i,
                d: "M0,"
                  .concat(4, "h")
                  .concat(32, "v")
                  .concat(24, "h")
                  .concat(-32, "z"),
                className: "recharts-legend-icon",
              });
            if (e.default.isValidElement(t.legendIcon)) {
              var a = (function (t) {
                for (var e = 1; e < arguments.length; e++) {
                  var r = null != arguments[e] ? arguments[e] : {};
                  e % 2
                    ? ti(Object(r), !0).forEach(function (e) {
                        tl(t, e, r[e]);
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          t,
                          Object.getOwnPropertyDescriptors(r),
                        )
                      : ti(Object(r)).forEach(function (e) {
                          Object.defineProperty(
                            t,
                            e,
                            Object.getOwnPropertyDescriptor(r, e),
                          );
                        });
                }
                return t;
              })({}, t);
              return (
                delete a.legendIcon,
                e.default.cloneElement(t.legendIcon, a)
              );
            }
            return e.default.createElement(te, {
              fill: i,
              cx: 16,
              cy: 16,
              size: 32,
              sizeType: "diameter",
              type: t.type,
            });
          },
        },
        {
          key: "renderItems",
          value: function () {
            var t = this,
              r = this.props,
              n = r.payload,
              i = r.iconSize,
              u = r.layout,
              c = r.formatter,
              l = r.inactiveColor,
              s = { x: 0, y: 0, width: 32, height: 32 },
              f = {
                display: "horizontal" === u ? "inline-block" : "block",
                marginRight: 10,
              },
              p = {
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: 4,
              };
            return n.map(function (r, n) {
              var u = r.formatter || c,
                d = (0, a.U)(
                  tl(
                    tl(
                      { "recharts-legend-item": !0 },
                      "legend-item-".concat(n),
                      !0,
                    ),
                    "inactive",
                    r.inactive,
                  ),
                );
              if ("none" === r.type) return null;
              var h = (0, o.default)(r.value) ? null : r.value;
              (0, M.f)(
                !(0, o.default)(r.value),
                'The name property is also required when using a function for the dataKey of a chart\'s cartesian components. Ex: <Bar name="Name of my Data"/>',
              );
              var y = r.inactive ? l : r.color;
              return e.default.createElement(
                "li",
                to(
                  { className: d, style: f, key: "legend-item-".concat(n) },
                  (0, tr.T)(t.props, r, n),
                ),
                e.default.createElement(
                  k.f,
                  { width: i, height: i, viewBox: s, style: p },
                  t.renderIcon(r),
                ),
                e.default.createElement(
                  "span",
                  {
                    className: "recharts-legend-item-text",
                    style: { color: y },
                  },
                  u ? u(h, r, n) : h,
                ),
              );
            });
          },
        },
        {
          key: "render",
          value: function () {
            var t = this.props,
              r = t.payload,
              n = t.layout,
              o = t.align;
            return r && r.length
              ? e.default.createElement(
                  "ul",
                  {
                    className: "recharts-default-legend",
                    style: {
                      padding: 0,
                      margin: 0,
                      textAlign: "horizontal" === n ? o : "left",
                    },
                  },
                  this.renderItems(),
                )
              : null;
          },
        },
      ]),
      (function (t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          ((n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(t, ts(n.key), n));
        }
      })(n.prototype, r),
      Object.defineProperty(n, "prototype", { writable: !1 }),
      n
    );
  })(e.PureComponent);
  (tl(tf, "displayName", "Legend"),
    tl(tf, "defaultProps", {
      iconSize: 14,
      layout: "horizontal",
      align: "center",
      verticalAlign: "middle",
      inactiveColor: "#ccc",
    }));
  var tp = t.i(330736);
  function td(t, e, r) {
    return !0 === e
      ? (0, tp.default)(t, r)
      : (0, o.default)(e)
        ? (0, tp.default)(t, e)
        : t;
  }
  function th(t) {
    return (th =
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
  t.s(["f", 0, td], 576786);
  var ty = ["ref"];
  function tv(t, e) {
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
  function tm(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tv(Object(r), !0).forEach(function (e) {
            tw(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tv(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tb(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, tj(n.key), n));
    }
  }
  function tg() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tg = function () {
      return !!t;
    })();
  }
  function tx(t) {
    return (tx = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tO(t, e) {
    return (tO = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tw(t, e, r) {
    return (
      (e = tj(e)) in t
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
  function tj(t) {
    var e = (function (t, e) {
      if ("object" != th(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != th(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == th(e) ? e : e + "";
  }
  function tS(t) {
    return t.value;
  }
  var tP = (function (t) {
    var r, n;
    function o() {
      var t, e, r;
      if (!(this instanceof o))
        throw TypeError("Cannot call a class as a function");
      for (var n = arguments.length, i = Array(n), a = 0; a < n; a++)
        i[a] = arguments[a];
      return (
        (e = o),
        (r = [].concat(i)),
        (e = tx(e)),
        tw(
          (t = (function (t, e) {
            if (e && ("object" === th(e) || "function" == typeof e)) return e;
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
            tg()
              ? Reflect.construct(e, r || [], tx(this).constructor)
              : e.apply(this, r),
          )),
          "lastBoundingBox",
          { width: -1, height: -1 },
        ),
        t
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (o.prototype = Object.create(t && t.prototype, {
        constructor: { value: o, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(o, "prototype", { writable: !1 }),
      t && tO(o, t),
      (r = [
        {
          key: "componentDidMount",
          value: function () {
            this.updateBBox();
          },
        },
        {
          key: "componentDidUpdate",
          value: function () {
            this.updateBBox();
          },
        },
        {
          key: "getBBox",
          value: function () {
            if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
              var t = this.wrapperNode.getBoundingClientRect();
              return (
                (t.height = this.wrapperNode.offsetHeight),
                (t.width = this.wrapperNode.offsetWidth),
                t
              );
            }
            return null;
          },
        },
        {
          key: "updateBBox",
          value: function () {
            var t = this.props.onBBoxUpdate,
              e = this.getBBox();
            e
              ? (Math.abs(e.width - this.lastBoundingBox.width) > 1 ||
                  Math.abs(e.height - this.lastBoundingBox.height) > 1) &&
                ((this.lastBoundingBox.width = e.width),
                (this.lastBoundingBox.height = e.height),
                t && t(e))
              : (-1 !== this.lastBoundingBox.width ||
                  -1 !== this.lastBoundingBox.height) &&
                ((this.lastBoundingBox.width = -1),
                (this.lastBoundingBox.height = -1),
                t && t(null));
          },
        },
        {
          key: "getBBoxSnapshot",
          value: function () {
            return this.lastBoundingBox.width >= 0 &&
              this.lastBoundingBox.height >= 0
              ? tm({}, this.lastBoundingBox)
              : { width: 0, height: 0 };
          },
        },
        {
          key: "getDefaultPosition",
          value: function (t) {
            var e,
              r,
              n = this.props,
              o = n.layout,
              i = n.align,
              a = n.verticalAlign,
              u = n.margin,
              c = n.chartWidth,
              l = n.chartHeight;
            return (
              (t &&
                ((void 0 !== t.left && null !== t.left) ||
                  (void 0 !== t.right && null !== t.right))) ||
                (e =
                  "center" === i && "vertical" === o
                    ? { left: ((c || 0) - this.getBBoxSnapshot().width) / 2 }
                    : "right" === i
                      ? { right: (u && u.right) || 0 }
                      : { left: (u && u.left) || 0 }),
              (t &&
                ((void 0 !== t.top && null !== t.top) ||
                  (void 0 !== t.bottom && null !== t.bottom))) ||
                (r =
                  "middle" === a
                    ? { top: ((l || 0) - this.getBBoxSnapshot().height) / 2 }
                    : "bottom" === a
                      ? { bottom: (u && u.bottom) || 0 }
                      : { top: (u && u.top) || 0 }),
              tm(tm({}, e), r)
            );
          },
        },
        {
          key: "render",
          value: function () {
            var t = this,
              r = this.props,
              n = r.content,
              o = r.width,
              i = r.height,
              a = r.wrapperStyle,
              u = r.payloadUniqBy,
              c = r.payload,
              l = tm(
                tm(
                  {
                    position: "absolute",
                    width: o || "auto",
                    height: i || "auto",
                  },
                  this.getDefaultPosition(a),
                ),
                a,
              );
            return e.default.createElement(
              "div",
              {
                className: "recharts-legend-wrapper",
                style: l,
                ref: function (e) {
                  t.wrapperNode = e;
                },
              },
              (function (t, r) {
                if (e.default.isValidElement(t))
                  return e.default.cloneElement(t, r);
                if ("function" == typeof t)
                  return e.default.createElement(t, r);
                r.ref;
                var n = (function (t, e) {
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
                })(r, ty);
                return e.default.createElement(tf, n);
              })(n, tm(tm({}, this.props), {}, { payload: td(c, u, tS) })),
            );
          },
        },
      ]),
      (n = [
        {
          key: "getWithHeight",
          value: function (t, e) {
            var r = tm(tm({}, this.defaultProps), t.props).layout;
            return "vertical" === r && (0, l.H)(t.props.height)
              ? { height: t.props.height }
              : "horizontal" === r
                ? { width: t.props.width || e }
                : null;
          },
        },
      ]),
      r && tb(o.prototype, r),
      n && tb(o, n),
      Object.defineProperty(o, "prototype", { writable: !1 }),
      o
    );
  })(e.PureComponent);
  function tA(t) {
    return (tA =
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
  function tE(t, e) {
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
  function tM(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tE(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != tA(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != tA(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == tA(e) ? e : e + "";
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
          : tE(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  (tw(tP, "displayName", "Legend"),
    tw(tP, "defaultProps", {
      iconSize: 14,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    }),
    t.s(["f", 0, tP], 65742));
  var tk = function (t) {
    var e,
      r = t.children,
      n = t.formattedGraphicalItems,
      o = t.legendWidth,
      i = t.legendContent,
      a = (0, c.m)(r, tP);
    if (!a) return null;
    var u = tP.defaultProps,
      l = void 0 !== u ? tM(tM({}, u), a.props) : {};
    return (
      (e =
        a.props && a.props.payload
          ? a.props && a.props.payload
          : "children" === i
            ? (n || []).reduce(function (t, e) {
                var r = e.item,
                  n = e.props,
                  o = n.sectors || n.data || [];
                return t.concat(
                  o.map(function (t) {
                    return {
                      type: a.props.iconType || r.props.legendType,
                      value: t.name,
                      color: t.fill,
                      payload: t,
                    };
                  }),
                );
              }, [])
            : (n || []).map(function (t) {
                var e = t.item,
                  r = e.type.defaultProps,
                  n = void 0 !== r ? tM(tM({}, r), e.props) : {},
                  o = n.dataKey,
                  i = n.name,
                  a = n.legendType;
                return {
                  inactive: n.hide,
                  dataKey: o,
                  type: l.iconType || a || "square",
                  color: tU(e),
                  value: i || o,
                  payload: n,
                };
              })),
      tM(tM(tM({}, l), tP.getWithHeight(a, o)), {}, { payload: e, item: a })
    );
  };
  function tT(t) {
    return (tT =
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
  function t_(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return tC(t);
      })(t) ||
      (function (t) {
        if (
          ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
          null != t["@@iterator"]
        )
          return Array.from(t);
      })(t) ||
      (function (t) {
        if (t) {
          if ("string" == typeof t) return tC(t, void 0);
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
            return tC(t, void 0);
        }
      })(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function tC(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function tI(t, e) {
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
  function tD(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tI(Object(r), !0).forEach(function (e) {
            tN(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tI(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tN(t, e, r) {
    var n;
    return (
      ((n = (function (t, e) {
        if ("object" != tT(t) || !t) return t;
        var r = t[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(t, e || "default");
          if ("object" != tT(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(e, "string")),
      (e = "symbol" == tT(n) ? n : n + "") in t)
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
  function tB(t, e, n) {
    return (0, r.default)(t) || (0, r.default)(e)
      ? n
      : (0, l.m)(e)
        ? (0, x.default)(t, e, n)
        : (0, o.default)(e)
          ? e(t)
          : n;
  }
  function tR(t, e, n, o) {
    var i = (0, O.default)(t, function (t) {
      return tB(t, e);
    });
    if ("number" === n) {
      var a = i.filter(function (t) {
        return (0, l.H)(t) || parseFloat(t);
      });
      return a.length
        ? [(0, b.default)(a), (0, m.default)(a)]
        : [1 / 0, -1 / 0];
    }
    return (
      o
        ? i.filter(function (t) {
            return !(0, r.default)(t);
          })
        : i
    ).map(function (t) {
      return (0, l.m)(t) || t instanceof Date ? t : "";
    });
  }
  var tL = function (t) {
      var e,
        r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
        n = arguments.length > 2 ? arguments[2] : void 0,
        o = arguments.length > 3 ? arguments[3] : void 0,
        i = -1,
        a = null != (e = null == r ? void 0 : r.length) ? e : 0;
      if (a <= 1) return 0;
      if (
        o &&
        "angleAxis" === o.axisType &&
        1e-6 >= Math.abs(Math.abs(o.range[1] - o.range[0]) - 360)
      )
        for (var u = o.range, c = 0; c < a; c++) {
          var s = c > 0 ? n[c - 1].coordinate : n[a - 1].coordinate,
            f = n[c].coordinate,
            p = c >= a - 1 ? n[0].coordinate : n[c + 1].coordinate,
            d = void 0;
          if ((0, l.n)(f - s) !== (0, l.n)(p - f)) {
            var h = [];
            if ((0, l.n)(p - f) === (0, l.n)(u[1] - u[0])) {
              d = p;
              var y = f + u[1] - u[0];
              ((h[0] = Math.min(y, (y + s) / 2)),
                (h[1] = Math.max(y, (y + s) / 2)));
            } else {
              d = s;
              var v = p + u[1] - u[0];
              ((h[0] = Math.min(f, (v + f) / 2)),
                (h[1] = Math.max(f, (v + f) / 2)));
            }
            var m = [Math.min(f, (d + f) / 2), Math.max(f, (d + f) / 2)];
            if ((t > m[0] && t <= m[1]) || (t >= h[0] && t <= h[1])) {
              i = n[c].index;
              break;
            }
          } else {
            var b = Math.min(s, p),
              g = Math.max(s, p);
            if (t > (b + f) / 2 && t <= (g + f) / 2) {
              i = n[c].index;
              break;
            }
          }
        }
      else
        for (var x = 0; x < a; x++)
          if (
            (0 === x && t <= (r[x].coordinate + r[x + 1].coordinate) / 2) ||
            (x > 0 &&
              x < a - 1 &&
              t > (r[x].coordinate + r[x - 1].coordinate) / 2 &&
              t <= (r[x].coordinate + r[x + 1].coordinate) / 2) ||
            (x === a - 1 && t > (r[x].coordinate + r[x - 1].coordinate) / 2)
          ) {
            i = r[x].index;
            break;
          }
      return i;
    },
    tU = function (t) {
      var e,
        r,
        n = t.type.displayName,
        o =
          null != (e = t.type) && e.defaultProps
            ? tD(tD({}, t.type.defaultProps), t.props)
            : t.props,
        i = o.stroke,
        a = o.fill;
      switch (n) {
        case "Line":
          r = i;
          break;
        case "Area":
        case "Radar":
          r = i && "none" !== i ? i : a;
          break;
        default:
          r = a;
      }
      return r;
    },
    tz = function (t) {
      var e = t.barSize,
        n = t.totalSize,
        o = t.stackGroups,
        i = void 0 === o ? {} : o;
      if (!i) return {};
      for (var a = {}, u = Object.keys(i), s = 0, f = u.length; s < f; s++)
        for (
          var p = i[u[s]].stackGroups, d = Object.keys(p), h = 0, y = d.length;
          h < y;
          h++
        ) {
          var v = p[d[h]],
            m = v.items,
            b = v.cateAxisId,
            g = m.filter(function (t) {
              return (0, c.d)(t.type).indexOf("Bar") >= 0;
            });
          if (g && g.length) {
            var x = g[0].type.defaultProps,
              O = void 0 !== x ? tD(tD({}, x), g[0].props) : g[0].props,
              w = O.barSize,
              j = O[b];
            a[j] || (a[j] = []);
            var S = (0, r.default)(w) ? e : w;
            a[j].push({
              item: g[0],
              stackList: g.slice(1),
              barSize: (0, r.default)(S) ? void 0 : (0, l.M)(S, n, 0),
            });
          }
        }
      return a;
    },
    t$ = function (t) {
      var e,
        r = t.barGap,
        n = t.barCategoryGap,
        o = t.bandSize,
        i = t.sizeList,
        a = void 0 === i ? [] : i,
        u = t.maxBarSize,
        c = a.length;
      if (c < 1) return null;
      var s = (0, l.M)(r, o, 0, !0),
        f = [];
      if (a[0].barSize === +a[0].barSize) {
        var p = !1,
          d = o / c,
          h = a.reduce(function (t, e) {
            return t + e.barSize || 0;
          }, 0);
        ((h += (c - 1) * s) >= o && ((h -= (c - 1) * s), (s = 0)),
          h >= o && d > 0 && ((p = !0), (d *= 0.9), (h = c * d)));
        var y = { offset: (((o - h) / 2) | 0) - s, size: 0 };
        e = a.reduce(function (t, e) {
          var r = {
              item: e.item,
              position: {
                offset: y.offset + y.size + s,
                size: p ? d : e.barSize,
              },
            },
            n = [].concat(t_(t), [r]);
          return (
            (y = n[n.length - 1].position),
            e.stackList &&
              e.stackList.length &&
              e.stackList.forEach(function (t) {
                n.push({ item: t, position: y });
              }),
            n
          );
        }, f);
      } else {
        var v = (0, l.M)(n, o, 0, !0);
        o - 2 * v - (c - 1) * s <= 0 && (s = 0);
        var m = (o - 2 * v - (c - 1) * s) / c;
        m > 1 && (m >>= 0);
        var b = u === +u ? Math.min(m, u) : m;
        e = a.reduce(function (t, e, r) {
          var n = [].concat(t_(t), [
            {
              item: e.item,
              position: { offset: v + (m + s) * r + (m - b) / 2, size: b },
            },
          ]);
          return (
            e.stackList &&
              e.stackList.length &&
              e.stackList.forEach(function (t) {
                n.push({ item: t, position: n[n.length - 1].position });
              }),
            n
          );
        }, f);
      }
      return e;
    },
    tH = function (t, e, r, n) {
      var o = r.children,
        i = r.width,
        a = r.margin,
        u = tk({
          children: o,
          legendWidth: i - (a.left || 0) - (a.right || 0),
        });
      if (u) {
        var c = n || {},
          s = c.width,
          f = c.height,
          p = u.align,
          d = u.verticalAlign,
          h = u.layout;
        if (
          ("vertical" === h || ("horizontal" === h && "middle" === d)) &&
          "center" !== p &&
          (0, l.H)(t[p])
        )
          return tD(tD({}, t), {}, tN({}, p, t[p] + (s || 0)));
        if (
          ("horizontal" === h || ("vertical" === h && "center" === p)) &&
          "middle" !== d &&
          (0, l.H)(t[d])
        )
          return tD(tD({}, t), {}, tN({}, d, t[d] + (f || 0)));
      }
      return t;
    },
    tF = function (t, e, n, o, i) {
      var a = e.props.children,
        u = (0, c.M)(a, E.f).filter(function (t) {
          var e;
          return (
            (e = t.props.direction),
            !!(0, r.default)(i) ||
              ("horizontal" === o
                ? "yAxis" === i
                : "vertical" === o || "x" === e
                  ? "xAxis" === i
                  : "y" !== e || "yAxis" === i)
          );
        });
      if (u && u.length) {
        var l = u.map(function (t) {
          return t.props.dataKey;
        });
        return t.reduce(
          function (t, e) {
            var o = tB(e, n);
            if ((0, r.default)(o)) return t;
            var i = Array.isArray(o)
                ? [(0, b.default)(o), (0, m.default)(o)]
                : [o, o],
              a = l.reduce(
                function (t, r) {
                  var n = tB(e, r, 0),
                    o = i[0] - Math.abs(Array.isArray(n) ? n[0] : n),
                    a = i[1] + Math.abs(Array.isArray(n) ? n[1] : n);
                  return [Math.min(o, t[0]), Math.max(a, t[1])];
                },
                [1 / 0, -1 / 0],
              );
            return [Math.min(a[0], t[0]), Math.max(a[1], t[1])];
          },
          [1 / 0, -1 / 0],
        );
      }
      return null;
    },
    tW = function (t, e, n, o, i) {
      var a = e
        .map(function (e) {
          return tF(t, e, n, i, o);
        })
        .filter(function (t) {
          return !(0, r.default)(t);
        });
      return a && a.length
        ? a.reduce(
            function (t, e) {
              return [Math.min(t[0], e[0]), Math.max(t[1], e[1])];
            },
            [1 / 0, -1 / 0],
          )
        : null;
    },
    tX = function (t, e, r, n, o) {
      var i = e.map(function (e) {
        var i = e.props.dataKey;
        return ("number" === r && i && tF(t, e, i, n)) || tR(t, i, r, o);
      });
      if ("number" === r)
        return i.reduce(
          function (t, e) {
            return [Math.min(t[0], e[0]), Math.max(t[1], e[1])];
          },
          [1 / 0, -1 / 0],
        );
      var a = {};
      return i.reduce(function (t, e) {
        for (var r = 0, n = e.length; r < n; r++)
          a[e[r]] || ((a[e[r]] = !0), t.push(e[r]));
        return t;
      }, []);
    },
    tq = function (t, e) {
      return (
        ("horizontal" === t && "xAxis" === e) ||
        ("vertical" === t && "yAxis" === e) ||
        ("centric" === t && "angleAxis" === e) ||
        ("radial" === t && "radiusAxis" === e)
      );
    },
    tV = function (t, e, r, n) {
      if (n)
        return t.map(function (t) {
          return t.coordinate;
        });
      var o,
        i,
        a = t.map(function (t) {
          return (
            t.coordinate === e && (o = !0),
            t.coordinate === r && (i = !0),
            t.coordinate
          );
        });
      return (o || a.push(e), i || a.push(r), a);
    },
    tG = function (t, e, r) {
      if (!t) return null;
      var n = t.scale,
        o = t.duplicateDomain,
        i = t.type,
        a = t.range,
        u = "scaleBand" === t.realScaleType ? n.bandwidth() / 2 : 2,
        c = (e || r) && "category" === i && n.bandwidth ? n.bandwidth() / u : 0;
      return ((c =
        "angleAxis" === t.axisType && (null == a ? void 0 : a.length) >= 2
          ? 2 * (0, l.n)(a[0] - a[1]) * c
          : c),
      e && (t.ticks || t.niceTicks))
        ? (t.ticks || t.niceTicks)
            .map(function (t) {
              return {
                coordinate: n(o ? o.indexOf(t) : t) + c,
                value: t,
                offset: c,
              };
            })
            .filter(function (t) {
              return !(0, w.default)(t.coordinate);
            })
        : t.isCategorical && t.categoricalDomain
          ? t.categoricalDomain.map(function (t, e) {
              return { coordinate: n(t) + c, value: t, index: e, offset: c };
            })
          : n.ticks && !r
            ? n.ticks(t.tickCount).map(function (t) {
                return { coordinate: n(t) + c, value: t, offset: c };
              })
            : n.domain().map(function (t, e) {
                return {
                  coordinate: n(t) + c,
                  value: o ? o[t] : t,
                  index: e,
                  offset: c,
                };
              });
    },
    tY = new WeakMap(),
    tK = function (t, e) {
      if ("function" != typeof e) return t;
      tY.has(t) || tY.set(t, new WeakMap());
      var r = tY.get(t);
      if (r.has(e)) return r.get(e);
      var n = function () {
        (t.apply(void 0, arguments), e.apply(void 0, arguments));
      };
      return (r.set(e, n), n);
    },
    tZ = function (t, e, r) {
      var n = t.scale,
        i = t.type,
        a = t.layout,
        u = t.axisType;
      if ("auto" === n)
        return "radial" === a && "radiusAxis" === u
          ? { scale: s.scaleBand(), realScaleType: "band" }
          : "radial" === a && "angleAxis" === u
            ? { scale: s.scaleLinear(), realScaleType: "linear" }
            : "category" === i &&
                e &&
                (e.indexOf("LineChart") >= 0 ||
                  e.indexOf("AreaChart") >= 0 ||
                  (e.indexOf("ComposedChart") >= 0 && !r))
              ? { scale: s.scalePoint(), realScaleType: "point" }
              : "category" === i
                ? { scale: s.scaleBand(), realScaleType: "band" }
                : { scale: s.scaleLinear(), realScaleType: "linear" };
      if ((0, g.default)(n)) {
        var c = "scale".concat((0, j.default)(n));
        return {
          scale: (s[c] || s.scalePoint)(),
          realScaleType: s[c] ? c : "point",
        };
      }
      return (0, o.default)(n)
        ? { scale: n }
        : { scale: s.scalePoint(), realScaleType: "point" };
    },
    tJ = function (t) {
      var e = t.domain();
      if (e && !(e.length <= 2)) {
        var r = e.length,
          n = t.range(),
          o = Math.min(n[0], n[1]) - 1e-4,
          i = Math.max(n[0], n[1]) + 1e-4,
          a = t(e[0]),
          u = t(e[r - 1]);
        (a < o || a > i || u < o || u > i) && t.domain([e[0], e[r - 1]]);
      }
    },
    tQ = function (t, e) {
      if (!t) return null;
      for (var r = 0, n = t.length; r < n; r++)
        if (t[r].item === e) return t[r].position;
      return null;
    },
    t0 = function (t, e) {
      if (!e || 2 !== e.length || !(0, l.H)(e[0]) || !(0, l.H)(e[1])) return t;
      var r = Math.min(e[0], e[1]),
        n = Math.max(e[0], e[1]),
        o = [t[0], t[1]];
      return (
        (!(0, l.H)(t[0]) || t[0] < r) && (o[0] = r),
        (!(0, l.H)(t[1]) || t[1] > n) && (o[1] = n),
        o[0] > n && (o[0] = n),
        o[1] < r && (o[1] = r),
        o
      );
    },
    t1 = {
      sign: function (t) {
        var e = t.length;
        if (!(e <= 0))
          for (var r = 0, n = t[0].length; r < n; ++r)
            for (var o = 0, i = 0, a = 0; a < e; ++a) {
              var u = (0, w.default)(t[a][r][1]) ? t[a][r][0] : t[a][r][1];
              u >= 0
                ? ((t[a][r][0] = o), (t[a][r][1] = o + u), (o = t[a][r][1]))
                : ((t[a][r][0] = i), (t[a][r][1] = i + u), (i = t[a][r][1]));
            }
      },
      expand: p.f,
      none: d.f,
      silhouette: h.f,
      wiggle: y.f,
      positive: function (t) {
        var e = t.length;
        if (!(e <= 0))
          for (var r = 0, n = t[0].length; r < n; ++r)
            for (var o = 0, i = 0; i < e; ++i) {
              var a = (0, w.default)(t[i][r][1]) ? t[i][r][0] : t[i][r][1];
              a >= 0
                ? ((t[i][r][0] = o), (t[i][r][1] = o + a), (o = t[i][r][1]))
                : ((t[i][r][0] = 0), (t[i][r][1] = 0));
            }
      },
    },
    t2 = function (t, e, r) {
      var n = e.map(function (t) {
          return t.props.dataKey;
        }),
        o = t1[r];
      return (0, f.f)()
        .keys(n)
        .value(function (t, e) {
          return +tB(t, e, 0);
        })
        .order(v.f)
        .offset(o)(t);
    },
    t3 = function (t, e, r, n, o, i) {
      if (!t) return null;
      var a = (i ? e.reverse() : e).reduce(function (t, e) {
        var o,
          i =
            null != (o = e.type) && o.defaultProps
              ? tD(tD({}, e.type.defaultProps), e.props)
              : e.props,
          a = i.stackId;
        if (i.hide) return t;
        var u = i[r],
          c = t[u] || { hasStack: !1, stackGroups: {} };
        if ((0, l.m)(a)) {
          var s = c.stackGroups[a] || {
            numericAxisId: r,
            cateAxisId: n,
            items: [],
          };
          (s.items.push(e), (c.hasStack = !0), (c.stackGroups[a] = s));
        } else
          c.stackGroups[(0, l.C)("_stackId_")] = {
            numericAxisId: r,
            cateAxisId: n,
            items: [e],
          };
        return tD(tD({}, t), {}, tN({}, u, c));
      }, {});
      return Object.keys(a).reduce(function (e, i) {
        var u = a[i];
        return (
          u.hasStack &&
            (u.stackGroups = Object.keys(u.stackGroups).reduce(function (e, i) {
              var a = u.stackGroups[i];
              return tD(
                tD({}, e),
                {},
                tN({}, i, {
                  numericAxisId: r,
                  cateAxisId: n,
                  items: a.items,
                  stackedData: t2(t, a.items, o),
                }),
              );
            }, {})),
          tD(tD({}, e), {}, tN({}, i, u))
        );
      }, {});
    },
    t4 = function (t, e) {
      var r = e.realScaleType,
        n = e.type,
        o = e.tickCount,
        i = e.originalDomain,
        a = e.allowDecimals,
        u = r || e.scale;
      if ("auto" !== u && "linear" !== u) return null;
      if (o && "number" === n && i && ("auto" === i[0] || "auto" === i[1])) {
        var c = t.domain();
        if (!c.length) return null;
        var l = (0, A.e)(c, o, a);
        return (
          t.domain([(0, b.default)(l), (0, m.default)(l)]),
          { niceTicks: l }
        );
      }
      if (o && "number" === n) {
        var s = t.domain();
        return { niceTicks: (0, A.V)(s, o, a) };
      }
      return null;
    };
  function t8(t) {
    var e = t.axis,
      n = t.ticks,
      o = t.bandSize,
      i = t.entry,
      a = t.index,
      u = t.dataKey;
    if ("category" === e.type) {
      if (
        !e.allowDuplicatedCategory &&
        e.dataKey &&
        !(0, r.default)(i[e.dataKey])
      ) {
        var c = (0, l.I)(n, "value", i[e.dataKey]);
        if (c) return c.coordinate + o / 2;
      }
      return n[a] ? n[a].coordinate + o / 2 : null;
    }
    var s = tB(i, (0, r.default)(u) ? e.dataKey : u);
    return (0, r.default)(s) ? null : e.scale(s);
  }
  var t6 = function (t) {
      var e = t.axis,
        n = t.ticks,
        o = t.offset,
        i = t.bandSize,
        a = t.entry,
        u = t.index;
      if ("category" === e.type) return n[u] ? n[u].coordinate + o : null;
      var c = tB(a, e.dataKey, e.domain[u]);
      return (0, r.default)(c) ? null : e.scale(c) - i / 2 + o;
    },
    t5 = function (t) {
      var e = t.numericAxis,
        r = e.scale.domain();
      if ("number" === e.type) {
        var n = Math.min(r[0], r[1]),
          o = Math.max(r[0], r[1]);
        return n <= 0 && o >= 0 ? 0 : o < 0 ? o : n;
      }
      return r[0];
    },
    t9 = function (t, e) {
      var r,
        n = (
          null != (r = t.type) && r.defaultProps
            ? tD(tD({}, t.type.defaultProps), t.props)
            : t.props
        ).stackId;
      if ((0, l.m)(n)) {
        var o = e[n];
        if (o) {
          var i = o.items.indexOf(t);
          return i >= 0 ? o.stackedData[i] : null;
        }
      }
      return null;
    },
    t7 = function (t, e, r) {
      return Object.keys(t)
        .reduce(
          function (n, o) {
            var i = t[o].stackedData.reduce(
              function (t, n) {
                var o = n.slice(e, r + 1).reduce(
                  function (t, e) {
                    return [
                      (0, b.default)(e.concat([t[0]]).filter(l.H)),
                      (0, m.default)(e.concat([t[1]]).filter(l.H)),
                    ];
                  },
                  [1 / 0, -1 / 0],
                );
                return [Math.min(t[0], o[0]), Math.max(t[1], o[1])];
              },
              [1 / 0, -1 / 0],
            );
            return [Math.min(i[0], n[0]), Math.max(i[1], n[1])];
          },
          [1 / 0, -1 / 0],
        )
        .map(function (t) {
          return 1 / 0 === t || -1 / 0 === t ? 0 : t;
        });
    },
    et = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
    ee = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
    er = function (t, e, r) {
      if ((0, o.default)(t)) return t(e, r);
      if (!Array.isArray(t)) return e;
      var n = [];
      if ((0, l.H)(t[0])) n[0] = r ? t[0] : Math.min(t[0], e[0]);
      else if (et.test(t[0])) {
        var i = +et.exec(t[0])[1];
        n[0] = e[0] - i;
      } else (0, o.default)(t[0]) ? (n[0] = t[0](e[0])) : (n[0] = e[0]);
      if ((0, l.H)(t[1])) n[1] = r ? t[1] : Math.max(t[1], e[1]);
      else if (ee.test(t[1])) {
        var a = +ee.exec(t[1])[1];
        n[1] = e[1] + a;
      } else (0, o.default)(t[1]) ? (n[1] = t[1](e[1])) : (n[1] = e[1]);
      return n;
    },
    en = function (t, e, r) {
      if (t && t.scale && t.scale.bandwidth) {
        var n = t.scale.bandwidth();
        if (!r || n > 0) return n;
      }
      if (t && e && e.length >= 2) {
        for (
          var o = (0, P.default)(e, function (t) {
              return t.coordinate;
            }),
            i = 1 / 0,
            a = 1,
            u = o.length;
          a < u;
          a++
        ) {
          var c = o[a],
            l = o[a - 1];
          i = Math.min((c.coordinate || 0) - (l.coordinate || 0), i);
        }
        return 1 / 0 === i ? 0 : i;
      }
      return r ? void 0 : 0;
    },
    eo = function (t, e, r) {
      return !t ||
        !t.length ||
        (0, S.default)(t, (0, x.default)(r, "type.defaultProps.domain"))
        ? e
        : t;
    },
    ei = function (t, e) {
      var r = t.type.defaultProps
          ? tD(tD({}, t.type.defaultProps), t.props)
          : t.props,
        n = r.dataKey,
        o = r.name,
        i = r.unit,
        a = r.formatter,
        u = r.tooltipType,
        l = r.chartType,
        s = r.hide;
      return tD(
        tD({}, (0, c.T)(t, !1)),
        {},
        {
          dataKey: n,
          unit: i,
          formatter: a,
          name: o || n,
          color: tU(t),
          value: tB(e, n),
          type: u,
          payload: e,
          chartType: l,
          hide: s,
        },
      );
    };
  function ea(t) {
    return (ea =
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
  function eu(t, e) {
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
  function ec(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? eu(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != ea(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != ea(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == ea(e) ? e : e + "";
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
          : eu(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var el = Math.PI / 180,
    es = function (t, e, r, n) {
      return { x: t + Math.cos(-el * n) * r, y: e + Math.sin(-el * n) * r };
    },
    ef = function (t, e) {
      var r = t.x,
        n = t.y;
      return Math.sqrt(Math.pow(r - e.x, 2) + Math.pow(n - e.y, 2));
    },
    ep = function (t, e) {
      var r = t.x,
        n = t.y,
        o = e.cx,
        i = e.cy,
        a = ef({ x: r, y: n }, { x: o, y: i });
      if (a <= 0) return { radius: a };
      var u = Math.acos((r - o) / a);
      return (
        n > i && (u = 2 * Math.PI - u),
        { radius: a, angle: (180 * u) / Math.PI, angleInRadian: u }
      );
    },
    ed = function (t) {
      var e = t.startAngle,
        r = t.endAngle,
        n = Math.min(Math.floor(e / 360), Math.floor(r / 360));
      return { startAngle: e - 360 * n, endAngle: r - 360 * n };
    };
  function eh(t) {
    return (eh =
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
  t.s(
    [
      "T",
      0,
      el,
      "$",
      0,
      function (t, e) {
        var r,
          n = ep({ x: t.x, y: t.y }, e),
          o = n.radius,
          i = n.angle,
          a = e.innerRadius,
          u = e.outerRadius;
        if (o < a || o > u) return !1;
        if (0 === o) return !0;
        var c = ed(e),
          l = c.startAngle,
          s = c.endAngle,
          f = i;
        if (l <= s) {
          for (; f > s; ) f -= 360;
          for (; f < l; ) f += 360;
          r = f >= l && f <= s;
        } else {
          for (; f > l; ) f -= 360;
          for (; f < s; ) f += 360;
          r = f >= s && f <= l;
        }
        return r
          ? ec(
              ec({}, e),
              {},
              {
                radius: o,
                angle:
                  f +
                  360 *
                    Math.min(
                      Math.floor(e.startAngle / 360),
                      Math.floor(e.endAngle / 360),
                    ),
              },
            )
          : null;
      },
      "v",
      0,
      es,
    ],
    460242,
  );
  var ey = ["offset"];
  function ev(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function em(t, e) {
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
  function eb(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? em(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != eh(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != eh(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == eh(e) ? e : e + "";
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
          : em(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function eg() {
    return (eg = Object.assign.bind()).apply(this, arguments);
  }
  var ex = function (t) {
      var e = t.value,
        n = t.formatter,
        i = (0, r.default)(t.children) ? e : t.children;
      return (0, o.default)(n) ? n(i) : i;
    },
    eO = function (t, n, o) {
      var i,
        u,
        c = t.position,
        s = t.viewBox,
        f = t.offset,
        p = t.className,
        d = s.cx,
        h = s.cy,
        y = s.innerRadius,
        v = s.outerRadius,
        m = s.startAngle,
        b = s.endAngle,
        g = s.clockWise,
        x = (y + v) / 2,
        O = (0, l.n)(b - m) * Math.min(Math.abs(b - m), 360),
        w = O >= 0 ? 1 : -1;
      ("insideStart" === c
        ? ((i = m + w * f), (u = g))
        : "insideEnd" === c
          ? ((i = b - w * f), (u = !g))
          : "end" === c && ((i = b + w * f), (u = g)),
        (u = O <= 0 ? u : !u));
      var j = es(d, h, x, i),
        S = es(d, h, x, i + (u ? 1 : -1) * 359),
        P = "M"
          .concat(j.x, ",")
          .concat(j.y, "\n    A")
          .concat(x, ",")
          .concat(x, ",0,1,")
          .concat(+!u, ",\n    ")
          .concat(S.x, ",")
          .concat(S.y),
        A = (0, r.default)(t.id) ? (0, l.C)("recharts-radial-line-") : t.id;
      return e.default.createElement(
        "text",
        eg({}, o, {
          dominantBaseline: "central",
          className: (0, a.U)("recharts-radial-bar-label", p),
        }),
        e.default.createElement(
          "defs",
          null,
          e.default.createElement("path", { id: A, d: P }),
        ),
        e.default.createElement("textPath", { xlinkHref: "#".concat(A) }, n),
      );
    },
    ew = function (t) {
      var e = t.viewBox,
        r = t.offset,
        n = t.position,
        o = e.cx,
        i = e.cy,
        a = e.innerRadius,
        u = e.outerRadius,
        c = (e.startAngle + e.endAngle) / 2;
      if ("outside" === n) {
        var l = es(o, i, u + r, c),
          s = l.x;
        return {
          x: s,
          y: l.y,
          textAnchor: s >= o ? "start" : "end",
          verticalAnchor: "middle",
        };
      }
      if ("center" === n)
        return { x: o, y: i, textAnchor: "middle", verticalAnchor: "middle" };
      if ("centerTop" === n)
        return { x: o, y: i, textAnchor: "middle", verticalAnchor: "start" };
      if ("centerBottom" === n)
        return { x: o, y: i, textAnchor: "middle", verticalAnchor: "end" };
      var f = es(o, i, (a + u) / 2, c);
      return { x: f.x, y: f.y, textAnchor: "middle", verticalAnchor: "middle" };
    },
    ej = function (t) {
      var e = t.viewBox,
        r = t.parentViewBox,
        o = t.offset,
        i = t.position,
        a = e.x,
        u = e.y,
        c = e.width,
        s = e.height,
        f = s >= 0 ? 1 : -1,
        p = f * o,
        d = f > 0 ? "end" : "start",
        h = f > 0 ? "start" : "end",
        y = c >= 0 ? 1 : -1,
        v = y * o,
        m = y > 0 ? "end" : "start",
        b = y > 0 ? "start" : "end";
      if ("top" === i)
        return eb(
          eb(
            {},
            {
              x: a + c / 2,
              y: u - f * o,
              textAnchor: "middle",
              verticalAnchor: d,
            },
          ),
          r ? { height: Math.max(u - r.y, 0), width: c } : {},
        );
      if ("bottom" === i)
        return eb(
          eb(
            {},
            {
              x: a + c / 2,
              y: u + s + p,
              textAnchor: "middle",
              verticalAnchor: h,
            },
          ),
          r ? { height: Math.max(r.y + r.height - (u + s), 0), width: c } : {},
        );
      if ("left" === i) {
        var g = {
          x: a - v,
          y: u + s / 2,
          textAnchor: m,
          verticalAnchor: "middle",
        };
        return eb(
          eb({}, g),
          r ? { width: Math.max(g.x - r.x, 0), height: s } : {},
        );
      }
      if ("right" === i) {
        var x = {
          x: a + c + v,
          y: u + s / 2,
          textAnchor: b,
          verticalAnchor: "middle",
        };
        return eb(
          eb({}, x),
          r ? { width: Math.max(r.x + r.width - x.x, 0), height: s } : {},
        );
      }
      var O = r ? { width: c, height: s } : {};
      return "insideLeft" === i
        ? eb(
            { x: a + v, y: u + s / 2, textAnchor: b, verticalAnchor: "middle" },
            O,
          )
        : "insideRight" === i
          ? eb(
              {
                x: a + c - v,
                y: u + s / 2,
                textAnchor: m,
                verticalAnchor: "middle",
              },
              O,
            )
          : "insideTop" === i
            ? eb(
                {
                  x: a + c / 2,
                  y: u + p,
                  textAnchor: "middle",
                  verticalAnchor: h,
                },
                O,
              )
            : "insideBottom" === i
              ? eb(
                  {
                    x: a + c / 2,
                    y: u + s - p,
                    textAnchor: "middle",
                    verticalAnchor: d,
                  },
                  O,
                )
              : "insideTopLeft" === i
                ? eb(
                    { x: a + v, y: u + p, textAnchor: b, verticalAnchor: h },
                    O,
                  )
                : "insideTopRight" === i
                  ? eb(
                      {
                        x: a + c - v,
                        y: u + p,
                        textAnchor: m,
                        verticalAnchor: h,
                      },
                      O,
                    )
                  : "insideBottomLeft" === i
                    ? eb(
                        {
                          x: a + v,
                          y: u + s - p,
                          textAnchor: b,
                          verticalAnchor: d,
                        },
                        O,
                      )
                    : "insideBottomRight" === i
                      ? eb(
                          {
                            x: a + c - v,
                            y: u + s - p,
                            textAnchor: m,
                            verticalAnchor: d,
                          },
                          O,
                        )
                      : (0, n.default)(i) &&
                          ((0, l.H)(i.x) || (0, l.e)(i.x)) &&
                          ((0, l.H)(i.y) || (0, l.e)(i.y))
                        ? eb(
                            {
                              x: a + (0, l.M)(i.x, c),
                              y: u + (0, l.M)(i.y, s),
                              textAnchor: "end",
                              verticalAnchor: "end",
                            },
                            O,
                          )
                        : eb(
                            {
                              x: a + c / 2,
                              y: u + s / 2,
                              textAnchor: "middle",
                              verticalAnchor: "middle",
                            },
                            O,
                          );
    };
  function eS(t) {
    var n,
      i = t.offset,
      s = eb(
        { offset: void 0 === i ? 5 : i },
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
        })(t, ey),
      ),
      f = s.viewBox,
      p = s.position,
      d = s.value,
      h = s.children,
      y = s.content,
      v = s.className,
      m = s.textBreakAll;
    if (
      !f ||
      ((0, r.default)(d) &&
        (0, r.default)(h) &&
        !(0, e.isValidElement)(y) &&
        !(0, o.default)(y))
    )
      return null;
    if ((0, e.isValidElement)(y)) return (0, e.cloneElement)(y, s);
    if ((0, o.default)(y)) {
      if (((n = (0, e.createElement)(y, s)), (0, e.isValidElement)(n)))
        return n;
    } else n = ex(s);
    var b = "cx" in f && (0, l.H)(f.cx),
      g = (0, c.T)(s, !0);
    if (b && ("insideStart" === p || "insideEnd" === p || "end" === p))
      return eO(s, n, g);
    var x = b ? ew(s) : ej(s);
    return e.default.createElement(
      u.f,
      eg(
        { className: (0, a.U)("recharts-label", void 0 === v ? "" : v) },
        g,
        x,
        { breakAll: m },
      ),
      n,
    );
  }
  eS.displayName = "Label";
  var eP = function (t) {
    var e = t.cx,
      r = t.cy,
      n = t.angle,
      o = t.startAngle,
      i = t.endAngle,
      a = t.r,
      u = t.radius,
      c = t.innerRadius,
      s = t.outerRadius,
      f = t.x,
      p = t.y,
      d = t.top,
      h = t.left,
      y = t.width,
      v = t.height,
      m = t.clockWise,
      b = t.labelViewBox;
    if (b) return b;
    if ((0, l.H)(y) && (0, l.H)(v)) {
      if ((0, l.H)(f) && (0, l.H)(p))
        return { x: f, y: p, width: y, height: v };
      if ((0, l.H)(d) && (0, l.H)(h))
        return { x: d, y: h, width: y, height: v };
    }
    return (0, l.H)(f) && (0, l.H)(p)
      ? { x: f, y: p, width: 0, height: 0 }
      : (0, l.H)(e) && (0, l.H)(r)
        ? {
            cx: e,
            cy: r,
            startAngle: o || n || 0,
            endAngle: i || n || 0,
            innerRadius: c || 0,
            outerRadius: s || u || a || 0,
            clockWise: m,
          }
        : t.viewBox
          ? t.viewBox
          : {};
  };
  ((eS.parseViewBox = eP),
    (eS.renderCallByParent = function (t, r) {
      var i,
        a,
        u = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
      if (!t || (!t.children && u && !t.label)) return null;
      var s = t.children,
        f = eP(t),
        p = (0, c.M)(s, eS).map(function (t, n) {
          return (0, e.cloneElement)(t, {
            viewBox: r || f,
            key: "label-".concat(n),
          });
        });
      if (!u) return p;
      return [
        ((i = t.label),
        (a = r || f),
        !i
          ? null
          : !0 === i
            ? e.default.createElement(eS, { key: "label-implicit", viewBox: a })
            : (0, l.m)(i)
              ? e.default.createElement(eS, {
                  key: "label-implicit",
                  viewBox: a,
                  value: i,
                })
              : (0, e.isValidElement)(i)
                ? i.type === eS
                  ? (0, e.cloneElement)(i, {
                      key: "label-implicit",
                      viewBox: a,
                    })
                  : e.default.createElement(eS, {
                      key: "label-implicit",
                      content: i,
                      viewBox: a,
                    })
                : (0, o.default)(i)
                  ? e.default.createElement(eS, {
                      key: "label-implicit",
                      content: i,
                      viewBox: a,
                    })
                  : (0, n.default)(i)
                    ? e.default.createElement(
                        eS,
                        eg({ viewBox: a }, i, { key: "label-implicit" }),
                      )
                    : null),
      ].concat(
        (function (t) {
          if (Array.isArray(t)) return ev(t);
        })(p) ||
          (function (t) {
            if (
              ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
              null != t["@@iterator"]
            )
              return Array.from(t);
          })(p) ||
          (function (t) {
            if (t) {
              if ("string" == typeof t) return ev(t, void 0);
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
                return ev(t, void 0);
            }
          })(p) ||
          (function () {
            throw TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
      );
    }),
    t.s(["f", 0, eS], 998189));
  var eA = t.i(748213);
  function eE(t) {
    return (eE =
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
  var eM = ["valueAccessor"],
    ek = ["data", "dataKey", "clockWise", "id", "textBreakAll"];
  function eT(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function e_() {
    return (e_ = Object.assign.bind()).apply(this, arguments);
  }
  function eC(t, e) {
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
  function eI(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? eC(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != eE(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != eE(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == eE(e) ? e : e + "";
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
          : eC(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function eD(t, e) {
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
  var eN = function (t) {
    return Array.isArray(t.value) ? (0, i.default)(t.value) : t.value;
  };
  function eB(t) {
    var n = t.valueAccessor,
      o = void 0 === n ? eN : n,
      i = eD(t, eM),
      a = i.data,
      u = i.dataKey,
      l = i.clockWise,
      s = i.id,
      f = i.textBreakAll,
      p = eD(i, ek);
    return a && a.length
      ? e.default.createElement(
          eA.f,
          { className: "recharts-label-list" },
          a.map(function (t, n) {
            var i = (0, r.default)(u) ? o(t, n) : tB(t && t.payload, u),
              a = (0, r.default)(s) ? {} : { id: "".concat(s, "-").concat(n) };
            return e.default.createElement(
              eS,
              e_({}, (0, c.T)(t, !0), p, a, {
                parentViewBox: t.parentViewBox,
                value: i,
                textBreakAll: f,
                viewBox: eS.parseViewBox(
                  (0, r.default)(l) ? t : eI(eI({}, t), {}, { clockWise: l }),
                ),
                key: "label-".concat(n),
                index: n,
              }),
            );
          }),
        )
      : null;
  }
  ((eB.displayName = "LabelList"),
    (eB.renderCallByParent = function (t, r) {
      var i,
        a = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
      if (!t || (!t.children && a && !t.label)) return null;
      var u = t.children,
        l = (0, c.M)(u, eB).map(function (t, n) {
          return (0, e.cloneElement)(t, {
            data: r,
            key: "labelList-".concat(n),
          });
        });
      return a
        ? [
            ((i = t.label),
            !i
              ? null
              : !0 === i
                ? e.default.createElement(eB, {
                    key: "labelList-implicit",
                    data: r,
                  })
                : e.default.isValidElement(i) || (0, o.default)(i)
                  ? e.default.createElement(eB, {
                      key: "labelList-implicit",
                      data: r,
                      content: i,
                    })
                  : (0, n.default)(i)
                    ? e.default.createElement(
                        eB,
                        e_({ data: r }, i, { key: "labelList-implicit" }),
                      )
                    : null),
          ].concat(
            (function (t) {
              if (Array.isArray(t)) return eT(t);
            })(l) ||
              (function (t) {
                if (
                  ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
                  null != t["@@iterator"]
                )
                  return Array.from(t);
              })(l) ||
              (function (t) {
                if (t) {
                  if ("string" == typeof t) return eT(t, void 0);
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
                    return eT(t, void 0);
                }
              })(l) ||
              (function () {
                throw TypeError(
                  "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })(),
          )
        : l;
    }),
    t.s(["f", 0, eB], 467255));
};
