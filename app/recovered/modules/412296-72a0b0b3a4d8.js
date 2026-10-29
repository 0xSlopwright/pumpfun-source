// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  class t extends Error {
    constructor(e) {
      (super(e), (this.name = "TimeoutError"));
    }
  }
  function n(e) {
    return e instanceof Error && "TimeoutError" === e.name;
  }
  function r({ promise: e, ms: n, label: a }) {
    let o,
      l = Promise.resolve(e);
    return (
      l.catch(() => {}),
      Promise.race([
        l,
        new Promise((e, r) => {
          o = setTimeout(
            () => r(new t(`${a} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(o))
    );
  }
  e.s(["d", 0, n, "k", 0, r], 762193);
  let a = (0, e.i(78436).$)((e, t) => ({
      blockhash: null,
      intervalId: null,
      startInterval: (n) => {
        let r = t().intervalId;
        (r && clearInterval(r), e({ intervalId: n }));
      },
      stopInterval: () => {
        let n = t().intervalId;
        (n && clearInterval(n), e({ intervalId: null }));
      },
      setBlockhash: (n) => {
        let r = t().blockhash?.lastValidBlockHeight ?? 0;
        n.lastValidBlockHeight > r && e({ blockhash: n });
      },
    })),
    o = a.getInitialState().setBlockhash,
    l = a.getInitialState().startInterval,
    i = a.getInitialState().stopInterval,
    c = () => a.getState().blockhash;
  e.s(["z", 0, c, "V", 0, o, "J", 0, l, "X", 0, i], 446870);
  var s = e.i(564035);
  let u = new WeakMap(),
    f = new WeakMap();
  function h(e) {
    let t = Date.now() - e.wallTime,
      n = performance.now() - e.monotonicTime;
    return t < 0 || n < 0 ? 1 / 0 : Math.max(t, n);
  }
  function d(e) {
    let t = f.get(e);
    if (t) return t;
    let n = Date.now(),
      a = performance.now(),
      l = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: a };
          if (!(1e4 >= h(r))) throw Error("Blockhash refresh is stale");
          let l = u.get(e);
          if (
            l &&
            t.lastValidBlockHeight < l.value.lastValidBlockHeight &&
            3e4 >= h(l)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), o(t), t);
        })
        .finally(() => {
          f.get(e) === l && f.delete(e);
        });
    return (f.set(e, l), l);
  }
  function p(e) {
    let t = u.get(e);
    return t && 1e4 >= h(t)
      ? Promise.resolve(t.value)
      : d(e).catch((t) => {
          let r = u.get(e);
          if (r && 3e4 >= h(r)) return r.value;
          throw new s.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function v(e) {
    let t = c();
    return t || (e ? p(e) : null);
  }
  e.s(["w", 0, v, "R", 0, p, "f", 0, d], 443618);
  var m = e.i(110823);
  let b = new WeakSet(),
    g = new WeakMap(),
    y = new WeakMap();
  async function B({ connection: e, transaction: t }) {
    if (
      !b.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await p(e);
    return ((t.message.recentBlockhash = n.blockhash), g.set(t, n), t);
  }
  function w(e) {
    let t = g.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = w(e);
        n && n.blockhash === t.message.recentBlockhash && g.set(t, n);
        let r = y.get(e);
        r && y.set(t, r);
      },
      "Q",
      0,
      w,
      "P",
      0,
      function (e) {
        return y.get(e) ?? m.f;
      },
      "c",
      0,
      B,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          b.add(e),
          t && t.blockhash === e.message?.recentBlockhash && g.set(e, t),
          n && y.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
