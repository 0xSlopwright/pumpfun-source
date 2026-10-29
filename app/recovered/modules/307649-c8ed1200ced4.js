// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    i = e.i(231332);
  e.i(12692);
  var l = e.i(398902),
    r = e.i(745018),
    a = e.i(844510),
    o = e.i(338319);
  function s(e) {
    let i,
      s,
      d,
      c,
      h,
      u,
      p,
      f,
      x,
      g = (0, n.c)(30),
      {
        side: m,
        targeted: w,
        count: b,
        max: v,
        full: y,
        edgeX: j,
        testId: $,
      } = e,
      { t: z } = (0, l.f)(),
      N = "left" === m ? r.xa : r.Ie;
    g[0] !== m || g[1] !== z
      ? ((i = z(
          "left" === m
            ? "web.screeners.panel_left"
            : "web.screeners.panel_right",
        )),
        (g[0] = m),
        (g[1] = z),
        (g[2] = i))
      : (i = g[2]);
    let k = i;
    g[3] !== b || g[4] !== y || g[5] !== v || g[6] !== k || g[7] !== z
      ? ((s = y
          ? `${z("web.screeners.drag_side_full")} ${b}/${v}`
          : `${k} \xb7 ${b}/${v}`),
        (g[3] = b),
        (g[4] = y),
        (g[5] = v),
        (g[6] = k),
        (g[7] = z),
        (g[8] = s))
      : (s = g[8]);
    let S = s;
    g[9] !== j || g[10] !== m
      ? ((d =
          "left" === m
            ? { left: j + 8 }
            : { right: Math.max(0, window.innerWidth - j) + 8 }),
        (g[9] = j),
        (g[10] = m),
        (g[11] = d))
      : (d = g[11]);
    let X = d,
      P = $ ?? `screeners-pin-tab-${m}`,
      Y = w ? "true" : "false",
      C = y ? "true" : "false";
    g[12] !== X
      ? ((c = {
          ...X,
          width: 40,
          top: "calc(var(--layout-top-offset, 109px) + 12px)",
          bottom: 56,
          animationDelay: "120ms",
          animationFillMode: "both",
        }),
        (g[12] = X),
        (g[13] = c))
      : (c = g[13]);
    let M = a.z[w && !y ? "targeted" : "idle"],
      R = y && "opacity-40";
    return (
      g[14] !== M || g[15] !== R
        ? ((h = (0, o.c)(
            "pointer-events-none fixed z-40 flex animate-in flex-col items-center gap-2 rounded-md border py-3 fade-in duration-150",
            M,
            R,
          )),
          (g[14] = M),
          (g[15] = R),
          (g[16] = h))
        : (h = g[16]),
      g[17] !== N
        ? ((u = (0, t.jsx)(N, { className: "size-4 shrink-0" })),
          (g[17] = N),
          (g[18] = u))
        : (u = g[18]),
      g[19] === Symbol.for("react.memo_cache_sentinel")
        ? ((p = { writingMode: "vertical-rl", transform: "rotate(180deg)" }),
          (g[19] = p))
        : (p = g[19]),
      g[20] !== S
        ? ((f = (0, t.jsx)("span", {
            className: "whitespace-nowrap text-xs font-medium leading-4",
            style: p,
            children: S,
          })),
          (g[20] = S),
          (g[21] = f))
        : (f = g[21]),
      g[22] !== u ||
      g[23] !== f ||
      g[24] !== P ||
      g[25] !== Y ||
      g[26] !== C ||
      g[27] !== c ||
      g[28] !== h
        ? ((x = (0, t.jsxs)("div", {
            "aria-hidden": !0,
            "data-testid": P,
            "data-targeted": Y,
            "data-full": C,
            style: c,
            className: h,
            children: [u, f],
          })),
          (g[22] = u),
          (g[23] = f),
          (g[24] = P),
          (g[25] = Y),
          (g[26] = C),
          (g[27] = c),
          (g[28] = h),
          (g[29] = x))
        : (x = g[29]),
      x
    );
  }
  var d = e.i(352386);
  let c = (e, t) => (e < t / 2 ? "left" : "right"),
    h = (e, t) =>
      e < t.left + 56 ? "left" : e > t.right - 56 ? "right" : "float",
    u = (e, t) => t.filter((t) => t < e).length;
  e.s(["j", 0, 56, "g", 0, u, "W", 0, c, "t", 0, h], 245632);
  let p = (e, t, n) => {
    e.setPointerCapture?.(t);
    let i = () => {
        (document.removeEventListener("pointermove", l),
          document.removeEventListener("pointerup", r),
          document.removeEventListener("pointercancel", a),
          e.removeEventListener("lostpointercapture", a),
          window.removeEventListener("blur", o));
      },
      l = (e) => {
        if (e.pointerId === t) {
          if (0 === e.buttons) {
            (i(), n.onCancel());
            return;
          }
          n.onMove(e);
        }
      },
      r = (e) => {
        e.pointerId === t && (i(), n.onRelease(e));
      },
      a = (e) => {
        e.pointerId === t && (i(), n.onCancel());
      },
      o = () => {
        (i(), n.onCancel());
      };
    return (
      document.addEventListener("pointermove", l),
      document.addEventListener("pointerup", r),
      document.addEventListener("pointercancel", a),
      e.addEventListener("lostpointercapture", a),
      window.addEventListener("blur", o),
      i
    );
  };
  e.s(
    [
      "U",
      0,
      (e) =>
        e && "pointerId" in e && "number" == typeof e.pointerId
          ? e.pointerId
          : null,
      "L",
      0,
      p,
    ],
    721165,
  );
  var f = e.i(743786);
  let x = "--edge-drag-x",
    g = "--edge-drag-y",
    m = "--edge-drag-float-w",
    w = "--edge-drag-float-h",
    b = () => {
      let e =
          "u" < typeof document
            ? null
            : document.querySelector(".pump-main-row"),
        t = e?.getBoundingClientRect();
      return t && 0 !== t.width
        ? { left: t.left, right: t.right }
        : { left: 0, right: window.innerWidth };
    },
    v = ({ side: e, kind: t, excludeId: n }) =>
      [
        ...document.querySelectorAll(
          `[data-widget-side="${e}"] [data-edge-panel="${t}"]`,
        ),
      ]
        .filter((e) => e.getAttribute("data-edge-panel-id") !== n)
        .map((e) => e.getBoundingClientRect()),
    y = (e, t, n, i) => {
      let l = n ? h(e.clientX, i) : c(e.clientX, window.innerWidth);
      if ("float" === l)
        return {
          zone: l,
          side: c(e.clientX, window.innerWidth),
          index: 0,
          slotY: null,
          slotX: 0,
          slotWidth: 0,
        };
      let r = t(l),
        a = u(
          e.clientY,
          r.map((e) => e.top + e.height / 2),
        );
      if (0 === r.length) {
        let e = b();
        return {
          zone: l,
          side: l,
          index: a,
          slotY: null,
          slotX: "left" === l ? e.left + 24 : e.right - 352 - 24,
          slotWidth: 352,
        };
      }
      let o =
        0 === a
          ? r[0].top - 6
          : a >= r.length
            ? r[r.length - 1].bottom + 6
            : (r[a - 1].bottom + r[a].top) / 2;
      return {
        zone: l,
        side: l,
        index: a,
        slotY: o,
        slotX: r[0].x,
        slotWidth: r[0].width,
      };
    };
  e.s(
    [
      "f",
      0,
      x,
      "p",
      0,
      g,
      "j",
      0,
      480,
      "x",
      0,
      360,
      "S",
      0,
      (e, t = "widget") => {
        let n = v({ side: e, kind: t });
        if (0 === n.length) {
          let t = b();
          return {
            zone: e,
            side: e,
            index: 0,
            slotY: null,
            slotX: "left" === e ? t.left + 24 : t.right - 352 - 24,
            slotWidth: 352,
          };
        }
        return {
          zone: e,
          side: e,
          index: 0,
          slotY: n[0].top - 6,
          slotX: n[0].x,
          slotWidth: n[0].width,
        };
      },
      "Z",
      0,
      b,
      "h",
      0,
      function (e) {
        let t,
          i,
          l,
          r = (0, n.c)(12),
          { kind: a, excludeId: o, allowFloat: s, floatSize: c, onDrop: h } = e,
          u = void 0 !== s && s;
        r[0] !== c
          ? ((t = c ?? { w: 360, h: 480 }), (r[0] = c), (r[1] = t))
          : (t = r[1]);
        let j = t,
          [$, z] = (0, d.useState)(null),
          [N, k] = (0, d.useState)(null),
          S = (0, d.useRef)(!1);
        r[2] !== u || r[3] !== o || r[4] !== a || r[5] !== h || r[6] !== j
          ? ((i = (e) => {
              let t;
              if (0 !== e.button) return;
              let n = e.currentTarget;
              S.current = !1;
              let i = e.clientX,
                l = e.clientY,
                r = !1,
                s =
                  ((t = {}),
                  (e) => (t[e] ??= v({ side: e, kind: a, excludeId: o }))),
                d = b(),
                c = { clientX: i, clientY: l },
                $ = 0,
                N = !1,
                X = null,
                P = () => {
                  var e, t;
                  (($ = 0),
                    (e = c.clientX),
                    (t = c.clientY),
                    document.documentElement.style.setProperty(x, `${e}px`),
                    document.documentElement.style.setProperty(g, `${t}px`));
                  let n = y(c, s, u, d);
                  (null === X ||
                    n.zone !== X.zone ||
                    n.index !== X.index ||
                    n.slotY !== X.slotY) &&
                    ((X = n), k(n));
                },
                Y = () => {
                  (_(),
                    window.removeEventListener("keydown", R),
                    $ && cancelAnimationFrame($),
                    (document.body.style.userSelect = ""));
                },
                C = () => {
                  let e;
                  ((e = document.documentElement.style).removeProperty(x),
                    e.removeProperty(g),
                    e.removeProperty(m),
                    e.removeProperty(w),
                    z(null),
                    k(null));
                },
                M = () => {
                  (Y(), C());
                },
                R = (e) => {
                  "Escape" === e.key && (r && (S.current = !0), M());
                },
                _ = p(n, e.pointerId, {
                  onMove: (e) => {
                    if (!r) {
                      if (6 > Math.hypot(e.clientX - i, e.clientY - l)) return;
                      ((r = !0),
                        (S.current = !0),
                        (document.body.style.userSelect = "none"),
                        window.getSelection()?.removeAllRanges());
                    }
                    if (
                      ((c = { clientX: e.clientX, clientY: e.clientY }), !N)
                    ) {
                      ((N = !0),
                        document.documentElement.style.setProperty(
                          m,
                          `${j.w}px`,
                        ),
                        document.documentElement.style.setProperty(
                          w,
                          `${j.h}px`,
                        ),
                        z({ x: c.clientX, y: c.clientY }),
                        P());
                      return;
                    }
                    $ || ($ = requestAnimationFrame(P));
                  },
                  onRelease: (e) => {
                    let t, n;
                    if ((Y(), !r)) return void C();
                    let i = y(
                        { clientX: e.clientX, clientY: e.clientY },
                        s,
                        u,
                        d,
                      ),
                      l = (0, f._)(C);
                    (h({
                      zone: i.zone,
                      side: i.side,
                      index: i.index,
                      floatRect:
                        "float" === i.zone
                          ? ((t = e.clientX),
                            (n = e.clientY),
                            {
                              x: Math.max(
                                8,
                                Math.min(t - 48, window.innerWidth - j.w - 8),
                              ),
                              y: Math.max(
                                8,
                                Math.min(n - 16, window.innerHeight - j.h - 48),
                              ),
                              w: j.w,
                              h: j.h,
                            })
                          : void 0,
                      clientX: e.clientX,
                      clientY: e.clientY,
                    }),
                      l());
                  },
                  onCancel: M,
                });
              window.addEventListener("keydown", R);
            }),
            (r[2] = u),
            (r[3] = o),
            (r[4] = a),
            (r[5] = h),
            (r[6] = j),
            (r[7] = i))
          : (i = r[7]);
        let X = i;
        return (
          r[8] !== $ || r[9] !== X || r[10] !== N
            ? ((l = {
                ghost: $,
                hover: N,
                didDragRef: S,
                handlePointerDown: X,
              }),
              (r[8] = $),
              (r[9] = X),
              (r[10] = N),
              (r[11] = l))
            : (l = r[11]),
          l
        );
      },
    ],
    200478,
  );
  var j = e.i(116549),
    $ = e.i(606178),
    z = e.i(360827),
    N = e.i(634661),
    k = e.i(994112),
    S = e.i(45329);
  function X(e) {
    return e.widgets;
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let r,
          d,
          c,
          h,
          u,
          p,
          f = (0, n.c)(26),
          {
            ghost: x,
            hover: g,
            label: m,
            variant: w,
            excludeWidgetId: v,
            sideState: y,
          } = e,
          { t: P } = (0, l.f)(),
          Y = (0, j.x)(),
          C = (0, S.V)(X);
        if (!x || !g) return null;
        let M = "ride" === (void 0 === w ? "ghost" : w),
          R = "left" === g.zone || "right" === g.zone ? g.zone : null;
        f[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((r = b()), (f[0] = r))
          : (r = f[0]);
        let _ = r;
        f[1] !== v || f[2] !== y || f[3] !== C
          ? ((d = (e) => {
              if (y) return y[e];
              let t = C.filter(
                (t) => t.side === e && !t.float && t.id !== v,
              ).length;
              return { count: t, full: t >= k._ };
            }),
            (f[1] = v),
            (f[2] = y),
            (f[3] = C),
            (f[4] = d))
          : (d = f[4]);
        let L = d;
        return (
          f[5] !== L || f[6] !== R
            ? ((c = ["left", "right"].map((e) => {
                let n = L(e);
                return (0, t.jsx)(
                  s,
                  {
                    side: e,
                    targeted: R === e,
                    count: n.count,
                    max: k._,
                    full: n.full,
                    edgeX: "left" === e ? _.left : _.right,
                    testId: `screeners-dock-band-${e}`,
                  },
                  e,
                );
              })),
              (f[5] = L),
              (f[6] = R),
              (f[7] = c))
            : (c = f[7]),
          f[8] !== Y ||
          f[9] !== g.slotWidth ||
          f[10] !== g.slotX ||
          f[11] !== g.slotY ||
          f[12] !== g.zone ||
          f[13] !== m ||
          f[14] !== M
            ? ((h =
                null === g.slotY || "float" === g.zone
                  ? "float" === g.zone && M
                    ? null
                    : (0, t.jsx)("div", {
                        "aria-hidden": !0,
                        "data-testid":
                          "float" === g.zone
                            ? "screeners-edge-float-preview"
                            : "screeners-edge-drop-placeholder",
                        className: (0, o.c)(
                          "pointer-events-none fixed z-40 animate-in overflow-hidden rounded-xl border bg-bg-primary shadow-lg transition-none fade-in zoom-in-95 duration-150",
                          "float" === g.zone
                            ? "border-solid border-border-tertiary"
                            : "border-dashed border-text-accent/50",
                        ),
                        style:
                          "float" === g.zone
                            ? {
                                left: "clamp(8px, calc(var(--edge-drag-x, -999px) - 48px), calc(100vw - var(--edge-drag-float-w, 360px) - 8px))",
                                top: "clamp(8px, calc(var(--edge-drag-y, -999px) - 16px), calc(100dvh - var(--edge-drag-float-h, 480px) - 48px))",
                                width: "var(--edge-drag-float-w, 360px)",
                                height: "var(--edge-drag-float-h, 480px)",
                              }
                            : {
                                left: g.slotX,
                                width: g.slotWidth,
                                top: "calc(var(--layout-top-offset, 109px) + 12px)",
                                bottom: 56,
                              },
                        children: (0, t.jsx)("div", {
                          className: (0, o.c)(N.t, N.F[Y], $.U[Y]),
                          children: (0, t.jsx)("span", {
                            className: N.s[Y],
                            children: m,
                          }),
                        }),
                      })
                  : (0, t.jsxs)("div", {
                      "aria-hidden": !0,
                      "data-testid": "screeners-edge-drop-slot",
                      className: (0, o.c)(
                        "pointer-events-none fixed z-40 h-0.5 animate-in rounded-full fade-in zoom-in-95 duration-150",
                        a.Z,
                      ),
                      style: {
                        left: g.slotX,
                        width: g.slotWidth,
                        top: g.slotY,
                      },
                      children: [
                        (0, t.jsx)("span", {
                          className: (0, o.c)(a.g, "-left-1 -top-1"),
                        }),
                        (0, t.jsx)("span", {
                          className: (0, o.c)(a.g, "-right-1 -top-1"),
                        }),
                      ],
                    })),
              (f[8] = Y),
              (f[9] = g.slotWidth),
              (f[10] = g.slotX),
              (f[11] = g.slotY),
              (f[12] = g.zone),
              (f[13] = m),
              (f[14] = M),
              (f[15] = h))
            : (h = f[15]),
          f[16] !== x ||
          f[17] !== g.zone ||
          f[18] !== m ||
          f[19] !== M ||
          f[20] !== P
            ? ((u = M
                ? null
                : (0, t.jsxs)("div", {
                    "data-testid": "screeners-edge-drag-ghost",
                    className: (0, o.c)(
                      "pointer-events-none fixed z-50 flex h-7 -translate-x-1/2 -translate-y-full items-center gap-2 px-2.5 will-change-[left,top]",
                      z.V,
                    ),
                    style: {
                      left: `var(--edge-drag-x, ${x.x}px)`,
                      top: `calc(var(--edge-drag-y, ${x.y}px) - 10px)`,
                    },
                    children: [
                      (0, t.jsx)("span", {
                        className:
                          "whitespace-nowrap text-xs font-medium leading-4 text-text-primary",
                        children: m,
                      }),
                      "float" === g.zone
                        ? (0, t.jsx)("span", {
                            className:
                              "whitespace-nowrap text-xs font-medium leading-4 text-text-accent",
                            children: P("web.screeners.float_here"),
                          })
                        : null,
                    ],
                  })),
              (f[16] = x),
              (f[17] = g.zone),
              (f[18] = m),
              (f[19] = M),
              (f[20] = P),
              (f[21] = u))
            : (u = f[21]),
          f[22] !== c || f[23] !== h || f[24] !== u
            ? ((p = (0, i.createPortal)(
                (0, t.jsxs)(t.Fragment, { children: [c, h, u] }),
                document.body,
              )),
              (f[22] = c),
              (f[23] = h),
              (f[24] = u),
              (f[25] = p))
            : (p = f[25]),
          p
        );
      },
    ],
    307649,
  );
  let P = {
      green: "text-gain",
      blue: "text-sky-300",
      purple: "text-violet-300",
      amber: "text-amber-300",
      rose: "text-rose-300",
      cyan: "text-cyan-300",
    },
    Y = {
      green: "bg-gain/60",
      blue: "bg-sky-300/60",
      purple: "bg-violet-300/60",
      amber: "bg-amber-300/60",
      rose: "bg-rose-300/60",
      cyan: "bg-cyan-300/60",
    };
  e.s(
    [
      "m",
      0,
      {
        green: "bg-gain",
        blue: "bg-sky-300",
        purple: "bg-violet-300",
        amber: "bg-amber-300",
        rose: "bg-rose-300",
        cyan: "bg-cyan-300",
      },
      "B",
      0,
      (e) => (e.accent ? Y[e.accent] : null),
      "y",
      0,
      (e) => (e.accent ? P[e.accent] : "text-text-tertiary"),
    ],
    493607,
  );
};
