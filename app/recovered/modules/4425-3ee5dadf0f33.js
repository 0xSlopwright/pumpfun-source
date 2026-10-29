// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  function i() {
    return "u" < typeof IntersectionObserver;
  }
  e.s([
    "f",
    0,
    function (e, n) {
      let a,
        l,
        o,
        u = (0, t.c)(6);
      u[0] !== n
        ? ((a = void 0 === n ? {} : n), (u[0] = n), (u[1] = a))
        : (a = u[1]);
      let { enabled: s } = a,
        m = void 0 === s || s,
        [c, d] = (0, r.useState)(i);
      return (
        u[2] !== m || u[3] !== e
          ? ((l = () => {
              let t = e.current;
              if (!m || !t || "u" < typeof IntersectionObserver)
                return void d("u" < typeof IntersectionObserver);
              let r = new IntersectionObserver((e) => {
                let t = e[e.length - 1];
                t && d(t.isIntersecting);
              });
              return (r.observe(t), () => r.disconnect());
            }),
            (o = [e, m]),
            (u[2] = m),
            (u[3] = e),
            (u[4] = l),
            (u[5] = o))
          : ((l = u[4]), (o = u[5])),
        (0, r.useEffect)(l, o),
        c
      );
    },
  ]);
};
