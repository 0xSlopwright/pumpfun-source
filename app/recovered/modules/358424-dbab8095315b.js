// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(251934),
    r = t.i(459683),
    n = t.i(566635),
    o = t.i(199518);
  function i(t) {
    return t[0];
  }
  function a(t) {
    return t[1];
  }
  function u(t, u) {
    var c = (0, r.f)(!0),
      l = null,
      s = n.f,
      f = null,
      p = (0, o.f)(d);
    function d(r) {
      var n,
        o,
        i,
        a = (r = (0, e.f)(r)).length,
        d = !1;
      for (null == l && (f = s((i = p()))), n = 0; n <= a; ++n)
        (!(n < a && c((o = r[n]), n, r)) === d &&
          ((d = !d) ? f.lineStart() : f.lineEnd()),
          d && f.point(+t(o, n, r), +u(o, n, r)));
      if (i) return ((f = null), i + "" || null);
    }
    return (
      (t = "function" == typeof t ? t : void 0 === t ? i : (0, r.f)(t)),
      (u = "function" == typeof u ? u : void 0 === u ? a : (0, r.f)(u)),
      (d.x = function (e) {
        return arguments.length
          ? ((t = "function" == typeof e ? e : (0, r.f)(+e)), d)
          : t;
      }),
      (d.y = function (t) {
        return arguments.length
          ? ((u = "function" == typeof t ? t : (0, r.f)(+t)), d)
          : u;
      }),
      (d.defined = function (t) {
        return arguments.length
          ? ((c = "function" == typeof t ? t : (0, r.f)(!!t)), d)
          : c;
      }),
      (d.curve = function (t) {
        return arguments.length ? ((s = t), null != l && (f = s(l)), d) : s;
      }),
      (d.context = function (t) {
        return arguments.length
          ? (null == t ? (l = f = null) : (f = s((l = t))), d)
          : l;
      }),
      d
    );
  }
  function c() {}
  function l(t, e, r) {
    t._context.bezierCurveTo(
      (2 * t._x0 + t._x1) / 3,
      (2 * t._y0 + t._y1) / 3,
      (t._x0 + 2 * t._x1) / 3,
      (t._y0 + 2 * t._y1) / 3,
      (t._x0 + 4 * t._x1 + e) / 6,
      (t._y0 + 4 * t._y1 + r) / 6,
    );
  }
  function s(t) {
    this._context = t;
  }
  function f(t) {
    this._context = t;
  }
  function p(t) {
    this._context = t;
  }
  (t.s(["f", 0, u], 358424),
    t.s(
      [
        "f",
        0,
        function (t, c, l) {
          var s = null,
            f = (0, r.f)(!0),
            p = null,
            d = n.f,
            h = null,
            y = (0, o.f)(v);
          function v(r) {
            var n,
              o,
              i,
              a,
              u,
              v = (r = (0, e.f)(r)).length,
              m = !1,
              b = Array(v),
              g = Array(v);
            for (null == p && (h = d((u = y()))), n = 0; n <= v; ++n) {
              if (!(n < v && f((a = r[n]), n, r)) === m)
                if ((m = !m)) ((o = n), h.areaStart(), h.lineStart());
                else {
                  for (h.lineEnd(), h.lineStart(), i = n - 1; i >= o; --i)
                    h.point(b[i], g[i]);
                  (h.lineEnd(), h.areaEnd());
                }
              m &&
                ((b[n] = +t(a, n, r)),
                (g[n] = +c(a, n, r)),
                h.point(s ? +s(a, n, r) : b[n], l ? +l(a, n, r) : g[n]));
            }
            if (u) return ((h = null), u + "" || null);
          }
          function m() {
            return u().defined(f).curve(d).context(p);
          }
          return (
            (t = "function" == typeof t ? t : void 0 === t ? i : (0, r.f)(+t)),
            (c =
              "function" == typeof c
                ? c
                : void 0 === c
                  ? (0, r.f)(0)
                  : (0, r.f)(+c)),
            (l = "function" == typeof l ? l : void 0 === l ? a : (0, r.f)(+l)),
            (v.x = function (e) {
              return arguments.length
                ? ((t = "function" == typeof e ? e : (0, r.f)(+e)),
                  (s = null),
                  v)
                : t;
            }),
            (v.x0 = function (e) {
              return arguments.length
                ? ((t = "function" == typeof e ? e : (0, r.f)(+e)), v)
                : t;
            }),
            (v.x1 = function (t) {
              return arguments.length
                ? ((s =
                    null == t
                      ? null
                      : "function" == typeof t
                        ? t
                        : (0, r.f)(+t)),
                  v)
                : s;
            }),
            (v.y = function (t) {
              return arguments.length
                ? ((c = "function" == typeof t ? t : (0, r.f)(+t)),
                  (l = null),
                  v)
                : c;
            }),
            (v.y0 = function (t) {
              return arguments.length
                ? ((c = "function" == typeof t ? t : (0, r.f)(+t)), v)
                : c;
            }),
            (v.y1 = function (t) {
              return arguments.length
                ? ((l =
                    null == t
                      ? null
                      : "function" == typeof t
                        ? t
                        : (0, r.f)(+t)),
                  v)
                : l;
            }),
            (v.lineX0 = v.lineY0 =
              function () {
                return m().x(t).y(c);
              }),
            (v.lineY1 = function () {
              return m().x(t).y(l);
            }),
            (v.lineX1 = function () {
              return m().x(s).y(c);
            }),
            (v.defined = function (t) {
              return arguments.length
                ? ((f = "function" == typeof t ? t : (0, r.f)(!!t)), v)
                : f;
            }),
            (v.curve = function (t) {
              return arguments.length
                ? ((d = t), null != p && (h = d(p)), v)
                : d;
            }),
            (v.context = function (t) {
              return arguments.length
                ? (null == t ? (p = h = null) : (h = d((p = t))), v)
                : p;
            }),
            v
          );
        },
      ],
      796388,
    ),
    (s.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = 0 / 0;
      },
      lineStart: function () {
        ((this._x0 = this._x1 = this._y0 = this._y1 = 0 / 0),
          (this._point = 0));
      },
      lineEnd: function () {
        switch (this._point) {
          case 3:
            l(this, this._x1, this._y1);
          case 2:
            this._context.lineTo(this._x1, this._y1);
        }
        ((this._line || (0 !== this._line && 1 === this._point)) &&
          this._context.closePath(),
          (this._line = 1 - this._line));
      },
      point: function (t, e) {
        switch (((t *= 1), (e *= 1), this._point)) {
          case 0:
            ((this._point = 1),
              this._line
                ? this._context.lineTo(t, e)
                : this._context.moveTo(t, e));
            break;
          case 1:
            this._point = 2;
            break;
          case 2:
            ((this._point = 3),
              this._context.lineTo(
                (5 * this._x0 + this._x1) / 6,
                (5 * this._y0 + this._y1) / 6,
              ));
          default:
            l(this, t, e);
        }
        ((this._x0 = this._x1),
          (this._x1 = t),
          (this._y0 = this._y1),
          (this._y1 = e));
      },
    }),
    (f.prototype = {
      areaStart: c,
      areaEnd: c,
      lineStart: function () {
        ((this._x0 =
          this._x1 =
          this._x2 =
          this._x3 =
          this._x4 =
          this._y0 =
          this._y1 =
          this._y2 =
          this._y3 =
          this._y4 =
            0 / 0),
          (this._point = 0));
      },
      lineEnd: function () {
        switch (this._point) {
          case 1:
            (this._context.moveTo(this._x2, this._y2),
              this._context.closePath());
            break;
          case 2:
            (this._context.moveTo(
              (this._x2 + 2 * this._x3) / 3,
              (this._y2 + 2 * this._y3) / 3,
            ),
              this._context.lineTo(
                (this._x3 + 2 * this._x2) / 3,
                (this._y3 + 2 * this._y2) / 3,
              ),
              this._context.closePath());
            break;
          case 3:
            (this.point(this._x2, this._y2),
              this.point(this._x3, this._y3),
              this.point(this._x4, this._y4));
        }
      },
      point: function (t, e) {
        switch (((t *= 1), (e *= 1), this._point)) {
          case 0:
            ((this._point = 1), (this._x2 = t), (this._y2 = e));
            break;
          case 1:
            ((this._point = 2), (this._x3 = t), (this._y3 = e));
            break;
          case 2:
            ((this._point = 3),
              (this._x4 = t),
              (this._y4 = e),
              this._context.moveTo(
                (this._x0 + 4 * this._x1 + t) / 6,
                (this._y0 + 4 * this._y1 + e) / 6,
              ));
            break;
          default:
            l(this, t, e);
        }
        ((this._x0 = this._x1),
          (this._x1 = t),
          (this._y0 = this._y1),
          (this._y1 = e));
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new f(t);
        },
      ],
      527750,
    ),
    (p.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = 0 / 0;
      },
      lineStart: function () {
        ((this._x0 = this._x1 = this._y0 = this._y1 = 0 / 0),
          (this._point = 0));
      },
      lineEnd: function () {
        ((this._line || (0 !== this._line && 3 === this._point)) &&
          this._context.closePath(),
          (this._line = 1 - this._line));
      },
      point: function (t, e) {
        switch (((t *= 1), (e *= 1), this._point)) {
          case 0:
            this._point = 1;
            break;
          case 1:
            this._point = 2;
            break;
          case 2:
            this._point = 3;
            var r = (this._x0 + 4 * this._x1 + t) / 6,
              n = (this._y0 + 4 * this._y1 + e) / 6;
            this._line
              ? this._context.lineTo(r, n)
              : this._context.moveTo(r, n);
            break;
          case 3:
            this._point = 4;
          default:
            l(this, t, e);
        }
        ((this._x0 = this._x1),
          (this._x1 = t),
          (this._y0 = this._y1),
          (this._y1 = e));
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new p(t);
        },
      ],
      995066,
    ),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new s(t);
        },
      ],
      352195,
    ));
  class d {
    constructor(t, e) {
      ((this._context = t), (this._x = e));
    }
    areaStart() {
      this._line = 0;
    }
    areaEnd() {
      this._line = 0 / 0;
    }
    lineStart() {
      this._point = 0;
    }
    lineEnd() {
      ((this._line || (0 !== this._line && 1 === this._point)) &&
        this._context.closePath(),
        (this._line = 1 - this._line));
    }
    point(t, e) {
      switch (((t *= 1), (e *= 1), this._point)) {
        case 0:
          ((this._point = 1),
            this._line
              ? this._context.lineTo(t, e)
              : this._context.moveTo(t, e));
          break;
        case 1:
          this._point = 2;
        default:
          this._x
            ? this._context.bezierCurveTo(
                (this._x0 = (this._x0 + t) / 2),
                this._y0,
                this._x0,
                e,
                t,
                e,
              )
            : this._context.bezierCurveTo(
                this._x0,
                (this._y0 = (this._y0 + e) / 2),
                t,
                this._y0,
                t,
                e,
              );
      }
      ((this._x0 = t), (this._y0 = e));
    }
  }
  function h(t) {
    this._context = t;
  }
  (t.s(
    [
      "f",
      0,
      function (t) {
        return new d(t, !0);
      },
    ],
    219412,
  ),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new d(t, !1);
        },
      ],
      334236,
    ),
    (h.prototype = {
      areaStart: c,
      areaEnd: c,
      lineStart: function () {
        this._point = 0;
      },
      lineEnd: function () {
        this._point && this._context.closePath();
      },
      point: function (t, e) {
        ((t *= 1),
          (e *= 1),
          this._point
            ? this._context.lineTo(t, e)
            : ((this._point = 1), this._context.moveTo(t, e)));
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new h(t);
        },
      ],
      759299,
    ));
  function y(t, e, r) {
    var n = t._x1 - t._x0,
      o = e - t._x1,
      i = (t._y1 - t._y0) / (n || (o < 0 && -0)),
      a = (r - t._y1) / (o || (n < 0 && -0));
    return (
      ((i < 0 ? -1 : 1) + (a < 0 ? -1 : 1)) *
        Math.min(
          Math.abs(i),
          Math.abs(a),
          0.5 * Math.abs((i * o + a * n) / (n + o)),
        ) || 0
    );
  }
  function v(t, e) {
    var r = t._x1 - t._x0;
    return r ? ((3 * (t._y1 - t._y0)) / r - e) / 2 : e;
  }
  function m(t, e, r) {
    var n = t._x0,
      o = t._y0,
      i = t._x1,
      a = t._y1,
      u = (i - n) / 3;
    t._context.bezierCurveTo(n + u, o + u * e, i - u, a - u * r, i, a);
  }
  function b(t) {
    this._context = t;
  }
  function g(t) {
    this._context = new x(t);
  }
  function x(t) {
    this._context = t;
  }
  function O(t) {
    this._context = t;
  }
  function w(t) {
    var e,
      r,
      n = t.length - 1,
      o = Array(n),
      i = Array(n),
      a = Array(n);
    for (o[0] = 0, i[0] = 2, a[0] = t[0] + 2 * t[1], e = 1; e < n - 1; ++e)
      ((o[e] = 1), (i[e] = 4), (a[e] = 4 * t[e] + 2 * t[e + 1]));
    for (
      o[n - 1] = 2, i[n - 1] = 7, a[n - 1] = 8 * t[n - 1] + t[n], e = 1;
      e < n;
      ++e
    )
      ((r = o[e] / i[e - 1]), (i[e] -= r), (a[e] -= r * a[e - 1]));
    for (o[n - 1] = a[n - 1] / i[n - 1], e = n - 2; e >= 0; --e)
      o[e] = (a[e] - o[e + 1]) / i[e];
    for (i[n - 1] = (t[n] + o[n - 1]) / 2, e = 0; e < n - 1; ++e)
      i[e] = 2 * t[e + 1] - o[e + 1];
    return [o, i];
  }
  function j(t, e) {
    ((this._context = t), (this._t = e));
  }
  (t.s(["f", () => n.f], 460605),
    (b.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = 0 / 0;
      },
      lineStart: function () {
        ((this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = 0 / 0),
          (this._point = 0));
      },
      lineEnd: function () {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x1, this._y1);
            break;
          case 3:
            m(this, this._t0, v(this, this._t0));
        }
        ((this._line || (0 !== this._line && 1 === this._point)) &&
          this._context.closePath(),
          (this._line = 1 - this._line));
      },
      point: function (t, e) {
        var r = 0 / 0;
        if (((e *= 1), (t *= 1) !== this._x1 || e !== this._y1)) {
          switch (this._point) {
            case 0:
              ((this._point = 1),
                this._line
                  ? this._context.lineTo(t, e)
                  : this._context.moveTo(t, e));
              break;
            case 1:
              this._point = 2;
              break;
            case 2:
              ((this._point = 3), m(this, v(this, (r = y(this, t, e))), r));
              break;
            default:
              m(this, this._t0, (r = y(this, t, e)));
          }
          ((this._x0 = this._x1),
            (this._x1 = t),
            (this._y0 = this._y1),
            (this._y1 = e),
            (this._t0 = r));
        }
      },
    }),
    ((g.prototype = Object.create(b.prototype)).point = function (t, e) {
      b.prototype.point.call(this, e, t);
    }),
    (x.prototype = {
      moveTo: function (t, e) {
        this._context.moveTo(e, t);
      },
      closePath: function () {
        this._context.closePath();
      },
      lineTo: function (t, e) {
        this._context.lineTo(e, t);
      },
      bezierCurveTo: function (t, e, r, n, o, i) {
        this._context.bezierCurveTo(e, t, n, r, i, o);
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new b(t);
        },
      ],
      114605,
    ),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new g(t);
        },
      ],
      211986,
    ),
    (O.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = 0 / 0;
      },
      lineStart: function () {
        ((this._x = []), (this._y = []));
      },
      lineEnd: function () {
        var t = this._x,
          e = this._y,
          r = t.length;
        if (r)
          if (
            (this._line
              ? this._context.lineTo(t[0], e[0])
              : this._context.moveTo(t[0], e[0]),
            2 === r)
          )
            this._context.lineTo(t[1], e[1]);
          else
            for (var n = w(t), o = w(e), i = 0, a = 1; a < r; ++i, ++a)
              this._context.bezierCurveTo(
                n[0][i],
                o[0][i],
                n[1][i],
                o[1][i],
                t[a],
                e[a],
              );
        ((this._line || (0 !== this._line && 1 === r)) &&
          this._context.closePath(),
          (this._line = 1 - this._line),
          (this._x = this._y = null));
      },
      point: function (t, e) {
        (this._x.push(+t), this._y.push(+e));
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new O(t);
        },
      ],
      12669,
    ),
    (j.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = 0 / 0;
      },
      lineStart: function () {
        ((this._x = this._y = 0 / 0), (this._point = 0));
      },
      lineEnd: function () {
        (0 < this._t &&
          this._t < 1 &&
          2 === this._point &&
          this._context.lineTo(this._x, this._y),
          (this._line || (0 !== this._line && 1 === this._point)) &&
            this._context.closePath(),
          this._line >= 0 &&
            ((this._t = 1 - this._t), (this._line = 1 - this._line)));
      },
      point: function (t, e) {
        switch (((t *= 1), (e *= 1), this._point)) {
          case 0:
            ((this._point = 1),
              this._line
                ? this._context.lineTo(t, e)
                : this._context.moveTo(t, e));
            break;
          case 1:
            this._point = 2;
          default:
            if (this._t <= 0)
              (this._context.lineTo(this._x, e), this._context.lineTo(t, e));
            else {
              var r = this._x * (1 - this._t) + t * this._t;
              (this._context.lineTo(r, this._y), this._context.lineTo(r, e));
            }
        }
        ((this._x = t), (this._y = e));
      },
    }),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new j(t, 0.5);
        },
      ],
      373593,
    ),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new j(t, 1);
        },
      ],
      814826,
    ),
    t.s(
      [
        "f",
        0,
        function (t) {
          return new j(t, 0);
        },
      ],
      472737,
    ));
};
