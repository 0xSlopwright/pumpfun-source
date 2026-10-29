// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(426091),
    n = e.i(352386);
  let a = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)("w-full caption-bottom text-sm", a)),
          (d[3] = a),
          (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("div", {
            className: "relative w-full min-w-0 overflow-auto",
            children: (0, t.jsx)("table", { ref: n, className: s, ...o }),
          })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  a.displayName = "Table";
  let o = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)("[&_tr]:border-b", a)), (d[3] = a), (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("thead", { ref: n, className: s, ...o })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  o.displayName = "TableHeader";
  let s = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)("[&_tr:last-child]:border-0", a)),
          (d[3] = a),
          (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("tbody", { ref: n, className: s, ...o })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  ((s.displayName = "TableBody"),
    (n.forwardRef((e, n) => {
      let a,
        o,
        s,
        l,
        d = (0, i.c)(9);
      return (
        d[0] !== e
          ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
          : ((a = d[1]), (o = d[2])),
        d[3] !== a
          ? ((s = (0, r.c)(
              "border-border-secondary border-t bg-bg-secondary/50 font-medium text-text-primary [&>tr]:last:border-b-0",
              a,
            )),
            (d[3] = a),
            (d[4] = s))
          : (s = d[4]),
        d[5] !== o || d[6] !== n || d[7] !== s
          ? ((l = (0, t.jsx)("tfoot", { ref: n, className: s, ...o })),
            (d[5] = o),
            (d[6] = n),
            (d[7] = s),
            (d[8] = l))
          : (l = d[8]),
        l
      );
    }).displayName = "TableFooter"));
  let l = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)(
            "border-b border-border-secondary transition-colors hover:bg-bg-secondary/70 data-[state=selected]:bg-bg-secondary",
            a,
          )),
          (d[3] = a),
          (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("tr", { ref: n, className: s, ...o })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  l.displayName = "TableRow";
  let d = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)(
            "h-12 px-4 text-left align-middle font-medium text-text-secondary [&:has([role=checkbox])]:pr-0",
            a,
          )),
          (d[3] = a),
          (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("th", { ref: n, className: s, ...o })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  d.displayName = "TableHead";
  let c = n.forwardRef((e, n) => {
    let a,
      o,
      s,
      l,
      d = (0, i.c)(9);
    return (
      d[0] !== e
        ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
        : ((a = d[1]), (o = d[2])),
      d[3] !== a
        ? ((s = (0, r.c)(
            "text-text-primary p-4 align-middle [&:has([role=checkbox])]:pr-0",
            a,
          )),
          (d[3] = a),
          (d[4] = s))
        : (s = d[4]),
      d[5] !== o || d[6] !== n || d[7] !== s
        ? ((l = (0, t.jsx)("td", { ref: n, className: s, ...o })),
          (d[5] = o),
          (d[6] = n),
          (d[7] = s),
          (d[8] = l))
        : (l = d[8]),
      l
    );
  });
  ((c.displayName = "TableCell"),
    (n.forwardRef((e, n) => {
      let a,
        o,
        s,
        l,
        d = (0, i.c)(9);
      return (
        d[0] !== e
          ? (({ className: a, ...o } = e), (d[0] = e), (d[1] = a), (d[2] = o))
          : ((a = d[1]), (o = d[2])),
        d[3] !== a
          ? ((s = (0, r.c)("mt-4 text-sm text-text-tertiary", a)),
            (d[3] = a),
            (d[4] = s))
          : (s = d[4]),
        d[5] !== o || d[6] !== n || d[7] !== s
          ? ((l = (0, t.jsx)("caption", { ref: n, className: s, ...o })),
            (d[5] = o),
            (d[6] = n),
            (d[7] = s),
            (d[8] = l))
          : (l = d[8]),
        l
      );
    }).displayName = "TableCaption"),
    e.s(["s", 0, a, "z", 0, s, "d", 0, c, "U", 0, d, "E", 0, o, "N", 0, l]));
};
