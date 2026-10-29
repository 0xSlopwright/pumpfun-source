// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(614758),
    r = e.i(833551),
    i = e.i(648585),
    o = e.i(115042);
  let l = t.forwardRef(function (e, t) {
    let { className: l, render: a, ...s } = e,
      u = (0, o.Z)().useState("instantType"),
      {
        open: c,
        arrowRef: d,
        side: f,
        align: p,
        arrowUncentered: g,
        arrowStyles: h,
      } = (0, n.d)();
    return (0, i.f)("div", e, {
      state: { open: c, side: f, align: p, uncentered: g, instant: u },
      ref: [t, d],
      props: [{ style: h, "aria-hidden": !0 }, s],
      stateAttributesMapping: r.E,
    });
  });
  e.s(["TooltipArrow", 0, l]);
};
