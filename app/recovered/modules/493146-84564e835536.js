// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(223336),
    i = e.r(454434),
    d = e.r(816217),
    a = d.assert,
    n = d.parseBytes,
    c = e.r(836676),
    h = e.r(410025);
  function s(e) {
    if (
      (a("ed25519" === e, "only tested with ed25519 so far"),
      !(this instanceof s))
    )
      return new s(e);
    ((e = i[e].curve),
      (this.curve = e),
      (this.g = e.g),
      this.g.precompute(e.n.bitLength() + 1),
      (this.pointClass = e.point().constructor),
      (this.encodingLength = Math.ceil(e.n.bitLength() / 8)),
      (this.hash = r.sha512));
  }
  ((t.exports = s),
    (s.prototype.sign = function (e, t) {
      e = n(e);
      var f = this.keyFromSecret(t),
        r = this.hashInt(f.messagePrefix(), e),
        i = this.g.mul(r),
        d = this.encodePoint(i),
        a = this.hashInt(d, f.pubBytes(), e).mul(f.priv()),
        c = r.add(a).umod(this.curve.n);
      return this.makeSignature({ R: i, S: c, Rencoded: d });
    }),
    (s.prototype.verify = function (e, t, f) {
      if (
        ((e = n(e)),
        (t = this.makeSignature(t)).S().gte(t.eddsa.curve.n) || t.S().isNeg())
      )
        return !1;
      var r = this.keyFromPublic(f),
        i = this.hashInt(t.Rencoded(), r.pubBytes(), e),
        d = this.g.mul(t.S());
      return t.R().add(r.pub().mul(i)).eq(d);
    }),
    (s.prototype.hashInt = function () {
      for (var e = this.hash(), t = 0; t < arguments.length; t++)
        e.update(arguments[t]);
      return d.intFromLE(e.digest()).umod(this.curve.n);
    }),
    (s.prototype.keyFromPublic = function (e) {
      return c.fromPublic(this, e);
    }),
    (s.prototype.keyFromSecret = function (e) {
      return c.fromSecret(this, e);
    }),
    (s.prototype.makeSignature = function (e) {
      return e instanceof h ? e : new h(this, e);
    }),
    (s.prototype.encodePoint = function (e) {
      var t = e.getY().toArray("le", this.encodingLength);
      return ((t[this.encodingLength - 1] |= 128 * !!e.getX().isOdd()), t);
    }),
    (s.prototype.decodePoint = function (e) {
      var t = (e = d.parseBytes(e)).length - 1,
        f = e.slice(0, t).concat(-129 & e[t]),
        r = (128 & e[t]) != 0,
        i = d.intFromLE(f);
      return this.curve.pointFromY(i, r);
    }),
    (s.prototype.encodeInt = function (e) {
      return e.toArray("le", this.encodingLength);
    }),
    (s.prototype.decodeInt = function (e) {
      return d.intFromLE(e);
    }),
    (s.prototype.isPoint = function (e) {
      return e instanceof this.pointClass;
    }));
};
