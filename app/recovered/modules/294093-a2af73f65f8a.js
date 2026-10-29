// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(292686),
    a = e.i(300317),
    n = e.i(339403),
    l = e.i(465085),
    s = e.i(352386),
    o = e.i(649425),
    c = e.i(202942),
    m = e.i(529841),
    d = e.i(735666),
    u = e.i(152281),
    h = e.i(610387),
    f = e.i(10738),
    x = e.i(201629),
    p = e.i(632817),
    g = e.i(915631),
    v = e.i(646908),
    b = e.i(662093),
    y = e.i(595673),
    w = e.i(569526),
    j = e.i(372743),
    N = e.i(103032),
    _ = e.i(680930),
    k = e.i(965690),
    S = e.i(412237),
    C = e.i(938277);
  e.i(690023);
  var T = e.i(524051);
  let I = (0, s.memo)((e) => {
    let i,
      a,
      n,
      l,
      s,
      o,
      c,
      m = (0, r.c)(16),
      { coin: d, athValue: u } = e;
    m[0] !== d.mint
      ? ((i = (e) => e.marketActivity?.[d.mint]?.["24h"]?.volumeUSD),
        (m[0] = d.mint),
        (m[1] = i))
      : (i = m[1]);
    let h = (0, j.f)(i),
      f =
        (0, b.I)({
          mint: d.mint,
          chainId: d.chain_id,
          fallbackMarketCap: d.usd_market_cap,
          coin: d,
          significantDigits: 3,
        }) ?? 0;
    m[2] !== d
      ? ((a = { mint: d.mint, chainId: d.chain_id, coin: d }),
        (m[2] = d),
        (m[3] = a))
      : (a = m[3]);
    let x = (0, b.O)(a)(u),
      p = Math.max(x && x > 0 ? x : 1.1 * f, f),
      g = h && h > 0 ? h : 1e3;
    return (
      m[4] === Symbol.for("react.memo_cache_sentinel")
        ? ((n = (0, t.jsx)("div", { className: "flex-1" })), (m[4] = n))
        : (n = m[4]),
      m[5] !== f || m[6] !== p || m[7] !== g
        ? ((l = (0, t.jsx)("div", {
            className: "flex w-9 justify-end",
            children: (0, t.jsx)(T.f, {
              volume: g,
              allTimeHighMarketCap: p,
              currentMarketCap: f,
              className: "flex-shrink-0",
              minWidth: "35px",
              showTooltip: !0,
              showAllTimeHigh: !1,
              animationDelay: 0,
            }),
          })),
          (m[5] = f),
          (m[6] = p),
          (m[7] = g),
          (m[8] = l))
        : (l = m[8]),
      m[9] !== p ? ((s = (0, C.M)(p)), (m[9] = p), (m[10] = s)) : (s = m[10]),
      m[11] !== s
        ? ((o = (0, t.jsxs)("span", {
            className:
              "ml-1.5 w-11 whitespace-nowrap text-left text-sm font-medium text-text-primary max-md:text-xs",
            children: ["$", s],
          })),
          (m[11] = s),
          (m[12] = o))
        : (o = m[12]),
      m[13] !== l || m[14] !== o
        ? ((c = (0, t.jsxs)("div", {
            className: "flex items-center text-right",
            children: [
              n,
              (0, t.jsxs)("div", {
                className: "flex items-center",
                children: [l, o],
              }),
            ],
          })),
          (m[13] = l),
          (m[14] = o),
          (m[15] = c))
        : (c = m[15]),
      c
    );
  });
  I.displayName = "ATHCell";
  var M = e.i(149845),
    A = e.i(454430);
  e.i(12692);
  var z = e.i(398902),
    W = e.i(667876),
    F = e.i(34011),
    R = e.i(338319);
  let E = { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    D = (e) => {
      let i,
        a,
        n,
        s,
        o = (0, r.c)(11),
        { coin: c, isScrolled: m } = e,
        d = m && "coin-avatar-glow-active";
      o[0] !== d
        ? ((i = (0, R.c)("coin-avatar-glow relative shrink-0 rounded-md", d)),
          (o[0] = d),
          (o[1] = i))
        : (i = o[1]);
      let u = m ? 1.15 : 1;
      o[2] !== u ? ((a = { scale: u }), (o[2] = u), (o[3] = a)) : (a = o[3]);
      let h = m ? 32 : 28;
      return (
        o[4] !== c || o[5] !== h
          ? ((n = (0, t.jsx)(F.CoinAvatar, {
              coin: c,
              size: h,
              seal: "name",
              optimisticImage: !0,
              testIdPrefix: "coin-cell-art",
            })),
            (o[4] = c),
            (o[5] = h),
            (o[6] = n))
          : (n = o[6]),
        o[7] !== i || o[8] !== a || o[9] !== n
          ? ((s = (0, t.jsx)(l.f.div, {
              className: i,
              animate: a,
              transition: E,
              children: n,
            })),
            (o[7] = i),
            (o[8] = a),
            (o[9] = n),
            (o[10] = s))
          : (s = o[10]),
        s
      );
    },
    P = (e) => {
      let i,
        a,
        n,
        s,
        o,
        c,
        m,
        d,
        u,
        h,
        f = (0, r.c)(29),
        { coin: x, isScrolled: p } = e,
        { t: g } = (0, z.f)(),
        v = +!p,
        b = p ? -15 : 0,
        y = p ? 0.9 : 1;
      (f[0] !== v || f[1] !== b || f[2] !== y
        ? ((i = { opacity: v, x: b, scale: y }),
          (f[0] = v),
          (f[1] = b),
          (f[2] = y),
          (f[3] = i))
        : (i = f[3]),
        f[4] === Symbol.for("react.memo_cache_sentinel")
          ? ((a = { transformOrigin: "left center" }), (f[4] = a))
          : (a = f[4]),
        f[5] !== x.name
          ? ((n = (0, t.jsx)("span", {
              className:
                "min-w-0 max-w-[85px] truncate whitespace-nowrap text-sm font-medium leading-none md:max-w-none",
              title: x.name,
              children: x.name,
            })),
            (f[5] = x.name),
            (f[6] = n))
          : (n = f[6]));
      let w = "string" == typeof x.chain_id ? x.chain_id : null;
      (f[7] !== x.mint || f[8] !== w
        ? ((s = (0, t.jsx)(W.f, { mint: x.mint, chainId: w })),
          (f[7] = x.mint),
          (f[8] = w),
          (f[9] = s))
        : (s = f[9]),
        f[10] !== n || f[11] !== s
          ? ((o = (0, t.jsxs)("span", {
              className: "flex min-w-0 max-w-full items-center gap-1",
              children: [n, s],
            })),
            (f[10] = n),
            (f[11] = s),
            (f[12] = o))
          : (o = f[12]));
      let j = x.symbol ? `$${x.symbol}` : null;
      return (
        f[13] !== j
          ? ((c = (0, t.jsx)("span", {
              className:
                "flex-shrink-0 text-xs leading-none text-text-tertiary",
              children: j,
            })),
            (f[13] = j),
            (f[14] = c))
          : (c = f[14]),
        f[15] !== x.nsfw || f[16] !== g
          ? ((m =
              x.nsfw &&
              (0, t.jsx)("span", {
                className:
                  "border-destructive/50 text-destructive h-3.5 content-center rounded border px-1 text-[8px] leading-none",
                children: g("web.home.nsfw_label"),
              })),
            (f[15] = x.nsfw),
            (f[16] = g),
            (f[17] = m))
          : (m = f[17]),
        f[18] !== x.is_charity || f[19] !== g
          ? ((d =
              x.is_charity &&
              (0, t.jsx)("span", {
                className:
                  "h-3.5 content-center rounded border border-pink-500/40 bg-pink-500/10 px-1 text-[8px] leading-none text-pink-500",
                children: g("creator_fees.charity.label"),
              })),
            (f[18] = x.is_charity),
            (f[19] = g),
            (f[20] = d))
          : (d = f[20]),
        f[21] !== c || f[22] !== m || f[23] !== d
          ? ((u = (0, t.jsxs)("div", {
              className: "flex h-3.5 items-center gap-1",
              children: [c, m, d],
            })),
            (f[21] = c),
            (f[22] = m),
            (f[23] = d),
            (f[24] = u))
          : (u = f[24]),
        f[25] !== u || f[26] !== i || f[27] !== o
          ? ((h = (0, t.jsxs)(l.f.div, {
              className:
                "coin-cell-animation flex min-w-0 flex-col items-baseline gap-1 overflow-hidden px-1",
              animate: i,
              transition: E,
              style: a,
              children: [o, u],
            })),
            (f[25] = u),
            (f[26] = i),
            (f[27] = o),
            (f[28] = h))
          : (h = f[28]),
        h
      );
    },
    G = (0, s.memo)(
      (e) => {
        let i,
          a,
          n,
          s,
          o,
          c,
          m = (0, r.c)(16),
          { coin: d, isScrolled: u, serialNumber: h } = e,
          f = u ? "justify-center gap-0" : "gap-1.5";
        m[0] !== f
          ? ((i = (0, R.c)("coin-cell-animation flex w-full items-center", f)),
            (m[0] = f),
            (m[1] = i))
          : (i = m[1]);
        let x = 8 * !u;
        return (
          m[2] !== x ? ((a = { gap: x }), (m[2] = x), (m[3] = a)) : (a = m[3]),
          m[4] !== h
            ? ((n =
                void 0 !== h &&
                (0, t.jsx)("div", {
                  className:
                    "w-8 min-w-[32px] flex-shrink-0 overflow-hidden text-center font-medium text-text-tertiary",
                  children: (0, t.jsx)("span", {
                    className: "text-sm",
                    children: h,
                  }),
                })),
              (m[4] = h),
              (m[5] = n))
            : (n = m[5]),
          m[6] !== d || m[7] !== u
            ? ((s = (0, t.jsx)(D, { coin: d, isScrolled: u })),
              (o = (0, t.jsx)(P, { coin: d, isScrolled: u })),
              (m[6] = d),
              (m[7] = u),
              (m[8] = s),
              (m[9] = o))
            : ((s = m[8]), (o = m[9])),
          m[10] !== i ||
          m[11] !== a ||
          m[12] !== n ||
          m[13] !== s ||
          m[14] !== o
            ? ((c = (0, t.jsxs)(l.f.div, {
                className: i,
                animate: a,
                transition: E,
                children: [n, s, o],
              })),
              (m[10] = i),
              (m[11] = a),
              (m[12] = n),
              (m[13] = s),
              (m[14] = o),
              (m[15] = c))
            : (c = m[15]),
          c
        );
      },
      (e, t) => {
        if (e.coin === t.coin)
          return (
            e.isScrolled === t.isScrolled && e.serialNumber === t.serialNumber
          );
        let r = e.coin,
          i = t.coin;
        return (
          r.mint === i.mint &&
          r.name === i.name &&
          r.symbol === i.symbol &&
          r.image_uri === i.image_uri &&
          r.chain_id === i.chain_id &&
          r.program === i.program &&
          r.board_program === i.board_program &&
          r.platform === i.platform &&
          r.protocol === i.protocol &&
          r.is_currently_live === i.is_currently_live &&
          r.nsfw === i.nsfw &&
          r.is_charity === i.is_charity &&
          e.isScrolled === t.isScrolled &&
          e.serialNumber === t.serialNumber
        );
      },
    );
  G.displayName = "CoinCell";
  var O = e.i(668487),
    $ = e.i(653805),
    B = e.i(605587);
  let U = "usd_market_cap",
    V = "txns",
    L = "volume",
    H = "traders",
    q = "price_change_24h",
    K = { "1h": "1h", "6h": "6h", [q]: "24h" },
    Y = new Set([V, L, H, "1h", "6h", q]),
    X = (e, t) => (e !== p.Y && t ? Math.max(0, e - t) : null),
    J = (e) => j.f.getState().marketActivity?.[e],
    Q = (e, t) => {
      if (e === U) {
        let e = $.x.getState().coins[t.mint],
          r = t.usd_market_cap ?? 0;
        if (!(0, B.N)({ mint: t.mint, chainId: t.chain_id })) {
          let t = e?.usdMarketCap;
          return "number" == typeof t && t > 0 ? t : r;
        }
        let i = (0, b.l)(t.mint);
        return (
          (0, b.W)({ row: e, basis: i }) ??
          (0, b.z)({ restMarketCap: r, basis: i })
        );
      }
      let r = K[e];
      if (r) {
        let e;
        return (
          (0, k.k)({
            activity: J(t.mint),
            window: r,
            coinAgeMs: X((e = (0, O.t)()) - (e % 6e4), t.created_timestamp),
          }) ?? 0
        );
      }
      let i = J(t.mint)?.["24h"];
      switch (e) {
        case V:
          return i?.numTxs ?? 0;
        case L:
          return i?.volumeUSD ?? 0;
        case H:
          return i?.numUsers ?? 0;
        default:
          return 0;
      }
    },
    Z = (e) => (t) => Q(e, t),
    ee = (e, t, r) => {
      let i = Q(r, e.original),
        a = Q(r, t.original);
      return i === a ? 0 : i > a ? 1 : -1;
    };
  function et(e) {
    return Y.has(e.id);
  }
  function er(e) {
    return e.id === U;
  }
  function ei(e) {
    return { ...e };
  }
  function ea(e) {
    return e.map(ei);
  }
  function en(e) {
    return e.marketActivity;
  }
  function el(e) {
    return e.coins;
  }
  function es(e) {
    return e.byMint;
  }
  var eo = e.i(394348),
    ec = e.i(745018),
    em = e.i(205761),
    ed = e.i(983737);
  let eu = { duration: 0.18, ease: "easeOut" },
    eh = (e) => {
      let i,
        a,
        n,
        o,
        c,
        m = (0, r.c)(16),
        { newCoins: d, onToggle: u, sort: h, hasActiveFilters: f } = e,
        x = (0, ed.f)() ?? !1,
        p = d.length > 0 && !f;
      m[0] !== p || m[1] !== d.length || m[2] !== h
        ? ((i = p
            ? ((e, t) => {
                switch (e) {
                  case "created_timestamp":
                    return `${t} new coin${t > 1 ? "s" : ""} added`;
                  case "last_trade_timestamp":
                    return `${t} new trade${t > 1 ? "s" : ""} added`;
                  default:
                    return `${t} new update${t > 1 ? "s" : ""}`;
                }
              })(h, d.length)
            : ""),
          (m[0] = p),
          (m[1] = d.length),
          (m[2] = h),
          (m[3] = i))
        : (i = m[3]);
      let g = i,
        v = ((e) => {
          let t,
            i,
            a,
            n,
            l = (0, r.c)(6),
            [o, c] = (0, s.useState)(e),
            m = (0, s.useRef)(e),
            d = (0, s.useRef)(e),
            u = (0, s.useRef)(null);
          return (
            l[0] !== e || 5e3 !== l[1]
              ? ((t = () => {
                  d.current = e;
                  let t = (e) => {
                      ((m.current = e), c(e));
                    },
                    r = () => {
                      u.current = setTimeout(() => {
                        ((u.current = null),
                          d.current !== m.current && (t(d.current), r()));
                      }, 5e3);
                    };
                  if ("" === e) {
                    (u.current && clearTimeout(u.current),
                      (u.current = null),
                      t(""));
                    return;
                  }
                  u.current || (t(e), r());
                }),
                (i = [e, 5e3]),
                (l[0] = e),
                (l[1] = 5e3),
                (l[2] = t),
                (l[3] = i))
              : ((t = l[2]), (i = l[3])),
            (0, s.useEffect)(t, i),
            l[4] === Symbol.for("react.memo_cache_sentinel")
              ? ((a = () => () => {
                  (u.current && clearTimeout(u.current), (u.current = null));
                }),
                (n = []),
                (l[4] = a),
                (l[5] = n))
              : ((a = l[4]), (n = l[5])),
            (0, s.useEffect)(a, n),
            o
          );
        })(g);
      return (
        m[4] !== v
          ? ((a = (0, t.jsx)("div", {
              role: "status",
              "aria-live": "polite",
              className: "sr-only",
              children: v,
            })),
            (m[4] = v),
            (m[5] = a))
          : (a = m[5]),
        m[6] !== p || m[7] !== g || m[8] !== u || m[9] !== x
          ? ((n =
              p &&
              (0, t.jsxs)(
                l.f.button,
                {
                  type: "button",
                  "data-testid": "new-coins-chip",
                  initial: !x && { opacity: 0, y: -6 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                  transition: x ? { duration: 0 } : eu,
                  className:
                    "pointer-events-auto relative inline-flex cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-positive/40 bg-bg-primary/90 px-3 py-1.5 text-xs font-medium text-positive shadow-[0_0_24px_hsl(var(--positive)/0.22)] backdrop-blur-md sm:px-4 sm:text-sm",
                  onClick: u,
                  children: [
                    (0, t.jsx)(l.f.span, {
                      "aria-hidden": !0,
                      className:
                        "absolute inset-0 bg-gradient-to-r from-transparent via-positive/15 to-transparent",
                      animate: x ? void 0 : { x: ["-100%", "100%"] },
                      transition: {
                        duration: 3,
                        repeat: 1 / 0,
                        ease: "linear",
                      },
                    }),
                    (0, t.jsx)(l.f.span, {
                      "aria-hidden": !0,
                      className: "relative flex",
                      animate: x ? void 0 : { rotate: 360 },
                      transition: {
                        duration: 4,
                        repeat: 1 / 0,
                        ease: "linear",
                      },
                      children: (0, t.jsx)(ec.Ip, { className: "size-4" }),
                    }),
                    (0, t.jsx)("span", { className: "relative", children: g }),
                    (0, t.jsx)(l.f.span, {
                      "aria-hidden": !0,
                      className: "relative flex",
                      animate: x ? void 0 : { y: [0, 3, 0] },
                      transition: {
                        duration: 1.5,
                        repeat: 1 / 0,
                        ease: "easeInOut",
                      },
                      children: (0, t.jsx)(ec.J0, { className: "size-4" }),
                    }),
                  ],
                },
                "new-coins-chip",
              )),
            (m[6] = p),
            (m[7] = g),
            (m[8] = u),
            (m[9] = x),
            (m[10] = n))
          : (n = m[10]),
        m[11] !== n
          ? ((o = (0, t.jsx)(em.f, { children: n })), (m[11] = n), (m[12] = o))
          : (o = m[12]),
        m[13] !== a || m[14] !== o
          ? ((c = (0, t.jsxs)("div", {
              className:
                "pointer-events-none absolute top-12 left-1/2 -translate-x-1/2",
              children: [a, o],
            })),
            (m[13] = a),
            (m[14] = o),
            (m[15] = c))
          : (c = m[15]),
        c
      );
    };
  var ef = e.i(34714),
    ex = e.i(216934),
    ep = e.i(359370);
  let eg = {
      name: { width: 160, minWidth: 160, maxWidth: 160 },
      "24h graph": { width: 72, minWidth: 72, maxWidth: 72 },
      usd_market_cap: { width: 88, minWidth: 88, maxWidth: 88 },
      ath: { width: 96, minWidth: 96, maxWidth: 96 },
      created_timestamp: { width: 48, minWidth: 48, maxWidth: 48 },
      txns: { width: 68, minWidth: 68, maxWidth: 68 },
      volume: { width: 88, minWidth: 88, maxWidth: 88 },
      traders: { width: 68, minWidth: 68, maxWidth: 68 },
      "1h": { width: 78, minWidth: 78, maxWidth: 78 },
      "6h": { width: 78, minWidth: 78, maxWidth: 78 },
      price_change_24h: { width: 78, minWidth: 78, maxWidth: 78 },
      bookmark: { width: 40, minWidth: 40, maxWidth: 40 },
    },
    ev = ({
      columnId: e,
      isCompact: t,
      width: r,
      minWidth: i,
      maxWidth: a,
    }) => {
      let n = t ? eg[e] : void 0;
      return {
        width: n?.width ?? r,
        minWidth: n?.minWidth ?? i,
        maxWidth: n?.maxWidth ?? a,
      };
    },
    eb = (e) => {
      let i,
        a,
        l,
        s = (0, r.c)(8),
        { table: o, isCompact: c } = e,
        m = void 0 !== c && c;
      if (
        (s[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (0, R.c)(
              "sticky top-0 z-10 bg-bg-secondary shadow-sm [&_tr]:border-b-0",
            )),
            (s[0] = i))
          : (i = s[0]),
        s[1] !== m || s[2] !== o)
      ) {
        let e;
        (s[4] !== m
          ? ((e = (e) =>
              (0, t.jsx)(
                d.N,
                {
                  className: "border-0 hover:bg-transparent",
                  children: e.headers.map((r, i) => {
                    let a = "name" === r.column.id,
                      l = i === e.headers.length - 1,
                      s = !!r.column.getIsSorted(),
                      o = [
                        "ath",
                        "usd_market_cap",
                        "created_timestamp",
                        "txns",
                        "volume",
                        "traders",
                        "1h",
                        "6h",
                        "price_change_24h",
                      ].includes(r.column.id);
                    return (0, t.jsxs)(
                      d.U,
                      {
                        className: (0, R.c)(
                          "relative h-10 border-b border-border-secondary py-2 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors duration-200 last:border-r-0 max-md:h-9 max-md:text-[10px] lg:px-3",
                          m ? "px-1" : "px-2",
                          o ? "text-right" : "text-left",
                          r.column.getCanSort() && [
                            "cursor-pointer select-none",
                            "hover:bg-bg-tertiary/60 hover:text-text-primary",
                            s && "text-positive",
                          ],
                          a && [
                            "sticky left-0 z-30 w-10 bg-bg-secondary backdrop-blur-sm",
                            "lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none",
                          ],
                          0 === i && "rounded-tl-lg lg:flex-grow",
                          l && "rounded-tr-lg",
                        ),
                        style: ev({
                          columnId: r.column.id,
                          isCompact: m,
                          width: r.getSize(),
                          minWidth: r.column.columnDef.minSize,
                          maxWidth: r.column.columnDef.maxSize,
                        }),
                        onClick: r.column.getToggleSortingHandler(),
                        children: [
                          (0, t.jsxs)("div", {
                            className: (0, R.c)(
                              "flex items-center gap-1",
                              o ? "justify-end" : "justify-start",
                            ),
                            children: [
                              (0, t.jsx)("span", {
                                className: (0, R.c)(
                                  "transition-all duration-200",
                                  s && "font-bold text-text-primary",
                                ),
                                children: (0, n.T)(
                                  r.column.columnDef.header,
                                  r.getContext(),
                                ),
                              }),
                              r.column.getCanSort() &&
                                (0, t.jsx)(ep.f, {
                                  isSorted: s,
                                  isDesc: "desc" === r.column.getIsSorted(),
                                }),
                            ],
                          }),
                          s &&
                            (0, t.jsx)("div", {
                              className:
                                "absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-positive to-transparent opacity-80",
                            }),
                        ],
                      },
                      r.id,
                    );
                  }),
                },
                e.id,
              )),
            (s[4] = m),
            (s[5] = e))
          : (e = s[5]),
          (a = o.getHeaderGroups().map(e)),
          (s[1] = m),
          (s[2] = o),
          (s[3] = a));
      } else a = s[3];
      return (
        s[6] !== a
          ? ((l = (0, t.jsx)(d.E, { className: i, children: a })),
            (s[6] = a),
            (s[7] = l))
          : (l = s[7]),
        l
      );
    };
  var ey = e.i(599077),
    ew = e.i(850175),
    ej = e.i(235364),
    eN = e.i(666863),
    e_ = e.i(456753);
  let ek = (0, s.memo)(
    (e) => {
      let i,
        a,
        l,
        o,
        c,
        m,
        u,
        h,
        f,
        x,
        p,
        g,
        v,
        b,
        w,
        j,
        N = (0, r.c)(54),
        {
          row: _,
          serialNumber: k,
          isScrolled: S,
          index: C,
          searchTerm: T,
          sourceScreen: I,
          sort: M,
          offset: A,
          setLastClickImpression: z,
          shouldAnimate: W,
          isWatchlistView: F,
          isCompact: E,
        } = e,
        D = void 0 !== S && S,
        P = void 0 !== F && F,
        O = void 0 !== E && E,
        { logSeenCoins: $ } = (0, e_.j)(),
        { handleCoinClick: B } = (0, ej.f)();
      N[0] !== P || N[1] !== M
        ? ((i = (0, y.v5)(M, P)), (N[0] = P), (N[1] = M), (N[2] = i))
        : (i = N[2]);
      let U = i;
      e: {
        let e, t;
        if (void 0 === C) {
          a = void 0;
          break e;
        }
        let r = A + C;
        (N[3] !== _.original.usd_market_cap
          ? ((e = _.original.usd_market_cap
              ? Number(_.original.usd_market_cap.toFixed(2))
              : 0),
            (N[3] = _.original.usd_market_cap),
            (N[4] = e))
          : (e = N[4]),
          N[5] !== _.original.rec_id ||
          N[6] !== U ||
          N[7] !== I ||
          N[8] !== r ||
          N[9] !== e
            ? ((t = {
                itemPosition: r,
                marketCap: e,
                sourceScreen: I,
                rec_id: _.original.rec_id,
                sourceElement: U,
              }),
              (N[5] = _.original.rec_id),
              (N[6] = U),
              (N[7] = I),
              (N[8] = r),
              (N[9] = e),
              (N[10] = t))
            : (t = N[10]),
          (a = t));
      }
      let V = a,
        L = (0, eN.f)(_.original.mint, V, T, U);
      N[11] !== V ||
      N[12] !== $ ||
      N[13] !== _.original ||
      N[14] !== T ||
      N[15] !== z ||
      N[16] !== B
        ? ((l = () => {
            let e = _.original;
            V &&
              Promise.resolve().then(async () => {
                (z(e.mint, V, T), await B(e.mint, V, T), await $());
              });
          }),
          (N[11] = V),
          (N[12] = $),
          (N[13] = _.original),
          (N[14] = T),
          (N[15] = z),
          (N[16] = B),
          (N[17] = l))
        : (l = N[17]);
      let H = l,
        q = (0, ey.useRouter)(),
        K = `/coin/${_.original.mint}`,
        { prefetch: Y, hoverProps: X } = (0, ew.W)(_.original);
      (N[18] !== K || N[19] !== Y || N[20] !== q
        ? ((o = () => {
            Y && q.prefetch(K);
          }),
          (c = [Y, K, q]),
          (N[18] = K),
          (N[19] = Y),
          (N[20] = q),
          (N[21] = o),
          (N[22] = c))
        : ((o = N[21]), (c = N[22])),
        (0, s.useEffect)(o, c));
      let J = (0, s.useRef)(null),
        Q = (0, s.useRef)(!1);
      N[23] === Symbol.for("react.memo_cache_sentinel")
        ? ((m = (e) => {
            ((J.current = { x: e.clientX, y: e.clientY }), (Q.current = !1));
          }),
          (N[23] = m))
        : (m = N[23]);
      let Z = m;
      N[24] === Symbol.for("react.memo_cache_sentinel")
        ? ((u = (e) => {
            let t = J.current;
            if (!t) return;
            let r = Math.abs(e.clientX - t.x),
              i = Math.abs(e.clientY - t.y);
            (r > 8 || i > 8) && (Q.current = !0);
          }),
          (N[24] = u))
        : (u = N[24]);
      let ee = u;
      N[25] === Symbol.for("react.memo_cache_sentinel")
        ? ((h = () => {
            ((J.current = null), (Q.current = !0));
          }),
          (N[25] = h))
        : (h = N[25]);
      let et = h;
      N[26] === Symbol.for("react.memo_cache_sentinel")
        ? ((f = (e) => {
            let t = e.touches[0];
            t &&
              ((J.current = { x: t.clientX, y: t.clientY }), (Q.current = !1));
          }),
          (N[26] = f))
        : (f = N[26]);
      let er = f;
      N[27] === Symbol.for("react.memo_cache_sentinel")
        ? ((x = (e) => {
            let t = J.current,
              r = e.touches[0];
            if (!t || !r) return;
            let i = Math.abs(r.clientX - t.x),
              a = Math.abs(r.clientY - t.y);
            (i > 8 || a > 8) && (Q.current = !0);
          }),
          (N[27] = x))
        : (x = N[27]);
      let ei = x;
      N[28] === Symbol.for("react.memo_cache_sentinel")
        ? ((p = () => {
            ((J.current = null), (Q.current = !0));
          }),
          (N[28] = p))
        : (p = N[28]);
      let ea = p;
      N[29] !== H || N[30] !== K || N[31] !== q
        ? ((g = (e) => {
            var t;
            if (((J.current = null), Q.current)) {
              Q.current = !1;
              return;
            }
            if (
              !(
                (t = e.target) instanceof Element &&
                t.closest(
                  "a,button,[role='button'],input,textarea,select,[data-coin-table-no-row-nav]",
                )
              )
            ) {
              if ((H(), e.metaKey || e.ctrlKey))
                return void window.open(K, "_blank", "noopener,noreferrer");
              q.push(K);
            }
          }),
          (N[29] = H),
          (N[30] = K),
          (N[31] = q),
          (N[32] = g))
        : (g = N[32]);
      let en = g,
        el = W && "animate-table-row-bump";
      if (
        (N[33] !== el
          ? ((v = (0, R.c)(
              "group h-12 cursor-pointer bg-transparent transition-colors hover:bg-bg-secondary/70 data-[state=selected]:bg-bg-secondary",
              el,
            )),
            (N[33] = el),
            (N[34] = v))
          : (v = N[34]),
        N[35] !== X
          ? ((b = (e) => {
              (Z(e), X.onPointerDown(e));
            }),
            (N[35] = X),
            (N[36] = b))
          : (b = N[36]),
        N[37] !== O || N[38] !== D || N[39] !== _ || N[40] !== k)
      ) {
        let e;
        (N[42] !== O || N[43] !== D || N[44] !== _.original || N[45] !== k
          ? ((e = (e) => {
              let r = "name" === e.column.id,
                i = "name" === e.column.id;
              return (0, t.jsx)(
                d.d,
                {
                  id: e.column.id,
                  className: (0, R.c)(
                    "py-2 align-middle text-sm text-text-primary transition-colors last:border-r-0 xl:px-2",
                    O ? "px-1" : "px-2",
                    r && [
                      "backface-hidden sticky left-0 z-10 w-auto bg-bg-primary will-change-transform group-hover:bg-bg-secondary/70",
                      "lg:static lg:z-auto lg:bg-transparent lg:group-hover:bg-transparent",
                    ],
                  ),
                  style: ev({
                    columnId: e.column.id,
                    isCompact: O,
                    width: e.column.getSize(),
                    minWidth: e.column.columnDef.minSize,
                    maxWidth: e.column.columnDef.maxSize,
                  }),
                  children:
                    i && void 0 !== k
                      ? (0, t.jsx)(G, {
                          isScrolled: D,
                          coin: _.original,
                          serialNumber: k,
                        })
                      : (0, n.T)(e.column.columnDef.cell, e.getContext()),
                },
                e.id,
              );
            }),
            (N[42] = O),
            (N[43] = D),
            (N[44] = _.original),
            (N[45] = k),
            (N[46] = e))
          : (e = N[46]),
          (w = _.getVisibleCells().map(e)),
          (N[37] = O),
          (N[38] = D),
          (N[39] = _),
          (N[40] = k),
          (N[41] = w));
      } else w = N[41];
      return (
        N[47] !== X ||
        N[48] !== en ||
        N[49] !== L ||
        N[50] !== v ||
        N[51] !== b ||
        N[52] !== w
          ? ((j = (0, t.jsx)("tr", {
              ref: L,
              className: v,
              ...X,
              onPointerDown: b,
              onPointerMove: ee,
              onPointerCancel: et,
              onTouchStart: er,
              onTouchMove: ei,
              onTouchCancel: ea,
              onClick: en,
              children: w,
            })),
            (N[47] = X),
            (N[48] = en),
            (N[49] = L),
            (N[50] = v),
            (N[51] = b),
            (N[52] = w),
            (N[53] = j))
          : (j = N[53]),
        j
      );
    },
    (e, t) =>
      e.row.original.mint === t.row.original.mint &&
      e.serialNumber === t.serialNumber &&
      e.isScrolled === t.isScrolled &&
      e.index === t.index &&
      e.searchTerm === t.searchTerm &&
      e.sourceScreen === t.sourceScreen &&
      e.sort === t.sort &&
      e.offset === t.offset &&
      e.setLastClickImpression === t.setLastClickImpression &&
      e.bookmarkedCoinMints === t.bookmarkedCoinMints &&
      e.activeMeta === t.activeMeta &&
      e.shouldAnimate === t.shouldAnimate &&
      e.isWatchlistView === t.isWatchlistView &&
      e.isCompact === t.isCompact,
  );
  ek.displayName = "TableRow";
  var eS = e.i(641770);
  let eC = new Intl.NumberFormat("en-US"),
    eT = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    eI = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    },
    eM = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    },
    eA = s.default.memo((e) => {
      let i,
        a,
        n,
        c,
        m,
        d,
        u,
        h,
        f,
        x = (0, r.c)(18),
        { value: p, formatter: g } = e,
        [v, b] = (0, s.useState)("none"),
        y = (0, s.useRef)(null),
        w = (0, s.useRef)(null);
      x[0] !== g ? ((i = (e) => g(e)), (x[0] = g), (x[1] = i)) : (i = x[1]);
      let j = i;
      if (
        (x[2] !== p
          ? ((a = () => {
              w.current && clearTimeout(w.current);
              let e = p ?? 0;
              return (
                null !== y.current &&
                  e !== y.current &&
                  (0 === y.current
                    ? 1
                    : Math.abs((e - y.current) / y.current)) > 0.001 &&
                  (b(e > y.current ? "increase" : "decrease"),
                  (w.current = setTimeout(() => b("none"), 800))),
                (y.current = e),
                () => {
                  w.current && clearTimeout(w.current);
                }
              );
            }),
            (n = [p]),
            (x[2] = p),
            (x[3] = a),
            (x[4] = n))
          : ((a = x[3]), (n = x[4])),
        (0, s.useEffect)(a, n),
        null == p)
      ) {
        let e;
        return (
          x[5] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)("div", {
                className: "text-right",
                children: "-",
              })),
              (x[5] = e))
            : (e = x[5]),
          e
        );
      }
      return (
        x[6] !== v
          ? ((c =
              "increase" === v
                ? (0, ex.f)().positive
                : "decrease" === v
                  ? (0, ex.f)().negative
                  : (0, ex.f)().foreground),
            (x[6] = v),
            (x[7] = c))
          : (c = x[7]),
        x[8] !== c ? ((m = { color: c }), (x[8] = c), (x[9] = m)) : (m = x[9]),
        x[10] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = { duration: 0.3, ease: "easeOut" }), (x[10] = d))
          : (d = x[10]),
        x[11] === Symbol.for("react.memo_cache_sentinel")
          ? ((u = { mass: 1.5, stiffness: 100, damping: 30 }), (x[11] = u))
          : (u = x[11]),
        x[12] !== j || x[13] !== p
          ? ((h = (0, t.jsx)(o.f, {
              value: p,
              format: j,
              springConfig: u,
              className: "text-sm font-medium max-md:text-xs",
            })),
            (x[12] = j),
            (x[13] = p),
            (x[14] = h))
          : (h = x[14]),
        x[15] !== m || x[16] !== h
          ? ((f = (0, t.jsx)(l.f.div, {
              className: "inline-flex items-center justify-end",
              animate: m,
              transition: d,
              children: h,
            })),
            (x[15] = m),
            (x[16] = h),
            (x[17] = f))
          : (f = x[17]),
        f
      );
    });
  eA.displayName = "ThrottledAnimatedCell";
  let ez = s.default.memo((e) => {
    let i,
      a,
      n = (0, r.c)(4),
      { mint: l } = e;
    n[0] !== l
      ? ((i = (e) => e.marketActivity?.[l]?.["24h"]?.numTxs),
        (n[0] = l),
        (n[1] = i))
      : (i = n[1]);
    let s = (0, j.f)(i);
    return (
      n[2] !== s
        ? ((a = (0, t.jsx)("div", {
            "data-testid": "transactions-cell",
            className: "text-right",
            children: (0, t.jsx)("div", {
              className: "inline-block min-w-[60px] text-right",
              children: (0, t.jsx)(eA, { value: s, formatter: eP }),
            }),
          })),
          (n[2] = s),
          (n[3] = a))
        : (a = n[3]),
      a
    );
  });
  ez.displayName = "TxnsCell";
  let eW = s.default.memo((e) => {
    let i,
      a,
      n = (0, r.c)(4),
      { mint: l } = e;
    n[0] !== l
      ? ((i = (e) => e.marketActivity?.[l]?.["24h"]?.volumeUSD),
        (n[0] = l),
        (n[1] = i))
      : (i = n[1]);
    let s = (0, j.f)(i);
    return (
      n[2] !== s
        ? ((a = (0, t.jsx)("div", {
            className: "text-right",
            children: (0, t.jsx)("div", {
              className: "inline-block min-w-[80px] text-right",
              children: (0, t.jsx)(eA, { value: s, formatter: eG }),
            }),
          })),
          (n[2] = s),
          (n[3] = a))
        : (a = n[3]),
      a
    );
  });
  eW.displayName = "VolumeCell";
  let eF = s.default.memo((e) => {
    let i,
      a,
      n = (0, r.c)(4),
      { mint: l } = e;
    n[0] !== l
      ? ((i = (e) => e.marketActivity?.[l]?.["24h"]?.numUsers),
        (n[0] = l),
        (n[1] = i))
      : (i = n[1]);
    let s = (0, j.f)(i);
    return (
      n[2] !== s
        ? ((a = (0, t.jsx)("div", {
            "data-testid": "traders-cell",
            className: "text-right",
            children: (0, t.jsx)("div", {
              className: "inline-block min-w-[60px] text-right",
              children: (0, t.jsx)(eA, { value: s, formatter: eO }),
            }),
          })),
          (n[2] = s),
          (n[3] = a))
        : (a = n[3]),
      a
    );
  });
  eF.displayName = "TradersCell";
  let eR = `calc(var(${N.E}, 68px) + 42px)`,
    eE = s.default.memo((e) => {
      let i,
        a,
        n,
        l = (0, r.c)(8),
        { mint: s, interval: o, createdTimestamp: c } = e;
      l[0] !== s
        ? ((i = (e) => e.marketActivity?.[s]), (l[0] = s), (l[1] = i))
        : (i = l[1]);
      let m = (0, j.f)(i);
      l[2] !== m || l[3] !== c || l[4] !== o
        ? ((a = (e) =>
            (0, k.k)({ activity: m, window: o, coinAgeMs: X(e, c) })),
          (l[2] = m),
          (l[3] = c),
          (l[4] = o),
          (l[5] = a))
        : (a = l[5]);
      let d = a,
        u = (0, p.H)(d);
      return (
        l[6] !== u
          ? ((n = (0, t.jsx)(ef.f, { value: u })), (l[6] = u), (l[7] = n))
          : (n = l[7]),
        n
      );
    });
  eE.displayName = "PriceChangeIntervalCell";
  let eD = s.default.memo(
    ({
      coinListProps: e,
      athMap: o,
      tableNotificationCoins: p = [],
      onTableNotificationExpand: k,
      hasActiveFilters: C,
      isWatchlistView: T = !1,
    }) => {
      let {
          coins: z,
          loading: W,
          sort: F,
          searchTerm: R,
          bookmarkedCoinMints: E,
          onManageWatchlistClick: D,
          addToBookmark: P,
          removeFromBookmark: O,
          sourceScreen: B,
          pageNumber: K,
        } = e,
        { fetchBatchATH: Y, athMap: X } = (0, u.f)(),
        J = X && Object.keys(X).length > 0 ? X : o,
        { setLastClickImpression: Q } = (0, w.y)(),
        ei = (0, h.f)(),
        ec = (0, f.f)("(max-width: 1023.98px)"),
        [em, ed] = (0, s.useState)(!1),
        [eu, ef] = (0, s.useState)([]);
      ((e) => {
        let t,
          i,
          a,
          n,
          l = (0, r.c)(9),
          { sorting: o, setSorting: c } = e;
        l[0] !== o ? ((t = o.some(et)), (l[0] = o), (l[1] = t)) : (t = l[1]);
        let m = t;
        l[2] !== o ? ((i = o.some(er)), (l[2] = o), (l[3] = i)) : (i = l[3]);
        let d = i;
        (l[4] !== m || l[5] !== d || l[6] !== c
          ? ((a = () => {
              if (!m && !d) return;
              let e = null,
                t = () => {
                  ((e = null), c(ea));
                },
                r = () => {
                  null === e && (e = setTimeout(t, 1e3));
                },
                i = [
                  m ? j.f.subscribe(en, r) : null,
                  d ? $.x.subscribe(el, r) : null,
                  d ? b.n.subscribe(es, r) : null,
                ];
              return () => {
                for (let e of i) e?.();
                null !== e && clearTimeout(e);
              };
            }),
            (n = [m, d, c]),
            (l[4] = m),
            (l[5] = d),
            (l[6] = c),
            (l[7] = a),
            (l[8] = n))
          : ((a = l[7]), (n = l[8])),
          (0, s.useEffect)(a, n));
      })({ sorting: eu, setSorting: ef });
      let [ex, ep] = (0, s.useState)(new Set()),
        eg = (0, s.useRef)(null),
        ev = (0, s.useRef)(null),
        ey = (0, s.useCallback)(() => {
          0 === p.length ||
            (ep(new Set(p.map((e) => e.mint))),
            eg.current && clearTimeout(eg.current),
            (eg.current = setTimeout(() => {
              ep(new Set());
            }, 1e3)),
            (0, y.ri)({
              buttonId: "coin_table_new_coins_expanded",
              screen: i.Ae.HOME,
            }),
            k?.(),
            ev.current &&
              (0, S.A)({
                element: ev.current,
                stickyOffset: (0, N.d)(68) + 42,
              }));
        }, [p, k]);
      (0, s.useEffect)(
        () => () => {
          eg.current && clearTimeout(eg.current);
        },
        [],
      );
      let ew = (0, s.useMemo)(
          () =>
            Array.from(
              new Set(
                z.flatMap((e) =>
                  (0, v.e)(e) || (0, v.X)(e) || (0, v.a)(e) ? [] : [e.mint],
                ),
              ),
            ).sort(),
          [z],
        ),
        ej = ew.join(",");
      ((0, s.useEffect)(() => {
        ej && Y(ej.split(","));
      }, [ej, Y]),
        (0, g.f)(ew, z.length > 0),
        (0, b._)(z),
        (0, s.useEffect)(() => {
          ef([]);
        }, [F]),
        (0, x.f)(ew, {
          shouldFetch: ew.length > 0,
          enablePolling: !0,
          pollingInterval: _.t.POLLING_INTERVAL,
          readBack: !1,
        }));
      let eN = (0, s.useCallback)(() => {
          ed(!0);
        }, []),
        e_ = (0, s.useMemo)(
          () => [
            {
              id: "name",
              header: "Coin",
              maxSize: Number.MAX_SAFE_INTEGER,
              cell: ({ row: e }) =>
                (0, t.jsx)(G, { isScrolled: em, coin: e.original }),
            },
            {
              id: "24h graph",
              header: "Graph",
              minSize: 80,
              maxSize: 100,
              cell: ({ row: e }) => (0, t.jsx)(A.f, { coin: e.original }),
            },
            {
              id: U,
              accessorFn: Z(U),
              sortingFn: ee,
              header: "Mcap",
              minSize: 80,
              maxSize: 100,
              cell: ({ row: e }) =>
                (0, t.jsx)(eo.f, {
                  mint: e.original.mint,
                  chainId: e.original.chain_id,
                  fallbackMarketCap: e.original.usd_market_cap,
                }),
            },
            {
              id: "ath",
              header: "ATH",
              minSize: 80,
              maxSize: 100,
              cell: ({ row: e }) =>
                (0, t.jsx)(I, {
                  coin: e.original,
                  athValue: J?.[e.original.mint],
                }),
            },
            {
              accessorKey: "created_timestamp",
              header: "Age",
              minSize: 60,
              maxSize: 80,
              cell: ({ row: e }) => {
                let r = e.getValue("created_timestamp");
                return (0, t.jsx)("div", {
                  className: "text-right text-sm font-medium max-md:text-xs",
                  children: (0, t.jsx)(m.f, { timestamp: r, suffix: !1 }),
                });
              },
            },
            {
              id: V,
              accessorFn: Z(V),
              sortingFn: ee,
              header: "Trades",
              minSize: 60,
              maxSize: 80,
              cell: ({ row: e }) => (0, t.jsx)(ez, { mint: e.original.mint }),
            },
            {
              id: L,
              accessorFn: Z(L),
              sortingFn: ee,
              header: "24h Vol",
              minSize: 80,
              maxSize: 120,
              cell: ({ row: e }) => (0, t.jsx)(eW, { mint: e.original.mint }),
            },
            {
              id: H,
              accessorFn: Z(H),
              sortingFn: ee,
              header: "Traders",
              minSize: 100,
              maxSize: 100,
              cell: ({ row: e }) => (0, t.jsx)(eF, { mint: e.original.mint }),
            },
            {
              id: "1h",
              accessorFn: Z("1h"),
              sortingFn: ee,
              header: "1h",
              minSize: 80,
              maxSize: 120,
              cell: ({ row: e }) =>
                (0, t.jsx)(eE, {
                  mint: e.original.mint,
                  interval: "1h",
                  createdTimestamp: e.original.created_timestamp,
                }),
            },
            {
              id: "6h",
              accessorFn: Z("6h"),
              sortingFn: ee,
              header: "6h",
              minSize: 80,
              maxSize: 120,
              cell: ({ row: e }) =>
                (0, t.jsx)(eE, {
                  mint: e.original.mint,
                  interval: "6h",
                  createdTimestamp: e.original.created_timestamp,
                }),
            },
            {
              id: q,
              accessorFn: Z(q),
              sortingFn: ee,
              header: "24h",
              minSize: 80,
              maxSize: 120,
              cell: ({ row: e }) =>
                (0, t.jsx)(eE, {
                  mint: e.original.mint,
                  interval: "24h",
                  createdTimestamp: e.original.created_timestamp,
                }),
            },
            {
              id: "bookmark",
              header: "",
              minSize: 60,
              maxSize: 80,
              cell: ({ row: e }) => {
                let r = E?.includes(e.original.mint),
                  i = K + e.index + 1;
                return (0, t.jsx)(M.f, {
                  coin: e.original,
                  isBookmarked: r,
                  addToBookmark: P,
                  removeFromBookmark: O,
                  onManageWatchlistClick: D,
                  position: i,
                  analytics: ei,
                });
              },
            },
          ],
          [E, P, O, D, em, K, ei, J],
        ),
        eC = (0, n.W)({
          data: z,
          columns: e_,
          state: { sorting: eu, columnSizing: {} },
          onSortingChange: (e) => {
            let t = "function" == typeof e ? e(eu) : e,
              [r] = t,
              [i] = eu;
            ((r?.id !== i?.id || r?.desc !== i?.desc) &&
              (0, y.ri)({
                buttonId: r
                  ? `table_sort:${r.id}:${r.desc ? "desc" : "asc"}`
                  : "table_sort:clear",
              }),
              ef(t));
          },
          columnResizeMode: "onChange",
          getCoreRowModel: (0, a.Z)(),
          getSortedRowModel: (0, a.a)(),
          getRowId: (e) => e.mint,
        });
      if (W)
        return (0, t.jsx)(l.f.div, {
          variants: eM,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
          className: "w-full",
          children: (0, t.jsx)(eS.h, {}),
        });
      if (0 === z.length)
        return (0, t.jsx)(l.f.div, {
          variants: eI,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
          className: "w-full",
          children: (0, t.jsx)(c.f, {}),
        });
      let eT = eC.getRowModel().rows;
      return (0, t.jsxs)(l.f.div, {
        ref: ev,
        onScroll: eN,
        variants: eI,
        initial: !1,
        animate: "visible",
        exit: "exit",
        className: "w-full min-w-0 max-w-full",
        children: [
          !T &&
            0 === K &&
            (0, t.jsx)("div", {
              className: "sticky z-20 h-0",
              style: { top: eR },
              children: (0, t.jsx)(eh, {
                newCoins: p,
                onToggle: ey,
                sort: F,
                hasActiveFilters: C,
              }),
            }),
          (0, t.jsx)("div", {
            className: eS.V,
            children: (0, t.jsx)("div", {
              className: eS.q,
              children: (0, t.jsxs)("table", {
                id: "screener",
                className: eS.m,
                children: [
                  (0, t.jsx)(eb, { table: eC, isCompact: ec }),
                  (0, t.jsx)(d.z, {
                    className: eS.O,
                    children: eT.map((e, r) =>
                      (0, t.jsx)(
                        ek,
                        {
                          row: e,
                          serialNumber: K + r + 1,
                          isScrolled: em,
                          index: K + r,
                          searchTerm: R,
                          sourceScreen: B,
                          sort: F,
                          offset: K,
                          bookmarkedCoinMints: E,
                          setLastClickImpression: Q,
                          shouldAnimate: ex.has(e.original.mint),
                          isWatchlistView: T,
                          isCompact: ec,
                        },
                        e.original.mint,
                      ),
                    ),
                  }),
                ],
              }),
            }),
          }),
        ],
      });
    },
  );
  function eP(e) {
    return eC.format(Math.floor(e));
  }
  function eG(e) {
    return eT.format(e);
  }
  function eO(e) {
    return eC.format(Math.floor(e));
  }
  ((eD.displayName = "CoinTable"), e.s(["CoinTable", 0, eD], 294093));
};
