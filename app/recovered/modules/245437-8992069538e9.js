// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767).rotr32;
  function i(e, t, f) {
    return (e & t) ^ (e & f) ^ (t & f);
  }
  ((f.ft_1 = function (e, t, f, r) {
    var d;
    return 0 === e
      ? ((d = t) & f) ^ (~d & r)
      : 1 === e || 3 === e
        ? t ^ f ^ r
        : 2 === e
          ? i(t, f, r)
          : void 0;
  }),
    (f.ch32 = function (e, t, f) {
      return (e & t) ^ (~e & f);
    }),
    (f.maj32 = i),
    (f.p32 = function (e, t, f) {
      return e ^ t ^ f;
    }),
    (f.s0_256 = function (e) {
      return r(e, 2) ^ r(e, 13) ^ r(e, 22);
    }),
    (f.s1_256 = function (e) {
      return r(e, 6) ^ r(e, 11) ^ r(e, 25);
    }),
    (f.g0_256 = function (e) {
      return r(e, 7) ^ r(e, 18) ^ (e >>> 3);
    }),
    (f.g1_256 = function (e) {
      return r(e, 17) ^ r(e, 19) ^ (e >>> 10);
    }));
};
