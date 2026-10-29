// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = e.r(914557),
    i = e.r(967439),
    o = n.Readable.destroy;
  ((t.exports = n.Readable),
    (t.exports._uint8ArrayToBuffer = n._uint8ArrayToBuffer),
    (t.exports._isUint8Array = n._isUint8Array),
    (t.exports.isDisturbed = n.isDisturbed),
    (t.exports.isErrored = n.isErrored),
    (t.exports.isReadable = n.isReadable),
    (t.exports.Readable = n.Readable),
    (t.exports.Writable = n.Writable),
    (t.exports.Duplex = n.Duplex),
    (t.exports.Transform = n.Transform),
    (t.exports.PassThrough = n.PassThrough),
    (t.exports.addAbortSignal = n.addAbortSignal),
    (t.exports.finished = n.finished),
    (t.exports.destroy = n.destroy),
    (t.exports.destroy = o),
    (t.exports.pipeline = n.pipeline),
    (t.exports.compose = n.compose),
    Object.defineProperty(n, "promises", {
      configurable: !0,
      enumerable: !0,
      get: () => i,
    }),
    (t.exports.Stream = n.Stream),
    (t.exports.default = t.exports));
};
