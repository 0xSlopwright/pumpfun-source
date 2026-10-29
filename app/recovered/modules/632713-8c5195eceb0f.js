// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(516467);
  e.s([
    "f",
    0,
    function (e) {
      let n = (0, t.f)(e),
        a = new Date(
          Date.UTC(
            n.getFullYear(),
            n.getMonth(),
            n.getDate(),
            n.getHours(),
            n.getMinutes(),
            n.getSeconds(),
            n.getMilliseconds(),
          ),
        );
      return (a.setUTCFullYear(n.getFullYear()), e - a);
    },
  ]);
};
