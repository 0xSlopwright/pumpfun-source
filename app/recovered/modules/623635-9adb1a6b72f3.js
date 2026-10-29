// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(439587);
  e.i(12692);
  var i = e.i(117466),
    a = e.i(398902);
  e.i(84455);
  var s = e.i(242917),
    o = e.i(167958);
  e.i(267146);
  var l = e.i(540805),
    c = e.i(778396),
    u = e.i(338319),
    d = e.i(894344),
    m = e.i(73594);
  let f = (e) => (null === e ? "—" : (0, l.w)(e));
  function p(e) {
    return e.settle;
  }
  function h(e) {
    return e.request;
  }
  e.s([
    "ImpactWarningDialog",
    0,
    function () {
      let e,
        l,
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
        M = (0, r.c)(71),
        { t: z } = (0, a.f)(),
        W = (0, c.w)(h),
        K = (0, c.w)(p);
      if (!W) return null;
      let { assessment: Q, coinSymbol: B, direction: H } = W,
        V = "buy" === H;
      (M[0] !== K
        ? ((e = (e) => {
            e || K(!1);
          }),
          (M[0] = K),
          (M[1] = e))
        : (e = M[1]),
        M[2] !== z
          ? ((l = z("web.trade.very_high_price_impact")),
            (M[2] = z),
            (M[3] = l))
          : (l = M[3]));
      let G = V
        ? "web.trade.impact_warning_buy"
        : "web.trade.impact_warning_sell";
      return (
        M[4] !== Q.impactPercent || M[5] !== z
          ? ((y =
              null === Q.impactPercent
                ? z("web.trade.impact_unknown_share")
                : `${Math.abs(Q.impactPercent).toFixed(1)}%`),
            (M[4] = Q.impactPercent),
            (M[5] = z),
            (M[6] = y))
          : (y = M[6]),
        M[7] !== B || M[8] !== y
          ? ((b = { symbol: B, impact: y }), (M[7] = B), (M[8] = y), (M[9] = b))
          : (b = M[9]),
        M[10] === Symbol.for("react.memo_cache_sentinel")
          ? ((g = {
              negative: (0, t.jsx)("span", {
                className: (0, u.c)("font-medium", s.f.loss),
              }),
            }),
            (M[10] = g))
          : (g = M[10]),
        M[11] !== G || M[12] !== b
          ? ((v = (0, t.jsx)("p", {
              className: m.c,
              children: (0, t.jsx)(i.f, {
                i18nKey: G,
                values: b,
                components: g,
              }),
            })),
            (M[11] = G),
            (M[12] = b),
            (M[13] = v))
          : (v = M[13]),
        M[14] === Symbol.for("react.memo_cache_sentinel")
          ? ((w = (0, t.jsx)(o.a, { className: "mt-1" })), (M[14] = w))
          : (w = M[14]),
        M[15] !== V || M[16] !== z
          ? ((x = V ? z("web.trade.value_paid") : z("web.trade.value_sold")),
            (M[15] = V),
            (M[16] = z),
            (M[17] = x))
          : (x = M[17]),
        M[18] !== Q.fromAmountUsd
          ? ((_ = f(Q.fromAmountUsd)), (M[18] = Q.fromAmountUsd), (M[19] = _))
          : (_ = M[19]),
        M[20] !== x || M[21] !== _
          ? ((S = (0, t.jsx)(m.F, { label: x, value: _ })),
            (M[20] = x),
            (M[21] = _),
            (M[22] = S))
          : (S = M[22]),
        M[23] !== z
          ? ((j = z("web.trade.youd_receive")), (M[23] = z), (M[24] = j))
          : (j = M[24]),
        M[25] !== Q.toAmountUsd
          ? ((E = f(Q.toAmountUsd)), (M[25] = Q.toAmountUsd), (M[26] = E))
          : (E = M[26]),
        M[27] !== j || M[28] !== E
          ? ((k = (0, t.jsx)(m.F, { label: j, value: E })),
            (M[27] = j),
            (M[28] = E),
            (M[29] = k))
          : (k = M[29]),
        M[30] !== z
          ? ((C = z("web.trade.lost_to_impact")), (M[30] = z), (M[31] = C))
          : (C = M[31]),
        M[32] !== Q.valueLostUsd
          ? ((A = f(Q.valueLostUsd)), (M[32] = Q.valueLostUsd), (M[33] = A))
          : (A = M[33]),
        M[34] !== C || M[35] !== A
          ? ((U = (0, t.jsx)(m.F, { label: C, value: A, tone: "loss" })),
            (M[34] = C),
            (M[35] = A),
            (M[36] = U))
          : (U = M[36]),
        M[37] !== S || M[38] !== k || M[39] !== U
          ? ((q = (0, t.jsxs)("dl", {
              className: "flex flex-col",
              children: [S, k, U],
            })),
            (M[37] = S),
            (M[38] = k),
            (M[39] = U),
            (M[40] = q))
          : (q = M[40]),
        M[41] !== q || M[42] !== v
          ? ((N = (0, t.jsxs)(o.K, {
              className: "flex flex-col gap-2",
              children: [v, w, q],
            })),
            (M[41] = q),
            (M[42] = v),
            (M[43] = N))
          : (N = M[43]),
        M[44] !== V || M[45] !== z
          ? ((L = V ? z("web.trade.buy_anyway") : z("web.trade.sell_anyway")),
            (M[44] = V),
            (M[45] = z),
            (M[46] = L))
          : (L = M[46]),
        M[47] !== V || M[48] !== z
          ? ((O = (e) =>
              V
                ? z("web.trade.buying_in_countdown", { seconds: e })
                : z("web.trade.selling_in_countdown", { seconds: e })),
            (M[47] = V),
            (M[48] = z),
            (M[49] = O))
          : (O = M[49]),
        M[50] !== K
          ? ((P = () => K(!0)), (M[50] = K), (M[51] = P))
          : (P = M[51]),
        M[52] !== L || M[53] !== O || M[54] !== P
          ? ((T = (0, t.jsx)(d.f, {
              idleLabel: L,
              armedLabel: O,
              onConfirm: P,
            })),
            (M[52] = L),
            (M[53] = O),
            (M[54] = P),
            (M[55] = T))
          : (T = M[55]),
        M[56] !== K
          ? ((D = () => K(!1)), (M[56] = K), (M[57] = D))
          : (D = M[57]),
        M[58] !== z
          ? ((R = z("common.cancel")), (M[58] = z), (M[59] = R))
          : (R = M[59]),
        M[60] !== D || M[61] !== R
          ? ((F = (0, t.jsx)(n.K, {
              variant: "secondary",
              size: o.Z,
              isFullWidth: !0,
              onClick: D,
              children: R,
            })),
            (M[60] = D),
            (M[61] = R),
            (M[62] = F))
          : (F = M[62]),
        M[63] !== T || M[64] !== F
          ? (($ = (0, t.jsxs)(o.c, {
              className: "flex-col items-stretch",
              children: [T, F],
            })),
            (M[63] = T),
            (M[64] = F),
            (M[65] = $))
          : ($ = M[65]),
        M[66] !== e || M[67] !== l || M[68] !== N || M[69] !== $
          ? ((I = (0, t.jsxs)(o.N, {
              open: !0,
              onOpenChange: e,
              density: "terminal",
              size: "sm",
              title: l,
              "data-testid": "impact-warning-dialog",
              children: [N, $],
            })),
            (M[66] = e),
            (M[67] = l),
            (M[68] = N),
            (M[69] = $),
            (M[70] = I))
          : (I = M[70]),
        I
      );
    },
  ]);
};
