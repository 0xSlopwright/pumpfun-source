// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502),
    Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "default", {
      enumerable: !0,
      get: function () {
        return B;
      },
    }));
  let n = e.r(836437),
    o = e.r(56421),
    a = e.r(732486),
    i = o._(e.r(352386)),
    l = e.r(8001),
    u = e.r(790661),
    d = e.r(32138),
    s = e.r(201800),
    c = e.r(212835),
    f = e.r(449030),
    p = e.r(689624),
    h = e.r(800069),
    _ = e.r(616958),
    y = e.r(461172),
    m = e.r(948866),
    b = e.r(220605),
    v = e.r(60106),
    w = e.r(871512),
    g = e.r(311134),
    E = e.r(46485),
    j = e.r(601331),
    P = e.r(360601),
    S = n._(e.r(505552)),
    R = n._(e.r(826199)),
    x = e.r(535841);
  e.r(185457);
  let O = {};
  function M() {
    if (void 0 === window.navigation) return !1;
    let e = window.navigation.activation?.entry,
      t = window.navigation.currentEntry;
    return (
      null != e &&
      null != t &&
      e.key !== t.key &&
      window.history.state?.__NA === !0
    );
  }
  let T = !1,
    N = !1;
  function A(e) {
    if (e) {
      if (!e.__NA) return void window.location.reload();
      (0, g.traverse)(window.location.href, e.__PRIVATE_NEXTJS_INTERNALS_TREE);
    }
  }
  function C({ appRouterState: e }) {
    return (
      (0, i.useInsertionEffect)(() => {
        let { tree: t, pushRef: r, canonicalUrl: n, renderedSearch: o } = e;
        if (!T && ((T = !0), M())) return void (0, f.setLastCommittedTree)(t);
        let a = {
          ...(r.preserveCustomHistoryState ? window.history.state : {}),
          __NA: !0,
          __PRIVATE_NEXTJS_INTERNALS_TREE: { tree: t, renderedSearch: o },
        };
        (r.pendingPush &&
        (0, u.createHrefFromUrl)(new URL(window.location.href)) !== n
          ? ((r.pendingPush = !1), window.history.pushState(a, "", n))
          : window.history.replaceState(a, "", n),
          (0, f.setLastCommittedTree)(t));
      }, [e]),
      (0, i.useEffect)(() => {
        (0, P.pingVisibleLinks)(e.nextUrl, e.root);
      }, [e.nextUrl, e.root]),
      null
    );
  }
  function L(e) {
    null == e && (e = {});
    let t = window.history.state,
      r = t?.__NA;
    r && (e.__NA = r);
    let n = t?.__PRIVATE_NEXTJS_INTERNALS_TREE;
    return (n && (e.__PRIVATE_NEXTJS_INTERNALS_TREE = n), e);
  }
  function I({ headRenderTree: e }) {
    let t = e.data.rsc,
      r = e.data.prefetchRsc,
      n = null !== r ? r : t;
    return (0, i.useDeferredValue)(t, n);
  }
  function U({
    actionQueue: e,
    globalError: t,
    webSocket: r,
    staticIndicatorState: n,
  }) {
    let o = (0, c.useActionQueue)(e),
      { canonicalUrl: u } = o,
      { searchParams: f, pathname: v } = (0, i.useMemo)(() => {
        let e = new URL(
          u,
          "u" < typeof window ? "http://n" : window.location.href,
        );
        return {
          searchParams: e.searchParams,
          pathname: (0, m.hasBasePath)(e.pathname)
            ? (0, y.removeBasePath)(e.pathname)
            : e.pathname,
        };
      }, [u]);
    ((0, i.useEffect)(() => {
      let e = (0, b.extractSourcePageFromFlightRouterState)(o.tree);
      void 0 !== e
        ? (window.next.__internal_src_page = e)
        : delete window.next.__internal_src_page;
    }, [o.tree]),
      (0, i.useEffect)(() => {
        function e(e) {
          e.persisted &&
            window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE &&
            ((O.pendingMpaPath = void 0),
            (0, g.restore)(
              new URL(window.location.href),
              window.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE,
            ));
        }
        return (
          window.addEventListener("pageshow", e),
          () => {
            window.removeEventListener("pageshow", e);
          }
        );
      }, []),
      (0, i.useEffect)(() => {
        function e(e) {
          let t = "reason" in e ? e.reason : e.error;
          if ((0, j.isRedirectError)(t)) {
            e.preventDefault();
            let r = (0, E.getURLFromRedirectError)(t);
            "push" === (0, E.getRedirectTypeFromError)(t)
              ? w.publicAppRouterInstance.push(r, {})
              : w.publicAppRouterInstance.replace(r, {});
          }
        }
        return (
          window.addEventListener("error", e),
          window.addEventListener("unhandledrejection", e),
          () => {
            (window.removeEventListener("error", e),
              window.removeEventListener("unhandledrejection", e));
          }
        );
      }, []));
    let { pushRef: P } = o;
    if (P.mpaNavigation) {
      if (O.pendingMpaPath !== u) {
        let e = window.location;
        (P.pendingPush ? e.assign(u) : e.replace(u), (O.pendingMpaPath = u));
      }
      throw _.unresolvedThenable;
    }
    (0, i.useEffect)(() => {
      let e = window.history.pushState.bind(window.history),
        t = window.history.replaceState.bind(window.history),
        r = (e) => {
          let t = window.location.href,
            r = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE;
          (0, g.restore)(new URL(e ?? t, t), r);
        };
      ((window.history.pushState = function (t, n, o) {
        return (t?.__NA || t?._N || ((t = L(t)), o && r(o)), e(t, n, o));
      }),
        (window.history.replaceState = function (e, n, o) {
          return (e?.__NA || e?._N || ((e = L(e)), o && r(o)), t(e, n, o));
        }));
      let n = (e) => A(e.state);
      return (
        window.addEventListener("popstate", n),
        !N && ((N = !0), M() && A(window.history.state)),
        () => {
          ((window.history.pushState = e),
            (window.history.replaceState = t),
            window.removeEventListener("popstate", n));
        }
      );
    }, []);
    let { root: R, tree: T, nextUrl: B, scrollRef: F, previousNextUrl: D } = o,
      H = (0, i.useMemo)(() => (0, b.getSelectedParams)(T), [T]),
      k = (0, i.useMemo)(
        () => ({
          parentTree: T,
          parentRenderTree: R.tree,
          parentSegmentPath: null,
          parentParams: {},
          parentLoadingData: null,
          debugNameContext: "/",
          url: u,
          isActive: !0,
        }),
        [T, R, u],
      ),
      X = (0, i.useMemo)(
        () => ({ tree: T, scrollRef: F, nextUrl: B, previousNextUrl: D }),
        [T, F, B, D],
      ),
      V = (0, a.jsx)(
        I,
        { headRenderTree: R.head },
        (0, d.createHeadKey)(R.head.varyPath),
      ),
      J = (0, a.jsxs)(h.RedirectBoundary, {
        children: [
          V,
          (0, a.jsx)(x.RootLayoutBoundary, { children: R.tree.data.rsc }),
          (0, a.jsx)(p.AppRouterAnnouncer, { tree: T }),
        ],
      });
    return (
      (J = (0, a.jsx)(S.default, {
        errorComponent: t[0],
        errorStyles: t[1],
        children: J,
      })),
      (0, a.jsxs)(a.Fragment, {
        children: [
          (0, a.jsx)(C, { appRouterState: o }),
          null,
          (0, a.jsx)(s.NavigationPromisesContext.Provider, {
            value: null,
            children: (0, a.jsx)(s.PathParamsContext.Provider, {
              value: H,
              children: (0, a.jsx)(s.PathnameContext.Provider, {
                value: v,
                children: (0, a.jsx)(s.SearchParamsContext.Provider, {
                  value: f,
                  children: (0, a.jsx)(l.GlobalLayoutRouterContext.Provider, {
                    value: X,
                    children: (0, a.jsx)(l.AppRouterContext.Provider, {
                      value: w.publicAppRouterInstance,
                      children: (0, a.jsx)(l.LayoutRouterContext.Provider, {
                        value: k,
                        children: J,
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        ],
      })
    );
  }
  function B({
    actionQueue: e,
    globalErrorState: t,
    webSocket: r,
    staticIndicatorState: n,
  }) {
    (0, v.useNavFailureHandler)();
    let o = (0, a.jsx)(U, {
      actionQueue: e,
      globalError: t,
      webSocket: r,
      staticIndicatorState: n,
    });
    return (0, a.jsx)(S.default, { errorComponent: R.default, children: o });
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
