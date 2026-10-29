// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(843831);
  function i(e) {
    return (
      ((e >>> 24) |
        ((e >>> 8) & 65280) |
        ((e << 8) & 0xff0000) |
        ((255 & e) << 24)) >>>
      0
    );
  }
  function d(e) {
    return 1 === e.length ? "0" + e : e;
  }
  function a(e) {
    if (7 === e.length) return "0" + e;
    if (6 === e.length) return "00" + e;
    if (5 === e.length) return "000" + e;
    if (4 === e.length) return "0000" + e;
    if (3 === e.length) return "00000" + e;
    else if (2 === e.length) return "000000" + e;
    else if (1 === e.length) return "0000000" + e;
    else return e;
  }
  ((f.inherits = e.r(896812)),
    (f.toArray = function (e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var f = [];
      if ("string" == typeof e)
        if (t) {
          if ("hex" === t)
            for (
              (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 &&
                (e = "0" + e),
                i = 0;
              i < e.length;
              i += 2
            )
              f.push(parseInt(e[i] + e[i + 1], 16));
        } else
          for (var r = 0, i = 0; i < e.length; i++) {
            var d,
              a,
              n = e.charCodeAt(i);
            n < 128
              ? (f[r++] = n)
              : (n < 2048
                  ? (f[r++] = (n >> 6) | 192)
                  : (((d = e),
                    (a = i),
                    (64512 & d.charCodeAt(a)) != 55296 ||
                    a < 0 ||
                    a + 1 >= d.length
                      ? 1
                      : (64512 & d.charCodeAt(a + 1)) != 56320)
                      ? (f[r++] = (n >> 12) | 224)
                      : ((n =
                          65536 +
                          ((1023 & n) << 10) +
                          (1023 & e.charCodeAt(++i))),
                        (f[r++] = (n >> 18) | 240),
                        (f[r++] = ((n >> 12) & 63) | 128)),
                    (f[r++] = ((n >> 6) & 63) | 128)),
                (f[r++] = (63 & n) | 128));
          }
      else for (i = 0; i < e.length; i++) f[i] = 0 | e[i];
      return f;
    }),
    (f.toHex = function (e) {
      for (var t = "", f = 0; f < e.length; f++) t += d(e[f].toString(16));
      return t;
    }),
    (f.htonl = i),
    (f.toHex32 = function (e, t) {
      for (var f = "", r = 0; r < e.length; r++) {
        var d = e[r];
        ("little" === t && (d = i(d)), (f += a(d.toString(16))));
      }
      return f;
    }),
    (f.zero2 = d),
    (f.zero8 = a),
    (f.join32 = function (e, t, f, i) {
      var d,
        a = f - t;
      r(a % 4 == 0);
      for (var n = Array(a / 4), c = 0, h = t; c < n.length; c++, h += 4)
        ((d =
          "big" === i
            ? (e[h] << 24) | (e[h + 1] << 16) | (e[h + 2] << 8) | e[h + 3]
            : (e[h + 3] << 24) | (e[h + 2] << 16) | (e[h + 1] << 8) | e[h]),
          (n[c] = d >>> 0));
      return n;
    }),
    (f.split32 = function (e, t) {
      for (
        var f = Array(4 * e.length), r = 0, i = 0;
        r < e.length;
        r++, i += 4
      ) {
        var d = e[r];
        "big" === t
          ? ((f[i] = d >>> 24),
            (f[i + 1] = (d >>> 16) & 255),
            (f[i + 2] = (d >>> 8) & 255),
            (f[i + 3] = 255 & d))
          : ((f[i + 3] = d >>> 24),
            (f[i + 2] = (d >>> 16) & 255),
            (f[i + 1] = (d >>> 8) & 255),
            (f[i] = 255 & d));
      }
      return f;
    }),
    (f.rotr32 = function (e, t) {
      return (e >>> t) | (e << (32 - t));
    }),
    (f.rotl32 = function (e, t) {
      return (e << t) | (e >>> (32 - t));
    }),
    (f.sum32 = function (e, t) {
      return (e + t) >>> 0;
    }),
    (f.sum32_3 = function (e, t, f) {
      return (e + t + f) >>> 0;
    }),
    (f.sum32_4 = function (e, t, f, r) {
      return (e + t + f + r) >>> 0;
    }),
    (f.sum32_5 = function (e, t, f, r, i) {
      return (e + t + f + r + i) >>> 0;
    }),
    (f.sum64 = function (e, t, f, r) {
      var i = e[t],
        d = (r + e[t + 1]) >>> 0;
      ((e[t] = (+(d < r) + f + i) >>> 0), (e[t + 1] = d));
    }),
    (f.sum64_hi = function (e, t, f, r) {
      return (+((t + r) >>> 0 < t) + e + f) >>> 0;
    }),
    (f.sum64_lo = function (e, t, f, r) {
      return (t + r) >>> 0;
    }),
    (f.sum64_4_hi = function (e, t, f, r, i, d, a, n) {
      var c,
        h = t;
      return (
        (e +
          f +
          i +
          a +
          (c =
            0 +
            +((h = (h + r) >>> 0) < t) +
            +((h = (h + d) >>> 0) < d) +
            +((h = (h + n) >>> 0) < n))) >>>
        0
      );
    }),
    (f.sum64_4_lo = function (e, t, f, r, i, d, a, n) {
      return (t + r + d + n) >>> 0;
    }),
    (f.sum64_5_hi = function (e, t, f, r, i, d, a, n, c, h) {
      var s,
        o = t;
      return (
        (e +
          f +
          i +
          a +
          c +
          (s =
            0 +
            +((o = (o + r) >>> 0) < t) +
            +((o = (o + d) >>> 0) < d) +
            +((o = (o + n) >>> 0) < n) +
            +((o = (o + h) >>> 0) < h))) >>>
        0
      );
    }),
    (f.sum64_5_lo = function (e, t, f, r, i, d, a, n, c, h) {
      return (t + r + d + n + h) >>> 0;
    }),
    (f.rotr64_hi = function (e, t, f) {
      return ((t << (32 - f)) | (e >>> f)) >>> 0;
    }),
    (f.rotr64_lo = function (e, t, f) {
      return ((e << (32 - f)) | (t >>> f)) >>> 0;
    }),
    (f.shr64_hi = function (e, t, f) {
      return e >>> f;
    }),
    (f.shr64_lo = function (e, t, f) {
      return ((e << (32 - f)) | (t >>> f)) >>> 0;
    }));
};
