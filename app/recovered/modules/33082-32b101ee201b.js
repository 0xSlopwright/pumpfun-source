// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(304153);
  let { getOwnPropertyNames: n, getOwnPropertySymbols: o } = Object,
    { hasOwnProperty: i } = Object.prototype;
  function a(t, e) {
    return function (r, n, o) {
      return t(r, n, o) && e(r, n, o);
    };
  }
  function u(t) {
    return function (e, r, n) {
      if (!e || !r || "object" != typeof e || "object" != typeof r)
        return t(e, r, n);
      let { cache: o } = n,
        i = o.get(e),
        a = o.get(r);
      if (i && a) return i === r && a === e;
      (o.set(e, r), o.set(r, e));
      let u = t(e, r, n);
      return (o.delete(e), o.delete(r), u);
    };
  }
  function c(t) {
    return n(t).concat(o(t));
  }
  let l = Object.hasOwn || ((t, e) => i.call(t, e));
  function s(t, e) {
    return t === e || (!t && !e && t != t && e != e);
  }
  let { getOwnPropertyDescriptor: f, keys: p } = Object;
  function d(t, e) {
    return (
      t.byteLength === e.byteLength && P(new Uint8Array(t), new Uint8Array(e))
    );
  }
  function h(t, e, r) {
    let n = t.length;
    if (e.length !== n) return !1;
    for (; n-- > 0; ) if (!r.equals(t[n], e[n], n, n, t, e, r)) return !1;
    return !0;
  }
  function y(t, e) {
    return (
      t.byteLength === e.byteLength &&
      P(
        new Uint8Array(t.buffer, t.byteOffset, t.byteLength),
        new Uint8Array(e.buffer, e.byteOffset, e.byteLength),
      )
    );
  }
  function v(t, e) {
    return s(t.getTime(), e.getTime());
  }
  function m(t, e) {
    return (
      t.name === e.name &&
      t.message === e.message &&
      t.cause === e.cause &&
      t.stack === e.stack
    );
  }
  function b(t, e) {
    return t === e;
  }
  function g(t, e, r) {
    let n,
      o,
      i = t.size;
    if (i !== e.size) return !1;
    if (!i) return !0;
    let a = Array(i),
      u = t.entries(),
      c = 0;
    for (; (n = u.next()) && !n.done; ) {
      let i = e.entries(),
        u = !1,
        l = 0;
      for (; (o = i.next()) && !o.done; ) {
        if (a[l]) {
          l++;
          continue;
        }
        let i = n.value,
          s = o.value;
        if (
          r.equals(i[0], s[0], c, l, t, e, r) &&
          r.equals(i[1], s[1], i[0], s[0], t, e, r)
        ) {
          u = a[l] = !0;
          break;
        }
        l++;
      }
      if (!u) return !1;
      c++;
    }
    return !0;
  }
  function x(t, e, r) {
    let n = p(t),
      o = n.length;
    if (p(e).length !== o) return !1;
    for (; o-- > 0; ) if (!E(t, e, r, n[o])) return !1;
    return !0;
  }
  function O(t, e, r) {
    let n,
      o,
      i,
      a = c(t),
      u = a.length;
    if (c(e).length !== u) return !1;
    for (; u-- > 0; )
      if (
        !E(t, e, r, (n = a[u])) ||
        ((o = f(t, n)),
        (i = f(e, n)),
        (o || i) &&
          (!o ||
            !i ||
            o.configurable !== i.configurable ||
            o.enumerable !== i.enumerable ||
            o.writable !== i.writable))
      )
        return !1;
    return !0;
  }
  function w(t, e) {
    return s(t.valueOf(), e.valueOf());
  }
  function j(t, e) {
    return t.source === e.source && t.flags === e.flags;
  }
  function S(t, e, r) {
    let n,
      o,
      i = t.size;
    if (i !== e.size) return !1;
    if (!i) return !0;
    let a = Array(i),
      u = t.values();
    for (; (n = u.next()) && !n.done; ) {
      let i = e.values(),
        u = !1,
        c = 0;
      for (; (o = i.next()) && !o.done; ) {
        if (!a[c] && r.equals(n.value, o.value, n.value, o.value, t, e, r)) {
          u = a[c] = !0;
          break;
        }
        c++;
      }
      if (!u) return !1;
    }
    return !0;
  }
  function P(t, e) {
    let r = t.byteLength;
    if (e.byteLength !== r || t.byteOffset !== e.byteOffset) return !1;
    for (; r-- > 0; ) if (t[r] !== e[r]) return !1;
    return !0;
  }
  function A(t, e) {
    return (
      t.hostname === e.hostname &&
      t.pathname === e.pathname &&
      t.protocol === e.protocol &&
      t.port === e.port &&
      t.hash === e.hash &&
      t.username === e.username &&
      t.password === e.password
    );
  }
  function E(t, e, r, n) {
    return (
      (("_owner" === n || "__o" === n || "__v" === n) &&
        (!!t.$$typeof || !!e.$$typeof)) ||
      (l(e, n) && r.equals(t[n], e[n], n, n, t, e, r))
    );
  }
  let M = {
      "[object Int8Array]": !0,
      "[object Uint8Array]": !0,
      "[object Uint8ClampedArray]": !0,
      "[object Int16Array]": !0,
      "[object Uint16Array]": !0,
      "[object Int32Array]": !0,
      "[object Uint32Array]": !0,
      "[object Float16Array]": !0,
      "[object Float32Array]": !0,
      "[object Float64Array]": !0,
      "[object BigInt64Array]": !0,
      "[object BigUint64Array]": !0,
    },
    k = Object.prototype.toString,
    T = _();
  function _(t = {}) {
    let {
        circular: e = !1,
        createInternalComparator: r,
        createState: n,
        strict: o = !1,
      } = t,
      i = (function ({
        areArrayBuffersEqual: t,
        areArraysEqual: e,
        areDataViewsEqual: r,
        areDatesEqual: n,
        areErrorsEqual: o,
        areFunctionsEqual: i,
        areMapsEqual: a,
        areNumbersEqual: u,
        areObjectsEqual: c,
        arePrimitiveWrappersEqual: l,
        areRegExpsEqual: s,
        areSetsEqual: f,
        areTypedArraysEqual: p,
        areUrlsEqual: d,
        unknownTagComparators: h,
      }) {
        return function (y, v, m) {
          if (y === v) return !0;
          if (null == y || null == v) return !1;
          let b = typeof y;
          if (b !== typeof v) return !1;
          if ("object" !== b)
            return "number" === b ? u(y, v, m) : "function" === b && i(y, v, m);
          let g = y.constructor;
          if (g !== v.constructor) return !1;
          if (g === Object) return c(y, v, m);
          if (Array.isArray(y)) return e(y, v, m);
          if (g === Date) return n(y, v, m);
          if (g === RegExp) return s(y, v, m);
          if (g === Map) return a(y, v, m);
          if (g === Set) return f(y, v, m);
          let x = k.call(y);
          if ("[object Date]" === x) return n(y, v, m);
          if ("[object RegExp]" === x) return s(y, v, m);
          if ("[object Map]" === x) return a(y, v, m);
          if ("[object Set]" === x) return f(y, v, m);
          if ("[object Object]" === x)
            return (
              "function" != typeof y.then &&
              "function" != typeof v.then &&
              c(y, v, m)
            );
          if ("[object URL]" === x) return d(y, v, m);
          if ("[object Error]" === x) return o(y, v, m);
          if ("[object Arguments]" === x) return c(y, v, m);
          if (M[x]) return p(y, v, m);
          if ("[object ArrayBuffer]" === x) return t(y, v, m);
          if ("[object DataView]" === x) return r(y, v, m);
          if (
            "[object Boolean]" === x ||
            "[object Number]" === x ||
            "[object String]" === x
          )
            return l(y, v, m);
          if (h) {
            let t = h[x];
            if (!t) {
              let e = null != y ? y[Symbol.toStringTag] : void 0;
              e && (t = h[e]);
            }
            if (t) return t(y, v, m);
          }
          return !1;
        };
      })(
        (function ({ circular: t, createCustomConfig: e, strict: r }) {
          let n = {
            areArrayBuffersEqual: d,
            areArraysEqual: r ? O : h,
            areDataViewsEqual: y,
            areDatesEqual: v,
            areErrorsEqual: m,
            areFunctionsEqual: b,
            areMapsEqual: r ? a(g, O) : g,
            areNumbersEqual: s,
            areObjectsEqual: r ? O : x,
            arePrimitiveWrappersEqual: w,
            areRegExpsEqual: j,
            areSetsEqual: r ? a(S, O) : S,
            areTypedArraysEqual: r ? a(P, O) : P,
            areUrlsEqual: A,
            unknownTagComparators: void 0,
          };
          if ((e && (n = Object.assign({}, n, e(n))), t)) {
            let t = u(n.areArraysEqual),
              e = u(n.areMapsEqual),
              r = u(n.areObjectsEqual),
              o = u(n.areSetsEqual);
            n = Object.assign({}, n, {
              areArraysEqual: t,
              areMapsEqual: e,
              areObjectsEqual: r,
              areSetsEqual: o,
            });
          }
          return n;
        })(t),
      ),
      c = r
        ? r(i)
        : function (t, e, r, n, o, a, u) {
            return i(t, e, u);
          };
    return (function ({
      circular: t,
      comparator: e,
      createState: r,
      equals: n,
      strict: o,
    }) {
      if (r)
        return function (i, a) {
          let { cache: u = t ? new WeakMap() : void 0, meta: c } = r();
          return e(i, a, { cache: u, equals: n, meta: c, strict: o });
        };
      if (t)
        return function (t, r) {
          return e(t, r, {
            cache: new WeakMap(),
            equals: n,
            meta: void 0,
            strict: o,
          });
        };
      let i = { cache: void 0, equals: n, meta: void 0, strict: o };
      return function (t, r) {
        return e(t, r, i);
      };
    })({ circular: e, comparator: i, createState: n, equals: c, strict: o });
  }
  function C(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
      r = -1;
    requestAnimationFrame(function n(o) {
      if ((r < 0 && (r = o), o - r > e)) (t(o), (r = -1));
      else {
        var i;
        ((i = n),
          "u" > typeof requestAnimationFrame && requestAnimationFrame(i));
      }
    });
  }
  function I(t) {
    return (I =
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
  function D(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function N(t) {
    return (N =
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
  function B(t, e) {
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
  function R(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? B(Object(r), !0).forEach(function (e) {
            L(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : B(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function L(t, e, r) {
    var n;
    return (
      ((n = (function (t, e) {
        if ("object" !== N(t) || null === t) return t;
        var r = t[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(t, e || "default");
          if ("object" !== N(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(e, "string")),
      (e = "symbol" === N(n) ? n : String(n)) in t)
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
  (_({ strict: !0 }),
    _({ circular: !0 }),
    _({ circular: !0, strict: !0 }),
    _({ createInternalComparator: () => s }),
    _({ strict: !0, createInternalComparator: () => s }),
    _({ circular: !0, createInternalComparator: () => s }),
    _({ circular: !0, createInternalComparator: () => s, strict: !0 }));
  var U = function (t) {
      return t;
    },
    z = function (t, e) {
      return Object.keys(e).reduce(function (r, n) {
        return R(R({}, r), {}, L({}, n, t(n, e[n])));
      }, {});
    },
    $ = function (t, e, r) {
      return t
        .map(function (t) {
          return ""
            .concat(
              t.replace(/([A-Z])/g, function (t) {
                return "-".concat(t.toLowerCase());
              }),
              " ",
            )
            .concat(e, "ms ")
            .concat(r);
        })
        .join(",");
    },
    H = function (t, e, r, n, o, i, a, u) {};
  function F(t, e) {
    if (t) {
      if ("string" == typeof t) return W(t, e);
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
        return W(t, e);
    }
  }
  function W(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  var X = function (t, e) {
      return [0, 3 * t, 3 * e - 6 * t, 3 * t - 3 * e + 1];
    },
    q = function (t, e) {
      return t
        .map(function (t, r) {
          return t * Math.pow(e, r);
        })
        .reduce(function (t, e) {
          return t + e;
        });
    },
    V = function (t, e) {
      return function (r) {
        return q(X(t, e), r);
      };
    },
    G = function () {
      for (var t, e, r = arguments.length, n = Array(r), o = 0; o < r; o++)
        n[o] = arguments[o];
      var i = n[0],
        a = n[1],
        u = n[2],
        c = n[3];
      if (1 === n.length)
        switch (n[0]) {
          case "linear":
            ((i = 0), (a = 0), (u = 1), (c = 1));
            break;
          case "ease":
            ((i = 0.25), (a = 0.1), (u = 0.25), (c = 1));
            break;
          case "ease-in":
            ((i = 0.42), (a = 0), (u = 1), (c = 1));
            break;
          case "ease-out":
            ((i = 0.42), (a = 0), (u = 0.58), (c = 1));
            break;
          case "ease-in-out":
            ((i = 0), (a = 0), (u = 0.58), (c = 1));
            break;
          default:
            var l = n[0].split("(");
            if (
              "cubic-bezier" === l[0] &&
              4 === l[1].split(")")[0].split(",").length
            ) {
              var s,
                f =
                  (function (t) {
                    if (Array.isArray(t)) return t;
                  })(
                    (s = l[1]
                      .split(")")[0]
                      .split(",")
                      .map(function (t) {
                        return parseFloat(t);
                      })),
                  ) ||
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
                          (a.push(r.value), 4 !== a.length);
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
                  })(s) ||
                  F(s, 4) ||
                  (function () {
                    throw TypeError(
                      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                    );
                  })();
              ((i = f[0]), (a = f[1]), (u = f[2]), (c = f[3]));
            } else
              H(
                !1,
                "[configBezier]: arguments should be one of oneOf 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out','cubic-bezier(x1,y1,x2,y2)', instead received %s",
                n,
              );
        }
      H(
        [i, u, a, c].every(function (t) {
          return "number" == typeof t && t >= 0 && t <= 1;
        }),
        "[configBezier]: arguments should be x1, y1, x2, y2 of [0, 1] instead received %s",
        n,
      );
      var p = V(i, u),
        d = V(a, c),
        h =
          ((t = i),
          (e = u),
          function (r) {
            var n;
            return q(
              [].concat(
                (function (t) {
                  if (Array.isArray(t)) return W(t);
                })(
                  (n = X(t, e)
                    .map(function (t, e) {
                      return t * e;
                    })
                    .slice(1)),
                ) ||
                  (function (t) {
                    if (
                      ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
                      null != t["@@iterator"]
                    )
                      return Array.from(t);
                  })(n) ||
                  F(n) ||
                  (function () {
                    throw TypeError(
                      "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                    );
                  })(),
                [0],
              ),
              r,
            );
          }),
        y = function (t) {
          for (var e = t > 1 ? 1 : t, r = e, n = 0; n < 8; ++n) {
            var o,
              i = p(r) - e,
              a = h(r);
            if (1e-4 > Math.abs(i - e) || a < 1e-4) break;
            r = (o = r - i / a) > 1 ? 1 : o < 0 ? 0 : o;
          }
          return d(r);
        };
      return ((y.isStepper = !1), y);
    },
    Y = function () {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        e = t.stiff,
        r = void 0 === e ? 100 : e,
        n = t.damping,
        o = void 0 === n ? 8 : n,
        i = t.dt,
        a = void 0 === i ? 17 : i,
        u = function (t, e, n) {
          var i = n + ((-(t - e) * r - n * o) * a) / 1e3,
            u = (n * a) / 1e3 + t;
          return 1e-4 > Math.abs(u - e) && 1e-4 > Math.abs(i) ? [e, 0] : [u, i];
        };
      return ((u.isStepper = !0), (u.dt = a), u);
    },
    K = function () {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      var n = e[0];
      if ("string" == typeof n)
        switch (n) {
          case "ease":
          case "ease-in-out":
          case "ease-out":
          case "ease-in":
          case "linear":
            return G(n);
          case "spring":
            return Y();
          default:
            if ("cubic-bezier" === n.split("(")[0]) return G(n);
            H(
              !1,
              "[configEasing]: first argument should be one of 'ease', 'ease-in', 'ease-out', 'ease-in-out','cubic-bezier(x1,y1,x2,y2)', 'linear' and 'spring', instead  received %s",
              e,
            );
        }
      return "function" == typeof n
        ? n
        : (H(
            !1,
            "[configEasing]: first argument type should be function or string, instead received %s",
            e,
          ),
          null);
    };
  function Z(t) {
    return (Z =
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
  function J(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return tn(t);
      })(t) ||
      (function (t) {
        if (
          ("u" > typeof Symbol && null != t[Symbol.iterator]) ||
          null != t["@@iterator"]
        )
          return Array.from(t);
      })(t) ||
      tr(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function Q(t, e) {
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
  function tt(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? Q(Object(r), !0).forEach(function (e) {
            te(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : Q(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function te(t, e, r) {
    var n;
    return (
      ((n = (function (t, e) {
        if ("object" !== Z(t) || null === t) return t;
        var r = t[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(t, e || "default");
          if ("object" !== Z(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(e, "string")),
      (e = "symbol" === Z(n) ? n : String(n)) in t)
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
  function tr(t, e) {
    if (t) {
      if ("string" == typeof t) return tn(t, e);
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
        return tn(t, e);
    }
  }
  function tn(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  var to = function (t, e, r) {
      return t + (e - t) * r;
    },
    ti = function (t) {
      return t.from !== t.to;
    },
    ta = function t(e, r, n) {
      var o = z(function (t, r) {
        if (ti(r)) {
          var n,
            o =
              (function (t) {
                if (Array.isArray(t)) return t;
              })((n = e(r.from, r.to, r.velocity))) ||
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
              })(n) ||
              tr(n, 2) ||
              (function () {
                throw TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })(),
            i = o[0],
            a = o[1];
          return tt(tt({}, r), {}, { from: i, velocity: a });
        }
        return r;
      }, r);
      return n < 1
        ? z(function (t, e) {
            return ti(e)
              ? tt(
                  tt({}, e),
                  {},
                  {
                    velocity: to(e.velocity, o[t].velocity, n),
                    from: to(e.from, o[t].from, n),
                  },
                )
              : e;
          }, r)
        : t(e, o, n - 1);
    };
  let tu = function (t, e, r, n, o) {
    var i,
      a,
      u = [Object.keys(t), Object.keys(e)].reduce(function (t, e) {
        return t.filter(function (t) {
          return e.includes(t);
        });
      }),
      c = u.reduce(function (r, n) {
        return tt(tt({}, r), {}, te({}, n, [t[n], e[n]]));
      }, {}),
      l = u.reduce(function (r, n) {
        return tt(
          tt({}, r),
          {},
          te({}, n, { from: t[n], velocity: 0, to: e[n] }),
        );
      }, {}),
      s = -1,
      f = function () {
        return null;
      };
    return (
      (f = r.isStepper
        ? function (n) {
            i || (i = n);
            var a = (n - i) / r.dt;
            ((l = ta(r, l, a)),
              o(
                tt(
                  tt(tt({}, t), e),
                  z(function (t, e) {
                    return e.from;
                  }, l),
                ),
              ),
              (i = n),
              Object.values(l).filter(ti).length &&
                (s = requestAnimationFrame(f)));
          }
        : function (i) {
            a || (a = i);
            var u = (i - a) / n,
              l = z(function (t, e) {
                return to.apply(void 0, J(e).concat([r(u)]));
              }, c);
            if ((o(tt(tt(tt({}, t), e), l)), u < 1))
              s = requestAnimationFrame(f);
            else {
              var p = z(function (t, e) {
                return to.apply(void 0, J(e).concat([r(1)]));
              }, c);
              o(tt(tt(tt({}, t), e), p));
            }
          }),
      function () {
        return (
          requestAnimationFrame(f),
          function () {
            cancelAnimationFrame(s);
          }
        );
      }
    );
  };
  function tc(t) {
    return (tc =
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
  var tl = [
    "children",
    "begin",
    "duration",
    "attributeName",
    "easing",
    "isActive",
    "steps",
    "from",
    "to",
    "canBegin",
    "onAnimationEnd",
    "shouldReAnimate",
    "onAnimationReStart",
  ];
  function ts(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return tf(t);
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
          if ("string" == typeof t) return tf(t, void 0);
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
            return tf(t, void 0);
        }
      })(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function tf(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function tp(t, e) {
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
  function td(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? tp(Object(r), !0).forEach(function (e) {
            th(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : tp(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
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
      if ("object" !== tc(t) || null === t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" !== tc(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" === tc(e) ? e : String(e);
  }
  function tv(t, e) {
    return (tv = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tm(t, e) {
    if (e && ("object" === tc(e) || "function" == typeof e)) return e;
    if (void 0 !== e)
      throw TypeError(
        "Derived constructors may only return object or undefined",
      );
    return tb(t);
  }
  function tb(t) {
    if (void 0 === t)
      throw ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return t;
  }
  function tg(t) {
    return (tg = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  var tx = (function (t) {
    if ("function" != typeof t && null !== t)
      throw TypeError("Super expression must either be null or a function");
    ((i.prototype = Object.create(t && t.prototype, {
      constructor: { value: i, writable: !0, configurable: !0 },
    })),
      Object.defineProperty(i, "prototype", { writable: !1 }),
      t && tv(i, t));
    var r,
      n,
      o =
        ((r = (function () {
          if (
            "u" < typeof Reflect ||
            !Reflect.construct ||
            Reflect.construct.sham
          )
            return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {}),
              ),
              !0
            );
          } catch (t) {
            return !1;
          }
        })()),
        function () {
          var t,
            e = tg(i);
          return (
            (t = r
              ? Reflect.construct(e, arguments, tg(this).constructor)
              : e.apply(this, arguments)),
            tm(this, t)
          );
        });
    function i(t, e) {
      if (!(this instanceof i))
        throw TypeError("Cannot call a class as a function");
      var r = o.call(this, t, e),
        n = r.props,
        a = n.isActive,
        u = n.attributeName,
        c = n.from,
        l = n.to,
        s = n.steps,
        f = n.children,
        p = n.duration;
      if (
        ((r.handleStyleChange = r.handleStyleChange.bind(tb(r))),
        (r.changeStyle = r.changeStyle.bind(tb(r))),
        !a || p <= 0)
      )
        return (
          (r.state = { style: {} }),
          "function" == typeof f && (r.state = { style: l }),
          tm(r)
        );
      if (s && s.length) r.state = { style: s[0].style };
      else if (c) {
        if ("function" == typeof f) return ((r.state = { style: c }), tm(r));
        r.state = { style: u ? th({}, u, c) : c };
      } else r.state = { style: {} };
      return r;
    }
    return (
      (n = [
        {
          key: "componentDidMount",
          value: function () {
            var t = this.props,
              e = t.isActive,
              r = t.canBegin;
            ((this.mounted = !0), e && r && this.runAnimation(this.props));
          },
        },
        {
          key: "componentDidUpdate",
          value: function (t) {
            var e = this.props,
              r = e.isActive,
              n = e.canBegin,
              o = e.attributeName,
              i = e.shouldReAnimate,
              a = e.to,
              u = e.from,
              c = this.state.style;
            if (n) {
              if (!r) {
                var l = { style: o ? th({}, o, a) : a };
                this.state &&
                  c &&
                  ((o && c[o] !== a) || (!o && c !== a)) &&
                  this.setState(l);
                return;
              }
              if (!T(t.to, a) || !t.canBegin || !t.isActive) {
                var s = !t.canBegin || !t.isActive;
                (this.manager && this.manager.stop(),
                  this.stopJSAnimation && this.stopJSAnimation());
                var f = s || i ? u : t.to;
                if (this.state && c) {
                  var p = { style: o ? th({}, o, f) : f };
                  ((o && c[o] !== f) || (!o && c !== f)) && this.setState(p);
                }
                this.runAnimation(
                  td(td({}, this.props), {}, { from: f, begin: 0 }),
                );
              }
            }
          },
        },
        {
          key: "componentWillUnmount",
          value: function () {
            this.mounted = !1;
            var t = this.props.onAnimationEnd;
            (this.unSubscribe && this.unSubscribe(),
              this.manager && (this.manager.stop(), (this.manager = null)),
              this.stopJSAnimation && this.stopJSAnimation(),
              t && t());
          },
        },
        {
          key: "handleStyleChange",
          value: function (t) {
            this.changeStyle(t);
          },
        },
        {
          key: "changeStyle",
          value: function (t) {
            this.mounted && this.setState({ style: t });
          },
        },
        {
          key: "runJSAnimation",
          value: function (t) {
            var e = this,
              r = t.from,
              n = t.to,
              o = t.duration,
              i = t.easing,
              a = t.begin,
              u = t.onAnimationEnd,
              c = t.onAnimationStart,
              l = tu(r, n, K(i), o, this.changeStyle);
            this.manager.start([
              c,
              a,
              function () {
                e.stopJSAnimation = l();
              },
              o,
              u,
            ]);
          },
        },
        {
          key: "runStepAnimation",
          value: function (t) {
            var e = this,
              r = t.steps,
              n = t.begin,
              o = t.onAnimationStart,
              i = r[0],
              a = i.style,
              u = i.duration;
            return this.manager.start(
              [o].concat(
                ts(
                  r.reduce(
                    function (t, n, o) {
                      if (0 === o) return t;
                      var i = n.duration,
                        a = n.easing,
                        u = void 0 === a ? "ease" : a,
                        c = n.style,
                        l = n.properties,
                        s = n.onAnimationEnd,
                        f = o > 0 ? r[o - 1] : n,
                        p = l || Object.keys(c);
                      if ("function" == typeof u || "spring" === u)
                        return [].concat(ts(t), [
                          e.runJSAnimation.bind(e, {
                            from: f.style,
                            to: c,
                            duration: i,
                            easing: u,
                          }),
                          i,
                        ]);
                      var d = $(p, i, u),
                        h = td(td(td({}, f.style), c), {}, { transition: d });
                      return [].concat(ts(t), [h, i, s]).filter(U);
                    },
                    [a, Math.max(void 0 === u ? 0 : u, n)],
                  ),
                ),
                [t.onAnimationEnd],
              ),
            );
          },
        },
        {
          key: "runAnimation",
          value: function (t) {
            this.manager ||
              (this.manager =
                ((e = function () {
                  return null;
                }),
                (r = !1),
                (n = function t(n) {
                  if (!r) {
                    if (Array.isArray(n)) {
                      if (!n.length) return;
                      var o =
                          (function (t) {
                            if (Array.isArray(t)) return t;
                          })(n) ||
                          (function (t) {
                            if (
                              ("u" > typeof Symbol &&
                                null != t[Symbol.iterator]) ||
                              null != t["@@iterator"]
                            )
                              return Array.from(t);
                          })(n) ||
                          (function (t) {
                            if (t) {
                              if ("string" == typeof t) return D(t, void 0);
                              var e = Object.prototype.toString
                                .call(t)
                                .slice(8, -1);
                              if (
                                ("Object" === e &&
                                  t.constructor &&
                                  (e = t.constructor.name),
                                "Map" === e || "Set" === e)
                              )
                                return Array.from(t);
                              if (
                                "Arguments" === e ||
                                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                  e,
                                )
                              )
                                return D(t, void 0);
                            }
                          })(n) ||
                          (function () {
                            throw TypeError(
                              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                            );
                          })(),
                        i = o[0],
                        a = o.slice(1);
                      return "number" == typeof i
                        ? void C(t.bind(null, a), i)
                        : (t(i), void C(t.bind(null, a)));
                    }
                    ("object" === I(n) && e(n), "function" == typeof n && n());
                  }
                }),
                {
                  stop: function () {
                    r = !0;
                  },
                  start: function (t) {
                    ((r = !1), n(t));
                  },
                  subscribe: function (t) {
                    return (
                      (e = t),
                      function () {
                        e = function () {
                          return null;
                        };
                      }
                    );
                  },
                }));
            var e,
              r,
              n,
              o = t.begin,
              i = t.duration,
              a = t.attributeName,
              u = t.to,
              c = t.easing,
              l = t.onAnimationStart,
              s = t.onAnimationEnd,
              f = t.steps,
              p = t.children,
              d = this.manager;
            if (
              ((this.unSubscribe = d.subscribe(this.handleStyleChange)),
              "function" == typeof c ||
                "function" == typeof p ||
                "spring" === c)
            )
              return void this.runJSAnimation(t);
            if (f.length > 1) return void this.runStepAnimation(t);
            var h = a ? th({}, a, u) : u,
              y = $(Object.keys(h), i, c);
            d.start([l, o, td(td({}, h), {}, { transition: y }), i, s]);
          },
        },
        {
          key: "render",
          value: function () {
            var t = this.props,
              r = t.children,
              n = (t.begin, t.duration),
              o = (t.attributeName, t.easing, t.isActive),
              i =
                (t.steps,
                t.from,
                t.to,
                t.canBegin,
                t.onAnimationEnd,
                t.shouldReAnimate,
                t.onAnimationReStart,
                (function (t, e) {
                  if (null == t) return {};
                  var r,
                    n,
                    o = (function (t, e) {
                      if (null == t) return {};
                      var r,
                        n,
                        o = {},
                        i = Object.keys(t);
                      for (n = 0; n < i.length; n++)
                        ((r = i[n]), e.indexOf(r) >= 0 || (o[r] = t[r]));
                      return o;
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
                })(t, tl)),
              a = e.Children.count(r),
              u = this.state.style;
            if ("function" == typeof r) return r(u);
            if (!o || 0 === a || n <= 0) return r;
            var c = function (t) {
              var r = t.props,
                n = r.style,
                o = r.className;
              return (0, e.cloneElement)(
                t,
                td(
                  td({}, i),
                  {},
                  { style: td(td({}, void 0 === n ? {} : n), u), className: o },
                ),
              );
            };
            return 1 === a
              ? c(e.Children.only(r))
              : e.default.createElement(
                  "div",
                  null,
                  e.Children.map(r, function (t) {
                    return c(t);
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
            Object.defineProperty(t, ty(n.key), n));
        }
      })(i.prototype, n),
      Object.defineProperty(i, "prototype", { writable: !1 }),
      i
    );
  })(e.PureComponent);
  function tO(t, e) {
    if (null == t) return {};
    var r = {};
    for (var n in t)
      if ({}.hasOwnProperty.call(t, n)) {
        if (-1 !== e.indexOf(n)) continue;
        r[n] = t[n];
      }
    return r;
  }
  function tw() {
    return (tw = Object.assign.bind()).apply(null, arguments);
  }
  ((tx.displayName = "Animate"),
    (tx.defaultProps = {
      begin: 0,
      duration: 1e3,
      from: "",
      to: "",
      attributeName: "",
      easing: "ease",
      isActive: !0,
      canBegin: !0,
      steps: [],
      onAnimationEnd: function () {},
      onAnimationStart: function () {},
    }),
    (tx.propTypes = {
      from: r.default.oneOfType([r.default.object, r.default.string]),
      to: r.default.oneOfType([r.default.object, r.default.string]),
      attributeName: r.default.string,
      duration: r.default.number,
      begin: r.default.number,
      easing: r.default.oneOfType([r.default.string, r.default.func]),
      steps: r.default.arrayOf(
        r.default.shape({
          duration: r.default.number.isRequired,
          style: r.default.object.isRequired,
          easing: r.default.oneOfType([
            r.default.oneOf([
              "ease",
              "ease-in",
              "ease-out",
              "ease-in-out",
              "linear",
            ]),
            r.default.func,
          ]),
          properties: r.default.arrayOf("string"),
          onAnimationEnd: r.default.func,
        }),
      ),
      children: r.default.oneOfType([r.default.node, r.default.func]),
      isActive: r.default.bool,
      canBegin: r.default.bool,
      onAnimationEnd: r.default.func,
      shouldReAnimate: r.default.bool,
      onAnimationStart: r.default.func,
      onAnimationReStart: r.default.func,
    }));
  var tj = t.i(208063),
    tS = t.i(854556);
  let tP = e.default.createContext(null);
  function tA(t, r) {
    var n = Object.create(null);
    return (
      t &&
        e.Children.map(t, function (t) {
          return t;
        }).forEach(function (t) {
          n[t.key] = r && (0, e.isValidElement)(t) ? r(t) : t;
        }),
      n
    );
  }
  function tE(t, e, r) {
    return null != r[e] ? r[e] : t.props[e];
  }
  var tM =
      Object.values ||
      function (t) {
        return Object.keys(t).map(function (e) {
          return t[e];
        });
      },
    tk = (function (t) {
      function r(e, r) {
        var n = t.call(this, e, r) || this,
          o = n.handleExited.bind((0, tj.f)(n));
        return (
          (n.state = {
            contextValue: { isMounting: !0 },
            handleExited: o,
            firstRender: !0,
          }),
          n
        );
      }
      (0, tS.f)(r, t);
      var n = r.prototype;
      return (
        (n.componentDidMount = function () {
          ((this.mounted = !0),
            this.setState({ contextValue: { isMounting: !1 } }));
        }),
        (n.componentWillUnmount = function () {
          this.mounted = !1;
        }),
        (r.getDerivedStateFromProps = function (t, r) {
          var n,
            o,
            i = r.children,
            a = r.handleExited;
          return {
            children: r.firstRender
              ? tA(t.children, function (r) {
                  return (0, e.cloneElement)(r, {
                    onExited: a.bind(null, r),
                    in: !0,
                    appear: tE(r, "appear", t),
                    enter: tE(r, "enter", t),
                    exit: tE(r, "exit", t),
                  });
                })
              : (Object.keys(
                  (o = (function (t, e) {
                    function r(r) {
                      return r in e ? e[r] : t[r];
                    }
                    ((t = t || {}), (e = e || {}));
                    var n,
                      o = Object.create(null),
                      i = [];
                    for (var a in t)
                      a in e ? i.length && ((o[a] = i), (i = [])) : i.push(a);
                    var u = {};
                    for (var c in e) {
                      if (o[c])
                        for (n = 0; n < o[c].length; n++) {
                          var l = o[c][n];
                          u[o[c][n]] = r(l);
                        }
                      u[c] = r(c);
                    }
                    for (n = 0; n < i.length; n++) u[i[n]] = r(i[n]);
                    return u;
                  })(i, (n = tA(t.children)))),
                ).forEach(function (r) {
                  var u = o[r];
                  if ((0, e.isValidElement)(u)) {
                    var c = r in i,
                      l = r in n,
                      s = i[r],
                      f = (0, e.isValidElement)(s) && !s.props.in;
                    l && (!c || f)
                      ? (o[r] = (0, e.cloneElement)(u, {
                          onExited: a.bind(null, u),
                          in: !0,
                          exit: tE(u, "exit", t),
                          enter: tE(u, "enter", t),
                        }))
                      : l || !c || f
                        ? l &&
                          c &&
                          (0, e.isValidElement)(s) &&
                          (o[r] = (0, e.cloneElement)(u, {
                            onExited: a.bind(null, u),
                            in: s.props.in,
                            exit: tE(u, "exit", t),
                            enter: tE(u, "enter", t),
                          }))
                        : (o[r] = (0, e.cloneElement)(u, { in: !1 }));
                  }
                }),
                o),
            firstRender: !1,
          };
        }),
        (n.handleExited = function (t, e) {
          var r = tA(this.props.children);
          t.key in r ||
            (t.props.onExited && t.props.onExited(e),
            this.mounted &&
              this.setState(function (e) {
                var r = tw({}, e.children);
                return (delete r[t.key], { children: r });
              }));
        }),
        (n.render = function () {
          var t = this.props,
            r = t.component,
            n = t.childFactory,
            o = tO(t, ["component", "childFactory"]),
            i = this.state.contextValue,
            a = tM(this.state.children).map(n);
          return (delete o.appear, delete o.enter, delete o.exit, null === r)
            ? e.default.createElement(tP.Provider, { value: i }, a)
            : e.default.createElement(
                tP.Provider,
                { value: i },
                e.default.createElement(r, o, a),
              );
        }),
        r
      );
    })(e.default.Component);
  ((tk.propTypes = {}),
    (tk.defaultProps = {
      component: "div",
      childFactory: function (t) {
        return t;
      },
    }));
  var tT = t.i(231332),
    t_ = "unmounted",
    tC = "exited",
    tI = "entering",
    tD = "entered",
    tN = "exiting",
    tB = (function (t) {
      function r(e, r) {
        var n,
          o = t.call(this, e, r) || this,
          i = r && !r.isMounting ? e.enter : e.appear;
        return (
          (o.appearStatus = null),
          e.in
            ? i
              ? ((n = tC), (o.appearStatus = tI))
              : (n = tD)
            : (n = e.unmountOnExit || e.mountOnEnter ? t_ : tC),
          (o.state = { status: n }),
          (o.nextCallback = null),
          o
        );
      }
      ((0, tS.f)(r, t),
        (r.getDerivedStateFromProps = function (t, e) {
          return t.in && e.status === t_ ? { status: tC } : null;
        }));
      var n = r.prototype;
      return (
        (n.componentDidMount = function () {
          this.updateStatus(!0, this.appearStatus);
        }),
        (n.componentDidUpdate = function (t) {
          var e = null;
          if (t !== this.props) {
            var r = this.state.status;
            this.props.in
              ? r !== tI && r !== tD && (e = tI)
              : (r === tI || r === tD) && (e = tN);
          }
          this.updateStatus(!1, e);
        }),
        (n.componentWillUnmount = function () {
          this.cancelNextCallback();
        }),
        (n.getTimeouts = function () {
          var t,
            e,
            r,
            n = this.props.timeout;
          return (
            (t = e = r = n),
            null != n &&
              "number" != typeof n &&
              ((t = n.exit),
              (e = n.enter),
              (r = void 0 !== n.appear ? n.appear : e)),
            { exit: t, enter: e, appear: r }
          );
        }),
        (n.updateStatus = function (t, e) {
          if ((void 0 === t && (t = !1), null !== e))
            if ((this.cancelNextCallback(), e === tI)) {
              if (this.props.unmountOnExit || this.props.mountOnEnter) {
                var r = this.props.nodeRef
                  ? this.props.nodeRef.current
                  : tT.default.findDOMNode(this);
                r && r.scrollTop;
              }
              this.performEnter(t);
            } else this.performExit();
          else
            this.props.unmountOnExit &&
              this.state.status === tC &&
              this.setState({ status: t_ });
        }),
        (n.performEnter = function (t) {
          var e = this,
            r = this.props.enter,
            n = this.context ? this.context.isMounting : t,
            o = this.props.nodeRef ? [n] : [tT.default.findDOMNode(this), n],
            i = o[0],
            a = o[1],
            u = this.getTimeouts(),
            c = n ? u.appear : u.enter;
          (t || r) && 1
            ? (this.props.onEnter(i, a),
              this.safeSetState({ status: tI }, function () {
                (e.props.onEntering(i, a),
                  e.onTransitionEnd(c, function () {
                    e.safeSetState({ status: tD }, function () {
                      e.props.onEntered(i, a);
                    });
                  }));
              }))
            : this.safeSetState({ status: tD }, function () {
                e.props.onEntered(i);
              });
        }),
        (n.performExit = function () {
          var t = this,
            e = this.props.exit,
            r = this.getTimeouts(),
            n = this.props.nodeRef ? void 0 : tT.default.findDOMNode(this);
          e
            ? (this.props.onExit(n),
              this.safeSetState({ status: tN }, function () {
                (t.props.onExiting(n),
                  t.onTransitionEnd(r.exit, function () {
                    t.safeSetState({ status: tC }, function () {
                      t.props.onExited(n);
                    });
                  }));
              }))
            : this.safeSetState({ status: tC }, function () {
                t.props.onExited(n);
              });
        }),
        (n.cancelNextCallback = function () {
          null !== this.nextCallback &&
            (this.nextCallback.cancel(), (this.nextCallback = null));
        }),
        (n.safeSetState = function (t, e) {
          ((e = this.setNextCallback(e)), this.setState(t, e));
        }),
        (n.setNextCallback = function (t) {
          var e = this,
            r = !0;
          return (
            (this.nextCallback = function (n) {
              r && ((r = !1), (e.nextCallback = null), t(n));
            }),
            (this.nextCallback.cancel = function () {
              r = !1;
            }),
            this.nextCallback
          );
        }),
        (n.onTransitionEnd = function (t, e) {
          this.setNextCallback(e);
          var r = this.props.nodeRef
              ? this.props.nodeRef.current
              : tT.default.findDOMNode(this),
            n = null == t && !this.props.addEndListener;
          if (!r || n) return void setTimeout(this.nextCallback, 0);
          if (this.props.addEndListener) {
            var o = this.props.nodeRef
                ? [this.nextCallback]
                : [r, this.nextCallback],
              i = o[0],
              a = o[1];
            this.props.addEndListener(i, a);
          }
          null != t && setTimeout(this.nextCallback, t);
        }),
        (n.render = function () {
          var t = this.state.status;
          if (t === t_) return null;
          var r = this.props,
            n = r.children,
            o =
              (r.in,
              r.mountOnEnter,
              r.unmountOnExit,
              r.appear,
              r.enter,
              r.exit,
              r.timeout,
              r.addEndListener,
              r.onEnter,
              r.onEntering,
              r.onEntered,
              r.onExit,
              r.onExiting,
              r.onExited,
              r.nodeRef,
              tO(r, [
                "children",
                "in",
                "mountOnEnter",
                "unmountOnExit",
                "appear",
                "enter",
                "exit",
                "timeout",
                "addEndListener",
                "onEnter",
                "onEntering",
                "onEntered",
                "onExit",
                "onExiting",
                "onExited",
                "nodeRef",
              ]));
          return e.default.createElement(
            tP.Provider,
            { value: null },
            "function" == typeof n
              ? n(t, o)
              : e.default.cloneElement(e.default.Children.only(n), o),
          );
        }),
        r
      );
    })(e.default.Component);
  function tR() {}
  ((tB.contextType = tP),
    (tB.propTypes = {}),
    (tB.defaultProps = {
      in: !1,
      mountOnEnter: !1,
      unmountOnExit: !1,
      appear: !1,
      enter: !0,
      exit: !0,
      onEnter: tR,
      onEntering: tR,
      onEntered: tR,
      onExit: tR,
      onExiting: tR,
      onExited: tR,
    }),
    (tB.UNMOUNTED = t_),
    (tB.EXITED = tC),
    (tB.ENTERING = tI),
    (tB.ENTERED = tD),
    (tB.EXITING = tN));
  var tL = ["children", "appearOptions", "enterOptions", "leaveOptions"];
  function tU(t) {
    return (tU =
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
  function tz() {
    return (tz = Object.assign.bind()).apply(this, arguments);
  }
  function t$(t, e) {
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
  function tH(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? t$(Object(r), !0).forEach(function (e) {
            tq(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : t$(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  function tF(t, e) {
    return (tF = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, e);
  }
  function tW(t) {
    if (void 0 === t)
      throw ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return t;
  }
  function tX(t) {
    return (tX = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function tq(t, e, r) {
    return (
      (e = tV(e)) in t
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
  function tV(t) {
    var e = (function (t, e) {
      if ("object" !== tU(t) || null === t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || "default");
        if ("object" !== tU(n)) return n;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e ? String : Number)(t);
    })(t, "string");
    return "symbol" === tU(e) ? e : String(e);
  }
  var tG = function () {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        e = t.steps,
        r = t.duration;
      return e && e.length
        ? e.reduce(function (t, e) {
            return (
              t +
              (Number.isFinite(e.duration) && e.duration > 0 ? e.duration : 0)
            );
          }, 0)
        : Number.isFinite(r)
          ? r
          : 0;
    },
    tY = (function (t) {
      if ("function" != typeof t && null !== t)
        throw TypeError("Super expression must either be null or a function");
      ((i.prototype = Object.create(t && t.prototype, {
        constructor: { value: i, writable: !0, configurable: !0 },
      })),
        Object.defineProperty(i, "prototype", { writable: !1 }),
        t && tF(i, t));
      var r,
        n,
        o =
          ((r = (function () {
            if (
              "u" < typeof Reflect ||
              !Reflect.construct ||
              Reflect.construct.sham
            )
              return !1;
            if ("function" == typeof Proxy) return !0;
            try {
              return (
                Boolean.prototype.valueOf.call(
                  Reflect.construct(Boolean, [], function () {}),
                ),
                !0
              );
            } catch (t) {
              return !1;
            }
          })()),
          function () {
            var t,
              e = tX(i);
            return (
              (t = r
                ? Reflect.construct(e, arguments, tX(this).constructor)
                : e.apply(this, arguments)),
              (function (t, e) {
                if (e && ("object" === tU(e) || "function" == typeof e))
                  return e;
                if (void 0 !== e)
                  throw TypeError(
                    "Derived constructors may only return object or undefined",
                  );
                return tW(t);
              })(this, t)
            );
          });
      function i() {
        var t;
        if (!(this instanceof i))
          throw TypeError("Cannot call a class as a function");
        return (
          tq(tW((t = o.call(this))), "handleEnter", function (e, r) {
            var n = t.props,
              o = n.appearOptions,
              i = n.enterOptions;
            t.handleStyleActive(r ? o : i);
          }),
          tq(tW(t), "handleExit", function () {
            var e = t.props.leaveOptions;
            t.handleStyleActive(e);
          }),
          (t.state = { isActive: !1 }),
          t
        );
      }
      return (
        (n = [
          {
            key: "handleStyleActive",
            value: function (t) {
              if (t) {
                var e = t.onAnimationEnd
                  ? function () {
                      t.onAnimationEnd();
                    }
                  : null;
                this.setState(
                  tH(tH({}, t), {}, { onAnimationEnd: e, isActive: !0 }),
                );
              }
            },
          },
          {
            key: "parseTimeout",
            value: function () {
              var t = this.props,
                e = t.appearOptions,
                r = t.enterOptions,
                n = t.leaveOptions;
              return tG(e) + tG(r) + tG(n);
            },
          },
          {
            key: "render",
            value: function () {
              var t = this,
                r = this.props,
                n = r.children,
                o =
                  (r.appearOptions,
                  r.enterOptions,
                  r.leaveOptions,
                  (function (t, e) {
                    if (null == t) return {};
                    var r,
                      n,
                      o = (function (t, e) {
                        if (null == t) return {};
                        var r,
                          n,
                          o = {},
                          i = Object.keys(t);
                        for (n = 0; n < i.length; n++)
                          ((r = i[n]), e.indexOf(r) >= 0 || (o[r] = t[r]));
                        return o;
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
                  })(r, tL));
              return e.default.createElement(
                tB,
                tz({}, o, {
                  onEnter: this.handleEnter,
                  onExit: this.handleExit,
                  timeout: this.parseTimeout(),
                }),
                function () {
                  return e.default.createElement(
                    tx,
                    t.state,
                    e.Children.only(n),
                  );
                },
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
              Object.defineProperty(t, tV(n.key), n));
          }
        })(i.prototype, n),
        Object.defineProperty(i, "prototype", { writable: !1 }),
        i
      );
    })(e.Component);
  function tK(t) {
    var r = t.component,
      n = t.children,
      o = t.appear,
      i = t.enter,
      a = t.leave;
    return e.default.createElement(
      tk,
      { component: r },
      e.Children.map(n, function (t, r) {
        return e.default.createElement(
          tY,
          {
            appearOptions: o,
            enterOptions: i,
            leaveOptions: a,
            key: "child-".concat(r),
          },
          t,
        );
      }),
    );
  }
  ((tY.propTypes = {
    appearOptions: r.default.object,
    enterOptions: r.default.object,
    leaveOptions: r.default.object,
    children: r.default.element,
  }),
    (tK.propTypes = {
      appear: r.default.object,
      enter: r.default.object,
      leave: r.default.object,
      children: r.default.oneOfType([r.default.array, r.default.element]),
      component: r.default.any,
    }),
    (tK.defaultProps = { component: "span" }),
    t.s(["f", 0, tx], 33082));
};
