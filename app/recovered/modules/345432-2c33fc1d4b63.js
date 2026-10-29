// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(659208),
    r = e.i(10180),
    i = e.i(565693),
    o = e.i(115042),
    l = e.i(92615),
    a = e.i(278051),
    s = e.i(430186),
    u = e.i(36177);
  function c(e) {
    return null != e && null != e.clientX;
  }
  var d = e.i(385676),
    f = e.i(908116),
    p = e.i(523686),
    g = e.i(290915),
    h = e.i(231332),
    v = e.i(209296),
    m = e.i(726062),
    b = e.i(303232),
    x = e.i(53249),
    y = e.i(875355),
    S = e.i(530425),
    w = e.i(854274),
    _ = e.i(913281),
    E = e.i(590547),
    C = e.i(340607);
  let R = {
    ...E.j,
    disabled: (0, v.f)((e) => e.disabled),
    instantType: (0, v.f)((e) => e.instantType),
    isInstantPhase: (0, v.f)((e) => e.isInstantPhase),
    trackCursorAxis: (0, v.f)((e) => e.trackCursorAxis),
    disableHoverablePopup: (0, v.f)((e) => e.disableHoverablePopup),
    lastOpenChangeReason: (0, v.f)((e) => e.openChangeReason),
    closeOnClick: (0, v.f)((e) => e.closeOnClick),
    closeDelay: (0, v.f)((e) => e.closeDelay),
    hasViewport: (0, v.f)((e) => e.hasViewport),
  };
  class P extends m.f {
    constructor(e) {
      super(
        {
          ...{
            ...(0, E.i)(),
            disabled: !1,
            instantType: void 0,
            isInstantPhase: !1,
            trackCursorAxis: "none",
            disableHoverablePopup: !1,
            openChangeReason: null,
            closeOnClick: !0,
            closeDelay: 0,
            hasViewport: !1,
          },
          ...e,
        },
        {
          popupRef: t.createRef(),
          onOpenChange: void 0,
          onOpenChangeComplete: void 0,
          triggerElements: new C.f(),
        },
        R,
      );
    }
    setOpen = (e, t) => {
      let n = t.reason,
        r = n === y.f.triggerHover,
        i = e && n === S.f.triggerFocus,
        o = !e && (n === w.f.triggerPress || n === _.f.escapeKey);
      if (
        ((t.preventUnmountOnClose = () => {
          this.set("preventUnmountingOnClose", !0);
        }),
        this.context.onOpenChange?.(e, t),
        t.isCanceled)
      )
        return;
      let l = () => {
        let r = { open: e, openChangeReason: n };
        i
          ? (r.instantType = "focus")
          : o
            ? (r.instantType = "dismiss")
            : n === y.f.triggerHover && (r.instantType = void 0);
        let l = t.trigger?.id ?? null;
        ((l || e) &&
          ((r.activeTriggerId = l),
          (r.activeTriggerElement = t.trigger ?? null)),
          this.update(r));
      };
      r ? h.flushSync(l) : l();
    };
    static useStore(e, t) {
      let n = (0, b.f)(() => new P(t)).current,
        r = e ?? n,
        i = (0, x.f)({ popupStore: r, onOpenChange: r.setOpen });
      return ((r.state.floatingRootContext = i), r);
    }
  }
  var T = e.i(904440),
    T = T,
    D = e.i(559545),
    N = e.i(814421),
    A = e.i(732486);
  let M = (0, n.U)(function (e) {
    let {
        disabled: n = !1,
        defaultOpen: h = !1,
        open: v,
        disableHoverablePopup: m = !1,
        trackCursorAxis: b = "none",
        actionsRef: x,
        onOpenChange: y,
        onOpenChangeComplete: S,
        handle: w,
        triggerId: _,
        defaultTriggerId: E = null,
        children: C,
      } = e,
      R = P.useStore(w?.store, {
        open: h,
        openProp: v,
        activeTriggerId: E,
        triggerIdProp: _,
      });
    ((0, r.f)(() => {
      void 0 === v &&
        !1 === R.state.open &&
        !0 === h &&
        R.update({ open: !0, activeTriggerId: E });
    }),
      R.useControlledProp("openProp", v),
      R.useControlledProp("triggerIdProp", _),
      R.useContextCallback("onOpenChange", y),
      R.useContextCallback("onOpenChangeComplete", S));
    let M = R.useState("open"),
      O = !n && M,
      I = R.useState("activeTriggerId"),
      k = R.useState("payload");
    (R.useSyncedValues({ trackCursorAxis: b, disableHoverablePopup: m }),
      (0, i.f)(() => {
        M && n && R.setOpen(!1, (0, p.f)(T.disabled));
      }, [M, n, R]),
      R.useSyncedValue("disabled", n),
      (0, g.z)(R));
    let { forceUnmount: F, transitionStatus: B } = (0, g.L)(O, R),
      z = R.useState("isInstantPhase"),
      j = R.useState("instantType"),
      $ = R.useState("lastOpenChangeReason"),
      L = t.useRef(null);
    ((0, i.f)(() => {
      ("ending" === B && $ === D.f.none) || ("ending" !== B && z)
        ? ("delay" !== j && (L.current = j), R.set("instantType", "delay"))
        : null !== L.current &&
          (R.set("instantType", L.current), (L.current = null));
    }, [B, z, $, j, R]),
      (0, i.f)(() => {
        O && null == I && R.set("payload", void 0);
      }, [R, I, O]));
    let H = t.useCallback(() => {
      var e, t;
      let n;
      R.setOpen(
        !1,
        ((e = R),
        (t = N.f.imperativeAction),
        ((n = (0, p.f)(t)).preventUnmountOnClose = () => {
          e.set("preventUnmountingOnClose", !0);
        }),
        n),
      );
    }, [R]);
    t.useImperativeHandle(x, () => ({ unmount: F, close: H }), [F, H]);
    let W = R.useState("floatingRootContext"),
      U = (0, d.f)(W, {
        enabled: !n,
        referencePress: () => R.select("closeOnClick"),
      }),
      Y = (function (e, n = {}) {
        let r = "rootStore" in e ? e.rootStore : e,
          i = r.useState("open"),
          o = r.useState("floatingElement"),
          d = r.useState("domReferenceElement"),
          f = r.context.dataRef,
          { enabled: p = !0, axis: g = "both" } = n,
          h = t.useRef(!1),
          v = t.useRef(null),
          [m, b] = t.useState(),
          [x, y] = t.useState([]),
          S = (0, a.f)((e, t, n) => {
            if (
              !h.current &&
              (!f.current.openEvent || c(f.current.openEvent))
            ) {
              var i, o;
              let l, a, s;
              r.set(
                "positionReference",
                ((i = n ?? d),
                (o = { x: e, y: t, axis: g, dataRef: f, pointerType: m }),
                (l = null),
                (a = null),
                (s = !1),
                {
                  contextElement: i || void 0,
                  getBoundingClientRect() {
                    let e = i?.getBoundingClientRect() || {
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0,
                      },
                      t = "x" === o.axis || "both" === o.axis,
                      n = "y" === o.axis || "both" === o.axis,
                      r =
                        ["mouseenter", "mousemove"].includes(
                          o.dataRef.current.openEvent?.type || "",
                        ) && "touch" !== o.pointerType,
                      u = e.width,
                      c = e.height,
                      d = e.x,
                      f = e.y;
                    return (
                      null == l && o.x && t && (l = e.x - o.x),
                      null == a && o.y && n && (a = e.y - o.y),
                      (d -= l || 0),
                      (f -= a || 0),
                      (u = 0),
                      (c = 0),
                      !s || r
                        ? ((u = "y" === o.axis ? e.width : 0),
                          (c = "x" === o.axis ? e.height : 0),
                          (d = t && null != o.x ? o.x : d),
                          (f = n && null != o.y ? o.y : f))
                        : s &&
                          !r &&
                          ((c = "x" === o.axis ? e.height : c),
                          (u = "y" === o.axis ? e.width : u)),
                      (s = !0),
                      {
                        width: u,
                        height: c,
                        x: d,
                        y: f,
                        top: f,
                        right: d + u,
                        bottom: f + c,
                        left: d,
                      }
                    );
                  },
                }),
              );
            }
          }),
          w = (0, a.f)((e) => {
            i ? v.current || y([]) : S(e.clientX, e.clientY, e.currentTarget);
          }),
          _ = (0, u.J)(m) ? o : i,
          E = t.useCallback(() => {
            if (!_ || !p) return;
            let e = (0, l.J)(o);
            function t(n) {
              let r = (0, s.Z)(n);
              (0, s.I)(o, r)
                ? (e.removeEventListener("mousemove", t), (v.current = null))
                : S(n.clientX, n.clientY);
            }
            if (!f.current.openEvent || c(f.current.openEvent)) {
              e.addEventListener("mousemove", t);
              let n = () => {
                (e.removeEventListener("mousemove", t), (v.current = null));
              };
              return ((v.current = n), n);
            }
            r.set("positionReference", d);
          }, [_, p, o, f, d, r, S]);
        (t.useEffect(() => E(), [E, x]),
          t.useEffect(() => {
            p && !o && (h.current = !1);
          }, [p, o]),
          t.useEffect(() => {
            !p && i && (h.current = !0);
          }, [p, i]));
        let C = t.useMemo(() => {
          function e(e) {
            b(e.pointerType);
          }
          return {
            onPointerDown: e,
            onPointerEnter: e,
            onMouseMove: w,
            onMouseEnter: w,
          };
        }, [w]);
        return t.useMemo(() => (p ? { reference: C, trigger: C } : {}), [p, C]);
      })(W, { enabled: !n && "none" !== b, axis: "none" === b ? void 0 : b }),
      {
        getReferenceProps: V,
        getFloatingProps: X,
        getTriggerProps: q,
      } = (0, f.f)([U, Y]),
      K = t.useMemo(() => V(), [V]),
      Z = t.useMemo(() => q(), [q]),
      G = t.useMemo(() => X(), [X]);
    return (
      R.useSyncedValues({
        activeTriggerProps: K,
        inactiveTriggerProps: Z,
        popupProps: G,
      }),
      (0, A.jsx)(o.u.Provider, {
        value: R,
        children: "function" == typeof C ? C({ payload: k }) : C,
      })
    );
  });
  e.s(["TooltipRoot", 0, M], 345432);
};
