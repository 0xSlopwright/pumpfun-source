// Source-adapted full foreground module, with injected browser and React capability.
export function createForegroundModule({
  document,
  window,
  useSyncExternalStore,
}) {
  var t = { useSyncExternalStore };
  let r = () => "visible" === document.visibilityState && document.hasFocus(),
    n = () => "visible" === document.visibilityState,
    i = () => !1,
    o = (e) => (
      document.addEventListener("visibilitychange", e),
      window.addEventListener("focus", e),
      window.addEventListener("blur", e),
      () => {
        (document.removeEventListener("visibilitychange", e),
          window.removeEventListener("focus", e),
          window.removeEventListener("blur", e));
      }
    ),
    a = () => (0, t.useSyncExternalStore)(o, r, i),
    s = (e) => (
      document.addEventListener("visibilitychange", e),
      () => {
        document.removeEventListener("visibilitychange", e);
      }
    ),
    l = () => (0, t.useSyncExternalStore)(s, n, i);
  return {
    useFocused: a,
    useVisible: l,
    useForegroundInterval: (e, t) => {
      let r = a();
      return !!(void 0 === t || t) && !!r && "number" == typeof e && e;
    },
    useVisibleInterval: (e, t) => {
      let r = l();
      return !!(void 0 === t || t) && !!r && "number" == typeof e && e;
    },
  };
}
