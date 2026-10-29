// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(592209);
  let n = "pump_locale",
    r = (e) => (0, t.v)(e),
    a = (e) => {
      if (!e) return null;
      for (let t of e.split(";")) {
        let [e, ...a] = t.trim().split("=");
        if (e === n && a.length > 0) return r(decodeURIComponent(a.join("=")));
      }
      return null;
    };
  e.s([
    "I",
    0,
    () => ("u" < typeof document ? null : a(document.cookie)),
    "A",
    0,
    a,
    "E",
    0,
    (e) => {
      if ("u" < typeof document) return;
      let t = "https:" === location.protocol ? "; secure" : "";
      document.cookie = `${n}=${e}; path=/; max-age=31536000; samesite=lax${t}`;
    },
  ]);
};
