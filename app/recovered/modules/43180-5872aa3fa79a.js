// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t;
  function r(e) {
    let r;
    return (
      t || (t = new Map()),
      t.has(e)
        ? (r = t.get(e))
        : ((r = {
            records_count: 0,
            segments_count: 0,
            segments_total_raw_size: 0,
          }),
          t.set(e, r),
          t.size > 1e3 &&
            (function () {
              if (!t) return;
              let e = t.keys().next().value;
              e && t.delete(e);
            })()),
      r
    );
  }
  e.s([
    "e",
    0,
    function (e) {
      r(e).records_count += 1;
    },
    "Z",
    0,
    function (e) {
      r(e).segments_count += 1;
    },
    "X",
    0,
    function (e, t) {
      r(e).segments_total_raw_size += t;
    },
    "Y",
    0,
    function (e) {
      return null == t ? void 0 : t.get(e);
    },
    "V",
    0,
    function (e) {
      return r(e).segments_count;
    },
  ]);
};
