// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(982253);
  var t = e.i(117852),
    a = e.i(933185),
    i = e.i(565530),
    n = e.i(336291);
  function s(e) {
    return crypto.getRandomValues(new Uint8Array(e));
  }
  function l() {
    return t.f.encode(s(36));
  }
  async function r(e, a = "S256") {
    if ("S256" != a) return e;
    {
      let a = await (async function (e) {
        let t = new TextEncoder().encode(e);
        return new Uint8Array(await crypto.subtle.digest("SHA-256", t));
      })(e);
      return t.f.encode(a);
    }
  }
  e.s([
    "a",
    0,
    function () {
      return l();
    },
    "c",
    0,
    l,
    "d",
    0,
    r,
    "g",
    0,
    function () {
      let e = n.s.get(a.t);
      if (!e) throw new i.P("Authentication error.");
      return e;
    },
    "r",
    0,
    s,
  ]);
};
