// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(146695),
    s = e.i(432626),
    r = e.i(705313),
    i = e.i(98525),
    n = e.i(458310),
    o = e.i(352386);
  e.i(12692);
  var c = e.i(398902),
    d = e.i(364889),
    u = e.i(354002),
    m = e.i(157633),
    p = e.i(745018),
    x = e.i(177852),
    f = e.i(783358),
    h = e.i(787494),
    g = e.i(428189),
    y = e.i(174251),
    b = e.i(545063),
    v = e.i(179736),
    w = e.i(609488),
    j = e.i(875737),
    _ = e.i(741084),
    k = e.i(409954),
    N = e.i(529841),
    I = e.i(860787),
    C = e.i(365089),
    S = e.i(639374);
  let A = (e) =>
      e.caller?.walletAddress ?? ((0, S.f)(e.userId) ? e.userId : null),
    U = (e) => {
      let t = A(e);
      return (
        e.caller?.username?.trim() ||
        e.caller?.displayName?.trim() ||
        (0, C.d)(t ?? e.userId, 4, 4)
      );
    };
  (e.s(["d", 0, U, "F", 0, A], 941006), e.i(267146));
  var L = e.i(540805),
    z = e.i(338319),
    P = e.i(369091);
  let q =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg-accent";
  function O(e) {
    let n,
      o,
      u,
      f,
      C,
      S,
      O,
      E,
      R,
      $,
      D,
      F,
      M,
      Q,
      V,
      K,
      H,
      B,
      W,
      X,
      Z,
      J,
      Y,
      G = (0, l.c)(96),
      { t: ee } = (0, c.f)(),
      {
        reply: et,
        mint: el,
        calloutId: ea,
        focused: es,
        hideActions: er,
        fallbackXUsername: ei,
        commentCount: en,
        commentsExpanded: eo,
        onToggleComments: ec,
        commentsSlot: ed,
        replierAvatarShape: eu,
        replierHref: em,
        className: ep,
      } = e,
      ex = void 0 !== eo && eo,
      ef = void 0 === eu ? "circle" : eu,
      { ipfsPrefix: eh } = (0, P.useIpfsPrefix)();
    G[0] !== et ? ((n = A(et)), (G[0] = et), (G[1] = n)) : (n = G[1]);
    let eg = n,
      ey = (0, v.s)(eg ?? et.userId),
      eb = (0, b.$)();
    G[2] !== eb || G[3] !== et.authorCcUserId || G[4] !== et.userId
      ? ((o = !eb(et.userId) && !eb(et.authorCcUserId)),
        (G[2] = eb),
        (G[3] = et.authorCcUserId),
        (G[4] = et.userId),
        (G[5] = o))
      : (o = G[5]);
    let ev = o,
      ew = et.likeCount ?? 0,
      ej = et.likedByViewer ?? !1;
    G[6] !== ea ||
    G[7] !== el ||
    G[8] !== et.replyId ||
    G[9] !== ew ||
    G[10] !== ej
      ? ((u = {
          mint: el,
          calloutId: ea,
          replyId: et.replyId,
          likeCount: ew,
          likedByViewer: ej,
          surface: "callout_detail",
        }),
        (G[6] = ea),
        (G[7] = el),
        (G[8] = et.replyId),
        (G[9] = ew),
        (G[10] = ej),
        (G[11] = u))
      : (u = G[11]);
    let e_ = (0, g.f)(u);
    G[12] !== et ? ((f = U(et)), (G[12] = et), (G[13] = f)) : (f = G[13]);
    let ek = f;
    G[14] !== et.caller?.avatarUrl
      ? ((C = (0, I.Z)({
          sourceUrl: (0, _.f)(et.caller?.avatarUrl),
          width: I.z.list,
        })),
        (G[14] = et.caller?.avatarUrl),
        (G[15] = C))
      : (C = G[15]);
    let eN = C,
      eI = "squircle" === ef ? "rounded-xl" : "rounded-full",
      eC = eg ?? et.userId,
      eS = "squircle" === ef && "rounded-xl";
    G[16] !== eS
      ? ((S = (0, z.c)("h-9 w-9", eS)), (G[16] = eS), (G[17] = S))
      : (S = G[17]);
    let eA = eN ?? void 0;
    G[18] !== ek || G[19] !== eh || G[20] !== S || G[21] !== eA || G[22] !== eC
      ? ((O = (0, t.jsx)(r.f, {
          address: eC,
          alt: ek,
          className: S,
          height: 36,
          ipfsPrefix: eh,
          isAnonymous: !1,
          src: eA,
          width: 36,
        })),
        (G[18] = ek),
        (G[19] = eh),
        (G[20] = S),
        (G[21] = eA),
        (G[22] = eC),
        (G[23] = O))
      : (O = G[23]);
    let eU = O;
    G[24] !== em || G[25] !== et.userId || G[26] !== eg
      ? ((E =
          void 0 === em ? (0, a.$)({ address: eg, userId: et.userId }) : em),
        (G[24] = em),
        (G[25] = et.userId),
        (G[26] = eg),
        (G[27] = E))
      : (E = G[27]);
    let eL = E,
      ez = void 0 === em ? eg : null,
      eP = (void 0 === em && (eg || et.userId)) || "",
      eq = void 0 !== em;
    G[28] !== eN || G[29] !== ek || G[30] !== ez
      ? ((R = (e) =>
          ez
            ? (0, t.jsx)(s.f, {
                fallbackAvatarUrl: eN ?? null,
                fallbackUsername: ek,
                userAddress: ez,
                children: e,
              })
            : e),
        (G[28] = eN),
        (G[29] = ek),
        (G[30] = ez),
        (G[31] = R))
      : (R = G[31]);
    let eO = R,
      eT = et.replyId,
      eE = es && "bg-white/[0.04]";
    return (
      G[32] !== ep || G[33] !== eE
        ? (($ = (0, z.c)(
            "flex w-full items-start gap-3 border-b border-border-tertiary py-3",
            eE,
            ep,
          )),
          (G[32] = ep),
          (G[33] = eE),
          (G[34] = $))
        : ($ = G[34]),
      G[35] !== eU ||
      G[36] !== eI ||
      G[37] !== ek ||
      G[38] !== eL ||
      G[39] !== eq ||
      G[40] !== eP ||
      G[41] !== ee ||
      G[42] !== eO
        ? ((D = eL
            ? eO(
                (0, t.jsx)(k.o, {
                  profileId: eP,
                  href: eL,
                  "aria-label": ee("web.callouts.open_profile_a11y", {
                    username: ek,
                  }),
                  className: (0, z.c)(
                    "shrink-0 transition-opacity hover:opacity-80",
                    eq && q,
                    eq && `block ${eI}`,
                  ),
                  children: eU,
                }),
              )
            : eU),
          (G[35] = eU),
          (G[36] = eI),
          (G[37] = ek),
          (G[38] = eL),
          (G[39] = eq),
          (G[40] = eP),
          (G[41] = ee),
          (G[42] = eO),
          (G[43] = D))
        : (D = G[43]),
      G[44] !== ek ||
      G[45] !== eL ||
      G[46] !== eq ||
      G[47] !== eP ||
      G[48] !== eO
        ? ((F = eL
            ? eO(
                (0, t.jsx)(k.o, {
                  profileId: eP,
                  href: eL,
                  className: (0, z.c)(
                    "truncate text-sm font-semibold text-text-primary hover:underline",
                    eq && q,
                  ),
                  children: ek,
                }),
              )
            : (0, t.jsx)("span", {
                className: "truncate text-sm font-semibold text-text-primary",
                children: ek,
              })),
          (G[44] = ek),
          (G[45] = eL),
          (G[46] = eq),
          (G[47] = eP),
          (G[48] = eO),
          (G[49] = F))
        : (F = G[49]),
      G[50] !== ey
        ? ((M = ey ? (0, t.jsx)(i.f, { size: 18 }) : null),
          (G[50] = ey),
          (G[51] = M))
        : (M = G[51]),
      G[52] !== F || G[53] !== M
        ? ((Q = (0, t.jsxs)("span", {
            className: "flex min-w-0 items-center gap-1",
            children: [F, M],
          })),
          (G[52] = F),
          (G[53] = M),
          (G[54] = Q))
        : (Q = G[54]),
      G[55] !== ei || G[56] !== et.caller?.twitterUrl
        ? ((V =
            et.caller?.twitterUrl || ei
              ? (0, t.jsx)(j.f, {
                  twitterUrl: et.caller?.twitterUrl,
                  xUsername: et.caller?.twitterUrl ? void 0 : ei,
                })
              : null),
          (G[55] = ei),
          (G[56] = et.caller?.twitterUrl),
          (G[57] = V))
        : (V = G[57]),
      G[58] !== et.createdAt
        ? ((K = (0, t.jsx)("span", {
            className: "min-w-0 shrink-0 truncate text-xs text-text-tertiary",
            children: (0, t.jsx)(N.f, { timestamp: et.createdAt }),
          })),
          (G[58] = et.createdAt),
          (G[59] = K))
        : (K = G[59]),
      G[60] !== ek ||
      G[61] !== et.authorCcUserId ||
      G[62] !== et.replyId ||
      G[63] !== ev
        ? ((H = ev
            ? (0, t.jsx)(w.f, {
                target: { kind: "reply", id: et.replyId },
                author: { userId: et.authorCcUserId, name: ek },
                density: "comfortable",
                className: "relative z-[2] -my-1 ml-auto",
              })
            : null),
          (G[60] = ek),
          (G[61] = et.authorCcUserId),
          (G[62] = et.replyId),
          (G[63] = ev),
          (G[64] = H))
        : (H = G[64]),
      G[65] !== Q || G[66] !== V || G[67] !== K || G[68] !== H
        ? ((B = (0, t.jsxs)("div", {
            className: "flex w-full items-center gap-1.5",
            children: [Q, V, K, H],
          })),
          (G[65] = Q),
          (G[66] = V),
          (G[67] = K),
          (G[68] = H),
          (G[69] = B))
        : (B = G[69]),
      G[70] !== et.content
        ? ((W = (0, t.jsx)("p", {
            className:
              "w-full whitespace-pre-wrap break-words text-sm leading-5 text-text-primary",
            children: (0, t.jsx)(y.f, { content: et.content }),
          })),
          (G[70] = et.content),
          (G[71] = W))
        : (W = G[71]),
      G[72] !== et.mediaUrl
        ? ((X = et.mediaUrl
            ? (0, t.jsx)(d.f, {
                src: et.mediaUrl,
                testId: "callout-reply-media",
                className: "mt-1",
              })
            : null),
          (G[72] = et.mediaUrl),
          (G[73] = X))
        : (X = G[73]),
      G[74] !== ea ||
      G[75] !== en ||
      G[76] !== ex ||
      G[77] !== ek ||
      G[78] !== er ||
      G[79] !== e_ ||
      G[80] !== el ||
      G[81] !== ec ||
      G[82] !== et.replyId ||
      G[83] !== ee
        ? ((Z = er
            ? null
            : (0, t.jsxs)("div", {
                className: "flex items-center gap-1",
                children: [
                  (0, t.jsxs)("button", {
                    type: "button",
                    onClick: (e) => {
                      (e.stopPropagation(), e_.toggle());
                    },
                    "aria-label": ee(
                      e_.isLiked
                        ? "web.callouts.unlike_reply_a11y"
                        : "web.callouts.like_reply_a11y",
                    ),
                    "aria-pressed": e_.isLiked,
                    "data-testid": "callout-reply-like",
                    className: (0, z.c)(
                      "relative z-[2] -ml-1.5 inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-colors",
                      e_.isLiked
                        ? "text-text-primary"
                        : (0, z.c)("text-text-tertiary", h.$),
                    ),
                    children: [
                      e_.isLiked
                        ? (0, t.jsx)(m.cJ, {
                            className: (0, z.c)("size-3", h.k),
                          })
                        : (0, t.jsx)(p.cJ, { className: "size-3" }),
                      e_.likeCount > 0 ? (0, L.O)(e_.likeCount) : null,
                    ],
                  }),
                  (0, t.jsx)(x.f, {
                    sharePath: `/callouts/${el}/${ea}/${et.replyId}`,
                    shareTitle: ee("web.callouts.reply_share_title", {
                      name: ek,
                    }),
                    children: (0, t.jsx)("button", {
                      type: "button",
                      "aria-label": ee("web.callouts.share_reply_a11y"),
                      "data-testid": "callout-reply-share",
                      onClick: T,
                      className:
                        "relative z-[2] inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-text-tertiary transition-colors hover:bg-white/5 hover:text-text-secondary",
                      children: (0, t.jsx)(p.q4, { className: "size-3" }),
                    }),
                  }),
                  ec
                    ? (0, t.jsxs)("button", {
                        type: "button",
                        onClick: (e) => {
                          (e.stopPropagation(), ec());
                        },
                        "aria-label": ex
                          ? ee("web.callouts.hide_comments_a11y")
                          : en
                            ? ee("web.callouts.view_comments_a11y", {
                                count: en,
                              })
                            : ee("callouts.reply.title", { username: ek }),
                        "aria-expanded": ex,
                        "data-testid": "callout-reply-comments-toggle",
                        className: (0, z.c)(
                          "relative z-[2] inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-colors",
                          ex
                            ? "text-text-secondary"
                            : "text-text-tertiary hover:bg-white/5 hover:text-text-secondary",
                        ),
                        children: [
                          (0, t.jsx)(p.Z2, { className: "size-3" }),
                          null != en ? (0, L.O)(en) : null,
                        ],
                      })
                    : null != en
                      ? (0, t.jsxs)("span", {
                          "data-testid": "callout-reply-comments-count",
                          "aria-label": ee("web.callouts.comments_count", {
                            count: en,
                          }),
                          className:
                            "inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums text-text-tertiary",
                          children: [
                            (0, t.jsx)(p.Z2, { className: "size-3" }),
                            (0, L.O)(en),
                          ],
                        })
                      : null,
                ],
              })),
          (G[74] = ea),
          (G[75] = en),
          (G[76] = ex),
          (G[77] = ek),
          (G[78] = er),
          (G[79] = e_),
          (G[80] = el),
          (G[81] = ec),
          (G[82] = et.replyId),
          (G[83] = ee),
          (G[84] = Z))
        : (Z = G[84]),
      G[85] !== ed || G[86] !== B || G[87] !== W || G[88] !== X || G[89] !== Z
        ? ((J = (0, t.jsxs)("div", {
            className: "flex min-w-0 flex-1 flex-col items-start gap-0.5",
            children: [B, W, X, Z, ed],
          })),
          (G[85] = ed),
          (G[86] = B),
          (G[87] = W),
          (G[88] = X),
          (G[89] = Z),
          (G[90] = J))
        : (J = G[90]),
      G[91] !== et.replyId || G[92] !== $ || G[93] !== D || G[94] !== J
        ? ((Y = (0, t.jsxs)("div", {
            "data-testid": "callout-reply-cell",
            "data-reply-id": eT,
            className: $,
            children: [D, J],
          })),
          (G[91] = et.replyId),
          (G[92] = $),
          (G[93] = D),
          (G[94] = J),
          (G[95] = Y))
        : (Y = G[95]),
      Y
    );
  }
  function T(e) {
    return e.stopPropagation();
  }
  e.s(["f", 0, O], 710416);
  var E = e.i(642282),
    R = e.i(953283),
    $ = e.i(574472),
    D = e.i(63289),
    F = e.i(138411),
    M = e.i(149757),
    Q = e.i(236315),
    V = e.i(640068),
    K = e.i(834247),
    H = e.i(595673),
    B = e.i(569526),
    W = e.i(279602),
    X = e.i(198825);
  function Z(e) {
    let a,
      s,
      i,
      n,
      d,
      u,
      m,
      x,
      f,
      h,
      g,
      y,
      b,
      v,
      w,
      j,
      _,
      k,
      N,
      I,
      C,
      S,
      A,
      U,
      L,
      q,
      O,
      T,
      Z,
      J,
      Y,
      G,
      ee,
      et,
      el,
      ea,
      es = (0, l.c)(139),
      {
        mint: er,
        chainId: ei,
        calloutId: en,
        permalinkCalloutId: eo,
        authorAddress: ec,
        viewerAddress: ed,
        viewerCaller: eu,
        latestAuthorUpdateAtMs: em,
        latestViewerReplyAtMs: ep,
        parentReplyId: ex,
        replyingToName: ef,
        autoFocus: eh,
        autoFocusScroll: eg,
        className: ey,
      } = e,
      eb = void 0 === eg || eg,
      { t: ev } = (0, c.f)(),
      { setShowWallet: ew } = (0, X.useConnectWallet)(),
      { ipfsPrefix: ej } = (0, P.useIpfsPrefix)(),
      e_ = (0, W.f)(eu?.avatarDecoration);
    (es[0] !== eu
      ? ((a = eu ? { viewerCaller: eu } : {}), (es[0] = eu), (es[1] = a))
      : (a = es[1]),
      es[2] !== ec ||
      es[3] !== en ||
      es[4] !== ei ||
      es[5] !== em ||
      es[6] !== ep ||
      es[7] !== er ||
      es[8] !== ex ||
      es[9] !== eo ||
      es[10] !== a
        ? ((s = {
            mint: er,
            chainId: ei,
            calloutId: en,
            permalinkCalloutId: eo,
            authorAddress: ec,
            parentReplyId: ex,
            latestAuthorUpdateAtMs: em,
            latestViewerReplyAtMs: ep,
            ...a,
          }),
          (es[2] = ec),
          (es[3] = en),
          (es[4] = ei),
          (es[5] = em),
          (es[6] = ep),
          (es[7] = er),
          (es[8] = ex),
          (es[9] = eo),
          (es[10] = a),
          (es[11] = s))
        : (s = es[11]));
    let ek = (function (e) {
        let t,
          a,
          s,
          r,
          i,
          n,
          d,
          u,
          m,
          p,
          x,
          f,
          h,
          g = (0, l.c)(51),
          {
            mint: y,
            chainId: b,
            calloutId: v,
            permalinkCalloutId: w,
            authorAddress: j,
            parentReplyId: _,
            latestAuthorUpdateAtMs: k,
            latestViewerReplyAtMs: N,
            viewerCaller: I,
            onPosted: C,
          } = e,
          { t: S } = (0, c.f)(),
          { address: A } = (0, $.F)(),
          { lastClickImpression: U } = (0, B.y)(),
          [L, z] = (0, o.useState)(""),
          [P, q] = (0, o.useState)(null),
          [O, T] = (0, o.useState)(null),
          [E, R] = (0, o.useState)(0),
          W = (0, o.useRef)(!1);
        g[0] !== L
          ? ((t = { content: L, setContent: z }), (g[0] = L), (g[1] = t))
          : (t = g[1]);
        let X = (0, M.f)(t),
          Z = (0, Q.f)();
        g[2] !== A || g[3] !== j
          ? ((a = (0, K.f)(A, j)), (g[2] = A), (g[3] = j), (g[4] = a))
          : (a = g[4]);
        let J = a,
          Y = J && !_;
        g[5] !== L ? ((s = L.trim()), (g[5] = L), (g[6] = s)) : (s = g[6]);
        let G = s,
          ee = Math.max(J ? (k ?? 0) : 0, N ?? 0);
        (g[7] !== y || g[8] !== ee
          ? ((r = () => {
              if (!y) return;
              let e = !1,
                t = () => {
                  e || R((0, F.g)(y, ee));
                },
                l = setTimeout(t, 0),
                a = setInterval(t, 1e3);
              return () => {
                ((e = !0), clearTimeout(l), clearInterval(a));
              };
            }),
            (i = [y, ee]),
            (g[7] = y),
            (g[8] = ee),
            (g[9] = r),
            (g[10] = i))
          : ((r = g[9]), (i = g[10])),
          (0, o.useEffect)(r, i));
        let et = E > 0;
        g[11] !== E
          ? ((n = (0, F.A)(E)), (g[11] = E), (g[12] = n))
          : (n = g[12]);
        let el = n;
        g[13] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = (e) => {
              e.type.startsWith("image/")
                ? e.size > V.U
                  ? T("That image is too large. Pick one under 15MB.")
                  : (q({ file: e, previewUrl: URL.createObjectURL(e) }),
                    T(null))
                : T("We couldn't attach that image. Try another one.");
            }),
            (g[13] = d))
          : (d = g[13]);
        let ea = d;
        g[14] === Symbol.for("react.memo_cache_sentinel")
          ? ((u = () => {
              (q(null), T(null));
            }),
            (g[14] = u))
          : (u = g[14]);
        let es = u;
        (g[15] !== P
          ? ((m = () => {
              if (!P) return;
              let e = P.previewUrl;
              return () => URL.revokeObjectURL(e);
            }),
            (p = [P]),
            (g[15] = P),
            (g[16] = m),
            (g[17] = p))
          : ((m = g[16]), (p = g[17])),
          (0, o.useEffect)(m, p),
          g[18] !== L || g[19] !== X
            ? ((x = X.serialize(L)), (g[18] = L), (g[19] = X), (g[20] = x))
            : (x = g[20]));
        let er = x.length,
          ei = er > V.F,
          en = Z.isPending,
          eo = !!A && !!y && !!v && G.length > 0 && !ei && !et && !en;
        g[21] !== A ||
        g[22] !== P?.file ||
        g[23] !== v ||
        g[24] !== b ||
        g[25] !== G ||
        g[26] !== Z ||
        g[27] !== Y ||
        g[28] !== U ||
        g[29] !== X ||
        g[30] !== y ||
        g[31] !== C ||
        g[32] !== _ ||
        g[33] !== w ||
        g[34] !== ee ||
        g[35] !== S ||
        g[36] !== I
          ? ((f = async () => {
              if (!y || !v || !A || W.current) return !1;
              W.current = !0;
              let e = {
                  mint: y,
                  calloutId: v,
                  content: X.serialize(G),
                  image: P?.file ?? null,
                  viewerAddress: A,
                  isAuthorReply: Y,
                  ...(_ ? { parentReplyId: _ } : {}),
                  ...(w && w !== v ? { cacheCalloutId: w } : {}),
                  ...(I ? { viewerCaller: I } : {}),
                },
                t = null;
              try {
                await Z.mutateAsync(e);
              } catch (e) {
                t = e;
              }
              if (t)
                return (
                  (0, V.h)(t, "COOLDOWN") && ((0, F.r)(y), R((0, F.g)(y, ee))),
                  D.c.error(S((0, V.s)(t, Y ? "update" : "reply"))),
                  (W.current = !1),
                  !1
                );
              D.c.success(Y ? "Update posted" : "Reply posted");
              let l =
                U?.mint === y && U.impression.calloutId === v
                  ? U.impression
                  : void 0;
              return (
                Y ||
                  (0, H.SX)({
                    mint: y,
                    calloutId: v,
                    ...(_ ? { parentReplyId: _ } : {}),
                    chain: (0, H.i9)(y, b),
                    recommendationId: l?.rec_id,
                    positionId: l?.positionId,
                  }),
                z(""),
                es(),
                R((0, F.g)(y, ee)),
                C?.(),
                (W.current = !1),
                !0
              );
            }),
            (g[21] = A),
            (g[22] = P?.file),
            (g[23] = v),
            (g[24] = b),
            (g[25] = G),
            (g[26] = Z),
            (g[27] = Y),
            (g[28] = U),
            (g[29] = X),
            (g[30] = y),
            (g[31] = C),
            (g[32] = _),
            (g[33] = w),
            (g[34] = ee),
            (g[35] = S),
            (g[36] = I),
            (g[37] = f))
          : (f = g[37]);
        let ec = f;
        return (
          g[38] !== P ||
          g[39] !== O ||
          g[40] !== eo ||
          g[41] !== L ||
          g[42] !== er ||
          g[43] !== el ||
          g[44] !== et ||
          g[45] !== ei ||
          g[46] !== en ||
          g[47] !== Y ||
          g[48] !== X ||
          g[49] !== ec
            ? ((h = {
                content: L,
                setContent: z,
                contentMaxLength: V.F,
                contentLength: er,
                isOverLimit: ei,
                attachment: P,
                attachmentError: O,
                attachImage: ea,
                removeImage: es,
                isUpdate: Y,
                isCoolingDown: et,
                cooldownLabel: el,
                isSubmitting: en,
                canSubmit: eo,
                submit: ec,
                mentions: X,
              }),
              (g[38] = P),
              (g[39] = O),
              (g[40] = eo),
              (g[41] = L),
              (g[42] = er),
              (g[43] = el),
              (g[44] = et),
              (g[45] = ei),
              (g[46] = en),
              (g[47] = Y),
              (g[48] = X),
              (g[49] = ec),
              (g[50] = h))
            : (h = g[50]),
          h
        );
      })(s),
      eN = (0, o.useRef)(null),
      eI = (0, o.useRef)(null),
      eC = (0, o.useRef)(!1);
    (es[12] !== eh || es[13] !== eb
      ? ((i = () => {
          if (!eh || eC.current) return;
          let e = eN.current;
          e &&
            ((eC.current = !0),
            e.focus({ preventScroll: !0 }),
            eb && e.scrollIntoView({ block: "center" }));
        }),
        (es[12] = eh),
        (es[13] = eb),
        (es[14] = i))
      : (i = es[14]),
      es[15] !== eh || es[16] !== eb || es[17] !== ed
        ? ((n = [eh, eb, ed]),
          (es[15] = eh),
          (es[16] = eb),
          (es[17] = ed),
          (es[18] = n))
        : (n = es[18]),
      (0, o.useEffect)(i, n));
    let eS = ek.content;
    (es[19] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = () => {
          let e = eN.current;
          e &&
            ((e.style.height = "auto"),
            (e.style.height = `${e.scrollHeight}px`));
        }),
        (es[19] = d))
      : (d = es[19]),
      es[20] !== eS ? ((u = [eS]), (es[20] = eS), (es[21] = u)) : (u = es[21]),
      (0, o.useEffect)(d, u));
    let eA = !!ex;
    if (!ed) {
      let e, l, a, s, i, n, o;
      return (
        es[22] !== ey
          ? ((e = (0, z.c)("flex w-full items-start gap-3 py-3", ey)),
            (es[22] = ey),
            (es[23] = e))
          : (e = es[23]),
        es[24] !== ev
          ? ((l = ev("common.you")), (es[24] = ev), (es[25] = l))
          : (l = es[25]),
        es[26] !== ej || es[27] !== l
          ? ((a = (0, t.jsx)(r.f, {
              address: "",
              alt: l,
              className: "h-9 w-9 shrink-0",
              height: 36,
              ipfsPrefix: ej,
              isAnonymous: !0,
              width: 36,
            })),
            (es[26] = ej),
            (es[27] = l),
            (es[28] = a))
          : (a = es[28]),
        es[29] !== ew
          ? ((s = () => ew(!0)), (es[29] = ew), (es[30] = s))
          : (s = es[30]),
        es[31] !== eA || es[32] !== ev
          ? ((i = ev(
              eA
                ? "callouts.thread.reply_placeholder"
                : "web.callouts.post_your_reply",
            )),
            (es[31] = eA),
            (es[32] = ev),
            (es[33] = i))
          : (i = es[33]),
        es[34] !== s || es[35] !== i
          ? ((n = (0, t.jsx)("button", {
              type: "button",
              "data-testid": "callout-reply-connect",
              onClick: s,
              className:
                "min-h-9 flex-1 rounded-full border border-border-tertiary bg-bg-secondary px-4 text-left text-sm text-text-tertiary transition-colors hover:border-white/30",
              children: i,
            })),
            (es[34] = s),
            (es[35] = i),
            (es[36] = n))
          : (n = es[36]),
        es[37] !== ex || es[38] !== n || es[39] !== e || es[40] !== a
          ? ((o = (0, t.jsxs)("div", {
              "data-testid": "callout-reply-connect-row",
              "data-parent-reply-id": ex,
              className: e,
              children: [a, n],
            })),
            (es[37] = ex),
            (es[38] = n),
            (es[39] = e),
            (es[40] = a),
            (es[41] = o))
          : (o = es[41]),
        o
      );
    }
    es[42] !== ek.isUpdate || es[43] !== eA || es[44] !== ev
      ? ((m = ev(
          ek.isUpdate
            ? "web.callouts.add_update_placeholder"
            : eA
              ? "callouts.thread.reply_placeholder"
              : "web.callouts.post_your_reply",
        )),
        (es[42] = ek.isUpdate),
        (es[43] = eA),
        (es[44] = ev),
        (es[45] = m))
      : (m = es[45]);
    let eU = m;
    es[46] !== ek.isUpdate || es[47] !== ev
      ? ((x = ev(ek.isUpdate ? "callouts.update.post" : "callouts.reply.post")),
        (es[46] = ek.isUpdate),
        (es[47] = ev),
        (es[48] = x))
      : (x = es[48]);
    let eL = x;
    es[49] !== ef || es[50] !== ev
      ? ((f = ef
          ? ev("callouts.reply.replying_to", { username: "\0" }).split("\0")
          : null),
        (es[49] = ef),
        (es[50] = ev),
        (es[51] = f))
      : (f = es[51]);
    let ez = f;
    (es[52] !== ey
      ? ((h = (0, z.c)("flex w-full items-start gap-3 py-3", ey)),
        (es[52] = ey),
        (es[53] = h))
      : (h = es[53]),
      es[54] !== ev
        ? ((g = ev("web.callouts.your_avatar_alt")),
          (es[54] = ev),
          (es[55] = g))
        : (g = es[55]));
    let eP = eu?.avatarUrl;
    (es[56] !== ej || es[57] !== g || es[58] !== eP || es[59] !== ed
      ? ((y = (0, t.jsx)(r.f, {
          address: ed,
          alt: g,
          className: "h-9 w-9 shrink-0",
          height: 36,
          ipfsPrefix: ej,
          isAnonymous: !1,
          src: eP,
          width: 36,
        })),
        (es[56] = ej),
        (es[57] = g),
        (es[58] = eP),
        (es[59] = ed),
        (es[60] = y))
      : (y = es[60]),
      es[61] !== y || es[62] !== e_
        ? ((b = (0, t.jsx)(R.f, {
            decoration: e_,
            variant: "list",
            children: y,
          })),
          (es[61] = y),
          (es[62] = e_),
          (es[63] = b))
        : (b = es[63]),
      es[64] !== ef || es[65] !== ez
        ? ((v =
            ez && ef
              ? (0, t.jsxs)("p", {
                  "data-testid": "callout-reply-replying-to",
                  className:
                    "flex min-w-0 items-baseline gap-1 text-xs text-text-tertiary",
                  children: [
                    ez[0] ? (0, t.jsx)("span", { children: ez[0] }) : null,
                    (0, t.jsx)("span", {
                      className:
                        "min-w-0 truncate font-semibold text-[#86EFAC]",
                      children: ef,
                    }),
                    ez[1] ? (0, t.jsx)("span", { children: ez[1] }) : null,
                  ],
                })
              : null),
          (es[64] = ef),
          (es[65] = ez),
          (es[66] = v))
        : (v = es[66]),
      es[67] !== ek.mentions
        ? ((w = (e) => {
            (ek.mentions.handleChange(e),
              (e.currentTarget.style.height = "auto"),
              (e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`));
          }),
          (es[67] = ek.mentions),
          (es[68] = w))
        : (w = es[68]));
    let eq = ek.contentMaxLength + 100;
    (es[69] !== ek.content ||
    es[70] !== ek.mentions.handleSelect ||
    es[71] !== eU ||
    es[72] !== w ||
    es[73] !== eq
      ? ((j = (0, t.jsx)("textarea", {
          ref: eN,
          value: ek.content,
          onChange: w,
          onSelect: ek.mentions.handleSelect,
          placeholder: eU,
          rows: 1,
          maxLength: eq,
          "data-testid": "callout-reply-input",
          className:
            "max-h-60 min-h-9 w-full resize-none overflow-y-auto bg-transparent py-2 text-sm leading-5 text-text-primary placeholder:text-text-tertiary focus:outline-none",
        })),
        (es[69] = ek.content),
        (es[70] = ek.mentions.handleSelect),
        (es[71] = eU),
        (es[72] = w),
        (es[73] = eq),
        (es[74] = j))
      : (j = es[74]),
      es[75] !== ek.mentions.selectSuggestion ||
      es[76] !== ek.mentions.suggestions
        ? ((_ = (0, t.jsx)(E.f, {
            suggestions: ek.mentions.suggestions,
            onSelect: ek.mentions.selectSuggestion,
            testId: "callout-reply-mentions",
          })),
          (es[75] = ek.mentions.selectSuggestion),
          (es[76] = ek.mentions.suggestions),
          (es[77] = _))
        : (_ = es[77]),
      es[78] !== ek.attachment || es[79] !== ek.removeImage || es[80] !== ev
        ? ((k = ek.attachment
            ? (0, t.jsxs)("div", {
                className: "relative w-fit",
                children: [
                  (0, t.jsx)("img", {
                    src: ek.attachment.previewUrl,
                    alt: ev("web.callouts.reply_attachment_alt"),
                    "data-testid": "callout-reply-attachment-preview",
                    className:
                      "h-36 w-auto max-w-full rounded-2xl border border-border-secondary object-cover",
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    "aria-label": ev("callouts.reply.media.remove"),
                    "data-testid": "callout-reply-attachment-remove",
                    onClick: ek.removeImage,
                    className:
                      "absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-text-primary transition-colors hover:bg-black/90",
                    children: (0, t.jsx)(p.AD, { className: "size-3.5" }),
                  }),
                ],
              })
            : null),
          (es[78] = ek.attachment),
          (es[79] = ek.removeImage),
          (es[80] = ev),
          (es[81] = k))
        : (k = es[81]),
      es[82] !== ek.attachmentError
        ? ((N = ek.attachmentError
            ? (0, t.jsx)("p", {
                className: "text-xs text-negative",
                children: ek.attachmentError,
              })
            : null),
          (es[82] = ek.attachmentError),
          (es[83] = N))
        : (N = es[83]),
      es[84] !== ek.cooldownLabel ||
      es[85] !== ek.isCoolingDown ||
      es[86] !== ek.isUpdate ||
      es[87] !== ev
        ? ((I = ek.isCoolingDown
            ? (0, t.jsx)("p", {
                "data-testid": "callout-reply-cooldown",
                className: "text-xs text-text-tertiary",
                children: ek.isUpdate
                  ? ev("web.callouts.update_cooldown", {
                      time: ek.cooldownLabel,
                    })
                  : ev("callouts.reply.cooldown_active", {
                      time: ek.cooldownLabel,
                    }),
              })
            : null),
          (es[84] = ek.cooldownLabel),
          (es[85] = ek.isCoolingDown),
          (es[86] = ek.isUpdate),
          (es[87] = ev),
          (es[88] = I))
        : (I = es[88]),
      es[89] !== ek
        ? ((C = (0, t.jsx)("input", {
            ref: eI,
            type: "file",
            accept: "image/*",
            className: "hidden",
            "data-testid": "callout-reply-attachment-input",
            onChange: (e) => {
              let t = e.target.files?.[0];
              (t && ek.attachImage(t), (e.target.value = ""));
            },
          })),
          (es[89] = ek),
          (es[90] = C))
        : (C = es[90]),
      es[91] !== ev
        ? ((S = ev("callouts.reply.media.pick_library")),
          (es[91] = ev),
          (es[92] = S))
        : (S = es[92]));
    let eO = ek.isSubmitting || null !== ek.attachment;
    es[93] === Symbol.for("react.memo_cache_sentinel")
      ? ((A = () => eI.current?.click()), (es[93] = A))
      : (A = es[93]);
    let eT =
      ek.isSubmitting || null !== ek.attachment
        ? "cursor-not-allowed text-text-tertiary opacity-40"
        : "text-[#86EFAC] hover:bg-bg-tertiary";
    (es[94] !== eT
      ? ((U = (0, z.c)(
          "flex size-8 items-center justify-center rounded-full transition-colors",
          eT,
        )),
        (es[94] = eT),
        (es[95] = U))
      : (U = es[95]),
      es[96] === Symbol.for("react.memo_cache_sentinel")
        ? ((L = (0, t.jsx)(p.iJ, { className: "size-5" })), (es[96] = L))
        : (L = es[96]),
      es[97] !== S || es[98] !== eO || es[99] !== U
        ? ((q = (0, t.jsx)("button", {
            type: "button",
            "aria-label": S,
            "data-testid": "callout-reply-attach",
            disabled: eO,
            onClick: A,
            className: U,
            children: L,
          })),
          (es[97] = S),
          (es[98] = eO),
          (es[99] = U),
          (es[100] = q))
        : (q = es[100]),
      es[101] !== C || es[102] !== q
        ? ((O = (0, t.jsxs)("div", {
            className: "flex items-center",
            children: [C, q],
          })),
          (es[101] = C),
          (es[102] = q),
          (es[103] = O))
        : (O = es[103]));
    let eE = ek.isOverLimit ? "text-negative" : "text-text-tertiary";
    (es[104] !== eE
      ? ((T = (0, z.c)("text-xs font-semibold tabular-nums", eE)),
        (es[104] = eE),
        (es[105] = T))
      : (T = es[105]),
      es[106] !== ek.contentLength ||
      es[107] !== ek.contentMaxLength ||
      es[108] !== T
        ? ((Z = (0, t.jsxs)("span", {
            "data-testid": "callout-reply-counter",
            className: T,
            children: [ek.contentLength, "/", ek.contentMaxLength],
          })),
          (es[106] = ek.contentLength),
          (es[107] = ek.contentMaxLength),
          (es[108] = T),
          (es[109] = Z))
        : (Z = es[109]));
    let eR = !ek.canSubmit;
    return (
      es[110] !== ek
        ? ((J = () => void ek.submit()), (es[110] = ek), (es[111] = J))
        : (J = es[111]),
      es[112] !== ek.isSubmitting || es[113] !== eL || es[114] !== ev
        ? ((Y = ek.isSubmitting ? ev("web.callouts.posting") : eL),
          (es[112] = ek.isSubmitting),
          (es[113] = eL),
          (es[114] = ev),
          (es[115] = Y))
        : (Y = es[115]),
      es[116] !== eR || es[117] !== J || es[118] !== Y
        ? ((G = (0, t.jsx)("button", {
            type: "button",
            "data-testid": "callout-reply-submit",
            disabled: eR,
            onClick: J,
            className:
              "rounded-full bg-primary-green px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
            children: Y,
          })),
          (es[116] = eR),
          (es[117] = J),
          (es[118] = Y),
          (es[119] = G))
        : (G = es[119]),
      es[120] !== Z || es[121] !== G
        ? ((ee = (0, t.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [Z, G],
          })),
          (es[120] = Z),
          (es[121] = G),
          (es[122] = ee))
        : (ee = es[122]),
      es[123] !== O || es[124] !== ee
        ? ((et = (0, t.jsxs)("div", {
            className: "flex w-full items-center justify-between gap-3",
            children: [O, ee],
          })),
          (es[123] = O),
          (es[124] = ee),
          (es[125] = et))
        : (et = es[125]),
      es[126] !== v ||
      es[127] !== j ||
      es[128] !== _ ||
      es[129] !== k ||
      es[130] !== N ||
      es[131] !== I ||
      es[132] !== et
        ? ((el = (0, t.jsxs)("div", {
            className: "flex min-w-0 flex-1 flex-col gap-2",
            children: [v, j, _, k, N, I, et],
          })),
          (es[126] = v),
          (es[127] = j),
          (es[128] = _),
          (es[129] = k),
          (es[130] = N),
          (es[131] = I),
          (es[132] = et),
          (es[133] = el))
        : (el = es[133]),
      es[134] !== ex || es[135] !== h || es[136] !== b || es[137] !== el
        ? ((ea = (0, t.jsxs)("div", {
            "data-testid": "callout-reply-composer",
            "data-compose-box": !0,
            "data-parent-reply-id": ex,
            className: h,
            children: [b, el],
          })),
          (es[134] = ex),
          (es[135] = h),
          (es[136] = b),
          (es[137] = el),
          (es[138] = ea))
        : (ea = es[138]),
      ea
    );
  }
  e.s(["f", 0, Z], 690814);
  let J = (0, o.createContext)(null),
    Y = () => (0, o.useContext)(J);
  e.s(
    [
      "P",
      0,
      function (e) {
        let a,
          s,
          r = (0, l.c)(6),
          { value: i, children: n } = e,
          c = (0, o.useContext)(J);
        r[0] !== c || r[1] !== i
          ? ((a = c ? { ...c, ...i } : i), (r[0] = c), (r[1] = i), (r[2] = a))
          : (a = r[2]);
        let d = a;
        return (
          r[3] !== n || r[4] !== d
            ? ((s = (0, t.jsx)(J.Provider, { value: d, children: n })),
              (r[3] = n),
              (r[4] = d),
              (r[5] = s))
            : (s = r[5]),
          s
        );
      },
      "i",
      0,
      Y,
    ],
    774388,
  );
  var G = e.i(248496),
    ee = e.i(690877),
    et = e.i(258182),
    el = e.i(408750);
  function ea(e, t) {
    return e.createdAt - t.createdAt;
  }
  function es(e) {
    return e.replyId;
  }
  function er(e) {
    let t,
      a,
      s = (0, l.c)(17),
      { mint: r, calloutId: i, authorAddress: n, enabled: o, embedded: c } = e,
      d = void 0 !== c,
      u = (void 0 === o || o) && !d;
    s[0] !== i || s[1] !== r || s[2] !== u
      ? ((t = { mint: r, calloutId: i, enabled: u, scope: "author" }),
        (s[0] = i),
        (s[1] = r),
        (s[2] = u),
        (s[3] = t))
      : (t = s[3]);
    let { replies: m } = (0, et.E)(t);
    (0, et.L)();
    e: {
      let e;
      if (void 0 !== c) {
        let e;
        if (s[4] !== c) {
          let t, l;
          ((t = !1),
            (l = c.map((e) => {
              let l = (0, et.g)(e.id);
              return void 0 === l || e.likedByViewer === l
                ? e
                : ((t = !0), { ...e, likedByViewer: l });
            })),
            (e = t ? l : c),
            (s[4] = c),
            (s[5] = e));
        } else e = s[5];
        a = e;
        break e;
      }
      if (!n || !r || !i) {
        let e;
        (s[6] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = []), (s[6] = e))
          : (e = s[6]),
          (a = e));
        break e;
      }
      if (s[7] !== n || s[8] !== i || s[9] !== r || s[10] !== m) {
        let t, l;
        (s[12] !== n
          ? ((t = (e) =>
              (0, K.f)(e.userId, n) || (0, K.f)(e.caller?.walletAddress, n)),
            (s[12] = n),
            (s[13] = t))
          : (t = s[13]),
          s[14] !== i || s[15] !== r
            ? ((l = (e) => ({
                id: e.replyId,
                content: e.content,
                createdAt: e.createdAt,
                mint: r,
                calloutId: i,
                likeCount: e.likeCount ?? 0,
                likedByViewer: e.likedByViewer ?? !1,
                mediaUrl: e.mediaUrl ?? null,
                replyCount: (0, el.O)(e),
              })),
              (s[14] = i),
              (s[15] = r),
              (s[16] = l))
            : (l = s[16]),
          (e = m.filter(t).sort(ei).map(l)),
          (s[7] = n),
          (s[8] = i),
          (s[9] = r),
          (s[10] = m),
          (s[11] = e));
      } else e = s[11];
      a = e;
    }
    return a;
  }
  function ei(e, t) {
    return e.createdAt - t.createdAt;
  }
  function en(e) {
    let t,
      a,
      s,
      r = (0, l.c)(16),
      {
        mint: i,
        calloutId: n,
        authorAddress: o,
        enabled: c,
        refetchIntervalMs: d,
      } = e,
      u = void 0 === c || c;
    r[0] !== n || r[1] !== u || r[2] !== i || r[3] !== d
      ? ((t = {
          mint: i,
          calloutId: n,
          enabled: u,
          scope: "all",
          refetchIntervalMs: d,
        }),
        (r[0] = n),
        (r[1] = u),
        (r[2] = i),
        (r[3] = d),
        (r[4] = t))
      : (t = r[4]);
    let { replies: m, isLoading: p, isError: x } = (0, et.E)(t);
    e: {
      let e;
      if (!i || !n) {
        let e;
        (r[5] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = []), (r[5] = e))
          : (e = r[5]),
          (a = e));
        break e;
      }
      if (r[6] !== o || r[7] !== m) {
        let t;
        (r[9] !== o
          ? ((t = (e) =>
              !o ||
              (!(0, K.f)(e.userId, o) &&
                !(0, K.f)(e.caller?.walletAddress, o))),
            (r[9] = o),
            (r[10] = t))
          : (t = r[10]),
          (e = m.filter(t).sort(eo)),
          (r[6] = o),
          (r[7] = m),
          (r[8] = e));
      } else e = r[8];
      a = e;
    }
    let f = a,
      h = i && n ? m.length : 0;
    return (
      r[11] !== f || r[12] !== x || r[13] !== p || r[14] !== h
        ? ((s = { replies: f, threadReplyCount: h, isLoading: p, isError: x }),
          (r[11] = f),
          (r[12] = x),
          (r[13] = p),
          (r[14] = h),
          (r[15] = s))
        : (s = r[15]),
      s
    );
  }
  function eo(e, t) {
    return e.createdAt - t.createdAt;
  }
  (e.s(["f", 0, er], 481522), e.s(["f", 0, en], 627092));
  let ec = (e, t) => {
    if (!t) return null;
    let l = null;
    for (let a of e)
      ((0, K.f)(a.userId, t) || (0, K.f)(a.caller?.walletAddress, t)) &&
        Number.isFinite(a.createdAt) &&
        a.createdAt > (l ?? 0) &&
        (l = a.createdAt);
    return l;
  };
  function ed(e) {
    let a,
      s,
      r,
      i,
      n,
      d,
      u,
      m,
      x,
      h,
      g = (0, l.c)(50),
      {
        mint: y,
        calloutId: b,
        parentReplyId: v,
        commentCount: w,
        parentAuthorName: j,
        className: _,
      } = e,
      { t: k } = (0, c.f)(),
      N = Y();
    g[0] !== b || g[1] !== y || g[2] !== v
      ? ((a = { mint: y, calloutId: b, parentReplyId: v }),
        (g[0] = b),
        (g[1] = y),
        (g[2] = v),
        (g[3] = a))
      : (a = g[3]);
    let {
        comments: I,
        isLoading: C,
        isError: S,
        refetch: A,
      } = (function (e) {
        let t,
          a,
          s,
          r,
          i,
          n,
          o = (0, l.c)(24),
          { mint: c, calloutId: d, parentReplyId: u, enabled: m } = e,
          p = (void 0 === m || m) && !!c && !!d && !!u,
          x = c ?? null,
          f = d ?? null,
          h = u ?? null;
        (o[0] !== x || o[1] !== f || o[2] !== h
          ? ((t = (0, et.Q)(x, f, h)),
            (o[0] = x),
            (o[1] = f),
            (o[2] = h),
            (o[3] = t))
          : (t = o[3]),
          o[4] !== d || o[5] !== c || o[6] !== u
            ? ((a = (e) => {
                let { signal: t } = e;
                if (!c || !d || !u)
                  throw Error("mint, calloutId and parentReplyId required");
                return (0, el.L)({
                  mint: c,
                  calloutId: d,
                  scope: "all",
                  parentReplyId: u,
                  includeTombstones: !0,
                  signal: t,
                });
              }),
              (o[4] = d),
              (o[5] = c),
              (o[6] = u),
              (o[7] = a))
            : (a = o[7]),
          o[8] !== p || o[9] !== t || o[10] !== a
            ? ((s = {
                enabled: p,
                queryKey: t,
                queryFn: a,
                staleTime: 15e3,
                gcTime: 3e5,
                refetchOnWindowFocus: !1,
              }),
              (o[8] = p),
              (o[9] = t),
              (o[10] = a),
              (o[11] = s))
            : (s = o[11]));
        let g = (0, ee.useQuery)(s);
        if (
          ((0, et.L)(),
          o[12] !== d || o[13] !== c || o[14] !== u || o[15] !== g.data)
        ) {
          let e = g.data ?? [],
            t = c && d && u ? (0, et.u)(c, d, "all", u) : [],
            l = new Set(e.map(es)),
            a =
              0 === t.length
                ? e
                : [...e, ...t.filter((e) => !l.has(e.replyId))];
          ((r = (0, et.v)([...a].sort(ea))),
            (o[12] = d),
            (o[13] = c),
            (o[14] = u),
            (o[15] = g.data),
            (o[16] = r));
        } else r = o[16];
        let y = r;
        return (
          o[17] !== g
            ? ((i = () => void g.refetch()), (o[17] = g), (o[18] = i))
            : (i = o[18]),
          o[19] !== y ||
          o[20] !== g.isError ||
          o[21] !== g.isLoading ||
          o[22] !== i
            ? ((n = {
                comments: y,
                isLoading: g.isLoading,
                isError: g.isError,
                refetch: i,
              }),
              (o[19] = y),
              (o[20] = g.isError),
              (o[21] = g.isLoading),
              (o[22] = i),
              (o[23] = n))
            : (n = o[23]),
          n
        );
      })(a),
      [P, q] = (0, o.useState)(eu);
    g[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((s = (e) => {
          q((t) => {
            let l = new Set(t);
            return (l.has(e) ? l.delete(e) : l.add(e), l);
          });
        }),
        (g[4] = s))
      : (s = g[4]);
    let T = s,
      E = !!(N && j) && 0 === w,
      R = N?.viewerAddress;
    g[5] !== I || g[6] !== R
      ? ((r = ec(I, R)), (g[5] = I), (g[6] = R), (g[7] = r))
      : (r = g[7]);
    let $ = r,
      D =
        null === $
          ? N?.latestViewerReplyAtMs
          : Math.max($, N?.latestViewerReplyAtMs ?? 0);
    if (
      (g[8] !== _
        ? ((i = (0, z.c)("flex w-full flex-col", _)), (g[8] = _), (g[9] = i))
        : (i = g[9]),
      g[10] !== b || g[11] !== I || g[12] !== P || g[13] !== y || g[14] !== k)
    ) {
      let e;
      (g[16] !== b || g[17] !== P || g[18] !== y || g[19] !== k
        ? ((e = (e) => {
            let l = (0, el.O)(e),
              a = P.has(e.replyId);
            return e.tombstone
              ? (0, t.jsxs)(
                  "div",
                  {
                    "data-testid": "callout-reply-tombstone",
                    className: "flex w-full flex-col items-start py-2",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-1",
                        children: [
                          (0, t.jsx)("p", {
                            className: "text-xs italic text-text-tertiary",
                            children: k("web.callouts.comment_deleted"),
                          }),
                          (0, t.jsxs)("button", {
                            type: "button",
                            onClick: (t) => {
                              (t.stopPropagation(), T(e.replyId));
                            },
                            "aria-label": a
                              ? k("web.callouts.hide_replies_a11y")
                              : k("web.callouts.view_replies_a11y"),
                            "aria-expanded": a,
                            "data-testid": "callout-reply-tombstone-toggle",
                            className: (0, z.c)(
                              "relative z-[2] w-fit",
                              f.I.comfortable,
                              f.L,
                              a
                                ? "text-text-secondary"
                                : "text-text-quaternary hover:text-text-primary",
                            ),
                            children: [
                              (0, t.jsx)(p.Z2, { className: f.d }),
                              null != l && l > 0 ? (0, L.O)(l) : null,
                            ],
                          }),
                        ],
                      }),
                      a
                        ? (0, t.jsx)(ed, {
                            mint: y,
                            calloutId: b,
                            parentReplyId: e.replyId,
                            commentCount: l,
                            className: "pl-12",
                          })
                        : null,
                    ],
                  },
                  e.replyId,
                )
              : (0, t.jsx)(
                  O,
                  {
                    reply: e,
                    mint: y,
                    calloutId: b,
                    className: "border-b-0 py-2",
                    commentCount: l,
                    commentsExpanded: a,
                    onToggleComments: () => T(e.replyId),
                    commentsSlot: a
                      ? (0, t.jsx)(ed, {
                          mint: y,
                          calloutId: b,
                          parentReplyId: e.replyId,
                          commentCount: l,
                          parentAuthorName: U(e),
                        })
                      : null,
                  },
                  e.replyId,
                );
          }),
          (g[16] = b),
          (g[17] = P),
          (g[18] = y),
          (g[19] = k),
          (g[20] = e))
        : (e = g[20]),
        (n = I.map(e)),
        (g[10] = b),
        (g[11] = I),
        (g[12] = P),
        (g[13] = y),
        (g[14] = k),
        (g[15] = n));
    } else n = g[15];
    return (
      g[21] !== I.length || g[22] !== C
        ? ((d =
            C && 0 === I.length
              ? (0, t.jsxs)("div", {
                  "aria-hidden": !0,
                  "data-testid": "callout-reply-comments-skeleton",
                  className: "flex items-start gap-3 py-2",
                  children: [
                    (0, t.jsx)(G.l, { variant: "circle", size: 36 }),
                    (0, t.jsxs)("div", {
                      className: "flex flex-1 flex-col gap-2 pt-1",
                      children: [
                        (0, t.jsx)(G.l, { height: 12, width: 128 }),
                        (0, t.jsx)(G.l, { height: 12, className: "w-3/4" }),
                      ],
                    }),
                  ],
                })
              : null),
          (g[21] = I.length),
          (g[22] = C),
          (g[23] = d))
        : (d = g[23]),
      g[24] !== I.length || g[25] !== S || g[26] !== A || g[27] !== k
        ? ((u =
            S && 0 === I.length
              ? (0, t.jsxs)("div", {
                  className:
                    "flex items-center gap-2 py-2 text-xs text-text-tertiary",
                  children: [
                    (0, t.jsx)("span", {
                      children: k("web.callouts.comments_load_failed"),
                    }),
                    (0, t.jsx)("button", {
                      type: "button",
                      onClick: (e) => {
                        (e.stopPropagation(), A());
                      },
                      className: "font-medium text-text-accent hover:underline",
                      children: k("common.retry"),
                    }),
                  ],
                })
              : null),
          (g[24] = I.length),
          (g[25] = S),
          (g[26] = A),
          (g[27] = k),
          (g[28] = u))
        : (u = g[28]),
      g[29] !== w ||
      g[30] !== I.length ||
      g[31] !== S ||
      g[32] !== C ||
      g[33] !== k
        ? ((m =
            C || S || 0 !== I.length || 0 === w
              ? null
              : (0, t.jsx)("p", {
                  className: "py-2 text-xs text-text-tertiary",
                  children: k("web.callouts.comments_unavailable"),
                })),
          (g[29] = w),
          (g[30] = I.length),
          (g[31] = S),
          (g[32] = C),
          (g[33] = k),
          (g[34] = m))
        : (m = g[34]),
      g[35] !== b ||
      g[36] !== E ||
      g[37] !== D ||
      g[38] !== y ||
      g[39] !== j ||
      g[40] !== v ||
      g[41] !== N
        ? ((x =
            N && j
              ? (0, t.jsx)(Z, {
                  mint: y,
                  calloutId: b,
                  permalinkCalloutId: N.permalinkCalloutId,
                  chainId: N.chainId,
                  authorAddress: N.authorAddress,
                  viewerAddress: N.viewerAddress,
                  viewerCaller: N.viewerCaller,
                  latestAuthorUpdateAtMs: N.latestAuthorUpdateAtMs,
                  latestViewerReplyAtMs: D,
                  parentReplyId: v,
                  replyingToName: j,
                  autoFocus: E,
                  autoFocusScroll: !1,
                  className: "py-2",
                })
              : null),
          (g[35] = b),
          (g[36] = E),
          (g[37] = D),
          (g[38] = y),
          (g[39] = j),
          (g[40] = v),
          (g[41] = N),
          (g[42] = x))
        : (x = g[42]),
      g[43] !== i ||
      g[44] !== n ||
      g[45] !== d ||
      g[46] !== u ||
      g[47] !== m ||
      g[48] !== x
        ? ((h = (0, t.jsxs)("div", {
            "data-testid": "callout-reply-comments",
            className: i,
            children: [n, d, u, m, x],
          })),
          (g[43] = i),
          (g[44] = n),
          (g[45] = d),
          (g[46] = u),
          (g[47] = m),
          (g[48] = x),
          (g[49] = h))
        : (h = g[49]),
      h
    );
  }
  function eu() {
    return new Set();
  }
  function em(e) {
    let a,
      s,
      r,
      i,
      n,
      c = (0, l.c)(48),
      {
        updates: d,
        size: u,
        collapsible: m,
        expandableComments: p,
        authorName: x,
        authorAddress: f,
        authorUserId: h,
        authorAvatarUrl: g,
        authorAvatarDecoration: y,
        authorVerified: b,
        authorProfileId: v,
        timeAlign: w,
        timeDensity: j,
        hostHref: _,
        onHostClick: k,
        className: N,
        dense: I,
      } = e,
      C = void 0 === u ? "sm" : u,
      S = void 0 !== p && p,
      A = void 0 !== b && b,
      U = void 0 === v ? "" : v,
      L = void 0 === w ? "start" : w,
      P = void 0 === j ? "comfortable" : j,
      q = void 0 !== I && I,
      [O, T] = (0, o.useState)(!1);
    if (!d?.length) return null;
    let E = d.length - 1,
      R = void 0 !== m && m && !O && E > 0;
    c[0] !== R || c[1] !== d
      ? ((a = R ? d.slice(-1) : d), (c[0] = R), (c[1] = d), (c[2] = a))
      : (a = c[2]);
    let $ = a,
      D = !!(x && f),
      F = D ? void 0 : "gap-0.5 pt-1.5";
    if (
      (c[3] !== F
        ? ((s = (0, z.c)("flex w-full flex-col", F)), (c[3] = F), (c[4] = s))
        : (s = c[4]),
      c[5] !== q || c[6] !== D || c[7] !== R || c[8] !== C
        ? ((r = R
            ? (0, t.jsx)(ep, {
                size: C,
                dense: q,
                hasIdentity: D,
                onExpand: () => T(!0),
              })
            : null),
          (c[5] = q),
          (c[6] = D),
          (c[7] = R),
          (c[8] = C),
          (c[9] = r))
        : (r = c[9]),
      c[10] !== f ||
        c[11] !== y ||
        c[12] !== g ||
        c[13] !== x ||
        c[14] !== U ||
        c[15] !== h ||
        c[16] !== A ||
        c[17] !== N ||
        c[18] !== q ||
        c[19] !== S ||
        c[20] !== _ ||
        c[21] !== k ||
        c[22] !== C ||
        c[23] !== L ||
        c[24] !== P ||
        c[25] !== $)
    ) {
      let e;
      (c[27] !== f ||
      c[28] !== y ||
      c[29] !== g ||
      c[30] !== x ||
      c[31] !== U ||
      c[32] !== h ||
      c[33] !== A ||
      c[34] !== N ||
      c[35] !== q ||
      c[36] !== S ||
      c[37] !== _ ||
      c[38] !== k ||
      c[39] !== C ||
      c[40] !== L ||
      c[41] !== P ||
      c[42] !== $.length
        ? ((e = (e, l) =>
            (0, t.jsx)(
              ef,
              {
                update: e,
                size: C,
                expandableComments: S,
                authorName: x,
                authorAddress: f,
                authorUserId: h,
                authorAvatarUrl: g,
                authorAvatarDecoration: y,
                authorVerified: A,
                authorProfileId: U,
                timeAlign: L,
                timeDensity: P,
                hostHref: _,
                onHostClick: k,
                connectsToNext: l < $.length - 1,
                className: N,
                dense: q,
              },
              e.id,
            )),
          (c[27] = f),
          (c[28] = y),
          (c[29] = g),
          (c[30] = x),
          (c[31] = U),
          (c[32] = h),
          (c[33] = A),
          (c[34] = N),
          (c[35] = q),
          (c[36] = S),
          (c[37] = _),
          (c[38] = k),
          (c[39] = C),
          (c[40] = L),
          (c[41] = P),
          (c[42] = $.length),
          (c[43] = e))
        : (e = c[43]),
        (i = $.map(e)),
        (c[10] = f),
        (c[11] = y),
        (c[12] = g),
        (c[13] = x),
        (c[14] = U),
        (c[15] = h),
        (c[16] = A),
        (c[17] = N),
        (c[18] = q),
        (c[19] = S),
        (c[20] = _),
        (c[21] = k),
        (c[22] = C),
        (c[23] = L),
        (c[24] = P),
        (c[25] = $),
        (c[26] = i));
    } else i = c[26];
    return (
      c[44] !== s || c[45] !== r || c[46] !== i
        ? ((n = (0, t.jsxs)("div", {
            "data-testid": "callout-thread-updates",
            className: s,
            children: [r, i],
          })),
          (c[44] = s),
          (c[45] = r),
          (c[46] = i),
          (c[47] = n))
        : (n = c[47]),
      n
    );
  }
  function ep(e) {
    let a,
      s,
      r,
      i,
      n,
      o,
      d,
      u = (0, l.c)(21),
      { size: m, dense: p, hasIdentity: x, onExpand: f } = e,
      { t: h } = (0, c.f)(),
      g = p ? "gap-2" : "gap-3",
      y = x ? void 0 : "pl-3";
    return (
      u[0] !== g || u[1] !== y
        ? ((a = (0, z.c)("flex w-full items-center pb-1.5", g, y)),
          (u[0] = g),
          (u[1] = y),
          (u[2] = a))
        : (a = u[2]),
      u[3] !== p || u[4] !== x
        ? ((s = x
            ? (0, t.jsxs)("span", {
                "aria-hidden": !0,
                "data-testid": "callout-thread-spine-dotted",
                className: (0, z.c)(
                  "flex shrink-0 flex-col items-center justify-center gap-[3px] self-stretch py-0.5",
                  p ? "w-8" : "w-9",
                ),
                children: [
                  (0, t.jsx)(ex, {}),
                  (0, t.jsx)(ex, {}),
                  (0, t.jsx)(ex, {}),
                ],
              })
            : null),
          (u[3] = p),
          (u[4] = x),
          (u[5] = s))
        : (s = u[5]),
      u[6] !== f
        ? ((r = (e) => {
            (e.stopPropagation(), f());
          }),
          (u[6] = f),
          (u[7] = r))
        : (r = u[7]),
      u[8] !== p || u[9] !== m
        ? ((i = (0, z.c)(
            "relative z-[2] -my-1 h-6 rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-text-accent",
            p
              ? "text-[12px] text-text-tertiary hover:text-text-primary"
              : (0, z.c)(
                  "text-text-accent hover:underline",
                  "md" === m ? "text-[13px]" : "text-xs",
                ),
            "leading-4",
          )),
          (u[8] = p),
          (u[9] = m),
          (u[10] = i))
        : (i = u[10]),
      u[11] !== h
        ? ((n = h("callouts.thread.show_more_updates")),
          (u[11] = h),
          (u[12] = n))
        : (n = u[12]),
      u[13] !== r || u[14] !== i || u[15] !== n
        ? ((o = (0, t.jsx)("button", {
            type: "button",
            onClick: r,
            "data-testid": "callout-updates-show-more",
            className: i,
            children: n,
          })),
          (u[13] = r),
          (u[14] = i),
          (u[15] = n),
          (u[16] = o))
        : (o = u[16]),
      u[17] !== a || u[18] !== s || u[19] !== o
        ? ((d = (0, t.jsxs)("div", {
            "data-testid": "callout-updates-show-more-row",
            className: a,
            children: [s, o],
          })),
          (u[17] = a),
          (u[18] = s),
          (u[19] = o),
          (u[20] = d))
        : (d = u[20]),
      d
    );
  }
  function ex() {
    let e,
      a = (0, l.c)(1);
    return (
      a[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = (0, t.jsx)("span", {
            className: "block h-1 w-0.5 rounded-full bg-border-tertiary",
          })),
          (a[0] = e))
        : (e = a[0]),
      e
    );
  }
  function ef(e) {
    let n,
      u,
      b,
      v,
      w,
      j,
      _,
      I,
      C,
      S,
      A,
      U,
      q,
      O,
      T,
      E,
      $,
      D,
      F,
      M,
      Q,
      V,
      K,
      H = (0, l.c)(117),
      {
        update: B,
        size: X,
        expandableComments: Z,
        authorName: J,
        authorAddress: Y,
        authorUserId: G,
        authorAvatarUrl: ee,
        authorAvatarDecoration: et,
        authorVerified: el,
        authorProfileId: ea,
        timeAlign: es,
        timeDensity: er,
        hostHref: ei,
        onHostClick: en,
        connectsToNext: eo,
        className: ec,
        dense: eu,
      } = e,
      em = void 0 !== Z && Z,
      ep = void 0 !== el && el,
      ex = void 0 === ea ? "" : ea,
      ef = void 0 === es ? "start" : es,
      ev = void 0 === er ? "comfortable" : er,
      ew = void 0 !== eo && eo,
      ej = void 0 !== eu && eu,
      { t: e_ } = (0, c.f)(),
      ek = ej ? 32 : 36,
      eN = f.I[ej ? "terminal" : "comfortable"],
      [eI, eC] = (0, o.useState)(!1),
      { ipfsPrefix: eS } = (0, P.useIpfsPrefix)(),
      eA = (0, W.f)(et);
    H[0] !== B.calloutId ||
    H[1] !== B.id ||
    H[2] !== B.likeCount ||
    H[3] !== B.likedByViewer ||
    H[4] !== B.mint
      ? ((n = {
          mint: B.mint,
          calloutId: B.calloutId,
          replyId: B.id,
          likeCount: B.likeCount,
          likedByViewer: B.likedByViewer,
        }),
        (H[0] = B.calloutId),
        (H[1] = B.id),
        (H[2] = B.likeCount),
        (H[3] = B.likedByViewer),
        (H[4] = B.mint),
        (H[5] = n))
      : (n = H[5]);
    let eU = (0, g.f)(n),
      eL = !!(J && Y),
      ez = ej ? "gap-2" : "gap-3",
      eP = eL ? void 0 : "pl-3";
    (H[6] !== ez || H[7] !== eP
      ? ((u = (0, z.c)("flex w-full", ez, eP)),
        (H[6] = ez),
        (H[7] = eP),
        (H[8] = u))
      : (u = H[8]),
      H[9] !== Y ||
      H[10] !== ee ||
      H[11] !== eA ||
      H[12] !== J ||
      H[13] !== ex ||
      H[14] !== G ||
      H[15] !== ek ||
      H[16] !== ew ||
      H[17] !== ej ||
      H[18] !== eL ||
      H[19] !== eS
        ? ((b =
            eL && Y
              ? (0, t.jsxs)("div", {
                  className: (0, z.c)(
                    "flex shrink-0 flex-col items-center self-stretch",
                    ej ? "w-8" : "w-9",
                  ),
                  children: [
                    (0, t.jsx)(s.f, {
                      fallbackAvatarUrl: ee ?? null,
                      fallbackUsername: J ?? null,
                      userAddress: Y,
                      userId: G,
                      children: (0, t.jsx)(R.f, {
                        decoration: eA,
                        variant: "list",
                        className: "relative z-[2]",
                        children: (0, t.jsx)(k.o, {
                          profileId: ex,
                          href: (0, a.$)(Y),
                          prefetch: !1,
                          onClick: eb,
                          "aria-label": `Open ${J}'s profile`,
                          className: (0, z.c)(
                            "relative z-[2] block shrink-0 overflow-hidden rounded-full bg-bg-tertiary",
                            ej ? "size-8" : "size-9",
                          ),
                          children: (0, t.jsx)(r.f, {
                            address: Y,
                            alt: J ?? Y,
                            src: ee ?? void 0,
                            width: ek,
                            height: ek,
                            ipfsPrefix: eS,
                            isAnonymous: !1,
                            className: (0, z.c)(
                              "rounded-full object-cover",
                              ej ? "size-8" : "size-9",
                            ),
                          }),
                        }),
                      }),
                    }),
                    ew
                      ? (0, t.jsx)("span", {
                          "aria-hidden": !0,
                          "data-testid": "callout-thread-spine",
                          className:
                            "mt-1 w-0.5 flex-1 rounded-full bg-border-tertiary",
                        })
                      : null,
                  ],
                })
              : null),
          (H[9] = Y),
          (H[10] = ee),
          (H[11] = eA),
          (H[12] = J),
          (H[13] = ex),
          (H[14] = G),
          (H[15] = ek),
          (H[16] = ew),
          (H[17] = ej),
          (H[18] = eL),
          (H[19] = eS),
          (H[20] = b))
        : (b = H[20]));
    let eq = eL && ew ? "pb-4" : void 0;
    (H[21] !== eq
      ? ((v = (0, z.c)("flex min-w-0 flex-1 flex-col items-start gap-1", eq)),
        (H[21] = eq),
        (H[22] = v))
      : (v = H[22]),
      H[23] !== Y ||
      H[24] !== ee ||
      H[25] !== J ||
      H[26] !== ex ||
      H[27] !== G ||
      H[28] !== ep ||
      H[29] !== ej ||
      H[30] !== eL ||
      H[31] !== X ||
      H[32] !== ef ||
      H[33] !== ev ||
      H[34] !== B.createdAt
        ? ((w =
            eL && Y
              ? (0, t.jsxs)("div", {
                  className: "flex w-full items-center gap-1.5",
                  children: [
                    (0, t.jsxs)("span", {
                      className: "flex min-w-0 items-center gap-1",
                      children: [
                        (0, t.jsx)(s.f, {
                          fallbackAvatarUrl: ee ?? null,
                          fallbackUsername: J ?? null,
                          userAddress: Y,
                          userId: G,
                          children: (0, t.jsx)(k.o, {
                            profileId: ex,
                            href: (0, a.$)(Y),
                            prefetch: !1,
                            onClick: ey,
                            className: (0, z.c)(
                              "relative z-[2] max-w-full truncate whitespace-nowrap text-text-primary hover:underline",
                              ej
                                ? "text-[13px] font-medium leading-4"
                                : "text-sm font-medium leading-[18px]",
                            ),
                            children: J,
                          }),
                        }),
                        ep ? (0, t.jsx)(i.f, { size: ej ? 14 : 18 }) : null,
                      ],
                    }),
                    (0, t.jsx)(N.f, {
                      timestamp: B.createdAt,
                      density: ev,
                      className: (0, z.c)(
                        "min-w-0 truncate leading-4",
                        ej
                          ? "text-[11px] text-text-quaternary"
                          : (0, z.c)(
                              "text-text-tertiary",
                              "md" === X ? "text-[13px]" : "text-xs",
                            ),
                        "end" === ef ? "flex-1 text-right" : "shrink-0",
                      ),
                    }),
                  ],
                })
              : null),
          (H[23] = Y),
          (H[24] = ee),
          (H[25] = J),
          (H[26] = ex),
          (H[27] = G),
          (H[28] = ep),
          (H[29] = ej),
          (H[30] = eL),
          (H[31] = X),
          (H[32] = ef),
          (H[33] = ev),
          (H[34] = B.createdAt),
          (H[35] = w))
        : (w = H[35]));
    let eO = eL ? "text-text-secondary" : "text-text-tertiary",
      eT = "md" === X ? "text-[13px]" : "text-xs";
    (H[36] !== ec || H[37] !== eO || H[38] !== eT
      ? ((j = (0, z.c)(
          "w-full whitespace-pre-wrap break-words leading-4",
          eO,
          eT,
          ec,
        )),
        (H[36] = ec),
        (H[37] = eO),
        (H[38] = eT),
        (H[39] = j))
      : (j = H[39]),
      H[40] !== eL || H[41] !== e_ || H[42] !== ev || H[43] !== B.createdAt
        ? ((_ = eL
            ? null
            : (0, t.jsxs)(t.Fragment, {
                children: [
                  (0, t.jsx)("span", {
                    className: "font-medium text-text-accent",
                    children: e_("web.callouts.update_label"),
                  }),
                  (0, t.jsx)("span", { "aria-hidden": !0, children: " · " }),
                  (0, t.jsx)(N.f, { timestamp: B.createdAt, density: ev }),
                  (0, t.jsx)("span", { "aria-hidden": !0, children: " — " }),
                ],
              })),
          (H[40] = eL),
          (H[41] = e_),
          (H[42] = ev),
          (H[43] = B.createdAt),
          (H[44] = _))
        : (_ = H[44]));
    let eE = eL ? void 0 : "text-text-secondary";
    (H[45] !== ev || H[46] !== B.content
      ? ((I = (0, t.jsx)(y.f, { content: B.content, density: ev })),
        (H[45] = ev),
        (H[46] = B.content),
        (H[47] = I))
      : (I = H[47]),
      H[48] !== eE || H[49] !== I
        ? ((C = (0, t.jsx)("span", { className: eE, children: I })),
          (H[48] = eE),
          (H[49] = I),
          (H[50] = C))
        : (C = H[50]),
      H[51] !== j || H[52] !== _ || H[53] !== C
        ? ((S = (0, t.jsxs)("p", {
            "data-testid": "callout-update",
            className: j,
            children: [_, C],
          })),
          (H[51] = j),
          (H[52] = _),
          (H[53] = C),
          (H[54] = S))
        : (S = H[54]),
      H[55] !== ej || H[56] !== ei || H[57] !== en || H[58] !== B.mediaUrl
        ? ((A = B.mediaUrl
            ? (0, t.jsx)(d.f, {
                src: B.mediaUrl,
                testId: "callout-update-media",
                hostHref: ei,
                onHostClick: en,
                dense: ej,
              })
            : null),
          (H[55] = ej),
          (H[56] = ei),
          (H[57] = en),
          (H[58] = B.mediaUrl),
          (H[59] = A))
        : (A = H[59]),
      H[60] !== J ||
      H[61] !== eN ||
      H[62] !== eL ||
      H[63] !== e_ ||
      H[64] !== B.calloutId ||
      H[65] !== B.id ||
      H[66] !== B.mint
        ? ((U = eL
            ? (0, t.jsx)(x.f, {
                sharePath: `/callouts/${B.mint}/${B.calloutId}/${B.id}`,
                shareTitle: J
                  ? e_("web.callouts.update_share_title", { name: J })
                  : e_("web.callouts.update_share_title_anonymous"),
                children: (0, t.jsx)("button", {
                  type: "button",
                  "aria-label": e_("web.callouts.share_update_a11y"),
                  "data-testid": "callout-update-shares",
                  onClick: eg,
                  className: (0, z.c)(
                    "relative z-[2]",
                    eN,
                    f.L,
                    "text-text-quaternary hover:text-text-primary",
                  ),
                  children: (0, t.jsx)(p.q4, { className: f.d }),
                }),
              })
            : null),
          (H[60] = J),
          (H[61] = eN),
          (H[62] = eL),
          (H[63] = e_),
          (H[64] = B.calloutId),
          (H[65] = B.id),
          (H[66] = B.mint),
          (H[67] = U))
        : (U = H[67]),
      H[68] !== eU
        ? ((q = (e) => {
            (e.stopPropagation(), eU.toggle());
          }),
          (H[68] = eU),
          (H[69] = q))
        : (q = H[69]),
      H[70] !== eU.isLiked || H[71] !== e_
        ? ((O = e_(
            eU.isLiked
              ? "web.callouts.unlike_update_a11y"
              : "web.callouts.like_update_a11y",
          )),
          (H[70] = eU.isLiked),
          (H[71] = e_),
          (H[72] = O))
        : (O = H[72]));
    let eR = eU.isLiked;
    return (
      H[73] !== eN || H[74] !== eU.isLiked
        ? ((T = (0, z.c)(
            "relative z-[2] w-fit",
            eN,
            eU.isLiked
              ? "text-text-primary"
              : (0, z.c)("text-text-quaternary", h.$),
            f.L,
          )),
          (H[73] = eN),
          (H[74] = eU.isLiked),
          (H[75] = T))
        : (T = H[75]),
      H[76] !== eU.isLiked
        ? ((E = eU.isLiked
            ? (0, t.jsx)(m.cJ, { className: (0, z.c)(f.d, h.k) })
            : (0, t.jsx)(p.cJ, { className: f.d })),
          (H[76] = eU.isLiked),
          (H[77] = E))
        : (E = H[77]),
      H[78] !== eU.likeCount
        ? (($ = eU.likeCount > 0 ? (0, L.O)(eU.likeCount) : null),
          (H[78] = eU.likeCount),
          (H[79] = $))
        : ($ = H[79]),
      H[80] !== eU.isLiked ||
      H[81] !== q ||
      H[82] !== O ||
      H[83] !== T ||
      H[84] !== E ||
      H[85] !== $
        ? ((D = (0, t.jsxs)("button", {
            type: "button",
            onClick: q,
            "aria-label": O,
            "aria-pressed": eR,
            "data-testid": "callout-update-like",
            className: T,
            children: [E, $],
          })),
          (H[80] = eU.isLiked),
          (H[81] = q),
          (H[82] = O),
          (H[83] = T),
          (H[84] = E),
          (H[85] = $),
          (H[86] = D))
        : (D = H[86]),
      H[87] !== J ||
      H[88] !== eN ||
      H[89] !== eI ||
      H[90] !== em ||
      H[91] !== eL ||
      H[92] !== e_ ||
      H[93] !== B.replyCount
        ? ((F =
            eL && em
              ? (0, t.jsxs)("button", {
                  type: "button",
                  onClick: (e) => {
                    (e.stopPropagation(), eC(eh));
                  },
                  "aria-label": eI
                    ? e_("web.callouts.hide_comments_a11y")
                    : B.replyCount
                      ? e_("web.callouts.view_comments_a11y", {
                          count: B.replyCount,
                        })
                      : e_("callouts.reply.title", { username: J }),
                  "aria-expanded": eI,
                  "data-testid": "callout-update-comments-toggle",
                  className: (0, z.c)(
                    "relative z-[2] w-fit",
                    eN,
                    f.L,
                    eI
                      ? "text-text-secondary"
                      : "text-text-quaternary hover:text-text-primary",
                  ),
                  children: [
                    (0, t.jsx)(p.Z2, { className: f.d }),
                    null != B.replyCount ? (0, L.O)(B.replyCount) : null,
                  ],
                })
              : eL && null != B.replyCount
                ? (0, t.jsxs)("span", {
                    "data-testid": "callout-update-comments-count",
                    "aria-label": e_("web.callouts.comments_count", {
                      count: B.replyCount,
                    }),
                    className: (0, z.c)("w-fit text-text-quaternary", eN),
                    children: [
                      (0, t.jsx)(p.Z2, { className: f.d }),
                      (0, L.O)(B.replyCount),
                    ],
                  })
                : null),
          (H[87] = J),
          (H[88] = eN),
          (H[89] = eI),
          (H[90] = em),
          (H[91] = eL),
          (H[92] = e_),
          (H[93] = B.replyCount),
          (H[94] = F))
        : (F = H[94]),
      H[95] !== U || H[96] !== D || H[97] !== F
        ? ((M = (0, t.jsxs)("div", {
            "data-testid": "callout-update-metrics",
            className: "-ml-[5px] flex w-fit items-center",
            children: [U, D, F],
          })),
          (H[95] = U),
          (H[96] = D),
          (H[97] = F),
          (H[98] = M))
        : (M = H[98]),
      H[99] !== J ||
      H[100] !== eI ||
      H[101] !== B.calloutId ||
      H[102] !== B.id ||
      H[103] !== B.mint ||
      H[104] !== B.replyCount
        ? ((Q = eI
            ? (0, t.jsx)(ed, {
                mint: B.mint,
                calloutId: B.calloutId,
                parentReplyId: B.id,
                commentCount: B.replyCount,
                parentAuthorName: J,
                className: "pt-1",
              })
            : null),
          (H[99] = J),
          (H[100] = eI),
          (H[101] = B.calloutId),
          (H[102] = B.id),
          (H[103] = B.mint),
          (H[104] = B.replyCount),
          (H[105] = Q))
        : (Q = H[105]),
      H[106] !== v ||
      H[107] !== w ||
      H[108] !== S ||
      H[109] !== A ||
      H[110] !== M ||
      H[111] !== Q
        ? ((V = (0, t.jsxs)("div", {
            className: v,
            children: [w, S, A, M, Q],
          })),
          (H[106] = v),
          (H[107] = w),
          (H[108] = S),
          (H[109] = A),
          (H[110] = M),
          (H[111] = Q),
          (H[112] = V))
        : (V = H[112]),
      H[113] !== u || H[114] !== b || H[115] !== V
        ? ((K = (0, t.jsxs)("div", {
            "data-testid": "callout-update-row",
            className: u,
            children: [b, V],
          })),
          (H[113] = u),
          (H[114] = b),
          (H[115] = V),
          (H[116] = K))
        : (K = H[116]),
      K
    );
  }
  function eh(e) {
    return !e;
  }
  function eg(e) {
    return e.stopPropagation();
  }
  function ey(e) {
    return e.stopPropagation();
  }
  function eb(e) {
    return e.stopPropagation();
  }
  (e.s(
    [
      "O",
      0,
      ec,
      "k",
      0,
      function (e) {
        let t,
          a,
          s,
          r,
          i = (0, l.c)(19),
          { mint: n, calloutId: o, authorAddress: c, viewerAddress: d } = e,
          u = !!(n && o);
        i[0] !== c || i[1] !== o || i[2] !== u || i[3] !== n
          ? ((t = { mint: n, calloutId: o, authorAddress: c, enabled: u }),
            (i[0] = c),
            (i[1] = o),
            (i[2] = u),
            (i[3] = n),
            (i[4] = t))
          : (t = i[4]);
        let m = er(t);
        i[5] !== c || i[6] !== o || i[7] !== u || i[8] !== n
          ? ((a = { mint: n, calloutId: o, authorAddress: c, enabled: u }),
            (i[5] = c),
            (i[6] = o),
            (i[7] = u),
            (i[8] = n),
            (i[9] = a))
          : (a = i[9]);
        let { replies: p } = en(a),
          x = null;
        if (i[10] !== m || i[11] !== x) {
          for (let e of m) (null === x || e.createdAt > x) && (x = e.createdAt);
          ((i[10] = m), (i[11] = x), (i[12] = x));
        } else x = i[12];
        let f = x;
        i[13] !== p || i[14] !== d
          ? ((s = ec(p, d)), (i[13] = p), (i[14] = d), (i[15] = s))
          : (s = i[15]);
        let h = s;
        return (
          i[16] !== f || i[17] !== h
            ? ((r = { latestAuthorUpdateAtMs: f, latestViewerReplyAtMs: h }),
              (i[16] = f),
              (i[17] = h),
              (i[18] = r))
            : (r = i[18]),
          r
        );
      },
    ],
    462570,
  ),
    e.s(["f", 0, ed], 673259));
  var ev = e.i(561259);
  let ew = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" };
  e.s(
    [
      "f",
      0,
      function (e) {
        let m,
          p,
          x,
          f,
          h,
          g,
          b,
          v,
          w,
          j,
          _,
          I,
          C,
          S,
          A,
          U,
          L,
          q,
          O,
          T,
          E,
          $,
          D,
          F,
          M,
          Q,
          V,
          K,
          H,
          B,
          X,
          Z,
          J,
          Y,
          G,
          ee,
          et = (0, l.c)(208),
          {
            authorAddress: el,
            authorUserId: ea,
            authorName: es,
            authorAvatarUrl: er,
            authorAvatarDecoration: ei,
            authorAvatarShape: en,
            authorHref: eo,
            onAuthorClick: ec,
            authorVerified: ed,
            createdAt: eu,
            note: ep,
            mediaUrl: ex,
            mediaPriority: ef,
            updates: eh,
            noteSize: eg,
            updatesCollapsible: ey,
            updatesExpandableComments: eb,
            timeAlign: ej,
            topRight: e_,
            topRightAlign: ek,
            nameAdornment: eN,
            children: eI,
            contentGap: eC,
            aside: eS,
            below: eA,
            href: eU,
            prefetch: eL,
            linkProps: ez,
            id: eP,
            rootRef: eq,
            density: eO,
            divider: eT,
            onClick: eE,
            className: eR,
            testId: e$,
            noteTestId: eD,
            forceThreadRail: eF,
            noteClassName: eM,
            noteClampLines: eQ,
          } = e,
          eV = void 0 === en ? "circle" : en,
          eK = void 0 !== ed && ed,
          eH = void 0 !== ef && ef,
          eB = void 0 === eg ? "sm" : eg,
          eW = void 0 === ey || ey,
          eX = void 0 !== eb && eb,
          eZ = void 0 === ej ? "start" : ej,
          eJ = void 0 === ek ? "end" : ek,
          eY = void 0 === eC ? "sm" : eC,
          eG = void 0 !== eL && eL,
          e1 = void 0 === eO ? "comfortable" : eO,
          e0 = void 0 === eT ? "hairline" : eT,
          e2 = void 0 === eD ? "callout-note" : eD,
          e3 = void 0 !== eF && eF,
          { t: e4 } = (0, c.f)(),
          e5 = "dense" === e1,
          e6 = "comfortable" === e1,
          e8 = e5 ? 32 : 36,
          { ipfsPrefix: e7 } = (0, P.useIpfsPrefix)(),
          e9 = (0, W.f)(ei),
          te = eU ? "relative z-[2]" : void 0,
          tt = eU
            ? "relative z-[2] pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_label]:pointer-events-auto [&_textarea]:pointer-events-auto [&_[data-compose-box]]:pointer-events-auto"
            : void 0;
        et[0] !== eE
          ? ((m = (e) => {
              !eE ||
                e.target.closest(
                  "button, a, textarea, input, label, [data-compose-box]",
                ) ||
                eE(e);
            }),
            (et[0] = eE),
            (et[1] = m))
          : (m = et[1]);
        let tl = m;
        et[2] !== ep
          ? ((p = ep?.trim()), (et[2] = ep), (et[3] = p))
          : (p = et[3]);
        let ta = p,
          [ts, tr] = (0, o.useState)(!1),
          [ti, tn] = (0, o.useState)(!1),
          to = (0, o.useRef)(null),
          tc = !!(eQ && ta);
        (et[4] !== tc
          ? ((x = () => {
              if (!tc) return;
              let e = to.current;
              if (!e) return;
              let t = () => tn(e.scrollHeight > e.clientHeight + 1);
              if ((t(), "u" < typeof ResizeObserver)) return;
              let l = new ResizeObserver(t);
              return (l.observe(e), () => l.disconnect());
            }),
            (f = [tc]),
            (et[4] = tc),
            (et[5] = x),
            (et[6] = f))
          : ((x = et[5]), (f = et[6])),
          (0, o.useEffect)(x, f));
        let td = e5
            ? "text-[13px] leading-[18px]"
            : "lg" === eB
              ? "text-[15px] leading-5"
              : "md" === eB
                ? "text-sm leading-[18px]"
                : "text-xs leading-4",
          tu = eQ && !ts && ew[eQ];
        et[7] !== eM || et[8] !== td || et[9] !== tu
          ? ((h = (0, z.c)(
              "w-full whitespace-pre-wrap break-words text-text-primary",
              td,
              eM,
              tu,
            )),
            (et[7] = eM),
            (et[8] = td),
            (et[9] = tu),
            (et[10] = h))
          : (h = et[10]);
        let tm = h,
          tp = !!eh?.length;
        et[11] !== el || et[12] !== eo
          ? ((g = void 0 === eo ? (0, a.$)(el) : eo),
            (et[11] = el),
            (et[12] = eo),
            (et[13] = g))
          : (g = et[13]);
        let tx = g;
        et[14] !== tx
          ? ((b = tx?.startsWith("/profile/") ?? !1),
            (et[14] = tx),
            (et[15] = b))
          : (b = et[15]);
        let tf = b,
          th = void 0 === eo ? el : "";
        if (
          et[16] !== eS ||
          et[17] !== el ||
          et[18] !== eV ||
          et[19] !== er ||
          et[20] !== e9 ||
          et[21] !== es ||
          et[22] !== ea ||
          et[23] !== e8 ||
          et[24] !== eA ||
          et[25] !== eR ||
          et[26] !== e6 ||
          et[27] !== e5 ||
          et[28] !== e0 ||
          et[29] !== e3 ||
          et[30] !== tl ||
          et[31] !== tf ||
          et[32] !== tp ||
          et[33] !== eU ||
          et[34] !== eP ||
          et[35] !== tx ||
          et[36] !== e7 ||
          et[37] !== ez ||
          et[38] !== ec ||
          et[39] !== eE ||
          et[40] !== eG ||
          et[41] !== te ||
          et[42] !== eq ||
          et[43] !== th ||
          et[44] !== e$
        ) {
          let e,
            l,
            a,
            i,
            o,
            c,
            d,
            u = (0, z.c)(
              "block shrink-0 overflow-hidden bg-bg-tertiary",
              e5 ? "size-8" : "size-9",
              "squircle" === eV ? "rounded-xl" : "rounded-full",
            ),
            m = er ?? void 0,
            p = e5 ? "size-8" : "size-9",
            x = "squircle" === eV ? "rounded-xl" : "rounded-full";
          (et[57] !== p || et[58] !== x
            ? ((e = (0, z.c)("object-cover", p, x)),
              (et[57] = p),
              (et[58] = x),
              (et[59] = e))
            : (e = et[59]),
            et[60] !== el ||
            et[61] !== es ||
            et[62] !== e8 ||
            et[63] !== e7 ||
            et[64] !== m ||
            et[65] !== e
              ? ((l = (0, t.jsx)(r.f, {
                  address: el,
                  alt: es,
                  src: m,
                  width: e8,
                  height: e8,
                  ipfsPrefix: e7,
                  isAnonymous: !1,
                  className: e,
                })),
                (et[60] = el),
                (et[61] = es),
                (et[62] = e8),
                (et[63] = e7),
                (et[64] = m),
                (et[65] = e),
                (et[66] = l))
              : (l = et[66]));
          let f = l;
          et[67] !== el ||
          et[68] !== er ||
          et[69] !== es ||
          et[70] !== ea ||
          et[71] !== tf
            ? ((a = (e) =>
                tf
                  ? (0, t.jsx)(s.f, {
                      fallbackAvatarUrl: er ?? null,
                      fallbackUsername: es,
                      userAddress: el,
                      userId: ea,
                      children: e,
                    })
                  : e),
              (et[67] = el),
              (et[68] = er),
              (et[69] = es),
              (et[70] = ea),
              (et[71] = tf),
              (et[72] = a))
            : (a = et[72]);
          let h = a,
            g = (0, z.c)(
              "max-w-full truncate whitespace-nowrap font-medium text-text-primary",
              e5
                ? "text-[13px] leading-4"
                : e6
                  ? "text-sm leading-5"
                  : "text-sm leading-[18px]",
            );
          ((C = eP),
            (S = eq),
            (A = e$ ?? "callout-feed-card"),
            (U = !eU && eE ? tl : void 0));
          let y = "none" !== e0 && "border-b border-border-secondary",
            b = e6 ? "py-4" : "py-2",
            N = eU && "relative",
            P =
              (eU || eE) &&
              "cursor-pointer transition-colors hover:bg-bg-tertiary";
          (et[73] !== eR ||
          et[74] !== y ||
          et[75] !== b ||
          et[76] !== N ||
          et[77] !== P
            ? ((L = (0, z.c)("flex w-full flex-col", y, b, N, P, eR)),
              (et[73] = eR),
              (et[74] = y),
              (et[75] = b),
              (et[76] = N),
              (et[77] = P),
              (et[78] = L))
            : (L = et[78]),
            et[79] !== es ||
            et[80] !== eU ||
            et[81] !== ez ||
            et[82] !== eE ||
            et[83] !== eG
              ? ((q = eU
                  ? (0, t.jsx)(n.default, {
                      href: eU,
                      prefetch: eG,
                      ...ez,
                      onClick: eE,
                      "aria-label": `Open ${es}'s callout`,
                      className: "absolute inset-0 z-[1] focus-inset",
                    })
                  : null),
                (et[79] = es),
                (et[80] = eU),
                (et[81] = ez),
                (et[82] = eE),
                (et[83] = eG),
                (et[84] = q))
              : (q = et[84]),
            et[85] !== eS || et[86] !== eA || et[87] !== e5
              ? ((_ = (0, z.c)(
                  "w-full items-start",
                  eS || eA
                    ? (0, z.c)(
                        "grid",
                        e5 ? "gap-x-2" : "gap-x-3",
                        eS
                          ? "grid-cols-[auto_minmax(0,1fr)_auto]"
                          : "grid-cols-[auto_minmax(0,1fr)]",
                      )
                    : (0, z.c)("flex", e5 ? "gap-2" : "gap-3"),
                )),
                (et[85] = eS),
                (et[86] = eA),
                (et[87] = e5),
                (et[88] = _))
              : (_ = et[88]));
          let T = eA && "row-span-2";
          et[89] !== T
            ? ((i = (0, z.c)(
                "flex shrink-0 flex-col items-center self-stretch",
                T,
              )),
              (et[89] = T),
              (et[90] = i))
            : (i = et[90]);
          let E = tx
            ? (0, t.jsx)(k.o, {
                profileId: th,
                href: tx,
                prefetch: !1,
                onClick: (e) => {
                  (e.stopPropagation(), ec?.());
                },
                "aria-label": `Open ${es}'s profile`,
                className: (0, z.c)(u, te),
                children: f,
              })
            : (0, t.jsx)("span", {
                "data-testid": "callout-author-avatar",
                className: u,
                children: f,
              });
          (et[91] !== e9 || et[92] !== E
            ? ((o = (0, t.jsx)(R.f, {
                decoration: e9,
                variant: "list",
                children: E,
              })),
              (et[91] = e9),
              (et[92] = E),
              (et[93] = o))
            : (o = et[93]),
            et[94] !== o || et[95] !== h
              ? ((c = h(o)), (et[94] = o), (et[95] = h), (et[96] = c))
              : (c = et[96]),
            et[97] !== e3 || et[98] !== tp
              ? ((d =
                  tp || e3
                    ? (0, t.jsx)("span", {
                        "aria-hidden": !0,
                        "data-testid": "callout-thread-spine",
                        className:
                          "my-1 w-0.5 flex-1 rounded-full bg-border-tertiary",
                      })
                    : null),
                (et[97] = e3),
                (et[98] = tp),
                (et[99] = d))
              : (d = et[99]),
            et[100] !== i || et[101] !== c || et[102] !== d
              ? ((I = (0, t.jsxs)("div", { className: i, children: [c, d] })),
                (et[100] = i),
                (et[101] = c),
                (et[102] = d),
                (et[103] = I))
              : (I = et[103]));
          let $ = e5 ? "gap-1" : "gap-1.5";
          (et[104] !== $
            ? ((j = (0, z.c)("flex min-w-0 flex-1 flex-col", $)),
              (et[104] = $),
              (et[105] = j))
            : (j = et[105]),
            (w = "flex w-full items-center gap-1.5"),
            (v = "flex min-w-0 items-center gap-1"),
            (O = h(
              tx
                ? (0, t.jsx)(k.o, {
                    profileId: th,
                    href: tx,
                    prefetch: !1,
                    onClick: (e) => {
                      (e.stopPropagation(), ec?.());
                    },
                    className: (0, z.c)(g, "hover:underline", te),
                    children: es,
                  })
                : (0, t.jsx)("span", {
                    "data-testid": "callout-author-name",
                    className: g,
                    children: es,
                  }),
            )),
            (et[16] = eS),
            (et[17] = el),
            (et[18] = eV),
            (et[19] = er),
            (et[20] = e9),
            (et[21] = es),
            (et[22] = ea),
            (et[23] = e8),
            (et[24] = eA),
            (et[25] = eR),
            (et[26] = e6),
            (et[27] = e5),
            (et[28] = e0),
            (et[29] = e3),
            (et[30] = tl),
            (et[31] = tf),
            (et[32] = tp),
            (et[33] = eU),
            (et[34] = eP),
            (et[35] = tx),
            (et[36] = e7),
            (et[37] = ez),
            (et[38] = ec),
            (et[39] = eE),
            (et[40] = eG),
            (et[41] = te),
            (et[42] = eq),
            (et[43] = th),
            (et[44] = e$),
            (et[45] = v),
            (et[46] = w),
            (et[47] = j),
            (et[48] = _),
            (et[49] = I),
            (et[50] = C),
            (et[51] = S),
            (et[52] = A),
            (et[53] = U),
            (et[54] = L),
            (et[55] = q),
            (et[56] = O));
        } else
          ((v = et[45]),
            (w = et[46]),
            (j = et[47]),
            (_ = et[48]),
            (I = et[49]),
            (C = et[50]),
            (S = et[51]),
            (A = et[52]),
            (U = et[53]),
            (L = et[54]),
            (q = et[55]),
            (O = et[56]));
        (et[106] !== eK || et[107] !== e5
          ? ((T = eK ? (0, t.jsx)(i.f, { size: e5 ? 14 : 18 }) : null),
            (et[106] = eK),
            (et[107] = e5),
            (et[108] = T))
          : (T = et[108]),
          et[109] !== v || et[110] !== O || et[111] !== T
            ? ((E = (0, t.jsxs)("span", { className: v, children: [O, T] })),
              (et[109] = v),
              (et[110] = O),
              (et[111] = T),
              (et[112] = E))
            : (E = et[112]),
          et[113] !== eN || et[114] !== te
            ? (($ = eN
                ? (0, t.jsx)("div", {
                    "data-testid": "callout-name-adornment",
                    className: (0, z.c)("shrink-0", te),
                    children: eN,
                  })
                : null),
              (et[113] = eN),
              (et[114] = te),
              (et[115] = $))
            : ($ = et[115]),
          et[116] !== te || et[117] !== eZ || et[118] !== e_
            ? ((D =
                e_ && "end" === eZ
                  ? (0, t.jsx)("div", {
                      className: (0, z.c)("ml-auto shrink-0", te),
                      children: e_,
                    })
                  : null),
              (et[116] = te),
              (et[117] = eZ),
              (et[118] = e_),
              (et[119] = D))
            : (D = et[119]),
          et[120] !== e6 ||
          et[121] !== eu ||
          et[122] !== e5 ||
          et[123] !== eZ ||
          et[124] !== e_
            ? ((F =
                null != eu
                  ? (0, t.jsx)(N.f, {
                      timestamp: eu,
                      density: e6 ? "comfortable" : "terminal",
                      className: (0, z.c)(
                        "min-w-0 truncate",
                        e5
                          ? "text-[11px] leading-4 text-text-quaternary"
                          : e6
                            ? "text-[13px] leading-[18px] text-text-tertiary"
                            : "text-xs leading-4 text-text-tertiary",
                        "end" === eZ
                          ? e_
                            ? "shrink-0"
                            : "flex-1 text-right"
                          : "shrink-0",
                      ),
                    })
                  : null),
              (et[120] = e6),
              (et[121] = eu),
              (et[122] = e5),
              (et[123] = eZ),
              (et[124] = e_),
              (et[125] = F))
            : (F = et[125]),
          et[126] !== te || et[127] !== eZ || et[128] !== e_ || et[129] !== eJ
            ? ((M =
                e_ && "end" !== eZ
                  ? (0, t.jsx)("div", {
                      "data-testid": "callout-top-right",
                      className: (0, z.c)(
                        "shrink-0",
                        "end" === eJ && "ml-auto",
                        te,
                      ),
                      children: e_,
                    })
                  : null),
              (et[126] = te),
              (et[127] = eZ),
              (et[128] = e_),
              (et[129] = eJ),
              (et[130] = M))
            : (M = et[130]),
          et[131] !== w ||
          et[132] !== E ||
          et[133] !== $ ||
          et[134] !== D ||
          et[135] !== F ||
          et[136] !== M
            ? ((Q = (0, t.jsxs)("div", {
                className: w,
                children: [E, $, D, F, M],
              })),
              (et[131] = w),
              (et[132] = E),
              (et[133] = $),
              (et[134] = D),
              (et[135] = F),
              (et[136] = M),
              (et[137] = Q))
            : (Q = et[137]),
          et[138] !== e6 || et[139] !== tm || et[140] !== e2 || et[141] !== ta
            ? ((V = ta
                ? (0, t.jsx)("p", {
                    ref: to,
                    "data-testid": e2,
                    className: tm,
                    children: (0, t.jsx)(y.f, {
                      content: ta,
                      density: e6 ? "comfortable" : "terminal",
                    }),
                  })
                : null),
              (et[138] = e6),
              (et[139] = tm),
              (et[140] = e2),
              (et[141] = ta),
              (et[142] = V))
            : (V = et[142]),
          et[143] !== e5 ||
          et[144] !== ti ||
          et[145] !== ts ||
          et[146] !== te ||
          et[147] !== e4
            ? ((K =
                ti && !ts
                  ? (0, t.jsx)("button", {
                      type: "button",
                      "data-testid": "callout-note-show-more",
                      onClick: (e) => {
                        (e.stopPropagation(), tr(!0));
                      },
                      className: (0, z.c)(
                        "-my-1 h-6 self-start rounded-md text-xs font-medium leading-4 outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-text-accent",
                        e5 ? "text-text-tertiary" : "text-text-accent",
                        te,
                      ),
                      children: e4("common.show_more"),
                    })
                  : null),
              (et[143] = e5),
              (et[144] = ti),
              (et[145] = ts),
              (et[146] = te),
              (et[147] = e4),
              (et[148] = K))
            : (K = et[148]),
          et[149] !== e5 ||
          et[150] !== eU ||
          et[151] !== eH ||
          et[152] !== ex ||
          et[153] !== eE
            ? ((H = ex
                ? (0, ev.y)(ex)
                  ? (0, t.jsx)(u.f, {
                      src: ex,
                      testId: "callout-media",
                      dense: e5,
                    })
                  : (0, t.jsx)(d.f, {
                      src: ex,
                      testId: "callout-media",
                      hostHref: eU,
                      onHostClick: eE,
                      dense: e5,
                      priority: eH,
                    })
                : null),
              (et[149] = e5),
              (et[150] = eU),
              (et[151] = eH),
              (et[152] = ex),
              (et[153] = eE),
              (et[154] = H))
            : (H = et[154]),
          et[155] !== eA ||
          et[156] !== eI ||
          et[157] !== eY ||
          et[158] !== e5 ||
          et[159] !== tp ||
          et[160] !== tt
            ? ((B = eI
                ? (0, t.jsx)("div", {
                    className: (0, z.c)(
                      "flex w-full flex-col items-start pt-1",
                      e5 ? "gap-1.5" : "md" === eY ? "gap-3" : "gap-2",
                      tp && !eA && "pb-3",
                      tt,
                    ),
                    children: eI,
                  })
                : null),
              (et[155] = eA),
              (et[156] = eI),
              (et[157] = eY),
              (et[158] = e5),
              (et[159] = tp),
              (et[160] = tt),
              (et[161] = B))
            : (B = et[161]),
          et[162] !== j ||
          et[163] !== Q ||
          et[164] !== V ||
          et[165] !== K ||
          et[166] !== H ||
          et[167] !== B
            ? ((X = (0, t.jsxs)("div", {
                className: j,
                children: [Q, V, K, H, B],
              })),
              (et[162] = j),
              (et[163] = Q),
              (et[164] = V),
              (et[165] = K),
              (et[166] = H),
              (et[167] = B),
              (et[168] = X))
            : (X = et[168]),
          et[169] !== eS || et[170] !== tt
            ? ((Z = eS
                ? (0, t.jsx)("div", {
                    "data-testid": "callout-aside",
                    className: (0, z.c)("shrink-0 self-start", tt),
                    children: eS,
                  })
                : null),
              (et[169] = eS),
              (et[170] = tt),
              (et[171] = Z))
            : (Z = et[171]),
          et[172] !== eA || et[173] !== tp || et[174] !== tt
            ? ((J = eA
                ? (0, t.jsx)("div", {
                    "data-testid": "callout-below",
                    className: (0, z.c)(
                      "col-start-2 -col-end-1 min-w-0",
                      tp && "pb-3",
                      tt,
                    ),
                    children: eA,
                  })
                : null),
              (et[172] = eA),
              (et[173] = tp),
              (et[174] = tt),
              (et[175] = J))
            : (J = et[175]),
          et[176] !== _ ||
          et[177] !== I ||
          et[178] !== X ||
          et[179] !== Z ||
          et[180] !== J
            ? ((Y = (0, t.jsxs)("div", {
                className: _,
                children: [I, X, Z, J],
              })),
              (et[176] = _),
              (et[177] = I),
              (et[178] = X),
              (et[179] = Z),
              (et[180] = J),
              (et[181] = Y))
            : (Y = et[181]));
        let tg = "sm" === eB ? "sm" : "md",
          ty = e6 ? "comfortable" : "terminal";
        return (
          et[182] !== el ||
          et[183] !== ei ||
          et[184] !== er ||
          et[185] !== es ||
          et[186] !== ea ||
          et[187] !== eK ||
          et[188] !== e5 ||
          et[189] !== eU ||
          et[190] !== eE ||
          et[191] !== th ||
          et[192] !== tg ||
          et[193] !== ty ||
          et[194] !== eZ ||
          et[195] !== eh ||
          et[196] !== eW ||
          et[197] !== eX
            ? ((G = (0, t.jsx)(em, {
                updates: eh,
                collapsible: eW,
                expandableComments: eX,
                size: tg,
                dense: e5,
                authorName: es,
                authorAddress: el,
                authorUserId: ea,
                authorAvatarUrl: er,
                authorAvatarDecoration: ei,
                authorVerified: eK,
                authorProfileId: th,
                timeAlign: eZ,
                timeDensity: ty,
                hostHref: eU,
                onHostClick: eE,
              })),
              (et[182] = el),
              (et[183] = ei),
              (et[184] = er),
              (et[185] = es),
              (et[186] = ea),
              (et[187] = eK),
              (et[188] = e5),
              (et[189] = eU),
              (et[190] = eE),
              (et[191] = th),
              (et[192] = tg),
              (et[193] = ty),
              (et[194] = eZ),
              (et[195] = eh),
              (et[196] = eW),
              (et[197] = eX),
              (et[198] = G))
            : (G = et[198]),
          et[199] !== C ||
          et[200] !== S ||
          et[201] !== A ||
          et[202] !== U ||
          et[203] !== L ||
          et[204] !== q ||
          et[205] !== Y ||
          et[206] !== G
            ? ((ee = (0, t.jsxs)("article", {
                id: C,
                ref: S,
                "data-testid": A,
                onClick: U,
                className: L,
                children: [q, Y, G],
              })),
              (et[199] = C),
              (et[200] = S),
              (et[201] = A),
              (et[202] = U),
              (et[203] = L),
              (et[204] = q),
              (et[205] = Y),
              (et[206] = G),
              (et[207] = ee))
            : (ee = et[207]),
          ee
        );
      },
    ],
    204478,
  );
};
