// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n(e) {
    if ("function" != typeof WeakMap) return null;
    var t = new WeakMap(),
      r = new WeakMap();
    return (n = function (e) {
      return e ? r : t;
    })(e);
  }
  r._ = function (e, t) {
    if (!t && e && e.__esModule) return e;
    if (null === e || ("object" != typeof e && "function" != typeof e))
      return { default: e };
    var r = n(t);
    if (r && r.has(e)) return r.get(e);
    var o = { __proto__: null },
      u = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var i in e)
      if ("default" !== i && Object.prototype.hasOwnProperty.call(e, i)) {
        var a = u ? Object.getOwnPropertyDescriptor(e, i) : null;
        a && (a.get || a.set) ? Object.defineProperty(o, i, a) : (o[i] = e[i]);
      }
    return ((o.default = e), r && r.set(e, o), o);
  };
};
