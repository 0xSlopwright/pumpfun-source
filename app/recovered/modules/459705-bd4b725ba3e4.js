// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(964355),
    i = e.i(352386),
    r = e.i(144685),
    n = e.i(1807);
  e.s([
    "f",
    0,
    function (e) {
      let l = (0, n.f)(() => (0, t.o)(e)),
        { isStatic: a } = (0, i.useContext)(r.f);
      if (a) {
        let [, t] = (0, i.useState)(e);
        (0, i.useEffect)(() => l.on("change", t), []);
      }
      return l;
    },
  ]);
};
