// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(352386);
  e.i(12692);
  var n = e.i(398902);
  let o = (e) => !!e && "object" == typeof e;
  e.s([
    "I18nNamespaces",
    0,
    function (e) {
      let s,
        r,
        a = (0, t.c)(5),
        { promise: l, children: u } = e,
        { i18n: d } = (0, n.f)(),
        { locale: c, resources: m } = (0, i.use)(l),
        b = `${c}:${Object.keys(m).join(",")}`,
        [f, p] = (0, i.useState)(null);
      if (f !== b) {
        let e, t;
        ((e = d.services.resourceStore.data),
          (e[c] ??= {}),
          (e[c].translation ??= {}),
          (t = (e, i) => {
            for (let [n, s] of Object.entries(i)) {
              if ("__proto__" === n || "constructor" === n || "prototype" === n)
                continue;
              let i = e[n];
              o(s) && o(i) ? t(i, s) : (e[n] = s);
            }
          })(e[c].translation, m),
          p(b));
      }
      return (
        a[0] !== d || a[1] !== c || a[2] !== m
          ? ((s = () => {
              d.addResourceBundle(c, "translation", m, !0, !0);
            }),
            (r = [d, c, m]),
            (a[0] = d),
            (a[1] = c),
            (a[2] = m),
            (a[3] = s),
            (a[4] = r))
          : ((s = a[3]), (r = a[4])),
        (0, i.useEffect)(s, r),
        u
      );
    },
  ]);
};
