// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(34011),
    n = e.i(732486),
    r = e.i(445242),
    a = e.i(426091),
    l = e.i(529841),
    o = e.i(116830),
    i = e.i(924631);
  let s = { sm: 32, md: 40, lg: 48 },
    c = { sm: "text-sm", md: "text-sm", lg: "text-sm" },
    u = { sm: 14, md: 14, lg: 16 },
    f = { sm: "text-xs", md: "text-xs", lg: "text-[13px]" };
  (e.s(
    [
      "f",
      0,
      function (e) {
        let h,
          d,
          m,
          p,
          v,
          g,
          y,
          b,
          x,
          w,
          k,
          B,
          _,
          C,
          I,
          A,
          L,
          S,
          E,
          N,
          F,
          $,
          T,
          O = (0, r.c)(53);
        if (O[0] !== e) {
          let n,
            {
              size: r,
              columnRef: a,
              nameTrailing: l,
              symbolTrailing: o,
              subline: s,
              createdAt: c,
              isFresh: u,
              freshClassName: f,
              className: L,
              nameClassName: S,
              symbolClassName: E,
              symbolPrefix: N,
              coin: F,
              ...$
            } = e;
          ((p = a),
            (x = l),
            (I = o),
            (k = s),
            (v = c),
            (d = L),
            (b = S),
            (_ = E),
            (m = F),
            (h = $),
            (w = void 0 === r ? "md" : r),
            (y = void 0 !== u && u),
            (g = void 0 === f ? "text-text-primary" : f),
            (C = void 0 === N || N),
            O[17] !== m.symbol
              ? ((n = (0, i.W)(m.symbol)), (O[17] = m.symbol), (O[18] = n))
              : (n = O[18]),
            (B = n),
            (A = (0, t.resolveCoinAvatarSeal)(h)),
            (O[0] = e),
            (O[1] = h),
            (O[2] = d),
            (O[3] = m),
            (O[4] = p),
            (O[5] = v),
            (O[6] = g),
            (O[7] = y),
            (O[8] = b),
            (O[9] = x),
            (O[10] = w),
            (O[11] = k),
            (O[12] = B),
            (O[13] = _),
            (O[14] = C),
            (O[15] = I),
            (O[16] = A));
        } else
          ((h = O[1]),
            (d = O[2]),
            (m = O[3]),
            (p = O[4]),
            (v = O[5]),
            (g = O[6]),
            (y = O[7]),
            (b = O[8]),
            (x = O[9]),
            (w = O[10]),
            (k = O[11]),
            (B = O[12]),
            (_ = O[13]),
            (C = O[14]),
            (I = O[15]),
            (A = O[16]));
        let M = "name" === A;
        O[19] !== d
          ? ((L = (0, a.c)("flex min-w-0 items-center gap-3", d)),
            (O[19] = d),
            (O[20] = L))
          : (L = O[20]);
        let P = s[w];
        O[21] !== h || O[22] !== m || O[23] !== P
          ? ((S = (0, n.jsx)(t.CoinAvatar, { coin: m, size: P, ...h })),
            (O[21] = h),
            (O[22] = m),
            (O[23] = P),
            (O[24] = S))
          : (S = O[24]);
        let j = !!M && (h.verified ?? "lookup"),
          D = u[w],
          U = c[w];
        return (
          O[25] !== b || O[26] !== U
            ? ((E = (0, a.c)(U, b)), (O[25] = b), (O[26] = U), (O[27] = E))
            : (E = O[27]),
          O[28] !== h.testIdPrefix ||
          O[29] !== m ||
          O[30] !== x ||
          O[31] !== j ||
          O[32] !== D ||
          O[33] !== E
            ? ((N = (0, n.jsx)(o.f, {
                coin: m,
                verified: j,
                sealSize: D,
                nameClassName: E,
                trailing: x,
                testIdPrefix: h.testIdPrefix,
              })),
              (O[28] = h.testIdPrefix),
              (O[29] = m),
              (O[30] = x),
              (O[31] = j),
              (O[32] = D),
              (O[33] = E),
              (O[34] = N))
            : (N = O[34]),
          O[35] !== v ||
          O[36] !== g ||
          O[37] !== y ||
          O[38] !== w ||
          O[39] !== k ||
          O[40] !== B ||
          O[41] !== _ ||
          O[42] !== C ||
          O[43] !== I
            ? ((F =
                k ??
                (0, n.jsxs)("span", {
                  className: "flex min-w-0 items-center gap-2",
                  children: [
                    B
                      ? (0, n.jsx)("span", {
                          className: (0, a.c)(
                            "truncate text-text-tertiary",
                            f[w],
                            _,
                          ),
                          children: C ? `$${B}` : B,
                        })
                      : null,
                    v
                      ? (0, n.jsx)(l.f, {
                          timestamp: v,
                          suffix: !1,
                          className: (0, a.c)(
                            "shrink-0 tabular-nums",
                            f[w],
                            y ? g : "text-text-tertiary",
                          ),
                        })
                      : null,
                    I,
                  ],
                })),
              (O[35] = v),
              (O[36] = g),
              (O[37] = y),
              (O[38] = w),
              (O[39] = k),
              (O[40] = B),
              (O[41] = _),
              (O[42] = C),
              (O[43] = I),
              (O[44] = F))
            : (F = O[44]),
          O[45] !== p || O[46] !== F || O[47] !== N
            ? (($ = (0, n.jsxs)("div", {
                ref: p,
                className: "flex min-w-0 flex-1 flex-col",
                children: [N, F],
              })),
              (O[45] = p),
              (O[46] = F),
              (O[47] = N),
              (O[48] = $))
            : ($ = O[48]),
          O[49] !== $ || O[50] !== L || O[51] !== S
            ? ((T = (0, n.jsxs)("div", { className: L, children: [S, $] })),
              (O[49] = $),
              (O[50] = L),
              (O[51] = S),
              (O[52] = T))
            : (T = O[52]),
          T
        );
      },
    ],
    41028,
  ),
    e.s([], 12641));
};
