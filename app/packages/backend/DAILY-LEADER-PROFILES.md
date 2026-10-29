# Daily leader profiles

`GET /v1/profiles/verified` now computes a local profile list instead of returning
an unimplemented response. The existing POST at that path is unchanged.

## Captured contract

The public OpenAPI `get_profiles_verified` operation describes the ten top daily
PnL leaders used for onboarding follow suggestions. Its response is an array of
full normalized profiles; it does not filter for the verified badge or require a
minimum of ten results. The operation declares bearer security and `profiles.read`.

The same definition is in captured factory **850620**, retained as
`app/recovered/modules/850620-9d34ea015ae0.js`, from
`https://pump.fun/_next/static/immutable/chunks/2cr_aqnw2j4n5.js`.
The physical capture is `app/evidence/web/objects/2b47dd0b38a1608f.js` (SHA-256
`e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d`).
The factory spans UTF-16 offsets `[345231,347239)`; the route binding is
`[347060,347117)` in `contracts/developer-bindings.json`. Captured JavaScript was
read as evidence, not executed.

## Local implementation and limits

- Select up to ten rows from the existing `LeaderboardStore` daily combined
  board, retaining its PnL ordering and tie policy. Hydrate full profiles through
  that store's own `UserStore` and the existing `userToProfile` projection.
- Include both verified and unverified leaders. An empty daily board returns `[]`.
- If a selected row lacks a resolvable user, or two selected rows resolve to the
  same profile, return `501 COMPATIBILITY_NOT_IMPLEMENTED` with reason
  `DAILY_LEADER_PROFILES_UNAVAILABLE`. Upstream wallet aggregation, deduplication,
  backfill and unresolved-profile policy are not established by the capture.
- Keep the shared developer API-key gate and duplicate-query-key policy. The
  existing gate validates key shape; it does not establish production key or
  scope authorization. Successful responses retain the synthetic-data header.

This is a local read model over supplied/synthetic data. Production daily PnL
calculation, identity resolution, ranking ties, freshness and full operation
compatibility remain unqualified. No profile-family milestone is awarded.

## Checks

`test/profile-leaders.test.ts` covers the documented response schema, daily
combined ordering, the ten-result cap, unverified inclusion, store identity and
returned-object isolation, empty/unresolved/duplicate profiles, key gating,
duplicate query rejection and preservation of the existing POST response.

Focused command (from `app/packages/backend`):
`node --import tsx --test test/profile-leaders.test.ts test/leaderboard.test.ts`.
