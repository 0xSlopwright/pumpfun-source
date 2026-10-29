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
    let i,
      o = Promise.resolve(e);
    return (
      o.catch(() => {}),
      Promise.race([
        o,
        new Promise((e, r) => {
          i = setTimeout(
            () => r(new t(`${a} did not respond within ${n}ms`)),
            n,
          );
        }),
      ]).finally(() => clearTimeout(i))
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
    i = a.getInitialState().setBlockhash,
    o = a.getInitialState().startInterval,
    s = a.getInitialState().stopInterval,
    l = () => a.getState().blockhash;
  e.s(["z", 0, l, "V", 0, i, "J", 0, o, "X", 0, s], 446870);
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
      o = r({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let r = { value: t, wallTime: n, monotonicTime: a };
          if (!(1e4 >= d(r))) throw Error("Blockhash refresh is stale");
          let o = u.get(e);
          if (
            o &&
            t.lastValidBlockHeight < o.value.lastValidBlockHeight &&
            3e4 >= d(o)
          )
            throw Error("Blockhash refresh returned an older block");
          return (u.set(e, r), i(t), t);
        })
        .finally(() => {
          f.get(e) === o && f.delete(e);
        });
    return (f.set(e, o), o);
  }
  function g(e) {
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
    let t = l();
    return t || (e ? g(e) : null);
  }
  e.s(["w", 0, m, "R", 0, g, "f", 0, h], 443618);
  var p = e.i(110823);
  let v = new WeakSet(),
    y = new WeakMap(),
    b = new WeakMap();
  async function w({ connection: e, transaction: t }) {
    if (
      !v.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let n = await g(e);
    return ((t.message.recentBlockhash = n.blockhash), y.set(t, n), t);
  }
  function _(e) {
    let t = y.get(e);
    return t && t.blockhash === e.message.recentBlockhash ? t : void 0;
  }
  e.s(
    [
      "s",
      0,
      function ({ from: e, to: t }) {
        let n = _(e);
        n && n.blockhash === t.message.recentBlockhash && y.set(t, n);
        let r = b.get(e);
        r && b.set(t, r);
      },
      "Q",
      0,
      _,
      "P",
      0,
      function (e) {
        return b.get(e) ?? p.f;
      },
      "c",
      0,
      w,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: n }) {
        return (
          v.add(e),
          t && t.blockhash === e.message?.recentBlockhash && y.set(e, t),
          n && b.set(e, n),
          e
        );
      },
    ],
    412296,
  );
};
