// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e, t) {
      let i = e.toString(),
        f = i.startsWith("-");
      f && (i = i.slice(1));
      let [s, n] = [
        (i = i.padStart(t, "0")).slice(0, i.length - t),
        i.slice(i.length - t),
      ];
      return (
        (n = n.replace(/(0+)$/, "")),
        `${f ? "-" : ""}${s || "0"}${n ? `.${n}` : ""}`
      );
    },
  ]);
};
