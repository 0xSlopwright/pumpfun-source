// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e = BigInt(0xffffffff),
    r = BigInt(32);
  t.s([
    "s",
    0,
    function (t, e, r, n) {
      let i = (e >>> 0) + (n >>> 0);
      return { h: (t + r + ((i / 0x100000000) | 0)) | 0, l: 0 | i };
    },
    "H",
    0,
    (t, e, r, n) => (e + r + n + ((t / 0x100000000) | 0)) | 0,
    "d",
    0,
    (t, e, r) => (t >>> 0) + (e >>> 0) + (r >>> 0),
    "l",
    0,
    (t, e, r, n, i) => (e + r + n + i + ((t / 0x100000000) | 0)) | 0,
    "Z",
    0,
    (t, e, r, n) => (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0),
    "p",
    0,
    (t, e, r, n, i, o) => (e + r + n + i + o + ((t / 0x100000000) | 0)) | 0,
    "c",
    0,
    (t, e, r, n, i) =>
      (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0),
    "v",
    0,
    (t, e, r) => (e << (r - 32)) | (t >>> (64 - r)),
    "L",
    0,
    (t, e, r) => (t << (r - 32)) | (e >>> (64 - r)),
    "C",
    0,
    (t, e, r) => (t << r) | (e >>> (32 - r)),
    "t",
    0,
    (t, e, r) => (e << r) | (t >>> (32 - r)),
    "u",
    0,
    (t, e, r) => (t << (64 - r)) | (e >>> (r - 32)),
    "N",
    0,
    (t, e, r) => (t >>> (r - 32)) | (e << (64 - r)),
    "q",
    0,
    (t, e, r) => (t >>> r) | (e << (32 - r)),
    "h",
    0,
    (t, e, r) => (t << (32 - r)) | (e >>> r),
    "a",
    0,
    (t, e, r) => t >>> r,
    "I",
    0,
    (t, e, r) => (t << (32 - r)) | (e >>> r),
    "$",
    0,
    function (t, n = !1) {
      let i = t.length,
        o = new Uint32Array(i),
        s = new Uint32Array(i);
      for (let f = 0; f < i; f++) {
        let { h: i, l: h } = (function (t, n = !1) {
          return n
            ? { h: Number(t & e), l: Number((t >> r) & e) }
            : { h: 0 | Number((t >> r) & e), l: 0 | Number(t & e) };
        })(t[f], n);
        [o[f], s[f]] = [i, h];
      }
      return [o, s];
    },
  ]);
};
