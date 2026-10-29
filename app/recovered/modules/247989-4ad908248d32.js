// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { ArrayIsArray: n, ObjectSetPrototypeOf: i } = e.r(763323),
    { EventEmitter: o } = e.r(679877);
  function a(e) {
    o.call(this, e);
  }
  function s(e, t, r) {
    if ("function" == typeof e.prependListener) return e.prependListener(t, r);
    e._events && e._events[t]
      ? n(e._events[t])
        ? e._events[t].unshift(r)
        : (e._events[t] = [r, e._events[t]])
      : e.on(t, r);
  }
  (i(a.prototype, o.prototype),
    i(a, o),
    (a.prototype.pipe = function (e, t) {
      let r = this;
      function n(t) {
        e.writable && !1 === e.write(t) && r.pause && r.pause();
      }
      function i() {
        r.readable && r.resume && r.resume();
      }
      (r.on("data", n),
        e.on("drain", i),
        e._isStdio ||
          (t && !1 === t.end) ||
          (r.on("end", l), r.on("close", u)));
      let a = !1;
      function l() {
        a || ((a = !0), e.end());
      }
      function u() {
        a || ((a = !0), "function" == typeof e.destroy && e.destroy());
      }
      function d(e) {
        (c(), 0 === o.listenerCount(this, "error") && this.emit("error", e));
      }
      function c() {
        (r.removeListener("data", n),
          e.removeListener("drain", i),
          r.removeListener("end", l),
          r.removeListener("close", u),
          r.removeListener("error", d),
          e.removeListener("error", d),
          r.removeListener("end", c),
          r.removeListener("close", c),
          e.removeListener("close", c));
      }
      return (
        s(r, "error", d),
        s(e, "error", d),
        r.on("end", c),
        r.on("close", c),
        e.on("close", c),
        e.emit("pipe", r),
        e
      );
    }),
    (t.exports = { Stream: a, prependListener: s }));
};
