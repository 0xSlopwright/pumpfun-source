// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  function e(t, n) {
    return (e = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return ((t.__proto__ = e), t);
        })(t, n);
  }
  (t.s(
    [
      "f",
      0,
      function (t) {
        if (void 0 === t)
          throw ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return t;
      },
    ],
    208063,
  ),
    t.s(
      [
        "f",
        0,
        function (t, n) {
          ((t.prototype = Object.create(n.prototype)),
            (t.prototype.constructor = t),
            e(t, n));
        },
      ],
      854556,
    ));
};
