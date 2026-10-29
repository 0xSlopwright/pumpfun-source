// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    r = Object.defineProperty,
    n = new Map(),
    i = new WeakMap(),
    l = 0,
    a = void 0;
  (t.Component,
    e.s([
      "f",
      0,
      function ({
        threshold: e,
        delay: r,
        trackVisibility: u,
        rootMargin: s,
        root: o,
        triggerOnce: c,
        skip: d,
        initialInView: m,
        fallbackInView: f,
        onChange: g,
      } = {}) {
        var p;
        let [h, b] = t.useState(null),
          v = t.useRef(),
          [y, w] = t.useState({ inView: !!m, entry: void 0 });
        ((v.current = g),
          t.useEffect(() => {
            let t;
            if (!d && h)
              return (
                (t = (function (e, t, r = {}, u = a) {
                  if (void 0 === window.IntersectionObserver && void 0 !== u) {
                    let n = e.getBoundingClientRect();
                    return (
                      t(u, {
                        isIntersecting: u,
                        target: e,
                        intersectionRatio:
                          "number" == typeof r.threshold ? r.threshold : 0,
                        time: 0,
                        boundingClientRect: n,
                        intersectionRect: n,
                        rootBounds: n,
                      }),
                      () => {}
                    );
                  }
                  let {
                      id: s,
                      observer: o,
                      elements: c,
                    } = (function (e) {
                      let t = Object.keys(e)
                          .sort()
                          .filter((t) => void 0 !== e[t])
                          .map((t) => {
                            var r;
                            return `${t}_${"root" === t ? (!(r = e.root) ? "0" : (i.has(r) || ((l += 1), i.set(r, l.toString())), i.get(r))) : e[t]}`;
                          })
                          .toString(),
                        r = n.get(t);
                      if (!r) {
                        let i,
                          l = new Map(),
                          a = new IntersectionObserver((t) => {
                            t.forEach((t) => {
                              var r;
                              let n =
                                t.isIntersecting &&
                                i.some((e) => t.intersectionRatio >= e);
                              (e.trackVisibility &&
                                void 0 === t.isVisible &&
                                (t.isVisible = n),
                                null == (r = l.get(t.target)) ||
                                  r.forEach((e) => {
                                    e(n, t);
                                  }));
                            });
                          }, e);
                        ((i =
                          a.thresholds ||
                          (Array.isArray(e.threshold)
                            ? e.threshold
                            : [e.threshold || 0])),
                          (r = { id: t, observer: a, elements: l }),
                          n.set(t, r));
                      }
                      return r;
                    })(r),
                    d = c.get(e) || [];
                  return (
                    c.has(e) || c.set(e, d),
                    d.push(t),
                    o.observe(e),
                    function () {
                      (d.splice(d.indexOf(t), 1),
                        0 === d.length && (c.delete(e), o.unobserve(e)),
                        0 === c.size && (o.disconnect(), n.delete(s)));
                    }
                  );
                })(
                  h,
                  (e, r) => {
                    (w({ inView: e, entry: r }),
                      v.current && v.current(e, r),
                      r.isIntersecting && c && t && (t(), (t = void 0)));
                  },
                  {
                    root: o,
                    rootMargin: s,
                    threshold: e,
                    trackVisibility: u,
                    delay: r,
                  },
                  f,
                )),
                () => {
                  t && t();
                }
              );
          }, [Array.isArray(e) ? e.toString() : e, h, o, s, c, d, u, f, r]));
        let C = null == (p = y.entry) ? void 0 : p.target,
          U = t.useRef();
        h ||
          !C ||
          c ||
          d ||
          U.current === C ||
          ((U.current = C), w({ inView: !!m, entry: void 0 }));
        let A = [b, y.inView, y.entry];
        return ((A.ref = A[0]), (A.inView = A[1]), (A.entry = A[2]), A);
      },
    ]));
};
