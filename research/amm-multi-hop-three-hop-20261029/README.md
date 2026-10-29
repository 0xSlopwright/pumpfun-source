# multi_hop_swap through three AMM hops

## Problem

Run 1 packet #32 pinned `multi_hop_swap` for one and two hops only.
Three hops were never receipted: the chained amounts, the exact
per-hop vault deltas, what the `limit` (minimum) is actually checked
against, whether the route funds the user volume accumulator, and
which error fires when the third hop — rather than the first — is
malformed. This packet pins all of that at runtime.

Route shape (remaining accounts, 5 per hop): buy processes
[hop1, hop2, hop3] where hop1 is the base/quote pool, hop2 the
second-base/base pool, and hop3 the third-base/second-base pool;
sell processes the same groups in reverse order, so the direction
of every hop must still be uniform. All three pools are copies of
the same fixture pool data with different mints, so the chain is
pure routing, not three different curves.

## Cases

17 cases x 3 images (original / #424 control / #427 candidate),
51 signed receipts, parts of 10 ([10, 10, 10, 10, 10, 1]).

Buy (quote in, third base out):
- `buy-1e9`: 10^9 quote, limit 1 — success.
- `buy-1e6`: 10^6 quote, limit 1 — success (scaling).
- `buy-1e9-limit-exact`: 10^9 quote, limit 5,315,084,721,958 — success.
- `buy-1e9-limit-plus1`: 10^9 quote, limit 5,315,084,721,959 — 6004.
- `buy-amount0`: amount 0 — 6002.
- `buy-limit0`: limit 0 — 6001.
- `buy-hop3-swap`: hop3's two mint metas swapped — 6086.
- `buy-hop3-junk`: hop3's first mint replaced by a junk key — 6084.
- `buy-remaining-10`: route truncated to two hops, so it ends at
  the second base instead of user_out's third base — 6084.
- `buy-remaining-14`: 14 remaining accounts, not a multiple of 5 — 6044.
- `buy-hop3-pool-bad-owner`: hop3's pool owned by nobody — 6027.
- `buy-unsigned`: user does not sign — 3010.

Sell (third base in, quote out):
- `sell-1e9`: 10^9 third base, limit 1 — success.
- `sell-1e6`: 10^6 third base, limit 1 — success.
- `sell-1e9-limit-exact`: 10^9 third base, limit 180,345 — success.
- `sell-1e9-limit-plus1`: 10^9 third base, limit 180,346 — 6004.
- `sell-hop3-swap`: hop3's two mint metas swapped — 6086.

## Result

Buy chain, 10^9 quote in:
- userquote −1,000,000,000; U3 (third base) +5,315,084,721,958.
- hop1: quote vault +995,392,847, base vault −5,385,694,844,757.
- hop2: quote vault +5,385,694,844,757, base vault −5,356,844,515,538.
- hop3: quote vault +5,356,844,515,538, base vault −5,315,084,721,958.
- buyback recipient +4,607,153 — the whole input-side fee
  (10^9 − 995,392,847). Buy 10^6: U3 +5,415,445,863, buyback +4,607.

Sell chain, 10^9 third base in:
- U3 −1,000,000,000; userquote +180,345 — the same final number
  as the two-hop sell, because the last hop's input is the same
  997,498,005 base.
- hop3: base vault +1,000,000,000, quote vault −997,499,001.
- hop2: base vault +997,499,001, quote vault −997,498,005.
- hop1: base vault +997,498,005, quote vault −181,191.
- buyback recipient +846: the last hop's vault pays 181,191 and
  the user nets 180,345 (181,191 = 180,345 + 846). Sell 10^6:
  userquote +180, vault −181, buyback +1.

The limit is a NET-receipt floor, checked once at the end:
- buy limit exactly 5,315,084,721,958 passes; +1 fails
  ExceededSlippage (6004).
- sell limit exactly 180,345 passes; 180,346 fails 6004 — and a
  sell limit set to the gross vault payout (181,191, or even
  181,190) also FAILS. Setting the limit to a vault delta instead
  of the user's net receipt is wrong.

Volume funding: every successful trade funds the user volume
accumulator with exactly 1,844,400 lamports (rent for 137 bytes +
128 bytes overhead, 265 x 6,960), so the payer delta is −1,849,400
(1,844,400 rent + 5,000 fee). The accumulator data is 137 bytes
with the payer key at [8:40]. On error the accumulator is NOT
funded and the payer delta is exactly −5,000.

Error sites (log lines; original vs control/candidate differ
because the deployed original binary's line map differs from the
checked-out source — control/candidate match the checkout):
- 6004 ExceededSlippage: original multi_hop_swap.rs:389,
  control/candidate :445.
- 6002 ZeroQuoteAmount: original :273, control/candidate :266.
- 6001 ZeroBaseAmount: original :274, control/candidate :267.
- 6086 MultiHopMixedDirection: original :295, control/candidate :288.
- 6084 MultiHopDiscontinuousPath: original :300, control/candidate :294.
- 6044 NotEnoughRemainingAccounts: original :278, control/candidate :269.
- 6027 AccountTypeNotSupported: original :239, control/candidate :256.
- 3010 AccountNotSigner: "caused by account: user" on all images.

All error cases roll back every account except the payer's 5,000
fee. All three images agree on every case: this packet pins
behavior, it does not claim a divergence.

## Limits

Offline LiteSVM synthetic accounts only (fixture pool data copied
across three pools, funded vaults of 10^15). No source change,
build, or whole-program equivalence claim. Log line numbers are
per-image as recorded above. Sell-side amount0/limit0 were
spot-checked on the original image only (6002 at :273, 6001 at
:274 — the pre-loop require_gt checks run before any hop, so
direction does not matter) and are not receipted here. Curve hops,
transfer-fee mints, and Token-2022 pools on a three-hop route were
not covered; the two-hop Token-2022 behavior is in run 1 #45.
