// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(78436),
    n = e.i(933185),
    r = e.i(858042),
    o = e.i(389238),
    a = e.i(703114),
    s = e.i(565530),
    l = e.i(336291),
    c = e.i(809845),
    d = e.i(732486),
    u = e.i(768820);
  let h = (0, i.$)(() => ({ listings: [], loading: !1 })),
    w = h.setState,
    m = (e = !0) => {
      let i = (0, n.a)(),
        r = h((e) => e.listings),
        o = h((e) => e.loading),
        a = !!r.length;
      return (
        (0, t.useEffect)(() => {
          e &&
            !a &&
            (w({ listings: [], loading: !0 }),
            (async (e) => {
              let t = new URL(
                "v3/wallets",
                "https://explorer-api.walletconnect.com",
              );
              t.searchParams.append("projectId", e);
              let i = await fetch(t);
              return i.ok
                ? Object.values((await i.json()).listings).sort(
                    ({ slug: e }, { slug: t }) =>
                      "rainbow" === e && "metamask" === t
                        ? 1
                        : "metamask" === e || "rainbow" === e
                          ? -1
                          : 1,
                  )
                : (console.debug(
                    `Failed to fetch WalletConnect listings: ${await i.text().catch(() => "No response.")}`,
                  ),
                  []);
            })(i.walletConnectCloudProjectId)
              .then((e) => w({ listings: e, loading: !1 }))
              .catch((e) => {
                (console.error(e), w({ listings: [], loading: !1 }));
              }));
        }, [e, a, i.walletConnectCloudProjectId]),
        { listings: r, loading: o }
      );
    };
  function p(e) {
    return "cryptocom" === e
      ? "cryptocom-defi"
      : "binance" === e
        ? "binance-defi"
        : e.replace(/[-_]wallet$/, "");
  }
  function b(e) {
    return "ethereum" === e.type;
  }
  function f(e, t) {
    if (e.length !== t.length) return !1;
    for (let i = 0; i < e.length; i++) {
      let n = e[i],
        r = t[i];
      if (
        n?.address !== r?.address ||
        (n && r && b(n) && b(r) && n?.chainId !== r?.chainId) ||
        n?.connectorType !== r?.connectorType ||
        n?.connectedAt !== r?.connectedAt ||
        n?.walletClientType !== r?.walletClientType ||
        n?.isConnected !== r?.isConnected ||
        n?.linked !== r?.linked
      )
        return !1;
    }
    return !0;
  }
  let g = (e, t) => (e.rpcTimeouts && e.rpcTimeouts[t]) || n.F;
  class v extends c.W {
    buildConnectedWallet(e, t, i, n) {
      let r = async () =>
        !!this.wallets.find((t) => (0, o.A)(t.address) === (0, o.A)(e));
      return {
        type: "ethereum",
        address: (0, o.A)(e),
        chainId: t,
        meta: i,
        imported: n,
        switchChain: async (i) => {
          let n,
            r,
            a = this.wallets.find(
              (t) => (0, o.A)(t.address) === (0, o.A)(e),
            )?.chainId;
          if (!a) throw new s.e("Unable to determine current chainId.");
          if (
            ("number" == typeof i
              ? ((n = `0x${i.toString(16)}`), (r = i))
              : ((n = i), (r = Number(i))),
            a === (0, l.f)(n))
          )
            return;
          let c = this.chains.find((e) => e.id === r);
          if (!c) throw new s.e(`Unsupported chainId: ${i}`);
          let d = async () => {
            await this.proxyProvider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: n }],
            });
          };
          try {
            return await d();
          } catch (e) {
            if (
              ((e, t) => {
                switch (t) {
                  case "coinbase_wallet":
                  case "base_account":
                    return e.message.includes("addEthereumChain");
                  case "rabby_wallet":
                    return e.message.includes("Unrecognized chain ID");
                  default:
                    return 4902 === e.code || e.message?.includes("4902");
                }
              })(e, this.walletClientType)
            )
              return (
                "rabby_wallet" === this.walletClientType &&
                  (await (0, l.a)(300)),
                await this.proxyProvider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: n,
                      chainName: c.name,
                      nativeCurrency: c.nativeCurrency,
                      rpcUrls: [c.rpcUrls.default?.http[0] ?? ""],
                      blockExplorerUrls: [c.blockExplorers?.default.url ?? ""],
                    },
                  ],
                }),
                d()
              );
            if (
              "rainbow" === this.walletClientType &&
              e.message?.includes("wallet_switchEthereumChain")
            )
              throw new s.e(`Rainbow does not support the chainId ${t}`);
            throw e;
          }
        },
        connectedAt: Date.now(),
        walletClientType: this.walletClientType,
        connectorType: this.connectorType,
        isConnected: r,
        getEthereumProvider: async () => {
          if (!(await r())) throw new s.e("Wallet is not currently connected.");
          return this.proxyProvider;
        },
        sign: async (e) => {
          if (!(await r())) throw new s.e("Wallet is not currently connected.");
          return await this.sign(e);
        },
        disconnect: () => {
          this.disconnect();
        },
      };
    }
    async syncAccounts(e) {
      let t;
      c.c.debug("Syncing accounts", { wallet: this.walletClientType });
      let i = e;
      try {
        if (void 0 === i) {
          c.c.rpcRequest("eth_accounts", this.walletClientType);
          let e = await (0, l.i)(
            () => this.proxyProvider.request({ method: "eth_accounts" }),
            { maxAttempts: 10, delayMs: 500 },
          );
          (c.c.rpcResponse("eth_accounts", this.walletClientType),
            Array.isArray(e) && (i = e));
        }
      } catch (e) {
        c.c.warn(
          "Wallet did not respond to eth_accounts, using prefetched accounts",
          { wallet: this.walletClientType },
        );
      }
      if (!i || !Array.isArray(i) || i.length <= 0 || !i[0])
        return void c.c.debug("No accounts found", {
          wallet: this.walletClientType,
        });
      let a = i[0];
      if (!(0, r.f)(a)) return;
      let s = (0, o.A)(a),
        d = [];
      if ("privy" === this.walletClientType) {
        let e = l.s.get((0, n.G)(s));
        (this.chains.find((t) => t.id === Number(e)) ||
          (l.s.del((0, n.G)(s)), (e = null)),
          (t = e || `0x${this.defaultChain.id.toString(16)}`));
        try {
          await this.proxyProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: t }],
          });
        } catch (e) {
          c.c.warn("Unable to switch embedded wallet chain on initialization", {
            wallet: this.walletClientType,
            chainId: t,
          });
        }
      } else
        try {
          c.c.rpcRequest("eth_chainId", this.walletClientType);
          let e = await (0, l.i)(
            () => this.proxyProvider.request({ method: "eth_chainId" }),
            { maxAttempts: 10, delayMs: 500 },
          );
          if (
            (c.c.rpcResponse("eth_chainId", this.walletClientType),
            "string" == typeof e)
          )
            t = e;
          else {
            if ("number" != typeof e)
              throw Error("Invalid chainId returned from provider");
            t = `0x${e.toString(16)}`;
          }
        } catch (e) {
          (c.c.warn("Failed to get chainId from provider, using default", {
            wallet: this.walletClientType,
            defaultChainId: n.J,
          }),
            (t = n.J));
        }
      let u = (0, l.f)(t);
      if (!d.find((e) => (0, o.A)(e.address) === s)) {
        let e = {
          name: this.walletBranding.name,
          icon: this.walletBranding.icon,
          id: this.walletBranding.id,
        };
        d.push(
          this.buildConnectedWallet(
            (0, o.A)(a),
            u,
            e,
            "embedded_imported" === this.connectorType,
          ),
        );
      }
      f(d, this.wallets) ||
        (c.c.debug("Wallets updated", {
          wallet: this.walletClientType,
          address: s,
          chainId: u,
        }),
        (this.wallets = d),
        this.emit("walletsUpdated"));
    }
    async getConnectedWallet() {
      let e = await this.proxyProvider.request({ method: "eth_accounts" });
      return (
        this.wallets
          .sort((e, t) => t.connectedAt - e.connectedAt)
          .find((t) => e.find((e) => (0, o.A)(e) === (0, o.A)(t.address))) ||
        null
      );
    }
    async isConnected() {
      let e = await this.proxyProvider.request({ method: "eth_accounts" });
      return Array.isArray(e) && e.length > 0;
    }
    async sign(e) {
      return (
        await this.connect({ showPrompt: !1 }),
        this.proxyProvider.request({
          method: "personal_sign",
          params: [(0, a.g)(e), this.wallets[0]?.address],
        })
      );
    }
    subscribeListeners() {
      (this.proxyProvider.on("accountsChanged", this.onAccountsChanged),
        this.proxyProvider.on("chainChanged", this.onChainChanged),
        this.proxyProvider.on("disconnect", this.onDisconnect),
        this.proxyProvider.on("connect", this.onConnect));
    }
    unsubscribeListeners() {
      (this.proxyProvider.removeListener(
        "accountsChanged",
        this.onAccountsChanged,
      ),
        this.proxyProvider.removeListener("chainChanged", this.onChainChanged),
        this.proxyProvider.removeListener("disconnect", this.onDisconnect),
        this.proxyProvider.removeListener("connect", this.onConnect));
    }
    constructor(e, t, i, r) {
      (super(e),
        (this.chainType = "ethereum"),
        (this.onAccountsChanged = (e) => {
          (c.c.providerEvent("accountsChanged", this.walletClientType, {
            accountsCount: e.length,
          }),
            0 === e.length ? this.onDisconnect() : this.syncAccounts(e));
        }),
        (this.onChainChanged = (e) => {
          (c.c.providerEvent("chainChanged", this.walletClientType, {
            chainId: e,
          }),
            this.wallets.forEach((t) => {
              ((t.chainId = (0, l.f)(e)),
                "privy" === this.walletClientType &&
                  l.s.put((0, n.G)(t.address), e));
            }),
            this.emit("walletsUpdated"));
        }),
        (this.onDisconnect = () => {
          (c.c.providerEvent("disconnect", this.walletClientType),
            (this.connected = !1),
            (this.wallets = []),
            this.emit("walletsUpdated"));
        }),
        (this.onConnect = async () => {
          (c.c.providerEvent("connect", this.walletClientType),
            ("base_account" === this.connectorType && this.connected) ||
              ((this.connected = !0),
              "coinbase_wallet" === this.connectorType && (await (0, l.a)(500)),
              this.syncAccounts()));
        }),
        (this.wallets = []),
        (this.walletClientType = e),
        (this.chains = t),
        (this.defaultChain = i),
        (this.rpcConfig = r),
        (this.rpcTimeoutDuration = g(r, e)),
        (this.connected = !1),
        (this.initialized = !1));
    }
  }
  class y {
    on(e, t) {
      if (this.walletProvider) return this.addWalletProviderListener(e, t);
      this._subscriptions.push({ eventName: e, listener: t });
    }
    addWalletProviderListener(e, t) {
      if ("function" == typeof this.walletProvider?.on)
        try {
          return this.walletProvider.on(e, t);
        } catch (e) {
          console.warn("Unable to subscribe to wallet provider event");
        }
      else console.warn("Wallet provider does not support event subscriptions");
    }
    async request(e) {
      if (!this.walletProvider)
        throw new s.e(
          `A wallet request of type ${e.method} was made before setting a wallet provider.`,
        );
      return Promise.race([
        this.walletProvider.request(e),
        this.walletTimeout(),
      ]).catch((e) => {
        throw (0, c.f)(e);
      });
    }
    constructor(e, t) {
      ((this.removeListener = (e, t) => {
        if (this.walletProvider)
          try {
            return this.walletProvider.removeListener(e, t);
          } catch (e) {
            console.warn("Unable to remove wallet provider listener");
          }
      }),
        (this.walletTimeout = (e = new c.b(), t = this.rpcTimeoutDuration) =>
          new Promise((i, n) =>
            setTimeout(() => {
              n(e);
            }, t),
          )),
        (this.setWalletProvider = (e) => {
          (this.walletProvider &&
            this._subscriptions.forEach((e) => {
              this.removeListener(e.eventName, e.listener);
            }),
            (this.walletProvider = e),
            this._subscriptions.forEach((e) => {
              this.addWalletProviderListener(e.eventName, e.listener);
            }));
        }),
        (this.walletProvider = e),
        (this.rpcTimeoutDuration = t || n.F),
        (this._subscriptions = []));
    }
  }
  let C = Object.freeze({
    phantom: {
      client: "phantom",
      name: "Phantom",
      installLink: u.isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/phantom-app/"
        : "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en",
      chainTypes: ["ethereum", "solana"],
      get isInstalled() {
        if ("phantom" in window) {
          let e = window;
          if (
            (e?.phantom?.ethereum?.isPhantom &&
              e?.phantom?.ethereum?.chainId) ||
            e?.phantom?.solana?.isPhantom
          )
            return !0;
        }
        return !1;
      },
      getMobileRedirect({ useUniversalLink: e, isSolana: t, connectOnly: i }) {
        let n = A({ client: this.client, isSolana: t, connectOnly: i });
        return `${e ? "phantom://" : "https://phantom.app/ul/"}browse/${n}?ref=${n}`;
      },
    },
    solflare: {
      client: "solflare",
      name: "Solflare",
      installLink: u.isFirefox
        ? "https://addons.mozilla.org/es/firefox/addon/solflare-wallet/"
        : "https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic",
      chainTypes: ["solana"],
      get isInstalled() {
        return "solflare" in window && !!window?.solflare?.isSolflare;
      },
      getMobileRedirect({ useUniversalLink: e, isSolana: t, connectOnly: i }) {
        let n = A({ client: this.client, isSolana: t, connectOnly: i });
        return `${e ? "solflare://ul/v1/" : "https://solflare.com/ul/v1/"}browse/${n}?ref=${n}`;
      },
    },
    jupiter: {
      client: "jupiter",
      name: "Jupiter Wallet",
      installLink:
        "https://chromewebstore.google.com/detail/jupiter-wallet/iledlaeogohbilgbfhmbgkgmpplbfboh",
      chainTypes: ["solana"],
      get isInstalled() {
        return "jupiter" in window && !!window?.jupiter?.isJupiter;
      },
      getMobileRedirect({ isSolana: e, connectOnly: t }) {
        let i = A({ client: this.client, isSolana: e, connectOnly: t });
        return `jupjupjup://jup.ag/browse/${i}?ref=${i}`;
      },
    },
    backpack: {
      client: "backpack",
      name: "Backpack",
      installLink:
        "https://chromewebstore.google.com/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof",
      chainTypes: ["ethereum", "solana"],
      get isInstalled() {
        return !(
          !("backpack" in window) ||
          (!window?.backpack?.ethereum?.isBackpack &&
            !window?.backpack?.solana?.isBackpack)
        );
      },
      getMobileRedirect({ useUniversalLink: e, isSolana: t, connectOnly: i }) {
        let n = A({ client: this.client, isSolana: t, connectOnly: i });
        return `${e ? "backpack://ul/v1/" : "https://backpack.app/ul/v1/"}browse/${n}?ref=${n}`;
      },
    },
    okx_wallet: {
      client: "okx_wallet",
      name: "OKX Wallet",
      installLink:
        "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
      chainTypes: ["ethereum", "solana"],
      get isInstalled() {
        return "okxwallet" in window && !!window?.okxwallet?.isOkxWallet;
      },
      getMobileRedirect({ isSolana: e, connectOnly: t }) {
        return `okx://wallet/dapp/url?dappUrl=${A({ client: this.client, isSolana: e, connectOnly: t })}`;
      },
    },
  });
  function A({ client: e, isSolana: t, connectOnly: i }) {
    let n = new URL(window.location.href);
    return (
      n.searchParams.set("privy_connector", t ? "solana_adapter" : "injected"),
      n.searchParams.set("privy_wallet_client", e),
      n.searchParams.set("privy_connect_only", String(i)),
      encodeURIComponent(n.href.replace(/\/$/g, ""))
    );
  }
  class x extends c.S {
    get walletBranding() {
      return { id: this.id, name: this.name, icon: this.icon };
    }
    async initialize() {
      ((this.initialized = !0), this.emit("initialized"));
    }
    async connect() {
      throw Error(
        "connect called for an uninstalled wallet via the SolanaNullConnector",
      );
    }
    constructor({ id: e, name: t, icon: i }) {
      (super({ name: t }, !1),
        (this.connectorType = "null"),
        (this.proxyProvider = new y(void 0, n.F)),
        (this.disconnect = async () => {
          throw Error(
            "disconnect called for an uninstalled wallet via the SolanaNullConnector",
          );
        }),
        (this.promptConnection = async () => {
          throw Error(
            "promptConnection called for an uninstalled wallet via the SolanaNullConnector",
          );
        }),
        (this.id = e),
        (this.name = t),
        (this.icon = i));
    }
  }
  e.s([
    "E",
    0,
    v,
    "M",
    0,
    ({ ...e } = {}) =>
      (0, d.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32",
        fill: "none",
        ...e,
        children: [
          (0, d.jsx)("rect", {
            width: "32",
            height: "32",
            rx: "6",
            fill: "#121314",
          }),
          (0, d.jsx)("g", {
            transform: "translate(4, 4)",
            children: (0, d.jsxs)("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 318.6 318.6",
              children: [
                (0, d.jsx)("style", {
                  children:
                    ".s1{stroke-linecap:round;stroke-linejoin:round}.s2{fill:#e4761b;stroke:#e4761b}.s3{fill:#f6851b;stroke:#f6851b}",
                }),
                (0, d.jsx)("path", {
                  fill: "#e2761b",
                  stroke: "#e2761b",
                  className: "s1",
                  d: "m274.1 35.5-99.5 73.9L193 65.8z",
                }),
                (0, d.jsx)("path", {
                  d: "m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z",
                  className: "s1 s2",
                }),
                (0, d.jsx)("path", {
                  d: "m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z",
                  className: "s1 s2",
                }),
                (0, d.jsx)("path", {
                  fill: "#d7c1b3",
                  stroke: "#d7c1b3",
                  className: "s1",
                  d: "m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z",
                }),
                (0, d.jsx)("path", {
                  fill: "#233447",
                  stroke: "#233447",
                  className: "s1",
                  d: "m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z",
                }),
                (0, d.jsx)("path", {
                  fill: "#cd6116",
                  stroke: "#cd6116",
                  className: "s1",
                  d: "m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z",
                }),
                (0, d.jsx)("path", {
                  fill: "#e4751f",
                  stroke: "#e4751f",
                  className: "s1",
                  d: "m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z",
                }),
                (0, d.jsx)("path", {
                  d: "m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z",
                  className: "s3",
                }),
                (0, d.jsx)("path", {
                  fill: "#c0ad9e",
                  stroke: "#c0ad9e",
                  className: "s1",
                  d: "m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z",
                }),
                (0, d.jsx)("path", {
                  fill: "#161616",
                  stroke: "#161616",
                  className: "s1",
                  d: "m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z",
                }),
                (0, d.jsx)("path", {
                  fill: "#763d16",
                  stroke: "#763d16",
                  className: "s1",
                  d: "m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z",
                }),
                (0, d.jsx)("path", {
                  d: "m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z",
                  className: "s3",
                }),
              ],
            }),
          }),
        ],
      }),
    "P",
    0,
    y,
    "S",
    0,
    x,
    "a",
    0,
    f,
    "b",
    0,
    function ({ connectorType: e, walletClientType: t }) {
      for (let i of n.K) if (e === i || t === i) return C[i];
    },
    "c",
    0,
    function (e) {
      return "solana" === e.type;
    },
    "d",
    0,
    function (e) {
      return "solana" === e.chainType;
    },
    "e",
    0,
    (e) => {
      let t;
      try {
        t = new URL(e).hostname;
      } catch (e) {
        return;
      }
      return h.getState().listings.find(({ homepage: e }) => {
        let i;
        try {
          i = new URL(e).hostname;
        } catch (e) {
          return !1;
        }
        return t.includes(i);
      });
    },
    "f",
    0,
    (e) => h.getState().listings.find(({ slug: t }) => p(t) === p(e)),
    "g",
    0,
    g,
    "h",
    0,
    function (e) {
      return "ethereum" === e.chainType;
    },
    "i",
    0,
    b,
    "j",
    0,
    class extends v {
      get walletBranding() {
        return { id: this.id, name: this.name, icon: this.icon };
      }
      async initialize() {
        ((this.initialized = !0), this.emit("initialized"));
      }
      async connect() {
        throw Error(
          "connect called for an uninstalled wallet via the EthereumNullConnector",
        );
      }
      disconnect() {
        throw Error(
          "disconnect called for an uninstalled wallet via the EthereumNullConnector",
        );
      }
      promptConnection(e) {
        throw Error(
          `promptConnection called for an uninstalled wallet via the EthereumNullConnector for ${e}`,
        );
      }
      constructor({
        id: e,
        name: t,
        icon: i,
        walletClientType: r,
        defaultChain: o,
      }) {
        (super(r, [], o, {}),
          (this.connectorType = "null"),
          (this.proxyProvider = new y(void 0, n.F)),
          (this.id = e),
          (this.name = t),
          (this.icon = i));
      }
    },
    "k",
    0,
    (e) => {
      let { listings: t } = m();
      return t.find(({ slug: t }) => p(t) === p(e));
    },
    "l",
    0,
    function ({ isMobile: e, walletConfig: t }) {
      return !e && "phantom" === t?.client;
    },
    "m",
    0,
    C,
    "s",
    0,
    function (e) {
      return [
        "wallet_connect",
        "backpack",
        "binance",
        "binanceus",
        "bitget_wallet",
        "bybit_wallet",
        "cryptocom",
        "haha_wallet",
        "jupiter",
        "metamask",
        "okx_wallet",
        "phantom",
        "rabby_wallet",
        "rainbow",
        "ronin_wallet",
        "safe",
        "solflare",
        "uniswap",
        "zerion",
        "kraken_wallet",
        "robinhood_wallet",
      ].some((t) => e?.includes(t));
    },
    "u",
    0,
    m,
  ]);
};
