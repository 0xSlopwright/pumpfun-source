// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617),
    i = e.i(811369),
    f = e.i(590719),
    s = e.i(19648);
  function n(e) {
    if (e < 256) return 1;
    if (e < 65536) return 2;
    if (e < 0x1000000) return 3;
    if (e < 0x100000000) return 4;
    throw new t.f("Length is too large.");
  }
  e.s([
    "f",
    0,
    function (e, t = "hex") {
      let o = (function e(t) {
          var i, s;
          let o, r, a, c;
          return Array.isArray(t)
            ? ((r = n(
                (o = (i = t.map((t) => e(t))).reduce(
                  (e, t) => e + t.length,
                  0,
                )),
              )),
              {
                length: o <= 55 ? 1 + o : 1 + r + o,
                encode(e) {
                  for (let { encode: t } of (o <= 55
                    ? e.pushByte(192 + o)
                    : (e.pushByte(247 + r),
                      1 === r
                        ? e.pushUint8(o)
                        : 2 === r
                          ? e.pushUint16(o)
                          : 3 === r
                            ? e.pushUint24(o)
                            : e.pushUint32(o)),
                  i))
                    t(e);
                },
              })
            : ((c = n(
                (a = "string" == typeof (s = t) ? (0, f.X)(s) : s).length,
              )),
              {
                length:
                  1 === a.length && a[0] < 128
                    ? 1
                    : a.length <= 55
                      ? 1 + a.length
                      : 1 + c + a.length,
                encode(e) {
                  ((1 === a.length && a[0] < 128) ||
                    (a.length <= 55
                      ? e.pushByte(128 + a.length)
                      : (e.pushByte(183 + c),
                        1 === c
                          ? e.pushUint8(a.length)
                          : 2 === c
                            ? e.pushUint16(a.length)
                            : 3 === c
                              ? e.pushUint24(a.length)
                              : e.pushUint32(a.length))),
                    e.pushBytes(a));
                },
              });
        })(e),
        r = (0, i.f)(new Uint8Array(o.length));
      return (o.encode(r), "hex" === t) ? (0, s.v)(r.bytes) : r.bytes;
    },
  ]);
};
