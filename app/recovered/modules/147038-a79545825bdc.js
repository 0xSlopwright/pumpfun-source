// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(944410),
    n = e.i(132838),
    i = e.i(690877),
    s = e.i(606933),
    a = e.i(352386);
  e.i(12692);
  var o = e.i(398902),
    l = e.i(63289),
    u = e.i(777683),
    c = e.i(418096),
    m = e.i(613677),
    d = e.i(342463),
    p = e.i(866890),
    g = e.i(297865);
  let b =
      "Add at least one allowed origin (for example https://app.example.com).",
    y = c.z.enum(["PENDING", "APPROVED", "REJECTED"]),
    v = m.z.object({
      issuerId: d.z.string().min(1),
      name: d.z.string(),
      description: d.z.string().optional(),
      homepageUrl: d.z.string().optional(),
      imageUrl: d.z.string().optional(),
      ownerAddress: d.z.string(),
    }),
    f = m.z.object({
      issuerId: d.z.string().min(1),
      name: d.z.string(),
      description: d.z.string().optional(),
      homepageUrl: d.z.string().optional(),
      imageUrl: d.z.string().optional(),
      ownerAddress: d.z.string(),
      allowedOrigins: p.z.array(d.z.string()).default([]),
      reviewStatus: y,
      isLive: g.z.boolean(),
      createdAt: d.z.string().optional(),
      updatedAt: d.z.string().optional(),
      reviewedAt: d.z.string().optional(),
      rejectionReason: d.z.string().optional(),
    }),
    w = m.z.object({
      keyId: d.z.string().min(1),
      createdAt: d.z.string(),
      lastFour: d.z.string(),
    }),
    E = m.z.object({ apiKey: d.z.string().min(1), key: w }),
    _ = m.z.object({
      items: p.z.array(v),
      nextCursor: d.z.string().optional(),
    }),
    A = m.z.object({ imageUrl: d.z.string() }),
    h = p.z.array(f),
    z = p.z.array(w),
    S = m.z.object({
      items: p.z.array(f),
      nextCursor: d.z.string().optional(),
    }),
    x = d.z.string().trim().min(1).max(256);
  (m.z.object({
    name: d.z.string().trim().min(1).max(80),
    description: d.z.string().trim().max(500),
    homepageUrl: d.z.string().trim().max(2048),
    imageUrl: d.z.string().trim().max(2048).optional(),
    allowedOrigins: p.z.array(x).min(1, b).max(20),
  }),
    m.z
      .object({
        name: d.z.string().trim().min(1).max(80),
        description: d.z.string().trim().max(500),
        homepageUrl: d.z.string().trim().max(2048),
        imageUrl: d.z.string().trim().max(2048),
        allowedOrigins: p.z.array(x).min(1, b).max(20),
      })
      .partial());
  let T = (e) => {
    let t = new Set(),
      r = [];
    for (let n of e.split(/[\n,]/)) {
      let e = n.trim();
      0 === e.length || t.has(e) || (t.add(e), r.push(e));
    }
    return r;
  };
  e.s(
    [
      "I",
      0,
      500,
      "p",
      0,
      20,
      "v",
      0,
      2,
      "J",
      0,
      80,
      "g",
      0,
      E,
      "T",
      0,
      f,
      "C",
      0,
      (e) => T(e).length >= 1,
      "m",
      0,
      z,
      "y",
      0,
      S,
      "a",
      0,
      h,
      "G",
      0,
      T,
      "U",
      0,
      _,
      "n",
      0,
      A,
    ],
    815096,
  );
  var C = e.i(886599),
    O = e.i(38279);
  let I = "bounties/integrations",
    j = "bounties/moderation/integrations",
    N = (e) => `${I}/me/${encodeURIComponent(e)}`,
    U = (e) => {
      (e.invalidateQueries({
        queryKey: ["bounties", "moderation", "integrations"],
      }),
        e.invalidateQueries({ queryKey: ["bounties", "integrations"] }));
    };
  e.s(
    [
      "h",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t } = e;
                await g.post(`${j}/${encodeURIComponent(t)}/approve`).text();
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(p("web.bounties.integration_approved")),
                  U(b),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(
                    t,
                    p("web.bounties.integration_approve_failed"),
                  ),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "_",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let t = await g.post(I, { json: e }).json();
                return f.parse(t);
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(p("web.bounties.integration_submitted")),
                  b.invalidateQueries({
                    queryKey: O.Q.BOUNTY_MY_INTEGRATIONS(),
                  }),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(
                    t,
                    p("web.bounties.integration_submit_failed"),
                  ),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "A",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(13),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t, rotateKeyId: r } = e,
                  n = await g
                    .post(`${N(t)}/keys`, { json: r ? { rotateKeyId: r } : {} })
                    .json();
                return E.parse(n);
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b
            ? ((a = (t, r, n) => {
                (b.invalidateQueries({
                  queryKey: O.Q.BOUNTY_INTEGRATION_KEYS(r.issuerId),
                }),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = a))
            : (a = d[4]),
          d[5] !== e || d[6] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(t, p("web.bounties.api_key_create_failed")),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[5] = e),
              (d[6] = p),
              (d[7] = c))
            : (c = d[7]),
          d[8] !== e || d[9] !== i || d[10] !== a || d[11] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[8] = e),
              (d[9] = i),
              (d[10] = a),
              (d[11] = c),
              (d[12] = m))
            : (m = d[12]),
          (0, n.f)(m)
        );
      },
      "M",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t, keyId: r } = e;
                await g.delete(`${N(t)}/keys/${encodeURIComponent(r)}`).text();
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(p("web.bounties.api_key_revoked")),
                  b.invalidateQueries({
                    queryKey: O.Q.BOUNTY_INTEGRATION_KEYS(r.issuerId),
                  }),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(t, p("web.bounties.api_key_revoke_failed")),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "$",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t, reason: r } = e;
                await g
                  .post(`${j}/${encodeURIComponent(t)}/reject`, {
                    json: { reason: r },
                  })
                  .text();
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(p("web.bounties.integration_rejected")),
                  U(b),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(
                    t,
                    p("web.bounties.integration_reject_failed"),
                  ),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "m",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t, isLive: r } = e;
                await g
                  .post(`${j}/${encodeURIComponent(t)}/live`, {
                    json: { isLive: r },
                  })
                  .text();
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(
                  r.isLive
                    ? p("web.bounties.integration_set_live")
                    : p("web.bounties.integration_suspended"),
                ),
                  U(b),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(
                    t,
                    p("web.bounties.integration_live_update_failed"),
                  ),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "j",
      0,
      (e) => {
        let i,
          a,
          c,
          m,
          d = (0, t.c)(14),
          { t: p } = (0, o.f)(),
          g = (0, r.useLivestreamApiClient)(),
          b = (0, s.useQueryClient)();
        return (
          d[0] !== g
            ? ((i = async (e) => {
                let { issuerId: t, body: r } = e,
                  n = await g.patch(N(t), { json: r }).json();
                return f.parse(n);
              }),
              (d[0] = g),
              (d[1] = i))
            : (i = d[1]),
          d[2] !== e || d[3] !== b || d[4] !== p
            ? ((a = (t, r, n) => {
                (l.c.success(p("web.bounties.integration_updated")),
                  b.invalidateQueries({
                    queryKey: O.Q.BOUNTY_MY_INTEGRATIONS(),
                  }),
                  e?.onSuccess?.(t, r, n));
              }),
              (d[2] = e),
              (d[3] = b),
              (d[4] = p),
              (d[5] = a))
            : (a = d[5]),
          d[6] !== e || d[7] !== p
            ? ((c = async (t, r, n) => {
                (l.c.error(
                  await (0, u.u)(
                    t,
                    p("web.bounties.integration_update_failed"),
                  ),
                ),
                  e?.onError?.(t, r, n));
              }),
              (d[6] = e),
              (d[7] = p),
              (d[8] = c))
            : (c = d[8]),
          d[9] !== e || d[10] !== i || d[11] !== a || d[12] !== c
            ? ((m = { ...e, mutationFn: i, onSuccess: a, onError: c }),
              (d[9] = e),
              (d[10] = i),
              (d[11] = a),
              (d[12] = c),
              (d[13] = m))
            : (m = d[13]),
          (0, n.f)(m)
        );
      },
      "v",
      0,
      (e) => {
        let n,
          s,
          a,
          o = (0, t.c)(10),
          { issuerId: l, enabled: u, queryOptions: c } = e,
          m = (0, r.useLivestreamApiClient)(),
          d = (void 0 === u || u) && "string" == typeof l && "" !== l;
        return (
          o[0] !== l
            ? ((n = O.Q.BOUNTY_INTEGRATION_KEYS(l ?? "")),
              (o[0] = l),
              (o[1] = n))
            : (n = o[1]),
          o[2] !== m || o[3] !== l
            ? ((s = async () => {
                let e = await m.get(`${N(l ?? "")}/keys`).json();
                return z.parse(e);
              }),
              (o[2] = m),
              (o[3] = l),
              (o[4] = s))
            : (s = o[4]),
          o[5] !== d || o[6] !== c || o[7] !== n || o[8] !== s
            ? ((a = { enabled: d, queryKey: n, queryFn: s, ...c }),
              (o[5] = d),
              (o[6] = c),
              (o[7] = n),
              (o[8] = s),
              (o[9] = a))
            : (a = o[9]),
          (0, i.useQuery)(a)
        );
      },
      "O",
      0,
      (e) => {
        let n,
          s,
          a,
          o,
          l,
          u,
          c = (0, t.c)(16),
          { q: m, limit: d, enabled: p, queryOptions: g } = e,
          b = void 0 === d ? 10 : d,
          y = void 0 === p || p,
          v = (0, r.useLivestreamApiClient)();
        return (
          c[0] !== y || c[1] !== b || c[2] !== m
            ? ((o = m.trim()),
              (a = i.useQuery),
              (n = y && o.length > 0),
              (s = O.Q.BOUNTY_INTEGRATION_SEARCH({ q: o, limit: b })),
              (c[0] = y),
              (c[1] = b),
              (c[2] = m),
              (c[3] = n),
              (c[4] = s),
              (c[5] = a),
              (c[6] = o))
            : ((n = c[3]), (s = c[4]), (a = c[5]), (o = c[6])),
          c[7] !== v || c[8] !== b || c[9] !== o
            ? ((l = async () => {
                let e = await v
                  .get(`${I}/search`, {
                    searchParams: { q: o, limit: String(b) },
                  })
                  .json();
                return _.parse(e).items;
              }),
              (c[7] = v),
              (c[8] = b),
              (c[9] = o),
              (c[10] = l))
            : (l = c[10]),
          c[11] !== g || c[12] !== n || c[13] !== s || c[14] !== l
            ? ((u = { enabled: n, queryKey: s, queryFn: l, ...g }),
              (c[11] = g),
              (c[12] = n),
              (c[13] = s),
              (c[14] = l),
              (c[15] = u))
            : (u = c[15]),
          a(u)
        );
      },
      "c",
      0,
      (e) => {
        let n,
          s,
          a,
          o = (0, t.c)(10),
          { status: l, enabled: u, queryOptions: c } = e,
          m = void 0 === u || u,
          d = (0, r.useLivestreamApiClient)();
        return (
          o[0] !== l
            ? ((n = O.Q.BOUNTY_MODERATION_INTEGRATIONS(l)),
              (o[0] = l),
              (o[1] = n))
            : (n = o[1]),
          o[2] !== d || o[3] !== l
            ? ((s = async () => {
                let e = await d.get(j, { searchParams: { status: l } }).json();
                return S.parse(e).items;
              }),
              (o[2] = d),
              (o[3] = l),
              (o[4] = s))
            : (s = o[4]),
          o[5] !== m || o[6] !== c || o[7] !== n || o[8] !== s
            ? ((a = { enabled: m, queryKey: n, queryFn: s, ...c }),
              (o[5] = m),
              (o[6] = c),
              (o[7] = n),
              (o[8] = s),
              (o[9] = a))
            : (a = o[9]),
          (0, i.useQuery)(a)
        );
      },
      "e",
      0,
      (e) => {
        let n,
          s,
          a,
          o = (0, t.c)(6),
          l = (0, r.useLivestreamApiClient)();
        return (
          o[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((n = O.Q.BOUNTY_MY_INTEGRATIONS()), (o[0] = n))
            : (n = o[0]),
          o[1] !== l
            ? ((s = async () => {
                let e = await l.get(`${I}/me`).json();
                return h.parse(e);
              }),
              (o[1] = l),
              (o[2] = s))
            : (s = o[2]),
          o[3] !== e || o[4] !== s
            ? ((a = { queryKey: n, queryFn: s, ...e }),
              (o[3] = e),
              (o[4] = s),
              (o[5] = a))
            : (a = o[5]),
          (0, i.useQuery)(a)
        );
      },
      "f",
      0,
      function () {
        let e = (0, r.useLivestreamApiClient)();
        return (0, a.useCallback)(
          async (t, r) => {
            let n = await (0, C.M)(t.file, r?.signal);
            try {
              let i = await e
                .post(`${I}/me/image`, {
                  json: {
                    filename: t.file.name,
                    contentType: t.contentType,
                    data: n,
                  },
                  signal: r?.signal,
                })
                .json();
              return A.parse(i);
            } catch (t) {
              if (t instanceof DOMException && "AbortError" === t.name) throw t;
              let e = await (0, u.u)(t, "Image upload failed");
              throw new C.K(
                e,
                ((e) => {
                  if ("object" != typeof e || null === e) return;
                  let t = "response" in e ? e.response : void 0;
                  return t instanceof Response ? t.status : void 0;
                })(t),
              );
            }
          },
          [e],
        );
      },
    ],
    147038,
  );
};
