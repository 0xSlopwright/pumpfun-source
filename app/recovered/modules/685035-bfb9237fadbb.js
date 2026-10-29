// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(971370);
  t.s([
    "f",
    0,
    function (t, r, n) {
      if (n.length)
        for (let i of (t.push({ pubkey: r, isSigner: !1, isWritable: !1 }), n))
          t.push({
            pubkey: i instanceof e.PublicKey ? i : i.publicKey,
            isSigner: !0,
            isWritable: !1,
          });
      else t.push({ pubkey: r, isSigner: !0, isWritable: !1 });
      return t;
    },
  ]);
};
