// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  let i = t.r(210102),
    n = t.r(962866),
    s =
      "function" == typeof Symbol && "function" == typeof Symbol.for
        ? Symbol.for("nodejs.util.inspect.custom")
        : null;
  function o(t) {
    if (t > 0x7fffffff)
      throw RangeError('The value "' + t + '" is invalid for option "size"');
    let e = new Uint8Array(t);
    return (Object.setPrototypeOf(e, a.prototype), e);
  }
  function a(t, e, r) {
    if ("number" == typeof t) {
      if ("string" == typeof e)
        throw TypeError(
          'The "string" argument must be of type string. Received type number',
        );
      return l(t);
    }
    return u(t, e, r);
  }
  function u(t, e, r) {
    if ("string" == typeof t) {
      var i = t,
        n = e;
      if (
        (("string" != typeof n || "" === n) && (n = "utf8"), !a.isEncoding(n))
      )
        throw TypeError("Unknown encoding: " + n);
      let r = 0 | p(i, n),
        s = o(r),
        u = s.write(i, n);
      return (u !== r && (s = s.slice(0, u)), s);
    }
    if (ArrayBuffer.isView(t)) {
      var s = t;
      if (N(s, Uint8Array)) {
        let t = new Uint8Array(s);
        return f(t.buffer, t.byteOffset, t.byteLength);
      }
      return h(s);
    }
    if (null == t)
      throw TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
          typeof t,
      );
    if (
      N(t, ArrayBuffer) ||
      (t && N(t.buffer, ArrayBuffer)) ||
      ("u" > typeof SharedArrayBuffer &&
        (N(t, SharedArrayBuffer) || (t && N(t.buffer, SharedArrayBuffer))))
    )
      return f(t, e, r);
    if ("number" == typeof t)
      throw TypeError(
        'The "value" argument must not be of type number. Received type number',
      );
    let u = t.valueOf && t.valueOf();
    if (null != u && u !== t) return a.from(u, e, r);
    let c = (function (t) {
      if (a.isBuffer(t)) {
        let e = 0 | d(t.length),
          r = o(e);
        return (0 === r.length || t.copy(r, 0, 0, e), r);
      }
      if (void 0 !== t.length) {
        var e;
        return "number" != typeof t.length || (e = t.length) != e ? o(0) : h(t);
      }
      if ("Buffer" === t.type && Array.isArray(t.data)) return h(t.data);
    })(t);
    if (c) return c;
    if (
      "u" > typeof Symbol &&
      null != Symbol.toPrimitive &&
      "function" == typeof t[Symbol.toPrimitive]
    )
      return a.from(t[Symbol.toPrimitive]("string"), e, r);
    throw TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
        typeof t,
    );
  }
  function c(t) {
    if ("number" != typeof t)
      throw TypeError('"size" argument must be of type number');
    if (t < 0)
      throw RangeError('The value "' + t + '" is invalid for option "size"');
  }
  function l(t) {
    return (c(t), o(t < 0 ? 0 : 0 | d(t)));
  }
  function h(t) {
    let e = t.length < 0 ? 0 : 0 | d(t.length),
      r = o(e);
    for (let i = 0; i < e; i += 1) r[i] = 255 & t[i];
    return r;
  }
  function f(t, e, r) {
    let i;
    if (e < 0 || t.byteLength < e)
      throw RangeError('"offset" is outside of buffer bounds');
    if (t.byteLength < e + (r || 0))
      throw RangeError('"length" is outside of buffer bounds');
    return (
      Object.setPrototypeOf(
        (i =
          void 0 === e && void 0 === r
            ? new Uint8Array(t)
            : void 0 === r
              ? new Uint8Array(t, e)
              : new Uint8Array(t, e, r)),
        a.prototype,
      ),
      i
    );
  }
  function d(t) {
    if (t >= 0x7fffffff)
      throw RangeError(
        "Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes",
      );
    return 0 | t;
  }
  function p(t, e) {
    if (a.isBuffer(t)) return t.length;
    if (ArrayBuffer.isView(t) || N(t, ArrayBuffer)) return t.byteLength;
    if ("string" != typeof t)
      throw TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
          typeof t,
      );
    let r = t.length,
      i = arguments.length > 2 && !0 === arguments[2];
    if (!i && 0 === r) return 0;
    let n = !1;
    for (;;)
      switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;
        case "utf8":
        case "utf-8":
          return C(t).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * r;
        case "hex":
          return r >>> 1;
        case "base64":
          return O(t).length;
        default:
          if (n) return i ? -1 : C(t).length;
          ((e = ("" + e).toLowerCase()), (n = !0));
      }
  }
  function g(t, e, r) {
    let n = !1;
    if (
      ((void 0 === e || e < 0) && (e = 0),
      e > this.length ||
        ((void 0 === r || r > this.length) && (r = this.length),
        r <= 0 || (r >>>= 0) <= (e >>>= 0)))
    )
      return "";
    for (t || (t = "utf8"); ; )
      switch (t) {
        case "hex":
          return (function (t, e, r) {
            let i = t.length;
            ((!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i));
            let n = "";
            for (let i = e; i < r; ++i) n += z[t[i]];
            return n;
          })(this, e, r);
        case "utf8":
        case "utf-8":
          return w(this, e, r);
        case "ascii":
          return (function (t, e, r) {
            let i = "";
            r = Math.min(t.length, r);
            for (let n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
            return i;
          })(this, e, r);
        case "latin1":
        case "binary":
          return (function (t, e, r) {
            let i = "";
            r = Math.min(t.length, r);
            for (let n = e; n < r; ++n) i += String.fromCharCode(t[n]);
            return i;
          })(this, e, r);
        case "base64":
          var s, o, a;
          return (
            (s = this),
            (o = e),
            (a = r),
            0 === o && a === s.length
              ? i.fromByteArray(s)
              : i.fromByteArray(s.slice(o, a))
          );
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return (function (t, e, r) {
            let i = t.slice(e, r),
              n = "";
            for (let t = 0; t < i.length - 1; t += 2)
              n += String.fromCharCode(i[t] + 256 * i[t + 1]);
            return n;
          })(this, e, r);
        default:
          if (n) throw TypeError("Unknown encoding: " + t);
          ((t = (t + "").toLowerCase()), (n = !0));
      }
  }
  function m(t, e, r) {
    let i = t[e];
    ((t[e] = t[r]), (t[r] = i));
  }
  function y(t, e, r, i, n) {
    var s;
    if (0 === t.length) return -1;
    if (
      ("string" == typeof r
        ? ((i = r), (r = 0))
        : r > 0x7fffffff
          ? (r = 0x7fffffff)
          : r < -0x80000000 && (r = -0x80000000),
      (s = r *= 1) != s && (r = n ? 0 : t.length - 1),
      r < 0 && (r = t.length + r),
      r >= t.length)
    )
      if (n) return -1;
      else r = t.length - 1;
    else if (r < 0)
      if (!n) return -1;
      else r = 0;
    if (("string" == typeof e && (e = a.from(e, i)), a.isBuffer(e)))
      return 0 === e.length ? -1 : b(t, e, r, i, n);
    if ("number" == typeof e) {
      if (((e &= 255), "function" == typeof Uint8Array.prototype.indexOf))
        if (n) return Uint8Array.prototype.indexOf.call(t, e, r);
        else return Uint8Array.prototype.lastIndexOf.call(t, e, r);
      return b(t, [e], r, i, n);
    }
    throw TypeError("val must be string, number or Buffer");
  }
  function b(t, e, r, i, n) {
    let s,
      o = 1,
      a = t.length,
      u = e.length;
    if (
      void 0 !== i &&
      ("ucs2" === (i = String(i).toLowerCase()) ||
        "ucs-2" === i ||
        "utf16le" === i ||
        "utf-16le" === i)
    ) {
      if (t.length < 2 || e.length < 2) return -1;
      ((o = 2), (a /= 2), (u /= 2), (r /= 2));
    }
    function c(t, e) {
      return 1 === o ? t[e] : t.readUInt16BE(e * o);
    }
    if (n) {
      let i = -1;
      for (s = r; s < a; s++)
        if (c(t, s) === c(e, -1 === i ? 0 : s - i)) {
          if ((-1 === i && (i = s), s - i + 1 === u)) return i * o;
        } else (-1 !== i && (s -= s - i), (i = -1));
    } else
      for (r + u > a && (r = a - u), s = r; s >= 0; s--) {
        let r = !0;
        for (let i = 0; i < u; i++)
          if (c(t, s + i) !== c(e, i)) {
            r = !1;
            break;
          }
        if (r) return s;
      }
    return -1;
  }
  function w(t, e, r) {
    r = Math.min(t.length, r);
    let i = [],
      n = e;
    for (; n < r; ) {
      let e = t[n],
        s = null,
        o = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
      if (n + o <= r) {
        let r, i, a, u;
        switch (o) {
          case 1:
            e < 128 && (s = e);
            break;
          case 2:
            (192 & (r = t[n + 1])) == 128 &&
              (u = ((31 & e) << 6) | (63 & r)) > 127 &&
              (s = u);
            break;
          case 3:
            ((r = t[n + 1]),
              (i = t[n + 2]),
              (192 & r) == 128 &&
                (192 & i) == 128 &&
                (u = ((15 & e) << 12) | ((63 & r) << 6) | (63 & i)) > 2047 &&
                (u < 55296 || u > 57343) &&
                (s = u));
            break;
          case 4:
            ((r = t[n + 1]),
              (i = t[n + 2]),
              (a = t[n + 3]),
              (192 & r) == 128 &&
                (192 & i) == 128 &&
                (192 & a) == 128 &&
                (u =
                  ((15 & e) << 18) |
                  ((63 & r) << 12) |
                  ((63 & i) << 6) |
                  (63 & a)) > 65535 &&
                u < 1114112 &&
                (s = u));
        }
      }
      (null === s
        ? ((s = 65533), (o = 1))
        : s > 65535 &&
          ((s -= 65536),
          i.push(((s >>> 10) & 1023) | 55296),
          (s = 56320 | (1023 & s))),
        i.push(s),
        (n += o));
    }
    var s = i;
    let o = s.length;
    if (o <= 4096) return String.fromCharCode.apply(String, s);
    let a = "",
      u = 0;
    for (; u < o; )
      a += String.fromCharCode.apply(String, s.slice(u, (u += 4096)));
    return a;
  }
  function k(t, e, r) {
    if (t % 1 != 0 || t < 0) throw RangeError("offset is not uint");
    if (t + e > r) throw RangeError("Trying to access beyond buffer length");
  }
  function v(t, e, r, i, n, s) {
    if (!a.isBuffer(t))
      throw TypeError('"buffer" argument must be a Buffer instance');
    if (e > n || e < s) throw RangeError('"value" argument is out of bounds');
    if (r + i > t.length) throw RangeError("Index out of range");
  }
  function S(t, e, r, i, n) {
    P(e, i, n, t, r, 7);
    let s = Number(e & BigInt(0xffffffff));
    ((t[r++] = s),
      (s >>= 8),
      (t[r++] = s),
      (s >>= 8),
      (t[r++] = s),
      (s >>= 8),
      (t[r++] = s));
    let o = Number((e >> BigInt(32)) & BigInt(0xffffffff));
    return (
      (t[r++] = o),
      (o >>= 8),
      (t[r++] = o),
      (o >>= 8),
      (t[r++] = o),
      (o >>= 8),
      (t[r++] = o),
      r
    );
  }
  function _(t, e, r, i, n) {
    P(e, i, n, t, r, 7);
    let s = Number(e & BigInt(0xffffffff));
    ((t[r + 7] = s),
      (s >>= 8),
      (t[r + 6] = s),
      (s >>= 8),
      (t[r + 5] = s),
      (s >>= 8),
      (t[r + 4] = s));
    let o = Number((e >> BigInt(32)) & BigInt(0xffffffff));
    return (
      (t[r + 3] = o),
      (o >>= 8),
      (t[r + 2] = o),
      (o >>= 8),
      (t[r + 1] = o),
      (o >>= 8),
      (t[r] = o),
      r + 8
    );
  }
  function I(t, e, r, i, n, s) {
    if (r + i > t.length || r < 0) throw RangeError("Index out of range");
  }
  function A(t, e, r, i, s) {
    return (
      (e *= 1),
      (r >>>= 0),
      s || I(t, e, r, 4, 34028234663852886e22, -34028234663852886e22),
      n.write(t, e, r, i, 23, 4),
      r + 4
    );
  }
  function E(t, e, r, i, s) {
    return (
      (e *= 1),
      (r >>>= 0),
      s || I(t, e, r, 8, 17976931348623157e292, -17976931348623157e292),
      n.write(t, e, r, i, 52, 8),
      r + 8
    );
  }
  ((r.Buffer = a),
    (r.SlowBuffer = function (t) {
      return (+t != t && (t = 0), a.alloc(+t));
    }),
    (r.INSPECT_MAX_BYTES = 50),
    (r.kMaxLength = 0x7fffffff),
    (a.TYPED_ARRAY_SUPPORT = (function () {
      try {
        let t = new Uint8Array(1),
          e = {
            foo: function () {
              return 42;
            },
          };
        return (
          Object.setPrototypeOf(e, Uint8Array.prototype),
          Object.setPrototypeOf(t, e),
          42 === t.foo()
        );
      } catch (t) {
        return !1;
      }
    })()),
    !a.TYPED_ARRAY_SUPPORT &&
      "u" > typeof console &&
      "function" == typeof console.error &&
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.",
      ),
    Object.defineProperty(a.prototype, "parent", {
      enumerable: !0,
      get: function () {
        if (a.isBuffer(this)) return this.buffer;
      },
    }),
    Object.defineProperty(a.prototype, "offset", {
      enumerable: !0,
      get: function () {
        if (a.isBuffer(this)) return this.byteOffset;
      },
    }),
    (a.poolSize = 8192),
    (a.from = function (t, e, r) {
      return u(t, e, r);
    }),
    Object.setPrototypeOf(a.prototype, Uint8Array.prototype),
    Object.setPrototypeOf(a, Uint8Array),
    (a.alloc = function (t, e, r) {
      return (c(t), t <= 0)
        ? o(t)
        : void 0 !== e
          ? "string" == typeof r
            ? o(t).fill(e, r)
            : o(t).fill(e)
          : o(t);
    }),
    (a.allocUnsafe = function (t) {
      return l(t);
    }),
    (a.allocUnsafeSlow = function (t) {
      return l(t);
    }),
    (a.isBuffer = function (t) {
      return null != t && !0 === t._isBuffer && t !== a.prototype;
    }),
    (a.compare = function (t, e) {
      if (
        (N(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
        N(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
        !a.isBuffer(t) || !a.isBuffer(e))
      )
        throw TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array',
        );
      if (t === e) return 0;
      let r = t.length,
        i = e.length;
      for (let n = 0, s = Math.min(r, i); n < s; ++n)
        if (t[n] !== e[n]) {
          ((r = t[n]), (i = e[n]));
          break;
        }
      return r < i ? -1 : +(i < r);
    }),
    (a.isEncoding = function (t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }),
    (a.concat = function (t, e) {
      let r;
      if (!Array.isArray(t))
        throw TypeError('"list" argument must be an Array of Buffers');
      if (0 === t.length) return a.alloc(0);
      if (void 0 === e) for (r = 0, e = 0; r < t.length; ++r) e += t[r].length;
      let i = a.allocUnsafe(e),
        n = 0;
      for (r = 0; r < t.length; ++r) {
        let e = t[r];
        if (N(e, Uint8Array))
          n + e.length > i.length
            ? (a.isBuffer(e) || (e = a.from(e)), e.copy(i, n))
            : Uint8Array.prototype.set.call(i, e, n);
        else if (a.isBuffer(e)) e.copy(i, n);
        else throw TypeError('"list" argument must be an Array of Buffers');
        n += e.length;
      }
      return i;
    }),
    (a.byteLength = p),
    (a.prototype._isBuffer = !0),
    (a.prototype.swap16 = function () {
      let t = this.length;
      if (t % 2 != 0)
        throw RangeError("Buffer size must be a multiple of 16-bits");
      for (let e = 0; e < t; e += 2) m(this, e, e + 1);
      return this;
    }),
    (a.prototype.swap32 = function () {
      let t = this.length;
      if (t % 4 != 0)
        throw RangeError("Buffer size must be a multiple of 32-bits");
      for (let e = 0; e < t; e += 4) (m(this, e, e + 3), m(this, e + 1, e + 2));
      return this;
    }),
    (a.prototype.swap64 = function () {
      let t = this.length;
      if (t % 8 != 0)
        throw RangeError("Buffer size must be a multiple of 64-bits");
      for (let e = 0; e < t; e += 8)
        (m(this, e, e + 7),
          m(this, e + 1, e + 6),
          m(this, e + 2, e + 5),
          m(this, e + 3, e + 4));
      return this;
    }),
    (a.prototype.toString = function () {
      let t = this.length;
      return 0 === t
        ? ""
        : 0 == arguments.length
          ? w(this, 0, t)
          : g.apply(this, arguments);
    }),
    (a.prototype.toLocaleString = a.prototype.toString),
    (a.prototype.equals = function (t) {
      if (!a.isBuffer(t)) throw TypeError("Argument must be a Buffer");
      return this === t || 0 === a.compare(this, t);
    }),
    (a.prototype.inspect = function () {
      let t = "",
        e = r.INSPECT_MAX_BYTES;
      return (
        (t = this.toString("hex", 0, e)
          .replace(/(.{2})/g, "$1 ")
          .trim()),
        this.length > e && (t += " ... "),
        "<Buffer " + t + ">"
      );
    }),
    s && (a.prototype[s] = a.prototype.inspect),
    (a.prototype.compare = function (t, e, r, i, n) {
      if (
        (N(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
        !a.isBuffer(t))
      )
        throw TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
            typeof t,
        );
      if (
        (void 0 === e && (e = 0),
        void 0 === r && (r = t ? t.length : 0),
        void 0 === i && (i = 0),
        void 0 === n && (n = this.length),
        e < 0 || r > t.length || i < 0 || n > this.length)
      )
        throw RangeError("out of range index");
      if (i >= n && e >= r) return 0;
      if (i >= n) return -1;
      if (e >= r) return 1;
      if (((e >>>= 0), (r >>>= 0), (i >>>= 0), (n >>>= 0), this === t))
        return 0;
      let s = n - i,
        o = r - e,
        u = Math.min(s, o),
        c = this.slice(i, n),
        l = t.slice(e, r);
      for (let t = 0; t < u; ++t)
        if (c[t] !== l[t]) {
          ((s = c[t]), (o = l[t]));
          break;
        }
      return s < o ? -1 : +(o < s);
    }),
    (a.prototype.includes = function (t, e, r) {
      return -1 !== this.indexOf(t, e, r);
    }),
    (a.prototype.indexOf = function (t, e, r) {
      return y(this, t, e, r, !0);
    }),
    (a.prototype.lastIndexOf = function (t, e, r) {
      return y(this, t, e, r, !1);
    }),
    (a.prototype.write = function (t, e, r, i) {
      var n, s, o, a, u, c, l, h;
      if (void 0 === e) ((i = "utf8"), (r = this.length), (e = 0));
      else if (void 0 === r && "string" == typeof e)
        ((i = e), (r = this.length), (e = 0));
      else if (isFinite(e))
        ((e >>>= 0),
          isFinite(r)
            ? ((r >>>= 0), void 0 === i && (i = "utf8"))
            : ((i = r), (r = void 0)));
      else
        throw Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported",
        );
      let f = this.length - e;
      if (
        ((void 0 === r || r > f) && (r = f),
        (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
      )
        throw RangeError("Attempt to write outside buffer bounds");
      i || (i = "utf8");
      let d = !1;
      for (;;)
        switch (i) {
          case "hex":
            return (function (t, e, r, i) {
              let n;
              r = Number(r) || 0;
              let s = t.length - r;
              i ? (i = Number(i)) > s && (i = s) : (i = s);
              let o = e.length;
              for (i > o / 2 && (i = o / 2), n = 0; n < i; ++n) {
                var a;
                let i = parseInt(e.substr(2 * n, 2), 16);
                if ((a = i) != a) break;
                t[r + n] = i;
              }
              return n;
            })(this, t, e, r);
          case "utf8":
          case "utf-8":
            return ((n = e), (s = r), U(C(t, this.length - n), this, n, s));
          case "ascii":
          case "latin1":
          case "binary":
            return (
              (o = e),
              (a = r),
              U(
                (function (t) {
                  let e = [];
                  for (let r = 0; r < t.length; ++r)
                    e.push(255 & t.charCodeAt(r));
                  return e;
                })(t),
                this,
                o,
                a,
              )
            );
          case "base64":
            return ((u = e), (c = r), U(O(t), this, u, c));
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return (
              (l = e),
              (h = r),
              U(
                (function (t, e) {
                  let r,
                    i,
                    n = [];
                  for (let s = 0; s < t.length && !((e -= 2) < 0); ++s)
                    ((i = (r = t.charCodeAt(s)) >> 8),
                      n.push(r % 256),
                      n.push(i));
                  return n;
                })(t, this.length - l),
                this,
                l,
                h,
              )
            );
          default:
            if (d) throw TypeError("Unknown encoding: " + i);
            ((i = ("" + i).toLowerCase()), (d = !0));
        }
    }),
    (a.prototype.toJSON = function () {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0),
      };
    }),
    (a.prototype.slice = function (t, e) {
      let r = this.length;
      ((t = ~~t),
        (e = void 0 === e ? r : ~~e),
        t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
        e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
        e < t && (e = t));
      let i = this.subarray(t, e);
      return (Object.setPrototypeOf(i, a.prototype), i);
    }),
    (a.prototype.readUintLE = a.prototype.readUIntLE =
      function (t, e, r) {
        ((t >>>= 0), (e >>>= 0), r || k(t, e, this.length));
        let i = this[t],
          n = 1,
          s = 0;
        for (; ++s < e && (n *= 256); ) i += this[t + s] * n;
        return i;
      }),
    (a.prototype.readUintBE = a.prototype.readUIntBE =
      function (t, e, r) {
        ((t >>>= 0), (e >>>= 0), r || k(t, e, this.length));
        let i = this[t + --e],
          n = 1;
        for (; e > 0 && (n *= 256); ) i += this[t + --e] * n;
        return i;
      }),
    (a.prototype.readUint8 = a.prototype.readUInt8 =
      function (t, e) {
        return ((t >>>= 0), e || k(t, 1, this.length), this[t]);
      }),
    (a.prototype.readUint16LE = a.prototype.readUInt16LE =
      function (t, e) {
        return (
          (t >>>= 0),
          e || k(t, 2, this.length),
          this[t] | (this[t + 1] << 8)
        );
      }),
    (a.prototype.readUint16BE = a.prototype.readUInt16BE =
      function (t, e) {
        return (
          (t >>>= 0),
          e || k(t, 2, this.length),
          (this[t] << 8) | this[t + 1]
        );
      }),
    (a.prototype.readUint32LE = a.prototype.readUInt32LE =
      function (t, e) {
        return (
          (t >>>= 0),
          e || k(t, 4, this.length),
          (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
            0x1000000 * this[t + 3]
        );
      }),
    (a.prototype.readUint32BE = a.prototype.readUInt32BE =
      function (t, e) {
        return (
          (t >>>= 0),
          e || k(t, 4, this.length),
          0x1000000 * this[t] +
            ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
        );
      }),
    (a.prototype.readBigUInt64LE = W(function (t) {
      T((t >>>= 0), "offset");
      let e = this[t],
        r = this[t + 7];
      (void 0 === e || void 0 === r) && R(t, this.length - 8);
      let i = e + 256 * this[++t] + 65536 * this[++t] + 0x1000000 * this[++t],
        n = this[++t] + 256 * this[++t] + 65536 * this[++t] + 0x1000000 * r;
      return BigInt(i) + (BigInt(n) << BigInt(32));
    })),
    (a.prototype.readBigUInt64BE = W(function (t) {
      T((t >>>= 0), "offset");
      let e = this[t],
        r = this[t + 7];
      (void 0 === e || void 0 === r) && R(t, this.length - 8);
      let i = 0x1000000 * e + 65536 * this[++t] + 256 * this[++t] + this[++t],
        n = 0x1000000 * this[++t] + 65536 * this[++t] + 256 * this[++t] + r;
      return (BigInt(i) << BigInt(32)) + BigInt(n);
    })),
    (a.prototype.readIntLE = function (t, e, r) {
      ((t >>>= 0), (e >>>= 0), r || k(t, e, this.length));
      let i = this[t],
        n = 1,
        s = 0;
      for (; ++s < e && (n *= 256); ) i += this[t + s] * n;
      return (i >= (n *= 128) && (i -= Math.pow(2, 8 * e)), i);
    }),
    (a.prototype.readIntBE = function (t, e, r) {
      ((t >>>= 0), (e >>>= 0), r || k(t, e, this.length));
      let i = e,
        n = 1,
        s = this[t + --i];
      for (; i > 0 && (n *= 256); ) s += this[t + --i] * n;
      return (s >= (n *= 128) && (s -= Math.pow(2, 8 * e)), s);
    }),
    (a.prototype.readInt8 = function (t, e) {
      return ((t >>>= 0), e || k(t, 1, this.length), 128 & this[t])
        ? -((255 - this[t] + 1) * 1)
        : this[t];
    }),
    (a.prototype.readInt16LE = function (t, e) {
      ((t >>>= 0), e || k(t, 2, this.length));
      let r = this[t] | (this[t + 1] << 8);
      return 32768 & r ? 0xffff0000 | r : r;
    }),
    (a.prototype.readInt16BE = function (t, e) {
      ((t >>>= 0), e || k(t, 2, this.length));
      let r = this[t + 1] | (this[t] << 8);
      return 32768 & r ? 0xffff0000 | r : r;
    }),
    (a.prototype.readInt32LE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 4, this.length),
        this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24)
      );
    }),
    (a.prototype.readInt32BE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 4, this.length),
        (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]
      );
    }),
    (a.prototype.readBigInt64LE = W(function (t) {
      T((t >>>= 0), "offset");
      let e = this[t],
        r = this[t + 7];
      return (
        (void 0 === e || void 0 === r) && R(t, this.length - 8),
        (BigInt(
          this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (r << 24),
        ) <<
          BigInt(32)) +
          BigInt(
            e + 256 * this[++t] + 65536 * this[++t] + 0x1000000 * this[++t],
          )
      );
    })),
    (a.prototype.readBigInt64BE = W(function (t) {
      T((t >>>= 0), "offset");
      let e = this[t],
        r = this[t + 7];
      return (
        (void 0 === e || void 0 === r) && R(t, this.length - 8),
        (BigInt((e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t]) <<
          BigInt(32)) +
          BigInt(
            0x1000000 * this[++t] + 65536 * this[++t] + 256 * this[++t] + r,
          )
      );
    })),
    (a.prototype.readFloatLE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 4, this.length),
        n.read(this, t, !0, 23, 4)
      );
    }),
    (a.prototype.readFloatBE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 4, this.length),
        n.read(this, t, !1, 23, 4)
      );
    }),
    (a.prototype.readDoubleLE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 8, this.length),
        n.read(this, t, !0, 52, 8)
      );
    }),
    (a.prototype.readDoubleBE = function (t, e) {
      return (
        (t >>>= 0),
        e || k(t, 8, this.length),
        n.read(this, t, !1, 52, 8)
      );
    }),
    (a.prototype.writeUintLE = a.prototype.writeUIntLE =
      function (t, e, r, i) {
        if (((t *= 1), (e >>>= 0), (r >>>= 0), !i)) {
          let i = Math.pow(2, 8 * r) - 1;
          v(this, t, e, r, i, 0);
        }
        let n = 1,
          s = 0;
        for (this[e] = 255 & t; ++s < r && (n *= 256); )
          this[e + s] = (t / n) & 255;
        return e + r;
      }),
    (a.prototype.writeUintBE = a.prototype.writeUIntBE =
      function (t, e, r, i) {
        if (((t *= 1), (e >>>= 0), (r >>>= 0), !i)) {
          let i = Math.pow(2, 8 * r) - 1;
          v(this, t, e, r, i, 0);
        }
        let n = r - 1,
          s = 1;
        for (this[e + n] = 255 & t; --n >= 0 && (s *= 256); )
          this[e + n] = (t / s) & 255;
        return e + r;
      }),
    (a.prototype.writeUint8 = a.prototype.writeUInt8 =
      function (t, e, r) {
        return (
          (t *= 1),
          (e >>>= 0),
          r || v(this, t, e, 1, 255, 0),
          (this[e] = 255 & t),
          e + 1
        );
      }),
    (a.prototype.writeUint16LE = a.prototype.writeUInt16LE =
      function (t, e, r) {
        return (
          (t *= 1),
          (e >>>= 0),
          r || v(this, t, e, 2, 65535, 0),
          (this[e] = 255 & t),
          (this[e + 1] = t >>> 8),
          e + 2
        );
      }),
    (a.prototype.writeUint16BE = a.prototype.writeUInt16BE =
      function (t, e, r) {
        return (
          (t *= 1),
          (e >>>= 0),
          r || v(this, t, e, 2, 65535, 0),
          (this[e] = t >>> 8),
          (this[e + 1] = 255 & t),
          e + 2
        );
      }),
    (a.prototype.writeUint32LE = a.prototype.writeUInt32LE =
      function (t, e, r) {
        return (
          (t *= 1),
          (e >>>= 0),
          r || v(this, t, e, 4, 0xffffffff, 0),
          (this[e + 3] = t >>> 24),
          (this[e + 2] = t >>> 16),
          (this[e + 1] = t >>> 8),
          (this[e] = 255 & t),
          e + 4
        );
      }),
    (a.prototype.writeUint32BE = a.prototype.writeUInt32BE =
      function (t, e, r) {
        return (
          (t *= 1),
          (e >>>= 0),
          r || v(this, t, e, 4, 0xffffffff, 0),
          (this[e] = t >>> 24),
          (this[e + 1] = t >>> 16),
          (this[e + 2] = t >>> 8),
          (this[e + 3] = 255 & t),
          e + 4
        );
      }),
    (a.prototype.writeBigUInt64LE = W(function (t, e = 0) {
      return S(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    })),
    (a.prototype.writeBigUInt64BE = W(function (t, e = 0) {
      return _(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    })),
    (a.prototype.writeIntLE = function (t, e, r, i) {
      if (((t *= 1), (e >>>= 0), !i)) {
        let i = Math.pow(2, 8 * r - 1);
        v(this, t, e, r, i - 1, -i);
      }
      let n = 0,
        s = 1,
        o = 0;
      for (this[e] = 255 & t; ++n < r && (s *= 256); )
        (t < 0 && 0 === o && 0 !== this[e + n - 1] && (o = 1),
          (this[e + n] = (((t / s) | 0) - o) & 255));
      return e + r;
    }),
    (a.prototype.writeIntBE = function (t, e, r, i) {
      if (((t *= 1), (e >>>= 0), !i)) {
        let i = Math.pow(2, 8 * r - 1);
        v(this, t, e, r, i - 1, -i);
      }
      let n = r - 1,
        s = 1,
        o = 0;
      for (this[e + n] = 255 & t; --n >= 0 && (s *= 256); )
        (t < 0 && 0 === o && 0 !== this[e + n + 1] && (o = 1),
          (this[e + n] = (((t / s) | 0) - o) & 255));
      return e + r;
    }),
    (a.prototype.writeInt8 = function (t, e, r) {
      return (
        (t *= 1),
        (e >>>= 0),
        r || v(this, t, e, 1, 127, -128),
        t < 0 && (t = 255 + t + 1),
        (this[e] = 255 & t),
        e + 1
      );
    }),
    (a.prototype.writeInt16LE = function (t, e, r) {
      return (
        (t *= 1),
        (e >>>= 0),
        r || v(this, t, e, 2, 32767, -32768),
        (this[e] = 255 & t),
        (this[e + 1] = t >>> 8),
        e + 2
      );
    }),
    (a.prototype.writeInt16BE = function (t, e, r) {
      return (
        (t *= 1),
        (e >>>= 0),
        r || v(this, t, e, 2, 32767, -32768),
        (this[e] = t >>> 8),
        (this[e + 1] = 255 & t),
        e + 2
      );
    }),
    (a.prototype.writeInt32LE = function (t, e, r) {
      return (
        (t *= 1),
        (e >>>= 0),
        r || v(this, t, e, 4, 0x7fffffff, -0x80000000),
        (this[e] = 255 & t),
        (this[e + 1] = t >>> 8),
        (this[e + 2] = t >>> 16),
        (this[e + 3] = t >>> 24),
        e + 4
      );
    }),
    (a.prototype.writeInt32BE = function (t, e, r) {
      return (
        (t *= 1),
        (e >>>= 0),
        r || v(this, t, e, 4, 0x7fffffff, -0x80000000),
        t < 0 && (t = 0xffffffff + t + 1),
        (this[e] = t >>> 24),
        (this[e + 1] = t >>> 16),
        (this[e + 2] = t >>> 8),
        (this[e + 3] = 255 & t),
        e + 4
      );
    }),
    (a.prototype.writeBigInt64LE = W(function (t, e = 0) {
      return S(
        this,
        t,
        e,
        -BigInt("0x8000000000000000"),
        BigInt("0x7fffffffffffffff"),
      );
    })),
    (a.prototype.writeBigInt64BE = W(function (t, e = 0) {
      return _(
        this,
        t,
        e,
        -BigInt("0x8000000000000000"),
        BigInt("0x7fffffffffffffff"),
      );
    })),
    (a.prototype.writeFloatLE = function (t, e, r) {
      return A(this, t, e, !0, r);
    }),
    (a.prototype.writeFloatBE = function (t, e, r) {
      return A(this, t, e, !1, r);
    }),
    (a.prototype.writeDoubleLE = function (t, e, r) {
      return E(this, t, e, !0, r);
    }),
    (a.prototype.writeDoubleBE = function (t, e, r) {
      return E(this, t, e, !1, r);
    }),
    (a.prototype.copy = function (t, e, r, i) {
      if (!a.isBuffer(t)) throw TypeError("argument should be a Buffer");
      if (
        (r || (r = 0),
        i || 0 === i || (i = this.length),
        e >= t.length && (e = t.length),
        e || (e = 0),
        i > 0 && i < r && (i = r),
        i === r || 0 === t.length || 0 === this.length)
      )
        return 0;
      if (e < 0) throw RangeError("targetStart out of bounds");
      if (r < 0 || r >= this.length) throw RangeError("Index out of range");
      if (i < 0) throw RangeError("sourceEnd out of bounds");
      (i > this.length && (i = this.length),
        t.length - e < i - r && (i = t.length - e + r));
      let n = i - r;
      return (
        this === t && "function" == typeof Uint8Array.prototype.copyWithin
          ? this.copyWithin(e, r, i)
          : Uint8Array.prototype.set.call(t, this.subarray(r, i), e),
        n
      );
    }),
    (a.prototype.fill = function (t, e, r, i) {
      let n;
      if ("string" == typeof t) {
        if (
          ("string" == typeof e
            ? ((i = e), (e = 0), (r = this.length))
            : "string" == typeof r && ((i = r), (r = this.length)),
          void 0 !== i && "string" != typeof i)
        )
          throw TypeError("encoding must be a string");
        if ("string" == typeof i && !a.isEncoding(i))
          throw TypeError("Unknown encoding: " + i);
        if (1 === t.length) {
          let e = t.charCodeAt(0);
          (("utf8" === i && e < 128) || "latin1" === i) && (t = e);
        }
      } else
        "number" == typeof t
          ? (t &= 255)
          : "boolean" == typeof t && (t = Number(t));
      if (e < 0 || this.length < e || this.length < r)
        throw RangeError("Out of range index");
      if (r <= e) return this;
      if (
        ((e >>>= 0),
        (r = void 0 === r ? this.length : r >>> 0),
        t || (t = 0),
        "number" == typeof t)
      )
        for (n = e; n < r; ++n) this[n] = t;
      else {
        let s = a.isBuffer(t) ? t : a.from(t, i),
          o = s.length;
        if (0 === o)
          throw TypeError(
            'The value "' + t + '" is invalid for argument "value"',
          );
        for (n = 0; n < r - e; ++n) this[n + e] = s[n % o];
      }
      return this;
    }));
  let x = {};
  function B(t, e, r) {
    x[t] = class extends r {
      constructor() {
        (super(),
          Object.defineProperty(this, "message", {
            value: e.apply(this, arguments),
            writable: !0,
            configurable: !0,
          }),
          (this.name = `${this.name} [${t}]`),
          this.stack,
          delete this.name);
      }
      get code() {
        return t;
      }
      set code(t) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: t,
          writable: !0,
        });
      }
      toString() {
        return `${this.name} [${t}]: ${this.message}`;
      }
    };
  }
  function M(t) {
    let e = "",
      r = t.length,
      i = +("-" === t[0]);
    for (; r >= i + 4; r -= 3) e = `_${t.slice(r - 3, r)}${e}`;
    return `${t.slice(0, r)}${e}`;
  }
  function P(t, e, r, i, n, s) {
    if (t > r || t < e) {
      let i,
        n = "bigint" == typeof e ? "n" : "";
      throw (
        (i =
          s > 3
            ? 0 === e || e === BigInt(0)
              ? `>= 0${n} and < 2${n} ** ${(s + 1) * 8}${n}`
              : `>= -(2${n} ** ${(s + 1) * 8 - 1}${n}) and < 2 ** ${(s + 1) * 8 - 1}${n}`
            : `>= ${e}${n} and <= ${r}${n}`),
        new x.ERR_OUT_OF_RANGE("value", i, t)
      );
    }
    (T(n, "offset"),
      (void 0 === i[n] || void 0 === i[n + s]) && R(n, i.length - (s + 1)));
  }
  function T(t, e) {
    if ("number" != typeof t) throw new x.ERR_INVALID_ARG_TYPE(e, "number", t);
  }
  function R(t, e, r) {
    if (Math.floor(t) !== t)
      throw (T(t, r), new x.ERR_OUT_OF_RANGE(r || "offset", "an integer", t));
    if (e < 0) throw new x.ERR_BUFFER_OUT_OF_BOUNDS();
    throw new x.ERR_OUT_OF_RANGE(r || "offset", `>= ${+!!r} and <= ${e}`, t);
  }
  (B(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function (t) {
      return t
        ? `${t} is outside of buffer bounds`
        : "Attempt to access memory outside buffer bounds";
    },
    RangeError,
  ),
    B(
      "ERR_INVALID_ARG_TYPE",
      function (t, e) {
        return `The "${t}" argument must be of type number. Received type ${typeof e}`;
      },
      TypeError,
    ),
    B(
      "ERR_OUT_OF_RANGE",
      function (t, e, r) {
        let i = `The value of "${t}" is out of range.`,
          n = r;
        return (
          Number.isInteger(r) && Math.abs(r) > 0x100000000
            ? (n = M(String(r)))
            : "bigint" == typeof r &&
              ((n = String(r)),
              (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) &&
                (n = M(n)),
              (n += "n")),
          (i += ` It must be ${e}. Received ${n}`)
        );
      },
      RangeError,
    ));
  let L = /[^+/0-9A-Za-z-_]/g;
  function C(t, e) {
    let r;
    e = e || 1 / 0;
    let i = t.length,
      n = null,
      s = [];
    for (let o = 0; o < i; ++o) {
      if ((r = t.charCodeAt(o)) > 55295 && r < 57344) {
        if (!n) {
          if (r > 56319 || o + 1 === i) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          }
          n = r;
          continue;
        }
        if (r < 56320) {
          ((e -= 3) > -1 && s.push(239, 191, 189), (n = r));
          continue;
        }
        r = (((n - 55296) << 10) | (r - 56320)) + 65536;
      } else n && (e -= 3) > -1 && s.push(239, 191, 189);
      if (((n = null), r < 128)) {
        if ((e -= 1) < 0) break;
        s.push(r);
      } else if (r < 2048) {
        if ((e -= 2) < 0) break;
        s.push((r >> 6) | 192, (63 & r) | 128);
      } else if (r < 65536) {
        if ((e -= 3) < 0) break;
        s.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
      } else if (r < 1114112) {
        if ((e -= 4) < 0) break;
        s.push(
          (r >> 18) | 240,
          ((r >> 12) & 63) | 128,
          ((r >> 6) & 63) | 128,
          (63 & r) | 128,
        );
      } else throw Error("Invalid code point");
    }
    return s;
  }
  function O(t) {
    return i.toByteArray(
      (function (t) {
        if ((t = (t = t.split("=")[0]).trim().replace(L, "")).length < 2)
          return "";
        for (; t.length % 4 != 0; ) t += "=";
        return t;
      })(t),
    );
  }
  function U(t, e, r, i) {
    let n;
    for (n = 0; n < i && !(n + r >= e.length) && !(n >= t.length); ++n)
      e[n + r] = t[n];
    return n;
  }
  function N(t, e) {
    return (
      t instanceof e ||
      (null != t &&
        null != t.constructor &&
        null != t.constructor.name &&
        t.constructor.name === e.name)
    );
  }
  let z = (function () {
    let t = "0123456789abcdef",
      e = Array(256);
    for (let r = 0; r < 16; ++r) {
      let i = 16 * r;
      for (let n = 0; n < 16; ++n) e[i + n] = t[r] + t[n];
    }
    return e;
  })();
  function W(t) {
    return "u" < typeof BigInt ? K : t;
  }
  function K() {
    throw Error("BigInt not supported");
  }
};
