// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(344500);
  let r = !1,
    n = new Set(),
    a = !1,
    i = new Set(),
    o = null;
  function s(e) {
    try {
      for (let t = 0; t < localStorage.length; t += 1) {
        let r = localStorage.key(t);
        if (r && e(r)) return !0;
      }
    } catch {}
    return !1;
  }
  let l = ["privy:token", "privy:refresh_token", "privy:id_token"];
  function c(e) {
    return l.some((t) => e.startsWith(t));
  }
  function u(e) {
    return "decoded-jwt" === e || "walletName" === e;
  }
  function d() {
    try {
      return window.location.search.includes("privy_oauth");
    } catch {
      return !1;
    }
  }
  function f() {
    return !!r || d();
  }
  e.s([
    "o",
    0,
    d,
    "c",
    0,
    function () {
      return a;
    },
    "H",
    0,
    function () {
      return (o ??= e
        .A(519767)
        .then((e) => e.PrivyAuthTree)
        .catch((e) => {
          throw ((o = null), e);
        }));
    },
    "d",
    0,
    function () {
      if (!a) for (let e of ((a = !0), i)) e();
    },
    "f",
    0,
    function () {
      for (let e of ((r = !0), n)) e();
    },
    "v",
    0,
    f,
    "L",
    0,
    function () {
      return (
        !!(
          f() ||
          (!("u" < typeof document) &&
            document.cookie
              .split(";")
              .some((e) => e.trim().startsWith("auth_token="))) ||
          (!("u" < typeof document) &&
            document.cookie
              .split(";")
              .some((e) => e.trim().startsWith("privy-"))) ||
          s(c)
        ) ||
        (!(0, t.t)() && s(u))
      );
    },
    "e",
    0,
    function (e) {
      return (
        n.add(e),
        () => {
          n.delete(e);
        }
      );
    },
    "$",
    0,
    function (e) {
      return (
        i.add(e),
        () => {
          i.delete(e);
        }
      );
    },
  ]);
};
