// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "createInitialRouterState", {
      enumerable: !0,
      get: function () {
        return f;
      },
    }));
  let n = e.r(790661),
    o = e.r(220605),
    a = e.r(136305),
    i = e.r(944112),
    l = e.r(85396),
    u = e.r(260239),
    d = e.r(581761),
    s = e.r(581131),
    c = e.r(994260);
  function f({
    navigatedAt: e,
    initialRSCPayload: t,
    initialFlightStreamForCache: r,
    location: p,
  }) {
    let { c: h, t: _, q: y, i: m, S: b, s: v, l: w, r: g, p: E, d: j } = t,
      P = h.join("/"),
      S = (0, a.transportNodeToFlightRouterState)(_.t, y),
      R = p ? (0, n.createHrefFromUrl)(p) : P,
      x = (0, u.createNavigationSeed)(
        e,
        null,
        _,
        null,
        !0,
        null,
        y,
        null,
        j ?? d.UnknownDynamicStaleTime,
      ),
      O = x.root,
      M = (0, i.createInitialRenderTreeForHydration)(e, O, x.dynamicStaleAt);
    return (
      null !== p &&
        ((0, c.discoverKnownRoute)(
          Date.now(),
          p.pathname,
          p.search,
          null,
          null,
          O,
          m,
          R,
          x.renderedSearch,
          b,
          !1,
        ),
        void 0 !== v
          ? void 0 !== w && null != r
            ? Promise.resolve(w)
                .then(async (e) => {
                  if (0 === e) return void r.cancel();
                  let t = await (0, s.decodeStageUntilBoundary)(r, e, void 0);
                  null !== t &&
                    (0, l.spawnStaticStageCacheWrite)(
                      Date.now(),
                      t,
                      !0,
                      null,
                      S,
                      y,
                      l.segmentCacheMap,
                    );
                })
                .catch(() => {})
            : ((0, l.spawnStaticStageCacheWrite)(
                Date.now(),
                { t: _, r: g, s: v },
                !1,
                null,
                S,
                y,
                l.segmentCacheMap,
              ),
              r?.cancel())
          : r?.cancel(),
        null != E &&
          (0, l.writeRuntimePrefetchStreamIntoCache)(
            Date.now(),
            E,
            S,
            y,
            l.segmentCacheMap,
          ).catch(() => {})),
      {
        tree: M.tree.route,
        root: (0, l.createRootRouteTree)(M.tree.node, M.head.node),
        pushRef: {
          pendingPush: !1,
          mpaNavigation: !1,
          preserveCustomHistoryState: !0,
        },
        scrollRef: {
          scrollRef: null,
          forceScroll: !1,
          onlyHashChange: !1,
          hashFragment: null,
        },
        canonicalUrl: R,
        renderedSearch: y,
        nextUrl:
          ((0, o.extractPathFromFlightRouterState)(S) || p?.pathname) ?? null,
        previousNextUrl: null,
        debugInfo: null,
      }
    );
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
