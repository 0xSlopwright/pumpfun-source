// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(352386),
    r = e.i(231332),
    i = e.i(92615),
    o = e.i(226115),
    l = e.i(285182),
    a = e.i(575272),
    s = e.i(278051),
    u = e.i(68585),
    c = e.i(648585),
    d = e.i(833551),
    f = e.i(810954),
    p = e.i(998471);
  let g =
      (((t = {})[(t.open = d.q.open)] = "open"),
      (t[(t.closed = d.q.closed)] = "closed"),
      (t[(t.startingStyle = d.q.startingStyle)] = "startingStyle"),
      (t[(t.endingStyle = d.q.endingStyle)] = "endingStyle"),
      (t.nested = "data-nested"),
      (t.nestedDialogOpen = "data-nested-dialog-open"),
      t),
    h = {
      ...d.E,
      ...f.T,
      nested: (e) => (e ? { [g.nested]: "" } : null),
      nestedDialogOpen: (e) => (e ? { [g.nestedDialogOpen]: "" } : null),
    },
    v = n.forwardRef(function (e, t) {
      let { className: n, render: r, children: i, ...o } = e,
        l = (0, p.Z)(),
        { store: a } = (0, u.x)(),
        s = a.useState("open"),
        d = a.useState("nested"),
        f = a.useState("transitionStatus"),
        g = a.useState("nestedOpenDialogCount"),
        v = a.useState("mounted");
      return (0, c.f)("div", e, {
        enabled: l || v,
        state: {
          open: s,
          nested: d,
          transitionStatus: f,
          nestedDialogOpen: g > 0,
        },
        ref: [t, a.useStateSetter("viewportElement")],
        stateAttributesMapping: h,
        props: [
          {
            role: "presentation",
            hidden: !v,
            style: { pointerEvents: s ? void 0 : "none" },
            children: i,
          },
          o,
        ],
      });
    });
  var m = e.i(309899),
    b = e.i(371308),
    x = e.i(203109),
    y = e.i(329985),
    S = e.i(295445),
    w = e.i(430186);
  function _(e, t) {
    let n = (0, i.X)(e);
    if ("vertical" === t) {
      let t = n.overflowY;
      return (
        ("auto" === t || "scroll" === t) && e.scrollHeight > e.clientHeight
      );
    }
    let r = n.overflowX;
    return ("auto" === r || "scroll" === r) && e.scrollWidth > e.clientWidth;
  }
  function E(e, t, n = "vertical") {
    let r = (0, i.E)(e) ? e : null;
    for (; r && r !== t; ) {
      if (_(r, n)) return r;
      r = r.parentElement;
    }
    return _(t, n) ? t : null;
  }
  function C(e, t, n) {
    return "function" == typeof e?.elementFromPoint
      ? e.elementFromPoint(t, n)
      : null;
  }
  function R(e, t, n) {
    switch (e) {
      case "up":
        return -n;
      case "down":
        return n;
      case "left":
        return -t;
      case "right":
        return t;
      default:
        return 0;
    }
  }
  function P(e) {
    return Number.isFinite(e) && e > 0 ? e : null;
  }
  function T(e, t, n) {
    let r = e[n];
    if ("function" == typeof r)
      try {
        r.call(e, t);
      } catch (e) {
        if (
          e &&
          "object" == typeof e &&
          "name" in e &&
          "NotFoundError" === e.name
        )
          return;
        throw e;
      }
  }
  var D = e.i(611960),
    N = e.i(741420),
    A = e.i(264150),
    M = e.i(904440),
    M = M,
    O = e.i(523686),
    I = e.i(530215),
    k = e.i(300310),
    F = e.i(732486);
  let B = n.forwardRef(function (e, t) {
    let { className: c, render: d, children: p, ...g } = e,
      { store: h } = (0, u.x)(),
      {
        swipeDirection: N,
        notifyParentSwipingChange: k,
        notifyParentSwipeProgressChange: B,
        frontmostHeight: H,
        snapToSequentialPoints: K,
      } = (0, b.R)(),
      Z = (0, y.f)(!0),
      G = Z?.visualStateStore,
      J = h.useState("open"),
      Q = h.useState("mounted"),
      ee = h.useState("nested"),
      et = h.useState("nestedOpenDialogCount"),
      en = h.useState("viewportElement"),
      er = h.useState("popupElement"),
      ei = et > 0,
      eo = "left" === N || "right" === N ? "horizontal" : "vertical",
      el = "vertical" === eo,
      ea = el ? "horizontal" : "vertical",
      {
        snapPoints: es,
        resolvedSnapPoints: eu,
        activeSnapPoint: ec,
        activeSnapPointOffset: ed,
        setActiveSnapPoint: ef,
        popupHeight: ep,
      } = (0, x.f)(),
      [eg, eh] = n.useState(null),
      ev = n.useRef(void 0),
      em = n.useRef(null),
      eb = (0, a.z)(),
      ex = n.useRef(!1),
      ey = n.useRef(""),
      eS = n.useRef(!1),
      ew = n.useRef(!1),
      e_ = n.useRef(null),
      eE = n.useMemo(() => {
        if (
          !es ||
          es.length < 2 ||
          ("down" !== N && "up" !== N) ||
          eu.length < 2
        )
          return null;
        let e = eu
          .map((e) => e.offset)
          .filter((e) => Number.isFinite(e))
          .sort((e, t) => e - t);
        if (e.length < 2) return null;
        let t = e[0],
          n = e[1],
          r = e[e.length - 1],
          i = n - t;
        if (!Number.isFinite(i) || i <= 0) {
          let e = r - t;
          if (!Number.isFinite(e) || e <= 0) return null;
          i = e;
        }
        return { minOffset: t, range: i };
      }, [eu, es, N]),
      eC = n.useMemo(
        () =>
          eE && null !== ed
            ? (0, S.f)((ed - eE.minOffset) / eE.range, 0, 1)
            : null,
        [ed, eE],
      ),
      eR = n.useMemo(
        () =>
          es && es.length > 0 && ("down" === N || "up" === N)
            ? "down" === N
              ? ["down", "up"]
              : ["up", "down"]
            : [N],
        [es, N],
      ),
      eP = (0, s.f)((e) => {
        z(h.context.popupRef.current, h.context.backdropRef.current, e);
      }),
      eT = (0, s.f)(() => {
        (eP(!1),
          h.context.popupRef.current?.removeAttribute(f.S.endingStyle),
          eh(null));
      }),
      eD = (0, s.f)(
        ({ resolvedProgress: e, shouldTrackProgress: t, notifyParent: n }) => {
          let r = J && !ee && t,
            i = r ? e : 0;
          (n && B && B(J && t ? e : 0),
            G?.set({ swipeProgress: i, frontmostHeight: i > 0 ? H : 0 }));
          let o = h.context.backdropRef.current;
          if (o) {
            if (!r || i <= 0) {
              (o.style.setProperty(A.f.swipeProgress, "0"),
                o.style.removeProperty(D.f.height));
              return;
            }
            (o.style.setProperty(A.f.swipeProgress, `${i}`),
              H > 0
                ? o.style.setProperty(D.f.height, `${H}px`)
                : o.style.removeProperty(D.f.height));
          }
        },
      ),
      eN = (function (e) {
        let {
            enabled: t,
            directions: r,
            elementRef: i,
            movementCssVars: l,
            canStart: a,
            ignoreSelectorWhenTouch: u = !0,
            ignoreScrollableAncestors: c = !1,
            swipeThreshold: d,
            onDismiss: f,
            onProgress: p,
            onSwipeStart: g,
            onRelease: h,
            onSwipingChange: v,
            trackDrag: m = !0,
          } = e,
          b = 1 === r.length ? r[0] : void 0,
          x = Math.max(0, "number" == typeof d ? d : 40),
          y = r.includes("left"),
          D = r.includes("right"),
          N = r.includes("up"),
          A = r.includes("down"),
          M = y || D,
          O = N || A,
          I = n.useMemo(() => {
            let e = [];
            return (O && e.push("vertical"), M && e.push("horizontal"), e);
          }, [M, O]),
          [k, F] = n.useState(void 0),
          [B, z] = n.useState(!1),
          [j, $] = n.useState(!1),
          [L, H] = n.useState(!1),
          [W, U] = n.useState({ x: 0, y: 0 }),
          [Y, V] = n.useState({ x: 0, y: 0, scale: 1 }),
          [X, q] = n.useState(null),
          K = n.useRef({ x: 0, y: 0 }),
          Z = n.useRef({ x: 0, y: 0 }),
          G = n.useRef(null),
          J = n.useRef({ x: 0, y: 0, scale: 1 }),
          Q = n.useRef(void 0),
          ee = n.useRef(0),
          et = n.useRef(!1),
          en = n.useRef({ x: 0, y: 0 }),
          er = n.useRef(!1),
          ei = n.useRef(!1),
          eo = n.useRef(null),
          el = n.useRef(!1),
          ea = n.useRef(!1),
          es = n.useRef({ width: 0, height: 0 }),
          eu = n.useRef(0),
          ec = n.useRef(x),
          ed = n.useRef(null),
          ef = n.useRef(null),
          ep = n.useRef({ x: 0, y: 0 }),
          eg = n.useRef(null),
          eh = n.useRef(!1),
          ev = (0, s.f)((e) => {
            eh.current !== e && ((eh.current = e), z(e), v?.(e));
          });
        function em(e) {
          if (!e) return;
          if ("function" != typeof d) {
            ec.current = x;
            return;
          }
          let t = i.current;
          t && (ec.current = Math.max(0, d({ element: t, direction: e })));
        }
        let eb = (0, s.f)((e, t) => {
          let n = Number.isFinite(e) ? (0, S.f)(e, 0, 1) : 0,
            r = n !== eu.current,
            i = !1;
          if (t) {
            let e = eg.current;
            i =
              !e ||
              e.deltaX !== t.deltaX ||
              e.deltaY !== t.deltaY ||
              e.direction !== t.direction;
          }
          (r || i) &&
            ((eu.current = n),
            t ? (eg.current = t) : r && (eg.current = null),
            p?.(n, t));
        });
        function ex(e, t) {
          if (null === t) return;
          let n = ef.current;
          if (n && t > n.time) {
            let r = Math.max(t - n.time, 16);
            ep.current = { x: (e.x - n.x) / r, y: (e.y - n.y) / r };
          }
          ef.current = { x: e.x, y: e.y, time: t };
        }
        let ey = n.useCallback(() => {
          (F(void 0),
            ev(!1),
            $(!1),
            H(!1),
            U({ x: 0, y: 0 }),
            V({ x: 0, y: 0, scale: 1 }),
            q(null),
            eb(0),
            (ec.current = x),
            (K.current = { x: 0, y: 0 }),
            (Z.current = { x: 0, y: 0 }),
            (J.current = { x: 0, y: 0, scale: 1 }),
            (Q.current = void 0),
            (ee.current = 0),
            (et.current = !1),
            (en.current = { x: 0, y: 0 }),
            (er.current = !1),
            (G.current = null),
            (ei.current = !1),
            (eo.current = null),
            (el.current = !1),
            (ea.current = !1),
            (es.current = { width: 0, height: 0 }),
            (ed.current = null),
            (ef.current = null),
            (ep.current = { x: 0, y: 0 }),
            (eg.current = null));
        }, [ev, x, eb]);
        function eS(e) {
          if ("touches" in e) {
            let t = e.touches[0];
            return t ? { x: t.clientX, y: t.clientY } : null;
          }
          return { x: e.clientX, y: e.clientY };
        }
        function ew(e) {
          return "touches" in e || "touch" === e.pointerType;
        }
        function e_(e, t) {
          return C((0, o.f)(i.current), e.x, e.y) ?? (0, w.Z)(t);
        }
        function eE(e, t) {
          return M && !O
            ? E(e, t, "horizontal")
            : O && !M
              ? E(e, t, "vertical")
              : (E(e, t, "vertical") ?? E(e, t, "horizontal"));
        }
        function eC(e, t, n) {
          el.current = !1;
          let r = ew(e),
            l = e_(t, e.nativeEvent),
            a = (0, o.f)(i.current).body,
            s = r && a ? eE(l, a) : null,
            d = n?.ignoreScrollableTarget ?? !1;
          if (
            (s && !d) ||
            ((el.current = !!(s && d)),
            l &&
              l.closest(
                'button,a,input,select,textarea,label,[role="button"]',
              ) &&
              (!r || u))
          )
            return !1;
          let f = i.current;
          if (
            c &&
            f &&
            l &&
            I.length > 0 &&
            !n?.ignoreScrollableAncestors &&
            (function (e, t, n) {
              let r = e;
              for (; r && r !== t; ) {
                for (let e of n) if (_(r, e)) return !0;
                r = r.parentElement;
              }
              return !1;
            })(l, f, I)
          )
            return !1;
          if (
            ((et.current = !1),
            (Q.current = void 0),
            (ee.current = 0),
            (K.current = t),
            (ed.current = P(e.timeStamp)),
            (en.current = t),
            (G.current = t),
            f)
          ) {
            ((es.current = { width: f.offsetWidth, height: f.offsetHeight }),
              em(b));
            let t = (function (e) {
              let t = window.getComputedStyle(e).transform,
                n = 0,
                r = 0,
                i = 1;
              if (t && "none" !== t) {
                let e = t.match(/matrix(?:3d)?\(([^)]+)\)/);
                if (e) {
                  let t = e[1].split(", ").map(parseFloat);
                  6 === t.length
                    ? ((n = t[4]),
                      (r = t[5]),
                      (i = Math.sqrt(t[0] * t[0] + t[1] * t[1])))
                    : 16 === t.length && ((n = t[12]), (r = t[13]), (i = t[0]));
                }
              }
              return { x: n, y: r, scale: i };
            })(f);
            ((J.current = t),
              (Z.current = { x: t.x, y: t.y }),
              V(t),
              U({ x: t.x, y: t.y }),
              ex({ x: t.x, y: t.y }, ed.current),
              "touches" in e || T(f, e.pointerId, "setPointerCapture"));
          }
          return (
            g?.(e.nativeEvent),
            ev(!0),
            $(!1),
            q(null),
            (er.current = !0),
            eb(0),
            !0
          );
        }
        function eR() {
          (eP(), (el.current = !1), (G.current = null));
        }
        function eP() {
          ((ei.current = !1), (eo.current = null));
        }
        n.useEffect(() => {
          "function" != typeof d && (ec.current = x);
        }, [x, d]);
        let eT = (0, s.f)((e) => {
            if (
              !t ||
              e.defaultPrevented ||
              e.nativeEvent.defaultPrevented ||
              (!("touches" in e) && 0 !== e.button)
            )
              return;
            let n = eS(e);
            !n ||
              ((ei.current = !0),
              (eo.current = n),
              (el.current = !1),
              (ea.current = !1),
              (!a || a(n, { nativeEvent: e.nativeEvent, direction: b })) &&
                eC(e, n) &&
                eP());
          }),
          eD = (0, s.f)((e) => {
            let n = eS(e);
            if (!n) return;
            if (!("touches" in e)) {
              let t = e.buttons % 2 == 1;
              t && (ea.current = !0);
              let n = 0 === e.buttons && ea.current;
              if ((0 !== e.buttons && !t) || n)
                return void (function (e) {
                  if ((eR(), !eh.current)) return;
                  (ev(!1), $(!1), q(null));
                  let t = m ? Y : J.current;
                  ((Z.current = { x: t.x, y: t.y }),
                    U({ x: t.x, y: t.y }),
                    F(void 0),
                    (ea.current = !1));
                  let n = i.current;
                  (n && T(n, e.pointerId, "releasePointerCapture"),
                    eb(0, { deltaX: 0, deltaY: 0, direction: void 0 }));
                })(e);
            }
            if (!B && ei.current) {
              if (
                !ew(e) &&
                (e.defaultPrevented || e.nativeEvent.defaultPrevented)
              )
                return void eR();
              if (!a || a(n, { nativeEvent: e.nativeEvent, direction: b })) {
                let t = eo.current,
                  r = !1;
                if (ew(e)) {
                  let l = i.current;
                  if (t && l) {
                    let i = e_(n, e.nativeEvent),
                      a = (0, o.f)(l).body,
                      s = a ? eE(i, a) : null;
                    if (s && ((0, w.I)(l, s) || (0, w.I)(s, l))) {
                      let e = (function (e, t, n) {
                        let r = Math.abs(t),
                          i = Math.abs(n);
                        if (O && 0 !== n && (!M || i >= r)) {
                          let t = Math.max(0, e.scrollHeight - e.clientHeight),
                            r = e.scrollTop <= 0,
                            i = e.scrollTop >= t,
                            o = n > 0 && r && A,
                            l = n < 0 && i && N;
                          return o || l;
                        }
                        if (M && 0 !== t && (!O || r > i)) {
                          let n = Math.max(0, e.scrollWidth - e.clientWidth),
                            r = e.scrollLeft <= 0,
                            i = e.scrollLeft >= n,
                            o = t > 0 && r && D,
                            l = t < 0 && i && y;
                          return o || l;
                        }
                        return null;
                      })(s, n.x - t.x, n.y - t.y);
                      if (!1 === e) return;
                      !0 === e && (r = !0);
                    }
                  }
                }
                eC(e, n, {
                  ignoreScrollableTarget: r,
                  ignoreScrollableAncestors: r,
                }) &&
                  (t && r
                    ? (eP(),
                      (K.current = t),
                      (en.current = t),
                      (G.current = t),
                      (er.current = !1))
                    : (eP(), (el.current = !1)));
              }
            }
            let r = G.current,
              l = null === r ? { x: 0, y: 0 } : { x: n.x - r.x, y: n.y - r.y };
            ((G.current = n),
              (function (e, n, r) {
                let i, o, l;
                if (!t || !eh.current) return;
                let a = (0, w.Z)(e.nativeEvent);
                if (ew(e) && !el.current && eE(a, e.currentTarget)) return;
                if (("touches" in e || e.preventDefault(), er.current)) {
                  K.current = n;
                  let t = P(e.timeStamp);
                  (null !== t && (ed.current = t), (er.current = !1));
                }
                let s = n.x,
                  u = n.y,
                  c = r.x,
                  d = r.y;
                (((d < 0 && u > en.current.y) || (d > 0 && u < en.current.y)) &&
                  (en.current = { x: en.current.x, y: u }),
                  ((c < 0 && s > en.current.x) ||
                    (c > 0 && s < en.current.x)) &&
                    (en.current = { x: s, y: en.current.y }));
                let f = s - K.current.x,
                  p = u - K.current.y,
                  g = u - en.current.y,
                  h = s - en.current.x;
                if (
                  (!j &&
                    Math.sqrt(f * f + p * p) >= 1 &&
                    ($(!0),
                    null === X &&
                      M &&
                      O &&
                      q(Math.abs(f) > Math.abs(p) ? "horizontal" : "vertical")),
                  Q.current)
                ) {
                  let e = Q.current,
                    t = R(e, h, g);
                  t > ec.current
                    ? ((et.current = !1), F(e))
                    : (y && D) ||
                      (N && A) ||
                      !(ee.current - t >= 10) ||
                      (et.current = !0);
                } else
                  ("vertical" === X
                    ? p > 0
                      ? (i = "down")
                      : p < 0 && (i = "up")
                    : "horizontal" === X
                      ? f > 0
                        ? (i = "right")
                        : f < 0 && (i = "left")
                      : (i =
                          Math.abs(f) >= Math.abs(p)
                            ? f > 0
                              ? "right"
                              : "left"
                            : p > 0
                              ? "down"
                              : "up"),
                    i &&
                      (("left" === i && y) ||
                        ("right" === i && D) ||
                        ("up" === i && N) ||
                        ("down" === i && A)) &&
                      ((Q.current = i),
                      (ee.current = R(i, f, p)),
                      F(i),
                      em(i)));
                let v =
                    ((o = (e) => (e >= 0 ? e ** 0.5 : -(Math.abs(e) ** 0.5))),
                    (l = (e, t, n) =>
                      (!t && e < 0) || (!n && e > 0) ? o(e) : e),
                    { x: M ? l(f, y, D) : o(f), y: O ? l(p, N, A) : o(p) }),
                  x = J.current.x,
                  S = J.current.y;
                ("horizontal" === X
                  ? M && (x += v.x)
                  : ("vertical" === X || (M && (x += v.x)), O && (S += v.y)),
                  (Z.current = { x: x, y: S }),
                  m && U({ x: x, y: S }),
                  ex({ x: x, y: S }, P(e.timeStamp)));
                let _ = x - J.current.x,
                  E = S - J.current.y,
                  C = Q.current,
                  T = b ?? Q.current;
                if (!T) return eb(0, { deltaX: _, deltaY: E, direction: C });
                let I =
                    "left" === T || "right" === T
                      ? es.current.width
                      : es.current.height,
                  k = J.current.scale || 1;
                if (I <= 0 || k <= 0)
                  return eb(0, { deltaX: _, deltaY: E, direction: C });
                let B = R(T, x - J.current.x, S - J.current.y);
                B <= 0
                  ? eb(0, { deltaX: _, deltaY: E, direction: C })
                  : eb(B / (I * k), { deltaX: _, deltaY: E, direction: C });
              })(e, n, l));
          }),
          eN = (0, s.f)((e) => {
            let n;
            if (!t) return;
            let o = Z.current,
              l = J.current,
              a = o.x - l.x,
              s = o.y - l.y,
              u = { deltaX: a, deltaY: s, direction: k ?? Q.current };
            if (!eh.current) {
              (eR(), eb(0, u));
              return;
            }
            (ev(!1), $(!1), q(null), eR(), (ea.current = !1));
            let c = i.current;
            !c || "touches" in e || T(c, e.pointerId, "releasePointerCapture");
            let d = ed.current,
              p = P(e.timeStamp),
              g = null !== d && null !== p && p > d ? p - d : 0,
              v = g > 0 ? Math.max(g, 50) : 0,
              m = ep.current.x,
              x = ep.current.y,
              y = ef.current;
            if (y && null !== p && p >= y.time) {
              let e = p - y.time;
              if (e <= 80) {
                let t = Math.max(e, 16),
                  n = o.x - y.x,
                  r = o.y - y.y,
                  i = n / t,
                  l = r / t;
                (0 !== i && (m = i), 0 !== l && (x = l));
              } else ((m = 0), (x = 0));
            }
            let S = h?.({
                event: e.nativeEvent,
                direction: k ?? Q.current,
                deltaX: a,
                deltaY: s,
                velocityX: v > 0 ? a / v : 0,
                velocityY: v > 0 ? s / v : 0,
                releaseVelocityX: m,
                releaseVelocityY: x,
              }),
              w = "boolean" == typeof S;
            if (et.current && !w) {
              ((Z.current = { x: l.x, y: l.y }),
                U({ x: l.x, y: l.y }),
                F(void 0),
                eb(0, u));
              return;
            }
            let _ = !1;
            if (w) ((_ = S), (n = k ?? Q.current ?? b));
            else
              for (let e of r) {
                switch (e) {
                  case "right":
                    a > ec.current && ((_ = !0), (n = "right"));
                    break;
                  case "left":
                    a < -ec.current && ((_ = !0), (n = "left"));
                    break;
                  case "down":
                    s > ec.current && ((_ = !0), (n = "down"));
                    break;
                  case "up":
                    s < -ec.current && ((_ = !0), (n = "up"));
                }
                if (_) break;
              }
            _ && n
              ? (F(n), H(!0), f?.(e.nativeEvent, { direction: n }))
              : ((Z.current = { x: l.x, y: l.y }),
                U({ x: l.x, y: l.y }),
                F(void 0),
                eb(0, u));
          }),
          eA = n.useCallback(() => {
            let e = m ? W : Z.current,
              t = m ? Y : J.current;
            if (!B && e.x === t.x && e.y === t.y && !L)
              return { [l.x]: "0px", [l.y]: "0px" };
            let n = e.x - t.x,
              r = e.y - t.y;
            return {
              transition: B ? "none" : void 0,
              transform: B
                ? `translateX(${e.x}px) translateY(${e.y}px) scale(${t.scale})`
                : void 0,
              [l.x]: `${n}px`,
              [l.y]: `${r}px`,
            };
          }, [L, W, Y, B, l, m]);
        return {
          swiping: B,
          swipeDirection: k,
          dragDismissed: L,
          getPointerProps: n.useCallback(
            () =>
              t
                ? {
                    onPointerDown: eT,
                    onPointerMove: eD,
                    onPointerUp: eN,
                    onPointerCancel: eN,
                  }
                : {},
            [t, eN, eD, eT],
          ),
          getTouchProps: n.useCallback(
            () =>
              t
                ? {
                    onTouchStart: eT,
                    onTouchMove: eD,
                    onTouchEnd: eN,
                    onTouchCancel: eN,
                  }
                : {},
            [t, eN, eD, eT],
          ),
          getDragStyles: eA,
          reset: ey,
        };
      })({
        enabled: Q && !ei,
        directions: eR,
        elementRef: h.context.popupRef,
        ignoreSelectorWhenTouch: !1,
        ignoreScrollableAncestors: !0,
        movementCssVars: { x: D.f.swipeMovementX, y: D.f.swipeMovementY },
        onSwipeStart(e) {
          if (
            "touches" in e ||
            ("pointerType" in e && "touch" === e.pointerType)
          )
            return;
          let t = h.context.popupRef.current;
          if (!t) return;
          let n = (0, o.f)(t),
            r = n.getSelection?.();
          if (!r || r.isCollapsed) return;
          let l = (0, i.m)(r.anchorNode)
              ? r.anchorNode
              : r.anchorNode?.parentElement,
            a = (0, i.m)(r.focusNode)
              ? r.focusNode
              : r.focusNode?.parentElement;
          ((0, w.I)(t, l) || (0, w.I)(t, a)) && r.removeAllRanges();
        },
        onSwipingChange(e) {
          (j(h.context.backdropRef.current, e),
            e || ((ex.current = !1), k?.(!1)));
        },
        swipeThreshold: ({ element: e, direction: t }) => L(e, t),
        canStart(e, t) {
          let n = h.context.popupRef.current;
          if (!n) return !1;
          let r = n.ownerDocument,
            i = C(r, e.x, e.y);
          if (!i || !(0, w.I)(n, i)) return !1;
          let o = t.nativeEvent;
          return !(
            (("touches" in o ||
              ("pointerType" in o && "touch" === o.pointerType)) &&
              W(r, n)) ||
            ("touchstart" === o.type && $(i))
          );
        },
        onProgress(e, t) {
          !(function (e) {
            if (ex.current || !e) return;
            let t = e.direction ?? N,
              n = "left" === t || "right" === t ? e.deltaX : e.deltaY;
            !Number.isFinite(n) ||
              10 > Math.abs(n) ||
              ((ex.current = !0), k?.(!0));
          })(t);
          let n = t?.direction ?? eN.swipeDirection,
            r = void 0 === n || n === N,
            i = !!(es && es.length > 0),
            o = "down" === N || "up" === N,
            l = (i && o) || !i || "left" === N || "right" === N || r,
            a = e;
          if (eE && ep > 0) {
            if (t && Number.isFinite(t.deltaY)) {
              let e = ed ?? eE.minOffset,
                n = (0, S.f)(e + t.deltaY, 0, ep);
              a = (0, S.f)((n - eE.minOffset) / eE.range, 0, 1);
            } else if (null !== eC) a = eC;
            else if ("down" === n || "up" === n) {
              let t = e * ep,
                r = ed ?? eE.minOffset;
              a = (0, S.f)(
                (("down" === n ? r + t : r - t) - eE.minOffset) / eE.range,
                0,
                1,
              );
            }
          }
          eD({ resolvedProgress: a, shouldTrackProgress: l, notifyParent: !0 });
        },
        onRelease({
          event: e,
          deltaX: t,
          deltaY: n,
          direction: i,
          velocityX: o,
          velocityY: l,
          releaseVelocityX: a,
          releaseVelocityY: s,
        }) {
          let u = {
            deltaX: t,
            deltaY: n,
            velocityX: o,
            velocityY: l,
            releaseVelocityX: a,
            releaseVelocityY: s,
          };
          function c(e) {
            let t = h.context.popupRef.current;
            t &&
              (k?.(!1),
              eP(!0),
              t.style.removeProperty("transition"),
              t.setAttribute(f.S.endingStyle, ""),
              r.flushSync(() => {
                eh(
                  (function ({
                    direction: e,
                    deltaX: t,
                    deltaY: n,
                    velocityX: r,
                    velocityY: i,
                    releaseVelocityX: o,
                    releaseVelocityY: l,
                  }) {
                    if (!e) return null;
                    let a = h.context.popupRef.current;
                    if (!a) return null;
                    let s =
                      "left" === e || "right" === e
                        ? a.offsetWidth
                        : a.offsetHeight;
                    if (!Number.isFinite(s) || s <= 0) return null;
                    let u = es && es.length > 0 ? (ed ?? 0) : 0,
                      c = 0;
                    "down" === e ? (c = u) : "up" === e && (c = -u);
                    let d = c + ("left" === e || "right" === e ? t : n),
                      f = Math.max(
                        0,
                        s - ("left" === e || "up" === e ? -d : d),
                      );
                    if (!Number.isFinite(f) || f <= 0) return null;
                    let p = "left" === e || "right" === e ? o : l,
                      g =
                        Math.abs(p) > 0 && Number.isFinite(p)
                          ? p
                          : "left" === e || "right" === e
                            ? r
                            : i,
                      v = "left" === e || "up" === e ? -g : g;
                    if (!Number.isFinite(v) || v <= 0.2) return null;
                    let m = (0, S.f)(v, 0.2, 4),
                      b = (0, S.f)(f / m, 80, 360);
                    if (!Number.isFinite(b)) return null;
                    let x = (0, S.f)(0.1 + ((b - 80) / 280) * 0.9, 0.1, 1);
                    return !Number.isFinite(x) || x <= 0 ? null : x;
                  })({ direction: e, ...u }),
                );
              }));
          }
          if (!es || 0 === es.length) {
            if (!i) return void eT();
            let e = h.context.popupRef.current;
            if (!e) return void eT();
            let r = L(e, i),
              a = "left" === i || "right" === i ? t : n;
            if (!Number.isFinite(a)) return void eT();
            let s = "left" === i || "up" === i ? -a : a;
            if (s <= 0) return (eT(), !1);
            let u = "left" === i || "right" === i ? o : l;
            if (("left" === i || "up" === i ? -u : u) >= 0.5 && s > 0)
              return (c(i), !0);
            let d = s > r;
            return (d ? c(i) : eT(), d);
          }
          if (("down" !== N && "up" !== N) || !ep || 0 === eu.length)
            return void eT();
          let d = "down" === N ? n : -n;
          if (!Number.isFinite(d)) return void eT();
          let p = Math.sign(d),
            g = "down" === N ? s : -s,
            v = "down" === N ? l : -l,
            m = Number.isFinite(g) ? g : v;
          if (0 !== p && Math.abs(d) >= 10 && Number.isFinite(m)) {
            let e = Math.sign(m);
            0 !== e && e !== p && (m = v);
          }
          let b = ed ?? 0,
            x = (0, S.f)(b + d, 0, ep),
            y =
              Number.isFinite(m) && Math.abs(m) >= 0.5
                ? 300 * (0, S.f)(m, -4, 4)
                : 0,
            w = K ? x : (0, S.f)(x + y, 0, ep),
            _ = (0, O.f)(M.swipe, e),
            E = () => ((ev.current = ec), ef?.(null, _), c(N), !0);
          if (K) {
            let e = [...eu].sort((e, t) => e.offset - t.offset);
            if (0 === e.length) return (eT(), !1);
            let t = 0,
              n = Math.abs(b - e[0].offset);
            for (let r = 1; r < e.length; r += 1) {
              let i = Math.abs(b - e[r].offset);
              i < n && ((n = i), (t = r));
            }
            let r = e[0];
            for (let t of ((n = Math.abs(w - r.offset)), e)) {
              let e = Math.abs(w - t.offset);
              e < n && ((n = e), (r = t));
            }
            let i = Math.sign(m),
              o = w;
            if (0 !== p && 0 !== i && i === p && Math.abs(m) >= 0.5) {
              let n = (0, S.f)(t + p, 0, e.length - 1);
              if (n !== t) {
                let t = e[n];
                (p > 0 ? w < t.offset : w > t.offset) &&
                  ((r = t), (o = t.offset));
              } else if (p > 0) return E();
            }
            return Math.abs(o - ep) < Math.abs(o - r.offset)
              ? E()
              : (ef?.(r.value, _), eT(), !1);
          }
          if (m >= 0.5 && d > 0) return E();
          let C = eu[0],
            R = Math.abs(w - C.offset);
          for (let e of eu) {
            let t = Math.abs(w - e.offset);
            t < R && ((R = t), (C = e));
          }
          return Math.abs(w - ep) < R ? E() : (ef?.(C.value, _), eT(), !1);
        },
        onDismiss(e) {
          G?.set({ swipeProgress: 0, frontmostHeight: 0 });
          let t = h.context.backdropRef.current;
          t &&
            (t.style.setProperty(A.f.swipeProgress, "0"),
            t.style.removeProperty(D.f.height));
          let n = (0, O.f)(M.swipe, e);
          if ((h.setOpen(!1, n), n.isCanceled)) {
            let t = ev.current;
            (void 0 !== t && ef?.(t, (0, O.f)(M.swipe, e)),
              (ev.current = void 0),
              em.current?.(),
              eT());
            return;
          }
          h.select("open")
            ? eb.request(() => {
                if (h.select("open")) {
                  let t = ev.current;
                  (void 0 !== t && ef?.(t, (0, O.f)(M.swipe, e)),
                    (ev.current = void 0),
                    eT(),
                    em.current?.());
                } else ev.current = void 0;
              })
            : ((ev.current = void 0), eP(!0));
        },
      }),
      eA = eN.getPointerProps(),
      eM = eN.getTouchProps(),
      eO = eN.reset;
    ((em.current = eO),
      n.useEffect(() => {
        let e = en ?? er;
        if (!e) return;
        let t = (0, o.f)(e),
          n = (0, l.f)(t);
        function r(r) {
          var i;
          if (ew.current) return;
          let o = e_.current,
            l = r.touches[0];
          if (!l || !o) return;
          let a = el ? l.clientY - o.lastY : l.clientX - o.lastX;
          if (U(r, n)) {
            ((o.allowSwipe = !1), V(o, l));
            return;
          }
          if (
            2 === r.touches.length ||
            W(t, e) ||
            !J ||
            !Q ||
            ei ||
            (function (e, t, n) {
              if (e.preserveNativeCrossAxisScroll) return !0;
              if (!0 === e.allowSwipe || !e.hasCrossAxisScrollableContent)
                return !1;
              let r = n ? t.clientY - e.startY : t.clientX - e.startX,
                i = n ? t.clientX - e.startX : t.clientY - e.startY,
                o = Math.abs(r),
                l = Math.abs(i);
              return (
                !(l < 6) &&
                !(l <= o + 2) &&
                ((e.preserveNativeCrossAxisScroll = !0), !0)
              );
            })(o, l, el)
          )
            return void V(o, l);
          let s = o.scrollTarget;
          if (
            !s ||
            s === t.documentElement ||
            s === t.body ||
            ((i = s),
            "vertical" === eo
              ? !(i.scrollHeight > i.clientHeight)
              : !(i.scrollWidth > i.clientWidth))
          ) {
            (r.cancelable && r.preventDefault(), V(o, l));
            return;
          }
          if (0 !== a) {
            let e = (function (e, t, n, r) {
              let { offset: i, max: o } = X(e, t),
                l = q(n, t);
              return (
                null !== l && !!(l ? r > 0 : r < 0) && (l ? i <= 0 : i >= o)
              );
            })(s, eo, N, a);
            o.allowSwipe
              ? r.cancelable && r.preventDefault()
              : r.cancelable && e
                ? ((o.allowSwipe = !0), r.preventDefault())
                : (o.allowSwipe = !1);
          }
          V(o, l);
        }
        return (
          t.addEventListener("touchmove", r, { passive: !1, capture: !0 }),
          () => {
            t.removeEventListener("touchmove", r, { capture: !0 });
          }
        );
      }, [Q, ei, J, er, el, eo, N, en]),
      n.useEffect(() => {
        !eE ||
          eN.swiping ||
          eD({
            resolvedProgress: !J || ee ? 0 : (eC ?? 0),
            shouldTrackProgress: !0,
            notifyParent: !1,
          });
      }, [eD, H, ee, B, J, eC, eE, eN.swiping, h, G]),
      n.useEffect(() => {
        if (B)
          return (
            J || B(0),
            () => {
              B(0);
            }
          );
      }, [B, J]),
      n.useEffect(() => {
        J && (eO(), eT());
      }, [eT, J, eO]),
      n.useEffect(
        () => () => {
          (G?.set({ swipeProgress: 0, frontmostHeight: 0 }),
            j(h.context.backdropRef.current, !1),
            k?.(!1));
        },
        [k, h, G],
      ));
    let eI = n.useMemo(
      () => ({
        swiping: eN.swiping,
        getDragStyles: eN.getDragStyles,
        swipeStrength: eg ?? null,
        setSwipeDismissed(e) {
          z(h.context.popupRef.current, h.context.backdropRef.current, e);
        },
      }),
      [h, eN.getDragStyles, eN.swiping, eg],
    );
    function ek() {
      ((ew.current = !1),
        (e_.current = null),
        (ey.current = ""),
        (eS.current = !1));
    }
    return (0, F.jsx)(v, {
      ref: t,
      className: c,
      render: d,
      ...(0, m.w)(g, {
        onPointerDown(e) {
          var t;
          if (
            ((ey.current = e.pointerType),
            (eS.current = "pen" === e.pointerType),
            !J || !Q || ei)
          )
            return;
          let n = C((0, o.f)(e.currentTarget), e.clientX, e.clientY);
          $(n) ||
            ((t = n), t?.closest("[data-drawer-content]")) ||
            ("touch" !== e.pointerType && eA.onPointerDown?.(e));
        },
        onPointerMove(e) {
          "touch" !== e.pointerType && eA.onPointerMove?.(e);
        },
        onPointerUp(e) {
          (ey.current === e.pointerType && (ey.current = ""),
            "touch" !== e.pointerType && eA.onPointerUp?.(e));
        },
        onPointerCancel(e) {
          (ey.current === e.pointerType && (ey.current = ""),
            "touch" !== e.pointerType && eA.onPointerCancel?.(e));
        },
        onTouchStart(e) {
          if ("pen" === ey.current && eS.current) {
            ((eS.current = !1), (ew.current = !1), (e_.current = null));
            return;
          }
          if (!J || !Q || ei) {
            ((ew.current = !1), (e_.current = null));
            return;
          }
          let t = e.touches[0];
          if (!t) return;
          if (Y(e)) {
            ((ew.current = !1), (e_.current = null));
            return;
          }
          if (
            ((ew.current = $(
              C((0, o.f)(e.currentTarget), t.clientX, t.clientY),
            )),
            ew.current)
          ) {
            e_.current = null;
            return;
          }
          let n = en ?? er,
            r = (0, i.m)(e.target) ? e.target : null,
            l = null,
            a = !1;
          n &&
            r &&
            (0, w.I)(n, r) &&
            ((l = E(r, n, eo)), (a = null != E(r, n, ea)));
          let s = null;
          (l &&
            (s =
              !!(function (e, t, n) {
                let { offset: r, max: i } = X(e, t),
                  o = q(n, t);
                return null !== o && (o ? r <= 0 : r >= i);
              })(l, eo, N) && null),
            (e_.current = {
              startX: t.clientX,
              startY: t.clientY,
              lastX: t.clientX,
              lastY: t.clientY,
              scrollTarget: l,
              hasCrossAxisScrollableContent: a,
              allowSwipe: s,
              preserveNativeCrossAxisScroll: !1,
            }),
            eM.onTouchStart?.(e));
        },
        onTouchMove(e) {
          if (ew.current || Y(e)) return;
          let t = e_.current;
          t?.preserveNativeCrossAxisScroll ||
            (t?.allowSwipe !== !1 &&
              (t?.scrollTarget == null || t.allowSwipe) &&
              eM.onTouchMove?.(e));
        },
        onTouchEnd(e) {
          (ek(), eM.onTouchEnd?.(e));
        },
        onTouchCancel(e) {
          (ek(), eM.onTouchCancel?.(e));
        },
        "data-nested-dialog-open": void 0,
      }),
      children: (0, F.jsx)(I.D.Provider, { value: eI, children: p }),
    });
  });
  function z(e, t, n) {
    if (n) {
      (e?.setAttribute(N.f.swipeDismiss, ""),
        t?.setAttribute(N.f.swipeDismiss, ""));
      return;
    }
    (e?.removeAttribute(N.f.swipeDismiss),
      t?.removeAttribute(N.f.swipeDismiss));
  }
  function j(e, t) {
    if (e) {
      if (t) return void e.setAttribute(N.f.swiping, "");
      e.removeAttribute(N.f.swiping);
    }
  }
  function $(e) {
    return !!e?.closest(k.u);
  }
  function L(e, t) {
    return Math.max(
      0.5 * ("left" === t || "right" === t ? e.offsetWidth : e.offsetHeight),
      10,
    );
  }
  function H(e, t) {
    return e instanceof t.HTMLInputElement && "range" === e.type;
  }
  function W(e, t) {
    let n,
      r,
      o = e.activeElement;
    if (
      o &&
      (0, w.I)(t, o) &&
      (0, i.m)(o) &&
      ("INPUT" === o.tagName || "TEXTAREA" === o.tagName)
    ) {
      let { selectionStart: e, selectionEnd: t } = o;
      if (null != e && null != t && e < t) return !0;
    }
    let l = e.getSelection?.();
    return (
      !!l &&
      !l.isCollapsed &&
      ((n = (0, i.m)(l.anchorNode)
        ? l.anchorNode
        : l.anchorNode?.parentElement),
      (r = (0, i.m)(l.focusNode) ? l.focusNode : l.focusNode?.parentElement),
      l.containsNode(t, !0) || (0, w.I)(t, n) || (0, w.I)(t, r))
    );
  }
  function U(e, t) {
    let n = e.composedPath();
    return n ? n.some((e) => H(e, t)) : H(e.target, t);
  }
  function Y(e) {
    return U(e.nativeEvent, (0, l.f)(e.currentTarget));
  }
  function V(e, t) {
    ((e.lastX = t.clientX), (e.lastY = t.clientY));
  }
  function X(e, t) {
    if ("vertical" === t) {
      let t = Math.max(0, e.scrollHeight - e.clientHeight);
      return { offset: e.scrollTop, max: t };
    }
    let n = Math.max(0, e.scrollWidth - e.clientWidth);
    return { offset: e.scrollLeft, max: n };
  }
  function q(e, t) {
    return "vertical" === t
      ? "down" === e || ("up" !== e && null)
      : "right" === e || ("left" !== e && null);
  }
  e.s(["DrawerViewport", 0, B], 274119);
};
