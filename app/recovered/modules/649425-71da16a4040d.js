// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(465085),
    i = e.i(786006),
    a = e.i(144629),
    n = e.i(352386);
  e.s([
    "f",
    0,
    function ({
      value: e,
      format: l = (e) => e.toLocaleString(),
      className: s = "",
      springConfig: o = { mass: 0.8, stiffness: 55, damping: 20 },
    }) {
      let c = (0, i.f)(e, o),
        m = (0, a.f)(c, l);
      return (
        (0, n.useEffect)(() => {
          c.set(e);
        }, [c, e]),
        (0, t.jsx)(r.f.span, {
          className: s,
          style: {
            display: "inline-block",
            textAlign: "right",
            whiteSpace: "nowrap",
          },
          children: m,
        })
      );
    },
  ]);
};
