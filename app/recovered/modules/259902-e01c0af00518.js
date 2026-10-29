// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(702232),
    r = e.i(352386),
    i = e.i(659208),
    o = e.i(115042),
    l = e.i(833551),
    a = e.i(648585),
    s = e.i(290915),
    u = e.i(739774),
    c = e.i(699238),
    d = e.i(994907),
    f = e.i(129658),
    p = e.i(502522),
    g = e.i(175843);
  let h =
      (((t = {})[(t.popupOpen = l.Y.popupOpen)] = "popupOpen"),
      (t.triggerDisabled = "data-trigger-disabled"),
      t),
    v = (0, i.u)(function (e, t) {
      let {
          className: i,
          render: v,
          handle: m,
          payload: b,
          disabled: x,
          delay: y,
          closeOnClick: S = !0,
          closeDelay: w,
          id: _,
          ...E
        } = e,
        C = (0, o.Z)(!0),
        R = m?.store ?? C;
      if (!R) throw Error((0, n.f)(82));
      let P = (0, u.f)(_),
        T = R.useState("isTriggerActive", P),
        D = R.useState("isOpenedByTrigger", P),
        N = R.useState("floatingRootContext"),
        A = r.useRef(null),
        M = y ?? 600,
        O = w ?? 0,
        { registerTrigger: I, isMountedByThisTrigger: k } = (0, s.F)(P, A, R, {
          payload: b,
          closeOnClick: S,
          closeDelay: O,
        }),
        F = (0, c.L)(),
        {
          delayRef: B,
          isInstantPhase: z,
          hasProvider: j,
        } = (0, f.D)(N, { open: D });
      R.useSyncedValue("isInstantPhase", z);
      let $ = R.useState("disabled"),
        L = x ?? $,
        H = R.useState("trackCursorAxis"),
        W = R.useState("disableHoverablePopup"),
        U = (0, g.f)(N, {
          enabled: !L,
          mouseOnly: !0,
          move: !1,
          handleClose: W || "both" === H ? null : (0, d.f)(),
          restMs() {
            let e = F?.delay,
              t = "object" == typeof B.current ? B.current.open : void 0,
              n = M;
            return (j && (n = 0 !== t ? (y ?? e ?? M) : 0), n);
          },
          delay() {
            let e = "object" == typeof B.current ? B.current.close : void 0,
              t = O;
            return (null == w && j && (t = e), { close: t });
          },
          triggerElementRef: A,
          isActiveTrigger: T,
        }),
        Y = (0, p.f)(N, { enabled: !L }).reference,
        V = R.useState("triggerProps", k);
      return (0, a.f)("button", e, {
        state: { open: D },
        ref: [t, I, A],
        props: [
          U,
          Y,
          V,
          {
            onPointerDown() {
              R.set("closeOnClick", S);
            },
            id: P,
            [h.triggerDisabled]: L ? "" : void 0,
          },
          E,
        ],
        stateAttributesMapping: l.J,
      });
    });
  e.s(["TooltipTrigger", 0, v], 259902);
};
