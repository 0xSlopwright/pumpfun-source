// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { MathFloor: n, NumberIsInteger: i } = e.r(763323),
    { validateInteger: o } = e.r(938720),
    { ERR_INVALID_ARG_VALUE: a } = e.r(561079).codes,
    s = 16384,
    l = 16;
  function u(e) {
    return e ? l : s;
  }
  t.exports = {
    getHighWaterMark: function (e, t, r, o) {
      let s = null != t.highWaterMark ? t.highWaterMark : o ? t[r] : null;
      if (null != s) {
        if (!i(s) || s < 0)
          throw new a(o ? `options.${r}` : "options.highWaterMark", s);
        return n(s);
      }
      return u(e.objectMode);
    },
    getDefaultHighWaterMark: u,
    setDefaultHighWaterMark: function (e, t) {
      (o(t, "value", 0), e ? (l = t) : (s = t));
    },
  };
};
