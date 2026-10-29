// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t,
    n = new Set();
  e.s([
    "b",
    0,
    function () {
      return t;
    },
    "m",
    0,
    function (e) {
      if (t !== e) for (let r of ((t = e), n)) r(e);
    },
    "U",
    0,
    function (e) {
      return (
        n.add(e),
        () => {
          n.delete(e);
        }
      );
    },
  ]);
};
