// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(232453),
    a = e.i(352386);
  let i = (0, a.createContext)(void 0);
  e.s([
    "ConnectWalletProvider",
    0,
    (e) => {
      let l,
        o,
        s,
        u,
        c,
        f,
        d = (0, n.c)(23),
        { children: h } = e,
        [p, g] = (0, a.useState)(!1),
        [m, b] = (0, a.useState)(!1),
        [y, v] = (0, a.useState)(!1),
        [w, C] = (0, a.useState)(null);
      (y || null === w || C(null),
        d[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((l = (e) => {
              (C(e ?? null), v(!0));
            }),
            (d[0] = l))
          : (l = d[0]));
      let S = l,
        [P, L] = (0, a.useState)(!1),
        [E, N] = (0, a.useState)(!1),
        [x, k] = (0, a.useState)(null);
      (E || null === x || k(null),
        d[1] === Symbol.for("react.memo_cache_sentinel")
          ? ((o = (e) => {
              (k(e ?? null), N(!0));
            }),
            (d[1] = o))
          : (o = d[1]));
      let M = o,
        [O, A] = (0, a.useState)(!1),
        [j, F] = (0, a.useState)(!1),
        [T, _] = (0, a.useState)(!1),
        [I, D] = (0, a.useState)(!1),
        [R, U] = (0, a.useState)(!1),
        [$, B] = (0, a.useState)(null),
        [z, q] = (0, a.useState)(!1),
        [G, W] = (0, a.useState)(!1);
      (d[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((s = () => {
            let e = () => b(!0);
            return (
              window.addEventListener(r.f, e),
              () => window.removeEventListener(r.f, e)
            );
          }),
          (u = []),
          (d[2] = s),
          (d[3] = u))
        : ((s = d[2]), (u = d[3])),
        (0, a.useEffect)(s, u),
        d[4] !== T ||
        d[5] !== x ||
        d[6] !== j ||
        d[7] !== z ||
        d[8] !== $ ||
        d[9] !== E ||
        d[10] !== m ||
        d[11] !== P ||
        d[12] !== G ||
        d[13] !== R ||
        d[14] !== I ||
        d[15] !== O ||
        d[16] !== p ||
        d[17] !== y ||
        d[18] !== w
          ? ((c = {
              showWallet: p,
              setShowWallet: g,
              showDeposit: m,
              setShowDeposit: b,
              showWithdraw: y,
              setShowWithdraw: v,
              withdrawRequest: w,
              openWithdraw: S,
              showExport: P,
              setShowExport: L,
              showConvert: E,
              setShowConvert: N,
              convertRequest: x,
              openConvert: M,
              showSelectBalance: O,
              setShowSelectBalance: A,
              isWalletHandoffPending: j,
              setIsWalletHandoffPending: F,
              accountDropdownAutoOpen: T,
              setAccountDropdownAutoOpen: _,
              showReturningWalletPrompt: I,
              setShowReturningWalletPrompt: D,
              showReturningPopover: R,
              setShowReturningPopover: U,
              returningPopoverAnchor: $,
              setReturningPopoverAnchor: B,
              isWalletNonCompliantModalOpen: z,
              setIsWalletNonCompliantModalOpen: q,
              showLinkLogin: G,
              setShowLinkLogin: W,
            }),
            (d[4] = T),
            (d[5] = x),
            (d[6] = j),
            (d[7] = z),
            (d[8] = $),
            (d[9] = E),
            (d[10] = m),
            (d[11] = P),
            (d[12] = G),
            (d[13] = R),
            (d[14] = I),
            (d[15] = O),
            (d[16] = p),
            (d[17] = y),
            (d[18] = w),
            (d[19] = c))
          : (c = d[19]));
      let K = c;
      return (
        d[20] !== h || d[21] !== K
          ? ((f = (0, t.jsx)(i.Provider, { value: K, children: h })),
            (d[20] = h),
            (d[21] = K),
            (d[22] = f))
          : (f = d[22]),
        f
      );
    },
    "useConnectWallet",
    0,
    () => {
      let e = (0, a.useContext)(i);
      if (void 0 === e)
        throw Error(
          "useConnectWallet must be used within a ConnectWalletProvider",
        );
      return e;
    },
  ]);
};
