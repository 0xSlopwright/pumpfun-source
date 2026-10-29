// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(989494),
    r = e.i(590719),
    o = e.i(497763),
    s = e.i(622275),
    n = e.i(532617);
  function a(e) {
    var t;
    return (
      (t = (function (e) {
        let t = !0,
          r = "",
          o = 0,
          s = "",
          a = !1;
        for (let n = 0; n < e.length; n++) {
          let i = e[n];
          if (
            (["(", ")", ","].includes(i) && (t = !0),
            "(" === i && o++,
            ")" === i && o--,
            t)
          ) {
            if (0 === o) {
              if (" " === i && ["event", "function", ""].includes(s)) s = "";
              else if (((s += i), ")" === i)) {
                a = !0;
                break;
              }
              continue;
            }
            if (" " === i) {
              "," !== e[n - 1] &&
                "," !== r &&
                ",(" !== r &&
                ((r = ""), (t = !1));
              continue;
            }
            ((s += i), (r += i));
          }
        }
        if (!a) throw new n.f("Unable to normalize signature.");
        return s;
      })("string" == typeof e ? e : (0, s.f)(e))),
      (0, o.f)((0, r.D)(t))
    );
  }
  (e.s(["f", 0, a], 808387),
    e.s(["f", 0, (e) => (0, t.M)(a(e), 0, 4)], 964764));
};
