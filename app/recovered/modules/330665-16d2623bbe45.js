// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370),
    i = e.i(584229),
    r = e.i(306780),
    n = e.i(358052);
  class o extends Error {
    walletName;
    code;
    constructor(e, t) {
      let r = void 0 === t ? "" : `: ${(0, i.A)(t)}`;
      (super(`${e} could not sign a v1 transaction${r}`, { cause: t }),
        (this.name = "V1SigningRefusedError"),
        (this.walletName = e),
        (this.code = (0, i.N)(t)));
    }
  }
  let a = (e) => e instanceof t.VersionedTransaction && 1 === e.version;
  e.s([
    "Z",
    0,
    o,
    "G",
    0,
    (e, s) => {
      let u = async (u) => {
        let l,
          c = (0, r.A)(s);
        if (!c) throw Error("wallet cannot sign v1 transactions");
        let d = s?.name ?? "unknown";
        if (u.some(a) && (0, r.M)(d)) throw new o(d, void 0);
        let m = e.publicKey.toBase58(),
          f = c.accounts.find((e) => e.address === m);
        if (!f) throw Error(`wallet has no account for ${m}`);
        let p = u.map((e) => ({ account: f, transaction: (0, n.f)(e) }));
        try {
          l = await c.signTransaction(...p);
        } catch (e) {
          if (
            (0, i.S)(e) ||
            /simulat|insufficient|blockhash|expired/i.test((0, i.A)(e)) ||
            !u.every(a)
          )
            throw e;
          throw ((0, r.s)(d), new o(d, e));
        }
        return l.map((e) =>
          t.VersionedTransaction.deserialize(e.signedTransaction),
        );
      };
      return {
        ...e,
        signTransaction: async (t) =>
          a(t) ? (await u([t]))[0] : e.signTransaction(t),
        signAllTransactions: async (i) => {
          if (!i.some(a)) return e.signAllTransactions(i);
          let r = (e) => e instanceof t.VersionedTransaction,
            n = await u(i.filter(r)),
            o = i.some((e) => !r(e))
              ? await e.signAllTransactions(i.filter((e) => !r(e)))
              : [],
            s = 0,
            l = 0;
          return i.map((e) => (r(e) ? n[s++] : o[l++]));
        },
      };
    },
  ]);
};
