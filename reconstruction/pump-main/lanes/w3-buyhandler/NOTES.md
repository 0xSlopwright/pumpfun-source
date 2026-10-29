# w3-buyhandler (wave 3)

Target: `0x13b9b8` `buy_v2::buy_handler` (original 15,480 B). Base: origin/main 66549991
(1022 normalized / 276 raw), buy_handler 0.95334 / 15,488 B.

Method: llc IR oracle. `llc -O3 -relocation-model=pic -mattr=+store-imm,+jmp-ext` on rustc's
optimized IR reproduces the built buy_handler exactly (0 differing instructions), so IR edits can be
scored against the original in ~7 s (lane-cache tool `llcor.py`, from buyv2-sibling-transplant).
Distance = masked instruction diff (call/lddw immediates and branch offsets masked).

## Results

| step | buy bytes / ratio | llc dist | official |
| --- | --- | --- | --- |
| main 66549991 | 15,488 / 0.95334 | 72 | 1022 / 276 |
| `let whitelisted=a.global.whitelist_pda==a.user.key();` bound before the fee tuple (f24ce58f) | 15,488 / 0.95597 | 67 | 1022 / 276, no gains/losses |

The binding was hillclimb's (#1207) improvement, lost when #1310 transplanted the handler. On main
it fixes the -0x408 vs -0x1d0 snapshot-slot hunk.

## Oracle findings

- Checked-add overflow block placement (orig 0x13cxxx region: add1, add2, ovf2 adjacent, ovf1 far):
  moving the trade_fees `?` Err block (IR `bb214`) to just after the second checked-add block
  (`bb218`, or after `bb217`) fixes the whole region (dist 72 -> 47 on main IR, 67 -> 42 on the
  binding IR). Any later position (after bb222/bb221/bb167/bb166) is worse (99). attempt 609d4963.
- In rustc's unoptimized IR the block order is bb215 bb214 bb218 bb217 bb222 bb221: rustc creates the
  `?` switch targets (Continue first, Break second) when it codegens the switch after trade_fees, so
  with any plain `?`/match on the trade_fees Result the Err block precedes the add chain.
