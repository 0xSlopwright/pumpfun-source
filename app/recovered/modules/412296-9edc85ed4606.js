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
  function r({ promise: e, ms: n, label: o }) {
    let l,
      i = Promise.resolve(e);
    return (
      i.catch(() => {}),
      Promise.race([
        i,
        new Promise((e, r) => {
          l = setTimeout(
            () => r(new t(`${o} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(l))
    );
  }
  e.s(["d", 0, n, "k", 0, r], 762193);
  let o = (0, e.i(78436).$)((e, t) => ({
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
    l = o.getInitialState().setBlockhash,
    i = o.getInitialState().startInterval,
    a = o.getInitialState().stopInterval,
    s = () => o.getState().blockhash;
  e.s(["z", 0, s, "V", 0, l, "J", 0, i, "X", 0, a], 446870);
  var c = e.i(564035);
  let u = new WeakMap(),
    d = new WeakMap();
  function f(e) {
    let t = Date.now() - e.wallTime,
      n = performance.now() - e.monotonicTime;
    return t < 0 || n < 0 ? 1 / 0 : Math.max(t, n);
  }
  function h(e) {
    let t = d.get(e);
    if (t) return t;
    let n = Date.now(),
      o = performance.now(),
      i = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: o };
          if (!(1e4 >= f(r))) throw Error("Blockhash refresh is stale");
          let i = u.get(e);
          if (
            i &&
            t.lastValidBlockHeight < i.value.lastValidBlockHeight &&
            3e4 >= f(i)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), l(t), t);
        })
        .finally(() => {
          d.get(e) === i && d.delete(e);
        });
    return (d.set(e, i), i);
  }
  function g(e) {
    let t = u.get(e);
    return t && 1e4 >= f(t)
      ? Promise.resolve(t.value)
      : h(e).catch((t) => {
          let r = u.get(e);
          if (r && 3e4 >= f(r)) return r.value;
          throw new c.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function p(e) {
    let t = s();
    return t || (e ? g(e) : null);
  }
  e.s(["w", 0, p, "R", 0, g, "f", 0, h], 443618);
  var m = e.i(110823);
  let v = new WeakSet(),
    _ = new WeakMap(),
    y = new WeakMap();
  async function w({ connection: e, transaction: t }) {
    if (
      !v.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await g(e);
    return ((t.message.recentBlockhash = n.blockhash), _.set(t, n), t);
  }
  function b(e) {
    let t = _.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = b(e);
        n && n.blockhash === t.message.recentBlockhash && _.set(t, n);
        let r = y.get(e);
        r && y.set(t, r);
      },
      "Q",
      0,
      b,
      "P",
      0,
      function (e) {
        return y.get(e) ?? m.f;
      },
      "c",
      0,
      w,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          v.add(e),
          t && t.blockhash === e.message?.recentBlockhash && _.set(e, t),
          n && y.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
