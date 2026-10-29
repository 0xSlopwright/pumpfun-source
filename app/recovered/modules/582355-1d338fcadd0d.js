// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    a = e.i(78436),
    i = e.i(748117),
    n = e.i(565530),
    s = e.i(933185);
  let l = (e, { chainType: t, walletIndex: a } = {}) =>
      e?.linkedAccounts.filter(
        (e) =>
          "wallet" === e.type &&
          "privy" === e.walletClientType &&
          (void 0 === a || e.walletIndex === a) &&
          (void 0 === t || e.chainType === t),
      ) ?? [],
    r = (0, a.$)(() => ({
      user: null,
      authenticated: !1,
      hasResolvedInitialUser: !1,
    })),
    o = (0, a.$)(() => ({
      ethereumExternal: [],
      areExternalConnectorsReady: !1,
      ethereumEmbedded: [],
    })),
    c = (0, t.createContext)(!1),
    u = (e) => {
      if ("ethereum" === e.chainType)
        return {
          entropyId: e.address,
          entropyIdVerifier: "ethereum-address-verifier",
        };
      if ("solana" === e.chainType)
        return {
          entropyId: e.address,
          entropyIdVerifier: "solana-address-verifier",
        };
      throw Error("Failed to get account entropy details");
    };
  e.s([
    "P",
    0,
    c,
    "a",
    0,
    o,
    "b",
    0,
    r,
    "c",
    0,
    (e) => r.setState({ user: e }),
    "d",
    0,
    (e) => o.setState({ areExternalConnectorsReady: e }),
    "e",
    0,
    (e) => r.setState({ hasResolvedInitialUser: e }),
    "f",
    0,
    () => {
      if ((0, t.useContext)(c))
        throw new n.P(
          "Multiple PrivyProvider instances found",
          "Found multiple instances of PrivyProvider, ensure there is only one mounted in your application tree.",
        );
    },
    "g",
    0,
    (e, t) => {
      if (t?.imported || (t && (0, s.c)(t))) return u(t);
      let a = (0, s.g)(e);
      if (!a) throw Error("Failed to find primary wallet");
      return u(a);
    },
    "h",
    0,
    l,
    "s",
    0,
    (e) => r.setState({ authenticated: e }),
    "t",
    0,
    u,
    "u",
    0,
    function () {
      let e = (0, t.useContext)(c),
        a = (0, i.u)(),
        n = o((e) => e.ethereumEmbedded),
        s = o((e) => e.ethereumExternal),
        u = o((e) => e.areExternalConnectorsReady),
        m = r((e) => e.user),
        d = r((e) => e.hasResolvedInitialUser),
        h = (0, t.useMemo)(
          () => [...n, ...s].sort((e, t) => t.connectedAt - e.connectedAt),
          [n, s],
        ),
        p = l(m, { chainType: "ethereum" }).length > 0,
        f = n.length > 0,
        b = !!u && !!d && !!a.walletProxy && (!p || f);
      return e
        ? (0, t.useMemo)(() => ({ wallets: h, ready: b }), [h, b])
        : (console.warn(
            "`useWallets` was called outside the PrivyProvider component",
          ),
          { wallets: [], ready: !1 });
    },
  ]);
};
