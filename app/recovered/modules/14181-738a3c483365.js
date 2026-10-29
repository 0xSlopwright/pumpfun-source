// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    s = e.i(439587);
  e.i(12692);
  var a = e.i(398902),
    o = e.i(254806),
    r = e.i(309445),
    l = e.i(806968);
  e.s([
    "BountiesIntroVideoFtueDialog",
    0,
    (e) => {
      let n,
        c,
        d,
        m,
        u,
        h,
        x,
        b,
        p,
        j,
        y,
        f,
        v,
        _,
        I,
        N = (0, i.c)(31),
        { isOpen: g, onIsOpenChange: T, onContinue: k } = e,
        { t: w } = (0, a.f)();
      return (
        N[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((n = (0, r.H)()), (N[0] = n))
          : (n = N[0]),
        N[1] !== w
          ? ((c = w("web.bounties.intro_poster_alt")), (N[1] = w), (N[2] = c))
          : (c = N[2]),
        N[3] !== c
          ? ((d = (0, t.jsx)("div", {
              className:
                "overflow-hidden rounded-xl border border-border-secondary",
              children: (0, t.jsx)(l.f, {
                className: "aspect-video rounded-none",
                controls: !0,
                controlsLayout: "minimal",
                load: "play",
                mediaClassName: "object-cover",
                muxAnalytics: n,
                muted: !0,
                playsInline: !0,
                poster: o.E,
                posterAlt: c,
                posterLoad: "eager",
                preload: "none",
                sourceType: o.$,
                src: o.R,
              }),
            })),
            (N[3] = c),
            (N[4] = d))
          : (d = N[4]),
        N[5] === Symbol.for("react.memo_cache_sentinel")
          ? ((m = (0, t.jsx)(s.k, { height: 24 })), (N[5] = m))
          : (m = N[5]),
        N[6] !== w
          ? ((u = w("web.bounties.welcome_to")), (N[6] = w), (N[7] = u))
          : (u = N[7]),
        N[8] === Symbol.for("react.memo_cache_sentinel")
          ? ((h = (0, t.jsx)("span", {
              className: "text-text-accent",
              children: ".",
            })),
            (N[8] = h))
          : (h = N[8]),
        N[9] !== u
          ? ((x = (0, t.jsxs)("p", {
              className: "text-center font-bold text-2xl text-text-primary",
              children: [u, " Pump", h, "fun GO"],
            })),
            (N[9] = u),
            (N[10] = x))
          : (x = N[10]),
        N[11] === Symbol.for("react.memo_cache_sentinel")
          ? ((b = (0, t.jsx)(s.k, { height: 16 })), (N[11] = b))
          : (b = N[11]),
        N[12] !== w
          ? ((p = w("web.bounties.welcome_description")),
            (N[12] = w),
            (N[13] = p))
          : (p = N[13]),
        N[14] !== p
          ? ((j = (0, t.jsx)("p", {
              className: "text-center text-text-tertiary",
              children: p,
            })),
            (N[14] = p),
            (N[15] = j))
          : (j = N[15]),
        N[16] === Symbol.for("react.memo_cache_sentinel")
          ? ((y = (0, t.jsx)(s.k, { height: 24 })), (N[16] = y))
          : (y = N[16]),
        N[17] !== w
          ? ((f = w("web.bounties.get_started")), (N[17] = w), (N[18] = f))
          : (f = N[18]),
        N[19] !== k || N[20] !== f
          ? ((v = (0, t.jsx)(s.K, {
              isFullWidth: !0,
              onClick: k,
              size: 48,
              children: f,
            })),
            (N[19] = k),
            (N[20] = f),
            (N[21] = v))
          : (v = N[21]),
        N[22] !== j || N[23] !== v || N[24] !== d || N[25] !== x
          ? ((_ = (0, t.jsxs)(s.s, {
              className: "w-full max-w-[min(720px,100%)]",
              children: [d, m, x, b, j, y, v],
            })),
            (N[22] = j),
            (N[23] = v),
            (N[24] = d),
            (N[25] = x),
            (N[26] = _))
          : (_ = N[26]),
        N[27] !== g || N[28] !== T || N[29] !== _
          ? ((I = (0, t.jsx)(s.v, {
              isOpen: g,
              onIsOpenChange: T,
              children: _,
            })),
            (N[27] = g),
            (N[28] = T),
            (N[29] = _),
            (N[30] = I))
          : (I = N[30]),
        I
      );
    },
  ]);
};
