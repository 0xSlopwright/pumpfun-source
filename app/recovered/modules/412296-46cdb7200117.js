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
      o = Promise.resolve(e);
    return (
      o.catch(() => {}),
      Promise.race([
        o,
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
    o = a.getInitialState().startInterval,
    i = a.getInitialState().stopInterval,
    s = () => a.getState().blockhash;
  e.s(["z", 0, s, "V", 0, l, "J", 0, o, "X", 0, i], 446870);
  var c = e.i(564035);
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
      o = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: a };
          if (!(1e4 >= h(r))) throw Error("Blockhash refresh is stale");
          let o = u.get(e);
          if (
            o &&
            t.lastValidBlockHeight < o.value.lastValidBlockHeight &&
            3e4 >= h(o)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), l(t), t);
        })
        .finally(() => {
          f.get(e) === o && f.delete(e);
        });
    return (f.set(e, o), o);
  }
  function m(e) {
    let t = u.get(e);
    return t && 1e4 >= h(t)
      ? Promise.resolve(t.value)
      : d(e).catch((t) => {
          let r = u.get(e);
          if (r && 3e4 >= h(r)) return r.value;
          throw new c.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function p(e) {
    let t = s();
    return t || (e ? m(e) : null);
  }
  e.s(["w", 0, p, "R", 0, m, "f", 0, d], 443618);
  var v = e.i(110823);
  let g = new WeakSet(),
    y = new WeakMap(),
    b = new WeakMap();
  async function x({ connection: e, transaction: t }) {
    if (
      !g.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await m(e);
    return ((t.message.recentBlockhash = n.blockhash), y.set(t, n), t);
  }
  function w(e) {
    let t = y.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = w(e);
        n && n.blockhash === t.message.recentBlockhash && y.set(t, n);
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
          g.add(e),
          t && t.blockhash === e.message?.recentBlockhash && y.set(e, t),
          n && b.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
