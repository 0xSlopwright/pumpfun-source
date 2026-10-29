// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(775453),
    r = e.i(156207),
    n = e.i(291132),
    a = e.i(406657),
    o = e.i(362275),
    s = e.i(770460),
    l = e.i(534643),
    d = e.i(461194),
    c = e.i(732486),
    u = "Tabs",
    [m, f] = (0, r.c)(u, [n.B]),
    b = (0, n.B)(),
    [p, h] = m(u),
    w = t.forwardRef((e, t) => {
      let {
          __scopeTabs: i,
          value: r,
          onValueChange: n,
          defaultValue: a,
          orientation: m = "horizontal",
          dir: f,
          activationMode: b = "automatic",
          ...h
        } = e,
        w = (0, s.f)(f),
        [v, g] = (0, l.f)({
          prop: r,
          onChange: n,
          defaultProp: a ?? "",
          caller: u,
        });
      return (0, c.jsx)(p, {
        scope: i,
        baseId: (0, d.f)(),
        value: v,
        onValueChange: g,
        orientation: m,
        dir: w,
        activationMode: b,
        children: (0, c.jsx)(o.V.div, {
          dir: w,
          "data-orientation": m,
          ...h,
          ref: t,
        }),
      });
    });
  w.displayName = u;
  var v = "TabsList",
    g = t.forwardRef((e, t) => {
      let { __scopeTabs: i, loop: r = !0, ...a } = e,
        s = h(v, i),
        l = b(i);
      return (0, c.jsx)(n.F, {
        asChild: !0,
        ...l,
        orientation: s.orientation,
        dir: s.dir,
        loop: r,
        children: (0, c.jsx)(o.V.div, {
          role: "tablist",
          "aria-orientation": s.orientation,
          ...a,
          ref: t,
        }),
      });
    });
  g.displayName = v;
  var y = "TabsTrigger",
    x = t.forwardRef((e, t) => {
      let { __scopeTabs: r, value: a, disabled: s = !1, ...l } = e,
        d = h(y, r),
        u = b(r),
        m = S(d.baseId, a),
        f = N(d.baseId, a),
        p = a === d.value;
      return (0, c.jsx)(n.M, {
        asChild: !0,
        ...u,
        focusable: !s,
        active: p,
        children: (0, c.jsx)(o.V.button, {
          type: "button",
          role: "tab",
          "aria-selected": p,
          "aria-controls": f,
          "data-state": p ? "active" : "inactive",
          "data-disabled": s ? "" : void 0,
          disabled: s,
          id: m,
          ...l,
          ref: t,
          onMouseDown: (0, i.f)(e.onMouseDown, (e) => {
            s || 0 !== e.button || !1 !== e.ctrlKey
              ? e.preventDefault()
              : d.onValueChange(a);
          }),
          onKeyDown: (0, i.f)(e.onKeyDown, (e) => {
            [" ", "Enter"].includes(e.key) && d.onValueChange(a);
          }),
          onFocus: (0, i.f)(e.onFocus, () => {
            let e = "manual" !== d.activationMode;
            p || s || !e || d.onValueChange(a);
          }),
        }),
      });
    });
  x.displayName = y;
  var k = "TabsContent",
    C = t.forwardRef((e, i) => {
      let { __scopeTabs: r, value: n, forceMount: s, children: l, ...d } = e,
        u = h(k, r),
        m = S(u.baseId, n),
        f = N(u.baseId, n),
        b = n === u.value,
        p = t.useRef(b);
      return (
        t.useEffect(() => {
          let e = requestAnimationFrame(() => (p.current = !1));
          return () => cancelAnimationFrame(e);
        }, []),
        (0, c.jsx)(a.f, {
          present: s || b,
          children: ({ present: t }) =>
            (0, c.jsx)(o.V.div, {
              "data-state": b ? "active" : "inactive",
              "data-orientation": u.orientation,
              role: "tabpanel",
              "aria-labelledby": m,
              hidden: !t,
              id: f,
              tabIndex: 0,
              ...d,
              ref: i,
              style: {
                ...e.style,
                animationDuration: p.current ? "0s" : void 0,
              },
              children: t && l,
            }),
        })
      );
    });
  function S(e, t) {
    return `${e}-trigger-${t}`;
  }
  function N(e, t) {
    return `${e}-content-${t}`;
  }
  ((C.displayName = k),
    e.s(["Content", 0, C, "List", 0, g, "Root", 0, w, "Trigger", 0, x]));
};
