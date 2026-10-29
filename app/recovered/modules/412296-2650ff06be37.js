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
  function r({ promise: e, ms: n, label: s }) {
    let i,
      a = Promise.resolve(e);
    return (
      a.catch(() => {}),
      Promise.race([
        a,
        new Promise((e, r) => {
          i = setTimeout(
            () => r(new t(`${s} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(i))
    );
  }
  e.s(["d", 0, n, "k", 0, r], 762193);
  let s = (0, e.i(78436).$)((e, t) => ({
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
    i = s.getInitialState().setBlockhash,
    a = s.getInitialState().startInterval,
    o = s.getInitialState().stopInterval,
    l = () => s.getState().blockhash;
  e.s(["z", 0, l, "V", 0, i, "J", 0, a, "X", 0, o], 446870);
  var u = e.i(564035);
  let c = new WeakMap(),
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
      s = performance.now(),
      a = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: s };
          if (!(1e4 >= f(r))) throw Error("Blockhash refresh is stale");
          let a = c.get(e);
          if (
            a &&
            t.lastValidBlockHeight < a.value.lastValidBlockHeight &&
            3e4 >= f(a)
          )
            throw Error("Blockhash refresh returned an older block");
          return (c.set(e, r), i(t), t);
        })
        .finally(() => {
          d.get(e) === a && d.delete(e);
        });
    return (d.set(e, a), a);
  }
  function h(e) {
    let t = c.get(e);
    return t && 1e4 >= f(t)
      ? Promise.resolve(t.value)
      : m(e).catch((t) => {
          let r = c.get(e);
          if (r && 3e4 >= f(r)) return r.value;
          throw new u.U(n(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function g(e) {
    let t = l();
    return t || (e ? h(e) : null);
  }
  e.s(["w", 0, g, "R", 0, h, "f", 0, m], 443618);
  var p = e.i(110823);
  let _ = new WeakSet(),
    b = new WeakMap(),
    y = new WeakMap();
  async function v({ connection: e, transaction: t }) {
    if (
      !_.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await h(e);
    return ((t.message.recentBlockhash = n.blockhash), b.set(t, n), t);
  }
  function w(e) {
    let t = b.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = w(e);
        n && n.blockhash === t.message.recentBlockhash && b.set(t, n);
        let r = y.get(e);
        r && y.set(t, r);
      },
      "Q",
      0,
      w,
      "P",
      0,
      function (e) {
        return y.get(e) ?? p.f;
      },
      "c",
      0,
      v,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          _.add(e),
          t && t.blockhash === e.message?.recentBlockhash && b.set(e, t),
          n && y.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
