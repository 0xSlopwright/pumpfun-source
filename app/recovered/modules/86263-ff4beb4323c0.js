// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(68585),
    r = e.i(648585),
    i = e.i(833551),
    o = e.i(810954);
  let l = { ...i.E, ...o.T },
    a = t.forwardRef(function (e, t) {
      let { render: i, className: o, forceRender: a = !1, ...s } = e,
        { store: u } = (0, n.x)(),
        c = u.useState("open"),
        d = u.useState("nested"),
        f = u.useState("mounted"),
        p = u.useState("transitionStatus");
      return (0, r.f)("div", e, {
        state: { open: c, transitionStatus: p },
        ref: [u.context.backdropRef, t],
        stateAttributesMapping: l,
        props: [
          {
            role: "presentation",
            hidden: !f,
            style: { userSelect: "none", WebkitUserSelect: "none" },
          },
          s,
        ],
        enabled: a || !d,
      });
    });
  e.s(["f", 0, a]);
};
