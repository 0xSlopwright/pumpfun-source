// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(909316),
    n = e.i(696500),
    a = e.i(108305),
    o = e.i(446929),
    s = e.i(288912),
    l = e.i(745018);
  e.i(12692);
  var d = e.i(398902),
    c = e.i(980268),
    u = e.i(360827),
    m = e.i(595673),
    f = e.i(338319),
    b = e.i(324787);
  let p =
      "flex size-6 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent",
    h =
      "flex-1 rounded-md border border-border-tertiary px-2 py-1 text-xs font-medium text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent aria-pressed:border-transparent aria-pressed:bg-bg-accent/[0.12] aria-pressed:text-text-accent aria-pressed:hover:bg-bg-accent/[0.12]",
    w = "px-1 pb-1 text-xs font-medium text-text-tertiary";
  function v(e) {
    return e.setColumnHidden;
  }
  function g(e) {
    return e.moveColumn;
  }
  function y(e) {
    return e.setDensity;
  }
  function x(e) {
    return e.resetTable;
  }
  function k(e) {
    return [e.id, e];
  }
  function C(e) {
    return void 0 !== e;
  }
  e.s([
    "f",
    0,
    (e) => {
      let S,
        N,
        _,
        j,
        P,
        E,
        O,
        T,
        M,
        A,
        F,
        I,
        R,
        W,
        V,
        L,
        U,
        D,
        z,
        B,
        q,
        H,
        $,
        K,
        G,
        Y,
        Q,
        Z,
        X,
        J,
        ee,
        et = (0, i.c)(113),
        {
          table: ei,
          catalog: er,
          className: en,
          icon: ea,
          iconClassName: eo,
          showDensity: es,
          sourceScreen: el,
        } = e,
        ed = void 0 === ea ? l.cL : ea,
        ec = void 0 === es || es,
        { t: eu } = (0, d.f)();
      et[0] !== ei
        ? ((S = (e) => e.tables[ei]), (et[0] = ei), (et[1] = S))
        : (S = et[1]);
      let em = (0, b.w)(S),
        ef = (0, b.w)(v),
        eb = (0, b.w)(g),
        ep = (0, b.w)(y),
        eh = (0, b.w)(x);
      et[2] !== em.hidden
        ? ((N = new Set(em.hidden)), (et[2] = em.hidden), (et[3] = N))
        : (N = et[3]);
      let ew = N;
      if (
        et[4] !== ed ||
        et[5] !== er ||
        et[6] !== en ||
        et[7] !== em.order ||
        et[8] !== ew ||
        et[9] !== eo ||
        et[10] !== eb ||
        et[11] !== eh ||
        et[12] !== ef ||
        et[13] !== ep ||
        et[14] !== el ||
        et[15] !== eu ||
        et[16] !== ei
      ) {
        let e,
          i,
          d,
          b,
          h,
          v,
          g,
          y,
          x,
          S = new Map(er.map(k)),
          N = em.order.map((e) => S.get(e)).filter(C);
        et[35] !== eu
          ? ((e = (e) => eu(e)), (et[35] = eu), (et[36] = e))
          : (e = et[36]);
        let q = e;
        et[37] !== ef || et[38] !== el || et[39] !== ei
          ? ((i = (e) => {
              let { id: t, checked: i } = e;
              (ef({ table: ei, id: t, hidden: !i }),
                (0, m.lT)({
                  table: ei,
                  action: i ? "show" : "hide",
                  columnId: t,
                  sourceScreen: el,
                }));
            }),
            (et[37] = ef),
            (et[38] = el),
            (et[39] = ei),
            (et[40] = i))
          : (i = et[40]);
        let H = i,
          $ = (e) => {
            let { id: t, direction: i } = e,
              r = N.findIndex((e) => e.id === t),
              n = N["up" === i ? r - 1 : r + 1];
            (eb({ table: ei, id: t, direction: i, neighborId: n?.id }),
              (0, m.lT)({
                table: ei,
                action: "reorder",
                columnId: t,
                value: i,
                sourceScreen: el,
              }));
          };
        (et[41] !== ep || et[42] !== el || et[43] !== ei
          ? ((d = (e) => {
              (ep({ table: ei, density: e }),
                (0, m.lT)({
                  table: ei,
                  action: "density",
                  value: e,
                  sourceScreen: el,
                }));
            }),
            (et[41] = ep),
            (et[42] = el),
            (et[43] = ei),
            (et[44] = d))
          : (d = et[44]),
          (O = d),
          et[45] !== eh || et[46] !== el || et[47] !== ei
            ? ((b = () => {
                (eh({ table: ei }),
                  (0, m.lT)({ table: ei, action: "reset", sourceScreen: el }));
              }),
              (et[45] = eh),
              (et[46] = el),
              (et[47] = ei),
              (et[48] = b))
            : (b = et[48]),
          (T = b),
          (E = r.f.Root),
          et[49] !== eu
            ? ((h = eu("web.coin.customize_table")),
              (et[49] = eu),
              (et[50] = h))
            : (h = et[50]),
          et[51] !== en
            ? ((v = (0, f.c)(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-tertiary bg-bg-tertiary text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent data-[popup-open]:text-text-primary",
                en,
              )),
              (et[51] = en),
              (et[52] = v))
            : (v = et[52]),
          et[53] !== eo
            ? ((g = (0, f.c)("size-4", eo)), (et[53] = eo), (et[54] = g))
            : (g = et[54]),
          et[55] !== ed || et[56] !== g
            ? ((y = (0, t.jsx)(ed, { className: g })),
              (et[55] = ed),
              (et[56] = g),
              (et[57] = y))
            : (y = et[57]),
          et[58] !== h || et[59] !== v || et[60] !== y
            ? ((V = (0, t.jsx)(n.f.Trigger, {
                "aria-label": h,
                className: v,
                "data-testid": "coin-table-customize",
                children: y,
              })),
              (et[58] = h),
              (et[59] = v),
              (et[60] = y),
              (et[61] = V))
            : (V = et[61]),
          (P = a.f.Portal),
          (j = o.f.Positioner),
          (A = "bottom"),
          (F = "end"),
          (I = 6),
          (R = 16),
          (W = "z-[120]"),
          (_ = s.f.Popup),
          et[62] !== eu
            ? ((z = eu("web.coin.customize_table")),
              (et[62] = eu),
              (et[63] = z))
            : (z = et[63]),
          et[64] === Symbol.for("react.memo_cache_sentinel")
            ? ((B = (0, f.c)(
                u.V,
                "flex w-64 flex-col gap-3 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent",
              )),
              (et[64] = B))
            : (B = et[64]),
          (M = "coin-table-customize-panel"),
          et[65] !== eu
            ? ((x = eu("web.coin.table_columns")), (et[65] = eu), (et[66] = x))
            : (x = et[66]),
          et[67] !== x
            ? ((D = (0, t.jsx)("p", { className: w, children: x })),
              (et[67] = x),
              (et[68] = D))
            : (D = et[68]),
          (L = "flex flex-col"),
          (U = N.map((e, i) => {
            let r = e.id,
              n = q(e.labelKey),
              a = !0 === e.lockedVisible;
            return (0, t.jsxs)(
              "li",
              {
                className: "flex items-center gap-2 rounded-md px-1 py-1",
                children: [
                  (0, t.jsx)(c.f, {
                    "aria-label": n,
                    checked: a || !ew.has(r),
                    disabled: a,
                    "data-testid": `coin-table-column-${r}`,
                    onCheckedChange: (e) => H({ id: r, checked: !0 === e }),
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "min-w-0 flex-1 truncate text-sm text-text-primary",
                    children: n,
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    className: p,
                    "aria-label": eu("web.coin.table_move_up", { column: n }),
                    "data-testid": `coin-table-move-up-${r}`,
                    disabled: 0 === i,
                    onClick: () => $({ id: r, direction: "up" }),
                    children: (0, t.jsx)(l.vY, {
                      className: "size-4 rotate-180",
                    }),
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    className: p,
                    "aria-label": eu("web.coin.table_move_down", { column: n }),
                    "data-testid": `coin-table-move-down-${r}`,
                    disabled: i === N.length - 1,
                    onClick: () => $({ id: r, direction: "down" }),
                    children: (0, t.jsx)(l.vY, { className: "size-4" }),
                  }),
                ],
              },
              r,
            );
          })),
          (et[4] = ed),
          (et[5] = er),
          (et[6] = en),
          (et[7] = em.order),
          (et[8] = ew),
          (et[9] = eo),
          (et[10] = eb),
          (et[11] = eh),
          (et[12] = ef),
          (et[13] = ep),
          (et[14] = el),
          (et[15] = eu),
          (et[16] = ei),
          (et[17] = _),
          (et[18] = j),
          (et[19] = P),
          (et[20] = E),
          (et[21] = O),
          (et[22] = T),
          (et[23] = M),
          (et[24] = A),
          (et[25] = F),
          (et[26] = I),
          (et[27] = R),
          (et[28] = W),
          (et[29] = V),
          (et[30] = L),
          (et[31] = U),
          (et[32] = D),
          (et[33] = z),
          (et[34] = B));
      } else
        ((_ = et[17]),
          (j = et[18]),
          (P = et[19]),
          (E = et[20]),
          (O = et[21]),
          (T = et[22]),
          (M = et[23]),
          (A = et[24]),
          (F = et[25]),
          (I = et[26]),
          (R = et[27]),
          (W = et[28]),
          (V = et[29]),
          (L = et[30]),
          (U = et[31]),
          (D = et[32]),
          (z = et[33]),
          (B = et[34]));
      return (
        et[69] !== L || et[70] !== U
          ? ((q = (0, t.jsx)("ul", { className: L, children: U })),
            (et[69] = L),
            (et[70] = U),
            (et[71] = q))
          : (q = et[71]),
        et[72] !== q || et[73] !== D
          ? ((H = (0, t.jsxs)("section", { children: [D, q] })),
            (et[72] = q),
            (et[73] = D),
            (et[74] = H))
          : (H = et[74]),
        et[75] !== em.density || et[76] !== O || et[77] !== ec || et[78] !== eu
          ? (($ = ec
              ? (0, t.jsxs)("section", {
                  children: [
                    (0, t.jsx)("p", {
                      className: w,
                      children: eu("web.coin.table_density"),
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex gap-2",
                      role: "group",
                      children: [
                        (0, t.jsx)("button", {
                          type: "button",
                          className: h,
                          "aria-pressed": "comfy" === em.density,
                          "data-testid": "coin-table-density-comfy",
                          onClick: () => O("comfy"),
                          children: eu("web.coin.table_density_comfy"),
                        }),
                        (0, t.jsx)("button", {
                          type: "button",
                          className: h,
                          "aria-pressed": "compact" === em.density,
                          "data-testid": "coin-table-density-compact",
                          onClick: () => O("compact"),
                          children: eu("web.coin.table_density_compact"),
                        }),
                      ],
                    }),
                  ],
                })
              : null),
            (et[75] = em.density),
            (et[76] = O),
            (et[77] = ec),
            (et[78] = eu),
            (et[79] = $))
          : ($ = et[79]),
        et[80] !== eu
          ? ((K = eu("web.coin.table_narrow_columns_hint")),
            (et[80] = eu),
            (et[81] = K))
          : (K = et[81]),
        et[82] !== K
          ? ((G = (0, t.jsx)("p", {
              className: "px-1 text-xs text-text-tertiary",
              children: K,
            })),
            (et[82] = K),
            (et[83] = G))
          : (G = et[83]),
        et[84] !== eu
          ? ((Y = eu("web.coin.table_reset")), (et[84] = eu), (et[85] = Y))
          : (Y = et[85]),
        et[86] !== T || et[87] !== Y
          ? ((Q = (0, t.jsx)("button", {
              type: "button",
              className:
                "rounded-md border border-border-tertiary px-2 py-1.5 text-xs font-medium text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent",
              "data-testid": "coin-table-reset",
              onClick: T,
              children: Y,
            })),
            (et[86] = T),
            (et[87] = Y),
            (et[88] = Q))
          : (Q = et[88]),
        et[89] !== _ ||
        et[90] !== M ||
        et[91] !== H ||
        et[92] !== $ ||
        et[93] !== G ||
        et[94] !== Q ||
        et[95] !== z ||
        et[96] !== B
          ? ((Z = (0, t.jsxs)(_, {
              "aria-label": z,
              className: B,
              "data-testid": M,
              children: [H, $, G, Q],
            })),
            (et[89] = _),
            (et[90] = M),
            (et[91] = H),
            (et[92] = $),
            (et[93] = G),
            (et[94] = Q),
            (et[95] = z),
            (et[96] = B),
            (et[97] = Z))
          : (Z = et[97]),
        et[98] !== j ||
        et[99] !== A ||
        et[100] !== F ||
        et[101] !== I ||
        et[102] !== R ||
        et[103] !== W ||
        et[104] !== Z
          ? ((X = (0, t.jsx)(j, {
              side: A,
              align: F,
              sideOffset: I,
              collisionPadding: R,
              className: W,
              children: Z,
            })),
            (et[98] = j),
            (et[99] = A),
            (et[100] = F),
            (et[101] = I),
            (et[102] = R),
            (et[103] = W),
            (et[104] = Z),
            (et[105] = X))
          : (X = et[105]),
        et[106] !== P || et[107] !== X
          ? ((J = (0, t.jsx)(P, { children: X })),
            (et[106] = P),
            (et[107] = X),
            (et[108] = J))
          : (J = et[108]),
        et[109] !== E || et[110] !== V || et[111] !== J
          ? ((ee = (0, t.jsxs)(E, { children: [V, J] })),
            (et[109] = E),
            (et[110] = V),
            (et[111] = J),
            (et[112] = ee))
          : (ee = et[112]),
        ee
      );
    },
  ]);
};
