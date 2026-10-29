// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function f(e, { includeName: n = !1 } = {}) {
    if ("function" !== e.type && "event" !== e.type && "error" !== e.type)
      throw new S(e.type);
    return `${e.name}(${t(e.inputs, { includeName: n })})`;
  }
  function t(e, { includeName: f = !1 } = {}) {
    return e
      ? e
          .map((e) =>
            (function (e, { includeName: f }) {
              return e.type.startsWith("tuple")
                ? `(${t(e.components, { includeName: f })})${e.type.slice(5)}`
                : e.type + (f && e.name ? ` ${e.name}` : "");
            })(e, { includeName: f }),
          )
          .join(f ? ", " : ",")
      : "";
  }
  (e.s(
    [
      "j",
      () => a,
      "B",
      () => i,
      "D",
      () => s,
      "g",
      () => o,
      "S",
      () => c,
      "T",
      () => u,
      "U",
      () => d,
      "A",
      () => l,
      "k",
      () => p,
      "J",
      () => b,
      "V",
      () => h,
      "R",
      () => y,
      "u",
      () => m,
      "$",
      () => g,
      "Y",
      () => v,
      "N",
      () => x,
      "r",
      () => I,
      "M",
      () => $,
      "t",
      () => w,
      "s",
      () => A,
      "l",
      () => E,
      "v",
      () => B,
      "w",
      () => N,
      "d",
      () => S,
      "b",
      () => P,
    ],
    76373,
  ),
    e.s(["r", () => f, "Q", () => t], 515752));
  var n = e.i(612735),
    r = e.i(532617);
  class a extends r.f {
    constructor({ docsPath: e }) {
      super(
        "A constructor was not found on the ABI.\nMake sure you are using the correct ABI and that the constructor exists on it.",
        { docsPath: e, name: "AbiConstructorNotFoundError" },
      );
    }
  }
  class i extends r.f {
    constructor({ docsPath: e }) {
      super(
        "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.\nMake sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists.",
        { docsPath: e, name: "AbiConstructorParamsNotFoundError" },
      );
    }
  }
  r.f;
  class s extends r.f {
    constructor({ data: e, params: f, size: n }) {
      (super(`Data size of ${n} bytes is too small for given parameters.`, {
        metaMessages: [
          `Params: (${t(f, { includeName: !0 })})`,
          `Data:   ${e} (${n} bytes)`,
        ],
        name: "AbiDecodingDataSizeTooSmallError",
      }),
        Object.defineProperty(this, "data", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "params", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "size", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.data = e),
        (this.params = f),
        (this.size = n));
    }
  }
  class o extends r.f {
    constructor() {
      super('Cannot decode zero data ("0x") with ABI parameters.', {
        name: "AbiDecodingZeroDataError",
      });
    }
  }
  class c extends r.f {
    constructor({ expectedLength: e, givenLength: f, type: t }) {
      super(
        `ABI encoding array length mismatch for type ${t}.
Expected length: ${e}
Given length: ${f}`,
        { name: "AbiEncodingArrayLengthMismatchError" },
      );
    }
  }
  class u extends r.f {
    constructor({ expectedSize: e, value: f }) {
      super(
        `Size of bytes "${f}" (bytes${(0, n.f)(f)}) does not match expected size (bytes${e}).`,
        { name: "AbiEncodingBytesSizeMismatchError" },
      );
    }
  }
  class d extends r.f {
    constructor({ expectedLength: e, givenLength: f }) {
      super(
        `ABI encoding params/values length mismatch.
Expected length (params): ${e}
Given length (values): ${f}`,
        { name: "AbiEncodingLengthMismatchError" },
      );
    }
  }
  class l extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Arguments (\`args\`) were provided to "${e}", but "${e}" on the ABI does not contain any parameters (\`inputs\`).
Cannot encode error result without knowing what the parameter types are.
Make sure you are using the correct ABI and that the inputs exist on it.`,
        { docsPath: f, name: "AbiErrorInputsNotFoundError" },
      );
    }
  }
  class p extends r.f {
    constructor(e, { docsPath: f } = {}) {
      super(
        `Error ${e ? `"${e}" ` : ""}not found on ABI.
Make sure you are using the correct ABI and that the error exists on it.`,
        { docsPath: f, name: "AbiErrorNotFoundError" },
      );
    }
  }
  class b extends r.f {
    constructor(e, { docsPath: f }) {
      (super(
        `Encoded error signature "${e}" not found on ABI.
Make sure you are using the correct ABI and that the error exists on it.
You can look up the decoded signature here: https://openchain.xyz/signatures?query=${e}.`,
        { docsPath: f, name: "AbiErrorSignatureNotFoundError" },
      ),
        Object.defineProperty(this, "signature", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.signature = e));
    }
  }
  class y extends r.f {
    constructor({ docsPath: e }) {
      super("Cannot extract event signature from empty topics.", {
        docsPath: e,
        name: "AbiEventSignatureEmptyTopicsError",
      });
    }
  }
  class m extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Encoded event signature "${e}" not found on ABI.
Make sure you are using the correct ABI and that the event exists on it.
You can look up the signature here: https://openchain.xyz/signatures?query=${e}.`,
        { docsPath: f, name: "AbiEventSignatureNotFoundError" },
      );
    }
  }
  class h extends r.f {
    constructor(e, { docsPath: f } = {}) {
      super(
        `Event ${e ? `"${e}" ` : ""}not found on ABI.
Make sure you are using the correct ABI and that the event exists on it.`,
        { docsPath: f, name: "AbiEventNotFoundError" },
      );
    }
  }
  class g extends r.f {
    constructor(e, { docsPath: f } = {}) {
      super(
        `Function ${e ? `"${e}" ` : ""}not found on ABI.
Make sure you are using the correct ABI and that the function exists on it.`,
        { docsPath: f, name: "AbiFunctionNotFoundError" },
      );
    }
  }
  class v extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Function "${e}" does not contain any \`outputs\` on ABI.
Cannot decode function result without knowing what the parameter types are.
Make sure you are using the correct ABI and that the function exists on it.`,
        { docsPath: f, name: "AbiFunctionOutputsNotFoundError" },
      );
    }
  }
  class x extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Encoded function signature "${e}" not found on ABI.
Make sure you are using the correct ABI and that the function exists on it.
You can look up the signature here: https://openchain.xyz/signatures?query=${e}.`,
        { docsPath: f, name: "AbiFunctionSignatureNotFoundError" },
      );
    }
  }
  class I extends r.f {
    constructor(e, t) {
      super("Found ambiguous types in overloaded ABI items.", {
        metaMessages: [
          `\`${e.type}\` in \`${f(e.abiItem)}\`, and`,
          `\`${t.type}\` in \`${f(t.abiItem)}\``,
          "",
          "These types encode differently and cannot be distinguished at runtime.",
          "Remove one of the ambiguous items in the ABI.",
        ],
        name: "AbiItemAmbiguityError",
      });
    }
  }
  class $ extends r.f {
    constructor({ expectedSize: e, givenSize: f }) {
      super(`Expected bytes${e}, got bytes${f}.`, {
        name: "BytesSizeMismatchError",
      });
    }
  }
  class w extends r.f {
    constructor({ abiItem: e, data: f, params: n, size: r }) {
      (super(
        `Data size of ${r} bytes is too small for non-indexed event parameters.`,
        {
          metaMessages: [
            `Params: (${t(n, { includeName: !0 })})`,
            `Data:   ${f} (${r} bytes)`,
          ],
          name: "DecodeLogDataMismatch",
        },
      ),
        Object.defineProperty(this, "abiItem", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "data", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "params", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "size", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.abiItem = e),
        (this.data = f),
        (this.params = n),
        (this.size = r));
    }
  }
  class A extends r.f {
    constructor({ abiItem: e, param: t }) {
      (super(
        `Expected a topic for indexed event parameter${t.name ? ` "${t.name}"` : ""} on event "${f(e, { includeName: !0 })}".`,
        { name: "DecodeLogTopicsMismatch" },
      ),
        Object.defineProperty(this, "abiItem", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.abiItem = e));
    }
  }
  class B extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Type "${e}" is not a valid encoding type.
Please provide a valid ABI type.`,
        { docsPath: f, name: "InvalidAbiEncodingType" },
      );
    }
  }
  class E extends r.f {
    constructor(e, { docsPath: f }) {
      super(
        `Type "${e}" is not a valid decoding type.
Please provide a valid ABI type.`,
        { docsPath: f, name: "InvalidAbiDecodingType" },
      );
    }
  }
  class N extends r.f {
    constructor(e) {
      super(`Value "${e}" is not a valid array.`, {
        name: "InvalidArrayError",
      });
    }
  }
  class S extends r.f {
    constructor(e) {
      super(
        `"${e}" is not a valid definition type.
Valid types: "function", "event", "error"`,
        { name: "InvalidDefinitionTypeError" },
      );
    }
  }
  class P extends r.f {
    constructor(e) {
      super(`Type "${e}" is not supported for packed encoding.`, {
        name: "UnsupportedPackedAbiType",
      });
    }
  }
  var z = e.i(296006),
    M = e.i(108270),
    k = e.i(4911),
    D = e.i(990149),
    T = e.i(417672),
    F = e.i(989494),
    O = e.i(19648);
  let j =
    /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  e.s(
    [
      "c",
      0,
      /^(.*)\[([0-9]*)\]$/,
      "h",
      0,
      /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,
      "x",
      0,
      j,
    ],
    308286,
  );
  function C(e) {
    let f = 0;
    for (let t = 0; t < e.length; t++) {
      let { dynamic: r, encoded: a } = e[t];
      r ? (f += 32) : (f += (0, n.f)(a));
    }
    let t = [],
      r = [],
      a = 0;
    for (let i = 0; i < e.length; i++) {
      let { dynamic: s, encoded: o } = e[i];
      s
        ? (t.push((0, O.N)(f + a, { size: 32 })), r.push(o), (a += (0, n.f)(o)))
        : t.push(o);
    }
    return (0, D.w)([...t, ...r]);
  }
  function L(e) {
    let f = e.match(/^(.*)\[(\d+)?\]$/);
    return f ? [f[2] ? Number(f[2]) : null, f[1]] : void 0;
  }
  e.s(
    [
      "N",
      0,
      function (e, f) {
        if (e.length !== f.length)
          throw new d({ expectedLength: e.length, givenLength: f.length });
        let t = C(
          (function ({ params: e, values: f }) {
            let t = [];
            for (let a = 0; a < e.length; a++)
              t.push(
                (function e({ param: f, value: t }) {
                  let a = L(f.type);
                  if (a) {
                    let [n, r] = a;
                    return (function (f, { length: t, param: n }) {
                      let r = null === t;
                      if (!Array.isArray(f)) throw new N(f);
                      if (!r && f.length !== t)
                        throw new c({
                          expectedLength: t,
                          givenLength: f.length,
                          type: `${n.type}[${t}]`,
                        });
                      let a = !1,
                        i = [];
                      for (let t = 0; t < f.length; t++) {
                        let r = e({ param: n, value: f[t] });
                        (r.dynamic && (a = !0), i.push(r));
                      }
                      if (r || a) {
                        let e = C(i);
                        if (r) {
                          let f = (0, O.N)(i.length, { size: 32 });
                          return {
                            dynamic: !0,
                            encoded: i.length > 0 ? (0, D.w)([f, e]) : f,
                          };
                        }
                        if (a) return { dynamic: !0, encoded: e };
                      }
                      return {
                        dynamic: !1,
                        encoded: (0, D.w)(i.map(({ encoded: e }) => e)),
                      };
                    })(t, { length: n, param: { ...f, type: r } });
                  }
                  if ("tuple" === f.type)
                    return (function (f, { param: t }) {
                      let n = !1,
                        r = [];
                      for (let a = 0; a < t.components.length; a++) {
                        let i = t.components[a],
                          s = Array.isArray(f) ? a : i.name,
                          o = e({ param: i, value: f[s] });
                        (r.push(o), o.dynamic && (n = !0));
                      }
                      return {
                        dynamic: n,
                        encoded: n
                          ? C(r)
                          : (0, D.w)(r.map(({ encoded: e }) => e)),
                      };
                    })(t, { param: f });
                  if ("address" === f.type) {
                    var i = t;
                    if (!(0, k.f)(i)) throw new z.f({ address: i });
                    return { dynamic: !1, encoded: (0, T.n)(i.toLowerCase()) };
                  }
                  if ("bool" === f.type) {
                    var s = t;
                    if ("boolean" != typeof s)
                      throw new r.f(
                        `Invalid boolean value: "${s}" (type: ${typeof s}). Expected: \`true\` or \`false\`.`,
                      );
                    return { dynamic: !1, encoded: (0, T.n)((0, O.V)(s)) };
                  }
                  if (f.type.startsWith("uint") || f.type.startsWith("int")) {
                    let e = f.type.startsWith("int"),
                      [, , n = "256"] = j.exec(f.type) ?? [];
                    return (function (e, { signed: f, size: t = 256 }) {
                      if ("number" == typeof t) {
                        let n = 2n ** (BigInt(t) - (f ? 1n : 0n)) - 1n,
                          r = f ? -n - 1n : 0n;
                        if (e > n || e < r)
                          throw new M.d({
                            max: n.toString(),
                            min: r.toString(),
                            signed: f,
                            size: t / 8,
                            value: e.toString(),
                          });
                      }
                      return {
                        dynamic: !1,
                        encoded: (0, O.N)(e, { size: 32, signed: f }),
                      };
                    })(t, { signed: e, size: Number(n) });
                  }
                  if (f.type.startsWith("bytes"))
                    return (function (e, { param: f }) {
                      let [, t] = f.type.split("bytes"),
                        r = (0, n.f)(e);
                      if (!t) {
                        let f = e;
                        return (
                          r % 32 != 0 &&
                            (f = (0, T.n)(f, {
                              dir: "right",
                              size: 32 * Math.ceil((e.length - 2) / 2 / 32),
                            })),
                          {
                            dynamic: !0,
                            encoded: (0, D.w)([
                              (0, T.n)((0, O.N)(r, { size: 32 })),
                              f,
                            ]),
                          }
                        );
                      }
                      if (r !== Number.parseInt(t, 10))
                        throw new u({
                          expectedSize: Number.parseInt(t, 10),
                          value: e,
                        });
                      return {
                        dynamic: !1,
                        encoded: (0, T.n)(e, { dir: "right" }),
                      };
                    })(t, { param: f });
                  if ("string" === f.type) {
                    var o = t;
                    let e = (0, O.B)(o),
                      f = Math.ceil((0, n.f)(e) / 32),
                      r = [];
                    for (let t = 0; t < f; t++)
                      r.push(
                        (0, T.n)((0, F.M)(e, 32 * t, (t + 1) * 32), {
                          dir: "right",
                        }),
                      );
                    return {
                      dynamic: !0,
                      encoded: (0, D.w)([
                        (0, T.n)((0, O.N)((0, n.f)(e), { size: 32 })),
                        ...r,
                      ]),
                    };
                  }
                  throw new B(f.type, {
                    docsPath: "/docs/contract/encodeAbiParameters",
                  });
                })({ param: e[a], value: f[a] }),
              );
            return t;
          })({ params: e, values: f }),
        );
        return 0 === t.length ? "0x" : t;
      },
      "t",
      0,
      L,
    ],
    971860,
  );
};
