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
    i = (e) => {
      if (0 === e.length) return "empty";
      let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
      return 2 === e[0] && e.length >= 5
        ? `limit=${t.getUint32(1, !0)}`
        : 3 === e[0] && e.length >= 9
          ? `price=${t.getBigUint64(1, !0)}`
          : `op=${e[0]}`;
    },
    o = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]),
    s = {
      kinds: ["undecodable"],
      summary: "returned message could not be decoded",
    },
    l = (e, r) => {
      let l, c;
      try {
        ((l = t.VersionedMessage.deserialize(e)),
          (c = t.VersionedMessage.deserialize(r)));
      } catch {
        return s;
      }
      let u = [],
        f = [],
        d = (e, t) => {
          (u.includes(e) || u.push(e), f.push(t));
        };
      (String(l.version) !== String(c.version) &&
        d("version", `version ${l.version} -> ${c.version}`),
        l.recentBlockhash !== c.recentBlockhash &&
          d("blockhash", "blockhash replaced"));
      let h = (e) =>
        [
          e.header.numRequiredSignatures,
          e.header.numReadonlySignedAccounts,
          e.header.numReadonlyUnsignedAccounts,
        ].join("/");
      h(l) !== h(c) && d("header", `header ${h(l)} -> ${h(c)}`);
      let g = l.staticAccountKeys.map((e) => e.toBase58()),
        m = c.staticAccountKeys.map((e) => e.toBase58());
      g.length !== m.length
        ? d("account-keys", `static keys ${g.length} -> ${m.length}`)
        : g.some((e, t) => e !== m[t]) &&
          d(
            "account-keys",
            [...g].sort().join(",") === [...m].sort().join(",")
              ? "static keys reordered"
              : "static keys changed",
          );
      let p = (e) =>
          e.addressTableLookups.map(
            (e) =>
              `${e.accountKey.toBase58()}:${e.writableIndexes.join(".")}|${e.readonlyIndexes.join(".")}`,
          ),
        v = p(l),
        y = p(c);
      (v.length !== y.length || v.some((e, t) => e !== y[t])) &&
        d("address-table-lookups", `lookup tables ${v.length} -> ${y.length}`);
      let b = (e, t) => {
          let n = e.staticAccountKeys[t];
          return n ? n.toBase58() : `alt#${t}`;
        },
        w = l.compiledInstructions,
        _ = c.compiledInstructions;
      if (w.length !== _.length) {
        let e = w.map((e) => b(l, e.programIdIndex)),
          t = _.map((e) => b(c, e.programIdIndex)),
          n = [...new Set(t.filter((t) => !e.includes(t)))],
          r = [...new Set(e.filter((e) => !t.includes(e)))];
        d(
          "instruction-count",
          `instructions ${w.length} -> ${_.length}` +
            (n.length ? ` (added ${n.map(a).join(",")})` : "") +
            (r.length ? ` (removed ${r.map(a).join(",")})` : ""),
        );
      } else
        w.forEach((e, t) => {
          let r,
            s,
            u = _[t],
            f = b(l, e.programIdIndex),
            h = b(c, u.programIdIndex);
          f !== h
            ? d("instruction-program", `ix[${t}] ${a(f)} -> ${a(h)}`)
            : ((r = e.accountKeyIndexes),
              (s = u.accountKeyIndexes),
              (r.length === s.length && r.every((e, t) => e === s[t])) ||
                d(
                  "instruction-accounts",
                  `ix[${t}] ${a(f)} account indexes changed`,
                ),
              o(e.data, u.data) ||
                (f === n
                  ? d(
                      "compute-budget",
                      `ix[${t}] ComputeBudget ${i(e.data)} -> ${i(u.data)}`,
                    )
                  : d("instruction-data", `ix[${t}] ${a(f)} data changed`)));
        });
      return (
        0 === u.length &&
          d(
            "unclassified",
            "message bytes differ with no field-level difference",
          ),
        { kinds: u, summary: f.join("; ").slice(0, 300) }
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
  class f extends c {
    constructor() {
      (super("wallet dropped the sponsor signature while signing", [
        "sponsor-signature-dropped",
      ]),
        (this.name = "SponsorSignatureDroppedError"));
    }
  }
  let d = (e) => e.some((e) => 0 !== e),
    h = (e, t) => {
      let n = Uint8Array.from(t.message.serialize());
      if (!o(e.messageBytes, n)) throw new u(l(e.messageBytes, n));
      if (!e.setSignatureSlots.every((e, n) => !e || d(t.signatures[n])))
        throw new f();
    };
  class g extends Error {
    constructor(e) {
      (super(e), (this.name = "PartialSignError"));
    }
  }
  let m = /fee ?payer/i;
  e.s([
    "m",
    0,
    "Your wallet does not support this trade route (it would not sign a transaction whose fee payer is not the connected wallet). Try a different wallet or a smaller amount.",
    "E",
    0,
    g,
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
      if (!t || !n || d(t) || !d(n))
        throw new g(
          "wallet did not return the partially signed transaction intact",
        );
    },
    "a",
    0,
    h,
    "U",
    0,
    (e) => ({
      messageBytes: Uint8Array.from(e.message.serialize()),
      setSignatureSlots: e.signatures.map(d),
    }),
    "f",
    0,
    (e) => e instanceof Error && m.test(e.message),
    "K",
    0,
    d,
    "_",
    0,
    (e, t) => {
      if (e.setSignatureSlots.some(Boolean))
        return (h(e, t), { kind: "intact" });
      let n = Uint8Array.from(t.message.serialize());
      return o(e.messageBytes, n)
        ? { kind: "intact" }
        : { kind: "rebuilt-unsigned", report: l(e.messageBytes, n) };
    },
  ]);
};
