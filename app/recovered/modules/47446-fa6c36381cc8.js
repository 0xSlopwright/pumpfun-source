// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(753887),
    r = t.i(742542),
    n = t.i(971370),
    i = t.i(959719),
    o = t.i(685035),
    s = t.i(925119);
  let a = (0, r.struct)([(0, r.u8)("instruction")]);
  t.s([
    "f",
    0,
    function (t, r, u, l = [], h = i.z) {
      let c = (0, o.f)(
          [
            { pubkey: t, isSigner: !1, isWritable: !0 },
            { pubkey: r, isSigner: !1, isWritable: !0 },
          ],
          u,
          l,
        ),
        d = e.Buffer.alloc(a.span);
      return (
        a.encode({ instruction: s.f.CloseAccount }, d),
        new n.TransactionInstruction({ keys: c, programId: h, data: d })
      );
    },
  ]);
};
