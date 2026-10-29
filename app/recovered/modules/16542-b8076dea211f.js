// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(203350),
    n = e.i(352386),
    i = e.i(806846),
    a = e.i(595673);
  function s() {
    ((0, r.g)(i.j), (0, i.i)().then(o), (0, a.B2)());
  }
  function o(e) {
    e && (0, r.R)(e);
  }
  e.s([
    "default",
    0,
    function () {
      let e,
        r = (0, t.c)(1);
      return (
        r[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = []), (r[0] = e))
          : (e = r[0]),
        (0, n.useEffect)(s, e),
        null
      );
    },
  ]);
};
