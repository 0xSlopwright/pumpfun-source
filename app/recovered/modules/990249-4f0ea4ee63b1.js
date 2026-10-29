// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(816217),
    d = i.getNAF,
    a = i.getJSF,
    n = i.assert;
  function c(e, t) {
    ((this.type = e),
      (this.p = new r(t.p, 16)),
      (this.red = t.prime ? r.red(t.prime) : r.mont(this.p)),
      (this.zero = new r(0).toRed(this.red)),
      (this.one = new r(1).toRed(this.red)),
      (this.two = new r(2).toRed(this.red)),
      (this.n = t.n && new r(t.n, 16)),
      (this.g = t.g && this.pointFromJSON(t.g, t.gRed)),
      (this._wnafT1 = [, , , ,]),
      (this._wnafT2 = [, , , ,]),
      (this._wnafT3 = [, , , ,]),
      (this._wnafT4 = [, , , ,]),
      (this._bitLength = this.n ? this.n.bitLength() : 0));
    var f = this.n && this.p.div(this.n);
    !f || f.cmpn(100) > 0
      ? (this.redN = null)
      : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)));
  }
  function h(e, t) {
    ((this.curve = e), (this.type = t), (this.precomputed = null));
  }
  ((t.exports = c),
    (c.prototype.point = function () {
      throw Error("Not implemented");
    }),
    (c.prototype.validate = function () {
      throw Error("Not implemented");
    }),
    (c.prototype._fixedNafMul = function (e, t) {
      n(e.precomputed);
      var f,
        r,
        i = e._getDoubles(),
        a = d(t, 1, this._bitLength),
        c = (1 << (i.step + 1)) - (i.step % 2 == 0 ? 2 : 1);
      c /= 3;
      var h = [];
      for (f = 0; f < a.length; f += i.step) {
        r = 0;
        for (var s = f + i.step - 1; s >= f; s--) r = (r << 1) + a[s];
        h.push(r);
      }
      for (
        var o = this.jpoint(null, null, null),
          u = this.jpoint(null, null, null),
          b = c;
        b > 0;
        b--
      ) {
        for (f = 0; f < h.length; f++)
          (r = h[f]) === b
            ? (u = u.mixedAdd(i.points[f]))
            : r === -b && (u = u.mixedAdd(i.points[f].neg()));
        o = o.add(u);
      }
      return o.toP();
    }),
    (c.prototype._wnafMul = function (e, t) {
      var f = 4,
        r = e._getNAFPoints(f);
      f = r.wnd;
      for (
        var i = r.points,
          a = d(t, f, this._bitLength),
          c = this.jpoint(null, null, null),
          h = a.length - 1;
        h >= 0;
        h--
      ) {
        for (var s = 0; h >= 0 && 0 === a[h]; h--) s++;
        if ((h >= 0 && s++, (c = c.dblp(s)), h < 0)) break;
        var o = a[h];
        (n(0 !== o),
          (c =
            "affine" === e.type
              ? o > 0
                ? c.mixedAdd(i[(o - 1) >> 1])
                : c.mixedAdd(i[(-o - 1) >> 1].neg())
              : o > 0
                ? c.add(i[(o - 1) >> 1])
                : c.add(i[(-o - 1) >> 1].neg())));
      }
      return "affine" === e.type ? c.toP() : c;
    }),
    (c.prototype._wnafMulAdd = function (e, t, f, r, i) {
      var n,
        c,
        h,
        s = this._wnafT1,
        o = this._wnafT2,
        u = this._wnafT3,
        b = 0;
      for (n = 0; n < r; n++) {
        var l = (h = t[n])._getNAFPoints(e);
        ((s[n] = l.wnd), (o[n] = l.points));
      }
      for (n = r - 1; n >= 1; n -= 2) {
        var p = n - 1,
          m = n;
        if (1 !== s[p] || 1 !== s[m]) {
          ((u[p] = d(f[p], s[p], this._bitLength)),
            (u[m] = d(f[m], s[m], this._bitLength)),
            (b = Math.max(u[p].length, b)),
            (b = Math.max(u[m].length, b)));
          continue;
        }
        var v = [t[p], null, null, t[m]];
        0 === t[p].y.cmp(t[m].y)
          ? ((v[1] = t[p].add(t[m])), (v[2] = t[p].toJ().mixedAdd(t[m].neg())))
          : 0 === t[p].y.cmp(t[m].y.redNeg())
            ? ((v[1] = t[p].toJ().mixedAdd(t[m])),
              (v[2] = t[p].add(t[m].neg())))
            : ((v[1] = t[p].toJ().mixedAdd(t[m])),
              (v[2] = t[p].toJ().mixedAdd(t[m].neg())));
        var g = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
          y = a(f[p], f[m]);
        for (
          b = Math.max(y[0].length, b), u[p] = Array(b), u[m] = Array(b), c = 0;
          c < b;
          c++
        ) {
          var x = 0 | y[0][c],
            M = 0 | y[1][c];
          ((u[p][c] = g[(x + 1) * 3 + (M + 1)]), (u[m][c] = 0), (o[p] = v));
        }
      }
      var w = this.jpoint(null, null, null),
        S = this._wnafT4;
      for (n = b; n >= 0; n--) {
        for (var _ = 0; n >= 0; ) {
          var A = !0;
          for (c = 0; c < r; c++)
            ((S[c] = 0 | u[c][n]), 0 !== S[c] && (A = !1));
          if (!A) break;
          (_++, n--);
        }
        if ((n >= 0 && _++, (w = w.dblp(_)), n < 0)) break;
        for (c = 0; c < r; c++) {
          var I = S[c];
          0 !== I &&
            (I > 0
              ? (h = o[c][(I - 1) >> 1])
              : I < 0 && (h = o[c][(-I - 1) >> 1].neg()),
            (w = "affine" === h.type ? w.mixedAdd(h) : w.add(h)));
        }
      }
      for (n = 0; n < r; n++) o[n] = null;
      return i ? w : w.toP();
    }),
    (c.BasePoint = h),
    (h.prototype.eq = function () {
      throw Error("Not implemented");
    }),
    (h.prototype.validate = function () {
      return this.curve.validate(this);
    }),
    (c.prototype.decodePoint = function (e, t) {
      e = i.toArray(e, t);
      var f = this.p.byteLength();
      if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * f)
        return (
          6 === e[0]
            ? n(e[e.length - 1] % 2 == 0)
            : 7 === e[0] && n(e[e.length - 1] % 2 == 1),
          this.point(e.slice(1, 1 + f), e.slice(1 + f, 1 + 2 * f))
        );
      if ((2 === e[0] || 3 === e[0]) && e.length - 1 === f)
        return this.pointFromX(e.slice(1, 1 + f), 3 === e[0]);
      throw Error("Unknown point format");
    }),
    (h.prototype.encodeCompressed = function (e) {
      return this.encode(e, !0);
    }),
    (h.prototype._encode = function (e) {
      var t = this.curve.p.byteLength(),
        f = this.getX().toArray("be", t);
      return e
        ? [this.getY().isEven() ? 2 : 3].concat(f)
        : [4].concat(f, this.getY().toArray("be", t));
    }),
    (h.prototype.encode = function (e, t) {
      return i.encode(this._encode(t), e);
    }),
    (h.prototype.precompute = function (e) {
      if (this.precomputed) return this;
      var t = { doubles: null, naf: null, beta: null };
      return (
        (t.naf = this._getNAFPoints(8)),
        (t.doubles = this._getDoubles(4, e)),
        (t.beta = this._getBeta()),
        (this.precomputed = t),
        this
      );
    }),
    (h.prototype._hasDoubles = function (e) {
      if (!this.precomputed) return !1;
      var t = this.precomputed.doubles;
      return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
    }),
    (h.prototype._getDoubles = function (e, t) {
      if (this.precomputed && this.precomputed.doubles)
        return this.precomputed.doubles;
      for (var f = [this], r = this, i = 0; i < t; i += e) {
        for (var d = 0; d < e; d++) r = r.dbl();
        f.push(r);
      }
      return { step: e, points: f };
    }),
    (h.prototype._getNAFPoints = function (e) {
      if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
      for (
        var t = [this],
          f = (1 << e) - 1,
          r = 1 === f ? null : this.dbl(),
          i = 1;
        i < f;
        i++
      )
        t[i] = t[i - 1].add(r);
      return { wnd: e, points: t };
    }),
    (h.prototype._getBeta = function () {
      return null;
    }),
    (h.prototype.dblp = function (e) {
      for (var t = this, f = 0; f < e; f++) t = t.dbl();
      return t;
    }));
};
