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
    let l,
      i = Promise.resolve(e);
    return (
      i.catch(() => {}),
      Promise.race([
        i,
        new Promise((e, r) => {
          l = setTimeout(
            () => r(new t(`${a} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(l))
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
    l = a.getInitialState().setBlockhash,
    i = a.getInitialState().startInterval,
    o = a.getInitialState().stopInterval,
    s = () => a.getState().blockhash;
  e.s(["z", 0, s, "V", 0, l, "J", 0, i, "X", 0, o], 446870);
  var c = e.i(564035);
  let u = new WeakMap(),
    f = new WeakMap();
  function d(e) {
    let t = Date.now() - e.wallTime,
      n = performance.now() - e.monotonicTime;
    return t < 0 || n < 0 ? 1 / 0 : Math.max(t, n);
  }
  function h(e) {
    let t = f.get(e);
    if (t) return t;
    let n = Date.now(),
      a = performance.now(),
      i = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: a };
          if (!(1e4 >= d(r))) throw Error("Blockhash refresh is stale");
          let i = u.get(e);
          if (
            i &&
            t.lastValidBlockHeight < i.value.lastValidBlockHeight &&
            3e4 >= d(i)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), l(t), t);
        })
        .finally(() => {
          f.get(e) === i && f.delete(e);
        });
    return (f.set(e, i), i);
  }
  function p(e) {
    let t = u.get(e);
    return t && 1e4 >= d(t)
      ? Promise.resolve(t.value)
      : h(e).catch((t) => {
          let r = u.get(e);
          if (r && 3e4 >= d(r)) return r.value;
          throw new c.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function m(e) {
    let t = s();
    return t || (e ? p(e) : null);
  }
  e.s(["w", 0, m, "R", 0, p, "f", 0, h], 443618);
  var v = e.i(110823);
  let y = new WeakSet(),
    g = new WeakMap(),
    b = new WeakMap();
  async function x({ connection: e, transaction: t }) {
    if (
      !y.has(t) ||
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
        let r = b.get(e);
        r && b.set(t, r);
      },
      "Q",
      0,
      w,
      "P",
      0,
      function (e) {
        return b.get(e) ?? v.f;
      },
      "c",
      0,
      x,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          y.add(e),
          t && t.blockhash === e.message?.recentBlockhash && g.set(e, t),
          n && b.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
