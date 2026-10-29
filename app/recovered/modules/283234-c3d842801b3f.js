// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { SymbolAsyncIterator: n, SymbolIterator: i, SymbolFor: o } = e.r(763323),
    a = o("nodejs.stream.destroyed"),
    s = o("nodejs.stream.errored"),
    l = o("nodejs.stream.readable"),
    u = o("nodejs.stream.writable"),
    d = o("nodejs.stream.disturbed"),
    c = o("nodejs.webstream.isClosedPromise");
  function f(e, t = !1) {
    var r;
    return !!(
      e &&
      "function" == typeof e.pipe &&
      "function" == typeof e.on &&
      (!t || ("function" == typeof e.pause && "function" == typeof e.resume)) &&
      (!e._writableState ||
        (null == (r = e._readableState) ? void 0 : r.readable) !== !1) &&
      (!e._writableState || e._readableState)
    );
  }
  function h(e) {
    var t;
    return !!(
      e &&
      "function" == typeof e.write &&
      "function" == typeof e.on &&
      (!e._readableState ||
        (null == (t = e._writableState) ? void 0 : t.writable) !== !1)
    );
  }
  function p(e) {
    return (
      e &&
      (e._readableState ||
        e._writableState ||
        ("function" == typeof e.write && "function" == typeof e.on) ||
        ("function" == typeof e.pipe && "function" == typeof e.on))
    );
  }
  function g(e) {
    return !!(
      e &&
      !p(e) &&
      "function" == typeof e.pipeThrough &&
      "function" == typeof e.getReader &&
      "function" == typeof e.cancel
    );
  }
  function b(e) {
    return !!(
      e &&
      !p(e) &&
      "function" == typeof e.getWriter &&
      "function" == typeof e.abort
    );
  }
  function m(e) {
    return !!(
      e &&
      !p(e) &&
      "object" == typeof e.readable &&
      "object" == typeof e.writable
    );
  }
  function y(e) {
    if (!p(e)) return null;
    let t = e._writableState,
      r = e._readableState,
      n = t || r;
    return !!(e.destroyed || e[a] || (null != n && n.destroyed));
  }
  function w(e) {
    if (!h(e)) return null;
    if (!0 === e.writableEnded) return !0;
    let t = e._writableState;
    return (
      (null == t || !t.errored) &&
      ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
    );
  }
  function v(e, t) {
    if (!f(e)) return null;
    let r = e._readableState;
    return (
      (null == r || !r.errored) &&
      ("boolean" != typeof (null == r ? void 0 : r.endEmitted)
        ? null
        : !!(r.endEmitted || (!1 === t && !0 === r.ended && 0 === r.length)))
    );
  }
  function _(e) {
    return e && null != e[l]
      ? e[l]
      : "boolean" != typeof (null == e ? void 0 : e.readable)
        ? null
        : !y(e) && f(e) && e.readable && !v(e);
  }
  function S(e) {
    return e && null != e[u]
      ? e[u]
      : "boolean" != typeof (null == e ? void 0 : e.writable)
        ? null
        : !y(e) && h(e) && e.writable && !w(e);
  }
  function E(e) {
    return (
      "boolean" == typeof e._closed &&
      "boolean" == typeof e._defaultKeepAlive &&
      "boolean" == typeof e._removedConnection &&
      "boolean" == typeof e._removedContLen
    );
  }
  function A(e) {
    return "boolean" == typeof e._sent100 && E(e);
  }
  t.exports = {
    isDestroyed: y,
    kIsDestroyed: a,
    isDisturbed: function (e) {
      var t;
      return !!(
        e && (null != (t = e[d]) ? t : e.readableDidRead || e.readableAborted)
      );
    },
    kIsDisturbed: d,
    isErrored: function (e) {
      var t, r, n, i, o, a, l, u, d, c;
      return !!(
        e &&
        (null !=
        (t =
          null !=
          (r =
            null !=
            (n =
              null !=
              (i =
                null != (o = null != (a = e[s]) ? a : e.readableErrored)
                  ? o
                  : e.writableErrored)
                ? i
                : null == (l = e._readableState)
                  ? void 0
                  : l.errorEmitted)
              ? n
              : null == (u = e._writableState)
                ? void 0
                : u.errorEmitted)
            ? r
            : null == (d = e._readableState)
              ? void 0
              : d.errored)
          ? t
          : null == (c = e._writableState)
            ? void 0
            : c.errored)
      );
    },
    kIsErrored: s,
    isReadable: _,
    kIsReadable: l,
    kIsClosedPromise: c,
    kControllerErrorFunction: o("nodejs.webstream.controllerErrorFunction"),
    kIsWritable: u,
    isClosed: function (e) {
      if (!p(e)) return null;
      if ("boolean" == typeof e.closed) return e.closed;
      let t = e._writableState,
        r = e._readableState;
      return "boolean" == typeof (null == t ? void 0 : t.closed) ||
        "boolean" == typeof (null == r ? void 0 : r.closed)
        ? (null == t ? void 0 : t.closed) || (null == r ? void 0 : r.closed)
        : "boolean" == typeof e._closed && E(e)
          ? e._closed
          : null;
    },
    isDuplexNodeStream: function (e) {
      return !!(
        e &&
        "function" == typeof e.pipe &&
        e._readableState &&
        "function" == typeof e.on &&
        "function" == typeof e.write
      );
    },
    isFinished: function (e, t) {
      return p(e)
        ? !!y(e) ||
            !(
              ((null == t ? void 0 : t.readable) !== !1 && _(e)) ||
              ((null == t ? void 0 : t.writable) !== !1 && S(e))
            )
        : null;
    },
    isIterable: function (e, t) {
      return (
        null != e &&
        (!0 === t
          ? "function" == typeof e[n]
          : !1 === t
            ? "function" == typeof e[i]
            : "function" == typeof e[n] || "function" == typeof e[i])
      );
    },
    isReadableNodeStream: f,
    isReadableStream: g,
    isReadableEnded: function (e) {
      if (!f(e)) return null;
      if (!0 === e.readableEnded) return !0;
      let t = e._readableState;
      return (
        !!t &&
        !t.errored &&
        ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
      );
    },
    isReadableFinished: v,
    isReadableErrored: function (e) {
      var t, r;
      return p(e)
        ? e.readableErrored
          ? e.readableErrored
          : null != (t = null == (r = e._readableState) ? void 0 : r.errored)
            ? t
            : null
        : null;
    },
    isNodeStream: p,
    isWebStream: function (e) {
      return g(e) || b(e) || m(e);
    },
    isWritable: S,
    isWritableNodeStream: h,
    isWritableStream: b,
    isWritableEnded: w,
    isWritableFinished: function (e, t) {
      if (!h(e)) return null;
      if (!0 === e.writableFinished) return !0;
      let r = e._writableState;
      return (
        (null == r || !r.errored) &&
        ("boolean" != typeof (null == r ? void 0 : r.finished)
          ? null
          : !!(r.finished || (!1 === t && !0 === r.ended && 0 === r.length)))
      );
    },
    isWritableErrored: function (e) {
      var t, r;
      return p(e)
        ? e.writableErrored
          ? e.writableErrored
          : null != (t = null == (r = e._writableState) ? void 0 : r.errored)
            ? t
            : null
        : null;
    },
    isServerRequest: function (e) {
      var t;
      return (
        "boolean" == typeof e._consuming &&
        "boolean" == typeof e._dumped &&
        (null == (t = e.req) ? void 0 : t.upgradeOrConnect) === void 0
      );
    },
    isServerResponse: A,
    willEmitClose: function (e) {
      if (!p(e)) return null;
      let t = e._writableState,
        r = e._readableState,
        n = t || r;
      return (
        (!n && A(e)) || !!(n && n.autoDestroy && n.emitClose && !1 === n.closed)
      );
    },
    isTransformStream: m,
  };
};
