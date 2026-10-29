// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(965690);
  let r = (0, t.createContext)(i.O),
    n = () => (0, t.use)(r),
    l = (0, t.createContext)(!1);
  e.s(["C", 0, l, "p", 0, r, "X", 0, () => (0, t.use)(l), "V", 0, n], 515761);
  var a = e.i(732486),
    s = e.i(445242),
    c = e.i(219266),
    u = e.i(662093),
    o = e.i(338319),
    m = e.i(844969);
  let h = { success: "text-text-accent", error: "text-loss" },
    f = (0, t.memo)(
      (e) => {
        let i,
          r,
          n,
          l,
          c,
          u,
          f,
          d,
          p,
          g,
          y,
          k,
          b,
          x,
          v,
          w = (0, s.c)(45),
          {
            data: _,
            width: j,
            height: S,
            tipSerial: C,
            color: N,
            className: A,
            strokeWidth: E,
          } = e,
          R = void 0 === C ? 0 : C,
          W = void 0 === E ? m.G : E,
          T = (0, t.useId)();
        if (w[0] !== T) {
          let e;
          (w[2] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = /[^a-zA-Z0-9_-]/g), (w[2] = e))
            : (e = w[2]),
            (i = T.replace(e, "")),
            (w[0] = T),
            (w[1] = i));
        } else i = w[1];
        let F = `${i}-glow`;
        w[3] !== _ || w[4] !== S || w[5] !== j
          ? ((r = (0, m.R)(_, j, S)),
            (w[3] = _),
            (w[4] = S),
            (w[5] = j),
            (w[6] = r))
          : (r = w[6]);
        let I = r,
          [O, L] = (0, t.useState)(null),
          U = (0, t.useRef)(R);
        (w[7] !== R
          ? ((n = () => {
              let e = U.current;
              ((U.current = R),
                R !== e && L(0 === R ? null : Date.now() + m.n));
            }),
            (l = [R]),
            (w[7] = R),
            (w[8] = n),
            (w[9] = l))
          : ((n = w[8]), (l = w[9])),
          (0, t.useEffect)(n, l));
        let z = 0 === _.length,
          [B, D] = (0, t.useState)(z);
        (B !== z && (D(z), z && L(null)),
          w[10] !== O
            ? ((u = () => {
                if (null === O) return;
                let e = setTimeout(() => L(null), Math.max(0, O - Date.now()));
                return () => clearTimeout(e);
              }),
              (c = [O]),
              (w[10] = O),
              (w[11] = c),
              (w[12] = u))
            : ((c = w[11]), (u = w[12])),
          (0, t.useEffect)(u, c));
        let P = null !== O;
        if (!I) return null;
        let q = h[void 0 === N ? "success" : N];
        w[13] !== A || w[14] !== q
          ? ((f = (0, o.c)("block", q, A)),
            (w[13] = A),
            (w[14] = q),
            (w[15] = f))
          : (f = w[15]);
        let M = `0 0 ${j} ${S}`;
        (w[16] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = (0, a.jsx)("feGaussianBlur", { stdDeviation: m.j })),
            (p = (0, a.jsx)("feOffset", { dy: m.B })),
            (w[16] = d),
            (w[17] = p))
          : ((d = w[16]), (p = w[17])),
          w[18] !== F || w[19] !== S || w[20] !== j
            ? ((g = (0, a.jsx)("defs", {
                children: (0, a.jsxs)("filter", {
                  filterUnits: "userSpaceOnUse",
                  height: S,
                  id: F,
                  width: j,
                  x: 0,
                  y: 0,
                  children: [d, p],
                }),
              })),
              (w[18] = F),
              (w[19] = S),
              (w[20] = j),
              (w[21] = g))
            : (g = w[21]));
        let $ = `url(#${F})`;
        (w[22] !== I.d || w[23] !== W || w[24] !== $
          ? ((y = (0, a.jsx)("path", {
              d: I.d,
              "data-sparkline-layer": "glow",
              fill: "none",
              filter: $,
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeWidth: W,
            })),
            (w[22] = I.d),
            (w[23] = W),
            (w[24] = $),
            (w[25] = y))
          : (y = w[25]),
          w[26] !== I.d || w[27] !== W
            ? ((k = (0, a.jsx)("path", {
                d: I.d,
                "data-sparkline-layer": "line",
                fill: "none",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeWidth: W,
              })),
              (w[26] = I.d),
              (w[27] = W),
              (w[28] = k))
            : (k = w[28]));
        let K = P ? "opacity-100" : "opacity-0";
        w[29] !== K
          ? ((b = (0, o.c)(
              "transition-opacity duration-300 motion-reduce:transition-none",
              K,
            )),
            (w[29] = K),
            (w[30] = b))
          : (b = w[30]);
        let V = P ? "true" : "false";
        return (
          w[31] !== I.tip.x || w[32] !== I.tip.y || w[33] !== b || w[34] !== V
            ? ((x = (0, a.jsx)("circle", {
                className: b,
                cx: I.tip.x,
                cy: I.tip.y,
                "data-sparkline-layer": "orb",
                "data-visible": V,
                fill: "currentColor",
                r: m.l / 2,
              })),
              (w[31] = I.tip.x),
              (w[32] = I.tip.y),
              (w[33] = b),
              (w[34] = V),
              (w[35] = x))
            : (x = w[35]),
          w[36] !== S ||
          w[37] !== f ||
          w[38] !== M ||
          w[39] !== g ||
          w[40] !== y ||
          w[41] !== k ||
          w[42] !== x ||
          w[43] !== j
            ? ((v = (0, a.jsxs)("svg", {
                "aria-hidden": !0,
                className: f,
                "data-testid": "explore-sparkline-chart",
                height: S,
                viewBox: M,
                width: j,
                children: [g, y, k, x],
              })),
              (w[36] = S),
              (w[37] = f),
              (w[38] = M),
              (w[39] = g),
              (w[40] = y),
              (w[41] = k),
              (w[42] = x),
              (w[43] = j),
              (w[44] = v))
            : (v = w[44]),
          v
        );
      },
      (e, t) =>
        e.width === t.width &&
        e.height === t.height &&
        e.tipSerial === t.tipSerial &&
        e.color === t.color &&
        e.className === t.className &&
        e.strokeWidth === t.strokeWidth &&
        ((e, t) => {
          if (e === t) return !0;
          if (e.length !== t.length) return !1;
          let i = e[0],
            r = t[0],
            n = e[e.length - 1],
            l = t[t.length - 1];
          return (
            i?.time === r?.time &&
            i?.price === r?.price &&
            n?.time === l?.time &&
            n?.price === l?.price
          );
        })(e.data, t.data),
    );
  f.displayName = "ExploreSparklineChart";
  var d = e.i(618427),
    p = e.i(974166),
    g = e.i(526080),
    y = e.i(375676),
    k = e.i(636882),
    b = e.i(605587);
  let x = 30,
    v = (e) => "number" == typeof e && Number.isFinite(e) && e > 0,
    w = (e, t) => [
      { price: e, time: t - 1e3 },
      { price: e, time: t },
    ],
    _ = (e, t) => !(t > 0 && Math.abs(e - t) / t < 0.005),
    j = { series: [], isFallback: !1, tipSerial: 0 },
    S = ({ points: e, isEnabled: t, isPending: i, fallbackPrice: r }) => {
      let n = ((e) => {
        if (!e) return { kind: "empty" };
        let t = e.filter((e) => Number.isFinite(e.price));
        return t.length >= 2
          ? { kind: "series", points: t.length === e.length ? e : t }
          : 1 === t.length
            ? { kind: "single", price: t[0].price }
            : { kind: "empty" };
      })(e);
      return "series" === n.kind
        ? { series: n.points, isFallback: !1 }
        : t && i
          ? null
          : {
              series: w("single" === n.kind ? n.price : r, Date.now()),
              isFallback: !0,
            };
    },
    C = (e, t) => (v(e) && v(t) ? e / t : 0);
  function N(e) {
    return { ...j, tipSerial: e.tipSerial };
  }
  let A = {
      cell: { ...p.m, requestWidth: p.m.width, className: p._ },
      card: { ...c.S, requestWidth: p.m.width, className: c.O },
    },
    E =
      "absolute inset-0 transition-opacity duration-150 motion-reduce:transition-none",
    R = (0, t.memo)(
      (e) => {
        let i,
          r,
          n,
          l,
          m,
          h,
          p,
          R,
          W = (0, s.c)(28),
          { coin: T, variant: F, chartWidth: I } = e,
          O = void 0 === F ? "cell" : F,
          L =
            "card" === O && void 0 !== I && I > 0
              ? { ...A.card, width: I }
              : A[O];
        W[0] !== T
          ? ((i = {
              mint: T.mint,
              chainId: T.chain_id,
              fallbackMarketCap: T.usd_market_cap,
              coin: T,
            }),
            (W[0] = T),
            (W[1] = i))
          : (i = W[1]);
        let U = (0, u.h)(i),
          z = (0, u.k)(T.mint),
          B = (({ coin: e, basis: t }) => {
            if ((0, b.N)({ mint: e.mint, chainId: e.chain_id })) {
              let i;
              if (v(t?.ladderSupply))
                return v(t?.codexSupply) ? t.codexSupply : t.ladderSupply;
              if (
                ![
                  (i = e).circulating_supply_str,
                  i.total_supply_str,
                  i.total_supply,
                ].some((e) => null != e && Number(e) > 0)
              )
                return 0;
            }
            return (0, g.B)(e);
          })({ coin: T, basis: z }),
          {
            series: D,
            isFallback: P,
            tipSerial: q,
          } = ((e) => {
            let i,
              r,
              n,
              l,
              a,
              c,
              u,
              o,
              m,
              h,
              f,
              d,
              p,
              g,
              b,
              A = (0, s.c)(49),
              {
                mint: E,
                chainId: R,
                createdTimestamp: W,
                width: T,
                marketCap: F,
                totalSupply: I,
              } = e,
              O = W ?? 0;
            (A[0] === Symbol.for("react.memo_cache_sentinel")
              ? ((i = { staleTime: 3e5, gcTime: 6e5, retry: 1 }), (A[0] = i))
              : (i = A[0]),
              A[1] !== R || A[2] !== E || A[3] !== O || A[4] !== T
                ? ((r = {
                    coinAddress: E,
                    chainId: R,
                    coinCreatedTimestamp: O,
                    timeframe: "24h",
                    width: T,
                    youngCoinSource: "line-chart",
                    queryOptions: i,
                  }),
                  (A[1] = R),
                  (A[2] = E),
                  (A[3] = O),
                  (A[4] = T),
                  (A[5] = r))
                : (r = A[5]));
            let {
              data: L,
              isPending: U,
              isLoading: z,
              isError: B,
            } = (0, y.f)(r);
            A[6] !== R || A[7] !== W || A[8] !== E
              ? ((n = (0, k.f)({
                  coinAddress: E,
                  coinCreatedTimestamp: W,
                  chainId: R,
                })),
                (A[6] = R),
                (A[7] = W),
                (A[8] = E),
                (A[9] = n))
              : (n = A[9]);
            let D = n;
            A[10] !== D ||
            A[11] !== U ||
            A[12] !== F ||
            A[13] !== L ||
            A[14] !== I
              ? ((l = () => {
                  let e = S({
                    points: L,
                    isEnabled: D,
                    isPending: U,
                    fallbackPrice: C(F, I),
                  });
                  return e ? { ...e, tipSerial: 0 } : j;
                }),
                (A[10] = D),
                (A[11] = U),
                (A[12] = F),
                (A[13] = L),
                (A[14] = I),
                (A[15] = l))
              : (l = A[15]);
            let [P] = (0, t.useState)(l),
              [q, M] = (0, t.useState)(P),
              $ = (0, t.useRef)(P.series);
            A[16] === Symbol.for("react.memo_cache_sentinel")
              ? ((a = []), (A[16] = a))
              : (a = A[16]);
            let K = (0, t.useRef)(a);
            A[17] !== D ||
            A[18] !== U ||
            A[19] !== P.series.length ||
            A[20] !== L
              ? ((c =
                  P.series.length > 0
                    ? { points: L, isEnabled: D, isPending: U }
                    : null),
                (A[17] = D),
                (A[18] = U),
                (A[19] = P.series.length),
                (A[20] = L),
                (A[21] = c))
              : (c = A[21]);
            let V = (0, t.useRef)(c),
              [G, H] = (0, t.useState)(E);
            if (G !== E) {
              H(E);
              let e = S({
                points: L,
                isEnabled: D,
                isPending: U,
                fallbackPrice: C(F, I),
              });
              M(e ? { ...e, tipSerial: 0 } : j);
            }
            let Y = (0, t.useRef)(E),
              J = (0, t.useRef)(!0);
            (A[22] !== E
              ? ((u = () => {
                  Y.current !== E &&
                    ((Y.current = E),
                    ($.current = []),
                    (K.current = []),
                    (V.current = null),
                    (J.current = !0));
                }),
                (o = [E]),
                (A[22] = E),
                (A[23] = u),
                (A[24] = o))
              : ((u = A[23]), (o = A[24])),
              (0, t.useEffect)(u, o));
            let X = (0, t.useRef)(0);
            return (
              A[25] !== F || A[26] !== I
                ? ((m = () => {
                    X.current = C(F, I);
                  }),
                  (h = [F, I]),
                  (A[25] = F),
                  (A[26] = I),
                  (A[27] = m),
                  (A[28] = h))
                : ((m = A[27]), (h = A[28])),
              (0, t.useEffect)(m, h),
              A[29] !== D || A[30] !== U || A[31] !== L
                ? ((f = () => {
                    let e = V.current;
                    if (
                      e &&
                      e.points === L &&
                      e.isEnabled === D &&
                      e.isPending === U
                    )
                      return;
                    let t = S({
                      points: L,
                      isEnabled: D,
                      isPending: U,
                      fallbackPrice: X.current,
                    });
                    if (!t) {
                      if (0 === $.current.length) return;
                      (($.current = []),
                        (K.current = []),
                        (V.current = { points: L, isEnabled: D, isPending: U }),
                        M(N));
                      return;
                    }
                    let i = X.current,
                      r = t.series[t.series.length - 1]?.price ?? 0,
                      n =
                        i > 0 && _(i, r)
                          ? [{ time: Date.now(), price: i }]
                          : [];
                    (($.current = t.series),
                      (K.current = n),
                      (V.current = { points: L, isEnabled: D, isPending: U }),
                      i > 0 && (J.current = !1),
                      M((e) => ({
                        series: 0 === n.length ? t.series : [...t.series, ...n],
                        isFallback: t.isFallback,
                        tipSerial: e.tipSerial,
                      })));
                  }),
                  (A[29] = D),
                  (A[30] = U),
                  (A[31] = L),
                  (A[32] = f))
                : (f = A[32]),
              A[33] !== D || A[34] !== U || A[35] !== E || A[36] !== L
                ? ((d = [E, L, D, U]),
                  (A[33] = D),
                  (A[34] = U),
                  (A[35] = E),
                  (A[36] = L),
                  (A[37] = d))
                : (d = A[37]),
              (0, t.useEffect)(f, d),
              A[38] !== F || A[39] !== I
                ? ((p = () => {
                    let e = $.current;
                    if (0 === e.length || !v(F) || !v(I)) return;
                    let t = F / I;
                    if (!Number.isFinite(t)) return;
                    let i = J.current;
                    if (
                      ((J.current = !1),
                      2 === e.length && e.every((e) => 0 === e.price))
                    ) {
                      let e = w(t, Date.now());
                      (($.current = e),
                        (K.current = []),
                        M((t) => ({ ...t, series: e })));
                      return;
                    }
                    let r = K.current;
                    if (!_(t, (r[r.length - 1] ?? e[e.length - 1])?.price ?? 0))
                      return;
                    let n = ((e, t, i = x) =>
                      e.length >= i ? [...e.slice(1), t] : [...e, t])(r, {
                      time: Date.now(),
                      price: t,
                    });
                    ((K.current = n),
                      M((t) => ({
                        series: [...e, ...n],
                        isFallback: t.isFallback,
                        tipSerial: i ? t.tipSerial : t.tipSerial + 1,
                      })));
                  }),
                  (A[38] = F),
                  (A[39] = I),
                  (A[40] = p))
                : (p = A[40]),
              A[41] !== F || A[42] !== E || A[43] !== I
                ? ((g = [E, F, I]),
                  (A[41] = F),
                  (A[42] = E),
                  (A[43] = I),
                  (A[44] = g))
                : (g = A[44]),
              (0, t.useEffect)(p, g),
              A[45] !== B || A[46] !== z || A[47] !== q
                ? ((b = { ...q, isLoading: z, isError: B }),
                  (A[45] = B),
                  (A[46] = z),
                  (A[47] = q),
                  (A[48] = b))
                : (b = A[48]),
              b
            );
          })({
            mint: T.mint,
            chainId: T.chain_id,
            createdTimestamp: T.created_timestamp,
            width: L.requestWidth,
            marketCap: U,
            totalSupply: B,
          }),
          M = D.length > 0,
          [$, K] = (0, t.useState)(M),
          [V, G] = (0, t.useState)(M);
        (V !== M && (G(M), M || K(!1)),
          W[2] !== M
            ? ((r = () => {
                if (!M) return;
                let e = setTimeout(() => K(!0), 150);
                return () => clearTimeout(e);
              }),
              (n = [M]),
              (W[2] = M),
              (W[3] = r),
              (W[4] = n))
            : ((r = W[3]), (n = W[4])),
          (0, t.useEffect)(r, n));
        let H = !$,
          Y = (0, o.c)("relative overflow-hidden", L.className),
          J = P ? "true" : void 0,
          X = M ? "ready" : "loading",
          Z = M ? "opacity-100" : "opacity-0";
        W[5] !== Z
          ? ((l = (0, o.c)(E, Z)), (W[5] = Z), (W[6] = l))
          : (l = W[6]);
        let Q = "card" === O ? c.V : void 0;
        return (
          W[7] !== L.height ||
          W[8] !== L.width ||
          W[9] !== D ||
          W[10] !== Q ||
          W[11] !== q
            ? ((m = (0, a.jsx)(f, {
                data: D,
                height: L.height,
                strokeWidth: Q,
                tipSerial: q,
                width: L.width,
              })),
              (W[7] = L.height),
              (W[8] = L.width),
              (W[9] = D),
              (W[10] = Q),
              (W[11] = q),
              (W[12] = m))
            : (m = W[12]),
          W[13] !== l || W[14] !== m
            ? ((h = (0, a.jsx)("div", { className: l, children: m })),
              (W[13] = l),
              (W[14] = m),
              (W[15] = h))
            : (h = W[15]),
          W[16] !== L.height || W[17] !== L.width || W[18] !== M || W[19] !== H
            ? ((p = H
                ? (0, a.jsx)("div", {
                    className: (0, o.c)(
                      E,
                      "z-[1]",
                      M ? "opacity-0" : "opacity-100",
                    ),
                    "data-testid": "explore-sparkline-skeleton-layer",
                    children: (0, a.jsx)(d.f, {
                      height: L.height,
                      width: L.width,
                    }),
                  })
                : null),
              (W[16] = L.height),
              (W[17] = L.width),
              (W[18] = M),
              (W[19] = H),
              (W[20] = p))
            : (p = W[20]),
          W[21] !== h ||
          W[22] !== p ||
          W[23] !== Y ||
          W[24] !== J ||
          W[25] !== X ||
          W[26] !== O
            ? ((R = (0, a.jsxs)("div", {
                "aria-hidden": !0,
                className: Y,
                "data-fallback": J,
                "data-state": X,
                "data-testid": "explore-sparkline",
                "data-variant": O,
                children: [h, p],
              })),
              (W[21] = h),
              (W[22] = p),
              (W[23] = Y),
              (W[24] = J),
              (W[25] = X),
              (W[26] = O),
              (W[27] = R))
            : (R = W[27]),
          R
        );
      },
      (e, t) =>
        e.coin.mint === t.coin.mint &&
        e.coin.created_timestamp === t.coin.created_timestamp &&
        e.coin.chain_id === t.coin.chain_id &&
        e.coin.usd_market_cap === t.coin.usd_market_cap &&
        e.coin.total_supply === t.coin.total_supply &&
        e.coin.total_supply_str === t.coin.total_supply_str &&
        e.coin.base_decimals === t.coin.base_decimals &&
        e.coin.circulating_supply_str === t.coin.circulating_supply_str &&
        e.variant === t.variant &&
        e.chartWidth === t.chartWidth,
    );
  ((R.displayName = "ExploreSparklineCell"), e.s(["f", 0, R], 694151));
  var W = e.i(632817),
    T = e.i(372743);
  let F = ({ nowMs: e, createdTimestamp: t }) =>
    e !== W.Y && t ? Math.max(0, e - t) : null;
  (e.s(
    [
      "l",
      0,
      F,
      "P",
      0,
      function (e) {
        let t,
          r,
          l = (0, s.c)(6),
          { mint: a, createdTimestamp: c } = e,
          u = n();
        l[0] !== a
          ? ((t = (e) => e.marketActivity[a]), (l[0] = a), (l[1] = t))
          : (t = l[1]);
        let o = (0, T.f)(t);
        l[2] !== o || l[3] !== c || l[4] !== u
          ? ((r = (e) =>
              (0, i.o)({
                activity: o,
                window: u,
                coinAgeMs: F({ nowMs: e, createdTimestamp: c }),
              })),
            (l[2] = o),
            (l[3] = c),
            (l[4] = u),
            (l[5] = r))
          : (r = l[5]);
        let m = r;
        return (0, W.H)(m);
      },
    ],
    108496,
  ),
    e.s(
      [
        "f",
        0,
        function (e) {
          let t,
            r,
            l = (0, s.c)(7),
            { mint: a, metric: c, createdTimestamp: u } = e,
            o = n();
          l[0] !== a
            ? ((t = (e) => e.marketActivity[a]), (l[0] = a), (l[1] = t))
            : (t = l[1]);
          let m = (0, T.f)(t);
          l[2] !== m || l[3] !== u || l[4] !== c || l[5] !== o
            ? ((r = (e) =>
                (0, i.E)({
                  activity: m,
                  window: o,
                  metric: c,
                  coinAgeMs: F({ nowMs: e, createdTimestamp: u }),
                })),
              (l[2] = m),
              (l[3] = u),
              (l[4] = c),
              (l[5] = o),
              (l[6] = r))
            : (r = l[6]);
          let h = r;
          return (0, W.H)(h);
        },
      ],
      716608,
    ));
};
