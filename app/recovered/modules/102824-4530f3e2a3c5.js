// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    a = e.i(51954),
    l = e.i(227627),
    o = e.i(655397);
  let i = (0, o.p)();
  function s(e) {
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
  function h(e) {
    return e.acquire;
  }
  function d(e) {
    return e.touchLease;
  }
  function m(e) {
    return e.leaseGcConfig;
  }
  function p(e) {
    return e.user.solBalance;
  }
  function v(e) {
    return e.acquire;
  }
  function g(e) {
    return e.touchLease;
  }
  function y(e) {
    return e.leaseGcConfig;
  }
  function b(e) {
    return e.user.address;
  }
  let x = (0, o.p)().toBase58();
  function w(e) {
    return e.user;
  }
  function k(e) {
    return e.tokenBalanceByMint[x] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          o = (0, t.c)(7),
          x = (0, a.f)(w),
          B = (0, a.f)(k);
        ((() => {
          let e,
            n,
            o = (0, t.c)(5),
            i = (0, a.f)(h),
            s = (0, a.f)(d),
            { heartbeatMs: c } = (0, a.f)(m),
            u = ((0, a.f)(p), (0, r.useRef)(null));
          return (
            o[0] !== i || o[1] !== c || o[2] !== s
              ? ((e = () => {
                  let { token: e, release: t } = i({
                    tag: l.C.SOL_BALANCE,
                    data: null,
                  });
                  return (
                    (u.current = setInterval(() => {
                      s(e);
                    }, c)),
                    () => {
                      (u.current &&
                        (clearInterval(u.current), (u.current = null)),
                        t());
                    }
                  );
                }),
                (n = [i, s, c]),
                (o[0] = i),
                (o[1] = c),
                (o[2] = s),
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
              i = (0, a.f)(v),
              s = (0, a.f)(g),
              { heartbeatMs: c } = (0, a.f)(y),
              u = (0, a.f)(b),
              f = (0, r.useRef)(null);
            (o[0] !== i || o[1] !== c || o[2] !== s || o[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = i({
                    tag: l.C.USER_ACCOUNTS,
                    data: { address: u },
                  });
                  return (
                    (f.current = setInterval(() => {
                      s(e);
                    }, c)),
                    () => {
                      (f.current &&
                        (clearInterval(f.current), (f.current = null)),
                        t());
                    }
                  );
                }),
                (n = [u, i, s, c]),
                (o[0] = i),
                (o[1] = c),
                (o[2] = s),
                (o[3] = u),
                (o[4] = e),
                (o[5] = n))
              : ((e = o[4]), (n = o[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              o,
              h = (0, t.c)(5),
              d = (0, a.f)(s),
              m = (0, a.f)(c),
              { heartbeatMs: p } = (0, a.f)(u),
              v = ((0, a.f)(f), (0, r.useRef)(null));
            return (
              h[0] !== d || h[1] !== p || h[2] !== m
                ? ((e = () => {
                    let { token: e, release: t } = d({
                      tag: l.C.TOKEN_BALANCE,
                      data: { mint: i, tokenProgram: n.z },
                    });
                    return (
                      (v.current = setInterval(() => {
                        m(e);
                      }, p)),
                      () => {
                        (v.current &&
                          (clearInterval(v.current), (v.current = null)),
                          t());
                      }
                    );
                  }),
                  (o = [d, m, p]),
                  (h[0] = d),
                  (h[1] = p),
                  (h[2] = m),
                  (h[3] = e),
                  (h[4] = o))
                : ((e = h[3]), (o = h[4])),
              (0, r.useEffect)(e, o)
            );
          })());
        let _ = x.userWsolAccountInfo?.accountInfo ?? null;
        return (
          o[0] !== _ ||
          o[1] !== B ||
          o[2] !== x.creatorFeeBalanceDisplay ||
          o[3] !== x.creatorFeeBalanceUsdcDisplay ||
          o[4] !== x.solBalance ||
          o[5] !== x.solBalanceLoaded
            ? ((e = {
                solBalance: x.solBalance,
                solBalanceLoaded: x.solBalanceLoaded,
                usdcBalance: B,
                userWsolAccountInfo: _,
                combinedSolBalanceDisplay: x.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: x.creatorFeeBalanceUsdcDisplay,
              }),
              (o[0] = _),
              (o[1] = B),
              (o[2] = x.creatorFeeBalanceDisplay),
              (o[3] = x.creatorFeeBalanceUsdcDisplay),
              (o[4] = x.solBalance),
              (o[5] = x.solBalanceLoaded),
              (o[6] = e))
            : (e = o[6]),
          e
        );
      },
    ],
    102824,
  );
};
