// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(363855),
    r = e.i(27369),
    i = e.i(68585),
    o = e.i(998471),
    l = e.i(458649),
    a = e.i(732486);
  let s = t.forwardRef(function (e, t) {
    let { keepMounted: s = !1, ...u } = e,
      { store: c } = (0, i.x)(),
      d = c.useState("mounted"),
      f = c.useState("modal"),
      p = c.useState("open");
    return d || s
      ? (0, a.jsx)(o._.Provider, {
          value: s,
          children: (0, a.jsxs)(r.r, {
            ref: t,
            ...u,
            children: [
              d &&
                !0 === f &&
                (0, a.jsx)(l.f, {
                  ref: c.context.internalBackdropRef,
                  inert: (0, n.f)(!p),
                }),
              e.children,
            ],
          }),
        })
      : null;
  });
  e.s(["f", 0, s]);
};
