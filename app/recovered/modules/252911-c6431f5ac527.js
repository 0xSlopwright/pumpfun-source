// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370);
  let n = t.ComputeBudgetProgram.programId.toBase58(),
    r = {
      [n]: "ComputeBudget",
      "11111111111111111111111111111111": "System",
      TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "Token",
      ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: "AssociatedToken",
    },
    a = (e) => r[e] ?? `${e.slice(0, 4)}..${e.slice(-4)}`,
    s = (e) => {
      if (0 === e.length) return "empty";
      let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
      return 2 === e[0] && e.length >= 5
        ? `limit=${t.getUint32(1, !0)}`
        : 3 === e[0] && e.length >= 9
          ? `price=${t.getBigUint64(1, !0)}`
          : `op=${e[0]}`;
    },
    i = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]),
    o = {
      kinds: ["undecodable"],
      summary: "returned message could not be decoded",
    },
    l = (e, r) => {
      let l, c;
      try {
        ((l = t.VersionedMessage.deserialize(e)),
          (c = t.VersionedMessage.deserialize(r)));
      } catch {
        return o;
      }
      let u = [],
        d = [],
        f = (e, t) => {
          (u.includes(e) || u.push(e), d.push(t));
        };
      (String(l.version) !== String(c.version) &&
        f("version", `version ${l.version} -> ${c.version}`),
        l.recentBlockhash !== c.recentBlockhash &&
          f("blockhash", "blockhash replaced"));
      let m = (e) =>
        [
          e.header.numRequiredSignatures,
          e.header.numReadonlySignedAccounts,
          e.header.numReadonlyUnsignedAccounts,
        ].join("/");
      m(l) !== m(c) && f("header", `header ${m(l)} -> ${m(c)}`);
      let p = l.staticAccountKeys.map((e) => e.toBase58()),
        g = c.staticAccountKeys.map((e) => e.toBase58());
      p.length !== g.length
        ? f("account-keys", `static keys ${p.length} -> ${g.length}`)
        : p.some((e, t) => e !== g[t]) &&
          f(
            "account-keys",
            [...p].sort().join(",") === [...g].sort().join(",")
              ? "static keys reordered"
              : "static keys changed",
          );
      let h = (e) =>
          e.addressTableLookups.map(
            (e) =>
              `${e.accountKey.toBase58()}:${e.writableIndexes.join(".")}|${e.readonlyIndexes.join(".")}`,
          ),
        b = h(l),
        y = h(c);
      (b.length !== y.length || b.some((e, t) => e !== y[t])) &&
        f("address-table-lookups", `lookup tables ${b.length} -> ${y.length}`);
      let w = (e, t) => {
          let n = e.staticAccountKeys[t];
          return n ? n.toBase58() : `alt#${t}`;
        },
        _ = l.compiledInstructions,
        v = c.compiledInstructions;
      if (_.length !== v.length) {
        let e = _.map((e) => w(l, e.programIdIndex)),
          t = v.map((e) => w(c, e.programIdIndex)),
          n = [...new Set(t.filter((t) => !e.includes(t)))],
          r = [...new Set(e.filter((e) => !t.includes(e)))];
        f(
          "instruction-count",
          `instructions ${_.length} -> ${v.length}` +
            (n.length ? ` (added ${n.map(a).join(",")})` : "") +
            (r.length ? ` (removed ${r.map(a).join(",")})` : ""),
        );
      } else
        _.forEach((e, t) => {
          let r,
            o,
            u = v[t],
            d = w(l, e.programIdIndex),
            m = w(c, u.programIdIndex);
          d !== m
            ? f("instruction-program", `ix[${t}] ${a(d)} -> ${a(m)}`)
            : ((r = e.accountKeyIndexes),
              (o = u.accountKeyIndexes),
              (r.length === o.length && r.every((e, t) => e === o[t])) ||
                f(
                  "instruction-accounts",
                  `ix[${t}] ${a(d)} account indexes changed`,
                ),
              i(e.data, u.data) ||
                (d === n
                  ? f(
                      "compute-budget",
                      `ix[${t}] ComputeBudget ${s(e.data)} -> ${s(u.data)}`,
                    )
                  : f("instruction-data", `ix[${t}] ${a(d)} data changed`)));
        });
      return (
        0 === u.length &&
          f(
            "unclassified",
            "message bytes differ with no field-level difference",
          ),
        { kinds: u, summary: d.join("; ").slice(0, 300) }
      );
    };
  class c extends Error {
    kinds;
    constructor(e, t) {
      (super(e), (this.name = "SponsoredSigningError"), (this.kinds = t));
    }
  }
  class u extends c {
    report;
    constructor(e) {
      (super(
        `wallet rebuilt the transaction message; sponsor signature invalidated (${e.summary})`,
        e.kinds,
      ),
        (this.name = "WalletRebuiltMessageError"),
        (this.report = e));
    }
  }
  class d extends c {
    constructor() {
      (super("wallet dropped the sponsor signature while signing", [
        "sponsor-signature-dropped",
      ]),
        (this.name = "SponsorSignatureDroppedError"));
    }
  }
  let f = (e) => e.some((e) => 0 !== e),
    m = (e, t) => {
      let n = Uint8Array.from(t.message.serialize());
      if (!i(e.messageBytes, n)) throw new u(l(e.messageBytes, n));
      if (!e.setSignatureSlots.every((e, n) => !e || f(t.signatures[n])))
        throw new d();
    };
  class p extends Error {
    constructor(e) {
      (super(e), (this.name = "PartialSignError"));
    }
  }
  let g = /fee ?payer/i;
  e.s([
    "m",
    0,
    "Your wallet does not support this trade route (it would not sign a transaction whose fee payer is not the connected wallet). Try a different wallet or a smaller amount.",
    "E",
    0,
    p,
    "e",
    0,
    c,
    "s",
    0,
    u,
    "D",
    0,
    (e) => {
      let [t, n] = e.signatures;
      if (!t || !n || f(t) || !f(n))
        throw new p(
          "wallet did not return the partially signed transaction intact",
        );
    },
    "a",
    0,
    m,
    "U",
    0,
    (e) => ({
      messageBytes: Uint8Array.from(e.message.serialize()),
      setSignatureSlots: e.signatures.map(f),
    }),
    "f",
    0,
    (e) => e instanceof Error && g.test(e.message),
    "K",
    0,
    f,
    "_",
    0,
    (e, t) => {
      if (e.setSignatureSlots.some(Boolean))
        return (m(e, t), { kind: "intact" });
      let n = Uint8Array.from(t.message.serialize());
      return i(e.messageBytes, n)
        ? { kind: "intact" }
        : { kind: "rebuilt-unsigned", report: l(e.messageBytes, n) };
    },
  ]);
};
