// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = e.i(115042),
    r = e.i(614758),
    i = e.i(257311),
    o = e.i(833551),
    l = e.i(552840),
    a = e.i(648585),
    s = e.i(300310),
    u = e.i(996971),
    c = e.i(813258),
    d = e.i(732486);
  let f = t.forwardRef(function (e, f) {
    let {
        render: p,
        className: g,
        anchor: h,
        positionMethod: v = "absolute",
        side: m = "top",
        align: b = "center",
        sideOffset: x = 0,
        alignOffset: y = 0,
        collisionBoundary: S = "clipping-ancestors",
        collisionPadding: w = 5,
        arrowPadding: _ = 5,
        sticky: E = !1,
        disableAnchorTracking: C = !1,
        collisionAvoidance: R = s.n,
        ...P
      } = e,
      T = (0, n.Z)(),
      D = (0, l.T)(),
      N = T.useState("open"),
      A = T.useState("mounted"),
      M = T.useState("trackCursorAxis"),
      O = T.useState("disableHoverablePopup"),
      I = T.useState("floatingRootContext"),
      k = T.useState("instantType"),
      F = T.useState("transitionStatus"),
      B = T.useState("hasViewport"),
      z = (0, i.f)({
        anchor: h,
        positionMethod: v,
        floatingRootContext: I,
        mounted: A,
        side: m,
        sideOffset: x,
        align: b,
        alignOffset: y,
        collisionBoundary: S,
        collisionPadding: w,
        sticky: E,
        arrowPadding: _,
        disableAnchorTracking: C,
        keepMounted: D,
        collisionAvoidance: R,
        adaptiveOrigin: B ? u.e : void 0,
      }),
      j = t.useMemo(() => {
        let e = {};
        return (
          (!N || "both" === M || O) && (e.pointerEvents = "none"),
          {
            role: "presentation",
            hidden: !A,
            style: { ...z.positionerStyles, ...e },
          }
        );
      }, [N, M, O, A, z.positionerStyles]),
      $ = t.useMemo(
        () => ({
          open: N,
          side: z.side,
          align: z.align,
          anchorHidden: z.anchorHidden,
          instant: "none" !== M ? "tracking-cursor" : k,
        }),
        [N, z.side, z.align, z.anchorHidden, M, k],
      ),
      L = t.useMemo(
        () => ({
          ...$,
          arrowRef: z.arrowRef,
          arrowStyles: z.arrowStyles,
          arrowUncentered: z.arrowUncentered,
        }),
        [$, z.arrowRef, z.arrowStyles, z.arrowUncentered],
      ),
      H = (0, a.f)("div", e, {
        state: $,
        props: [j, (0, c.f)(F), P],
        ref: [f, T.useStateSetter("positionerElement")],
        stateAttributesMapping: o.E,
      });
    return (0, d.jsx)(r.W.Provider, { value: L, children: H });
  });
  e.s(["TooltipPositioner", 0, f]);
};
