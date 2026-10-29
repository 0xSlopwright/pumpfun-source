// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(254667);
  function r(e) {
    return e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }
  e.s(["f", 0, r], 517929);
  var n = e.i(644306);
  let a = "translation";
  async function i(e, t) {
    let r = new URLSearchParams({ ns: t.join(",") }),
      n = await fetch(`/api/i18n/${e}?${r}`);
    if (!n.ok) throw Error(`i18n namespace fetch failed: ${n.status}`);
    return await n.json();
  }
  async function o(e, t, r) {
    let n = r.filter((r) => !e.getResource(t, a, r));
    if (0 === n.length) return;
    let o = await i(t, n);
    e.addResourceBundle(t, a, o, !0, !0);
  }
  let s = new WeakMap();
  async function l(e, n) {
    let i = s.get(e);
    if ((i || ((i = new Set()), s.set(e, i)), !i.has(n))) {
      i.add(n);
      try {
        let t = await fetch(`/api/i18n/${n}?ns=__all__`);
        if (!t.ok) throw Error(`i18n catalog fetch: ${t.status}`);
        let r = await t.json();
        e.addResourceBundle(n, a, r, !0, !0);
      } catch (e) {
        (i.delete(n),
          t.y.warn("i18n: idle full-catalog prefetch failed", {
            locale: n,
            reason: r(e),
            error: e,
          }));
      }
    }
  }
  async function c({ instance: e, locale: a, namespaces: i, router: s }) {
    try {
      (await l(e, a), await o(e, a, i));
    } catch (e) {
      t.y.warn("i18n: namespace seed before language switch failed", {
        locale: a,
        reason: r(e),
        error: e,
      });
    }
    ((0, n.E)(a), await e.changeLanguage(a), s.refresh());
  }
  e.s(["t", 0, a, "k", 0, o, "u", 0, l, "C", 0, c], 411657);
};
