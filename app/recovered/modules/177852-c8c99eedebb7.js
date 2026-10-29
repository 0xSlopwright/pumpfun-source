// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(745018),
    s = e.i(574472),
    r = e.i(352386);
  e.i(12692);
  var i = e.i(398902),
    n = e.i(63289),
    o = e.i(793371),
    c = e.i(711454),
    d = e.i(764844),
    u = e.i(121910),
    m = e.i(355330),
    p = e.i(911134),
    x = e.i(223021),
    f = e.i(390421),
    h = e.i(192943);
  function g(e) {
    return e.stopPropagation();
  }
  function y() {}
  e.s(
    [
      "f",
      0,
      function (e) {
        let b,
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
          Q = (0, l.c)(82),
          {
            sharePath: V,
            shareTitle: K,
            children: H,
            align: B,
            onShared: W,
            onOpen: X,
            positionCard: Z,
            dense: J,
          } = e,
          Y = void 0 === B ? "end" : B,
          G = void 0 !== J && J,
          { t: ee } = (0, i.f)(),
          et = G ? "size-3.5" : "size-4",
          [el, ea] = (0, r.useState)(!1),
          es = (0, c.I)(Z ?? null),
          er = (0, u.f)(),
          { user: ei } = (0, s.F)();
        Q[0] !== V ? ((b = (0, x.c)(V)), (Q[0] = V), (Q[1] = b)) : (b = Q[1]);
        let en = b;
        Q[2] !== es
          ? ((v = () => {
              (ea(!1), es.open());
            }),
            (Q[2] = es),
            (Q[3] = v))
          : (v = Q[3]);
        let eo = v;
        Q[4] !== V ? ((w = (0, h._)(V)), (Q[4] = V), (Q[5] = w)) : (w = Q[5]);
        let ec = el && null === en;
        Q[6] !== w || Q[7] !== ec
          ? ((j = { path: w, enabled: ec }),
            (Q[6] = w),
            (Q[7] = ec),
            (Q[8] = j))
          : (j = Q[8]);
        let ed = (0, m.f)(j);
        Q[9] !== en || Q[10] !== V || Q[11] !== ed || Q[12] !== ei?.username
          ? ((_ = () =>
              en
                ? (0, x.t)({
                    calloutId: en,
                    ref: (0, x.j)(ei?.username),
                    origin: window.location.origin,
                  })
                : (ed ??
                  (0, f.M)(
                    V.startsWith("http") ? V : `${window.location.origin}${V}`,
                  ))),
            (Q[9] = en),
            (Q[10] = V),
            (Q[11] = ed),
            (Q[12] = ei?.username),
            (Q[13] = _))
          : (_ = Q[13]);
        let eu = _;
        Q[14] !== W || Q[15] !== eu || Q[16] !== ee
          ? ((k = () => {
              (navigator.clipboard.writeText(eu()).then(
                () => {
                  (n.c.success(ee("web.callouts.share_link_copied")), W?.());
                },
                () => n.c.error(ee("web.callouts.share_copy_failed")),
              ),
                ea(!1));
            }),
            (Q[14] = W),
            (Q[15] = eu),
            (Q[16] = ee),
            (Q[17] = k))
          : (k = Q[17]);
        let em = k;
        Q[18] !== W || Q[19] !== K || Q[20] !== eu
          ? ((N = () => {
              let e = `https://twitter.com/intent/tweet?text=${encodeURIComponent(K)}&url=${encodeURIComponent(eu())}`;
              (window.open(e, "_blank", "noopener,noreferrer"), W?.(), ea(!1));
            }),
            (Q[18] = W),
            (Q[19] = K),
            (Q[20] = eu),
            (Q[21] = N))
          : (N = Q[21]);
        let ep = N;
        Q[22] !== er || Q[23] !== V
          ? ((I = er ? (0, p.N)(V) : null),
            (Q[22] = er),
            (Q[23] = V),
            (Q[24] = I))
          : (I = Q[24]);
        let ex = I;
        Q[25] !== ex || Q[26] !== W
          ? ((C = () => {
              null !== ex && (ea(!1), (0, o.n)({ url: ex, onSent: W }));
            }),
            (Q[25] = ex),
            (Q[26] = W),
            (Q[27] = C))
          : (C = Q[27]);
        let ef = C;
        Q[28] !== W || Q[29] !== K || Q[30] !== eu
          ? ((S = () => {
              (navigator.share({ title: K, url: eu() }).then(() => W?.(), y),
                ea(!1));
            }),
            (Q[28] = W),
            (Q[29] = K),
            (Q[30] = eu),
            (Q[31] = S))
          : (S = Q[31]);
        let eh = S;
        return (
          Q[32] !== X
            ? ((A = (e) => {
                (ea(e), e && X?.());
              }),
              (Q[32] = X),
              (Q[33] = A))
            : (A = Q[33]),
          Q[34] !== H
            ? ((U = (0, t.jsx)(d.g, { render: H })), (Q[34] = H), (Q[35] = U))
            : (U = Q[35]),
          Q[36] !== et || Q[37] !== Z || Q[38] !== eo || Q[39] !== ee
            ? ((L = Z
                ? (0, t.jsxs)(d.d, {
                    onClick: eo,
                    "data-testid": "callout-share-pnl-card",
                    children: [
                      (0, t.jsx)(a.AS, { className: et }),
                      ee("web.share.pnl_card_action_label"),
                    ],
                  })
                : null),
              (Q[36] = et),
              (Q[37] = Z),
              (Q[38] = eo),
              (Q[39] = ee),
              (Q[40] = L))
            : (L = Q[40]),
          Q[41] !== et
            ? ((z = (0, t.jsx)(a.HU, { className: et })),
              (Q[41] = et),
              (Q[42] = z))
            : (z = Q[42]),
          Q[43] !== ee
            ? ((P = ee("common.copy_link")), (Q[43] = ee), (Q[44] = P))
            : (P = Q[44]),
          Q[45] !== em || Q[46] !== z || Q[47] !== P
            ? ((q = (0, t.jsxs)(d.d, { onClick: em, children: [z, P] })),
              (Q[45] = em),
              (Q[46] = z),
              (Q[47] = P),
              (Q[48] = q))
            : (q = Q[48]),
          Q[49] !== et
            ? ((O = (0, t.jsx)(a.Tc, { className: et })),
              (Q[49] = et),
              (Q[50] = O))
            : (O = Q[50]),
          Q[51] !== ee
            ? ((T = ee("web.callouts.share_on_x")), (Q[51] = ee), (Q[52] = T))
            : (T = Q[52]),
          Q[53] !== ep || Q[54] !== O || Q[55] !== T
            ? ((E = (0, t.jsxs)(d.d, { onClick: ep, children: [O, T] })),
              (Q[53] = ep),
              (Q[54] = O),
              (Q[55] = T),
              (Q[56] = E))
            : (E = Q[56]),
          Q[57] !== ex || Q[58] !== et || Q[59] !== ef || Q[60] !== ee
            ? ((R = ex
                ? (0, t.jsxs)(d.d, {
                    onClick: ef,
                    children: [
                      (0, t.jsx)(a.r4, { className: et }),
                      ee("chat.dms.share.send_in_dm"),
                    ],
                  })
                : null),
              (Q[57] = ex),
              (Q[58] = et),
              (Q[59] = ef),
              (Q[60] = ee),
              (Q[61] = R))
            : (R = Q[61]),
          Q[62] !== et || Q[63] !== eh || Q[64] !== ee
            ? (($ =
                "u" > typeof navigator &&
                "function" == typeof navigator.share &&
                "function" == typeof window.matchMedia &&
                window.matchMedia("(pointer: coarse)").matches
                  ? (0, t.jsxs)(d.d, {
                      onClick: eh,
                      children: [
                        (0, t.jsx)(a.q4, { className: et }),
                        ee("web.callouts.share_via"),
                      ],
                    })
                  : null),
              (Q[62] = et),
              (Q[63] = eh),
              (Q[64] = ee),
              (Q[65] = $))
            : ($ = Q[65]),
          Q[66] !== Y ||
          Q[67] !== G ||
          Q[68] !== L ||
          Q[69] !== q ||
          Q[70] !== E ||
          Q[71] !== R ||
          Q[72] !== $
            ? ((D = (0, t.jsxs)(d.A, {
                align: Y,
                dense: G,
                className: "w-44",
                "data-testid": "callout-share-menu",
                onClick: g,
                children: [L, q, E, R, $],
              })),
              (Q[66] = Y),
              (Q[67] = G),
              (Q[68] = L),
              (Q[69] = q),
              (Q[70] = E),
              (Q[71] = R),
              (Q[72] = $),
              (Q[73] = D))
            : (D = Q[73]),
          Q[74] !== el || Q[75] !== A || Q[76] !== U || Q[77] !== D
            ? ((F = (0, t.jsxs)(d.k, {
                open: el,
                onOpenChange: A,
                modal: !1,
                children: [U, D],
              })),
              (Q[74] = el),
              (Q[75] = A),
              (Q[76] = U),
              (Q[77] = D),
              (Q[78] = F))
            : (F = Q[78]),
          Q[79] !== es.dialog || Q[80] !== F
            ? ((M = (0, t.jsxs)(t.Fragment, { children: [F, es.dialog] })),
              (Q[79] = es.dialog),
              (Q[80] = F),
              (Q[81] = M))
            : (M = Q[81]),
          M
        );
      },
    ],
    177852,
  );
  let b = {
      regular: { padX: 8, padY: 6, gap: 4, icon: 14, text: 12, leading: 16 },
      compact: { padX: 6, padY: 4, gap: 2, icon: 12, text: 11, leading: 16 },
      tight: { padX: 4, padY: 4, gap: 2, icon: 12, text: 10, leading: 12 },
      dense: { padX: 2, padY: 4, gap: 1, icon: 10, text: 9, leading: 12 },
    },
    v = (e) =>
      /[0-9]/.test(e)
        ? 0.62
        : " " === e
          ? 0.21
          : /[.,:;'’]/.test(e)
            ? 0.22
            : "$" === e
              ? 0.66
              : /[MWmw]/.test(e)
                ? 1
                : /[A-Z]/.test(e)
                  ? 0.77
                  : /[a-z]/.test(e)
                    ? 0.55
                    : /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u.test(
                          e,
                        )
                      ? 1.05
                      : 0.66,
    w = (e, t) =>
      0 === e.length
        ? 0
        : Math.max(
            0,
            e.reduce((e, l) => {
              let a, s, r, i;
              return (
                e +
                ((a = b[t]),
                (r = (s = l.label ?? "")
                  ? ((e, t) => {
                      let l = 0;
                      for (let t of e) l += v(t);
                      return l * t;
                    })(s, a.text) + 0.5
                  : 0),
                (i = l.icon && s ? a.gap : 0),
                2 * a.padX + (l.icon ? a.icon : 0) + i + r)
              );
            }, 0) -
              2 * b[t].padX,
          ),
    j = (e) => `${Math.ceil(100 * e) / 100}px`;
  e.s(
    [
      "I",
      0,
      {
        terminal:
          "inline-flex h-6 items-center gap-1 rounded-md px-[5px] text-[11px] leading-4 font-medium tabular-nums",
        comfortable:
          "inline-flex h-6 items-center gap-1 rounded-md px-[5px] text-xs leading-4 font-medium tabular-nums",
      },
      "d",
      0,
      "size-3.5 shrink-0",
      "L",
      0,
      "transition-colors outline-none hover:bg-bg-quaternary focus-visible:ring-2 focus-visible:ring-text-accent",
      "_",
      0,
      "flex items-center justify-center gap-[var(--ar-gap,4px)] rounded-md px-[var(--ar-px,8px)] py-[var(--ar-py,6px)] transition-colors outline-none hover:bg-bg-quaternary focus-visible:ring-2 focus-visible:ring-text-accent",
      "V",
      0,
      "text-text-quaternary hover:text-text-primary",
      "f",
      0,
      "size-[var(--ar-icon,14px)]",
      "c",
      0,
      "whitespace-nowrap font-medium text-[length:var(--ar-text,12px)] leading-[var(--ar-leading,16px)] tabular-nums",
      "X",
      0,
      (e) => ({
        "--ar-fit-regular": j(w(e, "regular")),
        "--ar-fit-compact": j(w(e, "compact")),
        "--ar-fit-tight": j(w(e, "tight")),
      }),
    ],
    783358,
  );
};
