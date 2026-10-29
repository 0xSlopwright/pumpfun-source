# Multi-hop swap through five AMM hops

## Problem

Packet #18 pinned multi_hop_swap through four AMM hops (packet
#5 covered one to three hops). The handler reads remaining
accounts in groups of 5 with no hop cap
(multi_hop_swap.rs:276 splits remaining accounts with chunks_exact(5) and :278 rejects a remainder with NotEnoughRemainingAccounts; no hop cap), so a
fifth pool should chain cleanly -- but whether the fifth hop
preserves the 4-hop invariants (buyback only at the tail hop,
net-receipt limit, per-hop vault deltas) was unpinned, whether
the sell direction's final receipt survives a fifth hop was
unpinned, and whether the buy-side limit failure still returns
clean 6004 at five hops was unpinned.

## Cases

All cases multi_hop_swap on the shared v1/v2 fixture, 3 images
each. The route is tail pool (quote <-> base) -> POOL2 (base <->
BASE2) -> P3 (BASE2 <-> BASE3) -> P4 (BASE3 <-> BASE4) -> P5
(BASE4 <-> BASE5), with the user output U5 (BASE5,
payer-owned) on buys and the user input U5 on sells. Limit is
1 unless stated (accept-anything floor for buys is the base
receipt, for sells the quote receipt). The fifth pool P5 is
synthesized by copying the tail pool's layout (same reserves
shape as P4/P3/POOL2); only AMM hops are chained here, no
curve hops.

- buy-1e9 / buy-1e6: the five-hop buy anchors.
- buy-1e9-limit-exact: the buy limit rule at the fifth hop's
  output.
- buy-1e9-limit-plus1 / buy-1e6-limit-plus1: buy-side limit
  failures at five hops (see the panic pin below).
- buy-amount0, buy-limit0: the zero guards (buy direction).
- buy-hop5-swap / buy-hop5-junk / buy-remaining-20 /
  buy-remaining-24 / buy-hop5-pool-bad-owner / buy-unsigned:
  the hop5 route-shape and account errors (buy direction).
- sell-1e9 / sell-1e6: the five-hop sell anchors.
- sell-1e9-limit-exact / sell-1e9-limit-plus1 /
  sell-1e9-limit-gross: the sell limit rule, including a limit
  set to the gross vault payout.
- sell-hop5-swap / sell-hop5-junk / sell-remaining-20 /
  sell-remaining-24 / sell-hop5-pool-bad-owner: the hop5
  route-shape and account errors (sell direction).
- sell-amount0, sell-limit0: the zero guards (sell direction).

## Result

- Buy 10^9 quote lands 5,259,040,470,738 of the fifth base in
  U5 (4-hop landed 5,286,914,075,404 of the fourth base, so
  the fifth hop costs 27,873,604,666). Buy 10^6 lands
  5,415,387,061 (4-hop: 5,415,416,462). Per-hop vault deltas,
  buy 10^9: hop1 quote vault +995,392,847 and base vault
  -5,385,694,844,757; hop2 quote vault +5,385,694,844,757 and
  base vault -5,356,844,515,538; hop3 quote vault
  +5,356,844,515,538 and base vault -5,328,301,632,828; hop4
  quote vault +5,328,301,632,828 and base vault
  -5,300,061,308,171; hop5 quote vault +5,300,061,308,171 and
  base vault -5,259,040,470,738.
- The buyback recipient takes the same whole input-side fee
  as 3-hop and 4-hop: +4,607,153 on the 10^9 buy, +4,607 on
  the 10^6 buy. The fifth hop adds no buyback fee, so
  buyback accrues at the tail (main pool) hop only, not per
  hop.
- Sell 10^9 of the fifth base lands 180,345 quote in
  userquote -- IDENTICAL to the 3-hop and 4-hop sells -- and
  sell 10^6 lands 180 (identical). The extra hop's haircut
  rounds away in the tail hop: the 5-hop tail input is
  997,496,013 base vs 4-hop's 997,497,009 (996 less), yet the
  tail still pays gross 181,191, the user nets 180,345, and
  the buyback recipient takes 846 (181,191 = 180,345 + 846).
  Per-hop vault deltas, sell 10^9: hop5 base vault +10^9 and
  quote vault -997,499,001; hop4 base vault +997,499,001 and
  quote vault -997,498,005; hop3 base vault +997,498,005 and
  quote vault -997,497,009; hop2 base vault +997,497,009 and
  quote vault -997,496,013; hop1 (tail) base vault
  +997,496,013 and quote vault -181,191.
- The limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,259,040,470,738 passes; sell limit
  exactly 180,345 passes, +1 fails 6004, and a sell limit set
  to the gross vault payout 181,191 FAILS, so a limit set to
  the vault delta is wrong.
- BUY-SIDE LIMIT FAILURE PANICS AT FIVE HOPS (sharpest pin):
  buy-1e9-limit-plus1 and buy-1e6-limit-plus1 do NOT return
  clean 6004. On all 3 images they surface as
  ProgramFailedToComplete -- the SBF program panics with
  "memory allocation failed, out of memory" after all 5 hops
  ran (5 hop events remain in the logs), state rolls back,
  and the payer loses only 5,000. The original image logs
  the 6004 AnchorError (multi_hop_swap.rs:389) before
  panicking; the rebuilt images panic without logging it --
  verify.py pins this log-surface split per image. By
  contrast, 4-hop buy limit failure returned clean
  Tagged(6004) (#18), and 5-hop sell limit failure still
  returns clean Tagged(6004) here. Among the tested routes, the panic appears only on five-hop buys; routes longer than five hops were not run. The mechanism (why
  the error return exhausts the heap at five buy hops) is
  NOT determined here -- this packet records the observed
  LiteSVM behavior only and makes no on-chain claim about it.
- Every successful trade funds the user volume accumulator
  with exactly 1,844,400 lamports (payer delta -1,849,400
  with the 5,000 fee) and emits 5 events, one per hop.
  Failed limit transactions still carry 5 hop events in
  their logs (the net-receipt check runs after all hops);
  buy pool5owner carries 4, sell pool5owner 0, and all other
  failures 0 -- while state rolls back in every failure case.
- Amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop
  runs -- the guards key on the parameter positions, not the
  direction. Swapping hop5's two mints fails
  MultiHopMixedDirection (6086) in both directions. A junk
  hop5 mint, truncating the buy route to four hops, or
  dropping the hop5 group on a sell all fail
  MultiHopDiscontinuousPath (6084) -- note the 6084 site
  splits by direction: buy-side junk/trunc at
  multi_hop_swap.rs:300 (original) / :294 (rebuilds),
  sell-side at :251 / :285. Both are in the pre-execution route check: a buy's corrupted or missing tail mint is caught by the final user_out mint check, and a sell's by next_mint on the first group. 24 remaining accounts (not
  a multiple of 5) fails NotEnoughRemainingAccounts (6044)
  in both directions. A hop5 pool reassigned to the all-zero owner (Pubkey.default(), the System Program id) fails
  AccountTypeNotSupported (6027) in both directions. An
  unsigned user fails AccountNotSigner (3010). All error
  cases roll back everything except the payer's 5,000 fee,
  and the volume accumulator is NOT funded on error.
- All 3 images agree on every case's error, deltas, payer
  delta, event count, and rollback.

Error sites (log paths as emitted by each image):

- buy-1e9-limit-plus1: original Error: memory allocation failed, out of memory; control Error: memory allocation failed, out of memory; candidate Error: memory allocation failed, out of memory
- buy-1e6-limit-plus1: original Error: memory allocation failed, out of memory; control Error: memory allocation failed, out of memory; candidate Error: memory allocation failed, out of memory
- buy-amount0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:273. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- buy-limit0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:274. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- buy-hop5-swap: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:295. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.
- buy-hop5-junk: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:300. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- buy-remaining-20: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:300. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:294. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- buy-remaining-24: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:278. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.
- buy-hop5-pool-bad-owner: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:239. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.
- buy-unsigned: original AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.; control AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.; candidate AnchorError caused by account: user. Error Code: AccountNotSigner. Error Number: 3010. Error Message: The given account did not sign.
- sell-1e9-limit-plus1: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:389. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- sell-1e9-limit-gross: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:389. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:445. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- sell-hop5-swap: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:295. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:288. Error Code: MultiHopMixedDirection. Error Number: 6086. Error Message: multi-hop: every hop must trade in the same direction, all buys or all sells.
- sell-hop5-junk: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:251. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- sell-remaining-20: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:251. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:285. Error Code: MultiHopDiscontinuousPath. Error Number: 6084. Error Message: multi-hop: a hop's input mint is neither side of its pool or curve, or the route does not end in user_out_token_account's mint.
- sell-remaining-24: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:278. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:269. Error Code: NotEnoughRemainingAccounts. Error Number: 6044. Error Message: NotEnoughRemainingAccounts.
- sell-hop5-pool-bad-owner: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:239. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:256. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.
- sell-amount0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:273. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- sell-limit0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:274. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:267. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.

## Limits

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`), which
  `verify.py` now reads directly.

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The hop5 output amounts and the sell
rounding identity are exact for this fixture's pool states
and fee configuration; they are not claimed for other pool
states. The fifth pool P5 is synthesized by copying the tail
pool's layout (same reserves shape as P3/POOL2); only AMM
hops are chained here, no curve hops. The buy-side
five-hop limit panic is an observed LiteSVM behavior; its
mechanism is undetermined and no on-chain claim is made
about it.
