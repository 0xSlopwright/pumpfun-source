// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(816217),
    i = e.r(344160),
    d = e.r(896812),
    a = e.r(990249),
    n = r.assert;
  function c(e) {
    ((this.twisted = (0 | e.a) != 1),
      (this.mOneA = this.twisted && (0 | e.a) == -1),
      (this.extended = this.mOneA),
      a.call(this, "edwards", e),
      (this.a = new i(e.a, 16).umod(this.red.m)),
      (this.a = this.a.toRed(this.red)),
      (this.c = new i(e.c, 16).toRed(this.red)),
      (this.c2 = this.c.redSqr()),
      (this.d = new i(e.d, 16).toRed(this.red)),
      (this.dd = this.d.redAdd(this.d)),
      n(!this.twisted || 0 === this.c.fromRed().cmpn(1)),
      (this.oneC = (0 | e.c) == 1));
  }
  function h(e, t, f, r, d) {
    (a.BasePoint.call(this, e, "projective"),
      null === t && null === f && null === r
        ? ((this.x = this.curve.zero),
          (this.y = this.curve.one),
          (this.z = this.curve.one),
          (this.t = this.curve.zero),
          (this.zOne = !0))
        : ((this.x = new i(t, 16)),
          (this.y = new i(f, 16)),
          (this.z = r ? new i(r, 16) : this.curve.one),
          (this.t = d && new i(d, 16)),
          this.x.red || (this.x = this.x.toRed(this.curve.red)),
          this.y.red || (this.y = this.y.toRed(this.curve.red)),
          this.z.red || (this.z = this.z.toRed(this.curve.red)),
          this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)),
          (this.zOne = this.z === this.curve.one),
          this.curve.extended &&
            !this.t &&
            ((this.t = this.x.redMul(this.y)),
            this.zOne || (this.t = this.t.redMul(this.z.redInvm())))));
  }
  (d(c, a),
    (t.exports = c),
    (c.prototype._mulA = function (e) {
      return this.mOneA ? e.redNeg() : this.a.redMul(e);
    }),
    (c.prototype._mulC = function (e) {
      return this.oneC ? e : this.c.redMul(e);
    }),
    (c.prototype.jpoint = function (e, t, f, r) {
      return this.point(e, t, f, r);
    }),
    (c.prototype.pointFromX = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var f = e.redSqr(),
        r = this.c2.redSub(this.a.redMul(f)),
        d = this.one.redSub(this.c2.redMul(this.d).redMul(f)),
        a = r.redMul(d.redInvm()),
        n = a.redSqrt();
      if (0 !== n.redSqr().redSub(a).cmp(this.zero))
        throw Error("invalid point");
      var c = n.fromRed().isOdd();
      return (((t && !c) || (!t && c)) && (n = n.redNeg()), this.point(e, n));
    }),
    (c.prototype.pointFromY = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var f = e.redSqr(),
        r = f.redSub(this.c2),
        d = f.redMul(this.d).redMul(this.c2).redSub(this.a),
        a = r.redMul(d.redInvm());
      if (0 === a.cmp(this.zero))
        if (!t) return this.point(this.zero, e);
        else throw Error("invalid point");
      var n = a.redSqrt();
      if (0 !== n.redSqr().redSub(a).cmp(this.zero))
        throw Error("invalid point");
      return (n.fromRed().isOdd() !== t && (n = n.redNeg()), this.point(n, e));
    }),
    (c.prototype.validate = function (e) {
      if (e.isInfinity()) return !0;
      e.normalize();
      var t = e.x.redSqr(),
        f = e.y.redSqr(),
        r = t.redMul(this.a).redAdd(f),
        i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(f)));
      return 0 === r.cmp(i);
    }),
    d(h, a.BasePoint),
    (c.prototype.pointFromJSON = function (e) {
      return h.fromJSON(this, e);
    }),
    (c.prototype.point = function (e, t, f, r) {
      return new h(this, e, t, f, r);
    }),
    (h.fromJSON = function (e, t) {
      return new h(e, t[0], t[1], t[2]);
    }),
    (h.prototype.inspect = function () {
      return this.isInfinity()
        ? "<EC Point Infinity>"
        : "<EC Point x: " +
            this.x.fromRed().toString(16, 2) +
            " y: " +
            this.y.fromRed().toString(16, 2) +
            " z: " +
            this.z.fromRed().toString(16, 2) +
            ">";
    }),
    (h.prototype.isInfinity = function () {
      return (
        0 === this.x.cmpn(0) &&
        (0 === this.y.cmp(this.z) ||
          (this.zOne && 0 === this.y.cmp(this.curve.c)))
      );
    }),
    (h.prototype._extDbl = function () {
      var e = this.x.redSqr(),
        t = this.y.redSqr(),
        f = this.z.redSqr();
      f = f.redIAdd(f);
      var r = this.curve._mulA(e),
        i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
        d = r.redAdd(t),
        a = d.redSub(f),
        n = r.redSub(t),
        c = i.redMul(a),
        h = d.redMul(n),
        s = i.redMul(n),
        o = a.redMul(d);
      return this.curve.point(c, h, o, s);
    }),
    (h.prototype._projDbl = function () {
      var e,
        t,
        f,
        r,
        i,
        d,
        a = this.x.redAdd(this.y).redSqr(),
        n = this.x.redSqr(),
        c = this.y.redSqr();
      if (this.curve.twisted) {
        var h = (r = this.curve._mulA(n)).redAdd(c);
        this.zOne
          ? ((e = a.redSub(n).redSub(c).redMul(h.redSub(this.curve.two))),
            (t = h.redMul(r.redSub(c))),
            (f = h.redSqr().redSub(h).redSub(h)))
          : ((i = this.z.redSqr()),
            (d = h.redSub(i).redISub(i)),
            (e = a.redSub(n).redISub(c).redMul(d)),
            (t = h.redMul(r.redSub(c))),
            (f = h.redMul(d)));
      } else
        ((r = n.redAdd(c)),
          (i = this.curve._mulC(this.z).redSqr()),
          (d = r.redSub(i).redSub(i)),
          (e = this.curve._mulC(a.redISub(r)).redMul(d)),
          (t = this.curve._mulC(r).redMul(n.redISub(c))),
          (f = r.redMul(d)));
      return this.curve.point(e, t, f);
    }),
    (h.prototype.dbl = function () {
      return this.isInfinity()
        ? this
        : this.curve.extended
          ? this._extDbl()
          : this._projDbl();
    }),
    (h.prototype._extAdd = function (e) {
      var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
        f = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
        r = this.t.redMul(this.curve.dd).redMul(e.t),
        i = this.z.redMul(e.z.redAdd(e.z)),
        d = f.redSub(t),
        a = i.redSub(r),
        n = i.redAdd(r),
        c = f.redAdd(t),
        h = d.redMul(a),
        s = n.redMul(c),
        o = d.redMul(c),
        u = a.redMul(n);
      return this.curve.point(h, s, u, o);
    }),
    (h.prototype._projAdd = function (e) {
      var t,
        f,
        r = this.z.redMul(e.z),
        i = r.redSqr(),
        d = this.x.redMul(e.x),
        a = this.y.redMul(e.y),
        n = this.curve.d.redMul(d).redMul(a),
        c = i.redSub(n),
        h = i.redAdd(n),
        s = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(d).redISub(a),
        o = r.redMul(c).redMul(s);
      return (
        this.curve.twisted
          ? ((t = r.redMul(h).redMul(a.redSub(this.curve._mulA(d)))),
            (f = c.redMul(h)))
          : ((t = r.redMul(h).redMul(a.redSub(d))),
            (f = this.curve._mulC(c).redMul(h))),
        this.curve.point(o, t, f)
      );
    }),
    (h.prototype.add = function (e) {
      return this.isInfinity()
        ? e
        : e.isInfinity()
          ? this
          : this.curve.extended
            ? this._extAdd(e)
            : this._projAdd(e);
    }),
    (h.prototype.mul = function (e) {
      return this._hasDoubles(e)
        ? this.curve._fixedNafMul(this, e)
        : this.curve._wnafMul(this, e);
    }),
    (h.prototype.mulAdd = function (e, t, f) {
      return this.curve._wnafMulAdd(1, [this, t], [e, f], 2, !1);
    }),
    (h.prototype.jmulAdd = function (e, t, f) {
      return this.curve._wnafMulAdd(1, [this, t], [e, f], 2, !0);
    }),
    (h.prototype.normalize = function () {
      if (this.zOne) return this;
      var e = this.z.redInvm();
      return (
        (this.x = this.x.redMul(e)),
        (this.y = this.y.redMul(e)),
        this.t && (this.t = this.t.redMul(e)),
        (this.z = this.curve.one),
        (this.zOne = !0),
        this
      );
    }),
    (h.prototype.neg = function () {
      return this.curve.point(
        this.x.redNeg(),
        this.y,
        this.z,
        this.t && this.t.redNeg(),
      );
    }),
    (h.prototype.getX = function () {
      return (this.normalize(), this.x.fromRed());
    }),
    (h.prototype.getY = function () {
      return (this.normalize(), this.y.fromRed());
    }),
    (h.prototype.eq = function (e) {
      return (
        this === e ||
        (0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY()))
      );
    }),
    (h.prototype.eqXToP = function (e) {
      var t = e.toRed(this.curve.red).redMul(this.z);
      if (0 === this.x.cmp(t)) return !0;
      for (var f = e.clone(), r = this.curve.redN.redMul(this.z); ; ) {
        if ((f.iadd(this.curve.n), f.cmp(this.curve.p) >= 0)) return !1;
        if ((t.redIAdd(r), 0 === this.x.cmp(t))) return !0;
      }
    }),
    (h.prototype.toP = h.prototype.normalize),
    (h.prototype.mixedAdd = h.prototype.add));
};
