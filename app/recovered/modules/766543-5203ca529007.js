// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (e.i(149502), Object.defineProperty(a, "__esModule", { value: !0 }));
  var n = {
    LoadingBoundaryProvider: function () {
      return x;
    },
    default: function () {
      return T;
    },
  };
  for (var u in n) Object.defineProperty(a, u, { enumerable: !0, get: n[u] });
  let r = e.r(56421),
    l = e.r(732486),
    s = r._(e.r(352386)),
    i = e.r(8001),
    o = e.r(616958),
    c = e.r(584995),
    d = e.r(269729),
    m = e.r(800069),
    f = e.r(346436),
    h = e.r(558365),
    b = e.r(32138),
    j = e.r(845736);
  e.r(58469);
  let p = e.r(201800),
    v = e.r(188294),
    y = e.r(944112);
  function g(e, t, a) {
    let n = e.getClientRects();
    if (0 === n.length) return 0;
    let u = 1 / 0;
    for (let e = 0; e < n.length; e++) {
      let t = n[e];
      t.top < u && (u = t.top);
    }
    return u >= a() && u <= t ? 1 : 2;
  }
  function k(e) {
    let t = s.default.useRef(null);
    return (
      (0, s.useLayoutEffect)(
        () => {
          let { scrollRef: a, renderTree: n } = e,
            u = a.forceScroll ? a.scrollRef : n.data.scrollRef;
          if (null === u || !u.current) return;
          let r = null,
            l = a.hashFragment;
          if (l) {
            if (
              null ===
              (r =
                "top" === l
                  ? document.body
                  : (document.getElementById(l) ??
                    document.getElementsByName(l)[0] ??
                    null))
            ) {
              ((u.current = !1),
                (a.onlyHashChange = !1),
                (a.hashFragment = null));
              return;
            }
          } else r = t.current;
          if (null === r) return;
          let s = !1;
          ((0, d.disableSmoothScrollDuringRouteTransition)(
            () => {
              let e = document.documentElement,
                t = null,
                a = null,
                n = null,
                i = () => {
                  var a;
                  let u, r;
                  return (
                    null === n &&
                      ((a = t),
                      (n =
                        !Number.isFinite(
                          (r = Number.parseFloat(
                            (u = getComputedStyle(e).scrollPaddingTop),
                          )),
                        ) || r < 0
                          ? 0
                          : u.endsWith("px")
                            ? r
                            : u.endsWith("%")
                              ? (r / 100) * a
                              : 0)),
                    n
                  );
                };
              (l || ((t = e.clientHeight), 0 !== (a = g(r, t, i)))) &&
                (((s = !0), (u.current = !1), l)
                  ? r.scrollIntoView()
                  : 1 !== a &&
                    ((e.scrollTop = 0),
                    2 === g(r, t, i) && r.scrollIntoView()));
            },
            { dontForceLayout: !0, onlyHashChange: a.onlyHashChange },
          ),
            s && ((a.onlyHashChange = !1), (a.hashFragment = null)));
        },
        void 0,
      ),
      (0, l.jsx)(s.Fragment, { ref: t, children: e.children })
    );
  }
  function _({ children: e, renderTree: t }) {
    let a = (0, s.useContext)(i.GlobalLayoutRouterContext);
    if (!a) throw Error("invariant global layout router not mounted");
    return (0, l.jsx)(k, {
      scrollRef: a.scrollRef,
      renderTree: t,
      children: e,
    });
  }
  function P({
    tree: e,
    segmentPath: t,
    debugNameContext: a,
    renderTree: n,
    params: u,
    url: r,
    isActive: c,
  }) {
    let d,
      m = (0, s.useContext)(i.GlobalLayoutRouterContext);
    if (((0, s.useContext)(p.NavigationPromisesContext), !m))
      throw Error("invariant global layout router not mounted");
    let f = null !== n.data.prefetchRsc ? n.data.prefetchRsc : n.data.rsc,
      h = (0, s.useDeferredValue)(n.data.rsc, f);
    if ((0, y.isDeferredRsc)(h)) {
      let e = (0, s.use)(h);
      (null === e && (0, s.use)(o.unresolvedThenable), (d = e));
    } else (null === h && (0, s.use)(o.unresolvedThenable), (d = h));
    let b = d;
    return (0, l.jsx)(i.LayoutRouterContext.Provider, {
      value: {
        parentTree: e,
        parentRenderTree: n,
        parentSegmentPath: t,
        parentParams: u,
        parentLoadingData: null,
        debugNameContext: a,
        url: r,
        isActive: c,
      },
      children: b,
    });
  }
  function x({ loading: e, children: t }) {
    let a = (0, s.use)(i.LayoutRouterContext);
    return null === a
      ? t
      : (0, l.jsx)(i.LayoutRouterContext.Provider, {
          value: {
            parentTree: a.parentTree,
            parentRenderTree: a.parentRenderTree,
            parentSegmentPath: a.parentSegmentPath,
            parentParams: a.parentParams,
            parentLoadingData: e,
            debugNameContext: a.debugNameContext,
            url: a.url,
            isActive: a.isActive,
          },
          children: t,
        });
  }
  function O({ name: e, loading: t, children: a }) {
    if (null !== t) {
      let n = t[0],
        u = t[1],
        r = t[2];
      return (0, l.jsx)(s.Suspense, {
        name: e,
        fallback: (0, l.jsxs)(l.Fragment, { children: [u, r, n] }),
        children: a,
      });
    }
    return (0, l.jsx)(l.Fragment, { children: a });
  }
  function T({
    parallelRouterKey: e,
    error: t,
    errorStyles: a,
    errorScripts: n,
    templateStyles: u,
    templateScripts: r,
    template: d,
    notFound: p,
    forbidden: y,
    unauthorized: g,
    segmentViewBoundaries: k,
  }) {
    let x = (0, s.useContext)(i.LayoutRouterContext);
    if (!x) throw Error("invariant expected layout router to be mounted");
    let {
        parentTree: C,
        parentRenderTree: M,
        parentSegmentPath: w,
        parentParams: R,
        parentLoadingData: S,
        url: F,
        isActive: z,
        debugNameContext: B,
      } = x,
      A = C[0],
      L = null === w ? [e] : w.concat([A, e]),
      E = C[1][e],
      H = M.slots?.get(e);
    (void 0 === E || void 0 === H) && (0, s.use)(o.unresolvedThenable);
    let q = null;
    "u" < typeof window && (q = (0, s.use)(h.InstantValidationBoundaryContext));
    let D = E[0],
      N = (0, b.createSegmentKey)(D),
      V = (0, j.useRouterBFCache)(E, H, N),
      I = [];
    do {
      let e = V.tree,
        o = V.renderTree,
        b = V.stateKey,
        j = e[0],
        k = R;
      if (Array.isArray(j)) {
        let e = j[0],
          t = j[1],
          a = j[2],
          n = (0, v.getParamValueFromCacheKey)(t, a);
        null !== n && (k = { ...R, [e]: n });
      }
      let x = (function (e) {
          if ("/" === e) return "/";
          if ("string" == typeof e)
            if ("(__SLOT__)" === e) return;
            else return e + "/";
          return e[1] + "/";
        })(j),
        T = x ?? B,
        C = void 0 === x ? void 0 : B,
        M = (0, l.jsxs)(_, {
          renderTree: o,
          children: [
            (0, l.jsx)(c.ErrorBoundary, {
              errorComponent: t,
              errorStyles: a,
              errorScripts: n,
              children: (0, l.jsx)(O, {
                name: C,
                loading: S,
                children: (0, l.jsx)(f.HTTPAccessFallbackBoundary, {
                  notFound: p,
                  forbidden: y,
                  unauthorized: g,
                  children: (0, l.jsxs)(m.RedirectBoundary, {
                    children: [
                      (0, l.jsx)(P, {
                        url: F,
                        tree: e,
                        params: k,
                        renderTree: o,
                        segmentPath: L,
                        debugNameContext: T,
                        isActive: z && b === N,
                      }),
                      null,
                    ],
                  }),
                }),
              }),
            }),
            null,
          ],
        });
      "u" < typeof window &&
        "string" == typeof q &&
        (M = (0, l.jsx)(h.RenderValidationBoundaryAtThisLevel, {
          id: q,
          children: M,
        }));
      let w = (0, l.jsxs)(
        i.TemplateContext.Provider,
        { value: M, children: [u, r, d] },
        b,
      );
      ((w = (0, l.jsx)(
        s.Activity,
        { name: C, mode: b === N ? "visible" : "hidden", children: w },
        b,
      )),
        I.push(w),
        (V = V.next));
    } while (null !== V);
    return I;
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
