// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386),
    n = e.i(279577),
    i = e.i(944410),
    s = e.i(761459),
    a = e.i(606933),
    l = e.i(202556),
    o = e.i(234761),
    c = e.i(291313),
    u = e.i(126965),
    d = e.i(779106);
  function f(e) {
    return e.nextCursor ?? void 0;
  }
  function m(e) {
    return e.entries;
  }
  function E(e) {
    let t = new Set();
    return (0, c.f)(
      e.pages
        .flatMap(m)
        .filter(
          (e) => !t.has(e.conversationId) && (t.add(e.conversationId), !0),
        ),
    );
  }
  var p = e.i(365089);
  let h = ({
      mutuals: e,
      entries: t,
      waitForFullInbox: r,
      isInboxComplete: n,
    }) => {
      if (r && !n) return [];
      let i = new Set(t.map((e) => e.peerId));
      return e.filter((e) => !i.has(e.userId));
    },
    _ = (e) => e.walletAddress ?? e.userId,
    O = ({ entries: e, newPeers: t }) => [
      ...e.map((e) => ({ kind: "conversation", peerId: e.peerId, entry: e })),
      ...t.map((e) => ({ kind: "mutual", peerId: _(e), mutual: e })),
    ];
  e.s(
    [
      "e",
      0,
      500,
      "u",
      0,
      h,
      "a",
      0,
      O,
      "m",
      0,
      (e) =>
        e.username || (e.walletAddress ? (0, p.d)(e.walletAddress) : e.userId),
      "D",
      0,
      _,
      "_",
      0,
      (e) =>
        "conversation" === e.kind
          ? {
              peerId: e.peerId,
              analyticsPeerId: e.entry.peerId,
              isExistingConversation: !0,
            }
          : {
              peerId: e.peerId,
              analyticsPeerId: e.mutual.userId,
              isExistingConversation: !1,
            },
    ],
    307105,
  );
  let N = [],
    I = [];
  e.s(
    [
      "f",
      0,
      (e) => {
        let c,
          m,
          p,
          _,
          R,
          T,
          g,
          x,
          A = (0, t.c)(32),
          { enabled: y, waitForFullInbox: v } = e;
        A[0] !== y
          ? ((c = { enabled: y }), (A[0] = y), (A[1] = c))
          : (c = A[1]);
        let S = ((e) => {
          let r,
            n,
            c,
            m,
            p,
            h,
            _ = (0, t.c)(16),
            { enabled: O } = e,
            N = (0, i.useClientServerContract)(),
            I = (0, a.useQueryClient)(),
            R = (0, d.f)("dm-inbox");
          _[0] !== R
            ? ((r = (0, u.i)(R, "inbox", o.f)), (_[0] = R), (_[1] = r))
            : (r = _[1]);
          let T = r;
          _[2] !== R
            ? ((n = (0, u.K)(R, o.f)), (_[2] = R), (_[3] = n))
            : (n = _[3]);
          let g = O && null !== R;
          return (
            _[4] !== I || _[5] !== T
              ? ((c = () => I.getQueryData(T)),
                (m = () => I.getQueryState(T)?.dataUpdatedAt),
                (_[4] = I),
                (_[5] = T),
                (_[6] = c),
                (_[7] = m))
              : ((c = _[6]), (m = _[7])),
            _[8] !== N
              ? ((p = (e) => {
                  let { pageParam: t, signal: r } = e;
                  return (0, l.q)(N, {
                    limit: o.f,
                    cursor: t,
                    filter: "inbox",
                    signal: r,
                  });
                }),
                (_[8] = N),
                (_[9] = p))
              : (p = _[9]),
            _[10] !== n ||
            _[11] !== g ||
            _[12] !== c ||
            _[13] !== m ||
            _[14] !== p
              ? ((h = {
                  queryKey: n,
                  enabled: g,
                  initialData: c,
                  initialDataUpdatedAt: m,
                  staleTime: 3e4,
                  gcTime: 0,
                  initialPageParam: void 0,
                  queryFn: p,
                  getNextPageParam: f,
                  select: E,
                }),
                (_[10] = n),
                (_[11] = g),
                (_[12] = c),
                (_[13] = m),
                (_[14] = p),
                (_[15] = h))
              : (h = _[15]),
            (0, s.useInfiniteQuery)(h)
          );
        })(c);
        A[2] !== y
          ? ((m = { enabled: y }), (A[2] = y), (A[3] = m))
          : (m = A[3]);
        let C = (0, n.f)(m),
          D = y && v,
          M = S.data ?? N,
          b = M.length,
          {
            hasNextPage: j,
            isFetching: k,
            isFetchNextPageError: P,
            fetchNextPage: w,
          } = S;
        (A[4] !== b ||
        A[5] !== w ||
        A[6] !== j ||
        A[7] !== D ||
        A[8] !== P ||
        A[9] !== k
          ? ((p = () => {
              D && !(b >= 500) && (!j || k || P || w({ cancelRefetch: !1 }));
            }),
            (_ = [D, b, j, k, P, w]),
            (A[4] = b),
            (A[5] = w),
            (A[6] = j),
            (A[7] = D),
            (A[8] = P),
            (A[9] = k),
            (A[10] = p),
            (A[11] = _))
          : ((p = A[10]), (_ = A[11])),
          (0, r.useEffect)(p, _));
        let U = !S.isLoading && !S.hasNextPage && void 0 !== S.data;
        if (A[12] !== M || A[13] !== U || A[14] !== C.data || A[15] !== v) {
          let e = h({
            mutuals: C.data ?? I,
            entries: M,
            waitForFullInbox: v,
            isInboxComplete: U,
          });
          ((R = O({ entries: M, newPeers: e })),
            (A[12] = M),
            (A[13] = U),
            (A[14] = C.data),
            (A[15] = v),
            (A[16] = R));
        } else R = A[16];
        let B = R;
        A[17] !== S || A[18] !== C
          ? ((T = () => {
              (S.hasNextPage &&
                !S.isFetching &&
                S.fetchNextPage({ cancelRefetch: !1 }),
                C.hasNextPage &&
                  !C.isFetching &&
                  C.fetchNextPage({ cancelRefetch: !1 }));
            }),
            (A[17] = S),
            (A[18] = C),
            (A[19] = T))
          : (T = A[19]);
        let H = T;
        A[20] !== S || A[21] !== C
          ? ((g = () => {
              (S.refetch(), C.refetch());
            }),
            (A[20] = S),
            (A[21] = C),
            (A[22] = g))
          : (g = A[22]);
        let F = g,
          L = S.isLoading || C.isLoading,
          W =
            (S.isError && void 0 === S.data) ||
            (C.isError && void 0 === C.data),
          G = S.hasNextPage || C.hasNextPage,
          K = S.isFetchingNextPage || C.isFetchingNextPage,
          X = S.isFetchNextPageError || C.isFetchNextPageError;
        return (
          A[23] !== H ||
          A[24] !== B ||
          A[25] !== F ||
          A[26] !== G ||
          A[27] !== K ||
          A[28] !== X ||
          A[29] !== L ||
          A[30] !== W
            ? ((x = {
                recipients: B,
                isLoading: L,
                hasReadError: W,
                hasMore: G,
                isFetchingMore: K,
                isFetchMoreError: X,
                fetchMore: H,
                retry: F,
              }),
              (A[23] = H),
              (A[24] = B),
              (A[25] = F),
              (A[26] = G),
              (A[27] = K),
              (A[28] = X),
              (A[29] = L),
              (A[30] = W),
              (A[31] = x))
            : (x = A[31]),
          x
        );
      },
    ],
    677778,
  );
  var R = e.i(292686);
  e.i(12692);
  var T = e.i(398902),
    g = e.i(63289),
    x = e.i(732486),
    A = e.i(157633),
    y = e.i(458310);
  function v(e) {
    let r,
      n,
      i,
      s,
      a,
      l,
      o = (0, t.c)(15),
      { kind: c, roomHref: u, onDismiss: d } = e,
      { t: f } = (0, T.f)();
    return (
      o[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((r = (0, x.jsx)(A.y$, {
            "aria-hidden": !0,
            className: "size-6 shrink-0 text-primary-green",
          })),
          (o[0] = r))
        : (r = o[0]),
      o[1] !== c || o[2] !== f
        ? ((n = (({ kind: e, t }) => {
            switch (e) {
              case "coin":
                return t("chat.dms.share.sent_coin");
              case "callout":
                return t("chat.dms.share.sent_callout");
              case "reply":
                return t("chat.dms.share.sent_post");
              case "profile":
                return t("chat.dms.share.sent_profile");
              default:
                return t("chat.dms.share.sent_generic");
            }
          })({ kind: c, t: f })),
          (o[1] = c),
          (o[2] = f),
          (o[3] = n))
        : (n = o[3]),
      o[4] !== n
        ? ((i = (0, x.jsx)("span", {
            className: "min-w-0 flex-1 text-sm font-semibold text-text-primary",
            children: n,
          })),
          (o[4] = n),
          (o[5] = i))
        : (i = o[5]),
      o[6] !== f
        ? ((s = f("web.notifications.toast.view")), (o[6] = f), (o[7] = s))
        : (s = o[7]),
      o[8] !== s
        ? ((a = (0, x.jsx)("span", {
            className: "shrink-0 text-sm font-bold text-text-accent",
            children: s,
          })),
          (o[8] = s),
          (o[9] = a))
        : (a = o[9]),
      o[10] !== d || o[11] !== u || o[12] !== i || o[13] !== a
        ? ((l = (0, x.jsxs)(y.default, {
            className:
              "flex min-h-[52px] w-[min(420px,calc(100vw-2rem))] items-center gap-2.5 rounded-full border border-border-tertiary bg-bg-primary py-2 pl-3 pr-4 shadow-lg transition-colors hover:bg-bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green",
            "data-testid": "dm-share-sent-toast",
            href: u,
            onClick: d,
            prefetch: !1,
            children: [r, i, a],
          })),
          (o[10] = d),
          (o[11] = u),
          (o[12] = i),
          (o[13] = a),
          (o[14] = l))
        : (l = o[14]),
      l
    );
  }
  var S = e.i(527740),
    C = e.i(762372),
    D = e.i(670055),
    M = e.i(846755),
    b = e.i(595673);
  e.s(
    [
      "f",
      0,
      (e) => {
        let r,
          n,
          i,
          s = (0, t.c)(11),
          { url: a, peerId: l, surface: o } = e,
          { t: c } = (0, T.f)();
        s[0] !== l ? ((r = { peerId: l }), (s[0] = l), (s[1] = r)) : (r = s[1]);
        let u = (0, C.f)(r);
        s[2] !== l || s[3] !== u || s[4] !== o || s[5] !== c || s[6] !== a
          ? ((n = (e) => {
              let { analyticsPeerId: t, isExistingConversation: r } = e,
                n = (0, D.H)(a),
                i = (e) =>
                  (0, b.oQ)({
                    peerId: t,
                    kind: n?.kind,
                    mint: n?.kind === "coin" ? n.mint : void 0,
                    isExistingConversation: r,
                    status: e,
                    surface: o,
                  });
              return u.mutateAsync({ content: a }).then(
                () => (
                  i(R.tL.SUCCESS),
                  (({ kind: e, roomHref: t }) => {
                    g.c.custom(
                      (r) =>
                        (0, x.jsx)(v, {
                          kind: e,
                          onDismiss: () => g.c.dismiss(r),
                          roomHref: t,
                        }),
                      { duration: 6e3 },
                    );
                  })({
                    kind: n?.kind,
                    roomHref: `/messages/${encodeURIComponent(l)}`,
                  }),
                  !0
                ),
                (e) =>
                  !(e instanceof M.f) &&
                  (i(R.tL.ERROR), g.c.error(c((0, S.f)(e))), !1),
              );
            }),
            (s[2] = l),
            (s[3] = u),
            (s[4] = o),
            (s[5] = c),
            (s[6] = a),
            (s[7] = n))
          : (n = s[7]);
        let d = n;
        return (
          s[8] !== u.isPending || s[9] !== d
            ? ((i = { share: d, isSending: u.isPending }),
              (s[8] = u.isPending),
              (s[9] = d),
              (s[10] = i))
            : (i = s[10]),
          i
        );
      },
    ],
    604860,
  );
};
