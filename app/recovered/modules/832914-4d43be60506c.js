// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    o = e.i(116368),
    i = e.i(612531),
    s = e.i(671603),
    c = e.i(25264),
    a = e.i(998188),
    f = (0, i.f)({
      chartName: "AreaChart",
      GraphicalChild: o.f,
      axisComponents: [
        { axisType: "xAxis", AxisComp: s.f },
        { axisType: "yAxis", AxisComp: c.f },
      ],
      formatAxisMap: a.t,
    }),
    l = e.i(45143),
    p = e.i(216934);
  function u(e, t) {
    return {
      timestamp: e.time || e.timestamp,
      price: 0 === t ? e.open : e.close,
    };
  }
  function h(e) {
    return e.price;
  }
  function v(e, n) {
    return (0, t.jsx)(
      "stop",
      { offset: e.offset, stopColor: e.color, stopOpacity: e.opacity },
      n,
    );
  }
  e.s(
    [
      "LineChartCellChart",
      0,
      (e) => {
        let i,
          s,
          a,
          y,
          m,
          x,
          d,
          _,
          g,
          A,
          b,
          C,
          j,
          w,
          O,
          T,
          L,
          P,
          k,
          S = (0, n.c)(48),
          { data: E } = e,
          I = r.default.useId();
        if (S[0] !== I) {
          let e;
          (S[2] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = /:/g), (S[2] = e))
            : (e = S[2]),
            (i = I.replace(e, "")),
            (S[0] = I),
            (S[1] = i));
        } else i = S[1];
        let K = i;
        if (S[3] !== E || S[4] !== K) {
          let e,
            t,
            n,
            r,
            o,
            i = [
              {
                offset: "0%",
                color: (o = y = (0, p.f)().positive),
                opacity: 1,
              },
              { offset: "100%", color: o, opacity: 0 },
            ];
          if (S[18] !== E) {
            let r = (e = E.map(u)).map(h);
            ((t = Math.min(...r)),
              (n = Math.max(...r)),
              (S[18] = E),
              (S[19] = e),
              (S[20] = t),
              (S[21] = n));
          } else ((e = S[19]), (t = S[20]), (n = S[21]));
          let c = n,
            O = (c - t) * 0.05 || 0.01 * c,
            T = t - O,
            L = c + O;
          (S[22] !== T || S[23] !== L
            ? ((r = [T, L]), (S[22] = T), (S[23] = L), (S[24] = r))
            : (r = S[24]),
            (w = r),
            (a = l.f),
            (m = "100%"),
            (x = "100%"),
            (s = f),
            (j = e),
            (d = K),
            (_ = "0"),
            (g = "0"),
            (A = "0"),
            (b = "1"),
            (C = i.map(v)),
            (S[3] = E),
            (S[4] = K),
            (S[5] = s),
            (S[6] = a),
            (S[7] = y),
            (S[8] = m),
            (S[9] = x),
            (S[10] = d),
            (S[11] = _),
            (S[12] = g),
            (S[13] = A),
            (S[14] = b),
            (S[15] = C),
            (S[16] = j),
            (S[17] = w));
        } else
          ((s = S[5]),
            (a = S[6]),
            (y = S[7]),
            (m = S[8]),
            (x = S[9]),
            (d = S[10]),
            (_ = S[11]),
            (g = S[12]),
            (A = S[13]),
            (b = S[14]),
            (C = S[15]),
            (j = S[16]),
            (w = S[17]));
        S[25] !== d ||
        S[26] !== _ ||
        S[27] !== g ||
        S[28] !== A ||
        S[29] !== b ||
        S[30] !== C
          ? ((O = (0, t.jsx)("defs", {
              children: (0, t.jsx)("linearGradient", {
                id: d,
                x1: _,
                y1: g,
                x2: A,
                y2: b,
                children: C,
              }),
            })),
            (S[25] = d),
            (S[26] = _),
            (S[27] = g),
            (S[28] = A),
            (S[29] = b),
            (S[30] = C),
            (S[31] = O))
          : (O = S[31]);
        let M = `url(#${K})`;
        return (
          S[32] !== y || S[33] !== M
            ? ((T = (0, t.jsx)(o.f, {
                type: "linear",
                dataKey: "price",
                stroke: y,
                strokeWidth: 1.5,
                fill: M,
                isAnimationActive: !1,
                yAxisId: "price",
              })),
              (S[32] = y),
              (S[33] = M),
              (S[34] = T))
            : (T = S[34]),
          S[35] !== w
            ? ((L = (0, t.jsx)(c.f, { yAxisId: "price", domain: w, hide: !0 })),
              (S[35] = w),
              (S[36] = L))
            : (L = S[36]),
          S[37] !== s ||
          S[38] !== O ||
          S[39] !== T ||
          S[40] !== L ||
          S[41] !== j
            ? ((P = (0, t.jsxs)(s, { data: j, children: [O, T, L] })),
              (S[37] = s),
              (S[38] = O),
              (S[39] = T),
              (S[40] = L),
              (S[41] = j),
              (S[42] = P))
            : (P = S[42]),
          S[43] !== a || S[44] !== m || S[45] !== x || S[46] !== P
            ? ((k = (0, t.jsx)(a, { width: m, height: x, children: P })),
              (S[43] = a),
              (S[44] = m),
              (S[45] = x),
              (S[46] = P),
              (S[47] = k))
            : (k = S[47]),
          k
        );
      },
    ],
    832914,
  );
};
