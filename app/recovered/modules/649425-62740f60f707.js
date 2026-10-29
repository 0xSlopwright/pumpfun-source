// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(465085),
    r = e.i(786006),
    n = e.i(144629),
    l = e.i(352386);
  e.s([
    "f",
    0,
    function ({
      value: e,
      format: a = (e) => e.toLocaleString(),
      className: s = "",
      springConfig: c = { mass: 0.8, stiffness: 55, damping: 20 },
    }) {
      let u = (0, r.f)(e, c),
        o = (0, n.f)(u, a);
      return (
        (0, l.useEffect)(() => {
          u.set(e);
        }, [u, e]),
        (0, t.jsx)(i.f.span, {
          className: s,
          style: {
            display: "inline-block",
            textAlign: "right",
            whiteSpace: "nowrap",
          },
          children: o,
        })
      );
    },
  ]);
};
