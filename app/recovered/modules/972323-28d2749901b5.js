// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(278638);
  function d() {
    if (!(this instanceof d)) return new d();
    (i.call(this),
      (this.h = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511,
        0x64f98fa7, 0xbefa4fa4,
      ]));
  }
  (r.inherits(d, i),
    (t.exports = d),
    (d.blockSize = 512),
    (d.outSize = 224),
    (d.hmacStrength = 192),
    (d.padLength = 64),
    (d.prototype._digest = function (e) {
      return "hex" === e
        ? r.toHex32(this.h.slice(0, 7), "big")
        : r.split32(this.h.slice(0, 7), "big");
    }));
};
