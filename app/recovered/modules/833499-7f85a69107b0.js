// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(370445),
    n = e.i(986925);
  e.s(
    [
      "f",
      0,
      function (e, r, a) {
        return r || e || !crypto.randomUUID
          ? (function (e, r, a) {
              let i = (e = e || {}).random ?? e.rng?.() ?? (0, t.f)();
              if (i.length < 16)
                throw Error("Random bytes length must be >= 16");
              if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), r)) {
                if ((a = a || 0) < 0 || a + 16 > r.length)
                  throw RangeError(
                    `UUID byte range ${a}:${a + 15} is out of buffer bounds`,
                  );
                for (let e = 0; e < 16; ++e) r[a + e] = i[e];
                return r;
              }
              return (0, n.f)(i);
            })(e, r, a)
          : crypto.randomUUID();
      },
    ],
    833499,
  );
};
