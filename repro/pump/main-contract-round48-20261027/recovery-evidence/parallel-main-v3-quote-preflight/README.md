# Main-Pump V3 quote preflight

The actual quote preflight is original window 0x7f010. Window 0x98af0 is a previously recovered Global buyback setter with two source-line differences.

Source01 moves the V3 sell base-balance guard before quote validation and places the existing native buyback validation inside the shared preflight. It remains unbuilt. Full original CFG evidence and exact source hashes are retained in STAGED01.json and EVIDENCE01.json.

Four root-reviewed ordinary-account baseline controls ran against original and unchanged ordered R47. The combined low-base-balance and wrong quote-authority input returns NotEnoughTokensToSell in the original and AccountTypeNotSupported in R47. Both roll back every non-fee state change. The quote-only control has the same error/compared keys and an existing physical source-filename difference.

No source candidate or new build was run. See BASELINE-SUMMARY01.json and BASELINE01.json.gz.
