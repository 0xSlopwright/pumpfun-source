// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = {
      positive: "rgb(74 222 128)",
      negative: "rgb(248 113 113)",
      neutral: "#A1A1AA",
      foreground: "hsl(0 0% 97.25%)",
    },
    r = (e) => {
      let t = e.trim();
      return /^\d{1,3} \d{1,3} \d{1,3}$/.test(t) ? `rgb(${t})` : null;
    },
    i = null;
  e.s([
    "f",
    0,
    () => {
      if (i) return i;
      if ("u" < typeof document) return t;
      let e = getComputedStyle(document.documentElement),
        a = r(e.getPropertyValue("--gain")),
        n = r(e.getPropertyValue("--loss"));
      return a && n ? (i = { ...t, positive: a, negative: n }) : t;
    },
  ]);
};
