// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(464649),
    a = e.i(656846),
    s = e.i(880783),
    l = e.i(228935),
    n = e.i(449597);
  let i = { asset: "sol", symbol: "SOL", decimals: n.K, imageUri: t.T.solana },
    r = {
      asset: "usdc",
      symbol: "USDC",
      decimals: n.J,
      imageUri: a.f.imageUri,
    },
    o = /^(\d*)(?:\.(\d*))?$/,
    u = /^\d*\.?\d*$/;
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
      mint: n.X,
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
      program: s.u,
      platform: "non_launchpad",
      base_decimals: n.K,
      quote_mint: a.f.mint,
      has_external_swap_route: !0,
    }),
    "E",
    0,
    (e, t) => (0, l.f)(e, t),
    "R",
    0,
    (e) => ("usdc" === e ? "usdc_to_sol" : "sol_to_usdc"),
    "T",
    0,
    (e) =>
      "usdc_to_sol" === e
        ? { from: r, to: i, isBuy: !0 }
        : { from: i, to: r, isBuy: !1 },
    "k",
    0,
    (e) => ("usdc_to_sol" === e ? "sol_to_usdc" : "usdc_to_sol"),
    "e",
    0,
    (e, t) => {
      if (e <= BigInt(0)) return "";
      let a = e.toString().padStart(t + 1, "0"),
        s = a.slice(0, a.length - t),
        l = a.slice(a.length - t).replace(/0+$/, "");
      return l ? `${s}.${l}` : s;
    },
    "c",
    0,
    (e) => u.test(e),
    "m",
    0,
    (e) => e === n.X,
    "n",
    0,
    (e, t) => {
      let a = o.exec(e.trim());
      if (!a) return null;
      let [, s = "", l = ""] = a;
      return "" === s && "" === l
        ? null
        : BigInt(`${s || "0"}${l.slice(0, t).padEnd(t, "0")}`);
    },
    "i",
    0,
    (e, t) => (e * BigInt(t)) / BigInt(100),
  ]);
};
