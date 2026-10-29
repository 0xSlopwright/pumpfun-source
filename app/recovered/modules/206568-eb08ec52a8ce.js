// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(157633),
    i = e.i(745018),
    s = e.i(439587),
    a = e.i(705313),
    l = e.i(352386);
  e.i(12692);
  var o = e.i(398902),
    c = e.i(563124),
    u = e.i(15359),
    d = e.i(169323),
    f = e.i(741084),
    m = e.i(673550),
    E = e.i(677778),
    p = e.i(604860),
    h = e.i(307105),
    _ = e.i(890088),
    O = e.i(338319),
    N = e.i(369091);
  function I(e) {
    return "mutual" === e.kind;
  }
  function R(e) {
    return "conversation" === e.kind;
  }
  function T(e) {
    let n,
      i = (0, r.c)(2),
      { children: s } = e;
    return (
      i[0] !== s
        ? ((n = (0, t.jsx)("p", {
            className:
              "px-3 pb-1 pt-3 text-xs font-semibold text-text-tertiary",
            children: s,
          })),
          (i[0] = s),
          (i[1] = n))
        : (n = i[1]),
      n
    );
  }
  function g(e) {
    let i,
      s,
      a,
      l,
      o,
      c,
      u = (0, r.c)(21),
      { recipient: d, groupName: f, isSelected: m, onPick: E } = e;
    u[0] !== d.entry || u[1] !== d.kind || u[2] !== d.mutual
      ? ((i =
          "conversation" === d.kind
            ? (0, t.jsx)(x, { entry: d.entry })
            : (0, t.jsx)(A, { mutual: d.mutual })),
        (u[0] = d.entry),
        (u[1] = d.kind),
        (u[2] = d.mutual),
        (u[3] = i))
      : (i = u[3]);
    let p = i,
      h = m && "bg-bg-secondary";
    return (
      u[4] !== h
        ? ((s = (0, O.c)(
            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-secondary has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-primary-green",
            h,
          )),
          (u[4] = h),
          (u[5] = s))
        : (s = u[5]),
      u[6] !== E || u[7] !== d.peerId
        ? ((a = () => E(d.peerId)), (u[6] = E), (u[7] = d.peerId), (u[8] = a))
        : (a = u[8]),
      u[9] !== f || u[10] !== m || u[11] !== d.peerId || u[12] !== a
        ? ((l = (0, t.jsx)("input", {
            checked: m,
            className: "sr-only",
            name: f,
            onChange: a,
            type: "radio",
            value: d.peerId,
          })),
          (u[9] = f),
          (u[10] = m),
          (u[11] = d.peerId),
          (u[12] = a),
          (u[13] = l))
        : (l = u[13]),
      u[14] !== m
        ? ((o = m
            ? (0, t.jsx)(n.y$, {
                "aria-hidden": !0,
                className: "size-6 shrink-0 text-text-primary",
              })
            : null),
          (u[14] = m),
          (u[15] = o))
        : (o = u[15]),
      u[16] !== p || u[17] !== s || u[18] !== l || u[19] !== o
        ? ((c = (0, t.jsxs)("label", {
            className: s,
            "data-testid": "dm-share-recipient",
            children: [l, p, o],
          })),
          (u[16] = p),
          (u[17] = s),
          (u[18] = l),
          (u[19] = o),
          (u[20] = c))
        : (c = u[20]),
      c
    );
  }
  function x(e) {
    let n,
      i,
      s = (0, r.c)(10),
      { entry: a } = e,
      { t: l } = (0, o.f)(),
      c = (0, m.f)(a.peerId);
    if (s[0] !== a || s[1] !== l) {
      let e = (0, d._)(a),
        t = null === e ? null : (0, _.K)({ t: l, timestampMs: e, suffix: !1 });
      ((n =
        null === t
          ? l("chat.dms.share.never_messaged")
          : l("chat.dms.share.last_messaged", { time_ago: t })),
        (s[0] = a),
        (s[1] = l),
        (s[2] = n));
    } else n = s[2];
    let u = n,
      f = null === c.username;
    return (
      s[3] !== c.avatarSeed ||
      s[4] !== c.avatarSrc ||
      s[5] !== c.displayName ||
      s[6] !== c.isLoading ||
      s[7] !== u ||
      s[8] !== f
        ? ((i = (0, t.jsx)(y, {
            avatarSeed: c.avatarSeed,
            avatarSrc: c.avatarSrc,
            isAnonymous: f,
            isLoading: c.isLoading,
            name: c.displayName,
            subtitle: u,
          })),
          (s[3] = c.avatarSeed),
          (s[4] = c.avatarSrc),
          (s[5] = c.displayName),
          (s[6] = c.isLoading),
          (s[7] = u),
          (s[8] = f),
          (s[9] = i))
        : (i = s[9]),
      i
    );
  }
  function A(e) {
    let n,
      i,
      s,
      a,
      l,
      c = (0, r.c)(14),
      { mutual: u } = e,
      { t: d } = (0, o.f)();
    (c[0] !== u ? ((n = (0, h.D)(u)), (c[0] = u), (c[1] = n)) : (n = c[1]),
      c[2] !== u.profileImageUrl
        ? ((i = (0, f.f)(u.profileImageUrl)),
          (c[2] = u.profileImageUrl),
          (c[3] = i))
        : (i = c[3]));
    let m = !u.username;
    return (
      c[4] !== u ? ((s = (0, h.m)(u)), (c[4] = u), (c[5] = s)) : (s = c[5]),
      c[6] !== d
        ? ((a = d("chat.dms.share.never_messaged")), (c[6] = d), (c[7] = a))
        : (a = c[7]),
      c[8] !== n || c[9] !== i || c[10] !== m || c[11] !== s || c[12] !== a
        ? ((l = (0, t.jsx)(y, {
            avatarSeed: n,
            avatarSrc: i,
            isAnonymous: m,
            isLoading: !1,
            name: s,
            subtitle: a,
          })),
          (c[8] = n),
          (c[9] = i),
          (c[10] = m),
          (c[11] = s),
          (c[12] = a),
          (c[13] = l))
        : (l = c[13]),
      l
    );
  }
  function y(e) {
    let n,
      i,
      s,
      l,
      o,
      c = (0, r.c)(16),
      {
        avatarSeed: u,
        avatarSrc: d,
        isAnonymous: f,
        isLoading: m,
        name: E,
        subtitle: p,
      } = e,
      { ipfsPrefix: h } = (0, N.useIpfsPrefix)();
    return (
      c[0] !== u || c[1] !== d || c[2] !== h || c[3] !== f
        ? ((n = (0, t.jsx)(a.f, {
            address: u,
            alt: "",
            className: "size-10 shrink-0 rounded-full object-cover",
            height: 40,
            ipfsPrefix: h,
            isAnonymous: f,
            src: d,
            width: 40,
          })),
          (c[0] = u),
          (c[1] = d),
          (c[2] = h),
          (c[3] = f),
          (c[4] = n))
        : (n = c[4]),
      c[5] !== m || c[6] !== E
        ? ((i = m
            ? (0, t.jsxs)(t.Fragment, {
                children: [
                  (0, t.jsx)("span", {
                    "aria-hidden": !0,
                    className:
                      "my-[3px] block h-3.5 w-28 animate-pulse rounded-md bg-bg-secondary",
                  }),
                  (0, t.jsx)("span", { className: "sr-only", children: E }),
                ],
              })
            : (0, t.jsx)("span", {
                className: "truncate text-sm font-semibold text-text-primary",
                children: E,
              })),
          (c[5] = m),
          (c[6] = E),
          (c[7] = i))
        : (i = c[7]),
      c[8] !== p
        ? ((s = (0, t.jsx)("span", {
            className: "truncate pt-0.5 text-xs text-text-tertiary",
            children: p,
          })),
          (c[8] = p),
          (c[9] = s))
        : (s = c[9]),
      c[10] !== i || c[11] !== s
        ? ((l = (0, t.jsxs)("span", {
            className: "flex min-w-0 flex-1 flex-col",
            children: [i, s],
          })),
          (c[10] = i),
          (c[11] = s),
          (c[12] = l))
        : (l = c[12]),
      c[13] !== n || c[14] !== l
        ? ((o = (0, t.jsxs)(t.Fragment, { children: [n, l] })),
          (c[13] = n),
          (c[14] = l),
          (c[15] = o))
        : (o = c[15]),
      o
    );
  }
  function v(e) {
    let n,
      i,
      a,
      l = (0, r.c)(8),
      { label: c, onRetry: u } = e,
      { t: d } = (0, o.f)();
    return (
      l[0] !== d
        ? ((n = d("common.retry")), (l[0] = d), (l[1] = n))
        : (n = l[1]),
      l[2] !== u || l[3] !== n
        ? ((i = (0, t.jsx)(s.K, {
            onClick: u,
            size: 32,
            variant: "secondary",
            children: n,
          })),
          (l[2] = u),
          (l[3] = n),
          (l[4] = i))
        : (i = l[4]),
      l[5] !== c || l[6] !== i
        ? ((a = (0, t.jsxs)("div", {
            className:
              "flex flex-col items-center gap-2 px-4 py-6 text-sm text-text-tertiary",
            role: "alert",
            children: [c, i],
          })),
          (l[5] = c),
          (l[6] = i),
          (l[7] = a))
        : (a = l[7]),
      a
    );
  }
  function S() {
    let e,
      n,
      s,
      a = (0, r.c)(5),
      { t: l } = (0, o.f)();
    return (
      a[0] !== l
        ? ((e = l("common.loading")), (a[0] = l), (a[1] = e))
        : (e = a[1]),
      a[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((n = (0, t.jsx)(i.AC, {
            "aria-hidden": !0,
            className: "size-5 animate-spin text-text-tertiary",
          })),
          (a[2] = n))
        : (n = a[2]),
      a[3] !== e
        ? ((s = (0, t.jsx)("div", {
            "aria-label": e,
            className: "flex items-center justify-center py-3",
            role: "status",
            children: n,
          })),
          (a[3] = e),
          (a[4] = s))
        : (s = a[4]),
      s
    );
  }
  e.s([
    "DmSharePicker",
    0,
    function (e) {
      let n,
        i,
        a,
        d,
        f,
        m,
        _,
        O,
        N,
        x,
        A,
        y,
        C,
        D = (0, r.c)(79),
        { url: M, onSent: b } = e,
        { t: j } = (0, o.f)(),
        k = (0, l.useId)();
      D[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((n = { enabled: !0, waitForFullInbox: !0 }), (D[0] = n))
        : (n = D[0]);
      let {
          recipients: P,
          isLoading: w,
          hasReadError: U,
          hasMore: B,
          isFetchingMore: H,
          isFetchMoreError: F,
          fetchMore: L,
          retry: W,
        } = (0, E.f)(n),
        [G, K] = (0, l.useState)(null);
      if (D[1] !== P || D[2] !== G) {
        let e;
        (D[4] !== G
          ? ((e = (e) => e.peerId === G), (D[4] = G), (D[5] = e))
          : (e = D[5]),
          (i = P.find(e)),
          (D[1] = P),
          (D[2] = G),
          (D[3] = i));
      } else i = D[3];
      let X = i,
        V = X?.peerId ?? "";
      D[6] !== V || D[7] !== M
        ? ((a = { url: M, peerId: V, surface: "picker" }),
          (D[6] = V),
          (D[7] = M),
          (D[8] = a))
        : (a = D[8]);
      let { share: z, isSending: Q } = (0, p.f)(a),
        $ = (0, l.useRef)(!1);
      D[9] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = (e) => {
            $.current || K(e);
          }),
          (D[9] = d))
        : (d = D[9]);
      let J = d;
      D[10] !== b || D[11] !== X || D[12] !== z
        ? ((f = () => {
            void 0 === X ||
              $.current ||
              (($.current = !0),
              z((0, h._)(X)).then((e) => {
                (($.current = !1), e && b());
              }));
          }),
          (D[10] = b),
          (D[11] = X),
          (D[12] = z),
          (D[13] = f))
        : (f = D[13]);
      let q = f,
        { ref: Y, inView: Z } = (0, c.f)(),
        ee = B && !H && !F;
      (D[14] !== ee || D[15] !== L || D[16] !== Z
        ? ((m = () => {
            Z && ee && L();
          }),
          (_ = [Z, ee, L]),
          (D[14] = ee),
          (D[15] = L),
          (D[16] = Z),
          (D[17] = m),
          (D[18] = _))
        : ((m = D[17]), (_ = D[18])),
        (0, l.useEffect)(m, _),
        D[19] !== j
          ? ((O = j("chat.dms.share.send_to")), (D[19] = j), (D[20] = O))
          : (O = D[20]));
      let et = O;
      if (
        D[21] !== L ||
        D[22] !== k ||
        D[23] !== B ||
        D[24] !== U ||
        D[25] !== F ||
        D[26] !== H ||
        D[27] !== w ||
        D[28] !== P ||
        D[29] !== W ||
        D[30] !== X?.peerId ||
        D[31] !== Y ||
        D[32] !== j ||
        D[33] !== et
      ) {
        let e,
          r = P.filter(R),
          n = P.filter(I),
          i = r.length > 0 && n.length > 0;
        D[35] !== k || D[36] !== X?.peerId
          ? ((e = (e) =>
              (0, t.jsx)(
                g,
                {
                  groupName: k,
                  isSelected: e.peerId === X?.peerId,
                  onPick: J,
                  recipient: e,
                },
                `${e.kind}:${e.peerId}`,
              )),
            (D[35] = k),
            (D[36] = X?.peerId),
            (D[37] = e))
          : (e = D[37]);
        let s = e;
        if (w) {
          let e;
          (D[38] !== et
            ? ((e = (0, t.jsx)(u.f, { label: et, variant: "picker" })),
              (D[38] = et),
              (D[39] = e))
            : (e = D[39]),
            (N = e));
        } else if (0 === P.length && U) {
          let e, r;
          (D[40] !== j
            ? ((e = j("common.something_went_wrong")), (D[40] = j), (D[41] = e))
            : (e = D[41]),
            D[42] !== W || D[43] !== e
              ? ((r = (0, t.jsx)(v, { label: e, onRetry: W })),
                (D[42] = W),
                (D[43] = e),
                (D[44] = r))
              : (r = D[44]),
            (N = r));
        } else if (0 !== P.length || B) {
          let e, a, l, o, c;
          (D[49] !== et
            ? ((e = (0, t.jsx)("legend", {
                className: "sr-only",
                children: et,
              })),
              (D[49] = et),
              (D[50] = e))
            : (e = D[50]),
            D[51] !== i || D[52] !== j
              ? ((a = i
                  ? (0, t.jsx)(T, {
                      children: j("chat.dms.share.conversations"),
                    })
                  : null),
                (D[51] = i),
                (D[52] = j),
                (D[53] = a))
              : (a = D[53]),
            D[54] !== i || D[55] !== j
              ? ((l = i
                  ? (0, t.jsx)(T, { children: j("chat.dms.share.mutuals") })
                  : null),
                (D[54] = i),
                (D[55] = j),
                (D[56] = l))
              : (l = D[56]));
          let u = (0, t.jsxs)("fieldset", {
            className: "flex flex-col",
            children: [e, a, r.map(s), l, n.map(s)],
          });
          (D[57] !== L ||
          D[58] !== B ||
          D[59] !== F ||
          D[60] !== H ||
          D[61] !== Y ||
          D[62] !== j
            ? ((o = F
                ? (0, t.jsx)(v, {
                    label: j("common.something_went_wrong"),
                    onRetry: L,
                  })
                : B
                  ? (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsx)("div", {
                          "aria-hidden": !0,
                          className: "h-2 w-full",
                          ref: Y,
                        }),
                        H ? (0, t.jsx)(S, {}) : null,
                      ],
                    })
                  : null),
              (D[57] = L),
              (D[58] = B),
              (D[59] = F),
              (D[60] = H),
              (D[61] = Y),
              (D[62] = j),
              (D[63] = o))
            : (o = D[63]),
            D[64] !== u || D[65] !== o
              ? ((c = (0, t.jsxs)(t.Fragment, { children: [u, o] })),
                (D[64] = u),
                (D[65] = o),
                (D[66] = c))
              : (c = D[66]),
            (N = c));
        } else {
          let e, r;
          (D[45] !== j
            ? ((e = j("chat.dms.new_chat.empty")), (D[45] = j), (D[46] = e))
            : (e = D[46]),
            D[47] !== e
              ? ((r = (0, t.jsx)("p", {
                  className:
                    "px-4 py-12 text-center text-sm leading-[18px] text-text-secondary",
                  children: e,
                })),
                (D[47] = e),
                (D[48] = r))
              : (r = D[48]),
            (N = r));
        }
        ((D[21] = L),
          (D[22] = k),
          (D[23] = B),
          (D[24] = U),
          (D[25] = F),
          (D[26] = H),
          (D[27] = w),
          (D[28] = P),
          (D[29] = W),
          (D[30] = X?.peerId),
          (D[31] = Y),
          (D[32] = j),
          (D[33] = et),
          (D[34] = N));
      } else N = D[34];
      D[67] !== N
        ? ((x = (0, t.jsx)("div", {
            className:
              "-mx-1 max-h-[min(60dvh,28rem)] min-h-0 overflow-y-auto px-1",
            children: N,
          })),
          (D[67] = N),
          (D[68] = x))
        : (x = D[68]);
      let er = void 0 === X;
      return (
        D[69] !== j
          ? ((A = j("common.send")), (D[69] = j), (D[70] = A))
          : (A = D[70]),
        D[71] !== Q || D[72] !== q || D[73] !== er || D[74] !== A
          ? ((y = (0, t.jsx)(s.K, {
              isDisabled: er,
              isFullWidth: !0,
              isLoading: Q,
              onClick: q,
              size: 44,
              variant: "primary",
              children: A,
            })),
            (D[71] = Q),
            (D[72] = q),
            (D[73] = er),
            (D[74] = A),
            (D[75] = y))
          : (y = D[75]),
        D[76] !== x || D[77] !== y
          ? ((C = (0, t.jsxs)("div", {
              className: "flex min-h-0 flex-col gap-3",
              children: [x, y],
            })),
            (D[76] = x),
            (D[77] = y),
            (D[78] = C))
          : (C = D[78]),
        C
      );
    },
  ]);
};
