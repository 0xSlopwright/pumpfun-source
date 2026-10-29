// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(34011),
    n = e.i(732486),
    r = e.i(445242),
    a = e.i(426091),
    l = e.i(529841),
    i = e.i(116830),
    o = e.i(924631);
  let s = { sm: 32, md: 40, lg: 48 },
    c = { sm: "text-sm", md: "text-sm", lg: "text-sm" },
    u = { sm: 14, md: 14, lg: 16 },
    f = { sm: "text-xs", md: "text-xs", lg: "text-[13px]" };
  (e.s(
    [
      "f",
      0,
      function (e) {
        let d,
          h,
          p,
          m,
          v,
          y,
          g,
          b,
          x,
          w,
          B,
          k,
          C,
          _,
          I,
          A,
          S,
          N,
          T,
          E,
          F,
          $,
          L,
          j = (0, r.c)(53);
        if (j[0] !== e) {
          let n,
            {
              size: r,
              columnRef: a,
              nameTrailing: l,
              symbolTrailing: i,
              subline: s,
              createdAt: c,
              isFresh: u,
              freshClassName: f,
              className: S,
              nameClassName: N,
              symbolClassName: T,
              symbolPrefix: E,
              coin: F,
              ...$
            } = e;
          ((m = a),
            (x = l),
            (I = i),
            (B = s),
            (v = c),
            (h = S),
            (b = N),
            (C = T),
            (p = F),
            (d = $),
            (w = void 0 === r ? "md" : r),
            (g = void 0 !== u && u),
            (y = void 0 === f ? "text-text-primary" : f),
            (_ = void 0 === E || E),
            j[17] !== p.symbol
              ? ((n = (0, o.W)(p.symbol)), (j[17] = p.symbol), (j[18] = n))
              : (n = j[18]),
            (k = n),
            (A = (0, t.resolveCoinAvatarSeal)(d)),
            (j[0] = e),
            (j[1] = d),
            (j[2] = h),
            (j[3] = p),
            (j[4] = m),
            (j[5] = v),
            (j[6] = y),
            (j[7] = g),
            (j[8] = b),
            (j[9] = x),
            (j[10] = w),
            (j[11] = B),
            (j[12] = k),
            (j[13] = C),
            (j[14] = _),
            (j[15] = I),
            (j[16] = A));
        } else
          ((d = j[1]),
            (h = j[2]),
            (p = j[3]),
            (m = j[4]),
            (v = j[5]),
            (y = j[6]),
            (g = j[7]),
            (b = j[8]),
            (x = j[9]),
            (w = j[10]),
            (B = j[11]),
            (k = j[12]),
            (C = j[13]),
            (_ = j[14]),
            (I = j[15]),
            (A = j[16]));
        let O = "name" === A;
        j[19] !== h
          ? ((S = (0, a.c)("flex min-w-0 items-center gap-3", h)),
            (j[19] = h),
            (j[20] = S))
          : (S = j[20]);
        let P = s[w];
        j[21] !== d || j[22] !== p || j[23] !== P
          ? ((N = (0, n.jsx)(t.CoinAvatar, { coin: p, size: P, ...d })),
            (j[21] = d),
            (j[22] = p),
            (j[23] = P),
            (j[24] = N))
          : (N = j[24]);
        let D = !!O && (d.verified ?? "lookup"),
          R = u[w],
          M = c[w];
        return (
          j[25] !== b || j[26] !== M
            ? ((T = (0, a.c)(M, b)), (j[25] = b), (j[26] = M), (j[27] = T))
            : (T = j[27]),
          j[28] !== d.testIdPrefix ||
          j[29] !== p ||
          j[30] !== x ||
          j[31] !== D ||
          j[32] !== R ||
          j[33] !== T
            ? ((E = (0, n.jsx)(i.f, {
                coin: p,
                verified: D,
                sealSize: R,
                nameClassName: T,
                trailing: x,
                testIdPrefix: d.testIdPrefix,
              })),
              (j[28] = d.testIdPrefix),
              (j[29] = p),
              (j[30] = x),
              (j[31] = D),
              (j[32] = R),
              (j[33] = T),
              (j[34] = E))
            : (E = j[34]),
          j[35] !== v ||
          j[36] !== y ||
          j[37] !== g ||
          j[38] !== w ||
          j[39] !== B ||
          j[40] !== k ||
          j[41] !== C ||
          j[42] !== _ ||
          j[43] !== I
            ? ((F =
                B ??
                (0, n.jsxs)("span", {
                  className: "flex min-w-0 items-center gap-2",
                  children: [
                    k
                      ? (0, n.jsx)("span", {
                          className: (0, a.c)(
                            "truncate text-text-tertiary",
                            f[w],
                            C,
                          ),
                          children: _ ? `$${k}` : k,
                        })
                      : null,
                    v
                      ? (0, n.jsx)(l.f, {
                          timestamp: v,
                          suffix: !1,
                          className: (0, a.c)(
                            "shrink-0 tabular-nums",
                            f[w],
                            g ? y : "text-text-tertiary",
                          ),
                        })
                      : null,
                    I,
                  ],
                })),
              (j[35] = v),
              (j[36] = y),
              (j[37] = g),
              (j[38] = w),
              (j[39] = B),
              (j[40] = k),
              (j[41] = C),
              (j[42] = _),
              (j[43] = I),
              (j[44] = F))
            : (F = j[44]),
          j[45] !== m || j[46] !== F || j[47] !== E
            ? (($ = (0, n.jsxs)("div", {
                ref: m,
                className: "flex min-w-0 flex-1 flex-col",
                children: [E, F],
              })),
              (j[45] = m),
              (j[46] = F),
              (j[47] = E),
              (j[48] = $))
            : ($ = j[48]),
          j[49] !== $ || j[50] !== S || j[51] !== N
            ? ((L = (0, n.jsxs)("div", { className: S, children: [N, $] })),
              (j[49] = $),
              (j[50] = S),
              (j[51] = N),
              (j[52] = L))
            : (L = j[52]),
          L
        );
      },
    ],
    41028,
  ),
    e.s([], 12641));
};
