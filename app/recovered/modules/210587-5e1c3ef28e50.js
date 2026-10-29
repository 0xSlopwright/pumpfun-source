// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n, o;
  Object.defineProperty(r, "__esModule", { value: !0 });
  var u = {
    useDynamicRouteParams: function () {
      return n;
    },
    useDynamicSearchParams: function () {
      return o;
    },
  };
  for (var i in u) Object.defineProperty(r, i, { enumerable: !0, get: u[i] });
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
