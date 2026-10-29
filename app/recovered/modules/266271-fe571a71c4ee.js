// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "createRenderSearchParamsFromClient", {
      enumerable: !0,
      get: function () {
        return u;
      },
    }));
  let n = new WeakMap();
  function u(e) {
    let t = n.get(e);
    if (t) return t;
    let a = Promise.resolve(e);
    return ((a.status = "fulfilled"), (a.value = e), n.set(e, a), a);
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
