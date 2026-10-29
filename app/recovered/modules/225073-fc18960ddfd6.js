// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(599077),
    n = e.i(352386),
    i = e.i(874568),
    a = e.i(595673);
  e.s([
    "default",
    0,
    function () {
      let e,
        s,
        o,
        l,
        c = (0, t.c)(7),
        u = (0, r.usePathname)(),
        d = (0, r.useSearchParams)(),
        m = (0, n.useRef)(null);
      c[0] !== d ? ((e = d?.toString()), (c[0] = d), (c[1] = e)) : (e = c[1]);
      let f = e,
        p = f ? `${u}?${f}` : u;
      c[2] !== p ? ((s = (0, i.f)(p)), (c[2] = p), (c[3] = s)) : (s = c[3]);
      let h = s;
      return (
        c[4] !== h
          ? ((o = () => {
              m.current !== h &&
                ((0, a.x9)(h, { originPath: m.current || void 0 }),
                (m.current = h));
            }),
            (l = [h]),
            (c[4] = h),
            (c[5] = o),
            (c[6] = l))
          : ((o = c[5]), (l = c[6])),
        (0, n.useEffect)(o, l),
        null
      );
    },
  ]);
};
