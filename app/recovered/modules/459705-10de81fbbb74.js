// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(964355),
    r = e.i(352386),
    i = e.i(144685),
    a = e.i(1807);
  e.s([
    "f",
    0,
    function (e) {
      let n = (0, a.f)(() => (0, t.o)(e)),
        { isStatic: l } = (0, r.useContext)(i.f);
      if (l) {
        let [, t] = (0, r.useState)(e);
        (0, r.useEffect)(() => n.on("change", t), []);
      }
      return n;
    },
  ]);
};
