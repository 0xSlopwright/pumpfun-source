// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(745018),
    a = e.i(439587),
    i = e.i(426091),
    o = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    l = e.i(51206),
    c = e.i(634661);
  let u = {
      sm: "!max-w-[400px]",
      md: "!max-w-[480px]",
      lg: "!max-w-[640px]",
      full: "!max-w-[calc(100vw-48px)]",
    },
    d = (0, o.createContext)("comfortable");
  function f() {
    return (0, o.useContext)(d);
  }
  let p = { comfortable: "p-5", terminal: "p-3" },
    m = { comfortable: "px-5 py-3", terminal: "px-3 py-2" },
    g = { comfortable: "-mx-5", terminal: "-mx-3" };
  function h(e) {
    let a,
      o,
      u,
      d = (0, r.c)(16),
      {
        title: p,
        titleId: m,
        truncateTitle: g,
        aside: h,
        actions: y,
        onClose: b,
        className: x,
      } = e,
      v = void 0 === g || g,
      w = f(),
      { t: _ } = (0, s.f)();
    d[0] !== y || d[1] !== w || d[2] !== b || d[3] !== _
      ? ((a =
          y || b
            ? (0, t.jsxs)(t.Fragment, {
                children: [
                  y,
                  b
                    ? (0, t.jsx)(l._, {
                        density: w,
                        "aria-label": _("common.close"),
                        "data-slot": "dialog-close",
                        onClick: b,
                        children: (0, t.jsx)(n.x6, {}),
                      })
                    : null,
                ],
              })
            : void 0),
        (d[0] = y),
        (d[1] = w),
        (d[2] = b),
        (d[3] = _),
        (d[4] = a))
      : (a = d[4]);
    let z = "terminal" === w && "h-9";
    return (
      d[5] !== x || d[6] !== z
        ? ((o = (0, i.c)("shrink-0", z, x)), (d[5] = x), (d[6] = z), (d[7] = o))
        : (o = d[7]),
      d[8] !== h ||
      d[9] !== w ||
      d[10] !== a ||
      d[11] !== o ||
      d[12] !== p ||
      d[13] !== m ||
      d[14] !== v
        ? ((u = (0, t.jsx)(c._, {
            density: w,
            title: p,
            titleId: m,
            truncateTitle: v,
            aside: h,
            action: a,
            className: o,
            "data-slot": "dialog-header",
          })),
          (d[8] = h),
          (d[9] = w),
          (d[10] = a),
          (d[11] = o),
          (d[12] = p),
          (d[13] = m),
          (d[14] = v),
          (d[15] = u))
        : (u = d[15]),
      u
    );
  }
  e.s([
    "$",
    0,
    40,
    "Z",
    0,
    36,
    "N",
    0,
    function (e) {
      let n,
        s,
        l,
        c,
        f,
        p = (0, r.c)(30),
        {
          open: m,
          onOpenChange: g,
          onOpenChangeComplete: y,
          density: b,
          size: x,
          title: v,
          truncateTitle: w,
          aside: _,
          headerActions: z,
          hideClose: k,
          initialFocus: S,
          className: A,
          children: P,
          "aria-label": j,
          "data-testid": E,
        } = e,
        I = void 0 === b ? "comfortable" : b,
        T = void 0 === x ? "md" : x,
        O = void 0 === w || w,
        C = void 0 !== k && k,
        N = (0, o.useId)(),
        R = null != v,
        U = R && !j,
        $ = U ? void 0 : j,
        L = U ? N : void 0,
        F = u[T];
      return (
        p[0] !== A || p[1] !== F
          ? ((n = (0, i.c)(
              "flex max-h-[calc(100dvh-48px)] flex-col overflow-hidden !p-0",
              F,
              A,
            )),
            (p[0] = A),
            (p[1] = F),
            (p[2] = n))
          : (n = p[2]),
        p[3] !== _ ||
        p[4] !== R ||
        p[5] !== z ||
        p[6] !== C ||
        p[7] !== g ||
        p[8] !== v ||
        p[9] !== N ||
        p[10] !== O
          ? ((s = R
              ? (0, t.jsx)(h, {
                  actions: z,
                  aside: _,
                  onClose: C ? void 0 : () => g(!1),
                  title: v,
                  titleId: N,
                  truncateTitle: O,
                })
              : null),
            (p[3] = _),
            (p[4] = R),
            (p[5] = z),
            (p[6] = C),
            (p[7] = g),
            (p[8] = v),
            (p[9] = N),
            (p[10] = O),
            (p[11] = s))
          : (s = p[11]),
        p[12] !== P ||
        p[13] !== I ||
        p[14] !== S ||
        p[15] !== T ||
        p[16] !== $ ||
        p[17] !== L ||
        p[18] !== n ||
        p[19] !== s ||
        p[20] !== E
          ? ((l = (0, t.jsxs)(a.s, {
              "aria-label": $,
              "aria-labelledby": L,
              className: n,
              "data-density": I,
              "data-size": T,
              "data-testid": E,
              initialFocus: S,
              children: [s, P],
            })),
            (p[12] = P),
            (p[13] = I),
            (p[14] = S),
            (p[15] = T),
            (p[16] = $),
            (p[17] = L),
            (p[18] = n),
            (p[19] = s),
            (p[20] = E),
            (p[21] = l))
          : (l = p[21]),
        p[22] !== I || p[23] !== l
          ? ((c = (0, t.jsx)(d.Provider, { value: I, children: l })),
            (p[22] = I),
            (p[23] = l),
            (p[24] = c))
          : (c = p[24]),
        p[25] !== g || p[26] !== y || p[27] !== m || p[28] !== c
          ? ((f = (0, t.jsx)(a.v, {
              isOpen: m,
              onIsOpenChange: g,
              onOpenChangeComplete: y,
              children: c,
            })),
            (p[25] = g),
            (p[26] = y),
            (p[27] = m),
            (p[28] = c),
            (p[29] = f))
          : (f = p[29]),
        f
      );
    },
    "K",
    0,
    function (e) {
      let n,
        a,
        o,
        s,
        l,
        c = (0, r.c)(11);
      c[0] !== e
        ? (({ className: a, children: n, ...o } = e),
          (c[0] = e),
          (c[1] = n),
          (c[2] = a),
          (c[3] = o))
        : ((n = c[1]), (a = c[2]), (o = c[3]));
      let u = p[f()];
      return (
        c[4] !== a || c[5] !== u
          ? ((s = (0, i.c)("min-h-0 flex-1 overflow-y-auto", u, a)),
            (c[4] = a),
            (c[5] = u),
            (c[6] = s))
          : (s = c[6]),
        c[7] !== n || c[8] !== o || c[9] !== s
          ? ((l = (0, t.jsx)("div", {
              className: s,
              "data-slot": "dialog-body",
              ...o,
              children: n,
            })),
            (c[7] = n),
            (c[8] = o),
            (c[9] = s),
            (c[10] = l))
          : (l = c[10]),
        l
      );
    },
    "h",
    0,
    function (e) {
      let n,
        a = (0, r.c)(3),
        { density: i, children: o } = e;
      return (
        a[0] !== o || a[1] !== i
          ? ((n = (0, t.jsx)(d.Provider, { value: i, children: o })),
            (a[0] = o),
            (a[1] = i),
            (a[2] = n))
          : (n = a[2]),
        n
      );
    },
    "c",
    0,
    function (e) {
      let n,
        a,
        o,
        s,
        l,
        c = (0, r.c)(11);
      c[0] !== e
        ? (({ className: a, children: n, ...o } = e),
          (c[0] = e),
          (c[1] = n),
          (c[2] = a),
          (c[3] = o))
        : ((n = c[1]), (a = c[2]), (o = c[3]));
      let u = m[f()];
      return (
        c[4] !== a || c[5] !== u
          ? ((s = (0, i.c)(
              "flex shrink-0 items-center justify-end gap-2 border-t border-border-secondary",
              u,
              a,
            )),
            (c[4] = a),
            (c[5] = u),
            (c[6] = s))
          : (s = c[6]),
        c[7] !== n || c[8] !== o || c[9] !== s
          ? ((l = (0, t.jsx)("div", {
              className: s,
              "data-slot": "dialog-footer",
              ...o,
              children: n,
            })),
            (c[7] = n),
            (c[8] = o),
            (c[9] = s),
            (c[10] = l))
          : (l = c[10]),
        l
      );
    },
    "s",
    0,
    h,
    "a",
    0,
    function (e) {
      let n,
        a,
        o,
        s,
        l = (0, r.c)(9);
      l[0] !== e
        ? (({ className: n, ...a } = e), (l[0] = e), (l[1] = n), (l[2] = a))
        : ((n = l[1]), (a = l[2]));
      let c = g[f()];
      return (
        l[3] !== n || l[4] !== c
          ? ((o = (0, i.c)("border-0 border-t border-border-secondary", c, n)),
            (l[3] = n),
            (l[4] = c),
            (l[5] = o))
          : (o = l[5]),
        l[6] !== a || l[7] !== o
          ? ((s = (0, t.jsx)("hr", {
              className: o,
              "data-slot": "dialog-seam",
              ...a,
            })),
            (l[6] = a),
            (l[7] = o),
            (l[8] = s))
          : (s = l[8]),
        s
      );
    },
    "M",
    0,
    f,
  ]);
};
