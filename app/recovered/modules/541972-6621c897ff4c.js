// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(48416),
    r = e.i(565693),
    i = e.i(278051),
    o = e.i(648585),
    l = e.i(138878),
    a = e.i(378317),
    s = e.i(904186),
    u = e.i(522737),
    c = e.i(732486);
  let d = t.forwardRef(function (e, d) {
    let {
        className: f,
        defaultValue: p = 0,
        onValueChange: g,
        orientation: h = "horizontal",
        render: v,
        value: m,
        ...b
      } = e,
      x = (0, a.f)(),
      y = Object.hasOwn(e, "defaultValue"),
      S = t.useRef([]),
      [w, _] = t.useState(() => new Map()),
      [E, C] = (0, n.f)({
        controlled: m,
        default: p,
        name: "Tabs",
        state: "value",
      }),
      R = void 0 !== m,
      [P, T] = t.useState(() => new Map()),
      [D, N] = t.useState("none"),
      A = (0, i.f)((e, t) => {
        (g?.(e, t), t.isCanceled || (C(e), N(t.activationDirection)));
      }),
      M = (0, i.f)((e, t) => {
        _((n) => {
          if (n.get(e) === t) return n;
          let r = new Map(n);
          return (r.set(e, t), r);
        });
      }),
      O = (0, i.f)((e, t) => {
        _((n) => {
          if (!n.has(e) || n.get(e) !== t) return n;
          let r = new Map(n);
          return (r.delete(e), r);
        });
      }),
      I = t.useCallback((e) => w.get(e), [w]),
      k = t.useCallback(
        (e) => {
          for (let t of P.values()) if (e === t?.value) return t?.id;
        },
        [P],
      ),
      F = t.useCallback(
        (e) => {
          if (void 0 === e) return null;
          for (let [t, n] of P.entries())
            if (null != n && e === (n.value ?? n.index)) return t;
          return null;
        },
        [P],
      ),
      B = t.useMemo(
        () => ({
          direction: x,
          getTabElementBySelectedValue: F,
          getTabIdByPanelValue: k,
          getTabPanelIdByValue: I,
          onValueChange: A,
          orientation: h,
          registerMountedTabPanel: M,
          setTabMap: T,
          unregisterMountedTabPanel: O,
          tabActivationDirection: D,
          value: E,
        }),
        [x, F, k, I, A, h, M, T, O, D, E],
      ),
      z = t.useMemo(() => {
        for (let e of P.values()) if (null != e && e.value === E) return e;
      }, [P, E]),
      j = t.useMemo(() => {
        for (let e of P.values()) if (null != e && !e.disabled) return e.value;
      }, [P]);
    (0, r.f)(() => {
      if (R || 0 === P.size) return;
      let e = z?.disabled,
        t = null == z && null !== E;
      if ((y && e && E === p) || (!e && !t)) return;
      let n = j ?? null;
      E !== n && (C(n), N("none"));
    }, [p, j, y, R, z, N, C, P, E]);
    let $ = (0, o.f)("div", e, {
      state: { orientation: h, tabActivationDirection: D },
      ref: d,
      props: b,
      stateAttributesMapping: u.f,
    });
    return (0, c.jsx)(s.q.Provider, {
      value: B,
      children: (0, c.jsx)(l.f, { elementsRef: S, children: $ }),
    });
  });
  e.s(["TabsRoot", 0, d]);
};
