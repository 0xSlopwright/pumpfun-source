// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "isNextRouterError", {
      enumerable: !0,
      get: function () {
        return u;
      },
    }));
  let n = e.r(835932),
    o = e.r(601331);
  function u(e) {
    return (0, o.isRedirectError)(e) || (0, n.isHTTPAccessFallbackError)(e);
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
