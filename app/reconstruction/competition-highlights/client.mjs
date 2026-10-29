// Maintained source adaptation of the complete actual Cup highlight data flow.
// No captured runtime, UI rendering, server scoring or media generation is executed.
export function createCompetitionHighlights({
  useClientServerContract,
  useQueries,
  keys,
  fetch,
  queueMicrotask,
}) {
  const eR = { useClientServerContract },
    eT = { f: useQueries },
    eO = { S: 0x536f6c4d },
    eV = { f: keys };
  let eD = (e) => (e ? { pnlUsd: e.pnlUsd, buySpendUsd: e.buySpendUsd } : null),
    eK = (e) => e.chainId === eO.S,
    eZ = (e, t) => t <= 0 || e >= 0.1 * t,
    eB = (e, t) => e.filter((e) => e.kind === t && e.rank > 0),
    eQ = (e, t) => {
      let r = e.findIndex(t);
      return -1 === r ? [...e] : e.slice(0, r);
    },
    eW = null,
    eJ = async (e) => {
      let t = await fetch("/api/profiles/generated-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: e }),
      });
      if (!t.ok) throw Error(`generated media ${t.status}`);
      return await t.json();
    },
    eG = async () => {
      let e = eW;
      if (((eW = null), !e)) return;
      let t = [...e.keys()];
      for (let r = 0; r < t.length; r += 200) {
        let a = t.slice(r, r + 200);
        try {
          let t = await eJ(a);
          for (let r of a)
            for (let a of e.get(r) ?? []) a.resolve(t[r] ?? null);
        } catch (t) {
          for (let r of a) for (let a of e.get(r) ?? []) a.reject(t);
        }
      }
    },
    eH = (e) => {
      if (!e.isPending) return e.data ?? null;
    },
    eX = (e, t) => {
      let r = (0, eR.useClientServerContract)();
      return (0, eT.f)({
        queries: t.map((t) => ({
          queryKey: eV.f.highlights(e, t.entryId),
          queryFn: ({ signal: a }) =>
            r("GET /competitions/{id}/entries/{entryId}/highlights", {
              params: { id: e, entryId: t.entryId },
              query: { limit: 10 },
              signal: a,
            }),
          staleTime: 6e4,
        })),
        combine: (e) => e.map(eH),
      });
    };
  const useHighlights = ({ competitionId: e, entries: t }) => {
    let r,
      a = ((e, t) => {
        let r,
          a = eB(t, "person")
            .filter((e) => null !== e.walletAddress)
            .slice(0, 10),
          s = eB(t, "group").slice(0, 5),
          l = eX(e, a),
          n = eX(e, s),
          i =
            ((r = (0, eR.useClientServerContract)()),
            (0, eT.f)({
              queries: s.map((t) => ({
                queryKey: eV.f.entry(e, t.entryId),
                queryFn: ({ signal: a }) =>
                  r("GET /competitions/{id}/entries/{entryId}", {
                    params: { id: e, entryId: t.entryId },
                    signal: a,
                  }),
                staleTime: 6e4,
              })),
              combine: (e) => e.map(eH),
            }));
        return (({
          traders: e,
          traderReels: t,
          squads: r,
          squadReels: a,
          rosters: s,
        }) => [
          ...eQ(
            e.map((e, r) => ({ trader: e, reel: t[r] })),
            ({ reel: e }) => void 0 === e,
          ).flatMap(({ trader: e, reel: t }) => {
            let r;
            return null ===
              (r = ((e, t) => {
                let r,
                  a =
                    (r = t?.tokens.find((e) => eK(e) && e.pnlUsd > 0)) &&
                    eZ(r.pnlUsd, e.pnlUsd)
                      ? r
                      : null;
                if (a) return { mint: a.mint, leg: a };
                if (
                  e.pnlUsd > 0 &&
                  (t?.tokens[0]?.pnlUsd ?? 0) >= 0.1 * e.pnlUsd
                )
                  return null;
                let s = e.topPositions.find(eK);
                return s ? { mint: s.mint, leg: null } : null;
              })(e, t)) || null === e.walletAddress
              ? []
              : [
                  {
                    key: e.entryId,
                    walletAddress: e.walletAddress,
                    username: e.username,
                    profileImageUrl: e.profileImageUrl,
                    squadName: null,
                    pnlUsd: e.pnlUsd,
                    mint: r.mint,
                    coinPnl: eD(r.leg),
                  },
                ];
          }),
          ...eQ(
            r.map((e, t) => ({ squad: e, reel: a[t], roster: s[t] })),
            ({ reel: e, roster: t }) => void 0 === e || void 0 === t,
          ).flatMap(({ squad: e, reel: t, roster: r }) => {
            var a;
            return r
              ? ((a = r.members),
                t
                  ? [...a]
                      .sort((e, t) => t.pnlUsd - e.pnlUsd)
                      .flatMap((r) => {
                        let a;
                        if (null === r.walletAddress || r.pnlUsd <= 0)
                          return [];
                        let s =
                          (a = t.tokens
                            .flatMap((e) => {
                              if (!eK(e)) return [];
                              let t = e.members.find(
                                (e) => e.userId === r.userId,
                              );
                              return t && t.pnlUsd > 0
                                ? [{ mint: e.mint, leg: t }]
                                : [];
                            })
                            .reduce(
                              (e, t) =>
                                null !== e && e.leg.pnlUsd >= t.leg.pnlUsd
                                  ? e
                                  : t,
                              null,
                            )) && eZ(a.leg.pnlUsd, r.pnlUsd)
                            ? a
                            : null;
                        return null === s
                          ? []
                          : [
                              {
                                key: `${e.entryId}:${r.userId}`,
                                walletAddress: r.walletAddress,
                                username: r.username,
                                profileImageUrl: r.profileImageUrl,
                                squadName: e.username,
                                pnlUsd: r.pnlUsd,
                                mint: s.mint,
                                coinPnl: eD(s.leg),
                              },
                            ];
                      })
                      .slice(0, 2)
                  : [])
              : [];
          }),
        ])({
          traders: a,
          traderReels: l,
          squads: s,
          squadReels: n,
          rosters: i,
        });
      })(e, t),
      s =
        ((r = [...new Set(a.map((e) => e.walletAddress))]),
        (0, eT.f)({
          queries: r.map((e) => ({
            queryKey: eV.f.highlightMedia(e),
            queryFn: () =>
              new Promise((t, r) => {
                eW || ((eW = new Map()), queueMicrotask(() => void eG()));
                let a = eW.get(e) ?? [];
                (a.push({ resolve: t, reject: r }), eW.set(e, a));
              }),
            staleTime: 18e5,
            retry: !1,
          })),
          combine: (e) =>
            new Map(
              r.map((t, r) => {
                var a;
                let s;
                return [
                  t,
                  {
                    isLoading: e[r]?.isPending ?? !0,
                    pnlLoopUid:
                      ((a = e[r]?.data),
                      "string" == typeof (s = a?.pnlLoop?.uid) && "" !== s
                        ? s
                        : null),
                  },
                ];
              }),
            ),
        }));
    return a
      .flatMap((e) => {
        let t = ((e, t) => {
          if (t?.isLoading) return null;
          let r = t?.pnlLoopUid;
          return r
            ? { type: "avatar_clip", uid: r }
            : e.profileImageUrl
              ? { type: "image", url: e.profileImageUrl }
              : null;
        })(e, s.get(e.walletAddress));
        return t
          ? [
              {
                key: e.key,
                walletAddress: e.walletAddress,
                username: e.username,
                profileImageUrl: e.profileImageUrl,
                squadName: e.squadName,
                pnlUsd: e.pnlUsd,
                mint: e.mint,
                coinPnl: e.coinPnl,
                thumbnail: t,
              },
            ]
          : [];
      })
      .slice(0, 10);
  };
  return { useHighlights };
}
