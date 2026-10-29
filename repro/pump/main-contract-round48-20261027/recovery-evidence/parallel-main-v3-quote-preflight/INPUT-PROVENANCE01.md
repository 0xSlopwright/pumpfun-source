# Quote-preflight input qualification

The four already-executed controls preserve the captured base mint and both base accounts, including owners, executable flags, authorities, balances and supply. Their original and R47 transactions use identical full prestates, Clock values and signed instruction bytes. The authority fault changes only the instruction account reference to the existing canonical curve quote ATA. No VM was run for this provenance audit.

The valid input duplicates R47 `sell_v3_positive_sync/cases/3` exactly. It remains a qualification control and contributes no new corpus case. The balance-only, quote-authority-only and combined inputs have no signed-transaction collision against the frozen R47 corpus of 18,145 inputs, so three distinct prospective additions are recorded.

The current R47 combined input exposes the wrong error precedence. The proposed R48 candidate remains untested. The regression CLI requires all three new inputs to agree with the original; only the already-recorded quote-authority source filename difference is separately reported, without relaxing codes, keys, state, CPI, events, return data or other log content. `--all-controls` replays all four qualification controls when the root authorizes the composed candidate.
