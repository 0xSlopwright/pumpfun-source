// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = null,
    n = null,
    r = () => {
      t = Date.now();
    },
    a = () => {
      n = Date.now();
    },
    i = () => {
      "hidden" === document.visibilityState ? r() : a();
    },
    l = (e) => {
      e.persisted && a();
    },
    o = () => {},
    s = (e, t) => null !== e && t - e < 2e3;
  e.s([
    "K",
    0,
    () =>
      "u" < typeof document
        ? o
        : (window.addEventListener("pagehide", r),
          window.addEventListener("pageshow", l),
          document.addEventListener("visibilitychange", i),
          () => {
            (window.removeEventListener("pagehide", r),
              window.removeEventListener("pageshow", l),
              document.removeEventListener("visibilitychange", i));
          }),
    "O",
    0,
    (e = Date.now()) =>
      !("u" < typeof document) && (!!document.hidden || s(t, e) || s(n, e)),
  ]);
};
