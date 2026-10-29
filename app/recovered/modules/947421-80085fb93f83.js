// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    i = e.i(745018),
    l = e.i(352386);
  e.i(12692);
  var r = e.i(398902),
    a = e.i(307649),
    o = e.i(200478),
    s = e.i(387726),
    d = e.i(493607),
    c = e.i(347939),
    h = e.i(146814),
    u = e.i(923019),
    p = e.i(554325),
    f = e.i(116549),
    x = e.i(753192),
    g = e.i(844510),
    m = e.i(606178),
    w = e.i(51206),
    b = e.i(634661),
    v = e.i(813792),
    y = e.i(791898);
  let j = 12,
    $ = { top: 8, right: 8, bottom: 48, left: 8 },
    z = (e, t, n) => Math.min(Math.max(e, t), Math.max(t, n)),
    N = (e, t, n) => {
      let i = null;
      for (let l of t) {
        let t = Math.abs(l - e);
        !(t > n) && (null === i || t < Math.abs(i - e)) && (i = l);
      }
      return i;
    },
    k = ({
      rect: e,
      others: t,
      viewport: n,
      threshold: i = j,
      margin: l = $,
    }) => {
      let r = n.w - e.w - l.right,
        a = n.h - e.h - l.bottom,
        o = z(e.x, l.left, r),
        s = z(e.y, l.top, a),
        d = [l.left, r],
        c = [l.top, a];
      for (let n of t)
        (d.push(n.x, n.x + n.w, n.x - e.w, n.x + n.w - e.w),
          c.push(n.y, n.y + n.h, n.y - e.h, n.y + n.h - e.h));
      return { ...e, x: N(o, d, i) ?? o, y: N(s, c, i) ?? s };
    };
  e.s(["f", 0, k], 455189);
  var S = e.i(994112),
    X = e.i(338319),
    P = e.i(45329);
  let Y = (e, t = "button,a") => {
    let n = e.target;
    return e.currentTarget.contains(n) && !n.closest(t);
  };
  function C(e) {
    let i,
      l,
      r,
      a,
      o,
      s,
      d = (0, n.c)(15);
    d[0] !== e
      ? (({ label: r, ariaLabel: i, children: l, ...a } = e),
        (d[0] = e),
        (d[1] = i),
        (d[2] = l),
        (d[3] = r),
        (d[4] = a))
      : ((i = d[1]), (l = d[2]), (r = d[3]), (a = d[4]));
    let c = (0, f.x)(),
      h = g.t[c],
      u = i ?? r;
    return (
      d[5] !== l || d[6] !== c || d[7] !== a || d[8] !== h || d[9] !== u
        ? ((o = (0, t.jsx)(w._, {
            density: c,
            size: h,
            "aria-label": u,
            ...a,
            children: l,
          })),
          (d[5] = l),
          (d[6] = c),
          (d[7] = a),
          (d[8] = h),
          (d[9] = u),
          (d[10] = o))
        : (o = d[10]),
      d[11] !== c || d[12] !== r || d[13] !== o
        ? ((s = (0, t.jsx)(v.f, { content: r, density: c, children: o })),
          (d[11] = c),
          (d[12] = r),
          (d[13] = o),
          (d[14] = s))
        : (s = d[14]),
      s
    );
  }
  function M(e) {
    let i,
      l,
      r,
      a,
      o,
      c,
      u,
      p,
      x,
      w,
      v,
      y = (0, n.c)(37),
      {
        widget: j,
        paramLabel: $,
        paused: z,
        headerHasRoom: N,
        pausedSlotRef: k,
        unavailableViews: S,
        onPickView: P,
        onPointerDown: Y,
        onDoubleClick: C,
        children: M,
      } = e,
      R = (0, f.x)(),
      _ = b.F[R],
      L = m.U[R];
    y[0] !== _ || y[1] !== L
      ? ((i = (0, X.c)(
          b.t,
          _,
          L,
          g.n,
          g.s,
          "cursor-grab touch-none active:cursor-grabbing",
        )),
        (y[0] = _),
        (y[1] = L),
        (y[2] = i))
      : (i = y[2]);
    let E = b.P[R];
    (y[3] !== E ? ((l = (0, X.c)(E, g.A)), (y[3] = E), (y[4] = l)) : (l = y[4]),
      y[5] !== j.pane
        ? ((r = j.pane.accent ? (0, d.y)(j.pane) : "text-text-quaternary"),
          (y[5] = j.pane),
          (y[6] = r))
        : (r = y[6]),
      y[7] !== P || y[8] !== r || y[9] !== S || y[10] !== j.pane
        ? ((a = (0, t.jsx)(h.f, {
            pane: j.pane,
            iconClassName: r,
            onPick: P,
            unavailableViews: S,
            adaptive: !0,
            triggerTestId: "screeners-widget-view-trigger",
            itemTestIdPrefix: "screeners-widget-view",
            dotTestId: "screeners-widget-dot",
          })),
          (y[7] = P),
          (y[8] = r),
          (y[9] = S),
          (y[10] = j.pane),
          (y[11] = a))
        : (a = y[11]),
      y[12] !== l || y[13] !== a
        ? ((o = (0, t.jsx)("span", { className: l, children: a })),
          (y[12] = l),
          (y[13] = a),
          (y[14] = o))
        : (o = y[14]),
      y[15] === Symbol.for("react.memo_cache_sentinel")
        ? ((c = (0, X.c)(g.W, g.T)), (y[15] = c))
        : (c = y[15]),
      y[16] !== R || y[17] !== N || y[18] !== z
        ? ((u =
            z && N
              ? (0, t.jsx)(s.B, { density: R, className: "min-w-0 shrink" })
              : null),
          (y[16] = R),
          (y[17] = N),
          (y[18] = z),
          (y[19] = u))
        : (u = y[19]),
      y[20] !== k || y[21] !== u
        ? ((p = (0, t.jsx)("span", {
            ref: k,
            "data-testid": "screeners-widget-paused-slot",
            className: c,
            children: u,
          })),
          (y[20] = k),
          (y[21] = u),
          (y[22] = p))
        : (p = y[22]),
      y[23] !== $
        ? ((x = $
            ? (0, t.jsx)("span", {
                "data-testid": "screeners-widget-param",
                className: (0, X.c)(b.o, g.D),
                children: $,
              })
            : null),
          (y[23] = $),
          (y[24] = x))
        : (x = y[24]));
    let W = g.M[R];
    return (
      y[25] !== M || y[26] !== W
        ? ((w = (0, t.jsx)("div", { className: W, children: M })),
          (y[25] = M),
          (y[26] = W),
          (y[27] = w))
        : (w = y[27]),
      y[28] !== R ||
      y[29] !== C ||
      y[30] !== Y ||
      y[31] !== p ||
      y[32] !== x ||
      y[33] !== w ||
      y[34] !== i ||
      y[35] !== o
        ? ((v = (0, t.jsxs)("header", {
            onPointerDown: Y,
            onDoubleClick: C,
            "data-title-band": !0,
            "data-density": R,
            className: i,
            children: [o, p, x, w],
          })),
          (y[28] = R),
          (y[29] = C),
          (y[30] = Y),
          (y[31] = p),
          (y[32] = x),
          (y[33] = w),
          (y[34] = i),
          (y[35] = o),
          (y[36] = v))
        : (v = y[36]),
      v
    );
  }
  let R = "--ride-start-x",
    _ = "--ride-start-y",
    L = `translate(calc(var(${o.f}, var(${R}, 0px)) - var(${R}, 0px)), calc(var(${o.p}, var(${_}, 0px)) - var(${_}, 0px)))`,
    E = (e, t) =>
      k({
        rect: e,
        others: (0, P.b)(P.V.getState(), t),
        viewport: { w: window.innerWidth, h: window.innerHeight },
      });
  function W(e) {
    return e.widgets;
  }
  e.s(
    [
      "N",
      0,
      C,
      "R",
      0,
      function (e) {
        let s,
          h,
          m,
          w,
          b,
          v,
          j,
          $,
          z,
          N,
          k,
          B,
          D,
          I,
          V,
          T,
          A,
          F,
          H,
          U,
          q,
          J,
          Z,
          K,
          O,
          G,
          Q,
          ee,
          et,
          en,
          ei,
          el = (0, n.c)(109),
          { widget: er } = e,
          {
            removeWidget: ea,
            moveWidget: eo,
            floatWidget: es,
            setWidgetView: ed,
            setWidgetBoard: ec,
            setWidgetTrending: eh,
            toggleWidgetShade: eu,
          } = (0, x.f)(),
          { t: ep } = (0, r.f)(),
          ef = (0, f.x)();
        el[0] !== er.pane
          ? ((s = (0, S.M)(er.pane)), (el[0] = er.pane), (el[1] = s))
          : (s = el[1]);
        let ex = s,
          { paramLabel: eg } = (0, u.f)(ex),
          {
            paused: em,
            headerHasRoom: ew,
            slotRef: eb,
            sink: ev,
          } = (0, f.B)(ef),
          ey = (0, l.useRef)(null);
        (el[2] !== es || el[3] !== eo || el[4] !== er
          ? ((h = (e) => {
              let { zone: t, index: n, floatRect: i } = e;
              if ("float" === t && i) {
                let e = ey.current?.getBoundingClientRect();
                es(
                  er,
                  E(
                    e && (e.width > 0 || e.height > 0)
                      ? { ...i, x: e.left, y: e.top }
                      : i,
                    er.id,
                  ),
                );
                return;
              }
              "float" !== t && eo(er, t, n);
            }),
            (el[2] = es),
            (el[3] = eo),
            (el[4] = er),
            (el[5] = h))
          : (h = el[5]),
          el[6] !== h || el[7] !== er.id
            ? ((m = {
                kind: "widget",
                excludeId: er.id,
                allowFloat: !0,
                onDrop: h,
              }),
              (el[6] = h),
              (el[7] = er.id),
              (el[8] = m))
            : (m = el[8]));
        let { ghost: ej, hover: e$, handlePointerDown: ez } = (0, o.h)(m);
        el[9] !== ez
          ? ((w = (e) => {
              let t = ey.current;
              (t?.style.setProperty(R, `${e.clientX}px`),
                t?.style.setProperty(_, `${e.clientY}px`),
                ez(e));
            }),
            (el[9] = ez),
            (el[10] = w))
          : (w = el[10]);
        let eN = w,
          ek = null !== ej;
        el[11] !== es || el[12] !== er
          ? ((b = (e) => {
              if (!Y(e)) return;
              let t = e.currentTarget.parentElement?.getBoundingClientRect();
              es(
                er,
                E(
                  { x: t?.left ?? 80, y: t?.top ?? 120, w: o.x, h: o.j },
                  er.id,
                ),
              );
            }),
            (el[11] = es),
            (el[12] = er),
            (el[13] = b))
          : (b = el[13]);
        let eS = b,
          eX = (0, P.V)(W);
        if (el[14] !== er.id || el[15] !== eX) {
          let e;
          (el[17] !== er.id
            ? ((e = (e) => (e.id !== er.id ? [e.pane.view] : [])),
              (el[17] = er.id),
              (el[18] = e))
            : (e = el[18]),
            (v = new Set(eX.flatMap(e))),
            (el[14] = er.id),
            (el[15] = eX),
            (el[16] = v));
        } else v = el[16];
        let eP = v,
          [eY, eC] = (0, l.useState)(null);
        el[19] !== ed || el[20] !== er
          ? ((j = (e) => {
              if (e === er.pane.view) return;
              let t = !!y.J[e].param,
                n = !!er.pane.byView?.[e]?.params;
              t && !n ? eC(e) : ed(er, e);
            }),
            (el[19] = ed),
            (el[20] = er),
            (el[21] = j))
          : (j = el[21]);
        let eM = j;
        el[22] !== eN
          ? (($ = (e) => {
              Y(e, "button:not([data-edge-drag-grip]),a") && eN(e);
            }),
            (el[22] = eN),
            (el[23] = $))
          : ($ = el[23]);
        let eR = $;
        el[24] !== er.pane
          ? ((z = (0, S.j)(er.pane)), (el[24] = er.pane), (el[25] = z))
          : (z = el[25]);
        let e_ = z,
          eL = er.shaded ? "flex-none" : "flex-1";
        (el[26] !== eL
          ? ((N = (0, X.c)("relative flex min-h-0 flex-col", eL)),
            (el[26] = eL),
            (el[27] = N))
          : (N = el[27]),
          el[28] !== ek
            ? ((k = ek
                ? (0, t.jsx)("div", {
                    "aria-hidden": !0,
                    "data-testid": "screeners-widget-ride-slot",
                    className:
                      "pointer-events-none absolute inset-0 border border-dashed border-border-tertiary",
                  })
                : null),
              (el[28] = ek),
              (el[29] = k))
            : (k = el[29]));
        let eE = er.id,
          eW = er.id,
          eB = `swidget-${er.id}`,
          eD = ek ? L : void 0,
          eI = ek ? "transform" : void 0;
        el[30] !== eB || el[31] !== eD || el[32] !== eI
          ? ((B = { viewTransitionName: eB, transform: eD, willChange: eI }),
            (el[30] = eB),
            (el[31] = eD),
            (el[32] = eI),
            (el[33] = B))
          : (B = el[33]);
        let eV = ek && "z-50 shadow-lg transition-none";
        (el[34] !== eV
          ? ((D = (0, X.c)(
              "relative flex min-h-0 flex-1 animate-in flex-col border border-solid border-border-tertiary bg-bg-primary fade-in slide-in-from-bottom-2 duration-200",
              eV,
            )),
            (el[34] = eV),
            (el[35] = D))
          : (D = el[35]),
          el[36] !== er.pane
            ? ((I = (0, d.B)(er.pane)
                ? (0, t.jsx)("span", {
                    "aria-hidden": !0,
                    className: (0, X.c)(
                      "pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5",
                      (0, d.B)(er.pane),
                    ),
                  })
                : null),
              (el[36] = er.pane),
              (el[37] = I))
            : (I = el[37]));
        let eT = er.shaded ? "web.screeners.restore" : "web.screeners.minimize";
        el[38] !== ep || el[39] !== eT
          ? ((V = ep(eT)), (el[38] = ep), (el[39] = eT), (el[40] = V))
          : (V = el[40]);
        let eA = `${er.shaded ? "Restore" : "Minimize"} ${e_} widget`;
        (el[41] !== eu || el[42] !== er
          ? ((T = () => eu(er)), (el[41] = eu), (el[42] = er), (el[43] = T))
          : (T = el[43]),
          el[44] !== er.shaded
            ? ((A = er.shaded
                ? (0, t.jsx)(i.sE, { "aria-hidden": !0 })
                : (0, t.jsx)(i.BE, { "aria-hidden": !0 })),
              (el[44] = er.shaded),
              (el[45] = A))
            : (A = el[45]),
          el[46] !== V || el[47] !== eA || el[48] !== T || el[49] !== A
            ? ((F = (0, t.jsx)(C, {
                label: V,
                ariaLabel: eA,
                "data-testid": "screeners-widget-shade",
                onClick: T,
                children: A,
              })),
              (el[46] = V),
              (el[47] = eA),
              (el[48] = T),
              (el[49] = A),
              (el[50] = F))
            : (F = el[50]),
          el[51] !== ep
            ? ((H = ep("web.screeners.drag_to_redock")),
              (el[51] = ep),
              (el[52] = H))
            : (H = el[52]));
        let eF = `Move ${e_} widget — drag to either screen edge`;
        (el[53] === Symbol.for("react.memo_cache_sentinel")
          ? ((U = (0, t.jsx)(i.qm, { "aria-hidden": !0 })), (el[53] = U))
          : (U = el[53]),
          el[54] !== H || el[55] !== eF
            ? ((q = (0, t.jsx)(C, {
                label: H,
                ariaLabel: eF,
                "data-edge-drag-grip": !0,
                "data-testid": "screeners-widget-grip",
                className: "cursor-grab touch-none active:cursor-grabbing",
                children: U,
              })),
              (el[54] = H),
              (el[55] = eF),
              (el[56] = q))
            : (q = el[56]),
          el[57] !== ep
            ? ((J = ep("common.close")), (el[57] = ep), (el[58] = J))
            : (J = el[58]));
        let eH = `Close ${e_} widget`;
        return (
          el[59] !== ea || el[60] !== er
            ? ((Z = () => ea(er)), (el[59] = ea), (el[60] = er), (el[61] = Z))
            : (Z = el[61]),
          el[62] === Symbol.for("react.memo_cache_sentinel")
            ? ((K = (0, t.jsx)(i.AD, { "aria-hidden": !0 })), (el[62] = K))
            : (K = el[62]),
          el[63] !== J || el[64] !== eH || el[65] !== Z
            ? ((O = (0, t.jsx)(C, {
                label: J,
                ariaLabel: eH,
                "data-testid": "screeners-widget-close",
                onClick: Z,
                children: K,
              })),
              (el[63] = J),
              (el[64] = eH),
              (el[65] = Z),
              (el[66] = O))
            : (O = el[66]),
          el[67] !== eS ||
          el[68] !== eR ||
          el[69] !== eM ||
          el[70] !== ew ||
          el[71] !== em ||
          el[72] !== eP ||
          el[73] !== eg ||
          el[74] !== eb ||
          el[75] !== F ||
          el[76] !== q ||
          el[77] !== O ||
          el[78] !== er
            ? ((G = (0, t.jsxs)(M, {
                widget: er,
                paramLabel: eg,
                paused: em,
                headerHasRoom: ew,
                pausedSlotRef: eb,
                unavailableViews: eP,
                onPickView: eM,
                onPointerDown: eR,
                onDoubleClick: eS,
                children: [F, q, O],
              })),
              (el[67] = eS),
              (el[68] = eR),
              (el[69] = eM),
              (el[70] = ew),
              (el[71] = em),
              (el[72] = eP),
              (el[73] = eg),
              (el[74] = eb),
              (el[75] = F),
              (el[76] = q),
              (el[77] = O),
              (el[78] = er),
              (el[79] = G))
            : (G = el[79]),
          el[80] !== ef ||
          el[81] !== ex ||
          el[82] !== ev ||
          el[83] !== ec ||
          el[84] !== eh ||
          el[85] !== er
            ? ((Q = er.shaded
                ? null
                : (0, t.jsx)("div", {
                    className: (0, X.c)(
                      "flex min-h-0 flex-1 flex-col",
                      g.w[ef],
                    ),
                    children: (0, t.jsx)(f.w, {
                      value: ev,
                      children: (0, t.jsx)(c.f, {
                        column: ex,
                        onSetBoard: (e) => ec(er, e),
                        onSetTrending: (e) => eh(er, e),
                      }),
                    }),
                  })),
              (el[80] = ef),
              (el[81] = ex),
              (el[82] = ev),
              (el[83] = ec),
              (el[84] = eh),
              (el[85] = er),
              (el[86] = Q))
            : (Q = el[86]),
          el[87] !== ej || el[88] !== e$ || el[89] !== e_ || el[90] !== er.id
            ? ((ee = (0, t.jsx)(a.f, {
                ghost: ej,
                hover: e$,
                label: e_,
                variant: "ride",
                excludeWidgetId: er.id,
              })),
              (el[87] = ej),
              (el[88] = e$),
              (el[89] = e_),
              (el[90] = er.id),
              (el[91] = ee))
            : (ee = el[91]),
          el[92] !== eY || el[93] !== ed || el[94] !== er
            ? ((et = eY
                ? (0, t.jsx)(p.f, {
                    type: eY,
                    heading: `Switch to ${y.J[eY].label}`,
                    onPick: (e) => {
                      (ed(er, eY, e), eC(null));
                    },
                    onClose: () => eC(null),
                  })
                : null),
              (el[92] = eY),
              (el[93] = ed),
              (el[94] = er),
              (el[95] = et))
            : (et = el[95]),
          el[96] !== B ||
          el[97] !== D ||
          el[98] !== I ||
          el[99] !== G ||
          el[100] !== Q ||
          el[101] !== ee ||
          el[102] !== et ||
          el[103] !== er.id
            ? ((en = (0, t.jsxs)("section", {
                ref: ey,
                "data-testid": "screeners-widget-panel",
                "data-widget-id": eE,
                "data-edge-panel": "widget",
                "data-edge-panel-id": eW,
                style: B,
                className: D,
                children: [I, G, Q, ee, et],
              })),
              (el[96] = B),
              (el[97] = D),
              (el[98] = I),
              (el[99] = G),
              (el[100] = Q),
              (el[101] = ee),
              (el[102] = et),
              (el[103] = er.id),
              (el[104] = en))
            : (en = el[104]),
          el[105] !== N || el[106] !== k || el[107] !== en
            ? ((ei = (0, t.jsxs)("div", { className: N, children: [k, en] })),
              (el[105] = N),
              (el[106] = k),
              (el[107] = en),
              (el[108] = ei))
            : (ei = el[108]),
          ei
        );
      },
      "s",
      0,
      M,
      "Y",
      0,
      Y,
    ],
    947421,
  );
};
