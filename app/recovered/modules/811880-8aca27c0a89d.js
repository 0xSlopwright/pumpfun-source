// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = "u" > typeof Symbol && Symbol,
    n = t.r(199260);
  r.exports = function () {
    return (
      "function" == typeof o &&
      "function" == typeof Symbol &&
      "symbol" == typeof o("foo") &&
      "symbol" == typeof Symbol("bar") &&
      n()
    );
  };
};
