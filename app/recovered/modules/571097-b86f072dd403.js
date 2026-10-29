// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242);
  e.i(12692);
  var r = e.i(398902),
    a = e.i(375670);
  let n = ["a", "b", "c", "d"];
  function l(e) {
    return (0, t.jsxs)(
      "span",
      {
        className: "flex w-14 flex-col items-center gap-1.5",
        children: [
          (0, t.jsx)(a.f, { className: "size-11 rounded-full" }),
          (0, t.jsx)(a.f, { className: "h-3 w-10" }),
        ],
      },
      e,
    );
  }
  e.s([
    "$",
    0,
    function (e) {
      let a,
        n,
        l,
        s = (0, i.c)(8),
        { children: o } = e,
        { t: d } = (0, r.f)();
      s[0] !== d
        ? ((a = d("chat.dms.share.send_in_dm")), (s[0] = d), (s[1] = a))
        : (a = s[1]);
      let u = a;
      return (
        s[2] !== u
          ? ((n = (0, t.jsx)("p", {
              className: "text-xs font-semibold text-text-secondary",
              children: u,
            })),
            (s[2] = u),
            (s[3] = n))
          : (n = s[3]),
        s[4] !== o || s[5] !== n || s[6] !== u
          ? ((l = (0, t.jsxs)("section", {
              "aria-label": u,
              className: "flex flex-col gap-2",
              "data-testid": "dm-share-strip",
              children: [n, o],
            })),
            (s[4] = o),
            (s[5] = n),
            (s[6] = u),
            (s[7] = l))
          : (l = s[7]),
        l
      );
    },
    "t",
    0,
    function () {
      let e,
        r = (0, i.c)(1);
      return (
        r[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = (0, t.jsx)("div", {
              "aria-busy": !0,
              className: "flex gap-2.5",
              children: n.map(l),
            })),
            (r[0] = e))
          : (e = r[0]),
        e
      );
    },
  ]);
};
