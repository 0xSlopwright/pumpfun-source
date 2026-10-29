// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(575281),
    n = e.i(971370),
    r = e.i(51954);
  async function o({
    tokenMint: e,
    address: a,
    pollingInterval: l,
    maxAttempts: i,
    activePolls: c,
    isPollValid: s,
    refreshBalances: u,
  }) {
    let f = r.f.getState().connection;
    if (!f || !s()) return;
    let h = 0,
      d = (0, t.h)(new n.PublicKey(e), new n.PublicKey(a)),
      p = (t) => {
        (clearInterval(t), c.get(e) === t && c.delete(e));
      },
      v = setInterval(async () => {
        h++;
        try {
          (await f.getAccountInfo(d))
            ? (p(v), await u())
            : h >= i && (p(v), await u());
        } catch (e) {
          (console.error("Error polling for token account:", e),
            h >= i && (p(v), await u()));
        }
      }, l),
      b = c.get(e);
    (b && clearInterval(b), c.set(e, v));
  }
  e.s(["startTokenAccountPoll", 0, o]);
};
