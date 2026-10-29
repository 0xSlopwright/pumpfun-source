// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = e.r(259390),
    { format: i, inspect: o } = e.r(478968),
    {
      codes: { ERR_INVALID_ARG_TYPE: a },
    } = e.r(561079),
    {
      kResistStopPropagation: s,
      AggregateError: l,
      SymbolDispose: u,
    } = e.r(763323),
    AbortSignal = globalThis.AbortSignal || e.r(712159).AbortSignal,
    d = globalThis.AbortController || e.r(712159).AbortController,
    c = Object.getPrototypeOf(async function () {}).constructor,
    f = globalThis.Blob || n.Blob,
    h = (e, t) => {
      if (
        void 0 !== e &&
        (null === e || "object" != typeof e || !("aborted" in e))
      )
        throw new a(t, "AbortSignal", e);
    };
  ((t.exports = {
    AggregateError: l,
    kEmptyObject: Object.freeze({}),
    once(e) {
      let t = !1;
      return function (...r) {
        t || ((t = !0), e.apply(this, r));
      };
    },
    createDeferredPromise: function () {
      let e, t;
      return {
        promise: new Promise((r, n) => {
          ((e = r), (t = n));
        }),
        resolve: e,
        reject: t,
      };
    },
    promisify: (e) =>
      new Promise((t, r) => {
        e((e, ...n) => (e ? r(e) : t(...n)));
      }),
    debuglog: () => function () {},
    format: i,
    inspect: o,
    types: {
      isAsyncFunction: (e) => e instanceof c,
      isArrayBufferView: (e) => ArrayBuffer.isView(e),
    },
    isBlob:
      void 0 !== f
        ? function (e) {
            return e instanceof f;
          }
        : function (e) {
            return !1;
          },
    deprecate: (e, t) => e,
    addAbortListener:
      e.r(679877).addAbortListener ||
      function (e, t) {
        let r;
        if (void 0 === e) throw new a("signal", "AbortSignal", e);
        h(e, "signal");
        if ("function" != typeof t) throw new a("listener", "Function", t);
        return (
          e.aborted
            ? queueMicrotask(() => t())
            : (e.addEventListener("abort", t, {
                __proto__: null,
                once: !0,
                [s]: !0,
              }),
              (r = () => {
                e.removeEventListener("abort", t);
              })),
          {
            __proto__: null,
            [u]() {
              var e;
              null == (e = r) || e();
            },
          }
        );
      },
    AbortSignalAny:
      AbortSignal.any ||
      function (e) {
        if (1 === e.length) return e[0];
        let t = new d(),
          r = () => t.abort();
        return (
          e.forEach((e) => {
            (h(e, "signals"), e.addEventListener("abort", r, { once: !0 }));
          }),
          t.signal.addEventListener(
            "abort",
            () => {
              e.forEach((e) => e.removeEventListener("abort", r));
            },
            { once: !0 },
          ),
          t.signal
        );
      },
  }),
    (t.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom")));
};
