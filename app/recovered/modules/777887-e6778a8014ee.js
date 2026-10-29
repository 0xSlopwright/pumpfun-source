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
  let s = [],
    i = null;
  async function a(e) {
    await r(async () => {
      let n;
      try {
        let r = e[0].signAllTransactions;
        if (e.length > 1 && r) {
          let s = await Promise.all(
            e.map(async (e) =>
              e.prepareTransaction
                ? e.prepareTransaction(e.transaction)
                : e.transaction,
            ),
          );
          for (let t of e) t.onSigningStarted?.();
          (n = await r(s)).forEach((e, n) => (0, t.s)({ from: s[n], to: e }));
        } else
          for (let r of ((n = []), e)) {
            let e = r.prepareTransaction
              ? await r.prepareTransaction(r.transaction)
              : r.transaction;
            r.onSigningStarted?.();
            let s = await r.signTransaction(e);
            ((0, t.s)({ from: e, to: s }), n.push(s));
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
    i = null;
    let e = s;
    if (((s = []), 0 === e.length)) return;
    let t = new Map();
    for (let n of e) {
      let e = t.get(n.walletKey);
      e ? e.push(n) : t.set(n.walletKey, [n]);
    }
    for (let e of t.values()) await a(e);
  }
  let l = [],
    u = null;
  async function c(e) {
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
    u = null;
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
      await c(t);
  }
  e.s([
    "d",
    0,
    function (e) {
      return new Promise((t, n) => {
        (l.push({ ...e, resolve: t, reject: n }),
          null === u &&
            (u = setTimeout(() => {
              d();
            }, 150)));
      });
    },
    "B",
    0,
    function (e) {
      return new Promise((t, n) => {
        (s.push({ ...e, resolve: t, reject: n }),
          null === i &&
            (i = setTimeout(() => {
              o();
            }, 150)));
      });
    },
    "_",
    0,
    r,
  ]);
};
