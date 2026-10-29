// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(277146),
    n = t.r(818991),
    i = t.r(905408);
  r.exports = o
    ? function (t) {
        return o(t);
      }
    : n
      ? function (t) {
          if (!t || ("object" != typeof t && "function" != typeof t))
            throw TypeError("getProto: not an object");
          return n(t);
        }
      : i
        ? function (t) {
            return i(t);
          }
        : null;
};
