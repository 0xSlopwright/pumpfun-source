// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242);
  e.i(353110);
  var o = e.i(648470),
    n = e.i(745018),
    r = e.i(574472),
    u = e.i(928529),
    a = e.i(599077),
    l = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    c = e.i(887009),
    d = e.i(328242),
    m = e.i(988801),
    p = e.i(996567),
    f = e.i(790431),
    b = e.i(595673),
    g = e.i(338319),
    v = e.i(198825),
    y = e.i(51954),
    h = e.i(538459),
    _ = e.i(367310),
    x = e.i(102250),
    A = e.i(187611),
    q = e.i(655397),
    S = e.i(449597),
    M = e.i(709481);
  let k = (0, q.p)().toBase58();
  function w(e) {
    (e.preventDefault(),
      e.stopPropagation(),
      e.nativeEvent.stopImmediatePropagation());
  }
  let L =
      "flex h-7 min-w-16 items-center justify-center gap-1 rounded-lg border border-gain/40 px-2 text-xs font-semibold leading-4 tabular-nums text-gain transition-colors hover:bg-gain hover:text-bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent disabled:cursor-not-allowed disabled:opacity-70",
    B = {
      solid:
        "flex items-center justify-center gap-1.5 rounded-full bg-bg-accent px-4 py-2 text-sm font-semibold text-bg-primary shadow-lg shadow-black/30 transition-[transform,filter] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
      feed: "flex h-8 items-center justify-center gap-2 rounded-lg border border-border-tertiary bg-white/[0.05] px-3 text-xs font-medium leading-4 text-[#86EFAC] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-70",
      row: L,
      rail: L,
    },
    F = (e) => {
      let t,
        o = (0, i.c)(4),
        { variant: n, coinName: r, amountLabel: u, isStateLabel: a } = e,
        { t: l } = (0, s.f)();
      if ("solid" !== n && "feed" !== n && !a)
        return (
          o[0] !== u || o[1] !== r || o[2] !== l
            ? ((t = l("web.home.row_quick_buy_aria", {
                amount: (0, A.T)(u, "number-format"),
                coin_name: (0, A.T)(r, "coin-name"),
              })),
              (o[0] = u),
              (o[1] = r),
              (o[2] = l),
              (o[3] = t))
            : (t = o[3]),
          t
        );
    };
  function R(e) {
    let o,
      r,
      a,
      s,
      c,
      d,
      m,
      p,
      f = (0, i.c)(23),
      {
        label: b,
        disabled: v,
        onClick: y,
        onEngage: h,
        className: _,
        iconSrc: x,
        variant: A,
        ariaLabel: q,
        focusOnMount: S,
      } = e,
      M = void 0 === A ? "solid" : A,
      k = void 0 !== S && S,
      w = (0, l.useRef)(null);
    (f[0] !== k
      ? ((o = () => {
          if (!k) return;
          let e = document.activeElement;
          (null === e || e === document.body) && w.current?.focus();
        }),
        (r = [k]),
        (f[0] = k),
        (f[1] = o),
        (f[2] = r))
      : ((o = f[1]), (r = f[2])),
      (0, l.useLayoutEffect)(o, r),
      f[3] !== h
        ? ((a = () => h?.("pointer")),
          (s = () => h?.("focus")),
          (f[3] = h),
          (f[4] = a),
          (f[5] = s))
        : ((a = f[4]), (s = f[5])));
    let L = B[M];
    return (
      (f[6] !== _ || f[7] !== L
        ? ((c = (0, g.c)(L, _)), (f[6] = _), (f[7] = L), (f[8] = c))
        : (c = f[8]),
      f[9] !== x || f[10] !== M)
        ? ((d =
            "solid" !== M
              ? (0, t.jsx)(n.$U, {
                  "aria-hidden": !0,
                  className:
                    "feed" === M ? "size-4 shrink-0" : "size-3 shrink-0",
                })
              : x &&
                (0, t.jsx)(u.default, {
                  src: x,
                  alt: "",
                  width: 16,
                  height: 16,
                  "aria-hidden": !0,
                  className: "size-4 shrink-0 rounded-full",
                })),
          (f[9] = x),
          (f[10] = M),
          (f[11] = d))
        : (d = f[11]),
      f[12] !== b
        ? ((m = (0, t.jsx)("span", {
            className: "whitespace-nowrap",
            children: b,
          })),
          (f[12] = b),
          (f[13] = m))
        : (m = f[13]),
      f[14] !== q ||
      f[15] !== v ||
      f[16] !== y ||
      f[17] !== m ||
      f[18] !== a ||
      f[19] !== s ||
      f[20] !== c ||
      f[21] !== d
        ? ((p = (0, t.jsxs)("button", {
            ref: w,
            type: "button",
            "aria-label": q,
            onClick: y,
            onPointerEnter: a,
            onFocus: s,
            disabled: v,
            className: c,
            children: [d, m],
          })),
          (f[14] = q),
          (f[15] = v),
          (f[16] = y),
          (f[17] = m),
          (f[18] = a),
          (f[19] = s),
          (f[20] = c),
          (f[21] = d),
          (f[22] = p))
        : (p = f[22]),
      p
    );
  }
  function E(e, t, o) {
    let n,
      u,
      l,
      s,
      c,
      d,
      m,
      p = (0, i.c)(39),
      b = void 0 !== t && t,
      g = o ?? e.quote_mint,
      A = (0, h.r)(),
      q = (0, h.E)(),
      { address: w } = (0, r.F)(),
      { setShowDeposit: L } = (0, v.useConnectWallet)(),
      B = (0, a.useRouter)(),
      F = (0, y.f)(O),
      R = (0, y.f)(N),
      E = (0, _.k)(),
      P = (0, x.o)(),
      U = !1 !== e.initialized;
    if (
      p[0] !== e.mint ||
      p[1] !== e.program ||
      p[2] !== e.raydium_pool ||
      p[3] !== U ||
      p[4] !== b ||
      p[5] !== E ||
      p[6] !== g ||
      p[7] !== P
    ) {
      let t,
        i = (0, S.Y)(g);
      (p[9] !== e.program || p[10] !== e.raydium_pool
        ? ((t = (0, f.d)({ program: e.program, raydium_pool: e.raydium_pool })),
          (p[9] = e.program),
          (p[10] = e.raydium_pool),
          (p[11] = t))
        : (t = p[11]),
        (n = (0, f.r)({
          prefersUsdc: E,
          isUsdcQuote: i,
          isPumpVenue: "pump" === t,
          isEstablished: U,
          isMigration: b,
          paymentRoutingDisabled: !1,
          walletFailsSponsoredSigning: P,
          selfAsset: (0, f.T)(e.mint),
        })),
        (p[0] = e.mint),
        (p[1] = e.program),
        (p[2] = e.raydium_pool),
        (p[3] = U),
        (p[4] = b),
        (p[5] = E),
        (p[6] = g),
        (p[7] = P),
        (p[8] = n));
    } else n = p[8];
    let Q = n,
      T = U && !b ? Q : null;
    p[12] !== T || p[13] !== g || p[14] !== A || p[15] !== q
      ? ((u = (0, M.o)({
          quoteMintAddress: g,
          solAmount: A,
          usdcAmount: q,
          paymentOverride: T,
        })),
        (p[12] = T),
        (p[13] = g),
        (p[14] = A),
        (p[15] = q),
        (p[16] = u))
      : (u = p[16]);
    let j = u;
    p[17] !== j.quoteAmount
      ? ((l = Number.isFinite(j.quoteAmount) && j.quoteAmount > 0),
        (p[17] = j.quoteAmount),
        (p[18] = l))
      : (l = p[18]);
    let C = l;
    p[19] !== w ||
    p[20] !== j.isUsdcQuote ||
    p[21] !== j.quoteDecimals ||
    p[22] !== F ||
    p[23] !== R
      ? ((s = (e) =>
          !!w &&
          Number.isFinite(e) &&
          e > 0 &&
          (0, M.Q)({
            isUsdcQuote: j.isUsdcQuote,
            quoteAmount: e,
            quoteDecimals: j.quoteDecimals,
            solBalanceLamports: F,
            usdcBalanceRaw: R,
          })),
        (p[19] = w),
        (p[20] = j.isUsdcQuote),
        (p[21] = j.quoteDecimals),
        (p[22] = F),
        (p[23] = R),
        (p[24] = s))
      : (s = p[24]);
    let D = s;
    p[25] !== j.quoteAmount || p[26] !== D || p[27] !== C
      ? ((c = C && D(j.quoteAmount)),
        (p[25] = j.quoteAmount),
        (p[26] = D),
        (p[27] = C),
        (p[28] = c))
      : (c = p[28]);
    let $ = c;
    p[29] !== j.isUsdcQuote || p[30] !== B || p[31] !== L
      ? ((d = () => {
          j.isUsdcQuote ? B.push(`/coin/${k}`) : L(!0);
        }),
        (p[29] = j.isUsdcQuote),
        (p[30] = B),
        (p[31] = L),
        (p[32] = d))
      : (d = p[32]);
    let z = d;
    return (
      p[33] !== z || p[34] !== j || p[35] !== $ || p[36] !== D || p[37] !== C
        ? ((m = {
            ...j,
            isValidAmount: C,
            insufficient: $,
            isInsufficientFor: D,
            addFunds: z,
          }),
          (p[33] = z),
          (p[34] = j),
          (p[35] = $),
          (p[36] = D),
          (p[37] = C),
          (p[38] = m))
        : (m = p[38]),
      m
    );
  }
  function N(e) {
    return e.tokenBalanceByMint[k]?.balanceRaw ?? null;
  }
  function O(e) {
    return e.user?.solBalanceLoaded ? (e.user.solBalance ?? 0) : null;
  }
  function P(e) {
    let n,
      u,
      a,
      s,
      f,
      b,
      g,
      v,
      y,
      h,
      _,
      x,
      A,
      S = (0, i.c)(71),
      {
        coin: k,
        autoFire: L,
        onAutoFired: B,
        onBuyAttempt: N,
        onActiveChange: O,
        className: P,
        variant: T,
        focusOnMount: j,
        sourceScreen: C,
        sourceElement: D,
        absolutePosition: $,
        recommendationId: z,
      } = e,
      I = void 0 === T ? "solid" : T,
      H = void 0 !== j && j,
      [K, X] = (0, l.useState)(!0),
      {
        slippage: Y,
        priorityFee: G,
        tipAmount: W,
        frontRunningProtection: V,
        holdToConfirm: J,
      } = (0, p.f)(),
      { bondingCurve: Z, pool: ee } = (0, d.G)(
        k.mint,
        k.token_program,
        k.quote_mint,
        k.pool_address,
      ),
      et = !!Z?.complete && !ee && !(k.raydium_pool && !k.pump_swap_pool);
    S[0] !== Z || S[1] !== k.quote_mint
      ? ((n = Z?.quoteMint ? (0, q.k)(Z.quoteMint).toBase58() : k.quote_mint),
        (S[0] = Z),
        (S[1] = k.quote_mint),
        (S[2] = n))
      : (n = S[2]);
    let ei = n;
    (S[3] !== V || S[4] !== J || S[5] !== G || S[6] !== Y || S[7] !== W
      ? ((u = {
          slippage: Y,
          priorityFee: G,
          tipAmount: W,
          frontRunningProtection: V,
          holdToConfirm: J,
        }),
        (S[3] = V),
        (S[4] = J),
        (S[5] = G),
        (S[6] = Y),
        (S[7] = W),
        (S[8] = u))
      : (u = S[8]),
      S[9] !== et || S[10] !== ei || S[11] !== u
        ? ((a = {
            showOpenCoinToast: !0,
            isMigrationTrade: et,
            resolvedQuoteMint: ei,
            tradeSettings: u,
          }),
          (S[9] = et),
          (S[10] = ei),
          (S[11] = u),
          (S[12] = a))
        : (a = S[12]));
    let {
        handlePlaceTradeWithInputs: eo,
        enqueueQuickTrade: en,
        isTradeLoading: er,
        isPaymentRouted: eu,
      } = (0, m.f)(k, K, X, a),
      ea = eu || !!(Z || ee),
      { address: el, wallet: es } = (0, r.F)(),
      { autoApprove: ec } = (0, c.f)(),
      ed = !!el && !!es && ec,
      {
        isSupported: em,
        quoteAmount: ep,
        isUsdcQuote: ef,
        isValidAmount: eb,
        insufficient: eg,
        isInsufficientFor: ev,
        addFunds: ey,
        buyLabel: eh,
        compactBuyLabel: e_,
        addFundsLabel: ex,
        iconSrc: eA,
      } = E(k, et, ei),
      [eq, eS] = (0, l.useState)(L && eb && !eg),
      eM = (0, l.useRef)(!1),
      ek = (0, l.useRef)(!1);
    S[13] !== L || S[14] !== eg || S[15] !== eb || S[16] !== ep || S[17] !== ef
      ? ((s = L && eb && !eg ? { amount: ep, spendsUsdc: ef } : null),
        (S[13] = L),
        (S[14] = eg),
        (S[15] = eb),
        (S[16] = ep),
        (S[17] = ef),
        (S[18] = s))
      : (s = S[18]);
    let ew = (0, l.useRef)(s);
    S[19] !== ep || S[20] !== ef
      ? ((f = () => {
          let e = ew.current;
          return e && e.spendsUsdc === ef ? e.amount : ep;
        }),
        (S[19] = ep),
        (S[20] = ef),
        (S[21] = f))
      : (f = S[21]);
    let eL = f,
      [eB, eF] = (0, l.useState)(0);
    S[22] !== $ ||
    S[23] !== ey ||
    S[24] !== en ||
    S[25] !== eo ||
    S[26] !== ev ||
    S[27] !== z ||
    S[28] !== eL ||
    S[29] !== D ||
    S[30] !== C ||
    S[31] !== ed ||
    S[32] !== I
      ? ((b = () => {
          if (eM.current) return;
          ((eM.current = !0),
            queueMicrotask(() => {
              eM.current = !1;
            }),
            eS(!1));
          let e = eL();
          if (ev(e)) {
            ("row" === I || "rail" === I) && ey();
            return;
          }
          let t = new o.BN((0, M.d)(e));
          eF(Q);
          let i = {
            sourceScreen: C,
            sourceElement: D,
            absolutePosition: $,
            recommendationId: z,
          };
          return Promise.resolve(
            ed ? en(t, !0, !0, i) : eo(t, !0, !0, i),
          ).finally(() => eF(U));
        }),
        (S[22] = $),
        (S[23] = ey),
        (S[24] = en),
        (S[25] = eo),
        (S[26] = ev),
        (S[27] = z),
        (S[28] = eL),
        (S[29] = D),
        (S[30] = C),
        (S[31] = ed),
        (S[32] = I),
        (S[33] = b))
      : (b = S[33]);
    let eR = b;
    (S[34] !== er ||
    S[35] !== ea ||
    S[36] !== em ||
    S[37] !== eb ||
    S[38] !== B ||
    S[39] !== eq ||
    S[40] !== eR
      ? ((v = () => {
          if (ek.current || !eq || er) return;
          let e = !em;
          (e || (ea && eb)) &&
            ((ek.current = !0),
            B(),
            queueMicrotask(() => {
              e ? eS(!1) : eR();
            }));
        }),
        (g = [eq, ea, eb, er, em, eR, B]),
        (S[34] = er),
        (S[35] = ea),
        (S[36] = em),
        (S[37] = eb),
        (S[38] = B),
        (S[39] = eq),
        (S[40] = eR),
        (S[41] = g),
        (S[42] = v))
      : ((g = S[41]), (v = S[42])),
      (0, l.useEffect)(v, g));
    let eE = er || eq || eB > 0;
    (S[43] !== eE || S[44] !== O
      ? ((y = () => (O(eE), () => O(!1))),
        (h = [eE, O]),
        (S[43] = eE),
        (S[44] = O),
        (S[45] = y),
        (S[46] = h))
      : ((y = S[45]), (h = S[46])),
      (0, l.useEffect)(y, h),
      S[47] !== ey ||
      S[48] !== eg ||
      S[49] !== er ||
      S[50] !== ea ||
      S[51] !== eb ||
      S[52] !== N ||
      S[53] !== eR ||
      S[54] !== ep ||
      S[55] !== ef
        ? ((_ = (e) => {
            if ((w(e), eb && !er && !eM.current)) {
              if (eg) return void ey();
              if ((N(), (ew.current = { amount: ep, spendsUsdc: ef }), ea))
                return void eR();
              eS(!0);
            }
          }),
          (S[47] = ey),
          (S[48] = eg),
          (S[49] = er),
          (S[50] = ea),
          (S[51] = eb),
          (S[52] = N),
          (S[53] = eR),
          (S[54] = ep),
          (S[55] = ef),
          (S[56] = _))
        : (_ = S[56]));
    let eN = _,
      eO = "solid" !== I,
      eP = er || eg || (eq && !ea),
      eU = er
        ? "Buying…"
        : eg
          ? ex
          : eq && !ea
            ? eO
              ? "…"
              : "Preparing…"
            : eO
              ? e_
              : eh,
      eQ = k.name ?? k.mint,
      eT = ef ? e_ : `${e_} SOL`;
    S[57] !== eP || S[58] !== eQ || S[59] !== eT || S[60] !== I
      ? ((x = { variant: I, coinName: eQ, amountLabel: eT, isStateLabel: eP }),
        (S[57] = eP),
        (S[58] = eQ),
        (S[59] = eT),
        (S[60] = I),
        (S[61] = x))
      : (x = S[61]);
    let ej = F(x);
    if (!em) return null;
    let eC = !eb || er;
    return (
      S[62] !== ej ||
      S[63] !== P ||
      S[64] !== H ||
      S[65] !== eN ||
      S[66] !== eA ||
      S[67] !== eU ||
      S[68] !== eC ||
      S[69] !== I
        ? ((A = (0, t.jsx)(R, {
            label: eU,
            ariaLabel: ej,
            focusOnMount: H,
            iconSrc: eA,
            variant: I,
            disabled: eC,
            onClick: eN,
            className: P,
          })),
          (S[62] = ej),
          (S[63] = P),
          (S[64] = H),
          (S[65] = eN),
          (S[66] = eA),
          (S[67] = eU),
          (S[68] = eC),
          (S[69] = I),
          (S[70] = A))
        : (A = S[70]),
      A
    );
  }
  function U(e) {
    return Math.max(0, e - 1);
  }
  function Q(e) {
    return e + 1;
  }
  function T(e) {
    return "idle" === e ? "warm" : e;
  }
  e.s([
    "default",
    0,
    function (e) {
      let o,
        n,
        r,
        u,
        a,
        s,
        c,
        d,
        m,
        p,
        f = (0, i.c)(54),
        {
          coin: g,
          className: v,
          variant: y,
          focusOnMount: h,
          onActiveChange: _,
          triggerOnMount: x,
          onTriggerConsumed: A,
          sourceScreen: q,
          sourceElement: S,
          absolutePosition: M,
          recommendationId: k,
        } = e,
        L = void 0 === y ? "solid" : y,
        B = void 0 !== h && h,
        N = void 0 !== x && x,
        {
          isSupported: O,
          insufficient: U,
          isUsdcQuote: Q,
          addFunds: j,
          buyLabel: C,
          compactBuyLabel: D,
          addFundsLabel: $,
          iconSrc: z,
        } = E(g);
      f[0] !== U || f[1] !== O || f[2] !== N
        ? ((o = () => (N && O && !U ? "fire" : "idle")),
          (f[0] = U),
          (f[1] = O),
          (f[2] = N),
          (f[3] = o))
        : (o = f[3]);
      let [I, H] = (0, l.useState)(o),
        [K, X] = (0, l.useState)(!1),
        Y = (0, l.useRef)(!1),
        G = "solid" !== L,
        W = g.name ?? g.mint,
        V = Q ? D : `${D} SOL`;
      f[4] !== U || f[5] !== W || f[6] !== V || f[7] !== L
        ? ((n = { variant: L, coinName: W, amountLabel: V, isStateLabel: U }),
          (f[4] = U),
          (f[5] = W),
          (f[6] = V),
          (f[7] = L),
          (f[8] = n))
        : (n = f[8]);
      let J = F(n);
      f[9] !== g.mint ||
      f[10] !== g.program ||
      f[11] !== g.usd_market_cap ||
      f[12] !== S ||
      f[13] !== q
        ? ((r = () => {
            Y.current ||
              ((Y.current = !0),
              (0, b.Ie)({
                mint: g.mint,
                usdMarketCap: g.usd_market_cap ?? void 0,
                program: g.program,
                sourceScreen: q,
                sourceElement: S,
              }));
          }),
          (f[9] = g.mint),
          (f[10] = g.program),
          (f[11] = g.usd_market_cap),
          (f[12] = S),
          (f[13] = q),
          (f[14] = r))
        : (r = f[14]);
      let Z = r;
      f[15] !== _
        ? ((u = (e) => _?.(e)), (f[15] = _), (f[16] = u))
        : (u = f[16]);
      let ee = u;
      f[17] !== j || f[18] !== U || f[19] !== O || f[20] !== A || f[21] !== Z
        ? ((a = () => {
            if ((A?.(), O)) {
              if (U) return void j();
              Z();
            }
          }),
          (f[17] = j),
          (f[18] = U),
          (f[19] = O),
          (f[20] = A),
          (f[21] = Z),
          (f[22] = a))
        : (a = f[22]);
      let et = (0, l.useEffectEvent)(a),
        ei = (0, l.useRef)(!1);
      if (
        (f[23] !== et || f[24] !== N
          ? ((s = () => {
              N && !ei.current && ((ei.current = !0), et());
            }),
            (f[23] = et),
            (f[24] = N),
            (f[25] = s))
          : (s = f[25]),
        f[26] !== N ? ((c = [N]), (f[26] = N), (f[27] = c)) : (c = f[27]),
        (0, l.useEffect)(s, c),
        !O)
      )
        return null;
      if ("idle" !== I) {
        let e,
          i,
          o = "fire" === I;
        f[28] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = () => H("warm")), (f[28] = e))
          : (e = f[28]);
        let n = B || K;
        return (
          f[29] !== M ||
          f[30] !== v ||
          f[31] !== g ||
          f[32] !== ee ||
          f[33] !== k ||
          f[34] !== S ||
          f[35] !== q ||
          f[36] !== o ||
          f[37] !== n ||
          f[38] !== Z ||
          f[39] !== L
            ? ((i = (0, t.jsx)(P, {
                coin: g,
                autoFire: o,
                onAutoFired: e,
                onBuyAttempt: Z,
                onActiveChange: ee,
                className: v,
                variant: L,
                focusOnMount: n,
                sourceScreen: q,
                sourceElement: S,
                absolutePosition: M,
                recommendationId: k,
              })),
              (f[29] = M),
              (f[30] = v),
              (f[31] = g),
              (f[32] = ee),
              (f[33] = k),
              (f[34] = S),
              (f[35] = q),
              (f[36] = o),
              (f[37] = n),
              (f[38] = Z),
              (f[39] = L),
              (f[40] = i))
            : (i = f[40]),
          i
        );
      }
      let eo = U ? $ : G ? D : C;
      return (
        f[41] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = (e) => {
              ("focus" === e && X(!0), H(T));
            }),
            (f[41] = d))
          : (d = f[41]),
        f[42] !== j || f[43] !== U || f[44] !== Z
          ? ((m = (e) => {
              (w(e), U) ? j() : (Z(), H("fire"));
            }),
            (f[42] = j),
            (f[43] = U),
            (f[44] = Z),
            (f[45] = m))
          : (m = f[45]),
        f[46] !== v ||
        f[47] !== B ||
        f[48] !== z ||
        f[49] !== J ||
        f[50] !== eo ||
        f[51] !== m ||
        f[52] !== L
          ? ((p = (0, t.jsx)(R, {
              label: eo,
              ariaLabel: J,
              focusOnMount: B,
              iconSrc: z,
              variant: L,
              onEngage: d,
              onClick: m,
              className: v,
            })),
            (f[46] = v),
            (f[47] = B),
            (f[48] = z),
            (f[49] = J),
            (f[50] = eo),
            (f[51] = m),
            (f[52] = L),
            (f[53] = p))
          : (p = f[53]),
        p
      );
    },
    "suppressCardNavigation",
    0,
    w,
  ]);
};
