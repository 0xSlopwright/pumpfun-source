// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(445242),
    s = t.i(574472),
    i = t.i(690877),
    n = t.i(352386);
  t.i(12692);
  var a = t.i(398902),
    l = t.i(536925),
    u = t.i(593293),
    r = t.i(896342),
    m = t.i(895492),
    o = t.i(474294);
  let c = (t) => [
      t.solanaWallet,
      t.evmWallet.toLowerCase(),
      t.chainId,
      t.mint.toLowerCase(),
    ],
    d = (t) => JSON.stringify(c(t)),
    h = (t) =>
      JSON.stringify([
        ...c(t),
        (0, m.S)(t.slippageBps),
        t.funding.kind,
        "usdc" === t.funding.kind ? t.funding.amountIn : t.funding.lamports,
        ...(t.calloutUser ? [t.calloutUser] : []),
      ]),
    p = (t, e) =>
      null !== t.solPriceUsd &&
      t.solPriceUsd > 0 &&
      null != e &&
      e > 0 &&
      1e4 * Math.abs(e / t.solPriceUsd - 1) > 50,
    b = (t, e = Date.now()) => e - t.createdAt > 4e4,
    f = new Map(),
    g = new Set(),
    v = () => {
      for (let t of g) t();
    },
    k = (t) => (
      g.add(t),
      () => {
        g.delete(t);
      }
    ),
    _ = (t) => {
      let e = f.get(t);
      return void 0 !== e && (f.delete(t), e.consumed || e.feed?.close(), !0);
    },
    j = (t, e) =>
      e.consumed !== t.consumed ? !t.consumed : t.signedAt > e.signedAt,
    y = (t) => {
      let e = null;
      for (let s of f.values())
        s.key === t && (null === e || j(s, e)) && (e = s);
      return e;
    },
    w = (t) => {
      for (let [e, s] of f) if (s.created.intent_id === t) return [e, s];
    },
    P = (t) => {
      let e = w(t);
      void 0 !== e && (_(e[0]), v());
    };
  t.s(
    [
      "h",
      0,
      ({ identity: t, solPriceUsd: e, asyncQuote: s = !0 }) => {
        let i = (0, m.k)({
          solanaWallet: t.solanaWallet,
          evmWallet: t.evmWallet,
          chainId: t.chainId,
          mint: t.mint,
          paymentAsset: t.funding.kind,
          atomicAmount: BigInt(
            "usdc" === t.funding.kind ? t.funding.amountIn : t.funding.lamports,
          ),
          solPriceUsd: e,
          slippageBps: t.slippageBps,
          calloutUser: t.calloutUser,
        });
        return null === i ? null : { ...i, async_quote: s };
      },
      "n",
      0,
      h,
      "w",
      0,
      (t) => {
        let e = w(t);
        void 0 !== e && (e[1].consumed = !0);
      },
      "o",
      0,
      P,
      "c",
      0,
      (t) => {
        let e = !1;
        for (let [s, i] of f) i.identity.solanaWallet === t && (_(s), (e = !0));
        e && v();
      },
      "m",
      0,
      y,
      "b",
      0,
      b,
      "R",
      0,
      (t, { spotUsdPrice: e, solPriceUsd: s, now: i = Date.now() } = {}) => {
        let n,
          a = ((t) => {
            try {
              let e = JSON.parse(t);
              return Array.isArray(e) && e.length > 4
                ? JSON.stringify(e.slice(0, 4))
                : null;
            } catch {
              return null;
            }
          })(t),
          l = !1;
        for (let e of f.values())
          d(e.identity) === a &&
            ((l = !0), e.key === t && (void 0 === n || j(e, n)) && (n = e));
        return l
          ? void 0 === n
            ? { miss: "key" }
            : n.consumed
              ? { miss: "consumed" }
              : b(n, i)
                ? { miss: "expired" }
                : (0, o.r)(n, e)
                  ? { miss: "price" }
                  : p(n, s)
                    ? { miss: "sol_price" }
                    : ((n.consumed = !0), { hit: n })
          : { miss: "none" };
      },
      "_",
      0,
      (t) => {
        let e = w(t);
        return void 0 !== e && ((e[1].consumed = !1), !0);
      },
      "T",
      0,
      (t, e) => {
        "failed" === e.status
          ? P(t.created.intent_id)
          : ((t.created = {
              ...t.created,
              quote: {
                ...t.created.quote,
                quote_status: "ready",
                expected_out: e.expectedOut,
                min_out: e.minOut,
                ...(void 0 === e.slippageBps
                  ? {}
                  : { slippage_bps: e.slippageBps }),
              },
            }),
            (t.quoteStatus = "ready"),
            void 0 !== w(t.created.intent_id) && v());
      },
      "D",
      0,
      p,
      "p",
      0,
      (t) => {
        let e = `${d(t.identity)}|${t.lane}`,
          s = f.get(e);
        for (
          void 0 !== s && s !== t && _(e), f.delete(e), f.set(e, t);
          f.size > 4;

        ) {
          let t = f.keys().next().value;
          if (void 0 === t) break;
          _(t);
        }
        v();
      },
      "C",
      0,
      k,
    ],
    769953,
  );
  var q = t.i(969673);
  let A = "bridge",
    x = BigInt(0),
    S = BigInt(1e4),
    z = (t) => Math.max(1e3, t),
    I = (t) => t?.provider === A,
    U = (t) => {
      try {
        let e = BigInt(t);
        return e >= x ? e : null;
      } catch {
        return null;
      }
    },
    B = (t) => BigInt(Math.max(0, Math.round(t))),
    M = ({ direction: t, atomicAmount: e, solanaAsset: s, solUsdPrice: i }) => {
      if (e <= x) return null;
      if ("sell" === t) return "usdc" === s ? e.toString() : null;
      if ("usdc" === s) return e.toString();
      let n = (0, q.G)({ lamports: e, solPriceUsd: i });
      return "0" === n ? null : n;
    },
    N = ({ quote: t, direction: e, atomicAmount: s, slippageBps: i }) => {
      let n = U(t.expected_out);
      if (null === n || n === x) return null;
      let a = (n * (S - BigInt(z(i)))) / S,
        l = Date.parse(t.expires_at),
        u = {
          fromAmount: s.toString(),
          transactions: [],
          provider: A,
          expiresAt: Number.isFinite(l) ? l : void 0,
        };
      if ("sell" === e) {
        if (!t.covers_skim) return null;
        let e = U(t.payout);
        if (null === e || e === x) return null;
        let s = B(t.skim),
          i = a > s ? a - s : x;
        return {
          ...u,
          toAmount: e.toString(),
          toAmountMin: i.toString(),
          fees: { gas: s.toString(), total: s.toString() },
        };
      }
      let r = B(t.fee);
      return {
        ...u,
        toAmount: n.toString(),
        toAmountMin: a.toString(),
        fees: { gas: r.toString(), total: r.toString() },
      };
    };
  t.s(["D", 0, A, "v", 0, M, "N", 0, z, "U", 0, I, "u", 0, N], 902627);
  let F = BigInt(0),
    D = BigInt(1e4),
    C = (t) => {
      if (null == t) return null;
      try {
        let e = BigInt(t);
        return e > F ? e : null;
      } catch {
        return null;
      }
    },
    T = (t) => BigInt(Math.max(0, Math.round(t))),
    E = (t) => {
      let e = Date.parse(t);
      return Number.isFinite(e) ? e : void 0;
    };
  var O = t.i(337749),
    W = t.i(170356),
    L = t.i(51121),
    R = t.i(526317),
    $ = t.i(541710),
    K = t.i(299092),
    Q = t.i(399015),
    G = t.i(460261),
    X = t.i(613677),
    H = t.i(342463),
    J = t.i(297865),
    Z = t.i(637782),
    V = t.i(417326),
    Y = t.i(342652);
  let tt = X.z.object({
      to_amount: H.z.string(),
      to_amount_min: H.z.string(),
      fees: X.z.object({
        gas: H.z.string(),
        protocol: H.z.string(),
        total: H.z.string(),
      }),
      from_amount_usd: H.z.string().nullish(),
      to_amount_usd: H.z.string().nullish(),
      total_impact_usd: H.z.string().nullish(),
      total_impact_percent: H.z.string().nullish(),
      swap_impact_usd: H.z.string().nullish(),
      swap_impact_percent: H.z.string().nullish(),
      disable_swap_provider_preference: J.z.boolean(),
      ttl_seconds: Z.z.number(),
      expires_at: Z.z.number(),
      sponsored: J.z.boolean(),
      venue: V.z.literal("relay"),
    }),
    te = X.z.object({
      error: H.z.string().optional(),
      data: X.z.object({ reason: H.z.string().optional() }).optional(),
    });
  async function ts(t) {
    let e,
      s,
      i = (s = (0, G.L)(t.chainId))
        ? {
            user: t.solanaWalletAddress,
            evm_chain: s,
            to_token: t.mint,
            amount: t.atomicAmount.toString(),
            denomination: (t.solanaAsset ?? "sol") === "usdc" ? "usd" : "sol",
            recipient_evm: t.evmWalletAddress,
            slippage_bps: t.slippageBps,
            disable_swap_provider_preference: !0,
            ...("buy" === t.direction && t.calloutUser
              ? { callout_user: t.calloutUser }
              : {}),
          }
        : null;
    if (!i)
      return {
        kind: "error",
        reason: "UNSUPPORTED_CHAIN",
        message: "This chain isn't supported for cross-chain trading yet.",
      };
    try {
      e = await (0, Y.b)("transactions/relay-buy-preview", i, {
        retryLimit: 0,
      });
    } catch {
      return { kind: "error", message: "Network error fetching quote." };
    }
    if (e.status < 200 || e.status >= 300) {
      let t = te.safeParse(e.body),
        s = t.success ? t.data : void 0;
      return {
        kind: "error",
        status: e.status,
        reason: s?.data?.reason,
        message: s?.error ?? `Quote failed (${e.status})`,
      };
    }
    let n = tt.safeParse(e.body);
    return n.success
      ? {
          kind: "ok",
          data: {
            fromAmount: i.amount,
            toAmount: n.data.to_amount,
            toAmountMin: n.data.to_amount_min,
            exchangeRate: "",
            fees: n.data.fees,
            transactions: [],
            provider: n.data.venue,
            expiresAt: n.data.expires_at,
            quoteId: "",
            fromAmountUsd: n.data.from_amount_usd ?? void 0,
            toAmountUsd: n.data.to_amount_usd ?? void 0,
            totalImpactUsd: n.data.total_impact_usd ?? void 0,
            totalImpactPercent: n.data.total_impact_percent ?? void 0,
            swapImpactUsd: n.data.swap_impact_usd ?? void 0,
            swapImpactPercent: n.data.swap_impact_percent ?? void 0,
          },
        }
      : {
          kind: "error",
          reason: "QUOTE_PARSE_FAILED",
          message: "Unexpected quote shape.",
        };
  }
  t.s(["f", 0, ts], 396364);
  let ti = BigInt(0),
    tn = (t) => {
      let e = k(t),
        s = (0, o.B)(t);
      return () => {
        (e(), s());
      };
    },
    ta = () => null,
    tl = async ({
      request: t,
      chainId: e,
      solUsdPrice: s,
      t: i,
      signal: n,
    }) => {
      let a,
        l = M({
          direction: t.direction,
          atomicAmount: t.atomicAmount,
          solanaAsset: t.solanaAsset ?? "sol",
          solUsdPrice: s,
        });
      if (null === l) return null;
      let u = { mint: t.mint, chainId: e, direction: t.direction };
      if ((0, O.F)(u)) return null;
      try {
        a = await (0, r.o)(
          {
            direction: t.direction,
            evm_chain_id: e,
            evm_token: t.mint,
            amount_in: l,
          },
          { signal: n },
        );
      } catch (t) {
        if (!(0, R.v)(t)) throw t;
        if (t.code === R.s)
          throw new G.X(i("web.trade.relay_error_region_restricted"), {
            reason: G.f,
            status: t.status,
          });
        return ((0, O.L)({ ...u, code: t.code, status: t.status }), null);
      }
      return N({
        quote: a,
        direction: t.direction,
        atomicAmount: t.atomicAmount,
        slippageBps: t.slippageBps,
      });
    };
  function tu() {
    return Date.now();
  }
  t.s(
    [
      "f",
      0,
      function (t) {
        let m,
          c,
          d,
          f,
          g,
          v,
          k,
          _,
          j = (0, e.c)(50),
          { t: w } = (0, a.f)(),
          {
            mint: P,
            chainId: q,
            direction: x,
            atomicAmount: S,
            calloutUser: U,
            solanaAsset: B,
            solanaWalletAddress: M,
            evmWalletAddress: N,
            slippageBps: O,
            solUsdPrice: R,
            spotUsdPrice: X,
            enabled: H,
            pausePreview: J,
            inputDebounceMs: Z,
          } = t,
          V = void 0 === B ? "sol" : B,
          Y = void 0 === H || H,
          tt = void 0 === Z ? 250 : Z,
          { userId: te } = (0, s.F)(),
          tr = "buy" === x ? U : void 0,
          tm = (0, $.l)(),
          to = (0, G.b)(q),
          tc = (0, u.G)({ chainId: to, mint: P }),
          td =
            (0, r._)() &&
            null !== to &&
            (0, W.X)(to, tm) &&
            !(0, Q.G)(P) &&
            !tc &&
            !!te &&
            !!M,
          th =
            Y &&
            td &&
            null !== to &&
            "string" == typeof M &&
            "string" == typeof N &&
            null !== S &&
            S > ti
              ? (({
                  direction: t,
                  mint: e,
                  chainId: s,
                  solanaWallet: i,
                  evmWallet: n,
                  atomicAmount: a,
                  solanaAsset: l,
                  slippageBps: u,
                  calloutUser: r,
                }) => {
                  if ("sell" === t)
                    return (0, o.n)(
                      (0, L.C)({
                        solanaWallet: i,
                        evmWallet: n,
                        chainId: s,
                        mint: e,
                        amountAtomic: a,
                        slippageBps: u,
                        payoutDenomination: (0, L._)(l),
                      }),
                    );
                  let m = (0, K.I)({ paymentAsset: l, atomicAmount: a });
                  return null === m
                    ? null
                    : h({
                        solanaWallet: i,
                        evmWallet: n,
                        chainId: s,
                        mint: e,
                        slippageBps: u,
                        funding: m,
                        ...(r ? { calloutUser: r } : {}),
                      });
                })({
                  direction: x,
                  mint: P,
                  chainId: to,
                  solanaWallet: M,
                  evmWallet: N,
                  atomicAmount: S,
                  solanaAsset: V,
                  slippageBps: O,
                  calloutUser: tr,
                })
              : null;
        j[0] !== x || j[1] !== th
          ? ((m = () =>
              ((t, e) => {
                if (null === e) return null;
                if ("buy" === t) {
                  let t = y(e);
                  return null === t
                    ? null
                    : `${t.created.intent_id}|${t.createdAt}|${t.quoteStatus}|${t.consumed}`;
                }
                let s = (0, o.Q)(e);
                return null === s
                  ? null
                  : `${s.created.intent_id}|${s.signedAt}|${s.consumed}`;
              })(x, th)),
            (j[0] = x),
            (j[1] = th),
            (j[2] = m))
          : (m = j[2]);
        let tp = (0, n.useSyncExternalStore)(tn, m, ta),
          [tb, tf] = (0, n.useState)(tu),
          [tg, tv] = (0, n.useState)(tp);
        (tg !== tp && (tv(tp), tf(Date.now())),
          j[3] !== tp
            ? ((c = () => {
                if (null === tp) return;
                let t = setInterval(() => tf(Date.now()), 5e3);
                return () => clearInterval(t);
              }),
              (d = [tp]),
              (j[3] = tp),
              (j[4] = c),
              (j[5] = d))
            : ((c = j[4]), (d = j[5])),
          (0, n.useEffect)(c, d));
        let tk =
          null === th || null === tp
            ? null
            : "buy" === x
              ? ((
                  t,
                  { now: e = Date.now(), spotUsdPrice: s, solPriceUsd: i } = {},
                ) => {
                  if (
                    null === t ||
                    "ready" !== t.quoteStatus ||
                    b(t, e) ||
                    (0, o.r)(t, s) ||
                    p(t, i)
                  )
                    return null;
                  let { quote: n } = t.created,
                    a = C(n.expected_out);
                  if (null === a) return null;
                  let l = BigInt(z(t.identity.slippageBps)),
                    u = C(n.min_out) ?? (a * (D - l)) / D,
                    r = T(n.fee),
                    { funding: m } = t.identity;
                  return {
                    quote: {
                      fromAmount: "usdc" === m.kind ? m.amountIn : m.lamports,
                      toAmount: a.toString(),
                      toAmountMin: u.toString(),
                      transactions: [],
                      provider: A,
                      expiresAt: E(n.expires_at),
                      fees: { gas: r.toString(), total: r.toString() },
                    },
                    quotedAt: t.createdAt,
                    source: "presign",
                  };
                })(y(th), { now: tb, spotUsdPrice: X, solPriceUsd: R })
              : ((t, { now: e = Date.now(), spotUsdPrice: s } = {}) => {
                  if (
                    null === t ||
                    "sol" === t.request.payout_denomination ||
                    (0, o.q)(t, e) ||
                    (0, o.s)(t, e) ||
                    (0, o.r)(t, s)
                  )
                    return null;
                  let { quote: i } = t.created,
                    n = C(i.expected_out);
                  if (null === n) return null;
                  let a = T(i.skim),
                    l = n - a;
                  if (l <= F) return null;
                  let u = C(i.min_out) ?? F,
                    r = u > a ? u - a : F;
                  return {
                    quote: {
                      fromAmount: t.request.amount_in,
                      toAmount: l.toString(),
                      toAmountMin: r.toString(),
                      transactions: [],
                      provider: A,
                      expiresAt: E(i.expires_at),
                      fees: { gas: a.toString(), total: a.toString() },
                    },
                    quotedAt: t.signedAt,
                    source: "presign",
                  };
                })((0, o.Q)(th), { now: tb, spotUsdPrice: X });
        j[6] !== S
          ? ((f = null === S ? null : S.toString()), (j[6] = S), (j[7] = f))
          : (f = j[7]);
        let t_ = f,
          [tj] = (0, l.r)(t_, tt),
          ty = 0 === tt ? t_ : tj,
          tw = t_ === ty,
          tP = !!(Y && P && q && M && N && ty && "0" !== ty);
        (j[8] !== td ||
        j[9] !== tr ||
        j[10] !== q ||
        j[11] !== x ||
        j[12] !== N ||
        j[13] !== P ||
        j[14] !== ty ||
        j[15] !== O ||
        j[16] !== V ||
        j[17] !== M
          ? ((g = ["relayQuotePreview", P, q, x, ty, V, M, N, O, td, tr]),
            (j[8] = td),
            (j[9] = tr),
            (j[10] = q),
            (j[11] = x),
            (j[12] = N),
            (j[13] = P),
            (j[14] = ty),
            (j[15] = O),
            (j[16] = V),
            (j[17] = M),
            (j[18] = g))
          : (g = j[18]),
          j[19] !== td ||
          j[20] !== tr ||
          j[21] !== tm ||
          j[22] !== q ||
          j[23] !== x ||
          j[24] !== N ||
          j[25] !== P ||
          j[26] !== to ||
          j[27] !== ty ||
          j[28] !== O ||
          j[29] !== R ||
          j[30] !== V ||
          j[31] !== M ||
          j[32] !== w ||
          j[33] !== te
            ? ((v = async (t) => {
                let { signal: e } = t,
                  s = {
                    direction: x,
                    mint: P,
                    solanaAsset: V,
                    chainId: q,
                    atomicAmount: BigInt(ty),
                    solanaWalletAddress: M,
                    evmWalletAddress: N,
                    slippageBps: O,
                    ...(tr ? { calloutUser: tr } : {}),
                  };
                if (td && null !== to) {
                  let t = await tl({
                    request: s,
                    chainId: to,
                    solUsdPrice: R,
                    t: w,
                    signal: e,
                  });
                  if (t) return t;
                }
                let i = (0, W.c)({
                  chainId: to,
                  userId: te,
                  mint: s.mint,
                  direction: s.direction,
                  gateCode: M ? void 0 : "solana_wallet_missing",
                  exposure: tm,
                });
                if (i) throw (0, W.b)(i, w);
                let n = "buy" === x ? await ts(s) : await (0, G.E)(s);
                if ("error" === n.kind)
                  throw new G.X((0, G.s)(n, { chainId: q, t: w }), {
                    reason: n.reason,
                    status: n.status,
                  });
                return n.data;
              }),
              (j[19] = td),
              (j[20] = tr),
              (j[21] = tm),
              (j[22] = q),
              (j[23] = x),
              (j[24] = N),
              (j[25] = P),
              (j[26] = to),
              (j[27] = ty),
              (j[28] = O),
              (j[29] = R),
              (j[30] = V),
              (j[31] = M),
              (j[32] = w),
              (j[33] = te),
              (j[34] = v))
            : (v = j[34]));
        let tq = !!tw && !(void 0 !== J && J) && 12e3;
        j[35] !== tP || j[36] !== tq || j[37] !== g || j[38] !== v
          ? ((k = {
              queryKey: g,
              queryFn: v,
              enabled: tP,
              retry: !1,
              refetchInterval: tq,
              staleTime: 0,
              gcTime: 3e4,
            }),
            (j[35] = tP),
            (j[36] = tq),
            (j[37] = g),
            (j[38] = v),
            (j[39] = k))
          : (k = j[39]);
        let tA = (0, i.useQuery)(k),
          tx =
            tP && void 0 !== tA.data && null !== tA.data
              ? { quote: tA.data, quotedAt: tA.dataUpdatedAt, source: "fetch" }
              : null,
          tS = tw
            ? ((...t) => {
                let e = null;
                for (let s of t)
                  null !== s &&
                    (null === e || s.quotedAt > e.quotedAt) &&
                    (e = s);
                return e;
              })(tk, tx)
            : (tk ?? tx),
          tz = tS?.source === "presign",
          tI = null === tS ? null : tS.quote,
          tU = null === tS ? null : tS.source,
          tB =
            null === tS
              ? null
              : I(tS.quote)
                ? "bridge"
                : "buy" === x
                  ? "bapi"
                  : "relay",
          tM = !tz && tA.isFetching,
          tN = !tz && tP && tA.error instanceof Error ? tA.error.message : null,
          tF = tP && tA.error instanceof G.X ? (tA.error.reason ?? null) : null,
          tD = Math.max(tA.dataUpdatedAt, tA.errorUpdatedAt),
          tC = tS?.source === "fetch" ? 12e3 : null;
        return (
          j[40] !== tw ||
          j[41] !== tI ||
          j[42] !== tU ||
          j[43] !== tB ||
          j[44] !== tM ||
          j[45] !== tN ||
          j[46] !== tF ||
          j[47] !== tD ||
          j[48] !== tC
            ? ((_ = {
                quote: tI,
                quoteSource: tU,
                venue: tB,
                isFetching: tM,
                isInputSettled: tw,
                errorMessage: tN,
                errorReason: tF,
                quoteSyncedAt: tD,
                refreshMs: tC,
              }),
              (j[40] = tw),
              (j[41] = tI),
              (j[42] = tU),
              (j[43] = tB),
              (j[44] = tM),
              (j[45] = tN),
              (j[46] = tF),
              (j[47] = tD),
              (j[48] = tC),
              (j[49] = _))
            : (_ = j[49]),
          _
        );
      },
    ],
    331043,
  );
};
