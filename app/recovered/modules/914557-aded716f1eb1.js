// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { Buffer: n } = e.r(259390),
    { ObjectDefineProperty: i, ObjectKeys: o, ReflectApply: a } = e.r(763323),
    {
      promisify: { custom: s },
    } = e.r(984651),
    { streamReturningOperators: l, promiseReturningOperators: u } = e.r(512642),
    {
      codes: { ERR_ILLEGAL_CONSTRUCTOR: d },
    } = e.r(561079),
    c = e.r(858798),
    { setDefaultHighWaterMark: f, getDefaultHighWaterMark: h } = e.r(929772),
    { pipeline: p } = e.r(755755),
    { destroyer: g } = e.r(340202),
    b = e.r(294343),
    m = e.r(967439),
    y = e.r(283234),
    w = (t.exports = e.r(247989).Stream);
  for (let t of ((w.isDestroyed = y.isDestroyed),
  (w.isDisturbed = y.isDisturbed),
  (w.isErrored = y.isErrored),
  (w.isReadable = y.isReadable),
  (w.isWritable = y.isWritable),
  (w.Readable = e.r(631284)),
  o(l))) {
    let e = l[t];
    function v(...t) {
      if (new.target) throw d();
      return w.Readable.from(a(e, this, t));
    }
    (i(v, "name", { __proto__: null, value: e.name }),
      i(v, "length", { __proto__: null, value: e.length }),
      i(w.Readable.prototype, t, {
        __proto__: null,
        value: v,
        enumerable: !1,
        configurable: !0,
        writable: !0,
      }));
  }
  for (let e of o(u)) {
    let t = u[e];
    function _(...e) {
      if (new.target) throw d();
      return a(t, this, e);
    }
    (i(_, "name", { __proto__: null, value: t.name }),
      i(_, "length", { __proto__: null, value: t.length }),
      i(w.Readable.prototype, e, {
        __proto__: null,
        value: _,
        enumerable: !1,
        configurable: !0,
        writable: !0,
      }));
  }
  ((w.Writable = e.r(713386)),
    (w.Duplex = e.r(654547)),
    (w.Transform = e.r(860325)),
    (w.PassThrough = e.r(909271)),
    (w.pipeline = p));
  let { addAbortSignal: S } = e.r(842704);
  ((w.addAbortSignal = S),
    (w.finished = b),
    (w.destroy = g),
    (w.compose = c),
    (w.setDefaultHighWaterMark = f),
    (w.getDefaultHighWaterMark = h),
    i(w, "promises", {
      __proto__: null,
      configurable: !0,
      enumerable: !0,
      get: () => m,
    }),
    i(p, s, { __proto__: null, enumerable: !0, get: () => m.pipeline }),
    i(b, s, { __proto__: null, enumerable: !0, get: () => m.finished }),
    (w.Stream = w),
    (w._isUint8Array = function (e) {
      return e instanceof Uint8Array;
    }),
    (w._uint8ArrayToBuffer = function (e) {
      return n.from(e.buffer, e.byteOffset, e.byteLength);
    }));
};
