// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(445242),
    s = e.i(944410),
    a = e.i(690877),
    t = e.i(662610),
    i = e.i(560328),
    l = e.i(989582),
    n = e.i(779106);
  function o(e) {
    return "INVITED" === e.status;
  }
  function u(e) {
    return "ACTIVE" === e.status;
  }
  e.s(
    [
      "f",
      0,
      (e) => {
        let p,
          d,
          m,
          h,
          c,
          f,
          g,
          b = (0, r.c)(20);
        b[0] !== e
          ? ((p = void 0 === e ? {} : e), (b[0] = e), (b[1] = p))
          : (p = b[1]);
        let { enabled: y } = p,
          I = void 0 === y || y,
          w = (0, t.f)();
        b[2] !== I
          ? ((d = { enabled: I }), (b[2] = I), (b[3] = d))
          : (d = b[3]);
        let v = ((e) => {
          let o,
            u,
            p,
            d,
            m = (0, r.c)(10);
          m[0] !== e
            ? ((o = void 0 === e ? {} : e), (m[0] = e), (m[1] = o))
            : (o = m[1]);
          let { enabled: h } = o,
            c = (0, s.useClientServerContract)(),
            f = (0, n.f)("squad-memberships"),
            g = (0, t.f)();
          m[2] !== f
            ? ((u = l.f.myMemberships(f)), (m[2] = f), (m[3] = u))
            : (u = m[3]);
          let b = null !== f && g && (void 0 === h || h);
          return (
            m[4] !== c
              ? ((p = (e) => {
                  let { signal: r } = e;
                  return (0, i.F)({ api: c, signal: r });
                }),
                (m[4] = c),
                (m[5] = p))
              : (p = m[5]),
            m[6] !== u || m[7] !== b || m[8] !== p
              ? ((d = { queryKey: u, enabled: b, staleTime: 6e4, queryFn: p }),
                (m[6] = u),
                (m[7] = b),
                (m[8] = p),
                (m[9] = d))
              : (d = m[9]),
            (0, a.useQuery)(d)
          );
        })(d);
        b[4] !== v.data || b[5] !== w
          ? ((m = w ? (v.data ?? []) : []),
            (b[4] = v.data),
            (b[5] = w),
            (b[6] = m))
          : (m = b[6]);
        let C = m;
        b[7] !== C ? ((h = C.filter(o)), (b[7] = C), (b[8] = h)) : (h = b[8]);
        let A = h;
        b[9] !== C
          ? ((c = C.find(u) ?? null), (b[9] = C), (b[10] = c))
          : (c = b[10]);
        let E = w && v.isSuccess,
          U = w && v.isError;
        return (
          b[11] !== v
            ? ((f = () => void v.refetch()), (b[11] = v), (b[12] = f))
            : (f = b[12]),
          b[13] !== A ||
          b[14] !== v.isPending ||
          b[15] !== c ||
          b[16] !== E ||
          b[17] !== U ||
          b[18] !== f
            ? ((g = {
                squad: c,
                invites: A,
                inviteCount: A.length,
                isPending: v.isPending,
                isResolved: E,
                isError: U,
                refetch: f,
              }),
              (b[13] = A),
              (b[14] = v.isPending),
              (b[15] = c),
              (b[16] = E),
              (b[17] = U),
              (b[18] = f),
              (b[19] = g))
            : (g = b[19]),
          g
        );
      },
    ],
    816897,
  );
};
