// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(352386),
    r = e.i(363855),
    i = e.i(565693),
    o = e.i(739774),
    l = e.i(810954),
    a = e.i(24542),
    s = e.i(378734),
    u = e.i(648585),
    c = e.i(694975),
    d = e.i(522737),
    f = e.i(904186);
  let p =
      (((t = {}).index = "data-index"),
      (t.activationDirection = "data-activation-direction"),
      (t.orientation = "data-orientation"),
      (t.hidden = "data-hidden"),
      (t[(t.startingStyle = l.S.startingStyle)] = "startingStyle"),
      (t[(t.endingStyle = l.S.endingStyle)] = "endingStyle"),
      t),
    g = { ...d.f, ...l.T },
    h = n.forwardRef(function (e, t) {
      let { className: l, value: d, render: h, keepMounted: v = !1, ...m } = e,
        {
          value: b,
          getTabIdByPanelValue: x,
          orientation: y,
          tabActivationDirection: S,
          registerMountedTabPanel: w,
          unregisterMountedTabPanel: _,
        } = (0, f._)(),
        E = (0, o.f)(),
        C = n.useMemo(() => ({ id: E, value: d }), [E, d]),
        { ref: R, index: P } = (0, c.f)({ metadata: C }),
        T = d === b,
        { mounted: D, transitionStatus: N, setMounted: A } = (0, s.f)(T),
        M = !D,
        O = x(d),
        I = n.useRef(null),
        k = (0, u.f)("div", e, {
          state: {
            hidden: M,
            orientation: y,
            tabActivationDirection: S,
            transitionStatus: N,
          },
          ref: [t, R, I],
          props: [
            {
              "aria-labelledby": O,
              hidden: M,
              id: E,
              role: "tabpanel",
              tabIndex: T ? 0 : -1,
              inert: (0, r.f)(!T),
              [p.index]: P,
            },
            m,
          ],
          stateAttributesMapping: g,
        });
      return ((0, a.f)({
        open: T,
        ref: I,
        onComplete() {
          T || A(!1);
        },
      }),
      (0, i.f)(() => {
        if ((!M || v) && null != E)
          return (
            w(d, E),
            () => {
              _(d, E);
            }
          );
      }, [M, v, d, E, w, _]),
      v || D)
        ? k
        : null;
    });
  e.s(["TabsPanel", 0, h], 802737);
};
