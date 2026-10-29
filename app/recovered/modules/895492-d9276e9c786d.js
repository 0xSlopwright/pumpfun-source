// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(971370),
    s = t.i(344048),
    i = t.i(545177),
    n = t.i(22675),
    a = t.i(233404),
    l = t.i(84976);
  let u = BigInt(1e6),
    r = ({ lamports: t, solPriceUsd: e }) => {
      var s;
      return t <= BigInt(0) || null == e || !Number.isFinite(e) || e <= 0
        ? "0"
        : !Number.isFinite(
              (s =
                ((Number(t) / 1e9) * e * 0.995) / (1 + (0.01 / 0.99 + 0.01))),
            ) || s <= 0
          ? "0"
          : String(BigInt(Math.floor(s * Number(u))));
    };
  t.s(["a", 0, 100, "G", 0, r], 969673);
  let m = (t) => (Number.isFinite(t) ? Math.max(Math.round(t), 300) : 300),
    o = (0, l.q)("usdc"),
    c = 400,
    d = async (t, { retryDelayMs: e = c } = {}) => {
      let s = await (0, i.s)(t, { nonTradeTx: !0 });
      if ("ok" === s.kind) return { kind: "sent", result: s.data, attempts: 1 };
      await new Promise((t) => setTimeout(t, e));
      let n = await (0, i.s)(t, { nonTradeTx: !0 });
      return "ok" === n.kind
        ? { kind: "sent", result: n.data, attempts: 2 }
        : { kind: "failed", message: n.message, attempts: 2 };
    };
  t.s(
    [
      "h",
      0,
      {
        bridge_held: "web.trade.bridge_held",
        bridge_refunded: "web.trade.bridge_buy_refunded",
        bridge_expired: "web.trade.bridge_expired",
        bridge_failed: "web.trade.bridge_failed",
      },
      "p",
      0,
      class extends Error {
        reason;
        operation;
        intentId;
        signatures;
        pending;
        constructor({
          message: t,
          reason: e,
          operation: s,
          intentId: i,
          signatures: n = [],
          cause: a,
        }) {
          (super(t, { cause: a }),
            (this.name = "BridgeBuyError"),
            (this.reason = e),
            (this.operation = s),
            (this.intentId = i),
            (this.signatures = n),
            (this.pending = "bridge_confirmation_pending" === e));
        }
      },
      "X",
      0,
      (t) => ("usdc" === t ? "usdc" : "sol"),
      "S",
      0,
      m,
      "i",
      0,
      ({ created: t, amountIn: e, fill: s }) => {
        let i,
          n = Date.parse(t.quote.expires_at);
        return {
          fromAmount: e,
          toAmount: s?.expectedOut ?? t.quote.expected_out ?? "0",
          toAmountMin: s?.minOut ?? t.quote.min_out,
          exchangeRate: "",
          transactions: [],
          provider: "bridge",
          quoteId: t.intent_id,
          expiresAt: Number.isFinite(n) ? n : void 0,
          fromAmountUsd:
            Number.isFinite((i = Number(e))) && i >= 0
              ? String(i / 10 ** o)
              : void 0,
        };
      },
      "q",
      0,
      (t) => (t ? { ...t, settlementUsdPrice: 1, settlementDecimals: o } : t),
      "k",
      0,
      ({
        solanaWallet: t,
        evmWallet: e,
        chainId: s,
        mint: i,
        paymentAsset: n,
        atomicAmount: l,
        solPriceUsd: u,
        slippageBps: o,
        calloutUser: c,
      }) => {
        let d = {
          solana_wallet: t,
          evm_wallet: e,
          direction: "buy",
          evm_chain_id: s,
          evm_token: i,
          slippage_bps: m(o),
          async_quote: !0,
          ...(c ? { callout_user: c } : {}),
        };
        if ("usdc" === n) return { ...d, amount_in: l.toString() };
        let h = r({ lamports: l, solPriceUsd: u });
        return "0" === h
          ? null
          : {
              ...d,
              amount_in: h,
              funding: "sol",
              funding_slippage_bps: 100,
              ...((0, a.b)() ? { client_supports_v1: !0 } : {}),
            };
      },
      "H",
      0,
      (t) =>
        "base64" === t.encoding
          ? (0, n.m)(t.transaction)
          : e.VersionedTransaction.deserialize(s.f.decode(t.transaction)),
      "s",
      0,
      d,
    ],
    895492,
  );
};
