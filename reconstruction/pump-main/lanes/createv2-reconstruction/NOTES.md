# Lane createv2-reconstruction

Target: `0x1e7c0` `pump_recovered::create_v2::execute` (original 15,576 B, 125 direct calls).

## Trial log

| Trial | Mechanism | Bytes | Ratio | Calls | Official | Ledger id |
| --- | --- | ---: | ---: | ---: | --- | --- |
| main baseline (1fb76c54f) | CreateQuoteConfig enum, compact curve writes | 14,848 | 0.2467 | 126 | 1019/188 | - |
| x27port | historical `x27_current_roles` create_v2.rs + `pub(crate) global_quote` | 15,584 | 0.7411 | 125 | 1019/188, no gains/losses | c90b6cdd43604d3595ebbd93a80bc28c |
| h5 | `control_account(account, mint: Pubkey)` by value | 15,648 | 0.7470 | 125 | 1019/188, no gains/losses | bfe64755e47649d4b0a12fa803ac98f0 |
| r2-vqr-before-curve | virtual reserves computed before the bonding_curve borrow | 15,624 | 0.7497 | 125 | 1019/188 | ledger r2 |
| r3-fee-order | `creator_fee_bps.0>0 &&` tested before the quote source | 15,632 | 0.7506 | 125 | 1019/188 | ledger r3 |

## Mechanism (x27port)

Restores the 2026-10-28 `x27_current_roles` create_v2.rs (from
`b4448f7bc^:research/goal-pump-create-recovery-20261028/trials/x27_current_roles/`):
`validate_quote_mint` returning `(Pubkey, Option<(u64,u8)>, QuoteSource)`, called before the
mayhem/whitelist check; mayhem check through `pump_quote::global_quote`; every BondingCurve
field written explicitly (including zero/false fields); `validate_metadata(&str,&str,&str)` with
`MAX_*_LENGTH` consts. That revision was never merged into main, which had moved to a compact
enum version that lost 728 B and the call count. The port keeps every baseline membership.

## Mechanism (h5)

The original copies the 32-byte mint key from its local (`[r10-0x148]`) into a scratch temp right
before calling `nested_create::control_account` (orig 0x21da8..0x21de0); x27 passed `&mint_key`
directly. Taking `mint: Pubkey` by value in `control_account` (callee body is unchanged and stays
matched) reproduces that copy exactly.

## Findings so far

- Callee sequence (125 calls) and every error-site line already equal the original in x27port.
- Remaining differences are register allocation, spills and stack-slot layout; the frame below
  `0x4c0` matches, while the 16-byte result slots from `0x4e8` sit 16 B higher than the original.
- Orig computes `depth` with `jlt src_disc,3` (only the Nested variant carries it), compares
  `quote_mint` in place (no `(m,r)` tuple copy), and checks an Option flag for reserves after the
  memcmp. Every representation tried for that (Nested(u8) payload, Option<u64>, separate depth,
  depth at the store site, no tuple copy) made LLVM merge the sol/ivqr loads into an address select
  and moved the curve-store block, lowering the ratio. Ledger rows h1..h4c, va..vc.
- Nine local key-access variants in validate_quote_mint (round r1) were all neutral or worse.

## Frame analysis (llc -stop-after=prologepilog on captured IR reproduces the build frame)

- The original has an extra 16-byte frame object at [r10-0x4d8,-0x4c8) that no instruction ever
  touches. It sits between the validate-result Pubkey slice (`_84.sroa.38`, -0x4c8) and `creator1`,
  and it pushes the creator and all 32 Result<()> slots 16 B deeper than ours. One reading is that
  the original validate result kept a 48-byte SROA slice (a 16-byte Option-like field plus the
  Pubkey) whose 16-byte part goes unused after codegen.
- Return-type shapes tried for that (round r4: separate depth, Nested(u8) payload, nested pair)
  rejected: ~0.45-0.48.
