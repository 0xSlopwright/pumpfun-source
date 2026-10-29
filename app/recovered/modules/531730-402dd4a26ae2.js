// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(344377),
    d = e.r(245437),
    a = r.rotl32,
    n = r.sum32,
    c = r.sum32_5,
    h = d.ft_1,
    s = i.BlockHash,
    o = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  function u() {
    if (!(this instanceof u)) return new u();
    (s.call(this),
      (this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]),
      (this.W = Array(80)));
  }
  (r.inherits(u, s),
    (t.exports = u),
    (u.blockSize = 512),
    (u.outSize = 160),
    (u.hmacStrength = 80),
    (u.padLength = 64),
    (u.prototype._update = function (e, t) {
      for (var f = this.W, r = 0; r < 16; r++) f[r] = e[t + r];
      for (; r < f.length; r++)
        f[r] = a(f[r - 3] ^ f[r - 8] ^ f[r - 14] ^ f[r - 16], 1);
      var i = this.h[0],
        d = this.h[1],
        s = this.h[2],
        u = this.h[3],
        b = this.h[4];
      for (r = 0; r < f.length; r++) {
        var l = ~~(r / 20),
          p = c(a(i, 5), h(l, d, s, u), b, f[r], o[l]);
        ((b = u), (u = s), (s = a(d, 30)), (d = i), (i = p));
      }
      ((this.h[0] = n(this.h[0], i)),
        (this.h[1] = n(this.h[1], d)),
        (this.h[2] = n(this.h[2], s)),
        (this.h[3] = n(this.h[3], u)),
        (this.h[4] = n(this.h[4], b)));
    }),
    (u.prototype._digest = function (e) {
      return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
    }));
};
