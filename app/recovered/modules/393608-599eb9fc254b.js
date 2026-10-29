// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(132838),
    r = e.i(606933),
    o = e.i(339179),
    l = e.i(485759);
  let i = ({ queryClient: e, owner: t, chainId: n, token: r }) => {
    (e.invalidateQueries({ queryKey: l.f.byOwner(t) }),
      e.invalidateQueries({
        queryKey: l.f.byOwnerChainToken({ owner: t, chainId: n, token: r }),
      }),
      e.invalidateQueries({
        queryKey: l.f.eligibilityForToken({ owner: t, chainId: n, token: r }),
      }));
  };
  e.s(["f", 0, i], 140569);
  var a = e.i(54567);
  let s = ["limit-orders", "cancel-evm"];
  function c(e) {
    let { chainId: t, orderAddress: n, orderId: r } = e;
    return (0, o.b)({ chainId: t, orderAddress: n, orderId: r });
  }
  function u(e, t) {
    a.logger.error("[useCancelEvmLimitOrderMutation] cancel_failed", {
      chainId: t.chainId,
      orderAddress: t.orderAddress,
      orderId: t.orderId,
      status: (0, o.$)(e) ? e.status : void 0,
      reason: (0, o.$)(e) ? e.reason : void 0,
      error: e,
    });
  }
  e.s(
    [
      "k",
      0,
      (e) => (0, o.f)({ error: e, reason: o.Y.notCancellable }),
      "O",
      0,
      () => {
        let e,
          o = (0, t.c)(2),
          l = (0, r.useQueryClient)();
        return (
          o[0] !== l
            ? ((e = {
                mutationKey: s,
                mutationFn: c,
                onError: u,
                onSettled: (e, t, n) => {
                  i({
                    queryClient: l,
                    owner: n.owner,
                    chainId: n.chainId,
                    token: n.token,
                  });
                },
              }),
              (o[0] = l),
              (o[1] = e))
            : (e = o[1]),
          (0, n.f)(e)
        );
      },
    ],
    393608,
  );
};
