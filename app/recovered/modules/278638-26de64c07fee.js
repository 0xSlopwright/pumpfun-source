// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(344377),
    d = e.r(245437),
    a = e.r(843831),
    n = r.sum32,
    c = r.sum32_4,
    h = r.sum32_5,
    s = d.ch32,
    o = d.maj32,
    u = d.s0_256,
    b = d.s1_256,
    l = d.g0_256,
    p = d.g1_256,
    m = i.BlockHash,
    v = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0xfc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x6ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
  function g() {
    if (!(this instanceof g)) return new g();
    (m.call(this),
      (this.h = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
        0x1f83d9ab, 0x5be0cd19,
      ]),
      (this.k = v),
      (this.W = Array(64)));
  }
  (r.inherits(g, m),
    (t.exports = g),
    (g.blockSize = 512),
    (g.outSize = 256),
    (g.hmacStrength = 192),
    (g.padLength = 64),
    (g.prototype._update = function (e, t) {
      for (var f = this.W, r = 0; r < 16; r++) f[r] = e[t + r];
      for (; r < f.length; r++)
        f[r] = c(p(f[r - 2]), f[r - 7], l(f[r - 15]), f[r - 16]);
      var i = this.h[0],
        d = this.h[1],
        m = this.h[2],
        v = this.h[3],
        g = this.h[4],
        y = this.h[5],
        x = this.h[6],
        M = this.h[7];
      for (a(this.k.length === f.length), r = 0; r < f.length; r++) {
        var w = h(M, b(g), s(g, y, x), this.k[r], f[r]),
          S = n(u(i), o(i, d, m));
        ((M = x),
          (x = y),
          (y = g),
          (g = n(v, w)),
          (v = m),
          (m = d),
          (d = i),
          (i = n(w, S)));
      }
      ((this.h[0] = n(this.h[0], i)),
        (this.h[1] = n(this.h[1], d)),
        (this.h[2] = n(this.h[2], m)),
        (this.h[3] = n(this.h[3], v)),
        (this.h[4] = n(this.h[4], g)),
        (this.h[5] = n(this.h[5], y)),
        (this.h[6] = n(this.h[6], x)),
        (this.h[7] = n(this.h[7], M)));
    }),
    (g.prototype._digest = function (e) {
      return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
    }));
};
