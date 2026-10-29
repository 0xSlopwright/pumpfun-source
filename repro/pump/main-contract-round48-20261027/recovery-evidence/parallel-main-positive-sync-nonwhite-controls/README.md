# Main Pump false-whitelist sync controls

Two ordinary SellV3 controls use amount 500,000,001, retain a non-whitelisted signer and enable the main curve mode flag. Both local original/R47 transactions succeed with equal full prestates, Clock, account state, CPI, events, return data and ordered logs. Neither updates the virtual quote reserve through the guarded sync.

Both signed transactions are absent from all 18,139 prior inputs (the retained 18,111 plus eight SellV3, twelve V2 and eight V3-buy qualification inputs). The controls therefore contribute two distinct additional cases when admitted. The earlier eight SellV3 records and six-case admission proof remain immutable.

All pretrade base balances, mint supply, owners, executable flags and authorities retain the previously reviewed normal fixture values. No RPC or source changes were used.
