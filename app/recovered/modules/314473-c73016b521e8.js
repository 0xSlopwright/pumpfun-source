// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(54403),
    i = e.i(544514);
  let a = "GTM-WPXVCX8X";
  e.s([
    "GoogleTagManagerLazy",
    0,
    function () {
      let e,
        s,
        o,
        l = (0, r.c)(4),
        c = (0, i.f)();
      return a && c
        ? (l[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = new URL(
                "https://www.googletagmanager.com/gtm.js",
              )).searchParams.set("id", a),
              (l[0] = e))
            : (e = l[0]),
          l[1] === Symbol.for("react.memo_cache_sentinel")
            ? ((s = (0, t.jsx)(n.default, {
                id: "_next-gtm-init",
                strategy: "lazyOnload",
                dangerouslySetInnerHTML: {
                  __html:
                    "(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');",
                },
              })),
              (l[1] = s))
            : (s = l[1]),
          l[2] !== e.href
            ? ((o = (0, t.jsxs)(t.Fragment, {
                children: [
                  s,
                  (0, t.jsx)(n.default, {
                    id: "_next-gtm",
                    "data-ntpc": "GTM",
                    src: e.href,
                    strategy: "lazyOnload",
                  }),
                ],
              })),
              (l[2] = e.href),
              (l[3] = o))
            : (o = l[3]),
          o)
        : null;
    },
  ]);
};
