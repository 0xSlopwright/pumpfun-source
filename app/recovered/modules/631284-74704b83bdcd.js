// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n,
    i = e.f({
      process: { id: () => 241457, module: () => e.r(241457) },
      "process/": { id: () => 241457, module: () => e.r(241457) },
    })("process/"),
    {
      ArrayPrototypeIndexOf: o,
      NumberIsInteger: a,
      NumberIsNaN: s,
      NumberParseInt: l,
      ObjectDefineProperties: u,
      ObjectKeys: d,
      ObjectSetPrototypeOf: c,
      Promise: f,
      SafeSet: h,
      SymbolAsyncDispose: p,
      SymbolAsyncIterator: g,
      Symbol: b,
    } = e.r(763323);
  ((t.exports = $), ($.ReadableState = W));
  let { EventEmitter: m } = e.r(679877),
    { Stream: y, prependListener: w } = e.r(247989),
    { Buffer: v } = e.r(259390),
    { addAbortSignal: _ } = e.r(842704),
    S = e.r(294343),
    E = e.r(984651).debuglog("stream", (e) => {
      E = e;
    }),
    A = e.r(701430),
    x = e.r(340202),
    { getHighWaterMark: M, getDefaultHighWaterMark: k } = e.r(929772),
    {
      aggregateTwoErrors: P,
      codes: {
        ERR_INVALID_ARG_TYPE: O,
        ERR_METHOD_NOT_IMPLEMENTED: B,
        ERR_OUT_OF_RANGE: I,
        ERR_STREAM_PUSH_AFTER_EOF: R,
        ERR_STREAM_UNSHIFT_AFTER_END_EVENT: T,
      },
      AbortError: C,
    } = e.r(561079),
    { validateObject: j } = e.r(938720),
    N = b("kPaused"),
    { StringDecoder: L } = e.f({
      string_decoder: { id: () => 924753, module: () => e.r(924753) },
      "string_decoder/": { id: () => 924753, module: () => e.r(924753) },
    })("string_decoder/"),
    F = e.r(70867);
  (c($.prototype, y.prototype), c($, y));
  let q = () => {},
    { errorOrDestroy: D } = x;
  function U(e) {
    return {
      enumerable: !1,
      get() {
        return (this.state & e) != 0;
      },
      set(t) {
        t ? (this.state |= e) : (this.state &= ~e);
      },
    };
  }
  function W(t, r, n) {
    ("boolean" != typeof n && (n = r instanceof e.r(654547)),
      (this.state = 6192),
      t && t.objectMode && (this.state |= 1),
      n && t && t.readableObjectMode && (this.state |= 1),
      (this.highWaterMark = t ? M(this, t, "readableHighWaterMark", n) : k(!1)),
      (this.buffer = new A()),
      (this.length = 0),
      (this.pipes = []),
      (this.flowing = null),
      (this[N] = null),
      t && !1 === t.emitClose && (this.state &= -2049),
      t && !1 === t.autoDestroy && (this.state &= -4097),
      (this.errored = null),
      (this.defaultEncoding = (t && t.defaultEncoding) || "utf8"),
      (this.awaitDrainWriters = null),
      (this.decoder = null),
      (this.encoding = null),
      t &&
        t.encoding &&
        ((this.decoder = new L(t.encoding)), (this.encoding = t.encoding)));
  }
  function $(t) {
    if (!(this instanceof $)) return new $(t);
    let r = this instanceof e.r(654547);
    ((this._readableState = new W(t, this, r)),
      t &&
        ("function" == typeof t.read && (this._read = t.read),
        "function" == typeof t.destroy && (this._destroy = t.destroy),
        "function" == typeof t.construct && (this._construct = t.construct),
        t.signal && !r && _(t.signal, this)),
      y.call(this, t),
      x.construct(this, () => {
        this._readableState.needReadable && J(this, this._readableState);
      }));
  }
  function z(e, t, r, n) {
    let i;
    E("readableAddChunk", t);
    let o = e._readableState;
    if (
      ((1 & o.state) == 0 &&
        ("string" == typeof t
          ? ((r = r || o.defaultEncoding),
            o.encoding !== r &&
              (n && o.encoding
                ? (t = v.from(t, r).toString(o.encoding))
                : ((t = v.from(t, r)), (r = ""))))
          : t instanceof v
            ? (r = "")
            : y._isUint8Array(t)
              ? ((t = y._uint8ArrayToBuffer(t)), (r = ""))
              : null != t &&
                (i = new O("chunk", ["string", "Buffer", "Uint8Array"], t))),
      i)
    )
      D(e, i);
    else if (null === t)
      ((o.state &= -9),
        (function (e, t) {
          if ((E("onEofChunk"), !t.ended)) {
            if (t.decoder) {
              let e = t.decoder.end();
              e &&
                e.length &&
                (t.buffer.push(e), (t.length += t.objectMode ? 1 : e.length));
            }
            ((t.ended = !0),
              t.sync
                ? K(e)
                : ((t.needReadable = !1), (t.emittedReadable = !0), G(e)));
          }
        })(e, o));
    else if ((1 & o.state) != 0 || (t && t.length > 0))
      if (n)
        if ((4 & o.state) != 0) D(e, new T());
        else {
          if (o.destroyed || o.errored) return !1;
          H(e, o, t, !0);
        }
      else if (o.ended) D(e, new R());
      else {
        if (o.destroyed || o.errored) return !1;
        ((o.state &= -9),
          o.decoder && !r
            ? ((t = o.decoder.write(t)),
              o.objectMode || 0 !== t.length ? H(e, o, t, !1) : J(e, o))
            : H(e, o, t, !1));
      }
    else n || ((o.state &= -9), J(e, o));
    return !o.ended && (o.length < o.highWaterMark || 0 === o.length);
  }
  function H(e, t, r, n) {
    (t.flowing && 0 === t.length && !t.sync && e.listenerCount("data") > 0
      ? ((65536 & t.state) != 0
          ? t.awaitDrainWriters.clear()
          : (t.awaitDrainWriters = null),
        (t.dataEmitted = !0),
        e.emit("data", r))
      : ((t.length += t.objectMode ? 1 : r.length),
        n ? t.buffer.unshift(r) : t.buffer.push(r),
        (64 & t.state) != 0 && K(e)),
      J(e, t));
  }
  function V(e, t) {
    return e <= 0 || (0 === t.length && t.ended)
      ? 0
      : (1 & t.state) != 0
        ? 1
        : s(e)
          ? t.flowing && t.length
            ? t.buffer.first().length
            : t.length
          : e <= t.length
            ? e
            : t.ended
              ? t.length
              : 0;
  }
  function K(e) {
    let t = e._readableState;
    (E("emitReadable", t.needReadable, t.emittedReadable),
      (t.needReadable = !1),
      t.emittedReadable ||
        (E("emitReadable", t.flowing),
        (t.emittedReadable = !0),
        i.nextTick(G, e)));
  }
  function G(e) {
    let t = e._readableState;
    (E("emitReadable_", t.destroyed, t.length, t.ended),
      !t.destroyed &&
        !t.errored &&
        (t.length || t.ended) &&
        (e.emit("readable"), (t.emittedReadable = !1)),
      (t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark),
      ee(e));
  }
  function J(e, t) {
    !t.readingMore &&
      t.constructed &&
      ((t.readingMore = !0), i.nextTick(Z, e, t));
  }
  function Z(e, t) {
    for (
      ;
      !t.reading &&
      !t.ended &&
      (t.length < t.highWaterMark || (t.flowing && 0 === t.length));

    ) {
      let r = t.length;
      if ((E("maybeReadMore read 0"), e.read(0), r === t.length)) break;
    }
    t.readingMore = !1;
  }
  function Y(e) {
    let t = e._readableState;
    ((t.readableListening = e.listenerCount("readable") > 0),
      t.resumeScheduled && !1 === t[N]
        ? (t.flowing = !0)
        : e.listenerCount("data") > 0
          ? e.resume()
          : t.readableListening || (t.flowing = null));
  }
  function Q(e) {
    (E("readable nexttick read 0"), e.read(0));
  }
  function X(e, t) {
    (E("resume", t.reading),
      t.reading || e.read(0),
      (t.resumeScheduled = !1),
      e.emit("resume"),
      ee(e),
      t.flowing && !t.reading && e.read(0));
  }
  function ee(e) {
    let t = e._readableState;
    for (E("flow", t.flowing); t.flowing && null !== e.read(); );
  }
  function et(e, t) {
    "function" != typeof e.read && (e = $.wrap(e, { objectMode: !0 }));
    let r = er(e, t);
    return ((r.stream = e), r);
  }
  async function* er(e, t) {
    let r,
      n = q;
    function i(t) {
      this === e ? (n(), (n = q)) : (n = t);
    }
    e.on("readable", i);
    let o = S(e, { writable: !1 }, (e) => {
      ((r = e ? P(r, e) : null), n(), (n = q));
    });
    try {
      for (;;) {
        let t = e.destroyed ? null : e.read();
        if (null !== t) yield t;
        else if (r) throw r;
        else {
          if (null === r) return;
          await new f(i);
        }
      }
    } catch (e) {
      throw (r = P(r, e));
    } finally {
      (r || (null == t ? void 0 : t.destroyOnReturn) !== !1) &&
      (void 0 === r || e._readableState.autoDestroy)
        ? x.destroyer(e, null)
        : (e.off("readable", i), o());
    }
  }
  function en(e, t) {
    let r;
    return 0 === t.length
      ? null
      : (t.objectMode
          ? (r = t.buffer.shift())
          : !e || e >= t.length
            ? ((r = t.decoder
                ? t.buffer.join("")
                : 1 === t.buffer.length
                  ? t.buffer.first()
                  : t.buffer.concat(t.length)),
              t.buffer.clear())
            : (r = t.buffer.consume(e, t.decoder)),
        r);
  }
  function ei(e) {
    let t = e._readableState;
    (E("endReadable", t.endEmitted),
      t.endEmitted || ((t.ended = !0), i.nextTick(eo, t, e)));
  }
  function eo(e, t) {
    if (
      (E("endReadableNT", e.endEmitted, e.length),
      !e.errored && !e.closeEmitted && !e.endEmitted && 0 === e.length)
    ) {
      if (
        ((e.endEmitted = !0),
        t.emit("end"),
        t.writable && !1 === t.allowHalfOpen)
      )
        i.nextTick(ea, t);
      else if (e.autoDestroy) {
        let e = t._writableState;
        (!e || (e.autoDestroy && (e.finished || !1 === e.writable))) &&
          t.destroy();
      }
    }
  }
  function ea(e) {
    !e.writable || e.writableEnded || e.destroyed || e.end();
  }
  function es() {
    return (void 0 === n && (n = {}), n);
  }
  (u(W.prototype, {
    objectMode: U(1),
    ended: U(2),
    endEmitted: U(4),
    reading: U(8),
    constructed: U(16),
    sync: U(32),
    needReadable: U(64),
    emittedReadable: U(128),
    readableListening: U(256),
    resumeScheduled: U(512),
    errorEmitted: U(1024),
    emitClose: U(2048),
    autoDestroy: U(4096),
    destroyed: U(8192),
    closed: U(16384),
    closeEmitted: U(32768),
    multiAwaitDrain: U(65536),
    readingMore: U(131072),
    dataEmitted: U(262144),
  }),
    ($.prototype.destroy = x.destroy),
    ($.prototype._undestroy = x.undestroy),
    ($.prototype._destroy = function (e, t) {
      t(e);
    }),
    ($.prototype[m.captureRejectionSymbol] = function (e) {
      this.destroy(e);
    }),
    ($.prototype[p] = function () {
      let e;
      return (
        this.destroyed ||
          ((e = this.readableEnded ? null : new C()), this.destroy(e)),
        new f((t, r) => S(this, (n) => (n && n !== e ? r(n) : t(null))))
      );
    }),
    ($.prototype.push = function (e, t) {
      return z(this, e, t, !1);
    }),
    ($.prototype.unshift = function (e, t) {
      return z(this, e, t, !0);
    }),
    ($.prototype.isPaused = function () {
      let e = this._readableState;
      return !0 === e[N] || !1 === e.flowing;
    }),
    ($.prototype.setEncoding = function (e) {
      let t = new L(e);
      ((this._readableState.decoder = t),
        (this._readableState.encoding = this._readableState.decoder.encoding));
      let r = this._readableState.buffer,
        n = "";
      for (let e of r) n += t.write(e);
      return (
        r.clear(),
        "" !== n && r.push(n),
        (this._readableState.length = n.length),
        this
      );
    }),
    ($.prototype.read = function (e) {
      let t;
      (E("read", e), void 0 === e ? (e = 0 / 0) : a(e) || (e = l(e, 10)));
      let r = this._readableState,
        n = e;
      if (
        (e > r.highWaterMark &&
          (r.highWaterMark = (function (e) {
            if (e > 0x40000000) throw new I("size", "<= 1GiB", e);
            return (
              e--,
              (e |= e >>> 1),
              (e |= e >>> 2),
              (e |= e >>> 4),
              (e |= e >>> 8),
              (e |= e >>> 16),
              ++e
            );
          })(e)),
        0 !== e && (r.state &= -129),
        0 === e &&
          r.needReadable &&
          ((0 !== r.highWaterMark
            ? r.length >= r.highWaterMark
            : r.length > 0) ||
            r.ended))
      )
        return (
          E("read: emitReadable", r.length, r.ended),
          0 === r.length && r.ended ? ei(this) : K(this),
          null
        );
      if (0 === (e = V(e, r)) && r.ended)
        return (0 === r.length && ei(this), null);
      let i = (64 & r.state) != 0;
      if (
        (E("need readable", i),
        (0 === r.length || r.length - e < r.highWaterMark) &&
          E("length less than watermark", (i = !0)),
        r.ended || r.reading || r.destroyed || r.errored || !r.constructed)
      )
        E("reading, ended or constructing", (i = !1));
      else if (i) {
        (E("do read"), (r.state |= 40), 0 === r.length && (r.state |= 64));
        try {
          this._read(r.highWaterMark);
        } catch (e) {
          D(this, e);
        }
        ((r.state &= -33), r.reading || (e = V(n, r)));
      }
      return (
        null === (t = e > 0 ? en(e, r) : null)
          ? ((r.needReadable = r.length <= r.highWaterMark), (e = 0))
          : ((r.length -= e),
            r.multiAwaitDrain
              ? r.awaitDrainWriters.clear()
              : (r.awaitDrainWriters = null)),
        0 === r.length &&
          (r.ended || (r.needReadable = !0), n !== e && r.ended && ei(this)),
        null === t ||
          r.errorEmitted ||
          r.closeEmitted ||
          ((r.dataEmitted = !0), this.emit("data", t)),
        t
      );
    }),
    ($.prototype._read = function (e) {
      throw new B("_read()");
    }),
    ($.prototype.pipe = function (e, t) {
      let r,
        n = this,
        o = this._readableState;
      (1 !== o.pipes.length ||
        o.multiAwaitDrain ||
        ((o.multiAwaitDrain = !0),
        (o.awaitDrainWriters = new h(
          o.awaitDrainWriters ? [o.awaitDrainWriters] : [],
        ))),
        o.pipes.push(e),
        E("pipe count=%d opts=%j", o.pipes.length, t));
      let a = (t && !1 === t.end) || e === i.stdout || e === i.stderr ? g : s;
      function s() {
        (E("onend"), e.end());
      }
      (o.endEmitted ? i.nextTick(a) : n.once("end", a),
        e.on("unpipe", function t(i, a) {
          (E("onunpipe"),
            i === n &&
              a &&
              !1 === a.hasUnpiped &&
              ((a.hasUnpiped = !0),
              E("cleanup"),
              e.removeListener("close", f),
              e.removeListener("finish", p),
              r && e.removeListener("drain", r),
              e.removeListener("error", c),
              e.removeListener("unpipe", t),
              n.removeListener("end", s),
              n.removeListener("end", g),
              n.removeListener("data", d),
              (l = !0),
              r &&
                o.awaitDrainWriters &&
                (!e._writableState || e._writableState.needDrain) &&
                r()));
        }));
      let l = !1;
      function u() {
        var t, i;
        (l ||
          (1 === o.pipes.length && o.pipes[0] === e
            ? (E("false write response, pause", 0),
              (o.awaitDrainWriters = e),
              (o.multiAwaitDrain = !1))
            : o.pipes.length > 1 &&
              o.pipes.includes(e) &&
              (E("false write response, pause", o.awaitDrainWriters.size),
              o.awaitDrainWriters.add(e)),
          n.pause()),
          r ||
            ((t = n),
            (i = e),
            (r = function () {
              let e = t._readableState;
              (e.awaitDrainWriters === i
                ? (E("pipeOnDrain", 1), (e.awaitDrainWriters = null))
                : e.multiAwaitDrain &&
                  (E("pipeOnDrain", e.awaitDrainWriters.size),
                  e.awaitDrainWriters.delete(i)),
                (!e.awaitDrainWriters || 0 === e.awaitDrainWriters.size) &&
                  t.listenerCount("data") &&
                  t.resume());
            }),
            e.on("drain", r)));
      }
      function d(t) {
        E("ondata");
        let r = e.write(t);
        (E("dest.write", r), !1 === r && u());
      }
      function c(t) {
        if (
          (E("onerror", t),
          g(),
          e.removeListener("error", c),
          0 === e.listenerCount("error"))
        ) {
          let r = e._writableState || e._readableState;
          r && !r.errorEmitted ? D(e, t) : e.emit("error", t);
        }
      }
      function f() {
        (e.removeListener("finish", p), g());
      }
      function p() {
        (E("onfinish"), e.removeListener("close", f), g());
      }
      function g() {
        (E("unpipe"), n.unpipe(e));
      }
      return (
        n.on("data", d),
        w(e, "error", c),
        e.once("close", f),
        e.once("finish", p),
        e.emit("pipe", n),
        !0 === e.writableNeedDrain
          ? u()
          : o.flowing || (E("pipe resume"), n.resume()),
        e
      );
    }),
    ($.prototype.unpipe = function (e) {
      let t = this._readableState;
      if (0 === t.pipes.length) return this;
      if (!e) {
        let e = t.pipes;
        ((t.pipes = []), this.pause());
        for (let t = 0; t < e.length; t++)
          e[t].emit("unpipe", this, { hasUnpiped: !1 });
        return this;
      }
      let r = o(t.pipes, e);
      return (
        -1 === r ||
          (t.pipes.splice(r, 1),
          0 === t.pipes.length && this.pause(),
          e.emit("unpipe", this, { hasUnpiped: !1 })),
        this
      );
    }),
    ($.prototype.on = function (e, t) {
      let r = y.prototype.on.call(this, e, t),
        n = this._readableState;
      return (
        "data" === e
          ? ((n.readableListening = this.listenerCount("readable") > 0),
            !1 !== n.flowing && this.resume())
          : "readable" !== e ||
            n.endEmitted ||
            n.readableListening ||
            ((n.readableListening = n.needReadable = !0),
            (n.flowing = !1),
            (n.emittedReadable = !1),
            E("on readable", n.length, n.reading),
            n.length ? K(this) : n.reading || i.nextTick(Q, this)),
        r
      );
    }),
    ($.prototype.addListener = $.prototype.on),
    ($.prototype.removeListener = function (e, t) {
      let r = y.prototype.removeListener.call(this, e, t);
      return ("readable" === e && i.nextTick(Y, this), r);
    }),
    ($.prototype.off = $.prototype.removeListener),
    ($.prototype.removeAllListeners = function (e) {
      let t = y.prototype.removeAllListeners.apply(this, arguments);
      return (("readable" === e || void 0 === e) && i.nextTick(Y, this), t);
    }),
    ($.prototype.resume = function () {
      var e, t;
      let r = this._readableState;
      return (
        r.flowing ||
          (E("resume"),
          (r.flowing = !r.readableListening),
          (e = this),
          (t = r).resumeScheduled ||
            ((t.resumeScheduled = !0), i.nextTick(X, e, t))),
        (r[N] = !1),
        this
      );
    }),
    ($.prototype.pause = function () {
      return (
        E("call pause flowing=%j", this._readableState.flowing),
        !1 !== this._readableState.flowing &&
          (E("pause"), (this._readableState.flowing = !1), this.emit("pause")),
        (this._readableState[N] = !0),
        this
      );
    }),
    ($.prototype.wrap = function (e) {
      let t = !1;
      (e.on("data", (r) => {
        !this.push(r) && e.pause && ((t = !0), e.pause());
      }),
        e.on("end", () => {
          this.push(null);
        }),
        e.on("error", (e) => {
          D(this, e);
        }),
        e.on("close", () => {
          this.destroy();
        }),
        e.on("destroy", () => {
          this.destroy();
        }),
        (this._read = () => {
          t && e.resume && ((t = !1), e.resume());
        }));
      let r = d(e);
      for (let t = 1; t < r.length; t++) {
        let n = r[t];
        void 0 === this[n] &&
          "function" == typeof e[n] &&
          (this[n] = e[n].bind(e));
      }
      return this;
    }),
    ($.prototype[g] = function () {
      return et(this);
    }),
    ($.prototype.iterator = function (e) {
      return (void 0 !== e && j(e, "options"), et(this, e));
    }),
    u($.prototype, {
      readable: {
        __proto__: null,
        get() {
          let e = this._readableState;
          return (
            !!e &&
            !1 !== e.readable &&
            !e.destroyed &&
            !e.errorEmitted &&
            !e.endEmitted
          );
        },
        set(e) {
          this._readableState && (this._readableState.readable = !!e);
        },
      },
      readableDidRead: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return this._readableState.dataEmitted;
        },
      },
      readableAborted: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return !!(
            !1 !== this._readableState.readable &&
            (this._readableState.destroyed || this._readableState.errored) &&
            !this._readableState.endEmitted
          );
        },
      },
      readableHighWaterMark: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return this._readableState.highWaterMark;
        },
      },
      readableBuffer: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return this._readableState && this._readableState.buffer;
        },
      },
      readableFlowing: {
        __proto__: null,
        enumerable: !1,
        get: function () {
          return this._readableState.flowing;
        },
        set: function (e) {
          this._readableState && (this._readableState.flowing = e);
        },
      },
      readableLength: {
        __proto__: null,
        enumerable: !1,
        get() {
          return this._readableState.length;
        },
      },
      readableObjectMode: {
        __proto__: null,
        enumerable: !1,
        get() {
          return !!this._readableState && this._readableState.objectMode;
        },
      },
      readableEncoding: {
        __proto__: null,
        enumerable: !1,
        get() {
          return this._readableState ? this._readableState.encoding : null;
        },
      },
      errored: {
        __proto__: null,
        enumerable: !1,
        get() {
          return this._readableState ? this._readableState.errored : null;
        },
      },
      closed: {
        __proto__: null,
        get() {
          return !!this._readableState && this._readableState.closed;
        },
      },
      destroyed: {
        __proto__: null,
        enumerable: !1,
        get() {
          return !!this._readableState && this._readableState.destroyed;
        },
        set(e) {
          this._readableState && (this._readableState.destroyed = e);
        },
      },
      readableEnded: {
        __proto__: null,
        enumerable: !1,
        get() {
          return !!this._readableState && this._readableState.endEmitted;
        },
      },
    }),
    u(W.prototype, {
      pipesCount: {
        __proto__: null,
        get() {
          return this.pipes.length;
        },
      },
      paused: {
        __proto__: null,
        get() {
          return !1 !== this[N];
        },
        set(e) {
          this[N] = !!e;
        },
      },
    }),
    ($._fromList = en),
    ($.from = function (e, t) {
      return F($, e, t);
    }),
    ($.fromWeb = function (e, t) {
      return es().newStreamReadableFromReadableStream(e, t);
    }),
    ($.toWeb = function (e, t) {
      return es().newReadableStreamFromStreamReadable(e, t);
    }),
    ($.wrap = function (e, t) {
      var r, n;
      return new $({
        objectMode:
          null == (r = null != (n = e.readableObjectMode) ? n : e.objectMode) ||
          r,
        ...t,
        destroy(t, r) {
          (x.destroyer(e, t), r(t));
        },
      }).wrap(e);
    }));
};
