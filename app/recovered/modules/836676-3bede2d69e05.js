// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(816217),
    i = r.assert,
    d = r.parseBytes,
    a = r.cachedProperty;
  function n(e, t) {
    ((this.eddsa = e),
      (this._secret = d(t.secret)),
      e.isPoint(t.pub) ? (this._pub = t.pub) : (this._pubBytes = d(t.pub)));
  }
  ((n.fromPublic = function (e, t) {
    return t instanceof n ? t : new n(e, { pub: t });
  }),
    (n.fromSecret = function (e, t) {
      return t instanceof n ? t : new n(e, { secret: t });
    }),
    (n.prototype.secret = function () {
      return this._secret;
    }),
    a(n, "pubBytes", function () {
      return this.eddsa.encodePoint(this.pub());
    }),
    a(n, "pub", function () {
      return this._pubBytes
        ? this.eddsa.decodePoint(this._pubBytes)
        : this.eddsa.g.mul(this.priv());
    }),
    a(n, "privBytes", function () {
      var e = this.eddsa,
        t = this.hash(),
        f = e.encodingLength - 1,
        r = t.slice(0, e.encodingLength);
      return ((r[0] &= 248), (r[f] &= 127), (r[f] |= 64), r);
    }),
    a(n, "priv", function () {
      return this.eddsa.decodeInt(this.privBytes());
    }),
    a(n, "hash", function () {
      return this.eddsa.hash().update(this.secret()).digest();
    }),
    a(n, "messagePrefix", function () {
      return this.hash().slice(this.eddsa.encodingLength);
    }),
    (n.prototype.sign = function (e) {
      return (
        i(this._secret, "KeyPair can only verify"),
        this.eddsa.sign(e, this)
      );
    }),
    (n.prototype.verify = function (e, t) {
      return this.eddsa.verify(e, t, this);
    }),
    (n.prototype.getSecret = function (e) {
      return (
        i(this._secret, "KeyPair is public only"),
        r.encode(this.secret(), e)
      );
    }),
    (n.prototype.getPublic = function (e) {
      return r.encode(this.pubBytes(), e);
    }),
    (t.exports = n));
};
