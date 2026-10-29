// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(453706),
    l = e.i(352386),
    n = e.i(338319);
  let i = (0, a.default)(() => e.A(179843).then((e) => e.LineChartCellChart), {
      loadableGenerated: { modules: [708937] },
      ssr: !1,
    }),
    s = (e) => {
      let a,
        l,
        i,
        s = (0, r.c)(5),
        { className: o } = e;
      return (
        s[0] !== o
          ? ((a = (0, n.c)("flex h-8 w-16 items-center justify-center", o)),
            (s[0] = o),
            (s[1] = a))
          : (a = s[1]),
        s[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((l = (0, t.jsx)("div", {
              className: "h-6 w-14 animate-pulse rounded bg-muted/60",
            })),
            (s[2] = l))
          : (l = s[2]),
        s[3] !== a
          ? ((i = (0, t.jsx)("div", { className: a, children: l })),
            (s[3] = a),
            (s[4] = i))
          : (i = s[4]),
        i
      );
    },
    o = (e) => {
      let a,
        l,
        i = (0, r.c)(4),
        { className: s } = e;
      return (
        i[0] !== s
          ? ((a = (0, n.c)(
              "flex h-8 w-16 items-center justify-center text-xs text-text-tertiary",
              s,
            )),
            (i[0] = s),
            (i[1] = a))
          : (a = i[1]),
        i[2] !== a
          ? ((l = (0, t.jsx)("div", { className: a, children: "-" })),
            (i[2] = a),
            (i[3] = l))
          : (l = i[3]),
        l
      );
    },
    c = l.default.memo(
      (e) => {
        let a,
          l,
          c,
          d = (0, r.c)(11),
          { data: u, isLoading: m, error: h, className: f } = e;
        if (void 0 !== m && m) {
          let e;
          return (
            d[0] !== f
              ? ((e = (0, t.jsx)(s, { className: f })), (d[0] = f), (d[1] = e))
              : (e = d[1]),
            e
          );
        }
        if ((void 0 === h ? null : h) || !u || u.length <= 1) {
          let e;
          return (
            d[2] !== f
              ? ((e = (0, t.jsx)(o, { className: f })), (d[2] = f), (d[3] = e))
              : (e = d[3]),
            e
          );
        }
        return (
          d[4] !== f
            ? ((a = (0, n.c)(
                "relative flex h-8 w-16 items-center justify-self-center transition-all duration-200 hover:scale-110 hover:brightness-110",
                f,
              )),
              (d[4] = f),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== u
            ? ((l = (0, t.jsx)(i, { data: u })), (d[6] = u), (d[7] = l))
            : (l = d[7]),
          d[8] !== a || d[9] !== l
            ? ((c = (0, t.jsx)("div", { className: a, children: l })),
              (d[8] = a),
              (d[9] = l),
              (d[10] = c))
            : (c = d[10]),
          c
        );
      },
      (e, t) =>
        e.isLoading === t.isLoading &&
        e.error === t.error &&
        e.className === t.className &&
        (e.data && t.data
          ? e.data.length === t.data.length &&
            e.data[e.data.length - 1]?.close ===
              t.data[t.data.length - 1]?.close
          : e.data === t.data),
    );
  e.s(["f", 0, c]);
};
