# CreatePool / liquidity business-body audit

Read-only baseline: `4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12`. No selected source, build or runtime packet is modified here.

Original / current bodies are CreatePool `0x2ba60`:10240 /10328, deposit `0x2fb38`:7128 /7016, and withdraw `0x32750`:7200 /7064. `calls.json` binds all direct calls and corresponding matching candidate targets. Generated account parsers are outside this audit.

Deposit and withdraw retain the original reserve→rounding→quote-fee→two transfer→mint-or-burn→LP-supply update→virtual-reserve→event sequence. Their early original/current call offsets differ by eight bytes through the token CPI sequence. Existing original-backed transfer/burn, reserve, LP-store and event changes are preserved; no new semantic difference is asserted from this census. Unmatched arithmetic/fee helpers retain their prior limits.

CreatePool has a supported minimum-liquidity source-shape difference. The original stores pool fields before testing initial liquidity greater than99 at `0x2d8f0`. Failure calls the520-byte error closure at `0x2e260` (error6003, TooLittlePoolTokenLiquidity); success subtracts100 at `0x2d958` then calls mint at `0x2d990`. The current source instead uses an earlier inline `require!(liquidity >=100)` and unchecked subtraction before `set_inner`. `checked-minimum.patch` tests `checked_sub(100).ok_or_else(...)` immediately after initialization. This is a source/ordering hypothesis with explicit original evidence, not a newly observed user-visible bug: failed instructions roll back pool writes.

The apparent third original supported-mint call is a separate false-flag quote path; the other quote path passes true. It does not imply that an accepted route validates the quote twice. The present runtime canonical flag preserves that behavior.

`baseline20` contains20 freshly signed original/current cases at minimum boundaries and creator-fee conflicts:40 signatures,6 successes, zero full-log/state differences. A whole-crate baseline object exactly reproduces all10328 normalized CreatePool bytes and120 relocation/call positions. The changed object is10136 bytes and restores the520-byte error closure with every normalized instruction identical except the real source-line number290→148. This is not a whole-body match or changed-candidate runtime result. No full Cargo build or promotion is performed by this audit.
