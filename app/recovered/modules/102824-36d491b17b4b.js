// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    a = e.i(51954),
    s = e.i(227627),
    i = e.i(655397);
  let o = (0, i.p)();
  function l(e) {
    return e.acquire;
  }
  function c(e) {
    return e.touchLease;
  }
  function u(e) {
    return e.leaseGcConfig;
  }
  function d(e) {
    return e.tokenBalanceByMint[(0, i.p)().toBase58()] ?? null;
  }
  function f(e) {
    return e.acquire;
  }
  function m(e) {
    return e.touchLease;
  }
  function g(e) {
    return e.leaseGcConfig;
  }
  function p(e) {
    return e.user.solBalance;
  }
  function h(e) {
    return e.acquire;
  }
  function b(e) {
    return e.touchLease;
  }
  function _(e) {
    return e.leaseGcConfig;
  }
  function y(e) {
    return e.user.address;
  }
  let w = (0, i.p)().toBase58();
  function v(e) {
    return e.user;
  }
  function k(e) {
    return e.tokenBalanceByMint[w] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          i = (0, t.c)(7),
          w = (0, a.f)(v),
          x = (0, a.f)(k);
        ((() => {
          let e,
            n,
            i = (0, t.c)(5),
            o = (0, a.f)(f),
            l = (0, a.f)(m),
            { heartbeatMs: c } = (0, a.f)(g),
            u = ((0, a.f)(p), (0, r.useRef)(null));
          return (
            i[0] !== o || i[1] !== c || i[2] !== l
              ? ((e = () => {
                  let { token: e, release: t } = o({
                    tag: s.C.SOL_BALANCE,
                    data: null,
                  });
                  return (
                    (u.current = setInterval(() => {
                      l(e);
                    }, c)),
                    () => {
                      (u.current &&
                        (clearInterval(u.current), (u.current = null)),
                        t());
                    }
                  );
                }),
                (n = [o, l, c]),
                (i[0] = o),
                (i[1] = c),
                (i[2] = l),
                (i[3] = e),
                (i[4] = n))
              : ((e = i[3]), (n = i[4])),
            (0, r.useEffect)(e, n)
          );
        })(),
          (() => {
            let e,
              n,
              i = (0, t.c)(6),
              o = (0, a.f)(h),
              l = (0, a.f)(b),
              { heartbeatMs: c } = (0, a.f)(_),
              u = (0, a.f)(y),
              d = (0, r.useRef)(null);
            (i[0] !== o || i[1] !== c || i[2] !== l || i[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = o({
                    tag: s.C.USER_ACCOUNTS,
                    data: { address: u },
                  });
                  return (
                    (d.current = setInterval(() => {
                      l(e);
                    }, c)),
                    () => {
                      (d.current &&
                        (clearInterval(d.current), (d.current = null)),
                        t());
                    }
                  );
                }),
                (n = [u, o, l, c]),
                (i[0] = o),
                (i[1] = c),
                (i[2] = l),
                (i[3] = u),
                (i[4] = e),
                (i[5] = n))
              : ((e = i[4]), (n = i[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              i,
              f = (0, t.c)(5),
              m = (0, a.f)(l),
              g = (0, a.f)(c),
              { heartbeatMs: p } = (0, a.f)(u),
              h = ((0, a.f)(d), (0, r.useRef)(null));
            return (
              f[0] !== m || f[1] !== p || f[2] !== g
                ? ((e = () => {
                    let { token: e, release: t } = m({
                      tag: s.C.TOKEN_BALANCE,
                      data: { mint: o, tokenProgram: n.z },
                    });
                    return (
                      (h.current = setInterval(() => {
                        g(e);
                      }, p)),
                      () => {
                        (h.current &&
                          (clearInterval(h.current), (h.current = null)),
                          t());
                      }
                    );
                  }),
                  (i = [m, g, p]),
                  (f[0] = m),
                  (f[1] = p),
                  (f[2] = g),
                  (f[3] = e),
                  (f[4] = i))
                : ((e = f[3]), (i = f[4])),
              (0, r.useEffect)(e, i)
            );
          })());
        let $ = w.userWsolAccountInfo?.accountInfo ?? null;
        return (
          i[0] !== $ ||
          i[1] !== x ||
          i[2] !== w.creatorFeeBalanceDisplay ||
          i[3] !== w.creatorFeeBalanceUsdcDisplay ||
          i[4] !== w.solBalance ||
          i[5] !== w.solBalanceLoaded
            ? ((e = {
                solBalance: w.solBalance,
                solBalanceLoaded: w.solBalanceLoaded,
                usdcBalance: x,
                userWsolAccountInfo: $,
                combinedSolBalanceDisplay: w.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: w.creatorFeeBalanceUsdcDisplay,
              }),
              (i[0] = $),
              (i[1] = x),
              (i[2] = w.creatorFeeBalanceDisplay),
              (i[3] = w.creatorFeeBalanceUsdcDisplay),
              (i[4] = w.solBalance),
              (i[5] = w.solBalanceLoaded),
              (i[6] = e))
            : (e = i[6]),
          e
        );
      },
    ],
    102824,
  );
};
