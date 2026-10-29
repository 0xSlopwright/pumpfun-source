// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(251934),
    r = t.i(459683);
  function n(t, e) {
    if ((o = t.length) > 1)
      for (var r, n, o, i = 1, a = t[e[0]], u = a.length; i < o; ++i)
        for (n = a, a = t[e[i]], r = 0; r < u; ++r)
          a[r][1] += a[r][0] = isNaN(n[r][1]) ? n[r][0] : n[r][1];
  }
  function o(t) {
    for (var e = t.length, r = Array(e); --e >= 0; ) r[e] = e;
    return r;
  }
  function i(t, e) {
    return t[e];
  }
  function a(t) {
    let e = [];
    return ((e.key = t), e);
  }
  (t.s(
    [
      "f",
      0,
      function () {
        var t = (0, r.f)([]),
          u = o,
          c = n,
          l = i;
        function s(r) {
          var n,
            o,
            i = Array.from(t.apply(this, arguments), a),
            s = i.length,
            f = -1;
          for (let t of r)
            for (n = 0, ++f; n < s; ++n)
              (i[n][f] = [0, +l(t, i[n].key, f, r)]).data = t;
          for (n = 0, o = (0, e.f)(u(i)); n < s; ++n) i[o[n]].index = n;
          return (c(i, o), i);
        }
        return (
          (s.keys = function (e) {
            return arguments.length
              ? ((t = "function" == typeof e ? e : (0, r.f)(Array.from(e))), s)
              : t;
          }),
          (s.value = function (t) {
            return arguments.length
              ? ((l = "function" == typeof t ? t : (0, r.f)(+t)), s)
              : l;
          }),
          (s.order = function (t) {
            return arguments.length
              ? ((u =
                  null == t
                    ? o
                    : "function" == typeof t
                      ? t
                      : (0, r.f)(Array.from(t))),
                s)
              : u;
          }),
          (s.offset = function (t) {
            return arguments.length ? ((c = null == t ? n : t), s) : c;
          }),
          s
        );
      },
    ],
    150500,
  ),
    t.s(
      [
        "f",
        0,
        function (t, e) {
          if ((o = t.length) > 0) {
            for (var r, o, i, a = 0, u = t[0].length; a < u; ++a) {
              for (i = r = 0; r < o; ++r) i += t[r][a][1] || 0;
              if (i) for (r = 0; r < o; ++r) t[r][a][1] /= i;
            }
            n(t, e);
          }
        },
      ],
      593829,
    ),
    t.s(["f", 0, n], 287118),
    t.s(
      [
        "f",
        0,
        function (t, e) {
          if ((r = t.length) > 0) {
            for (var r, o = 0, i = t[e[0]], a = i.length; o < a; ++o) {
              for (var u = 0, c = 0; u < r; ++u) c += t[u][o][1] || 0;
              i[o][1] += i[o][0] = -c / 2;
            }
            n(t, e);
          }
        },
      ],
      948086,
    ),
    t.s(
      [
        "f",
        0,
        function (t, e) {
          if ((i = t.length) > 0 && (o = (r = t[e[0]]).length) > 0) {
            for (var r, o, i, a = 0, u = 1; u < o; ++u) {
              for (var c = 0, l = 0, s = 0; c < i; ++c) {
                for (
                  var f = t[e[c]],
                    p = f[u][1] || 0,
                    d = (p - (f[u - 1][1] || 0)) / 2,
                    h = 0;
                  h < c;
                  ++h
                ) {
                  var y = t[e[h]];
                  d += (y[u][1] || 0) - (y[u - 1][1] || 0);
                }
                ((l += p), (s += d * p));
              }
              ((r[u - 1][1] += r[u - 1][0] = a), l && (a -= s / l));
            }
            ((r[u - 1][1] += r[u - 1][0] = a), n(t, e));
          }
        },
      ],
      379975,
    ),
    t.s(["f", 0, o], 416172));
  var u = t.i(560600);
  function c(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  var l = function (t) {
      return t;
    },
    s = { "@@functional/placeholder": !0 },
    f = function (t) {
      return t === s;
    },
    p = function (t) {
      return function e() {
        return 0 == arguments.length ||
          (1 == arguments.length &&
            f(arguments.length <= 0 ? void 0 : arguments[0]))
          ? e
          : t.apply(void 0, arguments);
      };
    },
    d = function (t) {
      return (function t(e, r) {
        return 1 === e
          ? r
          : p(function () {
              for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
                o[i] = arguments[i];
              var a = o.filter(function (t) {
                return t !== s;
              }).length;
              return a >= e
                ? r.apply(void 0, o)
                : t(
                    e - a,
                    p(function () {
                      for (
                        var t = arguments.length, e = Array(t), n = 0;
                        n < t;
                        n++
                      )
                        e[n] = arguments[n];
                      var i = o.map(function (t) {
                        return f(t) ? e.shift() : t;
                      });
                      return r.apply(
                        void 0,
                        (
                          (function (t) {
                            if (Array.isArray(t)) return c(t);
                          })(i) ||
                          (function (t) {
                            if (
                              "u" > typeof Symbol &&
                              Symbol.iterator in Object(t)
                            )
                              return Array.from(t);
                          })(i) ||
                          (function (t) {
                            if (t) {
                              if ("string" == typeof t) return c(t, void 0);
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
                                return c(t, void 0);
                            }
                          })(i) ||
                          (function () {
                            throw TypeError(
                              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                            );
                          })()
                        ).concat(e),
                      );
                    }),
                  );
            });
      })(t.length, t);
    },
    h = function (t, e) {
      for (var r = [], n = t; n < e; ++n) r[n - t] = n;
      return r;
    },
    y = d(function (t, e) {
      return Array.isArray(e)
        ? e.map(t)
        : Object.keys(e)
            .map(function (t) {
              return e[t];
            })
            .map(t);
    }),
    v = function () {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      if (!e.length) return l;
      var n = e.reverse(),
        o = n[0],
        i = n.slice(1);
      return function () {
        return i.reduce(
          function (t, e) {
            return e(t);
          },
          o.apply(void 0, arguments),
        );
      };
    },
    m = function (t) {
      return Array.isArray(t) ? t.reverse() : t.split("").reverse.join("");
    },
    b = function (t) {
      var e = null,
        r = null;
      return function () {
        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
          o[i] = arguments[i];
        return e &&
          o.every(function (t, r) {
            return t === e[r];
          })
          ? r
          : ((e = o), (r = t.apply(void 0, o)));
      };
    };
  (d(function (t, e, r) {
    var n = +t;
    return n + r * (e - n);
  }),
    d(function (t, e, r) {
      var n = e - t;
      return (r - t) / (n = n || 1 / 0);
    }),
    d(function (t, e, r) {
      var n = e - t;
      return Math.max(0, Math.min(1, (r - t) / (n = n || 1 / 0)));
    }));
  let g = function (t, e, r) {
      for (var n = new u.default(t), o = 0, i = []; n.lt(e) && o < 1e5; )
        (i.push(n.toNumber()), (n = n.add(r)), o++);
      return i;
    },
    x = function (t) {
      return 0 === t
        ? 1
        : Math.floor(new u.default(t).abs().log(10).toNumber()) + 1;
    };
  function O(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return S(t);
      })(t) ||
      (function (t) {
        if ("u" > typeof Symbol && Symbol.iterator in Object(t))
          return Array.from(t);
      })(t) ||
      j(t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function w(t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function (t, e) {
        if ("u" > typeof Symbol && Symbol.iterator in Object(t)) {
          var r = [],
            n = !0,
            o = !1,
            i = void 0;
          try {
            for (
              var a, u = t[Symbol.iterator]();
              !(n = (a = u.next()).done) &&
              (r.push(a.value), !e || r.length !== e);
              n = !0
            );
          } catch (t) {
            ((o = !0), (i = t));
          } finally {
            try {
              n || null == u.return || u.return();
            } finally {
              if (o) throw i;
            }
          }
          return r;
        }
      })(t, e) ||
      j(t, e) ||
      (function () {
        throw TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function j(t, e) {
    if (t) {
      if ("string" == typeof t) return S(t, e);
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
        return S(t, e);
    }
  }
  function S(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function P(t) {
    var e = w(t, 2),
      r = e[0],
      n = e[1],
      o = r,
      i = n;
    return (r > n && ((o = n), (i = r)), [o, i]);
  }
  function A(t, e, r) {
    if (t.lte(0)) return new u.default(0);
    var n = x(t.toNumber()),
      o = new u.default(10).pow(n),
      i = t.div(o),
      a = 1 !== n ? 0.05 : 0.1,
      c = new u.default(Math.ceil(i.div(a).toNumber())).add(r).mul(a).mul(o);
    return e ? c : new u.default(Math.ceil(c));
  }
  function E(t, e, r) {
    var n = 1,
      o = new u.default(t);
    if (!o.isint() && r) {
      var i = Math.abs(t);
      i < 1
        ? ((n = new u.default(10).pow(x(t) - 1)),
          (o = new u.default(Math.floor(o.div(n).toNumber())).mul(n)))
        : i > 1 && (o = new u.default(Math.floor(t)));
    } else
      0 === t
        ? (o = new u.default(Math.floor((e - 1) / 2)))
        : r || (o = new u.default(Math.floor(t)));
    var a = Math.floor((e - 1) / 2);
    return v(
      y(function (t) {
        return o.add(new u.default(t - a).mul(n)).toNumber();
      }),
      h,
    )(0, e);
  }
  var M = b(function (t) {
    var e = w(t, 2),
      r = e[0],
      n = e[1],
      o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6,
      i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
      a = Math.max(o, 2),
      c = w(P([r, n]), 2),
      l = c[0],
      s = c[1];
    if (-1 / 0 === l || 1 / 0 === s) {
      var f =
        1 / 0 === s
          ? [l].concat(
              O(
                h(0, o - 1).map(function () {
                  return 1 / 0;
                }),
              ),
            )
          : [].concat(
              O(
                h(0, o - 1).map(function () {
                  return -1 / 0;
                }),
              ),
              [s],
            );
      return r > n ? m(f) : f;
    }
    if (l === s) return E(l, o, i);
    var p = (function t(e, r, n, o) {
        var i,
          a =
            arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
        if (!Number.isFinite((r - e) / (n - 1)))
          return {
            step: new u.default(0),
            tickMin: new u.default(0),
            tickMax: new u.default(0),
          };
        var c = A(new u.default(r).sub(e).div(n - 1), o, a),
          l = Math.ceil(
            (i =
              e <= 0 && r >= 0
                ? new u.default(0)
                : (i = new u.default(e).add(r).div(2)).sub(
                    new u.default(i).mod(c),
                  ))
              .sub(e)
              .div(c)
              .toNumber(),
          ),
          s = Math.ceil(new u.default(r).sub(i).div(c).toNumber()),
          f = l + s + 1;
        return f > n
          ? t(e, r, n, o, a + 1)
          : (f < n &&
              ((s = r > 0 ? s + (n - f) : s), (l = r > 0 ? l : l + (n - f))),
            {
              step: c,
              tickMin: i.sub(new u.default(l).mul(c)),
              tickMax: i.add(new u.default(s).mul(c)),
            });
      })(l, s, a, i),
      d = p.step,
      y = g(p.tickMin, p.tickMax.add(new u.default(0.1).mul(d)), d);
    return r > n ? m(y) : y;
  });
  b(function (t) {
    var e = w(t, 2),
      r = e[0],
      n = e[1],
      o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6,
      i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
      a = Math.max(o, 2),
      c = w(P([r, n]), 2),
      l = c[0],
      s = c[1];
    if (-1 / 0 === l || 1 / 0 === s) return [r, n];
    if (l === s) return E(l, o, i);
    var f = A(new u.default(s).sub(l).div(a - 1), i, 0),
      p = v(
        y(function (t) {
          return new u.default(l).add(new u.default(t).mul(f)).toNumber();
        }),
        h,
      )(0, a).filter(function (t) {
        return t >= l && t <= s;
      });
    return r > n ? m(p) : p;
  });
  var k = b(function (t, e) {
    var r = w(t, 2),
      n = r[0],
      o = r[1],
      i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
      a = w(P([n, o]), 2),
      c = a[0],
      l = a[1];
    if (-1 / 0 === c || 1 / 0 === l) return [n, o];
    if (c === l) return [c];
    var s = Math.max(e, 2),
      f = A(new u.default(l).sub(c).div(s - 1), i, 0),
      p = [].concat(
        O(
          g(
            new u.default(c),
            new u.default(l).sub(new u.default(0.99).mul(f)),
            f,
          ),
        ),
        [l],
      );
    return n > o ? m(p) : p;
  });
  (t.s(["e", 0, M, "V", 0, k], 884617), t.s([], 183998));
};
