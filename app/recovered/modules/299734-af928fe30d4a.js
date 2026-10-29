// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    ({ origin: e, path: t, query: a = {}, hash: i = {} }) => {
      let n = new URL(t, e.endsWith("/") ? e : `${e}/`);
      for (let [e, t] of Object.entries(a))
        void 0 !== t && n.searchParams.set(e, t);
      let s = Object.entries(i);
      if (s.length > 0) {
        let e = new URLSearchParams();
        for (let [t, a] of s) void 0 !== a && e.append(t, a);
        n.hash = e.toString();
      }
      return n.href;
    },
  ]);
};
