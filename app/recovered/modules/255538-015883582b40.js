// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(620268),
    r = e.i(449597);
  e.s([
    "f",
    0,
    function (e) {
      let i = "string" == typeof e ? e : e?.toBase58(),
        n = (0, r.L)(i),
        a = void 0 === n && i ? i : void 0,
        { data: l } = (0, t.x)({
          addresses: a ? [a] : [],
          enabled: void 0 !== a,
        });
      return void 0 !== n
        ? n
        : (a ? l?.get(a.toLowerCase())?.symbol?.trim() : void 0) || (0, r.q)(i);
    },
  ]);
};
