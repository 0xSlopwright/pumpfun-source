// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(367498);
  let r = "https://pump.mypinata.cloud/ipfs/";
  e.s([
    "z",
    0,
    {
      ticker: 20,
      chart: 24,
      preview: 36,
      list: 40,
      dialog: 48,
      leaderboardRow: 48,
      podium: 80,
    },
    "Z",
    0,
    ({ sourceUrl: e, width: n, ipfsPrefix: i = r }) => {
      let a = e?.trim();
      if (!a) return null;
      let l = (0, t.D)(a, i);
      if (!(0, t.d)(l)) return l;
      let o = new URL(l);
      return (
        o.searchParams.set("img-width", String(n)),
        o.searchParams.set("img-dpr", String(2)),
        o.searchParams.set("img-onerror", "redirect"),
        o.toString()
      );
    },
  ]);
};
