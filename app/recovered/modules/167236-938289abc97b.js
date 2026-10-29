// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(445242);
  var t = e.i(78436),
    n = e.i(553052);
  let r = (0, t.$)()((e) => ({
    ...{ hosts: Object.fromEntries(n.d.map((e) => [e, n.V])) },
    recordSuccess: (t, r, a = Date.now()) =>
      e((e) => ({ hosts: { ...e.hosts, [t]: (0, n.y)(e.hosts[t], r, a) } })),
    recordNetworkFailure: (t, r) =>
      e((e) => ({ hosts: { ...e.hosts, [t]: (0, n.r)(e.hosts[t], r) } })),
  }));
  e.s(["f", 0, r]);
};
