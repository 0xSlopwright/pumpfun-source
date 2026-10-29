// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  let a = { tone: null, nonce: 0 },
    l = {
      up: ["animate-value-flash-up", "animate-value-flash-up-alt"],
      down: ["animate-value-flash-down", "animate-value-flash-down-alt"],
    };
  e.s([
    "v",
    0,
    function (e) {
      let l,
        n,
        i = (0, t.c)(6),
        s = null != e && Number.isFinite(e) ? e : null;
      i[0] !== s
        ? ((l = { value: s, flash: a }), (i[0] = s), (i[1] = l))
        : (l = i[1]);
      let [o, c] = (0, r.useState)(l),
        d = o.value;
      if (Object.is(d, s)) return o.flash;
      i[2] !== d || i[3] !== o.flash.nonce || i[4] !== s
        ? ((n =
            null != s && null != d
              ? {
                  value: s,
                  flash: {
                    tone: s > d ? "up" : "down",
                    nonce: o.flash.nonce + 1,
                  },
                }
              : { value: s, flash: { tone: null, nonce: o.flash.nonce } }),
          (i[2] = d),
          (i[3] = o.flash.nonce),
          (i[4] = s),
          (i[5] = n))
        : (n = i[5]);
      let u = n;
      return (c(u), u.flash);
    },
    "_",
    0,
    function (e, t) {
      let a = null != e && Number.isFinite(e) ? e : null,
        [l, n] = (0, r.useState)(a);
      return null === a
        ? (null !== l && n(null), null)
        : null === l || (0 === l ? 0 !== a : Math.abs((a - l) / l) > t)
          ? (n(a), a)
          : l;
    },
    "a",
    0,
    (e) => (e.tone ? l[e.tone][e.nonce % 2] : void 0),
  ]);
};
