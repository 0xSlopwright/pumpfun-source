// Original589428 display-restore function 4d12898c1c6cd0bc4e8518537175ecf57e5edf14a6723c4c15f8aad0bf97a400; capabilities are injected.
export function createDisplayRestoreKernel(d, e8, e5, e6, localStorage, AbortController, setTimeout, clearTimeout, a) {
  let e9 = "decoded-jwt",
    e7 = !1;
  async function te(e) {
    let {
      clientServerUrl: t
    } = e;
    if (e7 || (e7 = !0, (0, d.D)())) return !1;
    try {
      if (null != localStorage.getItem(e9)) return !1;
    } catch {
      return !1;
    }
    if ((0, e8.g)()) return !1;
    let n = new AbortController(),
      i = setTimeout(() => n.abort(), 8e3);
    try {
      let e = await (0, e5.K)({
          clientServerUrl: t
        })("GET /auth/my-profile", {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache"
          },
          signal: n.signal
        }),
        i = (0, e6.S)(e);
      if (!i || (0, e8.g)()) return !1;
      if ((0, d.D)()) return !0;
      return localStorage.setItem(e9, JSON.stringify(i)), (0, d.I)(), a.y.info("cookie-session-recovery: restored display session", {}), !0;
    } catch {
      return !1;
    } finally {
      clearTimeout(i);
    }
  }
  return te;
}
