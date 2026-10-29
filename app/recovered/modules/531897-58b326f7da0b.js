// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    a = e.i(745018);
  e.i(12692);
  var n = e.i(398902),
    l = e.i(513579),
    o = e.i(753192),
    s = e.i(534867),
    d = e.i(382828),
    c = e.i(597894),
    r = e.i(693957),
    u = e.i(886973),
    m = e.i(338319),
    p = e.i(45329);
  let g = ["left", "right"],
    b = { left: a.xa, right: a.Ie };
  function h(e) {
    return e.sideCollapsed;
  }
  function f(e) {
    return e.widgets;
  }
  function k() {
    let e,
      l,
      c,
      m,
      k,
      y,
      x,
      C,
      w,
      S,
      T,
      L,
      $,
      P = (0, i.c)(28),
      { t: j } = (0, n.f)(),
      O = (function () {
        let e,
          t = (0, i.c)(5),
          { t: a } = (0, n.f)(),
          { toggleSidePanel: l } = (0, o.f)(),
          s = (0, p.V)(f),
          d = (0, p.V)(h);
        return (
          t[0] !== d || t[1] !== a || t[2] !== l || t[3] !== s
            ? ((e = g.map((e) => ({
                side: e,
                label:
                  "left" === e
                    ? a("web.screeners.panel_left")
                    : a("web.screeners.panel_right"),
                icon: b[e],
                isOpen: !d[e] && s.some((t) => t.side === e && !t.float),
                toggle: () => l(e),
              }))),
              (t[0] = d),
              (t[1] = a),
              (t[2] = l),
              (t[3] = s),
              (t[4] = e))
            : (e = t[4]),
          e
        );
      })();
    P[0] !== j
      ? ((e = j("web.screeners.panels")), (P[0] = j), (P[1] = e))
      : (e = P[1]);
    let W = e;
    return (
      P[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((l = (0, t.jsx)(a.S4, {
            "aria-hidden": !0,
            className: "size-[18px] shrink-0",
          })),
          (P[2] = l))
        : (l = P[2]),
      P[3] !== W
        ? ((c = (0, t.jsx)("span", {
            className: "min-w-0 flex-1 truncate",
            children: W,
          })),
          (P[3] = W),
          (P[4] = c))
        : (c = P[4]),
      P[5] !== O ? ((m = O.map(V)), (P[5] = O), (P[6] = m)) : (m = P[6]),
      P[7] !== m || P[8] !== W
        ? ((k = (0, t.jsx)("div", {
            role: "group",
            "aria-label": W,
            className:
              "flex shrink-0 gap-0.5 rounded-md border border-border-tertiary bg-bg-secondary p-0.5",
            children: m,
          })),
          (P[7] = m),
          (P[8] = W),
          (P[9] = k))
        : (k = P[9]),
      P[10] !== c || P[11] !== k
        ? ((y = (0, t.jsxs)("div", {
            "data-testid": "sidebar-side-panel-triggers",
            className:
              "flex h-8 items-center gap-2.5 px-2.5 text-[13px] font-medium text-text-tertiary group-data-[collapsible=icon]:hidden",
            children: [l, c, k],
          })),
          (P[10] = c),
          (P[11] = k),
          (P[12] = y))
        : (y = P[12]),
      P[13] !== W
        ? ((x = (0, t.jsx)("button", {
            type: "button",
            "aria-label": W,
            title: W,
            "data-testid": "sidebar-side-panel-menu",
            className:
              "flex size-8 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent data-[popup-open]:bg-bg-tertiary data-[popup-open]:text-text-primary",
          })),
          (P[13] = W),
          (P[14] = x))
        : (x = P[14]),
      P[15] === Symbol.for("react.memo_cache_sentinel")
        ? ((C = (0, t.jsx)(a.S4, {
            "aria-hidden": !0,
            className: "size-[18px]",
          })),
          (P[15] = C))
        : (C = P[15]),
      P[16] !== x
        ? ((w = (0, t.jsx)(u.f, { render: x, children: C })),
          (P[16] = x),
          (P[17] = w))
        : (w = P[17]),
      P[18] !== O ? ((S = O.map(v)), (P[18] = O), (P[19] = S)) : (S = P[19]),
      P[20] !== S
        ? ((T = (0, t.jsx)(r.f, {
            side: "right",
            align: "end",
            sideOffset: 5,
            positionMethod: "fixed",
            className: s.J,
            children: S,
          })),
          (P[20] = S),
          (P[21] = T))
        : (T = P[21]),
      P[22] !== T || P[23] !== w
        ? ((L = (0, t.jsx)("div", {
            className:
              "hidden justify-center group-data-[collapsible=icon]:flex",
            children: (0, t.jsxs)(d.f, { modal: !1, children: [w, T] }),
          })),
          (P[22] = T),
          (P[23] = w),
          (P[24] = L))
        : (L = P[24]),
      P[25] !== L || P[26] !== y
        ? (($ = (0, t.jsxs)(t.Fragment, { children: [y, L] })),
          (P[25] = L),
          (P[26] = y),
          (P[27] = $))
        : ($ = P[27]),
      $
    );
  }
  function v(e) {
    let { side: i, label: a, icon: n, isOpen: l, toggle: o } = e;
    return (0, t.jsxs)(
      c.f,
      {
        className: s.E,
        checked: l,
        onCheckedChange: o,
        "data-testid": `sidebar-side-panel-menu-${i}`,
        children: [
          (0, t.jsx)(n, { "aria-hidden": !0, className: "size-4" }),
          a,
        ],
      },
      i,
    );
  }
  function V(e) {
    let { side: i, label: a, icon: n, isOpen: l, toggle: o } = e;
    return (0, t.jsx)(
      "button",
      {
        type: "button",
        "aria-pressed": l,
        "aria-label": a,
        title: a,
        "data-testid": `sidebar-side-panel-${i}`,
        onClick: o,
        className: (0, m.c)(
          "flex size-6 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent",
          l
            ? "bg-bg-tertiary text-text-primary"
            : "text-text-tertiary hover:text-text-primary",
        ),
        children: (0, t.jsx)(n, { "aria-hidden": !0, className: "size-4" }),
      },
      i,
    );
  }
  e.s([
    "SidebarSidePanelTriggersBody",
    0,
    function () {
      let e,
        a = (0, i.c)(1);
      return (0, p.a)()
        ? (a[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)(l.g, { children: (0, t.jsx)(k, {}) })),
              (a[0] = e))
            : (e = a[0]),
          e)
        : null;
    },
  ]);
};
