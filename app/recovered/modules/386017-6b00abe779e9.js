// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  function i(e) {
    return e.isIntersecting;
  }
  function a() {
    return "u" < typeof IntersectionObserver;
  }
  e.s([
    "f",
    0,
    function (e, n) {
      let l,
        s,
        o,
        c = (0, t.c)(7);
      c[0] !== n
        ? ((l = void 0 === n ? {} : n), (c[0] = n), (c[1] = l))
        : (l = c[1]);
      let { rootMargin: m } = l,
        d = void 0 === m ? "200px 0px" : m,
        [u, h] = (0, r.useState)(a);
      return (
        c[2] !== e || c[3] !== d || c[4] !== u
          ? ((s = () => {
              if (u) return;
              let t = e.current;
              if (!t) return;
              let r = new IntersectionObserver(
                (e) => {
                  e.some(i) && (r.disconnect(), h(!0));
                },
                { rootMargin: d },
              );
              return (r.observe(t), () => r.disconnect());
            }),
            (o = [e, u, d]),
            (c[2] = e),
            (c[3] = d),
            (c[4] = u),
            (c[5] = s),
            (c[6] = o))
          : ((s = c[5]), (o = c[6])),
        (0, r.useEffect)(s, o),
        u
      );
    },
  ]);
};
