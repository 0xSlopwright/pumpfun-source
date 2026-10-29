// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(254667),
    n = e.i(313506);
  let r =
      /(Failed to load chunk|Loading chunk .* failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed)/i,
    i = "pf-chunk-reload-at";
  e.s([
    "P",
    0,
    function (e) {
      if (!e || "object" != typeof e) return !1;
      let { name: t, message: n } = e;
      return "ChunkLoadError" === t || ("string" == typeof n && r.test(n));
    },
    "m",
    0,
    function (e) {
      if ((0, n.O)())
        return (
          t.y.warn("Chunk load recovery deferred to user (live session)", {
            reason: e,
          }),
          "deferred-live-session"
        );
      let r = Date.now(),
        a = (function () {
          try {
            let e = window.sessionStorage.getItem(i);
            if (!e) return null;
            let t = Number(e);
            return Number.isFinite(t) ? t : null;
          } catch {
            return null;
          }
        })();
      return null !== a && r - a < 6e4
        ? (t.y.error("Chunk load recovery reload did not take", {
            msSinceLastReload: r - a,
            reason: e,
          }),
          "suppressed")
        : !(function (e) {
              try {
                return (window.sessionStorage.setItem(i, String(e)), !0);
              } catch {
                return !1;
              }
            })(r)
          ? "suppressed"
          : (t.y.info("Chunk load recovery reloading", { reason: e }),
            window.location.reload(),
            "reloading");
    },
  ]);
};
