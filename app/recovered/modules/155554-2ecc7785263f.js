// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(818451);
  function d() {
    if (!(this instanceof d)) return new d();
    (i.call(this),
      (this.h = [
        0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507, 0x9159015a, 0x3070dd17,
        0x152fecd8, 0xf70e5939, 0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511,
        0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4,
      ]));
  }
  (r.inherits(d, i),
    (t.exports = d),
    (d.blockSize = 1024),
    (d.outSize = 384),
    (d.hmacStrength = 192),
    (d.padLength = 128),
    (d.prototype._digest = function (e) {
      return "hex" === e
        ? r.toHex32(this.h.slice(0, 12), "big")
        : r.split32(this.h.slice(0, 12), "big");
    }));
};
