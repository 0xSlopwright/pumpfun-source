// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(157633);
  e.s([
    "f",
    0,
    (e) => {
      let i,
        o,
        s,
        a,
        l,
        c = (0, n.c)(9),
        { onAddFunds: u, message: d } = e,
        m = void 0 === d ? "You need at least $10 in your wallet to chat." : d;
      return (
        c[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (0, t.jsx)("span", {
              "aria-hidden": !0,
              className: "pointer-events-none absolute inset-0",
              style: {
                background:
                  "linear-gradient(135deg, hsl(var(--primary) / 0.16) 0%, transparent 60%)",
              },
            })),
            (c[0] = i))
          : (i = c[0]),
        c[1] === Symbol.for("react.memo_cache_sentinel")
          ? ((o = (0, t.jsx)("span", {
              className:
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary",
              children: (0, t.jsx)(r.Of, { className: "size-5" }),
            })),
            (c[1] = o))
          : (o = c[1]),
        c[2] !== m
          ? ((s = (0, t.jsx)("span", {
              className: "relative z-10 min-w-0 flex-1 text-sm font-semibold",
              children: m,
            })),
            (c[2] = m),
            (c[3] = s))
          : (s = c[3]),
        c[4] !== u
          ? ((a = (0, t.jsx)("button", {
              type: "button",
              onClick: u,
              "data-testid": "livechat-insufficient-portfolio-toast-cta",
              className:
                "relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-[filter,transform] hover:brightness-110 active:translate-y-px",
              children: "Add funds",
            })),
            (c[4] = u),
            (c[5] = a))
          : (a = c[5]),
        c[6] !== s || c[7] !== a
          ? ((l = (0, t.jsxs)("div", {
              role: "alert",
              "data-testid": "livechat-insufficient-portfolio-toast",
              className:
                "relative flex w-full min-w-[320px] max-w-[420px] items-center gap-3 overflow-hidden rounded-xl border border-primary/30 bg-popover p-3 text-left text-popover-foreground shadow-lg",
              children: [i, o, s, a],
            })),
            (c[6] = s),
            (c[7] = a),
            (c[8] = l))
          : (l = c[8]),
        l
      );
    },
  ]);
};
