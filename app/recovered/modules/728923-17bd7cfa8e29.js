// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(78436),
    a = e.i(634103);
  let l = (0, t.$)()(
    (0, a.V)(
      (e) => ({
        pendingTrigger: null,
        unavailableWallets: [],
        localConsents: {},
        syncAttemptedViewers: [],
        requestConsent: (t) =>
          e((e) => (null === e.pendingTrigger ? { pendingTrigger: t } : e)),
        clearRequest: () => e({ pendingTrigger: null }),
        markConsentUnavailable: (t) =>
          e((e) => ({
            pendingTrigger: null,
            unavailableWallets: e.unavailableWallets.includes(t)
              ? e.unavailableWallets
              : [...e.unavailableWallets, t],
          })),
        recordLocalConsent: (t, a = new Date().toISOString()) =>
          e((e) => {
            let l = { ...e.localConsents },
              r = !1;
            for (let e of t)
              l[e] || ((l[e] = { acceptedAt: a, confirmed: !1 }), (r = !0));
            return r ? { localConsents: l } : e;
          }),
        confirmLocalConsent: (t, a) =>
          e((e) => {
            let l = { ...e.localConsents },
              r = !1;
            for (let e of t) {
              let t = l[e],
                i = a ?? t?.acceptedAt ?? new Date().toISOString();
              (t?.confirmed && t.acceptedAt === i) ||
                ((l[e] = { acceptedAt: i, confirmed: !0 }), (r = !0));
            }
            return r ? { localConsents: l } : e;
          }),
        markConsentSyncAttempted: (t) =>
          e((e) =>
            e.syncAttemptedViewers.includes(t)
              ? e
              : { syncAttemptedViewers: [...e.syncAttemptedViewers, t] },
          ),
      }),
      {
        name: "pump:callout-rewards-tos-consent",
        storage: (0, a.j)(() => localStorage),
        partialize: (e) => ({ localConsents: e.localConsents }),
      },
    ),
  );
  e.s([
    "b",
    0,
    (e, t) => {
      l.getState().confirmLocalConsent(e, t);
    },
    "z",
    0,
    function () {
      try {
        return (
          "1" === window.localStorage.getItem("pump:force-callout-rewards-tos")
        );
      } catch {
        return !1;
      }
    },
    "_",
    0,
    (e) => {
      l.getState().markConsentUnavailable(e);
    },
    "S",
    0,
    (e, t) => {
      l.getState().recordLocalConsent(e, t);
    },
    "g",
    0,
    (e) => {
      l.getState().requestConsent(e);
    },
    "D",
    0,
    (e, t) => {
      let a;
      for (let l of t) {
        let t = e[l];
        if (t) {
          if (t.confirmed) return t;
          a || (a = t);
        }
      }
      return a;
    },
    "F",
    0,
    l,
    "f",
    0,
    (e) => {
      let t = [],
        a = e?.userId?.trim();
      a && t.push(a);
      let l = e?.address?.trim();
      return (l && l !== a && t.push(l), t);
    },
  ]);
};
