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
    l = e.i(865259),
    c = e.i(946550),
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
      Q,
      B,
      H,
      V,
      G,
      Y,
      Z,
      X,
      J,
      ee,
      et,
      er = (0, r.c)(118),
      { request: en, onSettle: ei } = e,
      { t: ea } = (0, i.f)(),
      es = (0, s.f)(en.mint, null),
      {
        latest: eo,
        isRefreshing: el,
        secondsUntilRefresh: ec,
      } = (0, m.f)(en.refreshSummary),
      eu = eo ?? en.summary,
      ed = "buy" === eu.tradeDirection;
    return (
      er[0] !== ed ||
      er[1] !== el ||
      er[2] !== ei ||
      er[3] !== ec ||
      er[4] !== eu.paySymbol ||
      er[5] !== eu.receiveSymbol ||
      er[6] !== eu.receiveUiAmount ||
      er[7] !== eu.transferFeeBps ||
      er[8] !== ea
        ? ((b = (0, l.f)(eu.transferFeeBps)),
          (g = p(eu.receiveUiAmount, eu.receiveSymbol)),
          (y = el || 0 === ec),
          (h = a.N),
          (_ = !0),
          er[23] !== ei
            ? ((S = (e) => {
                e || ei(null);
              }),
              (er[23] = ei),
              (er[24] = S))
            : (S = er[24]),
          (j = "terminal"),
          (E = "sm"),
          er[25] !== ea
            ? ((k = ea("web.trade.high_transfer_tax")),
              (er[25] = ea),
              (er[26] = k))
            : (k = er[26]),
          (C = "solana-transfer-tax-dialog"),
          (c = a.K),
          (x = "flex flex-col gap-2"),
          (v = f.c),
          (w = ed
            ? ea("web.trade.transfer_tax_warning_buy", {
                symbol: eu.receiveSymbol,
                percent: b,
                receive: g,
              })
            : ea("web.trade.transfer_tax_warning_sell", {
                symbol: eu.paySymbol,
                percent: b,
                receive: g,
              })),
          (er[0] = ed),
          (er[1] = el),
          (er[2] = ei),
          (er[3] = ec),
          (er[4] = eu.paySymbol),
          (er[5] = eu.receiveSymbol),
          (er[6] = eu.receiveUiAmount),
          (er[7] = eu.transferFeeBps),
          (er[8] = ea),
          (er[9] = c),
          (er[10] = h),
          (er[11] = y),
          (er[12] = b),
          (er[13] = g),
          (er[14] = v),
          (er[15] = w),
          (er[16] = x),
          (er[17] = _),
          (er[18] = S),
          (er[19] = j),
          (er[20] = E),
          (er[21] = k),
          (er[22] = C))
        : ((c = er[9]),
          (h = er[10]),
          (y = er[11]),
          (b = er[12]),
          (g = er[13]),
          (v = er[14]),
          (w = er[15]),
          (x = er[16]),
          (_ = er[17]),
          (S = er[18]),
          (j = er[19]),
          (E = er[20]),
          (k = er[21]),
          (C = er[22])),
      er[27] !== v || er[28] !== w
        ? ((A = (0, t.jsx)("p", { className: v, children: w })),
          (er[27] = v),
          (er[28] = w),
          (er[29] = A))
        : (A = er[29]),
      er[30] === Symbol.for("react.memo_cache_sentinel")
        ? ((U = (0, t.jsx)(a.a, { className: "mt-1" })), (er[30] = U))
        : (U = er[30]),
      er[31] !== ed || er[32] !== ea
        ? ((q = ed ? ea("web.trade.value_paid") : ea("web.trade.value_sold")),
          (er[31] = ed),
          (er[32] = ea),
          (er[33] = q))
        : (q = er[33]),
      er[34] !== eu.paySymbol || er[35] !== eu.payUiAmount
        ? ((N = p(eu.payUiAmount, eu.paySymbol)),
          (er[34] = eu.paySymbol),
          (er[35] = eu.payUiAmount),
          (er[36] = N))
        : (N = er[36]),
      er[37] !== eu.payUsd
        ? ((L = null !== eu.payUsd ? `(${(0, u.w)(eu.payUsd)})` : void 0),
          (er[37] = eu.payUsd),
          (er[38] = L))
        : (L = er[38]),
      er[39] !== q || er[40] !== N || er[41] !== L
        ? ((O = (0, t.jsx)(f.F, { label: q, value: N, aside: L })),
          (er[39] = q),
          (er[40] = N),
          (er[41] = L),
          (er[42] = O))
        : (O = er[42]),
      er[43] !== ea
        ? ((P = ea("web.trade.youd_receive_after_tax")),
          (er[43] = ea),
          (er[44] = P))
        : (P = er[44]),
      er[45] !== eu.receiveUsd
        ? ((T =
            null !== eu.receiveUsd ? `(${(0, u.w)(eu.receiveUsd)})` : void 0),
          (er[45] = eu.receiveUsd),
          (er[46] = T))
        : (T = er[46]),
      er[47] !== g || er[48] !== P || er[49] !== T
        ? ((D = (0, t.jsx)(f.F, { label: P, value: g, aside: T })),
          (er[47] = g),
          (er[48] = P),
          (er[49] = T),
          (er[50] = D))
        : (D = er[50]),
      er[51] !== ea
        ? ((R = ea("web.trade.transfer_tax")), (er[51] = ea), (er[52] = R))
        : (R = er[52]),
      er[53] !== b || er[54] !== R
        ? ((F = (0, t.jsx)(f.F, { label: R, value: b, tone: "loss" })),
          (er[53] = b),
          (er[54] = R),
          (er[55] = F))
        : (F = er[55]),
      er[56] !== es || er[57] !== ea
        ? (($ =
            es &&
            (0, t.jsx)(f.F, {
              label: ea("web.trade.platform_fee"),
              value: (0, o.U)(es.bps),
              "data-testid": "solana-transfer-tax-app-fee",
            })),
          (er[56] = es),
          (er[57] = ea),
          (er[58] = $))
        : ($ = er[58]),
      er[59] !== ea
        ? ((I = ea("web.trade.min_received")), (er[59] = ea), (er[60] = I))
        : (I = er[60]),
      er[61] !== eu.minReceiveUiAmount || er[62] !== eu.receiveSymbol
        ? ((M = p(eu.minReceiveUiAmount, eu.receiveSymbol)),
          (er[61] = eu.minReceiveUiAmount),
          (er[62] = eu.receiveSymbol),
          (er[63] = M))
        : (M = er[63]),
      er[64] !== I || er[65] !== M
        ? ((z = (0, t.jsx)(f.F, { label: I, value: M })),
          (er[64] = I),
          (er[65] = M),
          (er[66] = z))
        : (z = er[66]),
      er[67] !== O ||
      er[68] !== D ||
      er[69] !== F ||
      er[70] !== $ ||
      er[71] !== z
        ? ((W = (0, t.jsxs)("dl", {
            className: "flex flex-col",
            children: [O, D, F, $, z],
          })),
          (er[67] = O),
          (er[68] = D),
          (er[69] = F),
          (er[70] = $),
          (er[71] = z),
          (er[72] = W))
        : (W = er[72]),
      er[73] !== y || er[74] !== ec || er[75] !== ea
        ? ((K = y
            ? ea("trade.price_impact_override.live_quote_updating")
            : ea("trade.price_impact_override.live_quote", { seconds: ec })),
          (er[73] = y),
          (er[74] = ec),
          (er[75] = ea),
          (er[76] = K))
        : (K = er[76]),
      er[77] !== K
        ? ((Q = (0, t.jsx)("p", {
            className: f.L,
            "data-testid": "solana-transfer-tax-live-quote",
            children: K,
          })),
          (er[77] = K),
          (er[78] = Q))
        : (Q = er[78]),
      er[79] !== c ||
      er[80] !== A ||
      er[81] !== W ||
      er[82] !== Q ||
      er[83] !== x
        ? ((B = (0, t.jsxs)(c, { className: x, children: [A, U, W, Q] })),
          (er[79] = c),
          (er[80] = A),
          (er[81] = W),
          (er[82] = Q),
          (er[83] = x),
          (er[84] = B))
        : (B = er[84]),
      er[85] !== ed || er[86] !== ea
        ? ((H = ed ? ea("web.trade.buy_anyway") : ea("web.trade.sell_anyway")),
          (er[85] = ed),
          (er[86] = ea),
          (er[87] = H))
        : (H = er[87]),
      er[88] !== ed || er[89] !== ea
        ? ((V = (e) =>
            ed
              ? ea("web.trade.buying_in_countdown", { seconds: e })
              : ea("web.trade.selling_in_countdown", { seconds: e })),
          (er[88] = ed),
          (er[89] = ea),
          (er[90] = V))
        : (V = er[90]),
      er[91] !== ei || er[92] !== eu
        ? ((G = () => ei(eu)), (er[91] = ei), (er[92] = eu), (er[93] = G))
        : (G = er[93]),
      er[94] !== H || er[95] !== V || er[96] !== G
        ? ((Y = (0, t.jsx)(d.f, { idleLabel: H, armedLabel: V, onConfirm: G })),
          (er[94] = H),
          (er[95] = V),
          (er[96] = G),
          (er[97] = Y))
        : (Y = er[97]),
      er[98] !== ei
        ? ((Z = () => ei(null)), (er[98] = ei), (er[99] = Z))
        : (Z = er[99]),
      er[100] !== ea
        ? ((X = ea("common.cancel")), (er[100] = ea), (er[101] = X))
        : (X = er[101]),
      er[102] !== Z || er[103] !== X
        ? ((J = (0, t.jsx)(n.K, {
            variant: "secondary",
            size: a.Z,
            isFullWidth: !0,
            onClick: Z,
            children: X,
          })),
          (er[102] = Z),
          (er[103] = X),
          (er[104] = J))
        : (J = er[104]),
      er[105] !== Y || er[106] !== J
        ? ((ee = (0, t.jsxs)(a.c, {
            className: "flex-col items-stretch",
            children: [Y, J],
          })),
          (er[105] = Y),
          (er[106] = J),
          (er[107] = ee))
        : (ee = er[107]),
      er[108] !== h ||
      er[109] !== B ||
      er[110] !== ee ||
      er[111] !== _ ||
      er[112] !== S ||
      er[113] !== j ||
      er[114] !== E ||
      er[115] !== k ||
      er[116] !== C
        ? ((et = (0, t.jsxs)(h, {
            open: _,
            onOpenChange: S,
            density: j,
            size: E,
            title: k,
            "data-testid": C,
            children: [B, ee],
          })),
          (er[108] = h),
          (er[109] = B),
          (er[110] = ee),
          (er[111] = _),
          (er[112] = S),
          (er[113] = j),
          (er[114] = E),
          (er[115] = k),
          (er[116] = C),
          (er[117] = et))
        : (et = er[117]),
      et
    );
  }
  e.s([
    "SolanaTransferTaxWarningDialog",
    0,
    function () {
      let e,
        n = (0, r.c)(3),
        i = (0, c.l)(y),
        a = (0, c.l)(h);
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
