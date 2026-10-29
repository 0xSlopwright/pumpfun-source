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
  function u(e) {
    return e.touchLease;
  }
  function c(e) {
    return e.leaseGcConfig;
  }
  function f(e) {
    return e.tokenBalanceByMint[(0, s.p)().toBase58()] ?? null;
  }
  function h(e) {
    return e.acquire;
  }
  function p(e) {
    return e.touchLease;
  }
  function d(e) {
    return e.leaseGcConfig;
  }
  function v(e) {
    return e.user.solBalance;
  }
  function y(e) {
    return e.acquire;
  }
  function m(e) {
    return e.touchLease;
  }
  function g(e) {
    return e.leaseGcConfig;
  }
  function b(e) {
    return e.user.address;
  }
  let w = (0, s.p)().toBase58();
  function _(e) {
    return e.user;
  }
  function L(e) {
    return e.tokenBalanceByMint[w] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          s = (0, t.c)(7),
          w = (0, o.f)(_),
          B = (0, o.f)(L);
        ((() => {
          let e,
            n,
            s = (0, t.c)(5),
            a = (0, o.f)(h),
            l = (0, o.f)(p),
            { heartbeatMs: u } = (0, o.f)(d),
            c = ((0, o.f)(v), (0, r.useRef)(null));
          return (
            s[0] !== a || s[1] !== u || s[2] !== l
              ? ((e = () => {
                  let { token: e, release: t } = a({
                    tag: i.C.SOL_BALANCE,
                    data: null,
                  });
                  return (
                    (c.current = setInterval(() => {
                      l(e);
                    }, u)),
                    () => {
                      (c.current &&
                        (clearInterval(c.current), (c.current = null)),
                        t());
                    }
                  );
                }),
                (n = [a, l, u]),
                (s[0] = a),
                (s[1] = u),
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
              a = (0, o.f)(y),
              l = (0, o.f)(m),
              { heartbeatMs: u } = (0, o.f)(g),
              c = (0, o.f)(b),
              f = (0, r.useRef)(null);
            (s[0] !== a || s[1] !== u || s[2] !== l || s[3] !== c
              ? ((e = () => {
                  if (!c) return;
                  let { token: e, release: t } = a({
                    tag: i.C.USER_ACCOUNTS,
                    data: { address: c },
                  });
                  return (
                    (f.current = setInterval(() => {
                      l(e);
                    }, u)),
                    () => {
                      (f.current &&
                        (clearInterval(f.current), (f.current = null)),
                        t());
                    }
                  );
                }),
                (n = [c, a, l, u]),
                (s[0] = a),
                (s[1] = u),
                (s[2] = l),
                (s[3] = c),
                (s[4] = e),
                (s[5] = n))
              : ((e = s[4]), (n = s[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              s,
              h = (0, t.c)(5),
              p = (0, o.f)(l),
              d = (0, o.f)(u),
              { heartbeatMs: v } = (0, o.f)(c),
              y = ((0, o.f)(f), (0, r.useRef)(null));
            return (
              h[0] !== p || h[1] !== v || h[2] !== d
                ? ((e = () => {
                    let { token: e, release: t } = p({
                      tag: i.C.TOKEN_BALANCE,
                      data: { mint: a, tokenProgram: n.z },
                    });
                    return (
                      (y.current = setInterval(() => {
                        d(e);
                      }, v)),
                      () => {
                        (y.current &&
                          (clearInterval(y.current), (y.current = null)),
                          t());
                      }
                    );
                  }),
                  (s = [p, d, v]),
                  (h[0] = p),
                  (h[1] = v),
                  (h[2] = d),
                  (h[3] = e),
                  (h[4] = s))
                : ((e = h[3]), (s = h[4])),
              (0, r.useEffect)(e, s)
            );
          })());
        let k = w.userWsolAccountInfo?.accountInfo ?? null;
        return (
          s[0] !== k ||
          s[1] !== B ||
          s[2] !== w.creatorFeeBalanceDisplay ||
          s[3] !== w.creatorFeeBalanceUsdcDisplay ||
          s[4] !== w.solBalance ||
          s[5] !== w.solBalanceLoaded
            ? ((e = {
                solBalance: w.solBalance,
                solBalanceLoaded: w.solBalanceLoaded,
                usdcBalance: B,
                userWsolAccountInfo: k,
                combinedSolBalanceDisplay: w.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: w.creatorFeeBalanceUsdcDisplay,
              }),
              (s[0] = k),
              (s[1] = B),
              (s[2] = w.creatorFeeBalanceDisplay),
              (s[3] = w.creatorFeeBalanceUsdcDisplay),
              (s[4] = w.solBalance),
              (s[5] = w.solBalanceLoaded),
              (s[6] = e))
            : (e = s[6]),
          e
        );
      },
    ],
    102824,
  );
};
