// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386);
  function r(e, t) {
    if (e.length !== t.length) return !1;
    for (let r = 0; r < e.length; r++) if (e[r] !== t[r]) return !1;
    return !0;
  }
  e.s([
    "f",
    0,
    function ({
      mints: e,
      enabled: n = !0,
      rootMargin: i = "600px 0px 600px 0px",
      flushMs: l = 200,
      eagerCount: a = 24,
    }) {
      let u = (0, t.useRef)(new Map()),
        s = (0, t.useRef)(new Set()),
        o = (0, t.useRef)(new Set()),
        c = (0, t.useRef)(new Set()),
        d = (0, t.useRef)(null),
        m = (0, t.useRef)(null),
        f = (0, t.useCallback)(() => {
          if (!n) return [];
          let t = [];
          for (let r = 0; r < e.length; r++) {
            let n = e[r];
            n &&
              (s.current.has(n) ? !0 === u.current.get(n) : r < a) &&
              t.push(n);
          }
          return t;
        }, [e, a, n]),
        g = (0, t.useCallback)(
          (t) => {
            if (!n) return [];
            let r = new Set(t),
              i = [];
            for (let t = 0; t < e.length; t++) {
              let n = e[t];
              n && (t < a || o.current.has(n) || r.has(n)) && i.push(n);
            }
            return i;
          },
          [e, a, n],
        ),
        [p, h] = (0, t.useState)(() =>
          n ? e.slice(0, a).filter(Boolean) : [],
        ),
        [b, v] = (0, t.useState)(() =>
          n ? e.slice(0, a).filter(Boolean) : [],
        ),
        y = (0, t.useMemo)(() => {
          if (!n) return [];
          let t = new Set(b),
            r = [];
          for (let n = 0; n < e.length; n++) {
            let i = e[n];
            i && (n < a || t.has(i)) && r.push(i);
          }
          return r;
        }, [e, a, n, b]),
        w = (0, t.useCallback)(() => {
          ((m.current = null),
            h((e) => {
              let t = f();
              return r(e, t) ? e : t;
            }),
            v((e) => {
              let t = g(e);
              return r(e, t) ? e : t;
            }));
        }, [f, g]),
        C = (0, t.useRef)(w);
      (0, t.useEffect)(() => {
        C.current = w;
      }, [w]);
      let U = (0, t.useCallback)(() => {
          null == m.current && (m.current = setTimeout(() => C.current(), l));
        }, [l]),
        A = (0, t.useRef)(U);
      (0, t.useEffect)(() => {
        A.current = U;
      }, [U]);
      let S = (0, t.useCallback)((e) => {
        for (let t of e) {
          let e = t.target.id;
          e &&
            (s.current.add(e),
            u.current.set(e, t.isIntersecting),
            t.isIntersecting && o.current.add(e));
        }
        A.current();
      }, []);
      (0, t.useEffect)(() => {
        if (!n || "u" < typeof IntersectionObserver) return;
        let e = new IntersectionObserver(S, {
          root: null,
          rootMargin: i,
          threshold: 0,
        });
        return (
          (d.current = e),
          c.current.forEach((t) => e.observe(t)),
          () => {
            (e.disconnect(), (d.current = null));
          }
        );
      }, [n, i, S]);
      let $ = (0, t.useCallback)((e) => {
          if (e)
            return (
              c.current.add(e),
              d.current?.observe(e),
              () => {
                (c.current.delete(e), d.current?.unobserve(e));
              }
            );
        }, []),
        R = (0, t.useMemo)(() => e.join(","), [e]);
      return (
        (0, t.useEffect)(() => {
          let t = new Set(e.filter(Boolean));
          for (let e of Array.from(u.current.keys()))
            t.has(e) || u.current.delete(e);
          for (let e of Array.from(s.current)) t.has(e) || s.current.delete(e);
          for (let e of Array.from(o.current)) t.has(e) || o.current.delete(e);
          (h((e) => {
            let t = f();
            return r(e, t) ? e : t;
          }),
            v((e) => {
              let t = g(e);
              return r(e, t) ? e : t;
            }));
        }, [R, n]),
        (0, t.useEffect)(
          () => () => {
            null != m.current && (clearTimeout(m.current), (m.current = null));
          },
          [],
        ),
        { observe: $, visibleMints: p, seenMints: y }
      );
    },
  ]);
};
