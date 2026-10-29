// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(78436),
    r = e.i(634103),
    n = e.i(800855);
  let a = ["callouts", "trades"],
    o = a.length,
    s = (e) => a.filter((t) => e.includes(t)),
    l = (e, t, i) => Math.min(i, Math.max(t, e)),
    d = (e) =>
      null != e && Number.isFinite(e)
        ? l(Math.floor((e - 400) / 260), 0, o)
        : 0,
    c = (e, t, i = 1) => {
      let r = Math.max(1, i);
      return Math.round(
        l(
          e,
          260,
          Math.max(
            260,
            Math.min(
              640,
              null != t && Number.isFinite(t) ? Math.floor((t - 400) / r) : 640,
            ),
          ),
        ),
      );
    },
    u = [],
    m = { callouts: ["callouts"], trades: ["trades"] },
    f = (e) => (null == e.cardWidthPx ? e.open : h(e)),
    b = (e, t) => {
      let i = f(e).filter((e) => e !== t);
      return {
        open: 0 === i.length ? u : i,
        lastOpened:
          null != e.lastOpened && i.includes(e.lastOpened)
            ? e.lastOpened
            : (i[0] ?? null),
      };
    },
    p = (0, i.$)()(
      (0, r.V)(
        (e, t) => ({
          open: u,
          lastOpened: null,
          paneWidthPx: 360,
          cardWidthPx: null,
          controlStripWidthPx: null,
          toggle: (i) => {
            let r = t(),
              n = f(r);
            return n.includes(i)
              ? (e(b(r, i)), !1)
              : (e({ open: s([...n, i]), lastOpened: i }), !0);
          },
          close: (i) => {
            let r = t();
            r.open.includes(i) && e(b(r, i));
          },
          setPaneWidthPx: (i) => {
            let r = t();
            e({ paneWidthPx: c(i, r.cardWidthPx, h(r).length) });
          },
          resetPaneWidth: () => e({ paneWidthPx: 360 }),
          setCardWidthPx: (i) => {
            let r = null != i && Number.isFinite(i) ? Math.round(i) : null;
            r !== t().cardWidthPx && e({ cardWidthPx: r });
          },
          setControlStripWidthPx: (i) => {
            let r =
              null != i && Number.isFinite(i) && i > 0 ? Math.round(i) : null;
            r !== t().controlStripWidthPx && e({ controlStripWidthPx: r });
          },
        }),
        {
          name: "coin-chart-side-panel",
          storage: (0, n.I)({
            defaultPersisted: { open: u, lastOpened: null, paneWidthPx: 360 },
          }),
          skipHydration: !0,
          partialize: (e) => ({
            open: e.open,
            lastOpened: e.lastOpened,
            paneWidthPx: e.paneWidthPx,
          }),
          merge: (e, t) => {
            let i,
              r = s(Array.isArray(e?.open) ? e.open : []),
              n =
                e?.lastOpened != null && r.includes(e.lastOpened)
                  ? e.lastOpened
                  : (r[r.length - 1] ?? null);
            return {
              ...t,
              open: 0 === r.length ? u : r,
              lastOpened: n,
              paneWidthPx:
                "number" == typeof (i = e?.paneWidthPx ?? e?.widthPx) &&
                Number.isFinite(i)
                  ? c(i)
                  : 360,
            };
          },
        },
      ),
    );
  (0, n.m)(p);
  let h = (e) => {
      let t = d(e.cardWidthPx);
      if (0 === t || 0 === e.open.length) return u;
      if (e.open.length <= t) return e.open;
      let i = e.open.find((t) => t !== e.lastOpened) ?? e.open[0];
      return i ? m[i] : u;
    },
    w = (e) => p.persist?.onFinishHydration(e) ?? (() => {}),
    v = () => p.persist?.hasHydrated() ?? !1,
    g = () => !1,
    y = () => (0, t.useSyncExternalStore)(w, v, g);
  e.s([
    "L",
    0,
    260,
    "l",
    0,
    c,
    "e",
    0,
    d,
    "m",
    0,
    y,
    "f",
    0,
    p,
    "c",
    0,
    () => {
      let e = y(),
        t = p(h);
      return e ? t : u;
    },
  ]);
};
