# Lane buyv2-hillclimb

Targets (programs/pump/src/buy_v2.rs):

- `0x13b9b8` `buy_v2::buy_handler`: original 15,480 B.
- `0x13f630` `buy_v2::buy_exact_quote_in_handler`: original 20,184 B.

## Step 1: seed from the prior frozen-best source (attempt 32763981e8cd40ec904be7e3db7907e9)

Main's `buy_handler` had drifted away from the prior swarm's frozen-best spelling
(the source the `buyv2-bruteforce` lane was measured on). Restoring frozen-best's
`buy_v2.rs` (local `pay_from_user*` / `move_curve_tokens` wrappers, bound
`base_token_program`/`base_mint`, `a.*` field paths in fee validation, `gross`
naming, `Ok((0,0,0,0))` whitelist arm) recovers its codegen on current main:

| target | before (main d2cb88d) | after |
| --- | --- | --- |
| 0x13b9b8 bytes | 15,424 | 15,464 (orig 15,480) |
| 0x13b9b8 ratio | 0.66526 | 0.94354 |
| 0x13f630 | 20,096 / 0.69433 | unchanged |
| official | 1019 / 188 | 1019 / 188, no gains, no losses |

Unstripped sha256: 728936d2cbfb4dc441107bc1c4f9080e7fe65695f5e4891280c38f35387a2030.

Engine (outside git): `~/.cache/pumpfun-reconstruction/lanes/buyv2-hillclimb/engine/`.

## Step 2: gene engine, exact-quote tail transplant (attempt b075029ac7144a69bc72d2b71f4c4786)

The engine (`engine/genes.py`) renders buy_v2.rs from a genome of tail idioms per handler
(wrapper vs direct transfer/payment calls, bound `system_program`/`base_*`, cashback branch
order, payment amount spelling, `uva` binding, snapshot order, TradeEvent/CompleteEvent field
order, `ix_name` conversion). The identity genome rebuilds the seed byte for byte (728936d2).

Giving `buy_exact_quote_in_handler` the frozen-best buy_handler tail:

| target | before | after |
| --- | --- | --- |
| 0x13f630 bytes (orig 20,184) | 20,096 | 20,112 |
| 0x13f630 ratio | 0.69433 | 0.92620 |
| 0x13b9b8 | 15,464 / 0.94354 | unchanged |
| official | 1019 / 188 | 1019 / 188, no gains, no losses |

Control (attempt 5ea82e879a9a413284b20f33c83db29c): buy_handler with the main-style direct
tail falls to 0.70098, so the tail spelling was the dominant residual in both handlers.
Unstripped sha256: 9316184ec66730c5b450fc95349b3ca49664d1135a3e3ed6a2155aa750608d68.

## Step 3: climb generation 1 + compose with buyv2-sibling-transplant (PR #1218)

- Gen 1 single-gene flips: buy_handler snapshot order `SNAP_A` (reserves, then creator,
  quote_mint) raises 0x13b9b8 from 0.94354 to 0.94776 at 15,464 B.
- The sibling lane restored the prior-swarm exact-quote handler (0.97341, 20,176 B). The
  engine now uses that section as its exact-quote base; its genome encoding renders a
  file whose build reproduces 0.97341. Composed build `sib-render`: eq 0.97341 / 20,176 B,
  bh 0.94776 / 15,464 B, official 1019/188, no gains, no losses,
  sha256 0aa51f4ef6081904323e2c5e6466da079c03a6b6a7a109d80243484f8fcf1e69.

## Step 4: climb plateau and the crate-boundary finding

Generations 3-5 (single-gene flips over 30+ genes incl. admit-block structure, wrappers,
operand order, field-order moves) and a 2-gene interaction sweep over every near-neutral
move found no further improvement: both handlers sit on a local optimum of the in-crate
idiom space. (Generations 1-2 had a worker-directory race; their per-variant rows are
superseded by attempt 7ea0c32af0b74e94af9acce2aecf6289. Every kept result was rebuilt alone.)

Why the prior swarm's frozen-best tree measured buy_handler 0.962 while its buy_v2.rs on
main gives 0.944: that tree linked `buy_v2::native_payments::ensure_rent_exempt` from a
separate path crate (`pump-native-payments`). Diagnostic `diag-crate` (current best +
that crate, attempts 85862372255942819ec173655f6cfa6b / b3a404842b854e6a86772955c76c3c4c):

| target | in-crate (this PR) | separate crate (diagnostic only) |
| --- | --- | --- |
| 0x13b9b8 | 0.94776 / 15,464 B | 0.96599 / 15,488 B |
| 0x13f630 | 0.97341 / 20,176 B | 0.98742 / 20,200 B |
| 0x144508 sell_v2 | 0.66202 | 0.67015 |
| official | 1019 / 188 | 1019 / 188, no losses |

Mechanism: in the original, every call `ensure_rent_exempt(0, ..)` materialises `r2 = 0`
for the unused `_size` argument and reuses that zero for a later `None` spill
(`mov64 r2, 0; stxdw [r10-0x780], r2`). Inside one crate LLVM sees `_size` is dead and
passes poison, which removes that register/spill and perturbs allocation for the rest of
both handlers. Adding a path crate changes Cargo.toml/Cargo.lock, which the swarm rules
forbid, so it is not part of this PR; it is the strongest next lever if the coordinator
allows a workspace crate. Keeping `_size` live via `minimum_balance(min(_size,0))` folds
before DeadArgElim and is byte-identical (no effect).

Remaining in-crate residuals for buy_handler: the `fmt::Error`/post-fee Result slot class
at -0x28 vs original -0x100; the whitelist `user.key()` temporary colored at -0x1e8 vs
-0x420; the second checked-add overflow block placed late; quote_mint 32-byte copy order.

## Step 5: whitelist binding (climber gen 6)

`let whitelisted=a.global.whitelist_pda==a.user.key();` before the fee tuple in
buy_handler: 0x13b9b8 0.94776 -> 0.95040 at 15,464 B. Composed with the sibling lane's
newer exact-quote TradeEvent order (shareholders after the buyback pair, 0.97361 / 20,168 B).
Standalone rebuild `best2`: official 1019 / 188, no gains, no losses,
sha256 d28a478aadf5b09f6d0afc85e00c9a8e685bb4928abcb12ee375b5d01f87bcdb.
