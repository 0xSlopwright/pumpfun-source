# Explore reconstruction evidence

This note separates captured facts from the local, read-only behavior implemented
for `/explore`. Recovered factories are inspected as inert text. They are not
executed and are not treated as original TypeScript source.

## Observed

- `evidence/web/manifest.json` records the `/explore` HTML capture at
  `2026-10-28T10:48:45.546100+00:00`. The HTML is
  `evidence/web/objects/501ddca30e455495`, SHA-256
  `bf808720f0cb4c1049588a1ebbf1840098eff80a7aecbf499f3815209e0ce119`.
  It contains an Explore title, the captured shell search entry, responsive
  mobile navigation, and a server-rendered responsive screener skeleton.
- `evidence/api-probes.json` records a successful `GET` of
  `https://frontend-api-v3.pump.fun/coins?offset=0&limit=1`. Its 1,813-byte
  response is `evidence/web/objects/cd3f926d4d318056`, SHA-256
  `b41a41c70fb4b2548dfc166e9c31e1b5b9dfd73d233cf94ee384a9c5d75e017d`.
  The response is a JSON array containing exactly one historical coin record.
- Factory `591431`, SHA-256
  `7033f4a368de86890c3bdd677ec910e38ab9cd05b9b0efe7d09a39222c1397ed`,
  comes from `evidence/web/objects/ad258f9377db8376.js` at UTF-16 range
  `[842, 3230)`. The source chunk is loaded by the captured Explore HTML and
  composes responsive table/card suspense states.
- Factory IDs `530501` and `811198`, SHA-256
  `58002d1c3ab1572e1c96050f4190642a18322725acbb96aedc6e48ba602c3449`,
  come from `evidence/web/objects/3d84cd0300026f39.js` at UTF-16 range
  `[20692, 24138)`. That chunk is loaded by the captured page and names the coin,
  market-cap, volume, transaction, trader, holder, and buy columns.
- Factory IDs `946129` and `524517`, SHA-256
  `532f3c009699e8158d6dfb047b2edd26d7f8768a0f94011f06517a389ecdb303`,
  come from `evidence/web/objects/3e5afed6d9a858fe.js` at UTF-16 range
  `[515, 1435)`. They bind the Explore search term to the `q` URL parameter and
  trim it before deciding whether search is active.
- Factory `29542`, SHA-256
  `ede316c07dd8ceb3faff4f840fefbb61a5b1a18d372e600225db0f8410a661bd`,
  comes from `evidence/web/objects/fd402d4185b44ce9.js` at UTF-16 range
  `[5207, 9672)`. It contains the captured accessible search label,
  `Search for coins and users`, and the `No coins found` empty-state literal.
- Factory `29306`, SHA-256
  `cd326aab60fe47049526139f4b89fca93732b694457fa5778f98ca32a0bcbcfe`,
  comes from `evidence/web/objects/13c13db9eb86191b.js` at UTF-16 range
  `[7739, 19926)`. It maps the Explore navigation item to `/explore`.
- Factory `250636`, SHA-256
  `03f8c485fcfbb87b42bc60d37d61017414ecee2ba9518565c3f9f1ccff5a37b8`,
  comes from `evidence/web/objects/5e72f3d3ccddec85.js` at UTF-16 range
  `[119, 47354)`. It contains coin-cell, copy-address, market-cap, responsive
  table, loading, and empty-state structures. Its source chunk is present in the
  wider capture but is not a direct script reference in the initial `/explore`
  HTML, so it is supporting composition evidence rather than proof that every
  branch ran in the captured page state.

The inventory ranges above use UTF-16 code units over decoded JavaScript, as
declared by `recovered/modules.json`.

## Declared

The retained `/coins?offset=0&limit=1` response exposes the historical record's
mint, name, symbol, image URI, creation and last-trade timestamps, market-cap
fields, quote mint, completion state, creator, protocol, and verification flag.
The local adapter exposes only a validated subset. The external image URI is not
loaded by this reconstruction.

## Inferred

The captured table and factory contracts support a responsive coin-identity and
market-cap presentation. Search participation in sort selection and the `q` URL
binding support URL-backed query state. Static strings and recovered branches do
not establish the complete production ranking, pagination, filtering, or loading
algorithm.

## Local design

The reconstruction hashes and parses the checked-in one-record response on the
server. It searches only validated name, symbol, and mint fields using trimmed,
Unicode-normalized, case-insensitive matching and a deterministic identity sort.
It labels the result as historical, renders no remote image, and provides only a
local copy-mint action. Invalid or unavailable evidence fails closed with no
results and no network fallback.

The manifest supplies the exact checkpoint timestamp shown by the page. The API
probe has no separate per-request timestamp, so the UI does not claim that the
manifest timestamp is an exact server response time.

## Unknown

Current live results, production ranking, pagination and infinite-scroll rules,
filter behavior, current market values, visual pixel parity, authenticated
watchlists, and token-detail behavior remain unqualified. A missing local result
does not imply that a coin is absent from the live Pump market.
