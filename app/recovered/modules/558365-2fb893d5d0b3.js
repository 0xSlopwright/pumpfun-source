// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  Object.defineProperty(a, "__esModule", { value: !0 });
  var n = {
    InstantValidationBoundaryContext: function () {
      return r.InstantValidationBoundaryContext;
    },
    PlaceValidationBoundaryBelowThisLevel: function () {
      return r.PlaceValidationBoundaryBelowThisLevel;
    },
    RenderValidationBoundaryAtThisLevel: function () {
      return r.RenderValidationBoundaryAtThisLevel;
    },
    SlotMarker: function () {
      return r.SlotMarker;
    },
  };
  for (var u in n) Object.defineProperty(a, u, { enumerable: !0, get: n[u] });
  let r = e.r(285072);
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
