// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "ClientPageRoot", {
      enumerable: !0,
      get: function () {
        return o;
      },
    }));
  let n = e.r(732486),
    u = e.r(8001),
    r = e.r(352386),
    l = e.r(188294),
    s = e.r(201800),
    i = e.r(63533);
  function o({ Component: e, serverProvidedParams: t }) {
    let a, c;
    if (null !== t) ((a = t.searchParams), (c = t.params));
    else {
      let e = (0, r.use)(u.LayoutRouterContext);
      ((c = null !== e ? e.parentParams : {}),
        (a = (0, l.urlSearchParamsToParsedUrlQuery)(
          (0, r.use)(s.SearchParamsContext),
        )));
    }
    let d = (0, i.createClientSearchParams)(a),
      m = (0, i.createClientParams)(c);
    return (0, n.jsx)(e, { params: m, searchParams: d });
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
