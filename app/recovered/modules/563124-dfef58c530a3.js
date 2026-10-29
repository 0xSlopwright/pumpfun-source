// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    r = Object.defineProperty,
    n = new Map(),
    i = new WeakMap(),
    s = 0,
    a = void 0;
  (t.Component,
    e.s([
      "f",
      0,
      function ({
        threshold: e,
        delay: r,
        trackVisibility: l,
        rootMargin: o,
        root: c,
        triggerOnce: u,
        skip: d,
        initialInView: f,
        fallbackInView: m,
        onChange: E,
      } = {}) {
        var p;
        let [h, _] = t.useState(null),
          O = t.useRef(),
          [N, I] = t.useState({ inView: !!f, entry: void 0 });
        ((O.current = E),
          t.useEffect(() => {
            let t;
            if (!d && h)
              return (
                (t = (function (e, t, r = {}, l = a) {
                  if (void 0 === window.IntersectionObserver && void 0 !== l) {
                    let n = e.getBoundingClientRect();
                    return (
                      t(l, {
                        isIntersecting: l,
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
                      id: o,
                      observer: c,
                      elements: u,
                    } = (function (e) {
                      let t = Object.keys(e)
                          .sort()
                          .filter((t) => void 0 !== e[t])
                          .map((t) => {
                            var r;
                            return `${t}_${"root" === t ? (!(r = e.root) ? "0" : (i.has(r) || ((s += 1), i.set(r, s.toString())), i.get(r))) : e[t]}`;
                          })
                          .toString(),
                        r = n.get(t);
                      if (!r) {
                        let i,
                          s = new Map(),
                          a = new IntersectionObserver((t) => {
                            t.forEach((t) => {
                              var r;
                              let n =
                                t.isIntersecting &&
                                i.some((e) => t.intersectionRatio >= e);
                              (e.trackVisibility &&
                                void 0 === t.isVisible &&
                                (t.isVisible = n),
                                null == (r = s.get(t.target)) ||
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
                          (r = { id: t, observer: a, elements: s }),
                          n.set(t, r));
                      }
                      return r;
                    })(r),
                    d = u.get(e) || [];
                  return (
                    u.has(e) || u.set(e, d),
                    d.push(t),
                    c.observe(e),
                    function () {
                      (d.splice(d.indexOf(t), 1),
                        0 === d.length && (u.delete(e), c.unobserve(e)),
                        0 === u.size && (c.disconnect(), n.delete(o)));
                    }
                  );
                })(
                  h,
                  (e, r) => {
                    (I({ inView: e, entry: r }),
                      O.current && O.current(e, r),
                      r.isIntersecting && u && t && (t(), (t = void 0)));
                  },
                  {
                    root: c,
                    rootMargin: o,
                    threshold: e,
                    trackVisibility: l,
                    delay: r,
                  },
                  m,
                )),
                () => {
                  t && t();
                }
              );
          }, [Array.isArray(e) ? e.toString() : e, h, c, o, u, d, l, m, r]));
        let R = null == (p = N.entry) ? void 0 : p.target,
          T = t.useRef();
        h ||
          !R ||
          u ||
          d ||
          T.current === R ||
          ((T.current = R), I({ inView: !!f, entry: void 0 }));
        let g = [_, N.inView, N.entry];
        return ((g.ref = g[0]), (g.inView = g[1]), (g.entry = g[2]), g);
      },
    ]));
};
