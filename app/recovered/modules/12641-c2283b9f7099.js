// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(34011),
    n = e.i(732486),
    r = e.i(445242),
    s = e.i(426091),
    i = e.i(529841),
    a = e.i(116830),
    o = e.i(924631);
  let l = { sm: 32, md: 40, lg: 48 },
    u = { sm: "text-sm", md: "text-sm", lg: "text-sm" },
    c = { sm: 14, md: 14, lg: 16 },
    d = { sm: "text-xs", md: "text-xs", lg: "text-[13px]" };
  (e.s(
    [
      "f",
      0,
      function (e) {
        let f,
          m,
          h,
          g,
          p,
          _,
          b,
          y,
          v,
          w,
          z,
          x,
          k,
          S,
          $,
          B,
          j,
          P,
          T,
          I,
          A,
          E,
          N,
          q = (0, r.c)(53);
        if (q[0] !== e) {
          let n,
            {
              size: r,
              columnRef: s,
              nameTrailing: i,
              symbolTrailing: a,
              subline: l,
              createdAt: u,
              isFresh: c,
              freshClassName: d,
              className: j,
              nameClassName: P,
              symbolClassName: T,
              symbolPrefix: I,
              coin: A,
              ...E
            } = e;
          ((g = s),
            (v = i),
            ($ = a),
            (z = l),
            (p = u),
            (m = j),
            (y = P),
            (k = T),
            (h = A),
            (f = E),
            (w = void 0 === r ? "md" : r),
            (b = void 0 !== c && c),
            (_ = void 0 === d ? "text-text-primary" : d),
            (S = void 0 === I || I),
            q[17] !== h.symbol
              ? ((n = (0, o.W)(h.symbol)), (q[17] = h.symbol), (q[18] = n))
              : (n = q[18]),
            (x = n),
            (B = (0, t.resolveCoinAvatarSeal)(f)),
            (q[0] = e),
            (q[1] = f),
            (q[2] = m),
            (q[3] = h),
            (q[4] = g),
            (q[5] = p),
            (q[6] = _),
            (q[7] = b),
            (q[8] = y),
            (q[9] = v),
            (q[10] = w),
            (q[11] = z),
            (q[12] = x),
            (q[13] = k),
            (q[14] = S),
            (q[15] = $),
            (q[16] = B));
        } else
          ((f = q[1]),
            (m = q[2]),
            (h = q[3]),
            (g = q[4]),
            (p = q[5]),
            (_ = q[6]),
            (b = q[7]),
            (y = q[8]),
            (v = q[9]),
            (w = q[10]),
            (z = q[11]),
            (x = q[12]),
            (k = q[13]),
            (S = q[14]),
            ($ = q[15]),
            (B = q[16]));
        let C = "name" === B;
        q[19] !== m
          ? ((j = (0, s.c)("flex min-w-0 items-center gap-3", m)),
            (q[19] = m),
            (q[20] = j))
          : (j = q[20]);
        let O = l[w];
        q[21] !== f || q[22] !== h || q[23] !== O
          ? ((P = (0, n.jsx)(t.CoinAvatar, { coin: h, size: O, ...f })),
            (q[21] = f),
            (q[22] = h),
            (q[23] = O),
            (q[24] = P))
          : (P = q[24]);
        let L = !!C && (f.verified ?? "lookup"),
          U = c[w],
          R = u[w];
        return (
          q[25] !== y || q[26] !== R
            ? ((T = (0, s.c)(R, y)), (q[25] = y), (q[26] = R), (q[27] = T))
            : (T = q[27]),
          q[28] !== f.testIdPrefix ||
          q[29] !== h ||
          q[30] !== v ||
          q[31] !== L ||
          q[32] !== U ||
          q[33] !== T
            ? ((I = (0, n.jsx)(a.f, {
                coin: h,
                verified: L,
                sealSize: U,
                nameClassName: T,
                trailing: v,
                testIdPrefix: f.testIdPrefix,
              })),
              (q[28] = f.testIdPrefix),
              (q[29] = h),
              (q[30] = v),
              (q[31] = L),
              (q[32] = U),
              (q[33] = T),
              (q[34] = I))
            : (I = q[34]),
          q[35] !== p ||
          q[36] !== _ ||
          q[37] !== b ||
          q[38] !== w ||
          q[39] !== z ||
          q[40] !== x ||
          q[41] !== k ||
          q[42] !== S ||
          q[43] !== $
            ? ((A =
                z ??
                (0, n.jsxs)("span", {
                  className: "flex min-w-0 items-center gap-2",
                  children: [
                    x
                      ? (0, n.jsx)("span", {
                          className: (0, s.c)(
                            "truncate text-text-tertiary",
                            d[w],
                            k,
                          ),
                          children: S ? `$${x}` : x,
                        })
                      : null,
                    p
                      ? (0, n.jsx)(i.f, {
                          timestamp: p,
                          suffix: !1,
                          className: (0, s.c)(
                            "shrink-0 tabular-nums",
                            d[w],
                            b ? _ : "text-text-tertiary",
                          ),
                        })
                      : null,
                    $,
                  ],
                })),
              (q[35] = p),
              (q[36] = _),
              (q[37] = b),
              (q[38] = w),
              (q[39] = z),
              (q[40] = x),
              (q[41] = k),
              (q[42] = S),
              (q[43] = $),
              (q[44] = A))
            : (A = q[44]),
          q[45] !== g || q[46] !== A || q[47] !== I
            ? ((E = (0, n.jsxs)("div", {
                ref: g,
                className: "flex min-w-0 flex-1 flex-col",
                children: [I, A],
              })),
              (q[45] = g),
              (q[46] = A),
              (q[47] = I),
              (q[48] = E))
            : (E = q[48]),
          q[49] !== E || q[50] !== j || q[51] !== P
            ? ((N = (0, n.jsxs)("div", { className: j, children: [P, E] })),
              (q[49] = E),
              (q[50] = j),
              (q[51] = P),
              (q[52] = N))
            : (N = q[52]),
          N
        );
      },
    ],
    41028,
  ),
    e.s([], 12641));
};
