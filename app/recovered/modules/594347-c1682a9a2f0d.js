// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(702232),
    n = e.i(352386),
    r = e.i(68585),
    i = e.i(681402),
    o = e.i(648585),
    l = e.i(833551),
    a = e.i(300310),
    s = e.i(290915),
    u = e.i(739774),
    c = e.i(385705),
    d = e.i(908116);
  let f = n.forwardRef(function (e, f) {
    let {
        render: p,
        className: g,
        disabled: h = !1,
        nativeButton: v = !0,
        id: m,
        payload: b,
        handle: x,
        ...y
      } = e,
      S = (0, r.x)(!0),
      w = x?.store ?? S?.store;
    if (!w) throw Error((0, t.f)(79));
    let _ = (0, u.f)(m),
      E = w.useState("floatingRootContext"),
      C = w.useState("isOpenedByTrigger", _),
      R = n.useRef(null),
      { registerTrigger: P, isMountedByThisTrigger: T } = (0, s.F)(_, R, w, {
        payload: b,
      }),
      { getButtonProps: D, buttonRef: N } = (0, i.f)({
        disabled: h,
        native: v,
      }),
      A = (0, c.f)(E, { enabled: null != E }),
      M = (0, d.f)([A]),
      O = w.useState("triggerProps", T);
    return (0, o.f)("button", e, {
      state: { disabled: h, open: C },
      ref: [N, f, P, R],
      props: [M.getReferenceProps(), O, { [a.j]: "", id: _ }, y, D],
      stateAttributesMapping: l.J,
    });
  });
  e.s(["DrawerTrigger", 0, f], 594347);
};
