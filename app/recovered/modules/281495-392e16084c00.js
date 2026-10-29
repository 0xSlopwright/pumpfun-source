// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(765115),
    r = e.i(599077),
    n = e.i(352386),
    i = (0, t.W)(function () {
      let e = (0, r.useRouter)(),
        i = (0, r.useSearchParams)(),
        [a, s] = (0, n.useOptimistic)(i);
      return {
        searchParams: a,
        updateUrl: (0, n.useCallback)((r, i) => {
          (0, n.startTransition)(() => {
            var n, a;
            i.shallow || s(r);
            let o =
              ((n = location.origin + location.pathname),
              (a = r),
              (n.split("#")[0] ?? "") + (0, t.D)(a) + location.hash);
            ((0, t.h)("[nuqs queue (app)] Updating url: %s", o),
              ("push" === i.history
                ? history.pushState
                : history.replaceState
              ).call(history, null, "", o),
              i.scroll && window.scrollTo(0, 0),
              i.shallow || e.replace(o, { scroll: !1 }));
          });
        }, []),
        rateLimitFactor: 2,
      };
    });
  e.s(["NuqsAdapter", 0, i], 281495);
};
