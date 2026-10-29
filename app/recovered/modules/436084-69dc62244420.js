// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(129658),
    r = e.i(699238),
    i = e.i(732486);
  e.s([
    "TooltipProvider",
    0,
    function (e) {
      let { delay: o, closeDelay: l, timeout: a = 400 } = e,
        s = t.useMemo(() => ({ delay: o, closeDelay: l }), [o, l]),
        u = t.useMemo(() => ({ open: o, close: l }), [o, l]);
      return (0, i.jsx)(r.d.Provider, {
        value: s,
        children: (0, i.jsx)(n.Z, {
          delay: u,
          timeoutMs: a,
          children: e.children,
        }),
      });
    },
  ]);
};
