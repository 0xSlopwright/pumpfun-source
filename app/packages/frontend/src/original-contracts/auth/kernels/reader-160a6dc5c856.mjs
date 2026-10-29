// Source-adapted original 350741; SHA256 160a6dc5c8569c22dad6a7e639abe9a50def6827e5a8c21c936f3b0eaa0e704f.
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
    o = null,
    s = null,
    a = null,
    l = null,
    u = null,
    c = !1;
  function f(e, t = Date.now()) {
    return !1;
  }
  function d(e, t = Date.now()) {
    return f(e, t);
  }
  function h() {
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
    (e !== o || t !== s) && (o = e, s = t, a = (0, r.e)(e), l = t ? function (e) {
      try {
        return (0, r.S)(JSON.parse(e));
      } catch {
        return null;
      }
    }(t) : null);
    let i = a && !d(a) ? a : null,
      c = l && !d(l) ? l : null,
      f = i ?? c;
    return f !== u && (u = f), u;
  }
  function p() {
    return null;
  }
  function g() {
    for (let e of i) e();
  }
  function m() {}
  function y() {
    g(), m();
  }
  function b(e) {
    return i.add(e), c || (c = !0, window.addEventListener("focus", y), window.addEventListener("storage", y), document.addEventListener("visibilitychange", y), m()), () => {
      i.delete(e), i.size > 0 || (c && (window.removeEventListener("focus", y), window.removeEventListener("storage", y), document.removeEventListener("visibilitychange", y), c = !1), m());
    };
  }
  function v() {
    g(), m();
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
      v();
    },
    i: f,
    I: v,
    D: h,
    s: function () {
      return (0, t.useSyncExternalStore)(b, h, p);
    },
    subscribe: b,
    getServerSnapshot: p
  };
}
