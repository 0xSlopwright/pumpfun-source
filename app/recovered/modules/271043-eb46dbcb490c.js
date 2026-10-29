// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(896812),
    d = e.r(990249),
    a = e.r(816217);
  function n(e) {
    (d.call(this, "mont", e),
      (this.a = new r(e.a, 16).toRed(this.red)),
      (this.b = new r(e.b, 16).toRed(this.red)),
      (this.i4 = new r(4).toRed(this.red).redInvm()),
      (this.two = new r(2).toRed(this.red)),
      (this.a24 = this.i4.redMul(this.a.redAdd(this.two))));
  }
  function c(e, t, f) {
    (d.BasePoint.call(this, e, "projective"),
      null === t && null === f
        ? ((this.x = this.curve.one), (this.z = this.curve.zero))
        : ((this.x = new r(t, 16)),
          (this.z = new r(f, 16)),
          this.x.red || (this.x = this.x.toRed(this.curve.red)),
          this.z.red || (this.z = this.z.toRed(this.curve.red))));
  }
  (i(n, d),
    (t.exports = n),
    (n.prototype.validate = function (e) {
      var t = e.normalize().x,
        f = t.redSqr(),
        r = f.redMul(t).redAdd(f.redMul(this.a)).redAdd(t);
      return 0 === r.redSqrt().redSqr().cmp(r);
    }),
    i(c, d.BasePoint),
    (n.prototype.decodePoint = function (e, t) {
      return this.point(a.toArray(e, t), 1);
    }),
    (n.prototype.point = function (e, t) {
      return new c(this, e, t);
    }),
    (n.prototype.pointFromJSON = function (e) {
      return c.fromJSON(this, e);
    }),
    (c.prototype.precompute = function () {}),
    (c.prototype._encode = function () {
      return this.getX().toArray("be", this.curve.p.byteLength());
    }),
    (c.fromJSON = function (e, t) {
      return new c(e, t[0], t[1] || e.one);
    }),
    (c.prototype.inspect = function () {
      return this.isInfinity()
        ? "<EC Point Infinity>"
        : "<EC Point x: " +
            this.x.fromRed().toString(16, 2) +
            " z: " +
            this.z.fromRed().toString(16, 2) +
            ">";
    }),
    (c.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0);
    }),
    (c.prototype.dbl = function () {
      var e = this.x.redAdd(this.z).redSqr(),
        t = this.x.redSub(this.z).redSqr(),
        f = e.redSub(t),
        r = e.redMul(t),
        i = f.redMul(t.redAdd(this.curve.a24.redMul(f)));
      return this.curve.point(r, i);
    }),
    (c.prototype.add = function () {
      throw Error("Not supported on Montgomery curve");
    }),
    (c.prototype.diffAdd = function (e, t) {
      var f = this.x.redAdd(this.z),
        r = this.x.redSub(this.z),
        i = e.x.redAdd(e.z),
        d = e.x.redSub(e.z).redMul(f),
        a = i.redMul(r),
        n = t.z.redMul(d.redAdd(a).redSqr()),
        c = t.x.redMul(d.redISub(a).redSqr());
      return this.curve.point(n, c);
    }),
    (c.prototype.mul = function (e) {
      for (
        var t = e.clone(), f = this, r = this.curve.point(null, null), i = [];
        0 !== t.cmpn(0);
        t.iushrn(1)
      )
        i.push(t.andln(1));
      for (var d = i.length - 1; d >= 0; d--)
        0 === i[d]
          ? ((f = f.diffAdd(r, this)), (r = r.dbl()))
          : ((r = f.diffAdd(r, this)), (f = f.dbl()));
      return r;
    }),
    (c.prototype.mulAdd = function () {
      throw Error("Not supported on Montgomery curve");
    }),
    (c.prototype.jumlAdd = function () {
      throw Error("Not supported on Montgomery curve");
    }),
    (c.prototype.eq = function (e) {
      return 0 === this.getX().cmp(e.getX());
    }),
    (c.prototype.normalize = function () {
      return (
        (this.x = this.x.redMul(this.z.redInvm())),
        (this.z = this.curve.one),
        this
      );
    }),
    (c.prototype.getX = function () {
      return (this.normalize(), this.x.fromRed());
    }));
};
