// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (t, n) {
      return (r, a) =>
        (function (t, n, r, a) {
          let i = "SharedWorker" === t.name,
            l = e.b,
            o = [
              r.map((t) => e.h("string" == typeof t ? t : t.path, l)).reverse(),
              e.X,
              l,
            ],
            s = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
          for (let e = 0; e < s.length; e++) o.push(globalThis[s[e]]);
          let u = new URL(e.h(n, l), location.origin),
            c = JSON.stringify(o);
          return (
            i
              ? u.searchParams.set("params", c)
              : (u.hash = "#params=" + encodeURIComponent(c)),
            new t(u, a ? { ...a, type: void 0 } : void 0)
          );
        })(r, t, n, a);
    },
  ]);
};
