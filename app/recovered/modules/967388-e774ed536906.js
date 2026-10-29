// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(292686);
  let n = t.Ae.LIVESTREAM,
    r = ({ element: e, type: t, screen: r = n }) => ({
      sourceScreen: r,
      sourceElement: e,
      sourceElementType: t,
      ownershipGroup: "LIVESTREAMS",
    }),
    i = {
      CLIP_BUTTON: r({
        element: t.k9.LIVESTREAM_CLIP_CONTROLS,
        type: t.eD.BUTTON,
      }),
      CLIP_POPOVER: r({
        element: t.k9.LIVESTREAM_CLIP_CONTROLS,
        type: t.eD.MODAL,
      }),
      ARCHIVED_VIDEO_PLAYER: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      CLIP_PREVIEW: r({
        element: t.k9.LIVESTREAM_CLIP_CONTROLS,
        type: t.eD.BUTTON,
      }),
      CLIP_CARD: r({ element: t.k9.UNSPECIFIED, type: t.eD.LIST_ITEM }),
    },
    o = {
      PIP_BUTTON: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      AUTO_PIP: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.EXPLICIT_NO_ELEMENT_TYPE,
      }),
      ROOM: r({ element: t.k9.LIVESTREAM_VIDEO_PLAYER, type: t.eD.SCREEN }),
      CONTROLS: r({ element: t.k9.LIVESTREAM_VIDEO_PLAYER, type: t.eD.BUTTON }),
      STAGE_CONTROLS: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
    },
    s = {
      VIEWER_CONTROLS: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      HOST_CONTROLS: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      PARTICIPANTS_LIST: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.LIST,
      }),
      INVITE_DIALOG: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.MODAL,
      }),
    },
    a = {
      JOIN: r({ element: t.k9.LIVESTREAM_VIDEO_PLAYER, type: t.eD.SCREEN }),
      START_BUTTON: r({
        element: t.k9.COIN_DETAILS_START_LIVESTREAM,
        type: t.eD.BUTTON,
        screen: t.Ae.COIN_DETAILS,
      }),
      GO_LIVE_BUTTON: r({
        element: t.k9.LIVESTREAM_MODAL_TITLE,
        type: t.eD.BUTTON,
      }),
      END_STREAM_BUTTON: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      RTMP_SETTINGS: r({
        element: t.k9.LIVESTREAM_MODAL_TITLE,
        type: t.eD.BUTTON,
      }),
    },
    l = {
      MEDIA_TOGGLE: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      DEVICE_SELECTOR: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
      TOKEN_GATE_TOGGLE: r({
        element: t.k9.LIVESTREAM_VIDEO_PLAYER,
        type: t.eD.BUTTON,
      }),
    },
    c = {
      CHAT: r({ element: t.k9.LIVECHAT, type: t.eD.LIST }),
      CHAT_MESSAGE: r({ element: t.k9.LIVECHAT, type: t.eD.LIST_ITEM }),
      CHAT_INPUT: r({ element: t.k9.LIVECHAT_INPUT, type: t.eD.FORM }),
    },
    u = {
      QUEUE: r({ element: t.k9.LIVESTREAM_MODERATION_QUEUE, type: t.eD.LIST }),
      ITEM_DETAIL: r({
        element: t.k9.LIVESTREAM_MODERATION_DETAIL_PAGE,
        type: t.eD.SCREEN,
      }),
      QUEUE_USER_ACTION: r({
        element: t.k9.LIVESTREAM_MODERATION_QUEUE,
        type: t.eD.BUTTON,
      }),
      DETAIL_USER_ACTION: r({
        element: t.k9.LIVESTREAM_MODERATION_DETAIL_PAGE,
        type: t.eD.BUTTON,
      }),
      SESSION: r({
        element: t.k9.LIVESTREAM_MODERATION_QUEUE,
        type: t.eD.BUTTON,
      }),
    },
    d = {
      TERMS: r({ element: t.k9.LIVESTREAM_MODAL_TERMS, type: t.eD.MODAL }),
      REPORT: r({ element: t.k9.LIVESTREAM_MODAL_REPORT, type: t.eD.MODAL }),
      PARTICIPANTS: r({
        element: t.k9.LIVESTREAM_MODAL_PARTICIPANTS,
        type: t.eD.MODAL,
      }),
      INFO: r({ element: t.k9.LIVESTREAM_MODAL_INFO, type: t.eD.MODAL }),
      SETTINGS: r({
        element: t.k9.LIVESTREAM_MODAL_SETTINGS,
        type: t.eD.MODAL,
      }),
    };
  (r({
    element: t.k9.UNSPECIFIED,
    type: t.eD.UNSPECIFIED,
    screen: t.Ae.UNSPECIFIED,
  }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.BUTTON }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.BUTTON }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.SCREEN }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.BUTTON }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.MODAL }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.MODAL }),
    r({ element: t.k9.UNSPECIFIED, type: t.eD.LIST }),
    e.s([
      "Q",
      0,
      i,
      "c",
      0,
      l,
      "K",
      0,
      a,
      "R",
      0,
      c,
      "Y",
      0,
      d,
      "D",
      0,
      o,
      "g",
      0,
      u,
      "G",
      0,
      s,
    ]));
};
