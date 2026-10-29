// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n =
    (e.e && e.e.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.sendGTMEvent = void 0),
    (r.GoogleTagManager = function (e) {
      let {
        gtmId: t,
        gtmScriptUrl: r,
        dataLayerName: n = "dataLayer",
        auth: l,
        preview: f,
        dataLayer: u,
        nonce: c,
      } = e;
      a = n;
      let d = new URL(r || "https://www.googletagmanager.com/gtm.js");
      return (
        t && d.searchParams.set("id", t),
        "dataLayer" !== n && d.searchParams.set("l", n),
        l && d.searchParams.set("gtm_auth", l),
        f &&
          (d.searchParams.set("gtm_preview", f),
          d.searchParams.set("gtm_cookies_win", "x")),
        (0, s.useEffect)(() => {
          performance.mark("mark_feature_usage", {
            detail: { feature: "next-third-parties-gtm" },
          });
        }, []),
        (0, i.jsxs)(i.Fragment, {
          children: [
            (0, i.jsx)(o.default, {
              id: "_next-gtm-init",
              dangerouslySetInnerHTML: {
                __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${u ? `w[l].push(${JSON.stringify(u)})` : ""}
      })(window,'${n}');`,
              },
              nonce: c,
            }),
            (0, i.jsx)(o.default, {
              id: "_next-gtm",
              "data-ntpc": "GTM",
              src: d.href,
              nonce: c,
            }),
          ],
        })
      );
    }));
  let i = e.r(732486),
    s = e.r(352386),
    o = n(e.r(54403)),
    a = "dataLayer";
  r.sendGTMEvent = (e, t) => {
    let r = t || a;
    ((window[r] = window[r] || []), window[r].push(e));
  };
};
