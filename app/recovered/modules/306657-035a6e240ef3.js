// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(904703),
    n = t.i(180793),
    o = t.i(7284),
    i = t.i(756438);
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
  function l(t, e) {
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
  function s(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? l(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != a(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != a(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == a(e) ? e : e + "";
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
          : l(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function f(t) {
    return Array.isArray(t) && (0, i.m)(t[0]) && (0, i.m)(t[1])
      ? t.join(" ~ ")
      : t;
  }
  var p = function (t) {
    var a = t.separator,
      l = void 0 === a ? " : " : a,
      p = t.contentStyle,
      d = t.itemStyle,
      h = void 0 === d ? {} : d,
      y = t.labelStyle,
      v = t.payload,
      m = t.formatter,
      b = t.itemSorter,
      g = t.wrapperClassName,
      x = t.labelClassName,
      O = t.label,
      w = t.labelFormatter,
      j = t.accessibilityLayer,
      S = s(
        {
          margin: 0,
          padding: 10,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          whiteSpace: "nowrap",
        },
        void 0 === p ? {} : p,
      ),
      P = s({ margin: 0 }, void 0 === y ? {} : y),
      A = !(0, n.default)(O),
      E = A ? O : "",
      M = (0, o.U)("recharts-default-tooltip", g),
      k = (0, o.U)("recharts-tooltip-label", x);
    return (
      A && w && null != v && (E = w(O, v)),
      e.default.createElement(
        "div",
        u(
          { className: M, style: S },
          void 0 !== j && j ? { role: "status", "aria-live": "assertive" } : {},
        ),
        e.default.createElement(
          "p",
          { className: k, style: P },
          e.default.isValidElement(E) ? E : "".concat(E),
        ),
        (function () {
          if (v && v.length) {
            var t = (b ? (0, r.default)(v, b) : v).map(function (t, r) {
              if ("none" === t.type) return null;
              var n = s(
                  {
                    display: "block",
                    paddingTop: 4,
                    paddingBottom: 4,
                    color: t.color || "#000",
                  },
                  h,
                ),
                o = t.formatter || m || f,
                a = t.value,
                u = t.name,
                p = a,
                d = u;
              if (o && null != p && null != d) {
                var y = o(a, u, t, r, v);
                if (Array.isArray(y)) {
                  var b =
                    (function (t) {
                      if (Array.isArray(t)) return t;
                    })(y) ||
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
                    })(y) ||
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
                    })(y) ||
                    (function () {
                      throw TypeError(
                        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                      );
                    })();
                  ((p = b[0]), (d = b[1]));
                } else p = y;
              }
              return e.default.createElement(
                "li",
                {
                  className: "recharts-tooltip-item",
                  key: "tooltip-item-".concat(r),
                  style: n,
                },
                (0, i.m)(d)
                  ? e.default.createElement(
                      "span",
                      { className: "recharts-tooltip-item-name" },
                      d,
                    )
                  : null,
                (0, i.m)(d)
                  ? e.default.createElement(
                      "span",
                      { className: "recharts-tooltip-item-separator" },
                      l,
                    )
                  : null,
                e.default.createElement(
                  "span",
                  { className: "recharts-tooltip-item-value" },
                  p,
                ),
                e.default.createElement(
                  "span",
                  { className: "recharts-tooltip-item-unit" },
                  t.unit || "",
                ),
              );
            });
            return e.default.createElement(
              "ul",
              {
                className: "recharts-tooltip-item-list",
                style: { padding: 0, margin: 0 },
              },
              t,
            );
          }
          return null;
        })(),
      )
    );
  };
  function d(t) {
    return (d =
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
  function h(t, e, r) {
    var n;
    return (
      ((n = (function (t, e) {
        if ("object" != d(t) || !t) return t;
        var r = t[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(t, e || "default");
          if ("object" != d(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(e, "string")),
      (e = "symbol" == d(n) ? n : n + "") in t)
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
  var y = "recharts-tooltip-wrapper",
    v = { visibility: "hidden" };
  function m(t) {
    var e = t.allowEscapeViewBox,
      r = t.coordinate,
      n = t.key,
      o = t.offsetTopLeft,
      a = t.position,
      u = t.reverseDirection,
      c = t.tooltipDimension,
      l = t.viewBox,
      s = t.viewBoxDimension;
    if (a && (0, i.H)(a[n])) return a[n];
    var f = r[n] - c - o,
      p = r[n] + o;
    return e[n]
      ? u[n]
        ? f
        : p
      : u[n]
        ? f < l[n]
          ? Math.max(p, l[n])
          : Math.max(f, l[n])
        : p + c > l[n] + s
          ? Math.max(f, l[n])
          : Math.max(p, l[n]);
  }
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
  function g(t, e) {
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
  function x(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? g(Object(r), !0).forEach(function (e) {
            S(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : g(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function O() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (O = function () {
      return !!t;
    })();
  }
  function w(t) {
    return (w = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function j(t, e) {
    return (j = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function S(t, e, r) {
    return (
      (e = P(e)) in t
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
  function P(t) {
    var e = (function (t, e) {
      if ("object" != b(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != b(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == b(e) ? e : e + "";
  }
  var A = (function (t) {
      var r;
      function n() {
        var t, e, r;
        if (!(this instanceof n))
          throw TypeError("Cannot call a class as a function");
        for (var o = arguments.length, i = Array(o), a = 0; a < o; a++)
          i[a] = arguments[a];
        return (
          (e = n),
          (r = [].concat(i)),
          (e = w(e)),
          S(
            (t = (function (t, e) {
              if (e && ("object" === b(e) || "function" == typeof e)) return e;
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
              O()
                ? Reflect.construct(e, r || [], w(this).constructor)
                : e.apply(this, r),
            )),
            "state",
            {
              dismissed: !1,
              dismissedAtCoordinate: { x: 0, y: 0 },
              lastBoundingBox: { width: -1, height: -1 },
            },
          ),
          S(t, "handleKeyDown", function (e) {
            if ("Escape" === e.key) {
              var r, n, o, i;
              t.setState({
                dismissed: !0,
                dismissedAtCoordinate: {
                  x:
                    null !=
                    (r = null == (n = t.props.coordinate) ? void 0 : n.x)
                      ? r
                      : 0,
                  y:
                    null !=
                    (o = null == (i = t.props.coordinate) ? void 0 : i.y)
                      ? o
                      : 0,
                },
              });
            }
          }),
          t
        );
      }
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      return (
        (n.prototype = Object.create(t && t.prototype, {
          constructor: { value: n, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(n, "prototype", { writable: !1 }),
        t && j(n, t),
        (r = [
          {
            key: "updateBBox",
            value: function () {
              if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
                var t = this.wrapperNode.getBoundingClientRect();
                (Math.abs(t.width - this.state.lastBoundingBox.width) > 1 ||
                  Math.abs(t.height - this.state.lastBoundingBox.height) > 1) &&
                  this.setState({
                    lastBoundingBox: { width: t.width, height: t.height },
                  });
              } else
                (-1 !== this.state.lastBoundingBox.width ||
                  -1 !== this.state.lastBoundingBox.height) &&
                  this.setState({ lastBoundingBox: { width: -1, height: -1 } });
            },
          },
          {
            key: "componentDidMount",
            value: function () {
              (document.addEventListener("keydown", this.handleKeyDown),
                this.updateBBox());
            },
          },
          {
            key: "componentWillUnmount",
            value: function () {
              document.removeEventListener("keydown", this.handleKeyDown);
            },
          },
          {
            key: "componentDidUpdate",
            value: function () {
              var t, e;
              (this.props.active && this.updateBBox(),
                this.state.dismissed &&
                  ((null == (t = this.props.coordinate) ? void 0 : t.x) !==
                    this.state.dismissedAtCoordinate.x ||
                    (null == (e = this.props.coordinate) ? void 0 : e.y) !==
                      this.state.dismissedAtCoordinate.y) &&
                  (this.state.dismissed = !1));
            },
          },
          {
            key: "render",
            value: function () {
              var t,
                r,
                n,
                a,
                u,
                c,
                l,
                s,
                f,
                p,
                d,
                b,
                g,
                O,
                w,
                j,
                S,
                P,
                A,
                E = this,
                M = this.props,
                k = M.active,
                T = M.allowEscapeViewBox,
                _ = M.animationDuration,
                C = M.animationEasing,
                I = M.children,
                D = M.coordinate,
                N = M.hasPayload,
                B = M.isAnimationActive,
                R = M.offset,
                L = M.position,
                U = M.reverseDirection,
                z = M.useTranslate3d,
                $ = M.viewBox,
                H = M.wrapperStyle,
                F =
                  ((b = (t = {
                    allowEscapeViewBox: T,
                    coordinate: D,
                    offsetTopLeft: R,
                    position: L,
                    reverseDirection: U,
                    tooltipBox: this.state.lastBoundingBox,
                    useTranslate3d: z,
                    viewBox: $,
                  }).allowEscapeViewBox),
                  (g = t.coordinate),
                  (O = t.offsetTopLeft),
                  (w = t.position),
                  (j = t.reverseDirection),
                  (S = t.tooltipBox),
                  (P = t.useTranslate3d),
                  (A = t.viewBox),
                  S.height > 0 && S.width > 0 && g
                    ? ((n = (r = {
                        translateX: (p = m({
                          allowEscapeViewBox: b,
                          coordinate: g,
                          key: "x",
                          offsetTopLeft: O,
                          position: w,
                          reverseDirection: j,
                          tooltipDimension: S.width,
                          viewBox: A,
                          viewBoxDimension: A.width,
                        })),
                        translateY: (d = m({
                          allowEscapeViewBox: b,
                          coordinate: g,
                          key: "y",
                          offsetTopLeft: O,
                          position: w,
                          reverseDirection: j,
                          tooltipDimension: S.height,
                          viewBox: A,
                          viewBoxDimension: A.height,
                        })),
                        useTranslate3d: P,
                      }).translateX),
                      (a = r.translateY),
                      (f = {
                        transform: r.useTranslate3d
                          ? "translate3d(".concat(n, "px, ").concat(a, "px, 0)")
                          : "translate(".concat(n, "px, ").concat(a, "px)"),
                      }))
                    : (f = v),
                  {
                    cssProperties: f,
                    cssClasses:
                      ((c = (u = {
                        translateX: p,
                        translateY: d,
                        coordinate: g,
                      }).coordinate),
                      (l = u.translateX),
                      (s = u.translateY),
                      (0, o.U)(
                        y,
                        h(
                          h(
                            h(
                              h(
                                {},
                                "".concat(y, "-right"),
                                (0, i.H)(l) && c && (0, i.H)(c.x) && l >= c.x,
                              ),
                              "".concat(y, "-left"),
                              (0, i.H)(l) && c && (0, i.H)(c.x) && l < c.x,
                            ),
                            "".concat(y, "-bottom"),
                            (0, i.H)(s) && c && (0, i.H)(c.y) && s >= c.y,
                          ),
                          "".concat(y, "-top"),
                          (0, i.H)(s) && c && (0, i.H)(c.y) && s < c.y,
                        ),
                      )),
                  }),
                W = F.cssClasses,
                X = F.cssProperties,
                q = x(
                  x(
                    {
                      transition:
                        B && k
                          ? "transform ".concat(_, "ms ").concat(C)
                          : void 0,
                    },
                    X,
                  ),
                  {},
                  {
                    pointerEvents: "none",
                    visibility:
                      !this.state.dismissed && k && N ? "visible" : "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  H,
                );
              return e.default.createElement(
                "div",
                {
                  tabIndex: -1,
                  className: W,
                  style: q,
                  ref: function (t) {
                    E.wrapperNode = t;
                  },
                },
                I,
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
              Object.defineProperty(t, P(n.key), n));
          }
        })(n.prototype, r),
        Object.defineProperty(n, "prototype", { writable: !1 }),
        n
      );
    })(e.PureComponent),
    E = t.i(861468),
    M = t.i(576786);
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
  function T(t, e) {
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
  function _(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? T(Object(r), !0).forEach(function (e) {
            N(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : T(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function C() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (C = function () {
      return !!t;
    })();
  }
  function I(t) {
    return (I = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function D(t, e) {
    return (D = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function N(t, e, r) {
    return (
      (e = B(e)) in t
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
  function B(t) {
    var e = (function (t, e) {
      if ("object" != k(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != k(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == k(e) ? e : e + "";
  }
  function R(t) {
    return t.dataKey;
  }
  var L = (function (t) {
    var r;
    function n() {
      var t, e;
      if (!(this instanceof n))
        throw TypeError("Cannot call a class as a function");
      return (
        (t = n),
        (e = arguments),
        (t = I(t)),
        (function (t, e) {
          if (e && ("object" === k(e) || "function" == typeof e)) return e;
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
          C()
            ? Reflect.construct(t, e || [], I(this).constructor)
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
      t && D(n, t),
      (r = [
        {
          key: "render",
          value: function () {
            var t,
              r = this,
              n = this.props,
              o = n.active,
              i = n.allowEscapeViewBox,
              a = n.animationDuration,
              u = n.animationEasing,
              c = n.content,
              l = n.coordinate,
              s = n.filterNull,
              f = n.isAnimationActive,
              d = n.offset,
              h = n.payload,
              y = n.payloadUniqBy,
              v = n.position,
              m = n.reverseDirection,
              b = n.useTranslate3d,
              g = n.viewBox,
              x = n.wrapperStyle,
              O = null != h ? h : [];
            s &&
              O.length &&
              (O = (0, M.f)(
                h.filter(function (t) {
                  return (
                    null != t.value && (!0 !== t.hide || r.props.includeHidden)
                  );
                }),
                y,
                R,
              ));
            var w = O.length > 0;
            return e.default.createElement(
              A,
              {
                allowEscapeViewBox: i,
                animationDuration: a,
                animationEasing: u,
                isAnimationActive: f,
                active: o,
                coordinate: l,
                hasPayload: w,
                offset: d,
                position: v,
                reverseDirection: m,
                useTranslate3d: b,
                viewBox: g,
                wrapperStyle: x,
              },
              ((t = _(_({}, this.props), {}, { payload: O })),
              e.default.isValidElement(c)
                ? e.default.cloneElement(c, t)
                : "function" == typeof c
                  ? e.default.createElement(c, t)
                  : e.default.createElement(p, t)),
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
            Object.defineProperty(t, B(n.key), n));
        }
      })(n.prototype, r),
      Object.defineProperty(n, "prototype", { writable: !1 }),
      n
    );
  })(e.PureComponent);
  (N(L, "displayName", "Tooltip"),
    N(L, "defaultProps", {
      accessibilityLayer: !1,
      allowEscapeViewBox: { x: !1, y: !1 },
      animationDuration: 400,
      animationEasing: "ease",
      contentStyle: {},
      coordinate: { x: 0, y: 0 },
      cursor: !0,
      cursorStyle: {},
      filterNull: !0,
      isAnimationActive: !E.f.isSsr,
      itemStyle: {},
      labelStyle: {},
      offset: 10,
      reverseDirection: { x: !1, y: !1 },
      separator: " : ",
      trigger: "hover",
      useTranslate3d: !1,
      viewBox: { x: 0, y: 0, height: 0, width: 0 },
      wrapperStyle: {},
    }),
    t.s(["f", 0, L], 306657));
};
