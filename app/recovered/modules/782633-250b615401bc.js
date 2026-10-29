// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(278051),
    r = e.i(565693),
    i = e.i(138878),
    o = e.i(617821),
    l = e.i(845891),
    a = e.i(425939),
    s = e.i(338868);
  let u = [];
  var c = e.i(509015),
    d = e.i(648585),
    f = e.i(378317),
    p = e.i(297454),
    g = e.i(732486);
  function h(e) {
    let {
        render: r,
        className: h,
        refs: v = p.v,
        props: m = p.v,
        state: b = p.w,
        stateAttributesMapping: x,
        highlightedIndex: y,
        onHighlightedIndexChange: S,
        orientation: w,
        dense: _,
        itemSizes: E,
        loopFocus: C,
        cols: R,
        enableHomeAndEndKeys: P,
        onMapChange: T,
        stopEventPropagation: D = !0,
        rootRef: N,
        disabledIndices: A,
        modifierKeys: M,
        highlightItemOnHover: O = !1,
        tag: I = "div",
        ...k
      } = e,
      {
        props: F,
        highlightedIndex: B,
        onHighlightedIndexChange: z,
        elementsRef: j,
        onMapChange: $,
        relayKeyboardEvent: L,
      } = (function (e) {
        let {
            itemSizes: r,
            cols: i = 1,
            loopFocus: c = !0,
            dense: d = !1,
            orientation: f = "both",
            direction: p,
            highlightedIndex: g,
            onHighlightedIndexChange: h,
            rootRef: v,
            enableHomeAndEndKeys: m = !1,
            stopEventPropagation: b = !1,
            disabledIndices: x,
            modifierKeys: y = u,
          } = e,
          [S, w] = t.useState(0),
          _ = i > 1,
          E = t.useRef(null),
          C = (0, o.A)(E, v),
          R = t.useRef([]),
          P = t.useRef(!1),
          T = g ?? S,
          D = (0, n.f)((e, t = !1) => {
            if (((h ?? w)(e), t)) {
              let t = R.current[e];
              (0, l.l)(E.current, t, p, f);
            }
          }),
          N = (0, n.f)((e) => {
            if (0 === e.size || P.current) return;
            P.current = !0;
            let t = Array.from(e.keys()),
              n = t.find((e) => e?.hasAttribute(s.f)) ?? null,
              r = n ? t.indexOf(n) : -1;
            (-1 !== r && D(r), (0, l.l)(E.current, n, p, f));
          }),
          A = t.useMemo(
            () => ({
              "aria-orientation": "both" === f ? void 0 : f,
              ref: C,
              onFocus(e) {
                E.current &&
                  (0, l.X)(e.target) &&
                  e.target.setSelectionRange(0, e.target.value.length ?? 0);
              },
              onKeyDown(e) {
                var t;
                let n = m ? l.O : l.P;
                if (
                  !n.has(e.key) ||
                  (function (e, t) {
                    for (let n of l.a.values())
                      if (!t.includes(n) && e.getModifierState(n)) return !0;
                    return !1;
                  })(e, y) ||
                  !E.current
                )
                  return;
                let o = "rtl" === p,
                  s = o ? l.b : l.q,
                  u = { horizontal: s, vertical: l.e, both: s }[f],
                  g = o ? l.q : l.b,
                  h = { horizontal: g, vertical: l.V, both: g }[f];
                if (
                  (0, l.X)(e.target) &&
                  !(
                    null == (t = e.target) ||
                    t.hasAttribute("disabled") ||
                    "true" === t.getAttribute("aria-disabled")
                  )
                ) {
                  let t = e.target.selectionStart,
                    n = e.target.selectionEnd,
                    r = e.target.value ?? "";
                  if (
                    null == t ||
                    e.shiftKey ||
                    t !== n ||
                    (e.key !== h && t < r.length) ||
                    (e.key !== u && t > 0)
                  )
                    return;
                }
                let v = T,
                  S = (0, a.J)(R, x),
                  w = (0, a._)(R, x);
                if (_) {
                  let t =
                      r ||
                      Array.from({ length: R.current.length }, () => ({
                        width: 1,
                        height: 1,
                      })),
                    n = (0, a.N)(t, i, d),
                    s = n.findIndex((e) => null != e && !(0, a.K)(R, e, x)),
                    u = n.reduce(
                      (e, t, n) => (null == t || (0, a.K)(R, t, x) ? e : n),
                      -1,
                    );
                  v =
                    n[
                      (0, a.n)(
                        { current: n.map((e) => (e ? R.current[e] : null)) },
                        {
                          event: e,
                          orientation: f,
                          loopFocus: c,
                          cols: i,
                          disabledIndices: (0, a.G)(
                            [
                              ...(x ||
                                R.current.map((e, t) =>
                                  (0, a.K)(R, t) ? t : void 0,
                                )),
                              void 0,
                            ],
                            n,
                          ),
                          minIndex: s,
                          maxIndex: u,
                          prevIndex: (0, a.z)(
                            T > w ? S : T,
                            t,
                            n,
                            i,
                            e.key === l.e ? "bl" : e.key === l.q ? "tr" : "tl",
                          ),
                          rtl: o,
                        },
                      )
                    ];
                }
                let C = { horizontal: [s], vertical: [l.e], both: [s, l.e] }[f],
                  P = { horizontal: [g], vertical: [l.V], both: [g, l.V] }[f],
                  N = _
                    ? n
                    : {
                        horizontal: m ? l.D : l.Y,
                        vertical: m ? l.m : l.B,
                        both: n,
                      }[f];
                (m && (e.key === l.Z ? (v = S) : e.key === l.C && (v = w)),
                  v === T &&
                    (C.includes(e.key) || P.includes(e.key)) &&
                    (v =
                      c && v === w && C.includes(e.key)
                        ? S
                        : c && v === S && P.includes(e.key)
                          ? w
                          : (0, a.e)(R, {
                              startingIndex: v,
                              decrement: P.includes(e.key),
                              disabledIndices: x,
                            })),
                  v === T ||
                    (0, a.c)(R, v) ||
                    (b && e.stopPropagation(),
                    N.has(e.key) && e.preventDefault(),
                    D(v, !0),
                    queueMicrotask(() => {
                      R.current[v]?.focus();
                    })));
              },
            }),
            [i, d, p, x, R, m, T, _, r, c, C, y, D, f, b],
          );
        return t.useMemo(
          () => ({
            props: A,
            highlightedIndex: T,
            onHighlightedIndexChange: D,
            elementsRef: R,
            disabledIndices: x,
            onMapChange: N,
            relayKeyboardEvent: A.onKeyDown,
          }),
          [A, T, D, R, x, N],
        );
      })({
        itemSizes: E,
        cols: R,
        loopFocus: C,
        dense: _,
        orientation: w,
        highlightedIndex: y,
        onHighlightedIndexChange: S,
        rootRef: N,
        stopEventPropagation: D,
        enableHomeAndEndKeys: P,
        direction: (0, f.f)(),
        disabledIndices: A,
        modifierKeys: M,
      }),
      H = (0, d.f)(I, e, {
        state: b,
        ref: v,
        props: [F, ...m, k],
        stateAttributesMapping: x,
      }),
      W = t.useMemo(
        () => ({
          highlightedIndex: B,
          onHighlightedIndexChange: z,
          highlightItemOnHover: O,
          relayKeyboardEvent: L,
        }),
        [B, z, O, L],
      );
    return (0, g.jsx)(c.e.Provider, {
      value: W,
      children: (0, g.jsx)(i.f, {
        elementsRef: j,
        onMapChange: (e) => {
          (T?.(e), $(e));
        },
        children: H,
      }),
    });
  }
  var v = e.i(522737),
    m = e.i(904186),
    b = e.i(578958);
  let x = t.forwardRef(function (e, i) {
    let {
        activateOnFocus: o = !1,
        className: l,
        loopFocus: a = !0,
        render: s,
        ...u
      } = e,
      {
        getTabElementBySelectedValue: c,
        onValueChange: d,
        orientation: f,
        value: x,
        setTabMap: S,
        tabActivationDirection: w,
      } = (0, m._)(),
      [_, E] = t.useState(0),
      [C, R] = t.useState(null),
      P = t.useRef(new Set()),
      T = t.useRef(new Set()),
      D = t.useRef(null),
      N = (0, n.f)(() => {
        P.current.forEach((e) => {
          e();
        });
      });
    t.useEffect(() => {
      if ("u" < typeof ResizeObserver) return;
      let e = new ResizeObserver(() => {
        P.current.size && N();
      });
      return (
        (D.current = e),
        C && e.observe(C),
        T.current.forEach((t) => {
          e.observe(t);
        }),
        () => {
          (e.disconnect(), (D.current = null));
        }
      );
    }, [C, N]);
    let A = (0, n.f)(
        (e) => (
          P.current.add(e),
          () => {
            P.current.delete(e);
          }
        ),
      ),
      M = (0, n.f)(
        (e) => (
          T.current.add(e),
          D.current?.observe(e),
          () => {
            (T.current.delete(e), D.current?.unobserve(e));
          }
        ),
      ),
      O = (function (e, n, i, o) {
        let [l, a] = t.useState(null);
        return (
          (0, r.f)(() => {
            if (null == e || null == i) return void a(null);
            let t = o(e);
            if (null == t) return void a(null);
            let { left: r, top: l } = y(t, i);
            a("horizontal" === n ? r : l);
          }, [n, o, i, e]),
          t.useCallback(
            (t) => {
              if (t === e) return "none";
              if (null == t) return (a(null), "none");
              if (null != t && null != i) {
                let e = o(t);
                if (null != e) {
                  let { left: t, top: r } = y(e, i);
                  if (null == l) return (a("horizontal" === n ? t : r), "none");
                  if ("horizontal" === n) {
                    if (t < l) return (a(t), "left");
                    if (t > l) return (a(t), "right");
                  } else if (r < l) return (a(r), "up");
                  else if (r > l) return (a(r), "down");
                }
              }
              return "none";
            },
            [o, n, l, i, e],
          )
        );
      })(x, f, C, c),
      I = (0, n.f)((e, t) => {
        e !== x && ((t.activationDirection = O(e)), d(e, t));
      }),
      k = t.useMemo(
        () => ({
          activateOnFocus: o,
          highlightedTabIndex: _,
          registerIndicatorUpdateListener: A,
          registerTabResizeObserverElement: M,
          onTabActivation: I,
          setHighlightedTabIndex: E,
          tabsListElement: C,
        }),
        [o, _, A, M, I, E, C],
      );
    return (0, g.jsx)(b.N.Provider, {
      value: k,
      children: (0, g.jsx)(h, {
        render: s,
        className: l,
        state: { orientation: f, tabActivationDirection: w },
        refs: [i, R],
        props: [
          {
            "aria-orientation": "vertical" === f ? "vertical" : void 0,
            role: "tablist",
          },
          u,
        ],
        stateAttributesMapping: v.f,
        highlightedIndex: _,
        enableHomeAndEndKeys: !0,
        loopFocus: a,
        orientation: f,
        onHighlightedIndexChange: E,
        onMapChange: S,
        disabledIndices: p.v,
      }),
    });
  });
  function y(e, t) {
    let { left: n, top: r } = e.getBoundingClientRect(),
      { left: i, top: o } = t.getBoundingClientRect();
    return { left: n - i, top: r - o };
  }
  e.s(["TabsList", 0, x], 782633);
};
