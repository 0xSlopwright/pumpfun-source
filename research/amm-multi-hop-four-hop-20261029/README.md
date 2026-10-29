# Multi-hop swap through four AMM hops

## Problem

Packet #5 pinned multi_hop_swap through one to three AMM hops
(run 1 #32 covered one and two hops only, never three; #5 added
the third). The handler reads remaining accounts in groups of 5
with no hop cap (multi_hop_swap.rs:273: count = remaining.len()
/ 5), so a fourth pool should chain cleanly -- but whether the
fourth hop preserves the 3-hop invariants (buyback only at the
tail hop, net-receipt limit, per-hop vault deltas) was unpinned,
and the sell direction had never been checked for whether the
extra hop changes the final receipt at all.

## Cases

All cases multi_hop_swap on the shared v1/v2 fixture, 3 images
each. The route is tail pool (quote <-> base) -> POOL2 (base <->
BASE2) -> P3 (BASE2 <-> BASE3) -> P4 (BASE3 <-> BASE4), with the
user output U4 (BASE4, payer-owned) on buys and the user input U4
on sells. Limit is 1 unless stated (accept-anything floor for
buys is the base receipt, for sells the quote receipt).

- buy-1e9 / buy-1e6: the four-hop buy anchors.
- buy-1e9-limit-exact / buy-1e9-limit-plus1: the buy limit rule
  at the fourth hop's output.
- buy-amount0, buy-limit0: the zero guards (buy direction).
- buy-hop4-swap / buy-hop4-junk / buy-remaining-15 /
  buy-remaining-19 / buy-hop4-pool-bad-owner / buy-unsigned:
  the hop4 route-shape and account errors (buy direction).
- sell-1e9 / sell-1e6: the four-hop sell anchors.
- sell-1e9-limit-exact / sell-1e9-limit-plus1 /
  sell-1e9-limit-gross: the sell limit rule, including a limit
  set to the gross vault payout.
- sell-hop4-swap / sell-hop4-junk / sell-remaining-15 /
  sell-remaining-19 / sell-hop4-pool-bad-owner: the hop4
  route-shape and account errors (sell direction).
- sell-amount0, sell-limit0: the zero guards (sell direction).

## Result

- Buy 10^9 quote lands 5,286,914,075,404 of the fourth base in
  U4 (3-hop landed 5,315,084,721,958 of the third base, so the
  fourth hop costs 28,170,646,554). Buy 10^6 lands 5,415,416,462
  (3-hop: 5,415,445,863). Per-hop vault deltas, buy 10^9: hop1
  quote vault +995,392,847 and base vault -5,385,694,844,757;
  hop2 quote vault +5,385,694,844,757 and base vault
  -5,356,844,515,538; hop3 quote vault +5,356,844,515,538 and
  base vault -5,328,301,632,828; hop4 quote vault
  +5,328,301,632,828 and base vault -5,286,914,075,404.
- The buyback recipient takes the same whole input-side fee as
  3-hop: +4,607,153 on the 10^9 buy, +4,607 on the 10^6 buy.
  The fourth hop adds no buyback fee, so buyback accrues at the
  tail (main pool) hop only, not per hop.
- Sell 10^9 of the fourth base lands 180,345 quote in userquote
  -- IDENTICAL to the 3-hop sell -- and sell 10^6 lands 180
  (identical). The extra hop's haircut rounds away in the tail
  hop: the 4-hop tail input is 997,497,009 base vs 3-hop's
  997,498,005 (996 less), yet the tail still pays gross 181,191,
  the user nets 180,345, and the buyback recipient takes 846
  (181,191 = 180,345 + 846). Per-hop vault deltas, sell 10^9:
  hop4 base vault +10^9 and quote vault -997,499,001; hop3 base
  vault +997,499,001 and quote vault -997,498,005; hop2 base
  vault +997,498,005 and quote vault -997,497,009; hop1 (tail)
  base vault +997,497,009 and quote vault -181,191.
- The limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,286,914,075,404 passes and +1 fails
  ExceededSlippage (6004); sell limit exactly 180,345 passes,
  +1 fails 6004, and a sell limit set to the gross vault payout
  181,191 FAILS, so a limit set to the vault delta is wrong.
- Every successful trade funds the user volume accumulator with
  exactly 1,844,400 lamports (payer delta -1,849,400 with the
  5,000 fee) and emits 4 events, one per hop. Failed limit
  transactions still carry 4 hop events in their logs (the
  net-receipt check runs after all hops); buy pool4owner
  carries 3, sell pool4owner 0, and all other failures 0 --
  while state rolls back in every failure case.
- Amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop runs
  -- the guards key on the parameter positions, not the
  direction. Swapping hop4's two mints fails
  MultiHopMixedDirection (6086) in both directions. A junk hop4
  mint, truncating the buy route to three hops, or dropping the
  hop4 group on a sell all fail MultiHopDiscontinuousPath
  (6084) -- note the 6084 site splits by direction: buy-side
  junk/trunc at multi_hop_swap.rs:300 (original) / :294
  (rebuilds), sell-side at :251 / :285, so the two directions
  validate the route at different points. 19 remaining accounts
  (not a multiple of 5) fails
  NotEnoughRemainingAccounts (6044) in both directions. A hop4
  pool owned by nobody fails AccountTypeNotSupported (6027) in
  both directions. An unsigned user fails AccountNotSigner
  (3010). All error cases roll back everything except the
  payer's 5,000 fee, and the volume accumulator is NOT funded
  on error -- but failed transactions still carry hop events in
  their logs where hops ran before the failure: limit failures
  carry 4 events (all hops ran, the net-receipt check is last),
  buy pool4owner carries 3 (hops 1-3 ran, hop4 validation
  fails), sell pool4owner carries 0 (hop4 runs first on sells),
  and route-shape / zero-guard / unsigned failures carry 0.
- All 3 images agree on every case.

Error sites (log paths as emitted by each image):

- buy-1e9-limit-plus1: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:389. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- buy-amount0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:273. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- buy-limit0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:274. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- buy-hop4-swap: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:295. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.
- buy-hop4-junk: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:300. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- buy-remaining-15: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:300. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- buy-remaining-19: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:278. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.
- buy-hop4-pool-bad-owner: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:239. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.
- buy-unsigned: original AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.; control AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.; candidate AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.
- sell-1e9-limit-plus1: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:389. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- sell-1e9-limit-gross: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:389. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- sell-hop4-swap: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:295. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.
- sell-hop4-junk: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:251. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- sell-remaining-15: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:251. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- sell-remaining-19: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:278. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.
- sell-hop4-pool-bad-owner: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:239. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.
- sell-amount0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:273. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- sell-limit0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:274. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The hop4 output amounts and the sell
rounding identity are exact for this fixture's pool states and
fee configuration; they are not claimed for other pool states.
The fourth pool P4 is synthesized by copying the tail pool's
layout (same reserves shape as P3/POOL2); only AMM hops are
chained here, no curve hops.
