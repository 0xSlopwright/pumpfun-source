// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.fromMiliseconds = r.toMiliseconds = void 0));
  let n = e.r(159842);
  ((r.toMiliseconds = function (e) {
    return e * n.ONE_THOUSAND;
  }),
    (r.fromMiliseconds = function (e) {
      return Math.floor(e / n.ONE_THOUSAND);
    }));
};
