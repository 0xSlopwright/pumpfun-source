// One explicitly selected original NumberFormat source context.
export function createNumberFormatter({ Intl }) {
  let i = new Map(),
    o = (e, t) => {
      if (!t) return e;
      let n = Object.entries(t)
        .filter(([, e]) => void 0 !== e)
        .sort(([e], [t]) => e.localeCompare(t))
        .map(([e, t]) => `${e}:${String(t)}`)
        .join("|");
      return 0 === n.length ? e : `${e}|${n}`;
    },
    s = (e, t, n) => {
      let r = e.get(t);
      if (void 0 !== r) return r;
      let i = n();
      if (e.size >= 50) {
        let t = e.keys().next().value;
        void 0 !== t && e.delete(t);
      }
      return (e.set(t, i), i);
    },
    l = (e, t) => s(i, o(e, t), () => new Intl.NumberFormat(e, t));
  return l;
}
