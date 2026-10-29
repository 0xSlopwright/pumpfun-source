// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(598854);
  let r = Symbol.for("pump.fun.domTranslationPatchInstalled");
  if ("function" == typeof Node && Node.prototype) {
    let e = Node.prototype;
    if (!e[r]) {
      let t = e.removeChild,
        n = e.insertBefore;
      (Object.defineProperty(e, r, { value: !0 }),
        (e.removeChild = function (e) {
          return e.parentNode !== this ? e : t.call(this, e);
        }),
        (e.insertBefore = function (e, t) {
          return t && t.parentNode !== this ? e : n.call(this, e, t);
        }));
    }
  }
  ((0, t.config)({ jitless: !0 }), e.s([]));
};
