// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(344377),
    d = r.rotl32,
    a = r.sum32,
    n = r.sum32_3,
    c = r.sum32_4,
    h = i.BlockHash;
  function s() {
    if (!(this instanceof s)) return new s();
    (h.call(this),
      (this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]),
      (this.endian = "little"));
  }
  function o(e, t, f, r) {
    return e <= 15
      ? t ^ f ^ r
      : e <= 31
        ? (t & f) | (~t & r)
        : e <= 47
          ? (t | ~f) ^ r
          : e <= 63
            ? (t & r) | (f & ~r)
            : t ^ (f | ~r);
  }
  (r.inherits(s, h),
    (f.ripemd160 = s),
    (s.blockSize = 512),
    (s.outSize = 160),
    (s.hmacStrength = 192),
    (s.padLength = 64),
    (s.prototype._update = function (e, t) {
      for (
        var f = this.h[0],
          r = this.h[1],
          i = this.h[2],
          h = this.h[3],
          s = this.h[4],
          m = f,
          v = r,
          g = i,
          y = h,
          x = s,
          M = 0;
        M < 80;
        M++
      ) {
        var w,
          S,
          _ = a(
            d(
              c(
                f,
                o(M, r, i, h),
                e[u[M] + t],
                (w = M) <= 15
                  ? 0
                  : w <= 31
                    ? 0x5a827999
                    : w <= 47
                      ? 0x6ed9eba1
                      : w <= 63
                        ? 0x8f1bbcdc
                        : 0xa953fd4e,
              ),
              l[M],
            ),
            s,
          );
        ((f = s),
          (s = h),
          (h = d(i, 10)),
          (i = r),
          (r = _),
          (_ = a(
            d(
              c(
                m,
                o(79 - M, v, g, y),
                e[b[M] + t],
                (S = M) <= 15
                  ? 0x50a28be6
                  : S <= 31
                    ? 0x5c4dd124
                    : S <= 47
                      ? 0x6d703ef3
                      : 0x7a6d76e9 * !!(S <= 63),
              ),
              p[M],
            ),
            x,
          )),
          (m = x),
          (x = y),
          (y = d(g, 10)),
          (g = v),
          (v = _));
      }
      ((_ = n(this.h[1], i, y)),
        (this.h[1] = n(this.h[2], h, x)),
        (this.h[2] = n(this.h[3], s, m)),
        (this.h[3] = n(this.h[4], f, v)),
        (this.h[4] = n(this.h[0], r, g)),
        (this.h[0] = _));
    }),
    (s.prototype._digest = function (e) {
      return "hex" === e
        ? r.toHex32(this.h, "little")
        : r.split32(this.h, "little");
    }));
  var u = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6,
      15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6,
      13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0,
      5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ],
    b = [
      5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13,
      5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2,
      10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12,
      15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ],
    l = [
      11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11,
      9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8,
      13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5,
      12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
    ],
    p = [
      8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12,
      8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13,
      5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15,
      8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
    ];
};
