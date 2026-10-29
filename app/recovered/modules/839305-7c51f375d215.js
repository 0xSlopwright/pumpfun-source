// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(745018);
  e.i(12692);
  var l = e.i(117466),
    r = e.i(63289),
    i = e.i(506486);
  e.s([
    "f",
    0,
    function ({ symbol: e, href: n, t: o }) {
      let s = e ? `$${e}` : o("web.callouts.coin_fallback");
      r.c.custom(
        (e) =>
          (0, t.jsx)(i.O, {
            tone: "neutral",
            testId: "callout-created-toast",
            ariaLabel: o("web.callouts.toast_posted_a11y"),
            onDismiss: () => r.c.dismiss(e),
            glyph: (0, t.jsx)(a.EX, {}),
            title: (0, t.jsx)(l.f, {
              t: o,
              i18nKey: "web.callouts.toast_posted_title",
              values: { coin: s },
              components: { accent: (0, t.jsx)("span", {}) },
            }),
            subtitle: o("web.callouts.toast_posted_subtitle"),
            subtitleLines: 2,
            durationMs: 6e3,
            action: n
              ? (0, t.jsxs)(i.m, {
                  href: n,
                  target: "_self",
                  variant: "primary",
                  onClick: () => r.c.dismiss(e),
                  children: [
                    o("web.callouts.view_callout"),
                    (0, t.jsx)(a.A3, { size: 12 }),
                  ],
                })
              : null,
          }),
        { duration: 6e3 },
      );
    },
  ]);
};
