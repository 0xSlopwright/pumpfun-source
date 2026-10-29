// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    n = e.i(254667),
    o = e.i(453706),
    s = e.i(352386);
  e.i(12692);
  var r = e.i(398902),
    a = e.i(10738),
    l = e.i(254806);
  let u = (0, s.createContext)({ isOpen: !1, onDismiss: () => {} }),
    d = (0, o.default)(
      () => e.A(147838).then((e) => e.BountiesIntroVideoFtueDialog),
      {
        loadableGenerated: { modules: [810205] },
        loading: (e) => {
          let o,
            a,
            l,
            d,
            c,
            m,
            b,
            f,
            p = (0, i.c)(24);
          p[0] !== e
            ? ((o = void 0 === e ? {} : e), (p[0] = e), (p[1] = o))
            : (o = p[1]);
          let { error: x, retry: h, onDismiss: g, isOpen: C } = o,
            { t: v } = (0, r.f)(),
            y = (0, s.useContext)(u),
            w = C ?? y.isOpen,
            j = g ?? y.onDismiss,
            [_, N] = (0, s.useState)(!1),
            z = (0, s.useRef)(!1);
          if (
            (p[2] !== x || p[3] !== _ || p[4] !== w
              ? ((a = () => {
                  if (!w || x || _) return;
                  let e = window.setTimeout(() => {
                    N(!0);
                  }, 15e3);
                  return () => window.clearTimeout(e);
                }),
                (l = [x, _, w]),
                (p[2] = x),
                (p[3] = _),
                (p[4] = w),
                (p[5] = a),
                (p[6] = l))
              : ((a = p[5]), (l = p[6])),
            (0, s.useEffect)(a, l),
            p[7] !== x || p[8] !== _ || p[9] !== w
              ? ((d = () => {
                  if (!w) {
                    z.current = !1;
                    return;
                  }
                  (x || _) &&
                    (z.current ||
                      ((z.current = !0),
                      n.y.error(
                        "Bounties intro FTUE dialog chunk failed to load",
                        {
                          reason:
                            x?.message ??
                            x?.name ??
                            (_ ? "timeout" : "unknown"),
                          timedOut: _,
                        },
                      )));
                }),
                (c = [x, _, w]),
                (p[7] = x),
                (p[8] = _),
                (p[9] = w),
                (p[10] = d),
                (p[11] = c))
              : ((d = p[10]), (c = p[11])),
            (0, s.useEffect)(d, c),
            !w)
          )
            return null;
          let k = !!x || _,
            S = !x && _;
          p[12] !== h
            ? ((m = () => {
                (N(!1), h?.());
              }),
              (p[12] = h),
              (p[13] = m))
            : (m = p[13]);
          let A = m,
            O = k
              ? "bounties-intro-ftue-error-title"
              : "bounties-intro-ftue-loading-title",
            T = k ? "alertdialog" : "dialog";
          return (
            p[14] !== A ||
            p[15] !== k ||
            p[16] !== j ||
            p[17] !== S ||
            p[18] !== v
              ? ((b = k
                  ? (0, t.jsxs)("div", {
                      className:
                        "mx-4 w-full max-w-[min(356px,calc(100vw-32px))] rounded-[22px] border border-border-secondary bg-bg-primary p-4 text-center text-white shadow-2xl",
                      "data-testid":
                        "bounties-intro-video-ftue-dialog-loading-error",
                      children: [
                        (0, t.jsx)("div", {
                          "aria-hidden": "true",
                          className:
                            "mx-auto mb-3 flex size-10 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-300",
                          children: (0, t.jsx)("span", {
                            className: "text-xl font-semibold leading-none",
                            children: "!",
                          }),
                        }),
                        (0, t.jsx)("div", {
                          className: "text-lg font-semibold",
                          id: "bounties-intro-ftue-error-title",
                          children: v("web.bounties.intro_load_error"),
                        }),
                        (0, t.jsx)("p", {
                          className: "text-text-tertiary mt-2 text-sm",
                          children: v(
                            S
                              ? "web.bounties.intro_timeout"
                              : "web.bounties.intro_check_connection",
                          ),
                        }),
                        (0, t.jsxs)("div", {
                          className: "mt-4 flex w-full flex-col gap-2",
                          children: [
                            (0, t.jsx)("button", {
                              className:
                                "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                              "data-testid": "bounties-intro-ftue-retry",
                              onClick: A,
                              type: "button",
                              children: v("common.try_again"),
                            }),
                            (0, t.jsx)("button", {
                              className:
                                "hover:bg-bg-secondary text-text-secondary rounded-xl px-3 py-2 text-sm transition-colors",
                              "data-testid": "bounties-intro-ftue-skip",
                              onClick: j,
                              type: "button",
                              children: v("web.bounties.continue_to_go"),
                            }),
                          ],
                        }),
                      ],
                    })
                  : (0, t.jsxs)("div", {
                      className: "flex flex-col items-center gap-3",
                      children: [
                        (0, t.jsx)("span", {
                          "aria-hidden": "true",
                          className:
                            "size-8 animate-spin rounded-full border-2 border-white/30 border-t-white",
                        }),
                        (0, t.jsx)("div", {
                          className: "sr-only",
                          id: "bounties-intro-ftue-loading-title",
                          children: v("web.bounties.loading_intro"),
                        }),
                      ],
                    })),
                (p[14] = A),
                (p[15] = k),
                (p[16] = j),
                (p[17] = S),
                (p[18] = v),
                (p[19] = b))
              : (b = p[19]),
            p[20] !== O || p[21] !== T || p[22] !== b
              ? ((f = (0, t.jsx)("div", {
                  "aria-labelledby": O,
                  "aria-modal": "true",
                  className:
                    "fixed inset-0 z-[998] flex items-center justify-center bg-black/60 backdrop-blur-[4px]",
                  "data-testid": "bounties-intro-video-ftue-dialog-loading",
                  role: T,
                  children: b,
                })),
                (p[20] = O),
                (p[21] = T),
                (p[22] = b),
                (p[23] = f))
              : (f = p[23]),
            f
          );
        },
        ssr: !1,
      },
    ),
    c = () => () => {},
    m = () => (0, l.e)(),
    b = () => !1;
  e.s([
    "BountiesIntroVideoFtue",
    0,
    () => {
      let e,
        n,
        o,
        r,
        f,
        p,
        x,
        h,
        g = (0, i.c)(18),
        [C, v] = (0, s.useState)(!1),
        y = (0, a.f)("(max-width: 767.98px)"),
        w = (0, s.useSyncExternalStore)(c, m, b),
        j = w && !C && !y,
        [_, N] = (0, s.useState)(j);
      j && !_ && N(!0);
      let z = (0, s.useRef)(!1);
      g[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = () => {
            ((0, l.j)(), v(!0));
          }),
          (g[0] = e))
        : (e = g[0]);
      let k = e;
      (g[1] !== C || g[2] !== y || g[3] !== j || g[4] !== w
        ? ((n = () => {
            (z.current && !j && y && w && !C && k(), (z.current = j));
          }),
          (o = [j, y, w, C]),
          (g[1] = C),
          (g[2] = y),
          (g[3] = j),
          (g[4] = w),
          (g[5] = n),
          (g[6] = o))
        : ((n = g[5]), (o = g[6])),
        (0, s.useEffect)(n, o),
        g[7] === Symbol.for("react.memo_cache_sentinel")
          ? ((r = () => {
              k();
            }),
            (g[7] = r))
          : (r = g[7]));
      let S = r;
      g[8] !== j
        ? ((f = (e) => {
            !e && j && k();
          }),
          (g[8] = j),
          (g[9] = f))
        : (f = g[9]);
      let A = f;
      return _ || C
        ? (g[10] !== j
            ? ((p = { isOpen: j, onDismiss: k }), (g[10] = j), (g[11] = p))
            : (p = g[11]),
          g[12] !== j || g[13] !== A
            ? ((x = (0, t.jsx)(d, {
                isOpen: j,
                onIsOpenChange: A,
                onContinue: S,
              })),
              (g[12] = j),
              (g[13] = A),
              (g[14] = x))
            : (x = g[14]),
          g[15] !== p || g[16] !== x
            ? ((h = (0, t.jsx)(u.Provider, { value: p, children: x })),
              (g[15] = p),
              (g[16] = x),
              (g[17] = h))
            : (h = g[17]),
          h)
        : null;
    },
  ]);
};
