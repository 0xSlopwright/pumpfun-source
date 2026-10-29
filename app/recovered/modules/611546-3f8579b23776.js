// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  e.s([
    "f",
    0,
    function (e) {
      let n,
        i,
        a,
        s = (0, t.c)(7),
        [o, l] = (0, r.useState)(null),
        [c, u] = (0, r.useState)(!1),
        [d, m] = (0, r.useState)(10);
      return (
        s[0] !== e
          ? ((n = () => {
              let t = !1,
                r = !1,
                n = Date.now() + 1e4,
                i = async () => {
                  let i;
                  if (!r) {
                    ((r = !0), u(!0));
                    try {
                      i = await e();
                    } catch {
                      i = null;
                    }
                    ((r = !1),
                      (n = Date.now() + 1e4),
                      !t && (u(!1), i && l(i)));
                  }
                },
                a = setInterval(() => {
                  let e = n - Date.now();
                  (m(Math.max(0, Math.ceil(e / 1e3))), e > 0 || i());
                }, 1e3);
              return () => {
                ((t = !0), clearInterval(a));
              };
            }),
            (i = [e]),
            (s[0] = e),
            (s[1] = n),
            (s[2] = i))
          : ((n = s[1]), (i = s[2])),
        (0, r.useEffect)(n, i),
        s[3] !== c || s[4] !== o || s[5] !== d
          ? ((a = { latest: o, isRefreshing: c, secondsUntilRefresh: d }),
            (s[3] = c),
            (s[4] = o),
            (s[5] = d),
            (s[6] = a))
          : (a = s[6]),
        a
      );
    },
  ]);
};
