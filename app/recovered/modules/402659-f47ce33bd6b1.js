// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    a = e.i(745018),
    i = e.i(439587),
    r = e.i(574472),
    o = e.i(458310);
  e.i(12692);
  var s = e.i(398902),
    l = e.i(763956),
    u = e.i(802630),
    d = e.i(66732),
    c = e.i(409747),
    m = e.i(528798),
    f = e.i(875384),
    h = e.i(986382);
  e.s([
    "TopbarNotificationsButton",
    0,
    (e) => {
      let g,
        b,
        p,
        v,
        y,
        x,
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
        T,
        F,
        E = (0, n.c)(49),
        { onOpenChange: z } = e,
        { t: A } = (0, s.f)(),
        { address: I } = (0, r.F)(),
        O = (0, m.f)(),
        {
          notifications: X,
          unreadCount: Y,
          isLoading: q,
          fetchNextPage: U,
          hasNextPage: _,
          isFetchingNextPage: J,
        } = (0, f.f)();
      E[0] !== I
        ? ((g = I?.trim() || null), (E[0] = I), (E[1] = g))
        : (g = E[1]);
      let R = (0, h.t)(g),
        H = (0, c.f)() > 0;
      if (!I || !O) return null;
      let B = H && 0 === Y;
      E[2] !== I || E[3] !== z
        ? ((b = (e) => {
            (e && (0, h.W)(I), z?.(e));
          }),
          (E[2] = I),
          (E[3] = z),
          (E[4] = b))
        : (b = E[4]);
      let V = b;
      return (
        E[5] !== A
          ? ((p = A("notifications.title")), (E[5] = A), (E[6] = p))
          : (p = E[6]),
        E[7] === Symbol.for("react.memo_cache_sentinel")
          ? ((v = (0, t.jsx)(a.YM, { size: 16 })), (E[7] = v))
          : (v = E[7]),
        E[8] !== p
          ? ((y = (0, t.jsx)(d.J, {
              asChild: !0,
              children: (0, t.jsx)("button", {
                "aria-label": p,
                className: u.q,
                "data-testid": "topbar-notifications-button",
                type: "button",
                children: v,
              }),
            })),
            (E[8] = p),
            (E[9] = y))
          : (y = E[9]),
        E[10] !== Y
          ? ((x =
              Y > 0
                ? (0, t.jsx)("span", {
                    className:
                      "pointer-events-none absolute -right-1 -top-1 z-10 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white",
                    "data-testid": "topbar-notifications-unread",
                    children: Y > 99 ? "99+" : Y,
                  })
                : null),
            (E[10] = Y),
            (E[11] = x))
          : (x = E[11]),
        E[12] !== B
          ? ((w = B
              ? (0, t.jsx)("span", {
                  "aria-hidden": !0,
                  className:
                    "pointer-events-none absolute right-1 top-1 z-10 flex size-3 items-center justify-center rounded-full bg-bg-primary",
                  "data-testid": "topbar-notifications-dm-dot",
                  children: (0, t.jsx)("span", {
                    className: "size-2 rounded-full bg-bg-accent",
                  }),
                })
              : null),
            (E[12] = B),
            (E[13] = w))
          : (w = E[13]),
        E[14] !== y || E[15] !== x || E[16] !== w
          ? ((M = (0, t.jsxs)("span", {
              className: "relative inline-flex",
              children: [y, x, w],
            })),
            (E[14] = y),
            (E[15] = x),
            (E[16] = w),
            (E[17] = M))
          : (M = E[17]),
        E[18] !== A
          ? ((N = A("notifications.title")), (E[18] = A), (E[19] = N))
          : (N = E[19]),
        E[20] !== N
          ? ((j = (0, t.jsx)("h2", {
              className: "text-sm font-semibold text-text-primary",
              children: N,
            })),
            (E[20] = N),
            (E[21] = j))
          : (j = E[21]),
        E[22] !== A
          ? ((S = A("web.common.view_all")), (E[22] = A), (E[23] = S))
          : (S = E[23]),
        E[24] !== S
          ? ((P = (0, t.jsx)(o.default, {
              className: "text-xs font-medium text-text-accent hover:underline",
              href: "/notifications",
              children: S,
            })),
            (E[24] = S),
            (E[25] = P))
          : (P = E[25]),
        E[26] !== j || E[27] !== P
          ? ((k = (0, t.jsxs)("div", {
              className:
                "flex items-center justify-between border-b border-border-secondary px-4 py-3",
              children: [j, P],
            })),
            (E[26] = j),
            (E[27] = P),
            (E[28] = k))
          : (k = E[28]),
        E[29] !== q || E[30] !== X || E[31] !== R || E[32] !== A
          ? ((D = q
              ? (0, t.jsx)("p", {
                  className: "px-4 py-6 text-sm text-text-secondary",
                  children: A("web.common.loading"),
                })
              : 0 === X.length
                ? (0, t.jsx)("p", {
                    className: "px-4 py-6 text-sm text-text-secondary",
                    children: A("notifications.no_notifications"),
                  })
                : X.map((e) =>
                    (0, t.jsx)(
                      l.f,
                      { item: e, surface: "topbar", unread: (0, h.i)(e, R) },
                      e.id,
                    ),
                  )),
            (E[29] = q),
            (E[30] = X),
            (E[31] = R),
            (E[32] = A),
            (E[33] = D))
          : (D = E[33]),
        E[34] !== D
          ? ((W = (0, t.jsx)("div", {
              className: "max-h-[420px] overflow-y-auto",
              children: D,
            })),
            (E[34] = D),
            (E[35] = W))
          : (W = E[35]),
        E[36] !== U || E[37] !== _ || E[38] !== J || E[39] !== A
          ? ((C = _
              ? (0, t.jsx)("div", {
                  className: "border-t border-border-secondary p-3",
                  children: (0, t.jsx)(i.K, {
                    className: "w-full",
                    isDisabled: J,
                    onClick: () => void U(),
                    size: 32,
                    variant: "secondary",
                    children: A(
                      J ? "web.common.loading" : "web.common.load_more",
                    ),
                  }),
                })
              : null),
            (E[36] = U),
            (E[37] = _),
            (E[38] = J),
            (E[39] = A),
            (E[40] = C))
          : (C = E[40]),
        E[41] !== k || E[42] !== W || E[43] !== C
          ? ((T = (0, t.jsxs)(d.T, {
              align: "end",
              className: "w-[min(420px,calc(100vw-2rem))] overflow-hidden p-0",
              sideOffset: 8,
              children: [k, W, C],
            })),
            (E[41] = k),
            (E[42] = W),
            (E[43] = C),
            (E[44] = T))
          : (T = E[44]),
        E[45] !== V || E[46] !== T || E[47] !== M
          ? ((F = (0, t.jsxs)(d.V, { onOpenChange: V, children: [M, T] })),
            (E[45] = V),
            (E[46] = T),
            (E[47] = M),
            (E[48] = F))
          : (F = E[48]),
        F
      );
    },
  ]);
};
