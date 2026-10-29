// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(439587),
    n = e.i(352386),
    a = e.i(338319),
    o = e.i(606178),
    s = e.i(908163);
  let l =
      "@container flex items-stretch justify-between gap-3 border-b border-border-secondary",
    d = { terminal: "min-h-9", comfortable: "min-h-11" },
    c = "-mb-px shrink-0 gap-6 !overflow-visible !border-0",
    u = { terminal: "!h-[37px]", comfortable: "!h-[45px]" },
    m =
      "!mb-0 !rounded-none !px-0 !py-0 !font-medium !text-text-tertiary hover:!text-text-primary data-[active]:!text-text-primary disabled:cursor-not-allowed disabled:opacity-40",
    f = {
      terminal: "!h-9 !gap-1.5 !text-[13px] [&>svg]:!size-3.5",
      comfortable: "!h-11 !gap-2 !text-sm [&>svg]:!size-4",
    },
    b = "flex shrink-0 items-center gap-2 self-center";
  function p(e) {
    return e.value;
  }
  e.s([
    "t",
    0,
    c,
    "b",
    0,
    u,
    "u",
    0,
    l,
    "T",
    0,
    d,
    "h",
    0,
    m,
    "U",
    0,
    f,
    "w",
    0,
    b,
    "p",
    0,
    function (e) {
      let h,
        w,
        v,
        g,
        y,
        x,
        k,
        C,
        S,
        N,
        _ = (0, i.c)(46),
        {
          density: j,
          value: P,
          onValueChange: E,
          tabs: O,
          tools: T,
          shrinkTools: M,
          tabsOverflow: A,
          children: F,
          className: I,
          listClassName: R,
          tabClassName: W,
          "aria-label": V,
        } = e,
        L = void 0 !== M && M,
        U = (0, n.useRef)(null),
        D = "scroll" === A;
      (_[0] !== O
        ? ((h = O.map(p).join(" ")), (_[0] = O), (_[1] = h))
        : (h = _[1]),
        _[2] !== D || _[3] !== h
          ? ((w = { rowRef: U, enabled: D, tabsKey: h }),
            (_[2] = D),
            (_[3] = h),
            (_[4] = w))
          : (w = _[4]));
      let z = ((e) => {
        let t,
          r,
          a = (0, i.c)(7),
          { rowRef: o, enabled: s, tabsKey: l } = e,
          [d, c] = (0, n.useState)(!1);
        return (
          a[0] !== s || a[1] !== o
            ? ((t = () => {
                let e = o.current,
                  t = e?.querySelector('[role="tablist"]');
                if (!s || !e || !t) return;
                let i = () => {
                  let { paddingLeft: i, paddingRight: r } = getComputedStyle(e),
                    n =
                      e.clientWidth -
                      (Number.parseFloat(i) || 0) -
                      (Number.parseFloat(r) || 0),
                    a = t.scrollWidth > n;
                  c((e) => (e === a ? e : a));
                };
                if ("u" < typeof ResizeObserver) {
                  let e = requestAnimationFrame(i);
                  return () => cancelAnimationFrame(e);
                }
                let r = new ResizeObserver(i);
                return (r.observe(e), r.observe(t), () => r.disconnect());
              }),
              (a[0] = s),
              (a[1] = o),
              (a[2] = t))
            : (t = a[2]),
          a[3] !== s || a[4] !== o || a[5] !== l
            ? ((r = [o, s, l]), (a[3] = s), (a[4] = o), (a[5] = l), (a[6] = r))
            : (r = a[6]),
          (0, n.useEffect)(t, r),
          d
        );
      })(w);
      _[5] !== E
        ? ((v = (e) => E(String(e))), (_[5] = E), (_[6] = v))
        : (v = _[6]);
      let B = d[j],
        q = o.U[j];
      _[7] !== I || _[8] !== B || _[9] !== q
        ? ((g = (0, a.c)(l, B, q, I)),
          (_[7] = I),
          (_[8] = B),
          (_[9] = q),
          (_[10] = g))
        : (g = _[10]);
      let H = z
          ? "-mb-px min-w-0 shrink gap-6 !overflow-x-auto !overflow-y-hidden !border-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : c,
        $ = u[j];
      if (
        (_[11] !== R || _[12] !== H || _[13] !== $
          ? ((y = (0, a.c)(H, $, R)),
            (_[11] = R),
            (_[12] = H),
            (_[13] = $),
            (_[14] = y))
          : (y = _[14]),
        _[15] !== j ||
          _[16] !== z ||
          _[17] !== E ||
          _[18] !== W ||
          _[19] !== O ||
          _[20] !== P)
      ) {
        let e;
        (_[22] !== j || _[23] !== z || _[24] !== E || _[25] !== W || _[26] !== P
          ? ((e = (e) =>
              (0, t.jsxs)(
                r.V,
                {
                  value: e.value,
                  disabled: e.disabled,
                  ...(e.onClick
                    ? {
                        onClick: (t) => {
                          (e.onClick?.(t),
                            t.preventBaseUIHandler?.(),
                            e.disabled || e.value === P || E(e.value));
                        },
                      }
                    : void 0),
                  className: (0, a.c)(m, f[j], z && "focus-inset", W),
                  children: [
                    e.label,
                    void 0 !== e.count && null !== e.count
                      ? (0, t.jsx)(s.E, {
                          density: j,
                          className: "text-text-tertiary",
                          children: e.count,
                        })
                      : null,
                  ],
                },
                e.value,
              )),
            (_[22] = j),
            (_[23] = z),
            (_[24] = E),
            (_[25] = W),
            (_[26] = P),
            (_[27] = e))
          : (e = _[27]),
          (x = O.map(e)),
          (_[15] = j),
          (_[16] = z),
          (_[17] = E),
          (_[18] = W),
          (_[19] = O),
          (_[20] = P),
          (_[21] = x));
      } else x = _[21];
      return (
        _[28] !== V || _[29] !== y || _[30] !== x
          ? ((k = (0, t.jsx)(r.R, {
              "aria-label": V,
              className: y,
              children: x,
            })),
            (_[28] = V),
            (_[29] = y),
            (_[30] = x),
            (_[31] = k))
          : (k = _[31]),
        _[32] !== L || _[33] !== T
          ? ((C = T
              ? (0, t.jsx)("div", {
                  "data-tab-strip-tools": !0,
                  "data-shrink": L ? "" : void 0,
                  className: L
                    ? "flex min-w-0 shrink grow items-center justify-end gap-2 self-center"
                    : b,
                  children: T,
                })
              : null),
            (_[32] = L),
            (_[33] = T),
            (_[34] = C))
          : (C = _[34]),
        _[35] !== j || _[36] !== k || _[37] !== C || _[38] !== g || _[39] !== A
          ? ((S = (0, t.jsxs)("div", {
              ref: U,
              "data-tab-strip": !0,
              "data-density": j,
              "data-tabs-overflow": A,
              className: g,
              children: [k, C],
            })),
            (_[35] = j),
            (_[36] = k),
            (_[37] = C),
            (_[38] = g),
            (_[39] = A),
            (_[40] = S))
          : (S = _[40]),
        _[41] !== F || _[42] !== S || _[43] !== v || _[44] !== P
          ? ((N = (0, t.jsxs)(r.i, {
              value: P,
              onValueChange: v,
              children: [S, F],
            })),
            (_[41] = F),
            (_[42] = S),
            (_[43] = v),
            (_[44] = P),
            (_[45] = N))
          : (N = _[45]),
        N
      );
    },
  ]);
};
