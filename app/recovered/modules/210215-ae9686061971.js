// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    UnrecognizedActionError: function () {
      return u;
    },
    unstable_isUnrecognizedActionError: function () {
      return i;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  class u extends Error {
    constructor(...e) {
      (super(...e), (this.name = "UnrecognizedActionError"));
    }
  }
  function i(e) {
    return !!(e && "object" == typeof e && e instanceof u);
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
