// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(845785);
  let i = ({
    id: e,
    title: t,
    creator: i,
    token: s,
    videoId: a,
    page: o,
    playerName: r,
    videoTitle: l,
  }) => ({
    videoId: a,
    videoTitle: l ?? t,
    bountyId: e,
    creatorId: i.address,
    ...(i.creatorUserId ? { creatorCcUserId: i.creatorUserId } : {}),
    ...(s?.mint ? { associatedCoinMint: s.mint } : {}),
    page: o,
    playerName: r,
  });
  e.s([
    "Z",
    0,
    ({ bounty: e, attachment: t, page: s, playerName: a }) =>
      i({
        ...e,
        videoId: t.key,
        videoTitle: t.filename || e.title,
        page: s,
        playerName: a,
      }),
    "H",
    0,
    () => ({
      videoId: "bounties-intro-ftue",
      videoTitle: "Pump.fun GO intro",
      bountyId: "bounties-intro-ftue",
      creatorId: "",
      page: t.j.WEB_BOUNTIES_INTRO,
      playerName: t.w.WEB_BOUNTY_INTRO_PLAYER,
    }),
    "U",
    0,
    i,
    "C",
    0,
    ({
      bounty: e,
      submissionId: t,
      videoId: s,
      page: a,
      playerName: o,
      videoTitle: r,
    }) =>
      i({
        ...e,
        videoId: `${t}:${s}`,
        videoTitle: r ?? e.title,
        page: a,
        playerName: o,
      }),
    "p",
    0,
    ({ src: e, attachments: t }) => {
      let i = t?.find((t) => t.url === e);
      return i?.key ?? e;
    },
  ]);
};
