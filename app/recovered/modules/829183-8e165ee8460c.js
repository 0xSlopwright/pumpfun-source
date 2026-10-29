// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(971370);
  let s = (t) => {
      if ("object" != typeof t || null === t || !0 !== t.isPrivyWallet)
        return !1;
      let e = t.features;
      return "function" == typeof e?.["solana:signMessage"]?.signMessage;
    },
    a = new WeakSet();
  t.s([
    "L",
    0,
    (t) => t.find(s),
    "A",
    0,
    (t) => {
      let e = [];
      for (let s of t?.linkedAccounts ?? [])
        "wallet" === s.type &&
          "privy" === s.walletClientType &&
          "solana" === s.chainType &&
          e.push(s.address);
      return e;
    },
    "S",
    0,
    (t, e) => {
      let s;
      return ((s = t.wallet), a.has(s))
        ? t.wallet.signMessage({
            message: t.message,
            ...(t.options ? { options: t.options } : {}),
          })
        : e(t);
    },
    "C",
    0,
    ({ addresses: t, standardWallet: s }) =>
      t.map((t) =>
        (({ address: t, standardWallet: s }) => {
          let i = {
              address: t,
              publicKey: new e.PublicKey(t).toBytes(),
              chains: ["solana:mainnet", "solana:devnet"],
              features: [],
            },
            l = {
              address: t,
              standardWallet: s,
              signMessage: async ({ message: t, options: e }) => {
                let [a] = await s.features["solana:signMessage"].signMessage({
                  account: i,
                  message: t,
                  ...(e ? { options: e } : {}),
                });
                if (!a)
                  throw Error(
                    "Privy embedded Solana wallet returned no signature for the message",
                  );
                return { signature: a.signature };
              },
            };
          return (a.add(l), l);
        })({ address: t, standardWallet: s }),
      ),
  ]);
};
