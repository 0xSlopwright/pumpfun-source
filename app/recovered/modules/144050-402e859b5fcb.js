// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(574472),
    r = e.i(132838),
    o = e.i(606933),
    l = e.i(66961),
    i = e.i(777887),
    a = e.i(426091),
    s = e.i(635234),
    c = e.i(466931),
    u = e.i(22675),
    d = e.i(358052),
    f = e.i(54567);
  let h = async (e, t, n) => {
      let r, o;
      try {
        r = (0, u.m)(t);
      } catch (t) {
        return (
          f.logger.warn("[cancelLimitOrder] close_nonce_tx_invalid", {
            orderId: e,
            error: t,
          }),
          "failed"
        );
      }
      try {
        o = await n.signTransaction(r);
      } catch (t) {
        return (
          f.logger.warn("[cancelLimitOrder] close_nonce_sign_declined", {
            orderId: e,
            error: t,
          }),
          "declined"
        );
      }
      try {
        let t = await n.connection.sendRawTransaction((0, d.f)(o), {
          skipPreflight: !1,
        });
        return (
          f.logger.info("[cancelLimitOrder] nonce_close_submitted", {
            orderId: e,
            signature: t,
          }),
          "submitted"
        );
      } catch (t) {
        return (
          f.logger.warn("[cancelLimitOrder] close_nonce_send_failed", {
            orderId: e,
            error: t,
          }),
          "failed"
        );
      }
    },
    g = async (e, t, n) => {
      if ("closed" === t.nonce_status) return !0;
      let r = t.close_nonce_transaction;
      if (r) {
        let t = await h(e.orderId, r, n);
        if ("submitted" === t) return !0;
        if ("declined" === t) return !1;
      }
      try {
        let t = await (0, s.P)({ orderId: e.orderId });
        if ("closed" === t.nonce_status) return !0;
        let r = t.close_nonce_transaction;
        if (!r)
          return (
            f.logger.warn("[cancelLimitOrder] close_nonce_tx_missing", {
              orderId: e.orderId,
              nonceStatus: t.nonce_status,
            }),
            !1
          );
        let o = await h(e.orderId, r, n);
        return "submitted" === o;
      } catch (t) {
        return (
          f.logger.warn("[cancelLimitOrder] close_nonce_failed", {
            orderId: e.orderId,
            error: t,
          }),
          (0, c.l)({
            error: t,
            feature: "limit-orders",
            operation: "nonce-close",
            context: {
              mint: e.mint,
              orderId: e.orderId,
              walletName: (0, a.Y)(),
            },
          }),
          !1
        );
      }
    };
  async function p(e) {
    try {
      return await (0, s.P)({ orderId: e.orderId });
    } catch (t) {
      throw (
        f.logger.error("[cancelLimitOrder] cancel_limit_failed", {
          orderId: e.orderId,
          error: t,
        }),
        (0, c.l)({
          error: t,
          feature: "limit-orders",
          operation: "cancel-limit",
          context: { mint: e.mint, orderId: e.orderId, walletName: (0, a.Y)() },
        }),
        t
      );
    }
  }
  async function m(e, t) {
    let n = await p(e);
    return { success: !0, nonceCloseSubmitted: await g(e, n, t) };
  }
  e.s(["d", 0, g, "L", 0, m, "C", 0, p], 416200);
  var v = e.i(440072);
  function _(e, t) {
    f.logger.error("[useCancelLimitOrderMutation] cancel_failed", {
      orderId: t.orderId,
      error: e,
    });
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          a,
          s,
          c,
          u = (0, t.c)(9),
          d = (0, o.useQueryClient)(),
          { wallet: f } = (0, n.F)(),
          { connection: h } = (0, l.f)();
        return (
          u[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = ["limit-orders", "cancel"]), (u[0] = e))
            : (e = u[0]),
          u[1] !== h || u[2] !== f
            ? ((a = (e) => {
                if (!f) throw Error("Wallet not connected");
                return m(e, {
                  connection: h,
                  signTransaction: (e) => (0, i._)(() => f.signTransaction(e)),
                });
              }),
              (u[1] = h),
              (u[2] = f),
              (u[3] = a))
            : (a = u[3]),
          u[4] !== d
            ? ((s = (e, t, n) => {
                (d.invalidateQueries({ queryKey: v.f.byUser(n.user) }),
                  d.invalidateQueries({
                    queryKey: v.f.byUserAndMint(n.user, n.mint),
                  }));
              }),
              (u[4] = d),
              (u[5] = s))
            : (s = u[5]),
          u[6] !== a || u[7] !== s
            ? ((c = {
                mutationKey: e,
                mutationFn: a,
                onError: _,
                onSettled: s,
              }),
              (u[6] = a),
              (u[7] = s),
              (u[8] = c))
            : (c = u[8]),
          (0, r.f)(c)
        );
      },
    ],
    144050,
  );
};
