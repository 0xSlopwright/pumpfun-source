// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    a = e.i(51954),
    i = e.i(227627),
    o = e.i(655397);
  let s = (0, o.p)();
  function l(e) {
    return e.acquire;
  }
  function c(e) {
    return e.touchLease;
  }
  function u(e) {
    return e.leaseGcConfig;
  }
  function f(e) {
    return e.tokenBalanceByMint[(0, o.p)().toBase58()] ?? null;
  }
  function d(e) {
    return e.acquire;
  }
  function h(e) {
    return e.touchLease;
  }
  function g(e) {
    return e.leaseGcConfig;
  }
  function m(e) {
    return e.user.solBalance;
  }
  function p(e) {
    return e.acquire;
  }
  function v(e) {
    return e.touchLease;
  }
  function y(e) {
    return e.leaseGcConfig;
  }
  function b(e) {
    return e.user.address;
  }
  let w = (0, o.p)().toBase58();
  function _(e) {
    return e.user;
  }
  function B(e) {
    return e.tokenBalanceByMint[w] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          o = (0, t.c)(7),
          w = (0, a.f)(_),
          k = (0, a.f)(B);
        ((() => {
          let e,
            n,
            o = (0, t.c)(5),
            s = (0, a.f)(d),
            l = (0, a.f)(h),
            { heartbeatMs: c } = (0, a.f)(g),
            u = ((0, a.f)(m), (0, r.useRef)(null));
          return (
            o[0] !== s || o[1] !== c || o[2] !== l
              ? ((e = () => {
                  let { token: e, release: t } = s({
                    tag: i.C.SOL_BALANCE,
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
                (n = [s, l, c]),
                (o[0] = s),
                (o[1] = c),
                (o[2] = l),
                (o[3] = e),
                (o[4] = n))
              : ((e = o[3]), (n = o[4])),
            (0, r.useEffect)(e, n)
          );
        })(),
          (() => {
            let e,
              n,
              o = (0, t.c)(6),
              s = (0, a.f)(p),
              l = (0, a.f)(v),
              { heartbeatMs: c } = (0, a.f)(y),
              u = (0, a.f)(b),
              f = (0, r.useRef)(null);
            (o[0] !== s || o[1] !== c || o[2] !== l || o[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = s({
                    tag: i.C.USER_ACCOUNTS,
                    data: { address: u },
                  });
                  return (
                    (f.current = setInterval(() => {
                      l(e);
                    }, c)),
                    () => {
                      (f.current &&
                        (clearInterval(f.current), (f.current = null)),
                        t());
                    }
                  );
                }),
                (n = [u, s, l, c]),
                (o[0] = s),
                (o[1] = c),
                (o[2] = l),
                (o[3] = u),
                (o[4] = e),
                (o[5] = n))
              : ((e = o[4]), (n = o[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              o,
              d = (0, t.c)(5),
              h = (0, a.f)(l),
              g = (0, a.f)(c),
              { heartbeatMs: m } = (0, a.f)(u),
              p = ((0, a.f)(f), (0, r.useRef)(null));
            return (
              d[0] !== h || d[1] !== m || d[2] !== g
                ? ((e = () => {
                    let { token: e, release: t } = h({
                      tag: i.C.TOKEN_BALANCE,
                      data: { mint: s, tokenProgram: n.z },
                    });
                    return (
                      (p.current = setInterval(() => {
                        g(e);
                      }, m)),
                      () => {
                        (p.current &&
                          (clearInterval(p.current), (p.current = null)),
                          t());
                      }
                    );
                  }),
                  (o = [h, g, m]),
                  (d[0] = h),
                  (d[1] = m),
                  (d[2] = g),
                  (d[3] = e),
                  (d[4] = o))
                : ((e = d[3]), (o = d[4])),
              (0, r.useEffect)(e, o)
            );
          })());
        let S = w.userWsolAccountInfo?.accountInfo ?? null;
        return (
          o[0] !== S ||
          o[1] !== k ||
          o[2] !== w.creatorFeeBalanceDisplay ||
          o[3] !== w.creatorFeeBalanceUsdcDisplay ||
          o[4] !== w.solBalance ||
          o[5] !== w.solBalanceLoaded
            ? ((e = {
                solBalance: w.solBalance,
                solBalanceLoaded: w.solBalanceLoaded,
                usdcBalance: k,
                userWsolAccountInfo: S,
                combinedSolBalanceDisplay: w.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: w.creatorFeeBalanceUsdcDisplay,
              }),
              (o[0] = S),
              (o[1] = k),
              (o[2] = w.creatorFeeBalanceDisplay),
              (o[3] = w.creatorFeeBalanceUsdcDisplay),
              (o[4] = w.solBalance),
              (o[5] = w.solBalanceLoaded),
              (o[6] = e))
            : (e = o[6]),
          e
        );
      },
    ],
    102824,
  );
};
