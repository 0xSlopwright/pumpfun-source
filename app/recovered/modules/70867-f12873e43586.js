// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = e.f({
      process: { id: () => 241457, module: () => e.r(241457) },
      "process/": { id: () => 241457, module: () => e.r(241457) },
    })("process/"),
    {
      PromisePrototypeThen: i,
      SymbolAsyncIterator: o,
      SymbolIterator: a,
    } = e.r(763323),
    { Buffer: s } = e.r(259390),
    { ERR_INVALID_ARG_TYPE: l, ERR_STREAM_NULL_VALUES: u } = e.r(561079).codes;
  t.exports = function (e, t, r) {
    let d, c;
    if ("string" == typeof t || t instanceof s)
      return new e({
        objectMode: !0,
        ...r,
        read() {
          (this.push(t), this.push(null));
        },
      });
    if (t && t[o]) ((c = !0), (d = t[o]()));
    else if (t && t[a]) ((c = !1), (d = t[a]()));
    else throw new l("iterable", ["Iterable"], t);
    let f = new e({ objectMode: !0, highWaterMark: 1, ...r }),
      h = !1;
    async function p(e) {
      let t = null != e,
        r = "function" == typeof d.throw;
      if (t && r) {
        let { value: t, done: r } = await d.throw(e);
        if ((await t, r)) return;
      }
      if ("function" == typeof d.return) {
        let { value: e } = await d.return();
        await e;
      }
    }
    async function g() {
      for (;;) {
        try {
          let { value: e, done: t } = c ? await d.next() : d.next();
          if (t) f.push(null);
          else {
            let t = e && "function" == typeof e.then ? await e : e;
            if (null === t) throw ((h = !1), new u());
            if (f.push(t)) continue;
            h = !1;
          }
        } catch (e) {
          f.destroy(e);
        }
        break;
      }
    }
    return (
      (f._read = function () {
        h || ((h = !0), g());
      }),
      (f._destroy = function (e, t) {
        i(
          p(e),
          () => n.nextTick(t, e),
          (r) => n.nextTick(t, r || e),
        );
      }),
      f
    );
  };
};
