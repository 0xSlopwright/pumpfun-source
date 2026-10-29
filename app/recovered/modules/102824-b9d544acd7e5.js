// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    o = e.i(51954),
    i = e.i(227627),
    a = e.i(655397);
  let s = (0, a.p)();
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
    return e.tokenBalanceByMint[(0, a.p)().toBase58()] ?? null;
  }
  function d(e) {
    return e.acquire;
  }
  function h(e) {
    return e.touchLease;
  }
  function p(e) {
    return e.leaseGcConfig;
  }
  function v(e) {
    return e.user.solBalance;
  }
  function m(e) {
    return e.acquire;
  }
  function y(e) {
    return e.touchLease;
  }
  function g(e) {
    return e.leaseGcConfig;
  }
  function b(e) {
    return e.user.address;
  }
  let w = (0, a.p)().toBase58();
  function _(e) {
    return e.user;
  }
  function x(e) {
    return e.tokenBalanceByMint[w] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          a = (0, t.c)(7),
          w = (0, o.f)(_),
          L = (0, o.f)(x);
        ((() => {
          let e,
            n,
            a = (0, t.c)(5),
            s = (0, o.f)(d),
            l = (0, o.f)(h),
            { heartbeatMs: c } = (0, o.f)(p),
            u = ((0, o.f)(v), (0, r.useRef)(null));
          return (
            a[0] !== s || a[1] !== c || a[2] !== l
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
                (a[0] = s),
                (a[1] = c),
                (a[2] = l),
                (a[3] = e),
                (a[4] = n))
              : ((e = a[3]), (n = a[4])),
            (0, r.useEffect)(e, n)
          );
        })(),
          (() => {
            let e,
              n,
              a = (0, t.c)(6),
              s = (0, o.f)(m),
              l = (0, o.f)(y),
              { heartbeatMs: c } = (0, o.f)(g),
              u = (0, o.f)(b),
              f = (0, r.useRef)(null);
            (a[0] !== s || a[1] !== c || a[2] !== l || a[3] !== u
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
                (a[0] = s),
                (a[1] = c),
                (a[2] = l),
                (a[3] = u),
                (a[4] = e),
                (a[5] = n))
              : ((e = a[4]), (n = a[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              a,
              d = (0, t.c)(5),
              h = (0, o.f)(l),
              p = (0, o.f)(c),
              { heartbeatMs: v } = (0, o.f)(u),
              m = ((0, o.f)(f), (0, r.useRef)(null));
            return (
              d[0] !== h || d[1] !== v || d[2] !== p
                ? ((e = () => {
                    let { token: e, release: t } = h({
                      tag: i.C.TOKEN_BALANCE,
                      data: { mint: s, tokenProgram: n.z },
                    });
                    return (
                      (m.current = setInterval(() => {
                        p(e);
                      }, v)),
                      () => {
                        (m.current &&
                          (clearInterval(m.current), (m.current = null)),
                          t());
                      }
                    );
                  }),
                  (a = [h, p, v]),
                  (d[0] = h),
                  (d[1] = v),
                  (d[2] = p),
                  (d[3] = e),
                  (d[4] = a))
                : ((e = d[3]), (a = d[4])),
              (0, r.useEffect)(e, a)
            );
          })());
        let B = w.userWsolAccountInfo?.accountInfo ?? null;
        return (
          a[0] !== B ||
          a[1] !== L ||
          a[2] !== w.creatorFeeBalanceDisplay ||
          a[3] !== w.creatorFeeBalanceUsdcDisplay ||
          a[4] !== w.solBalance ||
          a[5] !== w.solBalanceLoaded
            ? ((e = {
                solBalance: w.solBalance,
                solBalanceLoaded: w.solBalanceLoaded,
                usdcBalance: L,
                userWsolAccountInfo: B,
                combinedSolBalanceDisplay: w.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: w.creatorFeeBalanceUsdcDisplay,
              }),
              (a[0] = B),
              (a[1] = L),
              (a[2] = w.creatorFeeBalanceDisplay),
              (a[3] = w.creatorFeeBalanceUsdcDisplay),
              (a[4] = w.solBalance),
              (a[5] = w.solBalanceLoaded),
              (a[6] = e))
            : (e = a[6]),
          e
        );
      },
    ],
    102824,
  );
};
