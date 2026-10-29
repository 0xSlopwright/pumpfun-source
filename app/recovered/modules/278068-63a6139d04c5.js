// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    getObjectClassLabel: function () {
      return a;
    },
    isPlainObject: function () {
      return i;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  function a(e) {
    return Object.prototype.toString.call(e);
  }
  function i(e) {
    if ("[object Object]" !== a(e)) return !1;
    let t = Object.getPrototypeOf(e);
    return null === t || t.hasOwnProperty("isPrototypeOf");
  }
};
