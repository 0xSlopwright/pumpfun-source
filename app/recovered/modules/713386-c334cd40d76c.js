// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n,
    i = e.f({
      process: { id: () => 241457, module: () => e.r(241457) },
      "process/": { id: () => 241457, module: () => e.r(241457) },
    })("process/"),
    {
      ArrayPrototypeSlice: o,
      Error: a,
      FunctionPrototypeSymbolHasInstance: s,
      ObjectDefineProperty: l,
      ObjectDefineProperties: u,
      ObjectSetPrototypeOf: d,
      StringPrototypeToLowerCase: c,
      Symbol: f,
      SymbolHasInstance: h,
    } = e.r(763323);
  ((t.exports = j), (j.WritableState = T));
  let { EventEmitter: p } = e.r(679877),
    g = e.r(247989).Stream,
    { Buffer: b } = e.r(259390),
    m = e.r(340202),
    { addAbortSignal: y } = e.r(842704),
    { getHighWaterMark: w, getDefaultHighWaterMark: v } = e.r(929772),
    {
      ERR_INVALID_ARG_TYPE: _,
      ERR_METHOD_NOT_IMPLEMENTED: S,
      ERR_MULTIPLE_CALLBACK: E,
      ERR_STREAM_CANNOT_PIPE: A,
      ERR_STREAM_DESTROYED: x,
      ERR_STREAM_ALREADY_FINISHED: M,
      ERR_STREAM_NULL_VALUES: k,
      ERR_STREAM_WRITE_AFTER_END: P,
      ERR_UNKNOWN_ENCODING: O,
    } = e.r(561079).codes,
    { errorOrDestroy: B } = m;
  function I() {}
  (d(j.prototype, g.prototype), d(j, g));
  let R = f("kOnFinished");
  function T(t, r, n) {
    ("boolean" != typeof n && (n = r instanceof e.r(654547)),
      (this.objectMode = !!(t && t.objectMode)),
      n && (this.objectMode = this.objectMode || !!(t && t.writableObjectMode)),
      (this.highWaterMark = t ? w(this, t, "writableHighWaterMark", n) : v(!1)),
      (this.finalCalled = !1),
      (this.needDrain = !1),
      (this.ending = !1),
      (this.ended = !1),
      (this.finished = !1),
      (this.destroyed = !1));
    let i = !!(t && !1 === t.decodeStrings);
    ((this.decodeStrings = !i),
      (this.defaultEncoding = (t && t.defaultEncoding) || "utf8"),
      (this.length = 0),
      (this.writing = !1),
      (this.corked = 0),
      (this.sync = !0),
      (this.bufferProcessing = !1),
      (this.onwrite = q.bind(void 0, r)),
      (this.writecb = null),
      (this.writelen = 0),
      (this.afterWriteTickInfo = null),
      C(this),
      (this.pendingcb = 0),
      (this.constructed = !0),
      (this.prefinished = !1),
      (this.errorEmitted = !1),
      (this.emitClose = !t || !1 !== t.emitClose),
      (this.autoDestroy = !t || !1 !== t.autoDestroy),
      (this.errored = null),
      (this.closed = !1),
      (this.closeEmitted = !1),
      (this[R] = []));
  }
  function C(e) {
    ((e.buffered = []),
      (e.bufferedIndex = 0),
      (e.allBuffers = !0),
      (e.allNoop = !0));
  }
  function j(t) {
    let r = this instanceof e.r(654547);
    if (!r && !s(j, this)) return new j(t);
    ((this._writableState = new T(t, this, r)),
      t &&
        ("function" == typeof t.write && (this._write = t.write),
        "function" == typeof t.writev && (this._writev = t.writev),
        "function" == typeof t.destroy && (this._destroy = t.destroy),
        "function" == typeof t.final && (this._final = t.final),
        "function" == typeof t.construct && (this._construct = t.construct),
        t.signal && y(t.signal, this)),
      g.call(this, t),
      m.construct(this, () => {
        let e = this._writableState;
        (e.writing || $(this, e), H(this, e));
      }));
  }
  function N(e, t, r, n) {
    var o, a, s, l, u;
    let d,
      c,
      f,
      h = e._writableState;
    if ("function" == typeof r) ((n = r), (r = h.defaultEncoding));
    else {
      if (r) {
        if ("buffer" !== r && !b.isEncoding(r)) throw new O(r);
      } else r = h.defaultEncoding;
      "function" != typeof n && (n = I);
    }
    if (null === t) throw new k();
    if (!h.objectMode)
      if ("string" == typeof t)
        !1 !== h.decodeStrings && ((t = b.from(t, r)), (r = "buffer"));
      else if (t instanceof b) r = "buffer";
      else if (g._isUint8Array(t))
        ((t = g._uint8ArrayToBuffer(t)), (r = "buffer"));
      else throw new _("chunk", ["string", "Buffer", "Uint8Array"], t);
    return (h.ending ? (f = new P()) : h.destroyed && (f = new x("write")), f)
      ? (i.nextTick(n, f), B(e, f, !0), f)
      : (h.pendingcb++,
        (o = e),
        (a = h),
        (s = t),
        (l = r),
        (u = n),
        (d = a.objectMode ? 1 : s.length),
        (a.length += d),
        (c = a.length < a.highWaterMark) || (a.needDrain = !0),
        a.writing || a.corked || a.errored || !a.constructed
          ? (a.buffered.push({ chunk: s, encoding: l, callback: u }),
            a.allBuffers && "buffer" !== l && (a.allBuffers = !1),
            a.allNoop && u !== I && (a.allNoop = !1))
          : ((a.writelen = d),
            (a.writecb = u),
            (a.writing = !0),
            (a.sync = !0),
            o._write(s, l, a.onwrite),
            (a.sync = !1)),
        c && !a.errored && !a.destroyed);
  }
  function L(e, t, r, n, i, o, a) {
    ((t.writelen = n),
      (t.writecb = a),
      (t.writing = !0),
      (t.sync = !0),
      t.destroyed
        ? t.onwrite(new x("write"))
        : r
          ? e._writev(i, t.onwrite)
          : e._write(i, o, t.onwrite),
      (t.sync = !1));
  }
  function F(e, t, r, n) {
    (--t.pendingcb, n(r), W(t), B(e, r));
  }
  function q(e, t) {
    let r = e._writableState,
      n = r.sync,
      o = r.writecb;
    "function" != typeof o
      ? B(e, new E())
      : ((r.writing = !1),
        (r.writecb = null),
        (r.length -= r.writelen),
        (r.writelen = 0),
        t
          ? (t.stack,
            r.errored || (r.errored = t),
            e._readableState &&
              !e._readableState.errored &&
              (e._readableState.errored = t),
            n ? i.nextTick(F, e, r, t, o) : F(e, r, t, o))
          : (r.buffered.length > r.bufferedIndex && $(e, r),
            n
              ? null !== r.afterWriteTickInfo && r.afterWriteTickInfo.cb === o
                ? r.afterWriteTickInfo.count++
                : ((r.afterWriteTickInfo = {
                    count: 1,
                    cb: o,
                    stream: e,
                    state: r,
                  }),
                  i.nextTick(D, r.afterWriteTickInfo))
              : U(e, r, 1, o)));
  }
  function D({ stream: e, state: t, count: r, cb: n }) {
    return ((t.afterWriteTickInfo = null), U(e, t, r, n));
  }
  function U(e, t, r, n) {
    for (
      t.ending ||
      e.destroyed ||
      0 !== t.length ||
      !t.needDrain ||
      ((t.needDrain = !1), e.emit("drain"));
      r-- > 0;

    )
      (t.pendingcb--, n());
    (t.destroyed && W(t), H(e, t));
  }
  function W(e) {
    var t, r;
    if (e.writing) return;
    for (let r = e.bufferedIndex; r < e.buffered.length; ++r) {
      let { chunk: n, callback: i } = e.buffered[r],
        o = e.objectMode ? 1 : n.length;
      ((e.length -= o), i(null != (t = e.errored) ? t : new x("write")));
    }
    let n = e[R].splice(0);
    for (let t = 0; t < n.length; t++)
      n[t](null != (r = e.errored) ? r : new x("end"));
    C(e);
  }
  function $(e, t) {
    if (t.corked || t.bufferProcessing || t.destroyed || !t.constructed) return;
    let { buffered: r, bufferedIndex: n, objectMode: i } = t,
      a = r.length - n;
    if (!a) return;
    let s = n;
    if (((t.bufferProcessing = !0), a > 1 && e._writev)) {
      t.pendingcb -= a - 1;
      let n = t.allNoop
          ? I
          : (e) => {
              for (let t = s; t < r.length; ++t) r[t].callback(e);
            },
        i = t.allNoop && 0 === s ? r : o(r, s);
      ((i.allBuffers = t.allBuffers), L(e, t, !0, t.length, i, "", n), C(t));
    } else {
      do {
        let { chunk: n, encoding: o, callback: a } = r[s];
        ((r[s++] = null), L(e, t, !1, i ? 1 : n.length, n, o, a));
      } while (s < r.length && !t.writing);
      s === r.length
        ? C(t)
        : s > 256
          ? (r.splice(0, s), (t.bufferedIndex = 0))
          : (t.bufferedIndex = s);
    }
    t.bufferProcessing = !1;
  }
  function z(e) {
    return (
      e.ending &&
      !e.destroyed &&
      e.constructed &&
      0 === e.length &&
      !e.errored &&
      0 === e.buffered.length &&
      !e.finished &&
      !e.writing &&
      !e.errorEmitted &&
      !e.closeEmitted
    );
  }
  function H(e, t, r) {
    if (z(t)) {
      if (!t.prefinished && !t.finalCalled)
        if ("function" != typeof e._final || t.destroyed)
          ((t.prefinished = !0), e.emit("prefinish"));
        else {
          t.finalCalled = !0;
          let r = !1;
          function n(n) {
            if (r) return void B(e, null != n ? n : E());
            if (((r = !0), t.pendingcb--, n)) {
              let r = t[R].splice(0);
              for (let e = 0; e < r.length; e++) r[e](n);
              B(e, n, t.sync);
            } else
              z(t) &&
                ((t.prefinished = !0),
                e.emit("prefinish"),
                t.pendingcb++,
                i.nextTick(V, e, t));
          }
          ((t.sync = !0), t.pendingcb++);
          try {
            e._final(n);
          } catch (e) {
            n(e);
          }
          t.sync = !1;
        }
      0 === t.pendingcb &&
        (r
          ? (t.pendingcb++,
            i.nextTick(
              (e, t) => {
                z(t) ? V(e, t) : t.pendingcb--;
              },
              e,
              t,
            ))
          : z(t) && (t.pendingcb++, V(e, t)));
    }
  }
  function V(e, t) {
    (t.pendingcb--, (t.finished = !0));
    let r = t[R].splice(0);
    for (let e = 0; e < r.length; e++) r[e]();
    if ((e.emit("finish"), t.autoDestroy)) {
      let t = e._readableState;
      (!t || (t.autoDestroy && (t.endEmitted || !1 === t.readable))) &&
        e.destroy();
    }
  }
  ((T.prototype.getBuffer = function () {
    return o(this.buffered, this.bufferedIndex);
  }),
    l(T.prototype, "bufferedRequestCount", {
      __proto__: null,
      get() {
        return this.buffered.length - this.bufferedIndex;
      },
    }),
    l(j, h, {
      __proto__: null,
      value: function (e) {
        return (
          !!s(this, e) || (this === j && e && e._writableState instanceof T)
        );
      },
    }),
    (j.prototype.pipe = function () {
      B(this, new A());
    }),
    (j.prototype.write = function (e, t, r) {
      return !0 === N(this, e, t, r);
    }),
    (j.prototype.cork = function () {
      this._writableState.corked++;
    }),
    (j.prototype.uncork = function () {
      let e = this._writableState;
      e.corked && (e.corked--, e.writing || $(this, e));
    }),
    (j.prototype.setDefaultEncoding = function (e) {
      if (("string" == typeof e && (e = c(e)), !b.isEncoding(e)))
        throw new O(e);
      return ((this._writableState.defaultEncoding = e), this);
    }),
    (j.prototype._write = function (e, t, r) {
      if (this._writev) this._writev([{ chunk: e, encoding: t }], r);
      else throw new S("_write()");
    }),
    (j.prototype._writev = null),
    (j.prototype.end = function (e, t, r) {
      let n,
        o = this._writableState;
      if (
        ("function" == typeof e
          ? ((r = e), (e = null), (t = null))
          : "function" == typeof t && ((r = t), (t = null)),
        null != e)
      ) {
        let r = N(this, e, t);
        r instanceof a && (n = r);
      }
      return (
        o.corked && ((o.corked = 1), this.uncork()),
        n ||
          (o.errored || o.ending
            ? o.finished
              ? (n = new M("end"))
              : o.destroyed && (n = new x("end"))
            : ((o.ending = !0), H(this, o, !0), (o.ended = !0))),
        "function" == typeof r &&
          (n || o.finished ? i.nextTick(r, n) : o[R].push(r)),
        this
      );
    }),
    u(j.prototype, {
      closed: {
        __proto__: null,
        get() {
          return !!this._writableState && this._writableState.closed;
        },
      },
      destroyed: {
        __proto__: null,
        get() {
          return !!this._writableState && this._writableState.destroyed;
        },
        set(e) {
          this._writableState && (this._writableState.destroyed = e);
        },
      },
      writable: {
        __proto__: null,
        get() {
          let e = this._writableState;
          return (
            !!e &&
            !1 !== e.writable &&
            !e.destroyed &&
            !e.errored &&
            !e.ending &&
            !e.ended
          );
        },
        set(e) {
          this._writableState && (this._writableState.writable = !!e);
        },
      },
      writableFinished: {
        __proto__: null,
        get() {
          return !!this._writableState && this._writableState.finished;
        },
      },
      writableObjectMode: {
        __proto__: null,
        get() {
          return !!this._writableState && this._writableState.objectMode;
        },
      },
      writableBuffer: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.getBuffer();
        },
      },
      writableEnded: {
        __proto__: null,
        get() {
          return !!this._writableState && this._writableState.ending;
        },
      },
      writableNeedDrain: {
        __proto__: null,
        get() {
          let e = this._writableState;
          return !!e && !e.destroyed && !e.ending && e.needDrain;
        },
      },
      writableHighWaterMark: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.highWaterMark;
        },
      },
      writableCorked: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.corked : 0;
        },
      },
      writableLength: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.length;
        },
      },
      errored: {
        __proto__: null,
        enumerable: !1,
        get() {
          return this._writableState ? this._writableState.errored : null;
        },
      },
      writableAborted: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return !!(
            !1 !== this._writableState.writable &&
            (this._writableState.destroyed || this._writableState.errored) &&
            !this._writableState.finished
          );
        },
      },
    }));
  let K = m.destroy;
  function G() {
    return (void 0 === n && (n = {}), n);
  }
  ((j.prototype.destroy = function (e, t) {
    let r = this._writableState;
    return (
      !r.destroyed &&
        (r.bufferedIndex < r.buffered.length || r[R].length) &&
        i.nextTick(W, r),
      K.call(this, e, t),
      this
    );
  }),
    (j.prototype._undestroy = m.undestroy),
    (j.prototype._destroy = function (e, t) {
      t(e);
    }),
    (j.prototype[p.captureRejectionSymbol] = function (e) {
      this.destroy(e);
    }),
    (j.fromWeb = function (e, t) {
      return G().newStreamWritableFromWritableStream(e, t);
    }),
    (j.toWeb = function (e) {
      return G().newWritableStreamFromStreamWritable(e);
    }));
};
