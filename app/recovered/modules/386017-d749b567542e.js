// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(352386);
  function r(e) {
    return e.isIntersecting;
  }
  function i() {
    return "u" < typeof IntersectionObserver;
  }
  e.s([
    "f",
    0,
    function (e, o) {
      let s,
        a,
        l,
        c = (0, t.c)(7);
      c[0] !== o
        ? ((s = void 0 === o ? {} : o), (c[0] = o), (c[1] = s))
        : (s = c[1]);
      let { rootMargin: u } = s,
        d = void 0 === u ? "200px 0px" : u,
        [m, E] = (0, n.useState)(i);
      return (
        c[2] !== e || c[3] !== d || c[4] !== m
          ? ((a = () => {
              if (m) return;
              let t = e.current;
              if (!t) return;
              let n = new IntersectionObserver(
                (e) => {
                  e.some(r) && (n.disconnect(), E(!0));
                },
                { rootMargin: d },
              );
              return (n.observe(t), () => n.disconnect());
            }),
            (l = [e, m, d]),
            (c[2] = e),
            (c[3] = d),
            (c[4] = m),
            (c[5] = a),
            (c[6] = l))
          : ((a = c[5]), (l = c[6])),
        (0, n.useEffect)(a, l),
        m
      );
    },
  ]);
};
