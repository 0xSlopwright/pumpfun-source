// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(439587),
    a = e.i(177560),
    l = e.i(426091),
    n = e.i(352386);
  e.i(12692);
  var i = e.i(398902);
  e.i(267146);
  var s = e.i(540805),
    o = e.i(400372),
    c = e.i(445242),
    d = e.i(799500);
  let u = () => {
    let e,
      r,
      a = (0, c.c)(2),
      l = m;
    if (a[0] === Symbol.for("react.memo_cache_sentinel")) {
      e = [];
      for (let t = 0; t < 50; t++) {
        let t = l(0, 360),
          r = l(1, 8) / 10,
          a = Math.random(),
          n = l(10, 50),
          i = l(20, 60),
          s = l(50, 100),
          o = l(50, 100);
        e.push({
          rotation: t,
          speed: r,
          delay: a,
          travel: n,
          hue: i,
          sat: s,
          lit: o,
        });
      }
      a[0] = e;
    } else e = a[0];
    let n = e;
    return (
      a[1] === Symbol.for("react.memo_cache_sentinel")
        ? ((r = (0, t.jsx)("div", {
            className: "pointer-events-none absolute",
            children: (0, t.jsx)("div", {
              className: "absolute left-0 top-0",
              children: n.map(h),
            }),
          })),
          (a[1] = r))
        : (r = a[1]),
      r
    );
  };
  function m(e, t) {
    return Math.floor(Math.random() * (t - e) + 1) + e;
  }
  function h(e, r) {
    return (0, t.jsx)(
      "div",
      {
        className: d.default.spark,
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
        allTimeHighMarketCap: d,
        currentMarketCap: m,
        animationDelay: h = 0,
        showTooltip: f = !0,
        minWidth: x,
        showAllTimeHigh: p = !0,
        ...v
      },
      b,
    ) => {
      let { t: g } = (0, i.f)(),
        y = e > 0 && m > 0 && d > 0,
        [j, N] = (0, n.useState)(!1),
        [w, k] = (0, n.useState)(!1),
        [_, C] = (0, n.useState)(0 === h),
        S = (0, n.useRef)([]),
        T = y && Math.round(m / 1e3) >= Math.round(d / 1e3),
        I = (() => {
          if (!y || !T) return !1;
          let e = Date.now() - 6e4,
            t = S.current.filter((t) => t.time >= e);
          if (t.length < 2) return !1;
          let r = t[0];
          return (d - r.value) / r.value >= 0.005;
        })(),
        G = y && T && I,
        R = (0, n.useRef)([]),
        F = (0, n.useRef)({
          volume: e,
          currentMarketCap: m,
          allTimeHighMarketCap: d,
        }),
        P = (0, n.useRef)(null),
        E = (0, n.useRef)(null),
        M = (0, n.useRef)(null),
        D = (0, n.useRef)(null),
        B = (0, n.useRef)(null),
        O = y ? Math.min((m / d) * 100, 100) : 0;
      ((0, n.useEffect)(() => {
        D.current && B.current && G
          ? ((B.current.style.left = "auto"),
            (B.current.style.right = 100 - O + "%"),
            (B.current.style.top = "0px"),
            (B.current.style.visibility = "visible"))
          : B.current && (B.current.style.visibility = "hidden");
      }, [O, G, j]),
        (0, n.useEffect)(
          () => (
            h > 0 &&
              !_ &&
              (M.current && clearTimeout(M.current),
              (M.current = setTimeout(() => {
                C(!0);
              }, 1e3 * h))),
            () => {
              M.current && clearTimeout(M.current);
            }
          ),
          [h, _],
        ),
        (0, n.useEffect)(() => {
          if (!y) return void N(!1);
          let t = () => {
            let t = Date.now();
            R.current.push({ time: t, volume: e });
            let r = t - 6e4;
            if (
              ((R.current = R.current.filter((e) => e.time >= r)),
              R.current.length > 1)
            ) {
              let t = R.current[0];
              k((e - t.volume) / t.volume >= 0.01);
            }
          };
          (t(),
            E.current && clearInterval(E.current),
            (E.current = setInterval(() => {
              t();
            }, 6e4)));
          let r = F.current,
            a =
              r.volume !== e ||
              r.currentMarketCap !== m ||
              r.allTimeHighMarketCap !== d;
          if (
            ((F.current = {
              volume: e,
              currentMarketCap: m,
              allTimeHighMarketCap: d,
            }),
            T)
          ) {
            let e = Date.now();
            S.current.push({ time: e, value: d });
            let t = e - 6e4;
            S.current = S.current.filter((e) => e.time >= t);
          }
          return (
            (a || w || G) &&
              _ &&
              (N(!0),
              P.current && clearTimeout(P.current),
              (P.current = setTimeout(() => {
                N(!1);
              }, 6e4))),
            () => {
              (P.current && clearTimeout(P.current),
                E.current && clearInterval(E.current));
            }
          );
        }, [e, m, d, w, G, y, _]),
        (0, n.useEffect)(() => {
          let e = (w || G) && _;
          return (
            e &&
              (N(!0),
              P.current && clearTimeout(P.current),
              (P.current = setTimeout(() => {
                N(!1);
              }, 6e4))),
            () => {
              (P.current && (clearTimeout(P.current), (P.current = null)),
                e && N(!1));
            }
          );
        }, [w, G, _]));
      let $ = j && _ && (w || G),
        A = $
          ? G
            ? o.default.borderGold
            : o.default.borderGreen
          : T
            ? o.default.borderGold
            : "",
        U = T
          ? G && j
            ? (0, l.c)(o.default.animatedGradient, o.default.gradientGold)
            : o.default.gradientGold
          : $ && w
            ? (0, l.c)(o.default.animatedGradient, o.default.gradientGreen)
            : "bg-bg-accent",
        q = (e) => {
          if (b)
            if ("function" == typeof b) b(e);
            else
              try {
                b.current = e;
              } catch {}
          D.current = e;
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
                          (0, t.jsx)(a.F, {
                            ref: q,
                            className: (0, l.c)(
                              "relative h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-bg-quaternary",
                              $ && o.default.animateBorderPulse,
                              A,
                              c,
                            ),
                            style: { minWidth: x },
                            ...v,
                            children: (0, t.jsx)(a.S, {
                              className: (0, l.c)(
                                "h-full flex-1 transition-all",
                                U,
                              ),
                              style: {
                                transform: `translateX(-${100 - (O || 0)}%)`,
                              },
                            }),
                          }),
                          (0, t.jsx)("div", {
                            ref: B,
                            className:
                              "pointer-events-none absolute z-10 -translate-x-1/2 transform",
                            style: {
                              right: "0%",
                              top: "-6px",
                              visibility: "hidden",
                            },
                            children: G && j && (0, t.jsx)(u, {}),
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
                              children: g("web.coin.ath_label"),
                            }),
                            (0, s.l)(d),
                          ],
                        }),
                    ],
                  }),
                }),
                (0, t.jsx)(r.Y, {
                  children: g("web.coin.ath_progress_tooltip"),
                }),
              ],
            })
          : (0, t.jsxs)("div", {
              className: "relative flex w-full items-center gap-1",
              children: [
                (0, t.jsxs)("div", {
                  className: "relative flex-1",
                  children: [
                    (0, t.jsx)(a.F, {
                      ref: q,
                      className: (0, l.c)(
                        "relative h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-bg-quaternary",
                        $ && o.default.animateBorderPulse,
                        A,
                        c,
                      ),
                      style: { minWidth: x },
                      ...v,
                      children: (0, t.jsx)(a.S, {
                        className: (0, l.c)("h-full flex-1 transition-all", U),
                        style: { transform: `translateX(-${100 - (O || 0)}%)` },
                      }),
                    }),
                    (0, t.jsx)("div", {
                      ref: B,
                      className:
                        "pointer-events-none absolute z-10 -translate-x-1/2 transform",
                      style: { right: "0%", top: "-6px", visibility: "hidden" },
                      children: G && j && (0, t.jsx)(u, {}),
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
                        children: g("web.coin.ath_label"),
                      }),
                      (0, s.l)(d),
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
