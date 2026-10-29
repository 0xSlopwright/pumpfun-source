// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    r,
    n = t.i(352386),
    o = t.i(462931),
    i = t.i(7284),
    a = t.i(748213),
    u = t.i(509406),
    c = t.i(998189),
    l = t.i(756438),
    s = t.i(974406),
    f = t.i(26223),
    p = t.i(769189),
    d = t.i(223025),
    h = t.i(871791),
    y = t.i(356110);
  function v(t) {
    return (v =
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
  function m(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, O(n.key), n));
    }
  }
  function b(t, e) {
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
  function g(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? b(Object(r), !0).forEach(function (e) {
            x(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : b(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function x(t, e, r) {
    return (
      (e = O(e)) in t
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
  function O(t) {
    var e = (function (t, e) {
      if ("object" != v(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != v(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == v(e) ? e : e + "";
  }
  var w = function (t, e) {
      var r = t.x,
        n = t.y,
        o = e.x,
        i = e.y;
      return {
        x: Math.min(r, o),
        y: Math.min(n, i),
        width: Math.abs(o - r),
        height: Math.abs(i - n),
      };
    },
    j = function (t) {
      return w({ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 });
    },
    S = (function () {
      var t, e;
      function r(t) {
        if (!(this instanceof r))
          throw TypeError("Cannot call a class as a function");
        this.scale = t;
      }
      return (
        (t = [
          {
            key: "domain",
            get: function () {
              return this.scale.domain;
            },
          },
          {
            key: "range",
            get: function () {
              return this.scale.range;
            },
          },
          {
            key: "rangeMin",
            get: function () {
              return this.range()[0];
            },
          },
          {
            key: "rangeMax",
            get: function () {
              return this.range()[1];
            },
          },
          {
            key: "bandwidth",
            get: function () {
              return this.scale.bandwidth;
            },
          },
          {
            key: "apply",
            value: function (t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                r = e.bandAware,
                n = e.position;
              if (void 0 !== t) {
                if (n)
                  switch (n) {
                    case "start":
                    default:
                      return this.scale(t);
                    case "middle":
                      var o = this.bandwidth ? this.bandwidth() / 2 : 0;
                      return this.scale(t) + o;
                    case "end":
                      var i = this.bandwidth ? this.bandwidth() : 0;
                      return this.scale(t) + i;
                  }
                if (r) {
                  var a = this.bandwidth ? this.bandwidth() / 2 : 0;
                  return this.scale(t) + a;
                }
                return this.scale(t);
              }
            },
          },
          {
            key: "isInRange",
            value: function (t) {
              var e = this.range(),
                r = e[0],
                n = e[e.length - 1];
              return r <= n ? t >= r && t <= n : t >= n && t <= r;
            },
          },
        ]),
        (e = [
          {
            key: "create",
            value: function (t) {
              return new r(t);
            },
          },
        ]),
        t && m(r.prototype, t),
        e && m(r, e),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        r
      );
    })();
  x(S, "EPS", 1e-4);
  var P = function (t) {
    var e = Object.keys(t).reduce(function (e, r) {
      return g(g({}, e), {}, x({}, r, S.create(t[r])));
    }, {});
    return g(
      g({}, e),
      {},
      {
        apply: function (t) {
          var r =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            n = r.bandAware,
            o = r.position;
          return (0, f.default)(t, function (t, r) {
            return e[r].apply(t, { bandAware: n, position: o });
          });
        },
        isInRange: function (t) {
          return (0, p.default)(t, function (t, r) {
            return e[r].isInRange(t);
          });
        },
      },
    );
  };
  t.s(
    [
      "O",
      0,
      P,
      "t",
      0,
      function (t, e, r, n, o) {
        var i = t.width,
          a = t.height,
          u = t.layout,
          c = t.children,
          s = Object.keys(e),
          f = {
            left: r.left,
            leftMirror: r.left,
            right: i - r.right,
            rightMirror: i - r.right,
            top: r.top,
            topMirror: r.top,
            bottom: a - r.bottom,
            bottomMirror: a - r.bottom,
          },
          p = !!(0, h.m)(c, y.f);
        return s.reduce(function (i, a) {
          var c,
            s,
            h,
            y,
            v,
            m = e[a],
            b = m.orientation,
            O = m.domain,
            w = m.padding,
            j = void 0 === w ? {} : w,
            S = m.mirror,
            P = m.reversed,
            A = "".concat(b).concat(S ? "Mirror" : "");
          if (
            "number" === m.type &&
            ("gap" === m.padding || "no-gap" === m.padding)
          ) {
            var E = O[1] - O[0],
              M = 1 / 0,
              k = m.categoricalDomain.sort(l.c);
            if (
              (k.forEach(function (t, e) {
                e > 0 && (M = Math.min((t || 0) - (k[e - 1] || 0), M));
              }),
              Number.isFinite(M))
            ) {
              var T = M / E,
                _ = "vertical" === m.layout ? r.height : r.width;
              if (
                ("gap" === m.padding && (c = (T * _) / 2),
                "no-gap" === m.padding)
              ) {
                var C = (0, l.M)(t.barCategoryGap, T * _),
                  I = (T * _) / 2;
                c = I - C - ((I - C) / _) * C;
              }
            }
          }
          ((s =
            "xAxis" === n
              ? [
                  r.left + (j.left || 0) + (c || 0),
                  r.left + r.width - (j.right || 0) - (c || 0),
                ]
              : "yAxis" === n
                ? "horizontal" === u
                  ? [r.top + r.height - (j.bottom || 0), r.top + (j.top || 0)]
                  : [
                      r.top + (j.top || 0) + (c || 0),
                      r.top + r.height - (j.bottom || 0) - (c || 0),
                    ]
                : m.range),
            P && (s = [s[1], s[0]]));
          var D = (0, d.z)(m, o, p),
            N = D.scale,
            B = D.realScaleType;
          (N.domain(O).range(s), (0, d.u)(N));
          var R = (0, d.S)(N, g(g({}, m), {}, { realScaleType: B }));
          "xAxis" === n
            ? ((v = ("top" === b && !S) || ("bottom" === b && S)),
              (h = r.left),
              (y = f[A] - v * m.height))
            : "yAxis" === n &&
              ((v = ("left" === b && !S) || ("right" === b && S)),
              (h = f[A] - v * m.width),
              (y = r.top));
          var L = g(
            g(g({}, m), R),
            {},
            {
              realScaleType: B,
              x: h,
              y: y,
              scale: N,
              width: "xAxis" === n ? r.width : m.width,
              height: "yAxis" === n ? r.height : m.height,
            },
          );
          return (
            (L.bandSize = (0, d.O)(L, R)),
            m.hide || "xAxis" !== n
              ? m.hide || (f[A] += (v ? -1 : 1) * L.width)
              : (f[A] += (v ? -1 : 1) * L.height),
            g(g({}, i), {}, x({}, a, L))
          );
        }, {});
      },
      "U",
      0,
      function (t) {
        var e = t.width,
          r = t.height,
          n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          o = ((((n % 180) + 180) % 180) * Math.PI) / 180,
          i = Math.atan(r / e);
        return Math.abs(
          o > i && o < Math.PI - i ? r / Math.sin(o) : e / Math.cos(o),
        );
      },
      "z",
      0,
      j,
      "u",
      0,
      w,
    ],
    998188,
  );
  var A = t.i(609094);
  function E() {
    return (E = Object.assign.bind()).apply(this, arguments);
  }
  function M(t) {
    return (M =
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
  function k(t, e) {
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
  function T(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? k(Object(r), !0).forEach(function (e) {
            D(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : k(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function _() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (_ = function () {
      return !!t;
    })();
  }
  function C(t) {
    return (C = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function I(t, e) {
    return (I = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function D(t, e, r) {
    return (
      (e = N(e)) in t
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
  function N(t) {
    var e = (function (t, e) {
      if ("object" != M(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != M(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == M(e) ? e : e + "";
  }
  var B = function (t) {
      var e = t.x,
        r = t.y,
        n = t.xAxis,
        o = t.yAxis,
        i = P({ x: n.scale, y: o.scale }),
        a = i.apply({ x: e, y: r }, { bandAware: !0 });
      return (0, s.f)(t, "discard") && !i.isInRange(a) ? null : a;
    },
    R = (function (t) {
      var e;
      function r() {
        var t, e;
        if (!(this instanceof r))
          throw TypeError("Cannot call a class as a function");
        return (
          (t = r),
          (e = arguments),
          (t = C(t)),
          (function (t, e) {
            if (e && ("object" === M(e) || "function" == typeof e)) return e;
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
            _()
              ? Reflect.construct(t, e || [], C(this).constructor)
              : t.apply(this, e),
          )
        );
      }
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      return (
        (r.prototype = Object.create(t && t.prototype, {
          constructor: { value: r, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        t && I(r, t),
        (e = [
          {
            key: "render",
            value: function () {
              var t = this.props,
                e = t.x,
                o = t.y,
                u = t.r,
                f = t.alwaysShow,
                p = t.clipPathId,
                d = (0, l.m)(e),
                y = (0, l.m)(o);
              if (
                ((0, A.f)(
                  void 0 === f,
                  'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
                ),
                !d || !y)
              )
                return null;
              var v = B(this.props);
              if (!v) return null;
              var m = v.x,
                b = v.y,
                g = this.props,
                x = g.shape,
                O = g.className,
                w = T(
                  T(
                    {
                      clipPath: (0, s.f)(this.props, "hidden")
                        ? "url(#".concat(p, ")")
                        : void 0,
                    },
                    (0, h.T)(this.props, !0),
                  ),
                  {},
                  { cx: m, cy: b },
                );
              return n.default.createElement(
                a.f,
                { className: (0, i.U)("recharts-reference-dot", O) },
                r.renderDot(x, w),
                c.f.renderCallByParent(this.props, {
                  x: m - u,
                  y: b - u,
                  width: 2 * u,
                  height: 2 * u,
                }),
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
              Object.defineProperty(t, N(n.key), n));
          }
        })(r.prototype, e),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        r
      );
    })(n.default.Component);
  (D(R, "displayName", "ReferenceDot"),
    D(R, "defaultProps", {
      isFront: !1,
      ifOverflow: "discard",
      xAxisId: 0,
      yAxisId: 0,
      r: 10,
      fill: "#fff",
      stroke: "#ccc",
      fillOpacity: 1,
      strokeWidth: 1,
    }),
    D(R, "renderDot", function (t, e) {
      return n.default.isValidElement(t)
        ? n.default.cloneElement(t, e)
        : (0, o.default)(t)
          ? t(e)
          : n.default.createElement(
              u.f,
              E({}, e, {
                cx: e.cx,
                cy: e.cy,
                className: "recharts-reference-dot-dot",
              }),
            );
    }));
  var L = t.i(50225),
    U = t.i(453259),
    z = t.i(484023),
    $ = (0, t.i(528535).default)(
      function (t) {
        return { x: t.left, y: t.top, width: t.width, height: t.height };
      },
      function (t) {
        return ["l", t.left, "t", t.top, "w", t.width, "h", t.height].join("");
      },
    ),
    H = (0, n.createContext)(void 0),
    F = (0, n.createContext)(void 0),
    W = (0, n.createContext)(void 0),
    X = (0, n.createContext)({}),
    q = (0, n.createContext)(void 0),
    V = (0, n.createContext)(0),
    G = (0, n.createContext)(0),
    Y = function () {
      return (0, n.useContext)(q);
    },
    K = function (t) {
      var e = (0, n.useContext)(H);
      null == e && (0, U.f)(!1);
      var r = e[t];
      return (null == r && (0, U.f)(!1), r);
    },
    Z = function (t) {
      var e = (0, n.useContext)(F);
      null == e && (0, U.f)(!1);
      var r = e[t];
      return (null == r && (0, U.f)(!1), r);
    },
    J = function () {
      return (0, n.useContext)(W);
    };
  function Q(t) {
    return (Q =
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
      "X",
      0,
      function (t) {
        var e = t.state,
          r = e.xAxisMap,
          o = e.yAxisMap,
          i = e.offset,
          a = t.clipPathId,
          u = t.children,
          c = t.width,
          l = t.height,
          s = $(i);
        return n.default.createElement(
          H.Provider,
          { value: r },
          n.default.createElement(
            F.Provider,
            { value: o },
            n.default.createElement(
              X.Provider,
              { value: i },
              n.default.createElement(
                W.Provider,
                { value: s },
                n.default.createElement(
                  q.Provider,
                  { value: a },
                  n.default.createElement(
                    V.Provider,
                    { value: l },
                    n.default.createElement(G.Provider, { value: c }, u),
                  ),
                ),
              ),
            ),
          ),
        );
      },
      "w",
      0,
      function () {
        var t = (0, n.useContext)(H);
        return (0, l.f)(t);
      },
      "Z",
      0,
      function () {
        return (0, n.useContext)(V);
      },
      "J",
      0,
      function () {
        return (0, n.useContext)(G);
      },
      "z",
      0,
      Y,
      "v",
      0,
      function () {
        return (0, n.useContext)(X);
      },
      "r",
      0,
      J,
      "U",
      0,
      K,
      "W",
      0,
      Z,
      "Y",
      0,
      function () {
        var t = (0, n.useContext)(F);
        return (
          (0, z.default)(t, function (t) {
            return (0, p.default)(t.domain, Number.isFinite);
          }) || (0, l.f)(t)
        );
      },
    ],
    814929,
  );
  function tt() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tt = function () {
      return !!t;
    })();
  }
  function te(t) {
    return (te = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tr(t, e) {
    return (tr = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tn(t, e) {
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
  function to(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tn(Object(r), !0).forEach(function (e) {
            ti(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tn(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function ti(t, e, r) {
    return (
      (e = ta(e)) in t
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
  function ta(t) {
    var e = (function (t, e) {
      if ("object" != Q(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != Q(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == Q(e) ? e : e + "";
  }
  function tu(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function tc() {
    return (tc = Object.assign.bind()).apply(this, arguments);
  }
  var tl = function (t, e) {
      return n.default.isValidElement(t)
        ? n.default.cloneElement(t, e)
        : (0, o.default)(t)
          ? t(e)
          : n.default.createElement(
              "line",
              tc({}, e, { className: "recharts-reference-line-line" }),
            );
    },
    ts = function (t, e, r, n, o, i, a, u, c) {
      var l = o.x,
        f = o.y,
        p = o.width,
        d = o.height;
      if (r) {
        var h = c.y,
          y = t.y.apply(h, { position: i });
        if ((0, s.f)(c, "discard") && !t.y.isInRange(y)) return null;
        var v = [
          { x: l + p, y: y },
          { x: l, y: y },
        ];
        return "left" === u ? v.reverse() : v;
      }
      if (e) {
        var m = c.x,
          b = t.x.apply(m, { position: i });
        if ((0, s.f)(c, "discard") && !t.x.isInRange(b)) return null;
        var g = [
          { x: b, y: f + d },
          { x: b, y: f },
        ];
        return "top" === a ? g.reverse() : g;
      }
      if (n) {
        var x = c.segment.map(function (e) {
          return t.apply(e, { position: i });
        });
        return (0, s.f)(c, "discard") &&
          (0, L.default)(x, function (e) {
            return !t.isInRange(e);
          })
          ? null
          : x;
      }
      return null;
    };
  function tf(t) {
    var e = t.x,
      r = t.y,
      o = t.segment,
      u = t.xAxisId,
      f = t.yAxisId,
      p = t.shape,
      d = t.className,
      y = t.alwaysShow,
      v = Y(),
      m = K(u),
      b = Z(f),
      g = J();
    if (!v || !g) return null;
    (0, A.f)(
      void 0 === y,
      'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
    );
    var x = ts(
      P({ x: m.scale, y: b.scale }),
      (0, l.m)(e),
      (0, l.m)(r),
      o && 2 === o.length,
      g,
      t.position,
      m.orientation,
      b.orientation,
      t,
    );
    if (!x) return null;
    var O =
        (function (t) {
          if (Array.isArray(t)) return t;
        })(x) ||
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
        })(x) ||
        (function (t) {
          if (t) {
            if ("string" == typeof t) return tu(t, 2);
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
              return tu(t, 2);
          }
        })(x) ||
        (function () {
          throw TypeError(
            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(),
      w = O[0],
      S = w.x,
      E = w.y,
      M = O[1],
      k = M.x,
      T = M.y,
      _ = to(
        to(
          { clipPath: (0, s.f)(t, "hidden") ? "url(#".concat(v, ")") : void 0 },
          (0, h.T)(t, !0),
        ),
        {},
        { x1: S, y1: E, x2: k, y2: T },
      );
    return n.default.createElement(
      a.f,
      { className: (0, i.U)("recharts-reference-line", d) },
      tl(p, _),
      c.f.renderCallByParent(t, j({ x1: S, y1: E, x2: k, y2: T })),
    );
  }
  var tp = (function (t) {
    var e;
    function r() {
      var t, e;
      if (!(this instanceof r))
        throw TypeError("Cannot call a class as a function");
      return (
        (t = r),
        (e = arguments),
        (t = te(t)),
        (function (t, e) {
          if (e && ("object" === Q(e) || "function" == typeof e)) return e;
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
          tt()
            ? Reflect.construct(t, e || [], te(this).constructor)
            : t.apply(this, e),
        )
      );
    }
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    return (
      (r.prototype = Object.create(t && t.prototype, {
        constructor: { value: r, writable: !0, configurable: !0 },
      })),
      Object.defineProperty(r, "prototype", { writable: !1 }),
      t && tr(r, t),
      (e = [
        {
          key: "render",
          value: function () {
            return n.default.createElement(tf, this.props);
          },
        },
      ]),
      (function (t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          ((n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(t, ta(n.key), n));
        }
      })(r.prototype, e),
      Object.defineProperty(r, "prototype", { writable: !1 }),
      r
    );
  })(n.default.Component);
  (ti(tp, "displayName", "ReferenceLine"),
    ti(tp, "defaultProps", {
      isFront: !1,
      ifOverflow: "discard",
      xAxisId: 0,
      yAxisId: 0,
      fill: "none",
      stroke: "#ccc",
      fillOpacity: 1,
      strokeWidth: 1,
      position: "middle",
    }),
    t.s(["f", 0, tp], 283349));
  var td = t.i(898644);
  function th() {
    return (th = Object.assign.bind()).apply(this, arguments);
  }
  function ty(t) {
    return (ty =
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
            tO(t, e, r[e]);
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
  function tb() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (tb = function () {
      return !!t;
    })();
  }
  function tg(t) {
    return (tg = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tx(t, e) {
    return (tx = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tO(t, e, r) {
    return (
      (e = tw(e)) in t
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
  function tw(t) {
    var e = (function (t, e) {
      if ("object" != ty(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != ty(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == ty(e) ? e : e + "";
  }
  var tj = function (t, e, r, n, o) {
      var i = o.x1,
        a = o.x2,
        u = o.y1,
        c = o.y2,
        l = o.xAxis,
        f = o.yAxis;
      if (!l || !f) return null;
      var p = P({ x: l.scale, y: f.scale }),
        d = {
          x: t ? p.x.apply(i, { position: "start" }) : p.x.rangeMin,
          y: r ? p.y.apply(u, { position: "start" }) : p.y.rangeMin,
        },
        h = {
          x: e ? p.x.apply(a, { position: "end" }) : p.x.rangeMax,
          y: n ? p.y.apply(c, { position: "end" }) : p.y.rangeMax,
        };
      return !(0, s.f)(o, "discard") || (p.isInRange(d) && p.isInRange(h))
        ? w(d, h)
        : null;
    },
    tS = (function (t) {
      var e;
      function r() {
        var t, e;
        if (!(this instanceof r))
          throw TypeError("Cannot call a class as a function");
        return (
          (t = r),
          (e = arguments),
          (t = tg(t)),
          (function (t, e) {
            if (e && ("object" === ty(e) || "function" == typeof e)) return e;
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
            tb()
              ? Reflect.construct(t, e || [], tg(this).constructor)
              : t.apply(this, e),
          )
        );
      }
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      return (
        (r.prototype = Object.create(t && t.prototype, {
          constructor: { value: r, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        t && tx(r, t),
        (e = [
          {
            key: "render",
            value: function () {
              var t = this.props,
                e = t.x1,
                o = t.x2,
                u = t.y1,
                f = t.y2,
                p = t.className,
                d = t.alwaysShow,
                y = t.clipPathId;
              (0, A.f)(
                void 0 === d,
                'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
              );
              var v = (0, l.m)(e),
                m = (0, l.m)(o),
                b = (0, l.m)(u),
                g = (0, l.m)(f),
                x = this.props.shape;
              if (!v && !m && !b && !g && !x) return null;
              var O = tj(v, m, b, g, this.props);
              if (!O && !x) return null;
              var w = (0, s.f)(this.props, "hidden")
                ? "url(#".concat(y, ")")
                : void 0;
              return n.default.createElement(
                a.f,
                { className: (0, i.U)("recharts-reference-area", p) },
                r.renderRect(
                  x,
                  tm(tm({ clipPath: w }, (0, h.T)(this.props, !0)), O),
                ),
                c.f.renderCallByParent(this.props, O),
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
              Object.defineProperty(t, tw(n.key), n));
          }
        })(r.prototype, e),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        r
      );
    })(n.default.Component);
  function tP(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return tA(t);
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
          if ("string" == typeof t) return tA(t, void 0);
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
            return tA(t, void 0);
        }
      })(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function tA(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  (tO(tS, "displayName", "ReferenceArea"),
    tO(tS, "defaultProps", {
      isFront: !1,
      ifOverflow: "discard",
      xAxisId: 0,
      yAxisId: 0,
      r: 10,
      fill: "#ccc",
      fillOpacity: 0.5,
      stroke: "none",
      strokeWidth: 1,
    }),
    tO(tS, "renderRect", function (t, e) {
      return n.default.isValidElement(t)
        ? n.default.cloneElement(t, e)
        : (0, o.default)(t)
          ? t(e)
          : n.default.createElement(
              td.G,
              th({}, e, { className: "recharts-reference-area-rect" }),
            );
    }),
    t.s(
      [
        "f",
        0,
        function (t, e, r, n, o) {
          var i = (0, h.M)(t, tp),
            a = (0, h.M)(t, R),
            u = [].concat(tP(i), tP(a)),
            c = (0, h.M)(t, tS),
            f = "".concat(n, "Id"),
            p = n[0],
            d = e;
          if (
            (u.length &&
              (d = u.reduce(function (t, e) {
                if (
                  e.props[f] === r &&
                  (0, s.f)(e.props, "extendDomain") &&
                  (0, l.H)(e.props[p])
                ) {
                  var n = e.props[p];
                  return [Math.min(t[0], n), Math.max(t[1], n)];
                }
                return t;
              }, d)),
            c.length)
          ) {
            var y = "".concat(p, "1"),
              v = "".concat(p, "2");
            d = c.reduce(function (t, e) {
              if (
                e.props[f] === r &&
                (0, s.f)(e.props, "extendDomain") &&
                (0, l.H)(e.props[y]) &&
                (0, l.H)(e.props[v])
              ) {
                var n = e.props[y],
                  o = e.props[v];
                return [Math.min(t[0], n, o), Math.max(t[1], n, o)];
              }
              return t;
            }, d);
          }
          return (
            o &&
              o.length &&
              (d = o.reduce(function (t, e) {
                return (0, l.H)(e) ? [Math.min(t[0], e), Math.max(t[1], e)] : t;
              }, d)),
            d
          );
        },
      ],
      756984,
    ));
  var tE = new (t.i(610482).default)();
  function tM(t) {
    return (tM =
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
  t.s(["t", 0, "recharts.syncMouseEvents", "Z", 0, tE], 122257);
  function tk(t, e, r) {
    return (
      (e = tT(e)) in t
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
  function tT(t) {
    var e = (function (t, e) {
      if ("object" != tM(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != tM(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == tM(e) ? e : e + "";
  }
  var t_ =
    ((e = function t() {
      if (!(this instanceof t))
        throw TypeError("Cannot call a class as a function");
      (tk(this, "activeIndex", 0),
        tk(this, "coordinateList", []),
        tk(this, "layout", "horizontal"));
    }),
    (r = [
      {
        key: "setDetails",
        value: function (t) {
          var e,
            r = t.coordinateList,
            n = void 0 === r ? null : r,
            o = t.container,
            i = void 0 === o ? null : o,
            a = t.layout,
            u = void 0 === a ? null : a,
            c = t.offset,
            l = void 0 === c ? null : c,
            s = t.mouseHandlerCallback,
            f = void 0 === s ? null : s;
          ((this.coordinateList =
            null != (e = null != n ? n : this.coordinateList) ? e : []),
            (this.container = null != i ? i : this.container),
            (this.layout = null != u ? u : this.layout),
            (this.offset = null != l ? l : this.offset),
            (this.mouseHandlerCallback =
              null != f ? f : this.mouseHandlerCallback),
            (this.activeIndex = Math.min(
              Math.max(this.activeIndex, 0),
              this.coordinateList.length - 1,
            )));
        },
      },
      {
        key: "focus",
        value: function () {
          this.spoofMouse();
        },
      },
      {
        key: "keyboardEvent",
        value: function (t) {
          if (0 !== this.coordinateList.length)
            switch (t.key) {
              case "ArrowRight":
                if ("horizontal" !== this.layout) return;
                ((this.activeIndex = Math.min(
                  this.activeIndex + 1,
                  this.coordinateList.length - 1,
                )),
                  this.spoofMouse());
                break;
              case "ArrowLeft":
                if ("horizontal" !== this.layout) return;
                ((this.activeIndex = Math.max(this.activeIndex - 1, 0)),
                  this.spoofMouse());
            }
        },
      },
      {
        key: "setIndex",
        value: function (t) {
          this.activeIndex = t;
        },
      },
      {
        key: "spoofMouse",
        value: function () {
          if (
            "horizontal" === this.layout &&
            0 !== this.coordinateList.length
          ) {
            var t,
              e,
              r = this.container.getBoundingClientRect(),
              n = r.x,
              o = r.y,
              i = r.height,
              a = this.coordinateList[this.activeIndex].coordinate,
              u = (null == (t = window) ? void 0 : t.scrollX) || 0,
              c = (null == (e = window) ? void 0 : e.scrollY) || 0,
              l = o + this.offset.top + i / 2 + c;
            this.mouseHandlerCallback({ pageX: n + a + u, pageY: l });
          }
        },
      },
    ]),
    (function (t, e) {
      for (var r = 0; r < e.length; r++) {
        var n = e[r];
        ((n.enumerable = n.enumerable || !1),
          (n.configurable = !0),
          "value" in n && (n.writable = !0),
          Object.defineProperty(t, tT(n.key), n));
      }
    })(e.prototype, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e);
  (t.s(["f", 0, t_], 141001),
    t.s(
      [
        "f",
        0,
        function (t, e, r) {
          if ("number" === r && !0 === e && Array.isArray(t)) {
            var n = null == t ? void 0 : t[0],
              o = null == t ? void 0 : t[1];
            if (n && o && (0, l.H)(n) && (0, l.H)(o)) return !0;
          }
          return !1;
        },
      ],
      701240,
    ));
};
