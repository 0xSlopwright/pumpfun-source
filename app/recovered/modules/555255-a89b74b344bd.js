// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(254667),
    n = e.i(352386),
    i = e.i(553052);
  let a = "api-host-would-open",
    s = (e, t, r) => {
      if (t.shadow === r.shadow) return null;
      if ("would-be-open" === r.shadow) {
        let t = r.openedAt ?? 0,
          n = (0, i.b)(r, t);
        return {
          name: a,
          host: e,
          context: {
            failures: n.length,
            families: (0, i._)(n),
            flapCount: r.flapCount,
          },
        };
      }
      if (null === r.closedAt) return null;
      let n = r.closedAt,
        s = (0, i.b)(r, n);
      return {
        name: "api-host-recovered",
        host: e,
        context: {
          failures: s.length,
          families: (0, i._)(s),
          flapCount: r.flapCount,
          openForMs: null === t.openedAt ? 0 : n - t.openedAt,
        },
      };
    };
  var o = e.i(692198),
    l = e.i(466931),
    c = e.i(167236);
  let u = ({ name: e, host: t, context: n }) => {
    let i = {
      ...n,
      online: "u" < typeof navigator || navigator.onLine,
      hidden: "u" > typeof document && document.hidden,
    };
    (e === a
      ? r.y.warn("api-host.health", { ...i, event: e, host: t })
      : r.y.info("api-host.health", { ...i, event: e, host: t }),
      (0, l.B)({ name: e, feature: "connectivity", operation: t, context: i }));
  };
  function d() {
    return c.f.subscribe(m);
  }
  function m(e, t) {
    if (e.hosts !== t.hosts)
      for (let r of i.d) {
        let n = s(r, t.hosts[r], e.hosts[r]);
        n && u(n);
      }
  }
  function f() {
    return (0, o.K)();
  }
  e.s(
    [
      "ApiHostHealthController",
      0,
      function () {
        let e,
          r,
          i = (0, t.c)(2);
        return (
          i[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = []), (i[0] = e))
            : (e = i[0]),
          (0, n.useEffect)(f, e),
          i[1] === Symbol.for("react.memo_cache_sentinel")
            ? ((r = []), (i[1] = r))
            : (r = i[1]),
          (0, n.useEffect)(d, r),
          null
        );
      },
    ],
    555255,
  );
};
