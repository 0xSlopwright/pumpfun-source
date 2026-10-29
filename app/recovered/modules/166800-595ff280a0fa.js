// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(76373),
    r = e.i(989494),
    o = e.i(964764),
    s = e.i(887857),
    n = e.i(515752);
  e.s([
    "f",
    0,
    function (e) {
      let { abi: a, data: i } = e,
        c = (0, r.M)(i, 0, 4),
        l = a.find((e) => "function" === e.type && c === (0, o.f)((0, n.r)(e)));
      if (!l)
        throw new t.N(c, { docsPath: "/docs/contract/decodeFunctionData" });
      return {
        functionName: l.name,
        args:
          "inputs" in l && l.inputs && l.inputs.length > 0
            ? (0, s.f)(l.inputs, (0, r.M)(i, 4))
            : void 0,
      };
    },
  ]);
};
