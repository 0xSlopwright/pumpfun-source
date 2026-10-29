// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    o = e.i(51954),
    i = e.i(227627),
    s = e.i(655397);
  let a = (0, s.p)();
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
    return e.tokenBalanceByMint[(0, s.p)().toBase58()] ?? null;
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
  let _ = (0, s.p)().toBase58();
  function w(e) {
    return e.user;
  }
  function L(e) {
    return e.tokenBalanceByMint[_] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          s = (0, t.c)(7),
          _ = (0, o.f)(w),
          k = (0, o.f)(L);
        ((() => {
          let e,
            n,
            s = (0, t.c)(5),
            a = (0, o.f)(d),
            l = (0, o.f)(h),
            { heartbeatMs: c } = (0, o.f)(p),
            u = ((0, o.f)(v), (0, r.useRef)(null));
          return (
            s[0] !== a || s[1] !== c || s[2] !== l
              ? ((e = () => {
                  let { token: e, release: t } = a({
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
                (n = [a, l, c]),
                (s[0] = a),
                (s[1] = c),
                (s[2] = l),
                (s[3] = e),
                (s[4] = n))
              : ((e = s[3]), (n = s[4])),
            (0, r.useEffect)(e, n)
          );
        })(),
          (() => {
            let e,
              n,
              s = (0, t.c)(6),
              a = (0, o.f)(m),
              l = (0, o.f)(y),
              { heartbeatMs: c } = (0, o.f)(g),
              u = (0, o.f)(b),
              f = (0, r.useRef)(null);
            (s[0] !== a || s[1] !== c || s[2] !== l || s[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = a({
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
                (n = [u, a, l, c]),
                (s[0] = a),
                (s[1] = c),
                (s[2] = l),
                (s[3] = u),
                (s[4] = e),
                (s[5] = n))
              : ((e = s[4]), (n = s[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              s,
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
                      data: { mint: a, tokenProgram: n.z },
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
                  (s = [h, p, v]),
                  (d[0] = h),
                  (d[1] = v),
                  (d[2] = p),
                  (d[3] = e),
                  (d[4] = s))
                : ((e = d[3]), (s = d[4])),
              (0, r.useEffect)(e, s)
            );
          })());
        let x = _.userWsolAccountInfo?.accountInfo ?? null;
        return (
          s[0] !== x ||
          s[1] !== k ||
          s[2] !== _.creatorFeeBalanceDisplay ||
          s[3] !== _.creatorFeeBalanceUsdcDisplay ||
          s[4] !== _.solBalance ||
          s[5] !== _.solBalanceLoaded
            ? ((e = {
                solBalance: _.solBalance,
                solBalanceLoaded: _.solBalanceLoaded,
                usdcBalance: k,
                userWsolAccountInfo: x,
                combinedSolBalanceDisplay: _.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: _.creatorFeeBalanceUsdcDisplay,
              }),
              (s[0] = x),
              (s[1] = k),
              (s[2] = _.creatorFeeBalanceDisplay),
              (s[3] = _.creatorFeeBalanceUsdcDisplay),
              (s[4] = _.solBalance),
              (s[5] = _.solBalanceLoaded),
              (s[6] = e))
            : (e = s[6]),
          e
        );
      },
    ],
    102824,
  );
};
