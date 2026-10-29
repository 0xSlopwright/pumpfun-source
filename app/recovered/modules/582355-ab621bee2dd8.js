// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(352386),
    t = e.i(78436),
    a = e.i(748117),
    r = e.i(565530),
    i = e.i(933185);
  let o = (e, { chainType: n, walletIndex: t } = {}) =>
      e?.linkedAccounts.filter(
        (e) =>
          "wallet" === e.type &&
          "privy" === e.walletClientType &&
          (void 0 === t || e.walletIndex === t) &&
          (void 0 === n || e.chainType === n),
      ) ?? [],
    s = (0, t.$)(() => ({
      user: null,
      authenticated: !1,
      hasResolvedInitialUser: !1,
    })),
    d = (0, t.$)(() => ({
      ethereumExternal: [],
      areExternalConnectorsReady: !1,
      ethereumEmbedded: [],
    })),
    l = (0, n.createContext)(!1),
    c = (e) => {
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
    l,
    "a",
    0,
    d,
    "b",
    0,
    s,
    "c",
    0,
    (e) => s.setState({ user: e }),
    "d",
    0,
    (e) => d.setState({ areExternalConnectorsReady: e }),
    "e",
    0,
    (e) => s.setState({ hasResolvedInitialUser: e }),
    "f",
    0,
    () => {
      if ((0, n.useContext)(l))
        throw new r.P(
          "Multiple PrivyProvider instances found",
          "Found multiple instances of PrivyProvider, ensure there is only one mounted in your application tree.",
        );
    },
    "g",
    0,
    (e, n) => {
      if (n?.imported || (n && (0, i.c)(n))) return c(n);
      let t = (0, i.g)(e);
      if (!t) throw Error("Failed to find primary wallet");
      return c(t);
    },
    "h",
    0,
    o,
    "s",
    0,
    (e) => s.setState({ authenticated: e }),
    "t",
    0,
    c,
    "u",
    0,
    function () {
      let e = (0, n.useContext)(l),
        t = (0, a.u)(),
        r = d((e) => e.ethereumEmbedded),
        i = d((e) => e.ethereumExternal),
        c = d((e) => e.areExternalConnectorsReady),
        u = s((e) => e.user),
        p = s((e) => e.hasResolvedInitialUser),
        f = (0, n.useMemo)(
          () => [...r, ...i].sort((e, n) => n.connectedAt - e.connectedAt),
          [r, i],
        ),
        h = o(u, { chainType: "ethereum" }).length > 0,
        v = r.length > 0,
        m = !!c && !!p && !!t.walletProxy && (!h || v);
      return e
        ? (0, n.useMemo)(() => ({ wallets: f, ready: m }), [f, m])
        : (console.warn(
            "`useWallets` was called outside the PrivyProvider component",
          ),
          { wallets: [], ready: !1 });
    },
  ]);
};
