// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = "https://app.pump.fun",
    a = "leaderboard",
    l = (e) => {
      let a = {
        pid: e.mediaSource,
        c: e.campaign,
        af_adset: e.adSet,
        af_ad: e.adVariant,
        af_sub1: e.clickId ?? e.experimentId,
        af_web_dp: t,
      };
      return (
        e.additionalContext && (a.af_sub2 = e.additionalContext),
        e.clickId && (a.af_sub3 = e.experimentId),
        e.deepLinkValue &&
          ((a.deep_link_value = e.deepLinkValue),
          (a.af_dp = e.afDp ?? "pump://")),
        e.mint && (a.mint = e.mint),
        a
      );
    },
    r = {
      SMART_BANNER_WEB: (e, t) => ({
        mediaSource: "web_retail",
        campaign: "app_banner",
        adSet: "app_banner_2025_10",
        adVariant: "smart_banner",
        experimentId: "xp_23ay4e",
        additionalContext: "placement:home_top",
        deepLinkValue: e,
        mint: e,
        clickId: t,
      }),
      LEGACY_BANNER: (e) => ({
        mediaSource: "web_retail",
        campaign: "app_banner",
        adSet: "app_banner_2025_10",
        adVariant: "legacy_banner",
        experimentId: "xp_23ay4e",
        additionalContext: "placement:home_bottom",
        deepLinkValue: e,
        mint: e,
      }),
      MODAL_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "modal_upsell",
        adSet: "modal_upsell_2025_08",
        adVariant: "modal",
        experimentId: "xp_hackrc",
        additionalContext: "format:modal",
        deepLinkValue: e,
        mint: e,
      }),
      NOTIFICATIONS: (e) => ({
        mediaSource: "web_retail",
        campaign: "notifications_upsell",
        adSet: "notification_upsell_2025_10",
        adVariant: "modal",
        experimentId: "xp_rtxnos",
        additionalContext: "format:modal",
        deepLinkValue: e,
        mint: e,
      }),
      IMPORT_KEYS_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "import_keys_upsell",
        adSet: "import_keys_upsell_2025_11",
        experimentId: "xp_sonxrt",
        adVariant: "modal",
        deepLinkValue: "pump://wallet/import",
        additionalContext: "format:modal",
        mint: e,
      }),
      CALLOUT_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "callout_upsell",
        adSet: "callout_upsell_2026_05",
        adVariant: "modal",
        experimentId: "xp_callout",
        additionalContext: "placement:create_callout_dialog",
        deepLinkValue: e,
        mint: e,
      }),
      CALLOUT_PAGE_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "callout_upsell",
        adSet: "callout_upsell_2026_05",
        adVariant: "card",
        experimentId: "xp_callout",
        additionalContext: "placement:callout_page",
        deepLinkValue: e,
        mint: e,
      }),
      BOUNTY_CREATE_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "bounty_upsell",
        adSet: "bounty_upsell_2026_06",
        adVariant: "modal",
        experimentId: "xp_bounty",
        additionalContext: "placement:bounty_published_banner",
        deepLinkValue: e,
        mint: e,
      }),
      BOUNTY_SUBMISSION_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "bounty_upsell",
        adSet: "bounty_upsell_2026_06",
        adVariant: "modal",
        experimentId: "xp_bounty",
        additionalContext: "placement:bounty_submission_dialog",
        deepLinkValue: e,
        mint: e,
      }),
      EVM_TRADE_UPSELL: (e) => ({
        mediaSource: "web_retail",
        campaign: "evm_trade_upsell",
        adSet: "evm_trade_upsell_2026_06",
        adVariant: "card",
        experimentId: "xp_evm",
        additionalContext: "placement:coin_evm_trade",
        deepLinkValue: e,
        mint: e,
      }),
      CUP_JOIN_UPSELL: () => ({
        mediaSource: "web_retail",
        campaign: "cup_join_upsell",
        adSet: "cup_join_upsell_2026_10",
        adVariant: "button",
        experimentId: "xp_cup",
        additionalContext: "placement:leaderboard_cup_hero",
        deepLinkValue: a,
        afDp: `pump://${a}`,
      }),
    };
  e.s(["K", 0, r, "D", 0, t, "n", 0, l], 33474);
  var i = e.i(261907);
  let n = (e) => {
    if (!e) return null;
    let t = e.match(/\/coin\/([^/]+)/);
    return t ? t[1] : null;
  };
  e.s(
    [
      "d",
      0,
      (e, t, a) => {
        let o,
          s = (a ?? n(e)) || void 0;
        switch (t) {
          case "modal":
          default:
            o = r.MODAL_UPSELL(s);
            break;
          case "smart_banner":
            o = r.SMART_BANNER_WEB(s);
            break;
          case "legacy_banner":
            o = r.LEGACY_BANNER(s);
            break;
          case "notifications":
            o = r.NOTIFICATIONS(s);
            break;
          case "import_keys":
            o = r.IMPORT_KEYS_UPSELL(s);
            break;
          case "callout":
            o = r.CALLOUT_UPSELL(s);
            break;
          case "callout_page":
            o = r.CALLOUT_PAGE_UPSELL(s);
            break;
          case "bounty_create":
            o = r.BOUNTY_CREATE_UPSELL(s);
            break;
          case "bounty_submission":
            o = r.BOUNTY_SUBMISSION_UPSELL(s);
            break;
          case "evm_trade":
            o = r.EVM_TRADE_UPSELL(s);
            break;
          case "cup_join":
            o = r.CUP_JOIN_UPSELL();
        }
        let c = new URLSearchParams(l(o));
        return `${i.f.APPSFLYER_BASE_URL}?${c.toString()}`;
      },
      "I",
      0,
      n,
    ],
    955332,
  );
};
