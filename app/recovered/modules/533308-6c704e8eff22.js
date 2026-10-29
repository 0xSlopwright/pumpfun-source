// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(393155),
    n = t.r(26857),
    i = t.r(231473),
    a = t.r(83585);
  r.exports = function (t, r, e) {
    if (!t || ("object" != typeof t && "function" != typeof t))
      throw new i("`obj` must be an object or a function`");
    if ("string" != typeof r && "symbol" != typeof r)
      throw new i("`property` must be a string or a symbol`");
    if (
      arguments.length > 3 &&
      "boolean" != typeof arguments[3] &&
      null !== arguments[3]
    )
      throw new i("`nonEnumerable`, if provided, must be a boolean or null");
    if (
      arguments.length > 4 &&
      "boolean" != typeof arguments[4] &&
      null !== arguments[4]
    )
      throw new i("`nonWritable`, if provided, must be a boolean or null");
    if (
      arguments.length > 5 &&
      "boolean" != typeof arguments[5] &&
      null !== arguments[5]
    )
      throw new i("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && "boolean" != typeof arguments[6])
      throw new i("`loose`, if provided, must be a boolean");
    var u = arguments.length > 3 ? arguments[3] : null,
      p = arguments.length > 4 ? arguments[4] : null,
      y = arguments.length > 5 ? arguments[5] : null,
      c = arguments.length > 6 && arguments[6],
      f = !!a && a(t, r);
    if (o)
      o(t, r, {
        configurable: null === y && f ? f.configurable : !y,
        enumerable: null === u && f ? f.enumerable : !u,
        value: e,
        writable: null === p && f ? f.writable : !p,
      });
    else if (!c && (u || p || y))
      throw new n(
        "This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.",
      );
    else t[r] = e;
  };
};
