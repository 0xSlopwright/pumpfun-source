// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(464649),
    i = e.i(656846),
    r = e.i(880783),
    n = e.i(228935),
    o = e.i(449597);
  let a = { asset: "sol", symbol: "SOL", decimals: o.K, imageUri: t.T.solana },
    s = {
      asset: "usdc",
      symbol: "USDC",
      decimals: o.J,
      imageUri: i.f.imageUri,
    },
    u = /^(\d*)(?:\.(\d*))?$/,
    l = /^\d*\.?\d*$/;
  e.s([
    "Z",
    0,
    "usdc",
    "S",
    0,
    [25, 50, 75, 100],
    "D",
    0,
    "external",
    "M",
    0,
    () => ({
      mint: o.X,
      name: "Solana",
      symbol: "SOL",
      description: "",
      image_uri: t.T.solana,
      video_uri: null,
      metadata_uri: "",
      bonding_curve: "",
      associated_bonding_curve: "",
      creator: "",
      created_timestamp: null,
      raydium_pool: null,
      complete: !0,
      virtual_sol_reserves: 0,
      virtual_token_reserves: 0,
      total_supply: 0,
      show_name: !0,
      market_cap: 0,
      usd_market_cap: 0,
      nsfw: !1,
      is_banned: !1,
      hide_banner: !1,
      is_currently_live: !1,
      livestream_ban_expiry: 0,
      program: r.u,
      platform: "non_launchpad",
      base_decimals: o.K,
      quote_mint: i.f.mint,
      has_external_swap_route: !0,
    }),
    "E",
    0,
    (e, t) => (0, n.f)(e, t),
    "R",
    0,
    (e) => ("usdc" === e ? "usdc_to_sol" : "sol_to_usdc"),
    "T",
    0,
    (e) =>
      "usdc_to_sol" === e
        ? { from: s, to: a, isBuy: !0 }
        : { from: a, to: s, isBuy: !1 },
    "k",
    0,
    (e) => ("usdc_to_sol" === e ? "sol_to_usdc" : "usdc_to_sol"),
    "e",
    0,
    (e, t) => {
      if (e <= BigInt(0)) return "";
      let i = e.toString().padStart(t + 1, "0"),
        r = i.slice(0, i.length - t),
        n = i.slice(i.length - t).replace(/0+$/, "");
      return n ? `${r}.${n}` : r;
    },
    "c",
    0,
    (e) => l.test(e),
    "m",
    0,
    (e) => e === o.X,
    "n",
    0,
    (e, t) => {
      let i = u.exec(e.trim());
      if (!i) return null;
      let [, r = "", n = ""] = i;
      return "" === r && "" === n
        ? null
        : BigInt(`${r || "0"}${n.slice(0, t).padEnd(t, "0")}`);
    },
    "i",
    0,
    (e, t) => (e * BigInt(t)) / BigInt(100),
  ]);
};
