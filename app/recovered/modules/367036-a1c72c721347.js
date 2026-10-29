// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(462378);
  let r = [
    {
      symbol: "SOL",
      label: "SOL",
      mintAddress: "So11111111111111111111111111111111111111112",
      decimals: 9,
    },
    {
      symbol: "USDC",
      label: "USDC",
      mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
    },
    {
      symbol: "PUMP",
      label: "$PUMP",
      mintAddress: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
      decimals: 6,
    },
  ];
  e.s([
    "m",
    0,
    r,
    "Q",
    0,
    "SOL",
    "S",
    0,
    (e) => {
      switch (e) {
        case "PUBLISH":
          return t.g.Publish;
        case "REWARD_POOL_CREATE":
          return t.g.RewardPoolCreate;
        case "TOP_UP":
          return t.g.TopUp;
      }
    },
    "y",
    0,
    (e) => r.find((t) => t.symbol === e) ?? r[0],
    "I",
    0,
    (e) => r.find((t) => t.mintAddress === e),
  ]);
};
