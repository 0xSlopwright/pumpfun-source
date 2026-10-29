// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(465085),
    n = e.i(352386);
  e.i(12692);
  var a = e.i(398902),
    l = e.i(667876),
    s = e.i(34011),
    o = e.i(338319);
  let c = { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    m = (e) => {
      let n,
        a,
        l,
        m,
        u = (0, i.c)(11),
        { coin: d, isScrolled: f } = e,
        h = f && "coin-avatar-glow-active";
      u[0] !== h
        ? ((n = (0, o.c)("coin-avatar-glow relative shrink-0 rounded-md", h)),
          (u[0] = h),
          (u[1] = n))
        : (n = u[1]);
      let p = f ? 1.15 : 1;
      u[2] !== p ? ((a = { scale: p }), (u[2] = p), (u[3] = a)) : (a = u[3]);
      let x = f ? 32 : 28;
      return (
        u[4] !== d || u[5] !== x
          ? ((l = (0, t.jsx)(s.CoinAvatar, {
              coin: d,
              size: x,
              seal: "name",
              optimisticImage: !0,
              testIdPrefix: "coin-cell-art",
            })),
            (u[4] = d),
            (u[5] = x),
            (u[6] = l))
          : (l = u[6]),
        u[7] !== n || u[8] !== a || u[9] !== l
          ? ((m = (0, t.jsx)(r.f.div, {
              className: n,
              animate: a,
              transition: c,
              children: l,
            })),
            (u[7] = n),
            (u[8] = a),
            (u[9] = l),
            (u[10] = m))
          : (m = u[10]),
        m
      );
    },
    u = (e) => {
      let n,
        s,
        o,
        m,
        u,
        d,
        f,
        h,
        p,
        x,
        b = (0, i.c)(29),
        { coin: v, isScrolled: y } = e,
        { t: g } = (0, a.f)(),
        w = +!y,
        N = y ? -15 : 0,
        _ = y ? 0.9 : 1;
      (b[0] !== w || b[1] !== N || b[2] !== _
        ? ((n = { opacity: w, x: N, scale: _ }),
          (b[0] = w),
          (b[1] = N),
          (b[2] = _),
          (b[3] = n))
        : (n = b[3]),
        b[4] === Symbol.for("react.memo_cache_sentinel")
          ? ((s = { transformOrigin: "left center" }), (b[4] = s))
          : (s = b[4]),
        b[5] !== v.name
          ? ((o = (0, t.jsx)("span", {
              className:
                "min-w-0 max-w-[85px] truncate whitespace-nowrap text-sm font-medium leading-none md:max-w-none",
              title: v.name,
              children: v.name,
            })),
            (b[5] = v.name),
            (b[6] = o))
          : (o = b[6]));
      let E = "string" == typeof v.chain_id ? v.chain_id : null;
      (b[7] !== v.mint || b[8] !== E
        ? ((m = (0, t.jsx)(l.f, { mint: v.mint, chainId: E })),
          (b[7] = v.mint),
          (b[8] = E),
          (b[9] = m))
        : (m = b[9]),
        b[10] !== o || b[11] !== m
          ? ((u = (0, t.jsxs)("span", {
              className: "flex min-w-0 max-w-full items-center gap-1",
              children: [o, m],
            })),
            (b[10] = o),
            (b[11] = m),
            (b[12] = u))
          : (u = b[12]));
      let j = v.symbol ? `$${v.symbol}` : null;
      return (
        b[13] !== j
          ? ((d = (0, t.jsx)("span", {
              className:
                "flex-shrink-0 text-xs leading-none text-text-tertiary",
              children: j,
            })),
            (b[13] = j),
            (b[14] = d))
          : (d = b[14]),
        b[15] !== v.nsfw || b[16] !== g
          ? ((f =
              v.nsfw &&
              (0, t.jsx)("span", {
                className:
                  "border-destructive/50 text-destructive h-3.5 content-center rounded border px-1 text-[8px] leading-none",
                children: g("web.home.nsfw_label"),
              })),
            (b[15] = v.nsfw),
            (b[16] = g),
            (b[17] = f))
          : (f = b[17]),
        b[18] !== v.is_charity || b[19] !== g
          ? ((h =
              v.is_charity &&
              (0, t.jsx)("span", {
                className:
                  "h-3.5 content-center rounded border border-pink-500/40 bg-pink-500/10 px-1 text-[8px] leading-none text-pink-500",
                children: g("creator_fees.charity.label"),
              })),
            (b[18] = v.is_charity),
            (b[19] = g),
            (b[20] = h))
          : (h = b[20]),
        b[21] !== d || b[22] !== f || b[23] !== h
          ? ((p = (0, t.jsxs)("div", {
              className: "flex h-3.5 items-center gap-1",
              children: [d, f, h],
            })),
            (b[21] = d),
            (b[22] = f),
            (b[23] = h),
            (b[24] = p))
          : (p = b[24]),
        b[25] !== p || b[26] !== n || b[27] !== u
          ? ((x = (0, t.jsxs)(r.f.div, {
              className:
                "coin-cell-animation flex min-w-0 flex-col items-baseline gap-1 overflow-hidden px-1",
              animate: n,
              transition: c,
              style: s,
              children: [u, p],
            })),
            (b[25] = p),
            (b[26] = n),
            (b[27] = u),
            (b[28] = x))
          : (x = b[28]),
        x
      );
    },
    d = (0, n.memo)(
      (e) => {
        let n,
          a,
          l,
          s,
          d,
          f,
          h = (0, i.c)(20),
          {
            coin: p,
            isScrolled: x,
            isHorizontallyScrolled: b,
            serialNumber: v,
          } = e,
          y = x || b ? "justify-center gap-0" : "gap-1.5";
        h[0] !== y
          ? ((n = (0, o.c)("coin-cell-animation flex w-full items-center", y)),
            (h[0] = y),
            (h[1] = n))
          : (n = h[1]);
        let g = x || b ? 0 : 8;
        (h[2] !== g ? ((a = { gap: g }), (h[2] = g), (h[3] = a)) : (a = h[3]),
          h[4] !== b || h[5] !== v
            ? ((l =
                void 0 !== v &&
                (0, t.jsx)(r.f.div, {
                  className:
                    "flex-shrink-0 text-center font-medium text-text-tertiary",
                  style: { minWidth: 32 * !b, overflow: "hidden" },
                  animate: { opacity: +!b, scale: b ? 0.8 : 1, width: 32 * !b },
                  transition: c,
                  children: (0, t.jsx)("span", {
                    className: "text-sm",
                    children: v,
                  }),
                })),
              (h[4] = b),
              (h[5] = v),
              (h[6] = l))
            : (l = h[6]));
        let w = x || b;
        return (
          h[7] !== p || h[8] !== w
            ? ((s = (0, t.jsx)(m, { coin: p, isScrolled: w })),
              (h[7] = p),
              (h[8] = w),
              (h[9] = s))
            : (s = h[9]),
          h[10] !== p || h[11] !== b || h[12] !== x
            ? ((d = !b && (0, t.jsx)(u, { coin: p, isScrolled: x })),
              (h[10] = p),
              (h[11] = b),
              (h[12] = x),
              (h[13] = d))
            : (d = h[13]),
          h[14] !== n ||
          h[15] !== a ||
          h[16] !== l ||
          h[17] !== s ||
          h[18] !== d
            ? ((f = (0, t.jsxs)(r.f.div, {
                className: n,
                animate: a,
                transition: c,
                children: [l, s, d],
              })),
              (h[14] = n),
              (h[15] = a),
              (h[16] = l),
              (h[17] = s),
              (h[18] = d),
              (h[19] = f))
            : (f = h[19]),
          f
        );
      },
      (e, t) => {
        if (e.coin === t.coin)
          return (
            e.isScrolled === t.isScrolled &&
            e.isHorizontallyScrolled === t.isHorizontallyScrolled &&
            e.serialNumber === t.serialNumber
          );
        let i = e.coin,
          r = t.coin;
        return (
          i.mint === r.mint &&
          i.name === r.name &&
          i.symbol === r.symbol &&
          i.image_uri === r.image_uri &&
          i.chain_id === r.chain_id &&
          i.program === r.program &&
          i.board_program === r.board_program &&
          i.platform === r.platform &&
          i.protocol === r.protocol &&
          i.is_currently_live === r.is_currently_live &&
          i.nsfw === r.nsfw &&
          i.is_charity === r.is_charity &&
          e.isScrolled === t.isScrolled &&
          e.isHorizontallyScrolled === t.isHorizontallyScrolled &&
          e.serialNumber === t.serialNumber
        );
      },
    );
  ((d.displayName = "CoinCell"), e.s(["f", 0, d]));
};
