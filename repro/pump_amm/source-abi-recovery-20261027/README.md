# PumpSwap source ABI and return handling recovery

Candidate `e995d6a8211dcd3d05c07cdcb1a7147ec4f4e2b2a81b56c268fd1a3d76a01ce1` matches **640/785 normalized original windows
(81.5%)**, including **128 raw-equal bodies**, with **799,032/1,162,040 text
bytes (68.8%)** covered. It gains two windows with no losses from the 638-window
checkpoint. **145 windows remain; whole ELF identity is false.** These are
bounded binary-recovery metrics, not a percentage of engineering completion.

The TradeV2 and MultiHop context modules now reproduce both original initializer
helpers. Their recovered module structure is supported by the compiled source
descriptors and the comparison controls; it does not prove historical source
text or formatting.

The shared protocol-recipient validator restores binary search for normal
recipient arrays and the reserved-recipient branch for Mayhem mode. It fixes
the six malformed-state differences retained by the previous checkpoint. The
fresh 45-case legacy matrix and 17-case sweep matrix pass with 124 verified
signatures. Legitimate setters enforce sorted arrays; the malformed-state
finding is not presented as a reachable exploit.

Pump curve CPI branches use the generated return wrapper at both original call
sites. Its complete 344-byte normalized body, relocation pattern and both
`lib.rs:22:1` descriptors match. The BuyEvent declaration now has the original
module filename and matching 6,088-byte normalized serialization body, while
its source line remains different. No padding or invented source coordinates
were added. Full static-data/call identity remains unproved.

Two strict offline Linux v1.44 builds produce the identical candidate and
symbols. The recipe binds **50 canonical inputs**, **51 workspace inputs** and
**169 authenticated registry inputs**, **220 in total**; **732 dependency
artifacts remain unchanged**. The original historical lock/toolchain is still
unresolved.

The inherited incentive-wrapper compiler stack warnings remain recorded against the matching original wrapper. This is not a general proof of stack safety or of the historical runtime.

The selected candidate passes all **17,462 corpus cases**, **35,074 executions**,
**35,418 signature fields**, and **17,537 identical signed-message pairs**.
All retained supplemental suites were rerun. The new return/event tests add
155 and 98 overlapping cases, and the 328-case deep-route replay confirms
42 successful original transactions, including three-hop buy and sell, without
budget exhaustion. Each packet specifies source-coordinate and compute-log
normalization. Some inherited creator tests deliberately substitute a synthetic
Pump CPI caller; these remain separate from captured-dependency evidence.

A separate [resize-order follow-up](followup/resize-order/README.md) has eight
mismatches in 160 signed cases. The captured AMM prepares/funds the pool before
recipient validation during sweeps; this checkpoint validates first. Four cases
use user-controlled zero recipients and four mutate recipient-related state.
The error ordering and prior System CPI differ. The 154-case initial corpus,
160-case expansion, and proposed unbuilt fix are preserved; this remains open.

A separate [call/data audit](followup/call-data-audit/README.md) checks 583 bounded static/call-closed windows, additional zero-size vtables, format pieces and the Base58 lookup table. Its 29 source-coordinate differences and unclassified-data limits remain explicit. This is not whole-ELF closure.

The [remaining-window partition](remaining-work.json) accounts for all 145
unmatched windows. Original code/data/call identity, provenance, exhaustive
behavior and authentic fixed-admin `create_config` success remain open.
The following dependency and typed-resize experiments are not selected here.

```sh
python -B repro/pump_amm/source-abi-recovery-20261027/verify_saved.py
```

Add `--current-source` to bind the maintained AMM sources. Result manifest:
`b88936cb961756605df5b762f332ad186811fdabaedea2a8c3d35f5df284cc8d`.
