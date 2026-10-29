// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(816217).assert;
  function d(e, t) {
    ((this.ec = e),
      (this.priv = null),
      (this.pub = null),
      t.priv && this._importPrivate(t.priv, t.privEnc),
      t.pub && this._importPublic(t.pub, t.pubEnc));
  }
  ((t.exports = d),
    (d.fromPublic = function (e, t, f) {
      return t instanceof d ? t : new d(e, { pub: t, pubEnc: f });
    }),
    (d.fromPrivate = function (e, t, f) {
      return t instanceof d ? t : new d(e, { priv: t, privEnc: f });
    }),
    (d.prototype.validate = function () {
      var e = this.getPublic();
      return e.isInfinity()
        ? { result: !1, reason: "Invalid public key" }
        : e.validate()
          ? e.mul(this.ec.curve.n).isInfinity()
            ? { result: !0, reason: null }
            : { result: !1, reason: "Public key * N != O" }
          : { result: !1, reason: "Public key is not a point" };
    }),
    (d.prototype.getPublic = function (e, t) {
      return ("string" == typeof e && ((t = e), (e = null)),
      this.pub || (this.pub = this.ec.g.mul(this.priv)),
      t)
        ? this.pub.encode(t, e)
        : this.pub;
    }),
    (d.prototype.getPrivate = function (e) {
      return "hex" === e ? this.priv.toString(16, 2) : this.priv;
    }),
    (d.prototype._importPrivate = function (e, t) {
      ((this.priv = new r(e, t || 16)),
        (this.priv = this.priv.umod(this.ec.curve.n)));
    }),
    (d.prototype._importPublic = function (e, t) {
      if (e.x || e.y) {
        ("mont" === this.ec.curve.type
          ? i(e.x, "Need x coordinate")
          : ("short" === this.ec.curve.type ||
              "edwards" === this.ec.curve.type) &&
            i(e.x && e.y, "Need both x and y coordinate"),
          (this.pub = this.ec.curve.point(e.x, e.y)));
        return;
      }
      this.pub = this.ec.curve.decodePoint(e, t);
    }),
    (d.prototype.derive = function (e) {
      return (
        e.validate() || i(e.validate(), "public point not validated"),
        e.mul(this.priv).getX()
      );
    }),
    (d.prototype.sign = function (e, t, f) {
      return this.ec.sign(e, this, t, f);
    }),
    (d.prototype.verify = function (e, t, f) {
      return this.ec.verify(e, t, this, void 0, f);
    }),
    (d.prototype.inspect = function () {
      return (
        "<Key priv: " +
        (this.priv && this.priv.toString(16, 2)) +
        " pub: " +
        (this.pub && this.pub.inspect()) +
        " >"
      );
    }));
};
