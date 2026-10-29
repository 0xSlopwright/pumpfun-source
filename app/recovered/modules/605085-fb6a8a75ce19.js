// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(445242);
  t.i(12692);
  var s = t.i(398902),
    i = t.i(526080),
    n = t.i(902627),
    a = t.i(778396);
  let l = (t) => {
    if (null == t || "" === t.trim()) return null;
    let e = Number(t);
    return Number.isFinite(e) ? e : null;
  };
  function u({ quote: t, direction: e, spotReference: s, nowMs: i }) {
    let n = (0, a.q)(t, { direction: e, spotReference: s, nowMs: i }),
      r = l(t.fromAmountUsd),
      m = l(t.toAmountUsd);
    return "relay_usd" === n.impactSource &&
      (null === m || 0 === m) &&
      null !== r &&
      r > 0
      ? { fromAmountUsd: null, toAmountUsd: null, impactPercent: null }
      : {
          fromAmountUsd: n.fromAmountUsd,
          toAmountUsd: n.toAmountUsd,
          impactPercent: n.impactPercent,
        };
  }
  t.s(["f", 0, u], 544380);
  var r = t.i(460261);
  let m = (t) => {
      if (void 0 === t) return null;
      try {
        let e = BigInt(t);
        return e < BigInt(0) ? null : e;
      } catch {
        return null;
      }
    },
    o = (t) => (null !== t && t > 0 ? t : null),
    c = ({
      preview: t,
      direction: e,
      chainId: s,
      outputSymbol: a,
      outputDecimals: l,
      tokenDecimals: c,
      coin: d,
      slippageBps: h,
      spotReference: p,
      nowMs: b,
      regionRestricted: f,
      assetRefused: g,
      t: v,
    }) => {
      let { quote: k } = t,
        _ = null === k ? null : m(k.toAmount),
        j = null;
      if (null !== k && null !== _) {
        let s = u({ quote: k, direction: e, spotReference: p, nowMs: b });
        j = {
          outputAtomic: _,
          outputDecimals: l,
          outputSymbol: a.replace(/^\$/, ""),
          minOutputAtomic: m(k.toAmountMin),
          inputUsd: o(s.fromAmountUsd),
          outputUsd: o(s.toAmountUsd),
          impactPercent: s.impactPercent,
          bindingSlippageBps: (0, n.U)(k) ? (0, n.N)(h) : h,
          supplySharePercent: (({
            tokenAtomic: t,
            tokenDecimals: e,
            coin: s,
          }) => {
            let n = (0, i.u)(s) ? (0, i.B)({ ...s, base_decimals: e }) : 0;
            if (n <= 0 || null === t) return null;
            let a = Number(t) / 10 ** e;
            return a > 0 ? (a / n) * 100 : null;
          })({
            tokenAtomic: "buy" === e ? _ : m(k.fromAmount),
            tokenDecimals: c,
            coin: d,
          }),
          networkCost: null,
          venue: t.venue,
        };
      }
      let y = f
        ? { message: v("web.trade.relay_error_region_restricted"), reason: r.f }
        : g
          ? { message: (0, r.j)(s, v), reason: r.q }
          : { message: t.errorMessage, reason: t.errorReason };
      return {
        quote: j,
        quoteSource: t.quoteSource,
        isFetching: t.isFetching,
        isInputSettled: t.isInputSettled,
        errorMessage: y.message,
        errorReason: y.reason,
        quoteSyncedAt: t.quoteSyncedAt,
        refreshMs: t.refreshMs,
      };
    };
  t.s(
    [
      "m",
      0,
      c,
      "n",
      0,
      (t) => {
        let i,
          n = (0, e.c)(3),
          { t: a } = (0, s.f)();
        return (
          n[0] !== t || n[1] !== a
            ? ((i = c({ ...t, t: a })), (n[0] = t), (n[1] = a), (n[2] = i))
            : (i = n[2]),
          i
        );
      },
    ],
    605085,
  );
};
