// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(732486),
    s = t.i(445242),
    i = t.i(352386);
  let n = () => {
      let t = null,
        e = new Set();
      return {
        publish: (s) => {
          for (let i of ((t = s), e)) i();
        },
        subscribe: (t) => (
          e.add(t),
          () => {
            e.delete(t);
          }
        ),
        getSnapshot: () => t,
      };
    },
    a = (0, i.createContext)(null),
    l = () => () => {},
    u = () => null;
  t.s([
    "L",
    0,
    function (t) {
      let l,
        u = (0, s.c)(3),
        { children: r } = t,
        [m] = (0, i.useState)(n);
      return (
        u[0] !== r || u[1] !== m
          ? ((l = (0, e.jsx)(a.Provider, { value: m, children: r })),
            (u[0] = r),
            (u[1] = m),
            (u[2] = l))
          : (l = u[2]),
        l
      );
    },
    "r",
    0,
    function () {
      let t = (0, i.useContext)(a);
      return (0, i.useSyncExternalStore)(
        t?.subscribe ?? l,
        t?.getSnapshot ?? u,
        u,
      );
    },
    "l",
    0,
    function (t) {
      let e,
        n,
        l,
        u,
        r = (0, s.c)(7),
        m = (0, i.useContext)(a);
      (r[0] !== t || r[1] !== m
        ? ((e = () => {
            m?.publish(t);
          }),
          (n = [m, t]),
          (r[0] = t),
          (r[1] = m),
          (r[2] = e),
          (r[3] = n))
        : ((e = r[2]), (n = r[3])),
        (0, i.useEffect)(e, n),
        r[4] !== m
          ? ((l = () => {
              if (m) return () => m.publish(null);
            }),
            (u = [m]),
            (r[4] = m),
            (r[5] = l),
            (r[6] = u))
          : ((l = r[5]), (u = r[6])),
        (0, i.useEffect)(l, u));
    },
  ]);
};
