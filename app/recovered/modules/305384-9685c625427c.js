// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    i = e.i(785869),
    s = e.i(745018),
    r = e.i(439587),
    n = e.i(944410),
    l = e.i(254667),
    o = e.i(574472),
    c = e.i(132838),
    u = e.i(606933),
    p = e.i(599077),
    d = e.i(352386);
  e.i(12692);
  var m = e.i(398902),
    v = e.i(402030);
  let f = "losemyfunds",
    h = "DELETE /users";
  var y = e.i(789214);
  let x = ["users", "delete-account"];
  class g extends Error {
    constructor() {
      (super("Privy identity token unavailable"),
        (this.name = "IdentityTokenUnavailableError"));
    }
  }
  e.s(
    [
      "DeleteAccountDialog",
      0,
      function (e) {
        let w,
          k,
          _,
          b,
          j,
          S,
          C,
          E,
          N,
          P,
          A,
          T,
          D,
          F,
          O,
          K,
          U,
          z,
          R,
          q,
          I,
          L,
          Q,
          B,
          H,
          W,
          V,
          $,
          G,
          J = (0, a.c)(84),
          { open: M, onOpenChange: X } = e,
          { t: Y } = (0, m.f)(),
          { logout: Z } = (0, o.F)(),
          { replace: ee } = (0, p.useRouter)(),
          et = (0, d.useId)(),
          [ea, ei] = (0, d.useState)(""),
          [es, er] = (0, d.useState)(!1),
          en = (() => {
            let e,
              t,
              s,
              r = (0, a.c)(8),
              l = (0, n.useClientServerContract)(),
              o = (0, u.useQueryClient)(),
              { identityToken: p } = (0, i.f)();
            return (
              r[0] !== l || r[1] !== p
                ? ((e = async () => {
                    if (!p) throw new g();
                    await l(h, {
                      headers: { [y.T]: p },
                      timeout: 3e4,
                      retry: 0,
                    });
                  }),
                  (r[0] = l),
                  (r[1] = p),
                  (r[2] = e))
                : (e = r[2]),
              r[3] !== o
                ? ((t = () => {
                    o.removeQueries();
                  }),
                  (r[3] = o),
                  (r[4] = t))
                : (t = r[4]),
              r[5] !== e || r[6] !== t
                ? ((s = { mutationKey: x, mutationFn: e, onSuccess: t }),
                  (r[5] = e),
                  (r[6] = t),
                  (r[7] = s))
                : (s = r[7]),
              (0, c.f)(s)
            );
          })();
        J[0] !== ea ? ((w = ea === f), (J[0] = ea), (J[1] = w)) : (w = J[1]);
        let el = w,
          eo = en.isPending || es;
        J[2] !== eo || J[3] !== en || J[4] !== X
          ? ((k = () => {
              eo || (ei(""), en.reset(), X(!1));
            }),
            (J[2] = eo),
            (J[3] = en),
            (J[4] = X),
            (J[5] = k))
          : (k = J[5]);
        let ec = k;
        J[6] !== eo || J[7] !== el || J[8] !== en || J[9] !== Z || J[10] !== ee
          ? ((_ = async (e) => {
              if ((e.preventDefault(), el && !eo)) {
                try {
                  await en.mutateAsync();
                } catch (e) {
                  l.y.error("Account deletion failed", {
                    failure: ((e) => {
                      if (!(0, v.isContractError)(e, h)) return "unknown";
                      if (400 === e.status) return "wallet_mismatch";
                      if (!e.is(401)) return "unknown";
                      switch (
                        "code" in e.data && "string" == typeof e.data.code
                          ? e.data.code
                          : null
                      ) {
                        case "privy_identity_token_expired":
                          return "identity_token_expired";
                        case "privy_identity_token_invalid":
                          return "identity_token_invalid";
                        default:
                          return "unknown";
                      }
                    })(e),
                    error: e,
                  });
                  return;
                }
                er(!0);
                try {
                  await Z();
                } catch (e) {
                  l.y.error("Sign-out after account deletion failed", {
                    error: e,
                  });
                }
                ee("/");
              }
            }),
            (J[6] = eo),
            (J[7] = el),
            (J[8] = en),
            (J[9] = Z),
            (J[10] = ee),
            (J[11] = _))
          : (_ = J[11]);
        let eu = _;
        J[12] !== ec
          ? ((b = (e) => {
              e || ec();
            }),
            (J[12] = ec),
            (J[13] = b))
          : (b = J[13]);
        let ep = eo || void 0;
        (J[14] !== Y
          ? ((j = Y("profile.edit.delete.title")), (J[14] = Y), (J[15] = j))
          : (j = J[15]),
          J[16] !== j
            ? ((S = (0, t.jsx)("p", {
                className: "text-lg font-semibold text-text-primary",
                children: j,
              })),
              (J[16] = j),
              (J[17] = S))
            : (S = J[17]),
          J[18] !== Y
            ? ((C = Y("profile.edit.delete.confirmation_question")),
              (J[18] = Y),
              (J[19] = C))
            : (C = J[19]),
          J[20] !== C
            ? ((E = (0, t.jsx)("p", {
                className: "text-sm text-text-primary",
                children: C,
              })),
              (J[20] = C),
              (J[21] = E))
            : (E = J[21]),
          J[22] !== Y
            ? ((N = Y("profile.edit.delete.description")),
              (J[22] = Y),
              (J[23] = N))
            : (N = J[23]),
          J[24] !== N
            ? ((P = (0, t.jsx)("p", {
                className: "text-sm text-text-tertiary",
                children: N,
              })),
              (J[24] = N),
              (J[25] = P))
            : (P = J[25]),
          J[26] !== P || J[27] !== S || J[28] !== E
            ? ((A = (0, t.jsxs)("header", {
                className: "flex flex-col gap-1.5",
                children: [S, E, P],
              })),
              (J[26] = P),
              (J[27] = S),
              (J[28] = E),
              (J[29] = A))
            : (A = J[29]),
          J[30] !== Y
            ? ((T = Y("profile.edit.delete.confirmation_word_label")),
              (J[30] = Y),
              (J[31] = T))
            : (T = J[31]),
          J[32] !== et || J[33] !== T
            ? ((D = (0, t.jsx)(r.Q, {
                htmlFor: et,
                className: "text-sm font-semibold text-text-primary",
                children: T,
              })),
              (J[32] = et),
              (J[33] = T),
              (J[34] = D))
            : (D = J[34]),
          J[35] !== Y
            ? ((F = Y("profile.edit.delete.confirmation_word_secondary", {
                word: f,
              })),
              (J[35] = Y),
              (J[36] = F))
            : (F = J[36]),
          J[37] !== F
            ? ((O = (0, t.jsx)("p", {
                className: "text-xs text-text-tertiary",
                children: F,
              })),
              (J[37] = F),
              (J[38] = O))
            : (O = J[38]),
          J[39] === Symbol.for("react.memo_cache_sentinel")
            ? ((K = (e) => ei(e.target.value)), (J[39] = K))
            : (K = J[39]));
        let ed = ("" !== ea && !el) || void 0;
        (J[40] !== eo || J[41] !== et || J[42] !== ed || J[43] !== ea
          ? ((U = (0, t.jsx)(r.e, {
              id: et,
              value: ea,
              onChange: K,
              autoCapitalize: "none",
              autoCorrect: "off",
              autoComplete: "off",
              spellCheck: !1,
              maxLength: f.length,
              isDisabled: eo,
              "aria-invalid": ed,
              "data-testid": "delete-account-word",
              className:
                "h-12 border-border-tertiary bg-bg-secondary text-sm text-text-primary",
            })),
            (J[40] = eo),
            (J[41] = et),
            (J[42] = ed),
            (J[43] = ea),
            (J[44] = U))
          : (U = J[44]),
          J[45] !== D || J[46] !== O || J[47] !== U
            ? ((z = (0, t.jsxs)("div", {
                className: "flex flex-col gap-2",
                children: [D, O, U],
              })),
              (J[45] = D),
              (J[46] = O),
              (J[47] = U),
              (J[48] = z))
            : (z = J[48]),
          J[49] === Symbol.for("react.memo_cache_sentinel")
            ? ((R = (0, t.jsx)(s.ck, {
                "aria-hidden": !0,
                className: "size-3.5 shrink-0",
              })),
              (J[49] = R))
            : (R = J[49]),
          J[50] !== Y
            ? ((q = Y("profile.edit.delete.action_cannot_be_undone")),
              (J[50] = Y),
              (J[51] = q))
            : (q = J[51]),
          J[52] !== q
            ? ((I = (0, t.jsxs)("p", {
                className:
                  "flex items-center gap-1.5 text-xs font-medium text-loss",
                children: [R, q],
              })),
              (J[52] = q),
              (J[53] = I))
            : (I = J[53]),
          J[54] !== en.isError || J[55] !== Y
            ? ((L = en.isError
                ? (0, t.jsx)("p", {
                    role: "alert",
                    "data-testid": "delete-account-error",
                    className:
                      "rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss",
                    children: Y("settings.failed_to_delete_user"),
                  })
                : null),
              (J[54] = en.isError),
              (J[55] = Y),
              (J[56] = L))
            : (L = J[56]));
        let em = !el;
        return (
          J[57] !== Y
            ? ((Q = Y("profile.edit.delete.delete_account")),
              (J[57] = Y),
              (J[58] = Q))
            : (Q = J[58]),
          J[59] !== eo || J[60] !== em || J[61] !== Q
            ? ((B = (0, t.jsx)(r.K, {
                type: "submit",
                variant: "primary",
                isFullWidth: !0,
                className: "bg-loss text-bg-primary hover:bg-loss/90",
                isDisabled: em,
                isLoading: eo,
                "data-testid": "delete-account-confirm",
                children: Q,
              })),
              (J[59] = eo),
              (J[60] = em),
              (J[61] = Q),
              (J[62] = B))
            : (B = J[62]),
          J[63] !== Y
            ? ((H = Y("profile.edit.delete.cancel_back")),
              (J[63] = Y),
              (J[64] = H))
            : (H = J[64]),
          J[65] !== eo || J[66] !== ec || J[67] !== H
            ? ((W = (0, t.jsx)(r.K, {
                type: "button",
                variant: "secondary",
                isFullWidth: !0,
                isDisabled: eo,
                onClick: ec,
                "data-testid": "delete-account-cancel",
                children: H,
              })),
              (J[65] = eo),
              (J[66] = ec),
              (J[67] = H),
              (J[68] = W))
            : (W = J[68]),
          J[69] !== B || J[70] !== W
            ? ((V = (0, t.jsxs)("footer", {
                className: "flex flex-col gap-2 pt-1",
                children: [B, W],
              })),
              (J[69] = B),
              (J[70] = W),
              (J[71] = V))
            : (V = J[71]),
          J[72] !== eu ||
          J[73] !== A ||
          J[74] !== z ||
          J[75] !== I ||
          J[76] !== L ||
          J[77] !== V ||
          J[78] !== ep
            ? (($ = (0, t.jsx)(r.s, {
                className: "max-w-[420px]",
                children: (0, t.jsxs)("form", {
                  onSubmit: eu,
                  "aria-busy": ep,
                  "data-testid": "delete-account-dialog",
                  className: "flex flex-col gap-4 p-1",
                  children: [A, z, I, L, V],
                }),
              })),
              (J[72] = eu),
              (J[73] = A),
              (J[74] = z),
              (J[75] = I),
              (J[76] = L),
              (J[77] = V),
              (J[78] = ep),
              (J[79] = $))
            : ($ = J[79]),
          J[80] !== M || J[81] !== $ || J[82] !== b
            ? ((G = (0, t.jsx)(r.v, {
                isOpen: M,
                onIsOpenChange: b,
                children: $,
              })),
              (J[80] = M),
              (J[81] = $),
              (J[82] = b),
              (J[83] = G))
            : (G = J[83]),
          G
        );
      },
    ],
    305384,
  );
};
