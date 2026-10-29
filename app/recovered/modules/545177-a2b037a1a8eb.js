// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(313017),
    n = e.i(503630),
    r = e.i(22675),
    a = e.i(371047),
    s = e.i(233404);
  async function i(e, r, l = 6e4) {
    let c,
      u = (0, n.t)().replace(/\/+$/, ""),
      d = `${u}/${e.replace(/^\/+/, "")}`;
    try {
      c = await fetch(d, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(0, a.c)(),
          ...(0, t.z)(),
        },
        body: JSON.stringify((0, s.Y)(r)),
        signal: AbortSignal.timeout(l),
      });
    } catch (e) {
      return {
        kind: "error",
        message: e instanceof Error ? e.message : "network error",
      };
    }
    if (!c.ok) return { kind: "error", message: await o(c) };
    try {
      return { kind: "ok", data: await c.json() };
    } catch {
      return { kind: "error", message: "invalid JSON response" };
    }
  }
  async function o(e) {
    try {
      let t = await e.json();
      if (t?.error) return t.error;
    } catch {}
    return `request failed (${e.status})`;
  }
  let l = (e) =>
    Array.isArray(e) && e.every((e) => "string" == typeof e) ? e : [];
  async function c(e) {
    let t,
      n = await i("transactions/creator-fees", {
        wallet: e.wallet,
        mint: e.mint,
      });
    if ("error" === n.kind) return { kind: "error", message: n.message };
    let a = n.data.fees?.claim_transaction;
    if (!a || n.data.fees?.is_claimable === !1) return { kind: "none" };
    try {
      t = (0, r.m)(a);
    } catch {
      return { kind: "error", message: "could not decode claim transaction" };
    }
    return { kind: "tx", tx: t, transactions: l(n.data.fees?.transactions) };
  }
  async function u(e) {
    let t,
      n = await i("transactions/creator-fees/vault", { wallet: e.wallet });
    if ("error" === n.kind) return { kind: "error", message: n.message };
    let a = n.data.collect_transaction;
    if (!a || !1 === n.data.is_claimable) return { kind: "none" };
    try {
      t = (0, r.m)(a);
    } catch {
      return { kind: "error", message: "could not decode collect transaction" };
    }
    return { kind: "tx", tx: t, transactions: l(n.data.transactions) };
  }
  async function d(e, t, n) {
    if (e.confirmed) return e.succeeded;
    if (!e.signature) return !1;
    let r = Date.now() + (n?.pollTimeoutMs ?? 3e4),
      a = n?.pollIntervalMs ?? 2e3;
    for (;;) {
      let n = !1;
      try {
        let { value: r } = await t.getSignatureStatuses([e.signature]),
          a = r[0];
        if (a?.err) n = !0;
        else if (
          a?.confirmationStatus === "confirmed" ||
          a?.confirmationStatus === "finalized"
        )
          return !0;
      } catch {}
      if (n) throw Error("Claim transaction reverted on-chain");
      if (Date.now() >= r) return !1;
      await new Promise((e) => setTimeout(e, a));
    }
  }
  async function f(e, t) {
    return p({ transaction: (0, r.r)(e) }, t);
  }
  async function m(e, t) {
    return p({ transactions: e.map(r.r) }, t, 6e4 * e.length);
  }
  async function p(e, t, n) {
    (t?.route && (e.route = t.route),
      t?.options && (e.options = t.options),
      t?.nonTradeTx && (e.non_trade_tx = !0));
    let r = await i("transactions/send", e, n);
    return "ok" !== r.kind || r.data.signature
      ? r
      : { kind: "error", message: "send response missing signature" };
  }
  e.s([
    "_",
    0,
    d,
    "q",
    0,
    c,
    "i",
    0,
    u,
    "S",
    0,
    i,
    "M",
    0,
    function (e) {
      return e.confirmed && e.succeeded;
    },
    "s",
    0,
    f,
    "l",
    0,
    m,
  ]);
};
