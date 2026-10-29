// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(532617),
    r = e.i(503725);
  class t extends f.f {
    constructor(
      e,
      { code: f, docsPath: t, metaMessages: o, name: a, shortMessage: s },
    ) {
      (super(s, {
        cause: e,
        docsPath: t,
        metaMessages: o || e?.metaMessages,
        name: a || "RpcError",
      }),
        Object.defineProperty(this, "code", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.name = a || e.name),
        (this.code = e instanceof r.V ? e.code : (f ?? -1)));
    }
  }
  class o extends t {
    constructor(e, f) {
      (super(e, f),
        Object.defineProperty(this, "data", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.data = f.data));
    }
  }
  class a extends t {
    constructor(e) {
      super(e, {
        code: a.code,
        name: "ParseRpcError",
        shortMessage:
          "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
      });
    }
  }
  Object.defineProperty(a, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32700,
  });
  class s extends t {
    constructor(e) {
      super(e, {
        code: s.code,
        name: "InvalidRequestRpcError",
        shortMessage: "JSON is not a valid request object.",
      });
    }
  }
  Object.defineProperty(s, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32600,
  });
  class n extends t {
    constructor(e, { method: f } = {}) {
      super(e, {
        code: n.code,
        name: "MethodNotFoundRpcError",
        shortMessage: `The method${f ? ` "${f}"` : ""} does not exist / is not available.`,
      });
    }
  }
  Object.defineProperty(n, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32601,
  });
  class c extends t {
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
  class i extends t {
    constructor(e) {
      super(e, {
        code: i.code,
        name: "InternalRpcError",
        shortMessage: "An internal error was received.",
      });
    }
  }
  Object.defineProperty(i, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32603,
  });
  class d extends t {
    constructor(e) {
      super(e, {
        code: d.code,
        name: "InvalidInputRpcError",
        shortMessage:
          "Missing or invalid parameters.\nDouble check you have provided the correct parameters.",
      });
    }
  }
  Object.defineProperty(d, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32e3,
  });
  class u extends t {
    constructor(e) {
      (super(e, {
        code: u.code,
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
  Object.defineProperty(u, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32001,
  });
  class l extends t {
    constructor(e) {
      super(e, {
        code: l.code,
        name: "ResourceUnavailableRpcError",
        shortMessage: "Requested resource not available.",
      });
    }
  }
  Object.defineProperty(l, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32002,
  });
  class b extends t {
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
  class h extends t {
    constructor(e, { method: f } = {}) {
      super(e, {
        code: h.code,
        name: "MethodNotSupportedRpcError",
        shortMessage: `Method${f ? ` "${f}"` : ""} is not supported.`,
      });
    }
  }
  Object.defineProperty(h, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32004,
  });
  class p extends t {
    constructor(e) {
      super(e, {
        code: p.code,
        name: "LimitExceededRpcError",
        shortMessage: "Request exceeds defined limit.",
      });
    }
  }
  Object.defineProperty(p, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32005,
  });
  class w extends t {
    constructor(e) {
      super(e, {
        code: w.code,
        name: "JsonRpcVersionUnsupportedError",
        shortMessage: "Version of JSON-RPC protocol is not supported.",
      });
    }
  }
  Object.defineProperty(w, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: -32006,
  });
  class m extends o {
    constructor(e) {
      super(e, {
        code: m.code,
        name: "UserRejectedRequestError",
        shortMessage: "User rejected the request.",
      });
    }
  }
  Object.defineProperty(m, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4001,
  });
  class g extends o {
    constructor(e) {
      super(e, {
        code: g.code,
        name: "UnauthorizedProviderError",
        shortMessage:
          "The requested method and/or account has not been authorized by the user.",
      });
    }
  }
  Object.defineProperty(g, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4100,
  });
  class y extends o {
    constructor(e, { method: f } = {}) {
      super(e, {
        code: y.code,
        name: "UnsupportedProviderMethodError",
        shortMessage: `The Provider does not support the requested method${f ? ` " ${f}"` : ""}.`,
      });
    }
  }
  Object.defineProperty(y, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4200,
  });
  class v extends o {
    constructor(e) {
      super(e, {
        code: v.code,
        name: "ProviderDisconnectedError",
        shortMessage: "The Provider is disconnected from all chains.",
      });
    }
  }
  Object.defineProperty(v, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 4900,
  });
  class P extends o {
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
  class x extends o {
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
  class R extends o {
    constructor(e) {
      super(e, {
        code: R.code,
        name: "UnsupportedNonOptionalCapabilityError",
        shortMessage:
          "This Wallet does not support a capability that was not marked as optional.",
      });
    }
  }
  Object.defineProperty(R, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5700,
  });
  class j extends o {
    constructor(e) {
      super(e, {
        code: j.code,
        name: "UnsupportedChainIdError",
        shortMessage: "This Wallet does not support the requested chain ID.",
      });
    }
  }
  Object.defineProperty(j, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5710,
  });
  class O extends o {
    constructor(e) {
      super(e, {
        code: O.code,
        name: "DuplicateIdError",
        shortMessage: "There is already a bundle submitted with this ID.",
      });
    }
  }
  Object.defineProperty(O, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5720,
  });
  class E extends o {
    constructor(e) {
      super(e, {
        code: E.code,
        name: "UnknownBundleIdError",
        shortMessage: "This bundle id is unknown / has not been submitted",
      });
    }
  }
  Object.defineProperty(E, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5730,
  });
  class M extends o {
    constructor(e) {
      super(e, {
        code: M.code,
        name: "BundleTooLargeError",
        shortMessage: "The call bundle is too large for the Wallet to process.",
      });
    }
  }
  Object.defineProperty(M, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 5740,
  });
  class T extends o {
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
  class I extends o {
    constructor(e) {
      super(e, {
        code: I.code,
        name: "AtomicityNotSupportedError",
        shortMessage:
          "The wallet does not support atomic execution but the request requires it.",
      });
    }
  }
  async function q(e) {
    return new Promise((f) => setTimeout(f, e));
  }
  (Object.defineProperty(I, "code", {
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
        I,
        "Y",
        0,
        M,
        "r",
        0,
        P,
        "a",
        0,
        O,
        "D",
        0,
        i,
        "L",
        0,
        d,
        "u",
        0,
        c,
        "P",
        0,
        s,
        "J",
        0,
        w,
        "H",
        0,
        p,
        "X",
        0,
        n,
        "b",
        0,
        h,
        "Q",
        0,
        a,
        "p",
        0,
        v,
        "V",
        0,
        u,
        "j",
        0,
        l,
        "S",
        0,
        x,
        "g",
        0,
        b,
        "$",
        0,
        g,
        "s",
        0,
        E,
        "U",
        0,
        class extends t {
          constructor(e) {
            super(e, {
              name: "UnknownRpcError",
              shortMessage: "An unknown RPC error occurred.",
            });
          }
        },
        "d",
        0,
        j,
        "E",
        0,
        R,
        "q",
        0,
        y,
        "k",
        0,
        m,
      ],
      416532,
    ),
    e.s(["f", 0, q], 631777));
};
