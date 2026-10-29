// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = globalThis.AbortController || e.r(712159).AbortController,
    {
      codes: {
        ERR_INVALID_ARG_VALUE: i,
        ERR_INVALID_ARG_TYPE: o,
        ERR_MISSING_ARGS: a,
        ERR_OUT_OF_RANGE: s,
      },
      AbortError: l,
    } = e.r(561079),
    {
      validateAbortSignal: u,
      validateInteger: d,
      validateObject: c,
    } = e.r(938720),
    f = e.r(763323).Symbol("kWeak"),
    h = e.r(763323).Symbol("kResistStopPropagation"),
    { finished: p } = e.r(294343),
    g = e.r(858798),
    { addAbortSignalNoValidate: b } = e.r(842704),
    { isWritable: m, isNodeStream: y } = e.r(283234),
    { deprecate: w } = e.r(984651),
    {
      ArrayPrototypePush: v,
      Boolean: _,
      MathFloor: S,
      Number: E,
      NumberIsNaN: A,
      Promise: x,
      PromiseReject: M,
      PromiseResolve: k,
      PromisePrototypeThen: P,
      Symbol: O,
    } = e.r(763323),
    B = O("kEmpty"),
    I = O("kEof");
  function R(t, r) {
    if ("function" != typeof t)
      throw new o("fn", ["Function", "AsyncFunction"], t);
    (null != r && c(r, "options"),
      (null == r ? void 0 : r.signal) != null && u(r.signal, "options.signal"));
    let n = 1;
    (null == r ? void 0 : r.concurrency) != null && (n = S(r.concurrency));
    let i = n - 1;
    return (
      (null == r ? void 0 : r.highWaterMark) != null &&
        (i = S(r.highWaterMark)),
      d(n, "options.concurrency", 1),
      d(i, "options.highWaterMark", 0),
      (i += n),
      async function* () {
        let o,
          a,
          s = e
            .r(984651)
            .AbortSignalAny([null == r ? void 0 : r.signal].filter(_)),
          u = this,
          d = [],
          c = { signal: s },
          f = !1,
          h = 0;
        function p() {
          ((f = !0), g());
        }
        function g() {
          ((h -= 1), b());
        }
        function b() {
          a && !f && h < n && d.length < i && (a(), (a = null));
        }
        !(async function () {
          try {
            for await (let e of u) {
              if (f) return;
              if (s.aborted) throw new l();
              try {
                if ((e = t(e, c)) === B) continue;
                e = k(e);
              } catch (t) {
                e = M(t);
              }
              ((h += 1),
                P(e, g, p),
                d.push(e),
                o && (o(), (o = null)),
                !f &&
                  (d.length >= i || h >= n) &&
                  (await new x((e) => {
                    a = e;
                  })));
            }
            d.push(I);
          } catch (t) {
            let e = M(t);
            (P(e, g, p), d.push(e));
          } finally {
            ((f = !0), o && (o(), (o = null)));
          }
        })();
        try {
          for (;;) {
            for (; d.length > 0; ) {
              let e = await d[0];
              if (e === I) return;
              if (s.aborted) throw new l();
              (e !== B && (yield e), d.shift(), b());
            }
            await new x((e) => {
              o = e;
            });
          }
        } finally {
          ((f = !0), a && (a(), (a = null)));
        }
      }.call(this)
    );
  }
  async function T(e, t) {
    for await (let r of L.call(this, e, t)) return !0;
    return !1;
  }
  async function C(e, t) {
    if ("function" != typeof e)
      throw new o("fn", ["Function", "AsyncFunction"], e);
    return !(await T.call(this, async (...t) => !(await e(...t)), t));
  }
  async function j(e, t) {
    for await (let r of L.call(this, e, t)) return r;
  }
  async function N(e, t) {
    if ("function" != typeof e)
      throw new o("fn", ["Function", "AsyncFunction"], e);
    async function r(t, r) {
      return (await e(t, r), B);
    }
    for await (let e of R.call(this, r, t));
  }
  function L(e, t) {
    if ("function" != typeof e)
      throw new o("fn", ["Function", "AsyncFunction"], e);
    async function r(t, r) {
      return (await e(t, r)) ? t : B;
    }
    return R.call(this, r, t);
  }
  class F extends a {
    constructor() {
      (super("reduce"),
        (this.message = "Reduce of an empty stream requires an initial value"));
    }
  }
  async function q(e, t, r) {
    var i, a;
    if ("function" != typeof e)
      throw new o("reducer", ["Function", "AsyncFunction"], e);
    (null != r && c(r, "options"),
      (null == r ? void 0 : r.signal) != null && u(r.signal, "options.signal"));
    let s = arguments.length > 1;
    if (null != r && null != (i = r.signal) && i.aborted) {
      let e = new l(void 0, { cause: r.signal.reason });
      throw (this.once("error", () => {}), await p(this.destroy(e)), e);
    }
    let d = new n(),
      g = d.signal;
    null != r &&
      r.signal &&
      r.signal.addEventListener("abort", () => d.abort(), {
        once: !0,
        [f]: this,
        [h]: !0,
      });
    let b = !1;
    try {
      for await (let n of this) {
        if (((b = !0), null != r && null != (a = r.signal) && a.aborted))
          throw new l();
        s ? (t = await e(t, n, { signal: g })) : ((t = n), (s = !0));
      }
      if (!b && !s) throw new F();
    } finally {
      d.abort();
    }
    return t;
  }
  async function D(e) {
    (null != e && c(e, "options"),
      (null == e ? void 0 : e.signal) != null && u(e.signal, "options.signal"));
    let t = [];
    for await (let n of this) {
      var r;
      if (null != e && null != (r = e.signal) && r.aborted)
        throw new l(void 0, { cause: e.signal.reason });
      v(t, n);
    }
    return t;
  }
  function U(e) {
    if (A((e = E(e)))) return 0;
    if (e < 0) throw new s("number", ">= 0", e);
    return e;
  }
  ((t.exports.streamReturningOperators = {
    asIndexedPairs: w(function (e) {
      return (
        null != e && c(e, "options"),
        (null == e ? void 0 : e.signal) != null &&
          u(e.signal, "options.signal"),
        async function* () {
          let t = 0;
          for await (let n of this) {
            var r;
            if (null != e && null != (r = e.signal) && r.aborted)
              throw new l({ cause: e.signal.reason });
            yield [t++, n];
          }
        }.call(this)
      );
    }, "readable.asIndexedPairs will be removed in a future version."),
    drop: function (e, t) {
      return (
        null != t && c(t, "options"),
        (null == t ? void 0 : t.signal) != null &&
          u(t.signal, "options.signal"),
        (e = U(e)),
        async function* () {
          var r, n;
          if (null != t && null != (r = t.signal) && r.aborted) throw new l();
          for await (let r of this) {
            if (null != t && null != (n = t.signal) && n.aborted) throw new l();
            e-- <= 0 && (yield r);
          }
        }.call(this)
      );
    },
    filter: L,
    flatMap: function (e, t) {
      let r = R.call(this, e, t);
      return async function* () {
        for await (let e of r) yield* e;
      }.call(this);
    },
    map: R,
    take: function (e, t) {
      return (
        null != t && c(t, "options"),
        (null == t ? void 0 : t.signal) != null &&
          u(t.signal, "options.signal"),
        (e = U(e)),
        async function* () {
          var r, n;
          if (null != t && null != (r = t.signal) && r.aborted) throw new l();
          for await (let r of this) {
            if (null != t && null != (n = t.signal) && n.aborted) throw new l();
            if ((e-- > 0 && (yield r), e <= 0)) return;
          }
        }.call(this)
      );
    },
    compose: function (e, t) {
      if (
        (null != t && c(t, "options"),
        (null == t ? void 0 : t.signal) != null &&
          u(t.signal, "options.signal"),
        y(e) && !m(e))
      )
        throw new i("stream", e, "must be writable");
      let r = g(this, e);
      return (null != t && t.signal && b(t.signal, r), r);
    },
  }),
    (t.exports.promiseReturningOperators = {
      every: C,
      forEach: N,
      reduce: q,
      toArray: D,
      some: T,
      find: j,
    }));
};
