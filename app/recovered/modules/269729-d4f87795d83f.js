// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  function n(e, t = {}) {
    if (t.onlyHashChange) return void e();
    let a = document.documentElement;
    if ("smooth" !== a.dataset.scrollBehavior) return void e();
    let u = a.style.scrollBehavior;
    ((a.style.scrollBehavior = "auto"),
      t.dontForceLayout || a.getClientRects(),
      e(),
      (a.style.scrollBehavior = u));
  }
  (e.i(149502),
    Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "disableSmoothScrollDuringRouteTransition", {
      enumerable: !0,
      get: function () {
        return n;
      },
    }));
};
