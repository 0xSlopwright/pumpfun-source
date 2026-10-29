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
    o = e.i(324752),
    c = e.i(51206),
    d = e.i(764844),
    u = e.i(944410),
    m = e.i(690877);
  let p = e.i(402030).contract["GET /mutes"].response,
    x = async (e) => {
      let t = await e.api("GET /mutes", { signal: e.signal });
      return p.parse(t);
    },
    f = async (e) => {
      await e.api("POST /mutes/{userId}", { params: { userId: e.userId } });
    },
    h = async (e) => {
      await e.api("DELETE /mutes/{userId}", { params: { userId: e.userId } });
    },
    g = (e) => new Set(e ?? []);
  e.s(
    [
      "D",
      0,
      (e) => {
        let { rows: t, mutedUserIds: l, getAuthorId: a } = e;
        if (!t || !l || 0 === l.size) return t;
        let s = t.filter((e) => {
          let t;
          return ((t = a(e)), !(l && t && l.has(t)));
        });
        return s.length === t.length ? t : s;
      },
      "m",
      0,
      g,
    ],
    561903,
  );
  var y = e.i(779106);
  let b = (e) => ["mutes", "list", e],
    v = (e) => e.userIds,
    w = (e) => {
      let t,
        a,
        s,
        r,
        i = (0, l.c)(10);
      i[0] !== e
        ? ((t = void 0 === e ? {} : e), (i[0] = e), (i[1] = t))
        : (t = i[1]);
      let { enabled: n } = t,
        o = (0, u.useClientServerContract)(),
        c = (0, y.f)("mutes");
      (i[2] !== c ? ((a = b(c)), (i[2] = c), (i[3] = a)) : (a = i[3]),
        i[4] !== o
          ? ((s = (e) => {
              let { signal: t } = e;
              return x({ api: o, signal: t });
            }),
            (i[4] = o),
            (i[5] = s))
          : (s = i[5]));
      let d = (void 0 === n || n) && null !== c;
      return (
        i[6] !== a || i[7] !== s || i[8] !== d
          ? ((r = {
              queryKey: a,
              queryFn: s,
              select: v,
              enabled: d,
              staleTime: 6e4,
            }),
            (i[6] = a),
            (i[7] = s),
            (i[8] = d),
            (i[9] = r))
          : (r = i[9]),
        (0, m.useQuery)(r)
      );
    };
  e.s(
    [
      "R",
      0,
      b,
      "_",
      0,
      (e) => {
        let t,
          a,
          s = (0, l.c)(4);
        s[0] !== e
          ? ((t = void 0 === e ? {} : e), (s[0] = e), (s[1] = t))
          : (t = s[1]);
        let { data: r } = w(t);
        return (
          s[2] !== r ? ((a = g(r)), (s[2] = r), (s[3] = a)) : (a = s[3]),
          a
        );
      },
      "L",
      0,
      w,
    ],
    777997,
  );
  var j = e.i(132838),
    _ = e.i(606933),
    k = e.i(466931),
    N = e.i(338319),
    I = e.i(198825);
  function C(e) {
    return e.stopPropagation();
  }
  function S(e) {
    return e.stopPropagation();
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let m,
          p,
          x,
          g,
          v,
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
          B,
          W,
          X,
          Z,
          J,
          Y,
          G,
          ee,
          et,
          el,
          ea,
          es,
          er,
          ei,
          en,
          eo,
          ec = (0, l.c)(59),
          { target: ed, author: eu, density: em, className: ep } = e,
          { t: ex } = (0, i.f)(),
          { address: ef } = (0, s.F)(),
          { setShowWallet: eh } = (0, I.useConnectWallet)(),
          [eg, ey] = (0, r.useState)(!1),
          [eb, ev] = (0, r.useState)(!1),
          ew = eu.userId || null,
          ej = eg && null !== ew;
        ec[0] !== ej
          ? ((m = { enabled: ej }), (ec[0] = ej), (ec[1] = m))
          : (m = ec[1]);
        let e_ = w(m),
          ek =
            ((B = (0, l.c)(14)),
            (W = (0, u.useClientServerContract)()),
            (X = (0, _.useQueryClient)()),
            (Z = (0, y.f)("mutes")),
            B[0] !== Z ? ((F = b(Z)), (B[0] = Z), (B[1] = F)) : (F = B[1]),
            (J = F),
            B[2] !== W
              ? ((M = (e) => {
                  let { userId: t } = e;
                  return f({ api: W, userId: t });
                }),
                (B[2] = W),
                (B[3] = M))
              : (M = B[3]),
            B[4] !== X || B[5] !== J
              ? ((Q = async (e) => {
                  let { userId: t } = e;
                  await X.cancelQueries({ queryKey: J });
                  let l = X.getQueryData(J);
                  return (
                    X.setQueryData(J, (e) =>
                      !e || e.userIds.includes(t)
                        ? e
                        : { userIds: [t, ...e.userIds] },
                    ),
                    { previous: l }
                  );
                }),
                (V = (e, t, l) => {
                  let { userId: a } = t;
                  (l?.previous && X.setQueryData(J, l.previous),
                    (0, k.l)({
                      error: e,
                      feature: "mutes",
                      operation: "mute",
                      context: { userId: a },
                    }));
                }),
                (K = () => {
                  X.invalidateQueries({ queryKey: J });
                }),
                (B[4] = X),
                (B[5] = J),
                (B[6] = Q),
                (B[7] = V),
                (B[8] = K))
              : ((Q = B[6]), (V = B[7]), (K = B[8])),
            B[9] !== M || B[10] !== Q || B[11] !== V || B[12] !== K
              ? ((H = { mutationFn: M, onMutate: Q, onError: V, onSettled: K }),
                (B[9] = M),
                (B[10] = Q),
                (B[11] = V),
                (B[12] = K),
                (B[13] = H))
              : (H = B[13]),
            (0, j.f)(H)),
          eN =
            ((es = (0, l.c)(14)),
            (er = (0, u.useClientServerContract)()),
            (ei = (0, _.useQueryClient)()),
            (en = (0, y.f)("mutes")),
            es[0] !== en
              ? ((Y = b(en)), (es[0] = en), (es[1] = Y))
              : (Y = es[1]),
            (eo = Y),
            es[2] !== er
              ? ((G = (e) => {
                  let { userId: t } = e;
                  return h({ api: er, userId: t });
                }),
                (es[2] = er),
                (es[3] = G))
              : (G = es[3]),
            es[4] !== ei || es[5] !== eo
              ? ((ee = async (e) => {
                  let { userId: t } = e;
                  await ei.cancelQueries({ queryKey: eo });
                  let l = ei.getQueryData(eo);
                  return (
                    ei.setQueryData(eo, (e) => {
                      if (!e) return e;
                      let l = e.userIds.filter((e) => e !== t);
                      return l.length === e.userIds.length ? e : { userIds: l };
                    }),
                    { previous: l }
                  );
                }),
                (et = (e, t, l) => {
                  let { userId: a } = t;
                  (l?.previous && ei.setQueryData(eo, l.previous),
                    (0, k.l)({
                      error: e,
                      feature: "mutes",
                      operation: "unmute",
                      context: { userId: a },
                    }));
                }),
                (el = () => {
                  ei.invalidateQueries({ queryKey: eo });
                }),
                (es[4] = ei),
                (es[5] = eo),
                (es[6] = ee),
                (es[7] = et),
                (es[8] = el))
              : ((ee = es[6]), (et = es[7]), (el = es[8])),
            es[9] !== G || es[10] !== ee || es[11] !== et || es[12] !== el
              ? ((ea = {
                  mutationFn: G,
                  onMutate: ee,
                  onError: et,
                  onSettled: el,
                }),
                (es[9] = G),
                (es[10] = ee),
                (es[11] = et),
                (es[12] = el),
                (es[13] = ea))
              : (ea = es[13]),
            (0, j.f)(ea));
        ec[2] !== ew || ec[3] !== e_
          ? ((p = null !== ew && (e_.data?.includes(ew) ?? !1)),
            (ec[2] = ew),
            (ec[3] = e_),
            (ec[4] = p))
          : (p = ec[4]);
        let eI = p,
          eC = "terminal" === em ? "size-3.5" : "size-4";
        ec[5] !== ef || ec[6] !== eh
          ? ((x = () => !!ef || (eh(!0), !1)),
            (ec[5] = ef),
            (ec[6] = eh),
            (ec[7] = x))
          : (x = ec[7]);
        let eS = x;
        ec[8] !== ew ||
        ec[9] !== eI ||
        ec[10] !== ek ||
        ec[11] !== eS ||
        ec[12] !== ex ||
        ec[13] !== eN
          ? ((g = () => {
              null !== ew &&
                eS() &&
                (eI ? eN : ek).mutate(
                  { userId: ew },
                  {
                    onSuccess: () =>
                      n.c.success(
                        eI
                          ? ex("profile.mutes.unmute_success")
                          : ex("profile.mutes.mute_success"),
                      ),
                    onError: () =>
                      n.c.error(ex("web.callouts.more.mute_failed")),
                  },
                );
            }),
            (ec[8] = ew),
            (ec[9] = eI),
            (ec[10] = ek),
            (ec[11] = eS),
            (ec[12] = ex),
            (ec[13] = eN),
            (ec[14] = g))
          : (g = ec[14]);
        let eA = g;
        (ec[15] !== ex
          ? ((v = ex("web.callouts.more.options_a11y")),
            (ec[15] = ex),
            (ec[16] = v))
          : (v = ec[16]),
          ec[17] !== ep || ec[18] !== em || ec[19] !== eg
            ? ((A = (0, N.c)(
                (0, c.x)({ density: em, size: 24, active: eg }),
                ep,
              )),
              (ec[17] = ep),
              (ec[18] = em),
              (ec[19] = eg),
              (ec[20] = A))
            : (A = ec[20]),
          ec[21] === Symbol.for("react.memo_cache_sentinel")
            ? ((U = (0, t.jsx)(a.Hs, {})), (ec[21] = U))
            : (U = ec[21]),
          ec[22] !== v || ec[23] !== A
            ? ((L = (0, t.jsx)(d.g, {
                "aria-label": v,
                "data-testid": "callout-more-menu",
                onClick: S,
                className: A,
                children: U,
              })),
              (ec[22] = v),
              (ec[23] = A),
              (ec[24] = L))
            : (L = ec[24]));
        let eU = "terminal" === em;
        return (
          ec[25] !== eu.name ||
          ec[26] !== ew ||
          ec[27] !== eC ||
          ec[28] !== eA ||
          ec[29] !== eI ||
          ec[30] !== ek ||
          ec[31] !== ex ||
          ec[32] !== eN
            ? ((z =
                null !== ew
                  ? (0, t.jsxs)(d.d, {
                      "data-testid": "callout-more-menu-mute",
                      disabled: ek.isPending || eN.isPending,
                      onClick: eA,
                      children: [
                        eI
                          ? (0, t.jsx)(a.a6, { className: eC })
                          : (0, t.jsx)(a.cT, { className: eC }),
                        eI
                          ? ex("profile.mutes.unmute")
                          : ex("profile.mutes.mute_user", {
                              user_name: `@${eu.name}`,
                            }),
                      ],
                    })
                  : null),
              (ec[25] = eu.name),
              (ec[26] = ew),
              (ec[27] = eC),
              (ec[28] = eA),
              (ec[29] = eI),
              (ec[30] = ek),
              (ec[31] = ex),
              (ec[32] = eN),
              (ec[33] = z))
            : (z = ec[33]),
          ec[34] !== eS
            ? ((P = () => {
                eS() && ev(!0);
              }),
              (ec[34] = eS),
              (ec[35] = P))
            : (P = ec[35]),
          ec[36] !== eC
            ? ((q = (0, t.jsx)(a.Ig, { className: eC })),
              (ec[36] = eC),
              (ec[37] = q))
            : (q = ec[37]),
          ec[38] !== ex || ec[39] !== ed.kind
            ? ((O =
                "callout" === ed.kind
                  ? ex("web.callouts.more.report_callout")
                  : ex("web.callouts.more.report_reply")),
              (ec[38] = ex),
              (ec[39] = ed.kind),
              (ec[40] = O))
            : (O = ec[40]),
          ec[41] !== P || ec[42] !== q || ec[43] !== O
            ? ((T = (0, t.jsxs)(d.d, {
                "data-testid": "callout-more-menu-report",
                onClick: P,
                children: [q, O],
              })),
              (ec[41] = P),
              (ec[42] = q),
              (ec[43] = O),
              (ec[44] = T))
            : (T = ec[44]),
          ec[45] !== eU || ec[46] !== z || ec[47] !== T
            ? ((E = (0, t.jsxs)(d.A, {
                align: "end",
                dense: eU,
                className: "w-52",
                onClick: C,
                children: [z, T],
              })),
              (ec[45] = eU),
              (ec[46] = z),
              (ec[47] = T),
              (ec[48] = E))
            : (E = ec[48]),
          ec[49] !== eg || ec[50] !== E || ec[51] !== L
            ? ((R = (0, t.jsxs)(d.k, {
                open: eg,
                onOpenChange: ey,
                modal: !1,
                children: [L, E],
              })),
              (ec[49] = eg),
              (ec[50] = E),
              (ec[51] = L),
              (ec[52] = R))
            : (R = ec[52]),
          ec[53] !== eb || ec[54] !== ed
            ? (($ = eb
                ? (0, t.jsx)(o.f, { onOpenChange: ev, open: eb, target: ed })
                : null),
              (ec[53] = eb),
              (ec[54] = ed),
              (ec[55] = $))
            : ($ = ec[55]),
          ec[56] !== R || ec[57] !== $
            ? ((D = (0, t.jsxs)(t.Fragment, { children: [R, $] })),
              (ec[56] = R),
              (ec[57] = $),
              (ec[58] = D))
            : (D = ec[58]),
          D
        );
      },
    ],
    609488,
  );
};
