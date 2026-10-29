// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(517770),
    i = e.i(789022),
    o = e.i(352386),
    s = e.i(264458),
    a = e.i(29797);
  let c = (e) => {
    let n,
      i,
      c,
      l,
      u,
      d,
      m,
      f = (0, r.c)(19),
      { children: g } = e,
      {
        pipStream: p,
        miniPlayerPosition: h,
        setMiniPlayerPosition: v,
      } = (0, a.f)(),
      [y, x] = (0, o.useState)(!1),
      b = (0, o.useRef)(null),
      S = (0, o.useRef)(null),
      w = (0, o.useRef)(h);
    f[0] !== h
      ? ((n = (e) => {
          e.target.closest("[data-mini-player-controls]") ||
            (x(!0),
            (b.current = { startX: e.clientX, startY: e.clientY }),
            (w.current = h),
            e.target.setPointerCapture(e.pointerId));
        }),
        (f[0] = h),
        (f[1] = n))
      : (n = f[1]);
    let I = n;
    f[2] !== y || f[3] !== v
      ? ((i = (e) => {
          if (!y || !b.current) return;
          let t = e.clientX - b.current.startX,
            r = e.clientY - b.current.startY,
            n = w.current.x - t,
            i = w.current.y - r,
            o = S.current?.offsetWidth ?? 320,
            s = S.current?.offsetHeight ?? 180;
          v({
            x: Math.max(0, Math.min(n, window.innerWidth - o)),
            y: Math.max(0, Math.min(i, window.innerHeight - s)),
          });
        }),
        (f[2] = y),
        (f[3] = v),
        (f[4] = i))
      : (i = f[4]);
    let _ = i;
    f[5] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = () => {
          (x(!1), (b.current = null));
        }),
        (f[5] = c))
      : (c = f[5]);
    let j = c;
    if (!p) return null;
    let k = y ? "cursor-grabbing" : "cursor-grab";
    return (
      f[6] !== k
        ? ((l = (0, s.default)(
            "group fixed z-50 w-80 overflow-hidden rounded-lg bg-bg-secondary shadow-2xl",
            "border border-white/10",
            k,
          )),
          (f[6] = k),
          (f[7] = l))
        : (l = f[7]),
      f[8] !== h.x || f[9] !== h.y
        ? ((u = { right: h.x, bottom: h.y }),
          (f[8] = h.x),
          (f[9] = h.y),
          (f[10] = u))
        : (u = f[10]),
      f[11] !== g
        ? ((d = (0, t.jsx)("div", { className: "aspect-video", children: g })),
          (f[11] = g),
          (f[12] = d))
        : (d = f[12]),
      f[13] !== I || f[14] !== _ || f[15] !== l || f[16] !== u || f[17] !== d
        ? ((m = (0, t.jsx)("div", {
            ref: S,
            className: l,
            style: u,
            onPointerDown: I,
            onPointerMove: _,
            onPointerUp: j,
            onPointerLeave: j,
            children: d,
          })),
          (f[13] = I),
          (f[14] = _),
          (f[15] = l),
          (f[16] = u),
          (f[17] = d),
          (f[18] = m))
        : (m = f[18]),
      m
    );
  };
  var l = e.i(677664),
    u = e.i(2697),
    d = e.i(388493);
  let m = (e) => {
    let n,
      i,
      o,
      s,
      a,
      c = (0, r.c)(10),
      { isVod: m } = e;
    return (
      c[0] !== m
        ? ((n =
            m &&
            (0, t.jsx)("div", {
              className: "mb-1",
              children: (0, t.jsx)(u.f, {}),
            })),
          (c[0] = m),
          (c[1] = n))
        : (n = c[1]),
      c[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = (0, t.jsx)("div", {
            className: "flex items-center gap-1",
            children: (0, t.jsx)(l.f, {}),
          })),
          (c[2] = i))
        : (i = c[2]),
      c[3] !== m
        ? ((o =
            m &&
            (0, t.jsx)("div", {
              className: "scale-75",
              children: (0, t.jsx)(d.f, {}),
            })),
          (c[3] = m),
          (c[4] = o))
        : (o = c[4]),
      c[5] !== o
        ? ((s = (0, t.jsxs)("div", {
            className: "flex items-center justify-between text-white",
            children: [i, o],
          })),
          (c[5] = o),
          (c[6] = s))
        : (s = c[6]),
      c[7] !== n || c[8] !== s
        ? ((a = (0, t.jsxs)("div", {
            className:
              "pointer-events-auto absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            "data-mini-player-controls": !0,
            children: [n, s],
          })),
          (c[7] = n),
          (c[8] = s),
          (c[9] = a))
        : (a = c[9]),
      a
    );
  };
  var f = e.i(745018);
  let g = (e) => {
      let n,
        i,
        o,
        s = (0, r.c)(5),
        { onClose: a } = e;
      return (
        s[0] !== a
          ? ((n = (e) => {
              (e.stopPropagation(), a());
            }),
            (s[0] = a),
            (s[1] = n))
          : (n = s[1]),
        s[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (0, t.jsx)(f.x6, { size: 16, className: "text-white" })),
            (s[2] = i))
          : (i = s[2]),
        s[3] !== n
          ? ((o = (0, t.jsx)("button", {
              onClick: n,
              className: "rounded p-1 hover:bg-white/20",
              title: "Close",
              children: i,
            })),
            (s[3] = n),
            (s[4] = o))
          : (o = s[4]),
        o
      );
    },
    p = (e) => {
      let n,
        i,
        o,
        s = (0, r.c)(5),
        { onNavigate: a } = e;
      return (
        s[0] !== a
          ? ((n = (e) => {
              (e.stopPropagation(), a());
            }),
            (s[0] = a),
            (s[1] = n))
          : (n = s[1]),
        s[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((i = (0, t.jsx)(f.ic, { size: 16, className: "text-white" })),
            (s[2] = i))
          : (i = s[2]),
        s[3] !== n
          ? ((o = (0, t.jsx)("button", {
              onClick: n,
              className: "rounded p-1 hover:bg-white/20",
              title: "Go to stream",
              children: i,
            })),
            (s[3] = n),
            (s[4] = o))
          : (o = s[4]),
        o
      );
    };
  var h = e.i(497151),
    v = e.i(396693);
  let y = (e) => {
    let n,
      i,
      o,
      s,
      a,
      c,
      l,
      u,
      d = (0, r.c)(19),
      {
        streamTitle: m,
        creatorImage: f,
        isOnStreamPage: y,
        onClose: x,
        onNavigate: b,
      } = e,
      S = f || v.f;
    return (
      d[0] !== S
        ? ((n = (0, t.jsx)("img", {
            src: S,
            alt: "",
            className: "h-5 w-5 rounded-full",
          })),
          (d[0] = S),
          (d[1] = n))
        : (n = d[1]),
      d[2] !== m
        ? ((i = (0, t.jsx)("span", {
            className: "truncate text-xs font-medium text-white",
            children: m,
          })),
          (d[2] = m),
          (d[3] = i))
        : (i = d[3]),
      d[4] !== n || d[5] !== i
        ? ((o = (0, t.jsxs)("div", {
            className: "flex items-center gap-1 truncate",
            children: [n, i],
          })),
          (d[4] = n),
          (d[5] = i),
          (d[6] = o))
        : (o = d[6]),
      d[7] === Symbol.for("react.memo_cache_sentinel")
        ? ((s = (0, t.jsx)(h.f, {})), (d[7] = s))
        : (s = d[7]),
      d[8] !== y || d[9] !== b
        ? ((a = !y && (0, t.jsx)(p, { onNavigate: b })),
          (d[8] = y),
          (d[9] = b),
          (d[10] = a))
        : (a = d[10]),
      d[11] !== x
        ? ((c = (0, t.jsx)(g, { onClose: x })), (d[11] = x), (d[12] = c))
        : (c = d[12]),
      d[13] !== a || d[14] !== c
        ? ((l = (0, t.jsxs)("div", {
            className: "flex items-center gap-1 text-white",
            children: [s, a, c],
          })),
          (d[13] = a),
          (d[14] = c),
          (d[15] = l))
        : (l = d[15]),
      d[16] !== o || d[17] !== l
        ? ((u = (0, t.jsxs)("div", {
            className:
              "pointer-events-auto absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            "data-mini-player-controls": !0,
            children: [o, l],
          })),
          (d[16] = o),
          (d[17] = l),
          (d[18] = u))
        : (u = d[18]),
      u
    );
  };
  var x = e.i(845785),
    b = e.i(997466),
    S = e.i(405048),
    w = e.i(25617);
  function I(e) {
    return e.pipStream;
  }
  function _(e) {
    return e.pipStream;
  }
  function j(e) {
    return e.setCurrentTime;
  }
  var k = e.i(985436),
    E = e.i(750115),
    C = e.i(534061);
  function N(e) {
    return e.pipStream;
  }
  function P(e) {
    return e.clearPipStream;
  }
  function R(e) {
    return e.currentPageMintId;
  }
  function M(e) {
    return e.currentPageVodId;
  }
  e.s(
    [
      "PersistentPlayer",
      0,
      (e) => {
        let s,
          l,
          u,
          d,
          f,
          g,
          p,
          h,
          v,
          T,
          A,
          z,
          O,
          $,
          L,
          D,
          U,
          H,
          K,
          W,
          V,
          Y,
          F,
          B,
          G = (0, r.c)(42),
          { onNavigate: J } = e,
          X = (0, a.f)(N),
          q = (0, a.f)(P),
          Q = (0, a.f)(R),
          Z = (0, a.f)(M),
          ee = (0, o.useRef)(null);
        ((W = (0, r.c)(10)),
          (V = (0, a.f)(_)),
          (Y = (0, a.f)(j)),
          (F = (0, o.useRef)(null)),
          W[0] !== V ? ((L = (0, w.s)(V)), (W[0] = V), (W[1] = L)) : (L = W[1]),
          (B = L),
          W[2] !== ee || W[3] !== B
            ? ((D = () => {
                if (!B) {
                  F.current = null;
                  return;
                }
                if (!ee.current || F.current === B) return;
                let e = ee.current,
                  t = a.f.getState()._pipStreamTime,
                  r = () => {
                    (t > 0 && F.current !== B && (e.currentTime = t),
                      (F.current = B));
                  };
                if (!e.state.canPlay)
                  return (
                    e.addEventListener("can-play", r),
                    () => e.removeEventListener("can-play", r)
                  );
                r();
              }),
              (U = [ee, B]),
              (W[2] = ee),
              (W[3] = B),
              (W[4] = D),
              (W[5] = U))
            : ((D = W[4]), (U = W[5])),
          (0, o.useEffect)(D, U),
          W[6] !== ee || W[7] !== Y
            ? ((H = () => {
                let e = setInterval(() => {
                  ee.current &&
                    ee.current.currentTime > 0 &&
                    Y(ee.current.currentTime);
                }, 500);
                return () => clearInterval(e);
              }),
              (K = [ee, Y]),
              (W[6] = ee),
              (W[7] = Y),
              (W[8] = H),
              (W[9] = K))
            : ((H = W[8]), (K = W[9])),
          (0, o.useEffect)(H, K),
          G[0] !== X
            ? ((s = (0, w.e)(X)), (G[0] = X), (G[1] = s))
            : (s = G[1]));
        let et = s;
        G[2] !== Q || G[3] !== Z || G[4] !== X
          ? ((l = (0, w.z)(X, Q, Z)),
            (G[2] = Q),
            (G[3] = Z),
            (G[4] = X),
            (G[5] = l))
          : (l = G[5]);
        let er = l,
          en = (() => {
            let e,
              t,
              n,
              i = (0, r.c)(11),
              o = (0, a.f)(I),
              { property: s, playerName: c } = (0, S.S)(),
              l = o
                ? "live" === o.streamType
                  ? x.$.Livestream
                  : "vod" === o.streamType
                    ? x.$.Vod
                    : x.$.Clip
                : x.$.Livestream;
            i[0] !== o
              ? ((e = o
                  ? "live" === o.streamType
                    ? String(o.livestreamId)
                    : ((0, w.W)(o.originPath) ?? "")
                  : ""),
                (i[0] = o),
                (i[1] = e))
              : (e = i[1]);
            let u = e,
              d = o ? o.mintId : "";
            return (
              i[2] !== o
                ? ((t = o ? (0, w.A)(o) : ""), (i[2] = o), (i[3] = t))
                : (t = i[3]),
              i[4] !== c ||
              i[5] !== s ||
              i[6] !== d ||
              i[7] !== t ||
              i[8] !== u ||
              i[9] !== l
                ? ((n = {
                    videoType: l,
                    roomId: d,
                    videoId: u,
                    videoTitle: t,
                    playerName: c,
                    creatorId: "",
                    page: x.j.WEB_LIVESTREAM_PIP_PLAYER,
                    property: s,
                  }),
                  (i[4] = c),
                  (i[5] = s),
                  (i[6] = d),
                  (i[7] = t),
                  (i[8] = u),
                  (i[9] = l),
                  (i[10] = n))
                : (n = i[10]),
              (0, b.f)(n)
            );
          })();
        G[6] !== J || G[7] !== X
          ? ((u = () => {
              J && X && J((0, w.a)(X));
            }),
            (G[6] = J),
            (G[7] = X),
            (G[8] = u))
          : (u = G[8]);
        let ei = u;
        G[9] !== q
          ? ((d = () => {
              q();
            }),
            (G[9] = q),
            (G[10] = d))
          : (d = G[10]);
        let eo = d;
        if (!X) return null;
        G[11] !== X
          ? ((f = (0, w.A)(X)), (G[11] = X), (G[12] = f))
          : (f = G[12]);
        let es = f,
          ea = "live" === X.streamType,
          ec = `${X.mintId}:${X.playlistUrl}`,
          el = X.muted ?? !0;
        (G[13] !== en || G[14] !== X.muted
          ? ((g = (...e) => {
              (ee.current && (ee.current.muted = X.muted ?? !0), en(...e));
            }),
            (G[13] = en),
            (G[14] = X.muted),
            (G[15] = g))
          : (g = G[15]),
          G[16] === Symbol.for("react.memo_cache_sentinel")
            ? ((h = (0, t.jsx)(i.s, {})),
              (p = (0, t.jsx)(n.R, {
                event: "pointerup",
                action: "toggle:controls",
                className: "absolute inset-0 z-0 block h-full w-full",
              })),
              (G[16] = p),
              (G[17] = h))
            : ((p = G[16]), (h = G[17])));
        let eu = X.creatorImage ?? X.coinImage;
        return (
          G[18] !== eo ||
          G[19] !== ei ||
          G[20] !== er ||
          G[21] !== es ||
          G[22] !== eu
            ? ((v = (0, t.jsx)(y, {
                streamTitle: es,
                creatorImage: eu,
                isOnStreamPage: er,
                onClose: eo,
                onNavigate: ei,
              })),
              (G[18] = eo),
              (G[19] = ei),
              (G[20] = er),
              (G[21] = es),
              (G[22] = eu),
              (G[23] = v))
            : (v = G[23]),
          G[24] !== et
            ? ((T = (0, t.jsx)(m, { isVod: et })), (G[24] = et), (G[25] = T))
            : (T = G[25]),
          G[26] !== v || G[27] !== T
            ? ((A = (0, t.jsxs)("div", {
                className: "pointer-events-none absolute inset-0 z-10",
                children: [v, T],
              })),
              (G[26] = v),
              (G[27] = T),
              (G[28] = A))
            : (A = G[28]),
          G[29] !== X.playlistUrl ||
          G[30] !== A ||
          G[31] !== ec ||
          G[32] !== el ||
          G[33] !== g
            ? ((z = (0, t.jsx)(c, {
                children: (0, t.jsxs)(
                  i.O,
                  {
                    ref: ee,
                    src: X.playlistUrl,
                    autoPlay: !0,
                    muted: el,
                    playsInline: !0,
                    aspectRatio: "16/9",
                    className: "m-0 block aspect-video w-full p-0",
                    onProviderChange: C.f,
                    onProviderSetup: g,
                    children: [h, p, A],
                  },
                  ec,
                ),
              })),
              (G[29] = X.playlistUrl),
              (G[30] = A),
              (G[31] = ec),
              (G[32] = el),
              (G[33] = g),
              (G[34] = z))
            : (z = G[34]),
          G[35] !== ea || G[36] !== X.mintId || G[37] !== z
            ? ((O = (0, t.jsx)(E.j, {
                roomId: X.mintId,
                enabled: ea,
                children: z,
              })),
              (G[35] = ea),
              (G[36] = X.mintId),
              (G[37] = z),
              (G[38] = O))
            : (O = G[38]),
          G[39] !== ea || G[40] !== O
            ? (($ = (0, t.jsx)(k.y, { isEnabled: ea, children: O })),
              (G[39] = ea),
              (G[40] = O),
              (G[41] = $))
            : ($ = G[41]),
          $
        );
      },
    ],
    358575,
  );
};
