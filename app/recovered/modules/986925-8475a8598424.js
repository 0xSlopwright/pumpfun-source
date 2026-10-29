// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  e.s(
    [
      "f",
      0,
      function (e) {
        return "string" == typeof e && t.test(e);
      },
    ],
    937921,
  );
  let n = [];
  for (let e = 0; e < 256; ++e) n.push((e + 256).toString(16).slice(1));
  e.s(
    [
      "f",
      0,
      function (e, t = 0) {
        return (
          n[e[t + 0]] +
          n[e[t + 1]] +
          n[e[t + 2]] +
          n[e[t + 3]] +
          "-" +
          n[e[t + 4]] +
          n[e[t + 5]] +
          "-" +
          n[e[t + 6]] +
          n[e[t + 7]] +
          "-" +
          n[e[t + 8]] +
          n[e[t + 9]] +
          "-" +
          n[e[t + 10]] +
          n[e[t + 11]] +
          n[e[t + 12]] +
          n[e[t + 13]] +
          n[e[t + 14]] +
          n[e[t + 15]]
        ).toLowerCase();
      },
    ],
    986925,
  );
};
