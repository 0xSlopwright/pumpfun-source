// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.delay = void 0),
    (r.delay = function (e) {
      return new Promise((t) => {
        setTimeout(() => {
          t(!0);
        }, e);
      });
    }));
};
