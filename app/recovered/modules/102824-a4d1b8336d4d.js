// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    a = e.i(51954),
    l = e.i(227627),
    i = e.i(655397);
  let o = (0, i.p)();
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
    return e.tokenBalanceByMint[(0, i.p)().toBase58()] ?? null;
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
  function m(e) {
    return e.user.solBalance;
  }
  function v(e) {
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
  let x = (0, i.p)().toBase58();
  function w(e) {
    return e.user;
  }
  function B(e) {
    return e.tokenBalanceByMint[x] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          i = (0, t.c)(7),
          x = (0, a.f)(w),
          k = (0, a.f)(B);
        ((() => {
          let e,
            n,
            i = (0, t.c)(5),
            o = (0, a.f)(d),
            s = (0, a.f)(h),
            { heartbeatMs: c } = (0, a.f)(p),
            u = ((0, a.f)(m), (0, r.useRef)(null));
          return (
            i[0] !== o || i[1] !== c || i[2] !== s
              ? ((e = () => {
                  let { token: e, release: t } = o({
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
                (n = [o, s, c]),
                (i[0] = o),
                (i[1] = c),
                (i[2] = s),
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
              o = (0, a.f)(v),
              s = (0, a.f)(y),
              { heartbeatMs: c } = (0, a.f)(g),
              u = (0, a.f)(b),
              f = (0, r.useRef)(null);
            (i[0] !== o || i[1] !== c || i[2] !== s || i[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = o({
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
                (n = [u, o, s, c]),
                (i[0] = o),
                (i[1] = c),
                (i[2] = s),
                (i[3] = u),
                (i[4] = e),
                (i[5] = n))
              : ((e = i[4]), (n = i[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              i,
              d = (0, t.c)(5),
              h = (0, a.f)(s),
              p = (0, a.f)(c),
              { heartbeatMs: m } = (0, a.f)(u),
              v = ((0, a.f)(f), (0, r.useRef)(null));
            return (
              d[0] !== h || d[1] !== m || d[2] !== p
                ? ((e = () => {
                    let { token: e, release: t } = h({
                      tag: l.C.TOKEN_BALANCE,
                      data: { mint: o, tokenProgram: n.z },
                    });
                    return (
                      (v.current = setInterval(() => {
                        p(e);
                      }, m)),
                      () => {
                        (v.current &&
                          (clearInterval(v.current), (v.current = null)),
                          t());
                      }
                    );
                  }),
                  (i = [h, p, m]),
                  (d[0] = h),
                  (d[1] = m),
                  (d[2] = p),
                  (d[3] = e),
                  (d[4] = i))
                : ((e = d[3]), (i = d[4])),
              (0, r.useEffect)(e, i)
            );
          })());
        let C = x.userWsolAccountInfo?.accountInfo ?? null;
        return (
          i[0] !== C ||
          i[1] !== k ||
          i[2] !== x.creatorFeeBalanceDisplay ||
          i[3] !== x.creatorFeeBalanceUsdcDisplay ||
          i[4] !== x.solBalance ||
          i[5] !== x.solBalanceLoaded
            ? ((e = {
                solBalance: x.solBalance,
                solBalanceLoaded: x.solBalanceLoaded,
                usdcBalance: k,
                userWsolAccountInfo: C,
                combinedSolBalanceDisplay: x.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: x.creatorFeeBalanceUsdcDisplay,
              }),
              (i[0] = C),
              (i[1] = k),
              (i[2] = x.creatorFeeBalanceDisplay),
              (i[3] = x.creatorFeeBalanceUsdcDisplay),
              (i[4] = x.solBalance),
              (i[5] = x.solBalanceLoaded),
              (i[6] = e))
            : (e = i[6]),
          e
        );
      },
    ],
    102824,
  );
};
