// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(439587);
  e.i(12692);
  var i = e.i(398902),
    a = e.i(167958),
    s = e.i(714549),
    o = e.i(25572),
    l = e.i(356283),
    c = e.i(137123),
    u = e.i(90832),
    d = e.i(894344),
    m = e.i(611546),
    f = e.i(73594);
  let p = (e, t) =>
    "SOL" === t || "USDC" === t
      ? `${(0, u.m)(e, 4)} ${t}`
      : `${(0, u.p)(e, 4)} ${t}`;
  function h(e) {
    return e.settle;
  }
  function y(e) {
    return e.request;
  }
  function b(e) {
    let c,
      h,
      y,
      b,
      g,
      v,
      w,
      x,
      _,
      S,
      j,
      E,
      k,
      C,
      A,
      U,
      q,
      N,
      L,
      O,
      P,
      T,
      D,
      R,
      F,
      $,
      I,
      M,
      z,
      W,
      K,
      Q = (0, r.c)(94),
      { request: B, onSettle: H } = e,
      { t: V } = (0, i.f)(),
      G = (0, s.f)(B.mint, null),
      {
        latest: Y,
        isRefreshing: Z,
        secondsUntilRefresh: X,
      } = (0, m.f)(B.refreshSummary),
      J = Y ?? B.summary,
      ee = J.valueLostPercent <= 5,
      et = J.poolFeeUsd > 0,
      er = Z || 0 === X;
    (Q[0] !== H
      ? ((c = (e) => {
          e || H(null);
        }),
        (Q[0] = H),
        (Q[1] = c))
      : (c = Q[1]),
      Q[2] !== ee || Q[3] !== V
        ? ((h = ee
            ? V("trade.price_impact_override.title_price_check")
            : V("web.trade.high_pool_fee")),
          (Q[2] = ee),
          (Q[3] = V),
          (Q[4] = h))
        : (h = Q[4]),
      Q[5] !== ee ||
      Q[6] !== J.poolFeePercent ||
      Q[7] !== J.receiveSymbol ||
      Q[8] !== J.valueLostUsd ||
      Q[9] !== V
        ? ((y = ee
            ? V("trade.price_impact_override.description_fair_moving")
            : V("web.trade.pool_fee_warning_buy", {
                percent: (0, l.y)(J.poolFeePercent),
                symbol: J.receiveSymbol,
                amount: (0, u.w)(J.valueLostUsd),
              })),
          (Q[5] = ee),
          (Q[6] = J.poolFeePercent),
          (Q[7] = J.receiveSymbol),
          (Q[8] = J.valueLostUsd),
          (Q[9] = V),
          (Q[10] = y))
        : (y = Q[10]),
      Q[11] !== y
        ? ((b = (0, t.jsx)("p", { className: f.c, children: y })),
          (Q[11] = y),
          (Q[12] = b))
        : (b = Q[12]),
      Q[13] === Symbol.for("react.memo_cache_sentinel")
        ? ((g = (0, t.jsx)(a.a, { className: "mt-1" })), (Q[13] = g))
        : (g = Q[13]),
      Q[14] !== V
        ? ((v = V("web.trade.value_paid")), (Q[14] = V), (Q[15] = v))
        : (v = Q[15]),
      Q[16] !== J.paySymbol || Q[17] !== J.payUiAmount
        ? ((w = p(J.payUiAmount, J.paySymbol)),
          (Q[16] = J.paySymbol),
          (Q[17] = J.payUiAmount),
          (Q[18] = w))
        : (w = Q[18]),
      Q[19] !== J.payUsd
        ? ((x = (0, u.w)(J.payUsd)), (Q[19] = J.payUsd), (Q[20] = x))
        : (x = Q[20]));
    let en = `(${x})`;
    (Q[21] !== v || Q[22] !== w || Q[23] !== en
      ? ((_ = (0, t.jsx)(f.F, { label: v, value: w, aside: en })),
        (Q[21] = v),
        (Q[22] = w),
        (Q[23] = en),
        (Q[24] = _))
      : (_ = Q[24]),
      Q[25] !== V
        ? ((S = V("web.trade.youd_receive")), (Q[25] = V), (Q[26] = S))
        : (S = Q[26]),
      Q[27] !== J.receiveSymbol || Q[28] !== J.receiveUiAmount
        ? ((j = p(J.receiveUiAmount, J.receiveSymbol)),
          (Q[27] = J.receiveSymbol),
          (Q[28] = J.receiveUiAmount),
          (Q[29] = j))
        : (j = Q[29]),
      Q[30] !== J.receiveUsdAtSpot
        ? ((E = (0, u.w)(J.receiveUsdAtSpot)),
          (Q[30] = J.receiveUsdAtSpot),
          (Q[31] = E))
        : (E = Q[31]));
    let ei = `(${E})`;
    return (
      Q[32] !== S || Q[33] !== j || Q[34] !== ei
        ? ((k = (0, t.jsx)(f.F, { label: S, value: j, aside: ei })),
          (Q[32] = S),
          (Q[33] = j),
          (Q[34] = ei),
          (Q[35] = k))
        : (k = Q[35]),
      Q[36] !== et ||
      Q[37] !== J.poolFeePercent ||
      Q[38] !== J.poolFeeUsd ||
      Q[39] !== V
        ? ((C =
            et &&
            (0, t.jsx)(f.F, {
              label: V("web.trade.est_pool_fee"),
              value: (0, u.w)(J.poolFeeUsd),
              aside: `(~${(0, l.y)(J.poolFeePercent)})`,
              tone: "loss",
            })),
          (Q[36] = et),
          (Q[37] = J.poolFeePercent),
          (Q[38] = J.poolFeeUsd),
          (Q[39] = V),
          (Q[40] = C))
        : (C = Q[40]),
      Q[41] !== G || Q[42] !== V
        ? ((A =
            G &&
            (0, t.jsx)(f.F, {
              label: V("web.trade.platform_fee"),
              value: (0, o.U)(G.bps),
              "data-testid": "solana-pool-fee-app-fee",
            })),
          (Q[41] = G),
          (Q[42] = V),
          (Q[43] = A))
        : (A = Q[43]),
      Q[44] !== V
        ? ((U = V("web.trade.min_received")), (Q[44] = V), (Q[45] = U))
        : (U = Q[45]),
      Q[46] !== J.minReceiveUiAmount || Q[47] !== J.receiveSymbol
        ? ((q = p(J.minReceiveUiAmount, J.receiveSymbol)),
          (Q[46] = J.minReceiveUiAmount),
          (Q[47] = J.receiveSymbol),
          (Q[48] = q))
        : (q = Q[48]),
      Q[49] !== U || Q[50] !== q
        ? ((N = (0, t.jsx)(f.F, { label: U, value: q })),
          (Q[49] = U),
          (Q[50] = q),
          (Q[51] = N))
        : (N = Q[51]),
      Q[52] !== _ || Q[53] !== k || Q[54] !== C || Q[55] !== A || Q[56] !== N
        ? ((L = (0, t.jsxs)("dl", {
            className: "flex flex-col",
            children: [_, k, C, A, N],
          })),
          (Q[52] = _),
          (Q[53] = k),
          (Q[54] = C),
          (Q[55] = A),
          (Q[56] = N),
          (Q[57] = L))
        : (L = Q[57]),
      Q[58] !== er || Q[59] !== X || Q[60] !== V
        ? ((O = er
            ? V("trade.price_impact_override.live_quote_updating")
            : V("trade.price_impact_override.live_quote", { seconds: X })),
          (Q[58] = er),
          (Q[59] = X),
          (Q[60] = V),
          (Q[61] = O))
        : (O = Q[61]),
      Q[62] !== O
        ? ((P = (0, t.jsx)("p", {
            className: f.L,
            "data-testid": "solana-pool-fee-live-quote",
            children: O,
          })),
          (Q[62] = O),
          (Q[63] = P))
        : (P = Q[63]),
      Q[64] !== L || Q[65] !== P || Q[66] !== b
        ? ((T = (0, t.jsxs)(a.K, {
            className: "flex flex-col gap-2",
            children: [b, g, L, P],
          })),
          (Q[64] = L),
          (Q[65] = P),
          (Q[66] = b),
          (Q[67] = T))
        : (T = Q[67]),
      Q[68] !== V
        ? ((D = V("web.trade.buy_anyway")), (Q[68] = V), (Q[69] = D))
        : (D = Q[69]),
      Q[70] !== V
        ? ((R = (e) => V("web.trade.buying_in_countdown", { seconds: e })),
          (Q[70] = V),
          (Q[71] = R))
        : (R = Q[71]),
      Q[72] !== H || Q[73] !== J
        ? ((F = () => H(J)), (Q[72] = H), (Q[73] = J), (Q[74] = F))
        : (F = Q[74]),
      Q[75] !== D || Q[76] !== R || Q[77] !== F
        ? (($ = (0, t.jsx)(d.f, { idleLabel: D, armedLabel: R, onConfirm: F })),
          (Q[75] = D),
          (Q[76] = R),
          (Q[77] = F),
          (Q[78] = $))
        : ($ = Q[78]),
      Q[79] !== H
        ? ((I = () => H(null)), (Q[79] = H), (Q[80] = I))
        : (I = Q[80]),
      Q[81] !== V
        ? ((M = V("common.cancel")), (Q[81] = V), (Q[82] = M))
        : (M = Q[82]),
      Q[83] !== I || Q[84] !== M
        ? ((z = (0, t.jsx)(n.K, {
            variant: "secondary",
            size: a.Z,
            isFullWidth: !0,
            onClick: I,
            children: M,
          })),
          (Q[83] = I),
          (Q[84] = M),
          (Q[85] = z))
        : (z = Q[85]),
      Q[86] !== $ || Q[87] !== z
        ? ((W = (0, t.jsxs)(a.c, {
            className: "flex-col items-stretch",
            children: [$, z],
          })),
          (Q[86] = $),
          (Q[87] = z),
          (Q[88] = W))
        : (W = Q[88]),
      Q[89] !== c || Q[90] !== h || Q[91] !== T || Q[92] !== W
        ? ((K = (0, t.jsxs)(a.N, {
            open: !0,
            onOpenChange: c,
            density: "terminal",
            size: "sm",
            title: h,
            "data-testid": "solana-pool-fee-dialog",
            children: [T, W],
          })),
          (Q[89] = c),
          (Q[90] = h),
          (Q[91] = T),
          (Q[92] = W),
          (Q[93] = K))
        : (K = Q[93]),
      K
    );
  }
  e.s([
    "SolanaPoolFeeWarningDialog",
    0,
    function () {
      let e,
        n = (0, r.c)(3),
        i = (0, c.Q)(y),
        a = (0, c.Q)(h);
      return i
        ? (n[0] !== i || n[1] !== a
            ? ((e = (0, t.jsx)(b, { request: i, onSettle: a })),
              (n[0] = i),
              (n[1] = a),
              (n[2] = e))
            : (e = n[2]),
          e)
        : null;
    },
  ]);
};
