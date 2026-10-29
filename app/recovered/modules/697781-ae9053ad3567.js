// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t;
  function r(e) {
    return (
      e instanceof Uint8Array ||
      (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
    );
  }
  function i(e, ...t) {
    if (!r(e)) throw Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length))
      throw Error(
        "Uint8Array expected of length " + t + ", got length=" + e.length,
      );
  }
  function a(e, t) {
    return (
      !!Array.isArray(t) &&
      (0 === t.length ||
        (e
          ? t.every((e) => "string" == typeof e)
          : t.every((e) => Number.isSafeInteger(e))))
    );
  }
  function n(e) {
    if ("function" != typeof e) throw Error("function expected");
    return !0;
  }
  function s(e, t) {
    if ("string" != typeof t) throw Error(`${e}: string expected`);
    return !0;
  }
  function o(e) {
    if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
  }
  function d(e) {
    if (!Array.isArray(e)) throw Error("array expected");
  }
  function l(e, t) {
    if (!a(!0, t)) throw Error(`${e}: array of strings expected`);
  }
  function c(e, t) {
    if (!a(!1, t)) throw Error(`${e}: array of numbers expected`);
  }
  function u(...e) {
    let t = (e) => e,
      r = (e, t) => (r) => e(t(r));
    return {
      encode: e.map((e) => e.encode).reduceRight(r, t),
      decode: e.map((e) => e.decode).reduce(r, t),
    };
  }
  function h(e) {
    let t = "string" == typeof e ? e.split("") : e,
      r = t.length;
    l("alphabet", t);
    let i = new Map(t.map((e, t) => [e, t]));
    return {
      encode: (i) => (
        d(i),
        i.map((i) => {
          if (!Number.isSafeInteger(i) || i < 0 || i >= r)
            throw Error(
              `alphabet.encode: digit index outside alphabet "${i}". Allowed: ${e}`,
            );
          return t[i];
        })
      ),
      decode: (t) => (
        d(t),
        t.map((t) => {
          s("alphabet.decode", t);
          let r = i.get(t);
          if (void 0 === r)
            throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
          return r;
        })
      ),
    };
  }
  function p(e = "") {
    return (
      s("join", e),
      {
        encode: (t) => (l("join.decode", t), t.join(e)),
        decode: (t) => (s("join.decode", t), t.split(e)),
      }
    );
  }
  function f(e, t = "=") {
    return (
      o(e),
      s("padding", t),
      {
        encode(r) {
          for (l("padding.encode", r); (r.length * e) % 8; ) r.push(t);
          return r;
        },
        decode(r) {
          l("padding.decode", r);
          let i = r.length;
          if ((i * e) % 8)
            throw Error(
              "padding: invalid, string should have whole number of bytes",
            );
          for (; i > 0 && r[i - 1] === t; i--)
            if (((i - 1) * e) % 8 == 0)
              throw Error("padding: invalid, string has too much padding");
          return r.slice(0, i);
        },
      }
    );
  }
  function y(e, t, r) {
    if (t < 2)
      throw Error(
        `convertRadix: invalid from=${t}, base cannot be less than 2`,
      );
    if (r < 2)
      throw Error(`convertRadix: invalid to=${r}, base cannot be less than 2`);
    if ((d(e), !e.length)) return [];
    let i = 0,
      a = [],
      n = Array.from(e, (e) => {
        if ((o(e), e < 0 || e >= t)) throw Error(`invalid integer: ${e}`);
        return e;
      }),
      s = n.length;
    for (;;) {
      let e = 0,
        o = !0;
      for (let a = i; a < s; a++) {
        let s = n[a],
          d = t * e,
          l = d + s;
        if (!Number.isSafeInteger(l) || d / t !== e || l - s !== d)
          throw Error("convertRadix: carry overflow");
        let c = l / r;
        e = l % r;
        let u = Math.floor(c);
        if (((n[a] = u), !Number.isSafeInteger(u) || u * r + e !== l))
          throw Error("convertRadix: carry overflow");
        o && (u ? (o = !1) : (i = a));
      }
      if ((a.push(e), o)) break;
    }
    for (let t = 0; t < e.length - 1 && 0 === e[t]; t++) a.push(0);
    return a.reverse();
  }
  let m = (e, t) => (0 === t ? e : m(t, e % t)),
    _ = (e, t) => e + (t - m(e, t)),
    g = (() => {
      let e = [];
      for (let t = 0; t < 40; t++) e.push(2 ** t);
      return e;
    })();
  function v(e, t, r, i) {
    if ((d(e), t <= 0 || t > 32)) throw Error(`convertRadix2: wrong from=${t}`);
    if (r <= 0 || r > 32) throw Error(`convertRadix2: wrong to=${r}`);
    if (_(t, r) > 32)
      throw Error(
        `convertRadix2: carry overflow from=${t} to=${r} carryBits=${_(t, r)}`,
      );
    let a = 0,
      n = 0,
      s = g[t],
      l = g[r] - 1,
      c = [];
    for (let i of e) {
      if ((o(i), i >= s))
        throw Error(`convertRadix2: invalid data word=${i} from=${t}`);
      if (((a = (a << t) | i), n + t > 32))
        throw Error(`convertRadix2: carry overflow pos=${n} from=${t}`);
      for (n += t; n >= r; n -= r) c.push(((a >> (n - r)) & l) >>> 0);
      let e = g[n];
      if (void 0 === e) throw Error("invalid carry");
      a &= e - 1;
    }
    if (((a = (a << (r - n)) & l), !i && n >= t)) throw Error("Excess padding");
    if (!i && a > 0) throw Error(`Non-zero padding: ${a}`);
    return (i && n > 0 && c.push(a >>> 0), c);
  }
  function $(e, t = !1) {
    if ((o(e), e <= 0 || e > 32))
      throw Error("radix2: bits should be in (0..32]");
    if (_(8, e) > 32 || _(e, 8) > 32) throw Error("radix2: carry overflow");
    return {
      encode: (i) => {
        if (!r(i)) throw Error("radix2.encode input should be Uint8Array");
        return v(Array.from(i), 8, e, !t);
      },
      decode: (r) => (c("radix2.decode", r), Uint8Array.from(v(r, e, 8, t))),
    };
  }
  let b = u($(5), h("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), f(5), p("")),
    w =
      "function" == typeof Uint8Array.from([]).toBase64 &&
      "function" == typeof Uint8Array.fromBase64,
    I = (e, t) => {
      if (
        (s("base64", e),
        e.length > 0 &&
          !(t ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/).test(e))
      )
        throw Error("invalid base64");
      return Uint8Array.fromBase64(e, {
        alphabet: t ? "base64url" : "base64",
        lastChunkHandling: "strict",
      });
    },
    k = w
      ? { encode: (e) => (i(e), e.toBase64()), decode: (e) => I(e, !1) }
      : u(
          $(6),
          h("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
          f(6),
          p(""),
        ),
    S = u(
      $(6),
      h("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
      p(""),
    ),
    T = w
      ? {
          encode: (e) => (i(e), e.toBase64({ alphabet: "base64url" })),
          decode: (e) => I(e, !0),
        }
      : u(
          $(6),
          h("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
          f(6),
          p(""),
        ),
    C = u(
      $(6),
      h("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
      p(""),
    ),
    E = u(
      (o(58),
      {
        encode: (e) => {
          if (!r(e)) throw Error("radix.encode input should be Uint8Array");
          return y(Array.from(e), 256, 58);
        },
        decode: (e) => (c("radix.decode", e), Uint8Array.from(y(e, 58, 256))),
      }),
      h("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),
      p(""),
    ),
    A = u(h("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), p("")),
    x =
      "function" == typeof Uint8Array.from([]).toHex &&
      "function" == typeof Uint8Array.fromHex
        ? {
            encode: (e) => (i(e), e.toHex()),
            decode: (e) => (s("hex", e), Uint8Array.fromHex(e)),
          }
        : u(
            $(4),
            h("0123456789abcdef"),
            p(""),
            (n(
              (t = (e) => {
                if ("string" != typeof e || e.length % 2 != 0)
                  throw TypeError(
                    `hex.decode: expected string, got ${typeof e} with length ${e.length}`,
                  );
                return e.toLowerCase();
              }),
            ),
            { encode: (e) => e, decode: (e) => t(e) }),
          );
  e.s([
    "O",
    0,
    b,
    "e",
    0,
    E,
    "t",
    0,
    k,
    "X",
    0,
    S,
    "c",
    0,
    T,
    "n",
    0,
    C,
    "Y",
    0,
    (e) => {
      var t;
      return u(
        ((t = (t) => e(e(t))),
        o(4),
        n(t),
        {
          encode(e) {
            if (!r(e))
              throw Error("checksum.encode: input should be Uint8Array");
            let i = t(e).slice(0, 4),
              a = new Uint8Array(e.length + 4);
            return (a.set(e), a.set(i, e.length), a);
          },
          decode(e) {
            if (!r(e))
              throw Error("checksum.decode: input should be Uint8Array");
            let i = e.slice(0, -4),
              a = e.slice(-4),
              n = t(i).slice(0, 4);
            for (let e = 0; e < 4; e++)
              if (n[e] !== a[e]) throw Error("Invalid checksum");
            return i;
          },
        }),
        E,
      );
    },
    "L",
    0,
    x,
  ]);
};
