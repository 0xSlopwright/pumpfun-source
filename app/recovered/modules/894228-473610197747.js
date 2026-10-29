// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(613677),
    n = e.i(342463),
    r = e.i(297865);
  let a = t.z.object({
    livechatUrl: n.z.string().url(),
    livestreamsUrl: n.z.string().url(),
    clientServerUrl: n.z.string().url(),
    profileApiUrl: n.z.string().url(),
    apiBearerToken: n.z.string().optional(),
    hermesNotificationsAvailable: r.z.boolean().optional(),
  });
  e.s(["f", 0, a]);
};
