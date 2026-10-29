> Current configuration extension: [HOLDER-CONFIGURATION.md](HOLDER-CONFIGURATION.md) adds opt-in public Global/curve observations through published SDK decoders. Missing legacy fields remain unknown; no eligibility or claim behavior is established.
> Current extension: [HOLDER-PUBLIC-BALANCES.md](HOLDER-PUBLIC-BALANCES.md) adds an explicit public account read using the existing Solana RPC service. The offline derivation and unavailable reward/claim values below are preserved. No fees API, reward eligibility or authenticated behavior is established by public holdings.

# Holder Rewards offline inspector evidence

This document scopes the local `/holder-rewards` reconstruction. It supports
deterministic address inspection only. It does not establish live Holder
Rewards eligibility, balances, payouts, claims, or account existence.

## Captured factories

Ranges below are UTF-16 code-unit offsets in the decoded captured source, as
recorded by `recovered/modules.json`. Recovered factories are inspected as inert
text and are not executed or imported.

| Factory | Factory SHA-256 | Captured source and range | Classification | What it establishes |
| --- | --- | --- | --- | --- |
| `212065` | `49e3cc5d41236eefc9ddb6ae8211e3995f720aab70aaf9ac5c922684bb170c02` | `evidence/web/objects/d3822485047c1aa6.js`, `138..57181` | OBSERVED | Holder Rewards page structure, mint/PDA fields, copy controls, unavailable-value text, filters, table/cards and export fields. It does not provide authenticated user state. |
| `754296` / `118863` | `d68eb34aa90949c8c3073a1c69b968552de81aab5de34a92691d03f87fc91777` | `evidence/web/objects/d3822485047c1aa6.js`, `57196..62266` | OBSERVED | Empty, loading and failure states and shared Holder Rewards visual primitives. |
| `698550` | `f677a629c7ecafd8851e51fecf62a1657c58ca993676a2810f046a028e1a787d` | `evidence/web/objects/2b47dd0b38a1608f.js`, `163764..180401` | OBSERVED bytes / UNKNOWN reachability | A static `GET /fees/holder-rewards` schema describes `holderRewardsPda` as `['holder-rewards', mint]` under Pump and declares accrued/payout book fields. Static presence does not prove origin binding, authorization, availability or response compatibility. |
| `29306` | `cd326aab60fe47049526139f4b89fca93732b694457fa5778f98ca32a0bcbcfe` | `evidence/web/objects/13c13db9eb86191b.js`, `7739..19926` | OBSERVED | Shared navigation links to `/holder-rewards`. |
| `721426` | `84f074bca773d01c2507e778b3855c4d4ff9a64c55c6e48dcac82417eb4e960a` | `evidence/web/objects/13c13db9eb86191b.js`, `67265..92155` | OBSERVED | The captured route-name constant for `/holder-rewards`. |

The corresponding captured object SHA-256 values are
`a6ea7df7ead13441e502732c4e4fef28f1674f9469b832790a54b7ce0400acd6`
(`d382...`),
`e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d`
(`2b47...`) and
`15e7cb5caef8d58d0d263486883e7aac6e39e9e2f7e037af29887849bd0cd6c6`
(`13c1...`). Acquisition headers remain immutable in
`evidence/web/manifest.json`.

## Published SDK contract

`@pump-fun/pump-sdk` 4.3.1 is retained at
`evidence/sdk/pump-sdk-4.3.1.tgz` with SHA-256
`c8ff4e850651c81e9f488bfc6dffb4513a041bb4bca0819879dc19d9a72a4641`
and npm SHA-512 integrity recorded in `evidence/sdk/registry.json`.

Both published entry points export a `holderRewardsPda(PublicKey)` helper:

- root: `packages/sdk/src/pda.ts`, re-exported by `src/index.ts`;
- `/swap`: `packages/sdk/src/swap/pda.ts`, re-exported by
  `src/swap/index.ts`.

Both derive `PublicKey.findProgramAddressSync([Buffer.from("holder-rewards"),
mint.toBuffer()], PUMP_PROGRAM_ID)[0]`. The browser adapter deliberately uses
the narrower published `/swap` entry. Importing the root entry into a client
bundle also pulls the agent-payments SDK and is not Turbopack-browser-compatible.
The differential test loads the retained npm archive and proves that root,
`/swap`, and the local adapter return identical Base58 addresses.

This is DECLARED published behavior and verified local computation. It is not
an on-chain lookup.

## Static API leads

The following are DECLARED only as static candidates in captured application
code and `contracts/internal-operations.json`:

- `GET /fees/holder-rewards`
- `GET /coins/holder-stats/{mint}`
- `GET /fees/creator/{address}`
- `GET /fees/me`

No operation is called by this page. Their service origin, authentication,
reachability and compatibility remain UNKNOWN. They are not used as proof of
balances or eligibility.

## Local design

The checked-in implementation:

1. trims the entered text;
2. validates it with `@solana/web3.js` `PublicKey` parsing;
3. normalizes the mint with `toBase58()`;
4. derives the PDA with the published SDK `/swap` helper;
5. displays and copies both addresses locally;
6. leaves accrued, claimed and claimable amounts as `Unavailable`;
7. leaves the claim control disabled.

No data is persisted. No RPC, API call, wallet connection, signing, transaction,
analytics event or mutation is performed. The all-zero/default public key is a
valid deterministic input, but its result carries no existence or eligibility
claim.

## Trust boundary

These facts are intentionally separate:

| Fact | Local inspector status |
| --- | --- |
| Derived holder-rewards address | VERIFIED deterministic SDK computation |
| Mint exists on-chain | UNKNOWN |
| Mint is a Pump coin | UNKNOWN |
| Holder Rewards is configured/enabled | UNKNOWN |
| Holder owns tokens | UNKNOWN |
| Accrued or claimed balance | UNKNOWN |
| Claimable balance | UNKNOWN |
| Claim transaction behavior | UNAVAILABLE and unqualified |

## Validation

`tests/holder-rewards.test.mjs` compares three exact vectors—including the
default public key—against both published SDK entry points and covers whitespace,
malformed Base58, wrong lengths, empty input and repeat stability.

`packages/frontend/tests/holder-rewards.spec.ts` covers the initial, valid,
invalid, edited, reset, copy and disabled-claim states; keyboard navigation;
accessible labels/errors; the desktop/mobile shell; five viewport sizes; and an
explicit request audit that rejects external origins and non-GET/HEAD methods.

## Screenshots and visual limits

See `visual/holder-rewards-20261028/README.md`. The screenshots are local
acceptance evidence, not a claim of pixel parity with an authenticated original
Holder Rewards state. Original live balances, wallet state, responsive details
and claim flows remain visually UNKNOWN.

## Future live-data requirements

A separate contribution would need authenticated, authorized reference traffic;
an enumerated API origin and error/auth contract; sanitized fixtures; account
existence and ownership semantics; balance denomination/rounding rules; and
offline-signed claim transaction comparison before any live state or action
could be qualified.
