// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(565530),
    t = e.i(178061),
    a = e.i(352386),
    r = e.i(858042),
    i = e.i(933185),
    o = e.i(582355),
    s = e.i(748117),
    d = e.i(636447);
  let l = (0, a.createContext)(void 0),
    c = () => (0, a.useContext)(l);
  function u(e, n, t, ...a) {
    for (let r of e.current[n][t]) r(...a);
  }
  function p() {
    let e = c();
    return (n, t, ...a) => u(e, n, t, ...a);
  }
  function f(e) {
    return ["ethereum", "solana"].includes(e.chainType);
  }
  function h(e) {
    let n = e.replace("eip155:", "");
    if (n) return parseInt(n);
    throw Error("Chain ID not compatible with CAIP-2 format.");
  }
  let v = (e) =>
      e.filter(
        (e) =>
          "wallets" === e.method ||
          ("exchange" === e.method
            ? "coinbase" === e.provider
            : "card" === e.method || "payment-request" === e.method
              ? "coinbase" === e.provider || "moonpay" === e.provider
              : (e.method, !1)),
      ),
    m = {
      [t.q.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      [t.P.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      [t.S.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      [t.O.id]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      [t.y.id]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      [t.z.id]: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
      [t.j.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [t.N.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      [t.M.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      [t.w.id]: "0x5425890298aed601595a70ab815c96711a31bc65",
      [t.g.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      [t.D.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      [t.e.id]: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
      [t.k.id]: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
    };
  e.s([
    "P",
    0,
    l,
    "U",
    0,
    m,
    "a",
    0,
    p,
    "b",
    0,
    ({
      address: e,
      appConfig: t,
      fundWalletConfig: a,
      methodScreen: r,
      chainIdOverride: i,
      comingFromSendTransactionScreen: o = !1,
      onComplete: s,
      onError: d,
    }) => {
      let l, c;
      if (!t.fundingConfig) throw Error("Wallet funding is not enabled");
      let u = v(t.fundingConfig.options);
      if (u.length < 1) throw Error("Wallet funding is not enabled");
      l =
        i ||
        (a?.chain
          ? a.chain.id
          : h(t.fundingConfig.defaultRecommendedCurrency.chain));
      let p = t.chains.find((e) => e.id === l);
      if (!p)
        throw new n.P(`Funding chain ${l} is not in PrivyProvider chains list`);
      let f = a?.amount ?? t.fundingConfig.defaultRecommendedAmount,
        g = !1;
      function w() {
        if (!l) return;
        let e = m[l];
        (u.find((e) => "wallets" === e.method) &&
          !e &&
          console.warn(
            "Attempting to fund with USDC on chain where USDC address is not known. Funding via external wallet will be disabled.",
          ),
          (c = e),
          (g = !0));
      }
      a && "asset" in a
        ? "USDC" === a.asset
          ? w()
          : "string" != typeof a.asset &&
            "erc20" in a.asset &&
            (g = (c = a.asset.erc20) === m[p.id])
        : "USDC" === t.fundingConfig.defaultRecommendedCurrency.asset && w();
      let C = a?.defaultFundingMethod;
      return {
        chainType: "ethereum",
        address: e,
        amount: f,
        chain: p,
        erc20Address: c,
        erc20ContractInfo: g ? { symbol: "USDC", decimals: 6 } : void 0,
        isUSDC: g,
        methodScreen: r,
        supportedOptions: u,
        comingFromSendTransactionScreen: o,
        defaultFundingMethod: C,
        usingDefaultFundingMethod: !!C,
        preferredCardProvider: a?.card?.preferredProvider,
        crossChainBridgingEnabled:
          t.fundingConfig.crossChainBridgingEnabled ?? !1,
        solanaChain: "solana:mainnet",
        uiConfig: a && "uiConfig" in a ? a.uiConfig : void 0,
        externalSolanaFundingScreen: null,
        onComplete: s ?? (() => {}),
        onError: d ?? (() => {}),
      };
    },
    "c",
    0,
    h,
    "d",
    0,
    function () {
      let { user: e, getAccessToken: t } = (0, i.u)(),
        { walletProxy: l, openModal: c, client: u } = (0, s.u)(),
        { setModalData: p } = (0, d.u)(),
        h = (0, i.a)();
      return (0, a.useMemo)(
        () => ({
          exportWallet: (a) =>
            new Promise(async (s, d) => {
              if (!e)
                return void d(
                  Error(
                    "User must be authenticated before exporting their Privy wallet",
                  ),
                );
              a && "target" in a && a && (a = void 0);
              let v = a?.address ? (0, i.k)(e, a.address) : (0, i.l)(e);
              if (!v)
                return void d(new n.P("User must have an embedded wallet."));
              let m = v.address,
                { entropyId: g, entropyIdVerifier: w } = (0, o.g)(e, v),
                C = (0, i.c)(v);
              if (!m)
                return void d(
                  Error(
                    "User does not have an HD Ethereum wallet. To export an imported wallet, pass the `address` of the wallet to `exportWallet`.",
                  ),
                );
              if (!(0, r.f)(m))
                return void d(Error("Must provide a valid Ethereum address."));
              let y = {
                recoveryMethod: v.recoveryMethod,
                connectingWalletAddress: v.address,
                isUnifiedWallet: C,
                entropyId: g,
                entropyIdVerifier: w,
                onCompleteNavigateTo: "EmbeddedWalletKeyExportScreen",
                onFailure: d,
                shouldForceMFA: !0,
              };
              (await t()) && l
                ? f(v)
                  ? (p({
                      keyExport: {
                        appId: h.id,
                        appClientId: h.appClientId,
                        origin: u.apiUrl,
                        address: v.address,
                        entropyId: g,
                        entropyIdVerifier: w,
                        hdWalletIndex: v.walletIndex,
                        chainType: v.chainType,
                        walletId: v.id,
                        isUnifiedWallet: C,
                        imported: v.imported,
                        onSuccess: s,
                        onFailure: d,
                        showBackButton: a?.showBackButton,
                      },
                      connectWallet: y,
                    }),
                    c("EmbeddedWalletConnectingScreen"))
                  : d(
                      Error(
                        `Export is not supported for ${v.chainType} wallets`,
                      ),
                    )
                : d(Error("Must have valid access token."));
            }),
        }),
        [e, t, l, c, u, p, h],
      );
    },
    "e",
    0,
    u,
    "f",
    0,
    v,
    "g",
    0,
    () => {
      let { client: e, setUser: n } = (0, s.u)();
      return {
        unlink: (0, a.useCallback)(
          async ({ address: t }) => {
            let a;
            return (
              n(
                (a = t.startsWith("0x")
                  ? await e.unlinkEthereumWallet(t)
                  : await e.unlinkSolanaWallet(t)),
              ),
              a
            );
          },
          [e, n],
        ),
      };
    },
    "h",
    0,
    () => {
      let { authenticated: e, user: t } = (0, i.u)(),
        {
          openModal: r,
          inProgressAuthFlowRef: o,
          inProgressLoginOrLinkMethodRef: d,
        } = (0, s.u)(),
        l = p();
      return {
        update: (0, a.useCallback)(() => {
          if (!e)
            throw (
              l("linkAccount", "onError", n.a.MUST_BE_AUTHENTICATED, {
                linkMethod: "email",
              }),
              new n.P("User must be authenticated before linking an account.")
            );
          if (!t?.email)
            throw new n.P(
              "User does not have an email linked to their account.",
            );
          ((o.current = "update"),
            (d.current = "email"),
            r("UpdateEmailScreen"));
        }, [e, l, o, d, r, t]),
      };
    },
    "i",
    0,
    f,
    "j",
    0,
    () => {
      let { authenticated: e, user: t } = (0, i.u)(),
        {
          openModal: r,
          inProgressAuthFlowRef: o,
          inProgressLoginOrLinkMethodRef: d,
        } = (0, s.u)(),
        l = p();
      return {
        update: (0, a.useCallback)(() => {
          if (!e)
            throw (
              l("linkAccount", "onError", n.a.MUST_BE_AUTHENTICATED, {
                linkMethod: "sms",
              }),
              new n.P("User must be authenticated before linking an account.")
            );
          if (!t?.phone)
            throw new n.P(
              "User does not have a phone number linked to their account.",
            );
          ((o.current = "update"), (d.current = "sms"), r("UpdatePhoneScreen"));
        }, [e, l, o, d, r, t]),
      };
    },
    "k",
    0,
    function ({
      address: e,
      fundWalletConfig: n,
      appConfig: t,
      comingFromSendTransactionScreen: a,
      externalSolanaFundingScreen: r,
      methodScreen: i,
    }) {
      if (!t.fundingConfig) throw Error("Wallet funding is not enabled");
      let o = v(t.fundingConfig.options);
      if (o.length < 1) throw Error("Wallet funding is not enabled");
      if ("USDC" === n?.asset && "solana:testnet" === n?.chain)
        throw Error("USDC funding is not supported on the Solana testnet");
      let s = n?.amount ?? t.fundingConfig.defaultRecommendedAmount,
        d = n?.defaultFundingMethod;
      return {
        chainType: "solana",
        address: e,
        supportedOptions: o,
        amount: s,
        isUSDC: "USDC" === n?.asset,
        methodScreen: i,
        comingFromSendTransactionScreen: a,
        chain: n?.chain || "solana:mainnet",
        crossChainBridgingEnabled:
          t.fundingConfig.crossChainBridgingEnabled ?? !1,
        defaultFundingMethod: d,
        preferredCardProvider: n?.card?.preferredProvider,
        usingDefaultFundingMethod: !!d,
        uiConfig: n?.uiConfig,
        externalSolanaFundingScreen: r,
        onComplete: () => {},
        onError: () => {},
      };
    },
    "p",
    0,
    {
      login: { onComplete: [], onError: [] },
      logout: { onSuccess: [] },
      connectWallet: { onSuccess: [], onError: [] },
      connectOrCreateWallet: { onSuccess: [], onError: [] },
      createWallet: { onSuccess: [], onError: [] },
      linkAccount: { onSuccess: [], onError: [] },
      update: { onSuccess: [], onError: [] },
      configureMfa: { onMfaRequired: [] },
      setWalletPassword: { onSuccess: [], onError: [] },
      setWalletRecovery: { onSuccess: [], onError: [] },
      signMessage: { onSuccess: [], onError: [] },
      signTypedData: { onSuccess: [], onError: [] },
      sendTransaction: { onSuccess: [], onError: [] },
      signTransaction: { onSuccess: [], onError: [] },
      accessToken: { onAccessTokenGranted: [], onAccessTokenRemoved: [] },
      oAuthAuthorization: { onOAuthTokenGrant: [] },
      fundWallet: { onUserExited: [] },
      fundSolanaWallet: { onUserExited: [] },
      customAuth: { onAuthenticated: [], onUnauthenticated: [] },
    },
    "u",
    0,
    function (e, n) {
      if (!n) return;
      let t = c().current[e];
      return (0, a.useEffect)(() => {
        for (let [a, r] of Object.entries(n))
          (Object.prototype.hasOwnProperty.call(t, a) ||
            console.warn(`Invalid event type "${a}" for action "${e}"`),
            t[a]?.push(r));
        return () => {
          for (let [a, r] of Object.entries(n))
            (Object.prototype.hasOwnProperty.call(t, a) ||
              console.warn(`Invalid event type "${a}" for action "${e}"`),
              (t[a] = t[a]?.filter((e) => e !== r)));
        };
      }, [n]);
    },
  ]);
};
