// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(68585),
    r = e.i(648585),
    i = e.i(833551),
    o = e.i(810954),
    l = e.i(611960),
    a = e.i(264150);
  let s = { ...i.E, ...o.T },
    u = t.forwardRef(function (e, t) {
      let { render: i, className: o, forceRender: u = !1, ...c } = e,
        { store: d } = (0, n.x)(),
        f = d.useState("open"),
        p = d.useState("nested"),
        g = d.useState("mounted"),
        h = d.useState("transitionStatus");
      return (0, r.f)("div", e, {
        state: { open: f, transitionStatus: h },
        ref: [d.context.backdropRef, t],
        stateAttributesMapping: s,
        props: [
          {
            role: "presentation",
            hidden: !g,
            style: {
              pointerEvents: f ? void 0 : "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              [a.f.swipeProgress]: "0",
              [l.f.swipeStrength]: "1",
            },
          },
          c,
        ],
        enabled: u || !p,
      });
    });
  e.s(["DrawerBackdrop", 0, u]);
};
