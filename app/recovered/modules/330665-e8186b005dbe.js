// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370),
    n = e.i(584229),
    r = e.i(306780),
    a = e.i(358052);
  class i extends Error {
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
  let o = (e) => e instanceof t.VersionedTransaction && 1 === e.version;
  e.s([
    "Z",
    0,
    i,
    "G",
    0,
    (e, s) => {
      let l = async (l) => {
        let c,
          u = (0, r.A)(s);
        if (!u) throw Error("wallet cannot sign v1 transactions");
        let f = s?.name ?? "unknown";
        if (l.some(o) && (0, r.M)(f)) throw new i(f, void 0);
        let d = e.publicKey.toBase58(),
          h = u.accounts.find((e) => e.address === d);
        if (!h) throw Error(`wallet has no account for ${d}`);
        let g = l.map((e) => ({ account: h, transaction: (0, a.f)(e) }));
        try {
          c = await u.signTransaction(...g);
        } catch (e) {
          if (
            (0, n.S)(e) ||
            /simulat|insufficient|blockhash|expired/i.test((0, n.A)(e)) ||
            !l.every(o)
          )
            throw e;
          throw ((0, r.s)(f), new i(f, e));
        }
        return c.map((e) =>
          t.VersionedTransaction.deserialize(e.signedTransaction),
        );
      };
      return {
        ...e,
        signTransaction: async (t) =>
          o(t) ? (await l([t]))[0] : e.signTransaction(t),
        signAllTransactions: async (n) => {
          if (!n.some(o)) return e.signAllTransactions(n);
          let r = (e) => e instanceof t.VersionedTransaction,
            a = await l(n.filter(r)),
            i = n.some((e) => !r(e))
              ? await e.signAllTransactions(n.filter((e) => !r(e)))
              : [],
            s = 0,
            c = 0;
          return n.map((e) => (r(e) ? a[s++] : i[c++]));
        },
      };
    },
  ]);
};
