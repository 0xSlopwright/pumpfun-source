// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function t(e) {
    return `0x${e.reduce((e, t) => e + t.replace("0x", ""), "")}`;
  }
  e.s([
    "w",
    0,
    function (e) {
      return "string" == typeof e[0]
        ? t(e)
        : (function (e) {
            let t = 0;
            for (let i of e) t += i.length;
            let i = new Uint8Array(t),
              f = 0;
            for (let t of e) (i.set(t, f), (f += t.length));
            return i;
          })(e);
    },
    "s",
    0,
    t,
  ]);
};
