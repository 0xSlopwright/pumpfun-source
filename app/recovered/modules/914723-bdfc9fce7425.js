// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "ClientSegmentRoot", {
      enumerable: !0,
      get: function () {
        return s;
      },
    }));
  let n = e.r(732486),
    u = e.r(8001),
    r = e.r(352386),
    l = e.r(63533);
  function s({ Component: e, slots: t, serverProvidedParams: a }) {
    let i;
    if (null !== a) i = a.params;
    else {
      let e = (0, r.use)(u.LayoutRouterContext);
      i = null !== e ? e.parentParams : {};
    }
    let o = (0, l.createClientParams)(i);
    return (0, n.jsx)(e, { ...t, params: o });
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
