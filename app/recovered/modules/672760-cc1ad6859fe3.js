// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(322315),
    o = e.i(254010),
    l = e.i(574472),
    i = e.i(606933),
    a = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    c = e.i(63289),
    u = e.i(393608),
    d = e.i(144050),
    f = e.i(695705),
    h = e.i(339179),
    g = e.i(140569),
    p = e.i(11862),
    m = e.i(148885);
  let v = [2e3, 5e3, 1e4, 15e3],
    _ = (e) =>
      new Promise((t) => {
        setTimeout(t, e);
      }),
    y = (e) => {
      let { orders: t, remainingUiAmount: n, orderDecimals: r } = e,
        o = t.filter((e) => (0, f.z)(e.status)),
        l = (() => {
          if (n <= 0) return o;
          if (void 0 === r) return [];
          let e = Math.max(0.5 / 10 ** r, 1e-12 * n);
          return n <= e
            ? o
            : o.filter((t) => {
                let o = (0, m.W)(t.quantityAtomic, r);
                return null != o && n < o - e;
              });
        })();
      return {
        cancellable: l.filter((e) => !(0, f.D)(e.status)),
        executing: l.filter((e) => (0, f.D)(e.status)),
      };
    },
    w = (e) => {
      if (0 === e.length) return null;
      let t = new Set(
          e.map((e) => {
            let t;
            return "take_profit" ===
              (t = e.orderType.trim().toLowerCase().replace(/\s+/g, "_"))
              ? "take_profit"
              : "stop_loss" === t
                ? "stop_loss"
                : t.includes("take") && t.includes("profit")
                  ? "take_profit"
                  : t.includes("stop") && t.includes("loss")
                    ? "stop_loss"
                    : null;
          }),
        ),
        n = t.has("take_profit"),
        r = t.has("stop_loss");
      return n && !r ? "take_profit" : r && !n ? "stop_loss" : "both";
    };
  var b = e.i(399015),
    I = e.i(93903),
    S = e.i(51954),
    k = e.i(54567),
    A = e.i(987425);
  let T = (e, t) => Number(e) / 10 ** t,
    B = (e, t) => {
      "both" === e
        ? c.c.success(t("coin_details.tp_sl_auto_cancel_both"))
        : "take_profit" === e
          ? c.c.success(t("coin_details.tp_sl_auto_cancel_tp"))
          : c.c.success(t("coin_details.tp_sl_auto_cancel_sl"));
    },
    C = new Map(),
    O = async ({
      payload: e,
      remainingAtomic: t,
      cancelEvmLimitOrder: n,
      t: r,
    }) => {
      let { mint: o, walletAddress: l } = e;
      if (!e.chainId) return;
      let i = (0, A.f)(e.chainId);
      if (null === i)
        return void k.logger.warn(
          "[useAutoCancelTpSlOnSell] evm_chain_id_unparseable",
          { mint: o, chainId: e.chainId },
        );
      let a = t <= BigInt(0),
        s = async () => {
          try {
            return await (0, h.n)({ owner: l, chainId: i, token: o });
          } catch (e) {
            k.logger.error("[useAutoCancelTpSlOnSell] evm_list_limit_failed", {
              mint: o,
              chainId: i,
              reason: (0, h.$)(e) ? e.reason : void 0,
              error: e,
            });
            return;
          }
        },
        c = [],
        d = new Set(),
        g = [],
        p = 0,
        m = async (r) => {
          p += 1;
          let l =
              r.find((e) => e.evm?.tokenDecimals != null)?.evm?.tokenDecimals ??
              e.tokenDecimals,
            s = a ? 0 : void 0 === l ? 1 / 0 : T(t, l);
          1 === p &&
            void 0 === l &&
            !a &&
            r.some((e) => (0, f.z)(e.status) && !(0, f.D)(e.status)) &&
            k.logger.warn(
              "[useAutoCancelTpSlOnSell] evm_decimals_unresolved_skip",
              { mint: o, chainId: i, orders: r.length },
            );
          let h = {
            orders: r.filter((e) => !d.has(e.orderId)),
            remainingUiAmount: s,
            orderDecimals: l,
          };
          for (let e of ((g = y(h).executing), y(h).cancellable))
            if (void 0 !== e.evm)
              try {
                (await n({
                  chainId: e.evm.chainId,
                  token: o,
                  orderAddress: e.evm.orderAddress,
                  orderId: e.evm.orderId,
                }),
                  c.push(e),
                  d.add(e.orderId));
              } catch (t) {
                (0, u.k)(t)
                  ? g.push(e)
                  : k.logger.error(
                      "[useAutoCancelTpSlOnSell] evm_auto_cancel_failed",
                      { mint: o, chainId: i, orderId: e.orderId, error: t },
                    );
              }
        },
        b = () => {
          let e = w(c);
          null !== e &&
            (k.logger.info(
              "[useAutoCancelTpSlOnSell] evm_auto_cancelled_stranded_legs",
              {
                mint: o,
                chainId: i,
                cancelled: c.length,
                passes: p,
                isFullExit: a,
              },
            ),
            B(e, r));
        },
        I = async () => {
          for (let e of v) {
            if (0 === g.length) break;
            await _(e);
            let t = await s();
            if (void 0 === t) break;
            await m(t);
          }
          (g.length > 0 &&
            k.logger.warn(
              "[useAutoCancelTpSlOnSell] evm_auto_cancel_deferred_exhausted",
              {
                mint: o,
                chainId: i,
                orderIds: g.map((e) => e.orderId),
                passes: p,
              },
            ),
            b());
        },
        S = await s();
      if (void 0 === S) return;
      if ((await m(S), 0 === g.length)) return void b();
      let O = `${i}:${o}`,
        x = (C.get(O) ?? Promise.resolve())
          .then(I)
          .catch((e) => {
            k.logger.error(
              "[useAutoCancelTpSlOnSell] evm_retry_ladder_failed",
              { mint: o, chainId: i, error: e },
            );
          })
          .then(() => {
            C.get(O) === x && C.delete(O);
          });
      C.set(O, x);
    },
    x = async ({
      payload: e,
      activeWalletAddress: t,
      cancelLimitOrder: n,
      cancelEvmLimitOrder: r,
      t: o,
    }) => {
      let l,
        { mint: i, walletAddress: a, direction: s } = e;
      if (
        "sell" !== s ||
        !i ||
        (0, b.G)(i) ||
        !a ||
        a !== t ||
        null == e.balanceBeforeAtomic ||
        null == e.soldAtomic ||
        !/^\d+$/.test(e.balanceBeforeAtomic) ||
        !/^\d+$/.test(e.soldAtomic)
      )
        return;
      let c = BigInt(e.balanceBeforeAtomic) - BigInt(e.soldAtomic);
      if (i.startsWith("0x"))
        return void (await O({
          payload: e,
          remainingAtomic: c,
          cancelEvmLimitOrder: r,
          t: o,
        }));
      let u = S.f.getState().getTokenBalance?.(i);
      if (u?.doesTokenAccountExist && null != u.balanceRaw) {
        let e = BigInt(u.balanceRaw.toString());
        e < c && (c = e);
      }
      let d = ((e) => {
          if (null != e.tokenDecimals) return e.tokenDecimals;
          let t =
            S.f.getState().coinsByMint[e.mint]?.mintAccount?.decodedAccount
              ?.decimals;
          return "number" == typeof t ? t : void 0;
        })(e),
        h = c <= BigInt(0) ? 0 : void 0 === d ? 1 / 0 : T(c, d);
      try {
        l = await (0, p.f)({ user: a, mint: i });
      } catch (e) {
        k.logger.error("[useAutoCancelTpSlOnSell] list_limit_failed", {
          mint: i,
          error: e,
        });
        return;
      }
      if (!l.some((e) => (0, f.z)(e.status) && !(0, f.D)(e.status))) return;
      if (void 0 === d && c > BigInt(0))
        return void k.logger.warn(
          "[useAutoCancelTpSlOnSell] decimals_unresolved_skip",
          { mint: i, orders: l.length },
        );
      let g = y({
        orders: l,
        remainingUiAmount: h,
        orderDecimals: d,
      }).cancellable;
      if (0 === g.length) return;
      let m = [];
      for (let e of g)
        try {
          let t = await n({ mint: i, orderId: e.orderId, user: a });
          (m.push(e),
            t.nonceCloseSubmitted ||
              k.logger.warn("[useAutoCancelTpSlOnSell] nonce_close_pending", {
                mint: i,
                orderId: e.orderId,
              }));
        } catch (t) {
          k.logger.error("[useAutoCancelTpSlOnSell] auto_cancel_failed", {
            mint: i,
            orderId: e.orderId,
            error: t,
          });
        }
      let v = w(m);
      null !== v &&
        (k.logger.info(
          "[useAutoCancelTpSlOnSell] auto_cancelled_stranded_legs",
          {
            mint: i,
            cancelled: m.length,
            attempted: g.length,
            isFullExit: c <= BigInt(0),
          },
        ),
        B(v, o));
    },
    $ = null,
    L = (e) => {
      let t,
        r,
        o,
        l = (0, n.c)(9),
        { walletAddress: c } = e,
        { t: u } = (0, s.f)(),
        f = (0, i.useQueryClient)(),
        { mutateAsync: p } = (0, d.f)();
      l[0] !== f || l[1] !== c
        ? ((t = (e) => {
            let { chainId: t, token: n, orderAddress: r, orderId: o } = e;
            return (0, h.b)({
              chainId: t,
              orderAddress: r,
              orderId: o,
            }).finally(() => {
              (0, g.f)({ queryClient: f, owner: c, chainId: t, token: n });
            });
          }),
          (l[0] = f),
          (l[1] = c),
          (l[2] = t))
        : (t = l[2]);
      let m = t;
      return (
        l[3] !== m || l[4] !== p || l[5] !== u || l[6] !== c
          ? ((r = () =>
              (0, I.p)(
                (e) => {
                  var t;
                  ((t = {
                    payload: e,
                    activeWalletAddress: c,
                    cancelLimitOrder: p,
                    cancelEvmLimitOrder: m,
                    t: u,
                  }),
                    ($ = ($ ?? Promise.resolve()).then(() =>
                      x(t).catch((e) => {
                        k.logger.error(
                          "[useAutoCancelTpSlOnSell] processing_failed",
                          { mint: t.payload.mint, error: e },
                        );
                      }),
                    )));
                },
                { replayChannel: I.U },
              )),
            (o = [c, p, m, u]),
            (l[3] = m),
            (l[4] = p),
            (l[5] = u),
            (l[6] = c),
            (l[7] = r),
            (l[8] = o))
          : ((r = l[7]), (o = l[8])),
        (0, a.useEffect)(r, o),
        null
      );
    };
  e.s(
    [
      "TpSlAutoCancelOnSell",
      0,
      () => {
        let e,
          i = (0, n.c)(2),
          a = (0, o.k)(r.D.WEB_BLOCKCHAIN_LIMIT_ORDERS, !1),
          { address: s } = (0, l.F)();
        return a && s
          ? (i[0] !== s
              ? ((e = (0, t.jsx)(L, { walletAddress: s })),
                (i[0] = s),
                (i[1] = e))
              : (e = i[1]),
            e)
          : null;
      },
      "processTradeSuccessForTpSlAutoCancel",
      0,
      x,
    ],
    672760,
  );
};
