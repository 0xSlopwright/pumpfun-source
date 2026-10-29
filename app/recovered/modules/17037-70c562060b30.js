// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(816217),
    i = e.r(344160),
    d = e.r(896812),
    a = e.r(990249),
    n = r.assert;
  function c(e) {
    (a.call(this, "short", e),
      (this.a = new i(e.a, 16).toRed(this.red)),
      (this.b = new i(e.b, 16).toRed(this.red)),
      (this.tinv = this.two.redInvm()),
      (this.zeroA = 0 === this.a.fromRed().cmpn(0)),
      (this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3)),
      (this.endo = this._getEndomorphism(e)),
      (this._endoWnafT1 = [, , , ,]),
      (this._endoWnafT2 = [, , , ,]));
  }
  function h(e, t, f, r) {
    (a.BasePoint.call(this, e, "affine"),
      null === t && null === f
        ? ((this.x = null), (this.y = null), (this.inf = !0))
        : ((this.x = new i(t, 16)),
          (this.y = new i(f, 16)),
          r &&
            (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)),
          this.x.red || (this.x = this.x.toRed(this.curve.red)),
          this.y.red || (this.y = this.y.toRed(this.curve.red)),
          (this.inf = !1)));
  }
  function s(e, t, f, r) {
    (a.BasePoint.call(this, e, "jacobian"),
      null === t && null === f && null === r
        ? ((this.x = this.curve.one),
          (this.y = this.curve.one),
          (this.z = new i(0)))
        : ((this.x = new i(t, 16)),
          (this.y = new i(f, 16)),
          (this.z = new i(r, 16))),
      this.x.red || (this.x = this.x.toRed(this.curve.red)),
      this.y.red || (this.y = this.y.toRed(this.curve.red)),
      this.z.red || (this.z = this.z.toRed(this.curve.red)),
      (this.zOne = this.z === this.curve.one));
  }
  (d(c, a),
    (t.exports = c),
    (c.prototype._getEndomorphism = function (e) {
      if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
        if (e.beta) t = new i(e.beta, 16).toRed(this.red);
        else {
          var t,
            f,
            r,
            d = this._getEndoRoots(this.p);
          t = (t = 0 > d[0].cmp(d[1]) ? d[0] : d[1]).toRed(this.red);
        }
        if (e.lambda) f = new i(e.lambda, 16);
        else {
          var a = this._getEndoRoots(this.n);
          0 === this.g.mul(a[0]).x.cmp(this.g.x.redMul(t))
            ? (f = a[0])
            : ((f = a[1]), n(0 === this.g.mul(f).x.cmp(this.g.x.redMul(t))));
        }
        return (
          (r = e.basis
            ? e.basis.map(function (e) {
                return { a: new i(e.a, 16), b: new i(e.b, 16) };
              })
            : this._getEndoBasis(f)),
          { beta: t, lambda: f, basis: r }
        );
      }
    }),
    (c.prototype._getEndoRoots = function (e) {
      var t = e === this.p ? this.red : i.mont(e),
        f = new i(2).toRed(t).redInvm(),
        r = f.redNeg(),
        d = new i(3).toRed(t).redNeg().redSqrt().redMul(f);
      return [r.redAdd(d).fromRed(), r.redSub(d).fromRed()];
    }),
    (c.prototype._getEndoBasis = function (e) {
      for (
        var t,
          f,
          r,
          d,
          a,
          n,
          c,
          h,
          s,
          o = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
          u = e,
          b = this.n.clone(),
          l = new i(1),
          p = new i(0),
          m = new i(0),
          v = new i(1),
          g = 0;
        0 !== u.cmpn(0);

      ) {
        var y = b.div(u);
        ((h = b.sub(y.mul(u))), (s = m.sub(y.mul(l))));
        var x = v.sub(y.mul(p));
        if (!r && 0 > h.cmp(o))
          ((t = c.neg()), (f = l), (r = h.neg()), (d = s));
        else if (r && 2 == ++g) break;
        ((c = h), (b = u), (u = h), (m = l), (l = s), (v = p), (p = x));
      }
      ((a = h.neg()), (n = s));
      var M = r.sqr().add(d.sqr());
      return (
        a.sqr().add(n.sqr()).cmp(M) >= 0 && ((a = t), (n = f)),
        r.negative && ((r = r.neg()), (d = d.neg())),
        a.negative && ((a = a.neg()), (n = n.neg())),
        [
          { a: r, b: d },
          { a: a, b: n },
        ]
      );
    }),
    (c.prototype._endoSplit = function (e) {
      var t = this.endo.basis,
        f = t[0],
        r = t[1],
        i = r.b.mul(e).divRound(this.n),
        d = f.b.neg().mul(e).divRound(this.n),
        a = i.mul(f.a),
        n = d.mul(r.a),
        c = i.mul(f.b),
        h = d.mul(r.b);
      return { k1: e.sub(a).sub(n), k2: c.add(h).neg() };
    }),
    (c.prototype.pointFromX = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var f = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
        r = f.redSqrt();
      if (0 !== r.redSqr().redSub(f).cmp(this.zero))
        throw Error("invalid point");
      var d = r.fromRed().isOdd();
      return (((t && !d) || (!t && d)) && (r = r.redNeg()), this.point(e, r));
    }),
    (c.prototype.validate = function (e) {
      if (e.inf) return !0;
      var t = e.x,
        f = e.y,
        r = this.a.redMul(t),
        i = t.redSqr().redMul(t).redIAdd(r).redIAdd(this.b);
      return 0 === f.redSqr().redISub(i).cmpn(0);
    }),
    (c.prototype._endoWnafMulAdd = function (e, t, f) {
      for (
        var r = this._endoWnafT1, i = this._endoWnafT2, d = 0;
        d < e.length;
        d++
      ) {
        var a = this._endoSplit(t[d]),
          n = e[d],
          c = n._getBeta();
        (a.k1.negative && (a.k1.ineg(), (n = n.neg(!0))),
          a.k2.negative && (a.k2.ineg(), (c = c.neg(!0))),
          (r[2 * d] = n),
          (r[2 * d + 1] = c),
          (i[2 * d] = a.k1),
          (i[2 * d + 1] = a.k2));
      }
      for (var h = this._wnafMulAdd(1, r, i, 2 * d, f), s = 0; s < 2 * d; s++)
        ((r[s] = null), (i[s] = null));
      return h;
    }),
    d(h, a.BasePoint),
    (c.prototype.point = function (e, t, f) {
      return new h(this, e, t, f);
    }),
    (c.prototype.pointFromJSON = function (e, t) {
      return h.fromJSON(this, e, t);
    }),
    (h.prototype._getBeta = function () {
      if (this.curve.endo) {
        var e = this.precomputed;
        if (e && e.beta) return e.beta;
        var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
        if (e) {
          var f = this.curve,
            r = function (e) {
              return f.point(e.x.redMul(f.endo.beta), e.y);
            };
          ((e.beta = t),
            (t.precomputed = {
              beta: null,
              naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(r) },
              doubles: e.doubles && {
                step: e.doubles.step,
                points: e.doubles.points.map(r),
              },
            }));
        }
        return t;
      }
    }),
    (h.prototype.toJSON = function () {
      return this.precomputed
        ? [
            this.x,
            this.y,
            this.precomputed && {
              doubles: this.precomputed.doubles && {
                step: this.precomputed.doubles.step,
                points: this.precomputed.doubles.points.slice(1),
              },
              naf: this.precomputed.naf && {
                wnd: this.precomputed.naf.wnd,
                points: this.precomputed.naf.points.slice(1),
              },
            },
          ]
        : [this.x, this.y];
    }),
    (h.fromJSON = function (e, t, f) {
      "string" == typeof t && (t = JSON.parse(t));
      var r = e.point(t[0], t[1], f);
      if (!t[2]) return r;
      function i(t) {
        return e.point(t[0], t[1], f);
      }
      var d = t[2];
      return (
        (r.precomputed = {
          beta: null,
          doubles: d.doubles && {
            step: d.doubles.step,
            points: [r].concat(d.doubles.points.map(i)),
          },
          naf: d.naf && {
            wnd: d.naf.wnd,
            points: [r].concat(d.naf.points.map(i)),
          },
        }),
        r
      );
    }),
    (h.prototype.inspect = function () {
      return this.isInfinity()
        ? "<EC Point Infinity>"
        : "<EC Point x: " +
            this.x.fromRed().toString(16, 2) +
            " y: " +
            this.y.fromRed().toString(16, 2) +
            ">";
    }),
    (h.prototype.isInfinity = function () {
      return this.inf;
    }),
    (h.prototype.add = function (e) {
      if (this.inf) return e;
      if (e.inf) return this;
      if (this.eq(e)) return this.dbl();
      if (this.neg().eq(e) || 0 === this.x.cmp(e.x))
        return this.curve.point(null, null);
      var t = this.y.redSub(e.y);
      0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
      var f = t.redSqr().redISub(this.x).redISub(e.x),
        r = t.redMul(this.x.redSub(f)).redISub(this.y);
      return this.curve.point(f, r);
    }),
    (h.prototype.dbl = function () {
      if (this.inf) return this;
      var e = this.y.redAdd(this.y);
      if (0 === e.cmpn(0)) return this.curve.point(null, null);
      var t = this.curve.a,
        f = this.x.redSqr(),
        r = e.redInvm(),
        i = f.redAdd(f).redIAdd(f).redIAdd(t).redMul(r),
        d = i.redSqr().redISub(this.x.redAdd(this.x)),
        a = i.redMul(this.x.redSub(d)).redISub(this.y);
      return this.curve.point(d, a);
    }),
    (h.prototype.getX = function () {
      return this.x.fromRed();
    }),
    (h.prototype.getY = function () {
      return this.y.fromRed();
    }),
    (h.prototype.mul = function (e) {
      return ((e = new i(e, 16)), this.isInfinity())
        ? this
        : this._hasDoubles(e)
          ? this.curve._fixedNafMul(this, e)
          : this.curve.endo
            ? this.curve._endoWnafMulAdd([this], [e])
            : this.curve._wnafMul(this, e);
    }),
    (h.prototype.mulAdd = function (e, t, f) {
      var r = [this, t],
        i = [e, f];
      return this.curve.endo
        ? this.curve._endoWnafMulAdd(r, i)
        : this.curve._wnafMulAdd(1, r, i, 2);
    }),
    (h.prototype.jmulAdd = function (e, t, f) {
      var r = [this, t],
        i = [e, f];
      return this.curve.endo
        ? this.curve._endoWnafMulAdd(r, i, !0)
        : this.curve._wnafMulAdd(1, r, i, 2, !0);
    }),
    (h.prototype.eq = function (e) {
      return (
        this === e ||
        (this.inf === e.inf &&
          (this.inf || (0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))))
      );
    }),
    (h.prototype.neg = function (e) {
      if (this.inf) return this;
      var t = this.curve.point(this.x, this.y.redNeg());
      if (e && this.precomputed) {
        var f = this.precomputed,
          r = function (e) {
            return e.neg();
          };
        t.precomputed = {
          naf: f.naf && { wnd: f.naf.wnd, points: f.naf.points.map(r) },
          doubles: f.doubles && {
            step: f.doubles.step,
            points: f.doubles.points.map(r),
          },
        };
      }
      return t;
    }),
    (h.prototype.toJ = function () {
      return this.inf
        ? this.curve.jpoint(null, null, null)
        : this.curve.jpoint(this.x, this.y, this.curve.one);
    }),
    d(s, a.BasePoint),
    (c.prototype.jpoint = function (e, t, f) {
      return new s(this, e, t, f);
    }),
    (s.prototype.toP = function () {
      if (this.isInfinity()) return this.curve.point(null, null);
      var e = this.z.redInvm(),
        t = e.redSqr(),
        f = this.x.redMul(t),
        r = this.y.redMul(t).redMul(e);
      return this.curve.point(f, r);
    }),
    (s.prototype.neg = function () {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    }),
    (s.prototype.add = function (e) {
      if (this.isInfinity()) return e;
      if (e.isInfinity()) return this;
      var t = e.z.redSqr(),
        f = this.z.redSqr(),
        r = this.x.redMul(t),
        i = e.x.redMul(f),
        d = this.y.redMul(t.redMul(e.z)),
        a = e.y.redMul(f.redMul(this.z)),
        n = r.redSub(i),
        c = d.redSub(a);
      if (0 === n.cmpn(0))
        if (0 !== c.cmpn(0)) return this.curve.jpoint(null, null, null);
        else return this.dbl();
      var h = n.redSqr(),
        s = h.redMul(n),
        o = r.redMul(h),
        u = c.redSqr().redIAdd(s).redISub(o).redISub(o),
        b = c.redMul(o.redISub(u)).redISub(d.redMul(s)),
        l = this.z.redMul(e.z).redMul(n);
      return this.curve.jpoint(u, b, l);
    }),
    (s.prototype.mixedAdd = function (e) {
      if (this.isInfinity()) return e.toJ();
      if (e.isInfinity()) return this;
      var t = this.z.redSqr(),
        f = this.x,
        r = e.x.redMul(t),
        i = this.y,
        d = e.y.redMul(t).redMul(this.z),
        a = f.redSub(r),
        n = i.redSub(d);
      if (0 === a.cmpn(0))
        if (0 !== n.cmpn(0)) return this.curve.jpoint(null, null, null);
        else return this.dbl();
      var c = a.redSqr(),
        h = c.redMul(a),
        s = f.redMul(c),
        o = n.redSqr().redIAdd(h).redISub(s).redISub(s),
        u = n.redMul(s.redISub(o)).redISub(i.redMul(h)),
        b = this.z.redMul(a);
      return this.curve.jpoint(o, u, b);
    }),
    (s.prototype.dblp = function (e) {
      if (0 === e || this.isInfinity()) return this;
      if (!e) return this.dbl();
      if (this.curve.zeroA || this.curve.threeA) {
        var t,
          f = this;
        for (t = 0; t < e; t++) f = f.dbl();
        return f;
      }
      var r = this.curve.a,
        i = this.curve.tinv,
        d = this.x,
        a = this.y,
        n = this.z,
        c = n.redSqr().redSqr(),
        h = a.redAdd(a);
      for (t = 0; t < e; t++) {
        var s = d.redSqr(),
          o = h.redSqr(),
          u = o.redSqr(),
          b = s.redAdd(s).redIAdd(s).redIAdd(r.redMul(c)),
          l = d.redMul(o),
          p = b.redSqr().redISub(l.redAdd(l)),
          m = l.redISub(p),
          v = b.redMul(m);
        v = v.redIAdd(v).redISub(u);
        var g = h.redMul(n);
        (t + 1 < e && (c = c.redMul(u)), (d = p), (n = g), (h = v));
      }
      return this.curve.jpoint(d, h.redMul(i), n);
    }),
    (s.prototype.dbl = function () {
      return this.isInfinity()
        ? this
        : this.curve.zeroA
          ? this._zeroDbl()
          : this.curve.threeA
            ? this._threeDbl()
            : this._dbl();
    }),
    (s.prototype._zeroDbl = function () {
      if (this.zOne) {
        var e,
          t,
          f,
          r = this.x.redSqr(),
          i = this.y.redSqr(),
          d = i.redSqr(),
          a = this.x.redAdd(i).redSqr().redISub(r).redISub(d);
        a = a.redIAdd(a);
        var n = r.redAdd(r).redIAdd(r),
          c = n.redSqr().redISub(a).redISub(a),
          h = d.redIAdd(d);
        ((h = (h = h.redIAdd(h)).redIAdd(h)),
          (e = c),
          (t = n.redMul(a.redISub(c)).redISub(h)),
          (f = this.y.redAdd(this.y)));
      } else {
        var s = this.x.redSqr(),
          o = this.y.redSqr(),
          u = o.redSqr(),
          b = this.x.redAdd(o).redSqr().redISub(s).redISub(u);
        b = b.redIAdd(b);
        var l = s.redAdd(s).redIAdd(s),
          p = l.redSqr(),
          m = u.redIAdd(u);
        ((m = (m = m.redIAdd(m)).redIAdd(m)),
          (e = p.redISub(b).redISub(b)),
          (t = l.redMul(b.redISub(e)).redISub(m)),
          (f = (f = this.y.redMul(this.z)).redIAdd(f)));
      }
      return this.curve.jpoint(e, t, f);
    }),
    (s.prototype._threeDbl = function () {
      if (this.zOne) {
        var e,
          t,
          f,
          r = this.x.redSqr(),
          i = this.y.redSqr(),
          d = i.redSqr(),
          a = this.x.redAdd(i).redSqr().redISub(r).redISub(d);
        a = a.redIAdd(a);
        var n = r.redAdd(r).redIAdd(r).redIAdd(this.curve.a),
          c = n.redSqr().redISub(a).redISub(a);
        e = c;
        var h = d.redIAdd(d);
        ((h = (h = h.redIAdd(h)).redIAdd(h)),
          (t = n.redMul(a.redISub(c)).redISub(h)),
          (f = this.y.redAdd(this.y)));
      } else {
        var s = this.z.redSqr(),
          o = this.y.redSqr(),
          u = this.x.redMul(o),
          b = this.x.redSub(s).redMul(this.x.redAdd(s));
        b = b.redAdd(b).redIAdd(b);
        var l = u.redIAdd(u),
          p = (l = l.redIAdd(l)).redAdd(l);
        ((e = b.redSqr().redISub(p)),
          (f = this.y.redAdd(this.z).redSqr().redISub(o).redISub(s)));
        var m = o.redSqr();
        ((m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m)),
          (t = b.redMul(l.redISub(e)).redISub(m)));
      }
      return this.curve.jpoint(e, t, f);
    }),
    (s.prototype._dbl = function () {
      var e = this.curve.a,
        t = this.x,
        f = this.y,
        r = this.z,
        i = r.redSqr().redSqr(),
        d = t.redSqr(),
        a = f.redSqr(),
        n = d.redAdd(d).redIAdd(d).redIAdd(e.redMul(i)),
        c = t.redAdd(t),
        h = (c = c.redIAdd(c)).redMul(a),
        s = n.redSqr().redISub(h.redAdd(h)),
        o = h.redISub(s),
        u = a.redSqr();
      u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
      var b = n.redMul(o).redISub(u),
        l = f.redAdd(f).redMul(r);
      return this.curve.jpoint(s, b, l);
    }),
    (s.prototype.trpl = function () {
      if (!this.curve.zeroA) return this.dbl().add(this);
      var e = this.x.redSqr(),
        t = this.y.redSqr(),
        f = this.z.redSqr(),
        r = t.redSqr(),
        i = e.redAdd(e).redIAdd(e),
        d = i.redSqr(),
        a = this.x.redAdd(t).redSqr().redISub(e).redISub(r),
        n = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(
          d,
        )).redSqr(),
        c = r.redIAdd(r);
      c = (c = (c = c.redIAdd(c)).redIAdd(c)).redIAdd(c);
      var h = i.redIAdd(a).redSqr().redISub(d).redISub(n).redISub(c),
        s = t.redMul(h);
      s = (s = s.redIAdd(s)).redIAdd(s);
      var o = this.x.redMul(n).redISub(s);
      o = (o = o.redIAdd(o)).redIAdd(o);
      var u = this.y.redMul(h.redMul(c.redISub(h)).redISub(a.redMul(n)));
      u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
      var b = this.z.redAdd(a).redSqr().redISub(f).redISub(n);
      return this.curve.jpoint(o, u, b);
    }),
    (s.prototype.mul = function (e, t) {
      return ((e = new i(e, t)), this.curve._wnafMul(this, e));
    }),
    (s.prototype.eq = function (e) {
      if ("affine" === e.type) return this.eq(e.toJ());
      if (this === e) return !0;
      var t = this.z.redSqr(),
        f = e.z.redSqr();
      if (0 !== this.x.redMul(f).redISub(e.x.redMul(t)).cmpn(0)) return !1;
      var r = t.redMul(this.z),
        i = f.redMul(e.z);
      return 0 === this.y.redMul(i).redISub(e.y.redMul(r)).cmpn(0);
    }),
    (s.prototype.eqXToP = function (e) {
      var t = this.z.redSqr(),
        f = e.toRed(this.curve.red).redMul(t);
      if (0 === this.x.cmp(f)) return !0;
      for (var r = e.clone(), i = this.curve.redN.redMul(t); ; ) {
        if ((r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0)) return !1;
        if ((f.redIAdd(i), 0 === this.x.cmp(f))) return !0;
      }
    }),
    (s.prototype.inspect = function () {
      return this.isInfinity()
        ? "<EC JPoint Infinity>"
        : "<EC JPoint x: " +
            this.x.toString(16, 2) +
            " y: " +
            this.y.toString(16, 2) +
            " z: " +
            this.z.toString(16, 2) +
            ">";
    }),
    (s.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0);
    }));
};
