// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242);
  e.i(550675);
  var n = e.i(547562),
    r = e.i(53479);
  function s(e) {
    if (e.presets.length >= r.P) return e;
    let t = [...e.presets, (0, r.z)(e.presets.length)];
    return { active: t.length - 1, presets: t };
  }
  function i(e) {
    return {
      ...e,
      presets: e.presets.map((t, n) =>
        n === e.active ? { ...(0, r.z)(n), name: t.name } : t,
      ),
    };
  }
  e.s([
    "f",
    0,
    function () {
      let e,
        a,
        o,
        l,
        u,
        c,
        d,
        f,
        m = (0, t.c)(27),
        [h, g] = (0, n.l)("trading.presets"),
        p = h.active,
        _ = h.presets[p];
      m[0] !== g
        ? ((e = (e) => {
            g((t) => ({ ...t, active: (0, r.l)(e, t.presets.length) }));
          }),
          (m[0] = g),
          (m[1] = e))
        : (e = m[1]);
      let b = e;
      m[2] !== g
        ? ((a = (e) => {
            g((t) => ({
              ...t,
              presets: t.presets.map((n, s) =>
                s === t.active ? (0, r.C)({ ...n, ...e }, s) : n,
              ),
            }));
          }),
          (m[2] = g),
          (m[3] = a))
        : (a = m[3]);
      let y = a;
      m[4] !== g
        ? ((o = (e) => {
            let { index: t, name: n } = e;
            g((e) => {
              let s = (0, r.l)(t, e.presets.length);
              return {
                ...e,
                presets: e.presets.map((e, t) =>
                  t === s ? { ...e, name: (0, r.X)(n) } : e,
                ),
              };
            });
          }),
          (m[4] = g),
          (m[5] = o))
        : (o = m[5]);
      let v = o;
      m[6] !== g
        ? ((l = () => {
            g(i);
          }),
          (m[6] = g),
          (m[7] = l))
        : (l = m[7]);
      let w = l;
      m[8] !== g
        ? ((u = () => {
            g(s);
          }),
          (m[8] = g),
          (m[9] = u))
        : (u = m[9]);
      let z = u;
      m[10] !== g
        ? ((c = (e) => {
            g((t) => (0, r._)(t, e));
          }),
          (m[10] = g),
          (m[11] = c))
        : (c = m[11]);
      let x = c;
      m[12] !== g
        ? ((d = (e) => {
            g((t) => (0, r.L)(t, e));
          }),
          (m[12] = g),
          (m[13] = d))
        : (d = m[13]);
      let k = d,
        S = h.presets.length < r.P,
        $ = h.presets.length > 1;
      return (
        m[14] !== p ||
        m[15] !== _ ||
        m[16] !== z ||
        m[17] !== k ||
        m[18] !== x ||
        m[19] !== v ||
        m[20] !== w ||
        m[21] !== b ||
        m[22] !== h.presets ||
        m[23] !== S ||
        m[24] !== $ ||
        m[25] !== y
          ? ((f = {
              presets: h.presets,
              activeIndex: p,
              activePreset: _,
              canAddPreset: S,
              canDeletePreset: $,
              setActiveIndex: b,
              updateActivePreset: y,
              renamePreset: v,
              resetActivePreset: w,
              addPreset: z,
              duplicatePreset: x,
              deletePreset: k,
            }),
            (m[14] = p),
            (m[15] = _),
            (m[16] = z),
            (m[17] = k),
            (m[18] = x),
            (m[19] = v),
            (m[20] = w),
            (m[21] = b),
            (m[22] = h.presets),
            (m[23] = S),
            (m[24] = $),
            (m[25] = y),
            (m[26] = f))
          : (f = m[26]),
        f
      );
    },
  ]);
};
