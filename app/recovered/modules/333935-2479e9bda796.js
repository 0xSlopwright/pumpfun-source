// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t, r, n, i, s;
  var o,
    a,
    l,
    f,
    u,
    c = e.i(732486),
    d = e.i(445242),
    h = e.i(509836),
    b = e.i(184350);
  let p = ["email", "google_oauth", "twitter_oauth"];
  function g(e) {
    let t,
      r,
      n = (0, d.c)(5),
      { children: i } = e,
      { user: s } = (0, h.f)();
    s?.linkedAccounts;
    e: {
      let e;
      n[0] !== s?.linkedAccounts
        ? ((e = s?.linkedAccounts.find(y)),
          (n[0] = s?.linkedAccounts),
          (n[1] = e))
        : (e = n[1]);
      let r = e;
      if (r?.type === "email") {
        t = r.address;
        break e;
      }
      if (r?.type === "google_oauth") {
        t = r.email;
        break e;
      }
      t = void 0;
    }
    let o = t;
    return (
      n[2] !== i || n[3] !== o
        ? ((r = (0, c.jsx)(b.j.Provider, { value: o, children: i })),
          (n[2] = i),
          (n[3] = o),
          (n[4] = r))
        : (r = n[4]),
      r
    );
  }
  function y(e) {
    return p.includes(e.type);
  }
  var w = e.i(697453);
  function m(e) {
    let t,
      r,
      n,
      i = (0, d.c)(7),
      { children: s } = e,
      { user: o } = (0, h.f)();
    (o?.linkedAccounts,
      i[0] !== o?.linkedAccounts
        ? ((t = o?.linkedAccounts ?? []),
          (i[0] = o?.linkedAccounts),
          (i[1] = t))
        : (t = i[1]),
      i[2] !== t ? ((r = t.some(x)), (i[2] = t), (i[3] = r)) : (r = i[3]));
    let a = r;
    return (
      i[4] !== s || i[5] !== a
        ? ((n = (0, c.jsx)(w.O.Provider, { value: a, children: s })),
          (i[4] = s),
          (i[5] = a),
          (i[6] = n))
        : (n = i[6]),
      n
    );
  }
  function x(e) {
    return "email" === e.type
      ? (0, w.i)(e.address)
      : "google_oauth" === e.type && (0, w.i)(e.email);
  }
  var v = e.i(574472),
    E = e.i(107956),
    O = e.i(103973);
  function A() {
    let e,
      t = (0, d.c)(1),
      r = (0, v.F)();
    return (0, O.f)(r)
      ? (t[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = (0, c.jsx)(I, {})), (t[0] = e))
          : (e = t[0]),
        e)
      : null;
  }
  function I() {
    return ((0, E.f)(), null);
  }
  var B = e.i(616800),
    B = B,
    _ = e.i(541710),
    S = e.i(946985),
    U = e.i(634133),
    P = e.i(244684);
  function j() {
    let e,
      t = (0, d.c)(1);
    return (
      t[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = { onComplete: k }), (t[0] = e))
        : (e = t[0]),
      (0, U.f)(e),
      null
    );
  }
  function k() {
    (0, P.a)() && (0, P.$)();
  }
  let T = {
      appearance: {
        theme: "#1B1D28",
        accentColor: "#81c784",
        logo: "/logo.png",
        walletChainType: "solana-only",
        walletList: [],
      },
      embeddedWallets: {
        showWalletUIs: !1,
        ethereum: { createOnLogin: "off" },
        solana: { createOnLogin: "off" },
        disableAutomaticMigration: !0,
      },
      externalWallets: { walletConnect: { enabled: !1 } },
      supportedChains: S.s,
    },
    C = S.P.map((e, t) => (0 === t ? T : { ...T, supportedChains: e }));
  function L(e) {
    let t,
      r,
      n = (0, d.c)(4),
      { children: i } = e,
      s = (0, _.l)(),
      o = C[(0, S.B)(s)];
    return (
      n[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((t = (0, c.jsx)(j, {})), (n[0] = t))
        : (t = n[0]),
      n[1] !== i || n[2] !== o
        ? ((r = (0, c.jsxs)(B.z, {
            appId: "cm1p2gzot03fzqty5xzgjgthq",
            clientId: "client-WY5brZnRUhFQnX6ip6yRzypC9WLtB9j8mFnq4cyPBMq8W",
            config: o,
            children: [t, i],
          })),
          (n[1] = i),
          (n[2] = o),
          (n[3] = r))
        : (r = n[3]),
      r
    );
  }
  var D = B,
    N = e.i(322315),
    M = e.i(254010),
    R = e.i(352386),
    z = e.i(466931);
  function F(e) {
    let t,
      r = (0, d.c)(5),
      { children: n } = e,
      i = (0, M.k)(N.D.WEB_PRIVY_WALLET_MIGRATION),
      s = (0, v.F)();
    if (!i || !(0, O.f)(s)) {
      let e;
      return (
        r[0] !== n
          ? ((e = (0, c.jsx)(c.Fragment, { children: n })),
            (r[0] = n),
            (r[1] = e))
          : (e = r[1]),
        e
      );
    }
    return (
      r[2] !== n || r[3] !== s.address
        ? ((t = (0, c.jsx)($, { address: s.address, children: n }, s.address)),
          (r[2] = n),
          (r[3] = s.address),
          (r[4] = t))
        : (t = r[4]),
      t
    );
  }
  function $(e) {
    let t,
      r,
      n,
      i = (0, d.c)(7),
      { address: s, children: o } = e,
      { migrate: a } = (0, D._)(),
      l = (0, R.useRef)(!1),
      [f, u] = (0, R.useState)(!1);
    return (
      i[0] !== s || i[1] !== a
        ? ((t = () => {
            if (l.current) return;
            l.current = !0;
            let e = Date.now();
            a()
              .then(
                (t) => {
                  let { success: r, migrated: n } = t;
                  (0, z.B)({
                    name: "privy-wallet-migration",
                    feature: "auth",
                    operation: n ? "migrated" : "noop",
                    context: {
                      address: s,
                      success: r,
                      migrated: n,
                      durationMs: Date.now() - e,
                    },
                  });
                },
                (t) => {
                  (0, z.l)({
                    error: t,
                    feature: "auth",
                    operation: "privy-wallet-migration",
                    context: { address: s, durationMs: Date.now() - e },
                  });
                },
              )
              .then(() => u(!0));
          }),
          (r = [s, a]),
          (i[0] = s),
          (i[1] = a),
          (i[2] = t),
          (i[3] = r))
        : ((t = i[2]), (r = i[3])),
      (0, R.useEffect)(t, r),
      i[4] !== o || i[5] !== f
        ? ((n = f ? (0, c.jsx)(c.Fragment, { children: o }) : null),
          (i[4] = o),
          (i[5] = f),
          (i[6] = n))
        : (n = i[6]),
      n
    );
  }
  var H = e.i(124452),
    V = e.i(621057),
    D = B,
    G = e.i(110134),
    q = e.i(399294),
    K = e.i(315430),
    K = K,
    Y = e.i(753887),
    W = e.i(731110);
  (e.i(933185),
    e.i(623213),
    e.i(748117),
    e.i(74812),
    Symbol(),
    e.i(877961),
    e.i(750505),
    Object.prototype.toString,
    e.i(597188),
    e.i(617712),
    e.i(514186),
    e.i(887583),
    e.i(568590),
    e.i(432250));
  var Z = e.i(677558),
    X = e.i(296158),
    J = e.i(857366);
  (e.i(697781), e.i(153778), e.i(970260), e.i(270203), e.i(825717));
  var Q = (((l = Q || {})[(l.AddMemo = 0)] = "AddMemo"), l);
  (e.i(809845), e.i(255220));
  var ee = e.i(679877);
  (e.i(710600), e.i(441631), e.i(135022), e.i(243274));
  (Object.prototype.hasOwnProperty, Object.prototype.propertyIsEnumerable);
  var et = e.i(862570),
    er = Object.defineProperty;
  et.f;
  (et.f, et.f, et.f, et.f, et.f, ee.default, ee.EventEmitter);
  var en = e.i(550483);
  (e.i(232232), e.i(33898), e.i(12791), e.i(571232));
  class ei extends Error {
    constructor(e, t = {}) {
      let r = (() => {
          if (t.cause instanceof ei) {
            if (t.cause.details) return t.cause.details;
            if (t.cause.shortMessage) return t.cause.shortMessage;
          }
          return t.cause &&
            "details" in t.cause &&
            "string" == typeof t.cause.details
            ? t.cause.details
            : t.cause?.message
              ? t.cause.message
              : t.details;
        })(),
        n = (t.cause instanceof ei && t.cause.docsPath) || t.docsPath,
        i = `https://oxlib.sh${n ?? ""}`;
      (super(
        [
          e || "An error occurred.",
          ...(t.metaMessages ? ["", ...t.metaMessages] : []),
          ...(r || n
            ? ["", r ? `Details: ${r}` : void 0, n ? `See: ${i}` : void 0]
            : []),
        ]
          .filter((e) => "string" == typeof e)
          .join("\n"),
        t.cause ? { cause: t.cause } : void 0,
      ),
        Object.defineProperty(this, "details", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "docs", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "docsPath", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "shortMessage", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "cause", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "BaseError",
        }),
        Object.defineProperty(this, "version", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "ox@0.1.1",
        }),
        (this.cause = t.cause),
        (this.details = r),
        (this.docs = i),
        (this.docsPath = n),
        (this.shortMessage = e));
    }
    walk(e) {
      return (function e(t, r) {
        return r?.(t)
          ? t
          : t && "object" == typeof t && "cause" in t && t.cause
            ? e(t.cause, r)
            : r
              ? null
              : t;
      })(this, e);
    }
  }
  function es(e, t) {
    if (eb(e) > t) throw new ew({ givenSize: eb(e), maxSize: t });
  }
  function eo(e, t = {}) {
    let { dir: r, size: n = 32 } = t;
    if (0 === n) return e;
    let i = e.replace("0x", "");
    if (i.length > 2 * n)
      throw new ex({
        size: Math.ceil(i.length / 2),
        targetSize: n,
        type: "Hex",
      });
    return `0x${i["right" === r ? "padEnd" : "padStart"](2 * n, "0")}`;
  }
  function ea(e, t, r) {
    return JSON.stringify(
      e,
      (e, r) =>
        "function" == typeof t
          ? t(e, r)
          : "bigint" == typeof r
            ? r.toString() + "#__bigint"
            : r,
      r,
    );
  }
  let el = Array.from({ length: 256 }, (e, t) =>
    t.toString(16).padStart(2, "0"),
  );
  function ef(e) {
    return e instanceof Uint8Array
      ? eu(e)
      : Array.isArray(e)
        ? eu(new Uint8Array(e))
        : e;
  }
  function eu(e, t = {}) {
    let r = "";
    for (let t = 0; t < e.length; t++) r += el[e[t]];
    let n = `0x${r}`;
    return "number" == typeof t.size ? (es(n, t.size), ed(n, t.size)) : n;
  }
  function ec(e, t = {}) {
    var r;
    let n,
      { signed: i, size: s } = t,
      o = BigInt(e);
    s
      ? (n = i
          ? (1n << (8n * BigInt(s) - 1n)) - 1n
          : 2n ** (8n * BigInt(s)) - 1n)
      : "number" == typeof e && (n = BigInt(Number.MAX_SAFE_INTEGER));
    let a = "bigint" == typeof n && i ? -n - 1n : 0;
    if ((n && o > n) || o < a) {
      let t = "bigint" == typeof e ? "n" : "";
      throw new ep({
        max: n ? `${n}${t}` : void 0,
        min: `${a}${t}`,
        signed: i,
        size: s,
        value: `${e}${t}`,
      });
    }
    let l = (i && o < 0 ? (1n << BigInt(8 * s)) + BigInt(o) : o).toString(16),
      f = `0x${l}`;
    return s ? ((r = f), eo(r, { dir: "left", size: s })) : f;
  }
  function ed(e, t) {
    return eo(e, { dir: "right", size: t });
  }
  function eh(e, t, r, n = {}) {
    let { strict: i } = n;
    if ("number" == typeof t && t > 0 && t > eb(e) - 1)
      throw new em({ offset: t, position: "start", size: eb(e) });
    let s = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (r ?? e.length) * 2)}`;
    return (
      i &&
        (function (e, t, r) {
          if ("number" == typeof t && "number" == typeof r && eb(e) !== r - t)
            throw new em({ offset: r, position: "end", size: eb(e) });
        })(s, t, r),
      s
    );
  }
  function eb(e) {
    return Math.ceil((e.length - 2) / 2);
  }
  class ep extends ei {
    constructor({ max: e, min: t, signed: r, size: n, value: i }) {
      (super(
        `Number \`${i}\` is not in safe${n ? ` ${8 * n}-bit` : ""}${r ? " signed" : " unsigned"} integer range ${e ? `(\`${t}\` to \`${e}\`)` : `(above \`${t}\`)`}`,
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.IntegerOutOfRangeError",
        }));
    }
  }
  class eg extends ei {
    constructor(e) {
      (super(
        `Value \`${"object" == typeof e ? ea(e) : e}\` of type \`${typeof e}\` is an invalid hex type.`,
        { metaMessages: ['Hex types must be represented as `"0x${string}"`.'] },
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.InvalidHexTypeError",
        }));
    }
  }
  class ey extends ei {
    constructor(e) {
      (super(`Value \`${e}\` is an invalid hex value.`, {
        metaMessages: [
          'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).',
        ],
      }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.InvalidHexValueError",
        }));
    }
  }
  class ew extends ei {
    constructor({ givenSize: e, maxSize: t }) {
      (super(`Size cannot exceed \`${t}\` bytes. Given size: \`${e}\` bytes.`),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.SizeOverflowError",
        }));
    }
  }
  class em extends ei {
    constructor({ offset: e, position: t, size: r }) {
      (super(
        `Slice ${"start" === t ? "starting" : "ending"} at offset \`${e}\` is out-of-bounds (size: \`${r}\`).`,
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.SliceOffsetOutOfBoundsError",
        }));
    }
  }
  class ex extends ei {
    constructor({ size: e, targetSize: t, type: r }) {
      (super(
        `${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${t}\`).`,
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Hex.SizeExceedsPaddingSizeError",
        }));
    }
  }
  class ev extends ei {
    constructor({ signature: e }) {
      (super(`Value \`${e}\` is an invalid signature size.`, {
        metaMessages: [
          "Expected: 64 bytes or 65 bytes.",
          `Received ${eb(ef(e))} bytes.`,
        ],
      }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Signature.InvalidSerializedSizeError",
        }));
    }
  }
  class eE extends ei {
    constructor({ value: e }) {
      (super(
        `Value \`${e}\` is an invalid y-parity value. Y-parity must be 0 or 1.`,
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Signature.InvalidYParityError",
        }));
    }
  }
  class eO extends ei {
    constructor({ value: e }) {
      (super(`Value \`${e}\` is an invalid v value. v must be 27, 28 or >=35.`),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Signature.InvalidVError",
        }));
    }
  }
  (e.s(
    [
      "fromHex",
      0,
      function (e) {
        if (130 !== e.length && 132 !== e.length)
          throw new ev({ signature: e });
        let t = BigInt(eh(e, 0, 32)),
          r = BigInt(eh(e, 32, 64)),
          n = (() => {
            let t = Number(`0x${e.slice(130)}`);
            if (!Number.isNaN(t))
              try {
                var r = t;
                if (0 === r || 27 === r) return 0;
                if (1 === r || 28 === r) return 1;
                if (r >= 35) return +(r % 2 == 0);
                throw new eO({ value: r });
              } catch {
                throw new eE({ value: t });
              }
          })();
        return void 0 === n ? { r: t, s: r } : { r: t, s: r, yParity: n };
      },
    ],
    913697,
  ),
    e.i(913697));
  var eA = e.i(300059);
  function eI(e) {
    return e >= 48 && e <= 57
      ? e - 48
      : e >= 65 && e <= 70
        ? e - 55
        : e >= 97 && e <= 102
          ? e - 87
          : void 0;
  }
  let eB = new TextEncoder();
  class e_ extends ei {
    constructor(e) {
      (super(
        `Value \`${"object" == typeof e ? ea(e) : e}\` of type \`${typeof e}\` is an invalid Bytes value.`,
        { metaMessages: ["Bytes values must be of type `Bytes`."] },
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Bytes.InvalidBytesTypeError",
        }));
    }
  }
  class eS extends ei {
    constructor({ givenSize: e, maxSize: t }) {
      (super(`Size cannot exceed \`${t}\` bytes. Given size: \`${e}\` bytes.`),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Bytes.SizeOverflowError",
        }));
    }
  }
  class eU extends ei {
    constructor({ size: e, targetSize: t, type: r }) {
      (super(
        `${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${t}\`).`,
      ),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Bytes.SizeExceedsPaddingSizeError",
        }));
    }
  }
  class eP extends Map {
    constructor(e) {
      (super(),
        Object.defineProperty(this, "maxSize", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.maxSize = e));
    }
    get(e) {
      let t = super.get(e);
      return (
        super.has(e) && void 0 !== t && (this.delete(e), super.set(e, t)),
        t
      );
    }
    set(e, t) {
      if ((super.set(e, t), this.maxSize && this.size > this.maxSize)) {
        let e = this.keys().next().value;
        e && this.delete(e);
      }
      return this;
    }
  }
  let ej = { checksum: new eP(8192) }.checksum;
  var ek = e.i(626014);
  function eT(e, t = {}) {
    var r;
    let { as: n = "string" == typeof e ? "Hex" : "Bytes" } = t,
      i = (0, ek.f)(
        e instanceof Uint8Array
          ? e
          : "string" == typeof e
            ? (function (e, t = {}) {
                let { size: r } = t,
                  n = e;
                r && (es(e, r), (n = ed(e, r)));
                let i = n.slice(2);
                i.length % 2 && (i = `0${i}`);
                let s = i.length / 2,
                  o = new Uint8Array(s);
                for (let e = 0, t = 0; e < s; e++) {
                  let r = eI(i.charCodeAt(t++)),
                    n = eI(i.charCodeAt(t++));
                  if (void 0 === r || void 0 === n)
                    throw new ei(
                      `Invalid byte sequence ("${i[t - 2]}${i[t - 1]}" in "${i}").`,
                    );
                  o[e] = 16 * r + n;
                }
                return o;
              })(e)
            : (r = e) instanceof Uint8Array
              ? r
              : new Uint8Array(r),
      );
    return "Bytes" === n ? i : eu(i);
  }
  function eC(e, t = {}) {
    let { compressed: r } = t,
      { prefix: n, x: i, y: s } = e;
    if (!1 === r || ("bigint" == typeof i && "bigint" == typeof s)) {
      if (4 !== n) throw new eN({ prefix: n, cause: new eR() });
      return;
    }
    if (!0 === r || ("bigint" == typeof i && void 0 === s)) {
      if (3 !== n && 2 !== n) throw new eN({ prefix: n, cause: new eM() });
      return;
    }
    throw new eD({ publicKey: e });
  }
  function eL(e) {
    if (132 !== e.length && 130 !== e.length && 68 !== e.length)
      throw new ez({ publicKey: e });
    if (130 === e.length)
      return { prefix: 4, x: BigInt(eh(e, 0, 32)), y: BigInt(eh(e, 32, 64)) };
    if (132 === e.length) {
      let t = Number(eh(e, 0, 1));
      return { prefix: t, x: BigInt(eh(e, 1, 33)), y: BigInt(eh(e, 33, 65)) };
    }
    return { prefix: Number(eh(e, 0, 1)), x: BigInt(eh(e, 1, 33)) };
  }
  class eD extends ei {
    constructor({ publicKey: e }) {
      (super(`Value \`${ea(e)}\` is not a valid public key.`, {
        metaMessages: [
          "Public key must contain:",
          "- an `x` and `prefix` value (compressed)",
          "- an `x`, `y`, and `prefix` value (uncompressed)",
        ],
      }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "PublicKey.InvalidError",
        }));
    }
  }
  class eN extends ei {
    constructor({ prefix: e, cause: t }) {
      (super(`Prefix "${e}" is invalid.`, { cause: t }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "PublicKey.InvalidPrefixError",
        }));
    }
  }
  class eM extends ei {
    constructor() {
      (super("Prefix must be 2 or 3 for compressed public keys."),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "PublicKey.InvalidCompressedPrefixError",
        }));
    }
  }
  class eR extends ei {
    constructor() {
      (super("Prefix must be 4 for uncompressed public keys."),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "PublicKey.InvalidUncompressedPrefixError",
        }));
    }
  }
  class ez extends ei {
    constructor({ publicKey: e }) {
      (super(`Value \`${e}\` is an invalid public key size.`, {
        metaMessages: [
          "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
          `Received ${eb(ef(e))} bytes.`,
        ],
      }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "PublicKey.InvalidSerializedSizeError",
        }));
    }
  }
  let eF = /^0x[a-fA-F0-9]{40}$/;
  function e$(e, t = {}) {
    let { strict: r = !0 } = t;
    if (!eF.test(e)) throw new eV({ address: e, cause: new eG() });
    if (r) {
      if (e.toLowerCase() === e) return;
      if (eH(e) !== e) throw new eV({ address: e, cause: new eq() });
    }
  }
  function eH(e) {
    if (ej.has(e)) return ej.get(e);
    e$(e, { strict: !1 });
    let t = e.substring(2).toLowerCase(),
      r = eT(
        (function (e, t = {}) {
          let { size: r } = t,
            n = eB.encode(e);
          if ("number" == typeof r) {
            var i;
            if (n.length > r) throw new eS({ givenSize: n.length, maxSize: r });
            return (
              (i = n),
              (function (e, t = {}) {
                let { dir: r, size: n = 32 } = t;
                if (0 === n) return e;
                if (e.length > n)
                  throw new eU({
                    size: e.length,
                    targetSize: n,
                    type: "Bytes",
                  });
                let i = new Uint8Array(n);
                for (let t = 0; t < n; t++) {
                  let s = "right" === r;
                  i[s ? t : n - t - 1] = e[s ? t : e.length - t - 1];
                }
                return i;
              })(i, { dir: "right", size: r })
            );
          }
          return n;
        })(t),
        { as: "Bytes" },
      ),
      n = t.split("");
    for (let e = 0; e < 40; e += 2)
      (r[e >> 1] >> 4 >= 8 && n[e] && (n[e] = n[e].toUpperCase()),
        (15 & r[e >> 1]) >= 8 &&
          n[e + 1] &&
          (n[e + 1] = n[e + 1].toUpperCase()));
    let i = `0x${n.join("")}`;
    return (ej.set(e, i), i);
  }
  class eV extends ei {
    constructor({ address: e, cause: t }) {
      (super(`Address "${e}" is invalid.`, { cause: t }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Address.InvalidAddressError",
        }));
    }
  }
  class eG extends ei {
    constructor() {
      (super("Address is not a 20 byte (40 hexadecimal character) value."),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Address.InvalidInputError",
        }));
    }
  }
  class eq extends ei {
    constructor() {
      (super("Address does not match its checksum counterpart."),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "Address.InvalidChecksumError",
        }));
    }
  }
  (eA.secp256k1,
    e.s(
      [
        "recoverAddress",
        0,
        function (e) {
          return (function (e, t = {}) {
            let r = eT(
              `0x${(function (e, t = {}) {
                eC(e);
                let { prefix: r, x: n, y: i } = e,
                  { includePrefix: s = !0 } = t;
                return (function (...e) {
                  return `0x${e.reduce((e, t) => e + t.replace("0x", ""), "")}`;
                })(
                  s ? ec(r, { size: 1 }) : "0x",
                  ec(n, { size: 32 }),
                  "bigint" == typeof i ? ec(i, { size: 32 }) : "0x",
                );
              })(e).slice(4)}`,
            ).substring(26);
            return (function (e, t = {}) {
              let { checksum: r = !1 } = t;
              return (e$(e), r) ? eH(e) : e;
            })(`0x${r}`, t);
          })(
            (function (e) {
              var t;
              let r,
                { payload: n, signature: i } = e,
                { r: s, s: o, yParity: a } = i;
              return (
                (t = new eA.secp256k1.Signature(BigInt(s), BigInt(o))
                  .addRecoveryBit(a)
                  .recoverPublicKey(ef(n).substring(2))),
                eC(
                  (r = (() => {
                    if (
                      (function (e, t = {}) {
                        let { strict: r = !1 } = t;
                        try {
                          return (
                            !(function (e, t = {}) {
                              let { strict: r = !1 } = t;
                              if (!e || "string" != typeof e) throw new eg(e);
                              if (
                                (r && !/^0x[0-9a-fA-F]*$/.test(e)) ||
                                !e.startsWith("0x")
                              )
                                throw new ey(e);
                            })(e, { strict: r }),
                            !0
                          );
                        } catch {
                          return !1;
                        }
                      })(t)
                    )
                      return eL(t);
                    if (
                      (function (e) {
                        try {
                          if (
                            !(e instanceof Uint8Array) &&
                            (!e ||
                              "object" != typeof e ||
                              !("BYTES_PER_ELEMENT" in e) ||
                              1 !== e.BYTES_PER_ELEMENT ||
                              "Uint8Array" !== e.constructor.name)
                          )
                            throw new e_(e);
                          return !0;
                        } catch {
                          return !1;
                        }
                      })(t)
                    )
                      return eL(eu(t));
                    let { prefix: e, x: r, y: n } = t;
                    return "bigint" == typeof r && "bigint" == typeof n
                      ? { prefix: e ?? 4, x: r, y: n }
                      : { prefix: e, x: r };
                  })()),
                ),
                r
              );
            })(e),
          );
        },
      ],
      981561,
    ),
    e.i(981561));
  var eK = e.i(344048);
  class eY {
    constructor(e, t) {
      ((this.type = e), (this.data = t));
    }
  }
  class eW extends Error {
    constructor(e) {
      (super(e),
        Object.setPrototypeOf(this, Object.create(eW.prototype)),
        Object.defineProperty(this, "name", {
          configurable: !0,
          enumerable: !1,
          value: eW.name,
        }));
    }
  }
  let eZ = {
    type: -1,
    encode: function (e) {
      if (!(e instanceof Date)) return null;
      {
        let t, r, n, i;
        return (function ({ sec: e, nsec: t }) {
          if (e >= 0 && t >= 0 && e <= 0x3ffffffff)
            if (0 === t && e <= 0xffffffff) {
              let t = new Uint8Array(4);
              return (new DataView(t.buffer).setUint32(0, e), t);
            } else {
              let r = e / 0x100000000,
                n = new Uint8Array(8),
                i = new DataView(n.buffer);
              return (
                i.setUint32(0, (t << 2) | (3 & r)),
                i.setUint32(4, 0 | e),
                n
              );
            }
          {
            let r,
              n = new Uint8Array(12),
              i = new DataView(n.buffer);
            return (
              i.setUint32(0, t),
              (r = Math.floor(e / 0x100000000)),
              i.setUint32(4, r),
              i.setUint32(8, e),
              n
            );
          }
        })(
          ((r = Math.floor((t = e.getTime()) / 1e3)),
          (i = Math.floor((n = (t - 1e3 * r) * 1e6) / 1e9)),
          { sec: r + i, nsec: n - 1e9 * i }),
        );
      }
    },
    decode: function (e) {
      let t = (function (e) {
        let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
        switch (e.byteLength) {
          case 4:
            return { sec: t.getUint32(0), nsec: 0 };
          case 8: {
            let e = t.getUint32(0);
            return {
              sec: (3 & e) * 0x100000000 + t.getUint32(4),
              nsec: e >>> 2,
            };
          }
          case 12:
            return {
              sec: 0x100000000 * t.getInt32(4) + t.getUint32(8),
              nsec: t.getUint32(0),
            };
          default:
            throw new eW(
              `Unrecognized data size for timestamp (expected 4, 8, or 12): ${e.length}`,
            );
        }
      })(e);
      return new Date(1e3 * t.sec + t.nsec / 1e6);
    },
  };
  class eX {
    constructor() {
      ((this.builtInEncoders = []),
        (this.builtInDecoders = []),
        (this.encoders = []),
        (this.decoders = []),
        this.register(eZ));
    }
    register({ type: e, encode: t, decode: r }) {
      if (e >= 0) ((this.encoders[e] = t), (this.decoders[e] = r));
      else {
        let n = -1 - e;
        ((this.builtInEncoders[n] = t), (this.builtInDecoders[n] = r));
      }
    }
    tryToEncode(e, t) {
      for (let r = 0; r < this.builtInEncoders.length; r++) {
        let n = this.builtInEncoders[r];
        if (null != n) {
          let i = n(e, t);
          if (null != i) return new eY(-1 - r, i);
        }
      }
      for (let r = 0; r < this.encoders.length; r++) {
        let n = this.encoders[r];
        if (null != n) {
          let i = n(e, t);
          if (null != i) return new eY(r, i);
        }
      }
      return e instanceof eY ? e : null;
    }
    decode(e, t, r) {
      let n = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
      return n ? n(e, t, r) : new eY(t, e);
    }
  }
  ((eX.defaultCodec = new eX()), new TextEncoder(), new TextDecoder());
  let eJ = new DataView(new ArrayBuffer(0));
  new Uint8Array(eJ.buffer);
  try {
    eJ.getInt8(0);
  } catch (e) {
    if (!(e instanceof RangeError))
      throw Error(
        "This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access",
      );
  }
  (RangeError("Insufficient data"),
    new (class {
      constructor(e = 16, t = 16) {
        ((this.hit = 0),
          (this.miss = 0),
          (this.maxKeyLength = e),
          (this.maxLengthPerKey = t),
          (this.caches = []));
        for (let e = 0; e < this.maxKeyLength; e++) this.caches.push([]);
      }
      canBeCached(e) {
        return e > 0 && e <= this.maxKeyLength;
      }
      find(e, t, r) {
        let n = this.caches[r - 1];
        t: for (let i of n) {
          let n = i.bytes;
          for (let i = 0; i < r; i++) if (n[i] !== e[t + i]) continue t;
          return i.str;
        }
        return null;
      }
      store(e, t) {
        let r = this.caches[e.length - 1],
          n = { bytes: e, str: t };
        r.length >= this.maxLengthPerKey
          ? (r[(Math.random() * r.length) | 0] = n)
          : r.push(n);
      }
      decode(e, t, r) {
        let n = this.find(e, t, r);
        if (null != n) return (this.hit++, n);
        this.miss++;
        let i = (function (e, t, r) {
            let n = t,
              i = n + r,
              s = [],
              o = "";
            for (; n < i; ) {
              let t = e[n++];
              if ((128 & t) == 0) s.push(t);
              else if ((224 & t) == 192) {
                let r = 63 & e[n++];
                s.push(((31 & t) << 6) | r);
              } else if ((240 & t) == 224) {
                let r = 63 & e[n++],
                  i = 63 & e[n++];
                s.push(((31 & t) << 12) | (r << 6) | i);
              } else if ((248 & t) == 240) {
                let r =
                  ((7 & t) << 18) |
                  ((63 & e[n++]) << 12) |
                  ((63 & e[n++]) << 6) |
                  (63 & e[n++]);
                (r > 65535 &&
                  ((r -= 65536),
                  s.push(((r >>> 10) & 1023) | 55296),
                  (r = 56320 | (1023 & r))),
                  s.push(r));
              } else s.push(t);
              s.length >= 4096 &&
                ((o += String.fromCharCode(...s)), (s.length = 0));
            }
            return (s.length > 0 && (o += String.fromCharCode(...s)), o);
          })(e, t, r),
          s = Uint8Array.prototype.slice.call(e, t, t + r);
        return (this.store(s, i), i);
      }
    })());
  var eQ = e.i(957736);
  function e0(e, t, r, n) {
    return {
      name: e,
      prefix: t,
      encoder: { name: e, prefix: t, encode: r },
      decoder: { decode: n },
    };
  }
  (e0(
    "utf8",
    "u",
    (e) => "u" + new TextDecoder("utf8").decode(e),
    (e) => new TextEncoder().encode(e.substring(1)),
  ),
    e0(
      "ascii",
      "a",
      (e) => {
        let t = "a";
        for (let r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
        return t;
      },
      (e) => {
        let t = (function (e = 0) {
          if (
            null != globalThis.Buffer &&
            null != globalThis.Buffer.allocUnsafe
          ) {
            var t;
            return (
              (t = globalThis.Buffer.allocUnsafe(e)),
              null != globalThis.Buffer
                ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
                : t
            );
          }
          return new Uint8Array(e);
        })((e = e.substring(1)).length);
        for (let r = 0; r < e.length; r++) t[r] = e.charCodeAt(r);
        return t;
      },
    ),
    eQ.f.base16,
    eQ.f,
    e.i(208910),
    e.i(774789),
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable);
  let e1 = BigInt(0xffffffff),
    e2 = BigInt(32);
  function e3(e, t = !1) {
    return t
      ? { h: Number(e & e1), l: Number((e >> e2) & e1) }
      : { h: 0 | Number((e >> e2) & e1), l: 0 | Number(e & e1) };
  }
  function e6(e, t = !1) {
    let r = e.length,
      n = new Uint32Array(r),
      i = new Uint32Array(r);
    for (let s = 0; s < r; s++) {
      let { h: r, l: o } = e3(e[s], t);
      [n[s], i[s]] = [r, o];
    }
    return [n, i];
  }
  let e8 = (e, t, r) => e >>> r,
    e5 = (e, t, r) => (e << (32 - r)) | (t >>> r),
    e4 = (e, t, r) => (e >>> r) | (t << (32 - r)),
    e7 = (e, t, r) => (e << (32 - r)) | (t >>> r),
    e9 = (e, t, r) => (e << (64 - r)) | (t >>> (r - 32)),
    te = (e, t, r) => (e >>> (r - 32)) | (t << (64 - r));
  function tt(e, t, r, n) {
    let i = (t >>> 0) + (n >>> 0);
    return { h: (e + r + ((i / 0x100000000) | 0)) | 0, l: 0 | i };
  }
  let tr = (e, t, r) => (e >>> 0) + (t >>> 0) + (r >>> 0),
    tn = (e, t, r, n) => (t + r + n + ((e / 0x100000000) | 0)) | 0,
    ti = (e, t, r, n) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0),
    ts = (e, t, r, n, i) => (t + r + n + i + ((e / 0x100000000) | 0)) | 0,
    to = (e, t, r, n, i) =>
      (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0),
    ta = (e, t, r, n, i, s) =>
      (t + r + n + i + s + ((e / 0x100000000) | 0)) | 0,
    tl =
      "object" == typeof globalThis && "crypto" in globalThis
        ? globalThis.crypto
        : void 0;
  function tf(e) {
    return (
      e instanceof Uint8Array ||
      (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
    );
  }
  function tu(e) {
    if (!Number.isSafeInteger(e) || e < 0)
      throw Error("positive integer expected, got " + e);
  }
  function tc(e, ...t) {
    if (!tf(e)) throw Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length))
      throw Error(
        "Uint8Array expected of length " + t + ", got length=" + e.length,
      );
  }
  function td(e) {
    if ("function" != typeof e || "function" != typeof e.create)
      throw Error("Hash should be wrapped by utils.createHasher");
    (tu(e.outputLen), tu(e.blockLen));
  }
  function th(e, t = !0) {
    if (e.destroyed) throw Error("Hash instance has been destroyed");
    if (t && e.finished) throw Error("Hash#digest() has already been called");
  }
  function tb(e, t) {
    tc(e);
    let r = t.outputLen;
    if (e.length < r)
      throw Error("digestInto() expects output buffer of length at least " + r);
  }
  function tp(e) {
    return new Uint32Array(
      e.buffer,
      e.byteOffset,
      Math.floor(e.byteLength / 4),
    );
  }
  function tg(...e) {
    for (let t = 0; t < e.length; t++) e[t].fill(0);
  }
  function ty(e) {
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
  function tw(e, t) {
    return (e << (32 - t)) | (e >>> t);
  }
  let tm = 68 === new Uint8Array(new Uint32Array([0x11223344]).buffer)[0];
  function tx(e) {
    return (
      ((e << 24) & 0xff000000) |
      ((e << 8) & 0xff0000) |
      ((e >>> 8) & 65280) |
      ((e >>> 24) & 255)
    );
  }
  let tv = tm ? (e) => e : (e) => tx(e),
    tE = tm
      ? (e) => e
      : function (e) {
          for (let t = 0; t < e.length; t++) e[t] = tx(e[t]);
          return e;
        },
    tO =
      "function" == typeof Uint8Array.from([]).toHex &&
      "function" == typeof Uint8Array.fromHex,
    tA = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  function tI(e) {
    if ((tc(e), tO)) return e.toHex();
    let t = "";
    for (let r = 0; r < e.length; r++) t += tA[e[r]];
    return t;
  }
  function tB(e) {
    return e >= 48 && e <= 57
      ? e - 48
      : e >= 65 && e <= 70
        ? e - 55
        : e >= 97 && e <= 102
          ? e - 87
          : void 0;
  }
  function t_(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    if (tO) return Uint8Array.fromHex(e);
    let t = e.length,
      r = t / 2;
    if (t % 2)
      throw Error("hex string expected, got unpadded hex of length " + t);
    let n = new Uint8Array(r);
    for (let t = 0, i = 0; t < r; t++, i += 2) {
      let r = tB(e.charCodeAt(i)),
        s = tB(e.charCodeAt(i + 1));
      if (void 0 === r || void 0 === s)
        throw Error(
          'hex string expected, got non-hex character "' +
            (e[i] + e[i + 1]) +
            '" at index ' +
            i,
        );
      n[t] = 16 * r + s;
    }
    return n;
  }
  function tS(e) {
    if ("string" != typeof e) throw Error("string expected");
    return new Uint8Array(new TextEncoder().encode(e));
  }
  function tU(e) {
    return ("string" == typeof e && (e = tS(e)), tc(e), e);
  }
  function tP(...e) {
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      (tc(n), (t += n.length));
    }
    let r = new Uint8Array(t);
    for (let t = 0, n = 0; t < e.length; t++) {
      let i = e[t];
      (r.set(i, n), (n += i.length));
    }
    return r;
  }
  class tj {}
  function tk(e) {
    let t = (t) => e().update(tU(t)).digest(),
      r = e();
    return (
      (t.outputLen = r.outputLen),
      (t.blockLen = r.blockLen),
      (t.create = () => e()),
      t
    );
  }
  function tT(e = 32) {
    if (tl && "function" == typeof tl.getRandomValues)
      return tl.getRandomValues(new Uint8Array(e));
    if (tl && "function" == typeof tl.randomBytes)
      return Uint8Array.from(tl.randomBytes(e));
    throw Error("crypto.getRandomValues must be defined");
  }
  let tC = BigInt(0),
    tL = BigInt(1),
    tD = BigInt(2),
    tN = BigInt(7),
    tM = BigInt(256),
    tR = BigInt(113),
    tz = [],
    tF = [],
    t$ = [];
  for (let e = 0, t = tL, r = 1, n = 0; e < 24; e++) {
    (([r, n] = [n, (2 * r + 3 * n) % 5]),
      tz.push(2 * (5 * n + r)),
      tF.push((((e + 1) * (e + 2)) / 2) % 64));
    let i = tC;
    for (let e = 0; e < 7; e++)
      (t = ((t << tL) ^ ((t >> tN) * tR)) % tM) & tD &&
        (i ^= tL << ((tL << BigInt(e)) - tL));
    t$.push(i);
  }
  let tH = e6(t$, !0),
    tV = tH[0],
    tG = tH[1],
    tq = (e, t, r) =>
      r > 32 ? (t << (r - 32)) | (e >>> (64 - r)) : (e << r) | (t >>> (32 - r)),
    tK = (e, t, r) =>
      r > 32 ? (e << (r - 32)) | (t >>> (64 - r)) : (t << r) | (e >>> (32 - r));
  class tY extends tj {
    constructor(e, t, r, n = !1, i = 24) {
      if (
        (super(),
        (this.pos = 0),
        (this.posOut = 0),
        (this.finished = !1),
        (this.destroyed = !1),
        (this.enableXOF = !1),
        (this.blockLen = e),
        (this.suffix = t),
        (this.outputLen = r),
        (this.enableXOF = n),
        (this.rounds = i),
        tu(r),
        !(0 < e && e < 200))
      )
        throw Error("only keccak-f1600 function is supported");
      ((this.state = new Uint8Array(200)), (this.state32 = tp(this.state)));
    }
    clone() {
      return this._cloneInto();
    }
    keccak() {
      (tE(this.state32),
        (function (e, t = 24) {
          let r = new Uint32Array(10);
          for (let n = 24 - t; n < 24; n++) {
            for (let t = 0; t < 10; t++)
              r[t] = e[t] ^ e[t + 10] ^ e[t + 20] ^ e[t + 30] ^ e[t + 40];
            for (let t = 0; t < 10; t += 2) {
              let n = (t + 8) % 10,
                i = (t + 2) % 10,
                s = r[i],
                o = r[i + 1],
                a = tq(s, o, 1) ^ r[n],
                l = tK(s, o, 1) ^ r[n + 1];
              for (let r = 0; r < 50; r += 10)
                ((e[t + r] ^= a), (e[t + r + 1] ^= l));
            }
            let t = e[2],
              i = e[3];
            for (let r = 0; r < 24; r++) {
              let n = tF[r],
                s = tq(t, i, n),
                o = tK(t, i, n),
                a = tz[r];
              ((t = e[a]), (i = e[a + 1]), (e[a] = s), (e[a + 1] = o));
            }
            for (let t = 0; t < 50; t += 10) {
              for (let n = 0; n < 10; n++) r[n] = e[t + n];
              for (let n = 0; n < 10; n++)
                e[t + n] ^= ~r[(n + 2) % 10] & r[(n + 4) % 10];
            }
            ((e[0] ^= tV[n]), (e[1] ^= tG[n]));
          }
          tg(r);
        })(this.state32, this.rounds),
        tE(this.state32),
        (this.posOut = 0),
        (this.pos = 0));
    }
    update(e) {
      (th(this), tc((e = tU(e))));
      let { blockLen: t, state: r } = this,
        n = e.length;
      for (let i = 0; i < n; ) {
        let s = Math.min(t - this.pos, n - i);
        for (let t = 0; t < s; t++) r[this.pos++] ^= e[i++];
        this.pos === t && this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished) return;
      this.finished = !0;
      let { state: e, suffix: t, pos: r, blockLen: n } = this;
      ((e[r] ^= t),
        (128 & t) != 0 && r === n - 1 && this.keccak(),
        (e[n - 1] ^= 128),
        this.keccak());
    }
    writeInto(e) {
      (th(this, !1), tc(e), this.finish());
      let t = this.state,
        { blockLen: r } = this;
      for (let n = 0, i = e.length; n < i; ) {
        this.posOut >= r && this.keccak();
        let s = Math.min(r - this.posOut, i - n);
        (e.set(t.subarray(this.posOut, this.posOut + s), n),
          (this.posOut += s),
          (n += s));
      }
      return e;
    }
    xofInto(e) {
      if (!this.enableXOF) throw Error("XOF is not possible for this instance");
      return this.writeInto(e);
    }
    xof(e) {
      return (tu(e), this.xofInto(new Uint8Array(e)));
    }
    digestInto(e) {
      if ((tb(e, this), this.finished))
        throw Error("digest() was already called");
      return (this.writeInto(e), this.destroy(), e);
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      ((this.destroyed = !0), tg(this.state));
    }
    _cloneInto(e) {
      let {
        blockLen: t,
        suffix: r,
        outputLen: n,
        rounds: i,
        enableXOF: s,
      } = this;
      return (
        e || (e = new tY(t, r, n, s, i)),
        e.state32.set(this.state32),
        (e.pos = this.pos),
        (e.posOut = this.posOut),
        (e.finished = this.finished),
        (e.rounds = i),
        (e.suffix = r),
        (e.outputLen = n),
        (e.enableXOF = s),
        (e.destroyed = this.destroyed),
        e
      );
    }
  }
  tk(() => new tY(136, 1, 32));
  class tW extends tj {
    constructor(e, t, r, n) {
      (super(),
        (this.finished = !1),
        (this.length = 0),
        (this.pos = 0),
        (this.destroyed = !1),
        (this.blockLen = e),
        (this.outputLen = t),
        (this.padOffset = r),
        (this.isLE = n),
        (this.buffer = new Uint8Array(e)),
        (this.view = ty(this.buffer)));
    }
    update(e) {
      (th(this), tc((e = tU(e))));
      let { view: t, buffer: r, blockLen: n } = this,
        i = e.length;
      for (let s = 0; s < i; ) {
        let o = Math.min(n - this.pos, i - s);
        if (o === n) {
          let t = ty(e);
          for (; n <= i - s; s += n) this.process(t, s);
          continue;
        }
        (r.set(e.subarray(s, s + o), this.pos),
          (this.pos += o),
          (s += o),
          this.pos === n && (this.process(t, 0), (this.pos = 0)));
      }
      return ((this.length += e.length), this.roundClean(), this);
    }
    digestInto(e) {
      (th(this), tb(e, this), (this.finished = !0));
      let { buffer: t, view: r, blockLen: n, isLE: i } = this,
        { pos: s } = this;
      ((t[s++] = 128),
        tg(this.buffer.subarray(s)),
        this.padOffset > n - s && (this.process(r, 0), (s = 0)));
      for (let e = s; e < n; e++) t[e] = 0;
      ((function (e, t, r, n) {
        if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
        let i = BigInt(32),
          s = BigInt(0xffffffff),
          o = Number((r >> i) & s),
          a = Number(r & s),
          l = 4 * !!n,
          f = 4 * !n;
        (e.setUint32(t + l, o, n), e.setUint32(t + f, a, n));
      })(r, n - 8, BigInt(8 * this.length), i),
        this.process(r, 0));
      let o = ty(e),
        a = this.outputLen;
      if (a % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
      let l = a / 4,
        f = this.get();
      if (l > f.length) throw Error("_sha2: outputLen bigger than state");
      for (let e = 0; e < l; e++) o.setUint32(4 * e, f[e], i);
    }
    digest() {
      let { buffer: e, outputLen: t } = this;
      this.digestInto(e);
      let r = e.slice(0, t);
      return (this.destroy(), r);
    }
    _cloneInto(e) {
      (e || (e = new this.constructor()), e.set(...this.get()));
      let {
        blockLen: t,
        buffer: r,
        length: n,
        finished: i,
        destroyed: s,
        pos: o,
      } = this;
      return (
        (e.destroyed = s),
        (e.finished = i),
        (e.length = n),
        (e.pos = o),
        n % t && e.buffer.set(r),
        e
      );
    }
    clone() {
      return this._cloneInto();
    }
  }
  let tZ = Uint32Array.from([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ]),
    tX = Uint32Array.from([
      0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507, 0x9159015a, 0x3070dd17,
      0x152fecd8, 0xf70e5939, 0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511,
      0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4,
    ]),
    tJ = Uint32Array.from([
      0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b,
      0xa54ff53a, 0x5f1d36f1, 0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
      0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
    ]),
    tQ = Uint32Array.from([
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
    ]),
    t0 = new Uint32Array(64);
  class t1 extends tW {
    constructor(e = 32) {
      (super(64, e, 8, !1),
        (this.A = 0 | tZ[0]),
        (this.B = 0 | tZ[1]),
        (this.C = 0 | tZ[2]),
        (this.D = 0 | tZ[3]),
        (this.E = 0 | tZ[4]),
        (this.F = 0 | tZ[5]),
        (this.G = 0 | tZ[6]),
        (this.H = 0 | tZ[7]));
    }
    get() {
      let { A: e, B: t, C: r, D: n, E: i, F: s, G: o, H: a } = this;
      return [e, t, r, n, i, s, o, a];
    }
    set(e, t, r, n, i, s, o, a) {
      ((this.A = 0 | e),
        (this.B = 0 | t),
        (this.C = 0 | r),
        (this.D = 0 | n),
        (this.E = 0 | i),
        (this.F = 0 | s),
        (this.G = 0 | o),
        (this.H = 0 | a));
    }
    process(e, t) {
      for (let r = 0; r < 16; r++, t += 4) t0[r] = e.getUint32(t, !1);
      for (let e = 16; e < 64; e++) {
        let t = t0[e - 15],
          r = t0[e - 2],
          n = tw(t, 7) ^ tw(t, 18) ^ (t >>> 3),
          i = tw(r, 17) ^ tw(r, 19) ^ (r >>> 10);
        t0[e] = (i + t0[e - 7] + n + t0[e - 16]) | 0;
      }
      let { A: r, B: n, C: i, D: s, E: o, F: a, G: l, H: f } = this;
      for (let e = 0; e < 64; e++) {
        var u, c, d, h;
        let t =
            (f +
              (tw(o, 6) ^ tw(o, 11) ^ tw(o, 25)) +
              (((u = o) & a) ^ (~u & l)) +
              tQ[e] +
              t0[e]) |
            0,
          b =
            ((tw(r, 2) ^ tw(r, 13) ^ tw(r, 22)) +
              (((c = r) & (d = n)) ^ (c & (h = i)) ^ (d & h))) |
            0;
        ((f = l),
          (l = a),
          (a = o),
          (o = (s + t) | 0),
          (s = i),
          (i = n),
          (n = r),
          (r = (t + b) | 0));
      }
      ((r = (r + this.A) | 0),
        (n = (n + this.B) | 0),
        (i = (i + this.C) | 0),
        (s = (s + this.D) | 0),
        (o = (o + this.E) | 0),
        (a = (a + this.F) | 0),
        (l = (l + this.G) | 0),
        (f = (f + this.H) | 0),
        this.set(r, n, i, s, o, a, l, f));
    }
    roundClean() {
      tg(t0);
    }
    destroy() {
      (this.set(0, 0, 0, 0, 0, 0, 0, 0), tg(this.buffer));
    }
  }
  let t2 = e6(
      [
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817",
      ].map((e) => BigInt(e)),
    ),
    t3 = t2[0],
    t6 = t2[1],
    t8 = new Uint32Array(80),
    t5 = new Uint32Array(80);
  class t4 extends tW {
    constructor(e = 64) {
      (super(128, e, 16, !1),
        (this.Ah = 0 | tJ[0]),
        (this.Al = 0 | tJ[1]),
        (this.Bh = 0 | tJ[2]),
        (this.Bl = 0 | tJ[3]),
        (this.Ch = 0 | tJ[4]),
        (this.Cl = 0 | tJ[5]),
        (this.Dh = 0 | tJ[6]),
        (this.Dl = 0 | tJ[7]),
        (this.Eh = 0 | tJ[8]),
        (this.El = 0 | tJ[9]),
        (this.Fh = 0 | tJ[10]),
        (this.Fl = 0 | tJ[11]),
        (this.Gh = 0 | tJ[12]),
        (this.Gl = 0 | tJ[13]),
        (this.Hh = 0 | tJ[14]),
        (this.Hl = 0 | tJ[15]));
    }
    get() {
      let {
        Ah: e,
        Al: t,
        Bh: r,
        Bl: n,
        Ch: i,
        Cl: s,
        Dh: o,
        Dl: a,
        Eh: l,
        El: f,
        Fh: u,
        Fl: c,
        Gh: d,
        Gl: h,
        Hh: b,
        Hl: p,
      } = this;
      return [e, t, r, n, i, s, o, a, l, f, u, c, d, h, b, p];
    }
    set(e, t, r, n, i, s, o, a, l, f, u, c, d, h, b, p) {
      ((this.Ah = 0 | e),
        (this.Al = 0 | t),
        (this.Bh = 0 | r),
        (this.Bl = 0 | n),
        (this.Ch = 0 | i),
        (this.Cl = 0 | s),
        (this.Dh = 0 | o),
        (this.Dl = 0 | a),
        (this.Eh = 0 | l),
        (this.El = 0 | f),
        (this.Fh = 0 | u),
        (this.Fl = 0 | c),
        (this.Gh = 0 | d),
        (this.Gl = 0 | h),
        (this.Hh = 0 | b),
        (this.Hl = 0 | p));
    }
    process(e, t) {
      for (let r = 0; r < 16; r++, t += 4)
        ((t8[r] = e.getUint32(t)), (t5[r] = e.getUint32((t += 4))));
      for (let e = 16; e < 80; e++) {
        let t = 0 | t8[e - 15],
          r = 0 | t5[e - 15],
          n = e4(t, r, 1) ^ e4(t, r, 8) ^ e8(t, r, 7),
          i = e7(t, r, 1) ^ e7(t, r, 8) ^ e5(t, r, 7),
          s = 0 | t8[e - 2],
          o = 0 | t5[e - 2],
          a = e4(s, o, 19) ^ e9(s, o, 61) ^ e8(s, o, 6),
          l = ti(
            i,
            e7(s, o, 19) ^ te(s, o, 61) ^ e5(s, o, 6),
            t5[e - 7],
            t5[e - 16],
          ),
          f = ts(l, n, a, t8[e - 7], t8[e - 16]);
        ((t8[e] = 0 | f), (t5[e] = 0 | l));
      }
      let {
        Ah: r,
        Al: n,
        Bh: i,
        Bl: s,
        Ch: o,
        Cl: a,
        Dh: l,
        Dl: f,
        Eh: u,
        El: c,
        Fh: d,
        Fl: h,
        Gh: b,
        Gl: p,
        Hh: g,
        Hl: y,
      } = this;
      for (let e = 0; e < 80; e++) {
        let t = e4(u, c, 14) ^ e4(u, c, 18) ^ e9(u, c, 41),
          w = e7(u, c, 14) ^ e7(u, c, 18) ^ te(u, c, 41),
          m = (u & d) ^ (~u & b),
          x = to(y, w, (c & h) ^ (~c & p), t6[e], t5[e]),
          v = ta(x, g, t, m, t3[e], t8[e]),
          E = 0 | x,
          O = e4(r, n, 28) ^ e9(r, n, 34) ^ e9(r, n, 39),
          A = e7(r, n, 28) ^ te(r, n, 34) ^ te(r, n, 39),
          I = (r & i) ^ (r & o) ^ (i & o),
          B = (n & s) ^ (n & a) ^ (s & a);
        ((g = 0 | b),
          (y = 0 | p),
          (b = 0 | d),
          (p = 0 | h),
          (d = 0 | u),
          (h = 0 | c),
          ({ h: u, l: c } = tt(0 | l, 0 | f, 0 | v, 0 | E)),
          (l = 0 | o),
          (f = 0 | a),
          (o = 0 | i),
          (a = 0 | s),
          (i = 0 | r),
          (s = 0 | n));
        let _ = tr(E, A, B);
        ((r = tn(_, v, O, I)), (n = 0 | _));
      }
      (({ h: r, l: n } = tt(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)),
        ({ h: i, l: s } = tt(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | s)),
        ({ h: o, l: a } = tt(0 | this.Ch, 0 | this.Cl, 0 | o, 0 | a)),
        ({ h: l, l: f } = tt(0 | this.Dh, 0 | this.Dl, 0 | l, 0 | f)),
        ({ h: u, l: c } = tt(0 | this.Eh, 0 | this.El, 0 | u, 0 | c)),
        ({ h: d, l: h } = tt(0 | this.Fh, 0 | this.Fl, 0 | d, 0 | h)),
        ({ h: b, l: p } = tt(0 | this.Gh, 0 | this.Gl, 0 | b, 0 | p)),
        ({ h: g, l: y } = tt(0 | this.Hh, 0 | this.Hl, 0 | g, 0 | y)),
        this.set(r, n, i, s, o, a, l, f, u, c, d, h, b, p, g, y));
    }
    roundClean() {
      tg(t8, t5);
    }
    destroy() {
      (tg(this.buffer),
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    }
  }
  class t7 extends t4 {
    constructor() {
      (super(48),
        (this.Ah = 0 | tX[0]),
        (this.Al = 0 | tX[1]),
        (this.Bh = 0 | tX[2]),
        (this.Bl = 0 | tX[3]),
        (this.Ch = 0 | tX[4]),
        (this.Cl = 0 | tX[5]),
        (this.Dh = 0 | tX[6]),
        (this.Dl = 0 | tX[7]),
        (this.Eh = 0 | tX[8]),
        (this.El = 0 | tX[9]),
        (this.Fh = 0 | tX[10]),
        (this.Fl = 0 | tX[11]),
        (this.Gh = 0 | tX[12]),
        (this.Gl = 0 | tX[13]),
        (this.Hh = 0 | tX[14]),
        (this.Hl = 0 | tX[15]));
    }
  }
  let t9 = Uint32Array.from([
    0x22312194, 0xfc2bf72c, 0x9f555fa3, 0xc84c64c2, 0x2393b86b, 0x6f53b151,
    0x96387719, 0x5940eabd, 0x96283ee2, 0xa88effe3, 0xbe5e1e25, 0x53863992,
    0x2b0199fc, 0x2c85b8aa, 0xeb72ddc, 0x81c52ca2,
  ]);
  class re extends t4 {
    constructor() {
      (super(32),
        (this.Ah = 0 | t9[0]),
        (this.Al = 0 | t9[1]),
        (this.Bh = 0 | t9[2]),
        (this.Bl = 0 | t9[3]),
        (this.Ch = 0 | t9[4]),
        (this.Cl = 0 | t9[5]),
        (this.Dh = 0 | t9[6]),
        (this.Dl = 0 | t9[7]),
        (this.Eh = 0 | t9[8]),
        (this.El = 0 | t9[9]),
        (this.Fh = 0 | t9[10]),
        (this.Fl = 0 | t9[11]),
        (this.Gh = 0 | t9[12]),
        (this.Gl = 0 | t9[13]),
        (this.Hh = 0 | t9[14]),
        (this.Hl = 0 | t9[15]));
    }
  }
  let rt = tk(() => new t1()),
    rr = tk(() => new t4()),
    rn = tk(() => new t7()),
    ri =
      (tk(() => new re()),
      Uint8Array.from([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9,
        15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14,
        3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
        9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0,
        11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7,
        6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
        6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6,
        1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
        11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13,
        12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1,
        11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1,
        9,
      ])),
    rs = Uint32Array.from([
      0xf3bcc908, 0x6a09e667, 0x84caa73b, 0xbb67ae85, 0xfe94f82b, 0x3c6ef372,
      0x5f1d36f1, 0xa54ff53a, 0xade682d1, 0x510e527f, 0x2b3e6c1f, 0x9b05688c,
      0xfb41bd6b, 0x1f83d9ab, 0x137e2179, 0x5be0cd19,
    ]),
    ro = new Uint32Array(32);
  function ra(e, t, r, n, i, s) {
    let o = i[s],
      a = i[s + 1],
      l = ro[2 * e],
      f = ro[2 * e + 1],
      u = ro[2 * t],
      c = ro[2 * t + 1],
      d = ro[2 * r],
      h = ro[2 * r + 1],
      b = ro[2 * n],
      p = ro[2 * n + 1],
      g = tr(l, u, o);
    ((f = tn(g, f, c, a)),
      (l = 0 | g),
      ({ Dh: p, Dl: b } = { Dh: p ^ f, Dl: b ^ l }),
      ({ Dh: p, Dl: b } = { Dh: b, Dl: p }),
      ({ h, l: d } = tt(h, d, p, b)),
      ({ Bh: c, Bl: u } = { Bh: c ^ h, Bl: u ^ d }),
      ({ Bh: c, Bl: u } = { Bh: e4(c, u, 24), Bl: e7(c, u, 24) }),
      (ro[2 * e] = l),
      (ro[2 * e + 1] = f),
      (ro[2 * t] = u),
      (ro[2 * t + 1] = c),
      (ro[2 * r] = d),
      (ro[2 * r + 1] = h),
      (ro[2 * n] = b),
      (ro[2 * n + 1] = p));
  }
  function rl(e, t, r, n, i, s) {
    let o = i[s],
      a = i[s + 1],
      l = ro[2 * e],
      f = ro[2 * e + 1],
      u = ro[2 * t],
      c = ro[2 * t + 1],
      d = ro[2 * r],
      h = ro[2 * r + 1],
      b = ro[2 * n],
      p = ro[2 * n + 1],
      g = tr(l, u, o);
    ((f = tn(g, f, c, a)),
      (l = 0 | g),
      ({ Dh: p, Dl: b } = { Dh: p ^ f, Dl: b ^ l }),
      ({ Dh: p, Dl: b } = { Dh: e4(p, b, 16), Dl: e7(p, b, 16) }),
      ({ h, l: d } = tt(h, d, p, b)),
      ({ Bh: c, Bl: u } = { Bh: c ^ h, Bl: u ^ d }),
      ({ Bh: c, Bl: u } = { Bh: e9(c, u, 63), Bl: te(c, u, 63) }),
      (ro[2 * e] = l),
      (ro[2 * e + 1] = f),
      (ro[2 * t] = u),
      (ro[2 * t + 1] = c),
      (ro[2 * r] = d),
      (ro[2 * r + 1] = h),
      (ro[2 * n] = b),
      (ro[2 * n + 1] = p));
  }
  class rf extends tj {
    constructor(e, t) {
      (super(),
        (this.finished = !1),
        (this.destroyed = !1),
        (this.length = 0),
        (this.pos = 0),
        tu(e),
        tu(t),
        (this.blockLen = e),
        (this.outputLen = t),
        (this.buffer = new Uint8Array(e)),
        (this.buffer32 = tp(this.buffer)));
    }
    update(e) {
      (th(this), tc((e = tU(e))));
      let { blockLen: t, buffer: r, buffer32: n } = this,
        i = e.length,
        s = e.byteOffset,
        o = e.buffer;
      for (let a = 0; a < i; ) {
        this.pos === t &&
          (tE(n), this.compress(n, 0, !1), tE(n), (this.pos = 0));
        let l = Math.min(t - this.pos, i - a),
          f = s + a;
        if (l === t && !(f % 4) && a + l < i) {
          let e = new Uint32Array(o, f, Math.floor((i - a) / 4));
          tE(e);
          for (let r = 0; a + t < i; r += n.length, a += t)
            ((this.length += t), this.compress(e, r, !1));
          tE(e);
          continue;
        }
        (r.set(e.subarray(a, a + l), this.pos),
          (this.pos += l),
          (this.length += l),
          (a += l));
      }
      return this;
    }
    digestInto(e) {
      (th(this), tb(e, this));
      let { pos: t, buffer32: r } = this;
      ((this.finished = !0),
        tg(this.buffer.subarray(t)),
        tE(r),
        this.compress(r, 0, !0),
        tE(r));
      let n = tp(e);
      this.get().forEach((e, t) => (n[t] = tv(e)));
    }
    digest() {
      let { buffer: e, outputLen: t } = this;
      this.digestInto(e);
      let r = e.slice(0, t);
      return (this.destroy(), r);
    }
    _cloneInto(e) {
      let {
        buffer: t,
        length: r,
        finished: n,
        destroyed: i,
        outputLen: s,
        pos: o,
      } = this;
      return (
        e || (e = new this.constructor({ dkLen: s })),
        e.set(...this.get()),
        e.buffer.set(t),
        (e.destroyed = i),
        (e.finished = n),
        (e.length = r),
        (e.pos = o),
        (e.outputLen = s),
        e
      );
    }
    clone() {
      return this._cloneInto();
    }
  }
  class ru extends rf {
    constructor(e = {}) {
      let t = void 0 === e.dkLen ? 64 : e.dkLen;
      (super(128, t),
        (this.v0l = 0 | rs[0]),
        (this.v0h = 0 | rs[1]),
        (this.v1l = 0 | rs[2]),
        (this.v1h = 0 | rs[3]),
        (this.v2l = 0 | rs[4]),
        (this.v2h = 0 | rs[5]),
        (this.v3l = 0 | rs[6]),
        (this.v3h = 0 | rs[7]),
        (this.v4l = 0 | rs[8]),
        (this.v4h = 0 | rs[9]),
        (this.v5l = 0 | rs[10]),
        (this.v5h = 0 | rs[11]),
        (this.v6l = 0 | rs[12]),
        (this.v6h = 0 | rs[13]),
        (this.v7l = 0 | rs[14]),
        (this.v7h = 0 | rs[15]),
        (function (e, t = {}) {
          if ((tu(64), e < 0 || e > 64))
            throw Error("outputLen bigger than keyLen");
          let { key: r, salt: n, personalization: i } = t;
          if (void 0 !== r && (r.length < 1 || r.length > 64))
            throw Error("key length must be undefined or 1..64");
          if (void 0 !== n && 16 !== n.length)
            throw Error("salt must be undefined or 16");
          if (void 0 !== i && 16 !== i.length)
            throw Error("personalization must be undefined or 16");
        })(t, e));
      let { key: r, personalization: n, salt: i } = e,
        s = 0;
      if (
        (void 0 !== r && (s = (r = tU(r)).length),
        (this.v0l ^= this.outputLen | (s << 8) | 0x1010000),
        void 0 !== i)
      ) {
        let e = tp((i = tU(i)));
        ((this.v4l ^= tv(e[0])),
          (this.v4h ^= tv(e[1])),
          (this.v5l ^= tv(e[2])),
          (this.v5h ^= tv(e[3])));
      }
      if (void 0 !== n) {
        let e = tp((n = tU(n)));
        ((this.v6l ^= tv(e[0])),
          (this.v6h ^= tv(e[1])),
          (this.v7l ^= tv(e[2])),
          (this.v7h ^= tv(e[3])));
      }
      if (void 0 !== r) {
        let e = new Uint8Array(this.blockLen);
        (e.set(r), this.update(e));
      }
    }
    get() {
      let {
        v0l: e,
        v0h: t,
        v1l: r,
        v1h: n,
        v2l: i,
        v2h: s,
        v3l: o,
        v3h: a,
        v4l: l,
        v4h: f,
        v5l: u,
        v5h: c,
        v6l: d,
        v6h: h,
        v7l: b,
        v7h: p,
      } = this;
      return [e, t, r, n, i, s, o, a, l, f, u, c, d, h, b, p];
    }
    set(e, t, r, n, i, s, o, a, l, f, u, c, d, h, b, p) {
      ((this.v0l = 0 | e),
        (this.v0h = 0 | t),
        (this.v1l = 0 | r),
        (this.v1h = 0 | n),
        (this.v2l = 0 | i),
        (this.v2h = 0 | s),
        (this.v3l = 0 | o),
        (this.v3h = 0 | a),
        (this.v4l = 0 | l),
        (this.v4h = 0 | f),
        (this.v5l = 0 | u),
        (this.v5h = 0 | c),
        (this.v6l = 0 | d),
        (this.v6h = 0 | h),
        (this.v7l = 0 | b),
        (this.v7h = 0 | p));
    }
    compress(e, t, r) {
      (this.get().forEach((e, t) => (ro[t] = e)), ro.set(rs, 16));
      let { h: n, l: i } = e3(BigInt(this.length));
      ((ro[24] = rs[8] ^ i),
        (ro[25] = rs[9] ^ n),
        r && ((ro[28] = ~ro[28]), (ro[29] = ~ro[29])));
      let s = 0;
      for (let r = 0; r < 12; r++)
        (ra(0, 4, 8, 12, e, t + 2 * ri[s++]),
          rl(0, 4, 8, 12, e, t + 2 * ri[s++]),
          ra(1, 5, 9, 13, e, t + 2 * ri[s++]),
          rl(1, 5, 9, 13, e, t + 2 * ri[s++]),
          ra(2, 6, 10, 14, e, t + 2 * ri[s++]),
          rl(2, 6, 10, 14, e, t + 2 * ri[s++]),
          ra(3, 7, 11, 15, e, t + 2 * ri[s++]),
          rl(3, 7, 11, 15, e, t + 2 * ri[s++]),
          ra(0, 5, 10, 15, e, t + 2 * ri[s++]),
          rl(0, 5, 10, 15, e, t + 2 * ri[s++]),
          ra(1, 6, 11, 12, e, t + 2 * ri[s++]),
          rl(1, 6, 11, 12, e, t + 2 * ri[s++]),
          ra(2, 7, 8, 13, e, t + 2 * ri[s++]),
          rl(2, 7, 8, 13, e, t + 2 * ri[s++]),
          ra(3, 4, 9, 14, e, t + 2 * ri[s++]),
          rl(3, 4, 9, 14, e, t + 2 * ri[s++]));
      ((this.v0l ^= ro[0] ^ ro[16]),
        (this.v0h ^= ro[1] ^ ro[17]),
        (this.v1l ^= ro[2] ^ ro[18]),
        (this.v1h ^= ro[3] ^ ro[19]),
        (this.v2l ^= ro[4] ^ ro[20]),
        (this.v2h ^= ro[5] ^ ro[21]),
        (this.v3l ^= ro[6] ^ ro[22]),
        (this.v3h ^= ro[7] ^ ro[23]),
        (this.v4l ^= ro[8] ^ ro[24]),
        (this.v4h ^= ro[9] ^ ro[25]),
        (this.v5l ^= ro[10] ^ ro[26]),
        (this.v5h ^= ro[11] ^ ro[27]),
        (this.v6l ^= ro[12] ^ ro[28]),
        (this.v6h ^= ro[13] ^ ro[29]),
        (this.v7l ^= ro[14] ^ ro[30]),
        (this.v7h ^= ro[15] ^ ro[31]),
        tg(ro));
    }
    destroy() {
      ((this.destroyed = !0),
        tg(this.buffer32),
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    }
  }
  function rc(e) {
    return (
      e instanceof Uint8Array ||
      (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
    );
  }
  function rd(e) {
    if ("boolean" != typeof e) throw Error(`boolean expected, not ${e}`);
  }
  function rh(e) {
    if (!Number.isSafeInteger(e) || e < 0)
      throw Error("positive integer expected, got " + e);
  }
  function rb(e, ...t) {
    if (!rc(e)) throw Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length))
      throw Error(
        "Uint8Array expected of length " + t + ", got length=" + e.length,
      );
  }
  function rp(e, t = !0) {
    if (e.destroyed) throw Error("Hash instance has been destroyed");
    if (t && e.finished) throw Error("Hash#digest() has already been called");
  }
  function rg(e) {
    return new Uint32Array(
      e.buffer,
      e.byteOffset,
      Math.floor(e.byteLength / 4),
    );
  }
  function ry(...e) {
    for (let t = 0; t < e.length; t++) e[t].fill(0);
  }
  ((f = (e) => new ru(e)),
    ((t = (e, t) => f(t).update(tU(e)).digest()).outputLen = (r = f(
      {},
    )).outputLen),
    (t.blockLen = r.blockLen),
    (t.create = (e) => f(e)),
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable);
  let rw = 68 === new Uint8Array(new Uint32Array([0x11223344]).buffer)[0];
  function rm(e) {
    if ("string" == typeof e)
      e = (function (e) {
        if ("string" != typeof e) throw Error("string expected");
        return new Uint8Array(new TextEncoder().encode(e));
      })(e);
    else if (rc(e)) e = rE(e);
    else throw Error("Uint8Array expected, got " + typeof e);
    return e;
  }
  function rx(e, t, r = !0) {
    if (void 0 === t) return new Uint8Array(e);
    if (t.length !== e)
      throw Error(
        "invalid output length, expected " + e + ", got: " + t.length,
      );
    if (r && t.byteOffset % 4 != 0)
      throw Error("invalid output, must be aligned");
    return t;
  }
  function rv(e, t, r, n) {
    if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
    let i = BigInt(32),
      s = BigInt(0xffffffff),
      o = Number((r >> i) & s),
      a = Number(r & s),
      l = 4 * !!n,
      f = 4 * !n;
    (e.setUint32(t + l, o, n), e.setUint32(t + f, a, n));
  }
  function rE(e) {
    return Uint8Array.from(e);
  }
  let rO = (e) => Uint8Array.from(e.split("").map((e) => e.charCodeAt(0))),
    rA = rO("expand 16-byte k"),
    rI = rO("expand 32-byte k"),
    rB = rg(rA),
    r_ = rg(rI);
  function rS(e, t) {
    return (e << t) | (e >>> (32 - t));
  }
  function rU(e) {
    return e.byteOffset % 4 == 0;
  }
  let rP = new Uint32Array(),
    rj = (e, t) => (255 & e[t++]) | ((255 & e[t++]) << 8);
  class rk {
    constructor(e) {
      ((this.blockLen = 16),
        (this.outputLen = 16),
        (this.buffer = new Uint8Array(16)),
        (this.r = new Uint16Array(10)),
        (this.h = new Uint16Array(10)),
        (this.pad = new Uint16Array(8)),
        (this.pos = 0),
        (this.finished = !1),
        rb((e = rm(e)), 32));
      let t = rj(e, 0),
        r = rj(e, 2),
        n = rj(e, 4),
        i = rj(e, 6),
        s = rj(e, 8),
        o = rj(e, 10),
        a = rj(e, 12),
        l = rj(e, 14);
      ((this.r[0] = 8191 & t),
        (this.r[1] = ((t >>> 13) | (r << 3)) & 8191),
        (this.r[2] = ((r >>> 10) | (n << 6)) & 7939),
        (this.r[3] = ((n >>> 7) | (i << 9)) & 8191),
        (this.r[4] = ((i >>> 4) | (s << 12)) & 255),
        (this.r[5] = (s >>> 1) & 8190),
        (this.r[6] = ((s >>> 14) | (o << 2)) & 8191),
        (this.r[7] = ((o >>> 11) | (a << 5)) & 8065),
        (this.r[8] = ((a >>> 8) | (l << 8)) & 8191),
        (this.r[9] = (l >>> 5) & 127));
      for (let t = 0; t < 8; t++) this.pad[t] = rj(e, 16 + 2 * t);
    }
    process(e, t, r = !1) {
      let { h: n, r: i } = this,
        s = i[0],
        o = i[1],
        a = i[2],
        l = i[3],
        f = i[4],
        u = i[5],
        c = i[6],
        d = i[7],
        h = i[8],
        b = i[9],
        p = rj(e, t + 0),
        g = rj(e, t + 2),
        y = rj(e, t + 4),
        w = rj(e, t + 6),
        m = rj(e, t + 8),
        x = rj(e, t + 10),
        v = rj(e, t + 12),
        E = rj(e, t + 14),
        O = n[0] + (8191 & p),
        A = n[1] + (((p >>> 13) | (g << 3)) & 8191),
        I = n[2] + (((g >>> 10) | (y << 6)) & 8191),
        B = n[3] + (((y >>> 7) | (w << 9)) & 8191),
        _ = n[4] + (((w >>> 4) | (m << 12)) & 8191),
        S = n[5] + ((m >>> 1) & 8191),
        U = n[6] + (((m >>> 14) | (x << 2)) & 8191),
        P = n[7] + (((x >>> 11) | (v << 5)) & 8191),
        j = n[8] + (((v >>> 8) | (E << 8)) & 8191),
        k = n[9] + ((E >>> 5) | (2048 * !r)),
        T = 0,
        C = 0 + O * s + 5 * b * A + 5 * h * I + 5 * d * B + 5 * c * _;
      ((T = C >>> 13),
        (C &= 8191),
        (C += 5 * u * S + 5 * f * U + 5 * l * P + 5 * a * j + 5 * o * k),
        (T += C >>> 13),
        (C &= 8191));
      let L = T + O * o + A * s + 5 * b * I + 5 * h * B + 5 * d * _;
      ((T = L >>> 13),
        (L &= 8191),
        (L += 5 * c * S + 5 * u * U + 5 * f * P + 5 * l * j + 5 * a * k),
        (T += L >>> 13),
        (L &= 8191));
      let D = T + O * a + A * o + I * s + 5 * b * B + 5 * h * _;
      ((T = D >>> 13),
        (D &= 8191),
        (D += 5 * d * S + 5 * c * U + 5 * u * P + 5 * f * j + 5 * l * k),
        (T += D >>> 13),
        (D &= 8191));
      let N = T + O * l + A * a + I * o + B * s + 5 * b * _;
      ((T = N >>> 13),
        (N &= 8191),
        (N += 5 * h * S + 5 * d * U + 5 * c * P + 5 * u * j + 5 * f * k),
        (T += N >>> 13),
        (N &= 8191));
      let M = T + O * f + A * l + I * a + B * o + _ * s;
      ((T = M >>> 13),
        (M &= 8191),
        (M += 5 * b * S + 5 * h * U + 5 * d * P + 5 * c * j + 5 * u * k),
        (T += M >>> 13),
        (M &= 8191));
      let R = T + O * u + A * f + I * l + B * a + _ * o;
      ((T = R >>> 13),
        (R &= 8191),
        (R += S * s + 5 * b * U + 5 * h * P + 5 * d * j + 5 * c * k),
        (T += R >>> 13),
        (R &= 8191));
      let z = T + O * c + A * u + I * f + B * l + _ * a;
      ((T = z >>> 13),
        (z &= 8191),
        (z += S * o + U * s + 5 * b * P + 5 * h * j + 5 * d * k),
        (T += z >>> 13),
        (z &= 8191));
      let F = T + O * d + A * c + I * u + B * f + _ * l;
      ((T = F >>> 13),
        (F &= 8191),
        (F += S * a + U * o + P * s + 5 * b * j + 5 * h * k),
        (T += F >>> 13),
        (F &= 8191));
      let $ = T + O * h + A * d + I * c + B * u + _ * f;
      ((T = $ >>> 13),
        ($ &= 8191),
        ($ += S * l + U * a + P * o + j * s + 5 * b * k),
        (T += $ >>> 13),
        ($ &= 8191));
      let H = T + O * b + A * h + I * d + B * c + _ * u;
      ((T = H >>> 13),
        (H &= 8191),
        (H += S * f + U * l + P * a + j * o + k * s),
        (T += H >>> 13),
        (H &= 8191),
        (C = 8191 & (T = ((T = ((T << 2) + T) | 0) + C) | 0)),
        (T >>>= 13),
        (L += T),
        (n[0] = C),
        (n[1] = L),
        (n[2] = D),
        (n[3] = N),
        (n[4] = M),
        (n[5] = R),
        (n[6] = z),
        (n[7] = F),
        (n[8] = $),
        (n[9] = H));
    }
    finalize() {
      let { h: e, pad: t } = this,
        r = new Uint16Array(10),
        n = e[1] >>> 13;
      e[1] &= 8191;
      for (let t = 2; t < 10; t++)
        ((e[t] += n), (n = e[t] >>> 13), (e[t] &= 8191));
      ((e[0] += 5 * n),
        (n = e[0] >>> 13),
        (e[0] &= 8191),
        (e[1] += n),
        (n = e[1] >>> 13),
        (e[1] &= 8191),
        (e[2] += n),
        (r[0] = e[0] + 5),
        (n = r[0] >>> 13),
        (r[0] &= 8191));
      for (let t = 1; t < 10; t++)
        ((r[t] = e[t] + n), (n = r[t] >>> 13), (r[t] &= 8191));
      r[9] -= 8192;
      let i = (1 ^ n) - 1;
      for (let e = 0; e < 10; e++) r[e] &= i;
      i = ~i;
      for (let t = 0; t < 10; t++) e[t] = (e[t] & i) | r[t];
      ((e[0] = (e[0] | (e[1] << 13)) & 65535),
        (e[1] = ((e[1] >>> 3) | (e[2] << 10)) & 65535),
        (e[2] = ((e[2] >>> 6) | (e[3] << 7)) & 65535),
        (e[3] = ((e[3] >>> 9) | (e[4] << 4)) & 65535),
        (e[4] = ((e[4] >>> 12) | (e[5] << 1) | (e[6] << 14)) & 65535),
        (e[5] = ((e[6] >>> 2) | (e[7] << 11)) & 65535),
        (e[6] = ((e[7] >>> 5) | (e[8] << 8)) & 65535),
        (e[7] = ((e[8] >>> 8) | (e[9] << 5)) & 65535));
      let s = e[0] + t[0];
      e[0] = 65535 & s;
      for (let r = 1; r < 8; r++)
        ((s = (((e[r] + t[r]) | 0) + (s >>> 16)) | 0), (e[r] = 65535 & s));
      ry(r);
    }
    update(e) {
      (rp(this), rb((e = rm(e))));
      let { buffer: t, blockLen: r } = this,
        n = e.length;
      for (let i = 0; i < n; ) {
        let s = Math.min(r - this.pos, n - i);
        if (s === r) {
          for (; r <= n - i; i += r) this.process(e, i);
          continue;
        }
        (t.set(e.subarray(i, i + s), this.pos),
          (this.pos += s),
          (i += s),
          this.pos === r && (this.process(t, 0, !1), (this.pos = 0)));
      }
      return this;
    }
    destroy() {
      ry(this.h, this.r, this.buffer, this.pad);
    }
    digestInto(e) {
      (rp(this),
        (function (e, t) {
          rb(e);
          let r = t.outputLen;
          if (e.length < r)
            throw Error(
              "digestInto() expects output buffer of length at least " + r,
            );
        })(e, this),
        (this.finished = !0));
      let { buffer: t, h: r } = this,
        { pos: n } = this;
      if (n) {
        for (t[n++] = 1; n < 16; n++) t[n] = 0;
        this.process(t, 0, !0);
      }
      this.finalize();
      let i = 0;
      for (let t = 0; t < 8; t++)
        ((e[i++] = r[t] >>> 0), (e[i++] = r[t] >>> 8));
      return e;
    }
    digest() {
      let { buffer: e, outputLen: t } = this;
      this.digestInto(e);
      let r = e.slice(0, t);
      return (this.destroy(), r);
    }
  }
  let rT =
      ((u = (e) => new rk(e)),
      ((n = (e, t) => u(t).update(rm(e)).digest()).outputLen = (i = u(
        new Uint8Array(32),
      )).outputLen),
      (n.blockLen = i.blockLen),
      (n.create = (e) => u(e)),
      n),
    rC = (function (e, t) {
      let {
        allowShortKeys: r,
        extendNonceFn: n,
        counterLength: i,
        counterRight: s,
        rounds: o,
      } = (function (e, t) {
        if (null == t || "object" != typeof t)
          throw Error("options must be defined");
        return Object.assign(e, t);
      })(
        { allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 },
        t,
      );
      if ("function" != typeof e) throw Error("core must be a function");
      return (
        rh(i),
        rh(o),
        rd(s),
        rd(r),
        (t, a, l, f, u = 0) => {
          (rb(t), rb(a), rb(l));
          let c = l.length;
          if (
            (void 0 === f && (f = new Uint8Array(c)),
            rb(f),
            rh(u),
            u < 0 || u >= 0xffffffff)
          )
            throw Error("arx: counter overflow");
          if (f.length < c)
            throw Error(
              `arx: output (${f.length}) is shorter than data (${c})`,
            );
          let d = [],
            h = t.length,
            b,
            p;
          if (32 === h) (d.push((b = rE(t))), (p = r_));
          else if (16 === h && r)
            ((b = new Uint8Array(32)).set(t),
              b.set(t, 16),
              (p = rB),
              d.push(b));
          else throw Error(`arx: invalid 32-byte key, got length=${h}`);
          rU(a) || d.push((a = rE(a)));
          let g = rg(b);
          if (n) {
            if (24 !== a.length)
              throw Error("arx: extended nonce must be 24 bytes");
            (n(p, g, rg(a.subarray(0, 16)), g), (a = a.subarray(16)));
          }
          let y = 16 - i;
          if (y !== a.length)
            throw Error(`arx: nonce must be ${y} or 16 bytes`);
          if (12 !== y) {
            let e = new Uint8Array(12);
            (e.set(a, s ? 0 : 12 - a.length), (a = e), d.push(a));
          }
          return (
            (function (e, t, r, n, i, s, o, a) {
              let l = i.length,
                f = new Uint8Array(64),
                u = rg(f),
                c = rU(i) && rU(s),
                d = c ? rg(i) : rP,
                h = c ? rg(s) : rP;
              for (let b = 0; b < l; o++) {
                if ((e(t, r, n, u, o, a), o >= 0xffffffff))
                  throw Error("arx: counter overflow");
                let p = Math.min(64, l - b);
                if (c && 64 === p) {
                  let e = b / 4;
                  if (b % 4 != 0) throw Error("arx: invalid block position");
                  for (let t = 0, r; t < 16; t++) h[(r = e + t)] = d[r] ^ u[t];
                  b += 64;
                  continue;
                }
                for (let e = 0, t; e < p; e++) s[(t = b + e)] = i[t] ^ f[e];
                b += p;
              }
            })(e, p, g, rg(a), l, f, u, o),
            ry(...d),
            f
          );
        }
      );
    })(
      function (e, t, r, n, i, s = 20) {
        let o = e[0],
          a = e[1],
          l = e[2],
          f = e[3],
          u = t[0],
          c = t[1],
          d = t[2],
          h = t[3],
          b = t[4],
          p = t[5],
          g = t[6],
          y = t[7],
          w = r[0],
          m = r[1],
          x = r[2],
          v = o,
          E = a,
          O = l,
          A = f,
          I = u,
          B = c,
          _ = d,
          S = h,
          U = b,
          P = p,
          j = g,
          k = y,
          T = i,
          C = w,
          L = m,
          D = x;
        for (let e = 0; e < s; e += 2)
          ((U = (U + (T = rS(T ^ (v = (v + I) | 0), 16))) | 0),
            (v = (v + (I = rS(I ^ U, 12))) | 0),
            (U = (U + (T = rS(T ^ v, 8))) | 0),
            (I = rS(I ^ U, 7)),
            (P = (P + (C = rS(C ^ (E = (E + B) | 0), 16))) | 0),
            (E = (E + (B = rS(B ^ P, 12))) | 0),
            (P = (P + (C = rS(C ^ E, 8))) | 0),
            (B = rS(B ^ P, 7)),
            (j = (j + (L = rS(L ^ (O = (O + _) | 0), 16))) | 0),
            (O = (O + (_ = rS(_ ^ j, 12))) | 0),
            (j = (j + (L = rS(L ^ O, 8))) | 0),
            (_ = rS(_ ^ j, 7)),
            (k = (k + (D = rS(D ^ (A = (A + S) | 0), 16))) | 0),
            (A = (A + (S = rS(S ^ k, 12))) | 0),
            (k = (k + (D = rS(D ^ A, 8))) | 0),
            (S = rS(S ^ k, 7)),
            (j = (j + (D = rS(D ^ (v = (v + B) | 0), 16))) | 0),
            (v = (v + (B = rS(B ^ j, 12))) | 0),
            (j = (j + (D = rS(D ^ v, 8))) | 0),
            (B = rS(B ^ j, 7)),
            (k = (k + (T = rS(T ^ (E = (E + _) | 0), 16))) | 0),
            (E = (E + (_ = rS(_ ^ k, 12))) | 0),
            (k = (k + (T = rS(T ^ E, 8))) | 0),
            (_ = rS(_ ^ k, 7)),
            (U = (U + (C = rS(C ^ (O = (O + S) | 0), 16))) | 0),
            (O = (O + (S = rS(S ^ U, 12))) | 0),
            (U = (U + (C = rS(C ^ O, 8))) | 0),
            (S = rS(S ^ U, 7)),
            (P = (P + (L = rS(L ^ (A = (A + I) | 0), 16))) | 0),
            (A = (A + (I = rS(I ^ P, 12))) | 0),
            (P = (P + (L = rS(L ^ A, 8))) | 0),
            (I = rS(I ^ P, 7)));
        let N = 0;
        ((n[N++] = (o + v) | 0),
          (n[N++] = (a + E) | 0),
          (n[N++] = (l + O) | 0),
          (n[N++] = (f + A) | 0),
          (n[N++] = (u + I) | 0),
          (n[N++] = (c + B) | 0),
          (n[N++] = (d + _) | 0),
          (n[N++] = (h + S) | 0),
          (n[N++] = (b + U) | 0),
          (n[N++] = (p + P) | 0),
          (n[N++] = (g + j) | 0),
          (n[N++] = (y + k) | 0),
          (n[N++] = (i + T) | 0),
          (n[N++] = (w + C) | 0),
          (n[N++] = (m + L) | 0),
          (n[N++] = (x + D) | 0));
      },
      { counterRight: !1, counterLength: 4, allowShortKeys: !1 },
    ),
    rL = new Uint8Array(16),
    rD = (e, t) => {
      e.update(t);
      let r = t.length % 16;
      r && e.update(rL.subarray(r));
    },
    rN = new Uint8Array(32);
  function rM(e, t, r, n, i) {
    var s, o;
    let a,
      l,
      f = e(t, r, rN),
      u = rT.create(f);
    (i && rD(u, i), rD(u, n));
    let c =
      ((s = n.length),
      (o = i ? i.length : 0),
      rd(!0),
      rv(
        (l = new DataView(
          (a = new Uint8Array(16)).buffer,
          a.byteOffset,
          a.byteLength,
        )),
        0,
        BigInt(o),
        !0,
      ),
      rv(l, 8, BigInt(s), !0),
      a);
    u.update(c);
    let d = u.digest();
    return (ry(f, c), d);
  }
  ((o = { blockSize: 64, nonceLength: 12, tagLength: 16 }),
    (a = (e, t, r) => ({
      encrypt(n, i) {
        let s = n.length;
        (i = rx(s + 16, i, !1)).set(n);
        let o = i.subarray(0, -16);
        rC(e, t, o, o, 1);
        let a = rM(rC, e, t, o, r);
        return (i.set(a, s), ry(a), i);
      },
      decrypt(n, i) {
        i = rx(n.length - 16, i, !1);
        let s = n.subarray(0, -16),
          o = n.subarray(-16),
          a = rM(rC, e, t, s, r);
        if (
          !(function (e, t) {
            if (e.length !== t.length) return !1;
            let r = 0;
            for (let n = 0; n < e.length; n++) r |= e[n] ^ t[n];
            return 0 === r;
          })(o, a)
        )
          throw Error("invalid tag");
        return (i.set(n.subarray(0, -16)), rC(e, t, i, i, 1), ry(a), i);
      },
    })),
    Object.assign(function (e, ...t) {
      if ((rb(e), !rw))
        throw Error("Non little-endian hardware is not yet supported");
      if (void 0 !== o.nonceLength) {
        let e = t[0];
        if (!e) throw Error("nonce / iv required");
        o.varSizeNonce ? rb(e) : rb(e, o.nonceLength);
      }
      let r = o.tagLength;
      r && void 0 !== t[1] && rb(t[1]);
      let n = a(e, ...t),
        i = (e, t) => {
          if (void 0 !== t) {
            if (2 !== e) throw Error("cipher output not supported");
            rb(t);
          }
        },
        s = !1;
      return {
        encrypt(e, t) {
          if (s) throw Error("cannot encrypt() twice with same key + nonce");
          return ((s = !0), rb(e), i(n.encrypt.length, t), n.encrypt(e, t));
        },
        decrypt(e, t) {
          if ((rb(e), r && e.length < r))
            throw Error(
              "invalid ciphertext length: smaller than tagLength=" + r,
            );
          return (i(n.decrypt.length, t), n.decrypt(e, t));
        },
      };
    }, o));
  class rR extends tj {
    constructor(e, t) {
      (super(), (this.finished = !1), (this.destroyed = !1), td(e));
      let r = tU(t);
      if (((this.iHash = e.create()), "function" != typeof this.iHash.update))
        throw Error("Expected instance of class which extends utils.Hash");
      ((this.blockLen = this.iHash.blockLen),
        (this.outputLen = this.iHash.outputLen));
      let n = this.blockLen,
        i = new Uint8Array(n);
      i.set(r.length > n ? e.create().update(r).digest() : r);
      for (let e = 0; e < i.length; e++) i[e] ^= 54;
      (this.iHash.update(i), (this.oHash = e.create()));
      for (let e = 0; e < i.length; e++) i[e] ^= 106;
      (this.oHash.update(i), tg(i));
    }
    update(e) {
      return (th(this), this.iHash.update(e), this);
    }
    digestInto(e) {
      (th(this),
        tc(e, this.outputLen),
        (this.finished = !0),
        this.iHash.digestInto(e),
        this.oHash.update(e),
        this.oHash.digestInto(e),
        this.destroy());
    }
    digest() {
      let e = new Uint8Array(this.oHash.outputLen);
      return (this.digestInto(e), e);
    }
    _cloneInto(e) {
      e || (e = Object.create(Object.getPrototypeOf(this), {}));
      let {
        oHash: t,
        iHash: r,
        finished: n,
        destroyed: i,
        blockLen: s,
        outputLen: o,
      } = this;
      return (
        (e.finished = n),
        (e.destroyed = i),
        (e.blockLen = s),
        (e.outputLen = o),
        (e.oHash = t._cloneInto(e.oHash)),
        (e.iHash = r._cloneInto(e.iHash)),
        e
      );
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      ((this.destroyed = !0), this.oHash.destroy(), this.iHash.destroy());
    }
  }
  let rz = (e, t, r) => new rR(e, t).update(r).digest();
  ((rz.create = (e, t) => new rR(e, t)), Uint8Array.from([0]), Uint8Array.of());
  let rF = BigInt(0),
    r$ = BigInt(1);
  function rH(e, t = "") {
    if ("boolean" != typeof e)
      throw Error((t && `"${t}"`) + "expected boolean, got type=" + typeof e);
    return e;
  }
  function rV(e, t, r = "") {
    let n = tf(e),
      i = e?.length,
      s = void 0 !== t;
    if (!n || (s && i !== t))
      throw Error(
        (r && `"${r}" `) +
          "expected Uint8Array" +
          (s ? ` of length ${t}` : "") +
          ", got " +
          (n ? `length=${i}` : `type=${typeof e}`),
      );
    return e;
  }
  function rG(e) {
    let t = e.toString(16);
    return 1 & t.length ? "0" + t : t;
  }
  function rq(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    return "" === e ? rF : BigInt("0x" + e);
  }
  function rK(e) {
    return (tc(e), rq(tI(Uint8Array.from(e).reverse())));
  }
  function rY(e, t) {
    return t_(e.toString(16).padStart(2 * t, "0"));
  }
  function rW(e, t) {
    return rY(e, t).reverse();
  }
  function rZ(e, t, r) {
    let n;
    if ("string" == typeof t)
      try {
        n = t_(t);
      } catch (t) {
        throw Error(e + " must be hex string or Uint8Array, cause: " + t);
      }
    else if (tf(t)) n = Uint8Array.from(t);
    else throw Error(e + " must be hex string or Uint8Array");
    let i = n.length;
    if ("number" == typeof r && i !== r)
      throw Error(e + " of length " + r + " expected, got " + i);
    return n;
  }
  let rX = (e) => "bigint" == typeof e && rF <= e;
  function rJ(e, t, r, n) {
    if (!(rX(t) && rX(r) && rX(n)) || !(r <= t) || !(t < n))
      throw Error(
        "expected valid " + e + ": " + r + " <= n < " + n + ", got " + t,
      );
  }
  function rQ(e) {
    let t;
    for (t = 0; e > rF; e >>= r$, t += 1);
    return t;
  }
  let r0 = (e) => (r$ << BigInt(e)) - r$;
  function r1(e, t, r = {}) {
    if (!e || "object" != typeof e)
      throw Error("expected valid options object");
    function n(t, r, n) {
      let i = e[t];
      if (n && void 0 === i) return;
      let s = typeof i;
      if (s !== r || null === i)
        throw Error(`param "${t}" is invalid: expected ${r}, got ${s}`);
    }
    (Object.entries(t).forEach(([e, t]) => n(e, t, !1)),
      Object.entries(r).forEach(([e, t]) => n(e, t, !0)));
  }
  function r2(e) {
    let t = new WeakMap();
    return (r, ...n) => {
      let i = t.get(r);
      if (void 0 !== i) return i;
      let s = e(r, ...n);
      return (t.set(r, s), s);
    };
  }
  let r3 = BigInt(0),
    r6 = BigInt(1),
    r8 = BigInt(2),
    r5 = BigInt(3),
    r4 = BigInt(4),
    r7 = BigInt(5),
    r9 = BigInt(7),
    ne = BigInt(8),
    nt = BigInt(9),
    nr = BigInt(16);
  function nn(e, t) {
    let r = e % t;
    return r >= r3 ? r : t + r;
  }
  function ni(e, t, r) {
    let n = e;
    for (; t-- > r3; ) ((n *= n), (n %= r));
    return n;
  }
  function ns(e, t) {
    if (e === r3) throw Error("invert: expected non-zero number");
    if (t <= r3) throw Error("invert: expected positive modulus, got " + t);
    let r = nn(e, t),
      n = t,
      i = r3,
      s = r6;
    for (; r !== r3; ) {
      let e = n / r,
        t = n % r,
        o = i - s * e;
      ((n = r), (r = t), (i = s), (s = o));
    }
    if (n !== r6) throw Error("invert: does not exist");
    return nn(i, t);
  }
  function no(e, t, r) {
    if (!e.eql(e.sqr(t), r)) throw Error("Cannot find square root");
  }
  function na(e, t) {
    let r = (e.ORDER + r6) / r4,
      n = e.pow(t, r);
    return (no(e, n, t), n);
  }
  function nl(e, t) {
    let r = (e.ORDER - r7) / ne,
      n = e.mul(t, r8),
      i = e.pow(n, r),
      s = e.mul(t, i),
      o = e.mul(e.mul(s, r8), i),
      a = e.mul(s, e.sub(o, e.ONE));
    return (no(e, a, t), a);
  }
  function nf(e) {
    if (e < r5) throw Error("sqrt is not defined for small field");
    let t = e - r6,
      r = 0;
    for (; t % r8 === r3; ) ((t /= r8), r++);
    let n = r8,
      i = nb(e);
    for (; 1 === nd(i, n); )
      if (n++ > 1e3)
        throw Error("Cannot find square root: probably non-prime P");
    if (1 === r) return na;
    let s = i.pow(n, t),
      o = (t + r6) / r8;
    return function (e, n) {
      if (e.is0(n)) return n;
      if (1 !== nd(e, n)) throw Error("Cannot find square root");
      let i = r,
        a = e.mul(e.ONE, s),
        l = e.pow(n, t),
        f = e.pow(n, o);
      for (; !e.eql(l, e.ONE); ) {
        if (e.is0(l)) return e.ZERO;
        let t = 1,
          r = e.sqr(l);
        for (; !e.eql(r, e.ONE); )
          if ((t++, (r = e.sqr(r)), t === i))
            throw Error("Cannot find square root");
        let n = r6 << BigInt(i - t - 1),
          s = e.pow(a, n);
        ((i = t), (a = e.sqr(s)), (l = e.mul(l, a)), (f = e.mul(f, s)));
      }
      return f;
    };
  }
  let nu = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN",
  ];
  function nc(e, t, r = !1) {
    let n = Array(t.length).fill(r ? e.ZERO : void 0),
      i = t.reduce(
        (t, r, i) => (e.is0(r) ? t : ((n[i] = t), e.mul(t, r))),
        e.ONE,
      ),
      s = e.inv(i);
    return (
      t.reduceRight(
        (t, r, i) => (e.is0(r) ? t : ((n[i] = e.mul(t, n[i])), e.mul(t, r))),
        s,
      ),
      n
    );
  }
  function nd(e, t) {
    let r = (e.ORDER - r6) / r8,
      n = e.pow(t, r),
      i = e.eql(n, e.ONE),
      s = e.eql(n, e.ZERO),
      o = e.eql(n, e.neg(e.ONE));
    if (!i && !s && !o) throw Error("invalid Legendre symbol result");
    return i ? 1 : s ? 0 : -1;
  }
  function nh(e, t) {
    void 0 !== t && tu(t);
    let r = void 0 !== t ? t : e.toString(2).length,
      n = Math.ceil(r / 8);
    return { nBitLength: r, nByteLength: n };
  }
  function nb(e, t, r = !1, n = {}) {
    let i;
    if (e <= r3) throw Error("invalid field: expected ORDER > 0, got " + e);
    let s,
      o,
      a = !1,
      l;
    if ("object" == typeof t && null != t) {
      if (n.sqrt || r) throw Error("cannot specify opts in two arguments");
      (t.BITS && (s = t.BITS),
        t.sqrt && (o = t.sqrt),
        "boolean" == typeof t.isLE && (r = t.isLE),
        "boolean" == typeof t.modFromBytes && (a = t.modFromBytes),
        (l = t.allowedLengths));
    } else ("number" == typeof t && (s = t), n.sqrt && (o = n.sqrt));
    let { nBitLength: f, nByteLength: u } = nh(e, s);
    if (u > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
    let c = Object.freeze({
      ORDER: e,
      isLE: r,
      BITS: f,
      BYTES: u,
      MASK: r0(f),
      ZERO: r3,
      ONE: r6,
      allowedLengths: l,
      create: (t) => nn(t, e),
      isValid: (t) => {
        if ("bigint" != typeof t)
          throw Error(
            "invalid field element: expected bigint, got " + typeof t,
          );
        return r3 <= t && t < e;
      },
      is0: (e) => e === r3,
      isValidNot0: (e) => !c.is0(e) && c.isValid(e),
      isOdd: (e) => (e & r6) === r6,
      neg: (t) => nn(-t, e),
      eql: (e, t) => e === t,
      sqr: (t) => nn(t * t, e),
      add: (t, r) => nn(t + r, e),
      sub: (t, r) => nn(t - r, e),
      mul: (t, r) => nn(t * r, e),
      pow: (e, t) =>
        (function (e, t, r) {
          if (r < r3) throw Error("invalid exponent, negatives unsupported");
          if (r === r3) return e.ONE;
          if (r === r6) return t;
          let n = e.ONE,
            i = t;
          for (; r > r3; )
            (r & r6 && (n = e.mul(n, i)), (i = e.sqr(i)), (r >>= r6));
          return n;
        })(c, e, t),
      div: (t, r) => nn(t * ns(r, e), e),
      sqrN: (e) => e * e,
      addN: (e, t) => e + t,
      subN: (e, t) => e - t,
      mulN: (e, t) => e * t,
      inv: (t) => ns(t, e),
      sqrt:
        o ||
        ((t) => {
          let r, n, s, o, a, l;
          return (
            i ||
              (i =
                e % r4 === r5
                  ? na
                  : e % ne === r7
                    ? nl
                    : e % nr === nt
                      ? ((r = nb(e)),
                        (s = (n = nf(e))(r, r.neg(r.ONE))),
                        (o = n(r, s)),
                        (a = n(r, r.neg(s))),
                        (l = (e + r9) / nr),
                        (e, t) => {
                          let r = e.pow(t, l),
                            n = e.mul(r, s),
                            i = e.mul(r, o),
                            f = e.mul(r, a),
                            u = e.eql(e.sqr(n), t),
                            c = e.eql(e.sqr(i), t);
                          ((r = e.cmov(r, n, u)), (n = e.cmov(f, i, c)));
                          let d = e.eql(e.sqr(n), t),
                            h = e.cmov(r, n, d);
                          return (no(e, h, t), h);
                        })
                      : nf(e)),
            i(c, t)
          );
        }),
      toBytes: (e) => (r ? rW(e, u) : rY(e, u)),
      fromBytes: (t, n = !0) => {
        if (l) {
          if (!l.includes(t.length) || t.length > u)
            throw Error(
              "Field.fromBytes: expected " + l + " bytes, got " + t.length,
            );
          let e = new Uint8Array(u);
          (e.set(t, r ? 0 : e.length - t.length), (t = e));
        }
        if (t.length !== u)
          throw Error(
            "Field.fromBytes: expected " + u + " bytes, got " + t.length,
          );
        let i = r ? rK(t) : rq(tI(t));
        if ((a && (i = nn(i, e)), !n && !c.isValid(i)))
          throw Error("invalid field element: outside of range 0..ORDER");
        return i;
      },
      invertBatch: (e) => nc(c, e),
      cmov: (e, t, r) => (r ? t : e),
    });
    return Object.freeze(c);
  }
  function np(e) {
    if ("bigint" != typeof e) throw Error("field order must be bigint");
    return Math.ceil(e.toString(2).length / 8);
  }
  function ng(e) {
    let t = np(e);
    return t + Math.ceil(t / 2);
  }
  let ny = BigInt(0),
    nw = BigInt(1);
  function nm(e, t) {
    let r = t.negate();
    return e ? r : t;
  }
  function nx(e, t) {
    let r = nc(
      e.Fp,
      t.map((e) => e.Z),
    );
    return t.map((t, n) => e.fromAffine(t.toAffine(r[n])));
  }
  function nv(e, t) {
    if (!Number.isSafeInteger(e) || e <= 0 || e > t)
      throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
  }
  function nE(e, t) {
    nv(e, t);
    let r = Math.ceil(t / e) + 1,
      n = 2 ** (e - 1),
      i = 2 ** e;
    return {
      windows: r,
      windowSize: n,
      mask: r0(e),
      maxNumber: i,
      shiftBy: BigInt(e),
    };
  }
  function nO(e, t, r) {
    let { windowSize: n, mask: i, maxNumber: s, shiftBy: o } = r,
      a = Number(e & i),
      l = e >> o;
    a > n && ((a -= s), (l += nw));
    let f = t * n;
    return {
      nextN: l,
      offset: f + Math.abs(a) - 1,
      isZero: 0 === a,
      isNeg: a < 0,
      isNegF: t % 2 != 0,
      offsetF: f,
    };
  }
  let nA = new WeakMap(),
    nI = new WeakMap();
  function nB(e) {
    return nI.get(e) || 1;
  }
  function n_(e) {
    if (e !== ny) throw Error("invalid wNAF");
  }
  class nS {
    constructor(e, t) {
      ((this.BASE = e.BASE),
        (this.ZERO = e.ZERO),
        (this.Fn = e.Fn),
        (this.bits = t));
    }
    _unsafeLadder(e, t, r = this.ZERO) {
      let n = e;
      for (; t > ny; ) (t & nw && (r = r.add(n)), (n = n.double()), (t >>= nw));
      return r;
    }
    precomputeWindow(e, t) {
      let { windows: r, windowSize: n } = nE(t, this.bits),
        i = [],
        s = e,
        o = s;
      for (let e = 0; e < r; e++) {
        ((o = s), i.push(o));
        for (let e = 1; e < n; e++) ((o = o.add(s)), i.push(o));
        s = o.double();
      }
      return i;
    }
    wNAF(e, t, r) {
      if (!this.Fn.isValid(r)) throw Error("invalid scalar");
      let n = this.ZERO,
        i = this.BASE,
        s = nE(e, this.bits);
      for (let e = 0; e < s.windows; e++) {
        let {
          nextN: o,
          offset: a,
          isZero: l,
          isNeg: f,
          isNegF: u,
          offsetF: c,
        } = nO(r, e, s);
        ((r = o), l ? (i = i.add(nm(u, t[c]))) : (n = n.add(nm(f, t[a]))));
      }
      return (n_(r), { p: n, f: i });
    }
    wNAFUnsafe(e, t, r, n = this.ZERO) {
      let i = nE(e, this.bits);
      for (let e = 0; e < i.windows && r !== ny; e++) {
        let { nextN: s, offset: o, isZero: a, isNeg: l } = nO(r, e, i);
        if (((r = s), !a)) {
          let e = t[o];
          n = n.add(l ? e.negate() : e);
        }
      }
      return (n_(r), n);
    }
    getPrecomputes(e, t, r) {
      let n = nA.get(t);
      return (
        n ||
          ((n = this.precomputeWindow(t, e)),
          1 !== e && ("function" == typeof r && (n = r(n)), nA.set(t, n))),
        n
      );
    }
    cached(e, t, r) {
      let n = nB(e);
      return this.wNAF(n, this.getPrecomputes(n, e, r), t);
    }
    unsafe(e, t, r, n) {
      let i = nB(e);
      return 1 === i
        ? this._unsafeLadder(e, t, n)
        : this.wNAFUnsafe(i, this.getPrecomputes(i, e, r), t, n);
    }
    createCache(e, t) {
      (nv(t, this.bits), nI.set(e, t), nA.delete(e));
    }
    hasCache(e) {
      return 1 !== nB(e);
    }
  }
  function nU(e, t, r) {
    if (!t) return nb(e, { isLE: r });
    if (t.ORDER !== e)
      throw Error("Field.ORDER must match order: Fp == p, Fn == n");
    return (
      r1(
        t,
        nu.reduce((e, t) => ((e[t] = "function"), e), {
          ORDER: "bigint",
          MASK: "bigint",
          BYTES: "number",
          BITS: "number",
        }),
      ),
      t
    );
  }
  (BigInt(0), BigInt(1), BigInt(2), BigInt(8), tS("HashToScalar-"));
  let nP = BigInt(0),
    nj = BigInt(1),
    nk = BigInt(2),
    nT = BigInt(1),
    nC = BigInt(2),
    nL = BigInt(3),
    nD = BigInt(5),
    nN = BigInt(8),
    nM = BigInt(
      "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
    ),
    nR = {
      p: nM,
      n: BigInt(
        "0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed",
      ),
      h: nN,
      a: BigInt(
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec",
      ),
      d: BigInt(
        "0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3",
      ),
      Gx: BigInt(
        "0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      ),
      Gy: BigInt(
        "0x6666666666666666666666666666666666666666666666666666666666666658",
      ),
    },
    nz =
      ((function (e) {
        let {
            P: t,
            type: r,
            adjustScalarBytes: n,
            powPminus2: i,
            randomBytes: s,
          } = (r1(e, { adjustScalarBytes: "function", powPminus2: "function" }),
          Object.freeze({ ...e })),
          o = "x25519" === r;
        if (!o && "x448" !== r) throw Error("invalid type");
        let a = o ? 32 : 56,
          l = BigInt(o ? 9 : 5),
          f = BigInt(o ? 121665 : 39081),
          u = o ? nk ** BigInt(254) : nk ** BigInt(447),
          c =
            u +
            (o
              ? BigInt(8) * nk ** BigInt(251) - nj
              : BigInt(4) * nk ** BigInt(445) - nj) +
            nj,
          d = (e) => nn(e, t),
          h = rW(d(l), a);
        h.slice();
      })({
        P: (s = nb(nR.p, { isLE: !0 }).ORDER),
        type: "x25519",
        powPminus2: (e) => {
          let t,
            r,
            n,
            i,
            o,
            a,
            l,
            f,
            u,
            c,
            d,
            h,
            b,
            p,
            { pow_p_5_8: g, b2: y } =
              ((t = BigInt(10)),
              (r = BigInt(20)),
              (n = BigInt(40)),
              (i = BigInt(80)),
              (a = (ni((o = (((e * e) % nM) * e) % nM), nC, nM) * o) % nM),
              (l = (ni(a, nT, nM) * e) % nM),
              (f = (ni(l, nD, nM) * l) % nM),
              (u = (ni(f, t, nM) * f) % nM),
              (c = (ni(u, r, nM) * u) % nM),
              (d = (ni(c, n, nM) * c) % nM),
              (h = (ni(d, i, nM) * d) % nM),
              (b = (ni(h, i, nM) * d) % nM),
              (p = (ni(b, t, nM) * f) % nM),
              { pow_p_5_8: (ni(p, nC, nM) * e) % nM, b2: o });
          return nn(ni(g, nL, s) * y, s);
        },
        adjustScalarBytes: function (e) {
          return ((e[0] &= 248), (e[31] &= 127), (e[31] |= 64), e);
        },
      }),
      (e, t) => (e + (e >= 0 ? t : -t) / nq) / t);
  function nF(e) {
    if (!["compact", "recovered", "der"].includes(e))
      throw Error('Signature format must be "compact", "recovered", or "der"');
    return e;
  }
  function n$(e, t) {
    let r = {};
    for (let n of Object.keys(t)) r[n] = void 0 === e[n] ? t[n] : e[n];
    return (
      rH(r.lowS, "lowS"),
      rH(r.prehash, "prehash"),
      void 0 !== r.format && nF(r.format),
      r
    );
  }
  let nH = {
      Err: class extends Error {
        constructor(e = "") {
          super(e);
        }
      },
      _tlv: {
        encode: (e, t) => {
          let { Err: r } = nH;
          if (e < 0 || e > 256) throw new r("tlv.encode: wrong tag");
          if (1 & t.length) throw new r("tlv.encode: unpadded data");
          let n = t.length / 2,
            i = rG(n);
          if ((i.length / 2) & 128)
            throw new r("tlv.encode: long form length too big");
          let s = n > 127 ? rG((i.length / 2) | 128) : "";
          return rG(e) + s + i + t;
        },
        decode(e, t) {
          let { Err: r } = nH,
            n = 0;
          if (e < 0 || e > 256) throw new r("tlv.encode: wrong tag");
          if (t.length < 2 || t[n++] !== e)
            throw new r("tlv.decode: wrong tlv");
          let i = t[n++],
            s = 0;
          if (128 & i) {
            let e = 127 & i;
            if (!e)
              throw new r("tlv.decode(long): indefinite length not supported");
            if (e > 4) throw new r("tlv.decode(long): byte length is too big");
            let o = t.subarray(n, n + e);
            if (o.length !== e)
              throw new r("tlv.decode: length bytes not complete");
            if (0 === o[0]) throw new r("tlv.decode(long): zero leftmost byte");
            for (let e of o) s = (s << 8) | e;
            if (((n += e), s < 128))
              throw new r("tlv.decode(long): not minimal encoding");
          } else s = i;
          let o = t.subarray(n, n + s);
          if (o.length !== s) throw new r("tlv.decode: wrong value length");
          return { v: o, l: t.subarray(n + s) };
        },
      },
      _int: {
        encode(e) {
          let { Err: t } = nH;
          if (e < nV) throw new t("integer: negative integers are not allowed");
          let r = rG(e);
          if ((8 & Number.parseInt(r[0], 16) && (r = "00" + r), 1 & r.length))
            throw new t("unexpected DER parsing assertion: unpadded hex");
          return r;
        },
        decode(e) {
          let { Err: t } = nH;
          if (128 & e[0]) throw new t("invalid signature integer: negative");
          if (0 === e[0] && !(128 & e[1]))
            throw new t("invalid signature integer: unnecessary leading zero");
          return rq(tI(e));
        },
      },
      toSig(e) {
        let { Err: t, _int: r, _tlv: n } = nH,
          i = rZ("signature", e),
          { v: s, l: o } = n.decode(48, i);
        if (o.length)
          throw new t("invalid signature: left bytes after parsing");
        let { v: a, l: l } = n.decode(2, s),
          { v: f, l: u } = n.decode(2, l);
        if (u.length)
          throw new t("invalid signature: left bytes after parsing");
        return { r: r.decode(a), s: r.decode(f) };
      },
      hexFromSig(e) {
        let { _tlv: t, _int: r } = nH,
          n = t.encode(2, r.encode(e.r)),
          i = t.encode(2, r.encode(e.s));
        return t.encode(48, n + i);
      },
    },
    nV = BigInt(0),
    nG = BigInt(1),
    nq = BigInt(2),
    nK = BigInt(3),
    nY = BigInt(4);
  function nW(e, t) {
    let r,
      { BYTES: n } = e;
    if ("bigint" == typeof t) r = t;
    else {
      let i = rZ("private key", t);
      try {
        r = e.fromBytes(i);
      } catch {
        throw Error(
          `invalid private key: expected ui8a of size ${n}, got ${typeof t}`,
        );
      }
    }
    if (!e.isValidNot0(r))
      throw Error("invalid private key: out of range [1..N-1]");
    return r;
  }
  function nZ(e) {
    return Uint8Array.of(e ? 2 : 3);
  }
  function nX(e, t) {
    return {
      secretKey: t.BYTES,
      publicKey: 1 + e.BYTES,
      publicKeyUncompressed: 1 + 2 * e.BYTES,
      publicKeyHasPrefix: !0,
      signature: 2 * t.BYTES,
    };
  }
  function nJ(e, t) {
    let r = (t) =>
      (function (e) {
        let t,
          {
            CURVE: r,
            curveOpts: n,
            hash: i,
            ecdsaOpts: s,
          } = (function (e) {
            let t,
              r,
              n,
              i,
              { CURVE: s, curveOpts: o } =
                ((t = {
                  a: e.a,
                  b: e.b,
                  p: e.Fp.ORDER,
                  n: e.n,
                  h: e.h,
                  Gx: e.Gx,
                  Gy: e.Gy,
                }),
                (r = e.Fp),
                (n = e.allowedPrivateKeyLengths
                  ? Array.from(
                      new Set(
                        e.allowedPrivateKeyLengths.map((e) => Math.ceil(e / 2)),
                      ),
                    )
                  : void 0),
                (i = {
                  Fp: r,
                  Fn: nb(t.n, {
                    BITS: e.nBitLength,
                    allowedLengths: n,
                    modFromBytes: e.wrapPrivateKey,
                  }),
                  allowInfinityPoint: e.allowInfinityPoint,
                  endo: e.endo,
                  isTorsionFree: e.isTorsionFree,
                  clearCofactor: e.clearCofactor,
                  fromBytes: e.fromBytes,
                  toBytes: e.toBytes,
                }),
                { CURVE: t, curveOpts: i }),
              a = {
                hmac: e.hmac,
                randomBytes: e.randomBytes,
                lowS: e.lowS,
                bits2int: e.bits2int,
                bits2int_modN: e.bits2int_modN,
              };
            return { CURVE: s, curveOpts: o, hash: e.hash, ecdsaOpts: a };
          })(e),
          o = (function (e, t, r = {}) {
            (td(t),
              r1(
                r,
                {},
                {
                  hmac: "function",
                  lowS: "boolean",
                  randomBytes: "function",
                  bits2int: "function",
                  bits2int_modN: "function",
                },
              ));
            let n = r.randomBytes || tT,
              i = r.hmac || ((e, ...r) => rz(t, e, tP(...r))),
              { Fp: s, Fn: o } = e,
              { ORDER: a, BITS: l } = o,
              {
                keygen: f,
                getPublicKey: u,
                getSharedSecret: c,
                utils: d,
                lengths: h,
              } = (function (e, t = {}) {
                let { Fn: r } = e,
                  n = t.randomBytes || tT,
                  i = Object.assign(nX(e.Fp, r), { seed: ng(r.ORDER) });
                function s(e) {
                  try {
                    return !!nW(r, e);
                  } catch {
                    return !1;
                  }
                }
                function o(e = n(i.seed)) {
                  return (function (e, t, r = !1) {
                    let n = e.length,
                      i = np(t),
                      s = ng(t);
                    if (n < 16 || n < s || n > 1024)
                      throw Error(
                        "expected " + s + "-1024 bytes of input, got " + n,
                      );
                    let o = nn(r ? rK(e) : rq(tI(e)), t - r6) + r6;
                    return r ? rW(o, i) : rY(o, i);
                  })(rV(e, i.seed, "seed"), r.ORDER);
                }
                function a(t, n = !0) {
                  return e.BASE.multiply(nW(r, t)).toBytes(n);
                }
                function l(t) {
                  if ("bigint" == typeof t) return !1;
                  if (t instanceof e) return !0;
                  let {
                    secretKey: n,
                    publicKey: s,
                    publicKeyUncompressed: o,
                  } = i;
                  if (r.allowedLengths || n === s) return;
                  let a = rZ("key", t).length;
                  return a === s || a === o;
                }
                return Object.freeze({
                  getPublicKey: a,
                  getSharedSecret: function (t, n, i = !0) {
                    if (!0 === l(t))
                      throw Error("first arg must be private key");
                    if (!1 === l(n))
                      throw Error("second arg must be public key");
                    let s = nW(r, t);
                    return e.fromHex(n).multiply(s).toBytes(i);
                  },
                  keygen: function (e) {
                    let t = o(e);
                    return { secretKey: t, publicKey: a(t) };
                  },
                  Point: e,
                  utils: {
                    isValidSecretKey: s,
                    isValidPublicKey: function (t, r) {
                      let { publicKey: n, publicKeyUncompressed: s } = i;
                      try {
                        let i = t.length;
                        return (
                          (!0 !== r || i === n) &&
                          (!1 !== r || i === s) &&
                          !!e.fromBytes(t)
                        );
                      } catch {
                        return !1;
                      }
                    },
                    randomSecretKey: o,
                    isValidPrivateKey: s,
                    randomPrivateKey: o,
                    normPrivateKeyToScalar: (e) => nW(r, e),
                    precompute: (t = 8, r = e.BASE) => r.precompute(t, !1),
                  },
                  lengths: i,
                });
              })(e, r),
              b = {
                prehash: !1,
                lowS: "boolean" == typeof r.lowS && r.lowS,
                format: void 0,
                extraEntropy: !1,
              },
              p = "compact";
            function g(e, t) {
              if (!o.isValidNot0(t))
                throw Error(
                  `invalid signature ${e}: out of range 1..Point.Fn.ORDER`,
                );
              return t;
            }
            class y {
              constructor(e, t, r) {
                ((this.r = g("r", e)),
                  (this.s = g("s", t)),
                  null != r && (this.recovery = r),
                  Object.freeze(this));
              }
              static fromBytes(e, t = p) {
                var r, n;
                let i, s;
                if (
                  ((r = e),
                  nF((n = t)),
                  (s = h.signature),
                  rV(
                    r,
                    "compact" === n ? s : "recovered" === n ? s + 1 : void 0,
                    `${n} signature`,
                  ),
                  "der" === t)
                ) {
                  let { r: t, s: r } = nH.toSig(rV(e));
                  return new y(t, r);
                }
                "recovered" === t &&
                  ((i = e[0]), (t = "compact"), (e = e.subarray(1)));
                let a = o.BYTES,
                  l = e.subarray(0, a),
                  f = e.subarray(a, 2 * a);
                return new y(o.fromBytes(l), o.fromBytes(f), i);
              }
              static fromHex(e, t) {
                return this.fromBytes(t_(e), t);
              }
              addRecoveryBit(e) {
                return new y(this.r, this.s, e);
              }
              recoverPublicKey(t) {
                let r = s.ORDER,
                  { r: n, s: i, recovery: l } = this;
                if (null == l || ![0, 1, 2, 3].includes(l))
                  throw Error("recovery id invalid");
                if (a * nq < r && l > 1)
                  throw Error("recovery id is ambiguous for h>1 curve");
                let f = 2 === l || 3 === l ? n + a : n;
                if (!s.isValid(f)) throw Error("recovery id 2 or 3 invalid");
                let u = s.toBytes(f),
                  c = e.fromBytes(tP(nZ((1 & l) == 0), u)),
                  d = o.inv(f),
                  h = m(rZ("msgHash", t)),
                  b = o.create(-h * d),
                  p = o.create(i * d),
                  g = e.BASE.multiplyUnsafe(b).add(c.multiplyUnsafe(p));
                if (g.is0()) throw Error("point at infinify");
                return (g.assertValidity(), g);
              }
              hasHighS() {
                return this.s > a >> nG;
              }
              toBytes(e = p) {
                if ((nF(e), "der" === e)) return t_(nH.hexFromSig(this));
                let t = o.toBytes(this.r),
                  r = o.toBytes(this.s);
                if ("recovered" === e) {
                  if (null == this.recovery)
                    throw Error("recovery bit must be present");
                  return tP(Uint8Array.of(this.recovery), t, r);
                }
                return tP(t, r);
              }
              toHex(e) {
                return tI(this.toBytes(e));
              }
              assertValidity() {}
              static fromCompact(e) {
                return y.fromBytes(rZ("sig", e), "compact");
              }
              static fromDER(e) {
                return y.fromBytes(rZ("sig", e), "der");
              }
              normalizeS() {
                return this.hasHighS()
                  ? new y(this.r, o.neg(this.s), this.recovery)
                  : this;
              }
              toDERRawBytes() {
                return this.toBytes("der");
              }
              toDERHex() {
                return tI(this.toBytes("der"));
              }
              toCompactRawBytes() {
                return this.toBytes("compact");
              }
              toCompactHex() {
                return tI(this.toBytes("compact"));
              }
            }
            let w =
                r.bits2int ||
                function (e) {
                  if (e.length > 8192) throw Error("input is too large");
                  let t = rq(tI(e)),
                    r = 8 * e.length - l;
                  return r > 0 ? t >> BigInt(r) : t;
                },
              m =
                r.bits2int_modN ||
                function (e) {
                  return o.create(w(e));
                },
              x = r0(l);
            function v(e) {
              return (rJ("num < 2^" + l, e, nV, x), o.toBytes(e));
            }
            function E(e, r) {
              return (
                rV(e, void 0, "message"),
                r ? rV(t(e), void 0, "prehashed message") : e
              );
            }
            return Object.freeze({
              keygen: f,
              getPublicKey: u,
              getSharedSecret: c,
              utils: d,
              lengths: h,
              Point: e,
              sign: function (r, s, l = {}) {
                let { seed: f, k2sig: u } = (function (t, r, i) {
                  if (["recovered", "canonical"].some((e) => e in i))
                    throw Error("sign() legacy options not supported");
                  let { lowS: s, prehash: l, extraEntropy: f } = n$(i, b),
                    u = m((t = E(t, l))),
                    c = nW(o, r),
                    d = [v(c), v(u)];
                  if (null != f && !1 !== f) {
                    let e = !0 === f ? n(h.secretKey) : f;
                    d.push(rZ("extraEntropy", e));
                  }
                  return {
                    seed: tP(...d),
                    k2sig: function (t) {
                      let r = w(t);
                      if (!o.isValidNot0(r)) return;
                      let n = o.inv(r),
                        i = e.BASE.multiply(r).toAffine(),
                        l = o.create(i.x);
                      if (l === nV) return;
                      let f = o.create(n * o.create(u + l * c));
                      if (f === nV) return;
                      let d = (2 * (i.x !== l)) | Number(i.y & nG),
                        h = f;
                      return (
                        s && f > a >> nG && ((h = o.neg(f)), (d ^= 1)),
                        new y(l, h, d)
                      );
                    },
                  };
                })((r = rZ("message", r)), s, l);
                return (function (e, t, r) {
                  if ("number" != typeof e || e < 2)
                    throw Error("hashLen must be a number");
                  if ("number" != typeof t || t < 2)
                    throw Error("qByteLen must be a number");
                  if ("function" != typeof r)
                    throw Error("hmacFn must be a function");
                  let n = (e) => new Uint8Array(e),
                    i = n(e),
                    s = n(e),
                    o = 0,
                    a = () => {
                      (i.fill(1), s.fill(0), (o = 0));
                    },
                    l = (...e) => r(s, i, ...e),
                    f = (e = n(0)) => {
                      ((s = l(Uint8Array.of(0), e)),
                        (i = l()),
                        0 !== e.length &&
                          ((s = l(Uint8Array.of(1), e)), (i = l())));
                    },
                    u = () => {
                      if (o++ >= 1e3) throw Error("drbg: tried 1000 values");
                      let e = 0,
                        r = [];
                      for (; e < t; ) {
                        let t = (i = l()).slice();
                        (r.push(t), (e += i.length));
                      }
                      return tP(...r);
                    };
                  return (e, t) => {
                    let r;
                    for (a(), f(e); !(r = t(u())); ) f();
                    return (a(), r);
                  };
                })(
                  t.outputLen,
                  o.BYTES,
                  i,
                )(f, u);
              },
              verify: function (t, r, n, i = {}) {
                let { lowS: s, prehash: a, format: l } = n$(i, b);
                if (
                  ((n = rZ("publicKey", n)),
                  (r = E(rZ("message", r), a)),
                  "strict" in i)
                )
                  throw Error("options.strict was renamed to lowS");
                let f =
                  void 0 === l
                    ? (function (e) {
                        let t,
                          r = "string" == typeof e || tf(e),
                          n =
                            !r &&
                            null !== e &&
                            "object" == typeof e &&
                            "bigint" == typeof e.r &&
                            "bigint" == typeof e.s;
                        if (!r && !n)
                          throw Error(
                            "invalid signature, expected Uint8Array, hex string or Signature instance",
                          );
                        if (n) t = new y(e.r, e.s);
                        else if (r) {
                          try {
                            t = y.fromBytes(rZ("sig", e), "der");
                          } catch (e) {
                            if (!(e instanceof nH.Err)) throw e;
                          }
                          if (!t)
                            try {
                              t = y.fromBytes(rZ("sig", e), "compact");
                            } catch {
                              return !1;
                            }
                        }
                        return t || !1;
                      })(t)
                    : y.fromBytes(rZ("sig", t), l);
                if (!1 === f) return !1;
                try {
                  let t = e.fromBytes(n);
                  if (s && f.hasHighS()) return !1;
                  let { r: i, s: a } = f,
                    l = m(r),
                    u = o.inv(a),
                    c = o.create(l * u),
                    d = o.create(i * u),
                    h = e.BASE.multiplyUnsafe(c).add(t.multiplyUnsafe(d));
                  return !h.is0() && o.create(h.x) === i;
                } catch {
                  return !1;
                }
              },
              recoverPublicKey: function (e, t, r = {}) {
                let { prehash: n } = n$(r, b);
                return (
                  (t = E(t, n)),
                  y.fromBytes(e, "recovered").recoverPublicKey(t).toBytes()
                );
              },
              Signature: y,
              hash: t,
            });
          })(
            (function (e, t = {}) {
              let r = (function (e, t, r = {}, n) {
                  if (
                    (void 0 === n && (n = "edwards" === e),
                    !t || "object" != typeof t)
                  )
                    throw Error(`expected valid ${e} CURVE object`);
                  for (let e of ["p", "n", "h"]) {
                    let r = t[e];
                    if (!("bigint" == typeof r && r > ny))
                      throw Error(`CURVE.${e} must be positive bigint`);
                  }
                  let i = nU(t.p, r.Fp, n),
                    s = nU(t.n, r.Fn, n);
                  for (let r of [
                    "Gx",
                    "Gy",
                    "a",
                    "weierstrass" === e ? "b" : "d",
                  ])
                    if (!i.isValid(t[r]))
                      throw Error(
                        `CURVE.${r} must be valid field element of CURVE.Fp`,
                      );
                  return {
                    CURVE: (t = Object.freeze(Object.assign({}, t))),
                    Fp: i,
                    Fn: s,
                  };
                })("weierstrass", e, t),
                { Fp: n, Fn: i } = r,
                s = r.CURVE,
                { h: o, n: a } = s;
              r1(
                t,
                {},
                {
                  allowInfinityPoint: "boolean",
                  clearCofactor: "function",
                  isTorsionFree: "function",
                  fromBytes: "function",
                  toBytes: "function",
                  endo: "object",
                  wrapPrivateKey: "boolean",
                },
              );
              let { endo: l } = t;
              if (
                l &&
                (!n.is0(s.a) ||
                  "bigint" != typeof l.beta ||
                  !Array.isArray(l.basises))
              )
                throw Error(
                  'invalid endo: expected "beta": bigint and "basises": array',
                );
              let f = nX(n, i);
              function u() {
                if (!n.isOdd)
                  throw Error(
                    "compression is not supported: Field does not have .isOdd()",
                  );
              }
              let c =
                  t.toBytes ||
                  function (e, t, r) {
                    let { x: i, y: s } = t.toAffine(),
                      o = n.toBytes(i);
                    return (rH(r, "isCompressed"), r)
                      ? (u(), tP(nZ(!n.isOdd(s)), o))
                      : tP(Uint8Array.of(4), o, n.toBytes(s));
                  },
                d =
                  t.fromBytes ||
                  function (e) {
                    rV(e, void 0, "Point");
                    let { publicKey: t, publicKeyUncompressed: r } = f,
                      i = e.length,
                      s = e[0],
                      o = e.subarray(1);
                    if (i === t && (2 === s || 3 === s)) {
                      let e,
                        t = n.fromBytes(o);
                      if (!n.isValid(t))
                        throw Error("bad point: is not on curve, wrong x");
                      let r = h(t);
                      try {
                        e = n.sqrt(r);
                      } catch (e) {
                        throw Error(
                          "bad point: is not on curve, sqrt error" +
                            (e instanceof Error ? ": " + e.message : ""),
                        );
                      }
                      return (
                        u(),
                        ((1 & s) == 1) !== n.isOdd(e) && (e = n.neg(e)),
                        { x: t, y: e }
                      );
                    }
                    if (i === r && 4 === s) {
                      let e = n.BYTES,
                        t = n.fromBytes(o.subarray(0, e)),
                        r = n.fromBytes(o.subarray(e, 2 * e));
                      if (!b(t, r)) throw Error("bad point: is not on curve");
                      return { x: t, y: r };
                    }
                    throw Error(
                      `bad point: got length ${i}, expected compressed=${t} or uncompressed=${r}`,
                    );
                  };
              function h(e) {
                let t = n.sqr(e),
                  r = n.mul(t, e);
                return n.add(n.add(r, n.mul(e, s.a)), s.b);
              }
              function b(e, t) {
                let r = n.sqr(t),
                  i = h(e);
                return n.eql(r, i);
              }
              if (!b(s.Gx, s.Gy))
                throw Error("bad curve params: generator point");
              let p = n.mul(n.pow(s.a, nK), nY),
                g = n.mul(n.sqr(s.b), BigInt(27));
              if (n.is0(n.add(p, g))) throw Error("bad curve params: a or b");
              function y(e, t, r = !1) {
                if (!n.isValid(t) || (r && n.is0(t)))
                  throw Error(`bad point coordinate ${e}`);
                return t;
              }
              function w(e) {
                if (!(e instanceof O)) throw Error("ProjectivePoint expected");
              }
              function m(e) {
                if (!l || !l.basises) throw Error("no endo");
                return (function (e, t, r) {
                  let [[n, i], [s, o]] = t,
                    a = nz(o * e, r),
                    l = nz(-i * e, r),
                    f = e - a * n - l * s,
                    u = -a * i - l * o,
                    c = f < nV,
                    d = u < nV;
                  (c && (f = -f), d && (u = -u));
                  let h = r0(Math.ceil(rQ(r) / 2)) + nG;
                  if (f < nV || f >= h || u < nV || u >= h)
                    throw Error("splitScalar (endomorphism): failed, k=" + e);
                  return { k1neg: c, k1: f, k2neg: d, k2: u };
                })(e, l.basises, i.ORDER);
              }
              let x = r2((e, t) => {
                  let { X: r, Y: i, Z: s } = e;
                  if (n.eql(s, n.ONE)) return { x: r, y: i };
                  let o = e.is0();
                  null == t && (t = o ? n.ONE : n.inv(s));
                  let a = n.mul(r, t),
                    l = n.mul(i, t),
                    f = n.mul(s, t);
                  if (o) return { x: n.ZERO, y: n.ZERO };
                  if (!n.eql(f, n.ONE)) throw Error("invZ was invalid");
                  return { x: a, y: l };
                }),
                v = r2((e) => {
                  if (e.is0()) {
                    if (t.allowInfinityPoint && !n.is0(e.Y)) return;
                    throw Error("bad point: ZERO");
                  }
                  let { x: r, y: i } = e.toAffine();
                  if (!n.isValid(r) || !n.isValid(i))
                    throw Error("bad point: x or y not field elements");
                  if (!b(r, i))
                    throw Error("bad point: equation left != right");
                  if (!e.isTorsionFree())
                    throw Error("bad point: not in prime-order subgroup");
                  return !0;
                });
              function E(e, t, r, i, s) {
                return (
                  (r = new O(n.mul(r.X, e), r.Y, r.Z)),
                  (t = nm(i, t)),
                  (r = nm(s, r)),
                  t.add(r)
                );
              }
              class O {
                constructor(e, t, r) {
                  ((this.X = y("x", e)),
                    (this.Y = y("y", t, !0)),
                    (this.Z = y("z", r)),
                    Object.freeze(this));
                }
                static CURVE() {
                  return s;
                }
                static fromAffine(e) {
                  let { x: t, y: r } = e || {};
                  if (!e || !n.isValid(t) || !n.isValid(r))
                    throw Error("invalid affine point");
                  if (e instanceof O)
                    throw Error("projective point not allowed");
                  return n.is0(t) && n.is0(r) ? O.ZERO : new O(t, r, n.ONE);
                }
                static fromBytes(e) {
                  let t = O.fromAffine(d(rV(e, void 0, "point")));
                  return (t.assertValidity(), t);
                }
                static fromHex(e) {
                  return O.fromBytes(rZ("pointHex", e));
                }
                get x() {
                  return this.toAffine().x;
                }
                get y() {
                  return this.toAffine().y;
                }
                precompute(e = 8, t = !0) {
                  return (I.createCache(this, e), t || this.multiply(nK), this);
                }
                assertValidity() {
                  v(this);
                }
                hasEvenY() {
                  let { y: e } = this.toAffine();
                  if (!n.isOdd) throw Error("Field doesn't support isOdd");
                  return !n.isOdd(e);
                }
                equals(e) {
                  w(e);
                  let { X: t, Y: r, Z: i } = this,
                    { X: s, Y: o, Z: a } = e,
                    l = n.eql(n.mul(t, a), n.mul(s, i)),
                    f = n.eql(n.mul(r, a), n.mul(o, i));
                  return l && f;
                }
                negate() {
                  return new O(this.X, n.neg(this.Y), this.Z);
                }
                double() {
                  let { a: e, b: t } = s,
                    r = n.mul(t, nK),
                    { X: i, Y: o, Z: a } = this,
                    l = n.ZERO,
                    f = n.ZERO,
                    u = n.ZERO,
                    c = n.mul(i, i),
                    d = n.mul(o, o),
                    h = n.mul(a, a),
                    b = n.mul(i, o);
                  return (
                    (b = n.add(b, b)),
                    (u = n.mul(i, a)),
                    (u = n.add(u, u)),
                    (l = n.mul(e, u)),
                    (f = n.mul(r, h)),
                    (f = n.add(l, f)),
                    (l = n.sub(d, f)),
                    (f = n.add(d, f)),
                    (f = n.mul(l, f)),
                    (l = n.mul(b, l)),
                    (u = n.mul(r, u)),
                    (h = n.mul(e, h)),
                    (b = n.sub(c, h)),
                    (b = n.mul(e, b)),
                    (b = n.add(b, u)),
                    (u = n.add(c, c)),
                    (c = n.add(u, c)),
                    (c = n.add(c, h)),
                    (c = n.mul(c, b)),
                    (f = n.add(f, c)),
                    (h = n.mul(o, a)),
                    (h = n.add(h, h)),
                    (c = n.mul(h, b)),
                    (l = n.sub(l, c)),
                    (u = n.mul(h, d)),
                    (u = n.add(u, u)),
                    new O(l, f, (u = n.add(u, u)))
                  );
                }
                add(e) {
                  w(e);
                  let { X: t, Y: r, Z: i } = this,
                    { X: o, Y: a, Z: l } = e,
                    f = n.ZERO,
                    u = n.ZERO,
                    c = n.ZERO,
                    d = s.a,
                    h = n.mul(s.b, nK),
                    b = n.mul(t, o),
                    p = n.mul(r, a),
                    g = n.mul(i, l),
                    y = n.add(t, r),
                    m = n.add(o, a);
                  ((y = n.mul(y, m)),
                    (m = n.add(b, p)),
                    (y = n.sub(y, m)),
                    (m = n.add(t, i)));
                  let x = n.add(o, l);
                  return (
                    (m = n.mul(m, x)),
                    (x = n.add(b, g)),
                    (m = n.sub(m, x)),
                    (x = n.add(r, i)),
                    (f = n.add(a, l)),
                    (x = n.mul(x, f)),
                    (f = n.add(p, g)),
                    (x = n.sub(x, f)),
                    (c = n.mul(d, m)),
                    (f = n.mul(h, g)),
                    (c = n.add(f, c)),
                    (f = n.sub(p, c)),
                    (c = n.add(p, c)),
                    (u = n.mul(f, c)),
                    (p = n.add(b, b)),
                    (p = n.add(p, b)),
                    (g = n.mul(d, g)),
                    (m = n.mul(h, m)),
                    (p = n.add(p, g)),
                    (g = n.sub(b, g)),
                    (g = n.mul(d, g)),
                    (m = n.add(m, g)),
                    (b = n.mul(p, m)),
                    (u = n.add(u, b)),
                    (b = n.mul(x, m)),
                    (f = n.mul(y, f)),
                    (f = n.sub(f, b)),
                    (b = n.mul(y, p)),
                    (c = n.mul(x, c)),
                    new O(f, u, (c = n.add(c, b)))
                  );
                }
                subtract(e) {
                  return this.add(e.negate());
                }
                is0() {
                  return this.equals(O.ZERO);
                }
                multiply(e) {
                  let r,
                    n,
                    { endo: s } = t;
                  if (!i.isValidNot0(e))
                    throw Error("invalid scalar: out of range");
                  let o = (e) => I.cached(this, e, (e) => nx(O, e));
                  if (s) {
                    let { k1neg: t, k1: i, k2neg: a, k2: l } = m(e),
                      { p: f, f: u } = o(i),
                      { p: c, f: d } = o(l);
                    ((n = u.add(d)), (r = E(s.beta, f, c, t, a)));
                  } else {
                    let { p: t, f: i } = o(e);
                    ((r = t), (n = i));
                  }
                  return nx(O, [r, n])[0];
                }
                multiplyUnsafe(e) {
                  let { endo: r } = t;
                  if (!i.isValid(e))
                    throw Error("invalid scalar: out of range");
                  if (e === nV || this.is0()) return O.ZERO;
                  if (e === nG) return this;
                  if (I.hasCache(this)) return this.multiply(e);
                  if (!r) return I.unsafe(this, e);
                  {
                    let { k1neg: t, k1: n, k2neg: i, k2: s } = m(e),
                      { p1: o, p2: a } = (function (e, t, r, n) {
                        let i = t,
                          s = e.ZERO,
                          o = e.ZERO;
                        for (; r > ny || n > ny; )
                          (r & nw && (s = s.add(i)),
                            n & nw && (o = o.add(i)),
                            (i = i.double()),
                            (r >>= nw),
                            (n >>= nw));
                        return { p1: s, p2: o };
                      })(O, this, n, s);
                    return E(r.beta, o, a, t, i);
                  }
                }
                multiplyAndAddUnsafe(e, t, r) {
                  let n = this.multiplyUnsafe(t).add(e.multiplyUnsafe(r));
                  return n.is0() ? void 0 : n;
                }
                toAffine(e) {
                  return x(this, e);
                }
                isTorsionFree() {
                  let { isTorsionFree: e } = t;
                  return o === nG || (e ? e(O, this) : I.unsafe(this, a).is0());
                }
                clearCofactor() {
                  let { clearCofactor: e } = t;
                  return o === nG
                    ? this
                    : e
                      ? e(O, this)
                      : this.multiplyUnsafe(o);
                }
                isSmallOrder() {
                  return this.multiplyUnsafe(o).is0();
                }
                toBytes(e = !0) {
                  return (
                    rH(e, "isCompressed"),
                    this.assertValidity(),
                    c(O, this, e)
                  );
                }
                toHex(e = !0) {
                  return tI(this.toBytes(e));
                }
                toString() {
                  return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
                }
                get px() {
                  return this.X;
                }
                get py() {
                  return this.X;
                }
                get pz() {
                  return this.Z;
                }
                toRawBytes(e = !0) {
                  return this.toBytes(e);
                }
                _setWindowSize(e) {
                  this.precompute(e);
                }
                static normalizeZ(e) {
                  return nx(O, e);
                }
                static msm(e, t) {
                  return (function (e, t, r, n) {
                    ((function (e, t) {
                      if (!Array.isArray(e)) throw Error("array expected");
                      e.forEach((e, r) => {
                        if (!(e instanceof t))
                          throw Error("invalid point at index " + r);
                      });
                    })(r, e),
                      (function (e, t) {
                        if (!Array.isArray(e))
                          throw Error("array of scalars expected");
                        e.forEach((e, r) => {
                          if (!t.isValid(e))
                            throw Error("invalid scalar at index " + r);
                        });
                      })(n, t));
                    let i = r.length,
                      s = n.length;
                    if (i !== s)
                      throw Error(
                        "arrays of points and scalars must have equal length",
                      );
                    let o = e.ZERO,
                      a = rQ(BigInt(i)),
                      l = 1;
                    a > 12
                      ? (l = a - 3)
                      : a > 4
                        ? (l = a - 2)
                        : a > 0 && (l = 2);
                    let f = r0(l),
                      u = Array(Number(f) + 1).fill(o),
                      c = Math.floor((t.BITS - 1) / l) * l,
                      d = o;
                    for (let e = c; e >= 0; e -= l) {
                      u.fill(o);
                      for (let t = 0; t < s; t++) {
                        let i = Number((n[t] >> BigInt(e)) & f);
                        u[i] = u[i].add(r[t]);
                      }
                      let t = o;
                      for (let e = u.length - 1, r = o; e > 0; e--)
                        ((r = r.add(u[e])), (t = t.add(r)));
                      if (((d = d.add(t)), 0 !== e))
                        for (let e = 0; e < l; e++) d = d.double();
                    }
                    return d;
                  })(O, i, e, t);
                }
                static fromPrivateKey(e) {
                  return O.BASE.multiply(nW(i, e));
                }
              }
              ((O.BASE = new O(s.Gx, s.Gy, n.ONE)),
                (O.ZERO = new O(n.ZERO, n.ONE, n.ZERO)),
                (O.Fp = n),
                (O.Fn = i));
              let A = i.BITS,
                I = new nS(O, t.endo ? Math.ceil(A / 2) : A);
              return (O.BASE.precompute(8), O);
            })(r, n),
            i,
            s,
          );
        return (
          (t = o.Point),
          Object.assign({}, o, {
            ProjectivePoint: t,
            CURVE: Object.assign({}, e, nh(t.Fn.ORDER, t.Fn.BITS)),
          })
        );
      })({ ...e, hash: t });
    return { ...r(t), create: r };
  }
  let nQ = {
      p: BigInt(
        "0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
      ),
      n: BigInt(
        "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
      ),
      h: BigInt(1),
      a: BigInt(
        "0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
      ),
      b: BigInt(
        "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
      ),
      Gx: BigInt(
        "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
      ),
      Gy: BigInt(
        "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5",
      ),
    },
    n0 = {
      p: BigInt(
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff",
      ),
      n: BigInt(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973",
      ),
      h: BigInt(1),
      a: BigInt(
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc",
      ),
      b: BigInt(
        "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef",
      ),
      Gx: BigInt(
        "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7",
      ),
      Gy: BigInt(
        "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",
      ),
    },
    n1 = {
      p: BigInt(
        "0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      ),
      n: BigInt(
        "0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409",
      ),
      h: BigInt(1),
      a: BigInt(
        "0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc",
      ),
      b: BigInt(
        "0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00",
      ),
      Gx: BigInt(
        "0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66",
      ),
      Gy: BigInt(
        "0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",
      ),
    },
    n2 = nb(nQ.p),
    n3 = nb(n0.p),
    n6 = nb(n1.p);
  (nJ({ ...nQ, Fp: n2, lowS: !1 }, rt),
    nJ({ ...n0, Fp: n3, lowS: !1 }, rn),
    nJ(
      { ...n1, Fp: n6, lowS: !1, allowedPrivateKeyLengths: [130, 131, 132] },
      rr,
    ),
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    e.i(409482),
    e.i(660075),
    e.i(669941),
    e.i(139434),
    e.i(327026),
    en.ONE_DAY,
    en.SIX_HOURS,
    en.THIRTY_DAYS,
    en.FIVE_SECONDS,
    en.THIRTY_DAYS,
    en.ONE_DAY,
    en.ONE_DAY,
    en.THIRTY_SECONDS,
    en.THIRTY_SECONDS,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_DAY);
  var n8 = function (e, t) {
    if (e.length >= 255) throw TypeError("Alphabet too long");
    for (var r = new Uint8Array(256), n = 0; n < r.length; n++) r[n] = 255;
    for (var i = 0; i < e.length; i++) {
      var s = e.charAt(i),
        o = s.charCodeAt(0);
      if (255 !== r[o]) throw TypeError(s + " is ambiguous");
      r[o] = i;
    }
    var a = e.length,
      l = e.charAt(0),
      f = Math.log(a) / Math.log(256),
      u = Math.log(256) / Math.log(a);
    function c(e) {
      if ("string" != typeof e) throw TypeError("Expected String");
      if (0 === e.length) return new Uint8Array();
      var t = 0;
      if (" " !== e[0]) {
        for (var n = 0, i = 0; e[t] === l; ) (n++, t++);
        for (
          var s = ((e.length - t) * f + 1) >>> 0, o = new Uint8Array(s);
          e[t];

        ) {
          var u = r[e.charCodeAt(t)];
          if (255 === u) return;
          for (var c = 0, d = s - 1; (0 !== u || c < i) && -1 !== d; d--, c++)
            ((u += (a * o[d]) >>> 0),
              (o[d] = u % 256 >>> 0),
              (u = (u / 256) >>> 0));
          if (0 !== u) throw Error("Non-zero carry");
          ((i = c), t++);
        }
        if (" " !== e[t]) {
          for (var h = s - i; h !== s && 0 === o[h]; ) h++;
          for (var b = new Uint8Array(n + (s - h)), p = n; h !== s; )
            b[p++] = o[h++];
          return b;
        }
      }
    }
    return {
      encode: function (t) {
        if (
          (t instanceof Uint8Array ||
            (ArrayBuffer.isView(t)
              ? (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength))
              : Array.isArray(t) && (t = Uint8Array.from(t))),
          !(t instanceof Uint8Array))
        )
          throw TypeError("Expected Uint8Array");
        if (0 === t.length) return "";
        for (var r = 0, n = 0, i = 0, s = t.length; i !== s && 0 === t[i]; )
          (i++, r++);
        for (
          var o = ((s - i) * u + 1) >>> 0, f = new Uint8Array(o);
          i !== s;

        ) {
          for (
            var c = t[i], d = 0, h = o - 1;
            (0 !== c || d < n) && -1 !== h;
            h--, d++
          )
            ((c += (256 * f[h]) >>> 0),
              (f[h] = c % a >>> 0),
              (c = (c / a) >>> 0));
          if (0 !== c) throw Error("Non-zero carry");
          ((n = d), i++);
        }
        for (var b = o - n; b !== o && 0 === f[b]; ) b++;
        for (var p = l.repeat(r); b < o; ++b) p += e.charAt(f[b]);
        return p;
      },
      decodeUnsafe: c,
      decode: function (e) {
        var r = c(e);
        if (r) return r;
        throw Error(`Non-${t} character`);
      },
    };
  };
  let n5 = (e) => {
    if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name)
      return e;
    if (e instanceof ArrayBuffer) return new Uint8Array(e);
    if (ArrayBuffer.isView(e))
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    throw Error("Unknown type, must be binary type");
  };
  class n4 {
    constructor(e, t, r) {
      ((this.name = e), (this.prefix = t), (this.baseEncode = r));
    }
    encode(e) {
      if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
      throw Error("Unknown type, must be binary type");
    }
  }
  class n7 {
    constructor(e, t, r) {
      if (((this.name = e), (this.prefix = t), void 0 === t.codePointAt(0)))
        throw Error("Invalid prefix character");
      ((this.prefixCodePoint = t.codePointAt(0)), (this.baseDecode = r));
    }
    decode(e) {
      if ("string" == typeof e) {
        if (e.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`,
          );
        return this.baseDecode(e.slice(this.prefix.length));
      }
      throw Error("Can only multibase decode strings");
    }
    or(e) {
      return ie(this, e);
    }
  }
  class n9 {
    constructor(e) {
      this.decoders = e;
    }
    or(e) {
      return ie(this, e);
    }
    decode(e) {
      let t = e[0],
        r = this.decoders[t];
      if (r) return r.decode(e);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`,
      );
    }
  }
  let ie = (e, t) =>
    new n9({
      ...(e.decoders || { [e.prefix]: e }),
      ...(t.decoders || { [t.prefix]: t }),
    });
  class it {
    constructor(e, t, r, n) {
      ((this.name = e),
        (this.prefix = t),
        (this.baseEncode = r),
        (this.baseDecode = n),
        (this.encoder = new n4(e, t, r)),
        (this.decoder = new n7(e, t, n)));
    }
    encode(e) {
      return this.encoder.encode(e);
    }
    decode(e) {
      return this.decoder.decode(e);
    }
  }
  let ir = ({ name: e, prefix: t, encode: r, decode: n }) => new it(e, t, r, n),
    ii = ({ prefix: e, name: t, alphabet: r }) => {
      let { encode: n, decode: i } = n8(r, t);
      return ir({ prefix: e, name: t, encode: n, decode: (e) => n5(i(e)) });
    },
    is = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n }) =>
      ir({
        prefix: t,
        name: e,
        encode: (e) =>
          ((e, t, r) => {
            let n = "=" === t[t.length - 1],
              i = (1 << r) - 1,
              s = "",
              o = 0,
              a = 0;
            for (let n = 0; n < e.length; ++n)
              for (a = (a << 8) | e[n], o += 8; o > r; )
                ((o -= r), (s += t[i & (a >> o)]));
            if ((o && (s += t[i & (a << (r - o))]), n))
              for (; (s.length * r) & 7; ) s += "=";
            return s;
          })(e, n, r),
        decode: (t) =>
          ((e, t, r, n) => {
            let i = {};
            for (let e = 0; e < t.length; ++e) i[t[e]] = e;
            let s = e.length;
            for (; "=" === e[s - 1]; ) --s;
            let o = new Uint8Array(((s * r) / 8) | 0),
              a = 0,
              l = 0,
              f = 0;
            for (let t = 0; t < s; ++t) {
              let s = i[e[t]];
              if (void 0 === s) throw SyntaxError(`Non-${n} character`);
              ((l = (l << r) | s),
                (a += r) >= 8 && ((a -= 8), (o[f++] = 255 & (l >> a))));
            }
            if (a >= r || 255 & (l << (8 - a)))
              throw SyntaxError("Unexpected end of data");
            return o;
          })(t, n, r, e),
      });
  var io = Object.freeze({
      __proto__: null,
      identity: ir({
        prefix: "\0",
        name: "identity",
        encode: (e) => new TextDecoder().decode(e),
        decode: (e) => new TextEncoder().encode(e),
      }),
    }),
    ia = Object.freeze({
      __proto__: null,
      base2: is({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 }),
    }),
    il = Object.freeze({
      __proto__: null,
      base8: is({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3,
      }),
    }),
    iu = Object.freeze({
      __proto__: null,
      base10: ii({ prefix: "9", name: "base10", alphabet: "0123456789" }),
    }),
    ic = Object.freeze({
      __proto__: null,
      base16: is({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4,
      }),
      base16upper: is({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4,
      }),
    }),
    id = Object.freeze({
      __proto__: null,
      base32: is({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5,
      }),
      base32upper: is({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5,
      }),
      base32pad: is({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5,
      }),
      base32padupper: is({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5,
      }),
      base32hex: is({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5,
      }),
      base32hexupper: is({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5,
      }),
      base32hexpad: is({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5,
      }),
      base32hexpadupper: is({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5,
      }),
      base32z: is({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5,
      }),
    }),
    ih = Object.freeze({
      __proto__: null,
      base36: ii({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz",
      }),
      base36upper: ii({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      }),
    }),
    ib = Object.freeze({
      __proto__: null,
      base58btc: ii({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
      }),
      base58flickr: ii({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
      }),
    }),
    ip = Object.freeze({
      __proto__: null,
      base64: is({
        prefix: "m",
        name: "base64",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6,
      }),
      base64pad: is({
        prefix: "M",
        name: "base64pad",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6,
      }),
      base64url: is({
        prefix: "u",
        name: "base64url",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6,
      }),
      base64urlpad: is({
        prefix: "U",
        name: "base64urlpad",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6,
      }),
    });
  let ig = Array.from(
      "🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂",
    ),
    iy = ig.reduce((e, t, r) => ((e[r] = t), e), []),
    iw = ig.reduce((e, t, r) => ((e[t.codePointAt(0)] = r), e), []);
  var im = Object.freeze({
    __proto__: null,
    base256emoji: ir({
      prefix: "🚀",
      name: "base256emoji",
      encode: function (e) {
        return e.reduce((e, t) => (e += iy[t]), "");
      },
      decode: function (e) {
        let t = [];
        for (let r of e) {
          let e = iw[r.codePointAt(0)];
          if (void 0 === e) throw Error(`Non-base256emoji character: ${r}`);
          t.push(e);
        }
        return new Uint8Array(t);
      },
    }),
  });
  function ix(e, t, r) {
    ((t = t || []), (r = r || 0));
    for (var n = r; e >= 0x80000000; ) ((t[r++] = (255 & e) | 128), (e /= 128));
    for (; -128 & e; ) ((t[r++] = (255 & e) | 128), (e >>>= 7));
    return ((t[r] = 0 | e), (ix.bytes = r - n + 1), t);
  }
  var iv = function (e) {
    return e < 128
      ? 1
      : e < 16384
        ? 2
        : e < 2097152
          ? 3
          : e < 0x10000000
            ? 4
            : e < 0x800000000
              ? 5
              : e < 0x40000000000
                ? 6
                : e < 0x2000000000000
                  ? 7
                  : e < 0x100000000000000
                    ? 8
                    : e < 0x8000000000000000
                      ? 9
                      : 10;
  };
  let iE = (e, t, r = 0) => (ix(e, t, r), t),
    iO = (e, t) => {
      let r = t.byteLength,
        n = iv(e),
        i = n + iv(r),
        s = new Uint8Array(i + r);
      return (iE(e, s, 0), iE(r, s, n), s.set(t, i), new iA(e, r, t, s));
    };
  class iA {
    constructor(e, t, r, n) {
      ((this.code = e), (this.size = t), (this.digest = r), (this.bytes = n));
    }
  }
  let iI = ({ name: e, code: t, encode: r }) => new iB(e, t, r);
  class iB {
    constructor(e, t, r) {
      ((this.name = e), (this.code = t), (this.encode = r));
    }
    digest(e) {
      if (e instanceof Uint8Array) {
        let t = this.encode(e);
        return t instanceof Uint8Array
          ? iO(this.code, t)
          : t.then((e) => iO(this.code, e));
      }
      throw Error("Unknown type, must be binary type");
    }
  }
  let i_ = (e) => async (t) => new Uint8Array(await crypto.subtle.digest(e, t));
  var iS = Object.freeze({
      __proto__: null,
      sha256: iI({ name: "sha2-256", code: 18, encode: i_("SHA-256") }),
      sha512: iI({ name: "sha2-512", code: 19, encode: i_("SHA-512") }),
    }),
    iU = Object.freeze({
      __proto__: null,
      identity: {
        code: 0,
        name: "identity",
        encode: n5,
        digest: (e) => iO(0, n5(e)),
      },
    });
  (new TextEncoder(), new TextDecoder());
  let iP = {
    ...io,
    ...ia,
    ...il,
    ...iu,
    ...ic,
    ...id,
    ...ih,
    ...ib,
    ...ip,
    ...im,
  };
  function ij(e, t, r, n) {
    return {
      name: e,
      prefix: t,
      encoder: { name: e, prefix: t, encode: r },
      decoder: { decode: n },
    };
  }
  (({ ...iS, ...iU }),
    ij(
      "utf8",
      "u",
      (e) => "u" + new TextDecoder("utf8").decode(e),
      (e) => new TextEncoder().encode(e.substring(1)),
    ),
    ij(
      "ascii",
      "a",
      (e) => {
        let t = "a";
        for (let r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
        return t;
      },
      (e) => {
        let t = (function (e = 0) {
          var t;
          return null != globalThis.Buffer &&
            null != globalThis.Buffer.allocUnsafe
            ? ((t = globalThis.Buffer.allocUnsafe(e)),
              null != globalThis.Buffer
                ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
                : t)
            : new Uint8Array(e);
        })((e = e.substring(1)).length);
        for (let r = 0; r < e.length; r++) t[r] = e.charCodeAt(r);
        return t;
      },
    ),
    iP.base16,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    en.THIRTY_DAYS,
    en.SEVEN_DAYS,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_DAY,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_DAY,
    en.ONE_HOUR,
    en.ONE_HOUR,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.FIVE_MINUTES,
    en.SEVEN_DAYS,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    e.i(700545),
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    Object.prototype.hasOwnProperty,
    Object.prototype.propertyIsEnumerable,
    e.i(768820),
    e.i(1095),
    e.i(785373),
    e.i(252494));
  (J.S, W.t, Z.s, X.g, Z.f, J.a);
  let ik = (e = Date.now()) => ({
    message: `Sign in to pump.fun: ${e}`,
    timestamp: e,
  });
  class iT extends Error {
    statusCode = 405;
    constructor(e = "Wallet not allowed") {
      (super(e), (this.name = "PumpFunAuthLoginNotAllowedError"));
    }
  }
  class iC extends Error {
    statusCode = 409;
    provider;
    constructor(e, t = "Wallet belongs to a Privy account") {
      (super(t),
        (this.name = "PumpFunAuthLoginPrivyAccountExistsError"),
        (this.provider = e));
    }
  }
  class iL extends Error {
    statusCode = 404;
    constructor(e = "No account for this wallet") {
      (super(e), (this.name = "PumpFunAuthLoginAccountNotFoundError"));
    }
  }
  class iD extends Error {
    statusCode = 409;
    constructor(e = "An account already exists for this wallet") {
      (super(e), (this.name = "PumpFunAuthRegisterAccountExistsError"));
    }
  }
  var iN = e.i(402030);
  let iM = (e) => {
    if ((0, iN.isContractError)(e) && 405 === e.status) throw new iT();
    if ((0, iN.isContractError)(e) && 409 === e.status) {
      var t;
      let r =
        "object" != typeof (t = e.data) ||
        null === t ||
        "privy_account_exists" !== t.code
          ? null
          : { provider: "string" == typeof t.provider ? t.provider : null };
      if (r) throw new iC(r.provider);
    }
    throw e;
  };
  async function iR(e, t) {
    let { rawJwt: r, ...n } = t;
    try {
      return !0 === r
        ? await e("POST /auth/login/token", { body: n })
        : await e("POST /auth/login/session", { body: n });
    } catch (r) {
      let e, t;
      if (
        (0, iN.isContractError)(r) &&
        ((e = r.status), (t = r.code), 404 === e && "ACCOUNT_NOT_FOUND" === t)
      )
        throw new iL();
      return iM(r);
    }
  }
  async function iz(e, t) {
    try {
      return await e("POST /auth/register", { body: t });
    } catch (r) {
      let e, t;
      if (
        (0, iN.isContractError)(r) &&
        ((e = r.status), (t = r.code), 409 === e && "ACCOUNT_EXISTS" === t)
      )
        throw new iD();
      return iM(r);
    }
  }
  async function iF(e, t) {
    try {
      return await iR(e, t);
    } catch (e) {
      if (!(e instanceof iL)) throw e;
    }
    try {
      return await iz(e, t);
    } catch (e) {
      if (!(e instanceof iD)) throw e;
    }
    return iR(e, t);
  }
  var i$ = e.i(944410),
    iH = e.i(254667),
    iV = e.i(426091),
    iG = e.i(516755),
    iq = e.i(567437),
    iK = e.i(528600),
    iY = e.i(867480),
    iW = e.i(466786),
    iZ = e.i(683023),
    iX = e.i(594435),
    iJ = e.i(350741),
    iQ = e.i(174764),
    i0 = e.i(447275),
    i1 = e.i(971370);
  let i2 = async (e, t, r) => {
      try {
        let n = new i1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
          i = new i1.TransactionInstruction({
            keys: [],
            programId: n,
            data: Y.Buffer.from(r, "utf8"),
          }),
          s = new i1.Transaction().add(i),
          { blockhash: o } = await e.getLatestBlockhash("finalized");
        return ((s.recentBlockhash = o), (s.feePayer = new i1.PublicKey(t)), s);
      } catch (e) {
        return (console.error("Error creating memo transaction:", e), null);
      }
    },
    i3 = () => {
      (0, iJ.c)();
    };
  var i6 = e.i(682455),
    i8 = e.i(168534),
    i5 = e.i(932177),
    i4 = e.i(914549),
    i7 = e.i(23729),
    i9 = e.i(829183),
    se = e.i(553301);
  let st = (e, t) => (t ? { address: e, uiOptions: t } : { address: e }),
    sr = "Your wallet is still getting set up. Try again in a moment.";
  async function sn(e) {
    let {
      bytes: t,
      shouldUsePrivy: r,
      privyWallet: n,
      expectedAddress: i,
      adapterAddress: s,
      signPrivyMessage: o,
      adapterSignMessage: a,
      waitForPrivyWallet: l,
      encode: f,
      uiOptions: u,
    } = e;
    if (r && n?.address)
      return f(await o({ message: t, options: st(n.address, u) }));
    if (a && (!r || (s && (!i || s === i)))) return f(await a(t));
    if (r) {
      let e = await l();
      if (e?.address) {
        if (i && e.address !== i) throw Error(sr);
        return f(await o({ message: t, options: st(e.address, u) }));
      }
      throw Error(sr);
    }
    throw Error("Active wallet does not support signMessage");
  }
  function si(e) {
    let t,
      r = new Set(),
      n = e?.setTimeoutFn ?? ((e, t) => setTimeout(e, t)),
      i =
        e?.clearTimeoutFn ??
        ((e) => {
          clearTimeout(e);
        }),
      s = e?.defaultTimeoutMs ?? 15e3;
    return {
      wait: (e = s) =>
        t
          ? Promise.resolve(t)
          : new Promise((t) => {
              let s,
                o = (e) => {
                  (void 0 !== s && i(s), t(e));
                };
              (r.add(o),
                (s = n(() => {
                  (r.delete(o), t(void 0));
                }, e)));
            }),
      setWallet: (e) => {
        if (((t = e), !e || 0 === r.size)) return;
        let n = Array.from(r);
        for (let t of (r.clear(), n)) t(e);
      },
      pendingCount: () => r.size,
    };
  }
  var ss = e.i(136354),
    so = e.i(256152);
  let sa = "decoded-jwt";
  class sl extends Error {
    constructor(e) {
      (super(`Privy wallet mint timed out after ${e}ms`),
        (this.name = "PrivyWalletMintTimeoutError"));
    }
  }
  class sf extends Error {
    constructor(e) {
      (super(`Privy wallet migration timed out after ${e}ms`),
        (this.name = "PrivyWalletMigrationTimeoutError"));
    }
  }
  function su(e, t, r) {
    return new Promise((n, i) => {
      let s = window.setTimeout(() => {
        i(r());
      }, t);
      e.then(
        (e) => {
          (window.clearTimeout(s), n(e));
        },
        (e) => {
          (window.clearTimeout(s), i(e));
        },
      );
    });
  }
  let sc = (e) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e)),
    sd =
      /already exists|already has an embedded wallet|embedded_wallet_already_exists/i,
    sh = (e) => sd.test(sc(e)),
    sb = /aborted a request|AbortError/i,
    sp = (e) => sb.test(sc(e));
  function sg() {
    try {
      let e = localStorage.getItem(sa);
      if (null == e) return;
      return JSON.parse(e);
    } catch {
      return null;
    }
  }
  function sy(e) {
    try {
      null == e
        ? localStorage.removeItem(sa)
        : localStorage.setItem(sa, JSON.stringify(e));
    } catch {}
  }
  let sw = (e) => (e instanceof Error ? e.message : String(e)),
    sm = ({
      children: e,
      connection: t,
      blockExternalWalletSignups: r = !1,
      isPrivyLinkFlowActive: n,
      pumpSignInIntent: i,
      refreshPrivyUser: s,
    }) => {
      let [o, a] = (0, R.useState)(!1),
        [l, f] = (0, R.useState)(!1),
        u = (0, R.useRef)(0),
        [d, b] = (0, R.useState)(0),
        [p, g] = (0, R.useState)(!1),
        [y, w] = (0, R.useState)(!1),
        [m, x] = (0, R.useState)(null),
        [E, O] = (0, R.useState)(null),
        [A, I] = (0, R.useState)(0),
        [B, _] = (0, R.useState)(!1),
        { clientServerUrl: S } = (0, ss.useUserConfig)(),
        U = (0, i$.useClientServerContract)(),
        P = (0, R.useRef)(null),
        j = (0, R.useRef)(null),
        k = (0, R.useRef)(!1),
        {
          signMessage: T,
          publicKey: C,
          disconnect: L,
          signTransaction: N,
        } = (0, iG.P)(),
        M = (function () {
          let {
            publicKey: e,
            signTransaction: t,
            signAllTransactions: r,
          } = (0, iG.P)();
          return (0, R.useMemo)(
            () =>
              e && t && r
                ? { publicKey: e, signTransaction: t, signAllTransactions: r }
                : void 0,
            [e, t, r],
          );
        })(),
        { logout: z, authenticated: F, ready: $, user: H } = (0, h.f)(),
        Z = (0, R.useMemo)(() => (0, i0.e)(H).isOn, [H]),
        { wallets: X, ready: J } = (0, so.f)(),
        { createWallet: Q } = (function () {
          let { create: e } = (0, W.e)();
          return {
            createWallet: async (t) => {
              t && "target" in t && t && (t = void 0);
              let { account: r } = await e({ chainType: "solana", options: t });
              return { wallet: r };
            },
          };
        })(),
        ee = X.some(i7.f),
        et = (0, R.useRef)(!1);
      (0, R.useEffect)(() => {
        et.current = F && !ee;
      }, [F, ee]);
      let er = (0, R.useCallback)(
          async (e) => {
            if (s)
              try {
                await su(s(), 1e4, () =>
                  Error("Privy user refresh timed out after 10000ms"),
                );
              } catch (t) {
                iH.y.warn(
                  "Privy user refresh after an existing-wallet answer failed",
                  { where: e, cause: sc(t) },
                );
              }
          },
          [s],
        ),
        { signMessage: en } = {
          signMessage: async function (...e) {
            let t = [];
            for (let r of e)
              t.push(await r.wallet.signMessage({ ...r, options: r.options }));
            return 1 === e.length ? t[0] : [...t];
          },
        },
        ei = (0, R.useCallback)((e) => (0, i9.S)(e, (e) => en(e)), [en]),
        { migrate: es } = (0, D._)(),
        eo = (0, R.useRef)(es);
      (0, R.useEffect)(() => {
        eo.current = es;
      });
      let { createWallet: ea } = (0, G.f)(),
        { signMessage: el } = (0, q.f)(),
        ef = (0, R.useRef)(el);
      (0, R.useEffect)(() => {
        ef.current = el;
      });
      let eu = (0, R.useRef)([]);
      (0, R.useEffect)(() => {
        eu.current = X;
      }, [X]);
      let ec = (0, R.useCallback)(
          async ({ message: e, options: t }) => {
            let r = eu.current.find(
              (e) => (0, i7.f)(e) && e.address === t.address,
            );
            if (!r)
              throw Error(
                "Privy Solana wallet is not connected for the requested address",
              );
            let { signature: n } = await ei({
              message: e,
              wallet: r,
              ...(t.uiOptions ? { options: { uiOptions: t.uiOptions } } : {}),
            });
            return n;
          },
          [ei],
        ),
        ed = (0, R.useRef)(null),
        eh = (0, R.useRef)(null);
      (0, R.useEffect)(() => {
        eh.current = H?.id ?? null;
      });
      let eb = (0, R.useCallback)(
          async (e) => {
            let t = (0, iY.n)(e);
            return t
              ? ((0, i6.U)({ userId: e.id, address: t }), t)
              : (0, i6.S)({
                  userId: e.id,
                  mint: ea,
                  isStillCurrent: () => eh.current === e.id,
                });
          },
          [ea],
        ),
        ep = H ? (0, iY.n)(H) : null,
        eg = (0, R.useRef)(null),
        ey = (0, R.useCallback)(() => ((eg.current ??= si()), eg.current), []);
      (0, R.useEffect)(() => {
        ey().setWallet(ep ? { address: ep } : void 0);
      }, [ep, ey]);
      let ew = (0, R.useCallback)(
          async (e) => {
            let t = await ey().wait(i8.h);
            if (!t)
              throw Error("EVM wallet did not surface in a committed render");
            if (t.address.toLowerCase() !== e.toLowerCase())
              throw Error("committed EVM wallet does not match the minted one");
            return t.address;
          },
          [ey],
        ),
        { login: em } = (0, K.d)({
          onComplete: async ({ user: e, isNewUser: t }) => {
            (g(!1),
              w(!1),
              x(null),
              (j.current = null),
              (P.current = null),
              t && (ed.current = e.id));
            let r = e.linkedAccounts.find(
              (e) =>
                "wallet" === e.type &&
                "privy" === e.walletClientType &&
                "solana" === e.chainType,
            );
            if (n?.(e.id) === !0 || (0, iY.J)(e)) {
              (iH.y.info(
                "Privy login without wallet mint — account is being linked",
                { privyUserId: e.id, isNewUser: t },
              ),
                (ed.current = null));
              return;
            }
            if (!r && i && !i.has()) {
              (iH.y.warn(
                "Privy login without wallet mint — no pump sign-in intent",
                { privyUserId: e.id, isNewUser: t },
              ),
                (ed.current = null));
              return;
            }
            if (!r) {
              O("minting_wallet");
              let e = Date.now();
              k.current = !0;
              try {
                await su(Q(), 2e4, () => new sl(2e4));
              } catch (r) {
                if (sh(r))
                  (iH.y.info(
                    "Privy wallet mint answered 'already exists' — refreshing the user to surface it",
                    { isNewUser: t, elapsedMs: Date.now() - e },
                  ),
                    await er("login"));
                else if (sp(r)) {
                  (iH.y.warn(
                    "Privy wallet mint request was cancelled by the browser",
                    { isNewUser: t, elapsedMs: Date.now() - e },
                  ),
                    O("awaiting_wallet"));
                  return;
                } else {
                  let n = r instanceof sl,
                    i = (0, i5.n)(r),
                    s =
                      "privy_session_expired" === i
                        ? i
                        : "privy_wallet_unreachable";
                  (iH.y.error("Privy wallet mint failed after login", {
                    reason: s,
                    timedOut: n,
                    isNewUser: t,
                    elapsedMs: Date.now() - e,
                    cause: r instanceof Error ? r.message : String(r),
                  }),
                    (ed.current = null),
                    O(null),
                    x(s),
                    "privy_session_expired" === s && (await z()));
                  return;
                }
              } finally {
                k.current = !1;
              }
            }
            (O("awaiting_wallet"),
              t &&
                eb(e).catch((e) => {
                  iH.y.warn("signup EVM wallet mint failed", {
                    reason: e instanceof Error ? e.message : String(e),
                  });
                }));
          },
        }),
        ex = (0, R.useCallback)(() => {
          (g(!1), O(null), (j.current = null), (P.current = null));
        }, []),
        ev = (0, R.useCallback)(() => {
          (w(!1), (P.current = null));
        }, []),
        eE = (0, R.useCallback)(() => {
          (x(null), O(null), (j.current = null), (P.current = null));
        }, []);
      (0, R.useEffect)(() => {
        F || O(null);
      }, [F]);
      let [eO, eA] = (0, R.useState)(() => sg() ?? null);
      (0, R.useEffect)(() => {
        let e = sg();
        void 0 !== e && eA(e);
      }, []);
      let eI = (0, R.useCallback)((e) => {
          if ("function" != typeof e) {
            (sy(e), (0, iJ.I)(), eA(e));
            return;
          }
          eA((t) => {
            let r = e(t);
            return (sy(r), r);
          });
        }, []),
        eB = (0, R.useCallback)(
          (e) =>
            (function (e) {
              try {
                localStorage.setItem("last-sort-update", JSON.stringify(e));
              } catch {}
            })(e),
          [],
        ),
        e_ = (0, iJ.s)(),
        eS = (0, R.useMemo)(() => (0, iY.F)(X, e_?.address), [X, e_?.address]),
        eU =
          F &&
          null !== H &&
          n?.(H.id) === !0 &&
          !(0, iY.H)({ user: H, walletAddress: e_?.address ?? "" }),
        eP = F && !eU,
        ej = eP && void 0 !== eS && (0, i7.f)(eS),
        ek = eO && !(0, iJ.i)(eO) ? eO : null,
        eT = ek && ek.address === e_?.address ? ek : e_;
      (0, R.useEffect)(() => {
        eO && e_?.address !== eO.address && eA(e_);
      }, [e_, eO]);
      let eC = eP ? (eS?.address ?? e_?.address) : (eT?.address ?? e_?.address),
        eL = !!e_ || ($ && J && 0 === d),
        eD = (0, R.useMemo)(() => C?.toBase58(), [C]),
        eN = (0, R.useMemo)(
          () =>
            !l &&
            (0, se.K)({
              decodedJwt: eT,
              privyAuthenticated: F,
              publicKeyAddress: eD,
            }),
          [eT, F, eD, l],
        ),
        { data: eM, refetch: eR } = (0, iK.U)({
          userIdentifier: (0, iW.f)(eT, eC) ?? eC ?? "",
        }),
        ez = (0, R.useMemo)(
          () =>
            eS
              ? (({ solanaWallet: e, signMessage: t }) => {
                  let r = new i1.PublicKey(e.address),
                    n = async (n) => {
                      let { signature: i } = await t({
                        message: new Uint8Array(
                          n instanceof i1.VersionedTransaction
                            ? n.message.serialize()
                            : n.serializeMessage(),
                        ),
                        wallet: e,
                        options: { uiOptions: { showWalletUIs: (0, i4.F)() } },
                      });
                      return (
                        n instanceof i1.VersionedTransaction
                          ? n.addSignature(r, i)
                          : n.addSignature(r, Y.Buffer.from(i)),
                        n
                      );
                    };
                  return {
                    address: e.address,
                    publicKey: r,
                    signTransaction: n,
                    signAllTransactions: async (e) => {
                      let t = [];
                      for (let r of e) t.push(await n(r));
                      return t;
                    },
                  };
                })({ solanaWallet: eS, signMessage: (e) => ei(e) })
              : void 0,
          [ei, eS],
        ),
        eF = (0, R.useMemo)(() => (eP ? ez : M), [M, ez, eP]),
        e$ = (0, R.useCallback)(async () => {
          ((u.current += 1), b((e) => e + 1));
          try {
            try {
              (F && (await z()),
                await L(),
                await U("POST /auth/logout", {
                  credentials: "include",
                  throwHttpErrors: !1,
                }));
            } catch (e) {
              iH.y.warn(
                "ProfileProvider: remote sign-out failed; clearing the local session",
                { error: String(e) },
              );
            }
            (i3(), iH.y.clearUserIdentity());
            try {
              localStorage.removeItem("moderator-storage");
            } catch {}
            (eI(null), eB(0), (P.current = null), (ed.current = null));
          } finally {
            b((e) => Math.max(0, e - 1));
          }
        }, [L, z, F, U]);
      (0, R.useEffect)(() => {
        !(0, iX.P)() || e_ || e$();
      }, []);
      let eH = (0, R.useCallback)(async () => {
          ((u.current += 1), f(!0), b((e) => e + 1));
          try {
            try {
              await U("POST /auth/logout", {
                credentials: "include",
                throwHttpErrors: !1,
              });
            } catch {}
            (i3(),
              eI(null),
              eB(0),
              iH.y.clearUserIdentity(),
              (P.current = null));
            try {
              localStorage.removeItem("moderator-storage");
            } catch {}
          } finally {
            (b((e) => Math.max(0, e - 1)), f(!1));
          }
        }, [U]),
        eV = (0, R.useCallback)(async () => {
          let e = u.current,
            t = await (0, iQ.f)(U);
          if (e !== u.current) return "ok";
          if ("rejected" === t.verdict)
            return (
              iH.y.warn("refreshDecodedJwt rejected after login", {
                status: t.status,
              }),
              eB(0),
              eI(null),
              i3(),
              (P.current = null),
              "invalid"
            );
          if ("inconclusive" === t.verdict)
            return (
              null === t.status
                ? iH.y.error("refreshDecodedJwt threw", { reason: sw(t.error) })
                : iH.y.warn("refreshDecodedJwt rejected after login", {
                    status: t.status,
                  }),
              "ok"
            );
          if (void 0 !== t.error)
            return (
              iH.y.error("refreshDecodedJwt threw", { reason: sw(t.error) }),
              "ok"
            );
          let r = (0, iZ.S)(t.payload);
          return (
            r &&
              (JSON.stringify(eO) !== JSON.stringify(r) && eI(r), (0, iJ.I)()),
            "ok"
          );
        }, [eO, U]),
        eG = (0, R.useCallback)(async () => {
          let e = await eV();
          return ("invalid" === e && (i3(), (P.current = null)), e);
        }, [eV]),
        eq = (0, R.useCallback)(
          async (e, t, r, n) => {
            let i,
              s = { address: e, signature: t, timestamp: r };
            (n?.authType && (s.authType = n.authType),
              n?.serializedTx && (s.transaction = n.serializedTx),
              n?.evmLinkChallenge &&
                ((s.evmAddress = n.evmLinkChallenge.evmAddress),
                (s.evmSignature = n.evmLinkChallenge.evmSignature),
                (s.solSignature = n.evmLinkChallenge.solSignature)));
            try {
              ((i = await iF(U, s)), (u.current += 1), (0, iJ.I)());
            } catch (t) {
              if (t instanceof iT)
                throw (
                  eP && (g(!0), (P.current = null), await z()),
                  await L(),
                  new iq.D(
                    iq.$.LOGIN_NOT_ALLOWED,
                    "Wallet connection unsuccessful",
                  )
                );
              if (t instanceof iC)
                throw (
                  iH.y.warn(
                    "auth/login refused — wallet belongs to a Privy account",
                    { address: e, provider: t.provider },
                  ),
                  await L(),
                  new iq.D(
                    iq.$.PRIVY_ACCOUNT_EXISTS,
                    "Wallet belongs to a Privy account",
                    { provider: t.provider },
                  )
                );
              throw (
                iH.y.error("postPumpFunAuthLogin failed", {
                  reason: t instanceof Error ? t.message : String(t),
                }),
                t
              );
            }
            let o = await (0, iQ.f)(U);
            if ("rejected" === o.verdict)
              throw (
                iH.y.warn("session cookie rejected after login", {
                  address: e,
                  status: o.status,
                }),
                new iq.D(
                  iq.$.SESSION_COOKIE_REJECTED,
                  "Browser did not keep the session cookie",
                  { status: o.status },
                )
              );
            return i;
          },
          [eP, g, z, L, U],
        ),
        eY = (0, R.useCallback)(
          async (e, t) => {
            if (!t || !e) throw Error("Wallet not connected");
            let { message: r, timestamp: n } = ik(),
              i = await t(new TextEncoder().encode(r));
            return eq(e, eK.f.encode(i), n, { authType: "non_custodial" });
          },
          [eq],
        ),
        eW = (0, R.useCallback)(async (e) => {
          O("migrating_wallet");
          let t = Date.now();
          try {
            (await su(eo.current(), 2e4, () => new sf(2e4))).migrated &&
              iH.y.info("Privy wallets migrated to TEE before sign-in", {
                address: e,
                elapsedMs: Date.now() - t,
              });
          } catch (r) {
            iH.y.warn(
              "Privy wallet migration before sign-in failed — signing anyway",
              {
                address: e,
                timedOut: r instanceof sf,
                elapsedMs: Date.now() - t,
                cause: r instanceof Error ? r.message : String(r),
              },
            );
          }
        }, []),
        eZ = (0, R.useCallback)(
          async (e) => {
            await eW(e);
            let { message: t, timestamp: r } = ik();
            O("signing");
            let n = await ec({
                message: new TextEncoder().encode(t),
                options: { address: e },
              }),
              i = eK.f.encode(n);
            O("posting");
            let s = null !== H && ed.current === H.id,
              o = Date.now(),
              a = "resolving",
              l = s
                ? await (0, i8.w)({
                    solAddress: e,
                    resolveEvmAddress: async () => {
                      let e = await eb(H);
                      if (null === e) return null;
                      a = "awaiting_commit";
                      let t = await ew(e);
                      return ((a = "committed"), t);
                    },
                    signEvmMessage: async ({ message: e, evmAddress: t }) => {
                      let { signature: r } = await ef.current(
                        { message: e },
                        { address: t, uiOptions: { showWalletUIs: !1 } },
                      );
                      return r;
                    },
                    signSolMessage: (t) =>
                      ec({
                        message: t,
                        options: {
                          address: e,
                          uiOptions: { showWalletUIs: !1 },
                        },
                      }),
                    encode: eK.f.encode,
                    onFailure: ({ stage: e, error: t }) => {
                      iH.y.warn("EVM link challenge dropped from auth/login", {
                        stage: e,
                        reason: t instanceof Error ? t.message : String(t),
                        evmWalletPhase: a,
                        elapsedMs: Date.now() - o,
                      });
                    },
                  })
                : null;
            if (!l) return ((ed.current = null), eq(e, i, r));
            let f = Date.now() - o;
            try {
              let t = await eq(e, i, r, { evmLinkChallenge: l });
              return (
                iH.y.info("EVM link challenge attached to auth/login", {
                  elapsedMs: f,
                }),
                t
              );
            } catch (t) {
              if (
                t instanceof iq.D &&
                (t.errorName === iq.$.LOGIN_NOT_ALLOWED ||
                  t.errorName === iq.$.SESSION_COOKIE_REJECTED)
              )
                throw t;
              return (
                iH.y.warn(
                  "auth/login with EVM link challenge failed — retrying without it",
                  { reason: t instanceof Error ? t.message : String(t) },
                ),
                eq(e, i, r)
              );
            } finally {
              ed.current = null;
            }
          },
          [eq, eW, ec, H, eb, ew],
        ),
        eX = (0, R.useRef)(null),
        eJ = (0, R.useCallback)(() => ((eX.current ??= si()), eX.current), []);
      (0, R.useEffect)(() => {
        let e = eS?.address;
        eJ().setWallet(e ? { address: e } : void 0);
      }, [eS?.address, eJ]);
      let eQ = (0, R.useCallback)(
          (e, t) =>
            sn({
              bytes: "string" == typeof e ? new TextEncoder().encode(e) : e,
              uiOptions: t,
              shouldUsePrivy: eP,
              privyWallet: eS?.address ? { address: eS.address } : void 0,
              expectedAddress: eC,
              adapterAddress: eD,
              signPrivyMessage: ec,
              adapterSignMessage: T,
              waitForPrivyWallet: () => eJ().wait(),
              encode: eK.f.encode,
            }),
          [eP, ec, eS?.address, T, eC, eD, eJ],
        ),
        e0 = (0, R.useCallback)(
          async (e) => {
            if (!e || !N) return null;
            try {
              let { message: r, timestamp: n } = ik(),
                i = await i2(t, e, r);
              if (!i) throw Error("Failed to create transaction");
              let s = await N(i),
                o = Array.from(s.serialize());
              if (!s.signature) throw Error("Transaction signature is missing");
              let a = eK.f.encode(s.signature);
              return await eq(e, a, n, {
                serializedTx: o,
                authType: "non_custodial",
              });
            } catch (e) {
              if (
                e instanceof iq.D &&
                (e.errorName === iq.$.PRIVY_ACCOUNT_EXISTS ||
                  e.errorName === iq.$.LOGIN_WALLET_SIGNUP_BLOCKED ||
                  e.errorName === iq.$.SESSION_COOKIE_REJECTED)
              )
                throw e;
              return (console.error("error signing for squads", e), null);
            }
          },
          [N, t, eq],
        ),
        e1 = (0, R.useCallback)(async () => {
          (a(!0), b((e) => e + 1));
          try {
            let e = C?.toBase58();
            if (e && !F && (await eV(), sg()?.address === e)) return;
            if (e && !F && r) {
              let t = await (0, iK.d)({
                clientServerUrl: S,
                userIdentifier: e,
              });
              if ("missing" === t)
                throw (
                  iH.y.warn(
                    "Sign-up refused — external-wallet sign-ups are closed",
                    { walletAddress: e },
                  ),
                  await L(),
                  new iq.D(
                    iq.$.LOGIN_WALLET_SIGNUP_BLOCKED,
                    "External-wallet sign-ups are closed",
                  )
                );
            }
            let t = (0, iV.Q)()
                ? await e0(C?.toBase58())
                : await eY(C?.toBase58(), T),
              n = (0, se.U)(t);
            ((u.current += 1), n ? eI(n) : await eV());
          } catch (e) {
            if (e instanceof iq.D) throw e;
            throw new iq.D(iq.$.LOGIN_FAILED, "Failed to login", e);
          } finally {
            (a(!1), b((e) => Math.max(0, e - 1)));
          }
        }, [C, F, eV, eY, e0, T, r, S, L]),
        e2 = (0, R.useRef)(!1),
        e3 = (0, R.useRef)(!1);
      ((0, R.useEffect)(() => {
        if (!$ || !J) return;
        if (!F || ee) {
          ((e2.current = !1), (e3.current = !1));
          return;
        }
        if (m || e2.current || e3.current || !H) return;
        if ((0, iY.z)(H)) {
          (iH.y.warn(
            "Privy wallet exists in linkedAccounts but connector has not surfaced it — skipping recovery createWallet",
            { privyUserId: H.id },
          ),
            (!i || i.has()) && O((e) => e ?? "awaiting_wallet"));
          return;
        }
        if (n?.(H.id) === !0 || (0, iY.J)(H)) return;
        if (i && !i.has())
          return void iH.y.warn(
            "Stuck Privy session left alone — no pump sign-in intent",
            { privyUserId: H.id },
          );
        O((e) => e ?? "awaiting_wallet");
        let e = !1,
          t = async (r) => {
            if (e || e2.current) return;
            ((e3.current = !0),
              iH.y.warn(
                "Recovering stuck Privy session (authenticated, no Solana wallet)",
                { attempt: r, maxAttempts: 3 },
              ));
            let n = () => {
              ((e2.current = !0), (e3.current = !1));
            };
            if (k.current) {
              e3.current = !1;
              return;
            }
            O("minting_wallet");
            let i = Date.now();
            k.current = !0;
            try {
              if (
                (await su(Q(), 2e4, () => new sl(2e4)),
                (k.current = !1),
                et.current && O("awaiting_wallet"),
                e)
              ) {
                e3.current = !1;
                return;
              }
              n();
              return;
            } catch (s) {
              if (sh(s)) {
                iH.y.info(
                  "Stuck Privy session recovery: wallet already exists — refreshing the user to surface it",
                  { attempt: r, elapsedMs: Date.now() - i },
                );
                try {
                  await er("recovery");
                } finally {
                  k.current = !1;
                }
                (et.current && O("awaiting_wallet"), n());
                return;
              }
              if (((k.current = !1), sp(s))) {
                (iH.y.warn(
                  "Stuck Privy session recovery: createWallet request was cancelled by the browser",
                  { attempt: r, elapsedMs: Date.now() - i },
                ),
                  et.current && O("awaiting_wallet"),
                  n());
                return;
              }
              if (s instanceof sl) {
                (iH.y.error(
                  "Stuck Privy session recovery: createWallet timed out",
                  { attempt: r, elapsedMs: Date.now() - i },
                ),
                  et.current && (O(null), x("privy_wallet_unreachable")),
                  n());
                return;
              }
              (iH.y.error("Stuck Privy session recovery: createWallet failed", {
                attempt: r,
                error: String(s),
              }),
                et.current && (O(null), x("privy_session_expired")));
              try {
                if ((await z(), e)) {
                  e3.current = !1;
                  return;
                }
                n();
                return;
              } catch (i) {
                if (
                  (iH.y.error(
                    "Stuck Privy session recovery: privyLogout failed",
                    { attempt: r, error: String(i) },
                  ),
                  r >= 3)
                ) {
                  (n(),
                    iH.y.error(
                      "Stuck Privy session recovery: giving up after max attempts",
                      { maxAttempts: 3 },
                    ));
                  return;
                }
                if (
                  (await new Promise((e) => {
                    window.setTimeout(e, 4e3 * 2 ** (r - 1));
                  }),
                  e)
                ) {
                  e3.current = !1;
                  return;
                }
                await t(r + 1);
              }
            }
          },
          r = window.setTimeout(() => {
            t(1);
          }, 4e3);
        return () => {
          ((e = !0), (e3.current = !1), window.clearTimeout(r));
        };
      }, [$, J, F, ee, H, Q, z, n, i, m, er]),
        (0, R.useEffect)(() => {
          (async () => {
            if (p || y || m)
              (p &&
                console.error("Privy Wallet got disconnected - not signing in"),
                (P.current = null));
            else {
              let e = (0, iY.F)(X, (ek ?? e_)?.address);
              if (
                e &&
                (!eO || eO.address !== e.address) &&
                P.current !== e.address
              ) {
                let t = ek ?? e_;
                if (n?.(H?.id) === !0 && e.address !== t?.address)
                  return void iH.y.warn(
                    "Privy session sync held — link flow active for another wallet",
                    { walletAddress: e.address, sessionAddress: t?.address },
                  );
                let r = (0, iY.R)({
                  user: H,
                  walletAddress: e.address,
                  sessionAddress: t?.address ?? null,
                });
                if ("none" === r.action) {
                  "wallet_not_owned" === r.reason &&
                    iH.y.warn(
                      "Privy session sync deferred — SDK user does not own surfaced wallet",
                      { walletAddress: e.address, privyUserId: H?.id },
                    );
                  return;
                }
                let s = "hydrate" === r.action;
                if (
                  "sign_in" === r.action &&
                  r.reboundFromAddress &&
                  i &&
                  !i.has()
                )
                  return void iH.y.warn(
                    "Privy login landed on a different account — rebinding withheld, no pump sign-in intent",
                    {
                      previousAddress: r.reboundFromAddress,
                      walletAddress: e.address,
                      privyUserId: H?.id,
                    },
                  );
                ("sign_in" === r.action &&
                  r.reboundFromAddress &&
                  iH.y.warn(
                    "Privy login landed on a different account — rebinding pump session",
                    {
                      previousAddress: r.reboundFromAddress,
                      walletAddress: e.address,
                      privyUserId: H?.id,
                    },
                  ),
                  (P.current = e.address),
                  b((e) => e + 1));
                try {
                  if (!s && H) {
                    let t = (0, iY.b)(H);
                    if (t.length > 0 && t.every((e) => "twitter" === e)) {
                      let t = await (0, iK.d)({
                        clientServerUrl: S,
                        userIdentifier: e.address,
                      });
                      if ("missing" === t) {
                        (iH.y.warn(
                          "Signup rejected — X sign-ups are disabled",
                          { walletAddress: e.address, privyUserId: H.id },
                        ),
                          (P.current = null),
                          w(!0),
                          await z());
                        return;
                      }
                    }
                  }
                  let t = s ? null : await eZ(e.address);
                  (s || i?.consume(), O("seeding_session"));
                  let r = (0, se.U)(t);
                  (r ? eI(r) : await eV(), (j.current = null), O(null));
                } catch (s) {
                  if (
                    s instanceof iq.D &&
                    s.errorName === iq.$.LOGIN_NOT_ALLOWED
                  )
                    throw ((P.current = null), s);
                  let t = j.current,
                    r = t?.address === e.address ? t.count + 1 : 1;
                  j.current = { address: e.address, count: r };
                  let n = (0, i5.n)(s),
                    i =
                      (0, i5._)(n) ||
                      "privy_session_expired" === n ||
                      "session_cookie_rejected" === n;
                  if (i || r >= 3) {
                    let t = {
                      reason: n,
                      attempt: r,
                      terminal: i,
                      walletAddress: e.address,
                      cause: s instanceof Error ? s.message : String(s),
                    };
                    ("mfa_cancelled" === n
                      ? iH.y.warn(
                          "Privy sign-in stopped — the two-factor prompt was dismissed",
                          t,
                        )
                      : iH.y.error(
                          "Privy sign-in stopped — surfacing to login UI",
                          t,
                        ),
                      O(null),
                      x(n),
                      i && (await z()));
                    return;
                  }
                  (await new Promise((e) => {
                    window.setTimeout(e, 1e3 * 2 ** (r - 1));
                  }),
                    iH.y.warn("Privy sign-in attempt failed — retrying", {
                      reason: n,
                      attempt: r,
                      maxAttempts: 3,
                      walletAddress: e.address,
                      cause: s instanceof Error ? s.message : String(s),
                    }),
                    (P.current = null),
                    I((e) => e + 1));
                } finally {
                  b((e) => Math.max(0, e - 1));
                }
              }
            }
          })();
        }, [X, p, y, m, A, H, S, z, eO, ek, e_, eZ, eV, n, i]));
      let e6 = (0, R.useRef)(void 0),
        e8 = (0, R.useRef)(!1);
      (0, R.useEffect)(() => {
        let e = e6.current;
        ((e6.current = eD),
          e8.current ||
            o ||
            ((0, se.O)({
              decodedJwt: ek ?? e_,
              privyAuthenticated: F,
              previousPublicKeyAddress: e,
              publicKeyAddress: eD,
            }) &&
              ((e8.current = !0),
              eH().finally(() => {
                e8.current = !1;
              }))));
      }, [ek, e_, F, eD, o, eH]);
      let e5 = (0, R.useRef)(!1);
      (0, R.useEffect)(() => {
        !e5.current &&
          eC &&
          (async () => {
            try {
              (await eV(), (e5.current = !0));
            } catch (e) {
              console.error("Error refreshing JWT:", e);
            }
          })();
      }, [eC]);
      let e4 = eT?.userId,
        e7 = (0, iW.f)(eT, eC),
        e9 = (0, R.useRef)(!1);
      return (
        (0, R.useEffect)(() => {
          eC &&
            (e7 && (e9.current = !0),
            (0, V.sendGTMEvent)({
              user_id: eC,
              ...(e9.current ? { pump_user_id: e7 ?? null } : {}),
            }),
            iH.y.setUserIdentity({ address: eC, userId: e7 }));
        }, [eC, e7]),
        (0, R.useEffect)(() => {
          eO && (0, iJ.i)(eO) && (eB(0), eI(null));
        }, [eO]),
        (0, c.jsx)(v.$.Provider, {
          value: {
            decodedJwt: eT,
            login: e1,
            privyLogin: em,
            privyLoginFailed: p,
            resetPrivyLoginFailure: ex,
            xSignupBlocked: y,
            resetXSignupBlocked: ev,
            privySignInError: m,
            resetPrivySignInError: eE,
            privySignInStage: E,
            privyMfaEnrolled: Z,
            loginLoading: o,
            XAccountConnected: B,
            setXAccountConnected: _,
            address: eC,
            user: eM,
            roles: eT?.roles ?? e_?.roles,
            permissions: eT?.permissions ?? e_?.permissions,
            userId: e4,
            fetchUser: eR,
            logout: e$,
            requiresLogin: eN,
            wallet: eF,
            shouldUsePrivy: eP,
            isPrivyEmbeddedSigner: ej,
            authReady: eL,
            revalidateSession: eG,
            signSolanaMessage: eQ,
          },
          children: e,
        })
      );
    };
  e.i(70833);
  var sx = e.i(66961),
    sv = e.i(56103),
    sE = e.i(779642);
  function sO(e) {
    let t,
      r = (0, d.c)(5),
      { children: n } = e,
      { connection: i } = (0, sx.f)(),
      s = (0, sv.f)(),
      { refreshUser: o } = (0, H.f)();
    return (
      r[0] !== n || r[1] !== i || r[2] !== o || r[3] !== s
        ? ((t = (0, c.jsx)(sm, {
            connection: i,
            blockExternalWalletSignups: s,
            isPrivyLinkFlowActive: sE.d,
            pumpSignInIntent: P.p,
            refreshPrivyUser: o,
            children: n,
          })),
          (r[0] = n),
          (r[1] = i),
          (r[2] = o),
          (r[3] = s),
          (r[4] = t))
        : (t = r[4]),
      t
    );
  }
  e.s(
    [
      "PrivyAuthTree",
      0,
      function (e) {
        let t,
          r,
          n = (0, d.c)(3),
          { children: i } = e;
        return (
          n[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((t = (0, c.jsx)(F, { children: (0, c.jsx)(A, {}) })), (n[0] = t))
            : (t = n[0]),
          n[1] !== i
            ? ((r = (0, c.jsx)(L, {
                children: (0, c.jsxs)(sO, {
                  children: [
                    t,
                    (0, c.jsx)(g, { children: (0, c.jsx)(m, { children: i }) }),
                  ],
                }),
              })),
              (n[1] = i),
              (n[2] = r))
            : (r = n[2]),
          r
        );
      },
    ],
    333935,
  );
};
