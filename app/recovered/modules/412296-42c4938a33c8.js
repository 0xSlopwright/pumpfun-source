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
    let s,
      i = Promise.resolve(e);
    return (
      i.catch(() => {}),
      Promise.race([
        i,
        new Promise((e, r) => {
          s = setTimeout(
            () => r(new t(`${a} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(s))
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
    s = a.getInitialState().setBlockhash,
    i = a.getInitialState().startInterval,
    o = a.getInitialState().stopInterval,
    l = () => a.getState().blockhash;
  e.s(["z", 0, l, "V", 0, s, "J", 0, i, "X", 0, o], 446870);
  var c = e.i(564035);
  let u = new WeakMap(),
    d = new WeakMap();
  function f(e) {
    let t = Date.now() - e.wallTime,
      n = performance.now() - e.monotonicTime;
    return t < 0 || n < 0 ? 1 / 0 : Math.max(t, n);
  }
  function m(e) {
    let t = d.get(e);
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
          if (!(1e4 >= f(r))) throw Error("Blockhash refresh is stale");
          let i = u.get(e);
          if (
            i &&
            t.lastValidBlockHeight < i.value.lastValidBlockHeight &&
            3e4 >= f(i)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), s(t), t);
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
      : m(e).catch((t) => {
          let r = u.get(e);
          if (r && 3e4 >= f(r)) return r.value;
          throw new c.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function p(e) {
    let t = l();
    return t || (e ? g(e) : null);
  }
  e.s(["w", 0, p, "R", 0, g, "f", 0, m], 443618);
  var h = e.i(110823);
  let b = new WeakSet(),
    _ = new WeakMap(),
    y = new WeakMap();
  async function w({ connection: e, transaction: t }) {
    if (
      !b.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await g(e);
    return ((t.message.recentBlockhash = n.blockhash), _.set(t, n), t);
  }
  function v(e) {
    let t = _.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = v(e);
        n && n.blockhash === t.message.recentBlockhash && _.set(t, n);
        let r = y.get(e);
        r && y.set(t, r);
      },
      "Q",
      0,
      v,
      "P",
      0,
      function (e) {
        return y.get(e) ?? h.f;
      },
      "c",
      0,
      w,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          b.add(e),
          t && t.blockhash === e.message?.recentBlockhash && _.set(e, t),
          n && y.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
