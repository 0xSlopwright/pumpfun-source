// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(338319),
    a = e.i(606178);
  let i =
      "flex shrink-0 items-center justify-between border-b border-border-secondary",
    o = { terminal: "h-8 gap-2", comfortable: "h-11 gap-3" },
    s = { terminal: "-mx-3 -mt-3", comfortable: "-mx-5 -mt-5" },
    l = {
      terminal:
        "min-w-0 truncate text-[13px] leading-4 font-medium text-text-primary",
      comfortable:
        "min-w-0 truncate text-sm leading-5 font-medium text-text-primary",
    },
    c = {
      terminal: "min-w-0 text-[13px] leading-4 font-medium text-text-primary",
      comfortable: "min-w-0 text-sm leading-5 font-medium text-text-primary",
    },
    u =
      "shrink-0 text-xs leading-4 font-normal text-text-quaternary tabular-nums";
  e.s([
    "o",
    0,
    u,
    "t",
    0,
    i,
    "f",
    0,
    s,
    "F",
    0,
    o,
    "s",
    0,
    l,
    "P",
    0,
    c,
    "_",
    0,
    function (e) {
      let d,
        f,
        p,
        m,
        g,
        h,
        y,
        b,
        x,
        v,
        w,
        _,
        z,
        k,
        S,
        A,
        P = (0, r.c)(34);
      P[0] !== e
        ? (({
            density: m,
            title: x,
            aside: f,
            action: d,
            bleed: h,
            titleAs: y,
            titleId: w,
            className: p,
            titleClassName: v,
            truncateTitle: b,
            ...g
          } = e),
          (P[0] = e),
          (P[1] = d),
          (P[2] = f),
          (P[3] = p),
          (P[4] = m),
          (P[5] = g),
          (P[6] = h),
          (P[7] = y),
          (P[8] = b),
          (P[9] = x),
          (P[10] = v),
          (P[11] = w))
        : ((d = P[1]),
          (f = P[2]),
          (p = P[3]),
          (m = P[4]),
          (g = P[5]),
          (h = P[6]),
          (y = P[7]),
          (b = P[8]),
          (x = P[9]),
          (v = P[10]),
          (w = P[11]));
      let j = void 0 !== h && h,
        E = void 0 === y ? "h2" : y,
        I = void 0 === b || b,
        T = o[m],
        O = a.U[m],
        C = j && s[m];
      P[12] !== p || P[13] !== T || P[14] !== O || P[15] !== C
        ? ((_ = (0, n.c)(i, T, O, C, p)),
          (P[12] = p),
          (P[13] = T),
          (P[14] = O),
          (P[15] = C),
          (P[16] = _))
        : (_ = P[16]);
      let N = I ? l[m] : c[m];
      return (
        P[17] !== N || P[18] !== v
          ? ((z = (0, n.c)(N, v)), (P[17] = N), (P[18] = v), (P[19] = z))
          : (z = P[19]),
        P[20] !== E || P[21] !== z || P[22] !== x || P[23] !== w
          ? ((k = (0, t.jsx)(E, { id: w, className: z, children: x })),
            (P[20] = E),
            (P[21] = z),
            (P[22] = x),
            (P[23] = w),
            (P[24] = k))
          : (k = P[24]),
        P[25] !== d || P[26] !== f
          ? ((S =
              f || d
                ? (0, t.jsxs)("div", {
                    className: "flex min-w-0 shrink-0 items-center gap-2",
                    children: [
                      f
                        ? (0, t.jsx)("span", { className: u, children: f })
                        : null,
                      d,
                    ],
                  })
                : null),
            (P[25] = d),
            (P[26] = f),
            (P[27] = S))
          : (S = P[27]),
        P[28] !== m || P[29] !== g || P[30] !== k || P[31] !== S || P[32] !== _
          ? ((A = (0, t.jsxs)("div", {
              ...g,
              "data-density": m,
              "data-title-band": !0,
              className: _,
              children: [k, S],
            })),
            (P[28] = m),
            (P[29] = g),
            (P[30] = k),
            (P[31] = S),
            (P[32] = _),
            (P[33] = A))
          : (A = P[33]),
        A
      );
    },
  ]);
};
