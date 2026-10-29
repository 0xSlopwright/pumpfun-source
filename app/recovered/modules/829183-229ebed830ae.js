// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(971370);
  let a = (e) => {
      if ("object" != typeof e || null === e || !0 !== e.isPrivyWallet)
        return !1;
      let t = e.features;
      return "function" == typeof t?.["solana:signMessage"]?.signMessage;
    },
    r = new WeakSet();
  e.s([
    "L",
    0,
    (e) => e.find(a),
    "A",
    0,
    (e) => {
      let t = [];
      for (let a of e?.linkedAccounts ?? [])
        "wallet" === a.type &&
          "privy" === a.walletClientType &&
          "solana" === a.chainType &&
          t.push(a.address);
      return t;
    },
    "S",
    0,
    (e, t) => {
      let a;
      return ((a = e.wallet), r.has(a))
        ? e.wallet.signMessage({
            message: e.message,
            ...(e.options ? { options: e.options } : {}),
          })
        : t(e);
    },
    "C",
    0,
    ({ addresses: e, standardWallet: a }) =>
      e.map((e) =>
        (({ address: e, standardWallet: a }) => {
          let n = {
              address: e,
              publicKey: new t.PublicKey(e).toBytes(),
              chains: ["solana:mainnet", "solana:devnet"],
              features: [],
            },
            i = {
              address: e,
              standardWallet: a,
              signMessage: async ({ message: e, options: t }) => {
                let [r] = await a.features["solana:signMessage"].signMessage({
                  account: n,
                  message: e,
                  ...(t ? { options: t } : {}),
                });
                if (!r)
                  throw Error(
                    "Privy embedded Solana wallet returned no signature for the message",
                  );
                return { signature: r.signature };
              },
            };
          return (r.add(i), i);
        })({ address: e, standardWallet: a }),
      ),
  ]);
};
