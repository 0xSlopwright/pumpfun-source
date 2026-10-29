// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = "pending-logout";
  function n() {
    try {
      return "1" === localStorage.getItem(t);
    } catch {
      return !1;
    }
  }
  function r(e) {
    try {
      e ? localStorage.setItem(t, "1") : localStorage.removeItem(t);
    } catch {}
  }
  let o = n();
  function i() {
    return o || n();
  }
  e.s([
    "P",
    0,
    function () {
      return !!i() && ((o = !1), r(!1), !0);
    },
    "g",
    0,
    i,
    "c",
    0,
    function () {
      ((o = !0), r(!0));
    },
  ]);
};
