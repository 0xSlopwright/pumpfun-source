// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    (e) => {
      let t = 0;
      for (let i = 0; i < e.length; i++)
        ((t = e.charCodeAt(i) + ((t << 5) - t)), (t &= t));
      let i = ((t = Math.abs(t)) % 128) + 127,
        r = ((t >> 8) % 128) + 127,
        n = ((t >> 16) % 128) + 127;
      return `#${i.toString(16).padStart(2, "0")}${r.toString(16).padStart(2, "0")}${n.toString(16).padStart(2, "0")}`;
    },
  ]);
};
