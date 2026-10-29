// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { pipeline: n } = e.r(755755),
    i = e.r(654547),
    { destroyer: o } = e.r(340202),
    {
      isNodeStream: a,
      isReadable: s,
      isWritable: l,
      isWebStream: u,
      isTransformStream: d,
      isWritableStream: c,
      isReadableStream: f,
    } = e.r(283234),
    {
      AbortError: h,
      codes: { ERR_INVALID_ARG_VALUE: p, ERR_MISSING_ARGS: g },
    } = e.r(561079),
    b = e.r(294343);
  t.exports = function (...e) {
    let t, r, m, y, w;
    if (0 === e.length) throw new g("streams");
    if (1 === e.length) return i.from(e[0]);
    let v = [...e];
    if (
      ("function" == typeof e[0] && (e[0] = i.from(e[0])),
      "function" == typeof e[e.length - 1])
    ) {
      let t = e.length - 1;
      e[t] = i.from(e[t]);
    }
    for (let t = 0; t < e.length; ++t)
      if (a(e[t]) || u(e[t])) {
        if (t < e.length - 1 && !(s(e[t]) || f(e[t]) || d(e[t])))
          throw new p(`streams[${t}]`, v[t], "must be readable");
        if (t > 0 && !(l(e[t]) || c(e[t]) || d(e[t])))
          throw new p(`streams[${t}]`, v[t], "must be writable");
      }
    let _ = e[0],
      S = n(e, function (e) {
        let t = y;
        ((y = null), t ? t(e) : e ? w.destroy(e) : A || E || w.destroy());
      }),
      E = !!(l(_) || c(_) || d(_)),
      A = !!(s(S) || f(S) || d(S));
    if (
      ((w = new i({
        writableObjectMode: !!(null != _ && _.writableObjectMode),
        readableObjectMode: !!(null != S && S.readableObjectMode),
        writable: E,
        readable: A,
      })),
      E)
    ) {
      if (a(_))
        ((w._write = function (e, r, n) {
          _.write(e, r) ? n() : (t = n);
        }),
          (w._final = function (e) {
            (_.end(), (r = e));
          }),
          _.on("drain", function () {
            if (t) {
              let e = t;
              ((t = null), e());
            }
          }));
      else if (u(_)) {
        let e = (d(_) ? _.writable : _).getWriter();
        ((w._write = async function (t, r, n) {
          try {
            (await e.ready, e.write(t).catch(() => {}), n());
          } catch (e) {
            n(e);
          }
        }),
          (w._final = async function (t) {
            try {
              (await e.ready, e.close().catch(() => {}), (r = t));
            } catch (e) {
              t(e);
            }
          }));
      }
      b(d(S) ? S.readable : S, () => {
        if (r) {
          let e = r;
          ((r = null), e());
        }
      });
    }
    if (A) {
      if (a(S))
        (S.on("readable", function () {
          if (m) {
            let e = m;
            ((m = null), e());
          }
        }),
          S.on("end", function () {
            w.push(null);
          }),
          (w._read = function () {
            for (;;) {
              let e = S.read();
              if (null === e) {
                m = w._read;
                return;
              }
              if (!w.push(e)) return;
            }
          }));
      else if (u(S)) {
        let e = (d(S) ? S.readable : S).getReader();
        w._read = async function () {
          for (;;)
            try {
              let { value: t, done: r } = await e.read();
              if (!w.push(t)) return;
              if (r) return void w.push(null);
            } catch {
              return;
            }
        };
      }
    }
    return (
      (w._destroy = function (e, n) {
        (e || null === y || (e = new h()),
          (m = null),
          (t = null),
          (r = null),
          null === y ? n(e) : ((y = n), a(S) && o(S, e)));
      }),
      w
    );
  };
};
