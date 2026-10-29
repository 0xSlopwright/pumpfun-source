// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(745018),
    i = e.i(439587),
    a = e.i(365089),
    s = e.i(352386);
  e.i(12692);
  var o = e.i(398902),
    l = e.i(167958),
    c = e.i(338871),
    u = e.i(913719),
    d = e.i(414470),
    m = e.i(729569),
    f = e.i(715450),
    p = e.i(187611),
    h = e.i(90832),
    y = e.i(54567),
    b = e.i(73594);
  let g = (e) => `${(0, m.b)(e)} HYPE`,
    v = 0;
  function w() {
    return ((v += 1), x);
  }
  function x() {
    ((v -= 1), setTimeout(_, 0));
  }
  function _() {
    if (v > 0) return;
    let { request: e, settle: t } = f.f.getState();
    e && t(null);
  }
  function S(e) {
    return e.settle;
  }
  function j(e) {
    return e.request;
  }
  function E(e) {
    let a,
      c,
      m,
      f,
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
      N = (0, r.c)(60),
      { request: L, settle: O } = e,
      { t: P } = (0, o.f)(),
      [T, D] = (0, s.useState)("idle");
    N[0] !== L.chargeLamports ||
    N[1] !== L.chargeUsd ||
    N[2] !== L.chargeUsdcAtomic
      ? ((a = {
          chargeUsd: L.chargeUsd,
          chargeLamports: L.chargeLamports,
          chargeUsdcAtomic: L.chargeUsdcAtomic,
        }),
        (N[0] = L.chargeLamports),
        (N[1] = L.chargeUsd),
        (N[2] = L.chargeUsdcAtomic),
        (N[3] = a))
      : (a = N[3]);
    let [R, F] = (0, s.useState)(a),
      $ = (0, s.useRef)(!1),
      I = "pending" === T,
      M = "terminal" === T;
    N[4] !== I || N[5] !== O
      ? ((c = (e) => {
          e || I || O(null);
        }),
        (N[4] = I),
        (N[5] = O),
        (N[6] = c))
      : (c = N[6]);
    let z = c;
    N[7] !== L.requestId || N[8] !== L.runner || N[9] !== O
      ? ((m = async () => {
          let e;
          if (!$.current) {
            (($.current = !0), D("pending"));
            try {
              e = await L.runner.run();
            } catch (r) {
              let e = r instanceof d.C ? r.reason : void 0,
                t = (0, d.f)(e);
              (y.logger.warn("[HypeGasTopupDialog] top-up attempt failed", {
                request_id: L.requestId,
                reason: e ?? "unknown",
                terminal: t,
                error: r instanceof Error ? r.message : String(r),
              }),
                ($.current = !1),
                D(t ? "terminal" : "error"));
              return;
            }
            if ((($.current = !1), "charge_updated" === e.kind)) {
              (F({
                chargeUsd: e.chargeUsd,
                chargeLamports: e.chargeLamports,
                chargeUsdcAtomic: e.chargeUsdcAtomic,
              }),
                D("idle"));
              return;
            }
            O(e.kind);
          }
        }),
        (N[7] = L.requestId),
        (N[8] = L.runner),
        (N[9] = O),
        (N[10] = m))
      : (m = N[10]);
    let W = m,
      K = Number(R.chargeUsd ?? "0"),
      Q = "usd" === L.denomination ? "USDC" : "SOL";
    if (
      (N[11] !== P
        ? ((f = P("trade.topup_gas.title")), (N[11] = P), (N[12] = f))
        : (f = N[12]),
      N[13] !== K || N[14] !== P
        ? ((g = P("trade.topup_gas.description", { amount: (0, h.w)(K) })),
          (N[13] = K),
          (N[14] = P),
          (N[15] = g))
        : (g = N[15]),
      N[16] !== g
        ? ((v = (0, t.jsx)("p", { className: b.c, children: g })),
          (N[16] = g),
          (N[17] = v))
        : (v = N[17]),
      N[18] === Symbol.for("react.memo_cache_sentinel")
        ? ((w = (0, t.jsx)(l.a, { className: "mt-1" })), (N[18] = w))
        : (w = N[18]),
      N[19] !== P
        ? ((x = P("trade.topup_gas.you_pay")), (N[19] = P), (N[20] = x))
        : (x = N[20]),
      N[21] !== Q || N[22] !== R || N[23] !== L.denomination || N[24] !== P)
    ) {
      let e;
      ((_ = P("common.amount_with_symbol", {
        amount:
          ((e = L.denomination),
          "usd" === e
            ? (0, u.N)(BigInt(R.chargeUsdcAtomic ?? 0), 6, 2)
            : (0, u.N)(BigInt(R.chargeLamports ?? 0), 9, 6)),
        symbol: (0, p.T)(Q, "coin-symbol"),
      })),
        (N[21] = Q),
        (N[22] = R),
        (N[23] = L.denomination),
        (N[24] = P),
        (N[25] = _));
    } else _ = N[25];
    N[26] !== K ? ((S = (0, h.w)(K)), (N[26] = K), (N[27] = S)) : (S = N[27]);
    let B = `(${S})`;
    return (
      N[28] !== B || N[29] !== x || N[30] !== _
        ? ((j = (0, t.jsx)("dl", {
            className: "flex flex-col",
            children: (0, t.jsx)(b.F, { label: x, value: _, aside: B }),
          })),
          (N[28] = B),
          (N[29] = x),
          (N[30] = _),
          (N[31] = j))
        : (j = N[31]),
      N[32] !== T || N[33] !== P
        ? ((E =
            "error" === T &&
            (0, t.jsx)("p", {
              role: "alert",
              className: b.B,
              children: P("trade.topup_gas.error"),
            })),
          (N[32] = T),
          (N[33] = P),
          (N[34] = E))
        : (E = N[34]),
      N[35] !== M || N[36] !== P
        ? ((k =
            M &&
            (0, t.jsx)("p", {
              role: "alert",
              className: b.B,
              children: P("trade.topup_gas.error_terminal"),
            })),
          (N[35] = M),
          (N[36] = P),
          (N[37] = k))
        : (k = N[37]),
      N[38] !== I || N[39] !== P
        ? ((C = I
            ? (0, t.jsxs)("div", {
                role: "status",
                className: b.L,
                children: [
                  (0, t.jsx)(n.Wh, {
                    "aria-hidden": !0,
                    className: "size-3.5 animate-spin",
                  }),
                  P("trade.topup_gas.pending"),
                ],
              })
            : null),
          (N[38] = I),
          (N[39] = P),
          (N[40] = C))
        : (C = N[40]),
      N[41] !== j || N[42] !== E || N[43] !== k || N[44] !== C || N[45] !== v
        ? ((A = (0, t.jsxs)(l.K, {
            className: "flex flex-col gap-2",
            children: [v, w, j, E, k, C],
          })),
          (N[41] = j),
          (N[42] = E),
          (N[43] = k),
          (N[44] = C),
          (N[45] = v),
          (N[46] = A))
        : (A = N[46]),
      N[47] !== I ||
      N[48] !== M ||
      N[49] !== T ||
      N[50] !== W ||
      N[51] !== O ||
      N[52] !== P
        ? ((U = I
            ? null
            : (0, t.jsxs)(l.c, {
                className: "flex-col items-stretch",
                children: [
                  !M &&
                    (0, t.jsx)(i.K, {
                      size: l.$,
                      isFullWidth: !0,
                      onClick: () => void W(),
                      children: P(
                        "error" === T
                          ? "common.retry"
                          : "trade.topup_gas.confirm",
                      ),
                    }),
                  (0, t.jsx)(i.K, {
                    variant: "secondary",
                    size: l.Z,
                    isFullWidth: !0,
                    onClick: () => O(null),
                    children: P("common.cancel"),
                  }),
                ],
              })),
          (N[47] = I),
          (N[48] = M),
          (N[49] = T),
          (N[50] = W),
          (N[51] = O),
          (N[52] = P),
          (N[53] = U))
        : (U = N[53]),
      N[54] !== z || N[55] !== I || N[56] !== A || N[57] !== U || N[58] !== f
        ? ((q = (0, t.jsxs)(l.N, {
            open: !0,
            onOpenChange: z,
            density: "terminal",
            size: "sm",
            title: f,
            hideClose: I,
            "data-testid": "hype-gas-topup-dialog",
            children: [A, U],
          })),
          (N[54] = z),
          (N[55] = I),
          (N[56] = A),
          (N[57] = U),
          (N[58] = f),
          (N[59] = q))
        : (q = N[59]),
      q
    );
  }
  function k(e) {
    let u,
      d,
      f,
      p,
      y,
      v,
      w,
      x,
      _,
      S,
      j,
      E,
      k,
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
      H = (0, r.c)(90),
      { request: V, settle: G } = e,
      { t: Y } = (0, o.f)(),
      { toggleChat: Z } = (0, c.f)(),
      [X, J] = (0, s.useState)("waiting"),
      [ee, et] = (0, s.useState)(0);
    (H[0] !== X || H[1] !== V || H[2] !== G
      ? ((u = () => {
          if ("waiting" !== X) return;
          let e = new AbortController();
          return (
            V.waitForFunding(e.signal).then((t) => {
              if (!e.signal.aborted) {
                if ("funded" === t) return void G("already_funded");
                "timed_out" === t && J("timed_out");
              }
            }),
            () => e.abort()
          );
        }),
        (H[0] = X),
        (H[1] = V),
        (H[2] = G),
        (H[3] = u))
      : (u = H[3]),
      H[4] !== X || H[5] !== V || H[6] !== G || H[7] !== ee
        ? ((d = [V, G, X, ee]),
          (H[4] = X),
          (H[5] = V),
          (H[6] = G),
          (H[7] = ee),
          (H[8] = d))
        : (d = H[8]),
      (0, s.useEffect)(u, d),
      H[9] === Symbol.for("react.memo_cache_sentinel")
        ? ((f = () => {
            (et(C), J("waiting"));
          }),
          (H[9] = f))
        : (f = H[9]));
    let er = f;
    H[10] !== G || H[11] !== Z
      ? ((p = () => {
          (Z(), G(null));
        }),
        (H[10] = G),
        (H[11] = Z),
        (H[12] = p))
      : (p = H[12]);
    let en = p;
    if (
      H[13] !== V.balanceWei ||
      H[14] !== V.chargeSymbol ||
      H[15] !== V.chargeUsd ||
      H[16] !== V.reason ||
      H[17] !== V.requiredWei ||
      H[18] !== G ||
      H[19] !== Y
    ) {
      let e = {
        amount: (0, m.b)(V.requiredWei),
        balance: (0, m.b)(V.balanceWei),
        charge: (0, h.w)(Number(V.chargeUsd ?? "0")),
        symbol: V.chargeSymbol,
      };
      ((v = l.N),
        (A = !0),
        H[31] !== G
          ? ((U = (e) => {
              e || G(null);
            }),
            (H[31] = G),
            (H[32] = U))
          : (U = H[32]),
        (w = "terminal"),
        (x = "sm"),
        H[33] !== Y
          ? ((_ = Y("web.trade.hype_gas_wait_title")), (H[33] = Y), (H[34] = _))
          : (_ = H[34]),
        (S = "hype-gas-wait-dialog"),
        (y = l.K),
        (k = "flex flex-col gap-2"),
        (j = b.c),
        (E =
          "unaffordable" === V.reason
            ? Y("web.trade.hype_gas_wait_unaffordable", e)
            : Y("web.trade.hype_gas_wait_unavailable", e)),
        (H[13] = V.balanceWei),
        (H[14] = V.chargeSymbol),
        (H[15] = V.chargeUsd),
        (H[16] = V.reason),
        (H[17] = V.requiredWei),
        (H[18] = G),
        (H[19] = Y),
        (H[20] = y),
        (H[21] = v),
        (H[22] = w),
        (H[23] = x),
        (H[24] = _),
        (H[25] = S),
        (H[26] = j),
        (H[27] = E),
        (H[28] = k),
        (H[29] = A),
        (H[30] = U));
    } else
      ((y = H[20]),
        (v = H[21]),
        (w = H[22]),
        (x = H[23]),
        (_ = H[24]),
        (S = H[25]),
        (j = H[26]),
        (E = H[27]),
        (k = H[28]),
        (A = H[29]),
        (U = H[30]));
    return (
      H[35] !== j || H[36] !== E
        ? ((q = (0, t.jsx)("p", { className: j, children: E })),
          (H[35] = j),
          (H[36] = E),
          (H[37] = q))
        : (q = H[37]),
      H[38] === Symbol.for("react.memo_cache_sentinel")
        ? ((N = (0, t.jsx)(l.a, { className: "mt-1" })), (H[38] = N))
        : (N = H[38]),
      H[39] !== Y
        ? ((L = Y("web.trade.hype_gas_needed")), (H[39] = Y), (H[40] = L))
        : (L = H[40]),
      H[41] !== V.requiredWei
        ? ((O = g(V.requiredWei)), (H[41] = V.requiredWei), (H[42] = O))
        : (O = H[42]),
      H[43] !== L || H[44] !== O
        ? ((P = (0, t.jsx)(b.F, { label: L, value: O })),
          (H[43] = L),
          (H[44] = O),
          (H[45] = P))
        : (P = H[45]),
      H[46] !== Y
        ? ((T = Y("web.trade.hype_gas_you_have")), (H[46] = Y), (H[47] = T))
        : (T = H[47]),
      H[48] !== V.balanceWei
        ? ((D = g(V.balanceWei)), (H[48] = V.balanceWei), (H[49] = D))
        : (D = H[49]),
      H[50] !== T || H[51] !== D
        ? ((R = (0, t.jsx)(b.F, { label: T, value: D })),
          (H[50] = T),
          (H[51] = D),
          (H[52] = R))
        : (R = H[52]),
      H[53] !== P || H[54] !== R
        ? ((F = (0, t.jsxs)("dl", {
            className: "flex flex-col",
            children: [P, R],
          })),
          (H[53] = P),
          (H[54] = R),
          (H[55] = F))
        : (F = H[55]),
      H[56] !== X || H[57] !== V.evmWalletAddress || H[58] !== Y
        ? (($ =
            "timed_out" === X
              ? (0, t.jsx)("p", {
                  role: "alert",
                  className: b.B,
                  children: Y("web.trade.hype_gas_wait_timed_out", {
                    address: (0, a.d)(V.evmWalletAddress, 8, 4),
                  }),
                })
              : (0, t.jsxs)("div", {
                  role: "status",
                  className: b.L,
                  children: [
                    (0, t.jsx)(n.Wh, {
                      "aria-hidden": !0,
                      className: "size-3.5 animate-spin",
                    }),
                    Y("web.trade.hype_gas_waiting"),
                  ],
                })),
          (H[56] = X),
          (H[57] = V.evmWalletAddress),
          (H[58] = Y),
          (H[59] = $))
        : ($ = H[59]),
      H[60] !== y || H[61] !== q || H[62] !== F || H[63] !== $ || H[64] !== k
        ? ((I = (0, t.jsxs)(y, { className: k, children: [q, N, F, $] })),
          (H[60] = y),
          (H[61] = q),
          (H[62] = F),
          (H[63] = $),
          (H[64] = k),
          (H[65] = I))
        : (I = H[65]),
      H[66] !== en || H[67] !== X || H[68] !== Y
        ? ((M =
            "timed_out" === X
              ? (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsx)(i.K, {
                      size: l.$,
                      isFullWidth: !0,
                      onClick: er,
                      children: Y("web.trade.hype_gas_keep_waiting"),
                    }),
                    (0, t.jsx)(i.K, {
                      variant: "secondary",
                      size: l.Z,
                      isFullWidth: !0,
                      onClick: en,
                      children: Y("common.contact_support"),
                    }),
                  ],
                })
              : null),
          (H[66] = en),
          (H[67] = X),
          (H[68] = Y),
          (H[69] = M))
        : (M = H[69]),
      H[70] !== G
        ? ((z = () => G(null)), (H[70] = G), (H[71] = z))
        : (z = H[71]),
      H[72] !== Y
        ? ((W = Y("common.cancel")), (H[72] = Y), (H[73] = W))
        : (W = H[73]),
      H[74] !== z || H[75] !== W
        ? ((K = (0, t.jsx)(i.K, {
            variant: "secondary",
            size: l.Z,
            isFullWidth: !0,
            onClick: z,
            children: W,
          })),
          (H[74] = z),
          (H[75] = W),
          (H[76] = K))
        : (K = H[76]),
      H[77] !== M || H[78] !== K
        ? ((Q = (0, t.jsxs)(l.c, {
            className: "flex-col items-stretch",
            children: [M, K],
          })),
          (H[77] = M),
          (H[78] = K),
          (H[79] = Q))
        : (Q = H[79]),
      H[80] !== v ||
      H[81] !== w ||
      H[82] !== x ||
      H[83] !== _ ||
      H[84] !== S ||
      H[85] !== I ||
      H[86] !== Q ||
      H[87] !== A ||
      H[88] !== U
        ? ((B = (0, t.jsxs)(v, {
            open: A,
            onOpenChange: U,
            density: w,
            size: x,
            title: _,
            "data-testid": S,
            children: [I, Q],
          })),
          (H[80] = v),
          (H[81] = w),
          (H[82] = x),
          (H[83] = _),
          (H[84] = S),
          (H[85] = I),
          (H[86] = Q),
          (H[87] = A),
          (H[88] = U),
          (H[89] = B))
        : (B = H[89]),
      B
    );
  }
  function C(e) {
    return e + 1;
  }
  e.s([
    "HypeGasTopupDialog",
    0,
    function () {
      let e,
        n,
        i = (0, r.c)(4),
        a = (0, f.f)(j),
        o = (0, f.f)(S);
      return (i[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = []), (i[0] = e))
        : (e = i[0]),
      (0, s.useEffect)(w, e),
      a)
        ? (i[1] !== a || i[2] !== o
            ? ((n =
                "charge" === a.mode
                  ? (0, t.jsx)(E, { request: a, settle: o }, a.requestId)
                  : (0, t.jsx)(k, { request: a, settle: o }, a.requestId)),
              (i[1] = a),
              (i[2] = o),
              (i[3] = n))
            : (n = i[3]),
          n)
        : null;
    },
  ]);
};
