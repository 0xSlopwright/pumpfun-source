// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    s = e.i(445242),
    t = e.i(426091),
    o = e.i(352386),
    a = e.i(367498);
  function n(e) {
    let n,
      i,
      c,
      d,
      l,
      u,
      y,
      f,
      B,
      g,
      p,
      m,
      h,
      w,
      v = (0, s.c)(30);
    v[0] !== e
      ? (({
          src: u,
          className: n,
          ipfsPrefix: c,
          onError: d,
          width: f,
          height: i,
          alt: y,
          ...l
        } = e),
        (v[0] = e),
        (v[1] = n),
        (v[2] = i),
        (v[3] = c),
        (v[4] = d),
        (v[5] = l),
        (v[6] = u),
        (v[7] = y),
        (v[8] = f))
      : ((n = v[1]),
        (i = v[2]),
        (c = v[3]),
        (d = v[4]),
        (l = v[5]),
        (u = v[6]),
        (y = v[7]),
        (f = v[8]));
    let b = void 0 === y ? "" : y;
    v[9] !== i || v[10] !== c || v[11] !== u || v[12] !== f
      ? ((B = (0, a.p)((0, a.D)(u, c), f, i)),
        (v[9] = i),
        (v[10] = c),
        (v[11] = u),
        (v[12] = f),
        (v[13] = B))
      : (B = v[13]);
    let H = B,
      [A, E] = (0, o.useState)(!1);
    (v[14] === Symbol.for("react.memo_cache_sentinel")
      ? ((g = () => {
          E(!1);
        }),
        (v[14] = g))
      : (g = v[14]),
      v[15] !== H ? ((p = [H]), (v[15] = H), (v[16] = p)) : (p = v[16]),
      (0, o.useEffect)(g, p));
    let C = A ? t.A : H;
    return (
      v[17] !== n
        ? ((m = (0, t.c)("object-cover rounded-full overflow-hidden", n)),
          (v[17] = n),
          (v[18] = m))
        : (m = v[18]),
      v[19] !== A || v[20] !== d
        ? ((h = (e) => {
            (A || e.currentTarget.src === t.A || E(!0), d?.(e));
          }),
          (v[19] = A),
          (v[20] = d),
          (v[21] = h))
        : (h = v[21]),
      v[22] !== b ||
      v[23] !== C ||
      v[24] !== i ||
      v[25] !== l ||
      v[26] !== m ||
      v[27] !== h ||
      v[28] !== f
        ? ((w = (0, r.jsx)("img", {
            ...l,
            alt: b,
            width: f,
            height: i,
            src: C,
            className: m,
            onError: h,
          })),
          (v[22] = b),
          (v[23] = C),
          (v[24] = i),
          (v[25] = l),
          (v[26] = m),
          (v[27] = h),
          (v[28] = f),
          (v[29] = w))
        : (w = v[29]),
      w
    );
  }
  var i = e.i(350606);
  function c(e) {
    let o,
      n,
      c,
      d,
      l,
      u,
      y,
      f,
      B,
      g,
      p,
      m,
      h,
      w,
      v = (0, s.c)(34);
    v[0] !== e
      ? (({
          address: o,
          className: n,
          style: u,
          forwardRef: c,
          width: f,
          height: d,
          alt: y,
          ...l
        } = e),
        (v[0] = e),
        (v[1] = o),
        (v[2] = n),
        (v[3] = c),
        (v[4] = d),
        (v[5] = l),
        (v[6] = u),
        (v[7] = y),
        (v[8] = f))
      : ((o = v[1]),
        (n = v[2]),
        (c = v[3]),
        (d = v[4]),
        (l = v[5]),
        (u = v[6]),
        (y = v[7]),
        (f = v[8]));
    let b = void 0 === y ? "" : y;
    v[9] !== o || v[10] !== d || v[11] !== f
      ? ((B = (0, a.k)((0, i.f)(o), f, d)),
        (v[9] = o),
        (v[10] = d),
        (v[11] = f),
        (v[12] = B))
      : (B = v[12]);
    let H = B;
    if (
      (v[13] !== n
        ? ((g = (0, t.c)("relative overflow-hidden rounded-full", n)),
          (v[13] = n),
          (v[14] = g))
        : (g = v[14]),
      v[15] === Symbol.for("react.memo_cache_sentinel")
        ? ((p = { transform: "scale(1.6) translate(1%, 18%)" }), (v[15] = p))
        : (p = v[15]),
      v[16] !== b || v[17] !== d || v[18] !== l || v[19] !== H || v[20] !== f)
    ) {
      let e;
      (v[22] !== b || v[23] !== d || v[24] !== l || v[25] !== f
        ? ((e = (e) =>
            (0, r.jsx)(
              "img",
              {
                src: e,
                width: f,
                height: d,
                className: "absolute inset-0 h-full w-full object-cover",
                ...l,
                alt: b,
              },
              e,
            )),
          (v[22] = b),
          (v[23] = d),
          (v[24] = l),
          (v[25] = f),
          (v[26] = e))
        : (e = v[26]),
        (m = H.map(e)),
        (v[16] = b),
        (v[17] = d),
        (v[18] = l),
        (v[19] = H),
        (v[20] = f),
        (v[21] = m));
    } else m = v[21];
    return (
      v[27] !== m
        ? ((h = (0, r.jsx)("div", {
            className: "absolute inset-0 origin-center",
            style: p,
            children: m,
          })),
          (v[27] = m),
          (v[28] = h))
        : (h = v[28]),
      v[29] !== c || v[30] !== u || v[31] !== g || v[32] !== h
        ? ((w = (0, r.jsx)("div", {
            className: g,
            style: u,
            ref: c,
            children: h,
          })),
          (v[29] = c),
          (v[30] = u),
          (v[31] = g),
          (v[32] = h),
          (v[33] = w))
        : (w = v[33]),
      w
    );
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let o,
          a,
          i,
          d,
          l,
          u,
          y = (0, s.c)(13);
        if (
          (y[0] !== e
            ? (({
                src: l,
                address: o,
                ipfsPrefix: a,
                isAnonymous: i,
                ...d
              } = e),
              (y[0] = e),
              (y[1] = o),
              (y[2] = a),
              (y[3] = i),
              (y[4] = d),
              (y[5] = l))
            : ((o = y[1]), (a = y[2]), (i = y[3]), (d = y[4]), (l = y[5])),
          !i && o && (!l || l === t.A))
        ) {
          let e;
          return (
            y[6] !== o || y[7] !== d
              ? ((e = (0, r.jsx)(c, { address: o, ...d })),
                (y[6] = o),
                (y[7] = d),
                (y[8] = e))
              : (e = y[8]),
            e
          );
        }
        return (
          y[9] !== a || y[10] !== d || y[11] !== l
            ? ((u = (0, r.jsx)(n, { src: l, ipfsPrefix: a, ...d })),
              (y[9] = a),
              (y[10] = d),
              (y[11] = l),
              (y[12] = u))
            : (u = y[12]),
          u
        );
      },
    ],
    705313,
  );
};
