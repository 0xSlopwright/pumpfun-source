// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(753887),
    r = t.i(742542);
  t.i(457417);
  var i = t.i(973926),
    n = t.i(340907),
    s = t.i(232215),
    o = t.i(971370),
    u = t.i(856136),
    f = t.i(108983),
    c = t.i(300699),
    h = t.i(835732);
  let l = (0, r.struct)([
      (0, r.u8)("m"),
      (0, r.u8)("n"),
      (0, i.f)("isInitialized"),
      (0, n.f)("signer1"),
      (0, n.f)("signer2"),
      (0, n.f)("signer3"),
      (0, n.f)("signer4"),
      (0, n.f)("signer5"),
      (0, n.f)("signer6"),
      (0, n.f)("signer7"),
      (0, n.f)("signer8"),
      (0, n.f)("signer9"),
      (0, n.f)("signer10"),
      (0, n.f)("signer11"),
    ]).span,
    a = (0, r.struct)([
      (0, r.u32)("mintAuthorityOption"),
      (0, n.f)("mintAuthority"),
      (0, s.H)("supply"),
      (0, r.u8)("decimals"),
      (0, i.f)("isInitialized"),
      (0, r.u32)("freezeAuthorityOption"),
      (0, n.f)("freezeAuthority"),
    ]),
    d = a.span;
  t.s(
    [
      "h",
      0,
      function (t, e, r = !1, i = u.z, n = u.x) {
        if (!r && !o.PublicKey.isOnCurve(e.toBuffer())) throw new f.p();
        let [s] = o.PublicKey.findProgramAddressSync(
          [e.toBuffer(), i.toBuffer(), t.toBuffer()],
          n,
        );
        return s;
      },
      "g",
      0,
      function (t, r, i = u.z) {
        if (!r) throw new f.z();
        if (!r.owner.equals(i)) throw new f.n();
        if (r.data.length < d) throw new f.o();
        let n = a.decode(r.data.slice(0, d)),
          s = e.Buffer.alloc(0);
        if (r.data.length > d) {
          if (r.data.length <= h.C || r.data.length === l) throw new f.o();
          if (r.data[h.C] != c.d.Mint) throw new f.P();
          s = r.data.slice(h.C + c.h);
        }
        return {
          address: t,
          mintAuthority: n.mintAuthorityOption ? n.mintAuthority : null,
          supply: n.supply,
          decimals: n.decimals,
          isInitialized: n.isInitialized,
          freezeAuthority: n.freezeAuthorityOption ? n.freezeAuthority : null,
          tlvData: s,
        };
      },
    ],
    688842,
  );
};
