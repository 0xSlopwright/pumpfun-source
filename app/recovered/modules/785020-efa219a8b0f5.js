// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    r = e.i(509836),
    n = e.i(933185),
    i = e.i(623213),
    l = e.i(748117),
    s = e.i(636447),
    o = e.i(352386),
    d = e.i(565530),
    c = e.i(582355),
    u = e.i(745018),
    f = e.i(574472);
  e.i(12692);
  var m = e.i(398902),
    h = e.i(63289),
    p = e.i(259948);
  let g = (e) => {
    let r,
      n,
      i,
      l,
      s,
      d,
      c,
      f,
      h,
      g,
      w,
      b,
      y,
      v,
      x,
      _,
      S = (0, a.c)(37),
      { onComplete: j } = e,
      { t: N } = (0, m.f)(),
      [k, E] = (0, o.useState)(0),
      [I, C] = (0, o.useState)(!1),
      T = (0, o.useRef)(!1),
      R = k >= 95,
      P = R ? 1 : Math.max(0, 1 - k / 95);
    S[0] !== j
      ? ((r = async () => {
          (C(!0), E(100));
          try {
            await j();
          } catch {}
          (C(!1), E(0));
        }),
        (S[0] = j),
        (S[1] = r))
      : (r = S[1]);
    let M = r;
    S[2] !== I || S[3] !== M
      ? ((n = (e) => {
          let [t] = e;
          I || (t >= 95 ? M() : T.current || E(0));
        }),
        (S[2] = I),
        (S[3] = M),
        (S[4] = n))
      : (n = S[4]);
    let $ = n;
    S[5] !== I || S[6] !== M
      ? ((i = (e) => {
          if (!I) {
            if ("Enter" === e.key || " " === e.key) {
              (e.preventDefault(), M());
              return;
            }
            T.current = !0;
          }
        }),
        (S[5] = I),
        (S[6] = M),
        (S[7] = i))
      : (i = S[7]);
    let z = i;
    return (
      S[8] !== k ? ((l = [k]), (S[8] = k), (S[9] = l)) : (l = S[9]),
      S[10] === Symbol.for("react.memo_cache_sentinel")
        ? ((s = (e) => {
            let [t] = e;
            return E(t);
          }),
          (S[10] = s))
        : (s = S[10]),
      S[11] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = () => {
            T.current = !1;
          }),
          (c = () => {
            T.current = !1;
          }),
          (S[11] = d),
          (S[12] = c))
        : ((d = S[11]), (c = S[12])),
      S[13] !== N
        ? ((f = N("web.wallet.slide_to_unlock_private_key")),
          (S[13] = N),
          (S[14] = f))
        : (f = S[14]),
      S[15] === Symbol.for("react.memo_cache_sentinel")
        ? ((h = (0, t.jsx)(p.m, {
            className: "relative h-full w-full",
            children: (0, t.jsx)(p.h, {
              className: "absolute h-full bg-transparent",
            }),
          })),
          (S[15] = h))
        : (h = S[15]),
      S[16] !== P
        ? ((g = { opacity: P }), (S[16] = P), (S[17] = g))
        : (g = S[17]),
      S[18] !== R || S[19] !== N
        ? ((w = N(
            R ? "web.wallet.release_to_unlock" : "web.wallet.slide_to_unlock",
          )),
          (S[18] = R),
          (S[19] = N),
          (S[20] = w))
        : (w = S[20]),
      S[21] !== g || S[22] !== w
        ? ((b = (0, t.jsx)("span", {
            "aria-hidden": !0,
            className:
              "text-text-tertiary pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity",
            style: g,
            children: w,
          })),
          (S[21] = g),
          (S[22] = w),
          (S[23] = b))
        : (b = S[23]),
      S[24] !== N
        ? ((y = N("web.wallet.drag_to_unlock")), (S[24] = N), (S[25] = y))
        : (y = S[25]),
      S[26] === Symbol.for("react.memo_cache_sentinel")
        ? ((v = (0, t.jsx)("span", {
            className:
              "pointer-events-none flex h-full w-full items-center justify-center",
            children: (0, t.jsx)(u.A3, { className: "size-4 text-green-400" }),
          })),
          (S[26] = v))
        : (v = S[26]),
      S[27] !== y
        ? ((x = (0, t.jsx)(p.w, {
            className:
              "bg-bg-tertiary border-border-secondary focus-visible:ring-primary block h-11 w-12 cursor-grab rounded-xl border shadow-sm transition-colors active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 data-[disabled]:cursor-wait",
            "aria-label": y,
            children: v,
          })),
          (S[27] = y),
          (S[28] = x))
        : (x = S[28]),
      S[29] !== z ||
      S[30] !== $ ||
      S[31] !== I ||
      S[32] !== b ||
      S[33] !== x ||
      S[34] !== l ||
      S[35] !== f
        ? ((_ = (0, t.jsxs)(p.F, {
            value: l,
            onValueChange: s,
            onValueCommit: $,
            onKeyDown: z,
            onKeyUp: d,
            onPointerDown: c,
            disabled: I,
            min: 0,
            max: 100,
            step: 1,
            "aria-label": f,
            "aria-busy": I,
            className:
              "bg-bg-secondary border-border-secondary relative flex h-14 w-full touch-none select-none items-center overflow-hidden rounded-2xl border px-1.5",
            children: [h, b, x],
          })),
          (S[29] = z),
          (S[30] = $),
          (S[31] = I),
          (S[32] = b),
          (S[33] = x),
          (S[34] = l),
          (S[35] = f),
          (S[36] = _))
        : (_ = S[36]),
      _
    );
  };
  var w = e.i(182119),
    b = e.i(795663),
    y = e.i(466931),
    v = e.i(338319);
  let x = (e) =>
      "wallet" === e.type &&
      "privy" === e.walletClientType &&
      ("solana" === e.chainType || "ethereum" === e.chainType),
    _ = (e) => ({
      address: e.address,
      chainType: "solana" === e.chainType ? "solana" : "ethereum",
      imported: !!e.imported,
      walletIndex: e.walletIndex ?? null,
    }),
    S = (e, t) =>
      e.imported !== t.imported
        ? e.imported
          ? 1
          : -1
        : (e.walletIndex ?? 0) - (t.walletIndex ?? 0),
    j = (e, t) =>
      "ethereum" === e.chainType
        ? e.address.toLowerCase() === t.toLowerCase()
        : e.address === t;
  function N(e) {
    return void 0 !== e;
  }
  function k(e) {
    return "ethereum" === e.chainType;
  }
  function E(e) {
    let r,
      n,
      i,
      l,
      s,
      o = (0, a.c)(16),
      { wallet: d, isSelected: c, isDisabled: u, onSelect: f } = e,
      { t: h } = (0, m.f)(),
      p = c
        ? "border-positive bg-positive/10"
        : "border-border-secondary bg-bg-secondary hover:bg-bg-tertiary";
    return (
      o[0] !== p
        ? ((r = (0, v.c)(
            "flex w-full flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg-accent disabled:cursor-not-allowed disabled:opacity-60",
            p,
          )),
          (o[0] = p),
          (o[1] = r))
        : (r = o[1]),
      o[2] !== h || o[3] !== d.chainType
        ? ((n = h(
            "solana" === d.chainType
              ? "web.wallet.export_chain_solana"
              : "web.wallet.export_chain_evm",
          )),
          (o[2] = h),
          (o[3] = d.chainType),
          (o[4] = n))
        : (n = o[4]),
      o[5] !== n
        ? ((i = (0, t.jsx)("span", {
            className: "text-text-primary text-xs font-semibold",
            children: n,
          })),
          (o[5] = n),
          (o[6] = i))
        : (i = o[6]),
      o[7] !== d.address
        ? ((l = (0, t.jsx)("span", {
            className: "text-text-secondary font-mono text-xs break-all",
            children: d.address,
          })),
          (o[7] = d.address),
          (o[8] = l))
        : (l = o[8]),
      o[9] !== u ||
      o[10] !== c ||
      o[11] !== f ||
      o[12] !== r ||
      o[13] !== i ||
      o[14] !== l
        ? ((s = (0, t.jsxs)("button", {
            type: "button",
            role: "radio",
            "aria-checked": c,
            disabled: u,
            onClick: f,
            className: r,
            children: [i, l],
          })),
          (o[9] = u),
          (o[10] = c),
          (o[11] = f),
          (o[12] = r),
          (o[13] = i),
          (o[14] = l),
          (o[15] = s))
        : (s = o[15]),
      s
    );
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let p,
          v,
          I,
          C,
          T,
          R,
          P,
          M,
          $,
          z,
          W,
          A,
          L,
          D,
          B,
          F,
          O,
          U,
          q,
          V,
          K,
          G,
          H,
          X,
          Z,
          Y = (0, a.c)(77),
          { t: J } = (0, m.f)(),
          {
            authenticated: Q,
            ready: ee,
            user: et,
            exportWallet: ea,
          } = (0, r.f)(),
          { exportWallet: er } = (function () {
            let { user: e, getAccessToken: t } = (0, n.u)(),
              { walletProxy: a, openModal: r, client: u } = (0, l.u)(),
              { setModalData: f } = (0, s.u)(),
              m = (0, n.a)();
            return (0, o.useMemo)(
              () => ({
                exportWallet: (l) =>
                  new Promise(async (s, o) => {
                    if (!e)
                      return void o(
                        new d.P(
                          "User must be authenticated before exporting their Privy wallet",
                        ),
                      );
                    let h = l?.address ? (0, n.k)(e, l.address) : (0, n.s)(e);
                    if (!h)
                      return void o(
                        new d.P("User must have an embedded wallet."),
                      );
                    if (!(0, i.i)(h))
                      return void o(
                        Error(
                          `Export is not supported for ${h.chainType} wallets`,
                        ),
                      );
                    let p = (0, n.c)(h),
                      { entropyId: g, entropyIdVerifier: w } = (0, c.g)(e, h);
                    (await t())
                      ? a
                        ? (f({
                            connectWallet: {
                              recoveryMethod: h.recoveryMethod,
                              connectingWalletAddress: h.address,
                              isUnifiedWallet: p,
                              entropyId: g,
                              entropyIdVerifier: w,
                              onCompleteNavigateTo:
                                "EmbeddedWalletKeyExportScreen",
                              onFailure: o,
                              shouldForceMFA: !0,
                            },
                            keyExport: {
                              appId: m.id,
                              appClientId: m.appClientId,
                              origin: u.apiUrl,
                              address: h.address,
                              entropyId: g,
                              entropyIdVerifier: w,
                              hdWalletIndex: h.walletIndex,
                              chainType: h.chainType,
                              walletId: h.id,
                              isUnifiedWallet: p,
                              imported: h.imported,
                              onSuccess: s,
                              onFailure: o,
                              showBackButton: l?.showBackButton,
                            },
                          }),
                          r("EmbeddedWalletConnectingScreen"))
                        : o(new d.P("Wallet not ready for export"))
                      : o(new d.P("Must have valid access token."));
                  }),
              }),
              [e, t, a, r, u, f, m],
            );
          })(),
          { address: en } = (0, f.F)(),
          { isOpen: ei, setIsOpen: el } = e,
          [es, eo] = (0, o.useState)(null),
          [ed, ec] = (0, o.useState)(!1),
          eu = ee && Q,
          ef = ((e) => {
            let t = [],
              a = [];
            for (let r of e ?? []) {
              if (!x(r)) continue;
              let e = _(r);
              ("solana" === e.chainType ? t : a).push(e);
            }
            return [...t.sort(S), ...a.sort(S)];
          })(et?.linkedAccounts),
          em = ef.filter(k).length,
          eh = em > 1,
          ep = ei && eh;
        Y[0] !== en || Y[1] !== ep
          ? ((p = { solAddress: en, enabled: ep, fresh: !0 }),
            (Y[0] = en),
            (Y[1] = ep),
            (Y[2] = p))
          : (p = Y[2]);
        let eg = (0, b.O)(p),
          ew = eh && eg.isFetching,
          eb = eh && eg.isError,
          ey = void 0 !== eg.data,
          ev = eb && !ey,
          ex = eg.error;
        (Y[3] !== em || Y[4] !== ey || Y[5] !== eb || Y[6] !== ex || Y[7] !== en
          ? ((v = () => {
              eb &&
                (0, y.l)({
                  error: ex,
                  feature: "wallet-export",
                  operation: "exportMappingLookup",
                  context: {
                    address: en,
                    evmWalletCount: em,
                    hasMappedAnswer: ey,
                  },
                });
            }),
            (I = [eb, ex, en, em, ey]),
            (Y[3] = em),
            (Y[4] = ey),
            (Y[5] = eb),
            (Y[6] = ex),
            (Y[7] = en),
            (Y[8] = v),
            (Y[9] = I))
          : ((v = Y[8]), (I = Y[9])),
          (0, o.useEffect)(v, I));
        let e_ = ew ? void 0 : ey ? (eg.data ?? null) : null,
          eS = [
            (({ wallets: e, sessionAddress: t }) => {
              let a = e.filter((e) => "solana" === e.chainType);
              return (
                (void 0 === t ? void 0 : a.find((e) => e.address === t)) ?? a[0]
              );
            })({ wallets: ef, sessionAddress: en }),
            (({ wallets: e, mappedEvmAddress: t }) => {
              let a = e.filter((e) => "ethereum" === e.chainType),
                r = a[0];
              return a.length <= 1
                ? r
                : void 0 !== t
                  ? null === t
                    ? r
                    : (a.find((e) => j(e, t)) ?? r)
                  : void 0;
            })({ wallets: ef, mappedEvmAddress: e_ }),
          ].filter(N),
          ej =
            (null === es ? void 0 : eS.find((e) => j(e, es))) ??
            eS.find((e) => "solana" === e.chainType) ??
            eS[0];
        Y[10] !== el
          ? ((C = (e) => {
              (e || eo(null), el(e));
            }),
            (Y[10] = el),
            (Y[11] = C))
          : (C = Y[11]);
        let eN = C;
        Y[12] !== em ||
        Y[13] !== ea ||
        Y[14] !== er ||
        Y[15] !== ej ||
        Y[16] !== J ||
        Y[17] !== ef
          ? ((T = async () => {
              if (!ej) return;
              let e = "solana" === ej.chainType;
              ec(!0);
              try {
                e
                  ? await er({ address: ej.address })
                  : await ea({ address: ej.address });
              } catch (t) {
                (t instanceof Error && /exited/i.test(t.message)) ||
                  ((0, y.l)({
                    error: t,
                    feature: "wallet-export",
                    operation: e ? "exportSolanaWallet" : "exportEvmWallet",
                    context: {
                      address: ej.address,
                      chainType: ej.chainType,
                      imported: ej.imported,
                      walletIndex: ej.walletIndex,
                      walletCount: ef.length,
                      evmWalletCount: em,
                    },
                  }),
                  h.c.error(J("web.wallet.export_failed")));
              }
              ec(!1);
            }),
            (Y[12] = em),
            (Y[13] = ea),
            (Y[14] = er),
            (Y[15] = ej),
            (Y[16] = J),
            (Y[17] = ef),
            (Y[18] = T))
          : (T = Y[18]);
        let ek = T;
        return (
          Y[19] !== J
            ? ((R = J("web.wallet.export_wallet")), (Y[19] = J), (Y[20] = R))
            : (R = Y[20]),
          Y[21] !== R
            ? ((P = (0, t.jsx)(w.F, {
                className: "text-text-primary text-xl font-semibold",
                children: R,
              })),
              (Y[21] = R),
              (Y[22] = P))
            : (P = Y[22]),
          Y[23] !== J
            ? ((M = J("web.wallet.export_warning")), (Y[23] = J), (Y[24] = M))
            : (M = Y[24]),
          Y[25] !== M
            ? (($ = (0, t.jsx)("p", {
                className: "text-sm leading-snug text-yellow-400",
                children: M,
              })),
              (Y[25] = M),
              (Y[26] = $))
            : ($ = Y[26]),
          Y[27] !== P || Y[28] !== $
            ? ((z = (0, t.jsxs)("div", {
                className: "flex flex-col gap-1.5",
                children: [P, $],
              })),
              (Y[27] = P),
              (Y[28] = $),
              (Y[29] = z))
            : (z = Y[29]),
          Y[30] !== eN
            ? ((W = () => eN(!1)), (Y[30] = eN), (Y[31] = W))
            : (W = Y[31]),
          Y[32] !== J
            ? ((A = J("common.close")), (Y[32] = J), (Y[33] = A))
            : (A = Y[33]),
          Y[34] === Symbol.for("react.memo_cache_sentinel")
            ? ((L = (0, t.jsx)(u.x6, { size: 16 })), (Y[34] = L))
            : (L = Y[34]),
          Y[35] !== W || Y[36] !== A
            ? ((D = (0, t.jsx)("button", {
                type: "button",
                onClick: W,
                "aria-label": A,
                className:
                  "hover:bg-bg-secondary text-text-tertiary hover:text-text-primary flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",
                children: L,
              })),
              (Y[35] = W),
              (Y[36] = A),
              (Y[37] = D))
            : (D = Y[37]),
          Y[38] !== z || Y[39] !== D
            ? ((B = (0, t.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [z, D],
              })),
              (Y[38] = z),
              (Y[39] = D),
              (Y[40] = B))
            : (B = Y[40]),
          Y[41] !== eS.length || Y[42] !== J
            ? ((F =
                eS.length > 1
                  ? (0, t.jsx)("p", {
                      className: "text-text-secondary text-sm",
                      children: J("web.wallet.export_pick_wallet"),
                    })
                  : null),
              (Y[41] = eS.length),
              (Y[42] = J),
              (Y[43] = F))
            : (F = Y[43]),
          Y[44] !== ew || Y[45] !== J
            ? ((O = ew
                ? (0, t.jsx)("p", {
                    className: "text-text-secondary text-sm",
                    role: "status",
                    children: J("web.wallet.export_linked_checking"),
                  })
                : null),
              (Y[44] = ew),
              (Y[45] = J),
              (Y[46] = O))
            : (O = Y[46]),
          Y[47] !== ev || Y[48] !== J
            ? ((U = ev
                ? (0, t.jsx)("p", {
                    className: "text-sm leading-snug text-yellow-400",
                    children: J("web.wallet.export_linked_unverified"),
                  })
                : null),
              (Y[47] = ev),
              (Y[48] = J),
              (Y[49] = U))
            : (U = Y[49]),
          Y[50] !== eS || Y[51] !== ed || Y[52] !== ej || Y[53] !== J
            ? ((q =
                eS.length > 0
                  ? (0, t.jsx)("div", {
                      role: "radiogroup",
                      "aria-label": J("web.wallet.export_pick_wallet"),
                      className: "flex flex-col gap-2",
                      children: eS.map((e) =>
                        (0, t.jsx)(
                          E,
                          {
                            wallet: e,
                            isSelected:
                              void 0 !== ej &&
                              ej.chainType === e.chainType &&
                              ej.address === e.address,
                            isDisabled: ed,
                            onSelect: () => eo(e.address),
                          },
                          `${e.chainType}:${e.address}`,
                        ),
                      ),
                    })
                  : null),
              (Y[50] = eS),
              (Y[51] = ed),
              (Y[52] = ej),
              (Y[53] = J),
              (Y[54] = q))
            : (q = Y[54]),
          Y[55] !== J
            ? ((V = J("web.wallet.export_slide_hint")),
              (Y[55] = J),
              (Y[56] = V))
            : (V = Y[56]),
          Y[57] !== V
            ? ((K = (0, t.jsx)("p", {
                className: "text-text-primary text-sm font-medium",
                children: V,
              })),
              (Y[57] = V),
              (Y[58] = K))
            : (K = Y[58]),
          Y[59] !== ek || Y[60] !== eu || Y[61] !== ej
            ? ((G = eu && ej && (0, t.jsx)(g, { onComplete: ek })),
              (Y[59] = ek),
              (Y[60] = eu),
              (Y[61] = ej),
              (Y[62] = G))
            : (G = Y[62]),
          Y[63] !== F ||
          Y[64] !== O ||
          Y[65] !== U ||
          Y[66] !== q ||
          Y[67] !== K ||
          Y[68] !== G
            ? ((H = (0, t.jsxs)("div", {
                className: "mt-4 flex flex-col gap-3",
                children: [F, O, U, q, K, G],
              })),
              (Y[63] = F),
              (Y[64] = O),
              (Y[65] = U),
              (Y[66] = q),
              (Y[67] = K),
              (Y[68] = G),
              (Y[69] = H))
            : (H = Y[69]),
          Y[70] !== B || Y[71] !== H
            ? ((X = (0, t.jsxs)(w.d, {
                className: "bg-bg-primary text-text-primary p-5",
                "aria-describedby": void 0,
                children: [B, H],
              })),
              (Y[70] = B),
              (Y[71] = H),
              (Y[72] = X))
            : (X = Y[72]),
          Y[73] !== eN || Y[74] !== ei || Y[75] !== X
            ? ((Z = (0, t.jsx)(w.N, {
                open: ei,
                onOpenChange: eN,
                children: X,
              })),
              (Y[73] = eN),
              (Y[74] = ei),
              (Y[75] = X),
              (Y[76] = Z))
            : (Z = Y[76]),
          Z
        );
      },
    ],
    785020,
  );
};
