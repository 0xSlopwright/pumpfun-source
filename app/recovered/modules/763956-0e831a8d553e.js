// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    a = e.i(292686),
    i = e.i(322315),
    r = e.i(254010),
    o = e.i(114450),
    s = e.i(928529),
    l = e.i(599077);
  e.i(12692);
  var u = e.i(398902),
    d = e.i(456747),
    c = e.i(825340);
  function m(e) {
    let a,
      i,
      r,
      o,
      l,
      u = (0, n.c)(15),
      { achievementId: m, fallbackUrl: f, size: h, className: g } = e,
      { data: b } = (0, d.f)();
    if (u[0] !== m || u[1] !== b || u[2] !== f) {
      let e = b?.achievements.find((e) => e.id === m);
      ((a =
        e && b
          ? (0, c.E)(
              e,
              null === e.metric
                ? void 0
                : (0, c.J)(b.achievements).get(e.metric),
            )
          : null),
        (i = e ? (0, c.g)(e) : f),
        (u[0] = m),
        (u[1] = b),
        (u[2] = f),
        (u[3] = a),
        (u[4] = i));
    } else ((a = u[3]), (i = u[4]));
    let p = i,
      v = a ? c.w[a] : "#3f4643",
      y = `${g} relative overflow-hidden bg-bg-secondary`,
      x = `inset 0 0 0 2px ${v}`;
    u[5] !== x ? ((r = { boxShadow: x }), (u[5] = x), (u[6] = r)) : (r = u[6]);
    let w = a ?? "unknown";
    return (
      u[7] !== h || u[8] !== p
        ? ((o = p
            ? (0, t.jsx)(s.default, {
                alt: "",
                className: "size-full object-cover",
                height: h,
                src: p,
                unoptimized: !0,
                width: h,
              })
            : null),
          (u[7] = h),
          (u[8] = p),
          (u[9] = o))
        : (o = u[9]),
      u[10] !== y || u[11] !== r || u[12] !== w || u[13] !== o
        ? ((l = (0, t.jsx)("span", {
            className: y,
            style: r,
            "data-testid": "notification-achievement-artwork",
            "data-rarity": w,
            children: o,
          })),
          (u[10] = y),
          (u[11] = r),
          (u[12] = w),
          (u[13] = o),
          (u[14] = l))
        : (l = u[14]),
      l
    );
  }
  var f = e.i(352386),
    h = e.i(595673);
  function g(e) {
    return e.isIntersecting && e.intersectionRatio >= 0.5;
  }
  var b = e.i(208912);
  let p = /^pump:\/\/achievements\/([^/?#]+)/;
  var v = e.i(808142),
    y = e.i(668487);
  let x = {
    inbox: {
      button: "flex w-full gap-4 px-4 py-4 text-left hover:bg-bg-secondary",
      image: "size-12 shrink-0 rounded-xl",
      imageSize: 48,
      title: "text-sm font-semibold text-text-primary",
      body: "mt-1 text-sm text-text-secondary",
      time: "mt-2 text-xs text-text-tertiary",
    },
    topbar: {
      button:
        "flex w-full gap-3 border-b border-border-secondary px-4 py-3 text-left hover:bg-bg-secondary",
      image: "size-10 shrink-0 rounded-lg",
      imageSize: 40,
      title: "truncate text-sm font-medium text-text-primary",
      body: "line-clamp-2 text-xs text-text-secondary",
      time: "mt-1 text-[11px] text-text-tertiary",
    },
  };
  e.s(
    [
      "f",
      0,
      (e) => {
        let d,
          c,
          w,
          M,
          N,
          j,
          S,
          P,
          k,
          D,
          W,
          C,
          T = (0, n.c)(53),
          { item: F, surface: E, unread: z } = e,
          A = void 0 !== z && z,
          { t: I } = (0, u.f)(),
          O = (0, l.useRouter)();
        T[0] !== F || T[1] !== E
          ? ((d = { item: F, surface: E }), (T[0] = F), (T[1] = E), (T[2] = d))
          : (d = T[2]);
        let { rowRef: X, trackClick: Y } = (function (e) {
            let t,
              a,
              i,
              r = (0, n.c)(7),
              { item: o, surface: s } = e,
              l = (0, f.useRef)(null),
              u = (0, f.useRef)(!1);
            return (
              r[0] !== o || r[1] !== s
                ? ((t = () => {
                    let e = l.current;
                    if (!e || u.current || "u" < typeof IntersectionObserver)
                      return;
                    let t = new IntersectionObserver(
                      (e) => {
                        u.current ||
                          (e.some(g) &&
                            ((u.current = !0),
                            (0, h.vq)({ item: o, surface: s }),
                            t.disconnect()));
                      },
                      { threshold: 0.5 },
                    );
                    return (t.observe(e), () => t.disconnect());
                  }),
                  (a = [o, s]),
                  (r[0] = o),
                  (r[1] = s),
                  (r[2] = t),
                  (r[3] = a))
                : ((t = r[2]), (a = r[3])),
              (0, f.useEffect)(t, a),
              r[4] !== o || r[5] !== s
                ? ((i = {
                    rowRef: l,
                    trackClick: () => (0, h.j_)({ item: o, surface: s }),
                  }),
                  (r[4] = o),
                  (r[5] = s),
                  (r[6] = i))
                : (i = r[6]),
              i
            );
          })(d),
          q = x[E],
          U = (0, r.k)(i.D.WEB_PROFILE_ACHIEVEMENTS);
        if (T[3] !== U || T[4] !== F)
          ((c =
            U && F.genericV1?.notificationSubtype === "achievement_unlocked"
              ? ((e) => {
                  let t =
                    e.navigation?.params?.id ??
                    e.genericV1?.listNavigation?.params?.id;
                  if (t) return t;
                  for (let t of e.genericV1?.toastButtons ?? [])
                    if (
                      "route" === t.type &&
                      "/achievements/[id]" === t.pathname &&
                      t.params?.id
                    )
                      return t.params.id;
                  let n = p.exec(e.deeplink ?? "");
                  return n?.[1] ? decodeURIComponent(n[1]) : null;
                })(F)
              : null),
            (T[3] = U),
            (T[4] = F),
            (T[5] = c));
        else c = T[5];
        let _ = c;
        if (_) {
          let e;
          (T[6] !== _ ||
          T[7] !== F.imageUrl ||
          T[8] !== q.image ||
          T[9] !== q.imageSize
            ? ((e = (0, t.jsx)(m, {
                achievementId: _,
                fallbackUrl: F.imageUrl,
                size: q.imageSize,
                className: q.image,
              })),
              (T[6] = _),
              (T[7] = F.imageUrl),
              (T[8] = q.image),
              (T[9] = q.imageSize),
              (T[10] = e))
            : (e = T[10]),
            (w = e));
        } else if (F.imageUrl) {
          let e,
            n = `${q.image} object-cover`;
          (T[11] !== F.imageUrl || T[12] !== q.imageSize || T[13] !== n
            ? ((e = (0, t.jsx)(s.default, {
                alt: "",
                className: n,
                height: q.imageSize,
                src: F.imageUrl,
                unoptimized: !0,
                width: q.imageSize,
              })),
              (T[11] = F.imageUrl),
              (T[12] = q.imageSize),
              (T[13] = n),
              (T[14] = e))
            : (e = T[14]),
            (w = e));
        } else {
          let e,
            n = `${q.image} bg-bg-secondary`;
          (T[15] !== n
            ? ((e = (0, t.jsx)("div", { className: n })),
              (T[15] = n),
              (T[16] = e))
            : (e = T[16]),
            (w = e));
        }
        let J = `${q.button} relative`;
        T[17] !== F || T[18] !== O || T[19] !== Y
          ? ((M = () => {
              Y();
              let e = (0, v.m)(F);
              ((0, b.n)({ href: e, entryPoint: a.z.NOTIFICATION_CENTER }),
                O.push(e));
            }),
            (T[17] = F),
            (T[18] = O),
            (T[19] = Y),
            (T[20] = M))
          : (M = T[20]);
        let R = A ? "true" : void 0,
          H = _ ?? void 0,
          B = w,
          V = "inbox" === E ? "min-w-0 flex-1" : "min-w-0";
        (T[21] !== F.title || T[22] !== q.title
          ? ((N = (0, t.jsx)("p", { className: q.title, children: F.title })),
            (T[21] = F.title),
            (T[22] = q.title),
            (T[23] = N))
          : (N = T[23]),
          T[24] !== F.body || T[25] !== q.body
            ? ((j = (0, t.jsx)("p", { className: q.body, children: F.body })),
              (T[24] = F.body),
              (T[25] = q.body),
              (T[26] = j))
            : (j = T[26]),
          T[27] !== _ || T[28] !== I
            ? ((S = _
                ? (0, t.jsx)("p", {
                    className: "mt-1 text-xs font-medium text-text-accent",
                    "data-testid": "notification-achievement-hint",
                    children: I("web.notifications.achievement_open_pack"),
                  })
                : null),
              (T[27] = _),
              (T[28] = I),
              (T[29] = S))
            : (S = T[29]));
        let $ = q.time;
        return (
          T[30] !== F.timestamp
            ? ((P = (0, o.f)(new Date(F.timestamp), (0, y.t)(), {
                addSuffix: !0,
              })),
              (T[30] = F.timestamp),
              (T[31] = P))
            : (P = T[31]),
          T[32] !== q.time || T[33] !== P
            ? ((k = (0, t.jsx)("p", { className: $, children: P })),
              (T[32] = q.time),
              (T[33] = P),
              (T[34] = k))
            : (k = T[34]),
          T[35] !== N ||
          T[36] !== j ||
          T[37] !== S ||
          T[38] !== k ||
          T[39] !== V
            ? ((D = (0, t.jsxs)("div", {
                className: V,
                children: [N, j, S, k],
              })),
              (T[35] = N),
              (T[36] = j),
              (T[37] = S),
              (T[38] = k),
              (T[39] = V),
              (T[40] = D))
            : (D = T[40]),
          T[41] !== I || T[42] !== A
            ? ((W = A
                ? (0, t.jsx)("span", {
                    className:
                      "absolute right-4 top-4 size-2 rounded-full bg-red-500",
                    "data-testid": "notification-unread-dot",
                    children: (0, t.jsx)("span", {
                      className: "sr-only",
                      children: I("web.notifications.unread"),
                    }),
                  })
                : null),
              (T[41] = I),
              (T[42] = A),
              (T[43] = W))
            : (W = T[43]),
          T[44] !== w ||
          T[45] !== X ||
          T[46] !== D ||
          T[47] !== W ||
          T[48] !== J ||
          T[49] !== M ||
          T[50] !== R ||
          T[51] !== H
            ? ((C = (0, t.jsxs)("button", {
                className: J,
                onClick: M,
                ref: X,
                type: "button",
                "data-testid": "notification-row",
                "data-unread": R,
                "data-achievement": H,
                children: [B, D, W],
              })),
              (T[44] = w),
              (T[45] = X),
              (T[46] = D),
              (T[47] = W),
              (T[48] = J),
              (T[49] = M),
              (T[50] = R),
              (T[51] = H),
              (T[52] = C))
            : (C = T[52]),
          C
        );
      },
    ],
    763956,
  );
  var w = e.i(944410),
    M = e.i(574472),
    N = e.i(761459),
    j = e.i(528798),
    S = e.i(484018),
    P = e.i(26498),
    k = y;
  let D = "pump.notifications.opened-at:",
    W = new Set(),
    C = new Map(),
    T = (e) => `${D}${e}`,
    F = (e) => {
      try {
        return localStorage.getItem(T(e));
      } catch {
        return null;
      }
    },
    E = (e) => {
      W.add(e);
      let t = (t) => {
        (null === t.key || t.key.startsWith(D)) && e();
      };
      return (
        window.addEventListener("storage", t),
        () => {
          (W.delete(e), window.removeEventListener("storage", t));
        }
      );
    },
    z = () => null,
    A = (e) => {
      let t,
        a = (0, n.c)(2);
      return (
        a[0] !== e
          ? ((t = () => (null === e ? null : F(e))), (a[0] = e), (a[1] = t))
          : (t = a[1]),
        (0, f.useSyncExternalStore)(E, t, z)
      );
    },
    I = (e, t) => {
      if (null === t) return !0;
      let n = Date.parse(e.timestamp),
        a = Date.parse(t);
      return !(Number.isNaN(n) || Number.isNaN(a)) && n > a;
    },
    O = (e, t) => e.reduce((e, n) => e + +!!I(n, t), 0);
  e.s(
    [
      "u",
      0,
      O,
      "i",
      0,
      I,
      "W",
      0,
      (e, t = new Date((0, k.t)()).toISOString()) => {
        C.set(e, { before: F(e), at: t });
        try {
          localStorage.setItem(T(e), t);
        } catch {}
        for (let e of W) e();
      },
      "t",
      0,
      (e) => {
        let t,
          a = (0, n.c)(2);
        return (
          a[0] !== e
            ? ((t = () => {
                if (null === e) return null;
                let t = C.get(e);
                return t ? t.before : F(e);
              }),
              (a[0] = e),
              (a[1] = t))
            : (t = a[1]),
          (0, f.useSyncExternalStore)(E, t, z)
        );
      },
      "H",
      0,
      A,
    ],
    986382,
  );
  var X = e.i(779106);
  function Y(e) {
    return e.hasMore ? e.lastEvaluatedKey : void 0;
  }
  function q(e) {
    return e.notifications;
  }
  function U(e) {
    return !(0, P.Y)(e);
  }
  e.s(
    [
      "f",
      0,
      (e) => {
        let t,
          a,
          i,
          r,
          o,
          s = (0, n.c)(17);
        s[0] !== e
          ? ((t = void 0 === e ? {} : e), (s[0] = e), (s[1] = t))
          : (t = s[1]);
        let l = ((e) => {
            let t,
              a,
              i,
              r,
              o = (0, n.c)(19);
            o[0] !== e
              ? ((t = void 0 === e ? {} : e), (o[0] = e), (o[1] = t))
              : (t = o[1]);
            let {
                notificationType: s,
                priority: l,
                channel: u,
                mintAddress: d,
                enabled: c,
              } = t,
              m = (0, w.useHermesApiClient)(),
              { fetchUser: f } = (0, M.F)(),
              h = (0, X.f)("hermes-inbox"),
              g = (0, j.f)();
            o[2] !== u || o[3] !== d || o[4] !== s || o[5] !== l || o[6] !== h
              ? ((a = [...S.F.inbox(h), s, l, u, d]),
                (o[2] = u),
                (o[3] = d),
                (o[4] = s),
                (o[5] = l),
                (o[6] = h),
                (o[7] = a))
              : (a = o[7]);
            let b = !!(g && m && null !== h && (void 0 === c || c));
            return (
              o[8] !== m ||
              o[9] !== u ||
              o[10] !== f ||
              o[11] !== d ||
              o[12] !== s ||
              o[13] !== l
                ? ((i = async (e) => {
                    let { pageParam: t, signal: n } = e;
                    if (!m)
                      throw Error("Hermes notifications API is not configured");
                    let a = new URLSearchParams();
                    (t && a.set("lastEvaluatedKey", t),
                      s && a.set("notificationType", s),
                      l && a.set("priority", l),
                      u && a.set("channel", u),
                      d && a.set("mintAddress", d));
                    let i = await m
                      .get(`notifications/user?${a.toString()}`, { signal: n })
                      .json();
                    return (
                      t || f(),
                      {
                        notifications: i.notifications.map(v.P),
                        lastEvaluatedKey: i.lastEvaluatedKey,
                        hasMore: i.hasMore,
                        count: i.count,
                      }
                    );
                  }),
                  (o[8] = m),
                  (o[9] = u),
                  (o[10] = f),
                  (o[11] = d),
                  (o[12] = s),
                  (o[13] = l),
                  (o[14] = i))
                : (i = o[14]),
              o[15] !== a || o[16] !== b || o[17] !== i
                ? ((r = {
                    queryKey: a,
                    enabled: b,
                    initialPageParam: void 0,
                    queryFn: i,
                    getNextPageParam: Y,
                    staleTime: 5e3,
                    refetchInterval: 6e4,
                    refetchIntervalInBackground: !1,
                    refetchOnWindowFocus: !0,
                  }),
                  (o[15] = a),
                  (o[16] = b),
                  (o[17] = i),
                  (o[18] = r))
                : (r = o[18]),
              (0, N.useInfiniteQuery)(r)
            );
          })(t),
          { address: u } = (0, M.F)();
        s[2] !== u
          ? ((a = u?.trim() || null), (s[2] = u), (s[3] = a))
          : (a = s[3]);
        let d = A(a);
        if (s[4] !== l.data?.pages || s[5] !== d) {
          let e = (l.data?.pages.flatMap(q) ?? []).filter(U);
          ((i = e),
            (r = O(e, d)),
            (s[4] = l.data?.pages),
            (s[5] = d),
            (s[6] = i),
            (s[7] = r));
        } else ((i = s[6]), (r = s[7]));
        return (
          s[8] !== l.fetchNextPage ||
          s[9] !== l.hasNextPage ||
          s[10] !== l.isError ||
          s[11] !== l.isFetchingNextPage ||
          s[12] !== l.isLoading ||
          s[13] !== i ||
          s[14] !== r ||
          s[15] !== d
            ? ((o = {
                notifications: i,
                unreadCount: r,
                watermark: d,
                isLoading: l.isLoading,
                isError: l.isError,
                hasNextPage: l.hasNextPage,
                isFetchingNextPage: l.isFetchingNextPage,
                fetchNextPage: l.fetchNextPage,
              }),
              (s[8] = l.fetchNextPage),
              (s[9] = l.hasNextPage),
              (s[10] = l.isError),
              (s[11] = l.isFetchingNextPage),
              (s[12] = l.isLoading),
              (s[13] = i),
              (s[14] = r),
              (s[15] = d),
              (s[16] = o))
            : (o = s[16]),
          o
        );
      },
    ],
    875384,
  );
};
