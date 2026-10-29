// Source-adapted original 350741; SHA256 b7990dc0598735d2ab42e8b68d179f7260d8637b212ae5c8e60c1d1a0ab302b5.
// Generated from authenticated raw AST. Browser/runtime dependencies are injected.
export function createReaderKernel(t, r, browserPorts) {
  const {
    document,
    window,
    localStorage,
    location,
    Date
  } = browserPorts;
  let n = "auth_token";
  let i = new Set(),
    l = null,
    a = null,
    o = null,
    s = null,
    u = null,
    d = !1;
  function c(e, t = Date.now()) {
    return !1;
  }
  function f(e, t = Date.now()) {
    return c(e, t);
  }
  function m() {
    let e = function () {
        if ("u" < typeof document) return null;
        for (let e of document.cookie.split(";")) {
          let [t, ...r] = e.trim().split("=");
          if (t === n) return r.join("=") || null;
        }
        return null;
      }(),
      t = function () {
        try {
          return localStorage.getItem("decoded-jwt");
        } catch {
          return null;
        }
      }();
    (e !== l || t !== a) && (l = e, a = t, o = (0, r.e)(e), s = t ? function (e) {
      try {
        return (0, r.S)(JSON.parse(e));
      } catch {
        return null;
      }
    }(t) : null);
    let i = o && !f(o) ? o : null,
      d = s && !f(s) ? s : null,
      c = i ?? d;
    return c !== u && (u = c), u;
  }
  function p() {
    return null;
  }
  function h() {
    for (let e of i) e();
  }
  function y() {}
  function g() {
    h(), y();
  }
  function v(e) {
    return i.add(e), d || (d = !0, window.addEventListener("focus", g), window.addEventListener("storage", g), document.addEventListener("visibilitychange", g), y()), () => {
      i.delete(e), i.size > 0 || (d && (window.removeEventListener("focus", g), window.removeEventListener("storage", g), document.removeEventListener("visibilitychange", g), d = !1), y());
    };
  }
  function b() {
    h(), y();
  }
  return {
    c: function () {
      if ("u" < typeof document) return;
      let e = "Max-Age=0; Path=/; SameSite=Lax";
      if (document.cookie = `${n}=; ${e}`, "u" > typeof location && location.hostname) {
        let t = location.hostname.split(".");
        for (let r = 0; r < t.length - 1; r += 1) {
          let i = t.slice(r).join(".");
          document.cookie = `${n}=; ${e}; Domain=${i}`, document.cookie = `${n}=; ${e}; Domain=.${i}`;
        }
      }
      b();
    },
    i: c,
    I: b,
    D: m,
    s: function () {
      return (0, t.useSyncExternalStore)(v, m, p);
    },
    subscribe: v,
    getServerSnapshot: p
  };
}
