// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(34011),
    i = e.i(732486),
    r = e.i(445242),
    n = e.i(426091),
    a = e.i(529841),
    l = e.i(116830),
    s = e.i(924631);
  let o = { sm: 32, md: 40, lg: 48 },
    c = { sm: "text-sm", md: "text-sm", lg: "text-sm" },
    m = { sm: 14, md: 14, lg: 16 },
    u = { sm: "text-xs", md: "text-xs", lg: "text-[13px]" };
  (e.s(
    [
      "f",
      0,
      function (e) {
        let d,
          f,
          h,
          p,
          x,
          b,
          v,
          y,
          g,
          w,
          N,
          _,
          E,
          j,
          C,
          I,
          k,
          S,
          T,
          A,
          R,
          F,
          O,
          L = (0, r.c)(53);
        if (L[0] !== e) {
          let i,
            {
              size: r,
              columnRef: n,
              nameTrailing: a,
              symbolTrailing: l,
              subline: o,
              createdAt: c,
              isFresh: m,
              freshClassName: u,
              className: k,
              nameClassName: S,
              symbolClassName: T,
              symbolPrefix: A,
              coin: R,
              ...F
            } = e;
          ((p = n),
            (g = a),
            (C = l),
            (N = o),
            (x = c),
            (f = k),
            (y = S),
            (E = T),
            (h = R),
            (d = F),
            (w = void 0 === r ? "md" : r),
            (v = void 0 !== m && m),
            (b = void 0 === u ? "text-text-primary" : u),
            (j = void 0 === A || A),
            L[17] !== h.symbol
              ? ((i = (0, s.W)(h.symbol)), (L[17] = h.symbol), (L[18] = i))
              : (i = L[18]),
            (_ = i),
            (I = (0, t.resolveCoinAvatarSeal)(d)),
            (L[0] = e),
            (L[1] = d),
            (L[2] = f),
            (L[3] = h),
            (L[4] = p),
            (L[5] = x),
            (L[6] = b),
            (L[7] = v),
            (L[8] = y),
            (L[9] = g),
            (L[10] = w),
            (L[11] = N),
            (L[12] = _),
            (L[13] = E),
            (L[14] = j),
            (L[15] = C),
            (L[16] = I));
        } else
          ((d = L[1]),
            (f = L[2]),
            (h = L[3]),
            (p = L[4]),
            (x = L[5]),
            (b = L[6]),
            (v = L[7]),
            (y = L[8]),
            (g = L[9]),
            (w = L[10]),
            (N = L[11]),
            (_ = L[12]),
            (E = L[13]),
            (j = L[14]),
            (C = L[15]),
            (I = L[16]));
        let M = "name" === I;
        L[19] !== f
          ? ((k = (0, n.c)("flex min-w-0 items-center gap-3", f)),
            (L[19] = f),
            (L[20] = k))
          : (k = L[20]);
        let P = o[w];
        L[21] !== d || L[22] !== h || L[23] !== P
          ? ((S = (0, i.jsx)(t.CoinAvatar, { coin: h, size: P, ...d })),
            (L[21] = d),
            (L[22] = h),
            (L[23] = P),
            (L[24] = S))
          : (S = L[24]);
        let D = !!M && (d.verified ?? "lookup"),
          H = m[w],
          z = c[w];
        return (
          L[25] !== y || L[26] !== z
            ? ((T = (0, n.c)(z, y)), (L[25] = y), (L[26] = z), (L[27] = T))
            : (T = L[27]),
          L[28] !== d.testIdPrefix ||
          L[29] !== h ||
          L[30] !== g ||
          L[31] !== D ||
          L[32] !== H ||
          L[33] !== T
            ? ((A = (0, i.jsx)(l.f, {
                coin: h,
                verified: D,
                sealSize: H,
                nameClassName: T,
                trailing: g,
                testIdPrefix: d.testIdPrefix,
              })),
              (L[28] = d.testIdPrefix),
              (L[29] = h),
              (L[30] = g),
              (L[31] = D),
              (L[32] = H),
              (L[33] = T),
              (L[34] = A))
            : (A = L[34]),
          L[35] !== x ||
          L[36] !== b ||
          L[37] !== v ||
          L[38] !== w ||
          L[39] !== N ||
          L[40] !== _ ||
          L[41] !== E ||
          L[42] !== j ||
          L[43] !== C
            ? ((R =
                N ??
                (0, i.jsxs)("span", {
                  className: "flex min-w-0 items-center gap-2",
                  children: [
                    _
                      ? (0, i.jsx)("span", {
                          className: (0, n.c)(
                            "truncate text-text-tertiary",
                            u[w],
                            E,
                          ),
                          children: j ? `$${_}` : _,
                        })
                      : null,
                    x
                      ? (0, i.jsx)(a.f, {
                          timestamp: x,
                          suffix: !1,
                          className: (0, n.c)(
                            "shrink-0 tabular-nums",
                            u[w],
                            v ? b : "text-text-tertiary",
                          ),
                        })
                      : null,
                    C,
                  ],
                })),
              (L[35] = x),
              (L[36] = b),
              (L[37] = v),
              (L[38] = w),
              (L[39] = N),
              (L[40] = _),
              (L[41] = E),
              (L[42] = j),
              (L[43] = C),
              (L[44] = R))
            : (R = L[44]),
          L[45] !== p || L[46] !== R || L[47] !== A
            ? ((F = (0, i.jsxs)("div", {
                ref: p,
                className: "flex min-w-0 flex-1 flex-col",
                children: [A, R],
              })),
              (L[45] = p),
              (L[46] = R),
              (L[47] = A),
              (L[48] = F))
            : (F = L[48]),
          L[49] !== F || L[50] !== k || L[51] !== S
            ? ((O = (0, i.jsxs)("div", { className: k, children: [S, F] })),
              (L[49] = F),
              (L[50] = k),
              (L[51] = S),
              (L[52] = O))
            : (O = L[52]),
          O
        );
      },
    ],
    41028,
  ),
    e.s([], 12641));
};
