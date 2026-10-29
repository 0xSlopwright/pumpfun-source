// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(352386);
  e.i(12692);
  var s = e.i(398902);
  let r = (e) => e instanceof DOMException && "NotAllowedError" === e.name;
  e.s(["f", 0, r], 160178);
  var i = e.i(338319);
  function n(e) {
    return e.intersectionRatio >= 0.5;
  }
  function o() {}
  function c(e) {
    return e.stopPropagation();
  }
  function d(e) {
    return e.stopPropagation();
  }
  e.s(
    [
      "f",
      0,
      (e) => {
        let u,
          m,
          p,
          x,
          f,
          h,
          g,
          y = (0, l.c)(24),
          { src: b, testId: v, className: w, dense: j } = e,
          _ = void 0 !== j && j ? "rounded-md" : "rounded-xl",
          { t: k } = (0, s.f)(),
          N = (0, a.useRef)(null),
          [I, C] = (0, a.useState)(!1);
        if (
          (y[0] !== I
            ? ((u = () => {
                let e = N.current;
                if (!e || I || "u" < typeof IntersectionObserver) return;
                let t = !1,
                  l = new IntersectionObserver(
                    (l) => {
                      (t = l.some(n))
                        ? e.play().catch((l) => {
                            t &&
                              !e.muted &&
                              r(l) &&
                              ((e.muted = !0), e.play().catch(o));
                          })
                        : e.pause();
                    },
                    { threshold: [0.5] },
                  );
                return (
                  l.observe(e),
                  () => {
                    (l.disconnect(), e.pause());
                  }
                );
              }),
              (m = [I]),
              (y[0] = I),
              (y[1] = u),
              (y[2] = m))
            : ((u = y[1]), (m = y[2])),
          (0, a.useEffect)(u, m),
          I)
        ) {
          let e,
            l,
            a,
            s = `${v}-unavailable`;
          return (
            y[3] !== w || y[4] !== _
              ? ((e = (0, i.c)(
                  "flex h-36 w-64 max-w-full items-center justify-center border border-border-secondary bg-bg-secondary text-xs text-text-tertiary",
                  _,
                  w,
                )),
                (y[3] = w),
                (y[4] = _),
                (y[5] = e))
              : (e = y[5]),
            y[6] !== k
              ? ((l = k("callouts.reply.media.video_unavailable")),
                (y[6] = k),
                (y[7] = l))
              : (l = y[7]),
            y[8] !== s || y[9] !== e || y[10] !== l
              ? ((a = (0, t.jsx)("div", {
                  "data-testid": s,
                  className: e,
                  children: l,
                })),
                (y[8] = s),
                (y[9] = e),
                (y[10] = l),
                (y[11] = a))
              : (a = y[11]),
            a
          );
        }
        return (
          y[12] !== w
            ? ((p = (0, i.c)("relative z-[2] w-fit max-w-full", w)),
              (y[12] = w),
              (y[13] = p))
            : (p = y[13]),
          y[14] === Symbol.for("react.memo_cache_sentinel")
            ? ((x = () => C(!0)), (y[14] = x))
            : (x = y[14]),
          y[15] !== _
            ? ((f = (0, i.c)(
                "max-h-80 w-auto max-w-full border border-border-secondary bg-bg-secondary object-contain",
                _,
              )),
              (y[15] = _),
              (y[16] = f))
            : (f = y[16]),
          y[17] !== b || y[18] !== f || y[19] !== v
            ? ((h = (0, t.jsx)("video", {
                ref: N,
                src: b,
                "data-testid": v,
                controls: !0,
                muted: !0,
                loop: !0,
                playsInline: !0,
                preload: "metadata",
                onError: x,
                className: f,
              })),
              (y[17] = b),
              (y[18] = f),
              (y[19] = v),
              (y[20] = h))
            : (h = y[20]),
          y[21] !== p || y[22] !== h
            ? ((g = (0, t.jsx)("div", {
                className: p,
                onClick: c,
                onKeyDown: d,
                children: h,
              })),
              (y[21] = p),
              (y[22] = h),
              (y[23] = g))
            : (g = y[23]),
          g
        );
      },
    ],
    354002,
  );
};
