// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(964355);
  var t = e.i(904282),
    i = e.i(350764),
    r = e.i(907953);
  function n(e) {
    return "number" == typeof e ? e : parseFloat(e);
  }
  var l = e.i(352386),
    a = e.i(144685),
    s = e.i(459705),
    c = e.i(144629);
  e.s(
    [
      "f",
      0,
      function (e, u = {}) {
        return (function (e, u = {}) {
          let { isStatic: o } = (0, l.useContext)(a.f),
            m = () => ((0, i.f)(e) ? e.get() : e);
          if (o) return (0, c.f)(m);
          let h = (0, s.f)(m());
          return (
            (0, l.useInsertionEffect)(
              () =>
                (function (e, l, a = {}) {
                  let s,
                    c = e.get(),
                    u = null,
                    o = c,
                    m =
                      "string" == typeof c ? c.replace(/[\d.-]/g, "") : void 0,
                    h = () => {
                      (u && (u.stop(), (u = null)), (e.animation = void 0));
                    },
                    f = () => {
                      ((() => {
                        let i = n(e.get()),
                          r = n(o);
                        if (i === r) return h();
                        let l = u ? u.getGeneratorVelocity() : e.getVelocity();
                        (h(),
                          (u = new t.f({
                            keyframes: [i, r],
                            velocity: l,
                            type: "spring",
                            restDelta: 0.001,
                            restSpeed: 0.01,
                            ...a,
                            onUpdate: s,
                          })));
                      })(),
                        (e.animation = u ?? void 0),
                        e.events.animationStart?.notify(),
                        u?.then(() => {
                          ((e.animation = void 0),
                            e.events.animationComplete?.notify());
                        }));
                    };
                  if (
                    (e.attach((e, t) => {
                      ((o = e),
                        (s = (e) => {
                          var i, r;
                          return t(((i = e), (r = m) ? i + r : i));
                        }),
                        r.y.postRender(f));
                    }, h),
                    (0, i.f)(l))
                  ) {
                    let t = !0 === a.skipInitialAnimation,
                      i = l.on("change", (i) => {
                        var r, n, l, a;
                        t
                          ? ((t = !1),
                            e.jump(((r = i), (n = m) ? r + n : r), !1))
                          : e.set(((l = i), (a = m) ? l + a : l));
                      }),
                      r = e.on("destroy", i);
                    return () => {
                      (i(), r());
                    };
                  }
                  return h;
                })(h, e, u),
              [h, JSON.stringify(u)],
            ),
            h
          );
        })(e, { type: "spring", ...u });
      },
    ],
    786006,
  );
};
