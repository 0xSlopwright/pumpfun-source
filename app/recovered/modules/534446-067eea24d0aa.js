// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(24533),
    i = e.i(263965);
  function f(e, s = "wei") {
    return (0, i.f)(e, t.t[s]);
  }
  e.s(["f", 0, f], 495325);
  var s = e.i(408708),
    n = e.i(532617);
  function o(e) {
    let t = Object.entries(e)
        .map(([e, t]) => (void 0 === t || !1 === t ? null : [e, t]))
        .filter(Boolean),
      i = t.reduce((e, [t]) => Math.max(e, t.length), 0);
    return t.map(([e, t]) => `  ${`${e}:`.padEnd(i + 1)}  ${t}`).join("\n");
  }
  n.f;
  class r extends n.f {
    constructor({ v: e }) {
      super(`Invalid \`v\` value "${e}". Expected 27 or 28.`, {
        name: "InvalidLegacyVError",
      });
    }
  }
  class a extends n.f {
    constructor({ transaction: e }) {
      super("Cannot infer a transaction type from provided transaction.", {
        metaMessages: [
          "Provided Transaction:",
          "{",
          o(e),
          "}",
          "",
          "To infer the type, either provide:",
          "- a `type` to the Transaction, or",
          "- an EIP-1559 Transaction with `maxFeePerGas`, or",
          "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
          "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
          "- an EIP-7702 Transaction with `authorizationList`, or",
          "- a Legacy Transaction with `gasPrice`",
        ],
        name: "InvalidSerializableTransactionError",
      });
    }
  }
  (n.f, n.f);
  class c extends n.f {
    constructor({ storageKey: e }) {
      super(
        `Size for storage key "${e}" is invalid. Expected 32 bytes. Got ${Math.floor((e.length - 2) / 2)} bytes.`,
        { name: "InvalidStorageKeySizeError" },
      );
    }
  }
  class l extends n.f {
    constructor(
      e,
      {
        account: t,
        docsPath: i,
        chain: n,
        data: r,
        gas: a,
        gasPrice: c,
        maxFeePerGas: l,
        maxPriorityFeePerGas: u,
        nonce: d,
        to: h,
        value: b,
      },
    ) {
      let p = o({
        chain: n && `${n?.name} (id: ${n?.id})`,
        from: t?.address,
        to: h,
        value: void 0 !== b && `${f(b)} ${n?.nativeCurrency?.symbol || "ETH"}`,
        data: r,
        gas: a,
        gasPrice: void 0 !== c && `${(0, s.f)(c)} gwei`,
        maxFeePerGas: void 0 !== l && `${(0, s.f)(l)} gwei`,
        maxPriorityFeePerGas: void 0 !== u && `${(0, s.f)(u)} gwei`,
        nonce: d,
      });
      (super(e.shortMessage, {
        cause: e,
        docsPath: i,
        metaMessages: [
          ...(e.metaMessages ? [...e.metaMessages, " "] : []),
          "Request Arguments:",
          p,
        ].filter(Boolean),
        name: "TransactionExecutionError",
      }),
        Object.defineProperty(this, "cause", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.cause = e));
    }
  }
  class u extends n.f {
    constructor({
      blockHash: e,
      blockNumber: t,
      blockTag: i,
      hash: f,
      index: s,
    }) {
      let n = "Transaction";
      (i &&
        void 0 !== s &&
        (n = `Transaction at block time "${i}" at index "${s}"`),
        e &&
          void 0 !== s &&
          (n = `Transaction at block hash "${e}" at index "${s}"`),
        t &&
          void 0 !== s &&
          (n = `Transaction at block number "${t}" at index "${s}"`),
        f && (n = `Transaction with hash "${f}"`),
        super(`${n} could not be found.`, {
          name: "TransactionNotFoundError",
        }));
    }
  }
  class d extends n.f {
    constructor({ hash: e }) {
      super(
        `Transaction receipt with hash "${e}" could not be found. The Transaction may not be processed on a block yet.`,
        { name: "TransactionReceiptNotFoundError" },
      );
    }
  }
  class h extends n.f {
    constructor({ receipt: e }) {
      (super(`Transaction with hash "${e.transactionHash}" reverted.`, {
        metaMessages: [
          'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
          " ",
          "You can attempt to extract the revert reason by:",
          "- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
          "- using the `call` Action with raw `data`",
        ],
        name: "TransactionReceiptRevertedError",
      }),
        Object.defineProperty(this, "receipt", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.receipt = e));
    }
  }
  class b extends n.f {
    constructor({ hash: e }) {
      super(
        `Timed out while waiting for transaction with hash "${e}" to be confirmed.`,
        { name: "WaitForTransactionReceiptTimeoutError" },
      );
    }
  }
  (e.s(
    [
      "t",
      0,
      r,
      "v",
      0,
      a,
      "J",
      0,
      c,
      "T",
      0,
      l,
      "z",
      0,
      u,
      "r",
      0,
      d,
      "E",
      0,
      h,
      "K",
      0,
      b,
      "P",
      0,
      o,
    ],
    534446,
  ),
    e.s(["f", 0, 2n ** 256n - 1n], 315857));
};
