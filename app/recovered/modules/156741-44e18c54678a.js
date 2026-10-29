// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(616800);
  e.s(["f", () => t.I], 156741);
  var a = e.i(584229);
  let r = [/not loaded on (this )?device/i, /embedded wallet not found/i],
    n = /0x[0-9a-fA-F]{40}/g,
    i = {
      unavailable: "web.trade.evm_wallet_unavailable_in_browser",
      masked: "web.trade.evm_wallet_sign_failed_in_browser",
    },
    l = (e) => (e && "object" == typeof e && "cause" in e ? e.cause : void 0),
    s = (e) => 4900 === (0, a.N)(e) || /^Disconnected$/.test((0, a.A)(e)),
    o = (e) => {
      let t = (0, a.A)(e);
      return r.some((e) => e.test(t));
    };
  e.s(
    [
      "Z",
      0,
      function (e) {
        let t = ((e) => {
            let t = [],
              a = e;
            for (let e = 0; e <= 4 && null != a; e++) (t.push(a), (a = l(a)));
            return t;
          })(e),
          r = t.some(o);
        if (r || t.some(s))
          return {
            kind: r ? "unavailable" : "masked",
            cause: ((e) => {
              let t = e.findIndex(s);
              if (-1 === t) return;
              let r = e
                .slice(t + 1)
                .filter((e) => !s(e))
                .map(a.A)
                .find((e) => "" !== e);
              return r?.replace(n, "0x…").slice(0, 300);
            })(t),
          };
      },
      "e",
      0,
      (e, t) => t(i[e.kind]),
    ],
    534710,
  );
};
