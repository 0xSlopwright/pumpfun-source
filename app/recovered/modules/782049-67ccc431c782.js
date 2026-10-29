// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(157633),
    s = e.i(745018),
    r = e.i(352386);
  e.i(12692);
  var i = e.i(398902),
    n = e.i(177852),
    o = e.i(783358),
    c = e.i(923758),
    d = e.i(787494),
    u = e.i(214111),
    m = e.i(730721),
    p = e.i(267146),
    x = e.i(540805),
    f = e.i(662093),
    h = e.i(338319),
    g = e.i(513433);
  let y = {
      terminal: g.default.chipsDense,
      comfortable: g.default.chipsComfortable,
    },
    b = (e) => (null != e && e > 0 ? (0, x.O)(e) : null);
  function v(e) {
    let a,
      s,
      r,
      i,
      n = (0, l.c)(13),
      {
        icon: c,
        label: d,
        onClick: u,
        ariaLabel: m,
        accent: p,
        active: x,
        testId: f,
      } = e;
    n[0] !== u
      ? ((a = (e) => {
          (e.stopPropagation(), u?.(e));
        }),
        (n[0] = u),
        (n[1] = a))
      : (a = n[1]);
    let g = p ? "text-text-accent" : x ? "text-text-primary" : o.V;
    return (
      n[2] !== g
        ? ((s = (0, h.c)(o._, g)), (n[2] = g), (n[3] = s))
        : (s = n[3]),
      n[4] !== d
        ? ((r =
            null != d
              ? (0, t.jsx)("span", { className: o.c, children: d })
              : null),
          (n[4] = d),
          (n[5] = r))
        : (r = n[5]),
      n[6] !== m ||
      n[7] !== c ||
      n[8] !== a ||
      n[9] !== s ||
      n[10] !== r ||
      n[11] !== f
        ? ((i = (0, t.jsxs)("button", {
            type: "button",
            "aria-label": m,
            "data-testid": f,
            onClick: a,
            className: s,
            children: [c, r],
          })),
          (n[6] = m),
          (n[7] = c),
          (n[8] = a),
          (n[9] = s),
          (n[10] = r),
          (n[11] = f),
          (n[12] = i))
        : (i = n[12]),
      i
    );
  }
  let w = (e) => (null != e && Number.isFinite(e) && e > 0 ? e : null),
    j = (0, r.memo)(function (e) {
      let a,
        s,
        r,
        i,
        n = (0, l.c)(10),
        { marketCap: o, marketCapShort: c, className: d } = e;
      n[0] !== o
        ? ((a = { ...o, significantDigits: p.k }), (n[0] = o), (n[1] = a))
        : (a = n[1]);
      let m = (0, f.I)(a);
      return null == m || !Number.isFinite(m) || m <= 0
        ? null
        : (n[2] !== m
            ? ((s = (0, u.f)(m)), (n[2] = m), (n[3] = s))
            : (s = n[3]),
          n[4] !== s
            ? ((r = (0, t.jsx)("span", {
                "data-testid": "callout-market-cap-value",
                children: s,
              })),
              (n[4] = s),
              (n[5] = r))
            : (r = n[5]),
          n[6] !== d || n[7] !== c || n[8] !== r
            ? ((i = (0, t.jsxs)("span", {
                className: d,
                "data-testid": "callout-action-market-cap",
                children: [r, " ", c],
              })),
              (n[6] = d),
              (n[7] = c),
              (n[8] = r),
              (n[9] = i))
            : (i = n[9]),
          i);
    });
  function _(e) {
    return e.stopPropagation();
  }
  e.s([
    "f",
    0,
    function (e) {
      let r,
        p,
        x,
        k,
        N,
        I,
        C,
        S,
        A,
        U,
        L,
        z,
        P,
        q,
        O,
        T,
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
        B = (0, l.c)(96),
        {
          onUpdateCallout: W,
          replyCount: X,
          onOpenReplies: Z,
          viewCount: J,
          likeCount: Y,
          likedByViewer: G,
          onToggleLike: ee,
          repost: et,
          replay: el,
          shareUrl: ea,
          shareTitle: es,
          onShareOpen: er,
          sharePositionCard: ei,
          currentMarketCap: en,
          liveMarketCap: eo,
          marketCapAlign: ec,
          leading: ed,
          className: eu,
          density: em,
          dense: ep,
        } = e,
        { t: ex } = (0, i.f)(),
        ef = em ?? (void 0 !== ep && ep ? "terminal" : null);
      B[0] !== en || B[1] !== eo
        ? ((r =
            null != eo
              ? (w(eo.fallbackMarketCap) ?? w((0, f.y)(eo)) ?? 123e5)
              : en),
          (B[0] = en),
          (B[1] = eo),
          (B[2] = r))
        : (r = B[2]);
      let eh = r;
      B[3] !== eh
        ? ((p = null != eh && Number.isFinite(eh) && eh > 0),
          (B[3] = eh),
          (B[4] = p))
        : (p = B[4]);
      let eg = p;
      B[5] !== eg || B[6] !== eh
        ? ((x = eg ? (0, u.f)(eh) : null), (B[5] = eg), (B[6] = eh), (B[7] = x))
        : (x = B[7]);
      let ey = x,
        eb = "end" === (void 0 === ec ? "end" : ec) && "ml-auto";
      B[8] !== eb
        ? ((k = (0, h.c)(
            o.c,
            o._,
            "gap-0 text-text-quaternary hover:bg-transparent",
            eb,
          )),
          (B[8] = eb),
          (B[9] = k))
        : (k = B[9]);
      let ev = k;
      B[10] !== ex
        ? ((N = ex("common.market_cap_short")), (B[10] = ex), (B[11] = N))
        : (N = B[11]);
      let ew = N,
        ej = null != ey ? `${ey} ${ew}` : null;
      if (
        B[12] !== eu ||
        B[13] !== ed ||
        B[14] !== Y ||
        B[15] !== ej ||
        B[16] !== W ||
        B[17] !== ef ||
        B[18] !== el ||
        B[19] !== X ||
        B[20] !== et ||
        B[21] !== ea ||
        B[22] !== ex ||
        B[23] !== J
      ) {
        P = W ? ex("callouts.update.cta") : null;
        let e = b(et?.count);
        ((I = b(Y)), (C = b(X)), (q = b(J)));
        let l = [];
        (null != P && l.push({ icon: !0, label: P }),
          ea && l.push({ icon: !0 }),
          el && l.push({ icon: !0 }),
          et && l.push({ icon: !0, label: e }),
          null != Y && l.push({ icon: !0, label: I }),
          null != X && l.push({ icon: !0, label: C }),
          void 0 !== J && l.push({ icon: !0, label: q }),
          null != ej && l.push({ icon: !1, label: ej }));
        let a = ef ? "min-h-6" : "min-h-7";
        (B[33] !== eu || B[34] !== a
          ? ((A = (0, h.c)(a, "flex w-full items-center justify-between", eu)),
            (B[33] = eu),
            (B[34] = a),
            (B[35] = A))
          : (A = B[35]),
          B[36] !== ed
            ? ((U = (0, t.jsx)("div", {
                className: "flex min-w-0 items-center gap-1",
                children: ed,
              })),
              (B[36] = ed),
              (B[37] = U))
            : (U = B[37]),
          (L = "callout-actions-cluster"),
          B[38] === Symbol.for("react.memo_cache_sentinel")
            ? ((z = (0, h.c)("min-w-0 flex-1", g.default.cluster)), (B[38] = z))
            : (z = B[38]),
          (S = (0, o.X)(l)),
          (B[12] = eu),
          (B[13] = ed),
          (B[14] = Y),
          (B[15] = ej),
          (B[16] = W),
          (B[17] = ef),
          (B[18] = el),
          (B[19] = X),
          (B[20] = et),
          (B[21] = ea),
          (B[22] = ex),
          (B[23] = J),
          (B[24] = I),
          (B[25] = C),
          (B[26] = S),
          (B[27] = A),
          (B[28] = U),
          (B[29] = L),
          (B[30] = z),
          (B[31] = P),
          (B[32] = q));
      } else
        ((I = B[24]),
          (C = B[25]),
          (S = B[26]),
          (A = B[27]),
          (U = B[28]),
          (L = B[29]),
          (z = B[30]),
          (P = B[31]),
          (q = B[32]));
      let e_ = ef && y[ef];
      return (
        B[39] !== e_
          ? ((O = (0, h.c)("flex flex-wrap items-center", g.default.chips, e_)),
            (B[39] = e_),
            (B[40] = O))
          : (O = B[40]),
        B[41] !== W || B[42] !== ex || B[43] !== P
          ? ((T =
              null != P
                ? (0, t.jsx)(v, {
                    icon: (0, t.jsx)(s.wh, { className: o.f }),
                    label: P,
                    ariaLabel: ex("web.callouts.update_a11y"),
                    accent: !0,
                    onClick: W,
                    testId: "callout-action-update",
                  })
                : null),
            (B[41] = W),
            (B[42] = ex),
            (B[43] = P),
            (B[44] = T))
          : (T = B[44]),
        B[45] !== er ||
        B[46] !== ef ||
        B[47] !== ei ||
        B[48] !== es ||
        B[49] !== ea ||
        B[50] !== ex
          ? ((E = ea
              ? (0, t.jsx)(n.f, {
                  sharePath: ea,
                  shareTitle: es ?? ex("web.callouts.share_title_default"),
                  onOpen: er,
                  positionCard: ei,
                  dense: "terminal" === ef,
                  children: (0, t.jsx)("button", {
                    type: "button",
                    "aria-label": ex("web.callouts.share_a11y"),
                    "data-testid": "callout-action-share",
                    onClick: _,
                    className: (0, h.c)(o._, o.V),
                    children: (0, t.jsx)(s.q4, { className: o.f }),
                  }),
                })
              : null),
            (B[45] = er),
            (B[46] = ef),
            (B[47] = ei),
            (B[48] = es),
            (B[49] = ea),
            (B[50] = ex),
            (B[51] = E))
          : (E = B[51]),
        B[52] !== el || B[53] !== ex
          ? ((R = el
              ? (0, t.jsx)(v, {
                  icon: (0, t.jsx)(s.WW, { className: o.f }),
                  ariaLabel: ex("web.callouts.replay_a11y"),
                  onClick: () => (0, m.C)({ ...el, initialTab: "replay" }),
                  testId: "callout-action-replay",
                })
              : null),
            (B[52] = el),
            (B[53] = ex),
            (B[54] = R))
          : (R = B[54]),
        B[55] !== ef || B[56] !== et
          ? (($ = et
              ? (0, t.jsx)(c.f, {
                  count: et.count,
                  reposted: et.active,
                  busy: et.busy,
                  onToggleRepost: et.onToggle,
                  onQuote: et.onQuote,
                  dense: "terminal" === ef,
                })
              : null),
            (B[55] = ef),
            (B[56] = et),
            (B[57] = $))
          : ($ = B[57]),
        B[58] !== Y ||
        B[59] !== I ||
        B[60] !== G ||
        B[61] !== ee ||
        B[62] !== ex
          ? ((D =
              null != Y
                ? (0, t.jsx)(v, {
                    icon: G
                      ? (0, t.jsx)(a.cJ, { className: (0, h.c)(o.f, d.k) })
                      : (0, t.jsx)(s.cJ, { className: o.f }),
                    label: I,
                    ariaLabel: ex(
                      G ? "web.callouts.unlike_a11y" : "web.callouts.like_a11y",
                    ),
                    active: G,
                    onClick: ee,
                    testId: "callout-action-like",
                  })
                : null),
            (B[58] = Y),
            (B[59] = I),
            (B[60] = G),
            (B[61] = ee),
            (B[62] = ex),
            (B[63] = D))
          : (D = B[63]),
        B[64] !== Z || B[65] !== X || B[66] !== C || B[67] !== ex
          ? ((F =
              null != X
                ? (0, t.jsx)(v, {
                    icon: (0, t.jsx)(s.Z2, { className: o.f }),
                    label: C,
                    ariaLabel: ex("web.callouts.replies_count", { count: X }),
                    onClick: Z,
                    testId: "callout-action-replies",
                  })
                : null),
            (B[64] = Z),
            (B[65] = X),
            (B[66] = C),
            (B[67] = ex),
            (B[68] = F))
          : (F = B[68]),
        B[69] !== J || B[70] !== q
          ? ((M =
              void 0 !== J
                ? (0, t.jsxs)("span", {
                    className: (0, h.c)(
                      o.c,
                      o._,
                      "text-text-quaternary hover:bg-transparent",
                    ),
                    "data-testid": "callout-action-views",
                    children: [(0, t.jsx)(s.a6, { className: o.f }), q],
                  })
                : null),
            (B[69] = J),
            (B[70] = q),
            (B[71] = M))
          : (M = B[71]),
        B[72] !== eo || B[73] !== ev || B[74] !== ew || B[75] !== ey
          ? ((Q =
              null != eo
                ? (0, t.jsx)(j, {
                    marketCap: eo,
                    marketCapShort: ew,
                    className: ev,
                  })
                : null != ey
                  ? (0, t.jsxs)("span", {
                      className: ev,
                      "data-testid": "callout-action-market-cap",
                      children: [
                        (0, t.jsx)("span", {
                          "data-testid": "callout-market-cap-value",
                          children: ey,
                        }),
                        " ",
                        ew,
                      ],
                    })
                  : null),
            (B[72] = eo),
            (B[73] = ev),
            (B[74] = ew),
            (B[75] = ey),
            (B[76] = Q))
          : (Q = B[76]),
        B[77] !== O ||
        B[78] !== T ||
        B[79] !== E ||
        B[80] !== R ||
        B[81] !== $ ||
        B[82] !== D ||
        B[83] !== F ||
        B[84] !== M ||
        B[85] !== Q
          ? ((V = (0, t.jsx)("div", {
              className: g.default.fitRegular,
              children: (0, t.jsx)("div", {
                className: g.default.fitCompact,
                children: (0, t.jsx)("div", {
                  className: g.default.fitTight,
                  children: (0, t.jsxs)("div", {
                    "data-testid": "callout-actions-chips",
                    className: O,
                    children: [T, E, R, $, D, F, M, Q],
                  }),
                }),
              }),
            })),
            (B[77] = O),
            (B[78] = T),
            (B[79] = E),
            (B[80] = R),
            (B[81] = $),
            (B[82] = D),
            (B[83] = F),
            (B[84] = M),
            (B[85] = Q),
            (B[86] = V))
          : (V = B[86]),
        B[87] !== S || B[88] !== V || B[89] !== L || B[90] !== z
          ? ((K = (0, t.jsx)("div", {
              "data-testid": L,
              className: z,
              style: S,
              children: V,
            })),
            (B[87] = S),
            (B[88] = V),
            (B[89] = L),
            (B[90] = z),
            (B[91] = K))
          : (K = B[91]),
        B[92] !== A || B[93] !== U || B[94] !== K
          ? ((H = (0, t.jsxs)("div", { className: A, children: [U, K] })),
            (B[92] = A),
            (B[93] = U),
            (B[94] = K),
            (B[95] = H))
          : (H = B[95]),
        H
      );
    },
  ]);
};
