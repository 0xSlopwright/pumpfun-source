// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e = Math.PI,
    r = 2 * e,
    n = r - 1e-6;
  function o(t) {
    this._ += t[0];
    for (let e = 1, r = t.length; e < r; ++e) this._ += arguments[e] + t[e];
  }
  class i {
    constructor(t) {
      ((this._x0 = this._y0 = this._x1 = this._y1 = null),
        (this._ = ""),
        (this._append =
          null == t
            ? o
            : (function (t) {
                let e = Math.floor(t);
                if (!(e >= 0)) throw Error(`invalid digits: ${t}`);
                if (e > 15) return o;
                let r = 10 ** e;
                return function (t) {
                  this._ += t[0];
                  for (let e = 1, n = t.length; e < n; ++e)
                    this._ += Math.round(arguments[e] * r) / r + t[e];
                };
              })(t)));
    }
    moveTo(t, e) {
      this
        ._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +e)}`;
    }
    closePath() {
      null !== this._x1 &&
        ((this._x1 = this._x0), (this._y1 = this._y0), this._append`Z`);
    }
    lineTo(t, e) {
      this._append`L${(this._x1 = +t)},${(this._y1 = +e)}`;
    }
    quadraticCurveTo(t, e, r, n) {
      this._append`Q${+t},${+e},${(this._x1 = +r)},${(this._y1 = +n)}`;
    }
    bezierCurveTo(t, e, r, n, o, i) {
      this
        ._append`C${+t},${+e},${+r},${+n},${(this._x1 = +o)},${(this._y1 = +i)}`;
    }
    arcTo(t, r, n, o, i) {
      if (((t *= 1), (r *= 1), (n *= 1), (o *= 1), (i *= 1) < 0))
        throw Error(`negative radius: ${i}`);
      let a = this._x1,
        u = this._y1,
        c = n - t,
        l = o - r,
        s = a - t,
        f = u - r,
        p = s * s + f * f;
      if (null === this._x1) this._append`M${(this._x1 = t)},${(this._y1 = r)}`;
      else if (p > 1e-6)
        if (Math.abs(f * c - l * s) > 1e-6 && i) {
          let d = n - a,
            h = o - u,
            y = c * c + l * l,
            v = Math.sqrt(y),
            m = Math.sqrt(p),
            b =
              i *
              Math.tan(
                (e - Math.acos((y + p - (d * d + h * h)) / (2 * v * m))) / 2,
              ),
            g = b / m,
            x = b / v;
          (Math.abs(g - 1) > 1e-6 && this._append`L${t + g * s},${r + g * f}`,
            this
              ._append`A${i},${i},0,0,${+(f * d > s * h)},${(this._x1 = t + x * c)},${(this._y1 = r + x * l)}`);
        } else this._append`L${(this._x1 = t)},${(this._y1 = r)}`;
    }
    arc(t, o, i, a, u, c) {
      if (((t *= 1), (o *= 1), (i *= 1), (c = !!c), i < 0))
        throw Error(`negative radius: ${i}`);
      let l = i * Math.cos(a),
        s = i * Math.sin(a),
        f = t + l,
        p = o + s,
        d = 1 ^ c,
        h = c ? a - u : u - a;
      (null === this._x1
        ? this._append`M${f},${p}`
        : (Math.abs(this._x1 - f) > 1e-6 || Math.abs(this._y1 - p) > 1e-6) &&
          this._append`L${f},${p}`,
        i &&
          (h < 0 && (h = (h % r) + r),
          h > n
            ? this
                ._append`A${i},${i},0,1,${d},${t - l},${o - s}A${i},${i},0,1,${d},${(this._x1 = f)},${(this._y1 = p)}`
            : h > 1e-6 &&
              this
                ._append`A${i},${i},0,${+(h >= e)},${d},${(this._x1 = t + i * Math.cos(u))},${(this._y1 = o + i * Math.sin(u))}`));
    }
    rect(t, e, r, n) {
      this
        ._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +e)}h${(r *= 1)}v${+n}h${-r}Z`;
    }
    toString() {
      return this._;
    }
  }
  (i.prototype,
    t.s(
      [
        "f",
        0,
        function (t) {
          let e = 3;
          return (
            (t.digits = function (r) {
              if (!arguments.length) return e;
              if (null == r) e = null;
              else {
                let t = Math.floor(r);
                if (!(t >= 0)) throw RangeError(`invalid digits: ${r}`);
                e = t;
              }
              return t;
            }),
            () => new i(e)
          );
        },
      ],
      199518,
    ));
};
