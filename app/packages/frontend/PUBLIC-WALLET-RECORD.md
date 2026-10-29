# Public Pump activity record

After a public wallet balance read succeeds on `/portfolio`, a separate **Read
public Pump record** button can inspect that wallet's SDK-derived Pump
`UserVolumeAccumulator` PDA. Loading balances does not request this record.
Refresh performs a new observation. Wallet navigation, a balance refresh and
unmount remove previous results and cancel pending work; a20-second local
client deadline prevents an indefinite spinner. No data is persisted.

This is independent public-chain functionality, not a recovered private API or
authenticated wallet workflow. Only the Pump program's wallet PDA is read.
AMM, other quote-specific records, full trading history and current entitlement
calculations are outside this view. A missing record stays missing, rather
than becoming zero rewards or proof of ineligibility. Signing, claims, prices,
PnL and authenticated ownership remain unavailable.

## Source and interpretation

`node scripts/wallet-program-record/contract.mjs --check` authenticates six
published SDK4.3.1 source files against the immutable npm archive and retains six
exact static method/function witnesses. The fixed-width IDL gives the106-byte
known layout, discriminator, user, canonical booleans, unsigned counters and
signed update timestamp. `research/wallet-program-record-20261029/SOURCE.json`
records the source hashes/ranges; the generated client contract derives the
actual PDA seed. No captured frontend JavaScript is evaluated, and SDK bytes
are unchanged. The existing source/UTF boundary helper from #684 is reused.

The SDK's actual `fetchUserVolumeAccumulator` reads this nullable wallet PDA.
The app uses its strict `decodeUserVolumeAccumulator`, not the nullable decoder
that swallows decode failures. Unsupported shorter layouts are rejected without
padding. Known fields in a larger account may be decoded; unknown trailing
bytes are not interpreted. Embedded user, program owner and discriminator are
checked before a result is presented. Every integer is carried as an exact
decimal string; unsafe numeric lamports metadata is unsupported and never
rounded. Optional rentEpoch is not interpreted.

Stored `totalUnclaimedTokens` is not necessarily the current incentive amount:
the SDK's `getTotalUnclaimedTokens` also fetches a separate Global accumulator
and calls `totalUnclaimedTokens` with schedule/volume/time inputs. This view
does not run that calculation. It does not aggregate the SDK's Pump/AMM stats
or substitute the SDK total-stats helper's missing-record zeros. Counter names
are shown as stored raw integers, without assuming token decimals, constructing
cross-counter totals, interpreting needsClaim as eligibility, or turning a
stored claimed counter into a verified payout history.

## Used read path and boundaries

Portfolio result → opt-in panel → credentials-omitting same-origin
GET `/api/portfolio/pump-record?address=…` → one-argument Next GET wrapper →
actual handler → existing pinned public HTTPS RPC factory → mainnet genesis
check → fixed `getAccountInfo` PDA/base64/confirmed request → metadata, size,
owner, discriminator and embedded-user guards → unchanged SDK decoder → exact
stored-field projection. The response carries slot, UTC observation time and
sanitized host, with no-store. It is separate from the balance response slots.
Browsers cannot select a method or provider; server-owned SOLANA_RPC_URL and
the existing public-DNS/HTTPS/redirect/timeout/size/JSON/identity policy apply.

The existing RPC factory body remains byte-identical, SHA256
`49c42e491310e985a652dbfdcb553a9edfdbb58c16acd3005f63e7daafa41ab1`.
Only its export and the read-only `getAccountInfo` TypeScript union member
change here. #893 already qualifies the shared export concept and documented
Node-only agent-package boundary; those are dependencies, not new recovery.
This fresh mainc3b branch does not duplicate that PR's configuration feature or
#815's holdings implementation. Integration must retain both read-only union
members and explicitly rebind #815's whole-file RPC witness while preserving
its historical proof; no previous evidence assertion is relaxed here.

## Finite validation

From app, using pinned pnpm10.24:

```sh
node scripts/wallet-program-record/contract.mjs --check
node --test tests/wallet_program_record.test.mjs
pnpm --filter @pump-reconstruction/backend exec tsx --test ../../tests/portfolio_rpc.test.ts
pnpm --filter @pump-reconstruction/frontend exec tsc --noEmit --incremental false
WALLET_RECORD_TEST_NO_RPC=1 SOLANA_RPC_URL= pnpm --filter @pump-reconstruction/frontend exec playwright test tests/wallet-program-record.spec.ts tests/portfolio.spec.ts --max-failures=1
```

Eight new focused groups and ten existing RPC groups pass, including actual
SDK decoding beyond JS integer precision, every field, signed timestamps,
missing/old/malformed records, wrong owner/user/cluster, cancellation before a
follow-on account request, strict browser identity, handler queries and a real
local HTTP client→handler→SDK-read workflow. Local HTTP/account fixtures are
synthetic, not a production oracle. Frontend TypeScript passes.

Eight new browser cases are prepared, including an actual production-reader
unconfigured-route guard, opt-in/no cookies, exact integers, missing state,
generic failure/retry, wrong-wallet rejection, stale navigation, deadline and
320/1440px containment. Six existing portfolio cases run alongside them. The
old disabled-sign-in assertion is corrected to opening/closing the recovered
chooser while remaining signed out and sending no mutations; that shared
assertion correction is credited to #774, not a new auth feature. The test-only
WALLET_RECORD_TEST_NO_RPC flag selects the unconfigured guard; no product test
branch exists. Browser/full production validation remains pending until
recorded. No original visual/API equivalence, current live-chain observation,
native developer-operation credit or completion-percentage increase is claimed.
