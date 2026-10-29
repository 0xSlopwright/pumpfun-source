// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n;
  var i =
    (e.e && e.e.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.GoogleAnalytics = function (e) {
      let {
        gaId: t,
        debugMode: r,
        dataLayerName: i = "dataLayer",
        nonce: l,
      } = e;
      return (
        void 0 === n && (n = i),
        (0, o.useEffect)(() => {
          performance.mark("mark_feature_usage", {
            detail: { feature: "next-third-parties-ga" },
          });
        }, []),
        (0, s.jsxs)(s.Fragment, {
          children: [
            (0, s.jsx)(a.default, {
              id: "_next-ga-init",
              dangerouslySetInnerHTML: {
                __html: `
          window['${i}'] = window['${i}'] || [];
          function gtag(){window['${i}'].push(arguments);}
          gtag('js', new Date());

          gtag('config', '${t}' ${r ? ",{ 'debug_mode': true }" : ""});`,
              },
              nonce: l,
            }),
            (0, s.jsx)(a.default, {
              id: "_next-ga",
              src: `https://www.googletagmanager.com/gtag/js?id=${t}`,
              nonce: l,
            }),
          ],
        })
      );
    }),
    (r.sendGAEvent = function () {
      void 0 === n
        ? console.warn("@next/third-parties: GA has not been initialized")
        : window[n]
          ? window[n].push(arguments)
          : console.warn(
              `@next/third-parties: GA dataLayer ${n} does not exist`,
            );
    }));
  let s = e.r(732486),
    o = e.r(352386),
    a = i(e.r(54403));
};
