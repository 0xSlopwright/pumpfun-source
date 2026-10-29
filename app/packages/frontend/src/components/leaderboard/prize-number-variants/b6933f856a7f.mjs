// One explicitly selected original NumberFormat source context.
export function createNumberFormatter({ Intl }) {
  let i = new Map(),
    n = (e, t) => {
      if (!t) return e;
      let r = Object.entries(t)
        .filter(([, e]) => void 0 !== e)
        .sort(([e], [t]) => e.localeCompare(t))
        .map(([e, t]) => `${e}:${String(t)}`)
        .join("|");
      return 0 === r.length ? e : `${e}|${r}`;
    },
    o = (e, t, r) => {
      let a = e.get(t);
      if (void 0 !== a) return a;
      let i = r();
      if (e.size >= 50) {
        let t = e.keys().next().value;
        void 0 !== t && e.delete(t);
      }
      return (e.set(t, i), i);
    },
    l = (e, t) => o(i, n(e, t), () => new Intl.NumberFormat(e, t));
  return l;
}
