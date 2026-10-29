// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = { ether: -9, wei: 9 };
  e.s(["t", 0, { gwei: 9, wei: 18 }, "C", 0, t], 24533);
  var i = e.i(263965);
  function f(e, s = "wei") {
    return (0, i.f)(e, t[s]);
  }
  e.s(["f", 0, f], 408708);
  var s = e.i(532617);
  class n extends s.f {
    constructor({ cause: e, message: t } = {}) {
      let i = t
        ?.replace("execution reverted: ", "")
        ?.replace("execution reverted", "");
      super(
        `Execution reverted ${i ? `with reason: ${i}` : "for an unknown reason"}.`,
        { cause: e, name: "ExecutionRevertedError" },
      );
    }
  }
  (Object.defineProperty(n, "code", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: 3,
  }),
    Object.defineProperty(n, "nodeMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /execution reverted|gas required exceeds allowance/,
    }));
  class o extends s.f {
    constructor({ cause: e, maxFeePerGas: t } = {}) {
      super(
        `The fee cap (\`maxFeePerGas\`${t ? ` = ${f(t)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`,
        { cause: e, name: "FeeCapTooHighError" },
      );
    }
  }
  Object.defineProperty(o, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/,
  });
  class r extends s.f {
    constructor({ cause: e, maxFeePerGas: t } = {}) {
      super(
        `The fee cap (\`maxFeePerGas\`${t ? ` = ${f(t)}` : ""} gwei) cannot be lower than the block base fee.`,
        { cause: e, name: "FeeCapTooLowError" },
      );
    }
  }
  Object.defineProperty(r, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value:
      /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/,
  });
  class a extends s.f {
    constructor({ cause: e, nonce: t } = {}) {
      super(
        `Nonce provided for the transaction ${t ? `(${t}) ` : ""}is higher than the next one expected.`,
        { cause: e, name: "NonceTooHighError" },
      );
    }
  }
  Object.defineProperty(a, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /nonce too high/,
  });
  class c extends s.f {
    constructor({ cause: e, nonce: t } = {}) {
      super(
        `Nonce provided for the transaction ${t ? `(${t}) ` : ""}is lower than the current nonce of the account.
Try increasing the nonce or find the latest nonce with \`getTransactionCount\`.`,
        { cause: e, name: "NonceTooLowError" },
      );
    }
  }
  Object.defineProperty(c, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /nonce too low|transaction already imported|already known/,
  });
  class l extends s.f {
    constructor({ cause: e, nonce: t } = {}) {
      super(
        `Nonce provided for the transaction ${t ? `(${t}) ` : ""}exceeds the maximum allowed nonce.`,
        { cause: e, name: "NonceMaxValueError" },
      );
    }
  }
  Object.defineProperty(l, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /nonce has max value/,
  });
  class u extends s.f {
    constructor({ cause: e } = {}) {
      super(
        "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.",
        {
          cause: e,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient.",
          ],
          name: "InsufficientFundsError",
        },
      );
    }
  }
  Object.defineProperty(u, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /insufficient funds|exceeds transaction sender account balance/,
  });
  class d extends s.f {
    constructor({ cause: e, gas: t } = {}) {
      super(
        `The amount of gas ${t ? `(${t}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`,
        { cause: e, name: "IntrinsicGasTooHighError" },
      );
    }
  }
  Object.defineProperty(d, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /intrinsic gas too high|gas limit reached/,
  });
  class h extends s.f {
    constructor({ cause: e, gas: t } = {}) {
      super(
        `The amount of gas ${t ? `(${t}) ` : ""}provided for the transaction is too low.`,
        { cause: e, name: "IntrinsicGasTooLowError" },
      );
    }
  }
  Object.defineProperty(h, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /intrinsic gas too low/,
  });
  class b extends s.f {
    constructor({ cause: e }) {
      super("The transaction type is not supported for this chain.", {
        cause: e,
        name: "TransactionTypeNotSupportedError",
      });
    }
  }
  Object.defineProperty(b, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: /transaction type not valid/,
  });
  class p extends s.f {
    constructor({ cause: e, maxPriorityFeePerGas: t, maxFeePerGas: i } = {}) {
      super(
        `The provided tip (\`maxPriorityFeePerGas\`${t ? ` = ${f(t)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${i ? ` = ${f(i)} gwei` : ""}).`,
        { cause: e, name: "TipAboveFeeCapError" },
      );
    }
  }
  Object.defineProperty(p, "nodeMessage", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value:
      /max priority fee per gas higher than max fee per gas|tip higher than fee cap/,
  });
  class g extends s.f {
    constructor({ cause: e }) {
      super(`An error occurred while executing: ${e?.shortMessage}`, {
        cause: e,
        name: "UnknownNodeError",
      });
    }
  }
  e.s(
    [
      "s",
      0,
      n,
      "k",
      0,
      o,
      "L",
      0,
      r,
      "y",
      0,
      u,
      "D",
      0,
      d,
      "m",
      0,
      h,
      "G",
      0,
      l,
      "e",
      0,
      a,
      "q",
      0,
      c,
      "M",
      0,
      p,
      "N",
      0,
      b,
      "b",
      0,
      g,
    ],
    960872,
  );
};
