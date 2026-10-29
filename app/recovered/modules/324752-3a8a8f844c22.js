// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(439587),
    s = e.i(352386);
  e.i(12692);
  var r = e.i(398902),
    i = e.i(167958),
    n = e.i(944410),
    o = e.i(132838),
    c = e.i(63289),
    d = e.i(466931),
    u = e.i(402030),
    m = e.i(819757);
  let p = "POST /reports",
    x = [
      ...u.contract["POST /reports"].body.shape.reasons
        .unwrap()
        .element.options.filter((e) => "other" !== e),
      "other",
    ],
    f = [
      "spam",
      "scam_or_impersonation",
      "misleading_financial_claims",
      "harassment_or_hate",
      "sexual_or_graphic",
      "self_harm",
      "illegal_content",
      "csam",
      "other",
    ],
    h = {
      coin: x,
      user: [
        "scam_or_impersonation",
        "spam",
        "harassment_or_hate",
        "misleading_financial_claims",
        "illegal_content",
        "csam",
        "other",
      ],
      callout: f,
      reply: f,
    },
    g = {
      codes: { SELF_REPORT: "web.report.self_report" },
      fallback: "web.report.submit_failed",
    };
  var y = e.i(338319);
  let b = {
    coin: {
      title: "web.report.coin_title",
      description: "web.report.coin_description",
    },
    user: {
      title: "web.report.user_title",
      description: "web.report.user_description",
    },
    callout: {
      title: "web.report.callout_title",
      description: "web.report.callout_description",
    },
    reply: {
      title: "web.report.reply_title",
      description: "web.report.reply_description",
    },
  };
  function v(e) {
    return e.stopPropagation();
  }
  function w(e) {
    let n,
      o,
      c,
      d,
      u,
      x,
      f,
      h,
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
      z,
      P,
      q,
      O,
      T,
      E = (0, l.c)(77),
      {
        description: R,
        isPending: $,
        reasons: D,
        onOpenChange: F,
        onSubmit: M,
      } = e,
      { t: Q } = (0, r.f)();
    E[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = []), (E[0] = n))
      : (n = E[0]);
    let [V, K] = (0, s.useState)(n),
      [H, B] = (0, s.useState)(""),
      [W, X] = (0, s.useState)(null),
      Z = (0, s.useId)();
    E[1] !== H ? ((o = H.trim()), (E[1] = H), (E[2] = o)) : (o = E[2]);
    let J = o;
    E[3] !== V
      ? ((c = V.includes("other")), (E[3] = V), (E[4] = c))
      : (c = E[4]);
    let Y = c,
      G = V.length > 0 && !$ && (!Y || J.length > 0);
    E[5] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = (e) => {
          K((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e]));
        }),
        (E[5] = d))
      : (d = E[5]);
    let ee = d;
    E[6] !== M || E[7] !== V || E[8] !== Q || E[9] !== J
      ? ((u = (e) => {
          (e.preventDefault(),
            0 !== V.length &&
              (X(null),
              M(V, J || void 0, (e) => {
                X(Q((0, m.I)(e, p, g)));
              })));
        }),
        (E[6] = M),
        (E[7] = V),
        (E[8] = Q),
        (E[9] = J),
        (E[10] = u))
      : (u = E[10]);
    let et = u;
    if (
      (E[11] !== R
        ? ((x = (0, t.jsx)("p", {
            className: "text-[13px] leading-[18px] text-text-tertiary",
            children: R,
          })),
          (E[11] = R),
          (E[12] = x))
        : (x = E[12]),
      E[13] !== Q
        ? ((f = Q("web.report.reasons_legend")), (E[13] = Q), (E[14] = f))
        : (f = E[14]),
      E[15] !== f
        ? ((h = (0, t.jsx)("legend", { className: "sr-only", children: f })),
          (E[15] = f),
          (E[16] = h))
        : (h = E[16]),
      E[17] !== Z || E[18] !== D || E[19] !== V || E[20] !== Q)
    ) {
      let e;
      (E[22] !== Z || E[23] !== V || E[24] !== Q
        ? ((e = (e) => {
            let l = `${Z}-${e}`;
            return (0, t.jsxs)(
              "label",
              {
                className:
                  "flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-bg-tertiary has-[input:checked]:bg-bg-tertiary",
                htmlFor: l,
                children: [
                  (0, t.jsx)("input", {
                    checked: V.includes(e),
                    className: "mt-0.5 size-4 shrink-0 accent-bg-accent",
                    id: l,
                    name: Z,
                    onChange: () => ee(e),
                    type: "checkbox",
                    value: e,
                  }),
                  (0, t.jsxs)("span", {
                    className: "flex min-w-0 flex-col gap-0.5",
                    children: [
                      (0, t.jsx)("span", {
                        className:
                          "text-sm leading-5 font-medium text-text-primary",
                        children: Q(`web.report.reason_${e}_label`),
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "text-[13px] leading-[18px] text-text-tertiary",
                        children: Q(`web.report.reason_${e}_description`),
                      }),
                    ],
                  }),
                ],
              },
              e,
            );
          }),
          (E[22] = Z),
          (E[23] = V),
          (E[24] = Q),
          (E[25] = e))
        : (e = E[25]),
        (b = D.map(e)),
        (E[17] = Z),
        (E[18] = D),
        (E[19] = V),
        (E[20] = Q),
        (E[21] = b));
    } else b = E[21];
    E[26] !== h || E[27] !== b
      ? ((v = (0, t.jsxs)("fieldset", {
          className: "-mx-3 flex flex-col",
          children: [h, b],
        })),
        (E[26] = h),
        (E[27] = b),
        (E[28] = v))
      : (v = E[28]);
    let el = `${Z}-details`;
    (E[29] !== Y || E[30] !== Q
      ? ((w = Y
          ? Q("web.bounties.details_required")
          : Q("web.bounties.details_optional")),
        (E[29] = Y),
        (E[30] = Q),
        (E[31] = w))
      : (w = E[31]),
      E[32] !== el || E[33] !== w
        ? ((j = (0, t.jsx)("label", {
            className: "text-xs leading-4 text-text-quaternary",
            htmlFor: el,
            children: w,
          })),
          (E[32] = el),
          (E[33] = w),
          (E[34] = j))
        : (j = E[34]));
    let ea = `${Z}-details`;
    (E[35] === Symbol.for("react.memo_cache_sentinel")
      ? ((_ = (e) => B(e.target.value)), (E[35] = _))
      : (_ = E[35]),
      E[36] !== Y || E[37] !== Q
        ? ((k = Y
            ? Q("web.bounties.report_details_required_placeholder")
            : Q("web.bounties.report_details_optional_placeholder")),
          (E[36] = Y),
          (E[37] = Q),
          (E[38] = k))
        : (k = E[38]),
      E[39] !== H || E[40] !== ea || E[41] !== k
        ? ((N = (0, t.jsx)("textarea", {
            className:
              "min-h-[88px] w-full rounded-md border border-border-tertiary bg-bg-tertiary px-3 py-2.5 text-sm leading-5 text-text-primary outline-none placeholder:text-text-quaternary focus-visible:ring-2 focus-visible:ring-text-accent",
            id: ea,
            maxLength: 1e3,
            onChange: _,
            placeholder: k,
            value: H,
          })),
          (E[39] = H),
          (E[40] = ea),
          (E[41] = k),
          (E[42] = N))
        : (N = E[42]),
      E[43] !== H.length
        ? ((I = (0, t.jsxs)("span", {
            className:
              "self-end text-xs leading-4 tabular-nums text-text-quaternary",
            children: [H.length, "/", 1e3],
          })),
          (E[43] = H.length),
          (E[44] = I))
        : (I = E[44]),
      E[45] !== j || E[46] !== N || E[47] !== I
        ? ((C = (0, t.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [j, N, I],
          })),
          (E[45] = j),
          (E[46] = N),
          (E[47] = I),
          (E[48] = C))
        : (C = E[48]),
      E[49] !== W
        ? ((S = W
            ? (0, t.jsx)("p", {
                className: (0, y.c)("text-[13px] leading-[18px]", "text-loss"),
                role: "alert",
                children: W,
              })
            : null),
          (E[49] = W),
          (E[50] = S))
        : (S = E[50]),
      E[51] !== v || E[52] !== C || E[53] !== S || E[54] !== x
        ? ((A = (0, t.jsxs)(i.K, {
            className: "flex flex-col gap-4",
            children: [x, v, C, S],
          })),
          (E[51] = v),
          (E[52] = C),
          (E[53] = S),
          (E[54] = x),
          (E[55] = A))
        : (A = E[55]),
      E[56] !== F ? ((U = () => F(!1)), (E[56] = F), (E[57] = U)) : (U = E[57]),
      E[58] !== Q
        ? ((L = Q("common.cancel")), (E[58] = Q), (E[59] = L))
        : (L = E[59]),
      E[60] !== $ || E[61] !== U || E[62] !== L
        ? ((z = (0, t.jsx)(a.K, {
            isDisabled: $,
            onClick: U,
            type: "button",
            variant: "secondary",
            size: i.Z,
            children: L,
          })),
          (E[60] = $),
          (E[61] = U),
          (E[62] = L),
          (E[63] = z))
        : (z = E[63]));
    let es = !G;
    return (
      E[64] !== $ || E[65] !== Q
        ? ((P = $
            ? Q("web.bounties.report_submitting")
            : Q("home.bounties.report.details.submit")),
          (E[64] = $),
          (E[65] = Q),
          (E[66] = P))
        : (P = E[66]),
      E[67] !== es || E[68] !== P
        ? ((q = (0, t.jsx)(a.K, {
            isDisabled: es,
            type: "submit",
            variant: "primary",
            size: i.$,
            children: P,
          })),
          (E[67] = es),
          (E[68] = P),
          (E[69] = q))
        : (q = E[69]),
      E[70] !== z || E[71] !== q
        ? ((O = (0, t.jsxs)(i.c, { children: [z, q] })),
          (E[70] = z),
          (E[71] = q),
          (E[72] = O))
        : (O = E[72]),
      E[73] !== et || E[74] !== A || E[75] !== O
        ? ((T = (0, t.jsxs)("form", {
            className: "flex min-h-0 flex-1 flex-col",
            onSubmit: et,
            children: [A, O],
          })),
          (E[73] = et),
          (E[74] = A),
          (E[75] = O),
          (E[76] = T))
        : (T = E[76]),
      T
    );
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let a,
          s,
          u,
          m,
          x,
          f = (0, l.c)(19),
          { open: g, onOpenChange: y, target: j } = e,
          { t: _ } = (0, r.f)();
        f[0] !== y
          ? ((a = { onSuccess: () => y(!1) }), (f[0] = y), (f[1] = a))
          : (a = f[1]);
        let k = ((e) => {
          let t,
            a,
            s,
            i,
            u,
            m,
            x,
            f,
            h = (0, l.c)(18);
          (h[0] !== e
            ? ((t = void 0 === e ? {} : e), (h[0] = e), (h[1] = t))
            : (t = h[1]),
            h[2] !== t
              ? (({ onSuccess: s, onError: a, ...i } = t),
                (h[2] = t),
                (h[3] = a),
                (h[4] = s),
                (h[5] = i))
              : ((a = h[3]), (s = h[4]), (i = h[5])));
          let { t: g } = (0, r.f)(),
            y = (0, n.useClientServerContract)();
          return (
            h[6] !== y
              ? ((u = (e) => {
                  let t,
                    { target: l, reasons: a, details: s } = e;
                  return (t = {
                    api: y,
                    target: l,
                    reasons: a,
                    details: s,
                  }).api(p, {
                    body: {
                      targetKind: t.target.kind,
                      targetId: t.target.id,
                      reasons: t.reasons,
                      details: t.details,
                    },
                  });
                }),
                (h[6] = y),
                (h[7] = u))
              : (u = h[7]),
            h[8] !== s || h[9] !== g
              ? ((m = (e, t, l) => {
                  (c.c.success(
                    e.created
                      ? g("web.report.entity_report_submitted")
                      : g("web.report.already_reported"),
                  ),
                    s?.(e, t, l));
                }),
                (h[8] = s),
                (h[9] = g),
                (h[10] = m))
              : (m = h[10]),
            h[11] !== a
              ? ((x = (e, t, l) => {
                  ((0, d.l)({
                    error: e,
                    feature: "reports",
                    operation: "create",
                    context: {
                      targetKind: t.target.kind,
                      reasons: t.reasons.join(","),
                    },
                  }),
                    a?.(e, t, l));
                }),
                (h[11] = a),
                (h[12] = x))
              : (x = h[12]),
            h[13] !== i || h[14] !== u || h[15] !== m || h[16] !== x
              ? ((f = { ...i, mutationFn: u, onSuccess: m, onError: x }),
                (h[13] = i),
                (h[14] = u),
                (h[15] = m),
                (h[16] = x),
                (h[17] = f))
              : (f = h[17]),
            (0, o.f)(f)
          );
        })(a);
        f[2] !== y || f[3] !== k.isPending
          ? ((s = (e) => {
              k.isPending || y(e);
            }),
            (f[2] = y),
            (f[3] = k.isPending),
            (f[4] = s))
          : (s = f[4]);
        let N = b[j.kind];
        return (
          f[5] !== _ || f[6] !== N.title
            ? ((u = _(N.title)), (f[5] = _), (f[6] = N.title), (f[7] = u))
            : (u = f[7]),
          f[8] !== y || f[9] !== g || f[10] !== k || f[11] !== _ || f[12] !== j
            ? ((m = g
                ? (0, t.jsx)(w, {
                    description: _(b[j.kind].description),
                    isPending: k.isPending,
                    reasons: h[j.kind],
                    onOpenChange: y,
                    onSubmit: (e, t, l) =>
                      k.mutate(
                        { target: j, reasons: e, details: t },
                        { onError: l },
                      ),
                  })
                : null),
              (f[8] = y),
              (f[9] = g),
              (f[10] = k),
              (f[11] = _),
              (f[12] = j),
              (f[13] = m))
            : (m = f[13]),
          f[14] !== g || f[15] !== s || f[16] !== u || f[17] !== m
            ? ((x = (0, t.jsx)("div", {
                onClick: v,
                onMouseDown: v,
                onPointerDown: v,
                children: (0, t.jsx)(i.N, {
                  open: g,
                  onOpenChange: s,
                  title: u,
                  "data-testid": "report-dialog",
                  children: m,
                }),
              })),
              (f[14] = g),
              (f[15] = s),
              (f[16] = u),
              (f[17] = m),
              (f[18] = x))
            : (x = f[18]),
          x
        );
      },
    ],
    324752,
  );
};
