// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(982253);
  var t = e.i(117852),
    a = e.i(933185),
    i = e.i(565530),
    s = e.i(336291);
  function r(e) {
    return crypto.getRandomValues(new Uint8Array(e));
  }
  function n() {
    return t.f.encode(r(36));
  }
  async function l(e, a = "S256") {
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
      return n();
    },
    "c",
    0,
    n,
    "d",
    0,
    l,
    "g",
    0,
    function () {
      let e = s.s.get(a.t);
      if (!e) throw new i.P("Authentication error.");
      return e;
    },
    "r",
    0,
    r,
  ]);
};
