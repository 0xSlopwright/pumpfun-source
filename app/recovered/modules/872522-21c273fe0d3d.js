// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386);
  let i = { tone: null, nonce: 0 },
    a = {
      up: ["animate-value-flash-up", "animate-value-flash-up-alt"],
      down: ["animate-value-flash-down", "animate-value-flash-down-alt"],
    };
  e.s([
    "v",
    0,
    function (e) {
      let a,
        n,
        l = (0, t.c)(6),
        s = null != e && Number.isFinite(e) ? e : null;
      l[0] !== s
        ? ((a = { value: s, flash: i }), (l[0] = s), (l[1] = a))
        : (a = l[1]);
      let [o, c] = (0, r.useState)(a),
        m = o.value;
      if (Object.is(m, s)) return o.flash;
      l[2] !== m || l[3] !== o.flash.nonce || l[4] !== s
        ? ((n =
            null != s && null != m
              ? {
                  value: s,
                  flash: {
                    tone: s > m ? "up" : "down",
                    nonce: o.flash.nonce + 1,
                  },
                }
              : { value: s, flash: { tone: null, nonce: o.flash.nonce } }),
          (l[2] = m),
          (l[3] = o.flash.nonce),
          (l[4] = s),
          (l[5] = n))
        : (n = l[5]);
      let d = n;
      return (c(d), d.flash);
    },
    "_",
    0,
    function (e, t) {
      let i = null != e && Number.isFinite(e) ? e : null,
        [a, n] = (0, r.useState)(i);
      return null === i
        ? (null !== a && n(null), null)
        : null === a || (0 === a ? 0 !== i : Math.abs((i - a) / a) > t)
          ? (n(i), i)
          : a;
    },
    "a",
    0,
    (e) => (e.tone ? a[e.tone][e.nonce % 2] : void 0),
  ]);
};
