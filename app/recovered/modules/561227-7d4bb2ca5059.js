// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.r(35305);
  function a() {}
  function i() {}
  ((i.resetWarningCache = a),
    (t.exports = function () {
      function e(e, t, r, a, i, o) {
        if (o !== n) {
          var s = Error(
            "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
          );
          throw ((s.name = "Invariant Violation"), s);
        }
      }
      function t() {
        return e;
      }
      e.isRequired = e;
      var r = {
        array: e,
        bigint: e,
        bool: e,
        func: e,
        number: e,
        object: e,
        string: e,
        symbol: e,
        any: e,
        arrayOf: t,
        element: e,
        elementType: e,
        instanceOf: t,
        node: e,
        objectOf: t,
        oneOf: t,
        oneOfType: t,
        shape: t,
        exact: t,
        checkPropTypes: i,
        resetWarningCache: a,
      };
      return ((r.PropTypes = r), r);
    }));
};
