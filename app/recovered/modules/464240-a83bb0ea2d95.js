// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(565693),
    r = e.i(278051),
    i = e.i(901348),
    o = e.i(68585),
    l = e.i(648585),
    a = e.i(833551),
    s = e.i(810954),
    u = e.i(264150),
    c = e.i(611960),
    d = e.i(741420),
    f = e.i(998471),
    p = e.i(24542),
    g = e.i(845891),
    h = e.i(371308),
    v = e.i(203109),
    m = e.i(530215),
    b = e.i(297454),
    x = e.i(732486);
  let y = !1,
    S = {
      ...a.E,
      ...s.T,
      expanded: (e) => (e ? { [d.f.expanded]: "" } : null),
      nestedDrawerOpen: (e) => (e ? { [d.f.nestedDrawerOpen]: "" } : null),
      nestedDrawerSwiping: (e) =>
        e ? { [d.f.nestedDrawerSwiping]: "" } : null,
      swipeDirection: (e) => (e ? { [d.f.swipeDirection]: e } : null),
      swiping: (e) => (e ? { [d.f.swiping]: "" } : null),
    },
    w = t.forwardRef(function (e, a) {
      let s,
        { className: d, finalFocus: w, initialFocus: _, render: E, ...C } = e,
        { store: R } = (0, o.x)(),
        {
          swipeDirection: P,
          frontmostHeight: T,
          hasNestedDrawer: D,
          nestedSwiping: N,
          nestedSwipeProgressStore: A,
          onPopupHeightChange: M,
          notifyParentFrontmostHeight: O,
          notifyParentHasNestedDrawer: I,
        } = (0, h.R)(),
        k = R.useState("descriptionElementId"),
        F = R.useState("disablePointerDismissal"),
        B = R.useState("floatingRootContext"),
        z = R.useState("popupProps"),
        j = R.useState("modal"),
        $ = R.useState("mounted"),
        L = R.useState("nested"),
        H = R.useState("nestedOpenDialogCount"),
        W = R.useState("transitionStatus"),
        U = R.useState("open"),
        Y = R.useState("openMethod"),
        V = R.useState("titleElementId"),
        X = R.useState("role"),
        q = H > 0,
        K = (0, m.L)(!0),
        Z = K?.swiping ?? !1,
        G = K?.swipeStrength ?? null,
        {
          snapPoints: J,
          activeSnapPoint: Q,
          activeSnapPointOffset: ee,
        } = (0, v.f)();
      (0, f.Z)();
      let [et, en] = t.useState(0),
        er = t.useRef(0),
        ei = (0, r.f)(() => {
          let e = R.context.popupRef.current;
          if (!e) return;
          let t = e.offsetHeight;
          if (!(er.current > 0) || !(T > er.current) || !(t > er.current)) {
            if (er.current > 0 && D) {
              let e = er.current;
              (en(e), M(e));
              return;
            }
            t !== er.current && ((er.current = t), en(t), M(t));
          }
        });
      ((0, n.f)(() => {
        if (!$) {
          ((er.current = 0), en(0), M(0));
          return;
        }
        let e = R.context.popupRef.current;
        if (
          !e ||
          (y ||
            ("u" > typeof CSS &&
              "registerProperty" in CSS &&
              ([
                c.f.swipeMovementX,
                c.f.swipeMovementY,
                c.f.snapPointOffset,
              ].forEach((e) => {
                try {
                  CSS.registerProperty({
                    name: e,
                    syntax: "<length>",
                    inherits: !1,
                    initialValue: "0px",
                  });
                } catch {}
              }),
              [
                { name: u.f.swipeProgress, initialValue: "0" },
                { name: c.f.swipeStrength, initialValue: "1" },
              ].forEach(({ name: e, initialValue: t }) => {
                try {
                  CSS.registerProperty({
                    name: e,
                    syntax: "<number>",
                    inherits: !1,
                    initialValue: t,
                  });
                } catch {}
              })),
            (y = !0)),
          ei(),
          "function" != typeof ResizeObserver)
        )
          return;
        let t = new ResizeObserver(ei);
        return (
          t.observe(e),
          () => {
            t.disconnect();
          }
        );
      }, [ei, $, q, M, R.context.popupRef]),
        (0, n.f)(() => {
          let e = R.context.popupRef,
            t = () => {
              let t = e.current;
              if (!t) return;
              let n = A.getSnapshot();
              n > 0
                ? t.style.setProperty(u.f.swipeProgress, `${n}`)
                : t.style.setProperty(u.f.swipeProgress, "0");
            };
          t();
          let n = A.subscribe(t);
          return () => {
            n();
            let t = e.current;
            t && t.style.setProperty(u.f.swipeProgress, "0");
          };
        }, [A, R.context.popupRef]),
        t.useEffect(() => {
          if (U)
            return (
              O?.(T),
              () => {
                O?.(0);
              }
            );
        }, [T, U, O]),
        t.useEffect(() => {
          if (I)
            return (
              I(U || "ending" === W),
              () => {
                I(!1);
              }
            );
        }, [I, U, W]),
        (0, p.f)({
          open: U,
          ref: R.context.popupRef,
          onComplete() {
            U && R.context.onOpenChangeComplete?.(!0);
          },
        }));
      let eo = void 0 === _ ? R.context.popupRef : _,
        el = !D && "ending" !== W;
      et && !el && (s = `${et}px`);
      let ea = J && J.length > 0 && ("down" === P || "up" === P),
        es = null;
      ea && null !== ee && (es = "up" === P ? -ee : ee);
      let eu = K ? K.getDragStyles() : b.w;
      if (ea && "down" === P) {
        let e = ee ?? 0,
          t = Number.parseFloat(String(eu[c.f.swipeMovementY] ?? 0)),
          n = Number.isFinite(t) ? e + t : e;
        if (Z && n < 0 && Number.isFinite(t)) {
          let t = -Math.sqrt(Math.abs(n));
          eu = { ...eu, transform: void 0, [c.f.swipeMovementY]: `${t - e}px` };
        } else eu = { ...eu, transform: void 0 };
      }
      let ec = (0, l.f)("div", e, {
        state: {
          open: U,
          nested: L,
          transitionStatus: W,
          expanded: 1 === Q,
          nestedDrawerOpen: q,
          nestedDrawerSwiping: N,
          swipeDirection: P,
          swiping: Z,
        },
        props: [
          z,
          {
            "aria-labelledby": V,
            "aria-describedby": k,
            role: X,
            tabIndex: -1,
            hidden: !$,
            onKeyDown(e) {
              g.J.has(e.key) && e.stopPropagation();
            },
            style: {
              ...eu,
              [u.f.swipeProgress]: "0",
              [c.f.nestedDrawers]: H,
              [c.f.height]: s,
              [c.f.snapPointOffset]: "number" == typeof es ? `${es}px` : "0px",
              [c.f.frontmostHeight]: T ? `${T}px` : void 0,
              [c.f.swipeStrength]:
                "number" == typeof G && Number.isFinite(G) && G > 0
                  ? `${G}`
                  : "1",
            },
          },
          C,
        ],
        ref: [a, R.context.popupRef, R.useStateSetter("popupElement")],
        stateAttributesMapping: S,
      });
      return (0, x.jsx)(i.f, {
        context: B,
        openInteractionType: Y,
        disabled: !$,
        closeOnFocusOut: !F,
        initialFocus: eo,
        returnFocus: w,
        modal: !1 !== j,
        restoreFocus: "popup",
        children: ec,
      });
    });
  e.s(["DrawerPopup", 0, w]);
};
