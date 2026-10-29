// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(458310),
    a = e.i(338319);
  let i = { terminal: 28, comfortable: 32 },
    o = {
      20: "size-5 [&>svg]:size-3.5",
      24: "size-6 [&>svg]:size-3.5",
      28: "size-7 [&>svg]:size-3.5",
      32: "size-8 [&>svg]:size-4",
      36: "size-9 [&>svg]:size-4",
    },
    s = {
      ghost:
        "bg-transparent text-text-quaternary hover:bg-bg-tertiary hover:text-text-primary disabled:hover:bg-transparent disabled:hover:text-text-quaternary",
      secondary:
        "bg-bg-tertiary text-text-primary hover:bg-[color-mix(in_oklab,var(--color-bg-tertiary)_75%,transparent_0%)] active:[translate:0_1px]",
      outlined:
        "border border-border-tertiary bg-transparent text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary",
    },
    l = {
      ghost: "bg-bg-tertiary text-text-primary",
      secondary: "text-text-primary",
      outlined: "border-text-accent text-text-primary",
    };
  function c({
    density: e,
    size: t = i[e],
    variant: r = "ghost",
    active: n = !1,
    className: u,
  }) {
    return (0, a.c)(
      "inline-flex shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:shrink-0",
      o[t],
      s[r],
      n && l[r],
      u,
    );
  }
  e.s([
    "_",
    0,
    function (e) {
      let a,
        o,
        s,
        l,
        u,
        d,
        f,
        p,
        m,
        g,
        h,
        y,
        b = (0, r.c)(36);
      b[0] !== e
        ? (({
            density: l,
            size: d,
            variant: f,
            active: p,
            className: s,
            children: o,
            "aria-label": a,
            ...u
          } = e),
          (b[0] = e),
          (b[1] = a),
          (b[2] = o),
          (b[3] = s),
          (b[4] = l),
          (b[5] = u),
          (b[6] = d),
          (b[7] = f),
          (b[8] = p))
        : ((a = b[1]),
          (o = b[2]),
          (s = b[3]),
          (l = b[4]),
          (u = b[5]),
          (d = b[6]),
          (f = b[7]),
          (p = b[8]));
      let x = void 0 === d ? i[l] : d,
        v = void 0 === f ? "ghost" : f,
        w = void 0 !== p && p,
        _ = w ? "" : void 0;
      (b[9] !== w || b[10] !== s || b[11] !== l || b[12] !== x || b[13] !== v
        ? ((m = c({
            density: l,
            size: x,
            variant: v,
            active: w,
            className: s,
          })),
          (b[9] = w),
          (b[10] = s),
          (b[11] = l),
          (b[12] = x),
          (b[13] = v),
          (b[14] = m))
        : (m = b[14]),
        b[15] !== a ||
        b[16] !== l ||
        b[17] !== x ||
        b[18] !== _ ||
        b[19] !== m ||
        b[20] !== v
          ? ((g = {
              "aria-label": a,
              "data-density": l,
              "data-size": x,
              "data-variant": v,
              "data-active": _,
              className: m,
            }),
            (b[15] = a),
            (b[16] = l),
            (b[17] = x),
            (b[18] = _),
            (b[19] = m),
            (b[20] = v),
            (b[21] = g))
          : (g = b[21]));
      let z = g;
      if (void 0 !== u.href) {
        let e,
          r,
          a,
          i = u;
        return (
          b[22] !== i
            ? (({ href: r, ...e } = i), (b[22] = i), (b[23] = e), (b[24] = r))
            : ((e = b[23]), (r = b[24])),
          b[25] !== e || b[26] !== o || b[27] !== r || b[28] !== z
            ? ((a = (0, t.jsx)(n.default, {
                href: r,
                ...z,
                ...e,
                children: o,
              })),
              (b[25] = e),
              (b[26] = o),
              (b[27] = r),
              (b[28] = z),
              (b[29] = a))
            : (a = b[29]),
          a
        );
      }
      let k = u;
      if (b[30] !== k) {
        let { href: e, ...t } = k;
        ((h = t), (b[30] = k), (b[31] = h));
      } else h = b[31];
      return (
        b[32] !== h || b[33] !== o || b[34] !== z
          ? ((y = (0, t.jsx)("button", {
              type: "button",
              ...z,
              ...h,
              children: o,
            })),
            (b[32] = h),
            (b[33] = o),
            (b[34] = z),
            (b[35] = y))
          : (y = b[35]),
        y
      );
    },
    "x",
    0,
    c,
  ]);
};
