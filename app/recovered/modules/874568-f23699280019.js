// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = ["privy_oauth_code", "privy_oauth_state", "privy_oauth_provider"];
  e.s([
    "f",
    0,
    function (e) {
      let r;
      if (!e || !t.some((t) => e.includes(t))) return e;
      let n = /^[a-z][a-z0-9+.-]*:/i.test(e);
      try {
        r = n ? new URL(e) : new URL(e, "http://__privy_strip__.invalid");
      } catch {
        return e;
      }
      let i = !1;
      for (let e of t)
        r.searchParams.has(e) && (r.searchParams.delete(e), (i = !0));
      if (!i) return e;
      if (n) return r.toString();
      let a = r.searchParams.toString(),
        s = a ? `?${a}` : "";
      return `${r.pathname}${s}${r.hash}`;
    },
  ]);
};
