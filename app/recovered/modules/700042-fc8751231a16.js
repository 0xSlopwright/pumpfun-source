// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(732486),
    s = t.i(445242),
    a = t.i(439587),
    l = t.i(365089),
    i = t.i(574472),
    n = t.i(352386);
  t.i(12692);
  var m = t.i(398902);
  t.i(12641);
  var c = t.i(34011),
    u = t.i(196551),
    r = t.i(167958),
    h = t.i(724423),
    o = t.i(248496),
    b = t.i(656846),
    d = t.i(107956),
    j = t.i(357500),
    p = t.i(292686),
    v = t.i(604608),
    k = t.i(690877),
    f = t.i(85324),
    x = t.i(707138),
    y = t.i(892994),
    g = t.i(97326),
    P = t.i(466931),
    _ = t.i(670550),
    w = t.i(399015),
    z = t.i(460261),
    q = t.i(844469),
    C = t.i(84976),
    N = t.i(163742);
  let A = /^\d+$/,
    I = (0, C.g)({ mint: w.W, direction: "sell" }),
    E = {
      mint: b.f.mint,
      name: b.f.name,
      symbol: b.f.symbol,
      image_uri: b.f.imageUri,
    },
    U = (t) =>
      void 0 !== t && A.test(t) ? (0, N.E)(BigInt(t), (0, C.q)(I)) : null,
    S = async (t) => {
      let e = await (0, z.E)(t);
      if ("error" === e.kind)
        throw new z.X(e.message, { reason: e.reason, status: e.status });
      return e.data;
    };
  var $ = t.i(90832),
    K = t.i(955332);
  let B = {
      mint: b.f.mint,
      name: b.f.name,
      symbol: b.f.symbol,
      image_uri: b.f.imageUri,
    },
    R = (t) => `${(0, $.p)(t, 2)} ${b.f.symbol}`;
  function O(t) {
    let a,
      l,
      i,
      n,
      c,
      u,
      r = (0, s.c)(18),
      { model: h } = t,
      { t: d } = (0, m.f)(),
      { preview: j, amountAtomic: p, isInsufficient: v } = h,
      k = null !== p && p > BigInt(0) && !v;
    return (
      r[0] !== d
        ? ((a = d("trade.price_impact_override.you_receive")),
          (r[0] = d),
          (r[1] = a))
        : (a = r[1]),
      r[2] !== a
        ? ((l = (0, e.jsx)("span", {
            className: "text-sm leading-5 text-text-secondary",
            children: a,
          })),
          (r[2] = a),
          (r[3] = l))
        : (l = r[3]),
      r[4] !== j.isPricing || r[5] !== j.outputUi || r[6] !== k
        ? ((i = j.isPricing
            ? (0, e.jsx)(o.l, { height: 20, width: 112 })
            : (0, e.jsx)("span", {
                "data-testid": "native-convert-receive-amount",
                className:
                  "text-xl font-medium leading-7 tabular-nums text-text-primary",
                children:
                  k && null !== j.outputUi
                    ? `≈ ${R(j.outputUi)}`
                    : `— ${b.f.symbol}`,
              })),
          (r[4] = j.isPricing),
          (r[5] = j.outputUi),
          (r[6] = k),
          (r[7] = i))
        : (i = r[7]),
      r[8] !== l || r[9] !== i
        ? ((n = (0, e.jsxs)("div", {
            className: "flex h-11 items-center justify-between gap-3",
            children: [l, i],
          })),
          (r[8] = l),
          (r[9] = i),
          (r[10] = n))
        : (n = r[10]),
      r[11] !== j.minOutputUi || r[12] !== k || r[13] !== d
        ? ((c =
            k && null !== j.minOutputUi
              ? (0, e.jsxs)("div", {
                  className:
                    "flex items-center justify-between gap-3 text-xs leading-4 text-text-tertiary",
                  children: [
                    (0, e.jsx)("span", {
                      children: d("web.trade.min_received"),
                    }),
                    (0, e.jsx)("span", {
                      "data-testid": "native-convert-min-received",
                      className: "tabular-nums",
                      children: R(j.minOutputUi),
                    }),
                  ],
                })
              : null),
          (r[11] = j.minOutputUi),
          (r[12] = k),
          (r[13] = d),
          (r[14] = c))
        : (c = r[14]),
      r[15] !== n || r[16] !== c
        ? ((u = (0, e.jsxs)("div", {
            className: "flex flex-col gap-1",
            "data-testid": "native-convert-receive",
            "aria-live": "polite",
            children: [n, c],
          })),
          (r[15] = n),
          (r[16] = c),
          (r[17] = u))
        : (u = r[17]),
      u
    );
  }
  function T(t) {
    let a,
      i,
      n = (0, s.c)(7),
      { chainId: c, evmWalletAddress: u, mappedEvmAddress: r } = t,
      { t: h } = (0, m.f)();
    return (
      n[0] !== c || n[1] !== u || n[2] !== r || n[3] !== h
        ? ((a = h("web.trade.evm_wallet_diverged_notice", {
            chain_name: (0, _.A)(c)?.chainName ?? "",
            address: (0, l.d)(u, 8, 4),
            mapped_address: (0, l.d)(r, 8, 4),
          })),
          (n[0] = c),
          (n[1] = u),
          (n[2] = r),
          (n[3] = h),
          (n[4] = a))
        : (a = n[4]),
      n[5] !== a
        ? ((i = (0, e.jsx)("p", {
            role: "note",
            "data-testid": "native-convert-wallet-note",
            className: "text-xs leading-4 text-text-tertiary",
            children: a,
          })),
          (n[5] = a),
          (n[6] = i))
        : (i = n[6]),
      i
    );
  }
  function F(t) {
    let l,
      i,
      o,
      d,
      j,
      p,
      v,
      k,
      f,
      x,
      y,
      g,
      P,
      w,
      z,
      q,
      C,
      N,
      A,
      I,
      E,
      U,
      S,
      K,
      R,
      T,
      F = (0, s.c)(85),
      { model: W, chainId: D, onCancel: M, walletNote: Q } = t,
      { t: L } = (0, m.f)(),
      Z = (0, n.useId)(),
      {
        token: V,
        amount: X,
        setAmount: G,
        fillMax: H,
        spendableAtomic: J,
        spendableUi: Y,
        isInsufficient: tt,
        isBalanceError: te,
        preview: ts,
        canSubmit: ta,
        isSubmitting: tl,
        submit: ti,
      } = W,
      tn = V?.symbol ?? "";
    F[0] !== te || F[1] !== tt || F[2] !== ts || F[3] !== L
      ? ((l = tt
          ? L("trade.errors.insufficient_funds")
          : te
            ? L("web.wallet.balance_load_failed")
            : ts.errorMessage),
        (F[0] = te),
        (F[1] = tt),
        (F[2] = ts),
        (F[3] = L),
        (F[4] = l))
      : (l = F[4]);
    let tm = l,
      tc = null !== J && J > BigInt(0);
    (F[5] !== L ? ((i = L("common.from")), (F[5] = L), (F[6] = i)) : (i = F[6]),
      F[7] !== D ? ((o = (0, _.x)(D)), (F[7] = D), (F[8] = o)) : (o = F[8]));
    let tu = V?.name,
      tr = V?.imageUri,
      th = String(D);
    (F[9] !== tn || F[10] !== o || F[11] !== tu || F[12] !== tr || F[13] !== th
      ? ((d = (0, e.jsx)(c.CoinAvatar, {
          coin: { mint: o, name: tu, symbol: tn, image_uri: tr, chain_id: th },
          size: 20,
          seal: "none",
        })),
        (F[9] = tn),
        (F[10] = o),
        (F[11] = tu),
        (F[12] = tr),
        (F[13] = th),
        (F[14] = d))
      : (d = F[14]),
      F[15] !== L
        ? ((j = L("common.balance")), (F[15] = L), (F[16] = j))
        : (j = F[16]),
      F[17] !== Y || F[18] !== tn
        ? ((p = null === Y ? "—" : `${(0, $.p)(Y, 6)} ${tn}`),
          (F[17] = Y),
          (F[18] = tn),
          (F[19] = p))
        : (p = F[19]),
      F[20] !== Z || F[21] !== j || F[22] !== p
        ? ((v = (0, e.jsxs)("span", {
            id: Z,
            "data-testid": "native-convert-balance",
            className:
              "ml-auto text-xs leading-4 tabular-nums text-text-tertiary",
            children: [j, ":", " ", p],
          })),
          (F[20] = Z),
          (F[21] = j),
          (F[22] = p),
          (F[23] = v))
        : (v = F[23]),
      F[24] !== tn || F[25] !== v || F[26] !== i || F[27] !== d
        ? ((k = (0, e.jsx)(u.f, { label: i, symbol: tn, art: d, trailing: v })),
          (F[24] = tn),
          (F[25] = v),
          (F[26] = i),
          (F[27] = d),
          (F[28] = k))
        : (k = F[28]),
      F[29] !== tn || F[30] !== L
        ? ((f = L("trade.enter_amount_in_currency", { symbol: tn })),
          (F[29] = tn),
          (F[30] = L),
          (F[31] = f))
        : (f = F[31]));
    let to = null !== tm;
    F[32] !== tn
      ? ((x = (0, e.jsx)("span", {
          "aria-hidden": !0,
          className: "text-xs font-medium leading-4 text-text-tertiary",
          children: tn,
        })),
        (F[32] = tn),
        (F[33] = x))
      : (x = F[33]);
    let tb = !tc || tl;
    (F[34] !== L
      ? ((y = L("common.max")), (F[34] = L), (F[35] = y))
      : (y = F[35]),
      F[36] !== H || F[37] !== tb || F[38] !== y
        ? ((g = (0, e.jsx)(a.K, {
            variant: "ghost",
            size: 32,
            "data-testid": "native-convert-max",
            onClick: H,
            isDisabled: tb,
            children: y,
          })),
          (F[36] = H),
          (F[37] = tb),
          (F[38] = y),
          (F[39] = g))
        : (g = F[39]),
      F[40] !== x || F[41] !== g
        ? ((P = (0, e.jsxs)(e.Fragment, { children: [x, g] })),
          (F[40] = x),
          (F[41] = g),
          (F[42] = P))
        : (P = F[42]),
      F[43] !== X ||
      F[44] !== Z ||
      F[45] !== tm ||
      F[46] !== tl ||
      F[47] !== G ||
      F[48] !== f ||
      F[49] !== to ||
      F[50] !== P
        ? ((w = (0, e.jsx)(h.N, {
            density: "comfortable",
            "data-testid": "native-convert-amount",
            type: "text",
            inputMode: "decimal",
            autoComplete: "off",
            spellCheck: !1,
            value: X,
            onValueChange: G,
            disabled: tl,
            placeholder: "0",
            "aria-label": f,
            "aria-describedby": Z,
            invalid: to,
            helper: tm,
            inputClassName: "font-medium caret-text-primary",
            className: "pr-1.5",
            trailing: P,
          })),
          (F[43] = X),
          (F[44] = Z),
          (F[45] = tm),
          (F[46] = tl),
          (F[47] = G),
          (F[48] = f),
          (F[49] = to),
          (F[50] = P),
          (F[51] = w))
        : (w = F[51]),
      F[52] === Symbol.for("react.memo_cache_sentinel")
        ? ((z = (0, e.jsx)(r.a, { className: "my-1" })), (F[52] = z))
        : (z = F[52]),
      F[53] !== L
        ? ((q = L("common.to")), (F[53] = L), (F[54] = q))
        : (q = F[54]),
      F[55] === Symbol.for("react.memo_cache_sentinel")
        ? ((C = (0, e.jsx)(c.CoinAvatar, { coin: B, size: 20, seal: "none" })),
          (F[55] = C))
        : (C = F[55]),
      F[56] !== q
        ? ((N = (0, e.jsx)(u.f, { label: q, symbol: b.f.symbol, art: C })),
          (F[56] = q),
          (F[57] = N))
        : (N = F[57]),
      F[58] !== W
        ? ((A = (0, e.jsx)(O, { model: W })), (F[58] = W), (F[59] = A))
        : (A = F[59]),
      F[60] !== k || F[61] !== w || F[62] !== N || F[63] !== A || F[64] !== Q
        ? ((I = (0, e.jsxs)(r.K, {
            className: "flex flex-col gap-3",
            children: [k, w, z, N, A, Q],
          })),
          (F[60] = k),
          (F[61] = w),
          (F[62] = N),
          (F[63] = A),
          (F[64] = Q),
          (F[65] = I))
        : (I = F[65]),
      F[66] !== L
        ? ((E = L("common.cancel")), (F[66] = L), (F[67] = E))
        : (E = F[67]),
      F[68] !== tl || F[69] !== M || F[70] !== E
        ? ((U = (0, e.jsx)(a.K, {
            variant: "secondary",
            size: r.Z,
            "data-testid": "native-convert-cancel",
            onClick: M,
            isDisabled: tl,
            children: E,
          })),
          (F[68] = tl),
          (F[69] = M),
          (F[70] = E),
          (F[71] = U))
        : (U = F[71]));
    let td = !ta;
    return (
      F[72] !== L
        ? ((S = L("profile.spending_power.convert_to", { symbol: b.f.symbol })),
          (F[72] = L),
          (F[73] = S))
        : (S = F[73]),
      F[74] !== tl || F[75] !== ti || F[76] !== td || F[77] !== S
        ? ((K = (0, e.jsx)(a.K, {
            variant: "primary",
            size: r.$,
            "data-testid": "native-convert-submit",
            onClick: ti,
            isDisabled: td,
            isLoading: tl,
            children: S,
          })),
          (F[74] = tl),
          (F[75] = ti),
          (F[76] = td),
          (F[77] = S),
          (F[78] = K))
        : (K = F[78]),
      F[79] !== U || F[80] !== K
        ? ((R = (0, e.jsxs)(r.c, { children: [U, K] })),
          (F[79] = U),
          (F[80] = K),
          (F[81] = R))
        : (R = F[81]),
      F[82] !== I || F[83] !== R
        ? ((T = (0, e.jsxs)(e.Fragment, { children: [I, R] })),
          (F[82] = I),
          (F[83] = R),
          (F[84] = T))
        : (T = F[84]),
      T
    );
  }
  function W(t) {
    let i,
      n,
      c,
      u,
      h,
      o,
      b,
      d,
      j,
      p,
      v,
      k,
      f = (0, s.c)(32),
      { chainId: x, mappedEvmAddress: y, onClose: g } = t,
      { t: P } = (0, m.f)();
    if (f[0] !== x || f[1] !== y || f[2] !== g || f[3] !== P) {
      let t,
        s = (0, _.A)(x),
        m = s?.chainName ?? "";
      ((j = (0, e.jsxs)(r.K, {
        className: "flex flex-col gap-1",
        "data-testid": "native-convert-in-app-wallet",
        children: [
          (0, e.jsx)("p", {
            className: "text-sm font-medium leading-5 text-text-primary",
            children: P("web.trade.evm_wallet_in_app_title", { chain_name: m }),
          }),
          (0, e.jsx)("p", {
            className: "text-xs leading-4 text-text-secondary",
            children: P("web.trade.evm_wallet_in_app_description", {
              chain_name: m,
              address: (0, l.d)(y, 8, 4),
            }),
          }),
        ],
      })),
        (n = r.c),
        f[13] !== P
          ? ((t = P("common.cancel")), (f[13] = P), (f[14] = t))
          : (t = f[14]),
        f[15] !== g || f[16] !== t
          ? ((d = (0, e.jsx)(a.K, {
              variant: "secondary",
              size: r.Z,
              "data-testid": "native-convert-cancel",
              onClick: g,
              children: t,
            })),
            (f[15] = g),
            (f[16] = t),
            (f[17] = d))
          : (d = f[17]),
        (i = a.K),
        (c = "primary"),
        (u = r.$),
        (h = "native-convert-open-app"),
        (o = D),
        (b = P("web.callouts.upsell_trade_title", { symbol: s?.symbol ?? "" })),
        (f[0] = x),
        (f[1] = y),
        (f[2] = g),
        (f[3] = P),
        (f[4] = i),
        (f[5] = n),
        (f[6] = c),
        (f[7] = u),
        (f[8] = h),
        (f[9] = o),
        (f[10] = b),
        (f[11] = d),
        (f[12] = j));
    } else
      ((i = f[4]),
        (n = f[5]),
        (c = f[6]),
        (u = f[7]),
        (h = f[8]),
        (o = f[9]),
        (b = f[10]),
        (d = f[11]),
        (j = f[12]));
    return (
      f[18] !== i ||
      f[19] !== c ||
      f[20] !== u ||
      f[21] !== h ||
      f[22] !== o ||
      f[23] !== b
        ? ((p = (0, e.jsx)(i, {
            variant: c,
            size: u,
            "data-testid": h,
            onClick: o,
            children: b,
          })),
          (f[18] = i),
          (f[19] = c),
          (f[20] = u),
          (f[21] = h),
          (f[22] = o),
          (f[23] = b),
          (f[24] = p))
        : (p = f[24]),
      f[25] !== n || f[26] !== d || f[27] !== p
        ? ((v = (0, e.jsxs)(n, { children: [d, p] })),
          (f[25] = n),
          (f[26] = d),
          (f[27] = p),
          (f[28] = v))
        : (v = f[28]),
      f[29] !== j || f[30] !== v
        ? ((k = (0, e.jsxs)(e.Fragment, { children: [j, v] })),
          (f[29] = j),
          (f[30] = v),
          (f[31] = k))
        : (k = f[31]),
      k
    );
  }
  function D() {
    window.open((0, K.d)(null, "evm_trade"), "_blank", "noopener,noreferrer");
  }
  function M(t) {
    let a,
      l,
      c,
      u,
      r = (0, s.c)(19),
      {
        chainId: h,
        usdPrice: o,
        evmWalletAddress: d,
        mappedEvmAddress: A,
        onClose: $,
        onSubmittingChange: K,
      } = t;
    r[0] !== h || r[1] !== d || r[2] !== $ || r[3] !== K || r[4] !== o
      ? ((a = {
          chainId: h,
          usdPrice: o,
          evmWalletAddress: d,
          onSubmitted: $,
          onSubmittingChange: K,
        }),
        (r[0] = h),
        (r[1] = d),
        (r[2] = $),
        (r[3] = K),
        (r[4] = o),
        (r[5] = a))
      : (a = r[5]);
    let B = (function ({
      chainId: t,
      evmWalletAddress: e,
      usdPrice: s,
      onSubmitted: a,
      onSubmittingChange: l,
    }) {
      let { t: c } = (0, m.f)(),
        { address: u } = (0, i.F)(),
        { slippage: r } = (0, g.f)(),
        h = (0, y._)(),
        o = (0, v.F)({ mutationKey: y.z }) > 0,
        [d, A] = (0, n.useState)(""),
        [$, K] = (0, n.useState)(!1),
        B = (0, _.A)(t),
        R = (0, j.findChainByEvmChainId)(t)?.caip2 ?? `eip155:${t}`,
        O = (0, w.Q)(t),
        T = Math.min((0, q.f)(r), 300),
        F = (0, x.R)({ mint: w.W, chainId: R, walletAddress: e }),
        W = (0, n.useRef)(!1);
      (0, n.useEffect)(() => {
        F.isError &&
          !W.current &&
          ((W.current = !0),
          (0, P.l)({
            error: F.error,
            feature: "relay",
            operation: "native-convert-balance",
            context: { chainId: t, evmWalletAddress: e },
          }));
      }, [F.isError, F.error, t, e]);
      let D = F.isError,
        M =
          F.data && !D
            ? (0, _.K)({
                balanceRaw: F.data.balanceRaw,
                reserveRaw: (0, _.y)({ token: w.W, chainId: t }),
              })
            : null,
        Q = null === M ? null : (0, N.E)(M, O),
        L = (0, N.n)(d, O),
        Z = null !== L && L > BigInt(0),
        V = Z && null !== M && L > M,
        X = !!(u && e),
        G = (t) =>
          u && e
            ? {
                direction: "sell",
                mint: w.W,
                chainId: R,
                atomicAmount: t,
                solanaAsset: I,
                solanaWalletAddress: u,
                evmWalletAddress: e,
                slippageBps: T,
              }
            : null,
        H = ((t) => {
          let [e, s] = (0, n.useState)(t);
          return (
            (0, n.useEffect)(() => {
              let e = setTimeout(() => s(t), 400);
              return () => clearTimeout(e);
            }, [t, 400]),
            e
          );
        })(d),
        J = Z && !V && H === d ? G(L) : null,
        Y = (0, f.q)(12e3, null !== J),
        tt = (0, k.useQuery)({
          queryKey: [
            "nativeConvertQuote",
            J?.chainId ?? null,
            J?.atomicAmount.toString() ?? null,
            J?.evmWalletAddress.toLowerCase() ?? null,
            J?.solanaWalletAddress ?? null,
            J?.slippageBps ?? null,
          ],
          enabled: null !== J,
          queryFn: () => {
            if (!J) throw Error("no convert amount to price");
            return S(J);
          },
          staleTime: 12e3,
          retry: !1,
          refetchInterval: Y,
        }),
        te = null === J ? void 0 : tt.data,
        ts = null !== J && tt.error instanceof z.X ? tt.error : null,
        ta = ts
          ? (0, z.s)(
              { status: ts.status, reason: ts.reason, message: ts.message },
              { chainId: R, t: c },
            )
          : null,
        tl = U(te?.toAmount),
        ti = {
          outputUi: tl,
          minOutputUi: U(te?.toAmountMin),
          isPricing: Z && !V && X && null === tl && null === ta,
          errorMessage: ta,
        },
        tn = Z && !V && null !== M && null !== B && X && !$ && !o;
      return {
        token: B,
        decimals: O,
        amount: d,
        setAmount: (t) => {
          (0, N.c)(t) && A(t);
        },
        fillMax: () => {
          null === M || M <= BigInt(0) || A((0, N.e)(M, O));
        },
        spendableAtomic: M,
        spendableUi: Q,
        amountAtomic: L,
        isInsufficient: V,
        isBalanceError: D,
        preview: ti,
        canSubmit: tn,
        isSubmitting: $,
        submit: () => {
          if (!tn || null === L || null === B) return;
          let t = G(L);
          if (!t) return;
          (K(!0), l?.(!0));
          let e =
            null === s
              ? null
              : {
                  tokenUsdPrice: s,
                  tokenDecimals: O,
                  settlementUsdPrice: 1,
                  settlementDecimals: (0, C.q)(I),
                  observedAtMs: null,
                };
          h.mutate(
            {
              quoteRequest: t,
              coinSymbol: B.symbol,
              coin: E,
              isSellAll: !1,
              spotReference: e,
              analytics: {
                screen: p.Ae.ACCOUNT,
                sourceElement: p.k9.CONVERT,
                tokenDecimals: O,
              },
              convert: { fromSymbol: B.symbol, toSymbol: b.f.symbol },
              onSubmitted: a,
            },
            {
              onSettled: () => {
                (K(!1), l?.(!1));
              },
            },
          );
        },
      };
    })(a);
    r[6] !== d || r[7] !== A
      ? ((l = null !== d && null !== A && d.toLowerCase() !== A.toLowerCase()),
        (r[6] = d),
        (r[7] = A),
        (r[8] = l))
      : (l = r[8]);
    let R = l;
    return (
      r[9] !== h || r[10] !== d || r[11] !== R || r[12] !== A
        ? ((c = R
            ? (0, e.jsx)(T, {
                chainId: h,
                evmWalletAddress: d,
                mappedEvmAddress: A,
              })
            : null),
          (r[9] = h),
          (r[10] = d),
          (r[11] = R),
          (r[12] = A),
          (r[13] = c))
        : (c = r[13]),
      r[14] !== h || r[15] !== B || r[16] !== $ || r[17] !== c
        ? ((u = (0, e.jsx)(F, {
            model: B,
            chainId: h,
            onCancel: $,
            walletNote: c,
          })),
          (r[14] = h),
          (r[15] = B),
          (r[16] = $),
          (r[17] = c),
          (r[18] = u))
        : (u = r[18]),
      u
    );
  }
  t.s(
    [
      "NativeConvertDialogBody",
      0,
      function (t) {
        let a,
          l = (0, s.c)(9),
          { address: n } = (0, i.F)(),
          { evmWalletAddress: m, isReady: c, mappedEvmAddress: u } = (0, d.f)();
        if (c && !m && u) {
          let s;
          return (
            l[0] !== u || l[1] !== t.chainId || l[2] !== t.onClose
              ? ((s = (0, e.jsx)(W, {
                  chainId: t.chainId,
                  mappedEvmAddress: u,
                  onClose: t.onClose,
                })),
                (l[0] = u),
                (l[1] = t.chainId),
                (l[2] = t.onClose),
                (l[3] = s))
              : (s = l[3]),
            s
          );
        }
        let r = `${t.chainId}:${n ?? ""}:${m ?? ""}`;
        return (
          l[4] !== m || l[5] !== u || l[6] !== t || l[7] !== r
            ? ((a = (0, e.jsx)(
                M,
                { ...t, evmWalletAddress: m, mappedEvmAddress: u },
                r,
              )),
              (l[4] = m),
              (l[5] = u),
              (l[6] = t),
              (l[7] = r),
              (l[8] = a))
            : (a = l[8]),
          a
        );
      },
    ],
    700042,
  );
};
