// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    r,
    i,
    n = new Uint8Array(16);
  function s() {
    if (
      !e &&
      !(e =
        ("u" > typeof crypto &&
          crypto.getRandomValues &&
          crypto.getRandomValues.bind(crypto)) ||
        ("u" > typeof msCrypto &&
          "function" == typeof msCrypto.getRandomValues &&
          msCrypto.getRandomValues.bind(msCrypto)))
    )
      throw Error(
        "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
      );
    return e(n);
  }
  let o =
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
    a = function (t) {
      return "string" == typeof t && o.test(t);
    };
  for (var u = [], c = 0; c < 256; ++c)
    u.push((c + 256).toString(16).substr(1));
  let l = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
      r = (
        u[t[e + 0]] +
        u[t[e + 1]] +
        u[t[e + 2]] +
        u[t[e + 3]] +
        "-" +
        u[t[e + 4]] +
        u[t[e + 5]] +
        "-" +
        u[t[e + 6]] +
        u[t[e + 7]] +
        "-" +
        u[t[e + 8]] +
        u[t[e + 9]] +
        "-" +
        u[t[e + 10]] +
        u[t[e + 11]] +
        u[t[e + 12]] +
        u[t[e + 13]] +
        u[t[e + 14]] +
        u[t[e + 15]]
      ).toLowerCase();
    if (!a(r)) throw TypeError("Stringified UUID is invalid");
    return r;
  };
  var h = 0,
    f = 0;
  let d = function (t) {
    if (!a(t)) throw TypeError("Invalid UUID");
    var e,
      r = new Uint8Array(16);
    return (
      (r[0] = (e = parseInt(t.slice(0, 8), 16)) >>> 24),
      (r[1] = (e >>> 16) & 255),
      (r[2] = (e >>> 8) & 255),
      (r[3] = 255 & e),
      (r[4] = (e = parseInt(t.slice(9, 13), 16)) >>> 8),
      (r[5] = 255 & e),
      (r[6] = (e = parseInt(t.slice(14, 18), 16)) >>> 8),
      (r[7] = 255 & e),
      (r[8] = (e = parseInt(t.slice(19, 23), 16)) >>> 8),
      (r[9] = 255 & e),
      (r[10] = ((e = parseInt(t.slice(24, 36), 16)) / 0x10000000000) & 255),
      (r[11] = (e / 0x100000000) & 255),
      (r[12] = (e >>> 24) & 255),
      (r[13] = (e >>> 16) & 255),
      (r[14] = (e >>> 8) & 255),
      (r[15] = 255 & e),
      r
    );
  };
  function p(t, e, r) {
    function i(t, i, n, s) {
      if (
        ("string" == typeof t &&
          (t = (function (t) {
            t = unescape(encodeURIComponent(t));
            for (var e = [], r = 0; r < t.length; ++r) e.push(t.charCodeAt(r));
            return e;
          })(t)),
        "string" == typeof i && (i = d(i)),
        16 !== i.length)
      )
        throw TypeError(
          "Namespace must be array-like (16 iterable integer values, 0-255)",
        );
      var o = new Uint8Array(16 + t.length);
      if (
        (o.set(i),
        o.set(t, i.length),
        ((o = r(o))[6] = (15 & o[6]) | e),
        (o[8] = (63 & o[8]) | 128),
        n)
      ) {
        s = s || 0;
        for (var a = 0; a < 16; ++a) n[s + a] = o[a];
        return n;
      }
      return l(o);
    }
    try {
      i.name = t;
    } catch (t) {}
    return (
      (i.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      (i.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
      i
    );
  }
  function g(t) {
    return (((t + 64) >>> 9) << 4) + 14 + 1;
  }
  function m(t, e) {
    var r = (65535 & t) + (65535 & e);
    return (((t >> 16) + (e >> 16) + (r >> 16)) << 16) | (65535 & r);
  }
  function y(t, e, r, i, n, s) {
    var o;
    return m(((o = m(m(e, t), m(i, s))) << n) | (o >>> (32 - n)), r);
  }
  function b(t, e, r, i, n, s, o) {
    return y((e & r) | (~e & i), t, e, n, s, o);
  }
  function w(t, e, r, i, n, s, o) {
    return y((e & i) | (r & ~i), t, e, n, s, o);
  }
  function k(t, e, r, i, n, s, o) {
    return y(e ^ r ^ i, t, e, n, s, o);
  }
  function v(t, e, r, i, n, s, o) {
    return y(r ^ (e | ~i), t, e, n, s, o);
  }
  var S = p("v3", 48, function (t) {
    if ("string" == typeof t) {
      var e = unescape(encodeURIComponent(t));
      t = new Uint8Array(e.length);
      for (var r = 0; r < e.length; ++r) t[r] = e.charCodeAt(r);
    }
    return (function (t) {
      for (
        var e = [], r = 32 * t.length, i = "0123456789abcdef", n = 0;
        n < r;
        n += 8
      ) {
        var s = (t[n >> 5] >>> n % 32) & 255,
          o = parseInt(i.charAt((s >>> 4) & 15) + i.charAt(15 & s), 16);
        e.push(o);
      }
      return e;
    })(
      (function (t, e) {
        ((t[e >> 5] |= 128 << e % 32), (t[g(e) - 1] = e));
        for (
          var r = 0x67452301,
            i = -0x10325477,
            n = -0x67452302,
            s = 0x10325476,
            o = 0;
          o < t.length;
          o += 16
        ) {
          var a = r,
            u = i,
            c = n,
            l = s;
          ((r = b(r, i, n, s, t[o], 7, -0x28955b88)),
            (s = b(s, r, i, n, t[o + 1], 12, -0x173848aa)),
            (n = b(n, s, r, i, t[o + 2], 17, 0x242070db)),
            (i = b(i, n, s, r, t[o + 3], 22, -0x3e423112)),
            (r = b(r, i, n, s, t[o + 4], 7, -0xa83f051)),
            (s = b(s, r, i, n, t[o + 5], 12, 0x4787c62a)),
            (n = b(n, s, r, i, t[o + 6], 17, -0x57cfb9ed)),
            (i = b(i, n, s, r, t[o + 7], 22, -0x2b96aff)),
            (r = b(r, i, n, s, t[o + 8], 7, 0x698098d8)),
            (s = b(s, r, i, n, t[o + 9], 12, -0x74bb0851)),
            (n = b(n, s, r, i, t[o + 10], 17, -42063)),
            (i = b(i, n, s, r, t[o + 11], 22, -0x76a32842)),
            (r = b(r, i, n, s, t[o + 12], 7, 0x6b901122)),
            (s = b(s, r, i, n, t[o + 13], 12, -0x2678e6d)),
            (n = b(n, s, r, i, t[o + 14], 17, -0x5986bc72)),
            (i = b(i, n, s, r, t[o + 15], 22, 0x49b40821)),
            (r = w(r, i, n, s, t[o + 1], 5, -0x9e1da9e)),
            (s = w(s, r, i, n, t[o + 6], 9, -0x3fbf4cc0)),
            (n = w(n, s, r, i, t[o + 11], 14, 0x265e5a51)),
            (i = w(i, n, s, r, t[o], 20, -0x16493856)),
            (r = w(r, i, n, s, t[o + 5], 5, -0x29d0efa3)),
            (s = w(s, r, i, n, t[o + 10], 9, 0x2441453)),
            (n = w(n, s, r, i, t[o + 15], 14, -0x275e197f)),
            (i = w(i, n, s, r, t[o + 4], 20, -0x182c0438)),
            (r = w(r, i, n, s, t[o + 9], 5, 0x21e1cde6)),
            (s = w(s, r, i, n, t[o + 14], 9, -0x3cc8f82a)),
            (n = w(n, s, r, i, t[o + 3], 14, -0xb2af279)),
            (i = w(i, n, s, r, t[o + 8], 20, 0x455a14ed)),
            (r = w(r, i, n, s, t[o + 13], 5, -0x561c16fb)),
            (s = w(s, r, i, n, t[o + 2], 9, -0x3105c08)),
            (n = w(n, s, r, i, t[o + 7], 14, 0x676f02d9)),
            (i = w(i, n, s, r, t[o + 12], 20, -0x72d5b376)),
            (r = k(r, i, n, s, t[o + 5], 4, -378558)),
            (s = k(s, r, i, n, t[o + 8], 11, -0x788e097f)),
            (n = k(n, s, r, i, t[o + 11], 16, 0x6d9d6122)),
            (i = k(i, n, s, r, t[o + 14], 23, -0x21ac7f4)),
            (r = k(r, i, n, s, t[o + 1], 4, -0x5b4115bc)),
            (s = k(s, r, i, n, t[o + 4], 11, 0x4bdecfa9)),
            (n = k(n, s, r, i, t[o + 7], 16, -0x944b4a0)),
            (i = k(i, n, s, r, t[o + 10], 23, -0x41404390)),
            (r = k(r, i, n, s, t[o + 13], 4, 0x289b7ec6)),
            (s = k(s, r, i, n, t[o], 11, -0x155ed806)),
            (n = k(n, s, r, i, t[o + 3], 16, -0x2b10cf7b)),
            (i = k(i, n, s, r, t[o + 6], 23, 0x4881d05)),
            (r = k(r, i, n, s, t[o + 9], 4, -0x262b2fc7)),
            (s = k(s, r, i, n, t[o + 12], 11, -0x1924661b)),
            (n = k(n, s, r, i, t[o + 15], 16, 0x1fa27cf8)),
            (i = k(i, n, s, r, t[o + 2], 23, -0x3b53a99b)),
            (r = v(r, i, n, s, t[o], 6, -0xbd6ddbc)),
            (s = v(s, r, i, n, t[o + 7], 10, 0x432aff97)),
            (n = v(n, s, r, i, t[o + 14], 15, -0x546bdc59)),
            (i = v(i, n, s, r, t[o + 5], 21, -0x36c5fc7)),
            (r = v(r, i, n, s, t[o + 12], 6, 0x655b59c3)),
            (s = v(s, r, i, n, t[o + 3], 10, -0x70f3336e)),
            (n = v(n, s, r, i, t[o + 10], 15, -1051523)),
            (i = v(i, n, s, r, t[o + 1], 21, -0x7a7ba22f)),
            (r = v(r, i, n, s, t[o + 8], 6, 0x6fa87e4f)),
            (s = v(s, r, i, n, t[o + 15], 10, -0x1d31920)),
            (n = v(n, s, r, i, t[o + 6], 15, -0x5cfebcec)),
            (i = v(i, n, s, r, t[o + 13], 21, 0x4e0811a1)),
            (r = v(r, i, n, s, t[o + 4], 6, -0x8ac817e)),
            (s = v(s, r, i, n, t[o + 11], 10, -0x42c50dcb)),
            (n = v(n, s, r, i, t[o + 2], 15, 0x2ad7d2bb)),
            (i = v(i, n, s, r, t[o + 9], 21, -0x14792c6f)),
            (r = m(r, a)),
            (i = m(i, u)),
            (n = m(n, c)),
            (s = m(s, l)));
        }
        return [r, i, n, s];
      })(
        (function (t) {
          if (0 === t.length) return [];
          for (
            var e = 8 * t.length, r = new Uint32Array(g(e)), i = 0;
            i < e;
            i += 8
          )
            r[i >> 5] |= (255 & t[i / 8]) << i % 32;
          return r;
        })(t),
        8 * t.length,
      ),
    );
  });
  function _(t, e) {
    return (t << e) | (t >>> (32 - e));
  }
  var I = p("v5", 80, function (t) {
    var e = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6],
      r = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    if ("string" == typeof t) {
      var i = unescape(encodeURIComponent(t));
      t = [];
      for (var n = 0; n < i.length; ++n) t.push(i.charCodeAt(n));
    } else Array.isArray(t) || (t = Array.prototype.slice.call(t));
    t.push(128);
    for (
      var s = Math.ceil((t.length / 4 + 2) / 16), o = Array(s), a = 0;
      a < s;
      ++a
    ) {
      for (var u = new Uint32Array(16), c = 0; c < 16; ++c)
        u[c] =
          (t[64 * a + 4 * c] << 24) |
          (t[64 * a + 4 * c + 1] << 16) |
          (t[64 * a + 4 * c + 2] << 8) |
          t[64 * a + 4 * c + 3];
      o[a] = u;
    }
    ((o[s - 1][14] = ((t.length - 1) * 8) / 0x100000000),
      (o[s - 1][14] = Math.floor(o[s - 1][14])),
      (o[s - 1][15] = ((t.length - 1) * 8) | 0));
    for (var l = 0; l < s; ++l) {
      for (var h = new Uint32Array(80), f = 0; f < 16; ++f) h[f] = o[l][f];
      for (var d = 16; d < 80; ++d)
        h[d] = _(h[d - 3] ^ h[d - 8] ^ h[d - 14] ^ h[d - 16], 1);
      for (
        var p = r[0], g = r[1], m = r[2], y = r[3], b = r[4], w = 0;
        w < 80;
        ++w
      ) {
        var k = Math.floor(w / 20),
          v =
            (_(p, 5) +
              (function (t, e, r, i) {
                switch (t) {
                  case 0:
                    return (e & r) ^ (~e & i);
                  case 1:
                  case 3:
                    return e ^ r ^ i;
                  case 2:
                    return (e & r) ^ (e & i) ^ (r & i);
                }
              })(k, g, m, y) +
              b +
              e[k] +
              h[w]) >>>
            0;
        ((b = y), (y = m), (m = _(g, 30) >>> 0), (g = p), (p = v));
      }
      ((r[0] = (r[0] + p) >>> 0),
        (r[1] = (r[1] + g) >>> 0),
        (r[2] = (r[2] + m) >>> 0),
        (r[3] = (r[3] + y) >>> 0),
        (r[4] = (r[4] + b) >>> 0));
    }
    return [
      (r[0] >> 24) & 255,
      (r[0] >> 16) & 255,
      (r[0] >> 8) & 255,
      255 & r[0],
      (r[1] >> 24) & 255,
      (r[1] >> 16) & 255,
      (r[1] >> 8) & 255,
      255 & r[1],
      (r[2] >> 24) & 255,
      (r[2] >> 16) & 255,
      (r[2] >> 8) & 255,
      255 & r[2],
      (r[3] >> 24) & 255,
      (r[3] >> 16) & 255,
      (r[3] >> 8) & 255,
      255 & r[3],
      (r[4] >> 24) & 255,
      (r[4] >> 16) & 255,
      (r[4] >> 8) & 255,
      255 & r[4],
    ];
  });
  t.s(
    [
      "NIL",
      0,
      "00000000-0000-0000-0000-000000000000",
      "parse",
      0,
      d,
      "stringify",
      0,
      l,
      "v1",
      0,
      function (t, e, n) {
        var o = (e && n) || 0,
          a = e || Array(16),
          u = (t = t || {}).node || r,
          c = void 0 !== t.clockseq ? t.clockseq : i;
        if (null == u || null == c) {
          var d = t.random || (t.rng || s)();
          (null == u && (u = r = [1 | d[0], d[1], d[2], d[3], d[4], d[5]]),
            null == c && (c = i = ((d[6] << 8) | d[7]) & 16383));
        }
        var p = void 0 !== t.msecs ? t.msecs : Date.now(),
          g = void 0 !== t.nsecs ? t.nsecs : f + 1,
          m = p - h + (g - f) / 1e4;
        if (
          (m < 0 && void 0 === t.clockseq && (c = (c + 1) & 16383),
          (m < 0 || p > h) && void 0 === t.nsecs && (g = 0),
          g >= 1e4)
        )
          throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        ((h = p), (f = g), (i = c));
        var y = ((0xfffffff & (p += 122192928e5)) * 1e4 + g) % 0x100000000;
        ((a[o++] = (y >>> 24) & 255),
          (a[o++] = (y >>> 16) & 255),
          (a[o++] = (y >>> 8) & 255),
          (a[o++] = 255 & y));
        var b = ((p / 0x100000000) * 1e4) & 0xfffffff;
        ((a[o++] = (b >>> 8) & 255),
          (a[o++] = 255 & b),
          (a[o++] = ((b >>> 24) & 15) | 16),
          (a[o++] = (b >>> 16) & 255),
          (a[o++] = (c >>> 8) | 128),
          (a[o++] = 255 & c));
        for (var w = 0; w < 6; ++w) a[o + w] = u[w];
        return e || l(a);
      },
      "v3",
      0,
      S,
      "v4",
      0,
      function (t, e, r) {
        var i = (t = t || {}).random || (t.rng || s)();
        if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), e)) {
          r = r || 0;
          for (var n = 0; n < 16; ++n) e[r + n] = i[n];
          return e;
        }
        return l(i);
      },
      "v5",
      0,
      I,
      "validate",
      0,
      a,
      "version",
      0,
      function (t) {
        if (!a(t)) throw TypeError("Invalid UUID");
        return parseInt(t.substr(14, 1), 16);
      },
    ],
    539451,
  );
};
