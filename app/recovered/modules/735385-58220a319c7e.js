// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    s = e.i(439587),
    l = e.i(498936),
    n = e.i(574472),
    i = e.i(928529);
  e.i(12692);
  var r = e.i(398902),
    o = e.i(441315),
    u = e.i(167958),
    c = e.i(901665),
    d = e.i(524711),
    m = e.i(890088),
    f = e.i(592209),
    p = e.i(163742),
    _ = e.i(595673),
    g = e.i(338319),
    b = e.i(367310),
    x = e.i(90832);
  let h = "comfortable",
    v = (0, p.T)("sol_to_usdc").from,
    y = (0, p.T)("usdc_to_sol").from,
    N = "relative z-10";
  function w(e) {
    let l,
      n,
      u,
      c,
      d,
      p,
      _,
      b,
      w,
      A,
      j,
      U,
      $,
      B,
      C,
      I,
      S,
      M,
      E,
      D,
      L = (0, a.c)(86),
      {
        leg: P,
        amount: T,
        usdValue: k,
        totalPortfolioUsd: F,
        isDefault: O,
        onSetDefault: K,
        onDeposit: z,
        onConvert: R,
      } = e,
      { t: q, i18n: V } = (0, r.f)();
    if (
      L[0] !== T ||
      L[1] !== V.language ||
      L[2] !== O ||
      L[3] !== P ||
      L[4] !== K ||
      L[5] !== q ||
      L[6] !== F ||
      L[7] !== k
    ) {
      let e,
        a,
        s,
        r,
        N,
        B,
        C = (0, f.v)(V.language) ?? f.T;
      ((n = "sol" === P.asset ? y.symbol : v.symbol),
        (l = null !== T && T > 0));
      let I =
        null !== k && null !== F && F > 0
          ? (0, m.R)(C, { style: "percent", maximumFractionDigits: 0 }).format(
              k / F,
            )
          : null;
      ((j = `select-balance-card-${P.asset}`),
        (U = O ? "" : void 0),
        ($ = P.symbol));
      let S = O
        ? "border-bg-accent bg-gradient-to-b from-bg-accent/10 from-[17.5%] to-bg-primary/10 to-[53%]"
        : "group border-border-secondary transition-colors hover:bg-bg-tertiary";
      (L[21] !== S
        ? ((c = (0, g.c)(
            "relative flex flex-col gap-3 rounded-[10px] border bg-bg-secondary p-3",
            S,
          )),
          (L[21] = S),
          (L[22] = c))
        : (c = L[22]),
        L[23] !== O || L[24] !== P.asset || L[25] !== K || L[26] !== q
          ? ((d = O
              ? null
              : (0, t.jsx)("button", {
                  type: "button",
                  "aria-label": q("profile.spending_power.set_as_default"),
                  "data-testid": `select-balance-set-default-${P.asset}`,
                  onClick: K,
                  className:
                    "absolute inset-0 z-0 rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-accent",
                })),
            (L[23] = O),
            (L[24] = P.asset),
            (L[25] = K),
            (L[26] = q),
            (L[27] = d))
          : (d = L[27]),
        (b = "flex items-center gap-3"),
        L[28] !== P.imageUri
          ? ((w = (0, t.jsx)(i.default, {
              src: P.imageUri,
              alt: "",
              width: 40,
              height: 40,
              className: "size-10 shrink-0 rounded-[10px] object-cover",
            })),
            (L[28] = P.imageUri),
            (L[29] = w))
          : (w = L[29]),
        L[30] !== P.symbol
          ? ((e = (0, t.jsx)("span", {
              className: "text-sm font-medium leading-5 text-text-primary",
              children: P.symbol,
            })),
            (L[30] = P.symbol),
            (L[31] = e))
          : (e = L[31]),
        L[32] !== O || L[33] !== P.asset || L[34] !== q
          ? ((a = O
              ? (0, t.jsx)(o.p, {
                  as: "span",
                  density: h,
                  variant: "pressed",
                  "data-testid": `select-balance-default-${P.asset}`,
                  children: q("profile.spending_power.default_badge"),
                })
              : (0, t.jsx)("span", {
                  "aria-hidden": "true",
                  className:
                    "text-xs font-medium leading-4 text-text-accent transition-colors group-hover:text-text-primary",
                  children: q("profile.spending_power.set_as_default"),
                })),
            (L[32] = O),
            (L[33] = P.asset),
            (L[34] = q),
            (L[35] = a))
          : (a = L[35]),
        L[36] !== e || L[37] !== a
          ? ((s = (0, t.jsxs)("div", {
              className: "flex items-center gap-2",
              children: [e, a],
            })),
            (L[36] = e),
            (L[37] = a),
            (L[38] = s))
          : (s = L[38]));
      let M = `select-balance-amount-${P.asset}`;
      if (L[39] !== T || L[40] !== P)
        ((r =
          null === T
            ? "—"
            : "sol" === P.asset
              ? `${(0, x.m)(T, 4)} ${P.symbol}`
              : `${(0, x.p)(T, 2)} ${P.symbol}`),
          (L[39] = T),
          (L[40] = P),
          (L[41] = r));
      else r = L[41];
      (L[42] !== M || L[43] !== r
        ? ((N = (0, t.jsx)("span", {
            "data-testid": M,
            className: "text-xs leading-4 tabular-nums text-text-tertiary",
            children: r,
          })),
          (L[42] = M),
          (L[43] = r),
          (L[44] = N))
        : (N = L[44]),
        L[45] !== s || L[46] !== N
          ? ((A = (0, t.jsxs)("div", {
              className: "flex min-w-0 flex-1 flex-col gap-0.5",
              children: [s, N],
            })),
            (L[45] = s),
            (L[46] = N),
            (L[47] = A))
          : (A = L[47]),
        (u = "flex shrink-0 flex-col items-end gap-0.5"));
      let E = `select-balance-usd-${P.asset}`;
      (L[48] !== k
        ? ((B = null === k ? "—" : (0, x.w)(k)), (L[48] = k), (L[49] = B))
        : (B = L[49]),
        L[50] !== E || L[51] !== B
          ? ((p = (0, t.jsx)("span", {
              "data-testid": E,
              className:
                "text-sm font-medium leading-5 tabular-nums text-text-primary",
              children: B,
            })),
            (L[50] = E),
            (L[51] = B),
            (L[52] = p))
          : (p = L[52]),
        (_ = I
          ? (0, t.jsx)("span", {
              className: "text-xs leading-4 tabular-nums text-text-tertiary",
              children: q("profile.spending_power.percent_of_total", {
                percent: I,
              }),
            })
          : null),
        (L[0] = T),
        (L[1] = V.language),
        (L[2] = O),
        (L[3] = P),
        (L[4] = K),
        (L[5] = q),
        (L[6] = F),
        (L[7] = k),
        (L[8] = l),
        (L[9] = n),
        (L[10] = u),
        (L[11] = c),
        (L[12] = d),
        (L[13] = p),
        (L[14] = _),
        (L[15] = b),
        (L[16] = w),
        (L[17] = A),
        (L[18] = j),
        (L[19] = U),
        (L[20] = $));
    } else
      ((l = L[8]),
        (n = L[9]),
        (u = L[10]),
        (c = L[11]),
        (d = L[12]),
        (p = L[13]),
        (_ = L[14]),
        (b = L[15]),
        (w = L[16]),
        (A = L[17]),
        (j = L[18]),
        (U = L[19]),
        ($ = L[20]));
    (L[53] !== u || L[54] !== p || L[55] !== _
      ? ((B = (0, t.jsxs)("div", { className: u, children: [p, _] })),
        (L[53] = u),
        (L[54] = p),
        (L[55] = _),
        (L[56] = B))
      : (B = L[56]),
      L[57] !== B || L[58] !== b || L[59] !== w || L[60] !== A
        ? ((C = (0, t.jsxs)("div", { className: b, children: [w, A, B] })),
          (L[57] = B),
          (L[58] = b),
          (L[59] = w),
          (L[60] = A),
          (L[61] = C))
        : (C = L[61]));
    let W = O ? "primary" : "secondary",
      Q = `select-balance-deposit-${P.asset}`;
    return (
      L[62] !== q
        ? ((I = q("profile.spending_power.deposit_funds")),
          (L[62] = q),
          (L[63] = I))
        : (I = L[63]),
      L[64] !== z || L[65] !== W || L[66] !== Q || L[67] !== I
        ? ((S = (0, t.jsx)(s.K, {
            variant: W,
            size: 36,
            isFullWidth: !0,
            className: N,
            "data-testid": Q,
            onClick: z,
            children: I,
          })),
          (L[64] = z),
          (L[65] = W),
          (L[66] = Q),
          (L[67] = I),
          (L[68] = S))
        : (S = L[68]),
      L[69] !== l ||
      L[70] !== P.asset ||
      L[71] !== R ||
      L[72] !== n ||
      L[73] !== q
        ? ((M = l
            ? (0, t.jsx)(s.K, {
                variant: "secondary",
                size: 36,
                isFullWidth: !0,
                className: N,
                "data-testid": `select-balance-convert-${P.asset}`,
                onClick: R,
                children: q("profile.spending_power.convert_to", { symbol: n }),
              })
            : null),
          (L[69] = l),
          (L[70] = P.asset),
          (L[71] = R),
          (L[72] = n),
          (L[73] = q),
          (L[74] = M))
        : (M = L[74]),
      L[75] !== S || L[76] !== M
        ? ((E = (0, t.jsxs)("div", {
            className: "grid grid-cols-2 gap-2",
            children: [S, M],
          })),
          (L[75] = S),
          (L[76] = M),
          (L[77] = E))
        : (E = L[77]),
      L[78] !== c ||
      L[79] !== d ||
      L[80] !== C ||
      L[81] !== E ||
      L[82] !== j ||
      L[83] !== U ||
      L[84] !== $
        ? ((D = (0, t.jsxs)("section", {
            "data-testid": j,
            "data-default": U,
            "aria-label": $,
            className: c,
            children: [d, C, E],
          })),
          (L[78] = c),
          (L[79] = d),
          (L[80] = C),
          (L[81] = E),
          (L[82] = j),
          (L[83] = U),
          (L[84] = $),
          (L[85] = D))
        : (D = L[85]),
      D
    );
  }
  function A(e) {
    let s,
      i,
      o,
      m,
      f,
      p,
      g,
      x,
      h,
      N,
      A,
      j,
      U,
      $,
      B,
      C,
      I = (0, a.c)(46),
      { onDeposit: S, onConvert: M } = e,
      { t: E } = (0, r.f)(),
      { address: D } = (0, n.F)();
    I[0] !== D ? ((s = { wallet: D }), (I[0] = D), (I[1] = s)) : (s = I[1]);
    let {
        solAmount: L,
        solLoaded: P,
        solUsd: T,
        usdcAmount: k,
        usdcUsd: F,
      } = (0, c.Y)(s),
      O = D ?? "";
    I[2] !== O
      ? ((i = { userAddress: O }), (I[2] = O), (I[3] = i))
      : (i = I[3]);
    let { data: K } = (0, d._)(i);
    I[4] !== K
      ? ((o = K?.success === !0 && K.data ? (0, l.f)(K.data).totalValue : null),
        (I[4] = K),
        (I[5] = o))
      : (o = I[5]);
    let z = o,
      R = (0, b.k)(),
      q = (0, b.B)(),
      V = (0, b.E)(),
      W = (P && L > 0) || (k ?? 0) > 0,
      Q = R && (W || q);
    I[6] !== S
      ? ((m = (e) => {
          ((0, _.rX)({ asset: e }), S(e));
        }),
        (I[6] = S),
        (I[7] = m))
      : (m = I[7]);
    let Y = m;
    I[8] !== M
      ? ((f = (e) => {
          ((0, _.VL)({ from: e }), M(e));
        }),
        (I[8] = M),
        (I[9] = f))
      : (f = I[9]);
    let G = f;
    (I[10] !== E
      ? ((p = E("profile.spending_power.description")),
        (I[10] = E),
        (I[11] = p))
      : (p = I[11]),
      I[12] !== p
        ? ((g = (0, t.jsx)("p", {
            className: "text-sm leading-5 text-text-secondary",
            children: p,
          })),
          (I[12] = p),
          (I[13] = g))
        : (g = I[13]));
    let X = P ? L : null,
      H = P ? T : null,
      J = !Q;
    return (
      I[14] !== V ? ((x = () => V(!1)), (I[14] = V), (I[15] = x)) : (x = I[15]),
      I[16] !== Y
        ? ((h = () => Y("sol")), (I[16] = Y), (I[17] = h))
        : (h = I[17]),
      I[18] !== G
        ? ((N = () => G("sol")), (I[18] = G), (I[19] = N))
        : (N = I[19]),
      I[20] !== H ||
      I[21] !== J ||
      I[22] !== x ||
      I[23] !== h ||
      I[24] !== N ||
      I[25] !== X ||
      I[26] !== z
        ? ((A = (0, t.jsx)(w, {
            leg: v,
            amount: X,
            usdValue: H,
            totalPortfolioUsd: z,
            isDefault: J,
            onSetDefault: x,
            onDeposit: h,
            onConvert: N,
          })),
          (I[20] = H),
          (I[21] = J),
          (I[22] = x),
          (I[23] = h),
          (I[24] = N),
          (I[25] = X),
          (I[26] = z),
          (I[27] = A))
        : (A = I[27]),
      I[28] !== V ? ((j = () => V(!0)), (I[28] = V), (I[29] = j)) : (j = I[29]),
      I[30] !== Y
        ? ((U = () => Y("usdc")), (I[30] = Y), (I[31] = U))
        : (U = I[31]),
      I[32] !== G
        ? (($ = () => G("usdc")), (I[32] = G), (I[33] = $))
        : ($ = I[33]),
      I[34] !== Q ||
      I[35] !== j ||
      I[36] !== U ||
      I[37] !== $ ||
      I[38] !== z ||
      I[39] !== k ||
      I[40] !== F
        ? ((B = (0, t.jsx)(w, {
            leg: y,
            amount: k,
            usdValue: F,
            totalPortfolioUsd: z,
            isDefault: Q,
            onSetDefault: j,
            onDeposit: U,
            onConvert: $,
          })),
          (I[34] = Q),
          (I[35] = j),
          (I[36] = U),
          (I[37] = $),
          (I[38] = z),
          (I[39] = k),
          (I[40] = F),
          (I[41] = B))
        : (B = I[41]),
      I[42] !== A || I[43] !== B || I[44] !== g
        ? ((C = (0, t.jsxs)(u.K, {
            className: "flex flex-col gap-3 pt-3",
            children: [g, A, B],
          })),
          (I[42] = A),
          (I[43] = B),
          (I[44] = g),
          (I[45] = C))
        : (C = I[45]),
      C
    );
  }
  e.s([
    "SOL_LEG",
    0,
    v,
    "SelectBalanceDialog",
    0,
    function (e) {
      let s,
        l,
        n,
        i = (0, a.c)(12),
        {
          open: o,
          onOpenChange: c,
          onOpenChangeComplete: d,
          onDeposit: m,
          onConvert: f,
        } = e,
        { t: p } = (0, r.f)();
      return (
        i[0] !== p
          ? ((s = p("trade.select_balance")), (i[0] = p), (i[1] = s))
          : (s = i[1]),
        i[2] !== f || i[3] !== m || i[4] !== o
          ? ((l = o ? (0, t.jsx)(A, { onDeposit: m, onConvert: f }) : null),
            (i[2] = f),
            (i[3] = m),
            (i[4] = o),
            (i[5] = l))
          : (l = i[5]),
        i[6] !== c || i[7] !== d || i[8] !== o || i[9] !== s || i[10] !== l
          ? ((n = (0, t.jsx)(u.N, {
              open: o,
              onOpenChange: c,
              onOpenChangeComplete: d,
              density: h,
              size: "sm",
              title: s,
              "data-testid": "select-balance-dialog",
              children: l,
            })),
            (i[6] = c),
            (i[7] = d),
            (i[8] = o),
            (i[9] = s),
            (i[10] = l),
            (i[11] = n))
          : (n = i[11]),
        n
      );
    },
    "SpendingAssetCard",
    0,
    w,
    "USDC_LEG",
    0,
    y,
  ]);
};
