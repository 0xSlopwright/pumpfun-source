// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n,
    r = e.i(785373);
  class s extends Error {
    constructor(e, t) {
      (super(e), (this.error = t));
    }
  }
  class o extends s {
    constructor() {
      (super(...arguments), (this.name = "WalletNotConnectedError"));
    }
  }
  class a extends s {
    constructor() {
      (super(...arguments), (this.name = "WalletSendTransactionError"));
    }
  }
  class i extends s {
    constructor() {
      (super(...arguments), (this.name = "WalletSignTransactionError"));
    }
  }
  (e.s(
    [
      "W",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletAccountError"));
        }
      },
      "O",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletConfigError"));
        }
      },
      "K",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletConnectionError"));
        }
      },
      "h",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletDisconnectedError"));
        }
      },
      "M",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletDisconnectionError"));
        }
      },
      "X",
      0,
      s,
      "s",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletLoadError"));
        }
      },
      "t",
      0,
      o,
      "F",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletNotReadyError"));
        }
      },
      "r",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletPublicKeyError"));
        }
      },
      "E",
      0,
      a,
      "i",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletSignInError"));
        }
      },
      "J",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletSignMessageError"));
        }
      },
      "I",
      0,
      i,
      "G",
      0,
      class extends s {
        constructor() {
          (super(...arguments), (this.name = "WalletWindowClosedError"));
        }
      },
    ],
    142309,
  ),
    ((t = n || (n = {})).Installed = "Installed"),
    (t.NotDetected = "NotDetected"),
    (t.Loadable = "Loadable"),
    (t.Unsupported = "Unsupported"));
  class c extends r.f {
    get connected() {
      return !!this.publicKey;
    }
    async autoConnect() {
      await this.connect();
    }
    async prepareTransaction(e, t, n = {}) {
      let r = this.publicKey;
      if (!r) throw new o();
      return (
        (e.feePayer = e.feePayer || r),
        (e.recentBlockhash =
          e.recentBlockhash ||
          (
            await t.getLatestBlockhash({
              commitment: n.preflightCommitment,
              minContextSlot: n.minContextSlot,
            })
          ).blockhash),
        e
      );
    }
  }
  function l(e) {
    return "version" in e;
  }
  (e.s(
    [
      "C",
      0,
      c,
      "m",
      0,
      n,
      "V",
      0,
      function () {
        let e = navigator.userAgent.toLowerCase(),
          t = e.includes("iphone") || e.includes("ipad"),
          n = e.includes("safari");
        return t && n;
      },
      "b",
      0,
      function (e) {
        if ("u" < typeof window || "u" < typeof document) return;
        let t = [];
        function n() {
          if (e()) for (let e of t) e();
        }
        let r = setInterval(n, 1e3);
        (t.push(() => clearInterval(r)),
          "loading" === document.readyState &&
            (document.addEventListener("DOMContentLoaded", n, { once: !0 }),
            t.push(() => document.removeEventListener("DOMContentLoaded", n))),
          "complete" !== document.readyState &&
            (window.addEventListener("load", n, { once: !0 }),
            t.push(() => window.removeEventListener("load", n))),
          n());
      },
    ],
    712771,
  ),
    e.s(["f", 0, l], 178610));
  class d extends c {
    async sendTransaction(e, t, n = {}) {
      let r = !0;
      try {
        if (l(e)) {
          if (!this.supportedTransactionVersions)
            throw new a(
              "Sending versioned transactions isn't supported by this wallet",
            );
          if (!this.supportedTransactionVersions.has(e.version))
            throw new a(
              `Sending transaction version ${e.version} isn't supported by this wallet`,
            );
          try {
            let r = (e = await this.signTransaction(e)).serialize();
            return await t.sendRawTransaction(r, n);
          } catch (e) {
            if (e instanceof i) throw ((r = !1), e);
            throw new a(e?.message, e);
          }
        }
        try {
          let { signers: r, ...s } = n;
          ((e = await this.prepareTransaction(e, t, s)),
            r?.length && e.partialSign(...r));
          let o = (e = await this.signTransaction(e)).serialize();
          return await t.sendRawTransaction(o, s);
        } catch (e) {
          if (e instanceof i) throw ((r = !1), e);
          throw new a(e?.message, e);
        }
      } catch (e) {
        throw (r && this.emit("error", e), e);
      }
    }
    async signAllTransactions(e) {
      for (let t of e)
        if (l(t)) {
          if (!this.supportedTransactionVersions)
            throw new i(
              "Signing versioned transactions isn't supported by this wallet",
            );
          if (!this.supportedTransactionVersions.has(t.version))
            throw new i(
              `Signing transaction version ${t.version} isn't supported by this wallet`,
            );
        }
      let t = [];
      for (let n of e) t.push(await this.signTransaction(n));
      return t;
    }
  }
  class u extends d {}
  e.s(["m", 0, u, "a", 0, class extends u {}, "L", 0, d], 606402);
};
