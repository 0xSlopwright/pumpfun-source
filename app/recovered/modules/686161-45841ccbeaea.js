// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(291967),
    r = e.i(156207),
    a = e.i(534643),
    l = e.i(127864),
    i = e.i(144977),
    o = e.i(556872),
    s = e.i(653747),
    c = e.i(461194),
    u = e.i(732486),
    f = "Collapsible",
    [d, h] = (0, r.c)(f),
    [p, m] = d(f),
    v = t.forwardRef((e, n) => {
      let {
          __scopeCollapsible: r,
          open: l,
          defaultOpen: i,
          disabled: s,
          onOpenChange: d,
          ...h
        } = e,
        [m, v] = (0, a.f)({
          prop: l,
          defaultProp: i ?? !1,
          onChange: d,
          caller: f,
        });
      return (0, u.jsx)(p, {
        scope: r,
        disabled: s,
        contentId: (0, c.f)(),
        open: m,
        onOpenToggle: t.useCallback(() => v((e) => !e), [v]),
        children: (0, u.jsx)(o.V.div, {
          "data-state": B(m),
          "data-disabled": s ? "" : void 0,
          ...h,
          ref: n,
        }),
      });
    });
  v.displayName = f;
  var y = "CollapsibleTrigger",
    g = t.forwardRef((e, t) => {
      let { __scopeCollapsible: r, ...a } = e,
        l = m(y, r);
      return (0, u.jsx)(o.V.button, {
        type: "button",
        "aria-controls": l.contentId,
        "aria-expanded": l.open || !1,
        "data-state": B(l.open),
        "data-disabled": l.disabled ? "" : void 0,
        disabled: l.disabled,
        ...a,
        ref: t,
        onClick: (0, n.f)(e.onClick, l.onOpenToggle),
      });
    });
  g.displayName = y;
  var b = "CollapsibleContent",
    x = t.forwardRef((e, t) => {
      let { forceMount: n, ...r } = e,
        a = m(b, e.__scopeCollapsible);
      return (0, u.jsx)(s.f, {
        present: n || a.open,
        children: ({ present: e }) =>
          (0, u.jsx)(w, { ...r, ref: t, present: e }),
      });
    });
  x.displayName = b;
  var w = t.forwardRef((e, n) => {
    let { __scopeCollapsible: r, present: a, children: s, ...c } = e,
      f = m(b, r),
      [d, h] = t.useState(a),
      p = t.useRef(null),
      v = (0, i.j)(n, p),
      y = t.useRef(0),
      g = y.current,
      x = t.useRef(0),
      w = x.current,
      k = f.open || d,
      C = t.useRef(k),
      _ = t.useRef(void 0);
    return (
      t.useEffect(() => {
        let e = requestAnimationFrame(() => (C.current = !1));
        return () => cancelAnimationFrame(e);
      }, []),
      (0, l.f)(() => {
        let e = p.current;
        if (e) {
          ((_.current = _.current || {
            transitionDuration: e.style.transitionDuration,
            animationName: e.style.animationName,
          }),
            (e.style.transitionDuration = "0s"),
            (e.style.animationName = "none"));
          let t = e.getBoundingClientRect();
          ((y.current = t.height),
            (x.current = t.width),
            C.current ||
              ((e.style.transitionDuration = _.current.transitionDuration),
              (e.style.animationName = _.current.animationName)),
            h(a));
        }
      }, [f.open, a]),
      (0, u.jsx)(o.V.div, {
        "data-state": B(f.open),
        "data-disabled": f.disabled ? "" : void 0,
        id: f.contentId,
        hidden: !k,
        ...c,
        ref: v,
        style: {
          "--radix-collapsible-content-height": g ? `${g}px` : void 0,
          "--radix-collapsible-content-width": w ? `${w}px` : void 0,
          ...e.style,
        },
        children: k && s,
      })
    );
  });
  function B(e) {
    return e ? "open" : "closed";
  }
  e.s(["C", 0, x, "v", 0, g, "c", 0, x, "F", 0, v, "d", 0, g, "z", 0, h]);
};
