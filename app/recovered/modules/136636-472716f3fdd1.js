// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(971860),
    t = e.i(990149),
    n = e.i(19648),
    r = e.i(497763),
    a = e.i(76373),
    i = e.i(296006),
    s = e.i(393547),
    o = e.i(532617);
  class c extends o.f {
    constructor({ domain: e }) {
      super(`Invalid domain "${(0, s.f)(e)}".`, {
        metaMessages: ["Must be a valid EIP-712 domain."],
      });
    }
  }
  class u extends o.f {
    constructor({ primaryType: e, types: f }) {
      super(
        `Invalid primary type \`${e}\` must be one of \`${JSON.stringify(Object.keys(f))}\`.`,
        {
          docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
          metaMessages: ["Check that the primary type is a key in `types`."],
        },
      );
    }
  }
  class d extends o.f {
    constructor({ type: e }) {
      super(`Struct type "${e}" is invalid.`, {
        metaMessages: ["Struct type must not be a Solidity type."],
        name: "InvalidStructTypeError",
      });
    }
  }
  var l = e.i(4911),
    p = e.i(612735),
    b = e.i(308286);
  function y({ data: e, primaryType: t, types: a }) {
    let i = (function e({ data: t, primaryType: a, types: i }) {
      let s = [{ type: "bytes32" }],
        o = [
          (function ({ primaryType: e, types: f }) {
            let t = (0, n.g)(
              (function ({ primaryType: e, types: f }) {
                let t = "",
                  n = (function e({ primaryType: f, types: t }, n = new Set()) {
                    let r = f.match(/^\w*/u),
                      a = r?.[0];
                    if (n.has(a) || void 0 === t[a]) return n;
                    for (let f of (n.add(a), t[a]))
                      e({ primaryType: f.type, types: t }, n);
                    return n;
                  })({ primaryType: e, types: f });
                for (let r of (n.delete(e), [e, ...Array.from(n).sort()]))
                  t += `${r}(${f[r].map(({ name: e, type: f }) => `${f} ${e}`).join(",")})`;
                return t;
              })({ primaryType: e, types: f }),
            );
            return (0, r.f)(t);
          })({ primaryType: a, types: i }),
        ];
      for (let c of i[a]) {
        let [a, u] = (function t({ types: a, name: i, type: s, value: o }) {
          if (void 0 !== a[s])
            return [
              { type: "bytes32" },
              (0, r.f)(e({ data: o, primaryType: s, types: a })),
            ];
          if ("bytes" === s) return [{ type: "bytes32" }, (0, r.f)(o)];
          if ("string" === s)
            return [{ type: "bytes32" }, (0, r.f)((0, n.g)(o))];
          if (s.lastIndexOf("]") === s.length - 1) {
            let e = s.slice(0, s.lastIndexOf("[")),
              n = o.map((f) => t({ name: i, type: e, types: a, value: f }));
            return [
              { type: "bytes32" },
              (0, r.f)(
                (0, f.N)(
                  n.map(([e]) => e),
                  n.map(([, e]) => e),
                ),
              ),
            ];
          }
          return [{ type: s }, o];
        })({ types: i, name: c.name, type: c.type, value: t[c.name] });
        (s.push(a), o.push(u));
      }
      return (0, f.N)(s, o);
    })({ data: e, primaryType: t, types: a });
    return (0, r.f)(i);
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let { domain: f = {}, message: s, primaryType: o } = e,
          m = {
            EIP712Domain: (function ({ domain: e }) {
              return [
                "string" == typeof e?.name && { name: "name", type: "string" },
                e?.version && { name: "version", type: "string" },
                ("number" == typeof e?.chainId ||
                  "bigint" == typeof e?.chainId) && {
                  name: "chainId",
                  type: "uint256",
                },
                e?.verifyingContract && {
                  name: "verifyingContract",
                  type: "address",
                },
                e?.salt && { name: "salt", type: "bytes32" },
              ].filter(Boolean);
            })({ domain: f }),
            ...e.types,
          };
        !(function (e) {
          let { domain: f, message: t, primaryType: r, types: s } = e,
            o = (e, f) => {
              for (let t of e) {
                let { name: e, type: r } = t,
                  c = f[e],
                  u = r.match(b.x);
                if (u && ("number" == typeof c || "bigint" == typeof c)) {
                  let [e, f, t] = u;
                  (0, n.N)(c, {
                    signed: "int" === f,
                    size: Number.parseInt(t, 10) / 8,
                  });
                }
                if ("address" === r && "string" == typeof c && !(0, l.f)(c))
                  throw new i.f({ address: c });
                let y = r.match(b.h);
                if (y) {
                  let [e, f] = y;
                  if (f && (0, p.f)(c) !== Number.parseInt(f, 10))
                    throw new a.M({
                      expectedSize: Number.parseInt(f, 10),
                      givenSize: (0, p.f)(c),
                    });
                }
                let m = s[r];
                m &&
                  ((function (e) {
                    if (
                      "address" === e ||
                      "bool" === e ||
                      "string" === e ||
                      e.startsWith("bytes") ||
                      e.startsWith("uint") ||
                      e.startsWith("int")
                    )
                      throw new d({ type: e });
                  })(r),
                  o(m, c));
              }
            };
          if (s.EIP712Domain && f) {
            if ("object" != typeof f) throw new c({ domain: f });
            o(s.EIP712Domain, f);
          }
          if ("EIP712Domain" !== r)
            if (s[r]) o(s[r], t);
            else throw new u({ primaryType: r, types: s });
        })({ domain: f, message: s, primaryType: o, types: m });
        let h = ["0x1901"];
        return (
          f &&
            h.push(
              (function ({ domain: e, types: f }) {
                return y({ data: e, primaryType: "EIP712Domain", types: f });
              })({ domain: f, types: m }),
            ),
          "EIP712Domain" !== o &&
            h.push(y({ data: s, primaryType: o, types: m })),
          (0, r.f)((0, t.w)(h))
        );
      },
    ],
    136636,
  );
};
