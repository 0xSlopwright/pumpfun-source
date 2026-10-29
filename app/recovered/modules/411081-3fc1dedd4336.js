// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var n = {
    ReadonlyURLSearchParams: function () {
      return a.ReadonlyURLSearchParams;
    },
    RedirectType: function () {
      return d.RedirectType;
    },
    ServerInsertedHTMLContext: function () {
      return f.ServerInsertedHTMLContext;
    },
    forbidden: function () {
      return d.forbidden;
    },
    notFound: function () {
      return d.notFound;
    },
    permanentRedirect: function () {
      return d.permanentRedirect;
    },
    redirect: function () {
      return d.redirect;
    },
    unauthorized: function () {
      return d.unauthorized;
    },
    unstable_isUnrecognizedActionError: function () {
      return s.unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function () {
      return d.unstable_rethrow;
    },
    useParams: function () {
      return h;
    },
    usePathname: function () {
      return m;
    },
    useRouter: function () {
      return v;
    },
    useSearchParams: function () {
      return b;
    },
    useSelectedLayoutSegment: function () {
      return O;
    },
    useSelectedLayoutSegments: function () {
      return g;
    },
    useServerInsertedHTML: function () {
      return f.useServerInsertedHTML;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = e.r(56421)._(e.r(352386)),
    i = e.r(8001),
    a = e.r(201800),
    l = e.r(706957),
    c = e.r(210587),
    f = e.r(94239),
    s = e.r(210215),
    d = e.r(412195),
    {
      instrumentParamsForClientValidation: p,
      instrumentSearchParamsForClientValidation: y,
      expectCompleteParamsInClientValidation: _,
    } = e.r(548185);
  function b() {
    c.useDynamicSearchParams?.("useSearchParams()");
    let e = (0, u.useContext)(a.SearchParamsContext),
      t = (0, u.useMemo)(
        () => (e ? new a.ReadonlyURLSearchParams(e) : null),
        [e],
      );
    return "u" < typeof window && t ? y(t) : t;
  }
  function m() {
    c.useDynamicRouteParams?.("usePathname()");
    let e = (0, u.useContext)(a.PathnameContext);
    return ("u" < typeof window && e && _("usePathname()"), e);
  }
  function v() {
    let e = (0, u.useContext)(i.AppRouterContext);
    if (null === e) throw Error("invariant expected app router to be mounted");
    let t = (0, u.useContext)(i.LayoutRouterContext),
      r = t?.parentRenderTree.data.bfcacheId ?? 0;
    return (0, u.useMemo)(
      () => ({
        back: e.back,
        forward: e.forward,
        refresh: e.refresh,
        hmrRefresh: e.hmrRefresh,
        push: e.push,
        replace: e.replace,
        prefetch: e.prefetch,
        experimental_gesturePush: e.experimental_gesturePush,
        bfcacheId: "_b_" + r + "_",
      }),
      [e, r],
    );
  }
  function h() {
    c.useDynamicRouteParams?.("useParams()");
    let e = (0, u.useContext)(a.PathParamsContext);
    return "u" < typeof window && e ? p(e) : e;
  }
  function g(e = "children") {
    c.useDynamicRouteParams?.("useSelectedLayoutSegments()");
    let t = (0, u.useContext)(i.LayoutRouterContext);
    return t
      ? ("u" < typeof window && t && _("useSelectedLayoutSegments()"),
        (0, l.getSelectedLayoutSegmentPath)(t.parentTree, e))
      : null;
  }
  function O(e = "children") {
    (c.useDynamicRouteParams?.("useSelectedLayoutSegment()"),
      (0, u.useContext)(a.NavigationPromisesContext));
    let t = g(e);
    return (
      "u" < typeof window && _("useSelectedLayoutSegment()"),
      (0, l.computeSelectedLayoutSegment)(t, e)
    );
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
