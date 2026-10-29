// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(311629);
  let a =
      "u" > typeof globalThis
        ? globalThis
        : "u" > typeof self
          ? self
          : "u" > typeof window
            ? window
            : e.g,
    i = a.fetch
      ? (...e) => a.fetch(...e)
      : () => Promise.reject(Error("[ofetch] global.fetch is not supported!")),
    s = a.Headers,
    r = a.AbortController,
    n = (0, t.c)({ fetch: i, Headers: s, AbortController: r });
  e.s(["f", 0, n]);
};
