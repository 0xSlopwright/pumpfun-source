// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  (Object.defineProperty(n, "__esModule", { value: !0 }),
    Object.defineProperty(n, "workAsyncStorageInstance", {
      enumerable: !0,
      get: function () {
        return r;
      },
    }));
  let r = (0, e.r(56093).getOrCreateGlobalAsyncLocalStorage)(
    "work-async-storage",
  );
};
