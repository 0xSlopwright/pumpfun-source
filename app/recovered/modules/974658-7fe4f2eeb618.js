// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(745018);
  e.i(12692);
  var a = e.i(398902),
    s = e.i(63289),
    i = e.i(910222),
    o = e.i(90832),
    l = e.i(655397),
    c = e.i(506486);
  let u = () => {
      let e = 10,
        t = setInterval(() => {
          (e -= 1) <= 0 && clearInterval(t);
        }, 1e3);
      return t;
    },
    d = ({ title: e, subtitle: n, testId: a }) => ({
      toastId: s.c.custom(
        () =>
          (0, t.jsx)(c.O, {
            tone: "neutral",
            testId: a,
            glyph: (0, t.jsx)(r.Wh, { className: "animate-spin" }),
            title: e,
            subtitle: n,
            durationMs: 1e4,
          }),
        { duration: 1e4 },
      ),
      interval: u(),
    }),
    f = (e) => {
      let r,
        s,
        i = (0, n.c)(6),
        { formattedAmount: o, symbol: l } = e,
        { t: c } = (0, a.f)();
      return (
        i[0] !== c
          ? ((r = c("web.toasts.withdrawing")), (i[0] = c), (i[1] = r))
          : (r = i[1]),
        i[2] !== o || i[3] !== l || i[4] !== r
          ? ((s = (0, t.jsxs)(t.Fragment, { children: [r, " ", o, " ", l] })),
            (i[2] = o),
            (i[3] = l),
            (i[4] = r),
            (i[5] = s))
          : (s = i[5]),
        s
      );
    },
    m = () => {
      let e,
        r,
        s = (0, n.c)(4),
        { t: i } = (0, a.f)();
      return (
        s[0] !== i
          ? ((e = i("web.toasts.confirming_transaction")),
            (s[0] = i),
            (s[1] = e))
          : (e = s[1]),
        s[2] !== e
          ? ((r = (0, t.jsx)(t.Fragment, { children: e })),
            (s[2] = e),
            (s[3] = r))
          : (r = s[3]),
        r
      );
    },
    g = (e) => {
      let r,
        s,
        i = (0, n.c)(5),
        { name: o } = e,
        { t: l } = (0, a.f)();
      return (
        i[0] !== l
          ? ((r = l("web.toasts.creating")), (i[0] = l), (i[1] = r))
          : (r = i[1]),
        i[2] !== o || i[3] !== r
          ? ((s = (0, t.jsxs)(t.Fragment, { children: [r, " ", o] })),
            (i[2] = o),
            (i[3] = r),
            (i[4] = s))
          : (s = i[4]),
        s
      );
    },
    p = (e) => {
      let r,
        s,
        o = (0, n.c)(12),
        { isBuy: l, tokenAmount: c, symbol: u, convert: d } = e,
        { t: f } = (0, a.f)();
      if (d) {
        let e, n;
        return (
          o[0] !== d || o[1] !== f
            ? ((e = (0, i.I)({ t: f, convert: d })),
              (o[0] = d),
              (o[1] = f),
              (o[2] = e))
            : (e = o[2]),
          o[3] !== e
            ? ((n = (0, t.jsx)(t.Fragment, { children: e })),
              (o[3] = e),
              (o[4] = n))
            : (n = o[4]),
          n
        );
      }
      return (
        o[5] !== l || o[6] !== f
          ? ((r = f(l ? "web.toasts.buying" : "web.toasts.selling")),
            (o[5] = l),
            (o[6] = f),
            (o[7] = r))
          : (r = o[7]),
        o[8] !== u || o[9] !== r || o[10] !== c
          ? ((s = (0, t.jsxs)(t.Fragment, { children: [r, " ", c, " ", u] })),
            (o[8] = u),
            (o[9] = r),
            (o[10] = c),
            (o[11] = s))
          : (s = o[11]),
        s
      );
    },
    h = ({
      type: e,
      tokenAmount: n,
      symbol: a,
      solUi: s,
      paymentLabel: i,
      convert: l,
    }) => {
      let u = a.replace(/^\$/, "");
      return (0, t.jsx)(c.O, {
        tone: "neutral",
        testId: "trade-loading-toast",
        glyph: (0, t.jsx)(r.Wh, { className: "animate-spin" }),
        title: (0, t.jsx)(p, {
          isBuy: "buy" === e,
          tokenAmount: n,
          symbol: u,
          convert: l,
        }),
        subtitle:
          i ?? (0, t.jsx)(c.H, { label: `${(0, o.m)(s)} SOL`, solUi: s }),
      });
    };
  e.s(
    [
      "b",
      0,
      (e, t, n, r, a, i) => (
        (0, c.$)(a),
        {
          toastId: s.c.custom(
            () =>
              h({
                type: "buy",
                tokenAmount: (0, o.p)(e),
                symbol: t,
                solUi: (0, l.h)(n),
                paymentLabel: r,
                convert: i,
              }),
            { duration: 1 / 0 },
          ),
          interval: u(),
        }
      ),
      "E",
      0,
      (e, n) =>
        d({
          testId: "coin-creation-loading-toast",
          title: (0, t.jsx)(g, { name: e }),
          subtitle: (0, t.jsxs)(t.Fragment, { children: ["[", n, "]"] }),
        }),
      "D",
      0,
      (e, t, n, r, a, i) => (
        (0, c.$)(a),
        {
          toastId: s.c.custom(
            () =>
              h({
                type: "sell",
                tokenAmount: (0, o.p)(e),
                symbol: t,
                solUi: (0, l.h)(n),
                paymentLabel: r,
                convert: i,
              }),
            { duration: 1 / 0 },
          ),
          interval: u(),
        }
      ),
      "u",
      0,
      (e, n) => {
        let r = "string" == typeof e ? e : (0, o.p)(e),
          a = n.replace(/^\$/, "");
        return d({
          testId: "withdrawal-loading-toast",
          title: (0, t.jsx)(f, { formattedAmount: r, symbol: a }),
          subtitle: (0, t.jsx)(m, {}),
        });
      },
    ],
    974658,
  );
  var b = e.i(914139),
    _ = e.i(292686),
    y = e.i(984066);
  let w = { mine: _.k9.TRADE_SUCCESS, other: _.k9.TRADE_SUCCESS };
  function v(e) {
    let s,
      i,
      o,
      l,
      u = (0, n.c)(10),
      { coin: d, holderAddress: f, onActed: m } = e,
      { t: g } = (0, a.f)();
    u[0] !== d || u[1] !== f || u[2] !== m
      ? ((s = (e) => {
          (e.stopPropagation(),
            (0, y.X)({
              kind: "position",
              coin: d,
              holderAddress: f,
              sourceElement: w,
            }),
            m?.());
        }),
        (u[0] = d),
        (u[1] = f),
        (u[2] = m),
        (u[3] = s))
      : (s = u[3]);
    let p = s;
    return (
      u[4] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = (0, t.jsx)(r.AS, { size: 12 })), (u[4] = i))
        : (i = u[4]),
      u[5] !== g
        ? ((o = g("common.share")), (u[5] = g), (u[6] = o))
        : (o = u[6]),
      u[7] !== p || u[8] !== o
        ? ((l = (0, t.jsxs)("button", {
            type: "button",
            onClick: p,
            "data-testid": "trade-share-toast-action",
            className: c.t,
            children: [i, o],
          })),
          (u[7] = p),
          (u[8] = o),
          (u[9] = l))
        : (l = u[9]),
      l
    );
  }
  var k = e.i(595673);
  function x({
    message: e,
    description: n,
    signature: a,
    id: i,
    chainId: o,
    mint: l,
    coin: u,
  }) {
    s.c.custom(
      (i) =>
        (0, t.jsx)(c.X, {
          render: (d) =>
            (0, t.jsx)(c.O, {
              tone: "loss",
              mint: l,
              coin: u,
              testId: "trade-error-toast",
              ariaLabel: d("web.toasts.trade_failed_aria"),
              onDismiss: () => s.c.dismiss(i),
              glyph: (0, t.jsx)(r.ck, {}),
              title: e,
              subtitle: n,
              subtitleLines: 2,
              durationMs: 6e3,
              action: a ? (0, t.jsx)(c.v, { signature: a, chainId: o }) : null,
            }),
        }),
      i ? { id: i, duration: 6e3 } : { duration: 6e3 },
    );
  }
  function $({
    signature: e,
    message: t,
    description: n,
    id: r,
    chainId: a,
    mint: s,
    coin: i,
  }) {
    x({
      message: t,
      description: n,
      signature: e,
      id: r,
      chainId: a,
      mint: s,
      coin: i,
    });
  }
  function S({
    signature: e,
    toastId: n,
    mint: a,
    coin: o,
    side: l,
    symbol: u,
    convert: d,
  }) {
    s.c.custom(
      (n) =>
        (0, t.jsx)(c.X, {
          render: (f) => {
            let m = (function ({ t: e, side: t, symbol: n, convert: r }) {
              return r
                ? (0, i.N)({ t: e, convert: r })
                : t && n
                  ? (0, i.J)({ t: e, side: t, symbol: n })
                  : {
                      message: e("web.toasts.trade_submitted"),
                      description: e("web.toasts.trade_still_confirming"),
                    };
            })({ t: f, side: l, symbol: u, convert: d });
            return (0, t.jsx)(c.O, {
              tone: "neutral",
              mint: a,
              coin: o,
              testId: "trade-pending-toast",
              ariaLabel: f("web.toasts.trade_confirming_aria"),
              onDismiss: () => s.c.dismiss(n),
              glyph: (0, t.jsx)(r.Wh, { className: "animate-spin" }),
              title: m.message,
              subtitle: m.description,
              subtitleLines: 2,
              action: (0, t.jsx)(c.v, { signature: e }),
            });
          },
        }),
      n ? { id: n, duration: 1 / 0 } : { duration: 1 / 0 },
    );
  }
  async function j({
    type: e,
    amount: n,
    symbol: a,
    solAmount: u,
    signature: d,
    interval: f,
    toastId: m,
    mint: g,
    coin: p,
    confirmTxPromise: h,
    onShowToastSuccess: _ = () => {},
    onShowToastError: y = () => {},
    showOpenCoin: w = !1,
    buyCalloutCta: x,
    shareCta: B,
    paymentLabel: I,
    convert: A,
  }) {
    (0, c.$)(p);
    let T = setTimeout(() => {
      (f && clearInterval(f),
        S({
          signature: d,
          toastId: m,
          mint: g,
          coin: p,
          side: e,
          symbol: a,
          convert: A,
        }));
    }, 3e4);
    try {
      (await h, clearTimeout(T), f && clearInterval(f), m && s.c.dismiss(m));
      try {
        _();
      } catch {}
      let y = (0, o.p)(n),
        $ = (0, l.h)(u),
        S = (0, o.m)($),
        j = "buy" === e;
      s.c.custom(
        (n) =>
          (0, t.jsx)(c.X, {
            render: (o) => {
              let l, u, f, m, h;
              return (0, t.jsx)(c.O, {
                tone: (0, c.R)(e),
                side: e,
                mint: g,
                coin: p,
                testId: "trade-success-toast",
                ariaLabel: o("web.toasts.trade_confirmed_aria"),
                actionBelow: w,
                onDismiss: () => s.c.dismiss(n),
                glyph: (0, t.jsx)(r.y$, {}),
                title: A
                  ? (0, i.b)({ t: o, convert: A })
                  : (0, i.o)({ t: o, side: e, amount: y, symbol: a }),
                subtitle: I ?? (0, t.jsx)(c.H, { label: `${S} SOL`, solUi: $ }),
                durationMs: 6e3,
                action:
                  ((l =
                    j && x
                      ? (0, t.jsx)(b.f, { ...x, onActed: () => s.c.dismiss(n) })
                      : null),
                  (u = B
                    ? (0, t.jsx)(v, { ...B, onActed: () => s.c.dismiss(n) })
                    : null),
                  (m =
                    null !==
                      (f = w
                        ? (0, t.jsx)(c.m, {
                            href: `/coin/${g}`,
                            target: "_self",
                            variant: l ? "default" : "primary",
                            onClick: () => (0, k.Te)(g),
                            children: (0, t.jsx)(c.X, {
                              render: (e) =>
                                (0, t.jsx)(t.Fragment, {
                                  children: e("web.toasts.open_coin"),
                                }),
                            }),
                          })
                        : null) || null !== u),
                  (h = l ?? (0, t.jsx)(c.v, { signature: d, compact: m })),
                  m ? (0, t.jsxs)(t.Fragment, { children: [f, u, h] }) : h),
              });
            },
          }),
        { duration: 6e3 },
      );
    } catch (o) {
      (clearTimeout(T), f && clearInterval(f));
      let n = (0, t.jsx)(c.X, {
          render: (n) =>
            (0, t.jsx)(t.Fragment, {
              children: (A
                ? (0, i.V)({ t: n, convert: A })
                : (0, i.D)({ t: n, side: e, symbol: a })
              ).message,
            }),
        }),
        r =
          o instanceof Error
            ? o.message
            : (0, t.jsx)(c.X, {
                render: (e) =>
                  (0, t.jsx)(t.Fragment, {
                    children: e("web.toasts.unknown_error"),
                  }),
              });
      try {
        y(o);
      } catch {}
      (m && s.c.dismiss(m),
        $({ signature: d, message: n, description: r, mint: g, coin: p }));
    }
  }
  async function B({
    withdrawAmount: e,
    withdrawSymbol: n,
    signature: a,
    chainId: i,
    interval: l,
    toastId: u,
    confirmTxPromise: d,
    onShowToastSuccess: f = () => {},
    onShowToastError: m = () => {},
  }) {
    try {
      (await d, clearInterval(l), f());
      let m = "string" == typeof e ? e : (0, o.p)(e),
        g = n.replace(/^\$/, "");
      (s.c.dismiss(u),
        s.c.custom(
          (e) =>
            (0, t.jsx)(c.X, {
              render: (n) =>
                (0, t.jsx)(c.O, {
                  tone: "gain",
                  testId: "withdrawal-success-toast",
                  ariaLabel: n("web.toasts.withdrawal_confirmed_aria"),
                  onDismiss: () => s.c.dismiss(e),
                  glyph: (0, t.jsx)(r.y$, {}),
                  title: `${n("web.toasts.sent")} ${m} ${g}`,
                  subtitle: n("web.toasts.transaction_confirmed"),
                  durationMs: 6e3,
                  action: (0, t.jsx)(c.v, { signature: a, chainId: i }),
                }),
            }),
          { duration: 6e3 },
        ));
    } catch (e) {
      (clearInterval(l),
        m(e),
        s.c.dismiss(u),
        $({
          signature: a,
          message: (0, t.jsx)(c.X, {
            render: (e) =>
              (0, t.jsx)(t.Fragment, {
                children: e("web.toasts.could_not_send_funds"),
              }),
          }),
          description:
            e instanceof Error
              ? e.message
              : (0, t.jsx)(c.X, {
                  render: (e) =>
                    (0, t.jsx)(t.Fragment, {
                      children: e("web.toasts.unknown_error"),
                    }),
                }),
          chainId: i,
        }));
    }
  }
  async function I(e, n, a, i, o, l, u, d) {
    try {
      (await u, clearInterval(o));
      let f = d
        ? `/coin/${e.toBase58()}?tokenizedAgentOnboarding=true`
        : `/coin/${e.toBase58()}`;
      (s.c.dismiss(l),
        s.c.custom(
          (o) =>
            (0, t.jsx)(c.X, {
              render: (l) =>
                (0, t.jsx)(c.O, {
                  tone: "gain",
                  mint: e.toBase58(),
                  testId: "coin-creation-success-toast",
                  ariaLabel: l("web.toasts.coin_created_aria"),
                  onDismiss: () => s.c.dismiss(o),
                  glyph: (0, t.jsx)(r.y$, {}),
                  title: `${l("web.toasts.created")} ${n}`,
                  subtitle: `[${a}]`,
                  durationMs: 6e3,
                  action: (0, t.jsxs)(t.Fragment, {
                    children: [
                      (0, t.jsx)(c.v, { signature: i, compact: !0 }),
                      (0, t.jsx)(c.m, {
                        href: f,
                        target: "_self",
                        variant: "primary",
                        children: l("web.coin.view_coin"),
                      }),
                    ],
                  }),
                }),
            }),
          { duration: 6e3 },
        ));
    } catch (n) {
      (clearInterval(o),
        s.c.dismiss(l),
        $({
          signature: i,
          message: (0, t.jsx)(c.X, {
            render: (e) =>
              (0, t.jsx)(t.Fragment, {
                children: e("web.toasts.could_not_create_coin"),
              }),
          }),
          description:
            n instanceof Error
              ? n.message
              : (0, t.jsx)(c.X, {
                  render: (e) =>
                    (0, t.jsx)(t.Fragment, {
                      children: e("web.toasts.unknown_error"),
                    }),
                }),
          mint: e.toBase58(),
        }));
    }
  }
  e.s(["a", 0, I, "J", 0, x, "j", 0, S, "Q", 0, j, "H", 0, B], 240763);
};
