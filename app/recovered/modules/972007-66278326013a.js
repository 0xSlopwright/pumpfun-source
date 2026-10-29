// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(426091);
  let n = (0, e.i(294237).f)(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-bg-accent text-primary-foreground hover:bg-primary/80",
          secondary:
            "border-transparent bg-bg-tertiary text-text-primary hover:bg-bg-quaternary",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline:
            "border-border-secondary bg-bg-secondary text-text-primary hover:bg-bg-tertiary",
          transparent:
            "border-transparent bg-bg-secondary text-text-tertiary cursor-pointer rounded-lg",
        },
      },
      defaultVariants: { variant: "default" },
    },
  );
  e.s([
    "f",
    0,
    function (e) {
      let a,
        o,
        s,
        l,
        d,
        c,
        u = (0, i.c)(11);
      return (
        u[0] !== e
          ? (({ className: a, variant: s, ...o } = e),
            (u[0] = e),
            (u[1] = a),
            (u[2] = o),
            (u[3] = s))
          : ((a = u[1]), (o = u[2]), (s = u[3])),
        u[4] !== a || u[5] !== s
          ? ((l = (0, r.c)(n({ variant: s }), a)),
            (u[4] = a),
            (u[5] = s),
            (u[6] = l))
          : (l = u[6]),
        u[7] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = { borderRadius: "8px" }), (u[7] = d))
          : (d = u[7]),
        u[8] !== o || u[9] !== l
          ? ((c = (0, t.jsx)("div", { className: l, style: d, ...o })),
            (u[8] = o),
            (u[9] = l),
            (u[10] = c))
          : (c = u[10]),
        c
      );
    },
  ]);
};
