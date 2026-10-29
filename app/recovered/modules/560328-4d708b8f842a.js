// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(402030),
    s = e.i(520669);
  let a = /^[A-Za-z0-9_]+$/;
  e.s(
    [
      "$",
      0,
      200,
      "k",
      0,
      15,
      "y",
      0,
      12e4,
      "b",
      0,
      (e) => e.trim().length > 200,
      "M",
      0,
      (e) => {
        let r = e.trim();
        return 0 === r.length
          ? "required"
          : r.length > 15
            ? "too_long"
            : a.test(r)
              ? null
              : "charset";
      },
    ],
    693686,
  );
  let t = 50,
    i = r.contract["GET /pnl-leaderboard/groups"].response,
    l = i.shape.entries.element,
    n = l
      .pick({
        rank: !0,
        groupId: !0,
        username: !0,
        profileImageUrl: !0,
        pnlUsd: !0,
        realizedPnlUsd: !0,
        unrealizedPnlUsd: !0,
        memberCount: !0,
      })
      .extend({
        isVerified: l.shape.isVerified.default(!1),
        verifiedBadgeVisible: l.shape.verifiedBadgeVisible.default(!0),
      }),
    o = i
      .pick({ entries: !0 })
      .extend({
        periodLabel: i.shape.periodLabel.optional(),
        totalRanked: i.shape.totalRanked.optional(),
        entries: n.array(),
      }),
    u = (e) => o.parse(e);
  e.s(
    [
      "H",
      0,
      t,
      "Y",
      0,
      6e4,
      "P",
      0,
      u,
      "C",
      0,
      (e, r) =>
        "realized" === r
          ? e.realizedPnlUsd
          : "unrealized" === r
            ? e.unrealizedPnlUsd
            : e.pnlUsd,
    ],
    956683,
  );
  var p = e.i(760447);
  let d = 50,
    m = async ({ api: e, groupId: r, signal: s }) => {
      let a = await e("GET /users/{id}", { params: { id: r }, signal: s });
      return (0, p.t)({ row: p.Q.parse(a), groupId: r });
    },
    h = 20,
    c = async ({
      api: e,
      searchTerm: r,
      offset: s,
      limit: a = h,
      signal: t,
    }) => {
      let i = await e("GET /groups/search", {
        query: { searchTerm: r, limit: a, offset: s },
        signal: t,
      });
      return (0, p.A)(i);
    },
    f = async ({ api: e, period: r, sort: s, limit: a = t, signal: i }) =>
      u(
        await e("GET /pnl-leaderboard/groups", {
          query: { period: r, sort: s, limit: a },
          signal: i,
        }),
      ),
    g = async ({
      api: e,
      groupId: s,
      status: a,
      offset: t,
      limit: i = d,
      signal: l,
    }) => {
      try {
        return (0, p.F)(
          await e("GET /groups/{groupId}/members", {
            params: { groupId: s },
            query: { status: a, limit: i, offset: t },
            signal: l,
          }),
        );
      } catch (s) {
        let e = (({ error: e, status: s }) =>
          "INVITED" === s && (0, r.isContractError)(e) && 403 === e.status
            ? { members: [], hasMore: !1, rawCount: 0 }
            : null)({ error: s, status: a });
        if (e) return e;
        throw s;
      }
    },
    b = async ({ api: e, signal: r }) => {
      let s = [],
        a = 0;
      for (let t = 0; t < 5; t++) {
        let t = (0, p.n)(
          await e("GET /groups/me", {
            query: { limit: 200, offset: a },
            signal: r,
          }),
        );
        if ((s.push(...t.memberships), !t.hasMore || 0 === t.rawCount)) break;
        a += t.rawCount;
      }
      return s;
    },
    y = async ({ api: e, idOrWallet: r, signal: s }) =>
      (0, p.n)(
        await e("GET /groups/of/{id}", {
          params: { id: r },
          query: { limit: 1 },
          signal: s,
        }),
      ).memberships[0] ?? null,
    I = r.contract["GET /user-portfolio/{userId}"].response,
    w = I.pick({ summary: !0 }).extend({
      summary: I.shape.summary.pick({ positionCount: !0 }).partial(),
    }),
    v = r.contract["GET /portfolio-summary"].response.options[1]
      .pick({ pnl: !0, percentage: !0, totalValueUsd: !0 })
      .extend({ pnl: s.s, percentage: s.s, totalValueUsd: s.f }),
    C = async ({ api: e, groupId: r, signal: s }) => {
      let a = await e("GET /user-portfolio/{userId}", {
          params: { userId: r },
          query: { filter: "ALL", totalsOnly: !0 },
          timeout: 1e4,
          signal: s,
        }),
        { summary: t } = w.parse(a);
      return { positionCount: t.positionCount ?? null };
    },
    A = async ({ api: e, groupId: r, period: s, signal: a }) => {
      let t = await e("GET /portfolio-summary", {
          query: { user: r, period: s },
          timeout: 1e4,
          signal: a,
        }),
        i = v.parse(t);
      return {
        pnlUsd: i.pnl.usd,
        pnlPercentage: i.percentage.usd,
        totalValueUsd: i.totalValueUsd,
      };
    },
    E = r.contract["GET /groups/{groupId}/members/pnl"].response,
    U = E.pick({ builtAtMs: !0, rows: !0 }).extend({
      builtAtMs: E.shape.builtAtMs.nullish(),
      rows: E.shape.rows.element.pick({ userId: !0, pnlUsd: !0 }).array(),
    }),
    _ = async ({ api: e, groupId: r, period: s, signal: a }) => {
      let t = await e("GET /groups/{groupId}/members/pnl", {
          params: { groupId: r },
          query: { period: s },
          signal: a,
        }),
        i = U.parse(t);
      return { builtAtMs: i.builtAtMs ?? 0, rows: i.rows };
    },
    T = async ({
      api: e,
      groupId: r,
      accept: s,
      leaveCurrentGroup: a = !1,
    }) => {
      let t = { accept: s };
      (a && (t.leaveCurrentGroup = !0),
        await e("POST /groups/{groupId}/invites/respond", {
          params: { groupId: r },
          body: t,
        }));
    },
    q = async ({ api: e, groupId: r, userId: s }) => {
      await e("DELETE /groups/{groupId}/members/{userId}", {
        params: { groupId: r, userId: s },
      });
    },
    M = async ({ api: e, idOrWallet: r, signal: s }) => {
      let a = await e("GET /users/{id}", { params: { id: r }, signal: s });
      return p.Q.parse(a).userId ?? null;
    },
    P = async ({ api: e, groupId: r, status: s, signal: a }) => {
      let t = [],
        i = 0;
      for (let l = 0; l < 5; l++) {
        let l = await g({
          api: e,
          groupId: r,
          status: s,
          offset: i,
          limit: 200,
          signal: a,
        });
        if ((t.push(...l.members), !l.hasMore || 0 === l.rawCount)) break;
        i += l.rawCount;
      }
      return t;
    },
    G = async ({ api: e, inputs: r, signal: s }) => {
      let a = { username: r.username };
      (r.bio && (a.bio = r.bio),
        r.profileImageUrl && (a.profileImageUrl = r.profileImageUrl),
        r.headerImageUrl && (a.headerImageUrl = r.headerImageUrl),
        r.leaveCurrentGroup && (a.leaveCurrentGroup = !0));
      let t = await e("POST /groups", { body: a, timeout: 12e4, signal: s });
      return p.D.parse(t.profile);
    },
    V = async ({ api: e, inputs: r, signal: s }) => {
      let a = {};
      (void 0 !== r.username && (a.username = r.username),
        void 0 !== r.bio && (a.bio = r.bio),
        void 0 !== r.profileImageUrl && (a.profileImageUrl = r.profileImageUrl),
        void 0 !== r.headerImageUrl && (a.headerImageUrl = r.headerImageUrl));
      let t = await e("PATCH /groups/{groupId}", {
        params: { groupId: r.groupId },
        body: a,
        timeout: 12e4,
        signal: s,
      });
      return p.D.parse(t.profile);
    },
    k = async ({ api: e, groupId: r, userId: s, signal: a }) => {
      await e("POST /groups/{groupId}/invites", {
        params: { groupId: r },
        body: { userId: s },
        signal: a,
      });
    };
  e.s(
    [
      "J",
      0,
      500,
      "V",
      0,
      h,
      "D",
      0,
      G,
      "E",
      0,
      y,
      "K",
      0,
      P,
      "a",
      0,
      M,
      "F",
      0,
      b,
      "N",
      0,
      m,
      "j",
      0,
      f,
      "Z",
      0,
      g,
      "_",
      0,
      _,
      "u",
      0,
      C,
      "B",
      0,
      c,
      "b",
      0,
      A,
      "i",
      0,
      k,
      "z",
      0,
      q,
      "o",
      0,
      T,
      "P",
      0,
      V,
    ],
    560328,
  );
  let x = "squads";
  e.s(
    [
      "f",
      0,
      {
        all: [x],
        profile: (e) => [x, "profile", e],
        members: (e, r) => [x, "members", e, r],
        membersForSquad: (e) => [x, "members", e],
        membersPnl: (e, r) => [x, "members-pnl", e, r],
        myMemberships: (e) => [x, "my-memberships", e],
        activeSquadOf: (e) => [x, "of-user", e],
        search: (e, r) => [x, "search", e, r],
        leaderboard: (e, r, s) => [x, "leaderboard", e, r, s],
        portfolio: (e) => [x, "portfolio", e],
        crewClip: (e) => [x, "crew-clip", e],
        windowedPnl: (e, r) => [x, "portfolio", e, "window", r],
      },
    ],
    989582,
  );
};
