// Original594435 b0d04ecd2aaa0755744a65c059b73905c135ffea314511d44102db5c99b79cdf; storage is explicitly injected.
export function createPendingLogoutKernel(localStorage) {
  let t = "pending-logout";
  function n() {
    try {
      return "1" === localStorage.getItem(t);
    } catch {
      return !1;
    }
  }
  function i(e) {
    try {
      e ? localStorage.setItem(t, "1") : localStorage.removeItem(t);
    } catch {}
  }
  let r = n();
  function a() {
    return r || n();
  }
  return {
    P: function () {
      return !!a() && (r = !1, i(!1), !0);
    },
    g: a,
    c: function () {
      r = !0, i(!0);
    }
  };
}
