// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "unstable_rethrow", {
      enumerable: !0,
      get: function () {
        return function e(t) {
          if ((0, o.isNextRouterError)(t) || (0, n.isBailoutToCSRError)(t))
            throw t;
          t instanceof Error && "cause" in t && e(t.cause);
        };
      },
    }));
  let n = e.r(443256),
    o = e.r(684679);
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
