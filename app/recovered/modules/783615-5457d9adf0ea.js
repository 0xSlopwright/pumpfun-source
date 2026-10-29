// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(358424),
    n = t.i(796388),
    o = t.i(527750),
    i = t.i(995066),
    a = t.i(352195),
    u = t.i(219412),
    c = t.i(334236),
    l = t.i(759299),
    s = t.i(460605),
    f = t.i(114605),
    p = t.i(211986),
    d = t.i(12669),
    h = t.i(373593),
    y = t.i(814826),
    v = t.i(472737),
    m = t.i(454133),
    b = t.i(462931),
    g = t.i(7284),
    x = t.i(49647),
    O = t.i(871791),
    w = t.i(756438);
  function j(t) {
    return (j =
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
  function S() {
    return (S = Object.assign.bind()).apply(this, arguments);
  }
  function P(t, e) {
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
  function A(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? P(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != j(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != j(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == j(e) ? e : e + "";
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
          : P(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var E = {
      curveBasisClosed: o.f,
      curveBasisOpen: i.f,
      curveBasis: a.f,
      curveBumpX: u.f,
      curveBumpY: c.f,
      curveLinearClosed: l.f,
      curveLinear: s.f,
      curveMonotoneX: f.f,
      curveMonotoneY: p.f,
      curveNatural: d.f,
      curveStep: h.f,
      curveStepAfter: y.f,
      curveStepBefore: v.f,
    },
    M = function (t) {
      return t.x === +t.x && t.y === +t.y;
    },
    k = function (t) {
      return t.x;
    },
    T = function (t) {
      return t.y;
    },
    _ = function (t, e) {
      if ((0, b.default)(t)) return t;
      var r = "curve".concat((0, m.default)(t));
      return ("curveMonotone" === r || "curveBump" === r) && e
        ? E["".concat(r).concat("vertical" === e ? "Y" : "X")]
        : E[r] || s.f;
    },
    C = function (t) {
      var e,
        o = t.type,
        i = t.points,
        a = void 0 === i ? [] : i,
        u = t.baseLine,
        c = t.layout,
        l = t.connectNulls,
        s = void 0 !== l && l,
        f = _(void 0 === o ? "linear" : o, c),
        p = s
          ? a.filter(function (t) {
              return M(t);
            })
          : a;
      if (Array.isArray(u)) {
        var d = s
            ? u.filter(function (t) {
                return M(t);
              })
            : u,
          h = p.map(function (t, e) {
            return A(A({}, t), {}, { base: d[e] });
          });
        return (
          (e =
            "vertical" === c
              ? (0, n.f)()
                  .y(T)
                  .x1(k)
                  .x0(function (t) {
                    return t.base.x;
                  })
              : (0, n.f)()
                  .x(k)
                  .y1(T)
                  .y0(function (t) {
                    return t.base.y;
                  }))
            .defined(M)
            .curve(f),
          e(h)
        );
      }
      return (
        (e =
          "vertical" === c && (0, w.H)(u)
            ? (0, n.f)().y(T).x1(k).x0(u)
            : (0, w.H)(u)
              ? (0, n.f)().x(k).y1(T).y0(u)
              : (0, r.f)().x(k).y(T))
          .defined(M)
          .curve(f),
        e(p)
      );
    };
  t.s([
    "f",
    0,
    function (t) {
      var r = t.className,
        n = t.points,
        o = t.path,
        i = t.pathRef;
      if ((!n || !n.length) && !o) return null;
      var a = n && n.length ? C(t) : o;
      return e.default.createElement(
        "path",
        S({}, (0, O.T)(t, !1), (0, x.e)(t), {
          className: (0, g.U)("recharts-curve", r),
          d: a,
          ref: i,
        }),
      );
    },
  ]);
};
