// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e) {
      let t = { formatters: void 0, fees: void 0, serializers: void 0, ...e };
      return Object.assign(t, {
        extend: (function e(t) {
          return (i) => {
            let f = "function" == typeof i ? i(t) : i,
              s = { ...t, ...f };
            return Object.assign(s, { extend: e(s) });
          };
        })(t),
      });
    },
  ]);
};
