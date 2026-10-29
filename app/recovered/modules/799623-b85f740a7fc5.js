// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.i(149502);
  function i() {
    return (
      "u" < typeof document &&
      "u" > typeof navigator &&
      "ReactNative" === navigator.product
    );
  }
  function o() {
    return (
      void 0 !== n.default &&
      void 0 !== n.default.versions &&
      void 0 !== n.default.versions.node
    );
  }
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.isBrowser = r.isNode = r.isReactNative = void 0),
    (r.isReactNative = i),
    (r.isNode = o),
    (r.isBrowser = function () {
      return !i() && !o();
    }));
};
