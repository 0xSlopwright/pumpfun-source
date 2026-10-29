// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e =
    "object" == typeof globalThis && "crypto" in globalThis
      ? globalThis.crypto
      : void 0;
  function r(t) {
    return (
      t instanceof Uint8Array ||
      (ArrayBuffer.isView(t) && "Uint8Array" === t.constructor.name)
    );
  }
  function n(t) {
    if (!Number.isSafeInteger(t) || t < 0)
      throw Error("positive integer expected, got " + t);
  }
  function i(t, ...e) {
    if (!r(t)) throw Error("Uint8Array expected");
    if (e.length > 0 && !e.includes(t.length))
      throw Error(
        "Uint8Array expected of length " + e + ", got length=" + t.length,
      );
  }
  let o =
      68 === new Uint8Array(new Uint32Array([0x11223344]).buffer)[0]
        ? (t) => t
        : function (t) {
            for (let r = 0; r < t.length; r++) {
              var e;
              t[r] =
                (((e = t[r]) << 24) & 0xff000000) |
                ((e << 8) & 0xff0000) |
                ((e >>> 8) & 65280) |
                ((e >>> 24) & 255);
            }
            return t;
          },
    s =
      "function" == typeof Uint8Array.from([]).toHex &&
      "function" == typeof Uint8Array.fromHex,
    f = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
  function h(t) {
    return t >= 48 && t <= 57
      ? t - 48
      : t >= 65 && t <= 70
        ? t - 55
        : t >= 97 && t <= 102
          ? t - 87
          : void 0;
  }
  function a(t) {
    if ("string" != typeof t) throw Error("string expected");
    return new Uint8Array(new TextEncoder().encode(t));
  }
  function u(t) {
    return ("string" == typeof t && (t = a(t)), i(t), t);
  }
  t.s(
    [
      "B",
      0,
      class {},
      "C",
      0,
      i,
      "s",
      0,
      function (t, e = !0) {
        if (t.destroyed) throw Error("Hash instance has been destroyed");
        if (e && t.finished)
          throw Error("Hash#digest() has already been called");
      },
      "v",
      0,
      function (t) {
        if ("function" != typeof t || "function" != typeof t.create)
          throw Error("Hash should be wrapped by utils.createHasher");
        (n(t.outputLen), n(t.blockLen));
      },
      "N",
      0,
      n,
      "W",
      0,
      function (t, e) {
        i(t);
        let r = e.outputLen;
        if (t.length < r)
          throw Error(
            "digestInto() expects output buffer of length at least " + r,
          );
      },
      "w",
      0,
      function (t) {
        if ((i(t), s)) return t.toHex();
        let e = "";
        for (let r = 0; r < t.length; r++) e += f[t[r]];
        return e;
      },
      "d",
      0,
      function (t, e) {
        if (void 0 !== e && "[object Object]" !== {}.toString.call(e))
          throw Error("options should be object or undefined");
        return Object.assign(t, e);
      },
      "f",
      0,
      function (...t) {
        for (let e = 0; e < t.length; e++) t[e].fill(0);
      },
      "t",
      0,
      function (...t) {
        let e = 0;
        for (let r = 0; r < t.length; r++) {
          let n = t[r];
          (i(n), (e += n.length));
        }
        let r = new Uint8Array(e);
        for (let e = 0, n = 0; e < t.length; e++) {
          let i = t[e];
          (r.set(i, n), (n += i.length));
        }
        return r;
      },
      "O",
      0,
      function (t) {
        let e = (e) => t().update(u(e)).digest(),
          r = t();
        return (
          (e.outputLen = r.outputLen),
          (e.blockLen = r.blockLen),
          (e.create = () => t()),
          e
        );
      },
      "y",
      0,
      function (t) {
        return new DataView(t.buffer, t.byteOffset, t.byteLength);
      },
      "i",
      0,
      function (t) {
        let e = (e, r) => t(r).update(u(e)).digest(),
          r = t({});
        return (
          (e.outputLen = r.outputLen),
          (e.blockLen = r.blockLen),
          (e.create = (e) => t(e)),
          e
        );
      },
      "X",
      0,
      function (t) {
        if ("string" != typeof t)
          throw Error("hex string expected, got " + typeof t);
        if (s) return Uint8Array.fromHex(t);
        let e = t.length,
          r = e / 2;
        if (e % 2)
          throw Error("hex string expected, got unpadded hex of length " + e);
        let n = new Uint8Array(r);
        for (let e = 0, i = 0; e < r; e++, i += 2) {
          let r = h(t.charCodeAt(i)),
            o = h(t.charCodeAt(i + 1));
          if (void 0 === r || void 0 === o)
            throw Error(
              'hex string expected, got non-hex character "' +
                (t[i] + t[i + 1]) +
                '" at index ' +
                i,
            );
          n[e] = 16 * r + o;
        }
        return n;
      },
      "g",
      0,
      r,
      "R",
      0,
      function (t) {
        return ("string" == typeof t && (t = a(t)), i(t), t);
      },
      "a",
      0,
      function (t = 32) {
        if (e && "function" == typeof e.getRandomValues)
          return e.getRandomValues(new Uint8Array(t));
        if (e && "function" == typeof e.randomBytes)
          return Uint8Array.from(e.randomBytes(t));
        throw Error("crypto.getRandomValues must be defined");
      },
      "h",
      0,
      function (t, e) {
        return (t << e) | ((t >>> (32 - e)) >>> 0);
      },
      "M",
      0,
      function (t, e) {
        return (t << (32 - e)) | (t >>> e);
      },
      "o",
      0,
      o,
      "D",
      0,
      u,
      "b",
      0,
      function (t) {
        return new Uint32Array(
          t.buffer,
          t.byteOffset,
          Math.floor(t.byteLength / 4),
        );
      },
      "k",
      0,
      a,
    ],
    944445,
  );
};
