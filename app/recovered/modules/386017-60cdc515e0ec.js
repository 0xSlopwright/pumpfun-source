// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  function a(e) {
    return e.isIntersecting;
  }
  function l() {
    return "u" < typeof IntersectionObserver;
  }
  e.s([
    "f",
    0,
    function (e, n) {
      let i,
        s,
        o,
        c = (0, t.c)(7);
      c[0] !== n
        ? ((i = void 0 === n ? {} : n), (c[0] = n), (c[1] = i))
        : (i = c[1]);
      let { rootMargin: d } = i,
        u = void 0 === d ? "200px 0px" : d,
        [m, h] = (0, r.useState)(l);
      return (
        c[2] !== e || c[3] !== u || c[4] !== m
          ? ((s = () => {
              if (m) return;
              let t = e.current;
              if (!t) return;
              let r = new IntersectionObserver(
                (e) => {
                  e.some(a) && (r.disconnect(), h(!0));
                },
                { rootMargin: u },
              );
              return (r.observe(t), () => r.disconnect());
            }),
            (o = [e, m, u]),
            (c[2] = e),
            (c[3] = u),
            (c[4] = m),
            (c[5] = s),
            (c[6] = o))
          : ((s = c[5]), (o = c[6])),
        (0, r.useEffect)(s, o),
        m
      );
    },
  ]);
};
