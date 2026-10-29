// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "default", {
      enumerable: !0,
      get: function () {
        return d;
      },
    }));
  let n = e.r(836437),
    o = e.r(732486);
  e.r(352386);
  let a = n._(e.r(260500)),
    i = e.r(584995),
    l = e.r(200829),
    u = "u" > typeof window && (0, l.isBot)(window.navigator.userAgent);
  function d({
    children: e,
    errorComponent: t,
    errorStyles: r,
    errorScripts: n,
  }) {
    return u
      ? (0, o.jsx)(a.default, { children: e })
      : (0, o.jsx)(i.ErrorBoundary, {
          errorComponent: t,
          errorStyles: r,
          errorScripts: n,
          children: e,
        });
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
