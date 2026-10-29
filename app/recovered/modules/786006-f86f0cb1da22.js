// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(964355);
  var t = e.i(904282),
    r = e.i(350764),
    i = e.i(907953);
  function a(e) {
    return "number" == typeof e ? e : parseFloat(e);
  }
  var n = e.i(352386),
    l = e.i(144685),
    s = e.i(459705),
    o = e.i(144629);
  e.s(
    [
      "f",
      0,
      function (e, c = {}) {
        return (function (e, c = {}) {
          let { isStatic: m } = (0, n.useContext)(l.f),
            d = () => ((0, r.f)(e) ? e.get() : e);
          if (m) return (0, o.f)(d);
          let u = (0, s.f)(d());
          return (
            (0, n.useInsertionEffect)(
              () =>
                (function (e, n, l = {}) {
                  let s,
                    o = e.get(),
                    c = null,
                    m = o,
                    d =
                      "string" == typeof o ? o.replace(/[\d.-]/g, "") : void 0,
                    u = () => {
                      (c && (c.stop(), (c = null)), (e.animation = void 0));
                    },
                    h = () => {
                      ((() => {
                        let r = a(e.get()),
                          i = a(m);
                        if (r === i) return u();
                        let n = c ? c.getGeneratorVelocity() : e.getVelocity();
                        (u(),
                          (c = new t.f({
                            keyframes: [r, i],
                            velocity: n,
                            type: "spring",
                            restDelta: 0.001,
                            restSpeed: 0.01,
                            ...l,
                            onUpdate: s,
                          })));
                      })(),
                        (e.animation = c ?? void 0),
                        e.events.animationStart?.notify(),
                        c?.then(() => {
                          ((e.animation = void 0),
                            e.events.animationComplete?.notify());
                        }));
                    };
                  if (
                    (e.attach((e, t) => {
                      ((m = e),
                        (s = (e) => {
                          var r, i;
                          return t(((r = e), (i = d) ? r + i : r));
                        }),
                        i.y.postRender(h));
                    }, u),
                    (0, r.f)(n))
                  ) {
                    let t = !0 === l.skipInitialAnimation,
                      r = n.on("change", (r) => {
                        var i, a, n, l;
                        t
                          ? ((t = !1),
                            e.jump(((i = r), (a = d) ? i + a : i), !1))
                          : e.set(((n = r), (l = d) ? n + l : n));
                      }),
                      i = e.on("destroy", r);
                    return () => {
                      (r(), i());
                    };
                  }
                  return u;
                })(u, e, c),
              [u, JSON.stringify(c)],
            ),
            u
          );
        })(e, { type: "spring", ...c });
      },
    ],
    786006,
  );
};
