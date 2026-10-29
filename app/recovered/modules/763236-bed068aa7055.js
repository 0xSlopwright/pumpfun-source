// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    l = e.i(745018),
    r = e.i(352386);
  e.i(12692);
  var i = e.i(398902),
    n = e.i(724423),
    o = e.i(51206),
    s = e.i(908163),
    c = e.i(561259),
    u = e.i(338319);
  let d =
    "h-36 w-auto max-w-full rounded-md border border-border-secondary object-cover";
  function m(e) {
    let r = (0, a.c)(26),
      { status: n, onRetry: o, testId: c } = e,
      { t: d } = (0, i.f)(),
      m = `${c}-video-${n}`;
    switch (n) {
      case "uploading":
      case "checking": {
        let e, a, i;
        return (
          r[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)(l.AC, { className: "animate-spin" })),
              (r[0] = e))
            : (e = r[0]),
          r[1] !== d
            ? ((a = d("web.callouts.reply.media.video_checking")),
              (r[1] = d),
              (r[2] = a))
            : (a = r[2]),
          r[3] !== a || r[4] !== m
            ? ((i = (0, t.jsxs)(s.E, {
                density: "comfortable",
                role: "status",
                "data-testid": m,
                children: [e, a],
              })),
              (r[3] = a),
              (r[4] = m),
              (r[5] = i))
            : (i = r[5]),
          i
        );
      }
      case "clean": {
        let e, a, i;
        return (
          r[6] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)(l.y$, {})), (r[6] = e))
            : (e = r[6]),
          r[7] !== d
            ? ((a = d("web.callouts.reply.media.video_ready")),
              (r[7] = d),
              (r[8] = a))
            : (a = r[8]),
          r[9] !== a || r[10] !== m
            ? ((i = (0, t.jsxs)(s.E, {
                density: "comfortable",
                tone: "gain",
                role: "status",
                "data-testid": m,
                children: [e, a],
              })),
              (r[9] = a),
              (r[10] = m),
              (r[11] = i))
            : (i = r[11]),
          i
        );
      }
      case "flagged": {
        let e, a, i;
        return (
          r[12] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, t.jsx)(l.aa, {})), (r[12] = e))
            : (e = r[12]),
          r[13] !== d
            ? ((a = d("callouts.reply.media.video_rejected")),
              (r[13] = d),
              (r[14] = a))
            : (a = r[14]),
          r[15] !== a || r[16] !== m
            ? ((i = (0, t.jsxs)(s.E, {
                density: "comfortable",
                tone: "loss",
                role: "alert",
                "data-testid": m,
                children: [e, a],
              })),
              (r[15] = a),
              (r[16] = m),
              (r[17] = i))
            : (i = r[17]),
          i
        );
      }
      case "failed": {
        let e, a, i, n;
        return (
          r[18] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, u.c)(
                s.G,
                s.q.comfortable,
                s.c.loss,
                "transition-colors hover:text-text-primary",
              )),
              (a = (0, t.jsx)(l.aa, {})),
              (r[18] = e),
              (r[19] = a))
            : ((e = r[18]), (a = r[19])),
          r[20] !== d
            ? ((i = d("callouts.reply.media.video_check_failed")),
              (r[20] = d),
              (r[21] = i))
            : (i = r[21]),
          r[22] !== o || r[23] !== i || r[24] !== m
            ? ((n = (0, t.jsxs)("button", {
                type: "button",
                "data-testid": m,
                onClick: o,
                className: e,
                children: [a, i],
              })),
              (r[22] = o),
              (r[23] = i),
              (r[24] = m),
              (r[25] = n))
            : (n = r[25]),
          n
        );
      }
      default:
        return null;
    }
  }
  function f(e) {
    return Array.from(e.dataTransfer.types).includes("Files");
  }
  e.s([
    "S",
    0,
    function (e) {
      let n,
        s,
        u,
        d,
        m,
        f,
        p,
        _ = (0, a.c)(18),
        { onPick: h, disabled: g, allowVideo: b, testId: x } = e,
        y = void 0 !== g && g,
        v = void 0 !== b && b,
        { t: E } = (0, i.f)(),
        w = (0, r.useRef)(null);
      _[0] !== v || _[1] !== E
        ? ((n = E(
            v
              ? "callouts.reply.media.pick_library_video"
              : "callouts.reply.media.pick_library",
          )),
          (_[0] = v),
          (_[1] = E),
          (_[2] = n))
        : (n = _[2]);
      let L = n,
        C = v ? c.v : c.w,
        N = `${x}-input`;
      return (
        _[3] !== h
          ? ((s = (e) => {
              let t = e.target.files?.[0];
              (t && h(t), (e.target.value = ""));
            }),
            (_[3] = h),
            (_[4] = s))
          : (s = _[4]),
        _[5] !== C || _[6] !== N || _[7] !== s
          ? ((u = (0, t.jsx)("input", {
              ref: w,
              type: "file",
              accept: C,
              className: "hidden",
              "data-testid": N,
              onChange: s,
            })),
            (_[5] = C),
            (_[6] = N),
            (_[7] = s),
            (_[8] = u))
          : (u = _[8]),
        _[9] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = () => w.current?.click()),
            (m = (0, t.jsx)(l.iJ, {})),
            (_[9] = d),
            (_[10] = m))
          : ((d = _[9]), (m = _[10])),
        _[11] !== y || _[12] !== L || _[13] !== x
          ? ((f = (0, t.jsx)(o._, {
              density: "comfortable",
              size: 32,
              "aria-label": L,
              title: L,
              "data-testid": x,
              disabled: y,
              onClick: d,
              children: m,
            })),
            (_[11] = y),
            (_[12] = L),
            (_[13] = x),
            (_[14] = f))
          : (f = _[14]),
        _[15] !== u || _[16] !== f
          ? ((p = (0, t.jsxs)(t.Fragment, { children: [u, f] })),
            (_[15] = u),
            (_[16] = f),
            (_[17] = p))
          : (p = _[17]),
        p
      );
    },
    "e",
    0,
    function (e) {
      let r,
        s,
        c,
        f,
        p,
        _,
        h = (0, a.c)(44),
        { attachment: g, error: b, onRemove: x, videoUpload: y, testId: v } = e,
        E = void 0 === y ? null : y,
        { t: w } = (0, i.f)();
      if (b) {
        let e,
          a,
          l = `${v}-error`;
        return (
          h[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = (0, u.c)("text-xs leading-4", n.m.invalid)), (h[0] = e))
            : (e = h[0]),
          h[1] !== b || h[2] !== l
            ? ((a = (0, t.jsx)("p", {
                role: "alert",
                "data-testid": l,
                className: e,
                children: b,
              })),
              (h[1] = b),
              (h[2] = l),
              (h[3] = a))
            : (a = h[3]),
          a
        );
      }
      if (!g) return null;
      h[4] !== w
        ? ((r = w("callouts.reply.media.remove")), (h[4] = w), (h[5] = r))
        : (r = h[5]);
      let L = `${v}-remove`;
      (h[6] === Symbol.for("react.memo_cache_sentinel")
        ? ((s = (0, t.jsx)(l.AD, {})), (h[6] = s))
        : (s = h[6]),
        h[7] !== x || h[8] !== r || h[9] !== L
          ? ((c = (0, t.jsx)(o._, {
              density: "comfortable",
              size: 24,
              "aria-label": r,
              "data-testid": L,
              onClick: x,
              children: s,
            })),
            (h[7] = x),
            (h[8] = r),
            (h[9] = L),
            (h[10] = c))
          : (c = h[10]));
      let C = c;
      if ("video" === g.kind) {
        let e,
          a,
          r,
          i,
          n,
          o,
          s,
          c,
          f,
          p = g.previewUrl;
        return (
          h[11] !== w
            ? ((e = w("web.callouts.callout_attachment_alt")),
              (h[11] = w),
              (h[12] = e))
            : (e = h[12]),
          h[13] === Symbol.for("react.memo_cache_sentinel")
            ? ((a = (0, u.c)(d, "bg-bg-secondary")), (h[13] = a))
            : (a = h[13]),
          h[14] !== g.previewUrl || h[15] !== e || h[16] !== v
            ? ((r = (0, t.jsx)("video", {
                src: p,
                "aria-label": e,
                "data-testid": v,
                muted: !0,
                playsInline: !0,
                preload: "metadata",
                className: a,
              })),
              (h[14] = g.previewUrl),
              (h[15] = e),
              (h[16] = v),
              (h[17] = r))
            : (r = h[17]),
          h[18] === Symbol.for("react.memo_cache_sentinel")
            ? ((i = (0, t.jsx)("span", {
                "aria-hidden": !0,
                className:
                  "pointer-events-none absolute inset-0 flex items-center justify-center text-text-hero",
                children: (0, t.jsx)(l.qJ, { className: "size-8 drop-shadow" }),
              })),
              (h[18] = i))
            : (i = h[18]),
          h[19] !== r
            ? ((n = (0, t.jsxs)("div", {
                className: "relative w-fit max-w-full",
                children: [r, i],
              })),
              (h[19] = r),
              (h[20] = n))
            : (n = h[20]),
          h[21] !== C || h[22] !== n
            ? ((o = (0, t.jsxs)("div", {
                className: "flex items-start gap-2",
                children: [n, C],
              })),
              (h[21] = C),
              (h[22] = n),
              (h[23] = o))
            : (o = h[23]),
          h[24] !== v || h[25] !== E
            ? ((s = E
                ? (0, t.jsx)(m, {
                    status: E.status,
                    onRetry: E.retry,
                    testId: v,
                  })
                : null),
              (h[24] = v),
              (h[25] = E),
              (h[26] = s))
            : (s = h[26]),
          h[27] !== w || h[28] !== v || h[29] !== E?.status
            ? ((c =
                E?.status === "checking"
                  ? (0, t.jsx)("p", {
                      "data-testid": `${v}-deferred-notice`,
                      className: "text-xs leading-4 text-text-tertiary",
                      children: w(
                        "web.callouts.create.video_processing_notice",
                      ),
                    })
                  : null),
              (h[27] = w),
              (h[28] = v),
              (h[29] = E?.status),
              (h[30] = c))
            : (c = h[30]),
          h[31] !== o || h[32] !== s || h[33] !== c
            ? ((f = (0, t.jsxs)("div", {
                className: "flex flex-col items-start gap-2",
                children: [o, s, c],
              })),
              (h[31] = o),
              (h[32] = s),
              (h[33] = c),
              (h[34] = f))
            : (f = h[34]),
          f
        );
      }
      let N = g.previewUrl;
      return (
        h[35] !== w
          ? ((f = w("web.callouts.callout_attachment_alt")),
            (h[35] = w),
            (h[36] = f))
          : (f = h[36]),
        h[37] !== g.previewUrl || h[38] !== f || h[39] !== v
          ? ((p = (0, t.jsx)("img", {
              src: N,
              alt: f,
              "data-testid": v,
              className: d,
            })),
            (h[37] = g.previewUrl),
            (h[38] = f),
            (h[39] = v),
            (h[40] = p))
          : (p = h[40]),
        h[41] !== C || h[42] !== p
          ? ((_ = (0, t.jsxs)("div", {
              className: "flex items-start gap-2",
              children: [p, C],
            })),
            (h[41] = C),
            (h[42] = p),
            (h[43] = _))
          : (_ = h[43]),
        _
      );
    },
    "O",
    0,
    function (e) {
      let t,
        l,
        i,
        n,
        o,
        s,
        c = (0, a.c)(14),
        { onDrop: u, disabled: d } = e,
        m = void 0 !== d && d,
        [p, _] = (0, r.useState)(!1);
      (c[0] !== m
        ? ((t = (e) => {
            !m && f(e) && (e.preventDefault(), _(!0));
          }),
          (l = (e) => {
            !m && f(e) && e.preventDefault();
          }),
          (c[0] = m),
          (c[1] = t),
          (c[2] = l))
        : ((t = c[1]), (l = c[2])),
        c[3] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (e) => {
              e.currentTarget.contains(e.relatedTarget) || _(!1);
            }),
            (c[3] = i))
          : (i = c[3]),
        c[4] !== m || c[5] !== u
          ? ((n = (e) => {
              (_(!1), !m && f(e) && (e.preventDefault(), u(e.dataTransfer)));
            }),
            (c[4] = m),
            (c[5] = u),
            (c[6] = n))
          : (n = c[6]),
        c[7] !== t || c[8] !== l || c[9] !== n
          ? ((o = { onDragEnter: t, onDragOver: l, onDragLeave: i, onDrop: n }),
            (c[7] = t),
            (c[8] = l),
            (c[9] = n),
            (c[10] = o))
          : (o = c[10]));
      let h = o;
      return (
        c[11] !== h || c[12] !== p
          ? ((s = { isDragging: p, dropProps: h }),
            (c[11] = h),
            (c[12] = p),
            (c[13] = s))
          : (s = c[13]),
        s
      );
    },
  ]);
};
