// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386);
  let n = t.createContext(void 0);
  e.s(
    [
      "d",
      0,
      n,
      "L",
      0,
      function () {
        return t.useContext(n);
      },
    ],
    699238,
  );
  var r = e.i(732612),
    i = e.i(565693),
    o = e.i(530001),
    l = e.i(523686),
    a = e.i(559545),
    s = e.i(732486);
  let u = t.createContext({
    hasProvider: !1,
    timeoutMs: 0,
    delayRef: { current: 0 },
    initialDelayRef: { current: 0 },
    timeout: new r.U(),
    currentIdRef: { current: null },
    currentContextRef: { current: null },
  });
  e.s(
    [
      "Z",
      0,
      function (e) {
        let { children: n, delay: i, timeoutMs: o = 0 } = e,
          l = t.useRef(i),
          a = t.useRef(i),
          c = t.useRef(null),
          d = t.useRef(null),
          f = (0, r.e)();
        return (0, s.jsx)(u.Provider, {
          value: t.useMemo(
            () => ({
              hasProvider: !0,
              delayRef: l,
              initialDelayRef: a,
              currentIdRef: c,
              timeoutMs: o,
              currentContextRef: d,
              timeout: f,
            }),
            [o, f],
          ),
          children: n,
        });
      },
      "D",
      0,
      function (e, n = { open: !1 }) {
        let r = "rootStore" in e ? e.rootStore : e,
          s = r.useState("floatingId"),
          { open: c } = n,
          {
            currentIdRef: d,
            delayRef: f,
            timeoutMs: p,
            initialDelayRef: g,
            currentContextRef: h,
            hasProvider: v,
            timeout: m,
          } = t.useContext(u),
          [b, x] = t.useState(!1);
        return (
          (0, i.f)(() => {
            function e() {
              (x(!1),
                h.current?.setIsInstantPhase(!1),
                (d.current = null),
                (h.current = null),
                (f.current = g.current));
            }
            if (d.current && !c && d.current === s) {
              if ((x(!1), p))
                return (
                  m.start(p, () => {
                    r.select("open") || (d.current && d.current !== s) || e();
                  }),
                  () => {
                    m.clear();
                  }
                );
              e();
            }
          }, [c, s, d, f, p, g, h, m, r]),
          (0, i.f)(() => {
            if (!c) return;
            let e = h.current,
              t = d.current;
            (m.clear(),
              (h.current = { onOpenChange: r.setOpen, setIsInstantPhase: x }),
              (d.current = s),
              (f.current = { open: 0, close: (0, o.c)(g.current, "close") }),
              null !== t && t !== s
                ? (x(!0),
                  e?.setIsInstantPhase(!0),
                  e?.onOpenChange(!1, (0, l.f)(a.f.none)))
                : (x(!1), e?.setIsInstantPhase(!1)));
          }, [c, s, r, d, f, p, g, h, m]),
          (0, i.f)(
            () => () => {
              h.current = null;
            },
            [h],
          ),
          t.useMemo(
            () => ({ hasProvider: v, delayRef: f, isInstantPhase: b }),
            [v, f, b],
          )
        );
      },
    ],
    129658,
  );
};
