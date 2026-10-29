// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(402030),
    a = e.i(759257),
    l = e.i(819757);
  let r = "POST /callout/create",
    i = (e) => (0, t.isContractError)(e, r),
    n = new Set([
      "MEDIA_EXPIRED",
      "MEDIA_NOT_CLEAN",
      "MEDIA_NOT_OWNED",
      "MEDIA_RATE_LIMITED",
      "VIDEO_DISABLED",
    ]),
    o = {
      codes: {
        ATTEMPT_LIMIT: "web.callouts.ineligible_attempt_limit",
        COOLDOWN: "web.callouts.ineligible_cooldown",
        DUPLICATE_CALLOUT: "web.callouts.ineligible_existing",
        INSUFFICIENT_BALANCE: "web.callouts.ineligible_generic",
        INVALID_CONTENT: "web.callouts.create_moderation_flagged",
        MAYHEM_NOT_COMPLETED: "web.callouts.create_mayhem_not_completed",
        MEDIA_EXPIRED: "web.callouts.create_media_expired",
        MEDIA_NOT_CLEAN: "web.callouts.create_media_not_clean",
        MEDIA_NOT_OWNED: "web.callouts.create_media_not_owned",
        MEDIA_RATE_LIMITED: "web.callouts.create_media_rate_limited",
        NOT_GROUP_ADMIN: "web.callouts.not_group_admin",
        NO_ELIGIBLE_WALLET: "callouts.errors.no_eligible_wallet",
        PRICE_UNAVAILABLE: "web.callouts.create_price_unavailable",
        SPAM_RESTRICTED: "callouts.reply.errors.spam_restricted",
        USER_BANNED: "callouts.errors.user_banned",
        VIDEO_DISABLED: "web.callouts.create_video_disabled",
      },
      statuses: {
        401: "web.callouts.create_session_expired",
        413: "callouts.reply.errors.media_too_large",
        422: "web.callouts.create_moderation_flagged",
      },
      fallback: "web.callouts.create_failed_generic",
    };
  async function s(e) {
    let t = await (0, a.j)()(r, {
        body: (({
          tokenAddress: e,
          content: t,
          chainId: a,
          chain: l,
          image: r,
          mediaId: i,
          sourceRef: n,
        }) => ({
          coinMint: e,
          ...(t ? { thesis: t } : {}),
          ...(null != a ? { chainId: a } : {}),
          ...(l ? { chain: l } : {}),
          version: 2,
          ...(i ? { mediaId: i } : r ? { image: r } : {}),
          ...(n ? { sourceRef: n } : {}),
        }))(e),
        credentials: "include",
      }),
      l = t.callout?.calloutId;
    if (!l) throw Error(`${r} answered without a calloutId`);
    return { id: l };
  }
  e.s([
    "m",
    0,
    class extends Error {
      constructor() {
        (super("callout create skipped: no session address"),
          (this.name = "CalloutSessionMissingError"));
      }
    },
    "Q",
    0,
    (e) => (0, l.I)(e, r, o),
    "q",
    0,
    (e, t) => i(e) && e.code === t,
    "S",
    0,
    i,
    "w",
    0,
    (e) => i(e) && (413 === e.status || (null !== e.code && n.has(e.code))),
    "I",
    0,
    s,
  ]);
};
