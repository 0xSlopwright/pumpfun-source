// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386);
  function o(e) {
    function t(e, t) {
      (Error.captureStackTrace &&
        Error.captureStackTrace(this, this.constructor),
        (this.message = e),
        (this.code = t));
    }
    return (
      (t.prototype = Error()),
      (t.prototype.name = e),
      (t.prototype.constructor = t),
      t
    );
  }
  let i = o("LaunchDarklyUnexpectedResponseError"),
    a = o("LaunchDarklyInvalidEnvironmentIdError"),
    l = o("LaunchDarklyInvalidUserError"),
    s = o("LaunchDarklyInvalidEventKeyError"),
    u = o("LaunchDarklyInvalidArgumentError"),
    c = o("LaunchDarklyFlagFetchError");
  for (
    var f = {
        LDUnexpectedResponseError: i,
        LDInvalidEnvironmentIdError: a,
        LDInvalidUserError: l,
        LDInvalidEventKeyError: s,
        LDInvalidArgumentError: u,
        LDInvalidDataError: o("LaunchDarklyInvalidDataError"),
        LDFlagFetchError: c,
        LDTimeoutError: o("LaunchDarklyTimeoutError"),
        isHttpErrorRecoverable: function (e) {
          return !(e >= 400 && e < 500) || 400 === e || 408 === e || 429 === e;
        },
      },
      d = [],
      p = [],
      g =
        ("u" > typeof Uint8Array && Uint8Array,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
      v = 0;
    v < 64;
    ++v
  )
    ((d[v] = g[v]), (p[g.charCodeAt(v)] = v));
  ((p[45] = 62), (p[95] = 63));
  var m = function (e) {
      for (
        var t, n = e.length, r = n % 3, o = [], i = 0, a = n - r;
        i < a;
        i += 16383
      )
        o.push(
          (function (e, t, n) {
            for (var r, o = [], i = t; i < n; i += 3)
              o.push(
                d[
                  ((r =
                    ((e[i] << 16) & 0xff0000) +
                    ((e[i + 1] << 8) & 65280) +
                    (255 & e[i + 2])) >>
                    18) &
                    63
                ] +
                  d[(r >> 12) & 63] +
                  d[(r >> 6) & 63] +
                  d[63 & r],
              );
            return o.join("");
          })(e, i, i + 16383 > a ? a : i + 16383),
        );
      return (
        1 === r
          ? o.push(d[(t = e[n - 1]) >> 2] + d[(t << 4) & 63] + "==")
          : 2 === r &&
            o.push(
              d[(t = (e[n - 2] << 8) + e[n - 1]) >> 10] +
                d[(t >> 4) & 63] +
                d[(t << 2) & 63] +
                "=",
            ),
        o.join("")
      );
    },
    h = Array.isArray,
    y = Object.keys,
    b = Object.prototype.hasOwnProperty,
    w = function e(t, n) {
      if (t === n) return !0;
      if (t && n && "object" == typeof t && "object" == typeof n) {
        var r,
          o,
          i,
          a = h(t),
          l = h(n);
        if (a && l) {
          if ((o = t.length) != n.length) return !1;
          for (r = o; 0 != r--; ) if (!e(t[r], n[r])) return !1;
          return !0;
        }
        if (a != l) return !1;
        var s = t instanceof Date,
          u = n instanceof Date;
        if (s != u) return !1;
        if (s && u) return t.getTime() == n.getTime();
        var c = t instanceof RegExp,
          f = n instanceof RegExp;
        if (c != f) return !1;
        if (c && f) return t.toString() == n.toString();
        var d = y(t);
        if ((o = d.length) !== y(n).length) return !1;
        for (r = o; 0 != r--; ) if (!b.call(n, d[r])) return !1;
        for (r = o; 0 != r--; ) if (!e(t[(i = d[r])], n[i])) return !1;
        return !0;
      }
      return t != t && n != n;
    };
  let x = [
    "key",
    "ip",
    "country",
    "email",
    "firstName",
    "lastName",
    "avatar",
    "name",
  ];
  function k(e) {
    return m(
      (function (e) {
        let t = [];
        for (let n = 0; n < e.length; n++) t.push(e.charCodeAt(n));
        return t;
      })(unescape(encodeURIComponent(e))),
    );
  }
  function E(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  var O,
    S = {
      appendUrlPath: function (e, t) {
        return (
          (e.endsWith("/") ? e.substring(0, e.length - 1) : e) +
          (t.startsWith("/") ? "" : "/") +
          t
        );
      },
      base64URLEncode: function (e) {
        return k(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      },
      btoa: k,
      clone: function (e) {
        return JSON.parse(JSON.stringify(e));
      },
      deepEquals: function (e, t) {
        return w(e, t);
      },
      extend: function (...e) {
        return e.reduce((e, t) => ({ ...e, ...t }), {});
      },
      getLDUserAgentString: function (e) {
        let t = e.version || "?";
        return e.userAgent + "/" + t;
      },
      objectHasOwnProperty: E,
      onNextTick: function (e) {
        setTimeout(e, 0);
      },
      sanitizeContext: function (e) {
        let t;
        return e
          ? ((null !== e.kind && void 0 !== e.kind) ||
              x.forEach((n) => {
                let r = e[n];
                void 0 !== r &&
                  "string" != typeof r &&
                  ((t = t || { ...e })[n] = String(r));
              }),
            t || e)
          : e;
      },
      transformValuesToVersionedValues: function (e) {
        let t = {};
        for (let n in e) E(e, n) && (t[n] = { value: e[n], version: 0 });
        return t;
      },
      transformVersionedValuesToValues: function (e) {
        let t = {};
        for (let n in e) E(e, n) && (t[n] = e[n].value);
        return t;
      },
      wrapPromiseCallback: function (e, t) {
        let n = e.then(
          (e) => (
            t &&
              setTimeout(() => {
                t(null, e);
              }, 0),
            e
          ),
          (e) => {
            if (!t) return Promise.reject(e);
            setTimeout(() => {
              t(e, null);
            }, 0);
          },
        );
        return t ? void 0 : n;
      },
      once: function (e) {
        let t,
          n = !1;
        return function (...r) {
          return (n || ((n = !0), (t = e.apply(this, r))), t);
        };
      },
    },
    C = new Uint8Array(16);
  function P() {
    if (
      !O &&
      !(O =
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
    return O(C);
  }
  var D =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  function I(e) {
    return "string" == typeof e && D.test(e);
  }
  for (var j, F, T = [], R = 0; R < 256; ++R)
    T.push((R + 256).toString(16).substr(1));
  function L(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
      n = (
        T[e[t + 0]] +
        T[e[t + 1]] +
        T[e[t + 2]] +
        T[e[t + 3]] +
        "-" +
        T[e[t + 4]] +
        T[e[t + 5]] +
        "-" +
        T[e[t + 6]] +
        T[e[t + 7]] +
        "-" +
        T[e[t + 8]] +
        T[e[t + 9]] +
        "-" +
        T[e[t + 10]] +
        T[e[t + 11]] +
        T[e[t + 12]] +
        T[e[t + 13]] +
        T[e[t + 14]] +
        T[e[t + 15]]
      ).toLowerCase();
    if (!I(n)) throw TypeError("Stringified UUID is invalid");
    return n;
  }
  var U = 0,
    A = 0;
  function $(e) {
    if (!I(e)) throw TypeError("Invalid UUID");
    var t,
      n = new Uint8Array(16);
    return (
      (n[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24),
      (n[1] = (t >>> 16) & 255),
      (n[2] = (t >>> 8) & 255),
      (n[3] = 255 & t),
      (n[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8),
      (n[5] = 255 & t),
      (n[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8),
      (n[7] = 255 & t),
      (n[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8),
      (n[9] = 255 & t),
      (n[10] = ((t = parseInt(e.slice(24, 36), 16)) / 0x10000000000) & 255),
      (n[11] = (t / 0x100000000) & 255),
      (n[12] = (t >>> 24) & 255),
      (n[13] = (t >>> 16) & 255),
      (n[14] = (t >>> 8) & 255),
      (n[15] = 255 & t),
      n
    );
  }
  function N(e, t, n) {
    function r(e, r, o, i) {
      if (
        ("string" == typeof e &&
          (e = (function (e) {
            e = unescape(encodeURIComponent(e));
            for (var t = [], n = 0; n < e.length; ++n) t.push(e.charCodeAt(n));
            return t;
          })(e)),
        "string" == typeof r && (r = $(r)),
        16 !== r.length)
      )
        throw TypeError(
          "Namespace must be array-like (16 iterable integer values, 0-255)",
        );
      var a = new Uint8Array(16 + e.length);
      if (
        (a.set(r),
        a.set(e, r.length),
        ((a = n(a))[6] = (15 & a[6]) | t),
        (a[8] = (63 & a[8]) | 128),
        o)
      ) {
        i = i || 0;
        for (var l = 0; l < 16; ++l) o[i + l] = a[l];
        return o;
      }
      return L(a);
    }
    try {
      r.name = e;
    } catch (e) {}
    return (
      (r.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      (r.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
      r
    );
  }
  function M(e) {
    return 14 + (((e + 64) >>> 9) << 4) + 1;
  }
  function V(e, t) {
    var n = (65535 & e) + (65535 & t);
    return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
  }
  function H(e, t, n, r, o, i) {
    var a;
    return V(((a = V(V(t, e), V(r, i))) << o) | (a >>> (32 - o)), n);
  }
  function z(e, t, n, r, o, i, a) {
    return H((t & n) | (~t & r), e, t, o, i, a);
  }
  function K(e, t, n, r, o, i, a) {
    return H((t & r) | (n & ~r), e, t, o, i, a);
  }
  function q(e, t, n, r, o, i, a) {
    return H(t ^ n ^ r, e, t, o, i, a);
  }
  function _(e, t, n, r, o, i, a) {
    return H(n ^ (t | ~r), e, t, o, i, a);
  }
  function J(e, t) {
    return (e << t) | (e >>> (32 - t));
  }
  var W = Object.freeze({
    __proto__: null,
    v1: function (e, t, n) {
      var r = (t && n) || 0,
        o = t || Array(16),
        i = (e = e || {}).node || j,
        a = void 0 !== e.clockseq ? e.clockseq : F;
      if (null == i || null == a) {
        var l = e.random || (e.rng || P)();
        (null == i && (i = j = [1 | l[0], l[1], l[2], l[3], l[4], l[5]]),
          null == a && (a = F = 16383 & ((l[6] << 8) | l[7])));
      }
      var s = void 0 !== e.msecs ? e.msecs : Date.now(),
        u = void 0 !== e.nsecs ? e.nsecs : A + 1,
        c = s - U + (u - A) / 1e4;
      if (
        (c < 0 && void 0 === e.clockseq && (a = (a + 1) & 16383),
        (c < 0 || s > U) && void 0 === e.nsecs && (u = 0),
        u >= 1e4)
      )
        throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
      ((U = s), (A = u), (F = a));
      var f = (1e4 * (0xfffffff & (s += 122192928e5)) + u) % 0x100000000;
      ((o[r++] = (f >>> 24) & 255),
        (o[r++] = (f >>> 16) & 255),
        (o[r++] = (f >>> 8) & 255),
        (o[r++] = 255 & f));
      var d = ((s / 0x100000000) * 1e4) & 0xfffffff;
      ((o[r++] = (d >>> 8) & 255),
        (o[r++] = 255 & d),
        (o[r++] = ((d >>> 24) & 15) | 16),
        (o[r++] = (d >>> 16) & 255),
        (o[r++] = (a >>> 8) | 128),
        (o[r++] = 255 & a));
      for (var p = 0; p < 6; ++p) o[r + p] = i[p];
      return t || L(o);
    },
    v3: N("v3", 48, function (e) {
      if ("string" == typeof e) {
        var t = unescape(encodeURIComponent(e));
        e = new Uint8Array(t.length);
        for (var n = 0; n < t.length; ++n) e[n] = t.charCodeAt(n);
      }
      return (function (e) {
        for (
          var t = [], n = 32 * e.length, r = "0123456789abcdef", o = 0;
          o < n;
          o += 8
        ) {
          var i = (e[o >> 5] >>> o % 32) & 255,
            a = parseInt(r.charAt((i >>> 4) & 15) + r.charAt(15 & i), 16);
          t.push(a);
        }
        return t;
      })(
        (function (e, t) {
          ((e[t >> 5] |= 128 << t % 32), (e[M(t) - 1] = t));
          for (
            var n = 0x67452301,
              r = -0x10325477,
              o = -0x67452302,
              i = 0x10325476,
              a = 0;
            a < e.length;
            a += 16
          ) {
            var l = n,
              s = r,
              u = o,
              c = i;
            ((n = z(n, r, o, i, e[a], 7, -0x28955b88)),
              (i = z(i, n, r, o, e[a + 1], 12, -0x173848aa)),
              (o = z(o, i, n, r, e[a + 2], 17, 0x242070db)),
              (r = z(r, o, i, n, e[a + 3], 22, -0x3e423112)),
              (n = z(n, r, o, i, e[a + 4], 7, -0xa83f051)),
              (i = z(i, n, r, o, e[a + 5], 12, 0x4787c62a)),
              (o = z(o, i, n, r, e[a + 6], 17, -0x57cfb9ed)),
              (r = z(r, o, i, n, e[a + 7], 22, -0x2b96aff)),
              (n = z(n, r, o, i, e[a + 8], 7, 0x698098d8)),
              (i = z(i, n, r, o, e[a + 9], 12, -0x74bb0851)),
              (o = z(o, i, n, r, e[a + 10], 17, -42063)),
              (r = z(r, o, i, n, e[a + 11], 22, -0x76a32842)),
              (n = z(n, r, o, i, e[a + 12], 7, 0x6b901122)),
              (i = z(i, n, r, o, e[a + 13], 12, -0x2678e6d)),
              (o = z(o, i, n, r, e[a + 14], 17, -0x5986bc72)),
              (n = K(
                n,
                (r = z(r, o, i, n, e[a + 15], 22, 0x49b40821)),
                o,
                i,
                e[a + 1],
                5,
                -0x9e1da9e,
              )),
              (i = K(i, n, r, o, e[a + 6], 9, -0x3fbf4cc0)),
              (o = K(o, i, n, r, e[a + 11], 14, 0x265e5a51)),
              (r = K(r, o, i, n, e[a], 20, -0x16493856)),
              (n = K(n, r, o, i, e[a + 5], 5, -0x29d0efa3)),
              (i = K(i, n, r, o, e[a + 10], 9, 0x2441453)),
              (o = K(o, i, n, r, e[a + 15], 14, -0x275e197f)),
              (r = K(r, o, i, n, e[a + 4], 20, -0x182c0438)),
              (n = K(n, r, o, i, e[a + 9], 5, 0x21e1cde6)),
              (i = K(i, n, r, o, e[a + 14], 9, -0x3cc8f82a)),
              (o = K(o, i, n, r, e[a + 3], 14, -0xb2af279)),
              (r = K(r, o, i, n, e[a + 8], 20, 0x455a14ed)),
              (n = K(n, r, o, i, e[a + 13], 5, -0x561c16fb)),
              (i = K(i, n, r, o, e[a + 2], 9, -0x3105c08)),
              (o = K(o, i, n, r, e[a + 7], 14, 0x676f02d9)),
              (n = q(
                n,
                (r = K(r, o, i, n, e[a + 12], 20, -0x72d5b376)),
                o,
                i,
                e[a + 5],
                4,
                -378558,
              )),
              (i = q(i, n, r, o, e[a + 8], 11, -0x788e097f)),
              (o = q(o, i, n, r, e[a + 11], 16, 0x6d9d6122)),
              (r = q(r, o, i, n, e[a + 14], 23, -0x21ac7f4)),
              (n = q(n, r, o, i, e[a + 1], 4, -0x5b4115bc)),
              (i = q(i, n, r, o, e[a + 4], 11, 0x4bdecfa9)),
              (o = q(o, i, n, r, e[a + 7], 16, -0x944b4a0)),
              (r = q(r, o, i, n, e[a + 10], 23, -0x41404390)),
              (n = q(n, r, o, i, e[a + 13], 4, 0x289b7ec6)),
              (i = q(i, n, r, o, e[a], 11, -0x155ed806)),
              (o = q(o, i, n, r, e[a + 3], 16, -0x2b10cf7b)),
              (r = q(r, o, i, n, e[a + 6], 23, 0x4881d05)),
              (n = q(n, r, o, i, e[a + 9], 4, -0x262b2fc7)),
              (i = q(i, n, r, o, e[a + 12], 11, -0x1924661b)),
              (o = q(o, i, n, r, e[a + 15], 16, 0x1fa27cf8)),
              (n = _(
                n,
                (r = q(r, o, i, n, e[a + 2], 23, -0x3b53a99b)),
                o,
                i,
                e[a],
                6,
                -0xbd6ddbc,
              )),
              (i = _(i, n, r, o, e[a + 7], 10, 0x432aff97)),
              (o = _(o, i, n, r, e[a + 14], 15, -0x546bdc59)),
              (r = _(r, o, i, n, e[a + 5], 21, -0x36c5fc7)),
              (n = _(n, r, o, i, e[a + 12], 6, 0x655b59c3)),
              (i = _(i, n, r, o, e[a + 3], 10, -0x70f3336e)),
              (o = _(o, i, n, r, e[a + 10], 15, -1051523)),
              (r = _(r, o, i, n, e[a + 1], 21, -0x7a7ba22f)),
              (n = _(n, r, o, i, e[a + 8], 6, 0x6fa87e4f)),
              (i = _(i, n, r, o, e[a + 15], 10, -0x1d31920)),
              (o = _(o, i, n, r, e[a + 6], 15, -0x5cfebcec)),
              (r = _(r, o, i, n, e[a + 13], 21, 0x4e0811a1)),
              (n = _(n, r, o, i, e[a + 4], 6, -0x8ac817e)),
              (i = _(i, n, r, o, e[a + 11], 10, -0x42c50dcb)),
              (o = _(o, i, n, r, e[a + 2], 15, 0x2ad7d2bb)),
              (r = _(r, o, i, n, e[a + 9], 21, -0x14792c6f)),
              (n = V(n, l)),
              (r = V(r, s)),
              (o = V(o, u)),
              (i = V(i, c)));
          }
          return [n, r, o, i];
        })(
          (function (e) {
            if (0 === e.length) return [];
            for (
              var t = 8 * e.length, n = new Uint32Array(M(t)), r = 0;
              r < t;
              r += 8
            )
              n[r >> 5] |= (255 & e[r / 8]) << r % 32;
            return n;
          })(e),
          8 * e.length,
        ),
      );
    }),
    v4: function (e, t, n) {
      var r = (e = e || {}).random || (e.rng || P)();
      if (((r[6] = (15 & r[6]) | 64), (r[8] = (63 & r[8]) | 128), t)) {
        n = n || 0;
        for (var o = 0; o < 16; ++o) t[n + o] = r[o];
        return t;
      }
      return L(r);
    },
    v5: N("v5", 80, function (e) {
      var t = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6],
        n = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
      if ("string" == typeof e) {
        var r = unescape(encodeURIComponent(e));
        e = [];
        for (var o = 0; o < r.length; ++o) e.push(r.charCodeAt(o));
      } else Array.isArray(e) || (e = Array.prototype.slice.call(e));
      e.push(128);
      for (
        var i = e.length / 4 + 2, a = Math.ceil(i / 16), l = Array(a), s = 0;
        s < a;
        ++s
      ) {
        for (var u = new Uint32Array(16), c = 0; c < 16; ++c)
          u[c] =
            (e[64 * s + 4 * c] << 24) |
            (e[64 * s + 4 * c + 1] << 16) |
            (e[64 * s + 4 * c + 2] << 8) |
            e[64 * s + 4 * c + 3];
        l[s] = u;
      }
      ((l[a - 1][14] = (8 * (e.length - 1)) / 0x100000000),
        (l[a - 1][14] = Math.floor(l[a - 1][14])),
        (l[a - 1][15] = (8 * (e.length - 1)) | 0));
      for (var f = 0; f < a; ++f) {
        for (var d = new Uint32Array(80), p = 0; p < 16; ++p) d[p] = l[f][p];
        for (var g = 16; g < 80; ++g)
          d[g] = J(d[g - 3] ^ d[g - 8] ^ d[g - 14] ^ d[g - 16], 1);
        for (
          var v = n[0], m = n[1], h = n[2], y = n[3], b = n[4], w = 0;
          w < 80;
          ++w
        ) {
          var x = Math.floor(w / 20),
            k =
              (J(v, 5) +
                (function (e, t, n, r) {
                  switch (e) {
                    case 0:
                      return (t & n) ^ (~t & r);
                    case 1:
                    case 3:
                      return t ^ n ^ r;
                    case 2:
                      return (t & n) ^ (t & r) ^ (n & r);
                  }
                })(x, m, h, y) +
                b +
                t[x] +
                d[w]) >>>
              0;
          ((b = y), (y = h), (h = J(m, 30) >>> 0), (m = v), (v = k));
        }
        ((n[0] = (n[0] + v) >>> 0),
          (n[1] = (n[1] + m) >>> 0),
          (n[2] = (n[2] + h) >>> 0),
          (n[3] = (n[3] + y) >>> 0),
          (n[4] = (n[4] + b) >>> 0));
      }
      return [
        (n[0] >> 24) & 255,
        (n[0] >> 16) & 255,
        (n[0] >> 8) & 255,
        255 & n[0],
        (n[1] >> 24) & 255,
        (n[1] >> 16) & 255,
        (n[1] >> 8) & 255,
        255 & n[1],
        (n[2] >> 24) & 255,
        (n[2] >> 16) & 255,
        (n[2] >> 8) & 255,
        255 & n[2],
        (n[3] >> 24) & 255,
        (n[3] >> 16) & 255,
        (n[3] >> 8) & 255,
        255 & n[3],
        (n[4] >> 24) & 255,
        (n[4] >> 16) & 255,
        (n[4] >> 8) & 255,
        255 & n[4],
      ];
    }),
    NIL: "00000000-0000-0000-0000-000000000000",
    version: function (e) {
      if (!I(e)) throw TypeError("Invalid UUID");
      return parseInt(e.substr(14, 1), 16);
    },
    validate: I,
    stringify: L,
    parse: $,
  });
  let B = ["debug", "info", "warn", "error", "none"];
  var G = {
    commonBasicLogger: function (e, t) {
      if (e && e.destination && "function" != typeof e.destination)
        throw Error("destination for basicLogger was set to a non-function");
      function n(e) {
        return function (t) {
          console && console[e] && console[e].call(console, t);
        };
      }
      let r =
          e && e.destination
            ? [e.destination, e.destination, e.destination, e.destination]
            : [n("log"), n("info"), n("warn"), n("error")],
        o = !(!e || !e.destination),
        i =
          e && void 0 !== e.prefix && null !== e.prefix
            ? e.prefix
            : "[LaunchDarkly] ",
        a = 1;
      if (e && e.level)
        for (let t = 0; t < B.length; t++) B[t] === e.level && (a = t);
      let l = {};
      for (let e = 0; e < B.length; e++) {
        let n = B[e];
        if ("none" !== n)
          if (e < a) l[n] = () => {};
          else {
            let a = e;
            l[n] = function () {
              !(function (e, n, a) {
                let l;
                if (a.length < 1) return;
                let s = o ? n + ": " + i : i;
                if (1 !== a.length && t) {
                  let e = [...a];
                  ((e[0] = s + e[0]), (l = t(...e)));
                } else l = s + a[0];
                try {
                  r[e](l);
                } catch (e) {
                  console &&
                    console.log &&
                    console.log(
                      "[LaunchDarkly] Configured logger's " +
                        n +
                        " method threw an exception: " +
                        e,
                    );
                }
              })(a, n, arguments);
            };
          }
      }
      return l;
    },
    validateLogger: function (e) {
      B.forEach((t) => {
        if ("none" !== t && (!e[t] || "function" != typeof e[t]))
          throw Error(
            "Provided logger instance must support logger." +
              t +
              "(...) method",
          );
      });
    },
  };
  function Z(e) {
    return e && e.message
      ? e.message
      : "string" == typeof e || e instanceof String
        ? e
        : JSON.stringify(e);
  }
  let X =
    " Please see https://docs.launchdarkly.com/sdk/client-side/javascript#initialize-the-client for instructions on SDK initialization.";
  var Y = {
    bootstrapInvalid: function () {
      return "LaunchDarkly bootstrap data is not available because the back end could not read the flags.";
    },
    bootstrapOldFormat: function () {
      return (
        "LaunchDarkly client was initialized with bootstrap data that did not include flag metadata. Events may not be sent correctly." +
        X
      );
    },
    clientInitialized: function () {
      return "LaunchDarkly client initialized";
    },
    clientNotReady: function () {
      return "LaunchDarkly client is not ready";
    },
    debugEnqueueingEvent: function (e) {
      return 'enqueueing "' + e + '" event';
    },
    debugPostingDiagnosticEvent: function (e) {
      return "sending diagnostic event (" + e.kind + ")";
    },
    debugPostingEvents: function (e) {
      return "sending " + e + " events";
    },
    debugStreamDelete: function (e) {
      return 'received streaming deletion for flag "' + e + '"';
    },
    debugStreamDeleteIgnored: function (e) {
      return (
        'received streaming deletion for flag "' +
        e +
        '" but ignored due to version check'
      );
    },
    debugStreamPatch: function (e) {
      return 'received streaming update for flag "' + e + '"';
    },
    debugStreamPatchIgnored: function (e) {
      return (
        'received streaming update for flag "' +
        e +
        '" but ignored due to version check'
      );
    },
    debugStreamPing: function () {
      return "received ping message from stream";
    },
    debugPolling: function (e) {
      return "polling for feature flags at " + e;
    },
    debugStreamPut: function () {
      return "received streaming update for all flags";
    },
    deprecated: function (e, t) {
      return t
        ? '"' + e + '" is deprecated, please use "' + t + '"'
        : '"' + e + '" is deprecated';
    },
    environmentNotFound: function () {
      return (
        "Environment not found. Double check that you specified a valid environment/client-side ID." +
        X
      );
    },
    environmentNotSpecified: function () {
      return "No environment/client-side ID was specified." + X;
    },
    errorFetchingFlags: function (e) {
      return "Error fetching flag settings: " + Z(e);
    },
    eventCapacityExceeded: function () {
      return "Exceeded event queue capacity. Increase capacity to avoid dropping events.";
    },
    eventWithoutContext: function () {
      return "Be sure to call `identify` in the LaunchDarkly client: https://docs.launchdarkly.com/sdk/features/identify#javascript";
    },
    httpErrorMessage: function (e, t, n) {
      return (
        "Received error " +
        e +
        (401 === e ? " (invalid SDK key)" : "") +
        " for " +
        t +
        " - " +
        (f.isHttpErrorRecoverable(e) ? n : "giving up permanently")
      );
    },
    httpUnavailable: function () {
      return "Cannot make HTTP requests in this environment." + X;
    },
    identifyDisabled: function () {
      return "identify() has no effect here; it must be called on the main client instance";
    },
    inspectorMethodError: (e, t) =>
      `an inspector: "${t}" of type: "${e}" generated an exception`,
    invalidContentType: function (e) {
      return 'Expected application/json content type but got "' + e + '"';
    },
    invalidData: function () {
      return "Invalid data received from LaunchDarkly; connection may have been interrupted";
    },
    invalidInspector: (e, t) =>
      `an inspector: "${t}" of an invalid type (${e}) was configured`,
    invalidKey: function () {
      return "Event key must be a string";
    },
    invalidMetricValue: (e) =>
      `The track function was called with a non-numeric "metricValue" (${e}), only numeric metric values are supported.`,
    invalidContext: function () {
      return "Invalid context specified." + X;
    },
    invalidTagValue: (e) =>
      `Config option "${e}" must only contain letters, numbers, ., _ or -.`,
    localStorageUnavailable: function (e) {
      return "local storage is unavailable: " + Z(e);
    },
    networkError: (e) => "network error" + (e ? " (" + e + ")" : ""),
    optionBelowMinimum: (e, t, n) =>
      'Config option "' +
      e +
      '" was set to ' +
      t +
      ", changing to minimum value of " +
      n,
    streamClosing: function () {
      return "Closing stream connection";
    },
    streamConnecting: function (e) {
      return "Opening stream connection to " + e;
    },
    streamError: function (e, t) {
      return (
        "Error on stream connection: " +
        Z(e) +
        ", will continue retrying after " +
        t +
        " milliseconds."
      );
    },
    tagValueTooLong: (e) =>
      `Value of "${e}" was longer than 64 characters and was discarded.`,
    unknownCustomEventKey: function (e) {
      return 'Custom event "' + e + '" does not exist';
    },
    unknownOption: (e) => 'Ignoring unknown config option "' + e + '"',
    contextNotSpecified: function () {
      return "No context specified." + X;
    },
    unrecoverableStreamError: (e) =>
      `Error on stream connection ${Z(e)}, giving up permanently`,
    wrongOptionType: (e, t, n) =>
      'Config option "' +
      e +
      '" should be of type ' +
      t +
      ", got " +
      n +
      ", using default value",
    wrongOptionTypeBoolean: (e, t) =>
      'Config option "' +
      e +
      '" should be a boolean, got ' +
      t +
      ", converting to boolean",
  };
  let { validateLogger: Q } = G,
    ee = {
      baseUrl: { default: "https://app.launchdarkly.com" },
      streamUrl: { default: "https://clientstream.launchdarkly.com" },
      eventsUrl: { default: "https://events.launchdarkly.com" },
      sendEvents: { default: !0 },
      streaming: { type: "boolean" },
      sendLDHeaders: { default: !0 },
      requestHeaderTransform: { type: "function" },
      sendEventsOnlyForVariation: { default: !1 },
      useReport: { default: !1 },
      evaluationReasons: { default: !1 },
      eventCapacity: { default: 100, minimum: 1 },
      flushInterval: { default: 2e3, minimum: 2e3 },
      samplingInterval: { default: 0, minimum: 0 },
      streamReconnectDelay: { default: 1e3, minimum: 0 },
      allAttributesPrivate: { default: !1 },
      privateAttributes: { default: [] },
      bootstrap: { type: "string|object" },
      diagnosticRecordingInterval: { default: 9e5, minimum: 2e3 },
      diagnosticOptOut: { default: !1 },
      wrapperName: { type: "string" },
      wrapperVersion: { type: "string" },
      stateProvider: { type: "object" },
      application: {
        validator: function (e, t, n) {
          let r = {};
          return (
            t.id && (r.id = er(`${e}.id`, t.id, n)),
            t.version && (r.version = er(`${e}.version`, t.version, n)),
            r
          );
        },
      },
      inspectors: { default: [] },
      hooks: { default: [] },
      plugins: { default: [] },
    },
    et = /^(\w|\.|-)+$/;
  function en(e) {
    return e && e.replace(/\/+$/, "");
  }
  function er(e, t, n) {
    if ("string" == typeof t && t.match(et)) {
      if (!(t.length > 64)) return t;
      n.warn(Y.tagValueTooLong(e));
    } else n.warn(Y.invalidTagValue(e));
  }
  var eo = {
    baseOptionDefs: ee,
    validate: function (e, t, n, r) {
      var o, i, a;
      let l,
        s,
        u,
        c = S.extend({ logger: { default: r } }, ee, n),
        d = {};
      function p(e) {
        S.onNextTick(() => {
          t && t.maybeReportError(new f.LDInvalidArgumentError(e));
        });
      }
      let g = S.extend({}, e || {});
      return (
        (o = g),
        Object.keys(d).forEach((e) => {
          if (void 0 !== o[e]) {
            let t = d[e];
            (r && r.warn(Y.deprecated(e, t)),
              t && (void 0 === o[t] && (o[t] = o[e]), delete o[e]));
          }
        }),
        (i = g),
        (l = S.extend({}, i)),
        Object.keys(c).forEach((e) => {
          (void 0 !== l[e] && null !== l[e]) || (l[e] = c[e] && c[e].default);
        }),
        (a = g = l),
        (s = S.extend({}, a)),
        (u = (e) => {
          if (null === e) return "any";
          if (void 0 === e) return;
          if (Array.isArray(e)) return "array";
          let t = typeof e;
          return "boolean" === t ||
            "string" === t ||
            "number" === t ||
            "function" === t
            ? t
            : "object";
        }),
        Object.keys(a).forEach((e) => {
          let t = a[e];
          if (null != t) {
            let n = c[e];
            if (void 0 === n) p(Y.unknownOption(e));
            else {
              let o = n.type || u(n.default),
                i = n.validator;
              if (i) {
                let t = i(e, a[e], r);
                void 0 !== t ? (s[e] = t) : delete s[e];
              } else if ("any" !== o) {
                let r = o.split("|"),
                  i = u(t);
                0 > r.indexOf(i)
                  ? "boolean" === o
                    ? ((s[e] = !!t), p(Y.wrongOptionTypeBoolean(e, i)))
                    : (p(Y.wrongOptionType(e, o, i)), (s[e] = n.default))
                  : "number" === i &&
                    void 0 !== n.minimum &&
                    t < n.minimum &&
                    (p(Y.optionBelowMinimum(e, t, n.minimum)),
                    (s[e] = n.minimum));
              }
            }
          }
        }),
        (s.baseUrl = en(s.baseUrl)),
        (s.streamUrl = en(s.streamUrl)),
        (s.eventsUrl = en(s.eventsUrl)),
        Q((g = s).logger),
        g
      );
    },
    getTags: function (e) {
      let t = {};
      return (
        e &&
          (e.application &&
            void 0 !== e.application.id &&
            null !== e.application.id &&
            (t["application-id"] = [e.application.id]),
          e.application &&
            void 0 !== e.application.version &&
            null !== e.application.id &&
            (t["application-version"] = [e.application.version])),
        t
      );
    },
  };
  let { getLDUserAgentString: ei } = S;
  var ea = {
    getLDHeaders: function (e, t) {
      if (t && !t.sendLDHeaders) return {};
      let n = {};
      ((n[e.userAgentHeaderName || "User-Agent"] = ei(e)),
        t &&
          t.wrapperName &&
          (n["X-LaunchDarkly-Wrapper"] = t.wrapperVersion
            ? t.wrapperName + "/" + t.wrapperVersion
            : t.wrapperName));
      let r = eo.getTags(t),
        o = Object.keys(r);
      return (
        o.length &&
          (n["x-launchdarkly-tags"] = o
            .sort()
            .map((e) =>
              Array.isArray(r[e])
                ? r[e].sort().map((t) => `${e}/${t}`)
                : [`${e}/${r[e]}`],
            )
            .reduce((e, t) => e.concat(t), [])
            .join(" ")),
        n
      );
    },
    transformHeaders: function (e, t) {
      return t && t.requestHeaderTransform
        ? t.requestHeaderTransform({ ...e })
        : e;
    },
  };
  let { v1: el } = W,
    { getLDHeaders: es, transformHeaders: eu } = ea;
  var ec = function (e, t, n) {
      let r = S.extend({ "Content-Type": "application/json" }, es(e, n)),
        o = {};
      return (
        (o.sendEvents = (t, o, i) => {
          if (!e.httpRequest) return Promise.resolve();
          let a = JSON.stringify(t),
            l = i ? null : el();
          return (function t(s) {
            let u = i
              ? r
              : S.extend({}, r, {
                  "X-LaunchDarkly-Event-Schema": "4",
                  "X-LaunchDarkly-Payload-ID": l,
                });
            return e
              .httpRequest("POST", o, eu(u, n), a)
              .promise.then((e) => {
                if (e)
                  return e.status >= 400 &&
                    f.isHttpErrorRecoverable(e.status) &&
                    s
                    ? t(!1)
                    : (function (e) {
                        let t = { status: e.status },
                          n = e.header("date");
                        if (n) {
                          let e = Date.parse(n);
                          e && (t.serverTime = e);
                        }
                        return t;
                      })(e);
              })
              .catch(() => (s ? t(!1) : Promise.reject()));
          })(!0).catch(() => {});
        }),
        o
      );
    },
    ef = function e(t, n = []) {
      if (null === t || "object" != typeof t) return JSON.stringify(t);
      if (n.includes(t)) throw Error("Cycle detected");
      return Array.isArray(t)
        ? `[${t
            .map((r) => e(r, [...n, t]))
            .map((e) => (void 0 === e ? "null" : e))
            .join(",")}]`
        : `{${Object.keys(t)
            .sort()
            .map((r) => {
              let o = e(t[r], [...n, t]);
              if (void 0 !== o) return `${JSON.stringify(r)}:${o}`;
            })
            .filter((e) => void 0 !== e)
            .join(",")}}`;
    };
  let { commonBasicLogger: ed } = G;
  function ep(e) {
    return "string" == typeof e && "kind" !== e && e.match(/^(\w|\.|-)+$/);
  }
  function eg(e) {
    return e.includes("%") || e.includes(":")
      ? e.replace(/%/g, "%25").replace(/:/g, "%3A")
      : e;
  }
  var ev = {
    checkContext: function (e, t) {
      if (e) {
        if (t && (void 0 === e.kind || null === e.kind))
          return void 0 !== e.key && null !== e.key;
        let n = e.key,
          r = void 0 === e.kind ? "user" : e.kind,
          o = ep(r),
          i = "multi" === r || (null != n && "" !== n);
        if ("multi" === r) {
          let t = Object.keys(e).filter((e) => "kind" !== e);
          return (
            i &&
            t.every((e) => ep(e)) &&
            t.every((t) => {
              let n = e[t].key;
              return null != n && "" !== n;
            })
          );
        }
        return i && o;
      }
      return !1;
    },
    getContextKeys: function (e, t = ed()) {
      if (!e) return;
      let n = {},
        { kind: r, key: o } = e;
      switch (r) {
        case void 0:
          n.user = `${o}`;
          break;
        case "multi":
          Object.entries(e)
            .filter(([e]) => "kind" !== e)
            .forEach(([e, t]) => {
              t && t.key && (n[e] = t.key);
            });
          break;
        case null:
          t.warn(`null is not a valid context kind: ${e}`);
          break;
        case "":
          t.warn(`'' is not a valid context kind: ${e}`);
          break;
        default:
          n[r] = `${o}`;
      }
      return n;
    },
    getContextKinds: function (e) {
      return e
        ? null === e.kind || void 0 === e.kind
          ? ["user"]
          : "multi" !== e.kind
            ? [e.kind]
            : Object.keys(e).filter((e) => "kind" !== e)
        : [];
    },
    getCanonicalKey: function (e) {
      if (e) {
        if (
          (void 0 === e.kind || null === e.kind || "user" === e.kind) &&
          e.key
        )
          return e.key;
        if ("multi" !== e.kind && e.key) return `${e.kind}:${eg(e.key)}`;
        if ("multi" === e.kind)
          return Object.keys(e)
            .sort()
            .filter((e) => "kind" !== e)
            .map((t) => `${t}:${eg(e[t].key)}`)
            .join(":");
      }
    },
  };
  let { getContextKinds: em } = ev;
  var eh = function () {
      let e = {},
        t = 0,
        n = 0,
        r = {},
        o = {};
      return (
        (e.summarizeEvent = (e) => {
          if ("feature" === e.kind) {
            let i =
                e.key +
                ":" +
                (null !== e.variation && void 0 !== e.variation
                  ? e.variation
                  : "") +
                ":" +
                (null !== e.version && void 0 !== e.version ? e.version : ""),
              a = r[i],
              l = o[e.key];
            (l || ((l = new Set()), (o[e.key] = l)),
              (e.context
                ? em(e.context)
                : e.contextKeys
                  ? Object.keys(e.contextKeys)
                  : []
              ).forEach((e) => l.add(e)),
              a
                ? (a.count = a.count + 1)
                : (r[i] = {
                    count: 1,
                    key: e.key,
                    version: e.version,
                    variation: e.variation,
                    value: e.value,
                    default: e.default,
                  }),
              (0 === t || e.creationDate < t) && (t = e.creationDate),
              e.creationDate > n && (n = e.creationDate));
          }
        }),
        (e.getSummary = () => {
          let e = {},
            i = !0;
          for (let t of Object.values(r)) {
            let n = e[t.key];
            n ||
              ((n = {
                default: t.default,
                counters: [],
                contextKinds: [...o[t.key]],
              }),
              (e[t.key] = n));
            let r = { value: t.value, count: t.count };
            (void 0 !== t.variation &&
              null !== t.variation &&
              (r.variation = t.variation),
              void 0 !== t.version && null !== t.version
                ? (r.version = t.version)
                : (r.unknown = !0),
              n.counters.push(r),
              (i = !1));
          }
          return i
            ? null
            : { startDate: t, endDate: n, features: e, kind: "summary" };
        }),
        (e.clearSummary = () => {
          ((t = 0), (n = 0), (r = {}), (o = {}));
        }),
        e
      );
    },
    ey = function (e) {
      let t = {},
        n = {};
      return {
        summarizeEvent: function (e) {
          if ("feature" === e.kind) {
            let r = ef(e.context);
            if (!r) return;
            let o = t[r];
            (o || ((t[r] = eh()), (o = t[r]), (n[r] = e.context)),
              o.summarizeEvent(e));
          }
        },
        getSummaries: function () {
          let r = t,
            o = n;
          return (
            (t = {}),
            (n = {}),
            Object.entries(r).map(([t, n]) => {
              let r = n.getSummary();
              return ((r.context = e.filter(o[t])), r);
            })
          );
        },
      };
    };
  function eb(e) {
    return e.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function ew(e) {
    return (e.startsWith("/") ? e.substring(1) : e)
      .split("/")
      .map((e) =>
        e.indexOf("~") >= 0 ? e.replace(/~1/g, "/").replace(/~0/g, "~") : e,
      );
  }
  function ex(e) {
    return !e.startsWith("/");
  }
  function ek(e, t) {
    let n = ex(e),
      r = ex(t);
    if (n && r) return e === t;
    if (n) {
      let n = ew(t);
      return 1 === n.length && e === n[0];
    }
    if (r) {
      let n = ew(e);
      return 1 === n.length && t === n[0];
    }
    return e === t;
  }
  function eE(e) {
    return `/${eb(e)}`;
  }
  var eO = function (e, t) {
      let n = [],
        r = {},
        o = [];
      for (
        n.push(
          ...Object.keys(e).map((t) => ({
            key: t,
            ptr: eE(t),
            source: e,
            parent: r,
            visited: [e],
          })),
        );
        n.length;

      ) {
        let e = n.pop();
        if (t.some((t) => ek(t, e.ptr))) o.push(e.ptr);
        else {
          let t = e.source[e.key];
          if (null === t) e.parent[e.key] = t;
          else if (Array.isArray(t)) e.parent[e.key] = [...t];
          else if ("object" == typeof t) {
            if (e.visited.includes(t)) continue;
            ((e.parent[e.key] = {}),
              n.push(
                ...Object.keys(t).map((n) => {
                  var r, o;
                  return {
                    key: n,
                    ptr: ((r = e.ptr), (o = eb(n)), `${r}/${o}`),
                    source: t,
                    parent: e.parent[e.key],
                    visited: [...e.visited, t],
                  };
                }),
              ));
          } else e.parent[e.key] = t;
        }
      }
      return { cloned: r, excluded: o.sort() };
    },
    eS = function (e) {
      let t = {},
        n = e.allAttributesPrivate,
        r = e.privateAttributes || [],
        o = ["key", "kind", "_meta", "anonymous"],
        i = [
          "name",
          "ip",
          "firstName",
          "lastName",
          "email",
          "avatar",
          "country",
        ],
        a = (e, t) => {
          if ("object" != typeof e || null === e || Array.isArray(e)) return;
          let { cloned: i, excluded: a } = eO(
            e,
            (n || (t && e.anonymous)
              ? Object.keys(e)
              : [...r, ...((e._meta && e._meta.privateAttributes) || [])]
            ).filter((e) => !o.some((t) => ek(e, t))),
          );
          return (
            (i.key = String(i.key)),
            a.length &&
              (i._meta || (i._meta = {}), (i._meta.redactedAttributes = a)),
            i._meta &&
              (delete i._meta.privateAttributes,
              0 === Object.keys(i._meta).length && delete i._meta),
            void 0 !== i.anonymous && (i.anonymous = !!i.anonymous),
            i
          );
        };
      return (
        (t.filter = (e, t = !1) =>
          void 0 === e.kind || null === e.kind
            ? a(
                ((e) => {
                  let t = { ...(e.custom || {}), kind: "user", key: e.key };
                  for (let n of (void 0 !== e.anonymous &&
                    (t.anonymous = !!e.anonymous),
                  i))
                    (delete t[n],
                      void 0 !== e[n] &&
                        null !== e[n] &&
                        (t[n] = String(e[n])));
                  return (
                    void 0 !== e.privateAttributeNames &&
                      null !== e.privateAttributeNames &&
                      ((t._meta = t._meta || {}),
                      (t._meta.privateAttributes = e.privateAttributeNames.map(
                        (e) => (e.startsWith("/") ? eE(e) : e),
                      ))),
                    t
                  );
                })(e),
                t,
              )
            : "multi" === e.kind
              ? ((e, t) => {
                  let n = { kind: e.kind };
                  for (let r of Object.keys(e))
                    if ("kind" !== r) {
                      let o = a(e[r], t);
                      o && (n[r] = o);
                    }
                  return n;
                })(e, t)
              : a(e, t)),
        t
      );
    };
  let { getContextKeys: eC } = ev;
  var eP = function (e, t, n, r = null, o = null, i = null) {
      let a = {},
        l = i || ec(e, n, t),
        s = S.appendUrlPath(t.eventsUrl, "/events/bulk/" + n),
        u = eS(t),
        c = ey(u),
        d = t.samplingInterval,
        p = t.eventCapacity,
        g = t.flushInterval,
        v = t.logger,
        m,
        h = [],
        y = 0,
        b = !1,
        w = !1;
      function x() {
        return 0 === d || 0 === Math.floor(Math.random() * d);
      }
      function k(e) {
        h.length < p
          ? (h.push(e), (w = !1))
          : (w || ((w = !0), v.warn(Y.eventCapacityExceeded())),
            r && r.incrementDroppedEvents());
      }
      return (
        (a.enqueue = function (e) {
          let t;
          if (b) return;
          let n = !1,
            r = !1;
          if (
            (c.summarizeEvent(e),
            "feature" === e.kind
              ? x() &&
                ((n = !!e.trackEvents),
                (r =
                  !!e.debugEventsUntilDate &&
                  e.debugEventsUntilDate > y &&
                  e.debugEventsUntilDate > new Date().getTime()))
              : (n = x()),
            n &&
              k(
                ((t = S.extend({}, e)),
                "identify" === e.kind ||
                "feature" === e.kind ||
                "custom" === e.kind
                  ? (t.context = u.filter(e.context))
                  : ((t.contextKeys = eC(e.context, v)), delete t.context),
                "feature" === e.kind &&
                  (delete t.trackEvents, delete t.debugEventsUntilDate),
                t),
              ),
            r)
          ) {
            let t = S.extend({}, e, { kind: "debug" });
            ((t.context = u.filter(t.context)),
              delete t.trackEvents,
              delete t.debugEventsUntilDate,
              k(t));
          }
        }),
        (a.flush = async function () {
          if (b) return Promise.resolve();
          let e = h;
          return (
            c.getSummaries().forEach((t) => {
              Object.keys(t.features).length && e.push(t);
            }),
            r && r.setEventsInLastBatch(e.length),
            0 === e.length
              ? Promise.resolve()
              : ((h = []),
                v.debug(Y.debugPostingEvents(e.length)),
                l.sendEvents(e, s).then((e) => {
                  e &&
                    (e.serverTime && (y = e.serverTime),
                    f.isHttpErrorRecoverable(e.status) || (b = !0),
                    e.status >= 400 &&
                      S.onNextTick(() => {
                        o.maybeReportError(
                          new f.LDUnexpectedResponseError(
                            Y.httpErrorMessage(
                              e.status,
                              "event posting",
                              "some events were dropped",
                            ),
                          ),
                        );
                      }));
                }))
          );
        }),
        (a.start = function () {
          let e = () => {
            (a.flush(), (m = setTimeout(e, g)));
          };
          m = setTimeout(e, g);
        }),
        (a.stop = function () {
          clearTimeout(m);
        }),
        a
      );
    },
    eD = function (e) {
      let t = {},
        n = {};
      return (
        (t.on = function (e, t, r) {
          ((n[e] = n[e] || []),
            (n[e] = n[e].concat({ handler: t, context: r })));
        }),
        (t.off = function (e, t, r) {
          if (n[e])
            for (let o = 0; o < n[e].length; o++)
              n[e][o].handler === t &&
                n[e][o].context === r &&
                (n[e] = n[e].slice(0, o).concat(n[e].slice(o + 1)));
        }),
        (t.emit = function (e) {
          if (!n[e]) return;
          let t = n[e].slice(0);
          for (let e = 0; e < t.length; e++)
            t[e].handler.apply(
              t[e].context,
              Array.prototype.slice.call(arguments, 1),
            );
        }),
        (t.getEvents = function () {
          return Object.keys(n);
        }),
        (t.getEventListenerCount = function (e) {
          return n[e] ? n[e].length : 0;
        }),
        (t.maybeReportError = function (t) {
          t &&
            (n.error ? this.emit("error", t) : (e || console).error(t.message));
        }),
        t
      );
    };
  let eI = "ready",
    ej = "initialized",
    eF = "failed";
  var eT = function (e) {
      let t = !1,
        n = !1,
        r = null,
        o = null,
        i = new Promise((t) => {
          let n = () => {
            (e.off(eI, n), t());
          };
          e.on(eI, n);
        }).catch(() => {});
      return {
        getInitializationPromise: () =>
          o ||
          (t
            ? Promise.resolve()
            : n
              ? Promise.reject(r)
              : (o = new Promise((t, n) => {
                  let r = () => {
                      (e.off(ej, r), t());
                    },
                    o = (t) => {
                      (e.off(eF, o), n(t));
                    };
                  (e.on(ej, r), e.on(eF, o));
                }))),
        getReadyPromise: () => i,
        signalSuccess: () => {
          t || n || ((t = !0), e.emit(ej), e.emit(eI));
        },
        signalFailure: (o) => {
          (t || n || ((n = !0), (r = o), e.emit(eF, o), e.emit(eI)),
            e.maybeReportError(o));
        },
      };
    },
    eR = function (e, t, n, r) {
      let o = {};
      function i() {
        let e = "",
          o = r.getContext();
        return (o && (e = n || S.btoa(JSON.stringify(o))), "ld:" + t + ":" + e);
      }
      return (
        (o.loadFlags = () =>
          e.get(i()).then((e) => {
            if (null == e) return null;
            try {
              let t = JSON.parse(e);
              if (t) {
                let e = t.$schema;
                void 0 === e || e < 1
                  ? (t = S.transformValuesToVersionedValues(t))
                  : delete t.$schema;
              }
              return t;
            } catch (e) {
              return o.clearFlags().then(() => null);
            }
          })),
        (o.saveFlags = (t) => {
          let n = S.extend({}, t, { $schema: 1 });
          return e.set(i(), JSON.stringify(n));
        }),
        (o.clearFlags = () => e.clear(i())),
        o
      );
    },
    eL = function (e, t) {
      let n = {},
        r = !1,
        o = (e) => {
          r || ((r = !0), t.warn(Y.localStorageUnavailable(e)));
        };
      return (
        (n.isEnabled = () => !!e),
        (n.get = (t) =>
          new Promise((n) => {
            e
              ? e
                  .get(t)
                  .then(n)
                  .catch((e) => {
                    (o(e), n(void 0));
                  })
              : n(void 0);
          })),
        (n.set = (t, n) =>
          new Promise((r) => {
            e
              ? e
                  .set(t, n)
                  .then(() => r(!0))
                  .catch((e) => {
                    (o(e), r(!1));
                  })
              : r(!1);
          })),
        (n.clear = (t) =>
          new Promise((n) => {
            e
              ? e
                  .clear(t)
                  .then(() => n(!0))
                  .catch((e) => {
                    (o(e), n(!1));
                  })
              : n(!1);
          })),
        n
      );
    };
  let { appendUrlPath: eU, base64URLEncode: eA, objectHasOwnProperty: e$ } = S,
    { getLDHeaders: eN, transformHeaders: eM } = ea,
    { isHttpErrorRecoverable: eV } = f;
  var eH = function (e, t, n, r) {
      let o = t.streamUrl,
        i = t.logger,
        a = {},
        l = eU(o, "/eval/" + n),
        s = t.useReport,
        u = t.evaluationReasons,
        c = t.streamReconnectDelay,
        f = eN(e, t),
        d,
        p = !1,
        g = null,
        v = null,
        m = null,
        h = null,
        y = null,
        b = 0;
      function w(e) {
        var t;
        let n, r;
        if (e.status && "number" == typeof e.status && !eV(e.status))
          return (
            E(),
            i.error(Y.unrecoverableStreamError(e)),
            void (v && (clearTimeout(v), (v = null)))
          );
        let o =
          ((r =
            (t = (n = c * Math.pow(2, b)) > 3e4 ? 3e4 : n) -
            Math.trunc(0.5 * Math.random() * t)),
          (b += 1),
          r);
        (p || (i.warn(Y.streamError(e, o)), (p = !0)), O(!1), E(), x(o));
      }
      function x(e) {
        v || (e ? (v = setTimeout(k, e)) : k());
      }
      function k() {
        let r;
        v = null;
        let a = "",
          c = { headers: f, readTimeoutMillis: 3e5 };
        if (e.eventSourceFactory) {
          for (let f in (null != h && (a = "h=" + h),
          s
            ? e.eventSourceAllowsReport
              ? ((r = l),
                (c.method = "REPORT"),
                (c.headers["Content-Type"] = "application/json"),
                (c.body = JSON.stringify(m)))
              : ((r = eU(o, "/ping/" + n)), (a = ""))
            : (r = l + "/" + eA(JSON.stringify(m))),
          (c.headers = eM(c.headers, t)),
          u && (a = a + (a ? "&" : "") + "withReasons=true"),
          (r = r + (a ? "?" : "") + a),
          E(),
          i.info(Y.streamConnecting(r)),
          (d = new Date().getTime()),
          (g = e.eventSourceFactory(r, c)),
          y))
            e$(y, f) && g.addEventListener(f, y[f]);
          ((g.onerror = w),
            (g.onopen = () => {
              b = 0;
            }));
        }
      }
      function E() {
        g && (i.info(Y.streamClosing()), g.close(), (g = null));
      }
      function O(e) {
        (d && r && r.recordStreamInit(d, !e, new Date().getTime() - d),
          (d = null));
      }
      return (
        (a.connect = function (e, t, n) {
          for (let r in ((m = e), (h = t), (y = {}), n || {}))
            y[r] = function (e) {
              ((p = !1), O(!0), n[r] && n[r](e));
            };
          x();
        }),
        (a.disconnect = function () {
          (clearTimeout(v), (v = null), E());
        }),
        (a.isConnected = function () {
          return !!(g && e.eventSourceIsActive && e.eventSourceIsActive(g));
        }),
        a
      );
    },
    ez = function (e) {
      let t,
        n,
        r,
        o,
        i = {
          addPromise: (i, a) => {
            ((t = i),
              n && n(),
              (n = a),
              i.then(
                (n) => {
                  t === i && (r(n), e && e());
                },
                (n) => {
                  t === i && (o(n), e && e());
                },
              ));
          },
        };
      return (
        (i.resultPromise = new Promise((e, t) => {
          ((r = e), (o = t));
        })),
        i
      );
    };
  let { transformHeaders: eK, getLDHeaders: eq } = ea,
    e_ = "application/json";
  var eJ = function (e, t, n) {
      let r = t.baseUrl,
        o = t.useReport,
        i = t.evaluationReasons,
        a = t.logger,
        l = {},
        s = {};
      function u(n, r) {
        if (!e.httpRequest)
          return new Promise((e, t) => {
            t(new f.LDFlagFetchError(Y.httpUnavailable()));
          });
        let o = eq(e, t);
        r && (o["Content-Type"] = e_);
        let i = s[n];
        i ||
          ((i = ez(() => {
            delete s[n];
          })),
          (s[n] = i));
        let a = e.httpRequest(r ? "REPORT" : "GET", n, eK(o, t), r),
          l = a.promise.then(
            (e) => {
              if (200 === e.status) {
                if (
                  e.header("content-type") &&
                  e.header("content-type").substring(0, 16) === e_
                )
                  return JSON.parse(e.body);
                {
                  let t = Y.invalidContentType(e.header("content-type") || "");
                  return Promise.reject(new f.LDFlagFetchError(t));
                }
              }
              return Promise.reject(
                404 === e.status
                  ? new f.LDInvalidEnvironmentIdError(Y.environmentNotFound())
                  : new f.LDFlagFetchError(
                      Y.errorFetchingFlags(e.statusText || String(e.status)),
                    ),
              );
            },
            (e) => Promise.reject(new f.LDFlagFetchError(Y.networkError(e))),
          );
        return (
          i.addPromise(l, () => {
            a.cancel && a.cancel();
          }),
          i.resultPromise
        );
      }
      return (
        (l.fetchJSON = function (e) {
          return u(S.appendUrlPath(r, e), null);
        }),
        (l.fetchFlagSettings = function (e, t) {
          let l,
            s,
            c = "";
          return (
            o
              ? ((l = [r, "/sdk/evalx/", n, "/context"].join("")),
                (s = JSON.stringify(e)))
              : (l = [
                  r,
                  "/sdk/evalx/",
                  n,
                  "/contexts/",
                  S.base64URLEncode(JSON.stringify(e)),
                ].join("")),
            t && (c = "h=" + t),
            i && (c = c + (c ? "&" : "") + "withReasons=true"),
            (l = l + (c ? "?" : "") + c),
            a.debug(Y.debugPolling(l)),
            u(l, s)
          );
        }),
        l
      );
    },
    eW = function (e, t) {
      let n,
        r = {};
      return (
        (r.setContext = function (e) {
          (n = S.sanitizeContext(e)) && t && t(S.clone(n));
        }),
        (r.getContext = function () {
          return n ? S.clone(n) : null;
        }),
        e && r.setContext(e),
        r
      );
    };
  let { v1: eB } = W,
    { getContextKinds: eG } = ev;
  var eZ = function (e) {
    function t(e) {
      return null == e || "user" === e
        ? "ld:$anonUserId"
        : `ld:$contextKey:${e}`;
    }
    function n(n, r) {
      return null !== r.key && void 0 !== r.key
        ? ((r.key = r.key.toString()), Promise.resolve(r))
        : r.anonymous
          ? e.get(t(n)).then((o) => {
              if (o) return ((r.key = o), r);
              {
                let o = eB();
                return ((r.key = o), e.set(t(n), o).then(() => r));
              }
            })
          : Promise.reject(new f.LDInvalidUserError(Y.invalidContext()));
    }
    this.processContext = (e) => {
      if (!e)
        return Promise.reject(
          new f.LDInvalidUserError(Y.contextNotSpecified()),
        );
      let t = S.clone(e);
      return "multi" === e.kind
        ? Promise.all(eG(t).map((e) => n(e, t[e]))).then(() => t)
        : n(e.kind, t);
    };
  };
  let { v1: eX } = W,
    { baseOptionDefs: eY } = eo,
    { appendUrlPath: eQ } = S;
  var e0 = function (e) {
      let t = { diagnosticId: eX() };
      return (
        e && (t.sdkKeySuffix = e.length > 6 ? e.substring(e.length - 6) : e),
        t
      );
    },
    e1 = function (e) {
      let t, n, r, o;
      function i(e) {
        ((t = e), (n = 0), (r = 0), (o = []));
      }
      return (
        i(e),
        {
          getProps: () => ({
            dataSinceDate: t,
            droppedEvents: n,
            eventsInLastBatch: r,
            streamInits: o,
          }),
          setProps: (e) => {
            ((t = e.dataSinceDate),
              (n = e.droppedEvents || 0),
              (r = e.eventsInLastBatch || 0),
              (o = e.streamInits || []));
          },
          incrementDroppedEvents: () => {
            n++;
          },
          setEventsInLastBatch: (e) => {
            r = e;
          },
          recordStreamInit: (e, t, n) => {
            o.push({ timestamp: e, failed: t, durationMillis: n });
          },
          reset: i,
        }
      );
    },
    e2 = function (e, t, n, r, o, i, a) {
      let l = !!e.diagnosticUseCombinedEvent,
        s = "ld:" + o + ":$diagnostics",
        u = eQ(i.eventsUrl, "/events/diagnostic/" + o),
        c = i.diagnosticRecordingInterval,
        f,
        d,
        p = !!i.streaming,
        g = {};
      function v() {
        let t;
        return {
          sdk:
            ((t = { ...e.diagnosticSdkData }),
            i.wrapperName && (t.wrapperName = i.wrapperName),
            i.wrapperVersion && (t.wrapperVersion = i.wrapperVersion),
            t),
          configuration: {
            customBaseURI: i.baseUrl !== eY.baseUrl.default,
            customStreamURI: i.streamUrl !== eY.streamUrl.default,
            customEventsURI: i.eventsUrl !== eY.eventsUrl.default,
            eventsCapacity: i.eventCapacity,
            eventsFlushIntervalMillis: i.flushInterval,
            reconnectTimeMillis: i.streamReconnectDelay,
            streamingDisabled: !p,
            allAttributesPrivate: !!i.allAttributesPrivate,
            diagnosticRecordingIntervalMillis: i.diagnosticRecordingInterval,
            usingSecureMode: !!i.hash,
            bootstrapMode: !!i.bootstrap,
            fetchGoalsDisabled: !i.fetchGoals,
            sendEventsOnlyForVariation: !!i.sendEventsOnlyForVariation,
          },
          platform: e.diagnosticPlatformData,
        };
      }
      function m(e) {
        (i.logger && i.logger.debug(Y.debugPostingDiagnosticEvent(e)),
          r
            .sendEvents(e, u, !0)
            .then(() => {})
            .catch(() => {}));
      }
      function h() {
        let e, r;
        (m(
          ((r = {
            kind: l ? "diagnostic-combined" : "diagnostic",
            id: a,
            creationDate: (e = new Date().getTime()),
            ...n.getProps(),
          }),
          l && (r = { ...r, ...v() }),
          n.reset(e),
          r),
        ),
          (d = setTimeout(h, c)),
          (f = new Date().getTime()),
          l &&
            (function () {
              if (t.isEnabled()) {
                let e = { ...n.getProps() };
                t.set(s, JSON.stringify(e));
              }
            })());
      }
      return (
        (g.start = () => {
          l
            ? (function (e) {
                if (!t.isEnabled()) return e(!1);
                t.get(s)
                  .then((t) => {
                    if (t)
                      try {
                        let e = JSON.parse(t);
                        (n.setProps(e), (f = e.dataSinceDate));
                      } catch (e) {}
                    e(!0);
                  })
                  .catch(() => {
                    e(!1);
                  });
              })((e) => {
                if (e) {
                  let e = (f || 0) + c,
                    t = new Date().getTime();
                  t >= e ? h() : (d = setTimeout(h, e - t));
                } else
                  0 === Math.floor(4 * Math.random())
                    ? h()
                    : (d = setTimeout(h, c));
              })
            : (m({
                kind: "diagnostic-init",
                id: a,
                creationDate: n.getProps().dataSinceDate,
                ...v(),
              }),
              (d = setTimeout(h, c)));
        }),
        (g.stop = () => {
          d && clearTimeout(d);
        }),
        (g.setStreaming = (e) => {
          p = e;
        }),
        g
      );
    },
    e5 = function (e, t) {
      let n = !1,
        r = {
          type: e.type,
          name: e.name,
          synchronous: e.synchronous,
          method: (...o) => {
            try {
              e.method(...o);
            } catch {
              n || ((n = !0), t.warn(Y.inspectorMethodError(r.type, r.name)));
            }
          },
        };
      return r;
    };
  let { onNextTick: e6 } = S,
    e4 = {
      flagUsed: "flag-used",
      flagDetailsChanged: "flag-details-changed",
      flagDetailChanged: "flag-detail-changed",
      clientIdentityChanged: "client-identity-changed",
    };
  Object.freeze(e4);
  let { LDTimeoutError: e3 } = f,
    e8 = "unknown hook";
  function e7(e, t, n, r, o) {
    try {
      return r();
    } catch (r) {
      return (
        e?.error(`An error was encountered in "${t}" of the "${n}" hook: ${r}`),
        o
      );
    }
  }
  function e9(e, t) {
    try {
      return t.getMetadata().name || e8;
    } catch {
      return (
        e.error(
          "Exception thrown getting metadata for hook. Unable to get hook name.",
        ),
        e8
      );
    }
  }
  var te = function (e, t) {
      let n = t ? [...t] : [];
      return {
        withEvaluation: function (t, r, o, i) {
          if (0 === n.length) return i();
          let a = [...n],
            l = { flagKey: t, context: r, defaultValue: o },
            s = a.map((t) =>
              e7(
                e,
                "beforeEvaluation",
                e9(e, t),
                () => t?.beforeEvaluation?.(l, {}) ?? {},
                {},
              ),
            ),
            u = i();
          return (
            (function (e, t, n, r, o) {
              for (let i = t.length - 1; i >= 0; i -= 1) {
                let a = t[i],
                  l = r[i];
                e7(
                  e,
                  "afterEvaluation",
                  e9(e, a),
                  () => a?.afterEvaluation?.(n, l, o) ?? {},
                  {},
                );
              }
            })(e, a, l, s, u),
            u
          );
        },
        identify: function (t, r) {
          let o = [...n],
            i = { context: t, timeout: r },
            a = o.map((t) =>
              e7(
                e,
                "beforeIdentify",
                e9(e, t),
                () => t?.beforeIdentify?.(i, {}) ?? {},
                {},
              ),
            );
          return (t) => {
            for (let n = o.length - 1; n >= 0; n -= 1) {
              let r = o[n],
                l = a[n];
              e7(
                e,
                "afterIdentify",
                e9(e, r),
                () => r?.afterIdentify?.(i, l, t) ?? {},
                {},
              );
            }
          };
        },
        addHook: function (e) {
          n.push(e);
        },
        afterTrack: function (t) {
          if (0 !== n.length) {
            var r = [...n];
            for (let n = r.length - 1; n >= 0; n -= 1) {
              let o = r[n];
              e7(e, "afterTrack", e9(e, o), () => o?.afterTrack?.(t), void 0);
            }
          }
        },
      };
    },
    tt = function () {
      let e,
        t = {};
      function n(n) {
        return e && S.objectHasOwnProperty(e, n) && e[n]
          ? e[n]
          : t && S.objectHasOwnProperty(t, n) && t[n] && !t[n].deleted
            ? t[n]
            : null;
      }
      return {
        clearAllOverrides: function () {
          if (!e) return {};
          let t = { ...e };
          return ((e = void 0), t);
        },
        get: n,
        getFlagOverrides: function () {
          return e || {};
        },
        getFlags: function () {
          return t;
        },
        getFlagsWithOverrides: function () {
          let r = {};
          for (let e in t) {
            let t = n(e);
            t && (r[e] = t);
          }
          if (e)
            for (let t in e) {
              let e = n(t);
              e && (r[t] = e);
            }
          return r;
        },
        removeOverride: function (t) {
          e &&
            e[t] &&
            (delete e[t], 0 === Object.keys(e).length && (e = void 0));
        },
        setFlags: function (e) {
          t = { ...e };
        },
        setOverride: function (t, n) {
          (e || (e = {}), (e[t] = { value: n }));
        },
      };
    };
  let tn = "unknown plugin";
  function tr(e, t) {
    try {
      return t.getMetadata().name || tn;
    } catch (t) {
      return (
        e.error(
          "Exception thrown getting metadata for plugin. Unable to get plugin name.",
        ),
        tn
      );
    }
  }
  let { commonBasicLogger: to } = G,
    { checkContext: ti, getContextKeys: ta } = ev,
    { InspectorTypes: tl, InspectorManager: ts } = {
      InspectorTypes: e4,
      InspectorManager: function (e, t) {
        let n = {},
          r = {
            [e4.flagUsed]: [],
            [e4.flagDetailsChanged]: [],
            [e4.flagDetailChanged]: [],
            [e4.clientIdentityChanged]: [],
          },
          o = {
            [e4.flagUsed]: [],
            [e4.flagDetailsChanged]: [],
            [e4.flagDetailChanged]: [],
            [e4.clientIdentityChanged]: [],
          },
          i = e && e.map((e) => e5(e, t));
        return (
          i &&
            i.forEach((e) => {
              Object.prototype.hasOwnProperty.call(r, e.type) && !e.synchronous
                ? r[e.type].push(e)
                : Object.prototype.hasOwnProperty.call(o, e.type) &&
                    e.synchronous
                  ? o[e.type].push(e)
                  : t.warn(Y.invalidInspector(e.type, e.name));
            }),
          (n.hasListeners = (e) =>
            (r[e] && r[e].length) || (o[e] && o[e].length)),
          (n.onFlagUsed = (e, t, n) => {
            let i = e4.flagUsed;
            (o[i].length && o[i].forEach((r) => r.method(e, t, n)),
              r[i].length &&
                e6(() => {
                  r[i].forEach((r) => r.method(e, t, n));
                }));
          }),
          (n.onFlags = (e) => {
            let t = e4.flagDetailsChanged;
            (o[t].length && o[t].forEach((t) => t.method(e)),
              r[t].length &&
                e6(() => {
                  r[t].forEach((t) => t.method(e));
                }));
          }),
          (n.onFlagChanged = (e, t) => {
            let n = e4.flagDetailChanged;
            (o[n].length && o[n].forEach((n) => n.method(e, t)),
              r[n].length &&
                e6(() => {
                  r[n].forEach((n) => n.method(e, t));
                }));
          }),
          (n.onIdentityChanged = (e) => {
            let t = e4.clientIdentityChanged;
            (o[t].length && o[t].forEach((t) => t.method(e)),
              r[t].length &&
                e6(() => {
                  r[t].forEach((t) => t.method(e));
                }));
          }),
          n
        );
      },
    },
    {
      getPluginHooks: tu,
      registerPlugins: tc,
      registerPluginsForDebugOverride: tf,
      createPluginEnvironment: td,
    } = {
      getPluginHooks: function (e, t, n) {
        let r = [];
        return (
          n.forEach((n) => {
            try {
              let o = n.getHooks?.(t);
              void 0 === o
                ? e.error(
                    `Plugin ${tr(e, n)} returned undefined from getHooks.`,
                  )
                : o && o.length > 0 && r.push(...o);
            } catch (t) {
              e.error(
                `Exception thrown getting hooks for plugin ${tr(e, n)}. Unable to get hooks.`,
              );
            }
          }),
          r
        );
      },
      registerPlugins: function (e, t, n, r) {
        r.forEach((r) => {
          try {
            r.register(n, t);
          } catch (t) {
            e.error(`Exception thrown registering plugin ${tr(e, r)}.`);
          }
        });
      },
      registerPluginsForDebugOverride: function (e, t, n) {
        n.forEach((n) => {
          try {
            n.registerDebug?.(t);
          } catch (t) {
            e.error(
              `Exception thrown registering debug override with plugin ${tr(e, n)}.`,
            );
          }
        });
      },
      createPluginEnvironment: function (e, t, n) {
        let r = {};
        (e.userAgent && (r.name = e.userAgent),
          e.version && (r.version = e.version),
          n.wrapperName && (r.wrapperName = n.wrapperName),
          n.wrapperVersion && (r.wrapperVersion = n.wrapperVersion));
        let o = {};
        n.application &&
          (n.application.name && (o.name = n.application.name),
          n.application.version && (o.version = n.application.version));
        let i = { sdk: r, clientSideId: t };
        return (Object.keys(o).length > 0 && (i.application = o), i);
      },
    },
    tp = "change",
    tg = "internal-change";
  var tv = function (e, t, n, r, o) {
    var i;
    let a,
      l,
      s,
      u,
      c,
      d =
        n && n.logger
          ? n.logger
          : (o && o.logger && o.logger.default) || to("warn"),
      p = eD(d),
      g = eT(p),
      v = eo.validate(n, p, o, d),
      m = ts(v.inspectors, d),
      h = v.sendEvents,
      y = e,
      b = v.hash,
      w = [...v.plugins],
      x = td(r, e, v),
      k = tu(d, x, w),
      E = te(d, [...v.hooks, ...k]),
      O = eL(r.localStorage, d),
      C = ec(r, y, v),
      P = v.sendEvents && !v.diagnosticOptOut,
      D = P ? e0(y) : null,
      I = P ? e1(new Date().getTime()) : null,
      j = P ? e2(r, O, I, C, y, v, D) : null,
      F = eH(r, v, y, I),
      T = v.eventProcessor || eP(r, v, y, I, p, C),
      R = eJ(r, v, y),
      L = tt(),
      U,
      A,
      $,
      N = v.streaming,
      M = !1,
      V = !1,
      H = !0,
      z = v.stateProvider,
      K = eW(null, function (e) {
        (!z &&
          e &&
          J({
            kind: "identify",
            context: e,
            creationDate: new Date().getTime(),
          }),
          m.hasListeners(tl.clientIdentityChanged) &&
            m.onIdentityChanged(K.getContext()));
      }),
      q = new eZ(O),
      _ = O.isEnabled() ? eR(O, y, b, K) : null;
    function J(e) {
      y &&
        ((z && z.enqueueEvent && z.enqueueEvent(e)) ||
          (e.context
            ? ((H = !1),
              !h ||
                V ||
                r.isDoNotTrack() ||
                (d.debug(Y.debugEnqueueingEvent(e.kind)), T.enqueue(e)))
            : H && (d.warn(Y.eventWithoutContext()), (H = !1))));
    }
    function W(e, t) {
      m.hasListeners(tl.flagDetailChanged) && m.onFlagChanged(e.key, Q(t));
    }
    function B() {
      m.hasListeners(tl.flagDetailsChanged) &&
        m.onFlags(
          Object.entries(L.getFlagsWithOverrides())
            .map(([e, t]) => ({ key: e, detail: Q(t) }))
            .reduce((e, t) => ((e[t.key] = t.detail), e), {}),
        );
    }
    function G(e, t, n, r) {
      let o = K.getContext(),
        i = new Date(),
        a = {
          kind: "feature",
          key: e,
          context: o,
          value: t ? t.value : null,
          variation: t ? t.variationIndex : null,
          default: n,
          creationDate: i.getTime(),
        },
        l = L.getFlags()[e];
      (l &&
        ((a.version = l.flagVersion ? l.flagVersion : l.version),
        (a.trackEvents = l.trackEvents),
        (a.debugEventsUntilDate = l.debugEventsUntilDate)),
        (r || (l && l.trackReason)) && t && (a.reason = t.reason),
        J(a));
    }
    function Z(e) {
      return ti(e, !1)
        ? Promise.resolve(e)
        : Promise.reject(new f.LDInvalidUserError(Y.invalidContext()));
    }
    function X(e, t, n, r, o, i) {
      var a;
      let l,
        s = L.get(e);
      return (
        s
          ? ((l = Q(s)),
            (null !== s.value && void 0 !== s.value) || (l.value = t))
          : (l = {
              value: t,
              variationIndex: null,
              reason: { kind: "ERROR", errorKind: "FLAG_NOT_FOUND" },
            }),
        n &&
          (o ||
            s?.prerequisites?.forEach((e) => {
              X(e, void 0, n, !1, !1, !1);
            }),
          G(e, l, t, r)),
        !o &&
          i &&
          ((a = l),
          m.hasListeners(tl.flagUsed) && m.onFlagUsed(e, a, K.getContext())),
        l
      );
    }
    function Q(e) {
      return {
        value: e.value,
        variationIndex: void 0 === e.variation ? null : e.variation,
        reason: e.reason || null,
      };
    }
    function ee() {
      if (((A = !0), !K.getContext())) return;
      let e = (e) => {
        try {
          return JSON.parse(e);
        } catch (e) {
          return void p.maybeReportError(
            new f.LDInvalidDataError(Y.invalidData()),
          );
        }
      };
      F.connect(K.getContext(), b, {
        ping: function () {
          d.debug(Y.debugStreamPing());
          let e = K.getContext();
          R.fetchFlagSettings(e, b)
            .then((t) => {
              S.deepEquals(e, K.getContext()) && en(t || {});
            })
            .catch((e) => {
              p.maybeReportError(
                new f.LDFlagFetchError(Y.errorFetchingFlags(e)),
              );
            });
        },
        put: function (t) {
          let n = e(t.data);
          n && (d.debug(Y.debugStreamPut()), en(n));
        },
        patch: function (t) {
          let n = e(t.data);
          if (!n) return;
          let r = L.getFlags(),
            o = r[n.key];
          if (o && o.version && n.version && !(o.version < n.version))
            d.debug(Y.debugStreamPatchIgnored(n.key));
          else {
            d.debug(Y.debugStreamPatch(n.key));
            let e = {},
              t = S.extend({}, n);
            (delete t.key, (r[n.key] = t), L.setFlags(r));
            let i = Q(t);
            ((e[n.key] = o
              ? { previous: o.value, current: i }
              : { current: i }),
              W(n, t),
              er(e));
          }
        },
        delete: function (t) {
          let n = e(t.data);
          if (!n) return;
          let r = L.getFlags();
          if (!r[n.key] || r[n.key].version < n.version) {
            d.debug(Y.debugStreamDelete(n.key));
            let e = {};
            (r[n.key] &&
              !r[n.key].deleted &&
              (e[n.key] = { previous: r[n.key].value }),
              (r[n.key] = { version: n.version, deleted: !0 }),
              L.setFlags(r),
              W(n, r[n.key]),
              er(e));
          } else d.debug(Y.debugStreamDeleteIgnored(n.key));
        },
      });
    }
    function et() {
      A && (F.disconnect(), (A = !1));
    }
    function en(e) {
      let t = {};
      if (!e) return Promise.resolve();
      let n = L.getFlags();
      for (let r in n)
        S.objectHasOwnProperty(n, r) &&
          n[r] &&
          (e[r] && !S.deepEquals(e[r].value, n[r].value)
            ? (t[r] = { previous: n[r].value, current: Q(e[r]) })
            : (e[r] && !e[r].deleted) || (t[r] = { previous: n[r].value }));
      for (let r in e)
        S.objectHasOwnProperty(e, r) &&
          e[r] &&
          (!n[r] || n[r].deleted) &&
          (t[r] = { current: Q(e[r]) });
      return (L.setFlags({ ...e }), B(), er(t).catch(() => {}));
    }
    function er(e) {
      let t = Object.keys(e);
      if (t.length > 0) {
        let n = {};
        (t.forEach((t) => {
          let r = e[t].current,
            o = r ? r.value : void 0,
            i = e[t].previous;
          (p.emit(tp + ":" + t, o, i),
            (n[t] = r ? { current: o, previous: i } : { previous: i }));
        }),
          p.emit(tp, n),
          p.emit(tg, L.getFlagsWithOverrides()),
          v.sendEventsOnlyForVariation ||
            z ||
            t.forEach((t) => {
              G(t, e[t].current);
            }));
      }
      return U && _ ? _.saveFlags(L.getFlags()) : Promise.resolve();
    }
    function ei() {
      let e = N || ($ && void 0 === N);
      (e && !A ? ee() : !e && A && et(), j && j.setStreaming(e));
    }
    function ea(e) {
      return e === tp || e.substr(0, 7) === tp + ":";
    }
    if (
      ("string" == typeof v.bootstrap &&
        "LOCALSTORAGE" === v.bootstrap.toUpperCase() &&
        (_ ? (U = !0) : d.warn(Y.localStorageUnavailable())),
      "object" == typeof v.bootstrap &&
        L.setFlags(
          ((a = Object.keys((i = v.bootstrap))),
          (s = "$valid"),
          (u = i[(l = "$flagsState")]) ||
            !a.length ||
            d.warn(Y.bootstrapOldFormat()),
          !1 === i[s] && d.warn(Y.bootstrapInvalid()),
          (c = {}),
          a.forEach((e) => {
            if (e !== l && e !== s) {
              let t = { value: i[e] };
              (u && u[e] ? (t = S.extend(t, u[e])) : (t.version = 0),
                (c[e] = t));
            }
          }),
          c),
        ),
      z)
    ) {
      let e = z.getInitialState();
      (e ? el(e) : z.on("init", el),
        z.on("update", function (e) {
          (e.context && K.setContext(e.context), e.flags && en(e.flags));
        }));
    } else {
      let n;
      (!e
        ? Promise.reject(
            new f.LDInvalidEnvironmentIdError(Y.environmentNotSpecified()),
          )
        : q
            .processContext(t)
            .then(Z)
            .then((e) => ((n = S.once(E.identify(e, void 0))), e))
            .then(
              (e) => (
                n?.({ status: "completed" }),
                K.setContext(e),
                "object" == typeof v.bootstrap
                  ? es()
                  : U
                    ? _.loadFlags().then((e) =>
                        null == e
                          ? (L.setFlags({}),
                            R.fetchFlagSettings(K.getContext(), b)
                              .then((e) => en(e || {}))
                              .then(es)
                              .catch((e) => {
                                eu(
                                  new f.LDFlagFetchError(
                                    Y.errorFetchingFlags(e),
                                  ),
                                );
                              }))
                          : (L.setFlags(e),
                            S.onNextTick(es),
                            R.fetchFlagSettings(K.getContext(), b)
                              .then((e) => en(e))
                              .catch((e) => p.maybeReportError(e))),
                      )
                    : R.fetchFlagSettings(K.getContext(), b)
                        .then((e) => {
                          (L.setFlags(e || {}), B(), es());
                        })
                        .catch((e) => {
                          (L.setFlags({}), eu(e));
                        })
              ),
            )
            .catch((e) => {
              throw (n?.({ status: "error" }), e);
            })
      ).catch(eu);
    }
    function el(e) {
      ((y = e.environment),
        K.setContext(e.context),
        L.setFlags({ ...e.flags }),
        S.onNextTick(es));
    }
    function es() {
      (d.info(Y.clientInitialized()), (M = !0), ei(), g.signalSuccess());
    }
    function eu(e) {
      g.signalFailure(e);
    }
    let ef = {
      waitForInitialization: function (e) {
        if (null != e) {
          if ("number" == typeof e) {
            let t;
            return (
              e > 5 &&
                d.warn(
                  "The waitForInitialization function was called with a timeout greater than 5 seconds. We recommend a timeout of 5 seconds or less.",
                ),
              (t = g.getInitializationPromise()),
              Promise.race([
                new Promise((t, n) => {
                  setTimeout(() => {
                    n(
                      new e3(
                        `waitForInitialization timed out after ${e} seconds.`,
                      ),
                    );
                  }, 1e3 * e);
                }),
                t,
              ]).catch((e) => {
                throw (
                  e instanceof f.LDTimeoutError &&
                    d.error(`waitForInitialization error: ${e}`),
                  e
                );
              })
            );
          }
          d.warn(
            "The waitForInitialization method was provided with a non-numeric timeout.",
          );
        }
        return (
          d.warn(
            "The waitForInitialization function was called without a timeout specified. In a future version a default timeout will be applied.",
          ),
          g.getInitializationPromise()
        );
      },
      waitUntilReady: () => g.getReadyPromise(),
      identify: function (e, t, n) {
        let r;
        if (V) return S.wrapPromiseCallback(Promise.resolve({}), n);
        if (z)
          return (
            d.warn(Y.identifyDisabled()),
            S.wrapPromiseCallback(
              Promise.resolve(
                S.transformVersionedValuesToValues(L.getFlagsWithOverrides()),
              ),
              n,
            )
          );
        let o = U && _ ? _.clearFlags() : Promise.resolve();
        return S.wrapPromiseCallback(
          o
            .then(() => q.processContext(e))
            .then(Z)
            .then((e) => ((r = S.once(E.identify(e, void 0))), e))
            .then((e) =>
              R.fetchFlagSettings(e, t).then((n) => {
                let r = S.transformVersionedValuesToValues(n);
                return (K.setContext(e), (b = t), n ? en(n).then(() => r) : r);
              }),
            )
            .then((e) => (r?.({ status: "completed" }), A && ee(), e))
            .catch(
              (e) => (
                r?.({ status: "error" }),
                p.maybeReportError(e),
                Promise.reject(e)
              ),
            ),
          n,
        );
      },
      getContext: function () {
        return K.getContext();
      },
      variation: function (e, t) {
        let { value: n } = E.withEvaluation(e, K.getContext(), t, () =>
          X(e, t, !0, !1, !1, !0),
        );
        return n;
      },
      variationDetail: function (e, t) {
        return E.withEvaluation(e, K.getContext(), t, () =>
          X(e, t, !0, !0, !1, !0),
        );
      },
      track: function (e, t, n) {
        if ("string" != typeof e)
          return void p.maybeReportError(
            new f.LDInvalidEventKeyError(Y.unknownCustomEventKey(e)),
          );
        (void 0 !== n &&
          "number" != typeof n &&
          d.warn(Y.invalidMetricValue(typeof n)),
          r.customEventFilter &&
            !r.customEventFilter(e) &&
            d.warn(Y.unknownCustomEventKey(e)));
        let o = K.getContext(),
          i = {
            kind: "custom",
            key: e,
            context: o,
            url: r.getCurrentUrl(),
            creationDate: new Date().getTime(),
          };
        (o &&
          o.anonymous &&
          (i.contextKind = o.anonymous ? "anonymousUser" : "user"),
          null != t && (i.data = t),
          null != n && (i.metricValue = n),
          J(i),
          E.afterTrack({ context: o, key: e, data: t, metricValue: n }));
      },
      on: function (e, t, n) {
        ea(e) ? (($ = !0), M && ei(), p.on(e, t, n)) : p.on(...arguments);
      },
      off: function (e) {
        if ((p.off(...arguments), ea(e))) {
          let e = !1;
          (p.getEvents().forEach((t) => {
            ea(t) && p.getEventListenerCount(t) > 0 && (e = !0);
          }),
            e || (($ = !1), A && void 0 === N && et()));
        }
      },
      setStreaming: function (e) {
        let t = null === e ? void 0 : e;
        t !== N && ((N = t), ei());
      },
      flush: function (e) {
        return S.wrapPromiseCallback(h ? T.flush() : Promise.resolve(), e);
      },
      allFlags: function () {
        let e = {},
          t = L.getFlagsWithOverrides();
        if (!t) return e;
        for (let n in t)
          e[n] = X(n, null, !v.sendEventsOnlyForVariation, !1, !0, !1).value;
        return e;
      },
      close: function (e) {
        if (V) return S.wrapPromiseCallback(Promise.resolve(), e);
        let t = () => {
            ((V = !0), L.setFlags({}));
          },
          n = Promise.resolve()
            .then(() => {
              if ((et(), j && j.stop(), h)) return (T.stop(), T.flush());
            })
            .then(t)
            .catch(t);
        return S.wrapPromiseCallback(n, e);
      },
      addHook: function (e) {
        E.addHook(e);
      },
    };
    return (
      tc(d, x, ef, w),
      tf(
        d,
        {
          setOverride: function (e, t) {
            let n = {},
              r = L.get(e),
              o = r ? r.value : null;
            if (o === t)
              return void d.debug(
                `setOverride: No change needed for ${e}, value already ${t}`,
              );
            L.setOverride(e, t);
            let i = L.get(e),
              a = Q(i);
            ((n[e] = { previous: o, current: a }), W({ key: e }, i), er(n));
          },
          removeOverride: function (e) {
            let t = L.getFlagOverrides();
            if (!t[e]) return;
            let n = {},
              r = t[e],
              o = L.getFlags()[e];
            ((n[e] = { previous: r.value, current: o ? Q(o) : void 0 }),
              L.removeOverride(e),
              W({ key: e }, o),
              er(n));
          },
          clearAllOverrides: function () {
            let e = L.getFlagOverrides();
            if (0 === Object.keys(e).length) return;
            let t = {},
              n = L.getFlags();
            (Object.keys(e).forEach((r) => {
              let o = e[r],
                i = n[r];
              t[r] = { previous: o.value, current: i ? Q(i) : void 0 };
            }),
              L.clearAllOverrides(),
              Object.keys(t).length > 0 && er(t));
          },
          getAllOverrides: function () {
            let e = L.getFlagOverrides();
            if (!e) return {};
            let t = {};
            return (
              Object.keys(e).forEach((n) => {
                let r = e[n];
                r && (t[n] = r.value);
              }),
              t
            );
          },
        },
        w,
      ),
      {
        client: ef,
        options: v,
        emitter: p,
        ident: K,
        logger: d,
        requestor: R,
        start: function () {
          h && (j && j.start(), T.start());
        },
        enqueueEvent: J,
        getFlagsInternal: function () {
          return L.getFlagsWithOverrides();
        },
        getEnvironmentId: () => y,
        internalChangeEventName: tg,
      }
    );
  };
  function tm(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function th(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? tm(Object(n), !0).forEach(function (t) {
            !(function (e, t, n) {
              var r;
              (t =
                "symbol" ==
                typeof (r = (function (e, t) {
                  if ("object" != typeof e || !e) return e;
                  var n = e[Symbol.toPrimitive];
                  if (void 0 !== n) {
                    var r = n.call(e, t || "default");
                    if ("object" != typeof r) return r;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return String(e);
                })(t, "string"))
                  ? r
                  : r + "") in e
                ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = n);
            })(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : tm(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t),
              );
            });
    }
    return e;
  }
  var ty = {
      promise: Promise.resolve({
        status: 200,
        header: function () {
          return null;
        },
        body: null,
      }),
    },
    tb = (e) => {
      if ("string" != typeof e) throw TypeError("Expected a string");
      return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    };
  function tw(e, t) {
    for (var n = {}, r = null, o = [], i = 0; i < e.length; i++)
      for (var a = e[i], l = a.urls || [], s = 0; s < l.length; s++)
        if (
          (function (e, t, n, r) {
            var o,
              i,
              a = (
                ("substring" === e.kind || "regex" === e.kind) &&
                r.includes("/")
                  ? t
                  : t.replace(r, "")
              ).replace(n, "");
            switch (e.kind) {
              case "exact":
                ((i = t), (o = RegExp("^" + tb(e.url) + "/?$")));
                break;
              case "canonical":
                ((i = a), (o = RegExp("^" + tb(e.url) + "/?$")));
                break;
              case "substring":
                ((i = a), (o = RegExp(".*" + tb(e.substring) + ".*$")));
                break;
              case "regex":
                ((i = a), (o = new RegExp(e.pattern)));
                break;
              default:
                return !1;
            }
            return o.test(i);
          })(
            l[s],
            window.location.href,
            window.location.search,
            window.location.hash,
          )
        ) {
          "pageview" === a.kind
            ? t("pageview", a)
            : (o.push(a), t("click_pageview", a));
          break;
        }
    return (
      o.length > 0 &&
        ((r = function (e) {
          for (
            var n = (function (e, t) {
                for (var n = [], r = 0; r < t.length; r++)
                  for (
                    var o = e.target,
                      i = t[r],
                      a = i.selector,
                      l = document.querySelectorAll(a);
                    o && l.length > 0;

                  ) {
                    for (var s = 0; s < l.length; s++) o === l[s] && n.push(i);
                    o = o.parentNode;
                  }
                return n;
              })(e, o),
              r = 0;
            r < n.length;
            r++
          )
            t("click", n[r]);
        }),
        document.addEventListener("click", r)),
      (n.dispose = function () {
        document.removeEventListener("click", r);
      }),
      n
    );
  }
  var tx = "goalsReady",
    tk = {
      fetchGoals: { default: !0 },
      hash: { type: "string" },
      eventProcessor: { type: "object" },
      eventUrlTransformer: { type: "function" },
      disableSyncEventPost: { default: !1 },
    },
    tE = e.i(499144);
  e.i(705927);
  let tO = (0, r.createContext)({
      flags: {},
      flagKeyMap: {},
      ldClient: void 0,
    }),
    { Provider: tS, Consumer: tC } = tO,
    tP = {
      useCamelCaseFlagKeys: !0,
      sendEventsOnFlagRead: !0,
      reactContext: tO,
    },
    tD = (e) => {
      var t;
      return null != (t = e.context) ? t : e.user;
    },
    tI = (e) => {
      let t = {};
      for (let n in e) 0 !== n.indexOf("$") && (t[(0, tE.default)(n)] = e[n]);
      return t;
    },
    tj = (e, t) => {
      let n = e.allFlags();
      return t
        ? Object.keys(t).reduce(
            (e, r) => (
              (e[r] = Object.prototype.hasOwnProperty.call(n, r) ? n[r] : t[r]),
              e
            ),
            {},
          )
        : n;
    };
  function tF(e, t, n = tP, r) {
    var o, i, a, l;
    let s =
        void 0 === r
          ? t
          : Object.keys(r).reduce((e, n) => (tT(t, n) && (e[n] = t[n]), e), {}),
      { useCamelCaseFlagKeys: u = !0 } = n,
      [c, f = {}] = u
        ? (function (e) {
            let t = {},
              n = {};
            for (let r in e) {
              if (0 === r.indexOf("$")) continue;
              let o = (0, tE.default)(r);
              ((t[o] = e[r]), (n[o] = r));
            }
            return [t, n];
          })(s)
        : [s];
    return {
      flags: n.sendEventsOnFlagRead
        ? ((o = e),
          (i = c),
          (a = f),
          (l = u),
          new Proxy(i, {
            get(e, t, n) {
              let r = Reflect.get(e, t, n),
                i = (l && tT(a, t)) || tT(e, t);
              if ("symbol" == typeof t || !i) return r;
              if (void 0 === r) return;
              let s = l ? a[t] : t;
              return o.variation(s, r);
            },
          }))
        : c,
      flagKeyMap: f,
    };
  }
  function tT(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  tI.camelCaseKeys = tI;
  let tR = {
    wrapperName: "react-client-sdk",
    wrapperVersion: "3.9.0",
    sendEventsOnlyForVariation: !0,
  };
  var tL = Object.defineProperty,
    tU = Object.defineProperties,
    tA = Object.getOwnPropertyDescriptors,
    t$ = Object.getOwnPropertySymbols,
    tN = Object.prototype.hasOwnProperty,
    tM = Object.prototype.propertyIsEnumerable,
    tV = (e, t, n) =>
      t in e
        ? tL(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
        : (e[t] = n),
    tH = (e, t) => {
      for (var n in t || (t = {})) tN.call(t, n) && tV(e, n, t[n]);
      if (t$) for (var n of t$(t)) tM.call(t, n) && tV(e, n, t[n]);
      return e;
    },
    tz = (e, t, n) =>
      new Promise((r, o) => {
        var i = (e) => {
            try {
              l(n.next(e));
            } catch (e) {
              o(e);
            }
          },
          a = (e) => {
            try {
              l(n.throw(e));
            } catch (e) {
              o(e);
            }
          },
          l = (e) =>
            e.done ? r(e.value) : Promise.resolve(e.value).then(i, a);
        l((n = n.apply(e, t)).next());
      });
  class tK extends r.Component {
    constructor(e) {
      (super(e),
        (this.getReactOptions = () => tH(tH({}, tP), this.props.reactOptions)),
        (this.subscribeToChanges = (e) => {
          let { flags: t } = this.props;
          e.on("change", (n) => {
            let r = this.getReactOptions(),
              o = ((e, t) => {
                let n = {};
                for (let r in e)
                  (t && void 0 === t[r]) || (n[r] = e[r].current);
                return n;
              })(n, t);
            Object.keys(o).length > 0 &&
              this.setState((n) => {
                let i = tH(tH({}, n.unproxiedFlags), o);
                return tH(
                  tU(tH({}, n), tA({ unproxiedFlags: i })),
                  tF(e, i, r, t),
                );
              });
          });
        }),
        (this.onFailed = (e, t) => {
          this.setState((e) => tU(tH({}, e), tA({ error: t })));
        }),
        (this.onReady = (e, t, n) => {
          let r = tj(e, n);
          this.setState((o) =>
            tH(tU(tH({}, o), tA({ unproxiedFlags: r })), tF(e, r, t, n)),
          );
        }),
        (this.prepareLDClient = () =>
          tz(this, null, function* () {
            var e;
            let { clientSideID: t, flags: n, options: r } = this.props,
              o = yield this.props.ldClient,
              i = this.getReactOptions(),
              a,
              l = this.state.unproxiedFlags;
            if (o) l = tj(o, n);
            else {
              o = (function (e, t) {
                var n =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : {},
                  r = (function (e) {
                    var t,
                      n = {
                        userAgentHeaderName: "X-LaunchDarkly-User-Agent",
                        synchronousFlush: !1,
                      };
                    if (window.XMLHttpRequest) {
                      var r = e && e.disableSyncEventPost;
                      n.httpRequest = function (e, t, o, i) {
                        var a = !r & n.synchronousFlush;
                        return (
                          (n.synchronousFlush = !1),
                          (function (e, t, n, r, o) {
                            if (
                              o &&
                              !(function () {
                                var e =
                                  window.navigator &&
                                  window.navigator.userAgent;
                                if (e) {
                                  var t = e.match(/Chrom(e|ium)\/([0-9]+)\./);
                                  if (t) return 73 > parseInt(t[2], 10);
                                }
                                return !0;
                              })()
                            )
                              return ty;
                            var i,
                              a = new window.XMLHttpRequest();
                            for (var l in (a.open(e, t, !o), n || {}))
                              Object.prototype.hasOwnProperty.call(n, l) &&
                                a.setRequestHeader(l, n[l]);
                            if (o) {
                              try {
                                a.send(r);
                              } catch (e) {}
                              return ty;
                            }
                            return {
                              promise: new Promise(function (e, t) {
                                (a.addEventListener("load", function () {
                                  i ||
                                    e({
                                      status: a.status,
                                      header: function (e) {
                                        return a.getResponseHeader(e);
                                      },
                                      body: a.responseText,
                                    });
                                }),
                                  a.addEventListener("error", function () {
                                    i || t(Error());
                                  }),
                                  a.send(r));
                              }),
                              cancel: function () {
                                ((i = !0), a.abort());
                              },
                            };
                          })(e, t, o, i, a)
                        );
                      };
                    }
                    ((n.httpAllowsPost = function () {
                      return (
                        void 0 === t &&
                          (t =
                            !!window.XMLHttpRequest &&
                            "withCredentials" in new window.XMLHttpRequest()),
                        t
                      );
                    }),
                      (n.httpFallbackPing = function (e) {
                        new window.Image().src = e;
                      }));
                    var o,
                      i = e && e.eventUrlTransformer;
                    ((n.getCurrentUrl = function () {
                      return i ? i(window.location.href) : window.location.href;
                    }),
                      (n.isDoNotTrack = function () {
                        var e;
                        return (
                          1 ===
                            (e =
                              window.navigator &&
                              void 0 !== window.navigator.doNotTrack
                                ? window.navigator.doNotTrack
                                : window.navigator &&
                                    void 0 !== window.navigator.msDoNotTrack
                                  ? window.navigator.msDoNotTrack
                                  : window.doNotTrack) ||
                          !0 === e ||
                          "1" === e ||
                          "yes" === e
                        );
                      }));
                    try {
                      window.localStorage &&
                        (n.localStorage = {
                          get: function (e) {
                            return new Promise(function (t) {
                              t(window.localStorage.getItem(e));
                            });
                          },
                          set: function (e, t) {
                            return new Promise(function (n) {
                              (window.localStorage.setItem(e, t), n());
                            });
                          },
                          clear: function (e) {
                            return new Promise(function (t) {
                              (window.localStorage.removeItem(e), t());
                            });
                          },
                        });
                    } catch (e) {
                      n.localStorage = null;
                    }
                    return (
                      e &&
                      e.useReport &&
                      "function" == typeof window.EventSourcePolyfill &&
                      window.EventSourcePolyfill.supportedOptions &&
                      window.EventSourcePolyfill.supportedOptions.method
                        ? ((n.eventSourceAllowsReport = !0),
                          (o = window.EventSourcePolyfill))
                        : ((n.eventSourceAllowsReport = !1),
                          (o = window.EventSource)),
                      window.EventSource &&
                        ((n.eventSourceFactory = function (e, t) {
                          var n = th(
                            th(
                              {},
                              {
                                heartbeatTimeout: 3e5,
                                silentTimeout: 3e5,
                                skipDefaultHeaders: !0,
                              },
                            ),
                            t,
                          );
                          return new o(e, n);
                        }),
                        (n.eventSourceIsActive = function (e) {
                          return (
                            e.readyState === window.EventSource.OPEN ||
                            e.readyState === window.EventSource.CONNECTING
                          );
                        })),
                      (n.userAgent = "JSClient"),
                      (n.version = "3.9.0"),
                      (n.diagnosticSdkData = {
                        name: "js-client-sdk",
                        version: "3.9.0",
                      }),
                      (n.diagnosticPlatformData = { name: "JS" }),
                      (n.diagnosticUseCombinedEvent = !0),
                      n
                    );
                  })(n),
                  o = tv(e, t, n, r, tk),
                  i = o.client,
                  a = o.options,
                  l = o.emitter,
                  s = new Promise(function (e) {
                    var t = l.on(tx, function () {
                      (l.off(tx, t), e());
                    });
                  });
                ((i.waitUntilGoalsReady = function () {
                  return s;
                }),
                  a.fetchGoals
                    ? (function (e, t) {
                        var n, r;
                        function o() {
                          (r && r.dispose(), n && n.length && (r = tw(n, i)));
                        }
                        function i(t, n) {
                          var r = e.ident.getContext(),
                            o = {
                              kind: t,
                              key: n.key,
                              data: null,
                              url: window.location.href,
                              creationDate: new Date().getTime(),
                              context: r,
                            };
                          return (
                            "click" === t && (o.selector = n.selector),
                            e.enqueueEvent(o)
                          );
                        }
                        e.requestor
                          .fetchJSON("/sdk/goals/" + e.getEnvironmentId())
                          .then(function (e) {
                            (e &&
                              e.length > 0 &&
                              ((r = tw((n = e), i)),
                              (function (e) {
                                var t,
                                  n = window.location.href;
                                function r() {
                                  (t = window.location.href) !== n &&
                                    ((n = t), e());
                                }
                                (!(function e(t, n) {
                                  (t(),
                                    setTimeout(function () {
                                      e(t, n);
                                    }, n));
                                })(r, 300),
                                  window.history && window.history.pushState
                                    ? window.addEventListener("popstate", r)
                                    : window.addEventListener("hashchange", r));
                              })(o)),
                              t());
                          })
                          .catch(function (n) {
                            (e.emitter.maybeReportError(
                              new f.LDUnexpectedResponseError(
                                (n && n.message, n.message),
                              ),
                            ),
                              t());
                          });
                      })(o, function () {
                        return l.emit(tx);
                      })
                    : l.emit(tx),
                  "complete" !== document.readyState
                    ? window.addEventListener("load", o.start)
                    : o.start());
                var u = function () {
                  ((r.synchronousFlush = !0),
                    i.flush().catch(function () {}),
                    (r.synchronousFlush = !1));
                };
                return (
                  document.addEventListener("visibilitychange", function () {
                    "hidden" === document.visibilityState && u();
                  }),
                  window.addEventListener("pagehide", u),
                  i
                );
              })(
                t,
                null != (e = tD(this.props))
                  ? e
                  : { anonymous: !0, kind: "user" },
                tH(tH({}, tR), r),
              );
              try {
                (yield o.waitForInitialization(this.props.timeout),
                  (l = tj(o, n)));
              } catch (e) {
                (null == (a = e)
                  ? void 0
                  : a.name.toLowerCase().includes("timeout")) &&
                  (o.on("failed", this.onFailed),
                  o.on("ready", () => {
                    this.onReady(o, i, n);
                  }));
              }
            }
            (this.setState((e) => {
              let t;
              return (
                (t = tH(
                  tU(tH({}, e), tA({ unproxiedFlags: l })),
                  tF(o, l, i, n),
                )),
                tU(t, tA({ ldClient: o, error: a }))
              );
            }),
              this.subscribeToChanges(o));
          })));
      let { options: t } = e;
      if (
        ((this.state = { flags: {}, unproxiedFlags: {}, flagKeyMap: {} }), t)
      ) {
        let { bootstrap: e } = t;
        if (e && "localStorage" !== e) {
          let { useCamelCaseFlagKeys: t } = this.getReactOptions();
          this.state = {
            flags: t ? tI(e) : e,
            unproxiedFlags: e,
            flagKeyMap: {},
          };
        }
      }
    }
    componentDidMount() {
      return tz(this, null, function* () {
        let { deferInitialization: e } = this.props;
        (e && !tD(this.props)) || (yield this.prepareLDClient());
      });
    }
    componentDidUpdate(e) {
      return tz(this, null, function* () {
        let { deferInitialization: t } = this.props,
          n = !tD(e) && tD(this.props);
        t && n && (yield this.prepareLDClient());
      });
    }
    render() {
      let { flags: e, flagKeyMap: t, ldClient: n, error: o } = this.state,
        { reactContext: i } = this.getReactOptions();
      return r.default.createElement(
        i.Provider,
        { value: { flags: e, flagKeyMap: t, ldClient: n, error: o } },
        this.props.children,
      );
    }
  }
  (Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable);
  var tq = e.i(886813),
    t_ = e.i(998898);
  let tJ = (e) => {
    let t,
      o,
      i = (0, n.c)(5),
      { onStateChange: a } = e,
      l = (() => {
        let { flags: e } = (0, r.useContext)(tP.reactContext);
        return e;
      })(),
      s = (() => {
        let { ldClient: e } = (0, r.useContext)(tP.reactContext);
        return e;
      })();
    return (
      i[0] !== l || i[1] !== s || i[2] !== a
        ? ((t = () => {
            a({ flags: l, ldClient: s });
          }),
          (o = [l, s, a]),
          (i[0] = l),
          (i[1] = s),
          (i[2] = a),
          (i[3] = t),
          (i[4] = o))
        : ((t = i[3]), (o = i[4])),
      (0, r.useEffect)(t, o),
      null
    );
  };
  e.s(
    [
      "LaunchDarklyRuntime",
      0,
      (e) => {
        let r,
          o,
          i,
          a = (0, n.c)(7),
          { clientSideID: l, onStateChange: s } = e;
        return (
          a[0] !== l
            ? ((r = {
                clientSideID: l,
                context: (0, t_.e)({ deviceId: (0, tq.p)() }),
                options: {
                  streaming: !0,
                  evaluationReasons: !0,
                  flushInterval: 3e4,
                },
              }),
              (a[0] = l),
              (a[1] = r))
            : (r = a[1]),
          a[2] !== s
            ? ((o = (0, t.jsx)(tJ, { onStateChange: s })),
              (a[2] = s),
              (a[3] = o))
            : (o = a[3]),
          a[4] !== r || a[5] !== o
            ? ((i = (0, t.jsx)(tK, { ...r, children: o })),
              (a[4] = r),
              (a[5] = o),
              (a[6] = i))
            : (i = a[6]),
          i
        );
      },
    ],
    775991,
  );
};
