// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    a = e.i(352386);
  e.i(12692);
  var l = e.i(398902),
    r = e.i(561259);
  function i(e) {
    return e?.checking ? null : e;
  }
  e.s([
    "f",
    0,
    (e) => {
      let n,
        o,
        s,
        c,
        u,
        d,
        m,
        f,
        p,
        _ = (0, t.c)(19);
      _[0] !== e
        ? ((n = void 0 === e ? {} : e), (_[0] = e), (_[1] = n))
        : (n = _[1]);
      let { allowVideo: h } = n,
        g = void 0 !== h && h,
        { t: b } = (0, l.f)(),
        [x, y] = (0, a.useState)(null),
        [v, E] = (0, a.useState)(null),
        w = (0, a.useRef)(0);
      (_[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((o = () => () => {
            w.current = w.current + 1;
          }),
          (s = []),
          (_[2] = o),
          (_[3] = s))
        : ((o = _[2]), (s = _[3])),
        (0, a.useEffect)(o, s),
        _[4] !== g || _[5] !== b
          ? ((c = (e) => {
              let t = (w.current = w.current + 1),
                a = g && (0, r.e)(e),
                l = a ? (0, r.B)(e) : (0, r.X)(e);
              if (!l.ok)
                return (
                  y(i),
                  E(
                    "too_large" === l.reason
                      ? a
                        ? b("callouts.reply.media.video_too_large", {
                            size: r.Z,
                          })
                        : b("callouts.reply.media.too_large", { size: r.q })
                      : b("callouts.reply.media.attach_failed"),
                  ),
                  !1
                );
              let n = URL.createObjectURL(e);
              if ((E(null), !a))
                return (y({ kind: "image", file: e, previewUrl: n }), !0);
              y({ kind: "video", file: e, previewUrl: n, checking: !0 });
              let o = (e) => {
                t === w.current && (y(null), E(e));
              };
              return (
                (0, r.n)(n).then(
                  (a) => {
                    if (t === w.current) {
                      if (null !== a && a > r.T)
                        return void o(
                          b("callouts.reply.media.video_too_long", {
                            seconds: r.T,
                          }),
                        );
                      y({ kind: "video", file: e, previewUrl: n });
                    }
                  },
                  () => o(b("callouts.reply.media.video_attach_failed")),
                ),
                !0
              );
            }),
            (_[4] = g),
            (_[5] = b),
            (_[6] = c))
          : (c = _[6]));
      let L = c;
      _[7] !== g || _[8] !== L
        ? ((u = (e) => {
            let t = (0, r.C)(e, { allowVideo: g });
            return !!t && L(t);
          }),
          (_[7] = g),
          (_[8] = L),
          (_[9] = u))
        : (u = _[9]);
      let C = u;
      _[10] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = () => {
            ((w.current = w.current + 1), y(null), E(null));
          }),
          (_[10] = d))
        : (d = _[10]);
      let N = d,
        I = x?.previewUrl ?? null;
      return (
        _[11] !== I
          ? ((m = () => {
              if (null !== I) return () => URL.revokeObjectURL(I);
            }),
            (f = [I]),
            (_[11] = I),
            (_[12] = m),
            (_[13] = f))
          : ((m = _[12]), (f = _[13])),
        (0, a.useEffect)(m, f),
        _[14] !== C || _[15] !== L || _[16] !== x || _[17] !== v
          ? ((p = {
              attachment: x,
              attachmentError: v,
              attachMedia: L,
              attachFromDataTransfer: C,
              removeMedia: N,
            }),
            (_[14] = C),
            (_[15] = L),
            (_[16] = x),
            (_[17] = v),
            (_[18] = p))
          : (p = _[18]),
        p
      );
    },
  ]);
};
