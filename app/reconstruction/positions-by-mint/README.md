# Original mint-position reader and quote admission

The complete captured **384886/528766** reader/normalizer factory is recovered as
a maintained callable module. Its actual **768359** portfolio query consumes the
normalizer. This is a read-client boundary, separate from the public Solana
inventory UI and opt-in materialized backend positions. It does not reconstruct
the larger React hook, holdings reconciliation, live prices or PnL calculation.

## Evidence

`contract.json` is generated from authenticated immutable captures and AST
registrations, with URLs, whole-capture hashes, complete factory hashes and exact
UTF-16/UTF-8 witnesses. Numeric IDs never substitute for physical variant context.
The selected reader is factory SHA `9c9f618b…` at UTF-16 `[5470,6802)` in
`a73dd4b5aeff6202.js`. No original bundle, factory or runtime dependency is executed.

- **528766.X** normalizes served rows. The numeric limit is the used
  **26077.N** export, literal `1e13`, rather than a newly invented price limit.
- **384886.m/E** read multiple mints/a single mint. **759257.j** → **30181.K**
  and **503630.R** bind the website origin to
  `https://frontend-api-v3.pump.fun`. Matching developer API paths do not establish
  interchangeable origins or public API-key/auth behavior.
- The actual call to **528766.X** is inside **768359**'s user-portfolio query in
  `4da5ade5abc4fe3f.js`, factory SHA `a892f6e2…`. Both available variants of that
  larger factory remain recorded. Its complete React/provider flow and route
  reachability are not claimed here.
- **646908.C** supplies the exact TON, Starknet and Near namespace predicate
  used by the key helper. **898661** supplies the scalar/array/path encoder;
  **30181** supplies the observed client options/headers and JSON decoding.

The selected factory hashes are pinned. A resealed semantic source change still
requires review instead of silently inheriting qualification. The extractor's
readable statements describe this fixed source version; it is not a generic
reverse compiler or a proof of the entire dependency closure.

## Recovered behavior

`readMany({userId,mints})` filters falsy inputs and uses a case-sensitive Set in
input order. No valid mint format, canonical identity or lowercase normalization
is invented. An empty set returns without constructing a client. Otherwise each
chunk has at most 200 mints and its own client constructor call. The operation is
`GET /user-positions/{userId}`, with `updatesLimit:0`, `timeout:8000` in the
**operation** options, and an after-response hook. All chunks start through
Promise.all and flatten in input-chunk order even if completion order differs.
Any failed chunk rejects the read; siblings are not canceled.

The hook maps status 404 to a new `{positions:[]}` JSON response without consuming
the original body. Other non-ok responses throw the captured status/statusText
message; successful responses return no replacement. Missing/null `positions`
becomes an empty array. Other malformed shapes are not silently repaired.

The quote predicate rejects only JavaScript numbers that are nonfinite or have
absolute magnitude **strictly greater than** `1e13`. Equality and negative finite
values inside the bound are admitted. Strings are not coerced or validated.
This is client admission of served quotes, not a valuation algorithm or a full
numeric response schema.

- Invalid `valueUsd` or `pnlUsd` clones the row, sets `valueUsd` and
  `tokenPriceUsd` to **undefined**, sets `pnlUsd`/`pnlPercentage` and any served
  coin market cap to null, and sets `servedQuoteRejected:true`. Cost basis,
  identities and unrelated fields are retained. No zero is fabricated.
- An invalid coin market cap alone clones that coin/row and nulls only the cap;
  row quotes/PnL remain. Admitted rows retain their original object identity.
- `readOne` returns the first case-insensitive mint match or null. The map helper
  instead keeps the last row under each lowercased nonempty mint. The lookup
  helper returns undefined for a falsy key. The chain key helper adds a prefix
  only for `ton:-239`, `starknet:SN_MAIN` and `near:mainnet`, preserving mint case.

## Use

```js
import { createMintPositionReader } from
  '../../packages/frontend/src/original-contracts/positions-by-mint/reader.mjs';
import { localMintPositionClient } from
  '../../packages/frontend/src/original-contracts/positions-by-mint/local-http.mjs';

const positions = createMintPositionReader({
  createClient: localMintPositionClient({
    baseUrl: explicitLocalBaseUrl,
    fetchImplementation: fetch,
  }),
});
const rows = await positions.readMany({ userId: publicSubject, mints });
```

Alternatively provide the actual contract-client constructor. The local adapter
is an explicitly selected **single-attempt** GET transport with scalar/array/path
encoding, observed headers, native Response hook replacement and JSON decoding.
Its URL restrictions and comma-array error are local adapter policy. It does not
enforce the 8-second option or emulate Ky retries, hook-options internals,
contract-error normalization, browser cookies, auth or default destinations.
No request occurs on import. Original timeout placement is retained in the
reader and independently tested through the client port.

## Verify

From the repository root:

```sh
node app/scripts/original-positions-by-mint.mjs --check
node --test app/tests/original_source.test.mjs app/tests/original_positions_by_mint.test.mjs
```

The 12 new cases cover threshold equality/nonfinite/negative/string inputs,
identity and copy boundaries, cleared fields, 402 unique mints across three
concurrent chunks, deterministic flattening, failure propagation, 404/403 hooks,
map/single-match distinctions, namespace keys and corruption/resealed-threshold
rejection. Real loopback HTTP adds a 201-mint two-request batch and four failure/
empty variants. Six complete HTTP responses are retained in `validation/` with
synthetic service payloads; no captured server parity is claimed. Eleven shared
source-verifier tests also run.

No production traffic, chart/price/PnL calculation, historical series, native
backend/API compatibility, indexer/RPC, wallet session, perps application,
React-hook lifecycle, UI integration, browser behavior or visual parity is
qualified. SDK/capture bytes and feature/native milestone counts remain unchanged.
