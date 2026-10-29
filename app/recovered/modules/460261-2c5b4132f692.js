// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(357500),
    r = e.i(613677),
    n = e.i(342463),
    a = e.i(605587),
    i = e.i(84976),
    o = e.i(637782),
    s = e.i(866890),
    l = e.i(297865);
  let c = r.z
      .object({
        type: n.z.string(),
        description: n.z.string().optional(),
        chainId: o.z.number().optional(),
        evm: r.z
          .object({
            to: n.z.string(),
            data: n.z.string(),
            value: n.z.string().nullish(),
            gasLimit: n.z.string().nullish(),
          })
          .optional(),
        svm: r.z
          .object({
            instructions: s.z.array(
              r.z.object({
                keys: s.z.array(
                  r.z.object({
                    pubkey: n.z.string(),
                    isSigner: l.z.boolean(),
                    isWritable: l.z.boolean(),
                  }),
                ),
                programId: n.z.string(),
                data: n.z.string(),
              }),
            ),
          })
          .optional(),
        relay: r.z
          .object({
            checkEndpoint: n.z.string().optional(),
            requestId: n.z.string().optional(),
          })
          .optional(),
      })
      .passthrough(),
    u = r.z
      .object({
        fromAmount: n.z.string(),
        toAmount: n.z.string(),
        toAmountMin: n.z.string().optional(),
        exchangeRate: n.z.string().optional(),
        fees: r.z
          .object({
            gas: n.z.string().optional(),
            protocol: n.z.string().optional(),
            total: n.z.string().optional(),
          })
          .optional(),
        transactions: s.z.array(c).default([]),
        provider: n.z.string().optional(),
        expiresAt: o.z.number().optional(),
        quoteId: n.z.string().optional(),
        fromAmountUsd: n.z.string().optional(),
        toAmountUsd: n.z.string().optional(),
        totalImpactUsd: n.z.string().optional(),
        totalImpactPercent: n.z.string().optional(),
        swapImpactUsd: n.z.string().optional(),
        swapImpactPercent: n.z.string().optional(),
      })
      .passthrough(),
    d = r.z.object({
      code: n.z.string().optional(),
      message: n.z.string().optional(),
      data: r.z
        .object({
          reason: n.z.string().optional(),
          requestId: n.z.string().optional(),
        })
        .optional(),
    }),
    f = r.z
      .object({
        status: n.z.string(),
        details: n.z.string().optional(),
        failReason: n.z.string().nullish(),
        inTxHashes: s.z.array(n.z.string()).optional(),
        txHashes: s.z.array(n.z.string()).optional(),
        originChainId: o.z.number().optional(),
        destinationChainId: o.z.number().optional(),
      })
      .passthrough(),
    p = new Set(["success", "failure", "refund", "delayed"]);
  e.s(["A", 0, p, "P", 0, d, "T", 0, u, "e", 0, f], 871544);
  let m = "/api/relay/rpc/swap";
  function g(e) {
    let r = (0, t.getChainBySlug)(e).evmChainId;
    if (null === r) throw Error(`Chain ${e} has no EVM chain id`);
    return r;
  }
  let h = g("hyperevm"),
    y = g("robinhood"),
    b = new Set(["xlayer", "polygon", "arbitrum"]);
  function x(e) {
    let r = (0, a.w)(e ?? null);
    if (null == r || !/^\d+$/.test(r)) return null;
    let n = (0, t.findChainByEvmChainId)(Number(r));
    return !n || b.has(n.slug) ? null : (n.relaySlug ?? null);
  }
  function v(e) {
    let t = (0, a.w)(e ?? null);
    return null == t ? null : Number(t);
  }
  function w(e) {
    return v(e) === h;
  }
  let _ = "UNSUPPORTED_CURRENCY",
    z = "REGION_RESTRICTED";
  class k extends Error {
    reason;
    status;
    constructor(e, { reason: t, status: r } = {}) {
      (super(e),
        (this.name = "RelayQuoteError"),
        (this.reason = t),
        (this.status = r));
    }
  }
  function S(e, t) {
    return t(
      v(e) === y
        ? "web.trade.tokenized_stock_unsupported"
        : "web.trade.relay_error_untradable",
    );
  }
  let A = { disableSwapProviderPreference: "true" },
    P = async (e) => {
      let t,
        r = `Quote failed (${e.status})`;
      try {
        let n = d.safeParse(await e.json());
        n.success &&
          ((t = n.data.data?.reason ?? n.data.code), (r = n.data.message ?? r));
      } catch {}
      return { kind: "error", status: e.status, reason: t, message: r };
    };
  async function j(e) {
    let t,
      r,
      n = ((e) => {
        let t = x(e.chainId);
        if (!t) return null;
        let r = (0, i.F)(
          (0, i.g)({
            mint: e.mint,
            direction: e.direction,
            preferredAsset: e.solanaAsset,
          }),
        );
        return "buy" === e.direction
          ? {
              fromChain: "solana",
              toChain: t,
              fromToken: r,
              toToken: e.mint,
              amount: e.atomicAmount.toString(),
              userAddress: e.solanaWalletAddress,
              recipient: e.evmWalletAddress,
              slippageBps: String(e.slippageBps),
              ...(e.overridePriceImpact && { overridePriceImpact: "true" }),
              ...A,
            }
          : {
              fromChain: t,
              toChain: "solana",
              fromToken: e.mint,
              toToken: r,
              amount: e.atomicAmount.toString(),
              userAddress: e.evmWalletAddress,
              recipient: e.solanaWalletAddress,
              subsidizeFees: String(!w(e.chainId)),
              originGasOverhead: "80000",
              slippageBps: String(e.slippageBps),
              ...(e.overridePriceImpact && { overridePriceImpact: "true" }),
              ...A,
            };
      })(e);
    if (!n)
      return {
        kind: "error",
        reason: "UNSUPPORTED_CHAIN",
        message: "This chain isn't supported for cross-chain trading yet.",
      };
    try {
      t = await fetch(`${m}/quote?${new URLSearchParams(n)}`, {
        signal: AbortSignal.timeout(3e4),
      });
    } catch (e) {
      return {
        kind: "error",
        message:
          e instanceof DOMException && "TimeoutError" === e.name
            ? "Quote timed out. Please try again."
            : "Network error fetching quote.",
      };
    }
    if (!t.ok) return P(t);
    try {
      r = await t.json();
    } catch {
      return { kind: "error", message: "Quote response was not JSON." };
    }
    let a = u.safeParse(r);
    return a.success
      ? { kind: "ok", data: a.data }
      : {
          kind: "error",
          reason: "QUOTE_PARSE_FAILED",
          message: `Unexpected quote shape: ${a.error.issues[0]?.message ?? "unknown"}`,
        };
  }
  let E = new Set([
      "NO_SWAP_ROUTES_FOUND",
      "INSUFFICIENT_LIQUIDITY",
      "UNSUPPORTED_ROUTE",
      "UNSUPPORTED_CHAIN",
    ]),
    I = new Set(["INVALID_INPUT_CURRENCY", "INVALID_OUTPUT_CURRENCY"]),
    T = new Set(["SPONSOR_GUARD_FAILED", "SPONSORSHIP_CAP_EXCEEDED"]);
  async function O(e) {
    let t, r;
    try {
      t = await fetch(`${m}/status/${encodeURIComponent(e)}`, {
        signal: AbortSignal.timeout(15e3),
      });
    } catch {
      return { kind: "error", message: "Network error fetching swap status." };
    }
    if (!t.ok) return P(t);
    try {
      r = await t.json();
    } catch {
      return { kind: "error", message: "Status response was not JSON." };
    }
    let n = f.safeParse(r);
    return n.success
      ? { kind: "ok", data: n.data }
      : { kind: "error", message: "Unexpected status shape." };
  }
  async function C(e) {
    let t = Date.now() + 6e4;
    for (; Date.now() < t; ) {
      let t = await O(e);
      if ("ok" === t.kind && p.has(t.data.status)) return t.data;
      await new Promise((e) => setTimeout(e, 2e3));
    }
    return null;
  }
  let N = r.z.object({ message: n.z.string() }).passthrough();
  async function R(e) {
    let t, r;
    try {
      t = await fetch(`${m}/execute`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(e),
        signal: AbortSignal.timeout(3e4),
      });
    } catch {
      return { kind: "error", message: "Network error submitting swap." };
    }
    if (!t.ok) {
      let e = "";
      try {
        e = (await t.text()).slice(0, 300);
      } catch {}
      return {
        kind: "error",
        status: t.status,
        message: `Execute failed (${t.status})${e ? `: ${e}` : ""}`,
      };
    }
    try {
      r = await t.json();
    } catch {
      return { kind: "error", message: "Execute response was not JSON." };
    }
    let n = N.safeParse(r);
    return n.success && "Transaction submitted" === n.data.message
      ? { kind: "ok", data: n.data }
      : {
          kind: "error",
          message: `Unexpected execute response: ${n.success ? n.data.message : "unparseable"}`,
        };
  }
  e.s(
    [
      "_",
      0,
      18,
      "a",
      0,
      h,
      "q",
      0,
      _,
      "r",
      0,
      m,
      "f",
      0,
      z,
      "M",
      0,
      y,
      "X",
      0,
      k,
      "W",
      0,
      R,
      "i",
      0,
      function (e) {
        let t,
          r = [];
        for (let n of e.transactions)
          n.evm?.to &&
            n.evm.data &&
            (r.push({
              to: n.evm.to,
              value: BigInt(n.evm.value ?? "0"),
              data: n.evm.data,
            }),
            (t = n.relay?.requestId ?? t));
        return 0 !== r.length && t ? { calls: r, requestId: t } : null;
      },
      "E",
      0,
      j,
      "O",
      0,
      O,
      "b",
      0,
      v,
      "s",
      0,
      function (e, t) {
        let { status: r, reason: n } = e,
          { t: a } = t;
        return n === z
          ? a("web.trade.relay_error_region_restricted")
          : n === _
            ? S(t.chainId, a)
            : n && E.has(n)
              ? a("web.trade.relay_error_no_route")
              : "SWAP_IMPACT_TOO_HIGH" === n
                ? a("web.trade.relay_error_impact_too_high")
                : "AMOUNT_TOO_LOW" === n
                  ? a("web.trade.relay_error_amount_too_low")
                  : n && T.has(n)
                    ? a("web.trade.need_sol_for_fees")
                    : n && I.has(n)
                      ? a("web.trade.relay_error_untradable")
                      : 401 === r
                        ? a("web.trade.relay_error_unauthorized")
                        : null != r && (r >= 500 || 429 === r)
                          ? a("web.trade.relay_error_unavailable")
                          : 422 === r
                            ? a("web.trade.relay_error_no_route")
                            : e.message;
      },
      "L",
      0,
      x,
      "j",
      0,
      S,
      "J",
      0,
      w,
      "P",
      0,
      function (e) {
        return e instanceof k && e.reason === _;
      },
      "$",
      0,
      function (e) {
        return e instanceof k && e.reason === z;
      },
      "t",
      0,
      C,
    ],
    460261,
  );
};
