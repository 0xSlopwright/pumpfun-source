// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n,
    r,
    i,
    o = e.i(352386),
    l = e.i(48416),
    a = e.i(278051),
    s = e.i(285182),
    u = e.i(234006),
    c = e.i(761806),
    d = e.i(371308),
    f = e.i(86263),
    p = e.i(68585),
    g = e.i(648585),
    h = e.i(681402),
    v = e.i(523686),
    m = e.i(594646);
  let b = o.forwardRef(function (e, t) {
    let {
        render: n,
        className: r,
        disabled: i = !1,
        nativeButton: o = !0,
        ...l
      } = e,
      { store: a } = (0, p.x)(),
      s = a.useState("open"),
      { getButtonProps: u, buttonRef: c } = (0, h.f)({
        disabled: i,
        native: o,
      });
    return (0, g.f)("button", e, {
      state: { disabled: i },
      ref: [t, c],
      props: [
        {
          onClick: function (e) {
            s && a.setOpen(!1, (0, v.f)(m.f.closePress, e.nativeEvent));
          },
        },
        l,
        u,
      ],
    });
  });
  var x = e.i(901348),
    y = e.i(833551),
    S = e.i(810954);
  let w = (((t = {}).nestedDialogs = "--nested-dialogs"), t),
    _ =
      (((n = {})[(n.open = y.q.open)] = "open"),
      (n[(n.closed = y.q.closed)] = "closed"),
      (n[(n.startingStyle = y.q.startingStyle)] = "startingStyle"),
      (n[(n.endingStyle = y.q.endingStyle)] = "endingStyle"),
      (n.nested = "data-nested"),
      (n.nestedDialogOpen = "data-nested-dialog-open"),
      n);
  var E = e.i(998471),
    C = e.i(24542),
    R = e.i(845891),
    P = e.i(732486);
  let T = {
      ...y.E,
      ...S.T,
      nestedDialogOpen: (e) => (e ? { [_.nestedDialogOpen]: "" } : null),
    },
    D = o.forwardRef(function (e, t) {
      let { className: n, finalFocus: r, initialFocus: i, render: o, ...l } = e,
        { store: a } = (0, p.x)(),
        s = a.useState("descriptionElementId"),
        u = a.useState("disablePointerDismissal"),
        c = a.useState("floatingRootContext"),
        d = a.useState("popupProps"),
        f = a.useState("modal"),
        h = a.useState("mounted"),
        v = a.useState("nested"),
        m = a.useState("nestedOpenDialogCount"),
        b = a.useState("open"),
        y = a.useState("openMethod"),
        S = a.useState("titleElementId"),
        _ = a.useState("transitionStatus"),
        D = a.useState("role");
      ((0, E.Z)(),
        (0, C.f)({
          open: b,
          ref: a.context.popupRef,
          onComplete() {
            b && a.context.onOpenChangeComplete?.(!0);
          },
        }));
      let N =
          void 0 === i
            ? function (e) {
                return "touch" !== e || a.context.popupRef.current;
              }
            : i,
        A = (0, g.f)("div", e, {
          state: {
            open: b,
            nested: v,
            transitionStatus: _,
            nestedDialogOpen: m > 0,
          },
          props: [
            d,
            {
              "aria-labelledby": S ?? void 0,
              "aria-describedby": s ?? void 0,
              role: D,
              tabIndex: -1,
              hidden: !h,
              onKeyDown(e) {
                R.J.has(e.key) && e.stopPropagation();
              },
              style: { [w.nestedDialogs]: m },
            },
            l,
          ],
          ref: [t, a.context.popupRef, a.useStateSetter("popupElement")],
          stateAttributesMapping: T,
        });
      return (0, P.jsx)(x.f, {
        context: c,
        openInteractionType: y,
        disabled: !h,
        closeOnFocusOut: !u,
        initialFocus: N,
        returnFocus: r,
        modal: !1 !== f,
        restoreFocus: "popup",
        children: A,
      });
    });
  var N = e.i(329423),
    A = e.i(303232),
    M = e.i(10180),
    O = e.i(648105),
    I = e.i(385676),
    k = e.i(908116),
    F = e.i(271983),
    B = e.i(53249),
    z = e.i(430186),
    j = e.i(87893),
    $ = e.i(814421),
    L = e.i(290915),
    H = e.i(209296),
    W = e.i(726062),
    U = e.i(590547),
    Y = e.i(340607);
  let V = {
    ...U.j,
    modal: (0, H.f)((e) => e.modal),
    nested: (0, H.f)((e) => e.nested),
    nestedOpenDialogCount: (0, H.f)((e) => e.nestedOpenDialogCount),
    disablePointerDismissal: (0, H.f)((e) => e.disablePointerDismissal),
    openMethod: (0, H.f)((e) => e.openMethod),
    descriptionElementId: (0, H.f)((e) => e.descriptionElementId),
    titleElementId: (0, H.f)((e) => e.titleElementId),
    viewportElement: (0, H.f)((e) => e.viewportElement),
    role: (0, H.f)((e) => e.role),
  };
  class X extends W.f {
    constructor(e) {
      super(
        (function (e = {}) {
          return {
            ...(0, U.i)(),
            modal: !0,
            disablePointerDismissal: !1,
            popupElement: null,
            viewportElement: null,
            descriptionElementId: void 0,
            titleElementId: void 0,
            openMethod: null,
            nested: !1,
            nestedOpenDialogCount: 0,
            role: "dialog",
            ...e,
          };
        })(e),
        {
          popupRef: o.createRef(),
          backdropRef: o.createRef(),
          internalBackdropRef: o.createRef(),
          outsidePressEnabledRef: { current: !0 },
          triggerElements: new Y.f(),
          onOpenChange: void 0,
          onOpenChangeComplete: void 0,
        },
        V,
      );
    }
    setOpen = (e, t) => {
      if (
        ((t.preventUnmountOnClose = () => {
          this.set("preventUnmountingOnClose", !0);
        }),
        e ||
          null != t.trigger ||
          null == this.state.activeTriggerId ||
          (t.trigger = this.state.activeTriggerElement ?? void 0),
        this.context.onOpenChange?.(e, t),
        t.isCanceled)
      )
        return;
      let n = {
        open: e,
        nativeEvent: t.event,
        reason: t.reason,
        nested: this.state.nested,
      };
      this.state.floatingRootContext.context.events?.emit("openchange", n);
      let r = { open: e },
        i = t.trigger?.id ?? null;
      ((i || e) &&
        ((r.activeTriggerId = i), (r.activeTriggerElement = t.trigger ?? null)),
        this.update(r));
    };
  }
  var q = e.i(739774);
  let K = o.forwardRef(function (e, t) {
    let { render: n, className: r, id: i, ...o } = e,
      { store: l } = (0, p.x)(),
      a = (0, q.f)(i);
    return (
      l.useSyncedValueWithCleanup("titleElementId", a),
      (0, g.f)("h2", e, { ref: t, props: [{ id: a }, o] })
    );
  });
  e.s(
    [
      "Backdrop",
      () => f.f,
      "Close",
      0,
      b,
      "Popup",
      0,
      D,
      "Portal",
      () => N.f,
      "Root",
      0,
      function (e) {
        let {
            children: t,
            open: n,
            defaultOpen: r = !1,
            onOpenChange: i,
            onOpenChangeComplete: l,
            disablePointerDismissal: s = !1,
            modal: u = !0,
            actionsRef: c,
            handle: d,
            triggerId: f,
            defaultTriggerId: g = null,
          } = e,
          h = (0, p.x)(!0),
          m = !!h,
          b = (0, A.f)(
            () =>
              d?.store ??
              new X({
                open: r,
                openProp: n,
                activeTriggerId: g,
                triggerIdProp: f,
                modal: u,
                disablePointerDismissal: s,
                nested: m,
              }),
          ).current;
        ((0, M.f)(() => {
          void 0 === n &&
            !1 === b.state.open &&
            !0 === r &&
            b.update({ open: !0, activeTriggerId: g });
        }),
          b.useControlledProp("openProp", n),
          b.useControlledProp("triggerIdProp", f),
          b.useSyncedValues({
            disablePointerDismissal: s,
            nested: m,
            modal: u,
          }),
          b.useContextCallback("onOpenChange", i),
          b.useContextCallback("onOpenChangeComplete", l));
        let x = b.useState("payload");
        !(function (e) {
          let { store: t, parentContext: n, actionsRef: r } = e,
            i = t.useState("open"),
            l = t.useState("disablePointerDismissal"),
            s = t.useState("modal"),
            u = t.useState("popupElement"),
            { openMethod: c, triggerProps: d } = (0, j.f)(i);
          (0, L.z)(t);
          let { forceUnmount: f } = (0, L.L)(i, t),
            p = (0, a.f)((e) => {
              let n = (0, v.f)(e);
              return (
                (n.preventUnmountOnClose = () => {
                  t.set("preventUnmountingOnClose", !0);
                }),
                n
              );
            }),
            g = o.useCallback(() => {
              t.setOpen(!1, p($.f.imperativeAction));
            }, [t, p]);
          o.useImperativeHandle(r, () => ({ unmount: f, close: g }), [f, g]);
          let h = (0, B.f)({
              popupStore: t,
              onOpenChange: t.setOpen,
              treatPopupAsFloatingElement: !0,
              noEmit: !0,
            }),
            [m, b] = o.useState(0),
            x = 0 === m,
            y = (0, F.f)(h),
            S = (0, I.f)(h, {
              outsidePressEvent: () =>
                t.context.internalBackdropRef.current ||
                t.context.backdropRef.current
                  ? "intentional"
                  : {
                      mouse: "trap-focus" === s ? "sloppy" : "intentional",
                      touch: "sloppy",
                    },
              outsidePress(e) {
                if (
                  !t.context.outsidePressEnabledRef.current ||
                  ("button" in e && 0 !== e.button) ||
                  ("touches" in e && 1 !== e.touches.length)
                )
                  return !1;
                let n = (0, z.Z)(e);
                return (
                  !!x &&
                  !l &&
                  (!s ||
                    (!t.context.internalBackdropRef.current &&
                      !t.context.backdropRef.current) ||
                    t.context.internalBackdropRef.current === n ||
                    t.context.backdropRef.current === n ||
                    ((0, z.I)(n, u) && !n?.hasAttribute("data-base-ui-portal")))
                );
              },
              escapeKey: x,
            });
          (0, O.f)(i && !0 === s, u);
          let {
            getReferenceProps: w,
            getFloatingProps: _,
            getTriggerProps: E,
          } = (0, k.f)([y, S]);
          (t.useContextCallback("onNestedDialogOpen", (e) => {
            b(e + 1);
          }),
            t.useContextCallback("onNestedDialogClose", () => {
              b(0);
            }),
            o.useEffect(
              () => (
                n?.onNestedDialogOpen && i && n.onNestedDialogOpen(m),
                n?.onNestedDialogClose && !i && n.onNestedDialogClose(),
                () => {
                  n?.onNestedDialogClose && i && n.onNestedDialogClose();
                }
              ),
              [i, n, m],
            ));
          let C = o.useMemo(() => w(d), [w, d]),
            R = o.useMemo(() => E(d), [E, d]),
            P = o.useMemo(() => _(), [_]);
          t.useSyncedValues({
            openMethod: c,
            activeTriggerProps: C,
            inactiveTriggerProps: R,
            popupProps: P,
            floatingRootContext: h,
            nestedOpenDialogCount: m,
          });
        })({
          store: b,
          actionsRef: c,
          parentContext: h?.store.context,
          onOpenChange: i,
          triggerIdProp: f,
        });
        let y = o.useMemo(() => ({ store: b }), [b]);
        return (0, P.jsx)(p.R.Provider, {
          value: y,
          children: "function" == typeof t ? t({ payload: x }) : t,
        });
      },
      "Title",
      0,
      K,
    ],
    660315,
  );
  var Z = e.i(660315);
  e.s(["f", 0, Z], 195636);
  var Z = Z,
    G = e.i(559545),
    J = e.i(904440),
    J = J,
    Q = e.i(329985);
  function ee() {
    let e = 0,
      t = new Set();
    return {
      getSnapshot: () => e,
      set(n) {
        let r = Number.isFinite(n) ? n : 0;
        r !== e &&
          ((e = r),
          t.forEach((e) => {
            e();
          }));
      },
      subscribe: (e) => (
        t.add(e),
        () => {
          t.delete(e);
        }
      ),
    };
  }
  function et() {
    let e = (0, c.f)(),
      t = (0, Q.f)(!0),
      n = (0, p.x)(!1),
      r = n.store.useState("open"),
      i = n.store.useState("nestedOpenDialogCount"),
      l = n.store.useState("popupElement"),
      a = 0 === i;
    return (
      o.useEffect(() => {
        if (t && null != e)
          return () => {
            t.removeDrawer(e);
          };
      }, [e, t]),
      o.useEffect(() => {
        null != e && t?.setDrawerOpen(e, r);
      }, [e, r, t]),
      o.useEffect(() => {
        if (!r || !a || !u.B) return;
        let e = (0, s.f)(l).CloseWatcher;
        if (!e) return;
        function t(e) {
          n.store.select("open") &&
            n.store.setOpen(!1, (0, v.f)(J.closeWatcher, e));
        }
        let i = new e();
        return (
          i.addEventListener("close", t),
          () => {
            (i.removeEventListener("close", t), i.destroy());
          }
        );
      }, [n.store, a, r, l]),
      null
    );
  }
  e.s(
    [
      "DrawerRoot",
      0,
      function (e) {
        let {
            children: t,
            open: n,
            defaultOpen: s = !1,
            onOpenChange: u,
            onOpenChangeComplete: c,
            disablePointerDismissal: f = !1,
            modal: p = !0,
            actionsRef: g,
            handle: h,
            triggerId: m,
            defaultTriggerId: b = null,
            swipeDirection: x = "down",
            snapToSequentialPoints: y = !1,
            snapPoints: S,
            snapPoint: w,
            defaultSnapPoint: _,
            onSnapPointChange: E,
          } = e,
          C = (0, a.f)(E),
          R = (0, d.R)(!0),
          T = R?.onNestedSwipeProgressChange,
          D = R?.onNestedFrontmostHeightChange,
          N = R?.onNestedSwipingChange,
          A = R?.onNestedDrawerPresenceChange,
          [M, O] = o.useState(0),
          [I, k] = o.useState(0),
          [F, B] = o.useState(!1),
          [z, j] = o.useState(!1),
          [$] = o.useState(ee),
          L = void 0 !== _ ? _ : (S?.[0] ?? null),
          H = void 0 !== w,
          [W, U] = (0, l.f)({
            controlled: w,
            default: L,
            name: "Drawer",
            state: "snapPoint",
          }),
          Y = o.useRef(!1),
          V = (0, a.f)((e, t) => {
            let n = t ?? (0, v.f)(G.f.none);
            (C?.(e, n), n.isCanceled || U(e));
          }),
          X = o.useMemo(
            () =>
              H ||
              !S ||
              0 === S.length ||
              (null !== W && S.some((e) => Object.is(e, W)))
                ? W
                : L,
            [W, H, L, S],
          ),
          q = (0, a.f)((e) => {
            (O(e), !Y.current && e > 0 && k(e));
          }),
          K = (0, a.f)((e) => {
            if (e > 0) {
              ((Y.current = !0), k(e));
              return;
            }
            ((Y.current = !1), M > 0 && k(M));
          }),
          J = (0, a.f)((e) => {
            B(e);
          }),
          Q = (0, a.f)((e) => {
            ($.set(e), T?.(e));
          }),
          en = (0, a.f)((e) => {
            (j(e), N?.(e));
          }),
          er = (0, a.f)((e, t) => {
            (u?.(e, t),
              !t.isCanceled &&
                !e &&
                S &&
                S.length > 0 &&
                V(L, (0, v.f)(t.reason, t.event, t.trigger)));
          }),
          ei = o.useMemo(
            () => ({
              swipeDirection: x,
              snapToSequentialPoints: y,
              snapPoints: S,
              activeSnapPoint: X,
              setActiveSnapPoint: V,
              frontmostHeight: I,
              popupHeight: M,
              hasNestedDrawer: F,
              nestedSwiping: z,
              nestedSwipeProgressStore: $,
              onNestedDrawerPresenceChange: J,
              onPopupHeightChange: q,
              onNestedFrontmostHeightChange: K,
              onNestedSwipingChange: en,
              onNestedSwipeProgressChange: Q,
              notifyParentFrontmostHeight: D,
              notifyParentSwipingChange: N,
              notifyParentSwipeProgressChange: T,
              notifyParentHasNestedDrawer: A,
            }),
            [X, I, F, z, $, A, T, N, D, J, K, Q, en, q, M, V, S, y, x],
          ),
          eo =
            "function" == typeof t
              ? (e) =>
                  (0, P.jsxs)(o.Fragment, {
                    children: [r || (r = (0, P.jsx)(et, {})), t(e)],
                  })
              : (0, P.jsxs)(o.Fragment, {
                  children: [i || (i = (0, P.jsx)(et, {})), t],
                });
        return (0, P.jsx)(d.d.Provider, {
          value: ei,
          children: (0, P.jsx)(Z.Root, {
            open: n,
            defaultOpen: s,
            onOpenChange: er,
            onOpenChangeComplete: c,
            disablePointerDismissal: f,
            modal: p,
            actionsRef: g,
            handle: h,
            triggerId: m,
            defaultTriggerId: b,
            children: eo,
          }),
        });
      },
    ],
    524684,
  );
};
