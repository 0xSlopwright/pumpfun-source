// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(4327);
  let n = "2026-10-17",
    r = "user-tos-accepted-date",
    i = "pump:tos-accepted";
  function a() {
    let e = window.localStorage.getItem(r);
    if (!e) return null;
    try {
      let t = JSON.parse(e);
      return "string" == typeof t ? t : e;
    } catch {
      return e;
    }
  }
  function o() {
    if (document.cookie.split("; ").includes(`${t.c}=true`)) return !0;
    try {
      return null != window.localStorage.getItem(t.Y);
    } catch {
      return !1;
    }
  }
  function l() {
    let e = a();
    return null != e && new Date(e) >= new Date(n);
  }
  function s() {
    let e = new Date(),
      t = new Date(n);
    return (e > t ? e : t).toISOString();
  }
  e.s([
    "i",
    0,
    r,
    "h",
    0,
    n,
    "x",
    0,
    o,
    "Q",
    0,
    l,
    "P",
    0,
    function () {
      return o() && l();
    },
    "Z",
    0,
    a,
    "c",
    0,
    function () {
      let e = s();
      return (
        window.localStorage.setItem(r, e),
        window.dispatchEvent(new Event(i)),
        e
      );
    },
    "a",
    0,
    function (e) {
      return (
        window.addEventListener(t.U, e),
        window.addEventListener(i, e),
        () => {
          (window.removeEventListener(t.U, e),
            window.removeEventListener(i, e));
        }
      );
    },
    "N",
    0,
    s,
  ]);
};
