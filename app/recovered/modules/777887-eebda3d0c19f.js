// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(412296);
  let n = Promise.resolve();
  function r(e) {
    let t = n.then(e, e);
    return (
      (n = t.then(
        () => void 0,
        () => void 0,
      )),
      t
    );
  }
  let a = [],
    s = null;
  async function i(e) {
    await r(async () => {
      let n;
      try {
        let r = e[0].signAllTransactions;
        if (e.length > 1 && r) {
          let a = await Promise.all(
            e.map(async (e) =>
              e.prepareTransaction
                ? e.prepareTransaction(e.transaction)
                : e.transaction,
            ),
          );
          for (let t of e) t.onSigningStarted?.();
          (n = await r(a)).forEach((e, n) => (0, t.s)({ from: a[n], to: e }));
        } else
          for (let r of ((n = []), e)) {
            let e = r.prepareTransaction
              ? await r.prepareTransaction(r.transaction)
              : r.transaction;
            r.onSigningStarted?.();
            let a = await r.signTransaction(e);
            ((0, t.s)({ from: e, to: a }), n.push(a));
          }
      } catch (t) {
        for (let n of e) n.reject(t);
        return;
      }
      await Promise.all(
        e.map((e, t) => {
          let r = n[t];
          return r
            ? e
                .sendSignedTransaction({
                  signedTx: r,
                  frontRunningProtection: e.frontRunningProtection,
                })
                .then(e.resolve, e.reject)
            : (e.reject(Error("Missing signed transaction in batch")),
              Promise.resolve());
        }),
      );
    });
  }
  async function o() {
    s = null;
    let e = a;
    if (((a = []), 0 === e.length)) return;
    let t = new Map();
    for (let n of e) {
      let e = t.get(n.walletKey);
      e ? e.push(n) : t.set(n.walletKey, [n]);
    }
    for (let e of t.values()) await i(e);
  }
  let l = [],
    c = null;
  async function u(e) {
    await r(async () => {
      let t,
        n = e.flatMap((e) => e.transactions);
      try {
        let r = e[0].signAllTransactions;
        if (n.length > 1 && r) {
          for (let t of e) t.onSigningStarted?.();
          t = await r(n);
        } else
          for (let n of ((t = []), e))
            for (let e of (n.onSigningStarted?.(), n.transactions))
              t.push(await n.signTransaction(e));
      } catch (t) {
        for (let n of e) n.reject(t);
        return;
      }
      let r = 0;
      for (let n of e) {
        let e = t.slice(r, r + n.transactions.length);
        ((r += n.transactions.length),
          e.length === n.transactions.length
            ? n.resolve(e)
            : n.reject(Error("Missing signed transaction in batch")));
      }
    });
  }
  async function d() {
    c = null;
    let e = l;
    for (let t of ((l = []),
    ((e) => {
      let t = new Map();
      for (let n of e) {
        let e = t.get(n.walletKey);
        e ? e.push(n) : t.set(n.walletKey, [n]);
      }
      return Array.from(t.values());
    })(e)))
      await u(t);
  }
  e.s([
    "d",
    0,
    function (e) {
      return new Promise((t, n) => {
        (l.push({ ...e, resolve: t, reject: n }),
          null === c &&
            (c = setTimeout(() => {
              d();
            }, 150)));
      });
    },
    "B",
    0,
    function (e) {
      return new Promise((t, n) => {
        (a.push({ ...e, resolve: t, reject: n }),
          null === s &&
            (s = setTimeout(() => {
              o();
            }, 150)));
      });
    },
    "_",
    0,
    r,
  ]);
};
