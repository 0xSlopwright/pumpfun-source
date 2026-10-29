// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n, o, u;
  Object.defineProperty(r, "__esModule", { value: !0 });
  var i = {
    actionAsyncStorage: function () {
      return n;
    },
    workAsyncStorage: function () {
      return o;
    },
    workUnitAsyncStorage: function () {
      return u;
    },
  };
  for (var a in i) Object.defineProperty(r, a, { enumerable: !0, get: i[a] });
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
