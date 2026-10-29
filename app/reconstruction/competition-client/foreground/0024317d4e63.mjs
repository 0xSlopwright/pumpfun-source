// Source-adapted full foreground module, with injected browser and React capability.
export function createForegroundModule({
  document,
  window,
  useSyncExternalStore,
}) {
  var t = { useSyncExternalStore };
  let n = () => "visible" === document.visibilityState && document.hasFocus(),
    r = () => "visible" === document.visibilityState,
    i = () => !1,
    a = (e) => (
      document.addEventListener("visibilitychange", e),
      window.addEventListener("focus", e),
      window.addEventListener("blur", e),
      () => {
        (document.removeEventListener("visibilitychange", e),
          window.removeEventListener("focus", e),
          window.removeEventListener("blur", e));
      }
    ),
    o = () => (0, t.useSyncExternalStore)(a, n, i),
    s = (e) => (
      document.addEventListener("visibilitychange", e),
      () => {
        document.removeEventListener("visibilitychange", e);
      }
    ),
    l = () => (0, t.useSyncExternalStore)(s, r, i);
  return {
    useFocused: o,
    useVisible: l,
    useForegroundInterval: (e, t) => {
      let n = o();
      return !!(void 0 === t || t) && !!n && "number" == typeof e && e;
    },
    useVisibleInterval: (e, t) => {
      let n = l();
      return !!(void 0 === t || t) && !!n && "number" == typeof e && e;
    },
  };
}
