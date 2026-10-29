# Lane w3-createv2 (wave 3)

Target: `0x1e7c0` `pump_recovered::create_v2::execute` (original 15,576 B, 125 direct calls).
Base: origin/main 665499915 (1022 normalized / 276 raw); target 0.74106, 15,584 B, 125 calls.

## Trial log

| Trial | Mechanism | Bytes | Ratio | Calls | Official | Ledger id |
| --- | --- | ---: | ---: | ---: | --- | --- |
| base 665499915 | main | 15,584 | 0.74106 | 125 | 1022/276 | - |
| t01 | port of the unmerged createv2-reconstruction round-2 commits (control_account mint by value, vqr before the curve borrow, `creator_fee_bps>0` tested first, creator stored first) on top of the `static MAYHEM_ID` main | 15,632 | 0.75114 | 125 | 1022/276, no gains/losses | edbe0cdb7b824d5791de6665be7f0db4 |

PR #1220 was merged at its first commit, so the three later round-2 commits never reached main.
