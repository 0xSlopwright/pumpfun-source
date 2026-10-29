// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(7284),
    n = t.i(530136),
    n = n,
    o = t.i(462931),
    i = t.i(920404),
    a = t.i(748213),
    u = t.i(926614),
    c = t.i(223025),
    l = t.i(756438);
  function s(t) {
    return (s =
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
  function f(t, e) {
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
  function p(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? f(Object(r), !0).forEach(function (e) {
            d(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : f(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function d(t, e, r) {
    var n;
    return (
      ((n = (function (t, e) {
        if ("object" != s(t) || !t) return t;
        var r = t[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(t, e || "default");
          if ("object" != s(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(e, "string")),
      (e = "symbol" == s(n) ? n : n + "") in t)
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
  var h = ["Webkit", "Moz", "O", "ms"],
    y = function (t, e) {
      if (!t) return null;
      var r = t.replace(/(\w)/, function (t) {
          return t.toUpperCase();
        }),
        n = h.reduce(function (t, n) {
          return p(p({}, t), {}, d({}, n + r, e));
        }, {});
      return ((n[t] = e), n);
    },
    v = t.i(871791);
  function m(t) {
    return (m =
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
  function b() {
    return (b = Object.assign.bind()).apply(this, arguments);
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
            P(t, e, r[e]);
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
  function O(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, A(n.key), n));
    }
  }
  function w() {
    try {
      var t = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (t) {}
    return (w = function () {
      return !!t;
    })();
  }
  function j(t) {
    return (j = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function S(t, e) {
    return (S = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function P(t, e, r) {
    return (
      (e = A(e)) in t
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
  function A(t) {
    var e = (function (t, e) {
      if ("object" != m(t) || !t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" != m(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" == m(e) ? e : e + "";
  }
  var E = function (t) {
      var e = t.data,
        r = t.startIndex,
        o = t.endIndex,
        a = t.x,
        u = t.width,
        c = t.travellerWidth;
      if (!e || !e.length) return {};
      var l = e.length,
        s = (0, n.I)()
          .domain((0, i.default)(0, l))
          .range([a, a + u - c]),
        f = s.domain().map(function (t) {
          return s(t);
        });
      return {
        isTextActive: !1,
        isSlideMoving: !1,
        isTravellerMoving: !1,
        isTravellerFocused: !1,
        startX: s(r),
        endX: s(o),
        scale: s,
        scaleValues: f,
      };
    },
    M = function (t) {
      return t.changedTouches && !!t.changedTouches.length;
    },
    k = (function (t) {
      var n, i;
      function s(t) {
        var e, r, n;
        if (!(this instanceof s))
          throw TypeError("Cannot call a class as a function");
        return (
          (r = s),
          (n = [t]),
          (r = j(r)),
          P(
            (e = (function (t, e) {
              if (e && ("object" === m(e) || "function" == typeof e)) return e;
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
              w()
                ? Reflect.construct(r, n || [], j(this).constructor)
                : r.apply(this, n),
            )),
            "handleDrag",
            function (t) {
              (e.leaveTimer &&
                (clearTimeout(e.leaveTimer), (e.leaveTimer = null)),
                e.state.isTravellerMoving
                  ? e.handleTravellerMove(t)
                  : e.state.isSlideMoving && e.handleSlideDrag(t));
            },
          ),
          P(e, "handleTouchMove", function (t) {
            null != t.changedTouches &&
              t.changedTouches.length > 0 &&
              e.handleDrag(t.changedTouches[0]);
          }),
          P(e, "handleDragEnd", function () {
            (e.setState(
              { isTravellerMoving: !1, isSlideMoving: !1 },
              function () {
                var t = e.props,
                  r = t.endIndex,
                  n = t.onDragEnd,
                  o = t.startIndex;
                null == n || n({ endIndex: r, startIndex: o });
              },
            ),
              e.detachDragEndListener());
          }),
          P(e, "handleLeaveWrapper", function () {
            (e.state.isTravellerMoving || e.state.isSlideMoving) &&
              (e.leaveTimer = window.setTimeout(
                e.handleDragEnd,
                e.props.leaveTimeOut,
              ));
          }),
          P(e, "handleEnterSlideOrTraveller", function () {
            e.setState({ isTextActive: !0 });
          }),
          P(e, "handleLeaveSlideOrTraveller", function () {
            e.setState({ isTextActive: !1 });
          }),
          P(e, "handleSlideDragStart", function (t) {
            var r = M(t) ? t.changedTouches[0] : t;
            (e.setState({
              isTravellerMoving: !1,
              isSlideMoving: !0,
              slideMoveStartX: r.pageX,
            }),
              e.attachDragEndListener());
          }),
          (e.travellerDragStartHandlers = {
            startX: e.handleTravellerDragStart.bind(e, "startX"),
            endX: e.handleTravellerDragStart.bind(e, "endX"),
          }),
          (e.state = {}),
          e
        );
      }
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      return (
        (s.prototype = Object.create(t && t.prototype, {
          constructor: { value: s, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(s, "prototype", { writable: !1 }),
        t && S(s, t),
        (n = [
          {
            key: "componentWillUnmount",
            value: function () {
              (this.leaveTimer &&
                (clearTimeout(this.leaveTimer), (this.leaveTimer = null)),
                this.detachDragEndListener());
            },
          },
          {
            key: "getIndex",
            value: function (t) {
              var e = t.startX,
                r = t.endX,
                n = this.state.scaleValues,
                o = this.props,
                i = o.gap,
                a = o.data.length - 1,
                u = Math.min(e, r),
                c = Math.max(e, r),
                l = s.getIndexInRange(n, u),
                f = s.getIndexInRange(n, c);
              return {
                startIndex: l - (l % i),
                endIndex: f === a ? a : f - (f % i),
              };
            },
          },
          {
            key: "getTextOfTick",
            value: function (t) {
              var e = this.props,
                r = e.data,
                n = e.tickFormatter,
                i = e.dataKey,
                a = (0, c.K)(r[t], i, t);
              return (0, o.default)(n) ? n(a, t) : a;
            },
          },
          {
            key: "attachDragEndListener",
            value: function () {
              (window.addEventListener("mouseup", this.handleDragEnd, !0),
                window.addEventListener("touchend", this.handleDragEnd, !0),
                window.addEventListener("mousemove", this.handleDrag, !0));
            },
          },
          {
            key: "detachDragEndListener",
            value: function () {
              (window.removeEventListener("mouseup", this.handleDragEnd, !0),
                window.removeEventListener("touchend", this.handleDragEnd, !0),
                window.removeEventListener("mousemove", this.handleDrag, !0));
            },
          },
          {
            key: "handleSlideDrag",
            value: function (t) {
              var e = this.state,
                r = e.slideMoveStartX,
                n = e.startX,
                o = e.endX,
                i = this.props,
                a = i.x,
                u = i.width,
                c = i.travellerWidth,
                l = i.startIndex,
                s = i.endIndex,
                f = i.onChange,
                p = t.pageX - r;
              p > 0
                ? (p = Math.min(p, a + u - c - o, a + u - c - n))
                : p < 0 && (p = Math.max(p, a - n, a - o));
              var d = this.getIndex({ startX: n + p, endX: o + p });
              ((d.startIndex !== l || d.endIndex !== s) && f && f(d),
                this.setState({
                  startX: n + p,
                  endX: o + p,
                  slideMoveStartX: t.pageX,
                }));
            },
          },
          {
            key: "handleTravellerDragStart",
            value: function (t, e) {
              var r = M(e) ? e.changedTouches[0] : e;
              (this.setState({
                isSlideMoving: !1,
                isTravellerMoving: !0,
                movingTravellerId: t,
                brushMoveStartX: r.pageX,
              }),
                this.attachDragEndListener());
            },
          },
          {
            key: "handleTravellerMove",
            value: function (t) {
              var e = this.state,
                r = e.brushMoveStartX,
                n = e.movingTravellerId,
                o = e.endX,
                i = e.startX,
                a = this.state[n],
                u = this.props,
                c = u.x,
                l = u.width,
                s = u.travellerWidth,
                f = u.onChange,
                p = u.gap,
                d = u.data,
                h = { startX: this.state.startX, endX: this.state.endX },
                y = t.pageX - r;
              (y > 0
                ? (y = Math.min(y, c + l - s - a))
                : y < 0 && (y = Math.max(y, c - a)),
                (h[n] = a + y));
              var v = this.getIndex(h),
                m = v.startIndex,
                b = v.endIndex,
                g = function () {
                  var t = d.length - 1;
                  return (
                    ("startX" === n && (o > i ? m % p == 0 : b % p == 0)) ||
                    (!!(o < i) && b === t) ||
                    ("endX" === n && (o > i ? b % p == 0 : m % p == 0)) ||
                    (!!(o > i) && b === t)
                  );
                };
              this.setState(
                P(P({}, n, a + y), "brushMoveStartX", t.pageX),
                function () {
                  f && g() && f(v);
                },
              );
            },
          },
          {
            key: "handleTravellerMoveKeyboard",
            value: function (t, e) {
              var r = this,
                n = this.state,
                o = n.scaleValues,
                i = n.startX,
                a = n.endX,
                u = this.state[e],
                c = o.indexOf(u);
              if (-1 !== c) {
                var l = c + t;
                if (-1 !== l && !(l >= o.length)) {
                  var s = o[l];
                  ("startX" === e && s >= a) ||
                    ("endX" === e && s <= i) ||
                    this.setState(P({}, e, s), function () {
                      r.props.onChange(
                        r.getIndex({
                          startX: r.state.startX,
                          endX: r.state.endX,
                        }),
                      );
                    });
                }
              }
            },
          },
          {
            key: "renderBackground",
            value: function () {
              var t = this.props,
                r = t.x,
                n = t.y,
                o = t.width,
                i = t.height,
                a = t.fill,
                u = t.stroke;
              return e.default.createElement("rect", {
                stroke: u,
                fill: a,
                x: r,
                y: n,
                width: o,
                height: i,
              });
            },
          },
          {
            key: "renderPanorama",
            value: function () {
              var t = this.props,
                r = t.x,
                n = t.y,
                o = t.width,
                i = t.height,
                a = t.data,
                u = t.children,
                c = t.padding,
                l = e.Children.only(u);
              return l
                ? e.default.cloneElement(l, {
                    x: r,
                    y: n,
                    width: o,
                    height: i,
                    margin: c,
                    compact: !0,
                    data: a,
                  })
                : null;
            },
          },
          {
            key: "renderTravellerLayer",
            value: function (t, r) {
              var n,
                o,
                i = this,
                u = this.props,
                c = u.y,
                l = u.travellerWidth,
                f = u.height,
                p = u.traveller,
                d = u.ariaLabel,
                h = u.data,
                y = u.startIndex,
                m = u.endIndex,
                b = Math.max(t, this.props.x),
                g = x(
                  x({}, (0, v.T)(this.props, !1)),
                  {},
                  { x: b, y: c, width: l, height: f },
                ),
                O =
                  d ||
                  "Min value: "
                    .concat(
                      null == (n = h[y]) ? void 0 : n.name,
                      ", Max value: ",
                    )
                    .concat(null == (o = h[m]) ? void 0 : o.name);
              return e.default.createElement(
                a.f,
                {
                  tabIndex: 0,
                  role: "slider",
                  "aria-label": O,
                  "aria-valuenow": t,
                  className: "recharts-brush-traveller",
                  onMouseEnter: this.handleEnterSlideOrTraveller,
                  onMouseLeave: this.handleLeaveSlideOrTraveller,
                  onMouseDown: this.travellerDragStartHandlers[r],
                  onTouchStart: this.travellerDragStartHandlers[r],
                  onKeyDown: function (t) {
                    ["ArrowLeft", "ArrowRight"].includes(t.key) &&
                      (t.preventDefault(),
                      t.stopPropagation(),
                      i.handleTravellerMoveKeyboard(
                        "ArrowRight" === t.key ? 1 : -1,
                        r,
                      ));
                  },
                  onFocus: function () {
                    i.setState({ isTravellerFocused: !0 });
                  },
                  onBlur: function () {
                    i.setState({ isTravellerFocused: !1 });
                  },
                  style: { cursor: "col-resize" },
                },
                s.renderTraveller(p, g),
              );
            },
          },
          {
            key: "renderSlide",
            value: function (t, r) {
              var n = this.props,
                o = n.y,
                i = n.height,
                a = n.stroke,
                u = n.travellerWidth,
                c = Math.min(t, r) + u,
                l = Math.max(Math.abs(r - t) - u, 0);
              return e.default.createElement("rect", {
                className: "recharts-brush-slide",
                onMouseEnter: this.handleEnterSlideOrTraveller,
                onMouseLeave: this.handleLeaveSlideOrTraveller,
                onMouseDown: this.handleSlideDragStart,
                onTouchStart: this.handleSlideDragStart,
                style: { cursor: "move" },
                stroke: "none",
                fill: a,
                fillOpacity: 0.2,
                x: c,
                y: o,
                width: l,
                height: i,
              });
            },
          },
          {
            key: "renderText",
            value: function () {
              var t = this.props,
                r = t.startIndex,
                n = t.endIndex,
                o = t.y,
                i = t.height,
                c = t.travellerWidth,
                l = t.stroke,
                s = this.state,
                f = s.startX,
                p = s.endX,
                d = { pointerEvents: "none", fill: l };
              return e.default.createElement(
                a.f,
                { className: "recharts-brush-texts" },
                e.default.createElement(
                  u.f,
                  b(
                    {
                      textAnchor: "end",
                      verticalAnchor: "middle",
                      x: Math.min(f, p) - 5,
                      y: o + i / 2,
                    },
                    d,
                  ),
                  this.getTextOfTick(r),
                ),
                e.default.createElement(
                  u.f,
                  b(
                    {
                      textAnchor: "start",
                      verticalAnchor: "middle",
                      x: Math.max(f, p) + c + 5,
                      y: o + i / 2,
                    },
                    d,
                  ),
                  this.getTextOfTick(n),
                ),
              );
            },
          },
          {
            key: "render",
            value: function () {
              var t = this.props,
                n = t.data,
                o = t.className,
                i = t.children,
                u = t.x,
                c = t.y,
                s = t.width,
                f = t.height,
                p = t.alwaysShowText,
                d = this.state,
                h = d.startX,
                v = d.endX,
                m = d.isTextActive,
                b = d.isSlideMoving,
                g = d.isTravellerMoving,
                x = d.isTravellerFocused;
              if (
                !n ||
                !n.length ||
                !(0, l.H)(u) ||
                !(0, l.H)(c) ||
                !(0, l.H)(s) ||
                !(0, l.H)(f) ||
                s <= 0 ||
                f <= 0
              )
                return null;
              var O = (0, r.U)("recharts-brush", o),
                w = 1 === e.default.Children.count(i),
                j = y("userSelect", "none");
              return e.default.createElement(
                a.f,
                {
                  className: O,
                  onMouseLeave: this.handleLeaveWrapper,
                  onTouchMove: this.handleTouchMove,
                  style: j,
                },
                this.renderBackground(),
                w && this.renderPanorama(),
                this.renderSlide(h, v),
                this.renderTravellerLayer(h, "startX"),
                this.renderTravellerLayer(v, "endX"),
                (m || b || g || x || p) && this.renderText(),
              );
            },
          },
        ]),
        (i = [
          {
            key: "renderDefaultTraveller",
            value: function (t) {
              var r = t.x,
                n = t.y,
                o = t.width,
                i = t.height,
                a = t.stroke,
                u = Math.floor(n + i / 2) - 1;
              return e.default.createElement(
                e.default.Fragment,
                null,
                e.default.createElement("rect", {
                  x: r,
                  y: n,
                  width: o,
                  height: i,
                  fill: a,
                  stroke: "none",
                }),
                e.default.createElement("line", {
                  x1: r + 1,
                  y1: u,
                  x2: r + o - 1,
                  y2: u,
                  fill: "none",
                  stroke: "#fff",
                }),
                e.default.createElement("line", {
                  x1: r + 1,
                  y1: u + 2,
                  x2: r + o - 1,
                  y2: u + 2,
                  fill: "none",
                  stroke: "#fff",
                }),
              );
            },
          },
          {
            key: "renderTraveller",
            value: function (t, r) {
              return e.default.isValidElement(t)
                ? e.default.cloneElement(t, r)
                : (0, o.default)(t)
                  ? t(r)
                  : s.renderDefaultTraveller(r);
            },
          },
          {
            key: "getDerivedStateFromProps",
            value: function (t, e) {
              var r = t.data,
                n = t.width,
                o = t.x,
                i = t.travellerWidth,
                a = t.updateId,
                u = t.startIndex,
                c = t.endIndex;
              if (r !== e.prevData || a !== e.prevUpdateId)
                return x(
                  {
                    prevData: r,
                    prevTravellerWidth: i,
                    prevUpdateId: a,
                    prevX: o,
                    prevWidth: n,
                  },
                  r && r.length
                    ? E({
                        data: r,
                        width: n,
                        x: o,
                        travellerWidth: i,
                        startIndex: u,
                        endIndex: c,
                      })
                    : { scale: null, scaleValues: null },
                );
              if (
                e.scale &&
                (n !== e.prevWidth ||
                  o !== e.prevX ||
                  i !== e.prevTravellerWidth)
              ) {
                e.scale.range([o, o + n - i]);
                var l = e.scale.domain().map(function (t) {
                  return e.scale(t);
                });
                return {
                  prevData: r,
                  prevTravellerWidth: i,
                  prevUpdateId: a,
                  prevX: o,
                  prevWidth: n,
                  startX: e.scale(t.startIndex),
                  endX: e.scale(t.endIndex),
                  scaleValues: l,
                };
              }
              return null;
            },
          },
          {
            key: "getIndexInRange",
            value: function (t, e) {
              for (var r = t.length, n = 0, o = r - 1; o - n > 1; ) {
                var i = Math.floor((n + o) / 2);
                t[i] > e ? (o = i) : (n = i);
              }
              return e >= t[o] ? o : n;
            },
          },
        ]),
        n && O(s.prototype, n),
        i && O(s, i),
        Object.defineProperty(s, "prototype", { writable: !1 }),
        s
      );
    })(e.PureComponent);
  (P(k, "displayName", "Brush"),
    P(k, "defaultProps", {
      height: 40,
      travellerWidth: 5,
      gap: 1,
      fill: "#fff",
      stroke: "#666",
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
      leaveTimeOut: 1e3,
      alwaysShowText: !1,
    }),
    t.s(["f", 0, k], 785743),
    t.s(
      [
        "f",
        0,
        function (t, e) {
          var r = t.alwaysShow,
            n = t.ifOverflow;
          return (r && (n = "extendDomain"), n === e);
        },
      ],
      974406,
    ));
};
