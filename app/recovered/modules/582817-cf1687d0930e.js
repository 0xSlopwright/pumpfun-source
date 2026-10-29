// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  function r(e) {
    return e
      .split("/")
      .map((e) => encodeURIComponent(e))
      .join("/");
  }
  (Object.defineProperty(n, "__esModule", { value: !0 }),
    Object.defineProperty(n, "encodeURIPath", {
      enumerable: !0,
      get: function () {
        return r;
      },
    }));
};
