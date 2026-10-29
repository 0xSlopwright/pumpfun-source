// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let f,
    r = 256;
  e.s([
    "f",
    0,
    function (e = 11) {
      if (!f || r + e > 512) {
        ((f = ""), (r = 0));
        for (let e = 0; e < 256; e++)
          f += ((256 + 256 * Math.random()) | 0).toString(16).substring(1);
      }
      return f.substring(r, r++ + e);
    },
  ]);
};
