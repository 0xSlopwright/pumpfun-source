// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386);
  e.i(12692);
  var i = e.i(271292),
    a = e.i(411657),
    o = e.i(406882),
    l = e.i(536869),
    s = e.i(592209);
  let u = null;
  function c(e) {
    document.documentElement.lang = e;
  }
  e.s(
    [
      "I18nProvider",
      0,
      function (e) {
        let d,
          f,
          p,
          m,
          g,
          h,
          y,
          v,
          _ = (0, n.c)(18),
          { promise: E, children: w, syncHtmlLang: b } = e,
          S = void 0 === b || b,
          { locale: I, resources: P } = (0, r.use)(E);
        _[0] !== I || _[1] !== P
          ? ((d = () => {
              var e;
              return (
                (e = { locale: I, resources: P }),
                (u ??= (function ({ locale: e, resources: t }) {
                  let n = (0, o.p)();
                  return (
                    n
                      .use(l.f)
                      .init({
                        compatibilityJSON: "v4",
                        lng: e,
                        fallbackLng: s.T,
                        ns: ["translation"],
                        defaultNS: "translation",
                        resources: { [e]: { translation: t } },
                        partialBundledLanguages: !0,
                        interpolation: { escapeValue: !1 },
                        initAsync: !1,
                        react: {
                          useSuspense: !1,
                          bindI18nStore: "added removed",
                        },
                        ...{},
                      }),
                    n
                  );
                })(e))
              );
            }),
            (_[0] = I),
            (_[1] = P),
            (_[2] = d))
          : (d = _[2]);
        let [C] = (0, r.useState)(d);
        return (
          _[3] !== C || _[4] !== S
            ? ((f = () => {
                if (S)
                  return (
                    c(C.language),
                    C.on("languageChanged", c),
                    () => {
                      C.off("languageChanged", c);
                    }
                  );
              }),
              (p = [C, S]),
              (_[3] = C),
              (_[4] = S),
              (_[5] = f),
              (_[6] = p))
            : ((f = _[5]), (p = _[6])),
          (0, r.useEffect)(f, p),
          _[7] !== C || _[8] !== I || _[9] !== P
            ? ((m = () => {
                (C.hasResourceBundle(I, "translation") ||
                  C.addResourceBundle(I, "translation", P, !0, !0),
                  C.language !== I && C.changeLanguage(I));
              }),
              (g = [C, I, P]),
              (_[7] = C),
              (_[8] = I),
              (_[9] = P),
              (_[10] = m),
              (_[11] = g))
            : ((m = _[10]), (g = _[11])),
          (0, r.useEffect)(m, g),
          _[12] !== C
            ? ((h = () => {
                let e,
                  t,
                  n,
                  r = () => {
                    (n && window.removeEventListener("load", n),
                      (n = void 0),
                      void 0 !== e && window.cancelIdleCallback?.(e),
                      (e = void 0),
                      void 0 !== t && clearTimeout(t),
                      (t = void 0));
                  },
                  i = (i) => {
                    r();
                    let o = () => {
                        (0, a.u)(C, i);
                      },
                      l = () => {
                        "requestIdleCallback" in window
                          ? (e = window.requestIdleCallback(o, {
                              timeout: 15e3,
                            }))
                          : (t = setTimeout(o, 3e3));
                      };
                    "complete" === document.readyState
                      ? l()
                      : ((n = l),
                        window.addEventListener("load", l, { once: !0 }));
                  };
                i(C.language);
                let o = (e) => i(e);
                return (
                  C.on("languageChanged", o),
                  () => {
                    (C.off("languageChanged", o), r());
                  }
                );
              }),
              (y = [C]),
              (_[12] = C),
              (_[13] = h),
              (_[14] = y))
            : ((h = _[13]), (y = _[14])),
          (0, r.useEffect)(h, y),
          _[15] !== w || _[16] !== C
            ? ((v = (0, t.jsx)(i.f, { i18n: C, children: w })),
              (_[15] = w),
              (_[16] = C),
              (_[17] = v))
            : (v = _[17]),
          v
        );
      },
    ],
    204027,
  );
};
