// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    l = e.i(745018),
    r = e.i(338319),
    i = e.i(606178);
  let n = { terminal: "gap-2 py-2", comfortable: "gap-2.5 py-3" },
    o = {
      terminal: "mt-px size-3.5 shrink-0 text-text-tertiary",
      comfortable: "mt-0.5 size-4 shrink-0 text-text-tertiary",
    },
    s = {
      terminal: "text-[13px] leading-4 font-medium text-text-primary",
      comfortable: "text-sm leading-5 font-medium text-text-primary",
    },
    c = {
      terminal: "text-xs leading-4 text-text-tertiary",
      comfortable: "text-[13px] leading-[18px] text-text-tertiary",
    };
  e.s([
    "f",
    0,
    function (e) {
      let u,
        d,
        m,
        f,
        p,
        _,
        h,
        g,
        b,
        x = (0, a.c)(28),
        {
          density: y,
          children: v,
          title: E,
          onPress: w,
          action: L,
          className: C,
        } = e,
        N = o[y];
      (x[0] !== N
        ? ((u = (0, t.jsx)(l.wB, { "aria-hidden": !0, className: N })),
          (x[0] = N),
          (x[1] = u))
        : (u = x[1]),
        x[2] !== y || x[3] !== E
          ? ((d = E
              ? (0, t.jsx)("span", { className: s[y], children: E })
              : null),
            (x[2] = y),
            (x[3] = E),
            (x[4] = d))
          : (d = x[4]));
      let I = c[y];
      (x[5] !== v || x[6] !== I
        ? ((m = (0, t.jsx)("span", { className: I, children: v })),
          (x[5] = v),
          (x[6] = I),
          (x[7] = m))
        : (m = x[7]),
        x[8] !== d || x[9] !== m
          ? ((f = (0, t.jsxs)("span", {
              className: "flex min-w-0 flex-1 flex-col gap-0.5",
              children: [d, m],
            })),
            (x[8] = d),
            (x[9] = m),
            (x[10] = f))
          : (f = x[10]),
        x[11] !== u || x[12] !== f
          ? ((p = (0, t.jsxs)(t.Fragment, { children: [u, f] })),
            (x[11] = u),
            (x[12] = f),
            (x[13] = p))
          : (p = x[13]));
      let A = p;
      if (x[14] !== A || x[15] !== C || x[16] !== y || x[17] !== w) {
        h = Symbol.for("react.early_return_sentinel");
        e: if (
          ((_ = (0, r.c)(
            "flex w-full items-start border-b border-border-secondary text-left",
            n[y],
            i.U[y],
            C,
          )),
          w)
        ) {
          let e;
          (x[20] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)(l.kK, {
                "aria-hidden": !0,
                className: "size-3 shrink-0 self-center text-text-quaternary",
              })),
              (x[20] = e))
            : (e = x[20]),
            (h = (0, t.jsxs)("button", {
              type: "button",
              onClick: w,
              "data-density": y,
              "data-explainer-band": !0,
              className: (0, r.c)(
                _,
                "transition-colors hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-accent",
              ),
              children: [A, e],
            })));
          break e;
        }
        ((x[14] = A),
          (x[15] = C),
          (x[16] = y),
          (x[17] = w),
          (x[18] = _),
          (x[19] = h));
      } else ((_ = x[18]), (h = x[19]));
      return h !== Symbol.for("react.early_return_sentinel")
        ? h
        : (x[21] !== L
            ? ((g = L
                ? (0, t.jsx)("span", {
                    className: "flex shrink-0 items-center self-center",
                    children: L,
                  })
                : null),
              (x[21] = L),
              (x[22] = g))
            : (g = x[22]),
          x[23] !== A || x[24] !== y || x[25] !== _ || x[26] !== g
            ? ((b = (0, t.jsxs)("div", {
                "data-density": y,
                "data-explainer-band": !0,
                className: _,
                children: [A, g],
              })),
              (x[23] = A),
              (x[24] = y),
              (x[25] = _),
              (x[26] = g),
              (x[27] = b))
            : (b = x[27]),
          b);
    },
  ]);
};
