// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(115042),
    r = e.i(614758),
    i = e.i(833551),
    o = e.i(810954),
    l = e.i(24542),
    a = e.i(648585),
    s = e.i(813258),
    u = e.i(195086);
  let c = { ...i.E, ...o.T },
    d = t.forwardRef(function (e, t) {
      let { className: i, render: o, ...d } = e,
        f = (0, n.Z)(),
        { side: p, align: g } = (0, r.d)(),
        h = f.useState("open"),
        v = f.useState("instantType"),
        m = f.useState("transitionStatus"),
        b = f.useState("popupProps"),
        x = f.useState("floatingRootContext");
      (0, l.f)({
        open: h,
        ref: f.context.popupRef,
        onComplete() {
          h && f.context.onOpenChangeComplete?.(!0);
        },
      });
      let y = f.useState("disabled"),
        S = f.useState("closeDelay");
      return (
        (0, u.f)(x, { enabled: !y, closeDelay: S }),
        (0, a.f)("div", e, {
          state: {
            open: h,
            side: p,
            align: g,
            instant: v,
            transitionStatus: m,
          },
          ref: [t, f.context.popupRef, f.useStateSetter("popupElement")],
          props: [b, (0, s.f)(m), d],
          stateAttributesMapping: c,
        })
      );
    });
  e.s(["TooltipPopup", 0, d]);
};
