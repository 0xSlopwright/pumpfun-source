// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370),
    n = e.i(584229),
    r = e.i(306780),
    a = e.i(358052);
  class s extends Error {
    walletName;
    code;
    constructor(e, t) {
      let r = void 0 === t ? "" : `: ${(0, n.A)(t)}`;
      (super(`${e} could not sign a v1 transaction${r}`, { cause: t }),
        (this.name = "V1SigningRefusedError"),
        (this.walletName = e),
        (this.code = (0, n.N)(t)));
    }
  }
  let i = (e) => e instanceof t.VersionedTransaction && 1 === e.version;
  e.s([
    "Z",
    0,
    s,
    "G",
    0,
    (e, o) => {
      let l = async (l) => {
        let c,
          u = (0, r.A)(o);
        if (!u) throw Error("wallet cannot sign v1 transactions");
        let d = o?.name ?? "unknown";
        if (l.some(i) && (0, r.M)(d)) throw new s(d, void 0);
        let f = e.publicKey.toBase58(),
          m = u.accounts.find((e) => e.address === f);
        if (!m) throw Error(`wallet has no account for ${f}`);
        let g = l.map((e) => ({ account: m, transaction: (0, a.f)(e) }));
        try {
          c = await u.signTransaction(...g);
        } catch (e) {
          if (
            (0, n.S)(e) ||
            /simulat|insufficient|blockhash|expired/i.test((0, n.A)(e)) ||
            !l.every(i)
          )
            throw e;
          throw ((0, r.s)(d), new s(d, e));
        }
        return c.map((e) =>
          t.VersionedTransaction.deserialize(e.signedTransaction),
        );
      };
      return {
        ...e,
        signTransaction: async (t) =>
          i(t) ? (await l([t]))[0] : e.signTransaction(t),
        signAllTransactions: async (n) => {
          if (!n.some(i)) return e.signAllTransactions(n);
          let r = (e) => e instanceof t.VersionedTransaction,
            a = await l(n.filter(r)),
            s = n.some((e) => !r(e))
              ? await e.signAllTransactions(n.filter((e) => !r(e)))
              : [],
            o = 0,
            c = 0;
          return n.map((e) => (r(e) ? a[o++] : s[c++]));
        },
      };
    },
  ]);
};
