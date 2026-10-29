// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(948163)(),
    n = t.r(795081)("Object.prototype.toString"),
    i = function (t) {
      return (
        (!o || !t || "object" != typeof t || !(Symbol.toStringTag in t)) &&
        "[object Arguments]" === n(t)
      );
    },
    a = function (t) {
      return (
        !!i(t) ||
        (null !== t &&
          "object" == typeof t &&
          "length" in t &&
          "number" == typeof t.length &&
          t.length >= 0 &&
          "[object Array]" !== n(t) &&
          "callee" in t &&
          "[object Function]" === n(t.callee))
      );
    },
    u = (function () {
      return i(arguments);
    })();
  ((i.isLegacyArguments = a), (r.exports = u ? i : a));
};
