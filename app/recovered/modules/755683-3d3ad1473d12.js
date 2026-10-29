// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(115042),
    r = e.i(552840),
    i = e.i(231332),
    o = e.i(27369),
    l = e.i(732486);
  let a = t.forwardRef(function (e, n) {
    let { children: r, container: a, className: s, render: u, ...c } = e,
      { portalNode: d, portalSubtree: f } = (0, o.o)({
        container: a,
        ref: n,
        componentProps: e,
        elementProps: c,
      });
    return f || d
      ? (0, l.jsxs)(t.Fragment, { children: [f, d && i.createPortal(r, d)] })
      : null;
  });
  e.s(["f", 0, a], 873425);
  let s = t.forwardRef(function (e, t) {
    let { keepMounted: i = !1, ...o } = e;
    return (0, n.Z)().useState("mounted") || i
      ? (0, l.jsx)(r.b.Provider, {
          value: i,
          children: (0, l.jsx)(a, { ref: t, ...o }),
        })
      : null;
  });
  e.s(["TooltipPortal", 0, s], 755683);
};
