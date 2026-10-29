// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  (Object.defineProperty(n, "__esModule", { value: !0 }),
    Object.defineProperty(n, "default", {
      enumerable: !0,
      get: function () {
        return u;
      },
    }));
  let r = e.r(732486),
    a = e.r(352386),
    i = e.r(254036),
    l = e.r(371904);
  function o(e) {
    return { default: e && "default" in e ? e.default : e };
  }
  let s = {
      loader: () => Promise.resolve(o(() => null)),
      loading: null,
      ssr: !0,
    },
    u = function (e) {
      let t = { ...s, ...e },
        n = (0, a.lazy)(() => t.loader().then(o)),
        u = t.loading;
      function c(e) {
        let o = u
            ? (0, r.jsx)(u, { isLoading: !0, pastDelay: !0, error: null })
            : null,
          s = !t.ssr || !!t.loading,
          c = s ? a.Suspense : a.Fragment,
          f = t.ssr
            ? (0, r.jsxs)(r.Fragment, {
                children: [
                  "u" < typeof window
                    ? (0, r.jsx)(l.PreloadChunks, { moduleIds: t.modules })
                    : null,
                  (0, r.jsx)(n, { ...e }),
                ],
              })
            : (0, r.jsx)(i.BailoutToCSRForNextDynamic, {
                children: (0, r.jsx)(n, { ...e }),
              });
        return (0, r.jsx)(c, { ...(s ? { fallback: o } : {}), children: f });
      }
      return ((c.displayName = "LoadableComponent"), c);
    };
};
