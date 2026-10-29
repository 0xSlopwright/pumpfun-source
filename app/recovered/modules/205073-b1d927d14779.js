// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(690877),
    r = e.i(38279),
    n = e.i(759257);
  async function a(e = {}) {
    let { fetchOptions: t } = e;
    return (0, n.j)()("GET /mayhem/overview", {
      ...t,
      throwHttpErrors: !1,
      hooks: {
        afterResponse: [
          (e, t, i) => {
            if (!i.ok) throw Error("Failed to fetch mayhem overview");
          },
        ],
      },
    });
  }
  function l() {
    return a();
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let n,
          a,
          s = (0, t.c)(4);
        s[0] !== e
          ? ((n = void 0 === e ? {} : e), (s[0] = e), (s[1] = n))
          : (n = s[1]);
        let { queryOptions: o } = n;
        return (
          s[2] !== o
            ? ((a = {
                queryFn: l,
                queryKey: r.Q.MAYHEM_OVERVIEW,
                refetchOnMount: !0,
                refetchOnWindowFocus: !0,
                ...o,
              }),
              (s[2] = o),
              (s[3] = a))
            : (a = s[3]),
          (0, i.useQuery)(a)
        );
      },
    ],
    205073,
  );
};
