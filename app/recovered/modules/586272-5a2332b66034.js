// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(226115),
    r = e.i(565693),
    i = e.i(739774),
    o = e.i(648585),
    l = e.i(681402),
    a = e.i(338868),
    s = e.i(244101),
    u = e.i(904186),
    c = e.i(578958),
    d = e.i(523686),
    f = e.i(559545),
    p = e.i(430186);
  let g = t.forwardRef(function (e, g) {
    let {
        className: h,
        disabled: v = !1,
        render: m,
        value: b,
        id: x,
        nativeButton: y = !0,
        ...S
      } = e,
      { value: w, getTabPanelIdByValue: _, orientation: E } = (0, u._)(),
      {
        activateOnFocus: C,
        highlightedTabIndex: R,
        onTabActivation: P,
        registerTabResizeObserverElement: T,
        setHighlightedTabIndex: D,
        tabsListElement: N,
      } = (0, c.K)(),
      A = (0, i.f)(x),
      M = t.useMemo(() => ({ disabled: v, id: A, value: b }), [v, A, b]),
      {
        compositeProps: O,
        compositeRef: I,
        index: k,
      } = (0, s.f)({ metadata: M }),
      F = b === w,
      B = t.useRef(!1),
      z = t.useRef(null);
    (t.useEffect(() => {
      let e = z.current;
      if (e) return T(e);
    }, [T]),
      (0, r.f)(() => {
        if (B.current) {
          B.current = !1;
          return;
        }
        if (F && k > -1 && R !== k) {
          if (null != N) {
            let e = (0, p.T)((0, n.f)(N));
            if (e && (0, p.I)(N, e)) return;
          }
          v || D(k);
        }
      }, [F, k, R, D, v, N]));
    let { getButtonProps: j, buttonRef: $ } = (0, l.f)({
        disabled: v,
        native: y,
        focusableWhenDisabled: !0,
      }),
      L = _(b),
      H = t.useRef(!1),
      W = t.useRef(!1);
    return (0, o.f)("button", e, {
      state: { disabled: v, active: F, orientation: E },
      ref: [g, $, I, z],
      props: [
        O,
        {
          role: "tab",
          "aria-controls": L,
          "aria-selected": F,
          id: A,
          onClick: function (e) {
            F ||
              v ||
              P(
                b,
                (0, d.f)(f.f.none, e.nativeEvent, void 0, {
                  activationDirection: "none",
                }),
              );
          },
          onFocus: function (e) {
            F ||
              (k > -1 && !v && D(k),
              !v &&
                C &&
                (!H.current || (H.current && W.current)) &&
                P(
                  b,
                  (0, d.f)(f.f.none, e.nativeEvent, void 0, {
                    activationDirection: "none",
                  }),
                ));
          },
          onPointerDown: function (e) {
            F ||
              v ||
              ((H.current = !0),
              (e.button && 0 !== e.button) ||
                ((W.current = !0),
                (0, n.f)(e.currentTarget).addEventListener(
                  "pointerup",
                  function () {
                    ((H.current = !1), (W.current = !1));
                  },
                  { once: !0 },
                )));
          },
          [a.f]: F ? "" : void 0,
          onKeyDownCapture() {
            B.current = !0;
          },
        },
        S,
        j,
      ],
    });
  });
  e.s(["TabsTab", 0, g]);
};
