// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242);
  e.i(353110);
  var r = e.i(648470),
    n = e.i(745018),
    o = e.i(574472),
    a = e.i(928529),
    s = e.i(599077),
    u = e.i(352386);
  e.i(12692);
  var l = e.i(398902),
    c = e.i(887009),
    d = e.i(328242),
    m = e.i(988801),
    f = e.i(996567),
    p = e.i(790431),
    b = e.i(595673),
    g = e.i(338319),
    _ = e.i(198825),
    v = e.i(51954),
    y = e.i(538459),
    h = e.i(367310),
    w = e.i(102250),
    S = e.i(187611),
    A = e.i(655397),
    x = e.i(449597),
    q = e.i(709481);
  let B = (0, A.p)().toBase58();
  function M(e) {
    (e.preventDefault(),
      e.stopPropagation(),
      e.nativeEvent.stopImmediatePropagation());
  }
  let N =
      "flex h-7 min-w-16 items-center justify-center gap-1 rounded-lg border border-gain/40 px-2 text-xs font-semibold leading-4 tabular-nums text-gain transition-colors hover:bg-gain hover:text-bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent disabled:cursor-not-allowed disabled:opacity-70",
    k = {
      solid:
        "flex items-center justify-center gap-1.5 rounded-full bg-bg-accent px-4 py-2 text-sm font-semibold text-bg-primary shadow-lg shadow-black/30 transition-[transform,filter] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
      feed: "flex h-8 items-center justify-center gap-2 rounded-lg border border-border-tertiary bg-white/[0.05] px-3 text-xs font-medium leading-4 text-[#86EFAC] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-70",
      row: N,
      rail: N,
    },
    T = (e) => {
      let t,
        r = (0, i.c)(4),
        { variant: n, coinName: o, amountLabel: a, isStateLabel: s } = e,
        { t: u } = (0, l.f)();
      if ("solid" !== n && "feed" !== n && !s)
        return (
          r[0] !== a || r[1] !== o || r[2] !== u
            ? ((t = u("web.home.row_quick_buy_aria", {
                amount: (0, S.T)(a, "number-format"),
                coin_name: (0, S.T)(o, "coin-name"),
              })),
              (r[0] = a),
              (r[1] = o),
              (r[2] = u),
              (r[3] = t))
            : (t = r[3]),
          t
        );
    };
  function L(e) {
    let r,
      o,
      s,
      l,
      c,
      d,
      m,
      f,
      p = (0, i.c)(23),
      {
        label: b,
        disabled: _,
        onClick: v,
        onEngage: y,
        className: h,
        iconSrc: w,
        variant: S,
        ariaLabel: A,
        focusOnMount: x,
      } = e,
      q = void 0 === S ? "solid" : S,
      B = void 0 !== x && x,
      M = (0, u.useRef)(null);
    (p[0] !== B
      ? ((r = () => {
          if (!B) return;
          let e = document.activeElement;
          (null === e || e === document.body) && M.current?.focus();
        }),
        (o = [B]),
        (p[0] = B),
        (p[1] = r),
        (p[2] = o))
      : ((r = p[1]), (o = p[2])),
      (0, u.useLayoutEffect)(r, o),
      p[3] !== y
        ? ((s = () => y?.("pointer")),
          (l = () => y?.("focus")),
          (p[3] = y),
          (p[4] = s),
          (p[5] = l))
        : ((s = p[4]), (l = p[5])));
    let N = k[q];
    return (
      (p[6] !== h || p[7] !== N
        ? ((c = (0, g.c)(N, h)), (p[6] = h), (p[7] = N), (p[8] = c))
        : (c = p[8]),
      p[9] !== w || p[10] !== q)
        ? ((d =
            "solid" !== q
              ? (0, t.jsx)(n.$U, {
                  "aria-hidden": !0,
                  className:
                    "feed" === q ? "size-4 shrink-0" : "size-3 shrink-0",
                })
              : w &&
                (0, t.jsx)(a.default, {
                  src: w,
                  alt: "",
                  width: 16,
                  height: 16,
                  "aria-hidden": !0,
                  className: "size-4 shrink-0 rounded-full",
                })),
          (p[9] = w),
          (p[10] = q),
          (p[11] = d))
        : (d = p[11]),
      p[12] !== b
        ? ((m = (0, t.jsx)("span", {
            className: "whitespace-nowrap",
            children: b,
          })),
          (p[12] = b),
          (p[13] = m))
        : (m = p[13]),
      p[14] !== A ||
      p[15] !== _ ||
      p[16] !== v ||
      p[17] !== m ||
      p[18] !== s ||
      p[19] !== l ||
      p[20] !== c ||
      p[21] !== d
        ? ((f = (0, t.jsxs)("button", {
            ref: M,
            type: "button",
            "aria-label": A,
            onClick: v,
            onPointerEnter: s,
            onFocus: l,
            disabled: _,
            className: c,
            children: [d, m],
          })),
          (p[14] = A),
          (p[15] = _),
          (p[16] = v),
          (p[17] = m),
          (p[18] = s),
          (p[19] = l),
          (p[20] = c),
          (p[21] = d),
          (p[22] = f))
        : (f = p[22]),
      f
    );
  }
  function F(e, t, r) {
    let n,
      a,
      u,
      l,
      c,
      d,
      m,
      f = (0, i.c)(39),
      b = void 0 !== t && t,
      g = r ?? e.quote_mint,
      S = (0, y.r)(),
      A = (0, y.E)(),
      { address: M } = (0, o.F)(),
      { setShowDeposit: N } = (0, _.useConnectWallet)(),
      k = (0, s.useRouter)(),
      T = (0, v.f)(E),
      L = (0, v.f)(U),
      F = (0, h.k)(),
      $ = (0, w.o)(),
      O = !1 !== e.initialized;
    if (
      f[0] !== e.mint ||
      f[1] !== e.program ||
      f[2] !== e.raydium_pool ||
      f[3] !== O ||
      f[4] !== b ||
      f[5] !== F ||
      f[6] !== g ||
      f[7] !== $
    ) {
      let t,
        i = (0, x.Y)(g);
      (f[9] !== e.program || f[10] !== e.raydium_pool
        ? ((t = (0, p.d)({ program: e.program, raydium_pool: e.raydium_pool })),
          (f[9] = e.program),
          (f[10] = e.raydium_pool),
          (f[11] = t))
        : (t = f[11]),
        (n = (0, p.r)({
          prefersUsdc: F,
          isUsdcQuote: i,
          isPumpVenue: "pump" === t,
          isEstablished: O,
          isMigration: b,
          paymentRoutingDisabled: !1,
          walletFailsSponsoredSigning: $,
          selfAsset: (0, p.T)(e.mint),
        })),
        (f[0] = e.mint),
        (f[1] = e.program),
        (f[2] = e.raydium_pool),
        (f[3] = O),
        (f[4] = b),
        (f[5] = F),
        (f[6] = g),
        (f[7] = $),
        (f[8] = n));
    } else n = f[8];
    let R = n,
      P = O && !b ? R : null;
    f[12] !== P || f[13] !== g || f[14] !== S || f[15] !== A
      ? ((a = (0, q.o)({
          quoteMintAddress: g,
          solAmount: S,
          usdcAmount: A,
          paymentOverride: P,
        })),
        (f[12] = P),
        (f[13] = g),
        (f[14] = S),
        (f[15] = A),
        (f[16] = a))
      : (a = f[16]);
    let Q = a;
    f[17] !== Q.quoteAmount
      ? ((u = Number.isFinite(Q.quoteAmount) && Q.quoteAmount > 0),
        (f[17] = Q.quoteAmount),
        (f[18] = u))
      : (u = f[18]);
    let C = u;
    f[19] !== M ||
    f[20] !== Q.isUsdcQuote ||
    f[21] !== Q.quoteDecimals ||
    f[22] !== T ||
    f[23] !== L
      ? ((l = (e) =>
          !!M &&
          Number.isFinite(e) &&
          e > 0 &&
          (0, q.Q)({
            isUsdcQuote: Q.isUsdcQuote,
            quoteAmount: e,
            quoteDecimals: Q.quoteDecimals,
            solBalanceLamports: T,
            usdcBalanceRaw: L,
          })),
        (f[19] = M),
        (f[20] = Q.isUsdcQuote),
        (f[21] = Q.quoteDecimals),
        (f[22] = T),
        (f[23] = L),
        (f[24] = l))
      : (l = f[24]);
    let I = l;
    f[25] !== Q.quoteAmount || f[26] !== I || f[27] !== C
      ? ((c = C && I(Q.quoteAmount)),
        (f[25] = Q.quoteAmount),
        (f[26] = I),
        (f[27] = C),
        (f[28] = c))
      : (c = f[28]);
    let D = c;
    f[29] !== Q.isUsdcQuote || f[30] !== k || f[31] !== N
      ? ((d = () => {
          Q.isUsdcQuote ? k.push(`/coin/${B}`) : N(!0);
        }),
        (f[29] = Q.isUsdcQuote),
        (f[30] = k),
        (f[31] = N),
        (f[32] = d))
      : (d = f[32]);
    let j = d;
    return (
      f[33] !== j || f[34] !== Q || f[35] !== D || f[36] !== I || f[37] !== C
        ? ((m = {
            ...Q,
            isValidAmount: C,
            insufficient: D,
            isInsufficientFor: I,
            addFunds: j,
          }),
          (f[33] = j),
          (f[34] = Q),
          (f[35] = D),
          (f[36] = I),
          (f[37] = C),
          (f[38] = m))
        : (m = f[38]),
      m
    );
  }
  function U(e) {
    return e.tokenBalanceByMint[B]?.balanceRaw ?? null;
  }
  function E(e) {
    return e.user?.solBalanceLoaded ? (e.user.solBalance ?? 0) : null;
  }
  function $(e) {
    let n,
      a,
      s,
      l,
      p,
      b,
      g,
      _,
      v,
      y,
      h,
      w,
      S,
      x = (0, i.c)(71),
      {
        coin: B,
        autoFire: N,
        onAutoFired: k,
        onBuyAttempt: U,
        onActiveChange: E,
        className: $,
        variant: P,
        focusOnMount: Q,
        sourceScreen: C,
        sourceElement: I,
        absolutePosition: D,
        recommendationId: j,
      } = e,
      K = void 0 === P ? "solid" : P,
      z = void 0 !== Q && Q,
      [V, W] = (0, u.useState)(!0),
      {
        slippage: G,
        priorityFee: J,
        tipAmount: X,
        frontRunningProtection: H,
        holdToConfirm: Y,
      } = (0, f.f)(),
      { bondingCurve: Z, pool: ee } = (0, d.G)(
        B.mint,
        B.token_program,
        B.quote_mint,
        B.pool_address,
      ),
      et = !!Z?.complete && !ee && !(B.raydium_pool && !B.pump_swap_pool);
    x[0] !== Z || x[1] !== B.quote_mint
      ? ((n = Z?.quoteMint ? (0, A.k)(Z.quoteMint).toBase58() : B.quote_mint),
        (x[0] = Z),
        (x[1] = B.quote_mint),
        (x[2] = n))
      : (n = x[2]);
    let ei = n;
    (x[3] !== H || x[4] !== Y || x[5] !== J || x[6] !== G || x[7] !== X
      ? ((a = {
          slippage: G,
          priorityFee: J,
          tipAmount: X,
          frontRunningProtection: H,
          holdToConfirm: Y,
        }),
        (x[3] = H),
        (x[4] = Y),
        (x[5] = J),
        (x[6] = G),
        (x[7] = X),
        (x[8] = a))
      : (a = x[8]),
      x[9] !== et || x[10] !== ei || x[11] !== a
        ? ((s = {
            showOpenCoinToast: !0,
            isMigrationTrade: et,
            resolvedQuoteMint: ei,
            tradeSettings: a,
          }),
          (x[9] = et),
          (x[10] = ei),
          (x[11] = a),
          (x[12] = s))
        : (s = x[12]));
    let {
        handlePlaceTradeWithInputs: er,
        enqueueQuickTrade: en,
        isTradeLoading: eo,
        isPaymentRouted: ea,
      } = (0, m.f)(B, V, W, s),
      es = ea || !!(Z || ee),
      { address: eu, wallet: el } = (0, o.F)(),
      { autoApprove: ec } = (0, c.f)(),
      ed = !!eu && !!el && ec,
      {
        isSupported: em,
        quoteAmount: ef,
        isUsdcQuote: ep,
        isValidAmount: eb,
        insufficient: eg,
        isInsufficientFor: e_,
        addFunds: ev,
        buyLabel: ey,
        compactBuyLabel: eh,
        addFundsLabel: ew,
        iconSrc: eS,
      } = F(B, et, ei),
      [eA, ex] = (0, u.useState)(N && eb && !eg),
      eq = (0, u.useRef)(!1),
      eB = (0, u.useRef)(!1);
    x[13] !== N || x[14] !== eg || x[15] !== eb || x[16] !== ef || x[17] !== ep
      ? ((l = N && eb && !eg ? { amount: ef, spendsUsdc: ep } : null),
        (x[13] = N),
        (x[14] = eg),
        (x[15] = eb),
        (x[16] = ef),
        (x[17] = ep),
        (x[18] = l))
      : (l = x[18]);
    let eM = (0, u.useRef)(l);
    x[19] !== ef || x[20] !== ep
      ? ((p = () => {
          let e = eM.current;
          return e && e.spendsUsdc === ep ? e.amount : ef;
        }),
        (x[19] = ef),
        (x[20] = ep),
        (x[21] = p))
      : (p = x[21]);
    let eN = p,
      [ek, eT] = (0, u.useState)(0);
    x[22] !== D ||
    x[23] !== ev ||
    x[24] !== en ||
    x[25] !== er ||
    x[26] !== e_ ||
    x[27] !== j ||
    x[28] !== eN ||
    x[29] !== I ||
    x[30] !== C ||
    x[31] !== ed ||
    x[32] !== K
      ? ((b = () => {
          if (eq.current) return;
          ((eq.current = !0),
            queueMicrotask(() => {
              eq.current = !1;
            }),
            ex(!1));
          let e = eN();
          if (e_(e)) {
            ("row" === K || "rail" === K) && ev();
            return;
          }
          let t = new r.BN((0, q.d)(e));
          eT(R);
          let i = {
            sourceScreen: C,
            sourceElement: I,
            absolutePosition: D,
            recommendationId: j,
          };
          return Promise.resolve(
            ed ? en(t, !0, !0, i) : er(t, !0, !0, i),
          ).finally(() => eT(O));
        }),
        (x[22] = D),
        (x[23] = ev),
        (x[24] = en),
        (x[25] = er),
        (x[26] = e_),
        (x[27] = j),
        (x[28] = eN),
        (x[29] = I),
        (x[30] = C),
        (x[31] = ed),
        (x[32] = K),
        (x[33] = b))
      : (b = x[33]);
    let eL = b;
    (x[34] !== eo ||
    x[35] !== es ||
    x[36] !== em ||
    x[37] !== eb ||
    x[38] !== k ||
    x[39] !== eA ||
    x[40] !== eL
      ? ((_ = () => {
          if (eB.current || !eA || eo) return;
          let e = !em;
          (e || (es && eb)) &&
            ((eB.current = !0),
            k(),
            queueMicrotask(() => {
              e ? ex(!1) : eL();
            }));
        }),
        (g = [eA, es, eb, eo, em, eL, k]),
        (x[34] = eo),
        (x[35] = es),
        (x[36] = em),
        (x[37] = eb),
        (x[38] = k),
        (x[39] = eA),
        (x[40] = eL),
        (x[41] = g),
        (x[42] = _))
      : ((g = x[41]), (_ = x[42])),
      (0, u.useEffect)(_, g));
    let eF = eo || eA || ek > 0;
    (x[43] !== eF || x[44] !== E
      ? ((v = () => (E(eF), () => E(!1))),
        (y = [eF, E]),
        (x[43] = eF),
        (x[44] = E),
        (x[45] = v),
        (x[46] = y))
      : ((v = x[45]), (y = x[46])),
      (0, u.useEffect)(v, y),
      x[47] !== ev ||
      x[48] !== eg ||
      x[49] !== eo ||
      x[50] !== es ||
      x[51] !== eb ||
      x[52] !== U ||
      x[53] !== eL ||
      x[54] !== ef ||
      x[55] !== ep
        ? ((h = (e) => {
            if ((M(e), eb && !eo && !eq.current)) {
              if (eg) return void ev();
              if ((U(), (eM.current = { amount: ef, spendsUsdc: ep }), es))
                return void eL();
              ex(!0);
            }
          }),
          (x[47] = ev),
          (x[48] = eg),
          (x[49] = eo),
          (x[50] = es),
          (x[51] = eb),
          (x[52] = U),
          (x[53] = eL),
          (x[54] = ef),
          (x[55] = ep),
          (x[56] = h))
        : (h = x[56]));
    let eU = h,
      eE = "solid" !== K,
      e$ = eo || eg || (eA && !es),
      eO = eo
        ? "Buying…"
        : eg
          ? ew
          : eA && !es
            ? eE
              ? "…"
              : "Preparing…"
            : eE
              ? eh
              : ey,
      eR = B.name ?? B.mint,
      eP = ep ? eh : `${eh} SOL`;
    x[57] !== e$ || x[58] !== eR || x[59] !== eP || x[60] !== K
      ? ((w = { variant: K, coinName: eR, amountLabel: eP, isStateLabel: e$ }),
        (x[57] = e$),
        (x[58] = eR),
        (x[59] = eP),
        (x[60] = K),
        (x[61] = w))
      : (w = x[61]);
    let eQ = T(w);
    if (!em) return null;
    let eC = !eb || eo;
    return (
      x[62] !== eQ ||
      x[63] !== $ ||
      x[64] !== z ||
      x[65] !== eU ||
      x[66] !== eS ||
      x[67] !== eO ||
      x[68] !== eC ||
      x[69] !== K
        ? ((S = (0, t.jsx)(L, {
            label: eO,
            ariaLabel: eQ,
            focusOnMount: z,
            iconSrc: eS,
            variant: K,
            disabled: eC,
            onClick: eU,
            className: $,
          })),
          (x[62] = eQ),
          (x[63] = $),
          (x[64] = z),
          (x[65] = eU),
          (x[66] = eS),
          (x[67] = eO),
          (x[68] = eC),
          (x[69] = K),
          (x[70] = S))
        : (S = x[70]),
      S
    );
  }
  function O(e) {
    return Math.max(0, e - 1);
  }
  function R(e) {
    return e + 1;
  }
  function P(e) {
    return "idle" === e ? "warm" : e;
  }
  e.s([
    "default",
    0,
    function (e) {
      let r,
        n,
        o,
        a,
        s,
        l,
        c,
        d,
        m,
        f,
        p = (0, i.c)(54),
        {
          coin: g,
          className: _,
          variant: v,
          focusOnMount: y,
          onActiveChange: h,
          triggerOnMount: w,
          onTriggerConsumed: S,
          sourceScreen: A,
          sourceElement: x,
          absolutePosition: q,
          recommendationId: B,
        } = e,
        N = void 0 === v ? "solid" : v,
        k = void 0 !== y && y,
        U = void 0 !== w && w,
        {
          isSupported: E,
          insufficient: O,
          isUsdcQuote: R,
          addFunds: Q,
          buyLabel: C,
          compactBuyLabel: I,
          addFundsLabel: D,
          iconSrc: j,
        } = F(g);
      p[0] !== O || p[1] !== E || p[2] !== U
        ? ((r = () => (U && E && !O ? "fire" : "idle")),
          (p[0] = O),
          (p[1] = E),
          (p[2] = U),
          (p[3] = r))
        : (r = p[3]);
      let [K, z] = (0, u.useState)(r),
        [V, W] = (0, u.useState)(!1),
        G = (0, u.useRef)(!1),
        J = "solid" !== N,
        X = g.name ?? g.mint,
        H = R ? I : `${I} SOL`;
      p[4] !== O || p[5] !== X || p[6] !== H || p[7] !== N
        ? ((n = { variant: N, coinName: X, amountLabel: H, isStateLabel: O }),
          (p[4] = O),
          (p[5] = X),
          (p[6] = H),
          (p[7] = N),
          (p[8] = n))
        : (n = p[8]);
      let Y = T(n);
      p[9] !== g.mint ||
      p[10] !== g.program ||
      p[11] !== g.usd_market_cap ||
      p[12] !== x ||
      p[13] !== A
        ? ((o = () => {
            G.current ||
              ((G.current = !0),
              (0, b.Ie)({
                mint: g.mint,
                usdMarketCap: g.usd_market_cap ?? void 0,
                program: g.program,
                sourceScreen: A,
                sourceElement: x,
              }));
          }),
          (p[9] = g.mint),
          (p[10] = g.program),
          (p[11] = g.usd_market_cap),
          (p[12] = x),
          (p[13] = A),
          (p[14] = o))
        : (o = p[14]);
      let Z = o;
      p[15] !== h
        ? ((a = (e) => h?.(e)), (p[15] = h), (p[16] = a))
        : (a = p[16]);
      let ee = a;
      p[17] !== Q || p[18] !== O || p[19] !== E || p[20] !== S || p[21] !== Z
        ? ((s = () => {
            if ((S?.(), E)) {
              if (O) return void Q();
              Z();
            }
          }),
          (p[17] = Q),
          (p[18] = O),
          (p[19] = E),
          (p[20] = S),
          (p[21] = Z),
          (p[22] = s))
        : (s = p[22]);
      let et = (0, u.useEffectEvent)(s),
        ei = (0, u.useRef)(!1);
      if (
        (p[23] !== et || p[24] !== U
          ? ((l = () => {
              U && !ei.current && ((ei.current = !0), et());
            }),
            (p[23] = et),
            (p[24] = U),
            (p[25] = l))
          : (l = p[25]),
        p[26] !== U ? ((c = [U]), (p[26] = U), (p[27] = c)) : (c = p[27]),
        (0, u.useEffect)(l, c),
        !E)
      )
        return null;
      if ("idle" !== K) {
        let e,
          i,
          r = "fire" === K;
        p[28] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = () => z("warm")), (p[28] = e))
          : (e = p[28]);
        let n = k || V;
        return (
          p[29] !== q ||
          p[30] !== _ ||
          p[31] !== g ||
          p[32] !== ee ||
          p[33] !== B ||
          p[34] !== x ||
          p[35] !== A ||
          p[36] !== r ||
          p[37] !== n ||
          p[38] !== Z ||
          p[39] !== N
            ? ((i = (0, t.jsx)($, {
                coin: g,
                autoFire: r,
                onAutoFired: e,
                onBuyAttempt: Z,
                onActiveChange: ee,
                className: _,
                variant: N,
                focusOnMount: n,
                sourceScreen: A,
                sourceElement: x,
                absolutePosition: q,
                recommendationId: B,
              })),
              (p[29] = q),
              (p[30] = _),
              (p[31] = g),
              (p[32] = ee),
              (p[33] = B),
              (p[34] = x),
              (p[35] = A),
              (p[36] = r),
              (p[37] = n),
              (p[38] = Z),
              (p[39] = N),
              (p[40] = i))
            : (i = p[40]),
          i
        );
      }
      let er = O ? D : J ? I : C;
      return (
        p[41] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = (e) => {
              ("focus" === e && W(!0), z(P));
            }),
            (p[41] = d))
          : (d = p[41]),
        p[42] !== Q || p[43] !== O || p[44] !== Z
          ? ((m = (e) => {
              (M(e), O) ? Q() : (Z(), z("fire"));
            }),
            (p[42] = Q),
            (p[43] = O),
            (p[44] = Z),
            (p[45] = m))
          : (m = p[45]),
        p[46] !== _ ||
        p[47] !== k ||
        p[48] !== j ||
        p[49] !== Y ||
        p[50] !== er ||
        p[51] !== m ||
        p[52] !== N
          ? ((f = (0, t.jsx)(L, {
              label: er,
              ariaLabel: Y,
              focusOnMount: k,
              iconSrc: j,
              variant: N,
              onEngage: d,
              onClick: m,
              className: _,
            })),
            (p[46] = _),
            (p[47] = k),
            (p[48] = j),
            (p[49] = Y),
            (p[50] = er),
            (p[51] = m),
            (p[52] = N),
            (p[53] = f))
          : (f = p[53]),
        f
      );
    },
    "suppressCardNavigation",
    0,
    M,
  ]);
};
