// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(565530),
    a = e.i(178061),
    i = e.i(352386),
    n = e.i(858042),
    s = e.i(933185),
    l = e.i(582355),
    r = e.i(748117),
    o = e.i(636447);
  let c = (0, i.createContext)(void 0),
    u = () => (0, i.useContext)(c);
  function m(e, t, a, ...i) {
    for (let n of e.current[t][a]) n(...i);
  }
  function d() {
    let e = u();
    return (t, a, ...i) => m(e, t, a, ...i);
  }
  function h(e) {
    return ["ethereum", "solana"].includes(e.chainType);
  }
  function p(e) {
    let t = e.replace("eip155:", "");
    if (t) return parseInt(t);
    throw Error("Chain ID not compatible with CAIP-2 format.");
  }
  let f = (e) =>
      e.filter(
        (e) =>
          "wallets" === e.method ||
          ("exchange" === e.method
            ? "coinbase" === e.provider
            : "card" === e.method || "payment-request" === e.method
              ? "coinbase" === e.provider || "moonpay" === e.provider
              : (e.method, !1)),
      ),
    b = {
      [a.q.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      [a.P.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      [a.S.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      [a.O.id]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      [a.y.id]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      [a.z.id]: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
      [a.j.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [a.N.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      [a.M.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      [a.w.id]: "0x5425890298aed601595a70ab815c96711a31bc65",
      [a.g.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      [a.D.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      [a.e.id]: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
      [a.k.id]: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
    };
  e.s([
    "P",
    0,
    c,
    "U",
    0,
    b,
    "a",
    0,
    d,
    "b",
    0,
    ({
      address: e,
      appConfig: a,
      fundWalletConfig: i,
      methodScreen: n,
      chainIdOverride: s,
      comingFromSendTransactionScreen: l = !1,
      onComplete: r,
      onError: o,
    }) => {
      let c, u;
      if (!a.fundingConfig) throw Error("Wallet funding is not enabled");
      let m = f(a.fundingConfig.options);
      if (m.length < 1) throw Error("Wallet funding is not enabled");
      c =
        s ||
        (i?.chain
          ? i.chain.id
          : p(a.fundingConfig.defaultRecommendedCurrency.chain));
      let d = a.chains.find((e) => e.id === c);
      if (!d)
        throw new t.P(`Funding chain ${c} is not in PrivyProvider chains list`);
      let h = i?.amount ?? a.fundingConfig.defaultRecommendedAmount,
        v = !1;
      function g() {
        if (!c) return;
        let e = b[c];
        (m.find((e) => "wallets" === e.method) &&
          !e &&
          console.warn(
            "Attempting to fund with USDC on chain where USDC address is not known. Funding via external wallet will be disabled.",
          ),
          (u = e),
          (v = !0));
      }
      i && "asset" in i
        ? "USDC" === i.asset
          ? g()
          : "string" != typeof i.asset &&
            "erc20" in i.asset &&
            (v = (u = i.asset.erc20) === b[d.id])
        : "USDC" === a.fundingConfig.defaultRecommendedCurrency.asset && g();
      let k = i?.defaultFundingMethod;
      return {
        chainType: "ethereum",
        address: e,
        amount: h,
        chain: d,
        erc20Address: u,
        erc20ContractInfo: v ? { symbol: "USDC", decimals: 6 } : void 0,
        isUSDC: v,
        methodScreen: n,
        supportedOptions: m,
        comingFromSendTransactionScreen: l,
        defaultFundingMethod: k,
        usingDefaultFundingMethod: !!k,
        preferredCardProvider: i?.card?.preferredProvider,
        crossChainBridgingEnabled:
          a.fundingConfig.crossChainBridgingEnabled ?? !1,
        solanaChain: "solana:mainnet",
        uiConfig: i && "uiConfig" in i ? i.uiConfig : void 0,
        externalSolanaFundingScreen: null,
        onComplete: r ?? (() => {}),
        onError: o ?? (() => {}),
      };
    },
    "c",
    0,
    p,
    "d",
    0,
    function () {
      let { user: e, getAccessToken: a } = (0, s.u)(),
        { walletProxy: c, openModal: u, client: m } = (0, r.u)(),
        { setModalData: d } = (0, o.u)(),
        p = (0, s.a)();
      return (0, i.useMemo)(
        () => ({
          exportWallet: (i) =>
            new Promise(async (r, o) => {
              if (!e)
                return void o(
                  Error(
                    "User must be authenticated before exporting their Privy wallet",
                  ),
                );
              i && "target" in i && i && (i = void 0);
              let f = i?.address ? (0, s.k)(e, i.address) : (0, s.l)(e);
              if (!f)
                return void o(new t.P("User must have an embedded wallet."));
              let b = f.address,
                { entropyId: v, entropyIdVerifier: g } = (0, l.g)(e, f),
                k = (0, s.c)(f);
              if (!b)
                return void o(
                  Error(
                    "User does not have an HD Ethereum wallet. To export an imported wallet, pass the `address` of the wallet to `exportWallet`.",
                  ),
                );
              if (!(0, n.f)(b))
                return void o(Error("Must provide a valid Ethereum address."));
              let x = {
                recoveryMethod: f.recoveryMethod,
                connectingWalletAddress: f.address,
                isUnifiedWallet: k,
                entropyId: v,
                entropyIdVerifier: g,
                onCompleteNavigateTo: "EmbeddedWalletKeyExportScreen",
                onFailure: o,
                shouldForceMFA: !0,
              };
              (await a()) && c
                ? h(f)
                  ? (d({
                      keyExport: {
                        appId: p.id,
                        appClientId: p.appClientId,
                        origin: m.apiUrl,
                        address: f.address,
                        entropyId: v,
                        entropyIdVerifier: g,
                        hdWalletIndex: f.walletIndex,
                        chainType: f.chainType,
                        walletId: f.id,
                        isUnifiedWallet: k,
                        imported: f.imported,
                        onSuccess: r,
                        onFailure: o,
                        showBackButton: i?.showBackButton,
                      },
                      connectWallet: x,
                    }),
                    u("EmbeddedWalletConnectingScreen"))
                  : o(
                      Error(
                        `Export is not supported for ${f.chainType} wallets`,
                      ),
                    )
                : o(Error("Must have valid access token."));
            }),
        }),
        [e, a, c, u, m, d, p],
      );
    },
    "e",
    0,
    m,
    "f",
    0,
    f,
    "g",
    0,
    () => {
      let { client: e, setUser: t } = (0, r.u)();
      return {
        unlink: (0, i.useCallback)(
          async ({ address: a }) => {
            let i;
            return (
              t(
                (i = a.startsWith("0x")
                  ? await e.unlinkEthereumWallet(a)
                  : await e.unlinkSolanaWallet(a)),
              ),
              i
            );
          },
          [e, t],
        ),
      };
    },
    "h",
    0,
    () => {
      let { authenticated: e, user: a } = (0, s.u)(),
        {
          openModal: n,
          inProgressAuthFlowRef: l,
          inProgressLoginOrLinkMethodRef: o,
        } = (0, r.u)(),
        c = d();
      return {
        update: (0, i.useCallback)(() => {
          if (!e)
            throw (
              c("linkAccount", "onError", t.a.MUST_BE_AUTHENTICATED, {
                linkMethod: "email",
              }),
              new t.P("User must be authenticated before linking an account.")
            );
          if (!a?.email)
            throw new t.P(
              "User does not have an email linked to their account.",
            );
          ((l.current = "update"),
            (o.current = "email"),
            n("UpdateEmailScreen"));
        }, [e, c, l, o, n, a]),
      };
    },
    "i",
    0,
    h,
    "j",
    0,
    () => {
      let { authenticated: e, user: a } = (0, s.u)(),
        {
          openModal: n,
          inProgressAuthFlowRef: l,
          inProgressLoginOrLinkMethodRef: o,
        } = (0, r.u)(),
        c = d();
      return {
        update: (0, i.useCallback)(() => {
          if (!e)
            throw (
              c("linkAccount", "onError", t.a.MUST_BE_AUTHENTICATED, {
                linkMethod: "sms",
              }),
              new t.P("User must be authenticated before linking an account.")
            );
          if (!a?.phone)
            throw new t.P(
              "User does not have a phone number linked to their account.",
            );
          ((l.current = "update"), (o.current = "sms"), n("UpdatePhoneScreen"));
        }, [e, c, l, o, n, a]),
      };
    },
    "k",
    0,
    function ({
      address: e,
      fundWalletConfig: t,
      appConfig: a,
      comingFromSendTransactionScreen: i,
      externalSolanaFundingScreen: n,
      methodScreen: s,
    }) {
      if (!a.fundingConfig) throw Error("Wallet funding is not enabled");
      let l = f(a.fundingConfig.options);
      if (l.length < 1) throw Error("Wallet funding is not enabled");
      if ("USDC" === t?.asset && "solana:testnet" === t?.chain)
        throw Error("USDC funding is not supported on the Solana testnet");
      let r = t?.amount ?? a.fundingConfig.defaultRecommendedAmount,
        o = t?.defaultFundingMethod;
      return {
        chainType: "solana",
        address: e,
        supportedOptions: l,
        amount: r,
        isUSDC: "USDC" === t?.asset,
        methodScreen: s,
        comingFromSendTransactionScreen: i,
        chain: t?.chain || "solana:mainnet",
        crossChainBridgingEnabled:
          a.fundingConfig.crossChainBridgingEnabled ?? !1,
        defaultFundingMethod: o,
        preferredCardProvider: t?.card?.preferredProvider,
        usingDefaultFundingMethod: !!o,
        uiConfig: t?.uiConfig,
        externalSolanaFundingScreen: n,
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
    function (e, t) {
      if (!t) return;
      let a = u().current[e];
      return (0, i.useEffect)(() => {
        for (let [i, n] of Object.entries(t))
          (Object.prototype.hasOwnProperty.call(a, i) ||
            console.warn(`Invalid event type "${i}" for action "${e}"`),
            a[i]?.push(n));
        return () => {
          for (let [i, n] of Object.entries(t))
            (Object.prototype.hasOwnProperty.call(a, i) ||
              console.warn(`Invalid event type "${i}" for action "${e}"`),
              (a[i] = a[i]?.filter((e) => e !== n)));
        };
      }, [t]);
    },
  ]);
};
