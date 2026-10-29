// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(439587),
    i = e.i(177560),
    a = e.i(426091),
    n = e.i(352386);
  e.i(12692);
  var l = e.i(398902);
  e.i(267146);
  var s = e.i(540805),
    o = e.i(400372),
    c = e.i(445242),
    m = e.i(799500);
  let d = () => {
    let e,
      r,
      i = (0, c.c)(2),
      a = u;
    if (i[0] === Symbol.for("react.memo_cache_sentinel")) {
      e = [];
      for (let t = 0; t < 50; t++) {
        let t = a(0, 360),
          r = a(1, 8) / 10,
          i = Math.random(),
          n = a(10, 50),
          l = a(20, 60),
          s = a(50, 100),
          o = a(50, 100);
        e.push({
          rotation: t,
          speed: r,
          delay: i,
          travel: n,
          hue: l,
          sat: s,
          lit: o,
        });
      }
      i[0] = e;
    } else e = i[0];
    let n = e;
    return (
      i[1] === Symbol.for("react.memo_cache_sentinel")
        ? ((r = (0, t.jsx)("div", {
            className: "pointer-events-none absolute",
            children: (0, t.jsx)("div", {
              className: "absolute left-0 top-0",
              children: n.map(h),
            }),
          })),
          (i[1] = r))
        : (r = i[1]),
      r
    );
  };
  function u(e, t) {
    return Math.floor(Math.random() * (t - e) + 1) + e;
  }
  function h(e, r) {
    return (0, t.jsx)(
      "div",
      {
        className: m.default.spark,
        style: {
          "--rotation": `${e.rotation}deg`,
          "--delay": e.delay,
          "--speed": e.speed,
          "--travel": e.travel,
          "--h": `${e.hue}`,
          "--s": `${e.sat}%`,
          "--l": `${e.lit}%`,
        },
      },
      r,
    );
  }
  let f = n.default.forwardRef(
    (
      {
        volume: e,
        className: c,
        allTimeHighMarketCap: m,
        currentMarketCap: u,
        animationDelay: h = 0,
        showTooltip: f = !0,
        minWidth: x,
        showAllTimeHigh: p = !0,
        ...g
      },
      v,
    ) => {
      let { t: b } = (0, l.f)(),
        y = e > 0 && u > 0 && m > 0,
        [w, j] = (0, n.useState)(!1),
        [N, _] = (0, n.useState)(!1),
        [k, S] = (0, n.useState)(0 === h),
        C = (0, n.useRef)([]),
        T = y && Math.round(u / 1e3) >= Math.round(m / 1e3),
        I = (() => {
          if (!y || !T) return !1;
          let e = Date.now() - 6e4,
            t = C.current.filter((t) => t.time >= e);
          if (t.length < 2) return !1;
          let r = t[0];
          return (m - r.value) / r.value >= 0.005;
        })(),
        M = y && T && I,
        A = (0, n.useRef)([]),
        z = (0, n.useRef)({
          volume: e,
          currentMarketCap: u,
          allTimeHighMarketCap: m,
        }),
        W = (0, n.useRef)(null),
        F = (0, n.useRef)(null),
        R = (0, n.useRef)(null),
        E = (0, n.useRef)(null),
        D = (0, n.useRef)(null),
        P = y ? Math.min((u / m) * 100, 100) : 0;
      ((0, n.useEffect)(() => {
        E.current && D.current && M
          ? ((D.current.style.left = "auto"),
            (D.current.style.right = 100 - P + "%"),
            (D.current.style.top = "0px"),
            (D.current.style.visibility = "visible"))
          : D.current && (D.current.style.visibility = "hidden");
      }, [P, M, w]),
        (0, n.useEffect)(
          () => (
            h > 0 &&
              !k &&
              (R.current && clearTimeout(R.current),
              (R.current = setTimeout(() => {
                S(!0);
              }, 1e3 * h))),
            () => {
              R.current && clearTimeout(R.current);
            }
          ),
          [h, k],
        ),
        (0, n.useEffect)(() => {
          if (!y) return void j(!1);
          let t = () => {
            let t = Date.now();
            A.current.push({ time: t, volume: e });
            let r = t - 6e4;
            if (
              ((A.current = A.current.filter((e) => e.time >= r)),
              A.current.length > 1)
            ) {
              let t = A.current[0];
              _((e - t.volume) / t.volume >= 0.01);
            }
          };
          (t(),
            F.current && clearInterval(F.current),
            (F.current = setInterval(() => {
              t();
            }, 6e4)));
          let r = z.current,
            i =
              r.volume !== e ||
              r.currentMarketCap !== u ||
              r.allTimeHighMarketCap !== m;
          if (
            ((z.current = {
              volume: e,
              currentMarketCap: u,
              allTimeHighMarketCap: m,
            }),
            T)
          ) {
            let e = Date.now();
            C.current.push({ time: e, value: m });
            let t = e - 6e4;
            C.current = C.current.filter((e) => e.time >= t);
          }
          return (
            (i || N || M) &&
              k &&
              (j(!0),
              W.current && clearTimeout(W.current),
              (W.current = setTimeout(() => {
                j(!1);
              }, 6e4))),
            () => {
              (W.current && clearTimeout(W.current),
                F.current && clearInterval(F.current));
            }
          );
        }, [e, u, m, N, M, y, k]),
        (0, n.useEffect)(() => {
          let e = (N || M) && k;
          return (
            e &&
              (j(!0),
              W.current && clearTimeout(W.current),
              (W.current = setTimeout(() => {
                j(!1);
              }, 6e4))),
            () => {
              (W.current && (clearTimeout(W.current), (W.current = null)),
                e && j(!1));
            }
          );
        }, [N, M, k]));
      let G = w && k && (N || M),
        O = G
          ? M
            ? o.default.borderGold
            : o.default.borderGreen
          : T
            ? o.default.borderGold
            : "",
        $ = T
          ? M && w
            ? (0, a.c)(o.default.animatedGradient, o.default.gradientGold)
            : o.default.gradientGold
          : G && N
            ? (0, a.c)(o.default.animatedGradient, o.default.gradientGreen)
            : "bg-bg-accent",
        B = (e) => {
          if (v)
            if ("function" == typeof v) v(e);
            else
              try {
                v.current = e;
              } catch {}
          E.current = e;
        };
      return (0, t.jsx)(t.Fragment, {
        children: f
          ? (0, t.jsxs)(r.W, {
              children: [
                (0, t.jsx)(r._, {
                  render: (0, t.jsxs)("div", {
                    className:
                      "relative flex w-full cursor-help items-center gap-1",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "relative flex-1",
                        children: [
                          (0, t.jsx)(i.F, {
                            ref: B,
                            className: (0, a.c)(
                              "relative h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-bg-quaternary",
                              G && o.default.animateBorderPulse,
                              O,
                              c,
                            ),
                            style: { minWidth: x },
                            ...g,
                            children: (0, t.jsx)(i.S, {
                              className: (0, a.c)(
                                "h-full flex-1 transition-all",
                                $,
                              ),
                              style: {
                                transform: `translateX(-${100 - (P || 0)}%)`,
                              },
                            }),
                          }),
                          (0, t.jsx)("div", {
                            ref: D,
                            className:
                              "pointer-events-none absolute z-10 -translate-x-1/2 transform",
                            style: {
                              right: "0%",
                              top: "-6px",
                              visibility: "hidden",
                            },
                            children: M && w && (0, t.jsx)(d, {}),
                          }),
                        ],
                      }),
                      p &&
                        (0, t.jsxs)("span", {
                          className:
                            "ml-1 whitespace-nowrap text-right text-[8pt] text-white",
                          children: [
                            (0, t.jsx)("span", {
                              className: "pr-[2px]",
                              children: b("web.coin.ath_label"),
                            }),
                            (0, s.l)(m),
                          ],
                        }),
                    ],
                  }),
                }),
                (0, t.jsx)(r.Y, {
                  children: b("web.coin.ath_progress_tooltip"),
                }),
              ],
            })
          : (0, t.jsxs)("div", {
              className: "relative flex w-full items-center gap-1",
              children: [
                (0, t.jsxs)("div", {
                  className: "relative flex-1",
                  children: [
                    (0, t.jsx)(i.F, {
                      ref: B,
                      className: (0, a.c)(
                        "relative h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-bg-quaternary",
                        G && o.default.animateBorderPulse,
                        O,
                        c,
                      ),
                      style: { minWidth: x },
                      ...g,
                      children: (0, t.jsx)(i.S, {
                        className: (0, a.c)("h-full flex-1 transition-all", $),
                        style: { transform: `translateX(-${100 - (P || 0)}%)` },
                      }),
                    }),
                    (0, t.jsx)("div", {
                      ref: D,
                      className:
                        "pointer-events-none absolute z-10 -translate-x-1/2 transform",
                      style: { right: "0%", top: "-6px", visibility: "hidden" },
                      children: M && w && (0, t.jsx)(d, {}),
                    }),
                  ],
                }),
                p &&
                  (0, t.jsxs)("span", {
                    className:
                      "ml-1 whitespace-nowrap text-right font-mono text-[8pt] text-white",
                    children: [
                      (0, t.jsx)("span", {
                        className: "pr-[2px]",
                        children: b("web.coin.ath_label"),
                      }),
                      (0, s.l)(m),
                    ],
                  }),
              ],
            }),
      });
    },
  );
  ((f.displayName = "AllTimeHighProgressBar"),
    e.s(["f", 0, f], 524051),
    e.s([], 690023));
};
