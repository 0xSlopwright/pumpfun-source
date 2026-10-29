# Independent combined OptionalU64 + creator qualification

Artifact8e7ee199 is tested here independently without a compiler build. Fresh108 creator-rent +267 retained creator-transfer +19 CTO cases pass, with826 verified signatures. Full normalized logs, non-executable-account pre/post state, inner instructions and return values are compared; executable file/account hashes are separately bound where captured.

The264 OptionalU64 positive results from the other worker are independently recounted here with528 signatures and full normalized logs/fields. Their original results equal the sealed negative references, and all123 earlier discrepancies are corrected. The independent slice-reader model predicts every original/fixed outcome. Historical generic custom-Read semantics remain outside scope, as documented in reader-review packet359e84.

Static comparison verifies the original3064-byte CreatePool wrapper now matches all normalized instructions and relocation patterns. Creator payout bodies still differ (8128/10968 vs8232/11024); their selected actual callees, ordinary ATA instruction builder, and projected Rent/account-read/token/System-CPI trace sets match. This does not prove all branch predicates, recursive data identity or whole-program equivalence. No full17k corpus or rebuild was performed in this packet.

Run `python -B verify.py` for portable saved verification. The nested proof directories include their own producer and input seals. Reader-review359e84 and the selectedH7 source were not modified.
