// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(745018),
    a = e.i(439587),
    l = e.i(292686),
    i = e.i(254667),
    s = e.i(426091),
    o = e.i(574472),
    c = e.i(453706),
    d = e.i(928529),
    u = e.i(599077),
    f = e.i(352386);
  e.i(12692);
  var h = e.i(398902),
    m = e.i(63289),
    b = e.i(869955),
    x = e.i(464649),
    p = e.i(802630),
    y = e.i(206261),
    g = e.i(787773),
    v = e.i(967694),
    w = e.i(51206),
    j = e.i(360827),
    _ = e.i(289638),
    k = e.i(607122),
    N = e.i(248496),
    S = e.i(634661),
    B = e.i(292032),
    C = e.i(656846),
    A = e.i(102824),
    I = e.i(349572),
    L = e.i(524711),
    F = e.i(363250),
    E = e.i(10738),
    M = e.i(402732),
    R = e.i(487832),
    T = e.i(595673),
    O = e.i(493870),
    $ = e.i(198825),
    D = e.i(90832);
  function U(e) {
    let n,
      a,
      l,
      i,
      s,
      o,
      c,
      d,
      u = (0, r.c)(20),
      { filter: f, onFilterChange: m } = e,
      { t: b } = (0, h.f)();
    return (
      u[0] !== b
        ? ((n = b("web.info_bar.positions")), (u[0] = b), (u[1] = n))
        : (n = u[1]),
      u[2] !== m ? ((a = (e) => m?.(e)), (u[2] = m), (u[3] = a)) : (a = u[3]),
      u[4] !== b
        ? ((l = b("profile.positions_card.open_tab")), (u[4] = b), (u[5] = l))
        : (l = u[5]),
      u[6] !== l
        ? ((i = { value: "open", label: l }), (u[6] = l), (u[7] = i))
        : (i = u[7]),
      u[8] !== b
        ? ((s = b("profile.positions_card.closed_tab")), (u[8] = b), (u[9] = s))
        : (s = u[9]),
      u[10] !== s
        ? ((o = { value: "closed", label: s }), (u[10] = s), (u[11] = o))
        : (o = u[11]),
      u[12] !== i || u[13] !== o
        ? ((c = [i, o]), (u[12] = i), (u[13] = o), (u[14] = c))
        : (c = u[14]),
      u[15] !== f || u[16] !== n || u[17] !== a || u[18] !== c
        ? ((d = (0, t.jsx)(k.X, {
            density: "comfortable",
            "aria-label": n,
            value: f,
            onValueChange: a,
            options: c,
          })),
          (u[15] = f),
          (u[16] = n),
          (u[17] = a),
          (u[18] = c),
          (u[19] = d))
        : (d = u[19]),
      d
    );
  }
  let z = "flex h-11 shrink-0 items-center justify-between gap-2 px-5",
    P = (0, c.default)(
      () =>
        e.A(786158).then(
          (e) =>
            function (n) {
              let a,
                l,
                i,
                s,
                o,
                c = (0, r.c)(19);
              return (
                c[0] !== n.filter || c[1] !== n.onFilterChange
                  ? ((a = (0, t.jsx)(U, {
                      filter: n.filter,
                      onFilterChange: n.onFilterChange,
                    })),
                    (c[0] = n.filter),
                    (c[1] = n.onFilterChange),
                    (c[2] = a))
                  : (a = c[2]),
                c[3] !== n.filter ||
                c[4] !== n.onSortByChange ||
                c[5] !== n.sortBy
                  ? ((l = (0, t.jsx)(e.ProfilePositionsSortSelect, {
                      filter: n.filter,
                      value: n.sortBy,
                      onChange: n.onSortByChange,
                    })),
                    (c[3] = n.filter),
                    (c[4] = n.onSortByChange),
                    (c[5] = n.sortBy),
                    (c[6] = l))
                  : (l = c[6]),
                c[7] !== a || c[8] !== l
                  ? ((i = (0, t.jsxs)("div", {
                      className: z,
                      children: [a, l],
                    })),
                    (c[7] = a),
                    (c[8] = l),
                    (c[9] = i))
                  : (i = c[9]),
                c[10] !== n.address ||
                c[11] !== n.filter ||
                c[12] !== n.onSortByChange ||
                c[13] !== n.sortBy ||
                c[14] !== n.user
                  ? ((s = (0, t.jsx)("div", {
                      className: "[--position-row-pad:1.25rem]",
                      children: (0, t.jsx)(
                        e.ProfilePositionsCallouts,
                        {
                          address: n.address,
                          user: n.user,
                          isOwner: !0,
                          filter: n.filter,
                          sortBy: n.sortBy,
                          onSortByChange: n.onSortByChange,
                          viewMode: "compressed",
                          rowAppearance: "list",
                          hideShare: !0,
                        },
                        n.filter,
                      ),
                    })),
                    (c[10] = n.address),
                    (c[11] = n.filter),
                    (c[12] = n.onSortByChange),
                    (c[13] = n.sortBy),
                    (c[14] = n.user),
                    (c[15] = s))
                  : (s = c[15]),
                c[16] !== i || c[17] !== s
                  ? ((o = (0, t.jsxs)(t.Fragment, { children: [i, s] })),
                    (c[16] = i),
                    (c[17] = s),
                    (c[18] = o))
                  : (o = c[18]),
                o
              );
            },
        ),
      {
        loadableGenerated: { modules: [824990] },
        ssr: !1,
        loading: () => (0, t.jsx)(q, {}),
      },
    );
  function q() {
    let e,
      n = (0, r.c)(1);
    return (
      n[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)("div", {
                className: z,
                children: (0, t.jsx)(U, { filter: "open" }),
              }),
              (0, t.jsx)(W, {}),
            ],
          })),
          (n[0] = e))
        : (e = n[0]),
      e
    );
  }
  function W(e) {
    let n,
      a = (0, r.c)(2),
      { rows: l } = e,
      i = void 0 === l ? 3 : l;
    return (
      a[0] !== i
        ? ((n = (0, t.jsx)("div", {
            "aria-hidden": !0,
            "data-testid": "topbar-positions-skeleton",
            children: Array.from({ length: i }).map(K),
          })),
          (a[0] = i),
          (a[1] = n))
        : (n = a[1]),
      n
    );
  }
  function K(e, r) {
    return (0, t.jsxs)(
      "div",
      {
        className:
          "flex items-center gap-3 border-b border-border-secondary/50 px-5 py-3",
        children: [
          (0, t.jsx)(N.l, { variant: "art", size: 32 }),
          (0, t.jsxs)("div", {
            className: "flex min-w-0 flex-1 flex-col gap-1",
            children: [
              (0, t.jsx)(N.l, { height: 13, width: 96 }),
              (0, t.jsx)(N.l, { height: 12, width: 64 }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "flex shrink-0 flex-col items-end gap-1",
            children: [
              (0, t.jsx)(N.l, { height: 13, width: 56 }),
              (0, t.jsx)(N.l, { height: 12, width: 40 }),
            ],
          }),
        ],
      },
      r,
    );
  }
  function V(e) {
    let t,
      n,
      a,
      l,
      i = (0, r.c)(6),
      [s, o] = (0, f.useState)(e),
      c = (0, f.useRef)(e),
      d = (0, f.useRef)(e > 0);
    return (
      i[0] !== s
        ? ((t = () => {
            c.current = s;
          }),
          (n = [s]),
          (i[0] = s),
          (i[1] = t),
          (i[2] = n))
        : ((t = i[1]), (n = i[2])),
      (0, f.useEffect)(t, n),
      i[3] !== e
        ? ((a = () => {
            if (!d.current && e > 0) {
              ((d.current = !0), (c.current = e), o(e));
              return;
            }
            let t = 0,
              r = c.current,
              n = performance.now(),
              a = (l) => {
                let i = Math.min(1, (l - n) / 900);
                (o(r + (e - r) * (1 - Math.pow(1 - i, 3))),
                  i < 1 && (t = requestAnimationFrame(a)));
              };
            return (
              (t = requestAnimationFrame(a)),
              () => cancelAnimationFrame(t)
            );
          }),
          (l = [e]),
          (i[3] = e),
          (i[4] = a),
          (i[5] = l))
        : ((a = i[4]), (l = i[5])),
      (0, f.useEffect)(a, l),
      s
    );
  }
  function H(e) {
    let a,
      l,
      i,
      o,
      c,
      d = (0, r.c)(16),
      { text: u, suffix: m, open: b, loading: x, unavailable: y, stale: g } = e,
      { t: v } = (0, h.f)(),
      w = (function (e) {
        let t,
          n,
          a = (0, r.c)(4),
          [l, i] = (0, f.useState)(e);
        return (
          1200 !== a[0] || a[1] !== e
            ? ((t = () => {
                i((t) => (e.length > t.length ? e : t));
                let t = setTimeout(() => i(e), 1200);
                return () => clearTimeout(t);
              }),
              (n = [e, 1200]),
              (a[0] = 1200),
              (a[1] = e),
              (a[2] = t),
              (a[3] = n))
            : ((t = a[2]), (n = a[3])),
          (0, f.useEffect)(t, n),
          e.length > l.length ? e : l
        );
      })(u);
    (d[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((a = (0, s.c)(
          p.u,
          p.y,
          "transition-[background-color,transform] active:translate-y-px",
        )),
        (d[0] = a))
      : (a = d[0]),
      d[1] !== x ||
      d[2] !== g ||
      d[3] !== m ||
      d[4] !== v ||
      d[5] !== u ||
      d[6] !== y ||
      d[7] !== w
        ? ((l = x
            ? (0, t.jsx)("span", {
                "aria-hidden": !0,
                className: (0, s.c)(N.e, "h-3 w-14 rounded-md"),
              })
            : y
              ? (0, t.jsx)("span", {
                  "aria-label": v("web.wallet.balance_unavailable"),
                  title: v("web.wallet.balance_unavailable"),
                  className: "flex h-full w-3.5 items-center justify-center",
                  children: (0, t.jsx)("span", {
                    "aria-hidden": !0,
                    className:
                      "bg-text-tertiary block h-0.5 w-full rounded-full",
                  }),
                })
              : (0, t.jsxs)("span", {
                  "data-balance-stale": g ? "true" : void 0,
                  className:
                    "grid shrink-0 grid-cols-1 grid-rows-1 tabular-nums",
                  children: [
                    (0, t.jsxs)("span", {
                      "aria-hidden": !0,
                      className:
                        "col-start-1 row-start-1 invisible whitespace-nowrap",
                      children: [w, m],
                    }),
                    (0, t.jsxs)("span", {
                      className:
                        "col-start-1 row-start-1 whitespace-nowrap text-right",
                      children: [u, m],
                    }),
                  ],
                })),
          (d[1] = x),
          (d[2] = g),
          (d[3] = m),
          (d[4] = v),
          (d[5] = u),
          (d[6] = y),
          (d[7] = w),
          (d[8] = l))
        : (l = d[8]));
    let j = b && "rotate-180";
    return (
      d[9] !== j
        ? ((i = (0, s.c)(
            "text-text-quaternary size-3.5 shrink-0 transition-transform",
            j,
          )),
          (d[9] = j),
          (d[10] = i))
        : (i = d[10]),
      d[11] !== i
        ? ((o = (0, t.jsx)(n.nw, { className: i })), (d[11] = i), (d[12] = o))
        : (o = d[12]),
      d[13] !== l || d[14] !== o
        ? ((c = (0, t.jsxs)("span", { className: a, children: [l, o] })),
          (d[13] = l),
          (d[14] = o),
          (d[15] = c))
        : (c = d[15]),
      c
    );
  }
  function Q() {
    let e,
      a,
      l,
      i = (0, r.c)(5),
      { t: s } = (0, h.f)();
    return (0, M.f)()
      ? (i[0] !== s
          ? ((e = s("web.settings.open_settings")), (i[0] = s), (i[1] = e))
          : (e = i[1]),
        i[2] === Symbol.for("react.memo_cache_sentinel")
          ? ((a = (0, t.jsx)(n.xF, { "aria-hidden": !0 })), (i[2] = a))
          : (a = i[2]),
        i[3] !== e
          ? ((l = (0, t.jsx)(w._, {
              density: "comfortable",
              size: 32,
              variant: "ghost",
              "aria-label": e,
              "data-testid": "settings-gear",
              onClick: G,
              children: a,
            })),
            (i[3] = e),
            (i[4] = l))
          : (l = i[4]),
        l)
      : null;
  }
  function G() {
    return (0, R.v)({ section: "account" });
  }
  function X(e) {
    let a,
      l,
      i,
      s,
      o,
      c,
      d = (0, r.c)(16),
      { address: u, copied: f, onCopy: m } = e,
      { t: b } = (0, h.f)();
    if (
      (d[0] !== b
        ? ((a = b("common.copy_address")), (d[0] = b), (d[1] = a))
        : (a = d[1]),
      d[2] !== b
        ? ((l = b("common.copy_address")), (d[2] = b), (d[3] = l))
        : (l = d[3]),
      d[4] !== u)
    )
      ((i = `${u.slice(0, 8)}…${u.slice(-8)}`), (d[4] = u), (d[5] = i));
    else i = d[5];
    return (
      d[6] !== i
        ? ((s = (0, t.jsx)("span", { className: "tabular-nums", children: i })),
          (d[6] = i),
          (d[7] = s))
        : (s = d[7]),
      d[8] !== f
        ? ((o = f
            ? (0, t.jsx)(n.S7, {
                "aria-hidden": !0,
                className: "size-3 text-text-accent",
              })
            : (0, t.jsx)(n.QO, { "aria-hidden": !0, className: "size-3" })),
          (d[8] = f),
          (d[9] = o))
        : (o = d[9]),
      d[10] !== m || d[11] !== a || d[12] !== l || d[13] !== s || d[14] !== o
        ? ((c = (0, t.jsxs)("button", {
            type: "button",
            onClick: m,
            "data-testid": "topbar-wallet-copy-address",
            "aria-label": a,
            title: l,
            className:
              "inline-flex h-6 items-center gap-1 rounded-md text-text-quaternary transition-colors hover:text-text-primary",
            children: [s, o],
          })),
          (d[10] = m),
          (d[11] = a),
          (d[12] = l),
          (d[13] = s),
          (d[14] = o),
          (d[15] = c))
        : (c = d[15]),
      c
    );
  }
  function Y(e) {
    let a,
      l,
      i,
      s,
      o = (0, r.c)(12),
      { canRetry: c, retrySeconds: d, onRetry: u } = e,
      { t: f } = (0, h.f)();
    return (
      o[0] !== f
        ? ((a = f("web.wallet.balance_load_failed")), (o[0] = f), (o[1] = a))
        : (a = o[1]),
      o[2] !== a
        ? ((l = (0, t.jsx)("p", { className: g.Q.comfortable, children: a })),
          (o[2] = a),
          (o[3] = l))
        : (l = o[3]),
      o[4] !== c || o[5] !== u || o[6] !== d || o[7] !== f
        ? ((i = c
            ? (0, t.jsx)(w._, {
                density: "comfortable",
                size: 24,
                variant: "ghost",
                "aria-label": f("common.retry"),
                "data-testid": "topbar-wallet-stale-retry",
                onClick: u,
                children: (0, t.jsx)(n.k8, { "aria-hidden": !0 }),
              })
            : (0, t.jsx)("span", {
                "data-testid": "topbar-wallet-retry-countdown",
                className: "text-xs leading-4 tabular-nums text-text-tertiary",
                children: f("web.wallet.retry_available_in", { seconds: d }),
              })),
          (o[4] = c),
          (o[5] = u),
          (o[6] = d),
          (o[7] = f),
          (o[8] = i))
        : (i = o[8]),
      o[9] !== l || o[10] !== i
        ? ((s = (0, t.jsxs)("div", {
            role: "status",
            "data-testid": "topbar-wallet-stale-note",
            className: "mt-1 flex h-6 items-center gap-1",
            children: [l, i],
          })),
          (o[9] = l),
          (o[10] = i),
          (o[11] = s))
        : (s = o[11]),
      s
    );
  }
  function Z(e) {
    let a,
      l,
      i,
      s,
      o = (0, r.c)(26),
      { balance: c, onSelectBalance: u } = e,
      { t: f } = (0, h.f)();
    if ("loading" === c.status) {
      let e;
      return (
        o[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = (0, t.jsx)("div", {
              className: "px-5 pb-3 pt-4",
              children: (0, t.jsx)(N.l, { height: 28, width: 128 }),
            })),
            (o[0] = e))
          : (e = o[0]),
        e
      );
    }
    if ("error" === c.status) {
      let e,
        r,
        n,
        a = c.canRetry ? c.onRetry : void 0;
      return (
        o[1] !== c.canRetry || o[2] !== c.retrySeconds || o[3] !== f
          ? ((e = c.canRetry
              ? void 0
              : (0, t.jsx)("span", {
                  "data-testid": "topbar-wallet-retry-countdown",
                  className:
                    "text-xs leading-4 tabular-nums text-text-tertiary",
                  children: f("web.wallet.retry_available_in", {
                    seconds: c.retrySeconds,
                  }),
                })),
            (o[1] = c.canRetry),
            (o[2] = c.retrySeconds),
            (o[3] = f),
            (o[4] = e))
          : (e = o[4]),
        o[5] !== f
          ? ((r = f("web.wallet.balance_load_failed")), (o[5] = f), (o[6] = r))
          : (r = o[6]),
        o[7] !== a || o[8] !== e || o[9] !== r
          ? ((n = (0, t.jsx)(v.f, {
              density: "comfortable",
              onRetry: a,
              action: e,
              children: r,
            })),
            (o[7] = a),
            (o[8] = e),
            (o[9] = r),
            (o[10] = n))
          : (n = o[10]),
        n
      );
    }
    return (
      o[11] !== c.totalDisplay
        ? ((a = (0, t.jsx)("p", {
            "data-testid": "topbar-wallet-total",
            className:
              "whitespace-nowrap text-xl font-medium leading-7 tabular-nums text-text-primary",
            children: c.totalDisplay,
          })),
          (o[11] = c.totalDisplay),
          (o[12] = a))
        : (a = o[12]),
      o[13] !== c.canRetry ||
      o[14] !== c.onRetry ||
      o[15] !== c.retrySeconds ||
      o[16] !== c.status
        ? ((l =
            "stale" === c.status
              ? (0, t.jsx)(Y, {
                  canRetry: c.canRetry,
                  retrySeconds: c.retrySeconds,
                  onRetry: c.onRetry,
                })
              : null),
          (o[13] = c.canRetry),
          (o[14] = c.onRetry),
          (o[15] = c.retrySeconds),
          (o[16] = c.status),
          (o[17] = l))
        : (l = o[17]),
      o[18] !== c.assets || o[19] !== u || o[20] !== f
        ? ((i =
            c.assets.length > 0
              ? (0, t.jsx)("ul", {
                  "aria-label": f("web.wallet.cash_available"),
                  className: "mt-2 divide-y divide-border-secondary",
                  children: c.assets.map((e) => {
                    let r = (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsx)(d.default, {
                          src: e.imageUri,
                          alt: "",
                          width: 20,
                          height: 20,
                          className:
                            "size-5 shrink-0 rounded-full object-cover",
                        }),
                        (0, t.jsx)("span", {
                          className:
                            "text-sm font-medium leading-5 text-text-primary",
                          children: e.symbol,
                        }),
                        (0, t.jsxs)("span", {
                          className:
                            "ml-auto flex items-baseline gap-2 whitespace-nowrap",
                          children: [
                            (0, t.jsx)("span", {
                              className:
                                "text-sm leading-5 tabular-nums text-text-primary",
                              children: e.detail,
                            }),
                            (0, t.jsx)("span", {
                              className:
                                "text-xs leading-4 tabular-nums text-text-tertiary",
                              children: (0, D.w)(e.usd),
                            }),
                          ],
                        }),
                      ],
                    });
                    return (0, t.jsx)(
                      "li",
                      {
                        "data-testid": "topbar-wallet-asset",
                        className: "flex h-11 items-center",
                        children: u
                          ? (0, t.jsxs)("button", {
                              type: "button",
                              "data-testid": "topbar-wallet-asset-select",
                              "aria-haspopup": "dialog",
                              "aria-label": f("trade.select_balance"),
                              onClick: u,
                              className:
                                "-mx-2 flex h-full w-full items-center gap-3 rounded-md px-2 transition-colors hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent",
                              children: [
                                r,
                                (0, t.jsx)(n.s2, {
                                  "aria-hidden": !0,
                                  className:
                                    "size-3.5 shrink-0 text-text-quaternary",
                                }),
                              ],
                            })
                          : (0, t.jsx)("div", {
                              className:
                                "flex h-full w-full items-center gap-3",
                              children: r,
                            }),
                      },
                      e.symbol,
                    );
                  }),
                })
              : null),
          (o[18] = c.assets),
          (o[19] = u),
          (o[20] = f),
          (o[21] = i))
        : (i = o[21]),
      o[22] !== a || o[23] !== l || o[24] !== i
        ? ((s = (0, t.jsxs)("div", {
            className: "px-5 pb-1 pt-4",
            children: [a, l, i],
          })),
          (o[22] = a),
          (o[23] = l),
          (o[24] = i),
          (o[25] = s))
        : (s = o[25]),
      s
    );
  }
  function J(e) {
    let l,
      i,
      s,
      o,
      c,
      d,
      u,
      f,
      m,
      x,
      p = (0, r.c)(35),
      {
        address: y,
        user: g,
        balance: v,
        copied: j,
        onCopyAddress: _,
        onDeposit: k,
        onSelectBalance: N,
        positionsFilter: B,
        onPositionsFilterChange: C,
        positionsSortBy: A,
        onPositionsSortByChange: I,
        onClose: L,
      } = e,
      { t: F } = (0, h.f)();
    return (
      p[0] !== F
        ? ((l = F("web.wallet.your_balance")), (p[0] = F), (p[1] = l))
        : (l = p[1]),
      p[2] !== y || p[3] !== j || p[4] !== _
        ? ((i = y
            ? (0, t.jsx)(X, { address: y, copied: j, onCopy: _ })
            : void 0),
          (p[2] = y),
          (p[3] = j),
          (p[4] = _),
          (p[5] = i))
        : (i = p[5]),
      p[6] === Symbol.for("react.memo_cache_sentinel")
        ? ((s = (0, t.jsx)(Q, {})), (p[6] = s))
        : (s = p[6]),
      p[7] !== L || p[8] !== F
        ? ((o = L
            ? (0, t.jsx)(w._, {
                density: "comfortable",
                size: 32,
                variant: "ghost",
                "aria-label": F("common.close"),
                "data-testid": "topbar-wallet-close",
                onClick: L,
                children: (0, t.jsx)(n.x6, { "aria-hidden": !0 }),
              })
            : null),
          (p[7] = L),
          (p[8] = F),
          (p[9] = o))
        : (o = p[9]),
      p[10] !== o
        ? ((c = (0, t.jsxs)(t.Fragment, { children: [s, o] })),
          (p[10] = o),
          (p[11] = c))
        : (c = p[11]),
      p[12] !== l || p[13] !== i || p[14] !== c
        ? ((d = (0, t.jsx)(S._, {
            density: "comfortable",
            titleAs: "h3",
            title: l,
            aside: i,
            action: c,
          })),
          (p[12] = l),
          (p[13] = i),
          (p[14] = c),
          (p[15] = d))
        : (d = p[15]),
      p[16] !== v || p[17] !== N
        ? ((u = (0, t.jsx)(Z, { balance: v, onSelectBalance: N })),
          (p[16] = v),
          (p[17] = N),
          (p[18] = u))
        : (u = p[18]),
      p[19] !== y ||
      p[20] !== k ||
      p[21] !== C ||
      p[22] !== I ||
      p[23] !== N ||
      p[24] !== B ||
      p[25] !== A ||
      p[26] !== F ||
      p[27] !== g
        ? ((f = y
            ? (0, t.jsxs)(t.Fragment, {
                children: [
                  (0, t.jsxs)("div", {
                    className:
                      "flex h-11 shrink-0 items-center gap-2 border-b border-border-secondary px-5",
                    children: [
                      (0, t.jsx)(a.K, {
                        variant: "primary",
                        size: 36,
                        "data-testid": "topbar-wallet-deposit",
                        onClick: k,
                        children: F("common.deposit"),
                      }),
                      N
                        ? (0, t.jsx)(a.K, {
                            variant: "secondary",
                            size: 36,
                            "data-testid": "topbar-wallet-convert",
                            onClick: N,
                            children: F("common.convert"),
                          })
                        : null,
                    ],
                  }),
                  (0, t.jsx)(b.a, {
                    density: "comfortable",
                    className: "border-b border-border-secondary px-5 py-3",
                  }),
                  (0, t.jsx)(P, {
                    address: y,
                    user: g,
                    filter: B,
                    onFilterChange: C,
                    sortBy: A,
                    onSortByChange: I,
                  }),
                ],
              })
            : null),
          (p[19] = y),
          (p[20] = k),
          (p[21] = C),
          (p[22] = I),
          (p[23] = N),
          (p[24] = B),
          (p[25] = A),
          (p[26] = F),
          (p[27] = g),
          (p[28] = f))
        : (f = p[28]),
      p[29] !== u || p[30] !== f
        ? ((m = (0, t.jsxs)("div", {
            "data-testid": "topbar-wallet-body",
            className: "min-h-0 flex-1 overflow-y-auto",
            children: [u, f],
          })),
          (p[29] = u),
          (p[30] = f),
          (p[31] = m))
        : (m = p[31]),
      p[32] !== d || p[33] !== m
        ? ((x = (0, t.jsxs)(t.Fragment, { children: [d, m] })),
          (p[32] = d),
          (p[33] = m),
          (p[34] = x))
        : (x = p[34]),
      x
    );
  }
  e.s([
    "TopbarWallet",
    0,
    function () {
      let e,
        n,
        a,
        c,
        d,
        b,
        g,
        v,
        w,
        k,
        N,
        S,
        M,
        R,
        U,
        z,
        P,
        q,
        W,
        K,
        Q,
        G,
        X,
        Y,
        Z,
        ee,
        et,
        er,
        en,
        ea,
        el,
        ei,
        es,
        eo,
        ec,
        ed,
        eu,
        ef,
        eh,
        em,
        eb,
        ex,
        ep,
        ey,
        eg,
        ev,
        ew,
        ej,
        e_,
        ek,
        eN,
        eS = (0, r.c)(147),
        { t: eB } = (0, h.f)(),
        { address: eC, user: eA } = (0, o.F)(),
        {
          accountDropdownAutoOpen: eI,
          setAccountDropdownAutoOpen: eL,
          showDeposit: eF,
          setShowDeposit: eE,
          showConvert: eM,
          showSelectBalance: eR,
          setShowSelectBalance: eT,
          isWalletHandoffPending: eO,
        } = (0, $.useConnectWallet)(),
        [e$, eD] = (0, f.useState)(!1),
        [eU, ez] = (0, f.useState)(!1),
        eP = e$ || eU,
        eq = (0, E.f)("(max-width: 1023.98px)"),
        [eW, eK] = (0, f.useState)("open"),
        [eV, eH] = (0, f.useState)("POSITION_SIZE"),
        [eQ, eG] = (0, f.useState)("PNL");
      (eS[0] !== eI || eS[1] !== eL
        ? ((e = () => {
            eI &&
              (window.matchMedia("(min-width: 768px)").matches
                ? ez(!0)
                : eD(!0),
              eL(!1));
          }),
          (n = [eI, eL]),
          (eS[0] = eI),
          (eS[1] = eL),
          (eS[2] = e),
          (eS[3] = n))
        : ((e = eS[2]), (n = eS[3])),
        (0, f.useEffect)(e, n),
        eS[4] === Symbol.for("react.memo_cache_sentinel")
          ? ((a = () => {
              if ("function" != typeof window.matchMedia) return;
              let e = window.matchMedia("(min-width: 768px)"),
                t = () => {
                  e.matches ? eD(!1) : ez(!1);
                };
              return (
                e.addEventListener("change", t),
                () => e.removeEventListener("change", t)
              );
            }),
            (c = []),
            (eS[4] = a),
            (eS[5] = c))
          : ((a = eS[4]), (c = eS[5])),
        (0, f.useEffect)(a, c));
      let eX = eC ?? "";
      eS[6] !== eX
        ? ((d = { userAddress: eX }), (eS[6] = eX), (eS[7] = d))
        : (d = eS[7]);
      let {
        data: eY,
        isLoading: eZ,
        error: eJ,
        errorUpdatedAt: e0,
        dataUpdatedAt: e1,
        refetch: e2,
      } = (0, L._)(d);
      eS[8] === Symbol.for("react.memo_cache_sentinel")
        ? ((b = {}), (eS[8] = b))
        : (b = eS[8]);
      let { data: e3 } = (0, F.f)(b),
        e4 = void 0 === e3 ? 0 : e3,
        e5 = eY?.success ? eY.data : void 0,
        e6 = !!e5,
        e8 = !!eJ || eY?.success === !1,
        e9 = e6 && !!eJ,
        e7 = eZ || (!e6 && !e8 && !!eC),
        te = !eZ && !e6,
        tt = Math.max(eJ ? e0 : 0, eY?.success === !1 ? e1 : 0),
        tr = (0, f.useRef)(0);
      (eS[9] !== eJ || eS[10] !== eY?.success || eS[11] !== tt || eS[12] !== e6
        ? ((g = () => {
            tt &&
              tr.current !== tt &&
              ((tr.current = tt),
              i.y.warn("balance summary fetch failed", {
                status: (0, I.W)(eJ) ?? null,
                hadCachedFigure: e6,
                bodySuccessFalse: eY?.success === !1,
              }));
          }),
          (eS[9] = eJ),
          (eS[10] = eY?.success),
          (eS[11] = tt),
          (eS[12] = e6),
          (eS[13] = g))
        : (g = eS[13]),
        eS[14] !== eJ || eS[15] !== eY || eS[16] !== tt || eS[17] !== e6
          ? ((v = [tt, eJ, eY, e6]),
            (eS[14] = eJ),
            (eS[15] = eY),
            (eS[16] = tt),
            (eS[17] = e6),
            (eS[18] = v))
          : (v = eS[18]),
        (0, f.useEffect)(g, v));
      let [tn, ta] = (0, f.useState)(0);
      (eS[19] !== tt || eS[20] !== e8
        ? ((w = () => {
            if (!e8 || !tt) return;
            ta(Date.now());
            let e = tt + 3e4;
            if (Date.now() >= e) return;
            let t = setInterval(() => {
              let r = Date.now();
              (ta(r), r >= e && clearInterval(t));
            }, 1e3);
            return () => clearInterval(t);
          }),
          (k = [e8, tt]),
          (eS[19] = tt),
          (eS[20] = e8),
          (eS[21] = w),
          (eS[22] = k))
        : ((w = eS[21]), (k = eS[22])),
        (0, f.useEffect)(w, k));
      let tl = e8 && tt ? Math.max(0, tt + 3e4 - (tn || tt)) : 0,
        ti = tl <= 0,
        ts = e5?.native_balance ?? 0,
        to = V((0, O.f)().totalValueUsd ?? e5?.total_value ?? ts * e4),
        tc = V(ts);
      eS[23] !== to
        ? ((N = (0, D.w)(to)), (eS[23] = to), (eS[24] = N))
        : (N = eS[24]);
      let td = N,
        { usdcBalance: tu } = (0, A.f)(),
        tf = tu?.balance ?? null;
      (eS[25] !== tc || eS[26] !== e4
        ? ((S =
            tc > 0
              ? [
                  {
                    symbol: "SOL",
                    imageUri: x.T.solana,
                    usd: tc * e4,
                    detail: `${(0, D.m)(tc, 4)} SOL`,
                  },
                ]
              : []),
          (eS[25] = tc),
          (eS[26] = e4),
          (eS[27] = S))
        : (S = eS[27]),
        eS[28] !== tf
          ? ((M =
              (tf ?? 0) > 0
                ? [
                    {
                      symbol: "USDC",
                      imageUri: C.f.imageUri,
                      usd: tf ?? 0,
                      detail: `${(tf ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC`,
                    },
                  ]
                : []),
            (eS[28] = tf),
            (eS[29] = M))
          : (M = eS[29]),
        eS[30] !== S || eS[31] !== M
          ? ((R = [...S, ...M]), (eS[30] = S), (eS[31] = M), (eS[32] = R))
          : (R = eS[32]));
      let th = R,
        [tm, tb] = (0, f.useState)(!1);
      eS[33] !== eC || eS[34] !== eB
        ? ((U = async () => {
            if (eC) {
              try {
                await navigator.clipboard.writeText(eC);
              } catch {
                m.c.error(eB("web.wallet.copy_address_failed"));
                return;
              }
              (tb(!0),
                m.c.success(eB("web.wallet.address_copied")),
                setTimeout(() => tb(!1), 1400));
              try {
                (0, T.nI)({
                  address: eC,
                  sourceElement: l.k9.WALLET_MODAL,
                  sourceElementType: l.eD.MODAL,
                });
              } catch {}
            }
          }),
          (eS[33] = eC),
          (eS[34] = eB),
          (eS[35] = U))
        : (U = eS[35]);
      let tx = U,
        tp = (0, u.usePathname)(),
        ty = (0, f.useRef)(tp);
      (eS[36] !== tp
        ? ((z = () => {
            ty.current !== tp && ((ty.current = tp), eD(!1), ez(!1));
          }),
          (P = [tp]),
          (eS[36] = tp),
          (eS[37] = z),
          (eS[38] = P))
        : ((z = eS[37]), (P = eS[38])),
        (0, f.useEffect)(z, P));
      let tg = (0, f.useRef)(!1);
      (eS[39] !== eP
        ? ((q = () => {
            (eP && !tg.current && (0, T._j)(), (tg.current = eP));
          }),
          (W = [eP]),
          (eS[39] = eP),
          (eS[40] = q),
          (eS[41] = W))
        : ((q = eS[40]), (W = eS[41])),
        (0, f.useEffect)(q, W),
        eS[42] !== eE
          ? ((K = function () {
              ((0, T.xm)(), eE(!0));
            }),
            (eS[42] = eE),
            (eS[43] = K))
          : (K = eS[43]));
      let tv = K,
        tw = (tf ?? 0) > 0 || tc > 0;
      eS[44] !== tw || eS[45] !== eT
        ? ((Q = tw
            ? () => {
                ((0, T.Kj)(), eT(!0));
              }
            : void 0),
          (eS[44] = tw),
          (eS[45] = eT),
          (eS[46] = Q))
        : (Q = eS[46]);
      let tj = Q,
        t_ = Math.ceil(tl / 1e3);
      (eS[47] !== e2
        ? ((G = () => void e2()), (eS[47] = e2), (eS[48] = G))
        : (G = eS[48]),
        eS[49] !== ti || eS[50] !== t_ || eS[51] !== G
          ? ((X = { canRetry: ti, retrySeconds: t_, onRetry: G }),
            (eS[49] = ti),
            (eS[50] = t_),
            (eS[51] = G),
            (eS[52] = X))
          : (X = eS[52]));
      let tk = X;
      eS[53] !== th || eS[54] !== td
        ? ((Y = { totalDisplay: td, assets: th }),
          (eS[53] = th),
          (eS[54] = td),
          (eS[55] = Y))
        : (Y = eS[55]);
      let tN = Y;
      eS[56] !== tN ||
      eS[57] !== e8 ||
      eS[58] !== e9 ||
      eS[59] !== e7 ||
      eS[60] !== tk
        ? ((Z = e7
            ? { status: "loading" }
            : e9
              ? { status: "stale", ...tN, ...tk }
              : e8
                ? { status: "error", ...tk }
                : { status: "ready", ...tN }),
          (eS[56] = tN),
          (eS[57] = e8),
          (eS[58] = e9),
          (eS[59] = e7),
          (eS[60] = tk),
          (eS[61] = Z))
        : (Z = eS[61]);
      let tS = Z;
      eS[62] !== eC ||
      eS[63] !== tS ||
      eS[64] !== eQ ||
      eS[65] !== tm ||
      eS[66] !== tv ||
      eS[67] !== tj ||
      eS[68] !== tx ||
      eS[69] !== eV ||
      eS[70] !== eW ||
      eS[71] !== eA
        ? ((ee = (e) =>
            (0, t.jsx)(J, {
              address: eC,
              user: eA,
              balance: tS,
              copied: tm,
              onCopyAddress: () => void tx(),
              onDeposit: tv,
              onSelectBalance: tj,
              positionsFilter: eW,
              onPositionsFilterChange: eK,
              positionsSortBy: "closed" === eW ? eQ : eV,
              onPositionsSortByChange: "closed" === eW ? eG : eH,
              onClose: e,
            })),
          (eS[62] = eC),
          (eS[63] = tS),
          (eS[64] = eQ),
          (eS[65] = tm),
          (eS[66] = tv),
          (eS[67] = tj),
          (eS[68] = tx),
          (eS[69] = eV),
          (eS[70] = eW),
          (eS[71] = eA),
          (eS[72] = ee))
        : (ee = eS[72]);
      let tB = ee;
      eS[73] !== eZ ||
      eS[74] !== e6 ||
      eS[75] !== e9 ||
      eS[76] !== te ||
      eS[77] !== eq ||
      eS[78] !== eP ||
      eS[79] !== to
        ? ((et = () =>
            (0, t.jsx)(H, {
              text: eq ? (0, D.v)(to) : (0, D.w)(to),
              suffix: null,
              open: eP,
              loading: eZ && !e6,
              unavailable: te,
              stale: e9,
            })),
          (eS[73] = eZ),
          (eS[74] = e6),
          (eS[75] = e9),
          (eS[76] = te),
          (eS[77] = eq),
          (eS[78] = eP),
          (eS[79] = to),
          (eS[80] = et))
        : (et = eS[80]);
      let tC = et;
      if (eS[81] !== e$ || eS[82] !== tC || eS[83] !== eB) {
        let e,
          r,
          n,
          a = (0, s.c)("flex min-w-0 max-w-full rounded-md", p.p);
        (eS[89] !== eB
          ? ((e = eB("web.wallet.wallet_label")), (eS[89] = eB), (eS[90] = e))
          : (e = eS[90]),
          eS[91] === Symbol.for("react.memo_cache_sentinel")
            ? ((r = () => eD(!0)), (eS[91] = r))
            : (r = eS[91]));
        let l = (0, s.c)(a, "md:hidden");
        (eS[92] !== tC
          ? ((n = tC()), (eS[92] = tC), (eS[93] = n))
          : (n = eS[93]),
          (er = (0, t.jsx)("button", {
            type: "button",
            "aria-label": e,
            "aria-haspopup": "dialog",
            "aria-expanded": e$,
            onClick: r,
            "data-testid": "topbar-wallet-trigger-mobile",
            className: l,
            children: n,
          })),
          (en = "button"),
          eS[94] !== eB
            ? ((ea = eB("web.wallet.wallet_label")),
              (eS[94] = eB),
              (eS[95] = ea))
            : (ea = eS[95]),
          (el = "topbar-wallet-trigger"),
          (ei = (0, s.c)(a, "hidden md:flex")),
          (eS[81] = e$),
          (eS[82] = tC),
          (eS[83] = eB),
          (eS[84] = er),
          (eS[85] = en),
          (eS[86] = ea),
          (eS[87] = el),
          (eS[88] = ei));
      } else
        ((er = eS[84]),
          (en = eS[85]),
          (ea = eS[86]),
          (el = eS[87]),
          (ei = eS[88]));
      (eS[96] !== tC
        ? ((es = tC()), (eS[96] = tC), (eS[97] = es))
        : (es = eS[97]),
        eS[98] !== en ||
        eS[99] !== ea ||
        eS[100] !== el ||
        eS[101] !== ei ||
        eS[102] !== es
          ? ((eo = (0, t.jsx)("button", {
              type: en,
              "aria-label": ea,
              "data-testid": el,
              className: ei,
              children: es,
            })),
            (eS[98] = en),
            (eS[99] = ea),
            (eS[100] = el),
            (eS[101] = ei),
            (eS[102] = es),
            (eS[103] = eo))
          : (eo = eS[103]));
      let tA = eo;
      return (
        eS[104] === Symbol.for("react.memo_cache_sentinel")
          ? ((ec = (0, s.c)(j.Q, "md:hidden")), (eS[104] = ec))
          : (ec = eS[104]),
        eS[105] !== eB
          ? ((ed = eB("web.wallet.wallet_balance")),
            (eS[105] = eB),
            (eS[106] = ed))
          : (ed = eS[106]),
        eS[107] !== ed
          ? ((eu = (0, t.jsx)(y.L, {
              className: "sr-only",
              children: (0, t.jsx)(B.f, { children: ed }),
            })),
            (eS[107] = ed),
            (eS[108] = eu))
          : (eu = eS[108]),
        eS[109] !== eB
          ? ((ef = eB("web.wallet.sheet_description")),
            (eS[109] = eB),
            (eS[110] = ef))
          : (ef = eS[110]),
        eS[111] !== ef
          ? ((eh = (0, t.jsx)(y.c, {
              className: "sr-only",
              children: (0, t.jsx)(B.f, { children: ef }),
            })),
            (eS[111] = ef),
            (eS[112] = eh))
          : (eh = eS[112]),
        eS[113] === Symbol.for("react.memo_cache_sentinel")
          ? ((em = (0, t.jsx)("div", {
              "aria-hidden": !0,
              className:
                "mx-auto mb-1 mt-2 h-1 w-9 shrink-0 rounded-full bg-border-tertiary",
            })),
            (eS[113] = em))
          : (em = eS[113]),
        eS[114] === Symbol.for("react.memo_cache_sentinel")
          ? ((eb = () => eD(!1)), (eS[114] = eb))
          : (eb = eS[114]),
        eS[115] !== tB
          ? ((ex = tB(eb)), (eS[115] = tB), (eS[116] = ex))
          : (ex = eS[116]),
        eS[117] !== eu || eS[118] !== eh || eS[119] !== ex
          ? ((ep = (0, t.jsxs)(y.U, {
              side: "bottom",
              overlayClassName: ec,
              className:
                "flex max-h-[90vh] flex-col overflow-hidden rounded-t-[24px] border border-b-0 border-border-tertiary bg-bg-primary p-0 pb-[env(safe-area-inset-bottom)] text-text-primary shadow-lg md:hidden [&>button:last-child]:hidden",
              children: [eu, eh, em, ex],
            })),
            (eS[117] = eu),
            (eS[118] = eh),
            (eS[119] = ex),
            (eS[120] = ep))
          : (ep = eS[120]),
        eS[121] !== e$ || eS[122] !== ep
          ? ((ey = (0, t.jsx)(y.j, {
              open: e$,
              onOpenChange: eD,
              children: ep,
            })),
            (eS[121] = e$),
            (eS[122] = ep),
            (eS[123] = ey))
          : (ey = eS[123]),
        eS[124] !== eO || eS[125] !== eM || eS[126] !== eF || eS[127] !== eR
          ? ((eg = (e, t) => {
              (!e &&
                (eF || eM || eR || eO) &&
                ("outside-press" === t.reason || "focus-out" === t.reason)) ||
                ez(e);
            }),
            (eS[124] = eO),
            (eS[125] = eM),
            (eS[126] = eF),
            (eS[127] = eR),
            (eS[128] = eg))
          : (eg = eS[128]),
        eS[129] !== tA
          ? ((ev = (0, t.jsx)(_.J, { render: tA })),
            (eS[129] = tA),
            (eS[130] = ev))
          : (ev = eS[130]),
        eS[131] !== eB
          ? ((ew = eB("web.wallet.wallet_label")),
            (eS[131] = eB),
            (eS[132] = ew))
          : (ew = eS[132]),
        eS[133] !== tB
          ? ((ej = tB()), (eS[133] = tB), (eS[134] = ej))
          : (ej = eS[134]),
        eS[135] !== ew || eS[136] !== ej
          ? ((e_ = (0, t.jsx)(_.T, {
              align: "end",
              sideOffset: 8,
              density: "comfortable",
              "aria-label": ew,
              "data-testid": "topbar-wallet-popover",
              className:
                "hidden max-h-[min(640px,calc(100vh-80px))] w-[360px] flex-col overflow-hidden p-0 md:flex",
              children: ej,
            })),
            (eS[135] = ew),
            (eS[136] = ej),
            (eS[137] = e_))
          : (e_ = eS[137]),
        eS[138] !== eU || eS[139] !== eg || eS[140] !== ev || eS[141] !== e_
          ? ((ek = (0, t.jsxs)(_.V, {
              open: eU,
              onOpenChange: eg,
              children: [ev, e_],
            })),
            (eS[138] = eU),
            (eS[139] = eg),
            (eS[140] = ev),
            (eS[141] = e_),
            (eS[142] = ek))
          : (ek = eS[142]),
        eS[143] !== er || eS[144] !== ey || eS[145] !== ek
          ? ((eN = (0, t.jsxs)(t.Fragment, { children: [er, ey, ek] })),
            (eS[143] = er),
            (eS[144] = ey),
            (eS[145] = ek),
            (eS[146] = eN))
          : (eN = eS[146]),
        eN
      );
    },
    "TopbarWalletBody",
    0,
    J,
  ]);
};
