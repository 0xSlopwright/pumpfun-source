// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(745018);
  e.i(12692);
  var a = e.i(398902),
    l = e.i(338319),
    i = e.i(606178),
    s = e.i(787773),
    o = e.i(51206);
  e.s([
    "f",
    0,
    function (e) {
      let c,
        d,
        u,
        f,
        h,
        m,
        b,
        x,
        p = (0, r.c)(27),
        {
          density: y,
          children: g,
          title: v,
          onRetry: w,
          action: j,
          className: _,
        } = e,
        { t: k } = (0, a.f)(),
        N = s.I[y],
        S = i.U[y];
      (p[0] !== _ || p[1] !== N || p[2] !== S
        ? ((c = (0, l.c)(s.k, N, S, _)),
          (p[0] = _),
          (p[1] = N),
          (p[2] = S),
          (p[3] = c))
        : (c = p[3]),
        p[4] !== y || p[5] !== v
          ? ((d = v
              ? (0, t.jsx)("p", { className: s.h[y], children: v })
              : null),
            (p[4] = y),
            (p[5] = v),
            (p[6] = d))
          : (d = p[6]));
      let B = s.Q[y];
      return (
        p[7] !== g || p[8] !== B
          ? ((u = (0, t.jsx)("p", { className: B, children: g })),
            (p[7] = g),
            (p[8] = B),
            (p[9] = u))
          : (u = p[9]),
        p[10] !== y || p[11] !== w || p[12] !== k
          ? ((f = w
              ? (0, t.jsx)(o._, {
                  density: y,
                  size: 24,
                  variant: "ghost",
                  "aria-label": k("common.retry"),
                  onClick: w,
                  children: (0, t.jsx)(n.k8, { "aria-hidden": !0 }),
                })
              : null),
            (p[10] = y),
            (p[11] = w),
            (p[12] = k),
            (p[13] = f))
          : (f = p[13]),
        p[14] !== u || p[15] !== f
          ? ((h = (0, t.jsxs)("div", {
              className: "flex items-center gap-1",
              children: [u, f],
            })),
            (p[14] = u),
            (p[15] = f),
            (p[16] = h))
          : (h = p[16]),
        p[17] !== d || p[18] !== h
          ? ((m = (0, t.jsxs)("div", {
              className: "flex flex-col items-center gap-1",
              children: [d, h],
            })),
            (p[17] = d),
            (p[18] = h),
            (p[19] = m))
          : (m = p[19]),
        p[20] !== j
          ? ((b = j
              ? (0, t.jsx)("div", {
                  className: "flex items-center justify-center",
                  children: j,
                })
              : null),
            (p[20] = j),
            (p[21] = b))
          : (b = p[21]),
        p[22] !== y || p[23] !== b || p[24] !== c || p[25] !== m
          ? ((x = (0, t.jsxs)("div", {
              role: "status",
              "data-density": y,
              "data-error-band": !0,
              className: c,
              children: [m, b],
            })),
            (p[22] = y),
            (p[23] = b),
            (p[24] = c),
            (p[25] = m),
            (p[26] = x))
          : (x = p[26]),
        x
      );
    },
  ]);
};
