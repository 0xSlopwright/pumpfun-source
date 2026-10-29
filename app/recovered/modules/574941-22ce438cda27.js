// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(753887),
    r = t.i(742542),
    n = t.i(971370),
    i = t.i(959719),
    o = t.i(925119);
  let s = (0, r.struct)([(0, r.u8)("instruction")]);
  t.s([
    "f",
    0,
    function (t, r = i.z) {
      let a = e.Buffer.alloc(s.span);
      return (
        s.encode({ instruction: o.f.SyncNative }, a),
        new n.TransactionInstruction({
          keys: [{ pubkey: t, isSigner: !1, isWritable: !0 }],
          programId: r,
          data: a,
        })
      );
    },
  ]);
};
