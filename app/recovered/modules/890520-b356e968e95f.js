// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386),
    n = e.i(719421);
  function i() {
    return (
      window.addEventListener("unhandledrejection", s),
      window.addEventListener("error", a),
      () => {
        (window.removeEventListener("unhandledrejection", s),
          window.removeEventListener("error", a));
      }
    );
  }
  function a(e) {
    (0, n.P)(e.error) && (0, n.m)("window-error");
  }
  function s(e) {
    (0, n.P)(e.reason) && (0, n.m)("unhandled-rejection");
  }
  e.s([
    "ChunkRecoveryListener",
    0,
    function () {
      let e,
        n = (0, t.c)(1);
      return (
        n[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = []), (n[0] = e))
          : (e = n[0]),
        (0, r.useEffect)(i, e),
        null
      );
    },
  ]);
};
