// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    n = e.i(745018),
    o = e.i(426091),
    s = e.i(574472),
    r = e.i(599077);
  e.i(12692);
  var a = e.i(398902),
    l = e.i(709108),
    u = e.i(409355);
  e.s([
    "BountiesAlertBanner",
    0,
    function (e) {
      let d,
        c,
        m,
        b,
        f,
        p,
        x,
        h,
        g,
        C,
        v,
        y,
        w = (0, i.c)(38),
        { className: j } = e,
        { t: _ } = (0, a.f)(),
        { address: N } = (0, s.F)(),
        z = (0, r.useRouter)(),
        k = (0, l.f)(N ?? void 0);
      if (!N || !k.hasAttention) return null;
      if (
        w[0] !== k.claimCount ||
        w[1] !== k.disputeCount ||
        w[2] !== k.finalizeCount ||
        w[3] !== _
      ) {
        if (((d = []), k.claimCount > 0)) {
          let e;
          (w[5] !== k.claimCount || w[6] !== _
            ? ((e = _("web.bounties.attention_unclaimed_rewards", {
                count: k.claimCount,
              })),
              (w[5] = k.claimCount),
              (w[6] = _),
              (w[7] = e))
            : (e = w[7]),
            d.push(e));
        }
        if (k.disputeCount > 0) {
          let e;
          (w[8] !== k.disputeCount || w[9] !== _
            ? ((e = _("web.bounties.attention_decisions_in_dispute", {
                count: k.disputeCount,
              })),
              (w[8] = k.disputeCount),
              (w[9] = _),
              (w[10] = e))
            : (e = w[10]),
            d.push(e));
        }
        if (k.finalizeCount > 0) {
          let e;
          (w[11] !== k.finalizeCount || w[12] !== _
            ? ((e = _("web.bounties.attention_expired_to_finalize", {
                count: k.finalizeCount,
              })),
              (w[11] = k.finalizeCount),
              (w[12] = _),
              (w[13] = e))
            : (e = w[13]),
            d.push(e));
        }
        ((w[0] = k.claimCount),
          (w[1] = k.disputeCount),
          (w[2] = k.finalizeCount),
          (w[3] = _),
          (w[4] = d));
      } else d = w[4];
      w[14] !== z
        ? ((c = () => {
            z.push(u.Z);
          }),
          (w[14] = z),
          (w[15] = c))
        : (c = w[15]);
      let S = c;
      (w[16] !== j
        ? ((m = (0, o.c)(
            "flex items-center gap-3 border-b border-positive/20 bg-positive/[0.06] px-4 py-3",
            j,
          )),
          (w[16] = j),
          (w[17] = m))
        : (m = w[17]),
        w[18] === Symbol.for("react.memo_cache_sentinel")
          ? ((b = (0, t.jsx)("span", {
              "aria-hidden": !0,
              className:
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-positive text-bg-primary",
              children: (0, t.jsx)(n.wB, { size: 16 }),
            })),
            (w[18] = b))
          : (b = w[18]),
        w[19] !== _
          ? ((f = _("web.bounties.attention_banner_title")),
            (w[19] = _),
            (w[20] = f))
          : (f = w[20]),
        w[21] !== f
          ? ((p = (0, t.jsx)("span", {
              className: "font-semibold text-white",
              children: f,
            })),
            (w[21] = f),
            (w[22] = p))
          : (p = w[22]));
      let A = d.join(" · ");
      return (
        w[23] !== A
          ? ((x = (0, t.jsx)("span", {
              className: "text-text-secondary",
              children: A,
            })),
            (w[23] = A),
            (w[24] = x))
          : (x = w[24]),
        w[25] !== p || w[26] !== x
          ? ((h = (0, t.jsxs)("div", {
              className: "min-w-0 flex-1 text-sm",
              children: [p, " ", x],
            })),
            (w[25] = p),
            (w[26] = x),
            (w[27] = h))
          : (h = w[27]),
        w[28] !== _
          ? ((g = _("web.bounties.attention_review_now")),
            (w[28] = _),
            (w[29] = g))
          : (g = w[29]),
        w[30] === Symbol.for("react.memo_cache_sentinel")
          ? ((C = (0, t.jsx)(n.kK, { size: 14 })), (w[30] = C))
          : (C = w[30]),
        w[31] !== S || w[32] !== g
          ? ((v = (0, t.jsxs)("button", {
              className:
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-positive px-3.5 text-[13px] font-semibold text-bg-primary transition-colors hover:bg-positive/90",
              "data-testid": "bounties-alert-banner-review",
              onClick: S,
              type: "button",
              children: [g, C],
            })),
            (w[31] = S),
            (w[32] = g),
            (w[33] = v))
          : (v = w[33]),
        w[34] !== v || w[35] !== m || w[36] !== h
          ? ((y = (0, t.jsx)(t.Fragment, {
              children: (0, t.jsxs)("div", {
                "aria-live": "polite",
                className: m,
                "data-testid": "bounties-alert-banner",
                role: "status",
                children: [b, h, v],
              }),
            })),
            (w[34] = v),
            (w[35] = m),
            (w[36] = h),
            (w[37] = y))
          : (y = w[37]),
        y
      );
    },
  ]);
};
