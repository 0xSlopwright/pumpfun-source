// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(402030),
    s = e.i(758045);
  let a = ["OWNER", "ADMIN", "MEMBER"],
    t = ["ACTIVE", "INVITED"],
    i = (e) => a.find((r) => r === e) ?? "UNSPECIFIED",
    l = (e) => t.find((r) => r === e) ?? "UNSPECIFIED",
    n = (e) => (e?.toLowerCase() === "group" ? "group" : "person"),
    o = s.z.string().nullish(),
    u = r.contract["GET /groups/search"].response.shape.results.element,
    p = u
      .pick({ userId: !0 })
      .extend({
        username: u.shape.username.nullish(),
        bio: u.shape.bio.nullish(),
        profileImageUrl: u.shape.profileImageUrl.nullish(),
        headerImageUrl: u.shape.headerImageUrl.nullish(),
        followerCount: u.shape.followerCount.nullish(),
        followingCount: u.shape.followingCount.nullish(),
        createdAt: u.shape.createdAt.nullish(),
        updatedAt: u.shape.updatedAt.nullish(),
        walletAddress: u.shape.walletAddress.nullish(),
        isVerified: u.shape.isVerified.nullish(),
        verifiedBadgeVisible: u.shape.verifiedBadgeVisible.nullish(),
        resolvedAvatarDecoration: u.shape.resolvedAvatarDecoration.nullish(),
        memberCount: u.shape.memberCount.nullish(),
        kind: o,
      })
      .transform((e) => ({
        userId: e.userId,
        username: e.username ?? "",
        bio: e.bio || null,
        profileImage: e.profileImageUrl || null,
        headerImageUrl: e.headerImageUrl || null,
        walletAddress: e.walletAddress || null,
        followers: e.followerCount ?? 0,
        following: e.followingCount ?? 0,
        isVerified: e.isVerified ?? !1,
        verifiedBadgeVisible: !1 !== e.verifiedBadgeVisible,
        resolvedAvatarDecoration: e.resolvedAvatarDecoration ?? null,
        kind: n(e.kind),
        memberCount: e.memberCount ?? 0,
        createdAt: e.createdAt ?? null,
        updatedAt: e.updatedAt ?? null,
      })),
    d = r.contract["GET /groups/{groupId}/members"].response,
    m = d.shape.members.element,
    h = d.extend({
      members: m
        .extend({
          profile: p.nullish(),
          role: o,
          status: o,
          invitedBy: m.shape.invitedBy.nullish(),
          createdAt: m.shape.createdAt.nullish(),
          inCompetition: m.shape.inCompetition.nullish(),
        })
        .array(),
      hasMore: d.shape.hasMore.nullish(),
    }),
    c = r.contract["GET /groups/me"].response,
    f = c.shape.memberships.element,
    g = c.extend({
      memberships: f
        .extend({
          group: p.nullish(),
          role: o,
          status: o,
          invitedBy: f.shape.invitedBy.nullish(),
          createdAt: f.shape.createdAt.nullish(),
          inCompetition: f.shape.inCompetition.nullish(),
        })
        .array(),
      hasMore: c.shape.hasMore.nullish(),
    }),
    b = r.contract["GET /users/{id}"].response,
    y = b
      .pick({})
      .extend({
        address: b.shape.address.nullish(),
        userId: b.shape.userId.nullish(),
        username: b.shape.username.nullish(),
        profile_image: b.shape.profile_image.nullish(),
        header_image_url: b.shape.header_image_url.nullish(),
        member_count: b.shape.member_count.nullish(),
        bio: b.shape.bio.nullish(),
        followers: b.shape.followers.nullish(),
        following: b.shape.following.nullish(),
        kind: o,
        active_competition_entry: b.shape.active_competition_entry,
      }),
    I = r.contract["GET /groups/search"].response.extend({
      results: p.array(),
    });
  e.s([
    "C",
    0,
    (e) => "group" === n(e),
    "h",
    0,
    (e) => ({
      groupId: e.userId,
      username: e.username || null,
      bio: e.bio,
      profileImage: e.profileImage,
      headerImageUrl: e.headerImageUrl,
      memberCount: e.memberCount,
      followers: e.followers,
      following: e.following,
      activeCompetitionEntry: null,
    }),
    "t",
    0,
    ({ row: e, groupId: r }) => ({
      groupId: r,
      username: e.username ?? null,
      bio: e.bio ?? null,
      profileImage: e.profile_image ?? null,
      headerImageUrl: e.header_image_url ?? null,
      memberCount: e.member_count ?? 0,
      followers: e.followers ?? 0,
      following: e.following ?? 0,
      activeCompetitionEntry: e.active_competition_entry
        ? {
            competitionId: e.active_competition_entry.competition_id,
            competitionSlug: e.active_competition_entry.competition_slug,
            entryId: e.active_competition_entry.entry_id,
            phase: e.active_competition_entry.phase,
          }
        : null,
    }),
    "E",
    0,
    i,
    "D",
    0,
    p,
    "F",
    0,
    (e) => {
      let r = h.parse(e);
      return {
        members: r.members.flatMap((e) =>
          e.profile
            ? [
                {
                  profile: e.profile,
                  role: i(e.role),
                  status: l(e.status),
                  invitedBy: e.invitedBy ?? null,
                  createdAt: e.createdAt ?? null,
                },
              ]
            : [],
        ),
        hasMore: r.hasMore ?? !1,
        rawCount: r.members.length,
      };
    },
    "n",
    0,
    (e) => {
      let r = g.parse(e);
      return {
        memberships: r.memberships.flatMap((e) =>
          e.group
            ? [
                {
                  squad: e.group,
                  role: i(e.role),
                  status: l(e.status),
                  invitedBy: e.invitedBy ?? null,
                  createdAt: e.createdAt ?? null,
                },
              ]
            : [],
        ),
        hasMore: r.hasMore ?? !1,
        rawCount: r.memberships.length,
      };
    },
    "A",
    0,
    (e) => I.parse(e).results,
    "Q",
    0,
    y,
  ]);
};
