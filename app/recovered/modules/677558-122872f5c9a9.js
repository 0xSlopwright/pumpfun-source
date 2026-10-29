// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(970260),
    s = t.i(731110);
  async function a({ solanaClient: t, tx: i }) {
    let l = (0, e.O)().decode((0, s.w)(i)),
      { value: n } = await t.rpc.getFeeForMessage(l).send();
    return n ?? 0n;
  }
  async function i({ solanaClient: t, tx: s, replaceRecentBlockhash: a }) {
    let { value: l } = await t.rpc
      .simulateTransaction((0, e.O)().decode(s), {
        commitment: "confirmed",
        encoding: "base64",
        sigVerify: !1,
        replaceRecentBlockhash: a,
      })
      .send();
    if ("BlockhashNotFound" === l.err && a)
      throw Error("Simulation failed: Blockhash not found");
    return "BlockhashNotFound" === l.err
      ? await i({ solanaClient: t, tx: s, replaceRecentBlockhash: !0 })
      : {
          logs: l.logs ?? [],
          error: l.err,
          hasError: !!l.err,
          hasFunds:
            l.logs?.every(
              (t) =>
                !/insufficient funds/gi.test(t) &&
                !/insufficient lamports/gi.test(t),
            ) ?? !0,
        };
  }
  t.s(["f", 0, a, "s", 0, i]);
};
