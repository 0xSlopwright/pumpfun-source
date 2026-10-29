// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(292686),
    t = e.i(26101),
    r = e.i(806846);
  let i = {
      INBOX_SCREEN: {
        sourceScreen: n.Ae.DM_INBOX,
        sourceElement: n.k9.UNSPECIFIED,
        sourceElementType: n.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      INBOX_ROW: {
        sourceScreen: n.Ae.DM_INBOX,
        sourceElement: n.k9.DM_INBOX_ROW,
        sourceElementType: n.eD.ROW,
        ownershipGroup: "CHAT",
      },
      ARCHIVED_SCREEN: {
        sourceScreen: n.Ae.DM_ARCHIVED,
        sourceElement: n.k9.UNSPECIFIED,
        sourceElementType: n.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      ROOM_SCREEN: {
        sourceScreen: n.Ae.DM_ROOM,
        sourceElement: n.k9.UNSPECIFIED,
        sourceElementType: n.eD.SCREEN,
        ownershipGroup: "CHAT",
      },
      ROOM_COMPOSER: {
        sourceScreen: n.Ae.DM_ROOM,
        sourceElement: n.k9.DM_COMPOSER,
        sourceElementType: n.eD.INPUT,
        ownershipGroup: "CHAT",
      },
      ROOM_SEND_BUTTON: {
        sourceScreen: n.Ae.DM_ROOM,
        sourceElement: n.k9.DM_SEND_BUTTON,
        sourceElementType: n.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      ROOM_GATE_BANNER: {
        sourceScreen: n.Ae.DM_ROOM,
        sourceElement: n.k9.DM_MUTUAL_FOLLOW_GATE_BANNER,
        sourceElementType: n.eD.BANNER,
        ownershipGroup: "CHAT",
      },
      NEW_CHAT_PICKER_ROW: {
        sourceScreen: n.Ae.DM_NEW_CHAT,
        sourceElement: n.k9.DM_NEW_CHAT_PICKER_ROW,
        sourceElementType: n.eD.ROW,
        ownershipGroup: "CHAT",
      },
      INBOX_SUGGESTION_ROW: {
        sourceScreen: n.Ae.DM_INBOX,
        sourceElement: n.k9.DM_NEW_CHAT_PICKER_ROW,
        sourceElementType: n.eD.ROW,
        ownershipGroup: "CHAT",
      },
      PROFILE_MESSAGE_BUTTON: {
        sourceScreen: n.Ae.PROFILE,
        sourceElement: n.k9.DM_PROFILE_MESSAGE_BUTTON,
        sourceElementType: n.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      INBOX_ROW_ACTIONS: {
        sourceScreen: n.Ae.DM_INBOX,
        sourceElement: n.k9.DM_INBOX_ROW,
        sourceElementType: n.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
      ARCHIVED_ROW_ACTIONS: {
        sourceScreen: n.Ae.DM_ARCHIVED,
        sourceElement: n.k9.DM_INBOX_ROW,
        sourceElementType: n.eD.BUTTON,
        ownershipGroup: "CHAT",
      },
    },
    o = {
      sourceScreen: n.Ae.DM_ROOM,
      sourceElement: n.k9.WITHDRAWAL_MODAL,
      sourceElementType: n.eD.MODAL,
      ownershipGroup: "ONBOARDING_AND_FUNDING",
    },
    E = {
      [n.z.PUSH_NOTIFICATION]: n.k9.DM_PUSH_NOTIFICATION,
      [n.z.FOREGROUND_TOAST]: n.k9.DM_FOREGROUND_TOAST,
      [n.z.NOTIFICATION_CENTER]: n.k9.DM_NOTIFICATION_CENTER_ROW,
      [n.z.SHARE_CONFIRM_TOAST]: n.k9.DM_SHARE_CONFIRM_TOAST,
    },
    s = {
      [n.jc.COIN]: n.k9.DM_COIN_EMBED_CARD,
      [n.jc.PROFILE]: n.k9.DM_PROFILE_EMBED_CARD,
      [n.jc.CALLOUT]: n.k9.DM_CALLOUT_EMBED_CARD,
    },
    u = {
      not_mutual: n.vc.NOT_MUTUAL,
      rate_limited: n.vc.RATE_LIMITED,
      media_rejected: n.vc.MEDIA_REJECTED,
      media_unavailable: n.vc.MEDIA_UNAVAILABLE,
      no_cc_profile: n.vc.NO_CC_PROFILE,
      sensitive_content: n.vc.UNKNOWN,
      unknown: n.vc.UNKNOWN,
    },
    _ = new Set([n.vc.RATE_LIMITED, n.vc.NETWORK, n.vc.UNKNOWN]),
    c = {
      one_hour: n.Bz.ONE_HOUR,
      eight_hours: n.Bz.EIGHT_HOURS,
      one_week: n.Bz.ONE_WEEK,
      forever: n.Bz.FOREVER,
    },
    O = {
      profile_button: i.PROFILE_MESSAGE_BUTTON,
      new_chat_picker: i.NEW_CHAT_PICKER_ROW,
      inbox_suggestion: i.INBOX_SUGGESTION_ROW,
    };
  e.s([
    "_",
    0,
    function (e) {
      let t = e?.trim().length ?? 0;
      return 0 === t
        ? n.hS.EMPTY
        : t <= 20
          ? n.hS.XS_1_20
          : t <= 80
            ? n.hS.S_21_80
            : t <= 300
              ? n.hS.M_81_300
              : n.hS.L_301_PLUS;
    },
    "$",
    0,
    function ({ hasText: e, hasImage: t, isGif: r, hasEmbed: i }) {
      return t
        ? r
          ? e
            ? n.of.TEXT_WITH_GIF
            : n.of.GIF
          : e
            ? n.of.TEXT_WITH_IMAGE
            : n.of.IMAGE
        : i
          ? n.of.LINK_EMBED
          : e
            ? n.of.TEXT
            : n.of.UNSPECIFIED;
    },
    "i",
    0,
    function (e) {
      return "coin" === e
        ? n.jc.COIN
        : "profile" === e
          ? n.jc.PROFILE
          : n.jc.CALLOUT;
    },
    "x",
    0,
    function (e) {
      return "seed_phrase" === e ? n.JD.SEED_PHRASE : n.JD.PRIVATE_KEY;
    },
    "F",
    0,
    function ({ code: e, status: t }) {
      return void 0 === e
        ? n.vc.UNKNOWN
        : "unknown" === e && void 0 === t
          ? n.vc.NETWORK
          : u[e];
    },
    "A",
    0,
    function (e) {
      (0, r.j)((0, t.KK)({ ...e, hasPrefilledDraft: !1 }), i.ROOM_COMPOSER);
    },
    "h",
    0,
    function ({ prefs: e, muteDuration: o, entryPoint: E, ...s }) {
      let u =
          E === n.z.ARCHIVED_LIST
            ? i.ARCHIVED_ROW_ACTIONS
            : i.INBOX_ROW_ACTIONS,
        _ = (e, n = !1) =>
          (0, r.j)(
            (0, t.M5)({
              ...s,
              action: e,
              muteDuration: n && void 0 !== o ? c[o] : void 0,
              entryPoint: E,
            }),
            u,
          );
      (void 0 !== e.isArchived &&
        _(e.isArchived ? n.IE.ARCHIVE : n.IE.UNARCHIVE),
        void 0 !== e.isMuted && (e.isMuted ? _(n.IE.MUTE, !0) : _(n.IE.UNMUTE)),
        void 0 !== e.isPinned && _(e.isPinned ? n.IE.PIN : n.IE.UNPIN));
    },
    "E",
    0,
    function () {
      (0, r.j)((0, t.aH)({ interactionType: n.EG.DISMISS }), o);
    },
    "B",
    0,
    function (e) {
      (0, r.j)((0, t.sF)(e), i.ROOM_SCREEN);
    },
    "N",
    0,
    function (e) {
      (0, r.j)((0, t.Kl)(e), i.ROOM_SCREEN);
    },
    "P",
    0,
    function (e) {
      (0, r.j)((0, t.Tr)(e), {
        sourceScreen: n.Ae.DM_ROOM,
        sourceElement: s[e.embedType] ?? n.k9.UNSPECIFIED,
        sourceElementType: n.eD.CARD,
        ownershipGroup: "CHAT",
      });
    },
    "D",
    0,
    function (e) {
      (0, r.j)((0, t.wA)(e), i.INBOX_SCREEN);
    },
    "O",
    0,
    function () {
      (0, r.j)((0, t.aH)({ interactionType: n.EG.CLICK }), o);
    },
    "M",
    0,
    function (e) {
      (0, r.j)(
        (0, t.X3)({ ...e, isNewConversation: void 0 === e.conversationId }),
        (function (e) {
          if (e === n.z.INBOX_ROW) return i.INBOX_ROW;
          if (e === n.z.PEER_PROFILE_BUTTON) return i.PROFILE_MESSAGE_BUTTON;
          if (e === n.z.NEW_CHAT_PICKER) return i.NEW_CHAT_PICKER_ROW;
          let t = E[e];
          return void 0 !== t
            ? {
                sourceScreen: n.Ae.DM_ROOM,
                sourceElement: t,
                sourceElementType: n.eD.NOTIFICATION,
                ownershipGroup: "CHAT",
              }
            : i.ROOM_SCREEN;
        })(e.entryPoint),
      );
    },
    "n",
    0,
    function (e) {
      (0, r.j)(
        (0, t.Ls)({ ...e, isEmpty: 0 === e.conversationCount }),
        e.slice === n.zm.ARCHIVED ? i.ARCHIVED_SCREEN : i.INBOX_SCREEN,
      );
    },
    "L",
    0,
    function (e) {
      (0, r.j)((0, t.$Y)(e), i.ROOM_GATE_BANNER);
    },
    "C",
    0,
    function (e) {
      (0, r.j)((0, t.IX)(e), i.ROOM_SEND_BUTTON);
    },
    "r",
    0,
    function (e) {
      (0, r.j)((0, t.Ey)(e), i.ROOM_COMPOSER);
    },
    "j",
    0,
    function (e) {
      (0, r.j)(
        (0, t.gs)({ ...e, isRetryable: _.has(e.errorReason) }),
        i.ROOM_SEND_BUTTON,
      );
    },
    "k",
    0,
    function (e) {
      (0, r.j)((0, t.KS)(e), i.ROOM_SEND_BUTTON);
    },
    "y",
    0,
    function ({ surface: e, ...n }) {
      (0, r.j)((0, t.RV)(n), O[e]);
    },
    "m",
    0,
    function (e) {
      (0, r.j)((0, t.o)(e), i.ROOM_SCREEN);
    },
  ]);
};
