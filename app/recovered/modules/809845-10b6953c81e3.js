// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(42799),
    i = e.i(565530),
    n = e.i(785373),
    r = e.i(933185),
    o = e.i(336291),
    a = e.i(732486);
  let s = "[Privy:Connectors]";
  function l(e) {
    if (!e || 0 === Object.keys(e).length) return "";
    let t = Object.entries(e)
      .filter(([, e]) => null != e)
      .map(([e, t]) => `${e}=${String(t)}`);
    return t.length > 0 ? ` (${t.join(", ")})` : "";
  }
  let c = new (class {
    setEnabled(e) {
      ((this._enabled = e), e && this.info("Debug logging enabled"));
    }
    get enabled() {
      return this._enabled;
    }
    debug(e, t) {
      this._enabled && console.debug(`${s} ${e}${l(t)}`);
    }
    info(e, t) {
      this._enabled && console.info(`${s} ${e}${l(t)}`);
    }
    warn(e, t) {
      this._enabled && console.warn(`${s} ${e}${l(t)}`);
    }
    error(e, t, i) {
      if (!this._enabled) return;
      let n = t instanceof Error ? t.message : t ? String(t) : void 0,
        r = n ? { ...i, error: n } : i;
      console.error(`${s} ${e}${l(r)}`);
    }
    connectionStart(e, t, i) {
      this.info("Connection attempt started", { wallet: e, method: t, ...i });
    }
    connectionSuccess(e, t) {
      this.info("Connection successful", { wallet: e, ...t });
    }
    connectionFailed(e, t, i) {
      this.error("Connection failed", t, { wallet: e, ...i });
    }
    connectorInit(e, t, i) {
      this.debug("Connector initialized", { connector: e, wallet: t, ...i });
    }
    connectorCreated(e, t, i) {
      this.debug("Connector created", { connector: e, wallet: t, ...i });
    }
    providerEvent(e, t, i) {
      this.debug(`Provider event: ${e}`, { wallet: t, ...i });
    }
    rpcRequest(e, t, i) {
      this.debug(`RPC request: ${e}`, { wallet: t, ...i });
    }
    rpcResponse(e, t, i) {
      this.debug(`RPC response: ${e}`, { wallet: t, ...i });
    }
    constructor() {
      this._enabled = !1;
    }
  })();
  class d extends i.e {
    constructor() {
      (super("Wallet timeout"),
        (this.type = "wallet_error"),
        c.warn("Wallet request timed out"));
    }
  }
  let u = (e) => {
    if (e instanceof i.e)
      return (
        c.debug("Connector error (already formatted)", { error: e.message }),
        e
      );
    if ("number" == typeof e?.code) {
      let t = new w(e);
      return (
        c.debug("Provider RPC error", { code: t.code, error: t.message }),
        t
      );
    }
    let t = e instanceof Error ? e.message : String(e);
    return (
      c.debug("Unknown connector error", { error: t }),
      new i.e(t || "Unknown connector error", e)
    );
  };
  class h extends i.b {
    constructor(e, t, i) {
      (super(e),
        (this.type = "provider_error"),
        (this.code = t),
        (this.data = i));
    }
  }
  class w extends h {
    constructor(e) {
      super(e.message, e.code, e.data);
      let i = Object.values(t.X).find((t) => t.eipCode === e.code);
      ((this.details = i || t.X.UNKNOWN_ERROR),
        -32002 === e.code &&
          (e.message?.includes("already pending for origin")
            ? e.message?.includes("wallet_requestPermissions")
              ? (this.details = t.X.E32002_CONNECTION_ALREADY_PENDING)
              : (this.details = t.X.E32002_REQUEST_ALREADY_PENDING)
            : e.message?.includes("Already processing") &&
              e.message.includes("eth_requestAccounts") &&
              (this.details = t.X.E32002_WALLET_LOCKED)));
    }
  }
  let m = {
    ERROR_USER_EXISTS: {
      message: "User already exists for this address",
      detail: "Try another address!",
      retryable: !1,
    },
    ERROR_TIMED_OUT: {
      message: "Wallet request timed out",
      detail: "Please try connecting again.",
      retryable: !0,
    },
    ERROR_WALLET_CONNECTION: {
      message: "Could not log in with wallet",
      detail: "Please try connecting again.",
      retryable: !0,
    },
    ERROR_USER_LIMIT_REACHED: {
      message: "Unable to link",
      detail: "You've reached the maximum number of linked wallets.",
      retryable: !1,
    },
    ...t.X,
  };
  class p extends n.f {
    constructor(e) {
      (super(),
        (this.walletClientType = e),
        (this.connected = !1),
        (this.initialized = !1));
    }
  }
  let b = () => {
      let e = o.s.get(r.C);
      return e &&
        Array.isArray(e) &&
        e
          .map(
            (e) =>
              e &&
              "string" == typeof e.address &&
              "string" == typeof e.connectorType &&
              "string" == typeof e.walletClientType &&
              "number" == typeof e.connectedAt,
          )
          .every(Boolean)
        ? e
        : [];
    },
    f = [
      "phantom",
      "glow",
      "solflare",
      "backpack",
      "okx_wallet",
      "walletconnect",
      "mobile_wallet_adapter",
      "jupiter",
      "tokenpocket",
    ];
  function g(e) {
    return e.toLowerCase().split(" ").join("_");
  }
  function v(e) {
    return "isWalletConnectSolana" in e && e.isWalletConnectSolana;
  }
  e.s([
    "C",
    0,
    m,
    "P",
    0,
    w,
    "S",
    0,
    class extends p {
      get isInstalled() {
        return !0;
      }
      get wallet() {
        return this._wallet;
      }
      buildConnectedWallet() {
        return this._wallet.accounts.map((e) => ({
          type: "solana",
          provider: new t.b({ wallet: this._wallet, account: e }),
          address: e.address,
          connectedAt: Date.now(),
          walletClientType: this._wallet.name,
          connectorType: this.connectorType,
          imported: !1,
          meta: {
            name: this._wallet.name,
            id: this._wallet.name,
            icon: this._wallet.icon,
          },
          isConnected: async () => this._wallet.accounts.length > 0,
          disconnect: async () => {
            await this.disconnect();
          },
        }));
      }
      async syncAccounts() {
        ((this.wallets = this.buildConnectedWallet()),
          this.emit("walletsUpdated"));
      }
      get walletBranding() {
        return {
          id: v(this.wallet) ? "walletconnect_solana" : this.wallet.name,
          name: this.wallet.name,
          icon: this.wallet.icon,
        };
      }
      async initialize() {
        (c.debug("Initializing Solana connector", {
          wallet: this.walletClientType,
        }),
          this.subscribeListeners(),
          await this.syncAccounts(),
          this.shouldAttemptAutoConnect() &&
            (c.debug("Attempting Solana auto-connect", {
              wallet: this.walletClientType,
            }),
            await this.wallet.features["standard:connect"]
              ?.connect({ silent: !0 })
              .catch(() => {}),
            (await this.isConnected()) &&
              (c.debug("Solana auto-connect successful", {
                wallet: this.walletClientType,
              }),
              await this.syncAccounts())),
          (this.initialized = !0),
          this.emit("initialized"));
      }
      async connect(e) {
        if (
          (c.connectionStart(this.walletClientType, "solana_adapter", {
            showPrompt: e.showPrompt,
          }),
          e.showPrompt)
        )
          try {
            await this.promptConnection();
          } catch (e) {
            if (0 === this._wallet.accounts.length)
              throw (
                c.warn("Solana wallet connected but has no accounts", {
                  wallet: this.walletClientType,
                }),
                new i.i()
              );
            throw (
              c.connectionFailed(this.walletClientType, e, {
                method: "solana_adapter",
              }),
              e
            );
          }
        if (!(await this.isConnected()))
          throw (
            c.warn("Solana wallet not connected after prompt", {
              wallet: this.walletClientType,
            }),
            new i.i()
          );
        await this.syncAccounts();
        let t = await this.getConnectedWallet();
        return (t && c.connectionSuccess(this.walletClientType), t);
      }
      async getConnectedWallet() {
        return (
          this.wallets.sort((e, t) => t.connectedAt - e.connectedAt)[0] || null
        );
      }
      async isConnected() {
        return this._wallet.accounts.length > 0;
      }
      subscribeListeners() {
        this._unsubscribeListeners = this.wallet.features[
          "standard:events"
        ]?.on("change", this.onChange);
      }
      unsubscribeListeners() {
        this._unsubscribeListeners?.();
      }
      shouldAttemptAutoConnect() {
        return (
          !(!this.autoConnectEnabled || !f.includes(this.walletClientType)) &&
          ("phantom" !== this.walletClientType ||
            b().some(({ walletClientType: e }) => "phantom" === e))
        );
      }
      constructor(e, t) {
        (super(g(v(e) ? "walletconnect_solana" : e.name)),
          (this.chainType = "solana"),
          (this.connectorType = "solana_adapter"),
          (this.disconnect = async () => {
            (c.debug("Disconnecting Solana wallet", {
              wallet: this.walletClientType,
            }),
              await this.wallet.features["standard:disconnect"]
                ?.disconnect()
                .catch((e) => {
                  c.error("Error disconnecting Solana wallet", e, {
                    wallet: this.walletClientType,
                  });
                }),
              await this.syncAccounts());
          }),
          (this.promptConnection = async () => {
            c.debug("Prompting Solana connection", {
              wallet: this.walletClientType,
            });
            try {
              await this.wallet.features["standard:connect"]?.connect();
            } catch (e) {
              throw (
                c.connectionFailed(this.walletClientType, e, {
                  method: "solana_adapter",
                }),
                u(e)
              );
            }
          }),
          (this.onChange = () => {
            this.syncAccounts();
          }),
          (this._wallet = e),
          (this.autoConnectEnabled = t),
          (this.wallets = []));
      }
    },
    "W",
    0,
    p,
    "a",
    0,
    "data:image/png;base64,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",
    "b",
    0,
    d,
    "c",
    0,
    c,
    "d",
    0,
    ({ style: e, ...t }) => {
      let i = (0, r.a)();
      return (0, a.jsxs)("svg", {
        width: "28",
        height: "28",
        viewBox: "0 0 28 28",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { height: "28px", width: "28px", ...e },
        ...t,
        children: [
          (0, a.jsx)("rect", {
            width: "28",
            height: "28",
            rx: "3",
            fill:
              "dark" === i?.appearance.palette.colorScheme
                ? "#3396ff"
                : "#141414",
          }),
          (0, a.jsx)("g", {
            clipPath: "url(#clip0_1765_9946)",
            children: (0, a.jsx)("path", {
              d: "M8.09448 10.3941C11.3558 7.20196 16.6442 7.20196 19.9055 10.3941L20.2982 10.7782C20.3369 10.8157 20.3677 10.8606 20.3887 10.9102C20.4097 10.9599 20.4206 11.0132 20.4206 11.0671C20.4206 11.121 20.4097 11.1744 20.3887 11.224C20.3677 11.2737 20.3369 11.3186 20.2982 11.3561L18.9554 12.6702C18.9158 12.7086 18.8628 12.7301 18.8077 12.7301C18.7526 12.7301 18.6996 12.7086 18.66 12.6702L18.1198 12.1415C15.8448 9.91503 12.1557 9.91503 9.88015 12.1415L9.30167 12.7075C9.26207 12.7459 9.20909 12.7673 9.15395 12.7673C9.0988 12.7673 9.04582 12.7459 9.00622 12.7075L7.66346 11.3934C7.62475 11.3559 7.59397 11.3109 7.57295 11.2613C7.55193 11.2117 7.5411 11.1583 7.5411 11.1044C7.5411 11.0505 7.55193 10.9971 7.57295 10.9475C7.59397 10.8979 7.62475 10.8529 7.66346 10.8154L8.09448 10.3941ZM22.6829 13.1115L23.8776 14.2814C23.9163 14.319 23.9471 14.3639 23.9681 14.4135C23.9892 14.4632 24 14.5165 24 14.5704C24 14.6243 23.9892 14.6777 23.9681 14.7273C23.9471 14.777 23.9163 14.8219 23.8776 14.8594L18.4893 20.1332C18.4102 20.2101 18.3042 20.2531 18.1938 20.2531C18.0835 20.2531 17.9775 20.2101 17.8984 20.1332L14.0743 16.3901C14.0545 16.3708 14.0279 16.36 14.0003 16.36C13.9726 16.36 13.9461 16.3708 13.9263 16.3901L10.1021 20.1332C10.023 20.2101 9.91703 20.2531 9.8067 20.2531C9.69636 20.2531 9.59038 20.2101 9.51124 20.1332L4.12236 14.8594C4.08365 14.8219 4.05287 14.777 4.03185 14.7273C4.01083 14.6777 4 14.6243 4 14.5704C4 14.5165 4.01083 14.4632 4.03185 14.4135C4.05287 14.3639 4.08365 14.319 4.12236 14.2814L5.31767 13.1115C5.39678 13.0348 5.50265 12.9919 5.61285 12.9919C5.72305 12.9919 5.82892 13.0348 5.90803 13.1115L9.73216 16.8546C9.75194 16.874 9.7785 16.8848 9.80616 16.8848C9.83381 16.8848 9.86037 16.874 9.88015 16.8546L13.7043 13.1115C13.7834 13.0346 13.8894 12.9916 13.9997 12.9916C14.1101 12.9916 14.216 13.0346 14.2952 13.1115L18.1198 16.8546C18.1396 16.874 18.1662 16.8848 18.1938 16.8848C18.2215 16.8848 18.2481 16.874 18.2678 16.8546L22.092 13.1115C22.1711 13.0346 22.2771 12.9916 22.3874 12.9916C22.4977 12.9916 22.6037 13.0346 22.6829 13.1115Z",
              fill: "white",
            }),
          }),
          (0, a.jsx)("defs", {
            children: (0, a.jsx)("clipPath", {
              id: "clip0_1765_9946",
              children: (0, a.jsx)("rect", {
                width: "20",
                height: "12.2531",
                fill: "white",
                transform: "translate(4 8)",
              }),
            }),
          }),
        ],
      });
    },
    "e",
    0,
    h,
    "f",
    0,
    u,
    "l",
    0,
    b,
    "t",
    0,
    g,
  ]);
};
