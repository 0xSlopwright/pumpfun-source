// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = crypto;
  e.s(["U", 0, t, "L", 0, (e) => e instanceof CryptoKey], 568873);
  let r = async (e, r) => {
    let i = `SHA-${e.slice(-3)}`;
    return new Uint8Array(await t.subtle.digest(i, r));
  };
  e.s(["f", 0, r], 63437);
  let i = new TextEncoder(),
    a = new TextDecoder();
  function n(...e) {
    let t = new Uint8Array(e.reduce((e, { length: t }) => e + t, 0)),
      r = 0;
    return (
      e.forEach((e) => {
        (t.set(e, r), (r += e.length));
      }),
      t
    );
  }
  function s(e, t, r) {
    if (t < 0 || t >= 0x100000000)
      throw RangeError(`value must be >= 0 and <= 4294967295. Received ${t}`);
    e.set([t >>> 24, t >>> 16, t >>> 8, 255 & t], r);
  }
  function o(e) {
    let t = new Uint8Array(4);
    return (s(t, e), t);
  }
  async function d(e, t, i) {
    let a = Math.ceil((t >> 3) / 32),
      n = new Uint8Array(32 * a);
    for (let t = 0; t < a; t++) {
      let a = new Uint8Array(4 + e.length + i.length);
      (a.set(o(t + 1)),
        a.set(e, 4),
        a.set(i, 4 + e.length),
        n.set(await r("sha256", a), 32 * t));
    }
    return n.slice(0, t >> 3);
  }
  e.s(
    [
      "w",
      0,
      n,
      "p",
      0,
      d,
      "P",
      0,
      a,
      "h",
      0,
      i,
      "F",
      0,
      function (e) {
        return n(o(e.length), e);
      },
      "r",
      0,
      function (e, t) {
        return n(i.encode(e), new Uint8Array([0]), t);
      },
      "T",
      0,
      o,
      "U",
      0,
      function (e) {
        let t = Math.floor(e / 0x100000000),
          r = new Uint8Array(8);
        return (s(r, t, 0), s(r, e % 0x100000000, 4), r);
      },
    ],
    521446,
  );
  let l = (e) => {
      let t = e;
      "string" == typeof t && (t = i.encode(t));
      let r = [];
      for (let e = 0; e < t.length; e += 32768)
        r.push(String.fromCharCode.apply(null, t.subarray(e, e + 32768)));
      return btoa(r.join(""));
    },
    c = (e) => l(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"),
    u = (e) => {
      let t = atob(e),
        r = new Uint8Array(t.length);
      for (let e = 0; e < t.length; e++) r[e] = t.charCodeAt(e);
      return r;
    },
    h = (e) => {
      let t = e;
      (t instanceof Uint8Array && (t = a.decode(t)),
        (t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")));
      try {
        return u(t);
      } catch (e) {
        throw TypeError("The input to be decoded is not correctly encoded.");
      }
    };
  (e.s(["G", 0, h, "F", 0, u, "q", 0, c, "Y", 0, l], 854301),
    e.s(["decode", 0, h, "encode", 0, c], 39793),
    e.s(
      [
        "f",
        0,
        function (e) {
          if (
            "object" != typeof e ||
            null === e ||
            "[object Object]" !== Object.prototype.toString.call(e)
          )
            return !1;
          if (null === Object.getPrototypeOf(e)) return !0;
          let t = e;
          for (; null !== Object.getPrototypeOf(t); )
            t = Object.getPrototypeOf(t);
          return Object.getPrototypeOf(e) === t;
        },
      ],
      491894,
    ));
};
