// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    r,
    n,
    o,
    i,
    a,
    u,
    c = t.i(352386),
    l = t.i(180793),
    s = t.i(7284),
    f = t.i(756438),
    p = {
      isSsr: !(
        "u" > typeof window &&
        window.document &&
        window.document.createElement &&
        window.setTimeout
      ),
      get: function (t) {
        return p[t];
      },
      set: function (t, e) {
        if ("string" == typeof t) p[t] = e;
        else {
          var r = Object.keys(t);
          r &&
            r.length &&
            r.forEach(function (e) {
              p[e] = t[e];
            });
        }
      },
    };
  t.s(["f", 0, p], 861468);
  var d = t.i(871791);
  function h(t) {
    return (h =
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
  function y(t, e) {
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
  function v(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? y(Object(r), !0).forEach(function (e) {
            var n, o, i;
            ((n = t),
              (o = e),
              (i = r[e]),
              (o = (function (t) {
                var e = (function (t, e) {
                  if ("object" != h(t) || !t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var n = r.call(t, e || "default");
                    if ("object" != h(n)) return n;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === e ? String : Number)(t);
                })(t, "string");
                return "symbol" == h(e) ? e : e + "";
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
          : y(Object(r)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(r, e),
              );
            });
    }
    return t;
  }
  var m = { widthCache: {}, cacheCount: 0 },
    b = {
      position: "absolute",
      top: "-20000px",
      left: 0,
      padding: 0,
      margin: 0,
      border: "none",
      whiteSpace: "pre",
    },
    g = "recharts_measurement_span",
    x = function (t) {
      var e,
        r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (null == t || p.isSsr) return { width: 0, height: 0 };
      var n =
          (Object.keys((e = v({}, r))).forEach(function (t) {
            e[t] || delete e[t];
          }),
          e),
        o = JSON.stringify({ text: t, copyStyle: n });
      if (m.widthCache[o]) return m.widthCache[o];
      try {
        var i = document.getElementById(g);
        i ||
          ((i = document.createElement("span")).setAttribute("id", g),
          i.setAttribute("aria-hidden", "true"),
          document.body.appendChild(i));
        var a = v(v({}, b), n);
        (Object.assign(i.style, a), (i.textContent = "".concat(t)));
        var u = i.getBoundingClientRect(),
          c = { width: u.width, height: u.height };
        return (
          (m.widthCache[o] = c),
          ++m.cacheCount > 2e3 && ((m.cacheCount = 0), (m.widthCache = {})),
          c
        );
      } catch (t) {
        return { width: 0, height: 0 };
      }
    };
  function O(t) {
    return (O =
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
      (function (t, e) {
        if (t) {
          if ("string" == typeof t) return j(t, e);
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
            return j(t, e);
        }
      })(t, e) ||
      (function () {
        throw TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function j(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function S(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      ((n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(
          t,
          (function (t) {
            var e = (function (t, e) {
              if ("object" != O(t) || !t) return t;
              var r = t[Symbol.toPrimitive];
              if (void 0 !== r) {
                var n = r.call(t, e || "default");
                if ("object" != O(n)) return n;
                throw TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === e ? String : Number)(t);
            })(t, "string");
            return "symbol" == O(e) ? e : e + "";
          })(n.key),
          n,
        ));
    }
  }
  t.s(
    [
      "h",
      0,
      function (t) {
        return {
          top: t.top + window.scrollY - document.documentElement.clientTop,
          left: t.left + window.scrollX - document.documentElement.clientLeft,
        };
      },
      "I",
      0,
      x,
    ],
    302334,
  );
  var P = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
    A = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
    E = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/,
    M = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
    k = {
      cm: 96 / 2.54,
      mm: 96 / 25.4,
      pt: 96 / 72,
      pc: 16,
      in: 96,
      Q: 96 / 101.6,
      px: 1,
    },
    T = Object.keys(k),
    _ = (function () {
      var t, e;
      function r(t, e) {
        if (!(this instanceof r))
          throw TypeError("Cannot call a class as a function");
        ((this.num = t),
          (this.unit = e),
          (this.num = t),
          (this.unit = e),
          Number.isNaN(t) && (this.unit = ""),
          "" === e || E.test(e) || ((this.num = 0 / 0), (this.unit = "")),
          T.includes(e) && ((this.num = t * k[e]), (this.unit = "px")));
      }
      return (
        (t = [
          {
            key: "add",
            value: function (t) {
              return this.unit !== t.unit
                ? new r(0 / 0, "")
                : new r(this.num + t.num, this.unit);
            },
          },
          {
            key: "subtract",
            value: function (t) {
              return this.unit !== t.unit
                ? new r(0 / 0, "")
                : new r(this.num - t.num, this.unit);
            },
          },
          {
            key: "multiply",
            value: function (t) {
              return "" !== this.unit && "" !== t.unit && this.unit !== t.unit
                ? new r(0 / 0, "")
                : new r(this.num * t.num, this.unit || t.unit);
            },
          },
          {
            key: "divide",
            value: function (t) {
              return "" !== this.unit && "" !== t.unit && this.unit !== t.unit
                ? new r(0 / 0, "")
                : new r(this.num / t.num, this.unit || t.unit);
            },
          },
          {
            key: "toString",
            value: function () {
              return "".concat(this.num).concat(this.unit);
            },
          },
          {
            key: "isNaN",
            value: function () {
              return Number.isNaN(this.num);
            },
          },
        ]),
        (e = [
          {
            key: "parse",
            value: function (t) {
              var e,
                n = w(null != (e = M.exec(t)) ? e : [], 3),
                o = n[1],
                i = n[2];
              return new r(parseFloat(o), null != i ? i : "");
            },
          },
        ]),
        t && S(r.prototype, t),
        e && S(r, e),
        Object.defineProperty(r, "prototype", { writable: !1 }),
        r
      );
    })();
  function C(t) {
    if (t.includes("NaN")) return "NaN";
    for (var e = t; e.includes("*") || e.includes("/"); ) {
      var r,
        n = w(null != (r = P.exec(e)) ? r : [], 4),
        o = n[1],
        i = n[2],
        a = n[3],
        u = _.parse(null != o ? o : ""),
        c = _.parse(null != a ? a : ""),
        l = "*" === i ? u.multiply(c) : u.divide(c);
      if (l.isNaN()) return "NaN";
      e = e.replace(P, l.toString());
    }
    for (; e.includes("+") || /.-\d+(?:\.\d+)?/.test(e); ) {
      var s,
        f = w(null != (s = A.exec(e)) ? s : [], 4),
        p = f[1],
        d = f[2],
        h = f[3],
        y = _.parse(null != p ? p : ""),
        v = _.parse(null != h ? h : ""),
        m = "+" === d ? y.add(v) : y.subtract(v);
      if (m.isNaN()) return "NaN";
      e = e.replace(A, m.toString());
    }
    return e;
  }
  var I = /\(([^()]*)\)/;
  function D(t) {
    var e = (function (t) {
      try {
        var e;
        return (
          (e = t.replace(/\s+/g, "")),
          (e = (function (t) {
            for (var e = t; e.includes("("); ) {
              var r = w(I.exec(e), 2)[1];
              e = e.replace(I, C(r));
            }
            return e;
          })(e)),
          (e = C(e))
        );
      } catch (t) {
        return "NaN";
      }
    })(t.slice(5, -1));
    return "NaN" === e ? "" : e;
  }
  var N = [
      "x",
      "y",
      "lineHeight",
      "capHeight",
      "scaleToFit",
      "textAnchor",
      "verticalAnchor",
      "fill",
    ],
    B = ["dx", "dy", "angle", "className", "breakAll"];
  function R() {
    return (R = Object.assign.bind()).apply(this, arguments);
  }
  function L(t, e) {
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
  function U(t, e) {
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
      (function (t, e) {
        if (t) {
          if ("string" == typeof t) return z(t, e);
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
            return z(t, e);
        }
      })(t, e) ||
      (function () {
        throw TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function z(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  var $ = /[ \f\n\r\t\v\u2028\u2029]+/,
    H = function (t) {
      var e = t.children,
        r = t.breakAll,
        n = t.style;
      try {
        var o = [];
        (0, l.default)(e) ||
          (o = r ? e.toString().split("") : e.toString().split($));
        var i = o.map(function (t) {
            return { word: t, width: x(t, n).width };
          }),
          a = r ? 0 : x(" ", n).width;
        return { wordsWithComputedWidth: i, spaceWidth: a };
      } catch (t) {
        return null;
      }
    },
    F = function (t, e, r, n, o) {
      var i,
        a = t.maxLines,
        u = t.children,
        c = t.style,
        l = t.breakAll,
        s = (0, f.H)(a),
        p = function () {
          var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
          return t.reduce(function (t, e) {
            var i = e.word,
              a = e.width,
              u = t[t.length - 1];
            return (
              u && (null == n || o || u.width + a + r < Number(n))
                ? (u.words.push(i), (u.width += a + r))
                : t.push({ words: [i], width: a }),
              t
            );
          }, []);
        },
        d = p(e);
      if (!s) return d;
      for (
        var h = function (t) {
            var e = p(
              H({ breakAll: l, style: c, children: u.slice(0, t) + "…" })
                .wordsWithComputedWidth,
            );
            return [
              e.length > a ||
                e.reduce(function (t, e) {
                  return t.width > e.width ? t : e;
                }).width > Number(n),
              e,
            ];
          },
          y = 0,
          v = u.length - 1,
          m = 0;
        y <= v && m <= u.length - 1;

      ) {
        var b = Math.floor((y + v) / 2),
          g = U(h(b - 1), 2),
          x = g[0],
          O = g[1],
          w = U(h(b), 1)[0];
        if ((x || w || (y = b + 1), x && w && (v = b - 1), !x && w)) {
          i = O;
          break;
        }
        m++;
      }
      return i || d;
    },
    W = function (t) {
      return [{ words: (0, l.default)(t) ? [] : t.toString().split($) }];
    },
    X = function (t) {
      var e = t.width,
        r = t.scaleToFit,
        n = t.children,
        o = t.style,
        i = t.breakAll,
        a = t.maxLines;
      if ((e || r) && !p.isSsr) {
        var u = H({ breakAll: i, children: n, style: o });
        if (!u) return W(n);
        var c = u.wordsWithComputedWidth,
          l = u.spaceWidth;
        return F(
          { breakAll: i, children: n, maxLines: a, style: o },
          c,
          l,
          e,
          r,
        );
      }
      return W(n);
    },
    q = "#808080";
  function V(t, e) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(t);
        break;
      default:
        this.range(e).domain(t);
    }
    return this;
  }
  function G(t, e) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        "function" == typeof t ? this.interpolator(t) : this.range(t);
        break;
      default:
        (this.domain(t),
          "function" == typeof e ? this.interpolator(e) : this.range(e));
    }
    return this;
  }
  t.s(
    [
      "f",
      0,
      function (t) {
        var e,
          r = t.x,
          n = void 0 === r ? 0 : r,
          o = t.y,
          i = void 0 === o ? 0 : o,
          a = t.lineHeight,
          u = void 0 === a ? "1em" : a,
          l = t.capHeight,
          p = void 0 === l ? "0.71em" : l,
          h = t.scaleToFit,
          y = void 0 !== h && h,
          v = t.textAnchor,
          m = t.verticalAnchor,
          b = t.fill,
          g = void 0 === b ? q : b,
          x = L(t, N),
          O = (0, c.useMemo)(
            function () {
              return X({
                breakAll: x.breakAll,
                children: x.children,
                maxLines: x.maxLines,
                scaleToFit: y,
                style: x.style,
                width: x.width,
              });
            },
            [x.breakAll, x.children, x.maxLines, y, x.style, x.width],
          ),
          w = x.dx,
          j = x.dy,
          S = x.angle,
          P = x.className,
          A = x.breakAll,
          E = L(x, B);
        if (!(0, f.m)(n) || !(0, f.m)(i)) return null;
        var M = n + ((0, f.H)(w) ? w : 0),
          k = i + ((0, f.H)(j) ? j : 0);
        switch (void 0 === m ? "end" : m) {
          case "start":
            e = D("calc(".concat(p, ")"));
            break;
          case "middle":
            e = D(
              "calc("
                .concat((O.length - 1) / 2, " * -")
                .concat(u, " + (")
                .concat(p, " / 2))"),
            );
            break;
          default:
            e = D("calc(".concat(O.length - 1, " * -").concat(u, ")"));
        }
        var T = [];
        if (y) {
          var _ = O[0].width,
            C = x.width;
          T.push("scale(".concat(((0, f.H)(C) ? C / _ : 1) / _, ")"));
        }
        return (
          S && T.push("rotate(".concat(S, ", ").concat(M, ", ").concat(k, ")")),
          T.length && (E.transform = T.join(" ")),
          c.default.createElement(
            "text",
            R({}, (0, d.T)(E, !0), {
              x: M,
              y: k,
              className: (0, s.U)("recharts-text", P),
              textAnchor: void 0 === v ? "start" : v,
              fill: g.includes("url") ? q : g,
            }),
            O.map(function (t, r) {
              var n = t.words.join(A ? "" : " ");
              return c.default.createElement(
                "tspan",
                { x: M, dy: 0 === r ? e : u, key: "".concat(n, "-").concat(r) },
                n,
              );
            }),
          )
        );
      },
    ],
    926614,
  );
  class Y extends Map {
    constructor(t, e = Z) {
      if (
        (super(),
        Object.defineProperties(this, {
          _intern: { value: new Map() },
          _key: { value: e },
        }),
        null != t)
      )
        for (let [e, r] of t) this.set(e, r);
    }
    get(t) {
      return super.get(K(this, t));
    }
    has(t) {
      return super.has(K(this, t));
    }
    set(t, e) {
      return super.set(
        (function ({ _intern: t, _key: e }, r) {
          let n = e(r);
          return t.has(n) ? t.get(n) : (t.set(n, r), r);
        })(this, t),
        e,
      );
    }
    delete(t) {
      return super.delete(
        (function ({ _intern: t, _key: e }, r) {
          let n = e(r);
          return (t.has(n) && ((r = t.get(n)), t.delete(n)), r);
        })(this, t),
      );
    }
  }
  function K({ _intern: t, _key: e }, r) {
    let n = e(r);
    return t.has(n) ? t.get(n) : r;
  }
  function Z(t) {
    return null !== t && "object" == typeof t ? t.valueOf() : t;
  }
  let J = Symbol("implicit");
  function Q() {
    var t = new Y(),
      e = [],
      r = [],
      n = J;
    function o(o) {
      let i = t.get(o);
      if (void 0 === i) {
        if (n !== J) return n;
        t.set(o, (i = e.push(o) - 1));
      }
      return r[i % r.length];
    }
    return (
      (o.domain = function (r) {
        if (!arguments.length) return e.slice();
        for (let n of ((e = []), (t = new Y()), r))
          t.has(n) || t.set(n, e.push(n) - 1);
        return o;
      }),
      (o.range = function (t) {
        return arguments.length ? ((r = Array.from(t)), o) : r.slice();
      }),
      (o.unknown = function (t) {
        return arguments.length ? ((n = t), o) : n;
      }),
      (o.copy = function () {
        return Q(e, r).unknown(n);
      }),
      V.apply(o, arguments),
      o
    );
  }
  function tt() {
    var t,
      e,
      r = Q().unknown(void 0),
      n = r.domain,
      o = r.range,
      i = 0,
      a = 1,
      u = !1,
      c = 0,
      l = 0,
      s = 0.5;
    function f() {
      var r = n().length,
        f = a < i,
        p = f ? a : i,
        d = f ? i : a;
      ((t = (d - p) / Math.max(1, r - c + 2 * l)),
        u && (t = Math.floor(t)),
        (p += (d - p - t * (r - c)) * s),
        (e = t * (1 - c)),
        u && ((p = Math.round(p)), (e = Math.round(e))));
      var h = (function (t, e, r) {
        ((t *= 1),
          (e *= 1),
          (r =
            (o = arguments.length) < 2
              ? ((e = t), (t = 0), 1)
              : o < 3
                ? 1
                : +r));
        for (
          var n = -1, o = 0 | Math.max(0, Math.ceil((e - t) / r)), i = Array(o);
          ++n < o;

        )
          i[n] = t + n * r;
        return i;
      })(r).map(function (e) {
        return p + t * e;
      });
      return o(f ? h.reverse() : h);
    }
    return (
      delete r.unknown,
      (r.domain = function (t) {
        return arguments.length ? (n(t), f()) : n();
      }),
      (r.range = function (t) {
        return arguments.length
          ? (([i, a] = t), (i *= 1), (a *= 1), f())
          : [i, a];
      }),
      (r.rangeRound = function (t) {
        return (([i, a] = t), (i *= 1), (a *= 1), (u = !0), f());
      }),
      (r.bandwidth = function () {
        return e;
      }),
      (r.step = function () {
        return t;
      }),
      (r.round = function (t) {
        return arguments.length ? ((u = !!t), f()) : u;
      }),
      (r.padding = function (t) {
        return arguments.length ? ((c = Math.min(1, (l = +t))), f()) : c;
      }),
      (r.paddingInner = function (t) {
        return arguments.length ? ((c = Math.min(1, t)), f()) : c;
      }),
      (r.paddingOuter = function (t) {
        return arguments.length ? ((l = +t), f()) : l;
      }),
      (r.align = function (t) {
        return arguments.length ? ((s = Math.max(0, Math.min(1, t))), f()) : s;
      }),
      (r.copy = function () {
        return tt(n(), [i, a])
          .round(u)
          .paddingInner(c)
          .paddingOuter(l)
          .align(s);
      }),
      V.apply(f(), arguments)
    );
  }
  function te() {
    return (function t(e) {
      var r = e.copy;
      return (
        (e.padding = e.paddingOuter),
        delete e.paddingInner,
        delete e.paddingOuter,
        (e.copy = function () {
          return t(r());
        }),
        e
      );
    })(tt.apply(null, arguments).paddingInner(1));
  }
  t.s(["U", 0, tt, "I", 0, te], 530136);
  let tr = Math.sqrt(50),
    tn = Math.sqrt(10),
    to = Math.sqrt(2);
  function ti(t, e, r) {
    let n,
      o,
      i,
      a = (e - t) / Math.max(0, r),
      u = Math.floor(Math.log10(a)),
      c = a / Math.pow(10, u),
      l = c >= tr ? 10 : c >= tn ? 5 : c >= to ? 2 : 1;
    return (u < 0
      ? ((n = Math.round(t * (i = Math.pow(10, -u) / l))),
        (o = Math.round(e * i)),
        n / i < t && ++n,
        o / i > e && --o,
        (i = -i))
      : ((n = Math.round(t / (i = Math.pow(10, u) * l))),
        (o = Math.round(e / i)),
        n * i < t && ++n,
        o * i > e && --o),
    o < n && 0.5 <= r && r < 2)
      ? ti(t, e, 2 * r)
      : [n, o, i];
  }
  function ta(t, e, r) {
    if (((e *= 1), (t *= 1), !((r *= 1) > 0))) return [];
    if (t === e) return [t];
    let n = e < t,
      [o, i, a] = n ? ti(e, t, r) : ti(t, e, r);
    if (!(i >= o)) return [];
    let u = i - o + 1,
      c = Array(u);
    if (n)
      if (a < 0) for (let t = 0; t < u; ++t) c[t] = -((i - t) / a);
      else for (let t = 0; t < u; ++t) c[t] = (i - t) * a;
    else if (a < 0) for (let t = 0; t < u; ++t) c[t] = -((o + t) / a);
    else for (let t = 0; t < u; ++t) c[t] = (o + t) * a;
    return c;
  }
  function tu(t, e, r) {
    return ti((t *= 1), (e *= 1), (r *= 1))[2];
  }
  function tc(t, e, r) {
    ((e *= 1), (t *= 1), (r *= 1));
    let n = e < t,
      o = n ? tu(e, t, r) : tu(t, e, r);
    return (n ? -1 : 1) * (o < 0 ? -(1 / o) : o);
  }
  function tl(t, e) {
    return null == t || null == e
      ? 0 / 0
      : t < e
        ? -1
        : t > e
          ? 1
          : t >= e
            ? 0
            : 0 / 0;
  }
  function ts(t, e) {
    return null == t || null == e
      ? 0 / 0
      : e < t
        ? -1
        : e > t
          ? 1
          : e >= t
            ? 0
            : 0 / 0;
  }
  function tf(t) {
    let e, r, n;
    function o(t, n, i = 0, a = t.length) {
      if (i < a) {
        if (0 !== e(n, n)) return a;
        do {
          let e = (i + a) >>> 1;
          0 > r(t[e], n) ? (i = e + 1) : (a = e);
        } while (i < a);
      }
      return i;
    }
    return (
      2 !== t.length
        ? ((e = tl), (r = (e, r) => tl(t(e), r)), (n = (e, r) => t(e) - r))
        : ((e = t === tl || t === ts ? t : tp), (r = t), (n = t)),
      {
        left: o,
        center: function (t, e, r = 0, i = t.length) {
          let a = o(t, e, r, i - 1);
          return a > r && n(t[a - 1], e) > -n(t[a], e) ? a - 1 : a;
        },
        right: function (t, n, o = 0, i = t.length) {
          if (o < i) {
            if (0 !== e(n, n)) return i;
            do {
              let e = (o + i) >>> 1;
              0 >= r(t[e], n) ? (o = e + 1) : (i = e);
            } while (o < i);
          }
          return o;
        },
      }
    );
  }
  function tp() {
    return 0;
  }
  function td(t) {
    return null === t ? 0 / 0 : +t;
  }
  let th = tf(tl),
    ty = th.right;
  function tv(t, e, r) {
    ((t.prototype = e.prototype = r), (r.constructor = t));
  }
  function tm(t, e) {
    var r = Object.create(t.prototype);
    for (var n in e) r[n] = e[n];
    return r;
  }
  function tb() {}
  (th.left, tf(td).center);
  var tg = 1 / 0.7,
    tx = "\\s*([+-]?\\d+)\\s*",
    tO = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    tw = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    tj = /^#([0-9a-f]{3,8})$/,
    tS = RegExp(`^rgb\\(${tx},${tx},${tx}\\)$`),
    tP = RegExp(`^rgb\\(${tw},${tw},${tw}\\)$`),
    tA = RegExp(`^rgba\\(${tx},${tx},${tx},${tO}\\)$`),
    tE = RegExp(`^rgba\\(${tw},${tw},${tw},${tO}\\)$`),
    tM = RegExp(`^hsl\\(${tO},${tw},${tw}\\)$`),
    tk = RegExp(`^hsla\\(${tO},${tw},${tw},${tO}\\)$`),
    tT = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 65535,
      aquamarine: 8388564,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0,
      blanchedalmond: 0xffebcd,
      blue: 255,
      blueviolet: 9055202,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 6266528,
      chartreuse: 8388352,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 6591981,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 65535,
      darkblue: 139,
      darkcyan: 35723,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 25600,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 9109643,
      darkolivegreen: 5597999,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 9109504,
      darksalmon: 0xe9967a,
      darkseagreen: 9419919,
      darkslateblue: 4734347,
      darkslategray: 3100495,
      darkslategrey: 3100495,
      darkturquoise: 52945,
      darkviolet: 9699539,
      deeppink: 0xff1493,
      deepskyblue: 49151,
      dimgray: 6908265,
      dimgrey: 6908265,
      dodgerblue: 2003199,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 2263842,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 8421504,
      green: 32768,
      greenyellow: 0xadff2f,
      grey: 8421504,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 4915330,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 8190976,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 9498256,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 2142890,
      lightskyblue: 8900346,
      lightslategray: 7833753,
      lightslategrey: 7833753,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 65280,
      limegreen: 3329330,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 8388608,
      mediumaquamarine: 6737322,
      mediumblue: 205,
      mediumorchid: 0xba55d3,
      mediumpurple: 9662683,
      mediumseagreen: 3978097,
      mediumslateblue: 8087790,
      mediumspringgreen: 64154,
      mediumturquoise: 4772300,
      mediumvioletred: 0xc71585,
      midnightblue: 1644912,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 128,
      oldlace: 0xfdf5e6,
      olive: 8421376,
      olivedrab: 7048739,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 8388736,
      rebeccapurple: 6697881,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 4286945,
      saddlebrown: 9127187,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 3050327,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 8900331,
      slateblue: 6970061,
      slategray: 7372944,
      slategrey: 7372944,
      snow: 0xfffafa,
      springgreen: 65407,
      steelblue: 4620980,
      tan: 0xd2b48c,
      teal: 32896,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 4251856,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32,
    };
  function t_() {
    return this.rgb().formatHex();
  }
  function tC() {
    return this.rgb().formatRgb();
  }
  function tI(t) {
    var e, r;
    return (
      (t = (t + "").trim().toLowerCase()),
      (e = tj.exec(t))
        ? ((r = e[1].length),
          (e = parseInt(e[1], 16)),
          6 === r
            ? tD(e)
            : 3 === r
              ? new tR(
                  ((e >> 8) & 15) | ((e >> 4) & 240),
                  ((e >> 4) & 15) | (240 & e),
                  ((15 & e) << 4) | (15 & e),
                  1,
                )
              : 8 === r
                ? tN(
                    (e >> 24) & 255,
                    (e >> 16) & 255,
                    (e >> 8) & 255,
                    (255 & e) / 255,
                  )
                : 4 === r
                  ? tN(
                      ((e >> 12) & 15) | ((e >> 8) & 240),
                      ((e >> 8) & 15) | ((e >> 4) & 240),
                      ((e >> 4) & 15) | (240 & e),
                      (((15 & e) << 4) | (15 & e)) / 255,
                    )
                  : null)
        : (e = tS.exec(t))
          ? new tR(e[1], e[2], e[3], 1)
          : (e = tP.exec(t))
            ? new tR(
                (255 * e[1]) / 100,
                (255 * e[2]) / 100,
                (255 * e[3]) / 100,
                1,
              )
            : (e = tA.exec(t))
              ? tN(e[1], e[2], e[3], e[4])
              : (e = tE.exec(t))
                ? tN(
                    (255 * e[1]) / 100,
                    (255 * e[2]) / 100,
                    (255 * e[3]) / 100,
                    e[4],
                  )
                : (e = tM.exec(t))
                  ? tF(e[1], e[2] / 100, e[3] / 100, 1)
                  : (e = tk.exec(t))
                    ? tF(e[1], e[2] / 100, e[3] / 100, e[4])
                    : tT.hasOwnProperty(t)
                      ? tD(tT[t])
                      : "transparent" === t
                        ? new tR(0 / 0, 0 / 0, 0 / 0, 0)
                        : null
    );
  }
  function tD(t) {
    return new tR((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
  }
  function tN(t, e, r, n) {
    return (n <= 0 && (t = e = r = 0 / 0), new tR(t, e, r, n));
  }
  function tB(t, e, r, n) {
    var o;
    return 1 == arguments.length
      ? ((o = t) instanceof tb || (o = tI(o)), o)
        ? new tR((o = o.rgb()).r, o.g, o.b, o.opacity)
        : new tR()
      : new tR(t, e, r, null == n ? 1 : n);
  }
  function tR(t, e, r, n) {
    ((this.r = +t), (this.g = +e), (this.b = +r), (this.opacity = +n));
  }
  function tL() {
    return `#${tH(this.r)}${tH(this.g)}${tH(this.b)}`;
  }
  function tU() {
    let t = tz(this.opacity);
    return `${1 === t ? "rgb(" : "rgba("}${t$(this.r)}, ${t$(this.g)}, ${t$(this.b)}${1 === t ? ")" : `, ${t})`}`;
  }
  function tz(t) {
    return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
  }
  function t$(t) {
    return Math.max(0, Math.min(255, Math.round(t) || 0));
  }
  function tH(t) {
    return ((t = t$(t)) < 16 ? "0" : "") + t.toString(16);
  }
  function tF(t, e, r, n) {
    return (
      n <= 0
        ? (t = e = r = 0 / 0)
        : r <= 0 || r >= 1
          ? (t = e = 0 / 0)
          : e <= 0 && (t = 0 / 0),
      new tX(t, e, r, n)
    );
  }
  function tW(t) {
    if (t instanceof tX) return new tX(t.h, t.s, t.l, t.opacity);
    if ((t instanceof tb || (t = tI(t)), !t)) return new tX();
    if (t instanceof tX) return t;
    var e = (t = t.rgb()).r / 255,
      r = t.g / 255,
      n = t.b / 255,
      o = Math.min(e, r, n),
      i = Math.max(e, r, n),
      a = 0 / 0,
      u = i - o,
      c = (i + o) / 2;
    return (
      u
        ? ((a =
            e === i
              ? (r - n) / u + (r < n) * 6
              : r === i
                ? (n - e) / u + 2
                : (e - r) / u + 4),
          (u /= c < 0.5 ? i + o : 2 - i - o),
          (a *= 60))
        : (u = c > 0 && c < 1 ? 0 : a),
      new tX(a, u, c, t.opacity)
    );
  }
  function tX(t, e, r, n) {
    ((this.h = +t), (this.s = +e), (this.l = +r), (this.opacity = +n));
  }
  function tq(t) {
    return (t = (t || 0) % 360) < 0 ? t + 360 : t;
  }
  function tV(t) {
    return Math.max(0, Math.min(1, t || 0));
  }
  function tG(t, e, r) {
    return (
      (t < 60
        ? e + ((r - e) * t) / 60
        : t < 180
          ? r
          : t < 240
            ? e + ((r - e) * (240 - t)) / 60
            : e) * 255
    );
  }
  function tY(t, e, r, n, o) {
    var i = t * t,
      a = i * t;
    return (
      ((1 - 3 * t + 3 * i - a) * e +
        (4 - 6 * i + 3 * a) * r +
        (1 + 3 * t + 3 * i - 3 * a) * n +
        a * o) /
      6
    );
  }
  (tv(tb, tI, {
    copy(t) {
      return Object.assign(new this.constructor(), this, t);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: t_,
    formatHex: t_,
    formatHex8: function () {
      return this.rgb().formatHex8();
    },
    formatHsl: function () {
      return tW(this).formatHsl();
    },
    formatRgb: tC,
    toString: tC,
  }),
    tv(
      tR,
      tB,
      tm(tb, {
        brighter(t) {
          return (
            (t = null == t ? tg : Math.pow(tg, t)),
            new tR(this.r * t, this.g * t, this.b * t, this.opacity)
          );
        },
        darker(t) {
          return (
            (t = null == t ? 0.7 : Math.pow(0.7, t)),
            new tR(this.r * t, this.g * t, this.b * t, this.opacity)
          );
        },
        rgb() {
          return this;
        },
        clamp() {
          return new tR(t$(this.r), t$(this.g), t$(this.b), tz(this.opacity));
        },
        displayable() {
          return (
            -0.5 <= this.r &&
            this.r < 255.5 &&
            -0.5 <= this.g &&
            this.g < 255.5 &&
            -0.5 <= this.b &&
            this.b < 255.5 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        hex: tL,
        formatHex: tL,
        formatHex8: function () {
          return `#${tH(this.r)}${tH(this.g)}${tH(this.b)}${tH((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
        },
        formatRgb: tU,
        toString: tU,
      }),
    ),
    tv(
      tX,
      function (t, e, r, n) {
        return 1 == arguments.length
          ? tW(t)
          : new tX(t, e, r, null == n ? 1 : n);
      },
      tm(tb, {
        brighter(t) {
          return (
            (t = null == t ? tg : Math.pow(tg, t)),
            new tX(this.h, this.s, this.l * t, this.opacity)
          );
        },
        darker(t) {
          return (
            (t = null == t ? 0.7 : Math.pow(0.7, t)),
            new tX(this.h, this.s, this.l * t, this.opacity)
          );
        },
        rgb() {
          var t = (this.h % 360) + (this.h < 0) * 360,
            e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
            r = this.l,
            n = r + (r < 0.5 ? r : 1 - r) * e,
            o = 2 * r - n;
          return new tR(
            tG(t >= 240 ? t - 240 : t + 120, o, n),
            tG(t, o, n),
            tG(t < 120 ? t + 240 : t - 120, o, n),
            this.opacity,
          );
        },
        clamp() {
          return new tX(tq(this.h), tV(this.s), tV(this.l), tz(this.opacity));
        },
        displayable() {
          return (
            ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
            0 <= this.l &&
            this.l <= 1 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        formatHsl() {
          let t = tz(this.opacity);
          return `${1 === t ? "hsl(" : "hsla("}${tq(this.h)}, ${100 * tV(this.s)}%, ${100 * tV(this.l)}%${1 === t ? ")" : `, ${t})`}`;
        },
      }),
    ));
  let tK = (t) => () => t;
  function tZ(t, e) {
    var r = e - t;
    return r
      ? function (e) {
          return t + e * r;
        }
      : tK(isNaN(t) ? e : t);
  }
  let tJ = (function t(e) {
    var r,
      n =
        1 == (r = +e)
          ? tZ
          : function (t, e) {
              var n, o, i;
              return e - t
                ? ((n = t),
                  (o = e),
                  (n = Math.pow(n, (i = r))),
                  (o = Math.pow(o, i) - n),
                  (i = 1 / i),
                  function (t) {
                    return Math.pow(n + t * o, i);
                  })
                : tK(isNaN(t) ? e : t);
            };
    function o(t, e) {
      var r = n((t = tB(t)).r, (e = tB(e)).r),
        o = n(t.g, e.g),
        i = n(t.b, e.b),
        a = tZ(t.opacity, e.opacity);
      return function (e) {
        return (
          (t.r = r(e)),
          (t.g = o(e)),
          (t.b = i(e)),
          (t.opacity = a(e)),
          t + ""
        );
      };
    }
    return ((o.gamma = t), o);
  })(1);
  function tQ(t) {
    return function (e) {
      var r,
        n,
        o = e.length,
        i = Array(o),
        a = Array(o),
        u = Array(o);
      for (r = 0; r < o; ++r)
        ((n = tB(e[r])),
          (i[r] = n.r || 0),
          (a[r] = n.g || 0),
          (u[r] = n.b || 0));
      return (
        (i = t(i)),
        (a = t(a)),
        (u = t(u)),
        (n.opacity = 1),
        function (t) {
          return ((n.r = i(t)), (n.g = a(t)), (n.b = u(t)), n + "");
        }
      );
    };
  }
  function t0(t, e) {
    return (
      (t *= 1),
      (e *= 1),
      function (r) {
        return t * (1 - r) + e * r;
      }
    );
  }
  (tQ(function (t) {
    var e = t.length - 1;
    return function (r) {
      var n = r <= 0 ? (r = 0) : r >= 1 ? ((r = 1), e - 1) : Math.floor(r * e),
        o = t[n],
        i = t[n + 1],
        a = n > 0 ? t[n - 1] : 2 * o - i,
        u = n < e - 1 ? t[n + 2] : 2 * i - o;
      return tY((r - n / e) * e, a, o, i, u);
    };
  }),
    tQ(function (t) {
      var e = t.length;
      return function (r) {
        var n = Math.floor(((r %= 1) < 0 ? ++r : r) * e),
          o = t[(n + e - 1) % e],
          i = t[n % e],
          a = t[(n + 1) % e],
          u = t[(n + 2) % e];
        return tY((r - n / e) * e, o, i, a, u);
      };
    }));
  var t1 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    t2 = RegExp(t1.source, "g");
  function t3(t, e) {
    var r,
      n,
      o = typeof e;
    return null == e || "boolean" === o
      ? tK(e)
      : ("number" === o
          ? t0
          : "string" === o
            ? (n = tI(e))
              ? ((e = n), tJ)
              : function (t, e) {
                  var r,
                    n,
                    o,
                    i,
                    a,
                    u = (t1.lastIndex = t2.lastIndex = 0),
                    c = -1,
                    l = [],
                    s = [];
                  for (t += "", e += ""; (o = t1.exec(t)) && (i = t2.exec(e)); )
                    ((a = i.index) > u &&
                      ((a = e.slice(u, a)), l[c] ? (l[c] += a) : (l[++c] = a)),
                      (o = o[0]) === (i = i[0])
                        ? l[c]
                          ? (l[c] += i)
                          : (l[++c] = i)
                        : ((l[++c] = null), s.push({ i: c, x: t0(o, i) })),
                      (u = t2.lastIndex));
                  return (
                    u < e.length &&
                      ((a = e.slice(u)), l[c] ? (l[c] += a) : (l[++c] = a)),
                    l.length < 2
                      ? s[0]
                        ? ((r = s[0].x),
                          function (t) {
                            return r(t) + "";
                          })
                        : ((n = e),
                          function () {
                            return n;
                          })
                      : ((e = s.length),
                        function (t) {
                          for (var r, n = 0; n < e; ++n)
                            l[(r = s[n]).i] = r.x(t);
                          return l.join("");
                        })
                  );
                }
            : e instanceof tI
              ? tJ
              : e instanceof Date
                ? function (t, e) {
                    var r = new Date();
                    return (
                      (t *= 1),
                      (e *= 1),
                      function (n) {
                        return (r.setTime(t * (1 - n) + e * n), r);
                      }
                    );
                  }
                : !ArrayBuffer.isView((r = e)) || r instanceof DataView
                  ? Array.isArray(e)
                    ? function (t, e) {
                        var r,
                          n = e ? e.length : 0,
                          o = t ? Math.min(n, t.length) : 0,
                          i = Array(o),
                          a = Array(n);
                        for (r = 0; r < o; ++r) i[r] = t3(t[r], e[r]);
                        for (; r < n; ++r) a[r] = e[r];
                        return function (t) {
                          for (r = 0; r < o; ++r) a[r] = i[r](t);
                          return a;
                        };
                      }
                    : ("function" != typeof e.valueOf &&
                          "function" != typeof e.toString) ||
                        isNaN(e)
                      ? function (t, e) {
                          var r,
                            n = {},
                            o = {};
                          for (r in ((null === t || "object" != typeof t) &&
                            (t = {}),
                          (null === e || "object" != typeof e) && (e = {}),
                          e))
                            r in t ? (n[r] = t3(t[r], e[r])) : (o[r] = e[r]);
                          return function (t) {
                            for (r in n) o[r] = n[r](t);
                            return o;
                          };
                        }
                      : t0
                  : function (t, e) {
                      e || (e = []);
                      var r,
                        n = t ? Math.min(e.length, t.length) : 0,
                        o = e.slice();
                      return function (i) {
                        for (r = 0; r < n; ++r)
                          o[r] = t[r] * (1 - i) + e[r] * i;
                        return o;
                      };
                    })(t, e);
  }
  function t4(t, e) {
    return (
      (t *= 1),
      (e *= 1),
      function (r) {
        return Math.round(t * (1 - r) + e * r);
      }
    );
  }
  function t8(t) {
    return +t;
  }
  var t6 = [0, 1];
  function t5(t) {
    return t;
  }
  function t9(t, e) {
    var r;
    return (e -= t *= 1)
      ? function (r) {
          return (r - t) / e;
        }
      : ((r = isNaN(e) ? 0 / 0 : 0.5),
        function () {
          return r;
        });
  }
  function t7(t, e, r) {
    var n = t[0],
      o = t[1],
      i = e[0],
      a = e[1];
    return (
      o < n ? ((n = t9(o, n)), (i = r(a, i))) : ((n = t9(n, o)), (i = r(i, a))),
      function (t) {
        return i(n(t));
      }
    );
  }
  function et(t, e, r) {
    var n = Math.min(t.length, e.length) - 1,
      o = Array(n),
      i = Array(n),
      a = -1;
    for (
      t[n] < t[0] && ((t = t.slice().reverse()), (e = e.slice().reverse()));
      ++a < n;

    )
      ((o[a] = t9(t[a], t[a + 1])), (i[a] = r(e[a], e[a + 1])));
    return function (e) {
      var r = ty(t, e, 1, n) - 1;
      return i[r](o[r](e));
    };
  }
  function ee(t, e) {
    return e
      .domain(t.domain())
      .range(t.range())
      .interpolate(t.interpolate())
      .clamp(t.clamp())
      .unknown(t.unknown());
  }
  function er() {
    var t,
      e,
      r,
      n,
      o,
      i,
      a = t6,
      u = t6,
      c = t3,
      l = t5;
    function s() {
      var t,
        e,
        r,
        c = Math.min(a.length, u.length);
      return (
        l !== t5 &&
          ((t = a[0]),
          (e = a[c - 1]),
          t > e && ((r = t), (t = e), (e = r)),
          (l = function (r) {
            return Math.max(t, Math.min(e, r));
          })),
        (n = c > 2 ? et : t7),
        (o = i = null),
        f
      );
    }
    function f(e) {
      return null == e || isNaN((e *= 1))
        ? r
        : (o || (o = n(a.map(t), u, c)))(t(l(e)));
    }
    return (
      (f.invert = function (r) {
        return l(e((i || (i = n(u, a.map(t), t0)))(r)));
      }),
      (f.domain = function (t) {
        return arguments.length ? ((a = Array.from(t, t8)), s()) : a.slice();
      }),
      (f.range = function (t) {
        return arguments.length ? ((u = Array.from(t)), s()) : u.slice();
      }),
      (f.rangeRound = function (t) {
        return ((u = Array.from(t)), (c = t4), s());
      }),
      (f.clamp = function (t) {
        return arguments.length ? ((l = !!t || t5), s()) : l !== t5;
      }),
      (f.interpolate = function (t) {
        return arguments.length ? ((c = t), s()) : c;
      }),
      (f.unknown = function (t) {
        return arguments.length ? ((r = t), f) : r;
      }),
      function (r, n) {
        return ((t = r), (e = n), s());
      }
    );
  }
  function en() {
    return er()(t5, t5);
  }
  function eo(t, e) {
    if (
      (r = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf("e")) <
      0
    )
      return null;
    var r,
      n = t.slice(0, r);
    return [n.length > 1 ? n[0] + n.slice(2) : n, +t.slice(r + 1)];
  }
  function ei(t) {
    return (t = eo(Math.abs(t))) ? t[1] : 0 / 0;
  }
  var ea =
    /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  function eu(t) {
    var e;
    if (!(e = ea.exec(t))) throw Error("invalid format: " + t);
    return new ec({
      fill: e[1],
      align: e[2],
      sign: e[3],
      symbol: e[4],
      zero: e[5],
      width: e[6],
      comma: e[7],
      precision: e[8] && e[8].slice(1),
      trim: e[9],
      type: e[10],
    });
  }
  function ec(t) {
    ((this.fill = void 0 === t.fill ? " " : t.fill + ""),
      (this.align = void 0 === t.align ? ">" : t.align + ""),
      (this.sign = void 0 === t.sign ? "-" : t.sign + ""),
      (this.symbol = void 0 === t.symbol ? "" : t.symbol + ""),
      (this.zero = !!t.zero),
      (this.width = void 0 === t.width ? void 0 : +t.width),
      (this.comma = !!t.comma),
      (this.precision = void 0 === t.precision ? void 0 : +t.precision),
      (this.trim = !!t.trim),
      (this.type = void 0 === t.type ? "" : t.type + ""));
  }
  function el(t, e) {
    var r = eo(t, e);
    if (!r) return t + "";
    var n = r[0],
      o = r[1];
    return o < 0
      ? "0." + Array(-o).join("0") + n
      : n.length > o + 1
        ? n.slice(0, o + 1) + "." + n.slice(o + 1)
        : n + Array(o - n.length + 2).join("0");
  }
  ((eu.prototype = ec.prototype),
    (ec.prototype.toString = function () {
      return (
        this.fill +
        this.align +
        this.sign +
        this.symbol +
        (this.zero ? "0" : "") +
        (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) +
        (this.comma ? "," : "") +
        (void 0 === this.precision
          ? ""
          : "." + Math.max(0, 0 | this.precision)) +
        (this.trim ? "~" : "") +
        this.type
      );
    }));
  let es = {
    "%": (t, e) => (100 * t).toFixed(e),
    b: (t) => Math.round(t).toString(2),
    c: (t) => t + "",
    d: function (t) {
      return Math.abs((t = Math.round(t))) >= 1e21
        ? t.toLocaleString("en").replace(/,/g, "")
        : t.toString(10);
    },
    e: (t, e) => t.toExponential(e),
    f: (t, e) => t.toFixed(e),
    g: (t, e) => t.toPrecision(e),
    o: (t) => Math.round(t).toString(8),
    p: (t, e) => el(100 * t, e),
    r: el,
    s: function (t, r) {
      var n = eo(t, r);
      if (!n) return t + "";
      var o = n[0],
        i = n[1],
        a = i - (e = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
        u = o.length;
      return a === u
        ? o
        : a > u
          ? o + Array(a - u + 1).join("0")
          : a > 0
            ? o.slice(0, a) + "." + o.slice(a)
            : "0." + Array(1 - a).join("0") + eo(t, Math.max(0, r + a - 1))[0];
    },
    X: (t) => Math.round(t).toString(16).toUpperCase(),
    x: (t) => Math.round(t).toString(16),
  };
  function ef(t) {
    return t;
  }
  var ep = Array.prototype.map,
    ed = [
      "y",
      "z",
      "a",
      "f",
      "p",
      "n",
      "µ",
      "m",
      "",
      "k",
      "M",
      "G",
      "T",
      "P",
      "E",
      "Z",
      "Y",
    ];
  function eh(t, e, r, i) {
    var a,
      u,
      c = tc(t, e, r);
    switch ((i = eu(null == i ? ",f" : i)).type) {
      case "s":
        var l = Math.max(Math.abs(t), Math.abs(e));
        return (
          null != i.precision ||
            isNaN(
              (u = Math.max(
                0,
                3 * Math.max(-8, Math.min(8, Math.floor(ei(l) / 3))) -
                  ei(Math.abs(c)),
              )),
            ) ||
            (i.precision = u),
          o(i, l)
        );
      case "":
      case "e":
      case "g":
      case "p":
      case "r":
        null != i.precision ||
          isNaN(
            (u =
              Math.max(
                0,
                ei(
                  Math.abs(Math.max(Math.abs(t), Math.abs(e))) -
                    (a = Math.abs((a = c))),
                ) - ei(a),
              ) + 1),
          ) ||
          (i.precision = u - ("e" === i.type));
        break;
      case "f":
      case "%":
        null != i.precision ||
          isNaN((u = Math.max(0, -ei(Math.abs(c))))) ||
          (i.precision = u - ("%" === i.type) * 2);
    }
    return n(i);
  }
  function ey(t) {
    var e = t.domain;
    return (
      (t.ticks = function (t) {
        var r = e();
        return ta(r[0], r[r.length - 1], null == t ? 10 : t);
      }),
      (t.tickFormat = function (t, r) {
        var n = e();
        return eh(n[0], n[n.length - 1], null == t ? 10 : t, r);
      }),
      (t.nice = function (r) {
        null == r && (r = 10);
        var n,
          o,
          i = e(),
          a = 0,
          u = i.length - 1,
          c = i[a],
          l = i[u],
          s = 10;
        for (
          l < c && ((o = c), (c = l), (l = o), (o = a), (a = u), (u = o));
          s-- > 0;

        ) {
          if ((o = tu(c, l, r)) === n) return ((i[a] = c), (i[u] = l), e(i));
          if (o > 0) ((c = Math.floor(c / o) * o), (l = Math.ceil(l / o) * o));
          else if (o < 0)
            ((c = Math.ceil(c * o) / o), (l = Math.floor(l * o) / o));
          else break;
          n = o;
        }
        return t;
      }),
      t
    );
  }
  function ev() {
    var t = en();
    return (
      (t.copy = function () {
        return ee(t, ev());
      }),
      V.apply(t, arguments),
      ey(t)
    );
  }
  function em(t) {
    var e;
    function r(t) {
      return null == t || isNaN((t *= 1)) ? e : t;
    }
    return (
      (r.invert = r),
      (r.domain = r.range =
        function (e) {
          return arguments.length ? ((t = Array.from(e, t8)), r) : t.slice();
        }),
      (r.unknown = function (t) {
        return arguments.length ? ((e = t), r) : e;
      }),
      (r.copy = function () {
        return em(t).unknown(e);
      }),
      (t = arguments.length ? Array.from(t, t8) : [0, 1]),
      ey(r)
    );
  }
  function eb(t, e) {
    t = t.slice();
    var r,
      n = 0,
      o = t.length - 1,
      i = t[n],
      a = t[o];
    return (
      a < i && ((r = n), (n = o), (o = r), (r = i), (i = a), (a = r)),
      (t[n] = e.floor(i)),
      (t[o] = e.ceil(a)),
      t
    );
  }
  function eg(t) {
    return Math.log(t);
  }
  function ex(t) {
    return Math.exp(t);
  }
  function eO(t) {
    return -Math.log(-t);
  }
  function ew(t) {
    return -Math.exp(-t);
  }
  function ej(t) {
    return isFinite(t) ? +("1e" + t) : t < 0 ? 0 : t;
  }
  function eS(t) {
    return (e, r) => -t(-e, r);
  }
  function eP(t) {
    let e,
      r,
      o = t(eg, ex),
      i = o.domain,
      a = 10;
    function u() {
      var n, u;
      return (
        (e =
          (n = a) === Math.E
            ? Math.log
            : (10 === n && Math.log10) ||
              (2 === n && Math.log2) ||
              ((n = Math.log(n)), (t) => Math.log(t) / n)),
        (r =
          10 === (u = a)
            ? ej
            : u === Math.E
              ? Math.exp
              : (t) => Math.pow(u, t)),
        i()[0] < 0 ? ((e = eS(e)), (r = eS(r)), t(eO, ew)) : t(eg, ex),
        o
      );
    }
    return (
      (o.base = function (t) {
        return arguments.length ? ((a = +t), u()) : a;
      }),
      (o.domain = function (t) {
        return arguments.length ? (i(t), u()) : i();
      }),
      (o.ticks = (t) => {
        let n,
          o,
          u = i(),
          c = u[0],
          l = u[u.length - 1],
          s = l < c;
        s && ([c, l] = [l, c]);
        let f = e(c),
          p = e(l),
          d = null == t ? 10 : +t,
          h = [];
        if (!(a % 1) && p - f < d) {
          if (((f = Math.floor(f)), (p = Math.ceil(p)), c > 0)) {
            for (; f <= p; ++f)
              for (n = 1; n < a; ++n)
                if (!((o = f < 0 ? n / r(-f) : n * r(f)) < c)) {
                  if (o > l) break;
                  h.push(o);
                }
          } else
            for (; f <= p; ++f)
              for (n = a - 1; n >= 1; --n)
                if (!((o = f > 0 ? n / r(-f) : n * r(f)) < c)) {
                  if (o > l) break;
                  h.push(o);
                }
          2 * h.length < d && (h = ta(c, l, d));
        } else h = ta(f, p, Math.min(p - f, d)).map(r);
        return s ? h.reverse() : h;
      }),
      (o.tickFormat = (t, i) => {
        if (
          (null == t && (t = 10),
          null == i && (i = 10 === a ? "s" : ","),
          "function" != typeof i &&
            (a % 1 || null != (i = eu(i)).precision || (i.trim = !0),
            (i = n(i))),
          1 / 0 === t)
        )
          return i;
        let u = Math.max(1, (a * t) / o.ticks().length);
        return (t) => {
          let n = t / r(Math.round(e(t)));
          return (n * a < a - 0.5 && (n *= a), n <= u ? i(t) : "");
        };
      }),
      (o.nice = () =>
        i(
          eb(i(), {
            floor: (t) => r(Math.floor(e(t))),
            ceil: (t) => r(Math.ceil(e(t))),
          }),
        )),
      o
    );
  }
  function eA() {
    let t = eP(er()).domain([1, 10]);
    return (
      (t.copy = () => ee(t, eA()).base(t.base())),
      V.apply(t, arguments),
      t
    );
  }
  function eE(t) {
    return function (e) {
      return Math.sign(e) * Math.log1p(Math.abs(e / t));
    };
  }
  function eM(t) {
    return function (e) {
      return Math.sign(e) * Math.expm1(Math.abs(e)) * t;
    };
  }
  function ek(t) {
    var e = 1,
      r = t(eE(1), eM(e));
    return (
      (r.constant = function (r) {
        return arguments.length ? t(eE((e = +r)), eM(e)) : e;
      }),
      ey(r)
    );
  }
  function eT() {
    var t = ek(er());
    return (
      (t.copy = function () {
        return ee(t, eT()).constant(t.constant());
      }),
      V.apply(t, arguments)
    );
  }
  function e_(t) {
    return function (e) {
      return e < 0 ? -Math.pow(-e, t) : Math.pow(e, t);
    };
  }
  function eC(t) {
    return t < 0 ? -Math.sqrt(-t) : Math.sqrt(t);
  }
  function eI(t) {
    return t < 0 ? -t * t : t * t;
  }
  function eD(t) {
    var e = t(t5, t5),
      r = 1;
    return (
      (e.exponent = function (e) {
        return arguments.length
          ? 1 == (r = +e)
            ? t(t5, t5)
            : 0.5 === r
              ? t(eC, eI)
              : t(e_(r), e_(1 / r))
          : r;
      }),
      ey(e)
    );
  }
  function eN() {
    var t = eD(er());
    return (
      (t.copy = function () {
        return ee(t, eN()).exponent(t.exponent());
      }),
      V.apply(t, arguments),
      t
    );
  }
  function eB() {
    return eN.apply(null, arguments).exponent(0.5);
  }
  function eR(t) {
    return Math.sign(t) * t * t;
  }
  function eL() {
    var t,
      e = en(),
      r = [0, 1],
      n = !1;
    function o(r) {
      var o,
        i = Math.sign((o = e(r))) * Math.sqrt(Math.abs(o));
      return isNaN(i) ? t : n ? Math.round(i) : i;
    }
    return (
      (o.invert = function (t) {
        return e.invert(eR(t));
      }),
      (o.domain = function (t) {
        return arguments.length ? (e.domain(t), o) : e.domain();
      }),
      (o.range = function (t) {
        return arguments.length
          ? (e.range((r = Array.from(t, t8)).map(eR)), o)
          : r.slice();
      }),
      (o.rangeRound = function (t) {
        return o.range(t).round(!0);
      }),
      (o.round = function (t) {
        return arguments.length ? ((n = !!t), o) : n;
      }),
      (o.clamp = function (t) {
        return arguments.length ? (e.clamp(t), o) : e.clamp();
      }),
      (o.unknown = function (e) {
        return arguments.length ? ((t = e), o) : t;
      }),
      (o.copy = function () {
        return eL(e.domain(), r).round(n).clamp(e.clamp()).unknown(t);
      }),
      V.apply(o, arguments),
      ey(o)
    );
  }
  function eU(t, e) {
    let r;
    if (void 0 === e)
      for (let e of t)
        null != e && (r < e || (void 0 === r && e >= e)) && (r = e);
    else {
      let n = -1;
      for (let o of t)
        null != (o = e(o, ++n, t)) &&
          (r < o || (void 0 === r && o >= o)) &&
          (r = o);
    }
    return r;
  }
  function ez(t, e) {
    let r;
    if (void 0 === e)
      for (let e of t)
        null != e && (r > e || (void 0 === r && e >= e)) && (r = e);
    else {
      let n = -1;
      for (let o of t)
        null != (o = e(o, ++n, t)) &&
          (r > o || (void 0 === r && o >= o)) &&
          (r = o);
    }
    return r;
  }
  function e$(t, e) {
    return (
      (null == t || !(t >= t)) - (null == e || !(e >= e)) ||
      (t < e ? -1 : +(t > e))
    );
  }
  function eH(t, e, r) {
    let n = t[e];
    ((t[e] = t[r]), (t[r] = n));
  }
  function eF() {
    var t,
      e = [],
      r = [],
      n = [];
    function o() {
      var t = 0,
        o = Math.max(1, r.length);
      for (n = Array(o - 1); ++t < o; )
        n[t - 1] = (function (t, e, r = td) {
          if (!(!(n = t.length) || isNaN((e *= 1)))) {
            if (e <= 0 || n < 2) return +r(t[0], 0, t);
            if (e >= 1) return +r(t[n - 1], n - 1, t);
            var n,
              o = (n - 1) * e,
              i = Math.floor(o),
              a = +r(t[i], i, t);
            return a + (r(t[i + 1], i + 1, t) - a) * (o - i);
          }
        })(e, t / o);
      return i;
    }
    function i(e) {
      return null == e || isNaN((e *= 1)) ? t : r[ty(n, e)];
    }
    return (
      (i.invertExtent = function (t) {
        var o = r.indexOf(t);
        return o < 0
          ? [0 / 0, 0 / 0]
          : [o > 0 ? n[o - 1] : e[0], o < n.length ? n[o] : e[e.length - 1]];
      }),
      (i.domain = function (t) {
        if (!arguments.length) return e.slice();
        for (let r of ((e = []), t)) null == r || isNaN((r *= 1)) || e.push(r);
        return (e.sort(tl), o());
      }),
      (i.range = function (t) {
        return arguments.length ? ((r = Array.from(t)), o()) : r.slice();
      }),
      (i.unknown = function (e) {
        return arguments.length ? ((t = e), i) : t;
      }),
      (i.quantiles = function () {
        return n.slice();
      }),
      (i.copy = function () {
        return eF().domain(e).range(r).unknown(t);
      }),
      V.apply(i, arguments)
    );
  }
  function eW() {
    var t,
      e = 0,
      r = 1,
      n = 1,
      o = [0.5],
      i = [0, 1];
    function a(e) {
      return null != e && e <= e ? i[ty(o, e, 0, n)] : t;
    }
    function u() {
      var t = -1;
      for (o = Array(n); ++t < n; )
        o[t] = ((t + 1) * r - (t - n) * e) / (n + 1);
      return a;
    }
    return (
      (a.domain = function (t) {
        return arguments.length
          ? (([e, r] = t), (e *= 1), (r *= 1), u())
          : [e, r];
      }),
      (a.range = function (t) {
        return arguments.length
          ? ((n = (i = Array.from(t)).length - 1), u())
          : i.slice();
      }),
      (a.invertExtent = function (t) {
        var a = i.indexOf(t);
        return a < 0
          ? [0 / 0, 0 / 0]
          : a < 1
            ? [e, o[0]]
            : a >= n
              ? [o[n - 1], r]
              : [o[a - 1], o[a]];
      }),
      (a.unknown = function (e) {
        return (arguments.length && (t = e), a);
      }),
      (a.thresholds = function () {
        return o.slice();
      }),
      (a.copy = function () {
        return eW().domain([e, r]).range(i).unknown(t);
      }),
      V.apply(ey(a), arguments)
    );
  }
  function eX() {
    var t,
      e = [0.5],
      r = [0, 1],
      n = 1;
    function o(o) {
      return null != o && o <= o ? r[ty(e, o, 0, n)] : t;
    }
    return (
      (o.domain = function (t) {
        return arguments.length
          ? ((n = Math.min((e = Array.from(t)).length, r.length - 1)), o)
          : e.slice();
      }),
      (o.range = function (t) {
        return arguments.length
          ? ((r = Array.from(t)), (n = Math.min(e.length, r.length - 1)), o)
          : r.slice();
      }),
      (o.invertExtent = function (t) {
        var n = r.indexOf(t);
        return [e[n - 1], e[n]];
      }),
      (o.unknown = function (e) {
        return arguments.length ? ((t = e), o) : t;
      }),
      (o.copy = function () {
        return eX().domain(e).range(r).unknown(t);
      }),
      V.apply(o, arguments)
    );
  }
  ((n = (r = (function (t) {
    var r,
      n,
      o,
      i =
        void 0 === t.grouping || void 0 === t.thousands
          ? ef
          : ((r = ep.call(t.grouping, Number)),
            (n = t.thousands + ""),
            function (t, e) {
              for (
                var o = t.length, i = [], a = 0, u = r[0], c = 0;
                o > 0 &&
                u > 0 &&
                (c + u + 1 > e && (u = Math.max(1, e - c)),
                i.push(t.substring((o -= u), o + u)),
                !((c += u + 1) > e));

              )
                u = r[(a = (a + 1) % r.length)];
              return i.reverse().join(n);
            }),
      a = void 0 === t.currency ? "" : t.currency[0] + "",
      u = void 0 === t.currency ? "" : t.currency[1] + "",
      c = void 0 === t.decimal ? "." : t.decimal + "",
      l =
        void 0 === t.numerals
          ? ef
          : ((o = ep.call(t.numerals, String)),
            function (t) {
              return t.replace(/[0-9]/g, function (t) {
                return o[+t];
              });
            }),
      s = void 0 === t.percent ? "%" : t.percent + "",
      f = void 0 === t.minus ? "−" : t.minus + "",
      p = void 0 === t.nan ? "NaN" : t.nan + "";
    function d(t) {
      var r = (t = eu(t)).fill,
        n = t.align,
        o = t.sign,
        d = t.symbol,
        h = t.zero,
        y = t.width,
        v = t.comma,
        m = t.precision,
        b = t.trim,
        g = t.type;
      ("n" === g
        ? ((v = !0), (g = "g"))
        : es[g] || (void 0 === m && (m = 12), (b = !0), (g = "g")),
        (h || ("0" === r && "=" === n)) && ((h = !0), (r = "0"), (n = "=")));
      var x =
          "$" === d
            ? a
            : "#" === d && /[boxX]/.test(g)
              ? "0" + g.toLowerCase()
              : "",
        O = "$" === d ? u : /[%p]/.test(g) ? s : "",
        w = es[g],
        j = /[defgprs%]/.test(g);
      function S(t) {
        var a,
          u,
          s,
          d = x,
          S = O;
        if ("c" === g) ((S = w(t) + S), (t = ""));
        else {
          var P = (t *= 1) < 0 || 1 / t < 0;
          if (
            ((t = isNaN(t) ? p : w(Math.abs(t), m)),
            b &&
              (t = (function (t) {
                t: for (var e, r = t.length, n = 1, o = -1; n < r; ++n)
                  switch (t[n]) {
                    case ".":
                      o = e = n;
                      break;
                    case "0":
                      (0 === o && (o = n), (e = n));
                      break;
                    default:
                      if (!+t[n]) break t;
                      o > 0 && (o = 0);
                  }
                return o > 0 ? t.slice(0, o) + t.slice(e + 1) : t;
              })(t)),
            P && 0 == +t && "+" !== o && (P = !1),
            (d =
              (P ? ("(" === o ? o : f) : "-" === o || "(" === o ? "" : o) + d),
            (S =
              ("s" === g ? ed[8 + e / 3] : "") +
              S +
              (P && "(" === o ? ")" : "")),
            j)
          ) {
            for (a = -1, u = t.length; ++a < u; )
              if (48 > (s = t.charCodeAt(a)) || s > 57) {
                ((S = (46 === s ? c + t.slice(a + 1) : t.slice(a)) + S),
                  (t = t.slice(0, a)));
                break;
              }
          }
        }
        v && !h && (t = i(t, 1 / 0));
        var A = d.length + t.length + S.length,
          E = A < y ? Array(y - A + 1).join(r) : "";
        switch (
          (v &&
            h &&
            ((t = i(E + t, E.length ? y - S.length : 1 / 0)), (E = "")),
          n)
        ) {
          case "<":
            t = d + t + S + E;
            break;
          case "=":
            t = d + E + t + S;
            break;
          case "^":
            t = E.slice(0, (A = E.length >> 1)) + d + t + S + E.slice(A);
            break;
          default:
            t = E + d + t + S;
        }
        return l(t);
      }
      return (
        (m =
          void 0 === m
            ? 6
            : /[gprs]/.test(g)
              ? Math.max(1, Math.min(21, m))
              : Math.max(0, Math.min(20, m))),
        (S.toString = function () {
          return t + "";
        }),
        S
      );
    }
    return {
      format: d,
      formatPrefix: function (t, e) {
        var r = d((((t = eu(t)).type = "f"), t)),
          n = 3 * Math.max(-8, Math.min(8, Math.floor(ei(e) / 3))),
          o = Math.pow(10, -n),
          i = ed[8 + n / 3];
        return function (t) {
          return r(o * t) + i;
        };
      },
    };
  })({ thousands: ",", grouping: [3], currency: ["$", ""] })).format),
    (o = r.formatPrefix));
  let eq = new Date(),
    eV = new Date();
  function eG(t, e, r, n) {
    function o(e) {
      return (t((e = 0 == arguments.length ? new Date() : new Date(+e))), e);
    }
    return (
      (o.floor = (e) => (t((e = new Date(+e))), e)),
      (o.ceil = (r) => (t((r = new Date(r - 1))), e(r, 1), t(r), r)),
      (o.round = (t) => {
        let e = o(t),
          r = o.ceil(t);
        return t - e < r - t ? e : r;
      }),
      (o.offset = (t, r) => (
        e((t = new Date(+t)), null == r ? 1 : Math.floor(r)),
        t
      )),
      (o.range = (r, n, i) => {
        let a,
          u = [];
        if (
          ((r = o.ceil(r)),
          (i = null == i ? 1 : Math.floor(i)),
          !(r < n) || !(i > 0))
        )
          return u;
        do (u.push((a = new Date(+r))), e(r, i), t(r));
        while (a < r && r < n);
        return u;
      }),
      (o.filter = (r) =>
        eG(
          (e) => {
            if (e >= e) for (; t(e), !r(e); ) e.setTime(e - 1);
          },
          (t, n) => {
            if (t >= t)
              if (n < 0) for (; ++n <= 0; ) for (; e(t, -1), !r(t); );
              else for (; --n >= 0; ) for (; e(t, 1), !r(t); );
          },
        )),
      r &&
        ((o.count = (e, n) => (
          eq.setTime(+e),
          eV.setTime(+n),
          t(eq),
          t(eV),
          Math.floor(r(eq, eV))
        )),
        (o.every = (t) =>
          isFinite((t = Math.floor(t))) && t > 0
            ? t > 1
              ? o.filter(
                  n ? (e) => n(e) % t == 0 : (e) => o.count(0, e) % t == 0,
                )
              : o
            : null)),
      o
    );
  }
  let eY = eG(
    (t) => {
      (t.setMonth(0, 1), t.setHours(0, 0, 0, 0));
    },
    (t, e) => {
      t.setFullYear(t.getFullYear() + e);
    },
    (t, e) => e.getFullYear() - t.getFullYear(),
    (t) => t.getFullYear(),
  );
  ((eY.every = (t) =>
    isFinite((t = Math.floor(t))) && t > 0
      ? eG(
          (e) => {
            (e.setFullYear(Math.floor(e.getFullYear() / t) * t),
              e.setMonth(0, 1),
              e.setHours(0, 0, 0, 0));
          },
          (e, r) => {
            e.setFullYear(e.getFullYear() + r * t);
          },
        )
      : null),
    eY.range);
  let eK = eG(
    (t) => {
      (t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0));
    },
    (t, e) => {
      t.setUTCFullYear(t.getUTCFullYear() + e);
    },
    (t, e) => e.getUTCFullYear() - t.getUTCFullYear(),
    (t) => t.getUTCFullYear(),
  );
  ((eK.every = (t) =>
    isFinite((t = Math.floor(t))) && t > 0
      ? eG(
          (e) => {
            (e.setUTCFullYear(Math.floor(e.getUTCFullYear() / t) * t),
              e.setUTCMonth(0, 1),
              e.setUTCHours(0, 0, 0, 0));
          },
          (e, r) => {
            e.setUTCFullYear(e.getUTCFullYear() + r * t);
          },
        )
      : null),
    eK.range);
  let eZ = eG(
    (t) => {
      (t.setDate(1), t.setHours(0, 0, 0, 0));
    },
    (t, e) => {
      t.setMonth(t.getMonth() + e);
    },
    (t, e) =>
      e.getMonth() - t.getMonth() + (e.getFullYear() - t.getFullYear()) * 12,
    (t) => t.getMonth(),
  );
  eZ.range;
  let eJ = eG(
    (t) => {
      (t.setUTCDate(1), t.setUTCHours(0, 0, 0, 0));
    },
    (t, e) => {
      t.setUTCMonth(t.getUTCMonth() + e);
    },
    (t, e) =>
      e.getUTCMonth() -
      t.getUTCMonth() +
      (e.getUTCFullYear() - t.getUTCFullYear()) * 12,
    (t) => t.getUTCMonth(),
  );
  eJ.range;
  function eQ(t) {
    return eG(
      (e) => {
        (e.setDate(e.getDate() - ((e.getDay() + 7 - t) % 7)),
          e.setHours(0, 0, 0, 0));
      },
      (t, e) => {
        t.setDate(t.getDate() + 7 * e);
      },
      (t, e) =>
        (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * 6e4) /
        6048e5,
    );
  }
  let e0 = eQ(0),
    e1 = eQ(1),
    e2 = eQ(2),
    e3 = eQ(3),
    e4 = eQ(4),
    e8 = eQ(5),
    e6 = eQ(6);
  function e5(t) {
    return eG(
      (e) => {
        (e.setUTCDate(e.getUTCDate() - ((e.getUTCDay() + 7 - t) % 7)),
          e.setUTCHours(0, 0, 0, 0));
      },
      (t, e) => {
        t.setUTCDate(t.getUTCDate() + 7 * e);
      },
      (t, e) => (e - t) / 6048e5,
    );
  }
  (e0.range, e1.range, e2.range, e3.range, e4.range, e8.range, e6.range);
  let e9 = e5(0),
    e7 = e5(1),
    rt = e5(2),
    re = e5(3),
    rr = e5(4),
    rn = e5(5),
    ro = e5(6);
  (e9.range, e7.range, rt.range, re.range, rr.range, rn.range, ro.range);
  let ri = eG(
    (t) => t.setHours(0, 0, 0, 0),
    (t, e) => t.setDate(t.getDate() + e),
    (t, e) =>
      (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * 6e4) / 864e5,
    (t) => t.getDate() - 1,
  );
  ri.range;
  let ra = eG(
    (t) => {
      t.setUTCHours(0, 0, 0, 0);
    },
    (t, e) => {
      t.setUTCDate(t.getUTCDate() + e);
    },
    (t, e) => (e - t) / 864e5,
    (t) => t.getUTCDate() - 1,
  );
  ra.range;
  let ru = eG(
    (t) => {
      t.setUTCHours(0, 0, 0, 0);
    },
    (t, e) => {
      t.setUTCDate(t.getUTCDate() + e);
    },
    (t, e) => (e - t) / 864e5,
    (t) => Math.floor(t / 864e5),
  );
  ru.range;
  let rc = eG(
    (t) => {
      t.setTime(
        t - t.getMilliseconds() - 1e3 * t.getSeconds() - 6e4 * t.getMinutes(),
      );
    },
    (t, e) => {
      t.setTime(+t + 36e5 * e);
    },
    (t, e) => (e - t) / 36e5,
    (t) => t.getHours(),
  );
  rc.range;
  let rl = eG(
    (t) => {
      t.setUTCMinutes(0, 0, 0);
    },
    (t, e) => {
      t.setTime(+t + 36e5 * e);
    },
    (t, e) => (e - t) / 36e5,
    (t) => t.getUTCHours(),
  );
  rl.range;
  let rs = eG(
    (t) => {
      t.setTime(t - t.getMilliseconds() - 1e3 * t.getSeconds());
    },
    (t, e) => {
      t.setTime(+t + 6e4 * e);
    },
    (t, e) => (e - t) / 6e4,
    (t) => t.getMinutes(),
  );
  rs.range;
  let rf = eG(
    (t) => {
      t.setUTCSeconds(0, 0);
    },
    (t, e) => {
      t.setTime(+t + 6e4 * e);
    },
    (t, e) => (e - t) / 6e4,
    (t) => t.getUTCMinutes(),
  );
  rf.range;
  let rp = eG(
    (t) => {
      t.setTime(t - t.getMilliseconds());
    },
    (t, e) => {
      t.setTime(+t + 1e3 * e);
    },
    (t, e) => (e - t) / 1e3,
    (t) => t.getUTCSeconds(),
  );
  rp.range;
  let rd = eG(
    () => {},
    (t, e) => {
      t.setTime(+t + e);
    },
    (t, e) => e - t,
  );
  function rh(t, e, r, n, o, i) {
    let a = [
      [rp, 1, 1e3],
      [rp, 5, 5e3],
      [rp, 15, 15e3],
      [rp, 30, 3e4],
      [i, 1, 6e4],
      [i, 5, 3e5],
      [i, 15, 9e5],
      [i, 30, 18e5],
      [o, 1, 36e5],
      [o, 3, 108e5],
      [o, 6, 216e5],
      [o, 12, 432e5],
      [n, 1, 864e5],
      [n, 2, 1728e5],
      [r, 1, 6048e5],
      [e, 1, 2592e6],
      [e, 3, 7776e6],
      [t, 1, 31536e6],
    ];
    function u(e, r, n) {
      let o = Math.abs(r - e) / n,
        i = tf(([, , t]) => t).right(a, o);
      if (i === a.length) return t.every(tc(e / 31536e6, r / 31536e6, n));
      if (0 === i) return rd.every(Math.max(tc(e, r, n), 1));
      let [u, c] = a[o / a[i - 1][2] < a[i][2] / o ? i - 1 : i];
      return u.every(c);
    }
    return [
      function (t, e, r) {
        let n = e < t;
        n && ([t, e] = [e, t]);
        let o = r && "function" == typeof r.range ? r : u(t, e, r),
          i = o ? o.range(t, +e + 1) : [];
        return n ? i.reverse() : i;
      },
      u,
    ];
  }
  ((rd.every = (t) =>
    isFinite((t = Math.floor(t))) && t > 0
      ? t > 1
        ? eG(
            (e) => {
              e.setTime(Math.floor(e / t) * t);
            },
            (e, r) => {
              e.setTime(+e + r * t);
            },
            (e, r) => (r - e) / t,
          )
        : rd
      : null),
    rd.range);
  let [ry, rv] = rh(eK, eJ, e9, ru, rl, rf),
    [rm, rb] = rh(eY, eZ, e0, ri, rc, rs);
  function rg(t) {
    if (0 <= t.y && t.y < 100) {
      var e = new Date(-1, t.m, t.d, t.H, t.M, t.S, t.L);
      return (e.setFullYear(t.y), e);
    }
    return new Date(t.y, t.m, t.d, t.H, t.M, t.S, t.L);
  }
  function rx(t) {
    if (0 <= t.y && t.y < 100) {
      var e = new Date(Date.UTC(-1, t.m, t.d, t.H, t.M, t.S, t.L));
      return (e.setUTCFullYear(t.y), e);
    }
    return new Date(Date.UTC(t.y, t.m, t.d, t.H, t.M, t.S, t.L));
  }
  function rO(t, e, r) {
    return { y: t, m: e, d: r, H: 0, M: 0, S: 0, L: 0 };
  }
  var rw = { "-": "", _: " ", 0: "0" },
    rj = /^\s*\d+/,
    rS = /^%/,
    rP = /[\\^$*+?|[\]().{}]/g;
  function rA(t, e, r) {
    var n = t < 0 ? "-" : "",
      o = (n ? -t : t) + "",
      i = o.length;
    return n + (i < r ? Array(r - i + 1).join(e) + o : o);
  }
  function rE(t) {
    return t.replace(rP, "\\$&");
  }
  function rM(t) {
    return RegExp("^(?:" + t.map(rE).join("|") + ")", "i");
  }
  function rk(t) {
    return new Map(t.map((t, e) => [t.toLowerCase(), e]));
  }
  function rT(t, e, r) {
    var n = rj.exec(e.slice(r, r + 1));
    return n ? ((t.w = +n[0]), r + n[0].length) : -1;
  }
  function r_(t, e, r) {
    var n = rj.exec(e.slice(r, r + 1));
    return n ? ((t.u = +n[0]), r + n[0].length) : -1;
  }
  function rC(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.U = +n[0]), r + n[0].length) : -1;
  }
  function rI(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.V = +n[0]), r + n[0].length) : -1;
  }
  function rD(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.W = +n[0]), r + n[0].length) : -1;
  }
  function rN(t, e, r) {
    var n = rj.exec(e.slice(r, r + 4));
    return n ? ((t.y = +n[0]), r + n[0].length) : -1;
  }
  function rB(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n
      ? ((t.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3)), r + n[0].length)
      : -1;
  }
  function rR(t, e, r) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(r, r + 6));
    return n
      ? ((t.Z = n[1] ? 0 : -(n[2] + (n[3] || "00"))), r + n[0].length)
      : -1;
  }
  function rL(t, e, r) {
    var n = rj.exec(e.slice(r, r + 1));
    return n ? ((t.q = 3 * n[0] - 3), r + n[0].length) : -1;
  }
  function rU(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.m = n[0] - 1), r + n[0].length) : -1;
  }
  function rz(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.d = +n[0]), r + n[0].length) : -1;
  }
  function r$(t, e, r) {
    var n = rj.exec(e.slice(r, r + 3));
    return n ? ((t.m = 0), (t.d = +n[0]), r + n[0].length) : -1;
  }
  function rH(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.H = +n[0]), r + n[0].length) : -1;
  }
  function rF(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.M = +n[0]), r + n[0].length) : -1;
  }
  function rW(t, e, r) {
    var n = rj.exec(e.slice(r, r + 2));
    return n ? ((t.S = +n[0]), r + n[0].length) : -1;
  }
  function rX(t, e, r) {
    var n = rj.exec(e.slice(r, r + 3));
    return n ? ((t.L = +n[0]), r + n[0].length) : -1;
  }
  function rq(t, e, r) {
    var n = rj.exec(e.slice(r, r + 6));
    return n ? ((t.L = Math.floor(n[0] / 1e3)), r + n[0].length) : -1;
  }
  function rV(t, e, r) {
    var n = rS.exec(e.slice(r, r + 1));
    return n ? r + n[0].length : -1;
  }
  function rG(t, e, r) {
    var n = rj.exec(e.slice(r));
    return n ? ((t.Q = +n[0]), r + n[0].length) : -1;
  }
  function rY(t, e, r) {
    var n = rj.exec(e.slice(r));
    return n ? ((t.s = +n[0]), r + n[0].length) : -1;
  }
  function rK(t, e) {
    return rA(t.getDate(), e, 2);
  }
  function rZ(t, e) {
    return rA(t.getHours(), e, 2);
  }
  function rJ(t, e) {
    return rA(t.getHours() % 12 || 12, e, 2);
  }
  function rQ(t, e) {
    return rA(1 + ri.count(eY(t), t), e, 3);
  }
  function r0(t, e) {
    return rA(t.getMilliseconds(), e, 3);
  }
  function r1(t, e) {
    return r0(t, e) + "000";
  }
  function r2(t, e) {
    return rA(t.getMonth() + 1, e, 2);
  }
  function r3(t, e) {
    return rA(t.getMinutes(), e, 2);
  }
  function r4(t, e) {
    return rA(t.getSeconds(), e, 2);
  }
  function r8(t) {
    var e = t.getDay();
    return 0 === e ? 7 : e;
  }
  function r6(t, e) {
    return rA(e0.count(eY(t) - 1, t), e, 2);
  }
  function r5(t) {
    var e = t.getDay();
    return e >= 4 || 0 === e ? e4(t) : e4.ceil(t);
  }
  function r9(t, e) {
    return ((t = r5(t)), rA(e4.count(eY(t), t) + (4 === eY(t).getDay()), e, 2));
  }
  function r7(t) {
    return t.getDay();
  }
  function nt(t, e) {
    return rA(e1.count(eY(t) - 1, t), e, 2);
  }
  function ne(t, e) {
    return rA(t.getFullYear() % 100, e, 2);
  }
  function nr(t, e) {
    return rA((t = r5(t)).getFullYear() % 100, e, 2);
  }
  function nn(t, e) {
    return rA(t.getFullYear() % 1e4, e, 4);
  }
  function no(t, e) {
    var r = t.getDay();
    return rA(
      (t = r >= 4 || 0 === r ? e4(t) : e4.ceil(t)).getFullYear() % 1e4,
      e,
      4,
    );
  }
  function ni(t) {
    var e = t.getTimezoneOffset();
    return (
      (e > 0 ? "-" : ((e *= -1), "+")) +
      rA((e / 60) | 0, "0", 2) +
      rA(e % 60, "0", 2)
    );
  }
  function na(t, e) {
    return rA(t.getUTCDate(), e, 2);
  }
  function nu(t, e) {
    return rA(t.getUTCHours(), e, 2);
  }
  function nc(t, e) {
    return rA(t.getUTCHours() % 12 || 12, e, 2);
  }
  function nl(t, e) {
    return rA(1 + ra.count(eK(t), t), e, 3);
  }
  function ns(t, e) {
    return rA(t.getUTCMilliseconds(), e, 3);
  }
  function nf(t, e) {
    return ns(t, e) + "000";
  }
  function np(t, e) {
    return rA(t.getUTCMonth() + 1, e, 2);
  }
  function nd(t, e) {
    return rA(t.getUTCMinutes(), e, 2);
  }
  function nh(t, e) {
    return rA(t.getUTCSeconds(), e, 2);
  }
  function ny(t) {
    var e = t.getUTCDay();
    return 0 === e ? 7 : e;
  }
  function nv(t, e) {
    return rA(e9.count(eK(t) - 1, t), e, 2);
  }
  function nm(t) {
    var e = t.getUTCDay();
    return e >= 4 || 0 === e ? rr(t) : rr.ceil(t);
  }
  function nb(t, e) {
    return (
      (t = nm(t)),
      rA(rr.count(eK(t), t) + (4 === eK(t).getUTCDay()), e, 2)
    );
  }
  function ng(t) {
    return t.getUTCDay();
  }
  function nx(t, e) {
    return rA(e7.count(eK(t) - 1, t), e, 2);
  }
  function nO(t, e) {
    return rA(t.getUTCFullYear() % 100, e, 2);
  }
  function nw(t, e) {
    return rA((t = nm(t)).getUTCFullYear() % 100, e, 2);
  }
  function nj(t, e) {
    return rA(t.getUTCFullYear() % 1e4, e, 4);
  }
  function nS(t, e) {
    var r = t.getUTCDay();
    return rA(
      (t = r >= 4 || 0 === r ? rr(t) : rr.ceil(t)).getUTCFullYear() % 1e4,
      e,
      4,
    );
  }
  function nP() {
    return "+0000";
  }
  function nA() {
    return "%";
  }
  function nE(t) {
    return +t;
  }
  function nM(t) {
    return Math.floor(t / 1e3);
  }
  function nk(t) {
    return new Date(t);
  }
  function nT(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }
  function n_(t, e, r, n, o, i, a, u, c, l) {
    var s = en(),
      f = s.invert,
      p = s.domain,
      d = l(".%L"),
      h = l(":%S"),
      y = l("%I:%M"),
      v = l("%I %p"),
      m = l("%a %d"),
      b = l("%b %d"),
      g = l("%B"),
      x = l("%Y");
    function O(t) {
      return (
        c(t) < t
          ? d
          : u(t) < t
            ? h
            : a(t) < t
              ? y
              : i(t) < t
                ? v
                : n(t) < t
                  ? o(t) < t
                    ? m
                    : b
                  : r(t) < t
                    ? g
                    : x
      )(t);
    }
    return (
      (s.invert = function (t) {
        return new Date(f(t));
      }),
      (s.domain = function (t) {
        return arguments.length ? p(Array.from(t, nT)) : p().map(nk);
      }),
      (s.ticks = function (e) {
        var r = p();
        return t(r[0], r[r.length - 1], null == e ? 10 : e);
      }),
      (s.tickFormat = function (t, e) {
        return null == e ? O : l(e);
      }),
      (s.nice = function (t) {
        var r = p();
        return (
          (t && "function" == typeof t.range) ||
            (t = e(r[0], r[r.length - 1], null == t ? 10 : t)),
          t ? p(eb(r, t)) : s
        );
      }),
      (s.copy = function () {
        return ee(s, n_(t, e, r, n, o, i, a, u, c, l));
      }),
      s
    );
  }
  function nC() {
    return V.apply(
      n_(rm, rb, eY, eZ, e0, ri, rc, rs, rp, a).domain([
        new Date(2e3, 0, 1),
        new Date(2e3, 0, 2),
      ]),
      arguments,
    );
  }
  function nI() {
    return V.apply(
      n_(ry, rv, eK, eJ, e9, ra, rl, rf, rp, u).domain([
        Date.UTC(2e3, 0, 1),
        Date.UTC(2e3, 0, 2),
      ]),
      arguments,
    );
  }
  function nD() {
    var t,
      e,
      r,
      n,
      o,
      i = 0,
      a = 1,
      u = t5,
      c = !1;
    function l(e) {
      return null == e || isNaN((e *= 1))
        ? o
        : u(
            0 === r
              ? 0.5
              : ((e = (n(e) - t) * r), c ? Math.max(0, Math.min(1, e)) : e),
          );
    }
    function s(t) {
      return function (e) {
        var r, n;
        return arguments.length
          ? (([r, n] = e), (u = t(r, n)), l)
          : [u(0), u(1)];
      };
    }
    return (
      (l.domain = function (o) {
        return arguments.length
          ? (([i, a] = o),
            (t = n((i *= 1))),
            (e = n((a *= 1))),
            (r = t === e ? 0 : 1 / (e - t)),
            l)
          : [i, a];
      }),
      (l.clamp = function (t) {
        return arguments.length ? ((c = !!t), l) : c;
      }),
      (l.interpolator = function (t) {
        return arguments.length ? ((u = t), l) : u;
      }),
      (l.range = s(t3)),
      (l.rangeRound = s(t4)),
      (l.unknown = function (t) {
        return arguments.length ? ((o = t), l) : o;
      }),
      function (o) {
        return (
          (n = o),
          (t = o(i)),
          (e = o(a)),
          (r = t === e ? 0 : 1 / (e - t)),
          l
        );
      }
    );
  }
  function nN(t, e) {
    return e
      .domain(t.domain())
      .interpolator(t.interpolator())
      .clamp(t.clamp())
      .unknown(t.unknown());
  }
  function nB() {
    var t = ey(nD()(t5));
    return (
      (t.copy = function () {
        return nN(t, nB());
      }),
      G.apply(t, arguments)
    );
  }
  function nR() {
    var t = eP(nD()).domain([1, 10]);
    return (
      (t.copy = function () {
        return nN(t, nR()).base(t.base());
      }),
      G.apply(t, arguments)
    );
  }
  function nL() {
    var t = ek(nD());
    return (
      (t.copy = function () {
        return nN(t, nL()).constant(t.constant());
      }),
      G.apply(t, arguments)
    );
  }
  function nU() {
    var t = eD(nD());
    return (
      (t.copy = function () {
        return nN(t, nU()).exponent(t.exponent());
      }),
      G.apply(t, arguments)
    );
  }
  function nz() {
    return nU.apply(null, arguments).exponent(0.5);
  }
  function n$() {
    var t = [],
      e = t5;
    function r(r) {
      if (null != r && !isNaN((r *= 1)))
        return e((ty(t, r, 1) - 1) / (t.length - 1));
    }
    return (
      (r.domain = function (e) {
        if (!arguments.length) return t.slice();
        for (let r of ((t = []), e)) null == r || isNaN((r *= 1)) || t.push(r);
        return (t.sort(tl), r);
      }),
      (r.interpolator = function (t) {
        return arguments.length ? ((e = t), r) : e;
      }),
      (r.range = function () {
        return t.map((r, n) => e(n / (t.length - 1)));
      }),
      (r.quantiles = function (e) {
        return Array.from({ length: e + 1 }, (r, n) =>
          (function (t, e) {
            if (
              !(
                !(r = (t = Float64Array.from(
                  (function* (t, e) {
                    if (void 0 === e)
                      for (let e of t) null != e && (e *= 1) >= e && (yield e);
                    else {
                      let r = -1;
                      for (let n of t)
                        null != (n = e(n, ++r, t)) &&
                          (n *= 1) >= n &&
                          (yield n);
                    }
                  })(t, void 0),
                )).length) || isNaN((e *= 1))
              )
            ) {
              if (e <= 0 || r < 2) return ez(t);
              if (e >= 1) return eU(t);
              var r,
                n = (r - 1) * e,
                o = Math.floor(n),
                i = eU(
                  (function t(e, r, n = 0, o = 1 / 0, i) {
                    if (
                      ((r = Math.floor(r)),
                      (n = Math.floor(Math.max(0, n))),
                      (o = Math.floor(Math.min(e.length - 1, o))),
                      !(n <= r && r <= o))
                    )
                      return e;
                    for (
                      i =
                        void 0 === i
                          ? e$
                          : (function (t = tl) {
                              if (t === tl) return e$;
                              if ("function" != typeof t)
                                throw TypeError("compare is not a function");
                              return (e, r) => {
                                let n = t(e, r);
                                return n || 0 === n
                                  ? n
                                  : (0 === t(r, r)) - (0 === t(e, e));
                              };
                            })(i);
                      o > n;

                    ) {
                      if (o - n > 600) {
                        let a = o - n + 1,
                          u = r - n + 1,
                          c = Math.log(a),
                          l = 0.5 * Math.exp((2 * c) / 3),
                          s =
                            0.5 *
                            Math.sqrt((c * l * (a - l)) / a) *
                            (u - a / 2 < 0 ? -1 : 1),
                          f = Math.max(n, Math.floor(r - (u * l) / a + s)),
                          p = Math.min(
                            o,
                            Math.floor(r + ((a - u) * l) / a + s),
                          );
                        t(e, r, f, p, i);
                      }
                      let a = e[r],
                        u = n,
                        c = o;
                      for (
                        eH(e, n, r), i(e[o], a) > 0 && eH(e, n, o);
                        u < c;

                      ) {
                        for (eH(e, u, c), ++u, --c; 0 > i(e[u], a); ) ++u;
                        for (; i(e[c], a) > 0; ) --c;
                      }
                      (0 === i(e[n], a) ? eH(e, n, c) : eH(e, ++c, o),
                        c <= r && (n = c + 1),
                        r <= c && (o = c - 1));
                    }
                    return e;
                  })(t, o).subarray(0, o + 1),
                );
              return i + (ez(t.subarray(o + 1)) - i) * (n - o);
            }
          })(t, n / e),
        );
      }),
      (r.copy = function () {
        return n$(e).domain(t);
      }),
      G.apply(r, arguments)
    );
  }
  function nH() {
    var t,
      e,
      r,
      n,
      o,
      i,
      a,
      u = 0,
      c = 0.5,
      l = 1,
      s = 1,
      f = t5,
      p = !1;
    function d(t) {
      return isNaN((t *= 1))
        ? a
        : ((t = 0.5 + ((t = +i(t)) - e) * (s * t < s * e ? n : o)),
          f(p ? Math.max(0, Math.min(1, t)) : t));
    }
    function h(t) {
      return function (e) {
        var r, n, o;
        return arguments.length
          ? (([r, n, o] = e),
            (f = (function (t, e) {
              void 0 === e && ((e = t), (t = t3));
              for (
                var r = 0, n = e.length - 1, o = e[0], i = Array(n < 0 ? 0 : n);
                r < n;

              )
                i[r] = t(o, (o = e[++r]));
              return function (t) {
                var e = Math.max(0, Math.min(n - 1, Math.floor((t *= n))));
                return i[e](t - e);
              };
            })(t, [r, n, o])),
            d)
          : [f(0), f(0.5), f(1)];
      };
    }
    return (
      (d.domain = function (a) {
        return arguments.length
          ? (([u, c, l] = a),
            (t = i((u *= 1))),
            (e = i((c *= 1))),
            (r = i((l *= 1))),
            (n = t === e ? 0 : 0.5 / (e - t)),
            (o = e === r ? 0 : 0.5 / (r - e)),
            (s = e < t ? -1 : 1),
            d)
          : [u, c, l];
      }),
      (d.clamp = function (t) {
        return arguments.length ? ((p = !!t), d) : p;
      }),
      (d.interpolator = function (t) {
        return arguments.length ? ((f = t), d) : f;
      }),
      (d.range = h(t3)),
      (d.rangeRound = h(t4)),
      (d.unknown = function (t) {
        return arguments.length ? ((a = t), d) : a;
      }),
      function (a) {
        return (
          (i = a),
          (t = a(u)),
          (e = a(c)),
          (r = a(l)),
          (n = t === e ? 0 : 0.5 / (e - t)),
          (o = e === r ? 0 : 0.5 / (r - e)),
          (s = e < t ? -1 : 1),
          d
        );
      }
    );
  }
  function nF() {
    var t = ey(nH()(t5));
    return (
      (t.copy = function () {
        return nN(t, nF());
      }),
      G.apply(t, arguments)
    );
  }
  function nW() {
    var t = eP(nH()).domain([0.1, 1, 10]);
    return (
      (t.copy = function () {
        return nN(t, nW()).base(t.base());
      }),
      G.apply(t, arguments)
    );
  }
  function nX() {
    var t = ek(nH());
    return (
      (t.copy = function () {
        return nN(t, nX()).constant(t.constant());
      }),
      G.apply(t, arguments)
    );
  }
  function nq() {
    var t = eD(nH());
    return (
      (t.copy = function () {
        return nN(t, nq()).exponent(t.exponent());
      }),
      G.apply(t, arguments)
    );
  }
  function nV() {
    return nq.apply(null, arguments).exponent(0.5);
  }
  ((a = (i = (function (t) {
    var e = t.dateTime,
      r = t.date,
      n = t.time,
      o = t.periods,
      i = t.days,
      a = t.shortDays,
      u = t.months,
      c = t.shortMonths,
      l = rM(o),
      s = rk(o),
      f = rM(i),
      p = rk(i),
      d = rM(a),
      h = rk(a),
      y = rM(u),
      v = rk(u),
      m = rM(c),
      b = rk(c),
      g = {
        a: function (t) {
          return a[t.getDay()];
        },
        A: function (t) {
          return i[t.getDay()];
        },
        b: function (t) {
          return c[t.getMonth()];
        },
        B: function (t) {
          return u[t.getMonth()];
        },
        c: null,
        d: rK,
        e: rK,
        f: r1,
        g: nr,
        G: no,
        H: rZ,
        I: rJ,
        j: rQ,
        L: r0,
        m: r2,
        M: r3,
        p: function (t) {
          return o[+(t.getHours() >= 12)];
        },
        q: function (t) {
          return 1 + ~~(t.getMonth() / 3);
        },
        Q: nE,
        s: nM,
        S: r4,
        u: r8,
        U: r6,
        V: r9,
        w: r7,
        W: nt,
        x: null,
        X: null,
        y: ne,
        Y: nn,
        Z: ni,
        "%": nA,
      },
      x = {
        a: function (t) {
          return a[t.getUTCDay()];
        },
        A: function (t) {
          return i[t.getUTCDay()];
        },
        b: function (t) {
          return c[t.getUTCMonth()];
        },
        B: function (t) {
          return u[t.getUTCMonth()];
        },
        c: null,
        d: na,
        e: na,
        f: nf,
        g: nw,
        G: nS,
        H: nu,
        I: nc,
        j: nl,
        L: ns,
        m: np,
        M: nd,
        p: function (t) {
          return o[+(t.getUTCHours() >= 12)];
        },
        q: function (t) {
          return 1 + ~~(t.getUTCMonth() / 3);
        },
        Q: nE,
        s: nM,
        S: nh,
        u: ny,
        U: nv,
        V: nb,
        w: ng,
        W: nx,
        x: null,
        X: null,
        y: nO,
        Y: nj,
        Z: nP,
        "%": nA,
      },
      O = {
        a: function (t, e, r) {
          var n = d.exec(e.slice(r));
          return n ? ((t.w = h.get(n[0].toLowerCase())), r + n[0].length) : -1;
        },
        A: function (t, e, r) {
          var n = f.exec(e.slice(r));
          return n ? ((t.w = p.get(n[0].toLowerCase())), r + n[0].length) : -1;
        },
        b: function (t, e, r) {
          var n = m.exec(e.slice(r));
          return n ? ((t.m = b.get(n[0].toLowerCase())), r + n[0].length) : -1;
        },
        B: function (t, e, r) {
          var n = y.exec(e.slice(r));
          return n ? ((t.m = v.get(n[0].toLowerCase())), r + n[0].length) : -1;
        },
        c: function (t, r, n) {
          return S(t, e, r, n);
        },
        d: rz,
        e: rz,
        f: rq,
        g: rB,
        G: rN,
        H: rH,
        I: rH,
        j: r$,
        L: rX,
        m: rU,
        M: rF,
        p: function (t, e, r) {
          var n = l.exec(e.slice(r));
          return n ? ((t.p = s.get(n[0].toLowerCase())), r + n[0].length) : -1;
        },
        q: rL,
        Q: rG,
        s: rY,
        S: rW,
        u: r_,
        U: rC,
        V: rI,
        w: rT,
        W: rD,
        x: function (t, e, n) {
          return S(t, r, e, n);
        },
        X: function (t, e, r) {
          return S(t, n, e, r);
        },
        y: rB,
        Y: rN,
        Z: rR,
        "%": rV,
      };
    function w(t, e) {
      return function (r) {
        var n,
          o,
          i,
          a = [],
          u = -1,
          c = 0,
          l = t.length;
        for (r instanceof Date || (r = new Date(+r)); ++u < l; )
          37 === t.charCodeAt(u) &&
            (a.push(t.slice(c, u)),
            null != (o = rw[(n = t.charAt(++u))])
              ? (n = t.charAt(++u))
              : (o = "e" === n ? " " : "0"),
            (i = e[n]) && (n = i(r, o)),
            a.push(n),
            (c = u + 1));
        return (a.push(t.slice(c, u)), a.join(""));
      };
    }
    function j(t, e) {
      return function (r) {
        var n,
          o,
          i = rO(1900, void 0, 1);
        if (S(i, t, (r += ""), 0) != r.length) return null;
        if ("Q" in i) return new Date(i.Q);
        if ("s" in i) return new Date(1e3 * i.s + ("L" in i ? i.L : 0));
        if (
          (!e || "Z" in i || (i.Z = 0),
          "p" in i && (i.H = (i.H % 12) + 12 * i.p),
          void 0 === i.m && (i.m = "q" in i ? i.q : 0),
          "V" in i)
        ) {
          if (i.V < 1 || i.V > 53) return null;
          ("w" in i || (i.w = 1),
            "Z" in i
              ? ((n =
                  (o = (n = rx(rO(i.y, 0, 1))).getUTCDay()) > 4 || 0 === o
                    ? e7.ceil(n)
                    : e7(n)),
                (n = ra.offset(n, (i.V - 1) * 7)),
                (i.y = n.getUTCFullYear()),
                (i.m = n.getUTCMonth()),
                (i.d = n.getUTCDate() + ((i.w + 6) % 7)))
              : ((n =
                  (o = (n = rg(rO(i.y, 0, 1))).getDay()) > 4 || 0 === o
                    ? e1.ceil(n)
                    : e1(n)),
                (n = ri.offset(n, (i.V - 1) * 7)),
                (i.y = n.getFullYear()),
                (i.m = n.getMonth()),
                (i.d = n.getDate() + ((i.w + 6) % 7))));
        } else
          ("W" in i || "U" in i) &&
            ("w" in i || (i.w = "u" in i ? i.u % 7 : +("W" in i)),
            (o =
              "Z" in i
                ? rx(rO(i.y, 0, 1)).getUTCDay()
                : rg(rO(i.y, 0, 1)).getDay()),
            (i.m = 0),
            (i.d =
              "W" in i
                ? ((i.w + 6) % 7) + 7 * i.W - ((o + 5) % 7)
                : i.w + 7 * i.U - ((o + 6) % 7)));
        return "Z" in i
          ? ((i.H += (i.Z / 100) | 0), (i.M += i.Z % 100), rx(i))
          : rg(i);
      };
    }
    function S(t, e, r, n) {
      for (var o, i, a = 0, u = e.length, c = r.length; a < u; ) {
        if (n >= c) return -1;
        if (37 === (o = e.charCodeAt(a++))) {
          if (
            !(i = O[(o = e.charAt(a++)) in rw ? e.charAt(a++) : o]) ||
            (n = i(t, r, n)) < 0
          )
            return -1;
        } else if (o != r.charCodeAt(n++)) return -1;
      }
      return n;
    }
    return (
      (g.x = w(r, g)),
      (g.X = w(n, g)),
      (g.c = w(e, g)),
      (x.x = w(r, x)),
      (x.X = w(n, x)),
      (x.c = w(e, x)),
      {
        format: function (t) {
          var e = w((t += ""), g);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        parse: function (t) {
          var e = j((t += ""), !1);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        utcFormat: function (t) {
          var e = w((t += ""), x);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        utcParse: function (t) {
          var e = j((t += ""), !0);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
      }
    );
  })({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  })).format),
    i.parse,
    (u = i.utcFormat),
    i.utcParse,
    t.s(
      [
        "scaleBand",
        0,
        tt,
        "scaleDiverging",
        0,
        nF,
        "scaleDivergingLog",
        0,
        nW,
        "scaleDivergingPow",
        0,
        nq,
        "scaleDivergingSqrt",
        0,
        nV,
        "scaleDivergingSymlog",
        0,
        nX,
        "scaleIdentity",
        0,
        em,
        "scaleImplicit",
        0,
        J,
        "scaleLinear",
        0,
        ev,
        "scaleLog",
        0,
        eA,
        "scaleOrdinal",
        0,
        Q,
        "scalePoint",
        0,
        te,
        "scalePow",
        0,
        eN,
        "scaleQuantile",
        0,
        eF,
        "scaleQuantize",
        0,
        eW,
        "scaleRadial",
        0,
        eL,
        "scaleSequential",
        0,
        nB,
        "scaleSequentialLog",
        0,
        nR,
        "scaleSequentialPow",
        0,
        nU,
        "scaleSequentialQuantile",
        0,
        n$,
        "scaleSequentialSqrt",
        0,
        nz,
        "scaleSequentialSymlog",
        0,
        nL,
        "scaleSqrt",
        0,
        eB,
        "scaleSymlog",
        0,
        eT,
        "scaleThreshold",
        0,
        eX,
        "scaleTime",
        0,
        nC,
        "scaleUtc",
        0,
        nI,
        "tickFormat",
        0,
        eh,
      ],
      289717,
    ),
    t.i(289717),
    t.s(
      [
        "scaleBand",
        0,
        tt,
        "scaleDiverging",
        0,
        nF,
        "scaleDivergingLog",
        0,
        nW,
        "scaleDivergingPow",
        0,
        nq,
        "scaleDivergingSqrt",
        0,
        nV,
        "scaleDivergingSymlog",
        0,
        nX,
        "scaleIdentity",
        0,
        em,
        "scaleImplicit",
        0,
        J,
        "scaleLinear",
        0,
        ev,
        "scaleLog",
        0,
        eA,
        "scaleOrdinal",
        0,
        Q,
        "scalePoint",
        0,
        te,
        "scalePow",
        0,
        eN,
        "scaleQuantile",
        0,
        eF,
        "scaleQuantize",
        0,
        eW,
        "scaleRadial",
        0,
        eL,
        "scaleSequential",
        0,
        nB,
        "scaleSequentialLog",
        0,
        nR,
        "scaleSequentialPow",
        0,
        nU,
        "scaleSequentialQuantile",
        0,
        n$,
        "scaleSequentialSqrt",
        0,
        nz,
        "scaleSequentialSymlog",
        0,
        nL,
        "scaleSqrt",
        0,
        eB,
        "scaleSymlog",
        0,
        eT,
        "scaleThreshold",
        0,
        eX,
        "scaleTime",
        0,
        nC,
        "scaleUtc",
        0,
        nI,
        "tickFormat",
        0,
        eh,
      ],
      629419,
    ));
};
