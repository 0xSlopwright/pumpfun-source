// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    i = e.i(352386),
    l = e.i(745018);
  e.i(12692);
  var r = e.i(398902),
    a = e.i(307649),
    o = e.i(200478),
    s = e.i(947421),
    d = e.i(493607),
    c = e.i(347939),
    h = e.i(923019),
    u = e.i(554325),
    p = e.i(116549),
    f = e.i(753192),
    x = e.i(844510),
    g = e.i(360827),
    m = e.i(721165),
    w = e.i(791898),
    b = e.i(455189),
    v = e.i(994112),
    y = e.i(338319),
    j = e.i(45329);
  let $ = "--ride-start-x",
    z = "--ride-start-y";
  function N(e) {
    let N,
      X,
      P,
      Y,
      C,
      M,
      R,
      _,
      L,
      E,
      W,
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
      el,
      er = (0, n.c)(122),
      { widget: ea } = e,
      {
        removeWidget: eo,
        moveWidget: es,
        floatWidget: ed,
        resizeFloatWidget: ec,
        bringWidgetToFront: eh,
        setWidgetView: eu,
        setWidgetBoard: ep,
        setWidgetTrending: ef,
        toggleWidgetShade: ex,
      } = (0, f.f)(),
      { t: eg } = (0, r.f)(),
      em = (0, p.x)();
    er[0] !== ea.pane
      ? ((N = (0, v.M)(ea.pane)), (er[0] = ea.pane), (er[1] = N))
      : (N = er[1]);
    let ew = N,
      { paramLabel: eb } = (0, h.f)(ew),
      ev = (0, i.useRef)(null),
      { paused: ey, headerHasRoom: ej, slotRef: e$, sink: ez } = (0, p.B)(em),
      eN = (0, j.V)(S);
    if (er[2] !== ea.id || er[3] !== eN) {
      let e;
      (er[5] !== ea.id
        ? ((e = (e) => (e.id !== ea.id ? [e.pane.view] : [])),
          (er[5] = ea.id),
          (er[6] = e))
        : (e = er[6]),
        (X = new Set(eN.flatMap(e))),
        (er[2] = ea.id),
        (er[3] = eN),
        (er[4] = X));
    } else X = er[4];
    let ek = X,
      [eS, eX] = (0, i.useState)(null);
    er[7] !== eu || er[8] !== ea
      ? ((P = (e) => {
          if (e === ea.pane.view) return;
          let t = !!w.J[e].param,
            n = !!ea.pane.byView?.[e]?.params;
          t && !n ? eX(e) : eu(ea, e);
        }),
        (er[7] = eu),
        (er[8] = ea),
        (er[9] = P))
      : (P = er[9]);
    let eP = P;
    er[10] !== ea.float
      ? ((Y = ea.float ?? { x: 80, y: 120, w: 360, h: 480 }),
        (er[10] = ea.float),
        (er[11] = Y))
      : (Y = er[11]);
    let eY = Y;
    (er[12] !== eY.h || er[13] !== eY.w
      ? ((C = { w: eY.w, h: eY.h }),
        (er[12] = eY.h),
        (er[13] = eY.w),
        (er[14] = C))
      : (C = er[14]),
      er[15] !== ed || er[16] !== es || er[17] !== eY || er[18] !== ea
        ? ((M = (e) => {
            let { zone: t, index: n, clientX: i, clientY: l } = e;
            if ("float" === t) {
              let e = e_.current,
                t = e ? i - e.x : 0,
                n = e ? l - e.y : 0;
              ed(
                ea,
                (0, b.f)({
                  rect: { ...eY, x: eY.x + t, y: eY.y + n },
                  others: (0, j.b)(j.V.getState(), ea.id),
                  viewport: { w: window.innerWidth, h: window.innerHeight },
                }),
              );
              return;
            }
            es(ea, t, n);
          }),
          (er[15] = ed),
          (er[16] = es),
          (er[17] = eY),
          (er[18] = ea),
          (er[19] = M))
        : (M = er[19]),
      er[20] !== C || er[21] !== M || er[22] !== ea.id
        ? ((R = {
            kind: "widget",
            excludeId: ea.id,
            allowFloat: !0,
            floatSize: C,
            onDrop: M,
          }),
          (er[20] = C),
          (er[21] = M),
          (er[22] = ea.id),
          (er[23] = R))
        : (R = er[23]));
    let { ghost: eC, hover: eM, handlePointerDown: eR } = (0, o.h)(R),
      e_ = (0, i.useRef)(null);
    er[24] !== es || er[25] !== ea
      ? ((_ = (e) => {
          (0, s.Y)(e) && es(ea, ea.side, 99);
        }),
        (er[24] = es),
        (er[25] = ea),
        (er[26] = _))
      : (_ = er[26]);
    let eL = _;
    er[27] !== eR
      ? ((L = (e) => {
          (0, s.Y)(e) &&
            ((e_.current = { x: e.clientX, y: e.clientY }),
            ev.current?.style.setProperty($, `${e.clientX}px`),
            ev.current?.style.setProperty(z, `${e.clientY}px`),
            eR(e));
        }),
        (er[27] = eR),
        (er[28] = L))
      : (L = er[28]);
    let eE = L;
    er[29] !== eY || er[30] !== ec || er[31] !== ea
      ? ((E = (e) => {
          if (0 !== e.button) return;
          e.preventDefault();
          let t = e.currentTarget,
            n = ev.current;
          if (!n) return;
          let i = { x: e.clientX, y: e.clientY, w: eY.w, h: eY.h },
            l = k,
            r = { w: eY.w, h: eY.h },
            a = () => {
              r.w !== eY.w || r.h !== eY.h
                ? ec(ea, { ...eY, ...r })
                : ((n.style.width = `${eY.w}px`),
                  (n.style.height = `${eY.h}px`));
            };
          (0, m.L)(t, e.pointerId, {
            onMove: (e) => {
              ((r = {
                w: l(i.w + (e.clientX - i.x), v.U, v.b),
                h: l(i.h + (e.clientY - i.y), v.L, v.$),
              }),
                (n.style.width = `${r.w}px`),
                (n.style.height = `${r.h}px`));
            },
            onRelease: a,
            onCancel: a,
          });
        }),
        (er[29] = eY),
        (er[30] = ec),
        (er[31] = ea),
        (er[32] = E))
      : (E = er[32]);
    let eW = E,
      eB = null !== eC;
    er[33] !== ea.pane
      ? ((W = (0, v.j)(ea.pane)), (er[33] = ea.pane), (er[34] = W))
      : (W = er[34]);
    let eD = W,
      eI = `${eD} floating panel`,
      eV = ea.id;
    er[35] === Symbol.for("react.memo_cache_sentinel")
      ? ((B = (0, y.c)(
          "fixed z-[45] flex animate-in flex-col overflow-hidden transition-none fade-in zoom-in-95 duration-200",
          g.V,
        )),
        (er[35] = B))
      : (B = er[35]);
    let eT = `swidget-${ea.id}`,
      eA = ea.shaded ? void 0 : eY.h,
      eF = eB
        ? `translate(calc(var(${o.f}, var(${$}, 0px)) - var(${$}, 0px)), calc(var(${o.p}, var(${z}, 0px)) - var(${z}, 0px)))`
        : void 0,
      eH = eB ? "transform" : void 0;
    (er[36] !== eY.w ||
    er[37] !== eY.x ||
    er[38] !== eY.y ||
    er[39] !== eT ||
    er[40] !== eA ||
    er[41] !== eF ||
    er[42] !== eH
      ? ((D = {
          viewTransitionName: eT,
          left: eY.x,
          top: eY.y,
          width: eY.w,
          height: eA,
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "calc(100dvh - 56px)",
          transform: eF,
          willChange: eH,
        }),
        (er[36] = eY.w),
        (er[37] = eY.x),
        (er[38] = eY.y),
        (er[39] = eT),
        (er[40] = eA),
        (er[41] = eF),
        (er[42] = eH),
        (er[43] = D))
      : (D = er[43]),
      er[44] !== eh || er[45] !== ea.id
        ? ((I = () => eh(ea.id)), (er[44] = eh), (er[45] = ea.id), (er[46] = I))
        : (I = er[46]),
      er[47] !== ea.pane
        ? ((V = (0, d.B)(ea.pane)
            ? (0, t.jsx)("span", {
                "aria-hidden": !0,
                className: (0, y.c)(
                  "pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5",
                  (0, d.B)(ea.pane),
                ),
              })
            : null),
          (er[47] = ea.pane),
          (er[48] = V))
        : (V = er[48]));
    let eU = ea.shaded ? "web.screeners.restore" : "web.screeners.minimize";
    er[49] !== eg || er[50] !== eU
      ? ((T = eg(eU)), (er[49] = eg), (er[50] = eU), (er[51] = T))
      : (T = er[51]);
    let eq = `${ea.shaded ? "Restore" : "Minimize"} ${eD} widget`;
    (er[52] !== ex || er[53] !== ea
      ? ((A = () => ex(ea)), (er[52] = ex), (er[53] = ea), (er[54] = A))
      : (A = er[54]),
      er[55] !== ea.shaded
        ? ((F = ea.shaded
            ? (0, t.jsx)(l.sE, { "aria-hidden": !0 })
            : (0, t.jsx)(l.BE, { "aria-hidden": !0 })),
          (er[55] = ea.shaded),
          (er[56] = F))
        : (F = er[56]),
      er[57] !== T || er[58] !== eq || er[59] !== A || er[60] !== F
        ? ((H = (0, t.jsx)(s.N, {
            label: T,
            ariaLabel: eq,
            "data-testid": "screeners-floating-shade",
            onClick: A,
            children: F,
          })),
          (er[57] = T),
          (er[58] = eq),
          (er[59] = A),
          (er[60] = F),
          (er[61] = H))
        : (H = er[61]),
      er[62] !== eg
        ? ((U = eg("web.screeners.dock_panel")), (er[62] = eg), (er[63] = U))
        : (U = er[63]));
    let eJ = `Dock ${eD} to the screen edge`;
    (er[64] !== es || er[65] !== ea
      ? ((q = () => es(ea, ea.side, 99)),
        (er[64] = es),
        (er[65] = ea),
        (er[66] = q))
      : (q = er[66]),
      er[67] === Symbol.for("react.memo_cache_sentinel")
        ? ((J = (0, t.jsx)(l.Pj, { "aria-hidden": !0 })), (er[67] = J))
        : (J = er[67]),
      er[68] !== U || er[69] !== eJ || er[70] !== q
        ? ((Z = (0, t.jsx)(s.N, {
            label: U,
            ariaLabel: eJ,
            "data-testid": "screeners-floating-dock",
            onClick: q,
            children: J,
          })),
          (er[68] = U),
          (er[69] = eJ),
          (er[70] = q),
          (er[71] = Z))
        : (Z = er[71]),
      er[72] !== eg
        ? ((K = eg("common.close")), (er[72] = eg), (er[73] = K))
        : (K = er[73]));
    let eZ = `Close ${eD} widget`;
    return (
      er[74] !== eo || er[75] !== ea
        ? ((O = () => eo(ea)), (er[74] = eo), (er[75] = ea), (er[76] = O))
        : (O = er[76]),
      er[77] === Symbol.for("react.memo_cache_sentinel")
        ? ((G = (0, t.jsx)(l.AD, { "aria-hidden": !0 })), (er[77] = G))
        : (G = er[77]),
      er[78] !== K || er[79] !== eZ || er[80] !== O
        ? ((Q = (0, t.jsx)(s.N, {
            label: K,
            ariaLabel: eZ,
            "data-testid": "screeners-floating-close",
            onClick: O,
            children: G,
          })),
          (er[78] = K),
          (er[79] = eZ),
          (er[80] = O),
          (er[81] = Q))
        : (Q = er[81]),
      er[82] !== eL ||
      er[83] !== eE ||
      er[84] !== eP ||
      er[85] !== ej ||
      er[86] !== ey ||
      er[87] !== ek ||
      er[88] !== eb ||
      er[89] !== e$ ||
      er[90] !== H ||
      er[91] !== Z ||
      er[92] !== Q ||
      er[93] !== ea
        ? ((ee = (0, t.jsxs)(s.s, {
            widget: ea,
            paramLabel: eb,
            paused: ey,
            headerHasRoom: ej,
            pausedSlotRef: e$,
            unavailableViews: ek,
            onPickView: eP,
            onPointerDown: eE,
            onDoubleClick: eL,
            children: [H, Z, Q],
          })),
          (er[82] = eL),
          (er[83] = eE),
          (er[84] = eP),
          (er[85] = ej),
          (er[86] = ey),
          (er[87] = ek),
          (er[88] = eb),
          (er[89] = e$),
          (er[90] = H),
          (er[91] = Z),
          (er[92] = Q),
          (er[93] = ea),
          (er[94] = ee))
        : (ee = er[94]),
      er[95] !== em ||
      er[96] !== eW ||
      er[97] !== ew ||
      er[98] !== ez ||
      er[99] !== ep ||
      er[100] !== ef ||
      er[101] !== ea
        ? ((et = ea.shaded
            ? null
            : (0, t.jsxs)(t.Fragment, {
                children: [
                  (0, t.jsx)("div", {
                    className: (0, y.c)(
                      "flex min-h-0 flex-1 flex-col",
                      x.w[em],
                    ),
                    children: (0, t.jsx)(p.w, {
                      value: ez,
                      children: (0, t.jsx)(c.f, {
                        column: ew,
                        onSetBoard: (e) => ep(ea, e),
                        onSetTrending: (e) => ef(ea, e),
                      }),
                    }),
                  }),
                  (0, t.jsx)("div", {
                    role: "presentation",
                    "data-testid": "screeners-floating-resize",
                    onPointerDown: eW,
                    className:
                      "absolute bottom-0 right-0 z-10 size-4 cursor-nwse-resize touch-none",
                    children: (0, t.jsx)("span", {
                      "aria-hidden": !0,
                      className:
                        "absolute bottom-1 right-1 size-2 border-b-2 border-r-2 border-solid border-border-tertiary",
                    }),
                  }),
                ],
              })),
          (er[95] = em),
          (er[96] = eW),
          (er[97] = ew),
          (er[98] = ez),
          (er[99] = ep),
          (er[100] = ef),
          (er[101] = ea),
          (er[102] = et))
        : (et = er[102]),
      er[103] !== eC || er[104] !== eM || er[105] !== eD || er[106] !== ea.id
        ? ((en = (0, t.jsx)(a.f, {
            ghost: eC,
            hover: eM,
            label: eD,
            variant: "ride",
            excludeWidgetId: ea.id,
          })),
          (er[103] = eC),
          (er[104] = eM),
          (er[105] = eD),
          (er[106] = ea.id),
          (er[107] = en))
        : (en = er[107]),
      er[108] !== eS || er[109] !== eu || er[110] !== ea
        ? ((ei = eS
            ? (0, t.jsx)(u.f, {
                type: eS,
                heading: `Switch to ${w.J[eS].label}`,
                onPick: (e) => {
                  (eu(ea, eS, e), eX(null));
                },
                onClose: () => eX(null),
              })
            : null),
          (er[108] = eS),
          (er[109] = eu),
          (er[110] = ea),
          (er[111] = ei))
        : (ei = er[111]),
      er[112] !== eI ||
      er[113] !== D ||
      er[114] !== I ||
      er[115] !== V ||
      er[116] !== ee ||
      er[117] !== et ||
      er[118] !== en ||
      er[119] !== ei ||
      er[120] !== ea.id
        ? ((el = (0, t.jsxs)("section", {
            ref: ev,
            "aria-label": eI,
            "data-testid": "screeners-floating-widget",
            "data-widget-id": eV,
            className: B,
            style: D,
            onPointerDownCapture: I,
            children: [V, ee, et, en, ei],
          })),
          (er[112] = eI),
          (er[113] = D),
          (er[114] = I),
          (er[115] = V),
          (er[116] = ee),
          (er[117] = et),
          (er[118] = en),
          (er[119] = ei),
          (er[120] = ea.id),
          (er[121] = el))
        : (el = er[121]),
      el
    );
  }
  function k(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  function S(e) {
    return e.widgets;
  }
  var X = e.i(513579);
  e.i(290204);
  var P = e.i(99844),
    Y = e.i(731756),
    C = e.i(10738);
  function M(e) {
    return (0, t.jsx)(N, { widget: e }, e.id);
  }
  function R(e) {
    return (0, t.jsx)(s.R, { widget: e }, e.id);
  }
  function _(e) {
    return e.float;
  }
  function L(e) {
    return e.widgets;
  }
  function E(e) {
    let l,
      r,
      a,
      o,
      s,
      d,
      c = (0, n.c)(17),
      { side: h, children: u } = e;
    c[0] !== h
      ? ((l = (e) => e.widgetWidths[h] ?? 352), (c[0] = h), (c[1] = l))
      : (l = c[1]);
    let p = (0, j.V)(l),
      { setWidgetSideWidth: g } = (0, f.f)(),
      w = (0, i.useRef)(null);
    c[2] !== g || c[3] !== h || c[4] !== p
      ? ((r = (e) => {
          if (0 !== e.button) return;
          e.preventDefault();
          let t = e.currentTarget,
            n = w.current;
          if (!n) return;
          let i = e.clientX,
            l = "right" === h ? -1 : 1,
            r = p,
            a = () => {
              r !== p ? g(h, r) : (n.style.width = `${p}px`);
            };
          (0, m.L)(t, e.pointerId, {
            onMove: (e) => {
              ((r = Math.min(Math.max(p + l * (e.clientX - i), j.B), j.x)),
                (n.style.width = `${r}px`));
            },
            onRelease: a,
            onCancel: a,
          });
        }),
        (c[2] = g),
        (c[3] = h),
        (c[4] = p),
        (c[5] = r))
      : (r = c[5]);
    let b = r;
    c[6] !== p ? ((a = { width: p }), (c[6] = p), (c[7] = a)) : (a = c[7]);
    let v = "right" === h ? "-left-2" : "-right-2";
    return (
      c[8] !== v
        ? ((o = (0, y.c)(
            "absolute inset-y-0 z-10 w-1.5 cursor-col-resize touch-none",
            x.V,
            v,
          )),
          (c[8] = v),
          (c[9] = o))
        : (o = c[9]),
      c[10] !== b || c[11] !== o
        ? ((s = (0, t.jsx)("div", {
            role: "presentation",
            "data-testid": "screeners-widget-stack-resize",
            onPointerDown: b,
            className: o,
          })),
          (c[10] = b),
          (c[11] = o),
          (c[12] = s))
        : (s = c[12]),
      c[13] !== u || c[14] !== a || c[15] !== s
        ? ((d = (0, t.jsxs)("div", {
            ref: w,
            "data-testid": "screeners-widget-stack",
            className:
              "relative flex h-[calc(100dvh-var(--layout-top-offset,109px)-2rem)] min-h-0 shrink-0 flex-col gap-3",
            style: a,
            children: [u, s],
          })),
          (c[13] = u),
          (c[14] = a),
          (c[15] = s),
          (c[16] = d))
        : (d = c[16]),
      d
    );
  }
  e.s(
    [
      "GlobalDockHostBody",
      0,
      function (e) {
        let i,
          l,
          r,
          a,
          o,
          s,
          d,
          c = (0, n.c)(24),
          { side: h } = e,
          u = void 0 === h ? "right" : h,
          f = (0, j.a)(),
          x = (0, C.f)(Y.H),
          g = (0, j.V)(L);
        c[0] !== u
          ? ((i = (e) => !0 === e.sideCollapsed[u]), (c[0] = u), (c[1] = i))
          : (i = c[1]);
        let m = (0, j.V)(i);
        if (c[2] !== u || c[3] !== g) {
          let e;
          (c[5] !== u
            ? ((e = (e) => e.side === u && !e.float), (c[5] = u), (c[6] = e))
            : (e = c[6]),
            (l = g.filter(e)),
            (c[2] = u),
            (c[3] = g),
            (c[4] = l));
        } else l = c[4];
        let w = l;
        c[7] !== x || c[8] !== m || c[9] !== w
          ? ((r = x || m ? [] : w),
            (c[7] = x),
            (c[8] = m),
            (c[9] = w),
            (c[10] = r))
          : (r = c[10]);
        let b = r;
        c[11] !== x || c[12] !== u || c[13] !== g
          ? ((a = "right" !== u || x ? [] : g.filter(_)),
            (c[11] = x),
            (c[12] = u),
            (c[13] = g),
            (c[14] = a))
          : (a = c[14]);
        let v = a;
        if (!f || (0 === b.length && 0 === v.length)) return null;
        let $ = b.length > 0;
        return (
          c[15] !== $ || c[16] !== u || c[17] !== b
            ? ((o = $
                ? (0, t.jsx)("aside", {
                    "aria-label":
                      "right" === u
                        ? "Pinned screener panels"
                        : "Screener widgets",
                    "data-testid":
                      "right" === u
                        ? "screeners-global-dock"
                        : "screeners-widgets-left",
                    "data-widget-side": u,
                    className: (0, y.c)(
                      "pt-3",
                      "right" === u
                        ? "col-start-3 justify-self-end pr-[var(--padding-x-main)]"
                        : "col-start-1 justify-self-start pl-[var(--padding-x-main)]",
                    ),
                    children: (0, t.jsx)("div", {
                      className:
                        "sticky top-[var(--layout-top-offset,109px)] flex gap-3 self-start",
                      children:
                        b.length > 0
                          ? (0, t.jsx)(E, { side: u, children: b.map(R) })
                          : null,
                    }),
                  })
                : null),
              (c[15] = $),
              (c[16] = u),
              (c[17] = b),
              (c[18] = o))
            : (o = c[18]),
          c[19] !== v
            ? ((s = v.map(M)), (c[19] = v), (c[20] = s))
            : (s = c[20]),
          c[21] !== o || c[22] !== s
            ? ((d = (0, t.jsx)(p.Z, {
                value: "dock",
                children: (0, t.jsx)(P.m, {
                  children: (0, t.jsxs)(X.g, { children: [o, s] }),
                }),
              })),
              (c[21] = o),
              (c[22] = s),
              (c[23] = d))
            : (d = c[23]),
          d
        );
      },
    ],
    695506,
  );
};
