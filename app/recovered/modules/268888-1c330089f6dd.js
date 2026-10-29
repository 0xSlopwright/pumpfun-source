// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(778593);
  (e.i(53479).A,
    e.s([
      "f",
      0,
      () => {
        let e,
          r,
          n = (0, t.c)(5),
          { activePreset: o, updateActivePreset: a } = (0, i.f)();
        n[0] !== a
          ? ((e = (e) => {
              a({ priorityFee: Math.max(e ?? 0, 0) });
            }),
            (n[0] = a),
            (n[1] = e))
          : (e = n[1]);
        let s = e;
        return (
          n[2] !== o.priorityFee || n[3] !== s
            ? ((r = { priorityFee: o.priorityFee, setPriorityFee: s }),
              (n[2] = o.priorityFee),
              (n[3] = s),
              (n[4] = r))
            : (r = n[4]),
          r
        );
      },
    ]));
};
