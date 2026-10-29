// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    s = e.i(445242),
    r = e.i(157633),
    l = e.i(745018),
    a = e.i(534061),
    i = e.i(426091),
    n = e.i(517770),
    o = e.i(789022),
    c = e.i(907484),
    d = e.i(352386);
  e.i(12692);
  var u = e.i(398902),
    m = e.i(412427),
    p = e.i(845785),
    h = e.i(855376),
    f = e.i(827935),
    g = e.i(254667),
    b = e.i(886813),
    y = e.i(77962);
  let v = "jg777hurg3m5612bf57uirt9k";
  var x = e.i(113939),
    j = e.i(267350),
    k = e.i(338319);
  let N = (e) => {
    try {
      f.F.destroyMonitor(e);
    } catch {}
  };
  var z = d;
  let w = (e) =>
    e instanceof Error &&
    e.message.includes("Cannot destructure property 'loader'") &&
    e.message.includes("$state");
  class _ extends z.Component {
    state = { hasError: !1, canRetry: !1, isVidstackError: !1 };
    retryFrame = null;
    static getDerivedStateFromError(e) {
      return { hasError: !0, canRetry: !1, isVidstackError: w(e) };
    }
    componentDidCatch(e, t) {
      w(e)
        ? (this.retryFrame = requestAnimationFrame(() => {
            ((this.retryFrame = null),
              this.setState((e) => ({ ...e, canRetry: !0 })));
          }))
        : this.props.onError?.();
    }
    componentWillUnmount() {
      null !== this.retryFrame &&
        (cancelAnimationFrame(this.retryFrame), (this.retryFrame = null));
    }
    render() {
      return this.state.hasError
        ? this.state.isVidstackError
          ? this.state.canRetry
            ? this.props.children
            : null
          : (this.props.fallback ?? null)
        : this.props.children;
    }
  }
  var S = e.i(271373);
  let P = (e) => {
      let r,
        l,
        a,
        i,
        n,
        o = (0, s.c)(20);
      o[0] !== e ? ((r = T(e)), (o[0] = e), (o[1] = r)) : (r = o[1]);
      let { playerSrc: c, sourceKey: u } = r,
        [m, p] = (0, d.useState)(null),
        [h, f] = (0, d.useState)(u);
      u !== h && (f(u), p(null));
      let g = m === u;
      o[2] !== e || o[3] !== u
        ? ((l = () => {
            (p(u), e.onError?.());
          }),
          (o[2] = e),
          (o[3] = u),
          (o[4] = l))
        : (l = o[4]);
      let b = l;
      if (g) {
        let s;
        return (
          o[5] !== e.className || o[6] !== e.src
            ? ((s = (0, t.jsx)(I, { className: e.className, src: e.src })),
              (o[5] = e.className),
              (o[6] = e.src),
              (o[7] = s))
            : (s = o[7]),
          s
        );
      }
      return (
        o[8] !== e.className || o[9] !== e.src
          ? ((a = (0, t.jsx)(I, { className: e.className, src: e.src })),
            (o[8] = e.className),
            (o[9] = e.src),
            (o[10] = a))
          : (a = o[10]),
        o[11] !== b || o[12] !== c || o[13] !== e
          ? ((i = (0, t.jsx)(E, { ...e, onError: b, playerSrc: c })),
            (o[11] = b),
            (o[12] = c),
            (o[13] = e),
            (o[14] = i))
          : (i = o[14]),
        o[15] !== b || o[16] !== u || o[17] !== a || o[18] !== i
          ? ((n = (0, t.jsx)(_, { fallback: a, onError: b, children: i }, u)),
            (o[15] = b),
            (o[16] = u),
            (o[17] = a),
            (o[18] = i),
            (o[19] = n))
          : (n = o[19]),
        n
      );
    },
    T = ({ src: e, sourceType: t, sources: s }) => {
      let r = [];
      for (let e of s ?? []) {
        if (0 === e.src.length) continue;
        let t = (0, S.g)({ src: e.src, mimeType: e.mimeType });
        r.push({ src: e.src, ...(t ? { type: t } : {}) });
      }
      if (r.length > 0) return { playerSrc: r, sourceKey: JSON.stringify(r) };
      let l = (0, S.g)({ src: e, mimeType: t }),
        a = { src: e, ...(l ? { type: l } : {}) };
      return { playerSrc: l ? [a] : e, sourceKey: JSON.stringify([a]) };
    },
    I = (e) => {
      let r,
        a,
        n,
        o,
        c,
        d,
        m,
        p = (0, s.c)(16),
        { src: h, className: f } = e,
        { t: g } = (0, u.f)();
      return (
        p[0] !== f
          ? ((r = (0, i.c)(
              "flex aspect-video w-full flex-col items-center justify-center gap-2 bg-bg-tertiary p-3 text-center",
              f,
            )),
            (p[0] = f),
            (p[1] = r))
          : (r = p[1]),
        p[2] !== g
          ? ((a = g("web.bounties.video_cant_play")), (p[2] = g), (p[3] = a))
          : (a = p[3]),
        p[4] !== a
          ? ((n = (0, t.jsx)("p", {
              className: "text-xs text-text-tertiary",
              children: a,
            })),
            (p[4] = a),
            (p[5] = n))
          : (n = p[5]),
        p[6] !== g
          ? ((o = g("web.bounties.open_video")), (p[6] = g), (p[7] = o))
          : (o = p[7]),
        p[8] === Symbol.for("react.memo_cache_sentinel")
          ? ((c = (0, t.jsx)(l.q4, { className: "h-3 w-3" })), (p[8] = c))
          : (c = p[8]),
        p[9] !== h || p[10] !== o
          ? ((d = (0, t.jsxs)("a", {
              className:
                "pointer-events-auto inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-black/70",
              href: h,
              onClick: R,
              rel: "noreferrer",
              target: "_blank",
              children: [o, c],
            })),
            (p[9] = h),
            (p[10] = o),
            (p[11] = d))
          : (d = p[11]),
        p[12] !== r || p[13] !== n || p[14] !== d
          ? ((m = (0, t.jsxs)("div", { className: r, children: [n, d] })),
            (p[12] = r),
            (p[13] = n),
            (p[14] = d),
            (p[15] = m))
          : (m = p[15]),
        m
      );
    },
    E = (e) => {
      let r,
        l,
        c,
        u,
        z,
        w,
        _,
        S = (0, s.c)(34),
        {
          className: P,
          mediaClassName: T,
          controls: I,
          maxHeight: E,
          onError: C,
          onCanPlay: U,
          onPlay: R,
          autoPlay: q,
          loop: B,
          muted: L,
          playsInline: A,
          preload: O,
          load: M,
          posterLoad: V,
          poster: J,
          posterAlt: K,
          controlsVisibility: D,
          controlsLayout: W,
          playerSrc: $,
          muxAnalytics: Y,
        } = e,
        G = void 0 === I || I,
        Q = void 0 === A || A,
        X = void 0 === O ? "metadata" : O,
        Z = void 0 === K ? "" : K,
        H = void 0 === D ? "always" : D,
        ee = void 0 === W ? "default" : W,
        et = ((e) => {
          let t,
            r,
            l,
            a = (0, s.c)(4),
            i = (0, d.useRef)(null);
          a[0] !== e
            ? ((t = (t, s) => {
                if (
                  !e ||
                  !v ||
                  (i.current && (N(i.current), (i.current = null)),
                  !(0, y.UF)(t) && !(0, y.G4)(t))
                )
                  return;
                let r = t.video;
                i.current = r;
                let l = (0, k.e)() ?? m.J.ANONYMOUS;
                var a = {
                  debug: !1,
                  data: (() => {
                    try {
                      return x.f.getInstance();
                    } catch {
                      return x.f.init({ appName: p.v.PUMP_WEB });
                    }
                  })().build(p.$.Vod, p.J.VIDSTACK, {
                    envKey: v,
                    videoId: e.videoId,
                    videoTitle: e.videoTitle,
                    mintId: e.associatedCoinMint ?? e.bountyId,
                    creatorId: e.creatorId,
                    creatorCcUserId: e.creatorCcUserId,
                    viewerId: l,
                    viewerCcUserId: (0, k.Q)(),
                    sessionId: (0, j.d)(),
                    participantRole: m.E.PARTICIPANT,
                    page: e.page,
                    playerName: e.playerName,
                    experimentName: null,
                    property: h.f.PUMP_WEB,
                    deviceId: (0, b.$)() ?? "",
                  }),
                };
                try {
                  f.F.monitor(r, a);
                } catch (e) {
                  g.y.warn(
                    "[BountyMuxAnalytics] Mux monitor failed (analytics blocked?)",
                    { error: e instanceof Error ? e.message : String(e) },
                  );
                }
              }),
              (a[0] = e),
              (a[1] = t))
            : (t = a[1]);
          let n = t;
          if (
            (a[2] === Symbol.for("react.memo_cache_sentinel")
              ? ((r = () => () => {
                  i.current && (N(i.current), (i.current = null));
                }),
                (l = []),
                (a[2] = r),
                (a[3] = l))
              : ((r = a[2]), (l = a[3])),
            (0, d.useEffect)(r, l),
            e && v)
          )
            return n;
        })(Y);
      S[0] !== E
        ? ((r = {
            ...(E ? { maxHeight: E } : {}),
            "--media-slider-thumb-size": "10px",
            "--media-slider-track-height": "3px",
          }),
          (S[0] = E),
          (S[1] = r))
        : (r = S[1]);
      let es = r;
      S[2] !== T
        ? ((l = (0, i.c)(
            "h-full w-full [&>video]:h-full [&>video]:w-full",
            T,
            T?.includes("object-cover") && "[&>video]:object-cover",
            T?.includes("object-contain") && "[&>video]:object-contain",
            T?.includes("object-fill") && "[&>video]:object-fill",
            T?.includes("object-none") && "[&>video]:object-none",
            T?.includes("object-scale-down") && "[&>video]:object-scale-down",
          )),
          (S[2] = T),
          (S[3] = l))
        : (l = S[3]);
      let er = l,
        el = T?.includes("object-contain")
          ? "object-contain [&_img]:object-contain"
          : "object-cover [&_img]:object-cover";
      return (
        S[4] !== P
          ? ((c = (0, i.c)("group/bounty-video flex aspect-video w-full", P)),
            (S[4] = P),
            (S[5] = c))
          : (c = S[5]),
        S[6] !== er
          ? ((u = (0, t.jsx)(o.s, { className: er })), (S[6] = er), (S[7] = u))
          : (u = S[7]),
        S[8] !== J || S[9] !== Z || S[10] !== el
          ? ((z = J
              ? (0, t.jsx)(o.n, {
                  alt: Z,
                  className: (0, i.c)(
                    "pointer-events-none absolute inset-0 z-0 h-full w-full bg-bg-tertiary opacity-0 transition-opacity duration-200 data-[visible]:opacity-100 [&_img]:h-full [&_img]:w-full",
                    el,
                  ),
                  src: J,
                })
              : null),
            (S[8] = J),
            (S[9] = Z),
            (S[10] = el),
            (S[11] = z))
          : (z = S[11]),
        S[12] !== G || S[13] !== ee || S[14] !== H
          ? ((w = G
              ? (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsx)(n.R, {
                      action: "toggle:paused",
                      className: "absolute inset-0 z-0 block h-full w-full",
                      event: "pointerup",
                    }),
                    (0, t.jsx)(n.R, {
                      action: "toggle:fullscreen",
                      className:
                        "absolute inset-0 z-0 hidden h-full w-full md:block",
                      event: "dblpointerup",
                    }),
                    (0, t.jsx)(F, {
                      controlsLayout: ee,
                      controlsVisibility: H,
                    }),
                  ],
                })
              : null),
            (S[12] = G),
            (S[13] = ee),
            (S[14] = H),
            (S[15] = w))
          : (w = S[15]),
        S[16] !== q ||
        S[17] !== M ||
        S[18] !== B ||
        S[19] !== L ||
        S[20] !== U ||
        S[21] !== C ||
        S[22] !== et ||
        S[23] !== R ||
        S[24] !== $ ||
        S[25] !== es ||
        S[26] !== Q ||
        S[27] !== V ||
        S[28] !== X ||
        S[29] !== u ||
        S[30] !== z ||
        S[31] !== w ||
        S[32] !== c
          ? ((_ = (0, t.jsxs)(o.O, {
              autoPlay: q,
              className: c,
              load: M,
              loop: B,
              muted: L,
              onCanPlay: U,
              onError: C,
              onPlay: R,
              onProviderChange: a.f,
              onProviderSetup: et,
              playsInline: Q,
              posterLoad: V,
              preload: X,
              src: $,
              style: es,
              children: [u, z, w],
            })),
            (S[16] = q),
            (S[17] = M),
            (S[18] = B),
            (S[19] = L),
            (S[20] = U),
            (S[21] = C),
            (S[22] = et),
            (S[23] = R),
            (S[24] = $),
            (S[25] = es),
            (S[26] = Q),
            (S[27] = V),
            (S[28] = X),
            (S[29] = u),
            (S[30] = z),
            (S[31] = w),
            (S[32] = c),
            (S[33] = _))
          : (_ = S[33]),
        _
      );
    },
    C =
      "group pointer-events-auto inline-flex size-7 items-center justify-center rounded-md bg-black/55 text-white transition-colors hover:bg-black/70",
    U =
      "group pointer-events-auto inline-flex size-6 items-center justify-center rounded-full text-white transition-colors hover:bg-bg-quaternary",
    F = (e) => {
      let l,
        a,
        o,
        d,
        u,
        m,
        p = (0, s.c)(20),
        { controlsLayout: h, controlsVisibility: f } = e,
        g =
          "hover" === f
            ? "opacity-0 transition-opacity duration-150 group-hover/bounty-video:opacity-100 group-focus-within/bounty-video:opacity-100"
            : "";
      if ("compact" === h) {
        let e, s, l, a;
        return (
          p[0] !== g
            ? ((e = (0, i.c)(
                "pointer-events-none absolute bottom-2.5 right-2.5 z-10",
                g,
              )),
              (p[0] = g),
              (p[1] = e))
            : (e = p[1]),
          p[2] === Symbol.for("react.memo_cache_sentinel")
            ? ((s = (0, t.jsxs)(n.x, {
                className: U,
                children: [
                  (0, t.jsx)(r.qJ, {
                    className:
                      "hidden size-3 group-data-[paused]:block group-data-[ended]:hidden",
                    size: 12,
                  }),
                  (0, t.jsx)(r.kl, {
                    className:
                      "size-3 group-data-[paused]:hidden group-data-[ended]:hidden",
                    size: 12,
                  }),
                  (0, t.jsx)(r.B4, {
                    className: "hidden size-3 group-data-[ended]:block",
                    size: 12,
                  }),
                ],
              })),
              (p[2] = s))
            : (s = p[2]),
          p[3] === Symbol.for("react.memo_cache_sentinel")
            ? ((l = (0, t.jsxs)("div", {
                className:
                  "flex items-center gap-0.5 rounded-full bg-black/50 px-0.5 py-0.5 backdrop-blur-sm",
                children: [
                  s,
                  (0, t.jsxs)(n.L, {
                    className: U,
                    children: [
                      (0, t.jsx)(r.kg, {
                        className:
                          "hidden size-3 group-data-[state='muted']:block",
                        size: 12,
                      }),
                      (0, t.jsx)(r.vj, {
                        className:
                          "hidden size-3 group-data-[state='low']:block",
                        size: 12,
                      }),
                      (0, t.jsx)(r.e, {
                        className:
                          "hidden size-3 group-data-[state='high']:block",
                        size: 12,
                      }),
                    ],
                  }),
                ],
              })),
              (p[3] = l))
            : (l = p[3]),
          p[4] !== e
            ? ((a = (0, t.jsx)("div", { className: e, children: l })),
              (p[4] = e),
              (p[5] = a))
            : (a = p[5]),
          a
        );
      }
      if ("minimal" === h) {
        let e, s, l, a;
        return (
          p[6] !== g
            ? ((e = (0, i.c)(
                "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6",
                g,
              )),
              (p[6] = g),
              (p[7] = e))
            : (e = p[7]),
          p[8] === Symbol.for("react.memo_cache_sentinel")
            ? ((s = (0, t.jsxs)(n.x, {
                className: C,
                children: [
                  (0, t.jsx)(r.qJ, {
                    className:
                      "hidden size-3.5 group-data-[paused]:block group-data-[ended]:hidden",
                    size: 14,
                  }),
                  (0, t.jsx)(r.kl, {
                    className:
                      "size-3.5 group-data-[paused]:hidden group-data-[ended]:hidden",
                    size: 14,
                  }),
                  (0, t.jsx)(r.B4, {
                    className: "hidden size-3.5 group-data-[ended]:block",
                    size: 14,
                  }),
                ],
              })),
              (p[8] = s))
            : (s = p[8]),
          p[9] === Symbol.for("react.memo_cache_sentinel")
            ? ((l = (0, t.jsxs)("div", {
                className: "flex items-center gap-1.5",
                children: [
                  s,
                  (0, t.jsxs)(n.L, {
                    className: C,
                    children: [
                      (0, t.jsx)(r.kg, {
                        className:
                          "hidden size-3.5 group-data-[state='muted']:block",
                        size: 14,
                      }),
                      (0, t.jsx)(r.vj, {
                        className:
                          "hidden size-3.5 group-data-[state='low']:block",
                        size: 14,
                      }),
                      (0, t.jsx)(r.e, {
                        className:
                          "hidden size-3.5 group-data-[state='high']:block",
                        size: 14,
                      }),
                    ],
                  }),
                ],
              })),
              (p[9] = l))
            : (l = p[9]),
          p[10] !== e
            ? ((a = (0, t.jsx)("div", { className: e, children: l })),
              (p[10] = e),
              (p[11] = a))
            : (a = p[11]),
          a
        );
      }
      return (
        p[12] !== g
          ? ((l = (0, i.c)(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-black/75 via-black/45 to-transparent px-2 pb-2 pt-4",
              g,
            )),
            (p[12] = g),
            (p[13] = l))
          : (l = p[13]),
        p[14] === Symbol.for("react.memo_cache_sentinel")
          ? ((a = (0, t.jsxs)(c.f.Root, {
              className:
                "group pointer-events-auto relative inline-flex h-5 w-full cursor-pointer touch-none select-none items-center outline-none",
              children: [
                (0, t.jsxs)(c.f.Track, {
                  className: "relative h-[3px] w-full rounded-full bg-white/35",
                  children: [
                    (0, t.jsx)(c.f.TrackFill, {
                      className:
                        "absolute h-full w-[var(--slider-fill)] rounded-full bg-white will-change-[width]",
                    }),
                    (0, t.jsx)(c.f.Progress, {
                      className:
                        "absolute h-full w-[var(--slider-progress)] rounded-full bg-white/45 will-change-[width]",
                    }),
                  ],
                }),
                (0, t.jsx)(c.f.Thumb, {
                  className:
                    "absolute left-[var(--slider-fill)] top-1/2 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-white opacity-100 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] will-change-[left]",
                }),
              ],
            })),
            (p[14] = a))
          : (a = p[14]),
        p[15] === Symbol.for("react.memo_cache_sentinel")
          ? ((o = (0, t.jsxs)(n.x, {
              className: C,
              children: [
                (0, t.jsx)(r.qJ, {
                  className:
                    "hidden size-3.5 group-data-[paused]:block group-data-[ended]:hidden",
                  size: 14,
                }),
                (0, t.jsx)(r.kl, {
                  className:
                    "size-3.5 group-data-[paused]:hidden group-data-[ended]:hidden",
                  size: 14,
                }),
                (0, t.jsx)(r.B4, {
                  className: "hidden size-3.5 group-data-[ended]:block",
                  size: 14,
                }),
              ],
            })),
            (p[15] = o))
          : (o = p[15]),
        p[16] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = (0, t.jsxs)(n.L, {
              className: C,
              children: [
                (0, t.jsx)(r.kg, {
                  className: "hidden size-3.5 group-data-[state='muted']:block",
                  size: 14,
                }),
                (0, t.jsx)(r.vj, {
                  className: "hidden size-3.5 group-data-[state='low']:block",
                  size: 14,
                }),
                (0, t.jsx)(r.e, {
                  className: "hidden size-3.5 group-data-[state='high']:block",
                  size: 14,
                }),
              ],
            })),
            (p[16] = d))
          : (d = p[16]),
        p[17] === Symbol.for("react.memo_cache_sentinel")
          ? ((u = (0, t.jsxs)("div", {
              className: "flex items-center justify-between",
              children: [
                o,
                (0, t.jsxs)("div", {
                  className: "flex items-center gap-1.5",
                  children: [
                    d,
                    (0, t.jsxs)(n.C, {
                      className: C,
                      children: [
                        (0, t.jsx)(r.El, {
                          className: "size-3.5 group-data-[active]:hidden",
                          size: 14,
                        }),
                        (0, t.jsx)(r.aI, {
                          className:
                            "hidden size-3.5 group-data-[active]:block",
                          size: 14,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })),
            (p[17] = u))
          : (u = p[17]),
        p[18] !== l
          ? ((m = (0, t.jsxs)("div", { className: l, children: [a, u] })),
            (p[18] = l),
            (p[19] = m))
          : (m = p[19]),
        m
      );
    };
  function R(e) {
    return e.stopPropagation();
  }
  e.s(
    [
      "BountyVideoPlayerImpl",
      0,
      (e) => {
        let r,
          l = (0, s.c)(2);
        return (
          l[0] !== e
            ? ((r = (0, t.jsx)(P, { ...e })), (l[0] = e), (l[1] = r))
            : (r = l[1]),
          r
        );
      },
    ],
    872703,
  );
};
