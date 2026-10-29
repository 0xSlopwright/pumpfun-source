// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { AbortController: n, AbortSignal } =
    "u" > typeof self ? self : "u" > typeof window ? window : void 0;
  ((t.exports = n),
    (t.exports.AbortSignal = AbortSignal),
    (t.exports.default = n));
};
