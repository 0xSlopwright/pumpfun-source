// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(753887),
    r = t.i(971370),
    n = t.i(959719);
  t.s([
    "f",
    0,
    function (t, i, o, s, a = n.z, u = n.x) {
      return (function (t, e, i, o, s, a = n.z, u = n.x) {
        let l = [
          { pubkey: t, isSigner: !0, isWritable: !0 },
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: i, isSigner: !1, isWritable: !1 },
          { pubkey: o, isSigner: !1, isWritable: !1 },
          { pubkey: r.SystemProgram.programId, isSigner: !1, isWritable: !1 },
          { pubkey: a, isSigner: !1, isWritable: !1 },
        ];
        return new r.TransactionInstruction({ keys: l, programId: u, data: s });
      })(t, i, o, s, e.Buffer.from([1]), a, u);
    },
  ]);
};
