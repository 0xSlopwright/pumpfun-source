// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(690877),
    a = e.i(759257);
  let i = {
      catalog: ["achievements", "catalog"],
      user: (e) => ["achievements", "user", e],
      markSeen: ["achievements", "mark-seen"],
    },
    r = ({ signal: e } = {}) =>
      (0, a.j)({ timeout: 8e3, signal: e })("GET /achievements/catalog");
  e.s(
    [
      "q",
      0,
      i,
      "G",
      0,
      r,
      "A",
      0,
      ({ address: e, signal: t }) =>
        (0, a.j)({ timeout: 8e3, signal: t })(
          "GET /users/{address}/achievements",
          { params: { address: e } },
        ),
      "t",
      0,
      ({ achievementIds: e }) =>
        (0, a.j)({ timeout: 8e3 })("POST /users/achievements/seen", {
          body: e ? { achievementIds: e } : {},
        }),
    ],
    656246,
  );
  function o(e) {
    let { signal: t } = e;
    return r({ signal: t });
  }
  function s(e) {
    return 216e5 * !!e.state.data?.catalogVersion;
  }
  e.s(
    [
      "f",
      0,
      (e) => {
        let a,
          r,
          l = (0, t.c)(4);
        l[0] !== e
          ? ((a = void 0 === e ? {} : e), (l[0] = e), (l[1] = a))
          : (a = l[1]);
        let { enabled: u } = a,
          d = void 0 === u || u;
        return (
          l[2] !== d
            ? ((r = {
                queryKey: i.catalog,
                queryFn: o,
                enabled: d,
                staleTime: s,
                retry: 2,
              }),
              (l[2] = d),
              (l[3] = r))
            : (r = l[3]),
          (0, n.useQuery)(r)
        );
      },
    ],
    456747,
  );
};
