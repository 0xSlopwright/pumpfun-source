// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    r = /^0x[0-9a-fA-F]{40}$/,
    n = /^[0-9a-f]{64}$/,
    a = /^[A-Za-z0-9_-]{1,64}$/,
    i = "^/([1-9A-HJ-NP-Za-km-z]{32,44}|0x[0-9a-fA-F]{40})(?:/@([^/]+))?/?$";
  new RegExp(i);
  let o = (e) =>
    !e || !a.test(e) || t.test(e) || r.test(e) || n.test(e) ? null : e;
  e.s(["s", 0, i, "S", 0, "/coin-share", "F", 0, o], 395136);
  let s = "https://pump.fun",
    l = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  RegExp(
    "^/c/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(?:/([^/]+))?/?$",
  );
  let c =
    /^\/callouts\/([^/]+)\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/;
  e.s(
    [
      "i",
      0,
      "/c",
      "t",
      0,
      ({ calloutId: e, ref: t, origin: r = s }) => {
        let n = o(t),
          a = n ? `/${n}` : "";
        return `${r}/c/${e.toLowerCase()}${a}`;
      },
      "c",
      0,
      (e) => {
        let t,
          r = e;
        if (/^https?:\/\//i.test(e))
          try {
            r = new URL(e).pathname;
          } catch {
            return null;
          }
        let n = c.exec(r);
        return n && (t = n[2]) && l.test(t) ? t.toLowerCase() : null;
      },
      "j",
      0,
      o,
    ],
    223021,
  );
};
