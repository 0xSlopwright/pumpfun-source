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
          o,
          n = (0, t.c)(5),
          { activePreset: r, updateActivePreset: u } = (0, i.f)();
        n[0] !== u
          ? ((e = (e) => {
              u({ priorityFee: Math.max(e ?? 0, 0) });
            }),
            (n[0] = u),
            (n[1] = e))
          : (e = n[1]);
        let a = e;
        return (
          n[2] !== r.priorityFee || n[3] !== a
            ? ((o = { priorityFee: r.priorityFee, setPriorityFee: a }),
              (n[2] = r.priorityFee),
              (n[3] = a),
              (n[4] = o))
            : (o = n[4]),
          o
        );
      },
    ]));
};
