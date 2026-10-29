// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(982253);
  var n = e.i(117852),
    t = e.i(933185),
    a = e.i(565530),
    r = e.i(336291);
  function i(e) {
    return crypto.getRandomValues(new Uint8Array(e));
  }
  function o() {
    return n.f.encode(i(36));
  }
  async function s(e, t = "S256") {
    if ("S256" != t) return e;
    {
      let t = await (async function (e) {
        let n = new TextEncoder().encode(e);
        return new Uint8Array(await crypto.subtle.digest("SHA-256", n));
      })(e);
      return n.f.encode(t);
    }
  }
  e.s([
    "a",
    0,
    function () {
      return o();
    },
    "c",
    0,
    o,
    "d",
    0,
    s,
    "g",
    0,
    function () {
      let e = r.s.get(t.t);
      if (!e) throw new a.P("Authentication error.");
      return e;
    },
    "r",
    0,
    i,
  ]);
};
