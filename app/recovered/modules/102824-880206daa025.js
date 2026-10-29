// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(959719),
    n = e.i(352386),
    a = e.i(51954),
    l = e.i(227627),
    i = e.i(655397);
  let s = (0, i.p)();
  function o(e) {
    return e.acquire;
  }
  function c(e) {
    return e.touchLease;
  }
  function d(e) {
    return e.leaseGcConfig;
  }
  function u(e) {
    return e.tokenBalanceByMint[(0, i.p)().toBase58()] ?? null;
  }
  function f(e) {
    return e.acquire;
  }
  function h(e) {
    return e.touchLease;
  }
  function m(e) {
    return e.leaseGcConfig;
  }
  function b(e) {
    return e.user.solBalance;
  }
  function x(e) {
    return e.acquire;
  }
  function p(e) {
    return e.touchLease;
  }
  function y(e) {
    return e.leaseGcConfig;
  }
  function g(e) {
    return e.user.address;
  }
  let v = (0, i.p)().toBase58();
  function w(e) {
    return e.user;
  }
  function j(e) {
    return e.tokenBalanceByMint[v] ?? null;
  }
  e.s(
    [
      "f",
      0,
      () => {
        let e,
          i = (0, t.c)(7),
          v = (0, a.f)(w),
          _ = (0, a.f)(j);
        ((() => {
          let e,
            r,
            i = (0, t.c)(5),
            s = (0, a.f)(f),
            o = (0, a.f)(h),
            { heartbeatMs: c } = (0, a.f)(m),
            d = ((0, a.f)(b), (0, n.useRef)(null));
          return (
            i[0] !== s || i[1] !== c || i[2] !== o
              ? ((e = () => {
                  let { token: e, release: t } = s({
                    tag: l.C.SOL_BALANCE,
                    data: null,
                  });
                  return (
                    (d.current = setInterval(() => {
                      o(e);
                    }, c)),
                    () => {
                      (d.current &&
                        (clearInterval(d.current), (d.current = null)),
                        t());
                    }
                  );
                }),
                (r = [s, o, c]),
                (i[0] = s),
                (i[1] = c),
                (i[2] = o),
                (i[3] = e),
                (i[4] = r))
              : ((e = i[3]), (r = i[4])),
            (0, n.useEffect)(e, r)
          );
        })(),
          (() => {
            let e,
              r,
              i = (0, t.c)(6),
              s = (0, a.f)(x),
              o = (0, a.f)(p),
              { heartbeatMs: c } = (0, a.f)(y),
              d = (0, a.f)(g),
              u = (0, n.useRef)(null);
            (i[0] !== s || i[1] !== c || i[2] !== o || i[3] !== d
              ? ((e = () => {
                  if (!d) return;
                  let { token: e, release: t } = s({
                    tag: l.C.USER_ACCOUNTS,
                    data: { address: d },
                  });
                  return (
                    (u.current = setInterval(() => {
                      o(e);
                    }, c)),
                    () => {
                      (u.current &&
                        (clearInterval(u.current), (u.current = null)),
                        t());
                    }
                  );
                }),
                (r = [d, s, o, c]),
                (i[0] = s),
                (i[1] = c),
                (i[2] = o),
                (i[3] = d),
                (i[4] = e),
                (i[5] = r))
              : ((e = i[4]), (r = i[5])),
              (0, n.useEffect)(e, r));
          })(),
          (() => {
            let e,
              i,
              f = (0, t.c)(5),
              h = (0, a.f)(o),
              m = (0, a.f)(c),
              { heartbeatMs: b } = (0, a.f)(d),
              x = ((0, a.f)(u), (0, n.useRef)(null));
            return (
              f[0] !== h || f[1] !== b || f[2] !== m
                ? ((e = () => {
                    let { token: e, release: t } = h({
                      tag: l.C.TOKEN_BALANCE,
                      data: { mint: s, tokenProgram: r.z },
                    });
                    return (
                      (x.current = setInterval(() => {
                        m(e);
                      }, b)),
                      () => {
                        (x.current &&
                          (clearInterval(x.current), (x.current = null)),
                          t());
                      }
                    );
                  }),
                  (i = [h, m, b]),
                  (f[0] = h),
                  (f[1] = b),
                  (f[2] = m),
                  (f[3] = e),
                  (f[4] = i))
                : ((e = f[3]), (i = f[4])),
              (0, n.useEffect)(e, i)
            );
          })());
        let k = v.userWsolAccountInfo?.accountInfo ?? null;
        return (
          i[0] !== k ||
          i[1] !== _ ||
          i[2] !== v.creatorFeeBalanceDisplay ||
          i[3] !== v.creatorFeeBalanceUsdcDisplay ||
          i[4] !== v.solBalance ||
          i[5] !== v.solBalanceLoaded
            ? ((e = {
                solBalance: v.solBalance,
                solBalanceLoaded: v.solBalanceLoaded,
                usdcBalance: _,
                userWsolAccountInfo: k,
                combinedSolBalanceDisplay: v.creatorFeeBalanceDisplay,
                creatorFeeBalanceUsdcDisplay: v.creatorFeeBalanceUsdcDisplay,
              }),
              (i[0] = k),
              (i[1] = _),
              (i[2] = v.creatorFeeBalanceDisplay),
              (i[3] = v.creatorFeeBalanceUsdcDisplay),
              (i[4] = v.solBalance),
              (i[5] = v.solBalanceLoaded),
              (i[6] = e))
            : (e = i[6]),
          e
        );
      },
    ],
    102824,
  );
};
