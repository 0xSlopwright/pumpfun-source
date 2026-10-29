// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  let i = t.r(539451).v4;
  e.exports = function (t, e, r, n) {
    if ("string" != typeof t) throw TypeError(t + " must be a string");
    let s = "number" == typeof (n = n || {}).version ? n.version : 2;
    if (1 !== s && 2 !== s) throw TypeError(s + " must be 1 or 2");
    let o = { method: t };
    if ((2 === s && (o.jsonrpc = "2.0"), e)) {
      if ("object" != typeof e && !Array.isArray(e))
        throw TypeError(e + " must be an object, array or omitted");
      o.params = e;
    }
    return (
      void 0 === r
        ? (o.id = (
            "function" == typeof n.generator
              ? n.generator
              : function () {
                  return i();
                }
          )(o, n))
        : 2 === s && null === r
          ? n.notificationIdNull && (o.id = null)
          : (o.id = r),
      o
    );
  };
};
