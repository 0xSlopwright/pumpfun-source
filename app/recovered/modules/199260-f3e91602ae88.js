// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  r.exports = function () {
    if (
      "function" != typeof Symbol ||
      "function" != typeof Object.getOwnPropertySymbols
    )
      return !1;
    if ("symbol" == typeof Symbol.iterator) return !0;
    var t = {},
      r = Symbol("test"),
      e = Object(r);
    if (
      "string" == typeof r ||
      "[object Symbol]" !== Object.prototype.toString.call(r) ||
      "[object Symbol]" !== Object.prototype.toString.call(e)
    )
      return !1;
    for (var o in ((t[r] = 42), t)) return !1;
    if (
      ("function" == typeof Object.keys && 0 !== Object.keys(t).length) ||
      ("function" == typeof Object.getOwnPropertyNames &&
        0 !== Object.getOwnPropertyNames(t).length)
    )
      return !1;
    var n = Object.getOwnPropertySymbols(t);
    if (
      1 !== n.length ||
      n[0] !== r ||
      !Object.prototype.propertyIsEnumerable.call(t, r)
    )
      return !1;
    if ("function" == typeof Object.getOwnPropertyDescriptor) {
      var i = Object.getOwnPropertyDescriptor(t, r);
      if (42 !== i.value || !0 !== i.enumerable) return !1;
    }
    return !0;
  };
};
