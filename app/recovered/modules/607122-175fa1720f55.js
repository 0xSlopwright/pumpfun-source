// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386),
    a = e.i(338319),
    l = e.i(813792);
  let i = { terminal: 24, comfortable: 28 },
    s =
      "inline-flex w-fit shrink-0 items-stretch gap-0.5 rounded-md border border-border-tertiary bg-bg-secondary p-0.5",
    o = { 24: "h-6", 28: "h-7", 32: "h-8" },
    c =
      "inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm text-xs leading-4 font-medium text-text-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent aria-checked:bg-bg-tertiary aria-checked:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-text-tertiary aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:text-text-tertiary [&>svg]:size-3.5 [&>svg]:shrink-0",
    d = "ml-0.5 inline-flex items-center border-l border-border-tertiary pl-1",
    u = { 24: "px-2", 28: "px-2.5", 32: "px-3" },
    f = {
      mint: "aria-checked:bg-bg-accent aria-checked:text-[var(--color-text-on-accent)]",
      gain: "aria-checked:bg-gain aria-checked:text-[var(--color-text-on-accent)]",
      loss: "aria-checked:bg-loss aria-checked:text-[var(--color-text-on-error)]",
    },
    h = new Set(["ArrowRight", "ArrowDown"]),
    m = new Set(["ArrowLeft", "ArrowUp"]);
  function b(e) {
    return !e.disabled;
  }
  e.s([
    "l",
    0,
    i,
    "C",
    0,
    c,
    "_",
    0,
    u,
    "f",
    0,
    s,
    "h",
    0,
    o,
    "w",
    0,
    d,
    "X",
    0,
    function (e) {
      let x,
        p,
        y,
        g,
        v,
        w,
        j,
        _,
        k,
        N = (0, r.c)(38),
        {
          density: S,
          size: B,
          value: C,
          onValueChange: A,
          options: I,
          fullWidth: L,
          trailing: F,
          className: E,
          optionClassName: M,
          "aria-label": R,
          "aria-labelledby": T,
        } = e,
        O = void 0 === B ? i[S] : B,
        $ = void 0 !== L && L;
      N[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((x = new Map()), (N[0] = x))
        : (x = N[0]);
      let D = (0, n.useRef)(x);
      if (N[1] !== I || N[2] !== C) {
        let e;
        ((p = I.filter(b)),
          N[5] !== C
            ? ((e = (e) => e.value === C), (N[5] = C), (N[6] = e))
            : (e = N[6]),
          (y = p.findIndex(e)),
          (N[1] = I),
          (N[2] = C),
          (N[3] = p),
          (N[4] = y));
      } else ((p = N[3]), (y = N[4]));
      let U = y,
        z = p[U >= 0 ? U : 0]?.value;
      N[7] !== A
        ? ((g = (e) => {
            (A(e), D.current.get(e)?.focus());
          }),
          (N[7] = A),
          (N[8] = g))
        : (g = N[8]);
      let P = g;
      N[9] !== U || N[10] !== P || N[11] !== p || N[12] !== C
        ? ((v = (e) => {
            let t;
            if (
              0 === p.length ||
              ![...D.current.values()].some((t) => t === e.target)
            )
              return;
            let r = Math.max(U, 0);
            (h.has(e.key)
              ? (t = p[(r + 1) % p.length])
              : m.has(e.key)
                ? (t = p[(r - 1 + p.length) % p.length])
                : "Home" === e.key
                  ? (t = p[0])
                  : "End" === e.key && (t = p[p.length - 1]),
              t &&
                (e.preventDefault(),
                t.value !== C ? P(t.value) : D.current.get(t.value)?.focus()));
          }),
          (N[9] = U),
          (N[10] = P),
          (N[11] = p),
          (N[12] = C),
          (N[13] = v))
        : (v = N[13]);
      let q = v,
        W = o[O],
        K = $ && "flex w-full";
      return (
        N[14] !== E || N[15] !== W || N[16] !== K
          ? ((w = (0, a.c)(s, W, K, E)),
            (N[14] = E),
            (N[15] = W),
            (N[16] = K),
            (N[17] = w))
          : (w = N[17]),
        N[18] !== P ||
        N[19] !== S ||
        N[20] !== $ ||
        N[21] !== M ||
        N[22] !== I ||
        N[23] !== O ||
        N[24] !== z ||
        N[25] !== C
          ? ((j = I.map((e) => {
              let r = e.value === C,
                n = (0, t.jsx)(
                  "button",
                  {
                    ref: (t) => {
                      t ? D.current.set(e.value, t) : D.current.delete(e.value);
                    },
                    type: "button",
                    role: "radio",
                    "aria-checked": r,
                    tabIndex: e.value === z ? 0 : -1,
                    disabled: (!!e.disabled && !e.disabledReason) || void 0,
                    "aria-disabled":
                      (!!e.disabled && !!e.disabledReason) || void 0,
                    title: e.title,
                    "data-tone": e.tone,
                    onClick: () => {
                      e.disabled || r || P(e.value);
                    },
                    className: (0, a.c)(
                      c,
                      u[O],
                      e.tone && f[e.tone],
                      $ && "flex-1",
                      M,
                    ),
                    children: e.label,
                  },
                  e.value,
                ),
                i = e.tooltip ?? (e.disabled ? e.disabledReason : void 0);
              return i
                ? (0, t.jsx)(
                    l.f,
                    { content: i, density: S, children: n },
                    e.value,
                  )
                : n;
            })),
            (N[18] = P),
            (N[19] = S),
            (N[20] = $),
            (N[21] = M),
            (N[22] = I),
            (N[23] = O),
            (N[24] = z),
            (N[25] = C),
            (N[26] = j))
          : (j = N[26]),
        N[27] !== F
          ? ((_ = F ? (0, t.jsx)("span", { className: d, children: F }) : null),
            (N[27] = F),
            (N[28] = _))
          : (_ = N[28]),
        N[29] !== R ||
        N[30] !== T ||
        N[31] !== S ||
        N[32] !== q ||
        N[33] !== O ||
        N[34] !== _ ||
        N[35] !== w ||
        N[36] !== j
          ? ((k = (0, t.jsxs)("div", {
              role: "radiogroup",
              "aria-label": R,
              "aria-labelledby": T,
              "data-density": S,
              "data-size": O,
              onKeyDown: q,
              className: w,
              children: [j, _],
            })),
            (N[29] = R),
            (N[30] = T),
            (N[31] = S),
            (N[32] = q),
            (N[33] = O),
            (N[34] = _),
            (N[35] = w),
            (N[36] = j),
            (N[37] = k))
          : (k = N[37]),
        k
      );
    },
  ]);
};
