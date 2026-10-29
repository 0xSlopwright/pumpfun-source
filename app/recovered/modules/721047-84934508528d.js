// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n, o, a, i;
  (e.i(149502),
    Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "hydrate", {
      enumerable: !0,
      get: function () {
        return k;
      },
    }));
  let l = e.r(836437),
    u = e.r(732486);
  e.r(662478);
  let d = l._(e.r(306991)),
    s = l._(e.r(352386)),
    c = e.r(925142),
    f = e.r(724243),
    p = e.r(252784),
    h = e.r(235360),
    _ = e.r(225599),
    y = e.r(730137),
    m = e.r(871512),
    b = l._(e.r(122270)),
    v = e.r(978615);
  e.r(8001);
  let w = e.r(71223),
    g = e.r(185457),
    E = e.r(107793),
    j = e.r(83289),
    P = c.createFromReadableStream,
    S = c.createFromFetch,
    R = document,
    x = self.__next_instant_test ? self.__next_instant_test : void 0,
    O = new TextEncoder(),
    M = !1,
    T = !1,
    N = null;
  function A(e) {
    if (0 === e[0]) a = [];
    else if (1 === e[0]) {
      if (!a) throw Error("Unexpected server data: missing bootstrap script.");
      i ? i.enqueue(O.encode(e[1])) : a.push(e[1]);
    } else if (2 === e[0]) N = e[1];
    else if (3 === e[0]) {
      if (!a) throw Error("Unexpected server data: missing bootstrap script.");
      let r = atob(e[1]),
        n = new Uint8Array(r.length);
      for (var t = 0; t < r.length; t++) n[t] = r.charCodeAt(t);
      i ? i.enqueue(n) : a.push(n);
    }
  }
  let C = function () {
    (i && !T && (i.close(), (T = !0), (a = void 0)), (M = !0));
  };
  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", C, !1)
    : setTimeout(C);
  let L = (self.__next_f = self.__next_f || []);
  (L.forEach(A), (L.length = 0), (L.push = A));
  let I = new ReadableStream({
      start(e) {
        (a &&
          (a.forEach((t) => {
            e.enqueue("string" == typeof t ? O.encode(t) : t);
          }),
          M && !T) &&
          (null === e.desiredSize || e.desiredSize < 0
            ? x ||
              e.error(
                Error(
                  "The connection to the page was unexpectedly closed, possibly due to the stop button being clicked, loss of Wi-Fi, or an unstable internet connection.",
                ),
              )
            : e.close(),
          (T = !0),
          (a = void 0)),
          (i = e));
      },
    }),
    U = null;
  {
    let [e, t] = I.tee();
    ((I = e), (U = t));
  }
  if (x)
    o = Promise.resolve(
      S(x, {
        callServer: _.callServer,
        findSourceMapURL: y.findSourceMapURL,
        debugChannel: n,
        unstable_allowPartialStream: !0,
      }),
    ).then(async (e) =>
      (0, w.createInitialRSCPayloadFromFallbackPrerender)(await x, e),
    );
  else if (window.__NEXT_CLIENT_RESUME) {
    let e = window.__NEXT_CLIENT_RESUME;
    o = Promise.resolve(
      S(e, {
        callServer: _.callServer,
        findSourceMapURL: y.findSourceMapURL,
        debugChannel: n,
      }),
    ).then(async (t) =>
      (0, w.createInitialRSCPayloadFromFallbackPrerender)(await e, t),
    );
  } else
    o = P(I, {
      callServer: _.callServer,
      findSourceMapURL: y.findSourceMapURL,
      debugChannel: n,
      startTime: 0,
    });
  function B({
    initialRSCPayload: e,
    actionQueue: t,
    webSocket: r,
    staticIndicatorState: n,
  }) {
    return (0, u.jsx)(b.default, {
      actionQueue: t,
      globalErrorState: e.G,
      webSocket: r,
      staticIndicatorState: n,
    });
  }
  let F = s.default.Fragment;
  function D({ children: e }) {
    return e;
  }
  let H = {
    onDefaultTransitionIndicator: function () {
      return () => {};
    },
    onRecoverableError: p.onRecoverableError,
    onCaughtError: h.onCaughtError,
    onUncaughtError: h.onUncaughtError,
  };
  async function k(e, t) {
    let r,
      n,
      a = await o;
    (a.b
      ? (0, E.setNavigationBuildId)(a.b)
      : (0, E.setNavigationBuildId)((0, g.getDeploymentId)()),
      (0, j.initializeRouterTransitionModules)(e));
    let i = Date.now(),
      l = (0, m.createMutableActionQueue)(
        (0, v.createInitialRouterState)({
          navigatedAt: i,
          initialRSCPayload: a,
          initialFlightStreamForCache: U,
          location: window.location,
        }),
      ),
      c = (0, u.jsx)(F, {
        children: (0, u.jsx)(f.HeadManagerContext.Provider, {
          value: { appDir: !0 },
          children: (0, u.jsx)(D, {
            children: (0, u.jsx)(B, {
              initialRSCPayload: a,
              actionQueue: l,
              webSocket: n,
              staticIndicatorState: r,
            }),
          }),
        }),
      });
    "__next_error__" === document.documentElement.id
      ? d.default.createRoot(R, H).render(c)
      : s.default.startTransition(() => {
          d.default.hydrateRoot(R, c, { ...H, formState: N });
        });
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
