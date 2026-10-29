// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242);
  e.i(550675);
  var n = e.i(547562),
    r = e.i(53479);
  function a(e) {
    if (e.presets.length >= r.P) return e;
    let t = [...e.presets, (0, r.z)(e.presets.length)];
    return { active: t.length - 1, presets: t };
  }
  function s(e) {
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
        i,
        o,
        l,
        c,
        u,
        d,
        f,
        m = (0, t.c)(27),
        [p, g] = (0, n.l)("trading.presets"),
        h = p.active,
        b = p.presets[h];
      m[0] !== g
        ? ((e = (e) => {
            g((t) => ({ ...t, active: (0, r.l)(e, t.presets.length) }));
          }),
          (m[0] = g),
          (m[1] = e))
        : (e = m[1]);
      let y = e;
      m[2] !== g
        ? ((i = (e) => {
            g((t) => ({
              ...t,
              presets: t.presets.map((n, a) =>
                a === t.active ? (0, r.C)({ ...n, ...e }, a) : n,
              ),
            }));
          }),
          (m[2] = g),
          (m[3] = i))
        : (i = m[3]);
      let w = i;
      m[4] !== g
        ? ((o = (e) => {
            let { index: t, name: n } = e;
            g((e) => {
              let a = (0, r.l)(t, e.presets.length);
              return {
                ...e,
                presets: e.presets.map((e, t) =>
                  t === a ? { ...e, name: (0, r.X)(n) } : e,
                ),
              };
            });
          }),
          (m[4] = g),
          (m[5] = o))
        : (o = m[5]);
      let _ = o;
      m[6] !== g
        ? ((l = () => {
            g(s);
          }),
          (m[6] = g),
          (m[7] = l))
        : (l = m[7]);
      let v = l;
      m[8] !== g
        ? ((c = () => {
            g(a);
          }),
          (m[8] = g),
          (m[9] = c))
        : (c = m[9]);
      let k = c;
      m[10] !== g
        ? ((u = (e) => {
            g((t) => (0, r._)(t, e));
          }),
          (m[10] = g),
          (m[11] = u))
        : (u = m[11]);
      let x = u;
      m[12] !== g
        ? ((d = (e) => {
            g((t) => (0, r.L)(t, e));
          }),
          (m[12] = g),
          (m[13] = d))
        : (d = m[13]);
      let j = d,
        $ = p.presets.length < r.P,
        S = p.presets.length > 1;
      return (
        m[14] !== h ||
        m[15] !== b ||
        m[16] !== k ||
        m[17] !== j ||
        m[18] !== x ||
        m[19] !== _ ||
        m[20] !== v ||
        m[21] !== y ||
        m[22] !== p.presets ||
        m[23] !== $ ||
        m[24] !== S ||
        m[25] !== w
          ? ((f = {
              presets: p.presets,
              activeIndex: h,
              activePreset: b,
              canAddPreset: $,
              canDeletePreset: S,
              setActiveIndex: y,
              updateActivePreset: w,
              renamePreset: _,
              resetActivePreset: v,
              addPreset: k,
              duplicatePreset: x,
              deletePreset: j,
            }),
            (m[14] = h),
            (m[15] = b),
            (m[16] = k),
            (m[17] = j),
            (m[18] = x),
            (m[19] = _),
            (m[20] = v),
            (m[21] = y),
            (m[22] = p.presets),
            (m[23] = $),
            (m[24] = S),
            (m[25] = w),
            (m[26] = f))
          : (f = m[26]),
        f
      );
    },
  ]);
};
