// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let r = /^[A-Za-z0-9_]{1,15}$/,
    s = new Set(["create", "invitations"]),
    a = ({ groupId: e, username: a }) =>
      a && r.test(a) && !s.has(a.toLowerCase()) ? a : e;
  e.s(["Z", 0, (e) => `/squads/${encodeURIComponent(a(e))}`, "D", 0, a]);
};
