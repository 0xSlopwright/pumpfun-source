# Original Home-feed client contract closure

This unit recovers three read contracts from the immutable website captures:
`GET /home-feed`, `GET /home-feed/new`, and `GET /home-feed/new/count`.
[original-home-feed.json](original-home-feed.json) contains usable declarative
query/response schemas, the declared keyed-host errors, the exact website
request chain, and verbatim original source fragments with SHA-256, URL,
UTF-16 code-unit and UTF-8 byte ranges. It installs no HTTP endpoint, performs
no network request, and executes no captured JavaScript.

The original backend source, database, ranking, authorization policy and live
response behavior remain unknown. These declarations do not earn native or
compatibility qualification. The first two paths already have rows in
`developer-bindings.json`; those describe the separate developer API host.
This extraction binds the website's actual caller and origin, includes the
third count path, and closes the nested DTO declarations.

## Reproduce and use

From `app/`, with the pinned dependencies already installed:

```sh
node scripts/original-contracts/home-feed.mjs --check
node --test tests/original_source.test.mjs tests/original_schema.test.mjs tests/original_home_feed.test.mjs
```

`--write` regenerates the JSON only from the reviewed manifest and inventory
hashes embedded in the producer. A changed frozen input fails closed and needs
an explicit source review and pin update. Neither command refreshes captures
or evaluates the original factories.

The bounded offline checker tests declaration acceptance, including references,
required/optional/nullable fields and recursive quote/reply DTOs:

```js
import fs from 'node:fs/promises';
import { validateDeclared } from './scripts/original-contracts/validate.mjs';
const contract = JSON.parse(await fs.readFile('contracts/original-home-feed.json'));
const query = contract.operations['GET /home-feed/new/count'].declared.query;
console.log(validateDeclared(contract.declarations, query, { since: '' }));
// { success: true, issues: [] }
```

This checker is maintained local tooling, not the captured Zod runtime. It
checks the emitted predicate language and does not produce parsed/stripped
objects, coercions, defaults, transforms, server errors or response fixtures.
`x-zod-optional` records acceptance of JavaScript `undefined`; JSON itself has
no undefined value. All other emitted assertions use the bounded standard
JSON Schema keywords. Additional object fields are accepted; no object output
stripping is reconstructed.

## Exact website chain

Both captured variants of module **735821**, in `3740fc4e7a24596d.js` and
`cf2bb278631744da.js`, export **Z**, **f** and **x** for these three requests.
The extractor retains each actual async function and its query expression,
verifies its `759257.j()` import/call, and preserves both variants rather than
choosing a global numeric-ID match.

The chain is **735821 → 759257.j → 30181.K → 402030.createContractClient →
898661**. `759257.j` gets its origin from **503630.R**, whose captured return
is `https://frontend-api-v3.pump.fun`. The registry includes
**387665.homeFeedRoutes**, and forwards `createContractClient` from **898661**.
Every edge and the serializers/hooks are bound to original source ranges.

All three consumers request `credentials: "include"`, JSON Content-Type, and
pass through the caller's abort signal. The selected transport installs
`x-pump-source: WEB` and `x-pump-platform: web` when absent. It does not install
an Authorization bearer or API key in this chain. An internal-key hook has an
uninitialized local and is inactive in the captured factory. Authentication cookie names,
contents, wallet ownership and server authentication rules are not established
by `credentials: "include"`.

| Consumer | Query behavior shown by the original function |
| --- | --- |
| `/home-feed` | Defaults pageSize 150, chain `all`, includeFollowedHolders false and viewerAddress null. Sends platform `WEB` and session/device telemetry. Falsey telemetry IDs and viewer address are omitted. An opted-in facepile uses limit 5. This caller does not forward the wider declaration's page/pageToken/bounds. |
| `/home-feed/new` | No pageSize default in this function; chain defaults to `all`. Bounds are spread after chain. Falsey pageToken is omitted. |
| `/home-feed/new/count` | Sends since as supplied, including the empty string; chain defaults to `all`. Bounds spread after since/chain can replace those keys. |

**637172.s** splits a comma-bearing chain string into `chains`; it otherwise
returns `chain`, with no trimming. **559015.A** is the literal facepile limit
5. **231824.f**, **192** and **886813** supply session/device telemetry. The
`pump_session_id` and `pump_device_id` helpers are preserved as telemetry
source, not recreated or presented as a verified authentication session.

**898661** skips undefined query values, stringifies scalar values, stringifies
array elements and joins them with commas. It rejects an array element that
contains a comma. An empty array is omitted only when the declared field
accepts undefined; otherwise it throws TypeError. The HTTP transport encodes
these strings with URLSearchParams. This client does **not** parse the whole
query, body or response through the declaration; it returns `.json()` directly.

Each consumer's non-OK `afterResponse` hook throws a plain Error naming the
status. The captured transport runs this hook before constructing HTTPError.
The generic ContractError adapter needs `error.response`, so it does not parse
that plain Error into the declared error envelope. The configured retry
predicate also rejects plain Errors. The artifact preserves the shared error
adapter, fallback schema and publicRead/keyed-error declarations separately;
it does not claim that these three hooks expose those keyed-host envelopes.

## Declaration closure and important limits

**387665** supplies all six route schemas. Its reachable response declarations
include **421504** (callout/quote/reply, including recursive getters), **540480**
(followed holders), **983689** (collectible), **959736** (asset class),
**890664** (description constants), and **617159** (open enum). `openEnum`
admits future strings; it is not a closed list. Its implementation is pinned
by factory hash and retained verbatim. **183184.defineRoutes** is an identity
wrapper. **785036.publicRead** adds visibility, scope and nine keyed-host
error codes to the first two routes; the count route lacks that wrapper.
**525364**, **233815**, **4171** and **858694** establish the selected error
data, envelope and adapter boundaries.

The schema compiler accepts only the reachable, explicitly implemented AST
forms and fails on unsupported syntax. It never invokes a captured function,
getter or validator. Primitive rules are checked against **876543 → 599565**
and **408162**, with pinned hashes and exact NumberFormat, number/int builder,
length-check and codePointLength fragments. In these captured bytes, `.int()`
enforces the safe integer range and string limits count Unicode code points.
Source evidence coordinates, separately, are UTF-16 code-unit offsets.

Descriptions remain verbatim descriptions. They do not create a cursor regex,
a `.default()`, chain/chains exclusivity, min/max ordering or a server behavior
test. In particular, the count response declares an integer `newCount` without
a nonnegative restriction; its strings have no encoded token-format rule.
The tests preserve these distinctions instead of inventing stricter checks.

The producer was first built on the maintained **4,915-variant / 6,108-origin**
index. The [bounded index comparison](original-home-feed-index-compatibility.json)
checked its selected 31 complete factory entries against the separately owned
**5,947-variant / 7,337-origin** expansion at
`7b52e2cfb780e246fe98c656122d95be769e17a3`. Every selected complete entry and
every variant set for its numeric IDs remained equal. Main has since adopted
that expansion (#679 added factory files and index entries only), so the
frozen `inventorySha256` now pins the expanded index and the producer requires
the comparison witness to name it; the artifact's operations, fragments and
factories are unchanged. The expansion is not a recovery claimed here. It
does not rely on PR657's selected 909-factory graph. The overlap review read
main `7261b795144e16d382c7b4a0522ca503fb0e2474`
and open [PR657](https://github.com/lalalune/pumpfun-source/pull/657) head
`4208c20009ea69971de7fd515c982ad61f7bfcf5`. Its API-ATTRIBUTION.json blob
`acadc8f10da2ec9c5f61a5930314b88126404ca2` contains no Home-feed rows. The
generic factory-graph implementation and existing developer ledger are
unchanged by this unit.

No captured body for these three operations or authenticated state is added.
Ranking, ordering, pagination stability, cursor generation, overlays, cache,
database and realtime delivery remain source-described or unknown until
separate authorized response/behavior evidence establishes them.
