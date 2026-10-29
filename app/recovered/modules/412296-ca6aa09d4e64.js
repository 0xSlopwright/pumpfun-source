// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  class t extends Error {
    constructor(e) {
      (super(e), (this.name = "TimeoutError"));
    }
  }
  function r(e) {
    return e instanceof Error && "TimeoutError" === e.name;
  }
  function n({ promise: e, ms: r, label: a }) {
    let l,
      i = Promise.resolve(e);
    return (
      i.catch(() => {}),
      Promise.race([
        i,
        new Promise((e, n) => {
          l = setTimeout(
            () => n(new t(`${a} did not respond within ${r}ms`)),
            r,
          );
        }),
      ]).finally(() => clearTimeout(l))
    );
  }
  e.s(["d", 0, r, "k", 0, n], 762193);
  let a = (0, e.i(78436).$)((e, t) => ({
      blockhash: null,
      intervalId: null,
      startInterval: (r) => {
        let n = t().intervalId;
        (n && clearInterval(n), e({ intervalId: r }));
      },
      stopInterval: () => {
        let r = t().intervalId;
        (r && clearInterval(r), e({ intervalId: null }));
      },
      setBlockhash: (r) => {
        let n = t().blockhash?.lastValidBlockHeight ?? 0;
        r.lastValidBlockHeight > n && e({ blockhash: r });
      },
    })),
    l = a.getInitialState().setBlockhash,
    i = a.getInitialState().startInterval,
    s = a.getInitialState().stopInterval,
    o = () => a.getState().blockhash;
  e.s(["z", 0, o, "V", 0, l, "J", 0, i, "X", 0, s], 446870);
  var c = e.i(564035);
  let d = new WeakMap(),
    u = new WeakMap();
  function f(e) {
    let t = Date.now() - e.wallTime,
      r = performance.now() - e.monotonicTime;
    return t < 0 || r < 0 ? 1 / 0 : Math.max(t, r);
  }
  function h(e) {
    let t = u.get(e);
    if (t) return t;
    let r = Date.now(),
      a = performance.now(),
      i = n({
        promise: e.getLatestBlockhash(),
        ms: 5e3,
        label: "refreshing the transaction blockhash",
      })
        .then((t) => {
          let n = { value: t, wallTime: r, monotonicTime: a };
          if (!(1e4 >= f(n))) throw Error("Blockhash refresh is stale");
          let i = d.get(e);
          if (
            i &&
            t.lastValidBlockHeight < i.value.lastValidBlockHeight &&
            3e4 >= f(i)
          )
            throw Error("Blockhash refresh returned an older block");
          return (d.set(e, n), l(t), t);
        })
        .finally(() => {
          u.get(e) === i && u.delete(e);
        });
    return (u.set(e, i), i);
  }
  function m(e) {
    let t = d.get(e);
    return t && 1e4 >= f(t)
      ? Promise.resolve(t.value)
      : h(e).catch((t) => {
          let n = d.get(e);
          if (n && 3e4 >= f(n)) return n.value;
          throw new c.U(r(t) ? "timeout" : "rpc-error", { cause: t });
        });
  }
  async function b(e) {
    let t = o();
    return t || (e ? m(e) : null);
  }
  e.s(["w", 0, b, "R", 0, m, "f", 0, h], 443618);
  var x = e.i(110823);
  let p = new WeakSet(),
    y = new WeakMap(),
    g = new WeakMap();
  async function v({ connection: e, transaction: t }) {
    if (
      !p.has(t) ||
      0 !== t.version ||
      t.signatures.some((e) => e.some((e) => 0 !== e))
    )
      return t;
    let r = await m(e);
    return ((t.message.recentBlockhash = r.blockhash), y.set(t, r), t);
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
        let r = w(e);
        r && r.blockhash === t.message.recentBlockhash && y.set(t, r);
        let n = g.get(e);
        n && g.set(t, n);
      },
      "Q",
      0,
      w,
      "P",
      0,
      function (e) {
        return g.get(e) ?? x.f;
      },
      "c",
      0,
      v,
      "x",
      0,
      function ({ transaction: e, blockhash: t, feeMode: r }) {
        return (
          p.add(e),
          t && t.blockhash === e.message?.recentBlockhash && y.set(e, t),
          r && g.set(e, r),
          e
        );
      },
    ],
    412296,
  );
};
