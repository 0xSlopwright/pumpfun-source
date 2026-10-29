// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t,
    n = (e) => {
      let t = e?.wallet,
        n = t?.features?.["solana:signTransaction"];
      if (Array.isArray(t?.accounts) && n?.signTransaction)
        return {
          accounts: t.accounts,
          signsV1: n.supportedTransactionVersions?.includes(1) ?? !1,
          signTransaction: n.signTransaction.bind(n),
        };
    },
    r = new Set(["Phantom", "Solflare", "Backpack"]),
    i = "pump:v1-refused-wallets:v1",
    a = () => {
      try {
        return globalThis.localStorage ?? null;
      } catch {
        return null;
      }
    },
    o = {};
  window.addEventListener("storage", (e) => {
    (null === e.key || e.key === i) && (t = void 0);
  });
  let l = () => {
      if (t) return t;
      let e = a();
      if (!e) return (t = o);
      let n = {};
      try {
        let t = JSON.parse(e.getItem(i) ?? "{}");
        if (t && "object" == typeof t && !Array.isArray(t))
          for (let [e, r] of Object.entries(t))
            "number" == typeof r && (n[e] = r);
      } catch {
        n = {};
      }
      return (t = n);
    },
    s = (e) => (l()[e] ?? 0) > Date.now();
  e.s([
    "u",
    0,
    (e) => !!e?.name && r.has(e.name) && !s(e.name) && (n(e)?.signsV1 ?? !1),
    "Q",
    0,
    () => {
      ((t = void 0), (o = {}));
      try {
        a()?.removeItem(i);
      } catch {}
    },
    "s",
    0,
    (e) => {
      let n = Date.now(),
        r = {
          ...Object.fromEntries(Object.entries(l()).filter(([, e]) => e > n)),
          [e]: n + 6048e5,
        };
      ((t = r), (o = r));
      try {
        a()?.setItem(i, JSON.stringify(r));
      } catch {}
    },
    "A",
    0,
    n,
    "M",
    0,
    s,
  ]);
};
