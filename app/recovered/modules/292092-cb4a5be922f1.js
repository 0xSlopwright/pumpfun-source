// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = [],
    a = new Set(),
    r = new Set(),
    n = () => {
      for (let e of r) e();
    },
    i = (e) => new Set([...a, e].slice(-200)),
    l = (e) => t.filter((t) => t.txHash !== e);
  e.s([
    "P",
    0,
    12e4,
    "F",
    0,
    (e) => {
      a.has(e) || (t.some((t) => t.txHash === e) && ((a = i(e)), n()));
    },
    "Y",
    0,
    (e) => {
      let a = l(e);
      a.length !== t.length && ((t = a), n());
    },
    "C",
    0,
    () => a,
    "y",
    0,
    () => t,
    "_",
    0,
    (e) => {
      var a;
      let r;
      ((r = (a = { ...e, sentAtMs: Date.now() }).sentAtMs - 864e5),
        (t = [
          ...t.filter((e) => e.txHash !== a.txHash && e.sentAtMs > r),
          a,
        ].slice(-50)),
        n());
    },
    "G",
    0,
    (e) => {
      let r = l(e);
      r.length !== t.length && ((t = r), (a = i(e)), n());
    },
    "j",
    0,
    (e) => (
      r.add(e),
      () => {
        r.delete(e);
      }
    ),
  ]);
};
