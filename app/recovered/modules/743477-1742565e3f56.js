// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(338319);
  e.s([
    "g",
    0,
    function () {
      let e,
        n = (0, r.c)(1);
      return (
        n[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = (0, t.jsx)("span", {
              className: "absolute inset-0 flex items-center justify-center",
              children: (0, t.jsx)("span", {
                className:
                  "flex size-5 items-center justify-center rounded-full bg-bg-primary/80",
                children: (0, t.jsx)("svg", {
                  viewBox: "0 0 10 10",
                  className: "size-2.5 fill-current text-text-primary",
                  "aria-hidden": !0,
                  children: (0, t.jsx)("path", { d: "M2 1.5v7l6-3.5z" }),
                }),
              }),
            })),
            (n[0] = e))
          : (e = n[0]),
        e
      );
    },
    "a",
    0,
    function (e) {
      let i,
        a,
        l = (0, r.c)(9),
        { isSelected: o, label: s, onClick: c, testId: u, children: d } = e,
        f = o
          ? "border-primary-green"
          : "border-border-tertiary hover:border-border-secondary";
      return (
        l[0] !== f
          ? ((i = (0, n.c)(
              "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors",
              f,
            )),
            (l[0] = f),
            (l[1] = i))
          : (i = l[1]),
        l[2] !== d ||
        l[3] !== o ||
        l[4] !== s ||
        l[5] !== c ||
        l[6] !== i ||
        l[7] !== u
          ? ((a = (0, t.jsx)("button", {
              type: "button",
              "aria-label": s,
              "aria-pressed": o,
              "data-testid": u,
              onClick: c,
              className: i,
              children: d,
            })),
            (l[2] = d),
            (l[3] = o),
            (l[4] = s),
            (l[5] = c),
            (l[6] = i),
            (l[7] = u),
            (l[8] = a))
          : (a = l[8]),
        a
      );
    },
  ]);
};
