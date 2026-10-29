// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n(e, t, r = !1) {
    return t
      ? Object.keys(e)
          .filter((e) => (r ? !t.includes(e) : t.includes(e)))
          .reduce((t, r) => ((t[r] = e[r]), t), {})
      : {};
  }
  function i(e, t, r, n) {
    let i =
      n && Object.keys(n).length > 0
        ? new URL(Object.values(n)[0], e)
        : new URL(e);
    return (
      t &&
        r &&
        t.forEach((e) => {
          r[e] && i.searchParams.set(e, r[e]);
        }),
      i.toString()
    );
  }
  function s(e, t, r, n, s) {
    var o;
    if (!t) return `<${e}></${e}>`;
    let a = (null == (o = t.src) ? void 0 : o.url)
        ? Object.assign(Object.assign({}, t), {
            src: i(t.src.url, t.src.params, n, s),
          })
        : t,
      l = Object.keys(Object.assign(Object.assign({}, a), r)).reduce((e, t) => {
        let n = null == r ? void 0 : r[t],
          i = a[t],
          s = null != n ? n : i,
          o = !0 === s ? t : `${t}="${s}"`;
        return s ? e + ` ${o}` : e;
      }, "");
    return `<${e}${l}></${e}>`;
  }
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.formatData = r.createHtml = r.formatUrl = void 0),
    (r.formatUrl = i),
    (r.createHtml = s),
    (r.formatData = function (e, t) {
      var r, o, a, l, f;
      let u = n(
          t,
          null == (r = e.scripts)
            ? void 0
            : r.reduce(
                (e, t) => [...e, ...(Array.isArray(t.params) ? t.params : [])],
                [],
              ),
        ),
        c = n(
          t,
          null == (a = null == (o = e.html) ? void 0 : o.attributes.src)
            ? void 0
            : a.params,
        ),
        d = n(t, [
          null == (f = null == (l = e.html) ? void 0 : l.attributes.src)
            ? void 0
            : f.slugParam,
        ]),
        h = n(t, [...Object.keys(u), ...Object.keys(c), ...Object.keys(d)], !0);
      return Object.assign(Object.assign({}, e), {
        html: e.html ? s(e.html.element, e.html.attributes, h, c, d) : null,
        scripts: e.scripts
          ? e.scripts.map((e) =>
              Object.assign(Object.assign({}, e), {
                url: i(e.url, e.params, u),
              }),
            )
          : null,
      });
    }));
};
