// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(393155),
    n = function () {
      return !!o;
    };
  ((n.hasArrayLengthDefineBug = function () {
    if (!o) return null;
    try {
      return 1 !== o([], "length", { value: 1 }).length;
    } catch (t) {
      return !0;
    }
  }),
    (r.exports = n));
};
