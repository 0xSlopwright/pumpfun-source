// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n,
    { SymbolDispose: i } = e.r(763323),
    { AbortError: o, codes: a } = e.r(561079),
    {
      isNodeStream: s,
      isWebStream: l,
      kControllerErrorFunction: u,
    } = e.r(283234),
    d = e.r(294343),
    { ERR_INVALID_ARG_TYPE: c } = a;
  ((t.exports.addAbortSignal = function (e, r) {
    if ("object" != typeof e || !("aborted" in e))
      throw new c("signal", "AbortSignal", e);
    if (!s(r) && !l(r))
      throw new c("stream", ["ReadableStream", "WritableStream", "Stream"], r);
    return t.exports.addAbortSignalNoValidate(e, r);
  }),
    (t.exports.addAbortSignalNoValidate = function (t, r) {
      if ("object" != typeof t || !("aborted" in t)) return r;
      let a = s(r)
        ? () => {
            r.destroy(new o(void 0, { cause: t.reason }));
          }
        : () => {
            r[u](new o(void 0, { cause: t.reason }));
          };
      return (
        t.aborted
          ? a()
          : d(r, (n = n || e.r(984651).addAbortListener)(t, a)[i]),
        r
      );
    }));
};
