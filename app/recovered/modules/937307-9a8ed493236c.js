// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  let n = /[\p{Lu}]/u,
    i = /[\p{Ll}]/u,
    o = /^[\p{Lu}](?![\p{Lu}])/gu,
    s = /([\p{Alpha}\p{N}_]|$)/u,
    a = /[_.\- ]+/,
    u = RegExp("^" + a.source),
    l = RegExp(a.source + s.source, "gu"),
    h = RegExp("\\d+" + s.source, "gu"),
    c = (t, e) => {
      var r, s;
      if (!("string" == typeof t || Array.isArray(t)))
        throw TypeError("Expected the input to be `string | string[]`");
      if (
        ((e = { pascalCase: !1, preserveConsecutiveUppercase: !1, ...e }),
        0 ===
          (t = Array.isArray(t)
            ? t
                .map((t) => t.trim())
                .filter((t) => t.length)
                .join("-")
            : t.trim()).length)
      )
        return "";
      let a =
          !1 === e.locale
            ? (t) => t.toLowerCase()
            : (t) => t.toLocaleLowerCase(e.locale),
        c =
          !1 === e.locale
            ? (t) => t.toUpperCase()
            : (t) => t.toLocaleUpperCase(e.locale);
      return 1 === t.length
        ? e.pascalCase
          ? c(t)
          : a(t)
        : ((t !== a(t) &&
            (t = ((t, e, r) => {
              let o = !1,
                s = !1,
                a = !1;
              for (let u = 0; u < t.length; u++) {
                let l = t[u];
                o && n.test(l)
                  ? ((t = t.slice(0, u) + "-" + t.slice(u)),
                    (o = !1),
                    (a = s),
                    (s = !0),
                    u++)
                  : s && a && i.test(l)
                    ? ((t = t.slice(0, u - 1) + "-" + t.slice(u - 1)),
                      (a = s),
                      (s = !1),
                      (o = !0))
                    : ((o = e(l) === l && r(l) !== l),
                      (a = s),
                      (s = r(l) === l && e(l) !== l));
              }
              return t;
            })(t, a, c)),
          (t = t.replace(u, "")),
          e.preserveConsecutiveUppercase)
            ? ((r = t), (o.lastIndex = 0), (t = r.replace(o, (t) => a(t))))
            : (t = a(t)),
          e.pascalCase && (t = c(t.charAt(0)) + t.slice(1)),
          (s = t),
          (l.lastIndex = 0),
          (h.lastIndex = 0),
          s.replace(l, (t, e) => c(e)).replace(h, (t) => c(t)));
    };
  ((e.exports = c), (e.exports.default = c));
};
