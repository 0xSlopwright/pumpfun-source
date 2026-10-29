// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(426091),
    i = e.i(954644);
  e.i(84455);
  var a = e.i(242917);
  e.s([
    "B",
    0,
    "text-[12px] leading-4 text-text-error",
    "c",
    0,
    "text-[12px] leading-4 text-text-secondary",
    "L",
    0,
    "flex min-h-8 items-center gap-1.5 text-[12px] leading-4 text-text-quaternary",
    "F",
    0,
    function (e) {
      let s,
        o,
        l,
        c,
        u,
        d = (0, r.c)(14),
        { label: m, value: f, aside: p, tone: h, "data-testid": y } = e;
      d[0] !== m
        ? ((s = (0, t.jsx)("dt", { className: i.U, children: m })),
          (d[0] = m),
          (d[1] = s))
        : (s = d[1]);
      let b = "loss" === h && a.f.loss;
      return (
        d[2] !== b
          ? ((o = (0, n.c)(i.s, b)), (d[2] = b), (d[3] = o))
          : (o = d[3]),
        d[4] !== p
          ? ((l =
              null == p
                ? null
                : (0, t.jsxs)(t.Fragment, {
                    children: [
                      " ",
                      (0, t.jsx)("span", {
                        className: "font-normal text-text-quaternary",
                        children: p,
                      }),
                    ],
                  })),
            (d[4] = p),
            (d[5] = l))
          : (l = d[5]),
        d[6] !== o || d[7] !== l || d[8] !== f
          ? ((c = (0, t.jsxs)("dd", { className: o, children: [f, l] })),
            (d[6] = o),
            (d[7] = l),
            (d[8] = f),
            (d[9] = c))
          : (c = d[9]),
        d[10] !== s || d[11] !== c || d[12] !== y
          ? ((u = (0, t.jsxs)("div", {
              className: i.x,
              "data-testid": y,
              children: [s, c],
            })),
            (d[10] = s),
            (d[11] = c),
            (d[12] = y),
            (d[13] = u))
          : (u = d[13]),
        u
      );
    },
  ]);
};
