// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    i = e.i(452114),
    n = e.i(509836),
    s = e.i(745018),
    l = e.i(439587),
    r = e.i(254667),
    o = e.i(352386);
  e.i(12692);
  var c = e.i(398902),
    u = e.i(63289),
    m = e.i(20077),
    d = e.i(338871),
    h = e.i(952366),
    p = e.i(143575),
    f = e.i(802323),
    b = e.i(595673);
  let v = { google: "Google", apple: "Apple", email: "Email" },
    g = (e) => {
      let i = (0, a.c)(3),
        { method: n } = e;
      switch (n) {
        case "google": {
          let e;
          return (
            i[0] === Symbol.for("react.memo_cache_sentinel")
              ? ((e = (0, t.jsx)(m.y, { size: 18 })), (i[0] = e))
              : (e = i[0]),
            e
          );
        }
        case "apple": {
          let e;
          return (
            i[1] === Symbol.for("react.memo_cache_sentinel")
              ? ((e = (0, t.jsx)(s.Te, { size: 18 })), (i[1] = e))
              : (e = i[1]),
            e
          );
        }
        case "email": {
          let e;
          return (
            i[2] === Symbol.for("react.memo_cache_sentinel")
              ? ((e = (0, t.jsx)(s.am, { size: 18 })), (i[2] = e))
              : (e = i[2]),
            e
          );
        }
      }
    };
  e.s([
    "XBackupLinkGateContent",
    0,
    () => {
      let e,
        m,
        k,
        x,
        y,
        w,
        j,
        _,
        P,
        C,
        S,
        z,
        E,
        T,
        q,
        A,
        U,
        $,
        I,
        F,
        D,
        M,
        W,
        N,
        B,
        R,
        O,
        L,
        H,
        G = (0, a.c)(67),
        { t: V } = (0, c.f)(),
        { user: K } = (0, n.f)(),
        { toggleChat: X } = (0, d.f)(),
        [Y, J] = (0, o.useState)(null),
        [Q, Z] = (0, o.useState)(null);
      (G[0] !== V
        ? ((e = (e) => {
            let { linkMethod: t } = e;
            (J(null), Z(null));
            let a = (0, p.P)(t);
            (a && (0, h.V)(a), u.c.success(V("web.auth.backup_login_linked")));
          }),
          (G[0] = V),
          (G[1] = e))
        : (e = G[1]),
        G[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((m = (e, t) => {
              let { linkMethod: a } = t;
              J(null);
              let i = String(e);
              if ((0, f.w)(i)) return;
              let n = (0, p.W)(i);
              (r.y.error(
                "[XBackupLinkGate] Failed to link backup login method",
                { linkMethod: a, code: i },
              ),
                Z(n),
                u.c.error(n));
            }),
            (G[2] = m))
          : (m = G[2]),
        G[3] !== e
          ? ((k = { onSuccess: e, onError: m }), (G[3] = e), (G[4] = k))
          : (k = G[4]));
      let { linkGoogle: ee, linkApple: et, linkEmail: ea } = (0, i.f)(k);
      if (!K) return null;
      let ei = K.twitter?.username ? `@${K.twitter.username}` : void 0;
      G[5] !== et || G[6] !== ea || G[7] !== ee || G[8] !== Y
        ? ((x = (e) => {
            if (null === Y)
              switch ((Z(null), J(e), e)) {
                case "google":
                  ee();
                  break;
                case "apple":
                  et();
                  break;
                case "email":
                  ea();
              }
          }),
          (G[5] = et),
          (G[6] = ea),
          (G[7] = ee),
          (G[8] = Y),
          (G[9] = x))
        : (x = G[9]);
      let en = x;
      G[10] !== X
        ? ((y = () => {
            ((0, b.FN)(), X());
          }),
          (G[10] = X),
          (G[11] = y))
        : (y = G[11]);
      let es = y;
      return (
        G[12] === Symbol.for("react.memo_cache_sentinel")
          ? ((w = (0, t.jsx)("div", {
              className:
                "bg-primary/15 flex size-12 items-center justify-center rounded-2xl",
              children: (0, t.jsx)(s.eb, {
                size: 22,
                className: "text-primary",
              }),
            })),
            (G[12] = w))
          : (w = G[12]),
        G[13] !== V
          ? ((j = V("auth.x_backup_gate.title")), (G[13] = V), (G[14] = j))
          : (j = G[14]),
        G[15] !== j
          ? ((_ = (0, t.jsx)("h1", {
              className: "text-text-primary text-2xl font-semibold",
              children: j,
            })),
            (G[15] = j),
            (G[16] = _))
          : (_ = G[16]),
        G[17] !== V
          ? ((P = V("auth.x_backup_gate.description")),
            (G[17] = V),
            (G[18] = P))
          : (P = G[18]),
        G[19] !== P
          ? ((C = (0, t.jsx)("p", {
              className: "text-text-tertiary text-balance text-sm",
              children: P,
            })),
            (G[19] = P),
            (G[20] = C))
          : (C = G[20]),
        G[21] !== _ || G[22] !== C
          ? ((S = (0, t.jsxs)("div", {
              className: "flex flex-col items-center gap-3 text-center",
              children: [w, _, C],
            })),
            (G[21] = _),
            (G[22] = C),
            (G[23] = S))
          : (S = G[23]),
        G[24] !== V
          ? ((z = V("web.auth.your_current_login")), (G[24] = V), (G[25] = z))
          : (z = G[25]),
        G[26] !== z
          ? ((E = (0, t.jsx)("span", {
              className: "text-text-tertiary text-xs font-semibold",
              children: z,
            })),
            (G[26] = z),
            (G[27] = E))
          : (E = G[27]),
        G[28] === Symbol.for("react.memo_cache_sentinel")
          ? ((T = (0, t.jsx)(s.Tc, { size: 18, "aria-hidden": !0 })),
            (G[28] = T))
          : (T = G[28]),
        G[29] === Symbol.for("react.memo_cache_sentinel")
          ? ((q = (0, t.jsx)("span", {
              className: "text-text-primary text-sm font-semibold",
              children: "X (Twitter)",
            })),
            (G[29] = q))
          : (q = G[29]),
        G[30] !== ei
          ? ((A = ei
              ? (0, t.jsx)("span", {
                  className: "text-text-tertiary text-xs",
                  children: ei,
                })
              : null),
            (G[30] = ei),
            (G[31] = A))
          : (A = G[31]),
        G[32] !== A
          ? ((U = (0, t.jsxs)("div", {
              className:
                "border-border-secondary bg-bg-secondary flex items-center gap-3 rounded-xl border p-4",
              "data-testid": "x-backup-gate-current-login",
              children: [
                T,
                (0, t.jsxs)("div", {
                  className: "flex flex-col",
                  children: [q, A],
                }),
              ],
            })),
            (G[32] = A),
            (G[33] = U))
          : (U = G[33]),
        G[34] !== E || G[35] !== U
          ? (($ = (0, t.jsxs)("div", {
              className: "flex flex-col gap-2",
              children: [E, U],
            })),
            (G[34] = E),
            (G[35] = U),
            (G[36] = $))
          : ($ = G[36]),
        G[37] !== V
          ? ((I = V("web.auth.link_backup_method")), (G[37] = V), (G[38] = I))
          : (I = G[38]),
        G[39] !== I
          ? ((F = (0, t.jsx)("span", {
              className: "text-text-tertiary text-xs font-semibold",
              children: I,
            })),
            (G[39] = I),
            (G[40] = F))
          : (F = G[40]),
        G[41] === Symbol.for("react.memo_cache_sentinel")
          ? ((D = Object.keys(v)), (G[41] = D))
          : (D = G[41]),
        G[42] !== Y || G[43] !== en || G[44] !== V
          ? ((M = (0, t.jsx)("div", {
              className:
                "border-border-secondary bg-bg-secondary flex flex-col divide-y divide-border-secondary rounded-xl border",
              children: D.map((e) =>
                (0, t.jsxs)(
                  "div",
                  {
                    className: "flex items-center justify-between gap-3 p-4",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                          (0, t.jsx)("span", {
                            className: "shrink-0",
                            "aria-hidden": !0,
                            children: (0, t.jsx)(g, { method: e }),
                          }),
                          (0, t.jsx)("span", {
                            className: "text-text-primary text-sm font-medium",
                            children: v[e],
                          }),
                        ],
                      }),
                      (0, t.jsx)(l.K, {
                        size: 32,
                        variant: "primary",
                        isDisabled: null !== Y,
                        isLoading: Y === e,
                        onClick: () => en(e),
                        "data-testid": `x-backup-gate-link-${e}`,
                        children: V("common.link"),
                      }),
                    ],
                  },
                  e,
                ),
              ),
            })),
            (G[42] = Y),
            (G[43] = en),
            (G[44] = V),
            (G[45] = M))
          : (M = G[45]),
        G[46] !== F || G[47] !== M
          ? ((W = (0, t.jsxs)("div", {
              className: "flex flex-col gap-2",
              children: [F, M],
            })),
            (G[46] = F),
            (G[47] = M),
            (G[48] = W))
          : (W = G[48]),
        G[49] !== Q
          ? ((N = Q
              ? (0, t.jsx)("p", {
                  className:
                    "border-red-500/40 bg-red-500/10 rounded-xl border px-3 py-2 text-center text-xs text-red-300",
                  role: "alert",
                  "data-testid": "x-backup-gate-error",
                  children: Q,
                })
              : null),
            (G[49] = Q),
            (G[50] = N))
          : (N = G[50]),
        G[51] !== V
          ? ((B = V("web.auth.backup_gate_footnote")), (G[51] = V), (G[52] = B))
          : (B = G[52]),
        G[53] !== B
          ? ((R = (0, t.jsx)("p", {
              className: "text-text-tertiary text-center text-xs",
              children: B,
            })),
            (G[53] = B),
            (G[54] = R))
          : (R = G[54]),
        G[55] !== V
          ? ((O = V("geo_block.contact_support")), (G[55] = V), (G[56] = O))
          : (O = G[56]),
        G[57] !== es || G[58] !== O
          ? ((L = (0, t.jsx)(l.K, {
              isFullWidth: !0,
              size: 40,
              variant: "secondary",
              onClick: es,
              "data-testid": "x-backup-gate-contact-support",
              children: O,
            })),
            (G[57] = es),
            (G[58] = O),
            (G[59] = L))
          : (L = G[59]),
        G[60] !== S ||
        G[61] !== $ ||
        G[62] !== W ||
        G[63] !== N ||
        G[64] !== R ||
        G[65] !== L
          ? ((H = (0, t.jsx)("div", {
              className:
                "flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-8",
              "data-testid": "x-backup-gate",
              children: (0, t.jsxs)("div", {
                className: "flex w-full max-w-md flex-col gap-6",
                children: [S, $, W, N, R, L],
              }),
            })),
            (G[60] = S),
            (G[61] = $),
            (G[62] = W),
            (G[63] = N),
            (G[64] = R),
            (G[65] = L),
            (G[66] = H))
          : (H = G[66]),
        H
      );
    },
  ]);
};
