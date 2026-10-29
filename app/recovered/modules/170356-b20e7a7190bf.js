// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(254667),
    n = e.i(541710),
    r = e.i(460261),
    s = e.i(526317);
  let i = [4663, 8453, 56, 57073, 5042, 4326, 196, 143, 137],
    a = (e) => null != e && i.includes(e),
    o = (e) => a(e) && null === (0, r.L)(String(e)),
    l = new Set([
      "evm_wallet_missing",
      "evm_signer_not_ready",
      "solana_wallet_missing",
    ]),
    u = {
      needs_claim: "web.trade.relay_error_unauthorized",
      wallet_not_ready: "web.trade.wallet_not_ready",
      price_unknown: "web.trade.relay_error_unavailable",
      bridge_declined: "web.trade.relay_error_no_route",
    },
    c = (e) =>
      e === s.s
        ? "region_restricted"
        : e === s.t
          ? "token_unsellable"
          : "fallback";
  e.s([
    "b",
    0,
    (e, t) => new r.X(t(u[e]), { reason: "BRIDGE_ONLY_REFUSED" }),
    "R",
    0,
    (e) => c((0, s.v)(e) ? e.code : void 0),
    "t",
    0,
    c,
    "x",
    0,
    o,
    "X",
    0,
    (e, t = n.q) => a(e) && (0, n.b)(e, t),
    "W",
    0,
    (e) => {
      t.y.info("[bridgeRouteDecision] bridge_route_decision", e);
    },
    "w",
    0,
    ({
      swapId: e,
      mint: n,
      chainId: i,
      direction: a,
      bridgeCode: o,
      relayError: l,
    }) => {
      o !== s.f ||
        (l instanceof r.X &&
          "NO_SWAP_ROUTES_FOUND" === l.reason &&
          t.y.info("[bridgeRouteDecision] no_route_anywhere", {
            swap_id: e,
            direction: a,
            mint: n,
            chain_id: i,
            bridge_code: o,
            relay_reason: l.reason,
          }));
    },
    "c",
    0,
    ({
      chainId: e,
      userId: r,
      mint: s,
      direction: i,
      gateCode: a,
      exposure: u,
    }) => {
      if (null == e || !o(e)) return null;
      let c = (0, n.b)(e, u)
        ? r && "no_user_id" !== a
          ? void 0 !== a && l.has(a)
            ? "wallet_not_ready"
            : "sol_price_unknown" === a
              ? "price_unknown"
              : "bridge_declined"
          : "needs_claim"
        : "bridge_declined";
      return (
        t.y.info("[bridgeRouteDecision] bridge_only_refused", {
          chain_id: e,
          mint: s,
          direction: i,
          refusal: c,
          gate_code: a,
        }),
        c
      );
    },
  ]);
};
