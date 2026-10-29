// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = e.f({
      process: { id: () => 241457, module: () => e.r(241457) },
      "process/": { id: () => 241457, module: () => e.r(241457) },
    })("process/"),
    {
      aggregateTwoErrors: i,
      codes: { ERR_MULTIPLE_CALLBACK: o },
      AbortError: a,
    } = e.r(561079),
    { Symbol: s } = e.r(763323),
    {
      kIsDestroyed: l,
      isDestroyed: u,
      isFinished: d,
      isServerRequest: c,
    } = e.r(283234),
    f = s("kDestroy"),
    h = s("kConstruct");
  function p(e, t, r) {
    e &&
      (e.stack,
      t && !t.errored && (t.errored = e),
      r && !r.errored && (r.errored = e));
  }
  function g(e, t, r) {
    let i = !1;
    function o(t) {
      if (i) return;
      i = !0;
      let o = e._readableState,
        a = e._writableState;
      (p(t, a, o),
        a && (a.closed = !0),
        o && (o.closed = !0),
        "function" == typeof r && r(t),
        t ? n.nextTick(b, e, t) : n.nextTick(m, e));
    }
    try {
      e._destroy(t || null, o);
    } catch (e) {
      o(e);
    }
  }
  function b(e, t) {
    (y(e, t), m(e));
  }
  function m(e) {
    let t = e._readableState,
      r = e._writableState;
    (r && (r.closeEmitted = !0),
      t && (t.closeEmitted = !0),
      ((null != r && r.emitClose) || (null != t && t.emitClose)) &&
        e.emit("close"));
  }
  function y(e, t) {
    let r = e._readableState,
      n = e._writableState;
    (null != n && n.errorEmitted) ||
      (null != r && r.errorEmitted) ||
      (n && (n.errorEmitted = !0),
      r && (r.errorEmitted = !0),
      e.emit("error", t));
  }
  function w(e, t, r) {
    let i = e._readableState,
      o = e._writableState;
    if ((null != o && o.destroyed) || (null != i && i.destroyed)) return this;
    (null != i && i.autoDestroy) || (null != o && o.autoDestroy)
      ? e.destroy(t)
      : t &&
        (t.stack,
        o && !o.errored && (o.errored = t),
        i && !i.errored && (i.errored = t),
        r ? n.nextTick(y, e, t) : y(e, t));
  }
  function v(e) {
    let t = !1;
    function r(r) {
      if (t) return void w(e, null != r ? r : new o());
      t = !0;
      let i = e._readableState,
        a = e._writableState,
        s = a || i;
      (i && (i.constructed = !0),
        a && (a.constructed = !0),
        s.destroyed ? e.emit(f, r) : r ? w(e, r, !0) : n.nextTick(_, e));
    }
    try {
      e._construct((e) => {
        n.nextTick(r, e);
      });
    } catch (e) {
      n.nextTick(r, e);
    }
  }
  function _(e) {
    e.emit(h);
  }
  function S(e) {
    return (null == e ? void 0 : e.setHeader) && "function" == typeof e.abort;
  }
  function E(e) {
    e.emit("close");
  }
  function A(e, t) {
    (e.emit("error", t), n.nextTick(E, e));
  }
  t.exports = {
    construct: function (e, t) {
      if ("function" != typeof e._construct) return;
      let r = e._readableState,
        i = e._writableState;
      (r && (r.constructed = !1),
        i && (i.constructed = !1),
        e.once(h, t),
        e.listenerCount(h) > 1 || n.nextTick(v, e));
    },
    destroyer: function (e, t) {
      !(!e || u(e)) &&
        (t || d(e) || (t = new a()),
        c(e)
          ? ((e.socket = null), e.destroy(t))
          : S(e)
            ? e.abort()
            : S(e.req)
              ? e.req.abort()
              : "function" == typeof e.destroy
                ? e.destroy(t)
                : "function" == typeof e.close
                  ? e.close()
                  : t
                    ? n.nextTick(A, e, t)
                    : n.nextTick(E, e),
        e.destroyed || (e[l] = !0));
    },
    destroy: function (e, t) {
      let r = this._readableState,
        n = this._writableState,
        o = n || r;
      return (
        (null != n && n.destroyed) || (null != r && r.destroyed)
          ? "function" == typeof t && t()
          : (p(e, n, r),
            n && (n.destroyed = !0),
            r && (r.destroyed = !0),
            o.constructed
              ? g(this, e, t)
              : this.once(f, function (r) {
                  g(this, i(r, e), t);
                })),
        this
      );
    },
    undestroy: function () {
      let e = this._readableState,
        t = this._writableState;
      (e &&
        ((e.constructed = !0),
        (e.closed = !1),
        (e.closeEmitted = !1),
        (e.destroyed = !1),
        (e.errored = null),
        (e.errorEmitted = !1),
        (e.reading = !1),
        (e.ended = !1 === e.readable),
        (e.endEmitted = !1 === e.readable)),
        t &&
          ((t.constructed = !0),
          (t.destroyed = !1),
          (t.closed = !1),
          (t.closeEmitted = !1),
          (t.errored = null),
          (t.errorEmitted = !1),
          (t.finalCalled = !1),
          (t.prefinished = !1),
          (t.ended = !1 === t.writable),
          (t.ending = !1 === t.writable),
          (t.finished = !1 === t.writable)));
    },
    errorOrDestroy: w,
  };
};
