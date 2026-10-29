// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    l = e.i(909316),
    r = e.i(696500),
    i = e.i(164674),
    i = i,
    n = e.i(288912),
    o = e.i(108305),
    s = e.i(446929),
    c = e.i(426091),
    u = e.i(360827);
  let d = l.f.Root,
    m = r.f.Trigger;
  i.Close;
  let f = { comfortable: "p-4", terminal: "p-3" };
  e.s(
    [
      "V",
      0,
      d,
      "T",
      0,
      function (e) {
        let l,
          r,
          i,
          d,
          m,
          p,
          _,
          h,
          g,
          b,
          x,
          y,
          v,
          E,
          w,
          L,
          C = (0, a.c)(33);
        C[0] !== e
          ? (({
              align: p,
              alignOffset: l,
              side: _,
              sideOffset: h,
              collisionAvoidance: i,
              collisionBoundary: d,
              collisionPadding: g,
              density: b,
              className: r,
              ...m
            } = e),
            (C[0] = e),
            (C[1] = l),
            (C[2] = r),
            (C[3] = i),
            (C[4] = d),
            (C[5] = m),
            (C[6] = p),
            (C[7] = _),
            (C[8] = h),
            (C[9] = g),
            (C[10] = b))
          : ((l = C[1]),
            (r = C[2]),
            (i = C[3]),
            (d = C[4]),
            (m = C[5]),
            (p = C[6]),
            (_ = C[7]),
            (h = C[8]),
            (g = C[9]),
            (b = C[10]));
        let N = void 0 === p ? "start" : p,
          I = void 0 === _ ? "bottom" : _,
          A = void 0 === h ? 6 : h,
          T = void 0 === g ? 12 : g,
          j = void 0 === b ? "comfortable" : b;
        (C[11] !== l
          ? ((x = void 0 !== l ? { alignOffset: l } : {}),
            (C[11] = l),
            (C[12] = x))
          : (x = C[12]),
          C[13] !== i
            ? ((y = i ? { collisionAvoidance: i } : {}),
              (C[13] = i),
              (C[14] = y))
            : (y = C[14]),
          C[15] !== d
            ? ((v = d ? { collisionBoundary: d } : {}),
              (C[15] = d),
              (C[16] = v))
            : (v = C[16]));
        let k = f[j];
        return (
          C[17] !== r || C[18] !== k
            ? ((E = (0, c.c)(
                "outline-none duration-100 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
                u.V,
                k,
                r,
              )),
              (C[17] = r),
              (C[18] = k),
              (C[19] = E))
            : (E = C[19]),
          C[20] !== j || C[21] !== m || C[22] !== E
            ? ((w = (0, t.jsx)(n.f.Popup, {
                className: E,
                "data-density": j,
                "data-slot": "popover-content",
                ...m,
              })),
              (C[20] = j),
              (C[21] = m),
              (C[22] = E),
              (C[23] = w))
            : (w = C[23]),
          C[24] !== N ||
          C[25] !== T ||
          C[26] !== I ||
          C[27] !== A ||
          C[28] !== w ||
          C[29] !== x ||
          C[30] !== y ||
          C[31] !== v
            ? ((L = (0, t.jsx)(o.f.Portal, {
                children: (0, t.jsx)(s.f.Positioner, {
                  align: N,
                  className: "isolate z-[1000] outline-none",
                  collisionPadding: T,
                  side: I,
                  sideOffset: A,
                  ...x,
                  ...y,
                  ...v,
                  children: w,
                }),
              })),
              (C[24] = N),
              (C[25] = T),
              (C[26] = I),
              (C[27] = A),
              (C[28] = w),
              (C[29] = x),
              (C[30] = y),
              (C[31] = v),
              (C[32] = L))
            : (L = C[32]),
          L
        );
      },
      "J",
      0,
      m,
    ],
    289638,
  );
};
