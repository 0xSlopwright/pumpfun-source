// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var o = Object.prototype.toString;
  e.exports = function (t) {
    var e = o.call(t),
      r = "[object Arguments]" === e;
    return (
      r ||
        (r =
          "[object Array]" !== e &&
          null !== t &&
          "object" == typeof t &&
          "number" == typeof t.length &&
          t.length >= 0 &&
          "[object Function]" === o.call(t.callee)),
      r
    );
  };
};
