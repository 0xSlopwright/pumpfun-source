// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(959719),
    r = e.i(352386),
    a = e.i(51954),
    o = e.i(227627),
    l = e.i(655397);
  let i = (0, l.p)();
  function c(e) {
    return e.acquire;
  }
  function s(e) {
    return e.touchLease;
  }
  function u(e) {
    return e.leaseGcConfig;
  }
  function f(e) {
    return e.tokenBalanceByMint[(0, l.p)().toBase58()] ?? null;
  }
  function h(e) {
    return e.acquire;
  }
  function d(e) {
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
  function b(e) {
    return e.touchLease;
  }
  function g(e) {
    return e.leaseGcConfig;
  }
  function y(e) {
    return e.user.address;
  }
  let B = (0, l.p)().toBase58();
  function w(e) {
    return e.user;
  }
  function k(e) {
    return e.tokenBalanceByMint[B] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          l = (0, t.c)(7),
          B = (0, a.f)(w),
          _ = (0, a.f)(k);
        ((() => {
          let e,
            n,
            l = (0, t.c)(5),
            i = (0, a.f)(h),
            c = (0, a.f)(d),
            { heartbeatMs: s } = (0, a.f)(p),
            u = ((0, a.f)(v), (0, r.useRef)(null));
          return (
            l[0] !== i || l[1] !== s || l[2] !== c
              ? ((e = () => {
                  let { token: e, release: t } = i({
                    tag: o.C.SOL_BALANCE,
                    data: null,
                  });
                  return (
                    (u.current = setInterval(() => {
                      c(e);
                    }, s)),
                    () => {
                      (u.current &&
                        (clearInterval(u.current), (u.current = null)),
                        t());
                    }
                  );
                }),
                (n = [i, c, s]),
                (l[0] = i),
                (l[1] = s),
                (l[2] = c),
                (l[3] = e),
                (l[4] = n))
              : ((e = l[3]), (n = l[4])),
            (0, r.useEffect)(e, n)
          );
        })(),
          (() => {
            let e,
              n,
              l = (0, t.c)(6),
              i = (0, a.f)(m),
              c = (0, a.f)(b),
              { heartbeatMs: s } = (0, a.f)(g),
              u = (0, a.f)(y),
              f = (0, r.useRef)(null);
            (l[0] !== i || l[1] !== s || l[2] !== c || l[3] !== u
              ? ((e = () => {
                  if (!u) return;
                  let { token: e, release: t } = i({
                    tag: o.C.USER_ACCOUNTS,
                    data: { address: u },
                  });
                  return (
                    (f.current = setInterval(() => {
                      c(e);
                    }, s)),
                    () => {
                      (f.current &&
                        (clearInterval(f.current), (f.current = null)),
                        t());
                    }
                  );
                }),
                (n = [u, i, c, s]),
                (l[0] = i),
                (l[1] = s),
                (l[2] = c),
                (l[3] = u),
                (l[4] = e),
                (l[5] = n))
              : ((e = l[4]), (n = l[5])),
              (0, r.useEffect)(e, n));
          })(),
          (() => {
            let e,
              l,
              h = (0, t.c)(5),
              d = (0, a.f)(c),
              p = (0, a.f)(s),
              { heartbeatMs: v } = (0, a.f)(u),
              m = ((0, a.f)(f), (0, r.useRef)(null));
            return (
              h[0] !== d || h[1] !== v || h[2] !== p
                ? ((e = () => {
                    let { token: e, release: t } = d({
                      tag: o.C.TOKEN_BALANCE,
                      data: { mint: i, tokenProgram: n.z },
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
                  (l = [d, p, v]),
                  (h[0] = d),
                  (h[1] = v),
                  (h[2] = p),
                  (h[3] = e),
                  (h[4] = l))
                : ((e = h[3]), (l = h[4])),
              (0, r.useEffect)(e, l)
            );
          })());
        let x = B.userWsolAccountInfo?.accountInfo ?? null;
        return (
          l[0] !== x ||
          l[1] !== _ ||
          l[2] !== B.creatorFeeBalanceDisplay ||
          l[3] !== B.creatorFeeBalanceUsdcDisplay ||
          l[4] !== B.solBalance ||
          l[5] !== B.solBalanceLoaded
            ? ((e = {
                solBalance: B.solBalance,
                solBalanceLoaded: B.solBalanceLoaded,
                usdcBalance: _,
                userWsolAccountInfo: x,
                combinedSolBalanceDisplay: B.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: B.creatorFeeBalanceUsdcDisplay,
              }),
              (l[0] = x),
              (l[1] = _),
              (l[2] = B.creatorFeeBalanceDisplay),
              (l[3] = B.creatorFeeBalanceUsdcDisplay),
              (l[4] = B.solBalance),
              (l[5] = B.solBalanceLoaded),
              (l[6] = e))
            : (e = l[6]),
          e
        );
      },
    ],
    102824,
  );
};
