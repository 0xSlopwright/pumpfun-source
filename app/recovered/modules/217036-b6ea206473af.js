// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(439587);
  e.i(12692);
  var i = e.i(398902),
    a = e.i(167958),
    s = e.i(913719),
    o = e.i(961659),
    l = e.i(90832),
    c = e.i(894344),
    u = e.i(73594);
  let d = (e) => (null === e ? "—" : (0, l.w)(e));
  function m(e) {
    return e.settle;
  }
  function f(e) {
    return e.request;
  }
  e.s([
    "UsdSellConfirmDialog",
    0,
    function () {
      let e,
        p,
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
        Y = (0, r.c)(97),
        { t: Z } = (0, i.f)(),
        X = (0, o.Y)(f),
        J = (0, o.Y)(m);
      if (!X) return null;
      let { verdict: ee, coinSymbol: et } = X;
      (Y[0] !== et ||
      Y[1] !== J ||
      Y[2] !== Z ||
      Y[3] !== ee.atomicAmount ||
      Y[4] !== ee.proceedsUsd ||
      Y[5] !== ee.quotedSellValueUsd ||
      Y[6] !== ee.reason ||
      Y[7] !== ee.tokenDecimals ||
      Y[8] !== ee.typedUsd
        ? ((y = et.replace(/^\$/, "")),
          (h = "oversized" === ee.reason),
          (k = {
            typed: (0, l.w)(ee.typedUsd),
            symbol: y,
            amount: (0, s.N)(ee.atomicAmount, ee.tokenDecimals, 2),
            quoted: d(ee.quotedSellValueUsd ?? ee.proceedsUsd),
          }),
          (p = a.N),
          (w = !0),
          Y[23] !== J
            ? ((x = (e) => {
                e || J(!1);
              }),
              (Y[23] = J),
              (Y[24] = x))
            : (x = Y[24]),
          (_ = "terminal"),
          (S = "sm"),
          Y[25] !== h || Y[26] !== Z
            ? ((j = h
                ? Z("web.trade.usd_sell_oversized_title")
                : Z("web.trade.usd_sell_all_title")),
              (Y[25] = h),
              (Y[26] = Z),
              (Y[27] = j))
            : (j = Y[27]),
          (E = "usd-sell-confirm-dialog"),
          (e = a.K),
          (v = "flex flex-col gap-2"),
          (b = u.c),
          (g = h
            ? Z("web.trade.usd_sell_oversized_body", k)
            : Z("web.trade.usd_sell_all_body", k)),
          (Y[0] = et),
          (Y[1] = J),
          (Y[2] = Z),
          (Y[3] = ee.atomicAmount),
          (Y[4] = ee.proceedsUsd),
          (Y[5] = ee.quotedSellValueUsd),
          (Y[6] = ee.reason),
          (Y[7] = ee.tokenDecimals),
          (Y[8] = ee.typedUsd),
          (Y[9] = e),
          (Y[10] = p),
          (Y[11] = h),
          (Y[12] = y),
          (Y[13] = b),
          (Y[14] = g),
          (Y[15] = v),
          (Y[16] = w),
          (Y[17] = x),
          (Y[18] = _),
          (Y[19] = S),
          (Y[20] = j),
          (Y[21] = E),
          (Y[22] = k))
        : ((e = Y[9]),
          (p = Y[10]),
          (h = Y[11]),
          (y = Y[12]),
          (b = Y[13]),
          (g = Y[14]),
          (v = Y[15]),
          (w = Y[16]),
          (x = Y[17]),
          (_ = Y[18]),
          (S = Y[19]),
          (j = Y[20]),
          (E = Y[21]),
          (k = Y[22])),
        Y[28] !== b || Y[29] !== g
          ? ((C = (0, t.jsx)("p", { className: b, children: g })),
            (Y[28] = b),
            (Y[29] = g),
            (Y[30] = C))
          : (C = Y[30]),
        Y[31] === Symbol.for("react.memo_cache_sentinel")
          ? ((A = (0, t.jsx)(a.a, { className: "mt-1" })), (Y[31] = A))
          : (A = Y[31]),
        Y[32] !== Z
          ? ((U = Z("web.trade.value_entered")), (Y[32] = Z), (Y[33] = U))
          : (U = Y[33]),
        Y[34] !== U || Y[35] !== k.typed
          ? ((q = (0, t.jsx)(u.F, { label: U, value: k.typed })),
            (Y[34] = U),
            (Y[35] = k.typed),
            (Y[36] = q))
          : (q = Y[36]),
        Y[37] !== Z
          ? ((N = Z("web.trade.tokens_sold")), (Y[37] = Z), (Y[38] = N))
          : (N = Y[38]));
      let er = `${k.amount} ${y}${ee.snappedToSellAll ? " · 100%" : ""}`;
      (Y[39] !== N || Y[40] !== er
        ? ((L = (0, t.jsx)(u.F, { label: N, value: er })),
          (Y[39] = N),
          (Y[40] = er),
          (Y[41] = L))
        : (L = Y[41]),
        Y[42] !== Z
          ? ((O = Z("web.trade.value_sold")), (Y[42] = Z), (Y[43] = O))
          : (O = Y[43]),
        Y[44] !== ee.quotedSellValueUsd
          ? ((P = d(ee.quotedSellValueUsd)),
            (Y[44] = ee.quotedSellValueUsd),
            (Y[45] = P))
          : (P = Y[45]));
      let en = h ? "loss" : void 0;
      return (
        Y[46] !== O || Y[47] !== P || Y[48] !== en
          ? ((T = (0, t.jsx)(u.F, { label: O, value: P, tone: en })),
            (Y[46] = O),
            (Y[47] = P),
            (Y[48] = en),
            (Y[49] = T))
          : (T = Y[49]),
        Y[50] !== Z
          ? ((D = Z("web.trade.youd_receive")), (Y[50] = Z), (Y[51] = D))
          : (D = Y[51]),
        Y[52] !== ee.proceedsUsd
          ? ((R = d(ee.proceedsUsd)), (Y[52] = ee.proceedsUsd), (Y[53] = R))
          : (R = Y[53]),
        Y[54] !== D || Y[55] !== R
          ? ((F = (0, t.jsx)(u.F, { label: D, value: R })),
            (Y[54] = D),
            (Y[55] = R),
            (Y[56] = F))
          : (F = Y[56]),
        Y[57] !== q || Y[58] !== L || Y[59] !== T || Y[60] !== F
          ? (($ = (0, t.jsxs)("dl", {
              className: "flex flex-col",
              children: [q, L, T, F],
            })),
            (Y[57] = q),
            (Y[58] = L),
            (Y[59] = T),
            (Y[60] = F),
            (Y[61] = $))
          : ($ = Y[61]),
        Y[62] !== e || Y[63] !== v || Y[64] !== $ || Y[65] !== C
          ? ((I = (0, t.jsxs)(e, { className: v, children: [C, A, $] })),
            (Y[62] = e),
            (Y[63] = v),
            (Y[64] = $),
            (Y[65] = C),
            (Y[66] = I))
          : (I = Y[66]),
        Y[67] !== Z
          ? ((M = Z("web.trade.sell_anyway")), (Y[67] = Z), (Y[68] = M))
          : (M = Y[68]),
        Y[69] !== Z
          ? ((z = (e) => Z("web.trade.selling_in_countdown", { seconds: e })),
            (Y[69] = Z),
            (Y[70] = z))
          : (z = Y[70]),
        Y[71] !== J
          ? ((W = () => J(!0)), (Y[71] = J), (Y[72] = W))
          : (W = Y[72]),
        Y[73] !== M || Y[74] !== z || Y[75] !== W
          ? ((K = (0, t.jsx)(c.f, {
              idleLabel: M,
              armedLabel: z,
              onConfirm: W,
            })),
            (Y[73] = M),
            (Y[74] = z),
            (Y[75] = W),
            (Y[76] = K))
          : (K = Y[76]),
        Y[77] !== J
          ? ((Q = () => J(!1)), (Y[77] = J), (Y[78] = Q))
          : (Q = Y[78]),
        Y[79] !== Z
          ? ((B = Z("common.cancel")), (Y[79] = Z), (Y[80] = B))
          : (B = Y[80]),
        Y[81] !== Q || Y[82] !== B
          ? ((H = (0, t.jsx)(n.K, {
              variant: "secondary",
              size: a.Z,
              isFullWidth: !0,
              onClick: Q,
              children: B,
            })),
            (Y[81] = Q),
            (Y[82] = B),
            (Y[83] = H))
          : (H = Y[83]),
        Y[84] !== K || Y[85] !== H
          ? ((V = (0, t.jsxs)(a.c, {
              className: "flex-col items-stretch",
              children: [K, H],
            })),
            (Y[84] = K),
            (Y[85] = H),
            (Y[86] = V))
          : (V = Y[86]),
        Y[87] !== p ||
        Y[88] !== I ||
        Y[89] !== w ||
        Y[90] !== V ||
        Y[91] !== x ||
        Y[92] !== _ ||
        Y[93] !== S ||
        Y[94] !== j ||
        Y[95] !== E
          ? ((G = (0, t.jsxs)(p, {
              open: w,
              onOpenChange: x,
              density: _,
              size: S,
              title: j,
              "data-testid": E,
              children: [I, V],
            })),
            (Y[87] = p),
            (Y[88] = I),
            (Y[89] = w),
            (Y[90] = V),
            (Y[91] = x),
            (Y[92] = _),
            (Y[93] = S),
            (Y[94] = j),
            (Y[95] = E),
            (Y[96] = G))
          : (G = Y[96]),
        G
      );
    },
  ]);
};
