// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386),
    n = e.i(985526),
    i = e.i(755793),
    a = e.i(466931);
  let s = new Map(),
    o = !1,
    l = (e, t) => {
      let r = (s.get(e) ?? 0) + 1;
      (s.set(e, r),
        r > 100 ||
          (0, a.B)({
            name: "nats-realtime",
            feature: "realtime",
            operation: e,
            context: 100 === r ? { ...t, budgetExhausted: !0 } : t,
          }));
    },
    c = (e) => {
      "auth_error" === e.type
        ? l("auth_error", {
            instance: e.instance,
            jwt: e.jwt,
            expired: e.expired,
          })
        : "permissions_violation" === e.type
          ? l("permissions_violation", {
              instance: e.instance,
              subject: e.subject,
            })
          : l("subscription_limit", { instance: e.instance });
    },
    u = (e) => {
      "dropped" === e.type
        ? l("dropped", {
            instance: e.instance,
            channel: e.channel,
            count: e.count,
          })
        : l("gave_up", { instance: e.instance, reason: e.reason });
    };
  function d() {
    !(function () {
      if (o) return;
      o = !0;
      let e = new Map(),
        t = new Map();
      for (let t of Object.values(n.N)) e.set(t, (0, i.B)(t));
      ((0, i.k)((r, i) => {
        let a = e.get(r);
        e.set(r, i);
        let s = a === n.m.CONNECTED,
          o = i === n.m.CONNECTED;
        if (s && !o) {
          (t.set(r, Date.now()), l("disconnect", { instance: r }));
          return;
        }
        if (o && !s) {
          let e = t.get(r);
          if (void 0 === e) return;
          (t.delete(r),
            l("reconnect", { instance: r, downMs: Date.now() - e }));
        }
      }),
        (0, i.R)(c),
        (0, i.l)(u));
    })();
  }
  e.s(
    [
      "NatsRumReporting",
      0,
      function () {
        let e,
          n = (0, t.c)(1);
        return (
          n[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = []), (n[0] = e))
            : (e = n[0]),
          (0, r.useEffect)(d, e),
          null
        );
      },
    ],
    322586,
  );
};
