// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(833551);
  let r =
    (((t = {})[(t.open = n.q.open)] = "open"),
    (t[(t.closed = n.q.closed)] = "closed"),
    (t[(t.startingStyle = n.q.startingStyle)] = "startingStyle"),
    (t[(t.endingStyle = n.q.endingStyle)] = "endingStyle"),
    (t.expanded = "data-expanded"),
    (t.nestedDrawerOpen = "data-nested-drawer-open"),
    (t.nestedDrawerSwiping = "data-nested-drawer-swiping"),
    (t.swipeDismiss = "data-swipe-dismiss"),
    (t.swipeDirection = "data-swipe-direction"),
    (t.swiping = "data-swiping"),
    t);
  e.s(["f", 0, r], 741420);
  var i = e.i(352386),
    o = e.i(565693),
    l = e.i(278051),
    a = e.i(226115);
  function s(e, t = Number.MIN_SAFE_INTEGER, n = Number.MAX_SAFE_INTEGER) {
    return Math.max(t, Math.min(e, n));
  }
  e.s(["f", 0, s], 295445);
  var u = e.i(68585),
    c = e.i(371308);
  function d(e, t, n) {
    if (!Number.isFinite(t) || t <= 0) return null;
    if ("number" == typeof e)
      return Number.isFinite(e) ? (e <= 1 ? s(e, 0, 1) * t : e) : null;
    let r = e.trim();
    if (r.endsWith("px")) {
      let e = Number.parseFloat(r);
      return Number.isFinite(e) ? e : null;
    }
    if (r.endsWith("rem")) {
      let e = Number.parseFloat(r);
      return Number.isFinite(e) ? e * n : null;
    }
    return null;
  }
  e.s(
    [
      "f",
      0,
      function () {
        let { store: e } = (0, u.x)(),
          {
            snapPoints: t,
            activeSnapPoint: n,
            setActiveSnapPoint: r,
            popupHeight: f,
          } = (0, c.R)(),
          p = e.useState("viewportElement"),
          [g, h] = i.useState(0),
          [v, m] = i.useState(16),
          b = (0, l.f)(() => {
            let e = (0, a.f)(p).documentElement;
            (p && h(p.offsetHeight), p || h(e.clientHeight));
            let t = parseFloat(getComputedStyle(e).fontSize);
            Number.isFinite(t) && m(t);
          });
        (0, o.f)(() => {
          if ((b(), !p || "function" != typeof ResizeObserver)) return;
          let e = new ResizeObserver(b);
          return (
            e.observe(p),
            () => {
              e.disconnect();
            }
          );
        }, [b, p]);
        let x = i.useMemo(() => {
            if (!t || 0 === t.length || g <= 0 || f <= 0) return [];
            let e = Math.min(f, g);
            if (!Number.isFinite(e) || e <= 0) return [];
            let n = t
              .map((t) => {
                let n = d(t, g, v);
                if (null === n || !Number.isFinite(n)) return null;
                let r = s(n, 0, e);
                return { value: t, height: r, offset: Math.max(0, f - r) };
              })
              .filter((e) => !!e);
            if (n.length <= 1) return n;
            let r = [],
              i = [];
            for (let e = n.length - 1; e >= 0; e -= 1) {
              let t = n[e];
              i.some((e) => 1 >= Math.abs(e - t.height)) ||
                (i.push(t.height), r.push(t));
            }
            return (r.reverse(), r);
          }, [f, v, t, g]),
          y = i.useMemo(() => {
            if (void 0 === n) return x[0];
            if (null === n) return;
            let e = x.find((e) => Object.is(e.value, n));
            if (e) return e;
            let t = Math.min(f, g),
              r = d(n, g, v);
            if (null !== r && Number.isFinite(r))
              return (
                (function (e, t) {
                  let n = null,
                    r = 1 / 0;
                  for (let i of t) {
                    let t = Math.abs(i.height - e);
                    t < r && ((r = t), (n = i));
                  }
                  return n;
                })(s(r, 0, t), x) ?? void 0
              );
          }, [n, f, x, v, g]);
        return {
          snapPoints: t,
          activeSnapPoint: n,
          setActiveSnapPoint: r,
          popupHeight: f,
          viewportHeight: g,
          resolvedSnapPoints: x,
          activeSnapPointOffset: y?.offset ?? null,
        };
      },
    ],
    203109,
  );
  var f = e.i(702232);
  let p = i.createContext(null);
  e.s(
    [
      "D",
      0,
      p,
      "L",
      0,
      function (e) {
        let t = i.useContext(p);
        if (!1 === e && null === t) throw Error((0, f.f)(92));
        return t;
      },
    ],
    530215,
  );
};
