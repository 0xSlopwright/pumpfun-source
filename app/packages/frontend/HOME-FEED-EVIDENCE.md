# Home Feed reconstruction evidence

This note records the static evidence used to replace the local Home Feed
placeholder. Captured factories are inert research inputs: they require the
original Turbopack runtime and import graph and are never executed here. Factory
ranges below are UTF-16 code-unit offsets over decoded JavaScript, as defined by
`recovered/modules.json`.

## Capture checkpoint

- Manifest checkpoint: `2026-10-28T10:48:45.546100+00:00`
- Captured root HTML: `evidence/web/objects/b713215f09b03c14`
- Root HTML SHA-256: `5c54a668997394767a338ff5efe132ba3400bd5e1c4b6bb16c9c075b6a389409`
- Root response: `GET https://pump.fun/`, HTTP 200, 454,082 bytes

The root HTML names `HomeFeedSeedProvider` and `HomeView` and retains a
server-provided callout seed. That proves a captured feed state existed at this
checkpoint. It does not prove current activity, a stable public response schema,
or the behavior of every authenticated state. The retained callout rows are not
used by the local implementation in this contribution.

## Observed

| Concern                                         |  Factory | Factory SHA-256                                                    | Captured source and SHA-256                                                                                    |   UTF-16 range | Observation                                                                                                                                                                          |
| ----------------------------------------------- | -------: | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | -------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home layout, tabs, states and pagination wiring | `163807` | `828b7d1e93dd4135f930646c9f29729e82209232a020fca54e3e775a20eafe44` | `evidence/web/objects/decc1b8a23be2e25.js`, `fc31766f488fbfffd8af33b176bb779d66dabbd9c45fa1c030888ae6ccbbde11` |   `119..28697` | Defines `for-you`, `following`, and `top` tabs; an accessible tablist; per-tab list/error/empty labels; signed-out Following handling; skeletons; rows; and a continuation boundary. |
| Home seed provider                              | `894107` | `57e01fbf3654e24ff69adb9758717a29d1d796bcc517236b360c8b860354a2fb` | `evidence/web/objects/11be0c4b34eb27cb.js`, `988677d1e33bd5c06eee1505b3dae7cd38dcb95fbb5d4a775e47163fb349d11f` | `45593..45926` | Reads a promised server seed and exposes it through React context. The provider does not establish a public feed contract by itself.                                                 |
| Callout/post card composition                   | `910976` | `b04bad164bee7eb5d2d522441333d604f8717335f346bbdddbf21da0218068c5` | `evidence/web/objects/caaf847d63c97cce.js`, `7b55360e420e15030111bc694b965f17391a8037cb86744bcb96561f95ba9fed` |   `138..20796` | Composes author identity, text/media content, position data, and social counters for a feed callout card. Many original imports remain unresolved outside the recovered factory.     |
| Card loading shape                              | `335703` | `ac958e6c1ea5ae37647619da80cee73000e79667bdb7e1ac2f0c49a2b43c4c20` | `evidence/web/objects/257d1f445453cc81.js`, `bed2d972e23dadf21d5e06a082b54934910ddd1b1fb6b7101ca4d8f5fb309e82` |    `159..6298` | Renders avatar, author/time, content, media/position, and reaction skeleton regions.                                                                                                 |
| Continuation boundary                           |  `42413` | `f0b202d26ad75e1d9aadc926061d785b47852903a52e23b7e9d857947701b390` | `evidence/web/objects/57cc59637a8b8f78.js`, `0a4b2c69f857bd65bf7c2fe686a44335536bc69df0ff7db10dbe0c2664e40fd2` |    `151..3615` | Defines an intersection sentinel and explicit load-more state. No local pagination is inferred from this alone.                                                                      |

The static operation inventory separately records `GET /home-feed`,
`GET /home-feed/new`, and `GET /home-feed/new/count` from
`evidence/web/objects/cf2bb278631744da.js` at UTF-16 ranges `7430..7446`,
`7783..7803`, and `8108..8134`. Their service binding remains unresolved and
all three operations remain unimplemented and unqualified.

The opt-in frontend connection to PR #700's independently reconstructed local
read model is documented in [`NATIVE-HOME-FEED.md`](NATIVE-HOME-FEED.md). It
does not change the authority of these captured observations or qualify the
original production service.

## Declared local input

The merged native-read work documents the checked-in backend seeds as
hand-authored synthetic fixtures:

- `packages/backend/src/posts-seed.json`: 8,394 bytes, SHA-256
  `f4d12a7812b07be6dcef4b966430a086cba9e867ff89de669a95a74bdd73d705`
- `packages/backend/src/users-seed.json`: 3,866 bytes, SHA-256
  `56259663a146236df2f0e6e1d931df7cc2dda4d39ed7a090c18505434155b20d`
- Classification: `synthetic-seed-play`
- Supporting declarations: `packages/backend/POSTS.md` and
  `packages/backend/NATIVE-USERS.md`

These rows are test examples, not captured Pump users or activity. The adapter
authenticates the exact source bytes, validates their runtime shape, and keeps
that classification attached to every presentation record.

## Inferred

- The captured tab model and signed-out branch support keeping Following
  separate from an unauthenticated For You surface.
- Author, timestamp, content, optional media, and read-only reaction summaries
  are common card regions across the main and skeleton factories.
- A continuation sentinel shows that the original feed could page, but the
  pagination contract and termination behavior are not established here.

## Local design

- `?tab=following` is the local URL state; absence of the parameter selects For
  You. This preserves direct links and browser history without claiming the
  original parameter name.
- For You displays only validated, non-deleted, non-hidden root posts from the
  authenticated synthetic seed. Replies are not promoted to root activity.
- Following is selectable but reports that authentication and a follow graph are
  unavailable. It never mirrors For You rows.
- External avatar and media URLs are not loaded. Initials and local media
  placeholders retain a safe visual boundary.
- Equal timestamps are ordered by stable post identity after newest-first time
  ordering.

## Unknown

- Current live feed contents, ranking and recommendation inputs.
- Authenticated personalization, follow-graph semantics and viewer state.
- Exact production pagination, refresh, new-item buffering and error contracts.
- Original translation strings in every locale and exact visual parity in a
  matching authenticated viewport.
- Whether every captured server-seeded callout was visible after client-side
  feature gates and filtering.
