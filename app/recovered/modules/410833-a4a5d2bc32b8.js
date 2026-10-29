// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(439587),
    i = e.i(352386);
  e.i(12692);
  var a = e.i(398902),
    s = e.i(182119),
    o = e.i(178496);
  function l() {
    return (0, o.n)("once");
  }
  function c() {
    return (0, o.n)("enable");
  }
  function u(e) {
    e || (0, o.n)("cancel");
  }
  function d() {
    return null;
  }
  e.s([
    "AutoConfirmPromptDialog",
    0,
    function () {
      let e,
        m,
        f,
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
        N = (0, r.c)(48),
        { t: L } = (0, a.f)(),
        O = (0, i.useSyncExternalStore)(o.D, o.m, d),
        P = O?.tradeType ?? "trade";
      if (N[0] !== O || N[1] !== L || N[2] !== P) {
        let r,
          n = L(
            "buy" === P
              ? "web.trade.auto_confirm_buys"
              : "sell" === P
                ? "web.trade.auto_confirm_sells"
                : "web.trade.auto_confirm_trades",
          );
        ((f = s.N),
          (w = null !== O),
          (x = u),
          (m = s.d),
          (g = !0),
          (v =
            "max-w-[min(420px,calc(100vw-32px))] gap-5 rounded-2xl border-border-secondary/60 bg-bg-primary text-text-primary"),
          (y = "flex flex-col gap-2"),
          N[14] !== L
            ? ((r = L("web.trade.auto_confirm_title")),
              (N[14] = L),
              (N[15] = r))
            : (r = N[15]),
          N[16] !== r
            ? ((b = (0, t.jsx)(s.F, {
                className: "text-text-primary",
                children: r,
              })),
              (N[16] = r),
              (N[17] = b))
            : (b = N[17]),
          (e = s.C),
          (p = "text-text-secondary"),
          (h = L("web.trade.auto_confirm_description", { trade_type: n })),
          (N[0] = O),
          (N[1] = L),
          (N[2] = P),
          (N[3] = e),
          (N[4] = m),
          (N[5] = f),
          (N[6] = p),
          (N[7] = h),
          (N[8] = y),
          (N[9] = b),
          (N[10] = g),
          (N[11] = v),
          (N[12] = w),
          (N[13] = x));
      } else
        ((e = N[3]),
          (m = N[4]),
          (f = N[5]),
          (p = N[6]),
          (h = N[7]),
          (y = N[8]),
          (b = N[9]),
          (g = N[10]),
          (v = N[11]),
          (w = N[12]),
          (x = N[13]));
      return (
        N[18] !== e || N[19] !== p || N[20] !== h
          ? ((_ = (0, t.jsx)(e, { className: p, children: h })),
            (N[18] = e),
            (N[19] = p),
            (N[20] = h),
            (N[21] = _))
          : (_ = N[21]),
        N[22] !== y || N[23] !== b || N[24] !== _
          ? ((S = (0, t.jsxs)("div", { className: y, children: [b, _] })),
            (N[22] = y),
            (N[23] = b),
            (N[24] = _),
            (N[25] = S))
          : (S = N[25]),
        N[26] !== L
          ? ((j = L("web.trade.enable_auto_confirm")), (N[26] = L), (N[27] = j))
          : (j = N[27]),
        N[28] !== j
          ? ((E = (0, t.jsx)(n.K, {
              variant: "primary",
              isFullWidth: !0,
              onClick: c,
              children: j,
            })),
            (N[28] = j),
            (N[29] = E))
          : (E = N[29]),
        N[30] !== L
          ? ((k = L("web.common.not_now")), (N[30] = L), (N[31] = k))
          : (k = N[31]),
        N[32] !== k
          ? ((C = (0, t.jsx)(n.K, {
              variant: "secondary",
              isFullWidth: !0,
              onClick: l,
              children: k,
            })),
            (N[32] = k),
            (N[33] = C))
          : (C = N[33]),
        N[34] !== E || N[35] !== C
          ? ((A = (0, t.jsxs)("div", {
              className: "flex flex-col gap-2",
              children: [E, C],
            })),
            (N[34] = E),
            (N[35] = C),
            (N[36] = A))
          : (A = N[36]),
        N[37] !== m || N[38] !== A || N[39] !== g || N[40] !== v || N[41] !== S
          ? ((U = (0, t.jsxs)(m, {
              showClose: g,
              className: v,
              children: [S, A],
            })),
            (N[37] = m),
            (N[38] = A),
            (N[39] = g),
            (N[40] = v),
            (N[41] = S),
            (N[42] = U))
          : (U = N[42]),
        N[43] !== f || N[44] !== U || N[45] !== w || N[46] !== x
          ? ((q = (0, t.jsx)(f, { open: w, onOpenChange: x, children: U })),
            (N[43] = f),
            (N[44] = U),
            (N[45] = w),
            (N[46] = x),
            (N[47] = q))
          : (q = N[47]),
        q
      );
    },
  ]);
};
