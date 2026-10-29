// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(357500),
    a = e.i(913719),
    r = e.i(946985),
    n = e.i(605587);
  let i = /^native:(\d+)$/,
    l = /^0x[0-9a-fA-F]{40}$/,
    s = (e, a) =>
      null != e && (0, r.Z)(a).some((t) => t.id === e)
        ? ((0, t.findChainByEvmChainId)(e) ?? null)
        : null,
    o = (e) =>
      (0, r.Z)(e)
        .map((e) => (0, t.findChainByEvmChainId)(e.id))
        .filter((e) => void 0 !== e)
        .filter((e) => null !== e.evmChainId),
    d = (e) => (0, n.n)(e.caip2) ?? e.displayName,
    c = (e) => {
      if (null == e || "" === e) return null;
      let t = "number" == typeof e ? e : Number(e);
      return Number.isFinite(t) ? t : null;
    },
    u = (e, t) => `${e}:${t.toLowerCase()}`,
    f = (e, t) => ({
      id: `${t}:native`,
      chainId: t,
      chainSlug: e.slug,
      chainName: d(e),
      contract: null,
      isNative: !0,
      symbol: e.nativeCurrency.symbol,
      name: e.nativeCurrency.name,
      imageUri: null,
      decimals: e.nativeCurrency.decimals || 18,
      balanceRaw: null,
      balanceUi: 0,
      valueUsd: null,
      priceUsd: null,
    }),
    m = (e, t) => Number(e) / 10 ** t;
  e.s([
    "I",
    0,
    (e, t) => {
      let a = [];
      for (let r of e) {
        let e = c(r.network_id),
          n = s(e, t);
        if (!n || null === e) continue;
        let o = r.token_mint ?? "",
          m = c(r.balance) ?? 0,
          h = c(r.value),
          p = c(r.token_price);
        if (o.match(i)) {
          a.push({ ...f(n, e), balanceUi: m, valueUsd: h, priceUsd: p });
          continue;
        }
        if (!l.test(o) || m <= 0) continue;
        let g = c(r.decimals);
        a.push({
          id: u(e, o),
          chainId: e,
          chainSlug: n.slug,
          chainName: d(n),
          contract: o,
          isNative: !1,
          symbol: r.token_symbol?.trim() || "???",
          name: r.token_name?.trim() || o,
          imageUri: r.token_image?.trim() || null,
          decimals: null !== g && Number.isInteger(g) && g >= 0 ? g : 18,
          balanceRaw: null,
          balanceUi: m,
          valueUsd: h,
          priceUsd: p,
        });
      }
      return a;
    },
    "g",
    0,
    s,
    "N",
    0,
    o,
    "A",
    0,
    ({ chainStateHoldings: e, nativeBalances: t, exposure: a }) => {
      let r = [],
        n = [],
        i = new Set();
      for (let a of e) {
        if (!a.isNative) {
          n.push(a);
          continue;
        }
        i.add(a.chainId);
        let e = t.get(a.chainId);
        r.push(
          null == e
            ? a
            : {
                ...a,
                balanceRaw: e,
                balanceUi: m(e, a.decimals),
                valueUsd:
                  null === a.priceUsd
                    ? a.valueUsd
                    : a.priceUsd * m(e, a.decimals),
              },
        );
      }
      for (let e of o(a)) {
        let a = e.evmChainId;
        if (null === a || i.has(a)) continue;
        let n = t.get(a);
        null != n &&
          r.push({
            ...f(e, a),
            balanceRaw: n,
            balanceUi: m(n, e.nativeCurrency.decimals || 18),
          });
      }
      return [
        ...n,
        ...r.filter(
          (e) =>
            (null !== e.balanceRaw && e.balanceRaw > BigInt(0)) ||
            (null === e.balanceRaw && e.balanceUi > 0),
        ),
      ];
    },
    "s",
    0,
    (e, t) => {
      if (e <= BigInt(0)) return "0";
      let a = e.toString().padStart(t + 1, "0"),
        r = a.slice(0, a.length - t) || "0",
        n = a.slice(a.length - t).replace(/0+$/, "");
      return n ? `${r}.${n}` : r;
    },
    "S",
    0,
    m,
    "Z",
    0,
    u,
    "T",
    0,
    (e, t) =>
      !Number.isFinite(e) || e < 0
        ? null
        : (0, a.v)(
            ((e) => {
              let t = String(e);
              if (!/e/i.test(t)) return t;
              let [a = "0", r = "0"] = t.split(/e/i),
                [n = "0", i = ""] = a.split("."),
                l = `${n}${i}`,
                s = n.length + Number(r);
              return s <= 0
                ? `0.${"0".repeat(-s)}${l}`
                : s >= l.length
                  ? `${l}${"0".repeat(s - l.length)}`
                  : `${l.slice(0, s)}.${l.slice(s)}`;
            })(e),
            t,
          ),
  ]);
};
