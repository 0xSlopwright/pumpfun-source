// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(439587),
    n = e.i(352386);
  e.i(12692);
  var l = e.i(398902),
    a = e.i(980268),
    s = e.i(402732),
    c = e.i(547562);
  function u(e) {
    let t = e?.trim();
    if (!t) return null;
    let i = t;
    t.startsWith("//")
      ? (i = `https:${t}`)
      : /^https?:\/\//i.test(t) || (i = `https://${t}`);
    try {
      let e = new URL(i);
      if ("https:" !== e.protocol) return null;
      return e.href;
    } catch {
      return null;
    }
  }
  let o = new Set(["pump.fun", "terminal.pump.fun", "trade.padre.gg"]);
  function m(e) {
    try {
      let t = u(e);
      if (!t) return !1;
      let i = new URL(t).hostname.replace(/^www\./, "");
      return o.has(i);
    } catch {
      return !1;
    }
  }
  function h(e) {
    window.open(e, "_blank", "noopener,noreferrer");
  }
  (e.s(
    [
      "B",
      0,
      function (e) {
        let t = e.trim();
        return (
          !!t &&
          (!!(
            (t.startsWith("/") && !t.startsWith("//")) ||
            t.startsWith("#") ||
            t.startsWith("?")
          ) ||
            /^(mailto|tel):/i.test(t))
        );
      },
      "l",
      0,
      m,
      "_",
      0,
      u,
    ],
    947187,
  ),
    e.s(
      [
        "f",
        0,
        function () {
          let e,
            o,
            f,
            d,
            p,
            g,
            y,
            k,
            b,
            x,
            v,
            w,
            _,
            j,
            S,
            C,
            N,
            A,
            E,
            R,
            W = (0, i.c)(50),
            { t: T } = (0, l.f)(),
            [F, I] = (0, n.useState)(!1),
            [O, L] = (0, n.useState)(null),
            U = (0, s.f)(),
            [z, B] = (0, c.l)("privacy.confirmExternalLinks"),
            D = !U || z,
            [P, q] = (0, n.useState)(!1),
            M = (0, n.useId)();
          W[0] !== D
            ? ((e = (e) => {
                let t = u(e);
                if (t) {
                  if (m(t) || !D) return void h(t);
                  (q(!1), L(t), I(!0));
                }
              }),
              (W[0] = D),
              (W[1] = e))
            : (e = W[1]);
          let $ = e;
          W[2] === Symbol.for("react.memo_cache_sentinel")
            ? ((o = (e) => {
                (e || L(null), I(e));
              }),
              (W[2] = o))
            : (o = W[2]);
          let K = o;
          W[3] !== P || W[4] !== U || W[5] !== O || W[6] !== B
            ? ((f = () => {
                O && (U && P && B(!1), h(O), I(!1), L(null));
              }),
              (W[3] = P),
              (W[4] = U),
              (W[5] = O),
              (W[6] = B),
              (W[7] = f))
            : (f = W[7]);
          let V = f;
          (W[8] !== T
            ? ((d = T("web.leave_site.title")), (W[8] = T), (W[9] = d))
            : (d = W[9]),
            W[10] !== d
              ? ((p = (0, t.jsx)("p", {
                  className: "font-semibold text-lg",
                  children: d,
                })),
                (W[10] = d),
                (W[11] = p))
              : (p = W[11]),
            W[12] === Symbol.for("react.memo_cache_sentinel")
              ? ((g = (0, t.jsx)(r.k, { height: 4 })), (W[12] = g))
              : (g = W[12]),
            W[13] !== T
              ? ((y = T("web.leave_site.description")),
                (W[13] = T),
                (W[14] = y))
              : (y = W[14]),
            W[15] !== y
              ? ((k = (0, t.jsx)("p", { children: y })),
                (W[15] = y),
                (W[16] = k))
              : (k = W[16]),
            W[17] === Symbol.for("react.memo_cache_sentinel")
              ? ((b = (0, t.jsx)(r.k, { height: 16 })), (W[17] = b))
              : (b = W[17]),
            W[18] !== O
              ? ((x = O
                  ? (0, t.jsx)("div", {
                      className: "rounded-md bg-bg-tertiary p-3",
                      children: (0, t.jsx)("p", {
                        className: "break-all text-sm text-text-secondary",
                        children: O,
                      }),
                    })
                  : null),
                (W[18] = O),
                (W[19] = x))
              : (x = W[19]),
            W[20] !== P || W[21] !== M || W[22] !== U || W[23] !== T
              ? ((v = U
                  ? (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsx)(r.k, { height: 16 }),
                        (0, t.jsxs)("label", {
                          htmlFor: M,
                          className:
                            "flex w-fit cursor-pointer select-none items-center gap-2 text-sm text-text-secondary",
                          children: [
                            (0, t.jsx)(a.f, {
                              id: M,
                              checked: P,
                              onCheckedChange: (e) => q(!0 === e),
                            }),
                            T("web.settings.privacy.dont_ask_again"),
                          ],
                        }),
                        (0, t.jsx)(r.k, { height: 16 }),
                      ],
                    })
                  : (0, t.jsx)(r.k, { height: 32 })),
                (W[20] = P),
                (W[21] = M),
                (W[22] = U),
                (W[23] = T),
                (W[24] = v))
              : (v = W[24]),
            W[25] === Symbol.for("react.memo_cache_sentinel")
              ? ((w = () => K(!1)), (W[25] = w))
              : (w = W[25]),
            W[26] !== T
              ? ((_ = T("common.cancel")), (W[26] = T), (W[27] = _))
              : (_ = W[27]),
            W[28] !== _
              ? ((j = (0, t.jsx)(r.K, {
                  type: "button",
                  variant: "secondary",
                  onClick: w,
                  children: _,
                })),
                (W[28] = _),
                (W[29] = j))
              : (j = W[29]),
            W[30] !== T
              ? ((S = T("geo_block.open_link")), (W[30] = T), (W[31] = S))
              : (S = W[31]),
            W[32] !== V || W[33] !== S
              ? ((C = (0, t.jsx)(r.K, {
                  type: "button",
                  className: "bg-bg-accent text-black hover:bg-bg-accent/90",
                  onClick: V,
                  children: S,
                })),
                (W[32] = V),
                (W[33] = S),
                (W[34] = C))
              : (C = W[34]),
            W[35] !== j || W[36] !== C
              ? ((N = (0, t.jsxs)(r.z, {
                  justifyContent: "space-between",
                  children: [j, C],
                })),
                (W[35] = j),
                (W[36] = C),
                (W[37] = N))
              : (N = W[37]),
            W[38] !== v ||
            W[39] !== N ||
            W[40] !== p ||
            W[41] !== k ||
            W[42] !== x
              ? ((A = (0, t.jsxs)(r.s, {
                  className: "max-w-[480px]",
                  children: [p, g, k, b, x, v, N],
                })),
                (W[38] = v),
                (W[39] = N),
                (W[40] = p),
                (W[41] = k),
                (W[42] = x),
                (W[43] = A))
              : (A = W[43]),
            W[44] !== F || W[45] !== A
              ? ((E = (0, t.jsx)(r.v, {
                  isOpen: F,
                  onIsOpenChange: K,
                  children: A,
                })),
                (W[44] = F),
                (W[45] = A),
                (W[46] = E))
              : (E = W[46]));
          let G = E;
          return (
            W[47] !== G || W[48] !== $
              ? ((R = { requestNavigation: $, dialog: G }),
                (W[47] = G),
                (W[48] = $),
                (W[49] = R))
              : (R = W[49]),
            R
          );
        },
      ],
      225641,
    ));
};
