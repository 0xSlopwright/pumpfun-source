// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(157633),
    a = e.i(745018),
    l = e.i(426091),
    i = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    o = e.i(51206),
    c = e.i(21384),
    d = e.i(300898),
    u = e.i(595673),
    f = e.i(358893);
  let h = {
    google: n.Ao,
    apple: a.Te,
    twitter: a.Tc,
    github: a.lX,
    email: a.Wl,
  };
  function m(e) {
    let n,
      s = (0, r.c)(13),
      { method: o, className: c } = e,
      [d, u] = (0, i.useState)(null);
    if ("external" === o.kind && o.walletIcon && d !== o.walletIcon) {
      let e,
        r,
        n,
        a = o.walletIcon;
      return (
        s[0] !== c
          ? ((e = (0, l.c)("object-contain", c)), (s[0] = c), (s[1] = e))
          : (e = s[1]),
        s[2] !== a ? ((r = () => u(a)), (s[2] = a), (s[3] = r)) : (r = s[3]),
        s[4] !== a || s[5] !== e || s[6] !== r
          ? ((n = (0, t.jsx)("img", {
              src: a,
              alt: "",
              "aria-hidden": !0,
              className: e,
              onError: r,
            })),
            (s[4] = a),
            (s[5] = e),
            (s[6] = r),
            (s[7] = n))
          : (n = s[7]),
        n
      );
    }
    if ("embedded" === o.kind && o.provider) {
      let e,
        r = h[o.provider];
      return (
        s[8] !== r || s[9] !== c
          ? ((e = (0, t.jsx)(r, { className: c })),
            (s[8] = r),
            (s[9] = c),
            (s[10] = e))
          : (e = s[10]),
        e
      );
    }
    return (
      s[11] !== c
        ? ((n = (0, t.jsx)(a.Of, { className: c })), (s[11] = c), (s[12] = n))
        : (n = s[12]),
      n
    );
  }
  function b(e) {
    let n,
      a,
      i,
      s,
      o,
      c = (0, r.c)(12),
      { method: u, hidden: h, density: m } = e;
    if ("embedded" !== u.kind) return null;
    if (c[0] !== u) {
      i = Symbol.for("react.early_return_sentinel");
      e: {
        if (!(n = (0, d.t)(u))) {
          i = null;
          break e;
        }
        a = n.provider === u.provider ? null : ` (${(0, d.c)(n.provider)})`;
      }
      ((c[0] = u), (c[1] = n), (c[2] = a), (c[3] = i));
    } else ((n = c[1]), (a = c[2]), (i = c[3]));
    if (i !== Symbol.for("react.early_return_sentinel")) return i;
    let b = a,
      x =
        "comfortable" === (void 0 === m ? "compact" : m)
          ? "text-[13px] leading-[18px]"
          : "text-xs";
    c[4] !== x
      ? ((s = (0, l.c)("text-text-tertiary truncate", x)),
        (c[4] = x),
        (c[5] = s))
      : (s = c[5]);
    let p = h ? void 0 : n.value,
      y = h || void 0,
      g = h ? f.V : n.value;
    return (
      c[6] !== b || c[7] !== s || c[8] !== p || c[9] !== y || c[10] !== g
        ? ((o = (0, t.jsxs)("p", {
            className: s,
            title: p,
            "data-testid": "connection-method-identifier",
            "data-hidden": y,
            children: [g, b],
          })),
          (c[6] = b),
          (c[7] = s),
          (c[8] = p),
          (c[9] = y),
          (c[10] = g),
          (c[11] = o))
        : (o = c[11]),
      o
    );
  }
  function x(e) {
    let n,
      i,
      c,
      d,
      h,
      m = (0, r.c)(21),
      { density: b } = e,
      { t: x } = (0, s.f)(),
      p = (0, f.L)(),
      y = (0, f.C)();
    m[0] !== p || m[1] !== x
      ? ((n = x(
          p ? "web.auth.show_personal_info" : "web.auth.hide_personal_info",
        )),
        (m[0] = p),
        (m[1] = x),
        (m[2] = n))
      : (n = m[2]);
    let g = n;
    m[3] !== p || m[4] !== y
      ? ((i = () => {
          let e = !p;
          y();
          try {
            (0, u.jC)({ nowHidden: e });
          } catch {}
        }),
        (m[3] = p),
        (m[4] = y),
        (m[5] = i))
      : (i = m[5]);
    let v = i;
    m[6] !== p
      ? ((c = p
          ? (0, t.jsx)(a.cT, { "aria-hidden": !0 })
          : (0, t.jsx)(a.a6, { "aria-hidden": !0 })),
        (m[6] = p),
        (m[7] = c))
      : (c = m[7]);
    let w = c;
    if ("comfortable" === (void 0 === b ? "compact" : b)) {
      let e;
      return (
        m[8] !== w || m[9] !== v || m[10] !== p || m[11] !== g
          ? ((e = (0, t.jsx)(o._, {
              density: "comfortable",
              size: 24,
              variant: "ghost",
              active: p,
              "aria-pressed": p,
              "aria-label": g,
              title: g,
              onClick: v,
              "data-testid": "profile-hide-personal-info",
              children: w,
            })),
            (m[8] = w),
            (m[9] = v),
            (m[10] = p),
            (m[11] = g),
            (m[12] = e))
          : (e = m[12]),
        e
      );
    }
    let j = p && "bg-bg-secondary text-text-primary";
    return (
      m[13] !== j
        ? ((d = (0, l.c)(
            "flex size-6 shrink-0 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-secondary [&>svg]:size-3.5",
            j,
          )),
          (m[13] = j),
          (m[14] = d))
        : (d = m[14]),
      m[15] !== w || m[16] !== v || m[17] !== p || m[18] !== g || m[19] !== d
        ? ((h = (0, t.jsx)("button", {
            type: "button",
            onClick: v,
            "aria-pressed": p,
            "aria-label": g,
            title: g,
            "data-testid": "profile-hide-personal-info",
            className: d,
            children: w,
          })),
          (m[15] = w),
          (m[16] = v),
          (m[17] = p),
          (m[18] = g),
          (m[19] = d),
          (m[20] = h))
        : (h = m[20]),
      h
    );
  }
  e.s([
    "O",
    0,
    function () {
      let e,
        n,
        a,
        l,
        i = (0, r.c)(13),
        { t: o } = (0, s.f)(),
        { method: u, reader: f } = (0, c.f)();
      if ("none" === u.kind || "resolving" === u.kind) {
        let e;
        return (
          i[0] !== f
            ? ((e = (0, t.jsx)(t.Fragment, { children: f })),
              (i[0] = f),
              (i[1] = e))
            : (e = i[1]),
          e
        );
      }
      i[2] !== u || i[3] !== o
        ? ((e = o("web.auth.connected_with_method", { method: (0, d.B)(u) })),
          (i[2] = u),
          (i[3] = o),
          (i[4] = e))
        : (e = i[4]);
      let h = e;
      return (
        i[5] !== u
          ? ((n = (0, t.jsx)(m, { method: u, className: "size-3" })),
            (i[5] = u),
            (i[6] = n))
          : (n = i[6]),
        i[7] !== h || i[8] !== n
          ? ((a = (0, t.jsx)("span", {
              "data-testid": "connection-method-badge",
              "aria-label": h,
              title: h,
              className:
                "bg-bg-tertiary border-bg-secondary text-text-primary absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center overflow-hidden rounded-full border-2",
              children: n,
            })),
            (i[7] = h),
            (i[8] = n),
            (i[9] = a))
          : (a = i[9]),
        i[10] !== f || i[11] !== a
          ? ((l = (0, t.jsxs)(t.Fragment, { children: [a, f] })),
            (i[10] = f),
            (i[11] = a),
            (i[12] = l))
          : (l = i[12]),
        l
      );
    },
    "a",
    0,
    function (e) {
      let n,
        a,
        o,
        u,
        h,
        p,
        y,
        g,
        v,
        w,
        j,
        _,
        k,
        N,
        S = (0, r.c)(60),
        { className: B, compact: C, showHideToggle: A, density: I } = e,
        L = void 0 !== C && C,
        F = void 0 !== A && A,
        E = void 0 === I ? "compact" : I,
        { t: M } = (0, s.f)(),
        { method: R, reader: T } = (0, c.f)(),
        O = (0, f.L)(),
        $ = "comfortable" === E,
        D = "resolving" === R.kind,
        [U, z] = (0, i.useState)(!1);
      if (
        (S[0] !== D
          ? ((n = () => {
              if (!D) return;
              let e = window.setTimeout(() => z(!0), 6e3);
              return () => window.clearTimeout(e);
            }),
            (a = [D]),
            (S[0] = D),
            (S[1] = n),
            (S[2] = a))
          : ((n = S[1]), (a = S[2])),
        (0, i.useEffect)(n, a),
        "none" === R.kind || (D && U))
      ) {
        let e, r, n;
        if (!F) {
          let e;
          return (
            S[3] !== T
              ? ((e = (0, t.jsx)(t.Fragment, { children: T })),
                (S[3] = T),
                (S[4] = e))
              : (e = S[4]),
            e
          );
        }
        return (
          S[5] !== B
            ? ((e = (0, l.c)("flex items-start justify-end", B)),
              (S[5] = B),
              (S[6] = e))
            : (e = S[6]),
          S[7] !== E
            ? ((r = (0, t.jsx)(x, { density: E })), (S[7] = E), (S[8] = r))
            : (r = S[8]),
          S[9] !== T || S[10] !== e || S[11] !== r
            ? ((n = (0, t.jsxs)("div", { className: e, children: [r, T] })),
              (S[9] = T),
              (S[10] = e),
              (S[11] = r),
              (S[12] = n))
            : (n = S[12]),
          n
        );
      }
      let P = $ ? "gap-3" : "gap-2.5";
      S[13] !== B || S[14] !== P
        ? ((o = (0, l.c)("flex items-start", P, B)),
          (S[13] = B),
          (S[14] = P),
          (S[15] = o))
        : (o = S[15]);
      let q = $
          ? "mt-0.5 inline-grid size-7 shrink-0 place-items-center overflow-hidden rounded-md bg-bg-tertiary text-text-tertiary"
          : "bg-bg-secondary text-text-secondary mt-0.5 flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full",
        W = $ ? "size-4" : "size-3.5";
      (S[16] !== R || S[17] !== W
        ? ((u = (0, t.jsx)(m, { method: R, className: W })),
          (S[16] = R),
          (S[17] = W),
          (S[18] = u))
        : (u = S[18]),
        S[19] !== u || S[20] !== q
          ? ((h = (0, t.jsx)("span", {
              "aria-hidden": !0,
              className: q,
              children: u,
            })),
            (S[19] = u),
            (S[20] = q),
            (S[21] = h))
          : (h = S[21]),
        S[22] !== $ || S[23] !== L || S[24] !== M
          ? ((p = L
              ? null
              : (0, t.jsx)("p", {
                  className: $
                    ? "text-xs leading-4 font-normal text-text-quaternary"
                    : "text-text-tertiary text-[11px] font-medium uppercase tracking-wide",
                  children: M("web.auth.connected_with"),
                })),
            (S[22] = $),
            (S[23] = L),
            (S[24] = M),
            (S[25] = p))
          : (p = S[25]));
      let K = $
        ? "text-text-primary truncate text-sm leading-5 font-medium"
        : "text-text-primary truncate text-xs font-semibold";
      return (
        S[26] !== R
          ? ((y = (0, d.B)(R)), (S[26] = R), (S[27] = y))
          : (y = S[27]),
        S[28] !== R.kind || S[29] !== R.walletName || S[30] !== M
          ? ((g =
              "external" === R.kind && R.walletName
                ? (0, t.jsxs)("span", {
                    className: "text-text-tertiary font-medium",
                    children: [" · ", M("web.auth.external_wallet_suffix")],
                  })
                : null),
            (S[28] = R.kind),
            (S[29] = R.walletName),
            (S[30] = M),
            (S[31] = g))
          : (g = S[31]),
        S[32] !== K || S[33] !== y || S[34] !== g
          ? ((v = (0, t.jsxs)("p", {
              className: K,
              "data-testid": "connection-method-label",
              children: [y, g],
            })),
            (S[32] = K),
            (S[33] = y),
            (S[34] = g),
            (S[35] = v))
          : (v = S[35]),
        S[36] !== E || S[37] !== O || S[38] !== R
          ? ((w = (0, t.jsx)(b, { method: R, hidden: O, density: E })),
            (S[36] = E),
            (S[37] = O),
            (S[38] = R),
            (S[39] = w))
          : (w = S[39]),
        S[40] !== $ || S[41] !== R.connected || S[42] !== R.kind || S[43] !== M
          ? ((j =
              "external" !== R.kind || R.connected
                ? null
                : (0, t.jsx)("p", {
                    className: (0, l.c)(
                      "text-text-tertiary",
                      $ ? "text-[13px] leading-[18px]" : "text-xs",
                    ),
                    "data-testid": "connection-method-not-connected",
                    children: M("web.auth.not_connected_in_browser"),
                  })),
            (S[40] = $),
            (S[41] = R.connected),
            (S[42] = R.kind),
            (S[43] = M),
            (S[44] = j))
          : (j = S[44]),
        S[45] !== p || S[46] !== v || S[47] !== w || S[48] !== j
          ? ((_ = (0, t.jsxs)("div", {
              className: "min-w-0 flex-1",
              children: [p, v, w, j],
            })),
            (S[45] = p),
            (S[46] = v),
            (S[47] = w),
            (S[48] = j),
            (S[49] = _))
          : (_ = S[49]),
        S[50] !== E || S[51] !== F
          ? ((k = F ? (0, t.jsx)(x, { density: E }) : null),
            (S[50] = E),
            (S[51] = F),
            (S[52] = k))
          : (k = S[52]),
        S[53] !== E ||
        S[54] !== T ||
        S[55] !== h ||
        S[56] !== _ ||
        S[57] !== k ||
        S[58] !== o
          ? ((N = (0, t.jsxs)("div", {
              "data-testid": "connection-method",
              "data-density": E,
              className: o,
              children: [h, _, k, T],
            })),
            (S[53] = E),
            (S[54] = T),
            (S[55] = h),
            (S[56] = _),
            (S[57] = k),
            (S[58] = o),
            (S[59] = N))
          : (N = S[59]),
        N
      );
    },
  ]);
};
