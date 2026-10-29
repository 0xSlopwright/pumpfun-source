// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(541710),
    a = e.i(646908);
  let r = [
      "ethereum",
      "base",
      "bsc",
      "hyperevm",
      "monad",
      "ink",
      "robinhood",
      "arc",
      "megaeth",
      "xlayer",
      "polygon",
      "arbitrum",
    ],
    n = (e, t) =>
      "wallet" === e.type &&
      "privy" === e.walletClientType &&
      e.chainType === t &&
      "address" in e &&
      "string" == typeof e.address,
    i = (e) =>
      (e?.linkedAccounts ?? [])
        .filter((e) => n(e, "ethereum"))
        .map((e) => e.address),
    l = (e, t) =>
      (e?.linkedAccounts ?? []).some((e) => n(e, "solana") && e.address === t),
    s = (e, t) => e.toLowerCase() === t.toLowerCase(),
    o = /^[0-9a-f]{64}$/,
    d = (e) => `${e.slice(0, 6)}...${e.slice(-4)}`,
    c = /^[0-9a-f]{64}$/,
    u = /^0x[0-9a-f]{40}$/;
  e.s([
    "C",
    0,
    (e) => {
      let n = (({
          solanaAddress: e,
          mappedEvmAddress: a,
          privyUser: n,
          connection: o,
          exposure: d,
        }) => {
          if (!e) return [];
          let c = l(n, e),
            u = [
              {
                id: `solana:${e}`,
                kind: "solana",
                chainSlug: "solana",
                address: e,
                externalWalletName:
                  "external" === o.kind ? (o.walletName ?? null) : null,
                exportable: c,
              },
            ];
          if (void 0 === a) return u;
          let f = c ? i(n) : [],
            m = a ?? f[0] ?? null;
          if (null === m) return u;
          let h = f.find((e) => s(e, m)) ?? null,
            p = h ?? m;
          for (let e of r.filter((e) => (0, t.F)(e, d)))
            u.push({
              id: `${e}:${p.toLowerCase()}`,
              kind: "evm",
              chainSlug: e,
              address: p,
              externalWalletName: null,
              exportable: null !== h,
            });
          for (let e of f)
            s(e, p) ||
              u.push({
                id: `evm:${e.toLowerCase()}`,
                kind: "evm",
                chainSlug: "evm",
                address: e,
                externalWalletName: null,
                exportable: !0,
              });
          return u;
        })(e),
        { tonAddress: o, exposure: d } = e;
      return 0 !== n.length && o && (0, t.F)(a.z, d)
        ? [
            ...n,
            {
              id: `ton:${o}`,
              kind: "ton",
              chainSlug: a.z,
              address: o,
              externalWalletName: null,
              exportable: !1,
            },
          ]
        : n;
    },
    "D",
    0,
    (e) =>
      "string" == typeof e && (0, a.R)(e) && (e.includes(".") || o.test(e)),
    "M",
    0,
    i,
    "t",
    0,
    l,
    "J",
    0,
    d,
    "j",
    0,
    (e, t, r = d) =>
      (0, a._)(t)
        ? (0, a.f)(e)
        : (0, a.B)(t)
          ? c.test(e)
            ? `${e.slice(0, 4)}…${e.slice(-4)}`
            : u.test(e)
              ? `${e.slice(0, 6)}…${e.slice(-4)}`
              : e
          : r(e),
  ]);
};
