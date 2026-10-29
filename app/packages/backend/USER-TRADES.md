# Opt-in materialized spot trade history

`GET /v1/user-trades/:id` now computes a history page from an explicitly supplied
server-owned materialization. It selects a person's declared canonical wallets
or an exact raw wallet, filters mint/chain/type, preserves separate fills sharing
one transaction signature, and joins page-specific public profiles and coin
metadata. This is independent local backend behavior, not original backend source,
a chain indexer, production data, fixture replay or qualified API compatibility.
The existing live SOL/token-account portfolio UI is unchanged.

## Source and contract

The pinned public OpenAPI 0.294.0 operation is
`get_user_trades_by_id`, `positions.read`, with declared origin
`https://api.pump.fun/v1` and bearer auth. The checked-in developer binding names
the operation's exact source range. Website origin selection remains unresolved;
no website alias or production proxy is added.

The physical capture `evidence/web/objects/2b47dd0b38a1608f.js` is 507,700 bytes,
SHA-256 `e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d`.
Its manifest URL is
`https://pump.fun/_next/static/immutable/chunks/2cr_aqnw2j4n5.js`.
The following are exact UTF-16 half-open ranges, not byte offsets:

| Factory | Range | Factory SHA-256 |
| --- | --- | --- |
| 76439, userTradesRoutes | [392697,400473) | `642430c1c84a3f311085643fd76b01a98c17055d2399aedc37e35b736f7e277b` |
| 785036, publicRead | [36328,36794) | `7608705120b4cecaeb64242df384fa1d8de743375557ff6251a868d03f0d9b5a` |
| 183184, defineRoutes | [3127,3228) | `6a7355492303729b121c0e5311fe0fcef22b6d960942fa94eb67baf0a4b6fd26` |

76439 imports the two helpers directly in this same physical capture. It binds
the route to positions.read, states default limit50 and maximum200, requires
keeping multi-fill transaction rows, names the 26-digit slotIndexId tiebreak,
and explicitly distinguishes independently unknown values from zero. The
developer spec and this capture differ on extra chain/mints/degradation lanes;
those strings are not silently implemented. No captured bundle is evaluated.
The evidence test checks full object and factory hashes, manifest URL, index
origins and the declared developer binding.

## Local data model and behavior

`UserTradesDataset` contains an explicit classification/observation stamp, users
and optional aliases, a separate canonical-wallet relation, immutable trade and
transfer facts, public trader profiles, and chain-keyed coin metadata. An operator
adapter must produce these facts. No default dataset is shipped or enabled.
`synthetic` is test data; `local-materialized` is an operator assertion, not a
provenance guarantee.

A person id/alias selects only that person's supplied canonical wallets. A raw
wallet selects only its own rows; it does not inherit the person's other wallets.
Unregistered wallets have null userId and no invented profile. Known-empty
subjects differ from unknown subjects. Conflicting aliases/wallet ownership,
dangling relations, missing registered profiles, duplicate `(chainId,slotIndexId)`
fills, malformed dates/ids, nonfinite JSON, extra private fields and unsupported
collectible/non-spot facts fail admission before serving.

The supported slice has positive safe-integer Solana/EVM chain identifiers and
ordinary token trade/transfer facts. Chain ids and wallet/mint strings are
operator-supplied exact identities, never discovered, case-folded or translated.
The `chain` lane selector remains explicitly unavailable. Groups, TON, NEAR,
Starknet, perps and collectibles are not implemented here.

- Default reads include only trades and omit `kind`. Explicit CSV `types` selects
  trades/transfers and emits kind on every returned row.
- Mint and chain filters apply before page selection. Limit defaults to50 and is
  bounded to1–200. Monetary values stay supplied JSON numbers/null; no PnL,
  price, cost basis, marks, currency conversion or transfer valuation is derived.
- Rows sort by timestamp descending, unknown timestamps last, then the full
  26-digit slotIndexId descending and chainId ascending. The final cross-chain
  tie/null policy is local design, not upstream equivalence.
- The local opaque keyset cursor identifies the last row and binds the dataset
  fingerprint and selection/projection. Equivalent user aliases and a changed
  limit work; another identity, filter or materialization is rejected. Its format,
  stale-cursor policy and error envelope are local design, not upstream cursor
  byte compatibility or authentication. A cursor is not a permission token.
- Each page joins only its distinct public profiles and `(mint,chainId)` coin
  identities. A missing coin lookup omits the enrichment entry, as factory 76439
  declares; it does not fabricate a null-filled card. Supplied exact-identity
  cards may still have nullable attributes. Same mint/slot/signature on different
  chains is not collapsed. The supplying adapter must omit hidden or unavailable
  cards; this store does not calculate a security verdict.
- Null nextCursor means exhaustion of this finite materialization, not proof of
  all production history. No background fetch, live source, stale-cache header,
  reorg/rebuild, websocket update or global completeness claim is involved.

## Run and transport boundaries

After the backend build, opt in with an operator-owned file:

```sh
TRADES_FILE=/absolute/operator-owned/trades.json node packages/backend/dist/server.js
```

The bounded startup loader accepts only a regular UTF-8 JSON file up to16MiB,
opens nonblocking so a FIFO fails the regular-file check without waiting for a
writer, validates the file, and fails closed on corruption. The server never accepts a request
path or URL for import and never writes that file. Its read-only in-memory
snapshot stays fixed until restart. Reimporting the same file preserves cursors;
a different dataset invalidates them. File production/atomic publication belongs
to the operator's adapter, not a newly invented indexer.

Programmatic callers pass `{ userTradesStore: new UserTradesStore(dataset) }` to
buildApp. Without the option, fixture/501 behavior remains unchanged. With it,
this single handler wins over a matching fixture. The existing developer API-key
shape gate still runs first; it does **not** establish key existence, checksum,
positions.read permission, revocation or rate limits. No auth guarantee is added.

Replies retain explicit classification, observed-at and unqualified compatibility
headers. Invalid/duplicate/unknown query fields return local400 INVALID_QUERY;
unknown materialized identities return local404. These envelopes and validation
precedence are local policy, not captured upstream error parity.

## Verification and limits

`user-trades.test.ts` exercises actual loopback HTTP, schema-conforming output,
file reload/restart with a carried cursor, canonical-vs-raw wallet selection,
multi-fill preservation, same-second/cross-chain ordering, trade/transfer
projection, unknown values, input/output isolation, malformed selections,
inherited auth, fixture separation and startup corruption. The tests supply
clearly synthetic facts; they exercise real selection/joins/pagination rather
than replay a response fixture.

The base revision d3faa6903757ef7ee6f1cfd10fb803bed46caf18 returned501 for the
same user-trades route over loopback HTTP. The new opt-in handler computes200
pages from supplied data. No live production mutation or external request is
used. This is one bounded working read-model slice; global native/qualified
operation and feature-milestone counts remain unchanged.
