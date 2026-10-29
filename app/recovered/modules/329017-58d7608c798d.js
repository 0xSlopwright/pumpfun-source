// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(352386),
    r = e.i(526080),
    n = e.i(606933),
    a = e.i(689943),
    o = e.i(998243),
    s = e.i(372743),
    l = e.i(978854),
    d = e.i(680930);
  let c = new WeakMap(),
    u = (e, r, u) => {
      let m,
        f,
        b,
        p,
        h,
        w,
        v,
        g,
        y,
        x,
        k = (0, t.c)(31);
      k[0] !== u
        ? ((m = void 0 === u ? {} : u), (k[0] = u), (k[1] = m))
        : (m = k[1]);
      let {
          shouldFetch: C,
          isEnabled: S,
          chainId: N,
          enablePolling: _,
          pollingInterval: j,
        } = m,
        P = void 0 === C || C,
        E = void 0 === j ? d.t.POLLING_INTERVAL : j,
        O = (0, n.useQueryClient)(),
        T = P && (void 0 === S || S),
        M = !!(void 0 !== _ && _) && E;
      (k[2] !== e
        ? ((f = (t) => (0, s.u)({ [e]: t })), (k[2] = e), (k[3] = f))
        : (f = k[3]),
        k[4] !== N ||
        k[5] !== e ||
        k[6] !== r ||
        k[7] !== T ||
        k[8] !== M ||
        k[9] !== f
          ? ((b = {
              mintAddress: e,
              program: r,
              chainId: N,
              enabled: T,
              refetchInterval: M,
              onFetched: f,
            }),
            (k[4] = N),
            (k[5] = e),
            (k[6] = r),
            (k[7] = T),
            (k[8] = M),
            (k[9] = f),
            (k[10] = b))
          : (b = k[10]));
      let { data: A, isLoading: F } = (0, a.F)(b);
      (k[11] !== A || k[12] !== e
        ? ((p = () => {
            A && (0, o.f)(() => (0, s.c)({ [e]: A }));
          }),
          (h = [e, A]),
          (k[11] = A),
          (k[12] = e),
          (k[13] = p),
          (k[14] = h))
        : ((p = k[13]), (h = k[14])),
        (0, i.useEffect)(p, h),
        k[15] !== e || k[16] !== O || k[17] !== P
          ? ((w = () => {
              if (P && e)
                return (function (e, t) {
                  let i = c.get(e) ?? new Map();
                  c.set(e, i);
                  let r = i.get(t);
                  if (r) i.set(t, { ...r, holders: r.holders + 1 });
                  else {
                    let r = l.m.getState().latestByMint[t],
                      n = setInterval(() => {
                        let i = l.m.getState().latestByMint[t];
                        i !== r &&
                          ((r = i),
                          e.invalidateQueries({
                            queryKey: a.o.marketActivityByMintPrefix(t),
                          }));
                      }, 1e4);
                    i.set(t, { holders: 1, timer: n });
                  }
                  let n = !1;
                  return () => {
                    if (n) return;
                    n = !0;
                    let e = i.get(t);
                    if (e) {
                      if (e.holders > 1)
                        return void i.set(t, { ...e, holders: e.holders - 1 });
                      (clearInterval(e.timer), i.delete(t));
                    }
                  };
                })(O, e);
            }),
            (v = [e, P, O]),
            (k[15] = e),
            (k[16] = O),
            (k[17] = P),
            (k[18] = w),
            (k[19] = v))
          : ((w = k[18]), (v = k[19])),
        (0, i.useEffect)(w, v),
        k[20] !== e
          ? ((g = (t) => t.marketActivity[e]), (k[20] = e), (k[21] = g))
          : (g = k[21]));
      let I = (0, s.f)(g);
      k[22] !== N || k[23] !== e || k[24] !== r || k[25] !== O
        ? ((y = async () => {
            e &&
              (await O.invalidateQueries({
                queryKey: a.o.marketActivityByMint(e, r, N),
              }));
          }),
          (k[22] = N),
          (k[23] = e),
          (k[24] = r),
          (k[25] = O),
          (k[26] = y))
        : (y = k[26]);
      let R = y;
      return (
        k[27] !== F || k[28] !== I || k[29] !== R
          ? ((x = { marketActivity: I, loading: F, refetchMint: R }),
            (k[27] = F),
            (k[28] = I),
            (k[29] = R),
            (k[30] = x))
          : (x = k[30]),
        x
      );
    };
  var m = e.i(803797),
    f = e.i(653805),
    b = e.i(152584),
    p = e.i(783111),
    h = e.i(605587),
    w = e.i(254667);
  class v extends Error {
    constructor(e) {
      (super(e), (this.name = "MarketDataValidationError"));
    }
  }
  function g(e) {
    if (null != e) {
      if ("number" == typeof e && !isNaN(e)) return e;
      if ("string" == typeof e) {
        let t = parseFloat(e);
        return isNaN(t) ? void 0 : t;
      }
    }
  }
  var y = e.i(263889);
  function x(e) {
    let n,
      a,
      s,
      l,
      d,
      c = (0, t.c)(21),
      {
        coin: b,
        liveUsdMarketCap: p,
        liveLastTradeTimestamp: w,
        liveWholeTokenSupply: v,
      } = e,
      g = void 0 === w ? null : w,
      x = void 0 === v ? null : v,
      { athMarketCap: k, isLoading: C } = (0, y.f)(b);
    c[0] !== b.chain_id || c[1] !== b.mint
      ? ((n = (0, h.N)({ mint: b.mint, chainId: b.chain_id })),
        (c[0] = b.chain_id),
        (c[1] = b.mint),
        (c[2] = n))
      : (n = c[2]);
    let S = n,
      N = void 0 === p;
    c[3] !== b || c[4] !== S || c[5] !== p || c[6] !== x
      ? ((a = S
          ? void 0
          : null != p && "number" == typeof x && x > 0
            ? x
            : (0, r.B)(b)),
        (c[3] = b),
        (c[4] = S),
        (c[5] = p),
        (c[6] = x),
        (c[7] = a))
      : (a = c[7]);
    let _ = a;
    c[8] !== k ||
    c[9] !== C ||
    c[10] !== b.usd_market_cap ||
    c[11] !== N ||
    c[12] !== g ||
    c[13] !== p ||
    c[14] !== _
      ? ((s =
          C || N
            ? void 0
            : {
                usdMarketCap: p ?? b.usd_market_cap,
                usdAthMarketCap: k,
                isFresh: null !== p,
                lastTradeTimestamp:
                  null !== p && "number" == typeof g ? g : void 0,
                ...(void 0 !== _ ? { wholeTokenSupply: _ } : {}),
              }),
        (c[8] = k),
        (c[9] = C),
        (c[10] = b.usd_market_cap),
        (c[11] = N),
        (c[12] = g),
        (c[13] = p),
        (c[14] = _),
        (c[15] = s))
      : (s = c[15]);
    let j = s;
    (c[16] !== b.mint || c[17] !== j
      ? ((l = { mint: b.mint, initialData: j }),
        (c[16] = b.mint),
        (c[17] = j),
        (c[18] = l))
      : (l = c[18]),
      (function (e) {
        let r,
          n,
          a = (0, t.c)(9),
          { mint: s, initialData: l } = e,
          d = ((0, f.F)(s), void 0 !== l),
          c = l?.usdMarketCap,
          u = l?.usdAthMarketCap,
          b = l?.isFresh === !0,
          p = l?.lastTradeTimestamp ?? void 0,
          h = l?.wholeTokenSupply,
          w = (0, i.useRef)(null),
          v = (0, i.useRef)(null);
        (a[0] !== d ||
        a[1] !== b ||
        a[2] !== p ||
        a[3] !== s ||
        a[4] !== u ||
        a[5] !== c ||
        a[6] !== h
          ? ((r = () => {
              if (
                (w.current?.mint !== s &&
                  (w.current = { mint: s, at: Date.now() }),
                !d)
              )
                return;
              let e = [s, c, u, b, p, h].join("|");
              if (v.current === e) return;
              v.current = e;
              let t = w.current.at;
              (0, o.f)(() =>
                (0, m.j)({
                  mint: s,
                  snapshot: {
                    usdMarketCap: c,
                    usdAthMarketCap: u,
                    isFresh: b,
                    lastTradeTimestamp: p,
                    wholeTokenSupply: h,
                  },
                  arrivedAt: t,
                }),
              );
            }),
            (n = [s, d, c, u, b, p, h]),
            (a[0] = d),
            (a[1] = b),
            (a[2] = p),
            (a[3] = s),
            (a[4] = u),
            (a[5] = c),
            (a[6] = h),
            (a[7] = r),
            (a[8] = n))
          : ((r = a[7]), (n = a[8])),
          (0, i.useEffect)(r, n));
      })(l),
      c[19] !== b.chain_id
        ? ((d = {
            shouldFetch: !0,
            isEnabled: !0,
            chainId: b.chain_id,
            enablePolling: !0,
          }),
          (c[19] = b.chain_id),
          (c[20] = d))
        : (d = c[20]),
      u(b.mint, b.program, d));
  }
  function k(e) {
    let n,
      o,
      l,
      d,
      c,
      m,
      f,
      x,
      k = (0, t.c)(39),
      { coin: C, liveUsdMarketCap: S, liveWholeTokenSupply: N } = e,
      _ = void 0 === N ? null : N,
      [j, P] = (0, i.useState)(!1);
    (k[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = () => {
          P(!0);
        }),
        (o = []),
        (k[0] = n),
        (k[1] = o))
      : ((n = k[0]), (o = k[1])),
      (0, i.useEffect)(n, o));
    let { athMarketCap: E, isLoading: O } = (0, y.f)(C);
    k[2] !== C.chain_id || k[3] !== C.mint
      ? ((l = (0, h.N)({ mint: C.mint, chainId: C.chain_id })),
        (k[2] = C.chain_id),
        (k[3] = C.mint),
        (k[4] = l))
      : (l = k[4]);
    let T = l;
    k[5] !== C
      ? ((d = (({ coin: e, supplyUi: t }) => {
          let i = (0, r.B)(e),
            n = (0, h.N)({ mint: e.mint, chainId: e.chain_id }) && !(0, r.u)(e);
          if (!(t > 0))
            return {
              displaySupply: 0,
              restToDisplayRatio: 1,
              restSupply: n ? 0 : i,
            };
          let a = (0, r.u)(e) && i > 0;
          return {
            displaySupply: t,
            restToDisplayRatio: a ? t / i : 1,
            restSupply: a || n ? t : i,
          };
        })({ coin: C, supplyUi: 0 })),
        (k[5] = C),
        (k[6] = d))
      : (d = k[6]);
    let { displaySupply: M, restToDisplayRatio: A, restSupply: F } = d,
      I = void 0 === S;
    k[7] !== C.chain_id
      ? ((c = {
          shouldFetch: !0,
          isEnabled: !0,
          chainId: C.chain_id,
          enablePolling: !0,
        }),
        (k[7] = C.chain_id),
        (k[8] = c))
      : (c = k[8]);
    let { loading: R } = u(C.mint, C.program, c);
    k[9] !== C.mint
      ? ((m = (e) => e.marketActivity[C.mint]), (k[9] = C.mint), (k[10] = m))
      : (m = k[10]);
    let W = (0, s.f)(m),
      V = (0, a.P)(C.mint, C.program, C.chain_id),
      L = C.volume_24h_usd,
      U = C.price_change_24h_bps;
    e: {
      let e, t;
      if (V) {
        f = void 0;
        break e;
      }
      k[11] !== U || k[12] !== L
        ? ((e = (0, p.w)({ volume_24h_usd: L, price_change_24h_bps: U })),
          (k[11] = U),
          (k[12] = L),
          (k[13] = e))
        : (e = k[13]);
      let i = e;
      (k[14] !== i
        ? ((t = i ? { "24h": i } : void 0), (k[14] = i), (k[15] = t))
        : (t = k[15]),
        (f = t));
    }
    let D = f,
      z = (0, b.f)(C.mint);
    if (
      k[16] !== E ||
      k[17] !== O ||
      k[18] !== D ||
      k[19] !== C.mint ||
      k[20] !== C.name ||
      k[21] !== C.symbol ||
      k[22] !== C.usd_market_cap ||
      k[23] !== M ||
      k[24] !== T ||
      k[25] !== j ||
      k[26] !== I ||
      k[27] !== S ||
      k[28] !== _ ||
      k[29] !== R ||
      k[30] !== F ||
      k[31] !== A ||
      k[32] !== W ||
      k[33] !== z
    ) {
      let e = j ? z : void 0,
        t = j ? (W ?? D) : void 0,
        i = j ? S : void 0,
        r = (({ row: e, basis: t }) => {
          if (e?.usdMarketCap) {
            if (!(t.displaySupply > 0)) {
              let i =
                !e.isLiveData && void 0 !== e.seedSupply && e.seedSupply > 0
                  ? e.seedSupply
                  : void 0;
              return { marketCap: e.usdMarketCap, supply: i ?? t.restSupply };
            }
            return e.priceUsd && e.priceUsd > 0
              ? {
                  marketCap: e.priceUsd * t.displaySupply,
                  supply: t.displaySupply,
                }
              : e.isLiveData
                ? { marketCap: e.usdMarketCap, supply: t.displaySupply }
                : {
                    marketCap: e.usdMarketCap * t.restToDisplayRatio,
                    supply: t.restSupply,
                  };
          }
        })({
          row: e,
          basis: { displaySupply: M, restToDisplayRatio: A, restSupply: F },
        }),
        n = !T && i && "number" == typeof _ && _ > 0 ? _ : F,
        a = r ?? { marketCap: (i || C.usd_market_cap || 0) * A, supply: n },
        o = a.marketCap || 0,
        s = !j || (!r && I),
        l = e?.priceUsd || (a.supply > 0 ? o / a.supply : 0),
        d = {
          currentMarketCap: o,
          isMarketCapProvisional: s,
          currentPrice: l,
          allTimeHighMarketCap: (e?.usdAthMarketCap || E || 0) * A,
          volume24h: t?.["24h"]?.volumeUSD ?? void 0,
          priceChange5m: t?.["5m"]?.priceChangePercent || 0,
          priceChange1h: t?.["1h"]?.priceChangePercent || 0,
          priceChange6h: t?.["6h"]?.priceChangePercent || 0,
          priceChange24h: t?.["24h"]?.priceChangePercent || 0,
          marketActivity: t,
          isLoading: O || R,
          isMarketActivityLoading: R,
          error: null,
        };
      try {
        let e, t;
        ((e = []),
          (t = {
            ...d,
            currentMarketCap: g(d.currentMarketCap),
            currentPrice: g(d.currentPrice),
            allTimeHighMarketCap: g(d.allTimeHighMarketCap),
            volume24h: g(d.volume24h),
            priceChange5m: g(d.priceChange5m),
            priceChange1h: g(d.priceChange1h),
            priceChange6h: g(d.priceChange6h),
            priceChange24h: g(d.priceChange24h),
          }),
          "boolean" != typeof t.isLoading &&
            e.push(`isLoading must be boolean (got: ${typeof t.isLoading})`),
          null !== t.error && "string" != typeof t.error && (t.error = null),
          void 0 !== t.currentMarketCap &&
            t.currentMarketCap < 0 &&
            e.push(
              `currentMarketCap cannot be negative (got: ${t.currentMarketCap})`,
            ),
          void 0 !== t.allTimeHighMarketCap &&
            t.allTimeHighMarketCap < 0 &&
            e.push(
              `allTimeHighMarketCap cannot be negative (got: ${t.allTimeHighMarketCap})`,
            ),
          void 0 !== t.volume24h &&
            t.volume24h < 0 &&
            e.push(`volume24h cannot be negative (got: ${t.volume24h})`),
          void 0 !== t.currentPrice &&
            t.currentPrice < 0 &&
            e.push(`currentPrice cannot be negative (got: ${t.currentPrice})`),
          void 0 !== t.currentMarketCap &&
            t.currentMarketCap > 1e15 &&
            e.push(
              `currentMarketCap seems unreasonably large (got: ${t.currentMarketCap})`,
            ),
          void 0 !== t.currentPrice &&
            t.currentPrice > 1e10 &&
            e.push(
              `currentPrice seems unreasonably large (got: ${t.currentPrice})`,
            ),
          e.length > 0 &&
            w.y.warn("Market data validation issues", { issues: e }),
          (x = t));
      } catch (e) {
        if (e instanceof v) {
          let t;
          (k[35] !== C.mint || k[36] !== C.name || k[37] !== C.symbol
            ? ((t = { mint: C.mint, symbol: C.symbol, name: C.name }),
              (k[35] = C.mint),
              (k[36] = C.name),
              (k[37] = C.symbol),
              (k[38] = t))
            : (t = k[38]),
            console.error("Market data validation failed:", e.message, {
              coin: t,
              rawData: d,
            }));
        }
        x = d;
      }
      ((k[16] = E),
        (k[17] = O),
        (k[18] = D),
        (k[19] = C.mint),
        (k[20] = C.name),
        (k[21] = C.symbol),
        (k[22] = C.usd_market_cap),
        (k[23] = M),
        (k[24] = T),
        (k[25] = j),
        (k[26] = I),
        (k[27] = S),
        (k[28] = _),
        (k[29] = R),
        (k[30] = F),
        (k[31] = A),
        (k[32] = W),
        (k[33] = z),
        (k[34] = x));
    } else x = k[34];
    return x;
  }
  e.s(
    [
      "U",
      0,
      ({ snapshot: e, mint: t }) => {
        if (void 0 === e || (0, h.c)(e.mint) !== (0, h.c)(t)) return;
        let i = e.coin?.last_trade_timestamp;
        return "number" == typeof i && Number.isFinite(i) && i > 0 ? i : null;
      },
      "D",
      0,
      ({ snapshot: e, mint: t }) => {
        if (void 0 === e || (0, h.c)(e.mint) !== (0, h.c)(t)) return;
        let i = e.coin?.usd_market_cap;
        return "number" == typeof i && Number.isFinite(i) && i > 0 ? i : null;
      },
      "j",
      0,
      ({ snapshot: e, mint: t }) => {
        if (void 0 === e || (0, h.c)(e.mint) !== (0, h.c)(t)) return;
        if (!e.coin) return null;
        let i = (0, r.B)(e.coin);
        return Number.isFinite(i) && i > 0 ? i : null;
      },
      "s",
      0,
      x,
      "T",
      0,
      function (e) {
        return (x(e), k(e));
      },
      "n",
      0,
      k,
    ],
    329017,
  );
};
