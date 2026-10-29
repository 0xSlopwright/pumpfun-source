// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(292686),
    r = e.i(26101),
    n = e.i(806846);
  let i = {
      INBOX_SCREEN: {
        sourceScreen: t.Ae.DM_INBOX,
        sourceElement: t.k9.UNSPECIFIED,
        sourceElementType: t.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      INBOX_ROW: {
        sourceScreen: t.Ae.DM_INBOX,
        sourceElement: t.k9.DM_INBOX_ROW,
        sourceElementType: t.eD.ROW,
        ownershipGroup: "CHAT",
      },
      ARCHIVED_SCREEN: {
        sourceScreen: t.Ae.DM_ARCHIVED,
        sourceElement: t.k9.UNSPECIFIED,
        sourceElementType: t.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      ROOM_SCREEN: {
        sourceScreen: t.Ae.DM_ROOM,
        sourceElement: t.k9.UNSPECIFIED,
        sourceElementType: t.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      ROOM_COMPOSER: {
        sourceScreen: t.Ae.DM_ROOM,
        sourceElement: t.k9.DM_COMPOSER,
        sourceElementType: t.eD.INPUT,
        ownershipGroup: "CHAT",
      },
      ROOM_SEND_BUTTON: {
        sourceScreen: t.Ae.DM_ROOM,
        sourceElement: t.k9.DM_SEND_BUTTON,
        sourceElementType: t.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      ROOM_GATE_BANNER: {
        sourceScreen: t.Ae.DM_ROOM,
        sourceElement: t.k9.DM_MUTUAL_FOLLOW_GATE_BANNER,
        sourceElementType: t.eD.BANNER,
        ownershipGroup: "CHAT",
      },
      NEW_CHAT_PICKER_ROW: {
        sourceScreen: t.Ae.DM_NEW_CHAT,
        sourceElement: t.k9.DM_NEW_CHAT_PICKER_ROW,
        sourceElementType: t.eD.ROW,
        ownershipGroup: "CHAT",
      },
      INBOX_SUGGESTION_ROW: {
        sourceScreen: t.Ae.DM_INBOX,
        sourceElement: t.k9.DM_NEW_CHAT_PICKER_ROW,
        sourceElementType: t.eD.ROW,
        ownershipGroup: "CHAT",
      },
      PROFILE_MESSAGE_BUTTON: {
        sourceScreen: t.Ae.PROFILE,
        sourceElement: t.k9.DM_PROFILE_MESSAGE_BUTTON,
        sourceElementType: t.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      INBOX_ROW_ACTIONS: {
        sourceScreen: t.Ae.DM_INBOX,
        sourceElement: t.k9.DM_INBOX_ROW,
        sourceElementType: t.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      ARCHIVED_ROW_ACTIONS: {
        sourceScreen: t.Ae.DM_ARCHIVED,
        sourceElement: t.k9.DM_INBOX_ROW,
        sourceElementType: t.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
    },
    s = {
      sourceScreen: t.Ae.DM_ROOM,
      sourceElement: t.k9.WITHDRAWAL_MODAL,
      sourceElementType: t.eD.MODAL,
      ownershipGroup: "ONBOARDING_AND_FUNDING",
    },
    a = {
      [t.z.PUSH_NOTIFICATION]: t.k9.DM_PUSH_NOTIFICATION,
      [t.z.FOREGROUND_TOAST]: t.k9.DM_FOREGROUND_TOAST,
      [t.z.NOTIFICATION_CENTER]: t.k9.DM_NOTIFICATION_CENTER_ROW,
      [t.z.SHARE_CONFIRM_TOAST]: t.k9.DM_SHARE_CONFIRM_TOAST,
    },
    l = {
      [t.jc.COIN]: t.k9.DM_COIN_EMBED_CARD,
      [t.jc.PROFILE]: t.k9.DM_PROFILE_EMBED_CARD,
      [t.jc.CALLOUT]: t.k9.DM_CALLOUT_EMBED_CARD,
    },
    o = {
      not_mutual: t.vc.NOT_MUTUAL,
      rate_limited: t.vc.RATE_LIMITED,
      media_rejected: t.vc.MEDIA_REJECTED,
      media_unavailable: t.vc.MEDIA_UNAVAILABLE,
      no_cc_profile: t.vc.NO_CC_PROFILE,
      sensitive_content: t.vc.UNKNOWN,
      unknown: t.vc.UNKNOWN,
    },
    c = new Set([t.vc.RATE_LIMITED, t.vc.NETWORK, t.vc.UNKNOWN]),
    u = {
      one_hour: t.Bz.ONE_HOUR,
      eight_hours: t.Bz.EIGHT_HOURS,
      one_week: t.Bz.ONE_WEEK,
      forever: t.Bz.FOREVER,
    },
    d = {
      profile_button: i.PROFILE_MESSAGE_BUTTON,
      new_chat_picker: i.NEW_CHAT_PICKER_ROW,
      inbox_suggestion: i.INBOX_SUGGESTION_ROW,
    };
  e.s([
    "_",
    0,
    function (e) {
      let r = e?.trim().length ?? 0;
      return 0 === r
        ? t.hS.EMPTY
        : r <= 20
          ? t.hS.XS_1_20
          : r <= 80
            ? t.hS.S_21_80
            : r <= 300
              ? t.hS.M_81_300
              : t.hS.L_301_PLUS;
    },
    "$",
    0,
    function ({ hasText: e, hasImage: r, isGif: n, hasEmbed: i }) {
      return r
        ? n
          ? e
            ? t.of.TEXT_WITH_GIF
            : t.of.GIF
          : e
            ? t.of.TEXT_WITH_IMAGE
            : t.of.IMAGE
        : i
          ? t.of.LINK_EMBED
          : e
            ? t.of.TEXT
            : t.of.UNSPECIFIED;
    },
    "i",
    0,
    function (e) {
      return "coin" === e
        ? t.jc.COIN
        : "profile" === e
          ? t.jc.PROFILE
          : t.jc.CALLOUT;
    },
    "x",
    0,
    function (e) {
      return "seed_phrase" === e ? t.JD.SEED_PHRASE : t.JD.PRIVATE_KEY;
    },
    "F",
    0,
    function ({ code: e, status: r }) {
      return void 0 === e
        ? t.vc.UNKNOWN
        : "unknown" === e && void 0 === r
          ? t.vc.NETWORK
          : o[e];
    },
    "A",
    0,
    function (e) {
      (0, n.j)((0, r.KK)({ ...e, hasPrefilledDraft: !1 }), i.ROOM_COMPOSER);
    },
    "h",
    0,
    function ({ prefs: e, muteDuration: s, entryPoint: a, ...l }) {
      let o =
          a === t.z.ARCHIVED_LIST
            ? i.ARCHIVED_ROW_ACTIONS
            : i.INBOX_ROW_ACTIONS,
        c = (e, t = !1) =>
          (0, n.j)(
            (0, r.M5)({
              ...l,
              action: e,
              muteDuration: t && void 0 !== s ? u[s] : void 0,
              entryPoint: a,
            }),
            o,
          );
      (void 0 !== e.isArchived &&
        c(e.isArchived ? t.IE.ARCHIVE : t.IE.UNARCHIVE),
        void 0 !== e.isMuted && (e.isMuted ? c(t.IE.MUTE, !0) : c(t.IE.UNMUTE)),
        void 0 !== e.isPinned && c(e.isPinned ? t.IE.PIN : t.IE.UNPIN));
    },
    "E",
    0,
    function () {
      (0, n.j)((0, r.aH)({ interactionType: t.EG.DISMISS }), s);
    },
    "B",
    0,
    function (e) {
      (0, n.j)((0, r.sF)(e), i.ROOM_SCREEN);
    },
    "N",
    0,
    function (e) {
      (0, n.j)((0, r.Kl)(e), i.ROOM_SCREEN);
    },
    "P",
    0,
    function (e) {
      (0, n.j)((0, r.Tr)(e), {
        sourceScreen: t.Ae.DM_ROOM,
        sourceElement: l[e.embedType] ?? t.k9.UNSPECIFIED,
        sourceElementType: t.eD.CARD,
        ownershipGroup: "CHAT",
      });
    },
    "D",
    0,
    function (e) {
      (0, n.j)((0, r.wA)(e), i.INBOX_SCREEN);
    },
    "O",
    0,
    function () {
      (0, n.j)((0, r.aH)({ interactionType: t.EG.CLICK }), s);
    },
    "M",
    0,
    function (e) {
      (0, n.j)(
        (0, r.X3)({ ...e, isNewConversation: void 0 === e.conversationId }),
        (function (e) {
          if (e === t.z.INBOX_ROW) return i.INBOX_ROW;
          if (e === t.z.PEER_PROFILE_BUTTON) return i.PROFILE_MESSAGE_BUTTON;
          if (e === t.z.NEW_CHAT_PICKER) return i.NEW_CHAT_PICKER_ROW;
          let r = a[e];
          return void 0 !== r
            ? {
                sourceScreen: t.Ae.DM_ROOM,
                sourceElement: r,
                sourceElementType: t.eD.NOTIFICATION,
                ownershipGroup: "CHAT",
              }
            : i.ROOM_SCREEN;
        })(e.entryPoint),
      );
    },
    "n",
    0,
    function (e) {
      (0, n.j)(
        (0, r.Ls)({ ...e, isEmpty: 0 === e.conversationCount }),
        e.slice === t.zm.ARCHIVED ? i.ARCHIVED_SCREEN : i.INBOX_SCREEN,
      );
    },
    "L",
    0,
    function (e) {
      (0, n.j)((0, r.$Y)(e), i.ROOM_GATE_BANNER);
    },
    "C",
    0,
    function (e) {
      (0, n.j)((0, r.IX)(e), i.ROOM_SEND_BUTTON);
    },
    "r",
    0,
    function (e) {
      (0, n.j)((0, r.Ey)(e), i.ROOM_COMPOSER);
    },
    "j",
    0,
    function (e) {
      (0, n.j)(
        (0, r.gs)({ ...e, isRetryable: c.has(e.errorReason) }),
        i.ROOM_SEND_BUTTON,
      );
    },
    "k",
    0,
    function (e) {
      (0, n.j)((0, r.KS)(e), i.ROOM_SEND_BUTTON);
    },
    "y",
    0,
    function ({ surface: e, ...t }) {
      (0, n.j)((0, r.RV)(t), d[e]);
    },
    "m",
    0,
    function (e) {
      (0, n.j)((0, r.o)(e), i.ROOM_SCREEN);
    },
  ]);
};
