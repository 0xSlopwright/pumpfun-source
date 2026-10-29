// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(816217),
    d = i.assert,
    a = i.cachedProperty,
    n = i.parseBytes;
  function c(e, t) {
    ((this.eddsa = e),
      "object" != typeof t && (t = n(t)),
      Array.isArray(t) &&
        (d(t.length === 2 * e.encodingLength, "Signature has invalid size"),
        (t = {
          R: t.slice(0, e.encodingLength),
          S: t.slice(e.encodingLength),
        })),
      d(t.R && t.S, "Signature without R or S"),
      e.isPoint(t.R) && (this._R = t.R),
      t.S instanceof r && (this._S = t.S),
      (this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded),
      (this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded));
  }
  (a(c, "S", function () {
    return this.eddsa.decodeInt(this.Sencoded());
  }),
    a(c, "R", function () {
      return this.eddsa.decodePoint(this.Rencoded());
    }),
    a(c, "Rencoded", function () {
      return this.eddsa.encodePoint(this.R());
    }),
    a(c, "Sencoded", function () {
      return this.eddsa.encodeInt(this.S());
    }),
    (c.prototype.toBytes = function () {
      return this.Rencoded().concat(this.Sencoded());
    }),
    (c.prototype.toHex = function () {
      return i.encode(this.toBytes(), "hex").toUpperCase();
    }),
    (t.exports = c));
};
