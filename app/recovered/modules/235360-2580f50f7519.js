// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var n = {
    onCaughtError: function () {
      return f;
    },
    onUncaughtError: function () {
      return p;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let a = e.r(836437),
    i = e.r(684679),
    l = e.r(443256),
    u = e.r(951758),
    d = e.r(584995),
    s = a._(e.r(826199)),
    c = {
      decorateDevError: (e) => e,
      handleClientError: () => {},
      originConsoleError: console.error.bind(console),
    };
  function f(e, t) {
    let r,
      n,
      o = t.errorBoundary?.constructor;
    if (
      (r =
        r ||
        (o === d.ErrorBoundaryHandler &&
          t.errorBoundary.props.errorComponent === s.default))
    )
      return h(e, n);
    (0, l.isBailoutToCSRError)(e) ||
      (0, i.isNextRouterError)(e) ||
      c.originConsoleError(e);
  }
  function p(e) {
    h(e);
  }
  function h(e, t) {
    (0, l.isBailoutToCSRError)(e) ||
      (0, i.isNextRouterError)(e) ||
      (0, u.reportGlobalError)(e);
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
