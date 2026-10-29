// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  (Object.defineProperty(n, "__esModule", { value: !0 }),
    Object.defineProperty(n, "default", {
      enumerable: !0,
      get: function () {
        return a;
      },
    }));
  let r = e.r(836437)._(e.r(274282));
  function a(e, t) {
    let n = {};
    "function" == typeof e && (n.loader = e);
    let a = { ...n, ...t };
    return (0, r.default)({ ...a, modules: a.loadableGenerated?.modules });
  }
  ("function" == typeof n.default ||
    ("object" == typeof n.default && null !== n.default)) &&
    void 0 === n.default.__esModule &&
    (Object.defineProperty(n.default, "__esModule", { value: !0 }),
    Object.assign(n.default, n),
    (t.exports = n.default));
};
