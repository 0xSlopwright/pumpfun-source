// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var o = Array.prototype.slice,
    n = t.r(662831),
    c = Object.keys,
    l = c
      ? function (t) {
          return c(t);
        }
      : t.r(117247),
    i = Object.keys;
  ((l.shim = function () {
    return (
      Object.keys
        ? !(function () {
            var t = Object.keys(arguments);
            return t && t.length === arguments.length;
          })(1, 2) &&
          (Object.keys = function (t) {
            return n(t) ? i(o.call(t)) : i(t);
          })
        : (Object.keys = l),
      Object.keys || l
    );
  }),
    (e.exports = l));
};
