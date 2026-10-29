// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(753887),
    a = e.i(742542);
  e.i(457417);
  var r = e.i(232215),
    n = e.i(971370),
    i = e.i(959719),
    l = e.i(685035),
    s = e.i(925119);
  let o = (0, a.struct)([
    (0, a.u8)("instruction"),
    (0, r.H)("amount"),
    (0, a.u8)("decimals"),
  ]);
  (e.s(
    [
      "f",
      0,
      function (e, a, r, d, c, u, f = [], m = i.z) {
        let h = (0, l.f)(
            [
              { pubkey: e, isSigner: !1, isWritable: !0 },
              { pubkey: a, isSigner: !1, isWritable: !1 },
              { pubkey: r, isSigner: !1, isWritable: !0 },
            ],
            d,
            f,
          ),
          p = t.Buffer.alloc(o.span);
        return (
          o.encode(
            {
              instruction: s.f.TransferChecked,
              amount: BigInt(c),
              decimals: u,
            },
            p,
          ),
          new n.TransactionInstruction({ keys: h, programId: m, data: p })
        );
      },
    ],
    946065,
  ),
    e.s(
      [
        "f",
        0,
        function ({ amount: e, balance: t, solPrice: a }) {
          return t
            ? t.balance <= 0 || !Number.isFinite(t.value)
              ? 0
              : e * (t.value / t.balance)
            : e * a;
        },
      ],
      888435,
    ));
};
