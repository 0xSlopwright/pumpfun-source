# Account-validation order controls

255 signed original/selected-sixth comparisons, 510 independently verified signatures. 23 original successes; all 255 enter the AMM instruction. Deposit and withdraw each have 101 cases; create has 53. Owner, initialized/type, mint, authority and frozen failures are paired with disabled, zero amount and slippage failures; selected cross-account pairs test parser precedence. No behavior discrepancy was found.

All non-executable message-account pre/post snapshots, full logs, exact inner instructions and return data are compared. The only cleaner exclusions are compute-consumption lines and source coordinates in Anchor/panic messages. The recorded current sixth candidate is pinned; no source patch is proposed. This is bounded validation, not an equivalence claim for all account inputs.

`work/test-env/bin/python -B <packet>/verify.py` verifies saved evidence without executing a VM. `runtime-inputs.json` records every audited repository input; source/fixture inputs are preserved under runtime-sources. Original and dependency ELFs remain identified by captured hashes.
