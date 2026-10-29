// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617),
    r = e.i(503725);
  class o extends t.f {
    constructor(
      e,
      { code: t, docsPath: o, metaMessages: s, name: n, shortMessage: a },
    ) {
      (super(a, {
        cause: e,
        docsPath: o,
        metaMessages: s || e?.metaMessages,
        name: n || "RpcError",
      }),
        Object.defineProperty(this, "code", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.name = n || e.name),
        (this.code = e instanceof r.V ? e.code : (t ?? -1)));
    }
  }
  class s extends o {
    constructor(e, t) {
      (super(e, t),
        Object.defineProperty(this, "data", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.data = t.data));
    }
  }
  class n extends o {
    constructor(e) {
      super(e, {
        code: n.code,
        name: "ParseRpcError",
        shortMessage:
          "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
      });
    }
  }
  Object.defineProperty(n, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32700,
  });
  class a extends o {
    constructor(e) {
      super(e, {
        code: a.code,
        name: "InvalidRequestRpcError",
        shortMessage: "JSON is not a valid request object.",
      });
    }
  }
  Object.defineProperty(a, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32600,
  });
  class i extends o {
    constructor(e, { method: t } = {}) {
      super(e, {
        code: i.code,
        name: "MethodNotFoundRpcError",
        shortMessage: `The method${t ? ` "${t}"` : ""} does not exist / is not available.`,
      });
    }
  }
  Object.defineProperty(i, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32601,
  });
  class c extends o {
    constructor(e) {
      super(e, {
        code: c.code,
        name: "InvalidParamsRpcError",
        shortMessage:
          "Invalid parameters were provided to the RPC method.\nDouble check you have provided the correct parameters.",
      });
    }
  }
  Object.defineProperty(c, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32602,
  });
  class l extends o {
    constructor(e) {
      super(e, {
        code: l.code,
        name: "InternalRpcError",
        shortMessage: "An internal error was received.",
      });
    }
  }
  Object.defineProperty(l, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32603,
  });
  class u extends o {
    constructor(e) {
      super(e, {
        code: u.code,
        name: "InvalidInputRpcError",
        shortMessage:
          "Missing or invalid parameters.\nDouble check you have provided the correct parameters.",
      });
    }
  }
  Object.defineProperty(u, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32e3,
  });
  class d extends o {
    constructor(e) {
      (super(e, {
        code: d.code,
        name: "ResourceNotFoundRpcError",
        shortMessage: "Requested resource not found.",
      }),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "ResourceNotFoundRpcError",
        }));
    }
  }
  Object.defineProperty(d, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32001,
  });
  class f extends o {
    constructor(e) {
      super(e, {
        code: f.code,
        name: "ResourceUnavailableRpcError",
        shortMessage: "Requested resource not available.",
      });
    }
  }
  Object.defineProperty(f, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32002,
  });
  class b extends o {
    constructor(e) {
      super(e, {
        code: b.code,
        name: "TransactionRejectedRpcError",
        shortMessage: "Transaction creation failed.",
      });
    }
  }
  Object.defineProperty(b, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32003,
  });
  class p extends o {
    constructor(e, { method: t } = {}) {
      super(e, {
        code: p.code,
        name: "MethodNotSupportedRpcError",
        shortMessage: `Method${t ? ` "${t}"` : ""} is not supported.`,
      });
    }
  }
  Object.defineProperty(p, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32004,
  });
  class h extends o {
    constructor(e) {
      super(e, {
        code: h.code,
        name: "LimitExceededRpcError",
        shortMessage: "Request exceeds defined limit.",
      });
    }
  }
  Object.defineProperty(h, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32005,
  });
  class m extends o {
    constructor(e) {
      super(e, {
        code: m.code,
        name: "JsonRpcVersionUnsupportedError",
        shortMessage: "Version of JSON-RPC protocol is not supported.",
      });
    }
  }
  Object.defineProperty(m, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32006,
  });
  class g extends s {
    constructor(e) {
      super(e, {
        code: g.code,
        name: "UserRejectedRequestError",
        shortMessage: "User rejected the request.",
      });
    }
  }
  Object.defineProperty(g, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4001,
  });
  class y extends s {
    constructor(e) {
      super(e, {
        code: y.code,
        name: "UnauthorizedProviderError",
        shortMessage:
          "The requested method and/or account has not been authorized by the user.",
      });
    }
  }
  Object.defineProperty(y, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4100,
  });
  class v extends s {
    constructor(e, { method: t } = {}) {
      super(e, {
        code: v.code,
        name: "UnsupportedProviderMethodError",
        shortMessage: `The Provider does not support the requested method${t ? ` " ${t}"` : ""}.`,
      });
    }
  }
  Object.defineProperty(v, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4200,
  });
  class w extends s {
    constructor(e) {
      super(e, {
        code: w.code,
        name: "ProviderDisconnectedError",
        shortMessage: "The Provider is disconnected from all chains.",
      });
    }
  }
  Object.defineProperty(w, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4900,
  });
  class P extends s {
    constructor(e) {
      super(e, {
        code: P.code,
        name: "ChainDisconnectedError",
        shortMessage: "The Provider is not connected to the requested chain.",
      });
    }
  }
  Object.defineProperty(P, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4901,
  });
  class x extends s {
    constructor(e) {
      super(e, {
        code: x.code,
        name: "SwitchChainError",
        shortMessage: "An error occurred when attempting to switch chain.",
      });
    }
  }
  Object.defineProperty(x, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4902,
  });
  class B extends s {
    constructor(e) {
      super(e, {
        code: B.code,
        name: "UnsupportedNonOptionalCapabilityError",
        shortMessage:
          "This Wallet does not support a capability that was not marked as optional.",
      });
    }
  }
  Object.defineProperty(B, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5700,
  });
  class I extends s {
    constructor(e) {
      super(e, {
        code: I.code,
        name: "UnsupportedChainIdError",
        shortMessage: "This Wallet does not support the requested chain ID.",
      });
    }
  }
  Object.defineProperty(I, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5710,
  });
  class R extends s {
    constructor(e) {
      super(e, {
        code: R.code,
        name: "DuplicateIdError",
        shortMessage: "There is already a bundle submitted with this ID.",
      });
    }
  }
  Object.defineProperty(R, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5720,
  });
  class j extends s {
    constructor(e) {
      super(e, {
        code: j.code,
        name: "UnknownBundleIdError",
        shortMessage: "This bundle id is unknown / has not been submitted",
      });
    }
  }
  Object.defineProperty(j, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5730,
  });
  class O extends s {
    constructor(e) {
      super(e, {
        code: O.code,
        name: "BundleTooLargeError",
        shortMessage: "The call bundle is too large for the Wallet to process.",
      });
    }
  }
  Object.defineProperty(O, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5740,
  });
  class T extends s {
    constructor(e) {
      super(e, {
        code: T.code,
        name: "AtomicReadyWalletRejectedUpgradeError",
        shortMessage:
          "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade.",
      });
    }
  }
  Object.defineProperty(T, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5750,
  });
  class E extends s {
    constructor(e) {
      super(e, {
        code: E.code,
        name: "AtomicityNotSupportedError",
        shortMessage:
          "The wallet does not support atomic execution but the request requires it.",
      });
    }
  }
  async function M(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  (Object.defineProperty(E, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5760,
  }),
    e.s(
      [
        "Z",
        0,
        T,
        "T",
        0,
        E,
        "Y",
        0,
        O,
        "r",
        0,
        P,
        "a",
        0,
        R,
        "D",
        0,
        l,
        "L",
        0,
        u,
        "u",
        0,
        c,
        "P",
        0,
        a,
        "J",
        0,
        m,
        "H",
        0,
        h,
        "X",
        0,
        i,
        "b",
        0,
        p,
        "Q",
        0,
        n,
        "p",
        0,
        w,
        "V",
        0,
        d,
        "j",
        0,
        f,
        "S",
        0,
        x,
        "g",
        0,
        b,
        "$",
        0,
        y,
        "s",
        0,
        j,
        "U",
        0,
        class extends o {
          constructor(e) {
            super(e, {
              name: "UnknownRpcError",
              shortMessage: "An unknown RPC error occurred.",
            });
          }
        },
        "d",
        0,
        I,
        "E",
        0,
        B,
        "q",
        0,
        v,
        "k",
        0,
        g,
      ],
      416532,
    ),
    e.s(["f", 0, M], 631777));
};
