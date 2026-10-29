// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(421087),
    a = e.i(513579),
    n = e.i(541710),
    l = e.i(791898),
    o = e.i(937863),
    s = e.i(994112),
    d = e.i(943331),
    c = e.i(743786),
    r = e.i(595673),
    u = e.i(45329);
  let m = (e) => e?.announce !== !1,
    p = (e) => e.panes[0]?.view ?? "trending",
    g = (e) => (0, u.O)(u.V.getState()).find((t) => t.id === e)?.panes.length;
  e.s([
    "f",
    0,
    function () {
      let e = (0, u.V)((e) => e.addColumn),
        b = (0, u.V)((e) => e.removeColumn),
        h = (0, u.V)((e) => e.setColumnOrder),
        f = (0, u.V)((e) => e.dockColumnToSide),
        k = (0, u.V)((e) => e.adoptColumn),
        v = (0, a.G)(),
        V = (0, t.useCallback)(
          (t, a, n, o) => {
            let s = new Set((0, u.O)(u.V.getState()).map((e) => e.id));
            e(t, a, n);
            let d = (0, u.O)(u.V.getState()),
              c = d.findIndex((e) => !s.has(e.id));
            -1 === c ||
              ((0, r.L9)({
                action: "add",
                columnType: t,
                hasParam: !!l.J[t].param,
              }),
              m(o) &&
                v(
                  (0, i.E)({
                    title: l.J[t].label,
                    position: c + 1,
                    total: d.length,
                  }),
                ));
          },
          [e, v],
        ),
        y = (0, t.useCallback)(
          (e, t) => {
            let a = (0, u.O)(u.V.getState()).length;
            (b(e.id),
              (0, u.O)(u.V.getState()).length === a ||
                ((0, r.L9)({ action: "remove", columnType: p(e) }),
                m(t) && v((0, i.s)({ title: (0, s.S)(e) }))));
          },
          [b, v],
        ),
        x = (0, t.useCallback)(
          (e, t, a) => {
            h(e, t.id);
            let n = (0, u.O)(u.V.getState()),
              l = n.findIndex((e) => e.id === t.id);
            -1 === l ||
              ((0, r.L9)({ action: "reorder", columnType: p(t) }),
              m(a) &&
                v(
                  (0, i.J)({
                    title: (0, s.S)(t),
                    position: l + 1,
                    total: n.length,
                  }),
                ));
          },
          [h, v],
        ),
        C = (0, t.useCallback)(
          (e, t, a) => {
            let n = (0, u.O)(u.V.getState()).length;
            (f(e.id, t),
              (0, u.O)(u.V.getState()).length === n ||
                ((0, r.L9)({ action: "dock", columnType: p(e) }),
                m(a) && v((0, i.k)({ title: (0, s.S)(e), side: t }))));
          },
          [f, v],
        ),
        w = (0, u.V)((e) => e.setPaneView),
        S = (0, t.useCallback)(
          (e, t, i, a) => {
            (w(e, t.id, i, a),
              (0, r.L9)({
                action: "pane-view",
                columnType: i,
                hasParam: !!l.J[i].param,
              }),
              v(`Showing ${l.J[i].label}.`));
          },
          [w, v],
        ),
        T = (0, u.V)((e) => e.togglePanePin),
        L = (0, t.useCallback)(
          (e, t, i) => {
            let a = (0, o.x)(t, i);
            T(e, t.id, i);
            let n = (0, u.O)(u.V.getState())
              .find((t) => t.id === e)
              ?.panes.find((e) => e.id === t.id);
            n &&
              (0, o.x)(n, i) !== a &&
              (0, r.L9)({
                action: "pane-pin",
                columnType: i,
                detail: a ? "unpin" : "pin",
              });
          },
          [T],
        ),
        $ = (0, u.V)((e) => e.setPaneFilters),
        P = (0, n.l)(),
        j = (0, t.useCallback)(
          (e, t, i) => {
            ($(e, t.id, i, P),
              (0, r.L9)({ action: "pane-filter", columnType: t.view }));
          },
          [$, P],
        ),
        O = (0, u.V)((e) => e.setPaneBoard),
        W = (0, t.useCallback)(
          (e, t, i) => {
            (O(e, t.id, i),
              (0, r.L9)({
                action: "pane-board",
                columnType: t.view,
                detail: i,
              }));
          },
          [O],
        ),
        J = (0, u.V)((e) => e.setPaneTrending),
        N = (0, t.useCallback)(
          (e, t, i) => {
            J(e, t.id, i);
          },
          [J],
        ),
        z = (0, u.V)((e) => e.setPaneSound),
        _ = (0, t.useCallback)(
          (e, t, i) => {
            (z(e, t.id, i), (0, r.L9)({ action: "sound", columnType: t.view }));
          },
          [z],
        ),
        I = (0, u.V)((e) => e.setPaneAccent),
        D = (0, t.useCallback)(
          (e, t, i) => {
            (I(e, t.id, i),
              (0, r.L9)({ action: "pane-accent", columnType: t.view }));
          },
          [I],
        ),
        E = (0, u.V)((e) => e.setPaneTitle),
        R = (0, t.useCallback)(
          (e, t, i) => {
            (E(e, t.id, i),
              (0, r.L9)({ action: "pane-rename", columnType: t.view }));
          },
          [E],
        ),
        A = (0, u.V)((e) => e.addPane),
        B = (0, t.useCallback)(
          (e, t, i, a) => {
            let n = g(e.id);
            (A(e.id, t, i),
              g(e.id) === n ||
                ((0, r.L9)({
                  action: "pane-add",
                  columnType: t,
                  hasParam: !!l.J[t].param,
                }),
                m(a) &&
                  v(`Added ${l.J[t].label} as a pane of ${(0, s.S)(e)}.`)));
          },
          [A, v],
        ),
        F = (0, u.V)((e) => e.movePane),
        G = (0, t.useCallback)(
          (e, t, i, a, n) => {
            let o = (0, u.O)(u.V.getState())
              .find((t) => t.id === e)
              ?.panes.find((e) => e.id === t);
            (F(e, t, i, a),
              !o ||
                ((0, r.L9)({ action: "pane-move", columnType: o.view }),
                m(n) &&
                  v(
                    e === i
                      ? `${l.J[o.view].label} pane moved to slot ${a + 1}.`
                      : `${l.J[o.view].label} pane moved to another column.`,
                  )));
          },
          [F, v],
        ),
        M = (0, u.V)((e) => e.extractPane),
        K = (0, t.useCallback)(
          (e, t, i, a) => {
            let n = (0, u.O)(u.V.getState())
              .find((t) => t.id === e)
              ?.panes.find((e) => e.id === t);
            (M(e, t, i),
              !n ||
                ((0, r.L9)({ action: "pane-extract", columnType: n.view }),
                m(a) && v(`${l.J[n.view].label} moved into its own column.`)));
          },
          [M, v],
        ),
        U = (0, u.V)((e) => e.stackColumns),
        q = (0, t.useCallback)(
          (e, t, i = "end", a) => {
            let n = (0, u.O)(u.V.getState()).length,
              l = (0, u.O)(u.V.getState()).find((t) => t.id === e);
            (U(e, t, i),
              (0, u.O)(u.V.getState()).length === n ||
                ((0, r.L9)({
                  action: "stack",
                  columnType: l ? p(l) : "trending",
                }),
                m(a) && v("Columns stacked.")));
          },
          [U, v],
        ),
        H = (0, u.V)((e) => e.setColumnWidth),
        Q = (0, t.useCallback)(
          (e, t) => {
            (H(e.id, t), (0, r.L9)({ action: "resize", columnType: p(e) }));
          },
          [H],
        ),
        X = (0, u.V)((e) => e.setPaneSizes),
        Y = (0, t.useCallback)(
          (e, t) => {
            (X(e.id, t), (0, r.L9)({ action: "resize", columnType: p(e) }));
          },
          [X],
        ),
        Z = (0, u.V)((e) => e.splitPane),
        ee = (0, t.useCallback)(
          (e, t) => {
            let i = (0, u.O)(u.V.getState()).find((t) => t.id === e)?.panes
              .length;
            Z(e, t.id);
            let a = (0, u.O)(u.V.getState()).find((t) => t.id === e)?.panes
              .length;
            void 0 !== a &&
              a !== i &&
              ((0, r.L9)({ action: "pane-split", columnType: t.view }),
              v(`Column split — ${a} panes.`));
          },
          [Z, v],
        ),
        et = (0, u.V)((e) => e.removePane),
        ei = (0, t.useCallback)(
          (e, t) => {
            (et(e, t.id),
              (0, r.L9)({ action: "pane-close", columnType: t.view }),
              v(`${l.J[t.view].label} pane closed.`));
          },
          [et, v],
        ),
        ea = (0, u.V)((e) => e.removeWidget),
        en = (0, t.useCallback)(
          (e) => {
            (ea(e.id),
              (0, r.L9)({ action: "widget-toggle", columnType: e.pane.view }),
              v(`${(0, s.j)(e.pane)} widget closed.`));
          },
          [ea, v],
        ),
        el = (0, u.V)((e) => e.moveWidget),
        eo = (0, t.useCallback)(
          (e, t, i) => {
            (el(e.id, t, i),
              (0, r.L9)({ action: "widget-move", columnType: e.pane.view }),
              v(`${(0, s.j)(e.pane)} widget docked ${t}.`));
          },
          [el, v],
        ),
        es = (0, u.V)((e) => e.setWidgetView),
        ed = (0, t.useCallback)(
          (e, t, i) => {
            (es(e.id, t, i),
              (0, r.L9)({
                action: "widget-view",
                columnType: t,
                hasParam: !!l.J[t].param,
              }),
              v(`Showing ${l.J[t].label}.`));
          },
          [es, v],
        ),
        ec = (0, u.V)((e) => e.setWidgetBoard),
        er = (0, t.useCallback)(
          (e, t) => {
            (ec(e.id, t),
              (0, r.L9)({
                action: "widget-board",
                columnType: e.pane.view,
                detail: t,
              }));
          },
          [ec],
        ),
        eu = (0, u.V)((e) => e.setWidgetTrending),
        em = (0, t.useCallback)(
          (e, t) => {
            eu(e.id, t);
          },
          [eu],
        ),
        ep = (0, u.V)((e) => e.toggleWidgetShade),
        eg = (0, t.useCallback)(
          (e) => {
            (ep(e.id),
              (0, r.L9)({
                action: e.shaded ? "widget-restore" : "widget-minimize",
                columnType: e.pane.view,
              }),
              v(
                `${l.J[e.pane.view].label} ${e.shaded ? "restored" : "minimized"}.`,
              ));
          },
          [ep, v],
        ),
        eb = (0, u.V)((e) => e.floatWidget),
        eh = (0, t.useCallback)(
          (e, t) => {
            (eb(e.id, t),
              (0, r.L9)({ action: "widget-float", columnType: e.pane.view }),
              v(`${(0, s.j)(e.pane)} floating.`));
          },
          [eb, v],
        ),
        ef = (0, u.V)((e) => e.floatWidget),
        ek = (0, t.useCallback)(
          (e, t) => {
            (ef(e.id, t),
              (0, r.L9)({ action: "widget-resize", columnType: e.pane.view }));
          },
          [ef],
        ),
        ev = (0, u.V)((e) => e.bringWidgetToFront),
        eV = (0, u.V)((e) => e.setWidgetSideWidth),
        ey = (0, t.useCallback)(
          (e, t) => {
            (eV(e, t),
              (0, r.L9)({ action: "dock-resize", columnType: "deck" }));
          },
          [eV],
        ),
        ex = (0, t.useCallback)(
          (t, i) => {
            let a = (0, u.O)(u.V.getState()).findIndex((e) => e.id === t.id),
              n = (0, s.G)(i);
            (t.auto && k(t.id),
              e(i.view, n.params, -1 === a ? void 0 : a + 1),
              (0, r.L9)({ action: "pane-split", columnType: i.view }),
              v(`${(0, s.j)(i)} split right.`));
          },
          [e, k, v],
        ),
        eC = (0, u.V)((e) => e.toggleSidePanel),
        ew = (0, t.useCallback)(
          (e) => {
            (eC(e), (0, r.L9)({ action: "side-toggle", columnType: e }));
          },
          [eC],
        ),
        eS = (0, u.V)((e) => e.addList),
        eT = (0, t.useCallback)(
          (e, t, i) => {
            let a = (0, d.p)(e, t, i);
            return (
              eS(a),
              (0, r.L9)({ action: "custom-list-create", columnType: t }),
              v(`${a.name} list created.`),
              a
            );
          },
          [eS, v],
        ),
        eL = (0, u.V)((e) => e.updateList),
        e$ = (0, t.useCallback)(
          (e, t) => {
            (eL(e.id, t),
              (0, r.L9)({ action: "custom-list-update", columnType: e.kind }));
          },
          [eL],
        ),
        eP = (0, u.V)((e) => e.deleteList),
        ej = (0, t.useCallback)(
          (e) => {
            (eP(e.id),
              (0, r.L9)({ action: "custom-list-delete", columnType: e.kind }),
              v(`${e.name} list deleted.`));
          },
          [eP, v],
        ),
        eO = (0, u.V)((e) => e.createDeck),
        eW = (0, t.useCallback)(
          (e, t) => {
            let i = u.V.getState().decks.length;
            eO(e, t);
            let a = u.V.getState();
            a.decks.length !== i &&
              ((0, r.L9)({ action: "list-create", columnType: "list" }),
              v(`Created list ${a.decks[a.decks.length - 1].name}.`));
          },
          [eO, v],
        ),
        eJ = (0, u.V)((e) => e.switchDeck),
        eN = (0, t.useCallback)(
          (e) => {
            let t = u.V.getState().activeDeckId;
            eJ(e);
            let i = u.V.getState();
            if (i.activeDeckId === t) return;
            (0, r.L9)({ action: "list-switch", columnType: "list" });
            let a = i.decks.find((t) => t.id === e);
            a && v(`Switched to list ${a.name}.`);
          },
          [eJ, v],
        ),
        ez = (0, u.V)((e) => e.renameDeck),
        e_ = (0, t.useCallback)(
          (e, t) => {
            (ez(e, t),
              (0, r.L9)({ action: "list-rename", columnType: "list" }));
          },
          [ez],
        ),
        eI = (0, u.V)((e) => e.deleteDeck),
        eD = (0, t.useCallback)(
          (e) => {
            let t = u.V.getState().decks.length;
            (eI(e),
              u.V.getState().decks.length !== t &&
                ((0, r.L9)({ action: "list-delete", columnType: "list" }),
                v("List deleted.")));
          },
          [eI, v],
        ),
        eE = (0, u.V)((e) => e.setStyle),
        eR = (0, t.useCallback)(
          (e) => {
            (eE(e), (0, r.L9)({ action: "style", columnType: "board" }));
          },
          [eE],
        ),
        eA =
          (e, t) =>
          (...i) => {
            let a = void 0 === t ? void 0 : i[t];
            a?.transition === !1 ? e(...i) : (0, c.S)(() => e(...i));
          };
      return {
        addColumn: eA(V),
        addPane: eA(B),
        removeColumn: eA(y),
        setColumnOrder: eA(x, 2),
        dockColumnToSide: eA(C, 2),
        setPaneView: eA(S),
        togglePanePin: L,
        setPaneFilters: j,
        setPaneBoard: W,
        setPaneTrending: N,
        setPaneSound: _,
        setPaneAccent: D,
        setPaneTitle: R,
        splitPane: eA(ee),
        splitColumnRight: eA(ex),
        removePane: eA(ei),
        movePane: eA(G),
        extractPane: eA(K),
        stackColumns: eA(q, 3),
        setColumnWidth: Q,
        setPaneSizes: Y,
        removeWidget: eA(en),
        moveWidget: eA(eo),
        floatWidget: eA(eh),
        setWidgetView: eA(ed),
        setWidgetBoard: er,
        setWidgetTrending: em,
        toggleWidgetShade: eA(eg),
        resizeFloatWidget: ek,
        bringWidgetToFront: ev,
        setWidgetSideWidth: ey,
        toggleSidePanel: eA(ew),
        createList: eT,
        updateList: e$,
        deleteList: ej,
        createDeck: eW,
        switchDeck: eN,
        renameDeck: e_,
        deleteDeck: eD,
        setStyle: eR,
      };
    },
  ]);
};
