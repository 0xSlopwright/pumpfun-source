// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(453706),
    i = e.i(352386),
    o = e.i(338319);
  let s = (0, r.default)(() => e.A(179843).then((e) => e.LineChartCellChart), {
      loadableGenerated: { modules: [708937] },
      ssr: !1,
    }),
    a = (e) => {
      let r,
        i,
        s,
        a = (0, n.c)(5),
        { className: l } = e;
      return (
        a[0] !== l
          ? ((r = (0, o.c)("flex h-8 w-16 items-center justify-center", l)),
            (a[0] = l),
            (a[1] = r))
          : (r = a[1]),
        a[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (0, t.jsx)("div", {
              className: "h-6 w-14 animate-pulse rounded bg-muted/60",
            })),
            (a[2] = i))
          : (i = a[2]),
        a[3] !== r
          ? ((s = (0, t.jsx)("div", { className: r, children: i })),
            (a[3] = r),
            (a[4] = s))
          : (s = a[4]),
        s
      );
    },
    l = (e) => {
      let r,
        i,
        s = (0, n.c)(4),
        { className: a } = e;
      return (
        s[0] !== a
          ? ((r = (0, o.c)(
              "flex h-8 w-16 items-center justify-center text-xs text-text-tertiary",
              a,
            )),
            (s[0] = a),
            (s[1] = r))
          : (r = s[1]),
        s[2] !== r
          ? ((i = (0, t.jsx)("div", { className: r, children: "-" })),
            (s[2] = r),
            (s[3] = i))
          : (i = s[3]),
        i
      );
    },
    c = i.default.memo(
      (e) => {
        let r,
          i,
          c,
          u = (0, n.c)(11),
          { data: d, isLoading: m, error: E, className: f } = e;
        if (void 0 !== m && m) {
          let e;
          return (
            u[0] !== f
              ? ((e = (0, t.jsx)(a, { className: f })), (u[0] = f), (u[1] = e))
              : (e = u[1]),
            e
          );
        }
        if ((void 0 === E ? null : E) || !d || d.length <= 1) {
          let e;
          return (
            u[2] !== f
              ? ((e = (0, t.jsx)(l, { className: f })), (u[2] = f), (u[3] = e))
              : (e = u[3]),
            e
          );
        }
        return (
          u[4] !== f
            ? ((r = (0, o.c)(
                "relative flex h-8 w-16 items-center justify-self-center transition-all duration-200 hover:scale-110 hover:brightness-110",
                f,
              )),
              (u[4] = f),
              (u[5] = r))
            : (r = u[5]),
          u[6] !== d
            ? ((i = (0, t.jsx)(s, { data: d })), (u[6] = d), (u[7] = i))
            : (i = u[7]),
          u[8] !== r || u[9] !== i
            ? ((c = (0, t.jsx)("div", { className: r, children: i })),
              (u[8] = r),
              (u[9] = i),
              (u[10] = c))
            : (c = u[10]),
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
