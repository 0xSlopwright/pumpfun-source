// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n,
    i = e.f({
      process: { id: () => 241457, module: () => e.r(241457) },
      "process/": { id: () => 241457, module: () => e.r(241457) },
    })("process/"),
    { AbortError: o, codes: a } = e.r(561079),
    { ERR_INVALID_ARG_TYPE: s, ERR_STREAM_PREMATURE_CLOSE: l } = a,
    { kEmptyObject: u, once: d } = e.r(984651),
    {
      validateAbortSignal: c,
      validateFunction: f,
      validateObject: h,
      validateBoolean: p,
    } = e.r(938720),
    { Promise: g, PromisePrototypeThen: b, SymbolDispose: m } = e.r(763323),
    {
      isClosed: y,
      isReadable: w,
      isReadableNodeStream: v,
      isReadableStream: _,
      isReadableFinished: S,
      isReadableErrored: E,
      isWritable: A,
      isWritableNodeStream: x,
      isWritableStream: M,
      isWritableFinished: k,
      isWritableErrored: P,
      isNodeStream: O,
      willEmitClose: B,
      kIsClosedPromise: I,
    } = e.r(283234),
    R = () => {};
  function T(t, r, a) {
    var p, g;
    if (
      (2 == arguments.length
        ? ((a = r), (r = u))
        : null == r
          ? (r = u)
          : h(r, "options"),
      f(a, "callback"),
      c(r.signal, "options.signal"),
      (a = d(a)),
      _(t) || M(t))
    )
      return (function (t, r, a) {
        let s = !1,
          l = R;
        if (r.signal)
          if (
            ((l = () => {
              ((s = !0), a.call(t, new o(void 0, { cause: r.signal.reason })));
            }),
            r.signal.aborted)
          )
            i.nextTick(l);
          else {
            let i = (n = n || e.r(984651).addAbortListener)(r.signal, l),
              o = a;
            a = d((...e) => {
              (i[m](), o.apply(t, e));
            });
          }
        let u = (...e) => {
          s || i.nextTick(() => a.apply(t, e));
        };
        return (b(t[I].promise, u, u), R);
      })(t, r, a);
    if (!O(t))
      throw new s("stream", ["ReadableStream", "WritableStream", "Stream"], t);
    let T = null != (p = r.readable) ? p : v(t),
      C = null != (g = r.writable) ? g : x(t),
      j = t._writableState,
      N = t._readableState,
      L = () => {
        t.writable || D();
      },
      F = B(t) && v(t) === T && x(t) === C,
      q = k(t, !1),
      D = () => {
        ((q = !0),
          t.destroyed && (F = !1),
          (F && (!t.readable || T)) || ((!T || U) && a.call(t)));
      },
      U = S(t, !1),
      W = () => {
        ((U = !0),
          t.destroyed && (F = !1),
          (F && (!t.writable || C)) || ((!C || q) && a.call(t)));
      },
      $ = (e) => {
        a.call(t, e);
      },
      z = y(t),
      H = () => {
        z = !0;
        let e = P(t) || E(t);
        return e && "boolean" != typeof e
          ? a.call(t, e)
          : (T && !U && v(t, !0) && !S(t, !1)) || (C && !q && !k(t, !1))
            ? a.call(t, new l())
            : void a.call(t);
      },
      V = () => {
        z = !0;
        let e = P(t) || E(t);
        if (e && "boolean" != typeof e) return a.call(t, e);
        a.call(t);
      },
      K = () => {
        t.req.on("finish", D);
      };
    (t.setHeader && "function" == typeof t.abort
      ? (t.on("complete", D),
        F || t.on("abort", H),
        t.req ? K() : t.on("request", K))
      : C && !j && (t.on("end", L), t.on("close", L)),
      F || "boolean" != typeof t.aborted || t.on("aborted", H),
      t.on("end", W),
      t.on("finish", D),
      !1 !== r.error && t.on("error", $),
      t.on("close", H),
      z
        ? i.nextTick(H)
        : (null != j && j.errorEmitted) || (null != N && N.errorEmitted)
          ? F || i.nextTick(V)
          : (!T && (!F || w(t)) && (q || !1 === A(t))) ||
              (!C && (!F || A(t)) && (U || !1 === w(t)))
            ? i.nextTick(V)
            : N && t.req && t.aborted && i.nextTick(V));
    let G = () => {
      ((a = R),
        t.removeListener("aborted", H),
        t.removeListener("complete", D),
        t.removeListener("abort", H),
        t.removeListener("request", K),
        t.req && t.req.removeListener("finish", D),
        t.removeListener("end", L),
        t.removeListener("close", L),
        t.removeListener("finish", D),
        t.removeListener("end", W),
        t.removeListener("error", $),
        t.removeListener("close", H));
    };
    if (r.signal && !z) {
      let s = () => {
        let e = a;
        (G(), e.call(t, new o(void 0, { cause: r.signal.reason })));
      };
      if (r.signal.aborted) i.nextTick(s);
      else {
        let i = (n = n || e.r(984651).addAbortListener)(r.signal, s),
          o = a;
        a = d((...e) => {
          (i[m](), o.apply(t, e));
        });
      }
    }
    return G;
  }
  ((t.exports = T),
    (t.exports.finished = function (e, t) {
      var r;
      let n = !1;
      return (
        null === t && (t = u),
        null != (r = t) &&
          r.cleanup &&
          (p(t.cleanup, "cleanup"), (n = t.cleanup)),
        new g((r, i) => {
          let o = T(e, t, (e) => {
            (n && o(), e ? i(e) : r());
          });
        })
      );
    }));
};
