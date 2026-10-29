// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(753887);
  var e,
    r,
    i = t.i(742542);
  t.i(457417);
  var n = t.i(340907),
    s = t.i(232215);
  (((e = r || (r = {}))[(e.Uninitialized = 0)] = "Uninitialized"),
    (e[(e.Initialized = 1)] = "Initialized"),
    (e[(e.Frozen = 2)] = "Frozen"));
  let o = (0, i.struct)([
      (0, n.f)("mint"),
      (0, n.f)("owner"),
      (0, s.H)("amount"),
      (0, i.u32)("delegateOption"),
      (0, n.f)("delegate"),
      (0, i.u8)("state"),
      (0, i.u32)("isNativeOption"),
      (0, s.H)("isNative"),
      (0, s.H)("delegatedAmount"),
      (0, i.u32)("closeAuthorityOption"),
      (0, n.f)("closeAuthority"),
    ]),
    u = o.span;
  t.s(["C", 0, u, "d", 0, o]);
};
